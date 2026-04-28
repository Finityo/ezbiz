// Social Diagnostics — admin-only edge function.
// Probes a URL with multiple scraper User-Agents in parallel, classifies
// the failure point (DNS, TLS, redirect, edge challenge, or app), and
// persists the result to social_diagnostics_runs.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const FETCH_TIMEOUT_MS = 10_000;
const MAX_REDIRECTS = 5;

const USER_AGENTS: Array<{ label: string; ua: string }> = [
  { label: "Facebook (legacy)", ua: "facebookexternalhit/1.1" },
  { label: "Facebook (current)", ua: "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)" },
  { label: "Facebot", ua: "Facebot/1.0" },
  { label: "Twitterbot", ua: "Twitterbot/1.0" },
  { label: "LinkedInBot", ua: "LinkedInBot/1.0 (compatible; Mozilla/5.0; Apache-HttpClient +https://www.linkedin.com)" },
  { label: "Slackbot", ua: "Slackbot-LinkExpanding 1.0 (+https://api.slack.com/robots)" },
  { label: "Discordbot", ua: "Mozilla/5.0 (compatible; Discordbot/2.0; +https://discordapp.com)" },
  { label: "WhatsApp", ua: "WhatsApp/2.0" },
  { label: "Googlebot", ua: "Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)" },
  { label: "curl", ua: "curl/8.4.0" },
  { label: "Chrome", ua: "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36" },
];

interface Hop { url: string; status: number; statusText: string; location?: string | null }

interface ProbeResult {
  label: string;
  userAgent: string;
  dnsOk: boolean;
  dnsError?: string;
  chain: Hop[];
  finalStatus?: number;
  finalUrl?: string;
  cloudflare: boolean;
  cfMitigated?: string | null;
  bodyBytes?: number;
  classification: "OK" | "DNS" | "TLS" | "Redirect loop" | "Edge challenge (Cloudflare)" | "App 4xx" | "App 5xx" | "Network error";
  durationMs: number;
  error?: string;
}

async function dnsCheck(host: string): Promise<{ ok: boolean; error?: string }> {
  try {
    // @ts-ignore Deno API
    await Deno.resolveDns(host, "A");
    return { ok: true };
  } catch (e) {
    try {
      // @ts-ignore
      await Deno.resolveDns(host, "AAAA");
      return { ok: true };
    } catch {
      return { ok: false, error: (e as Error).message };
    }
  }
}

async function probe(url: string, label: string, ua: string): Promise<ProbeResult> {
  const start = Date.now();
  const result: ProbeResult = {
    label, userAgent: ua, dnsOk: false, chain: [], cloudflare: false,
    classification: "Network error", durationMs: 0,
  };

  let parsed: URL;
  try { parsed = new URL(url); } catch {
    result.error = "Invalid URL"; result.durationMs = Date.now() - start;
    return result;
  }
  const dns = await dnsCheck(parsed.hostname);
  result.dnsOk = dns.ok;
  if (!dns.ok) {
    result.dnsError = dns.error;
    result.classification = "DNS";
    result.durationMs = Date.now() - start;
    return result;
  }

  let current = url;
  for (let i = 0; i <= MAX_REDIRECTS; i++) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
    let resp: Response;
    try {
      resp = await fetch(current, {
        method: "GET", redirect: "manual", signal: ctrl.signal,
        headers: { "User-Agent": ua, "Accept": "text/html,*/*;q=0.8" },
      });
    } catch (e) {
      clearTimeout(t);
      const msg = (e as Error).message || "";
      result.error = msg;
      result.classification = /tls|certificate|ssl/i.test(msg) ? "TLS" : "Network error";
      result.durationMs = Date.now() - start;
      return result;
    }
    clearTimeout(t);
    const loc = resp.headers.get("location");
    result.chain.push({ url: current, status: resp.status, statusText: resp.statusText, location: loc });

    const server = resp.headers.get("server") || "";
    const cfMit = resp.headers.get("cf-mitigated");
    if (/cloudflare/i.test(server)) result.cloudflare = true;
    if (cfMit) result.cfMitigated = cfMit;

    if (resp.status >= 300 && resp.status < 400 && loc) {
      try { await resp.body?.cancel(); } catch { /* ignore */ }
      current = new URL(loc, current).toString();
      continue;
    }

    // Drain (capped) for byte count
    let bytes = 0;
    try {
      const reader = resp.body?.getReader();
      if (reader) {
        while (bytes < 200_000) {
          const { done, value } = await reader.read();
          if (done) break;
          bytes += value.length;
        }
        try { await reader.cancel(); } catch { /* ignore */ }
      }
    } catch { /* ignore */ }

    result.bodyBytes = bytes;
    result.finalStatus = resp.status;
    result.finalUrl = current;
    if (resp.status >= 200 && resp.status < 300) {
      result.classification = "OK";
    } else if (resp.status === 403 && (result.cloudflare || cfMit)) {
      result.classification = "Edge challenge (Cloudflare)";
    } else if (resp.status >= 400 && resp.status < 500) {
      result.classification = "App 4xx";
    } else if (resp.status >= 500) {
      result.classification = "App 5xx";
    }
    result.durationMs = Date.now() - start;
    return result;
  }
  result.classification = "Redirect loop";
  result.durationMs = Date.now() - start;
  return result;
}

async function requireAdmin(req: Request) {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return { ok: false as const, reason: "Missing Authorization" };
  const token = authHeader.replace("Bearer ", "");
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    { global: { headers: { Authorization: authHeader } } },
  );
  const { data: userData, error: userErr } = await supabase.auth.getUser(token);
  if (userErr || !userData.user) return { ok: false as const, reason: "Invalid auth" };
  const { data: roleData } = await supabase.rpc("has_role", { _user_id: userData.user.id, _role: "admin" });
  if (!roleData) return { ok: false as const, reason: "Admin only" };
  return { ok: true as const, userId: userData.user.id, supabase };
}

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), { status: 405, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  const auth = await requireAdmin(req);
  if (!auth.ok) {
    return new Response(JSON.stringify({ error: auth.reason }), { status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  let body: { url?: string };
  try { body = await req.json(); } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }
  const url = (body.url || "").trim();
  if (!url || !/^https?:\/\//i.test(url)) {
    return new Response(JSON.stringify({ error: "Provide a valid http(s) URL" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const probes = await Promise.all(USER_AGENTS.map((u) => probe(url, u.label, u.ua)));

  // Summary
  const summary = {
    total: probes.length,
    ok: probes.filter((p) => p.classification === "OK").length,
    edgeChallenge: probes.filter((p) => p.classification === "Edge challenge (Cloudflare)").length,
    app4xx: probes.filter((p) => p.classification === "App 4xx").length,
    app5xx: probes.filter((p) => p.classification === "App 5xx").length,
    dnsFailures: probes.filter((p) => p.classification === "DNS").length,
    networkErrors: probes.filter((p) => p.classification === "Network error").length,
    redirectLoops: probes.filter((p) => p.classification === "Redirect loop").length,
  };

  const report = { url, summary, probes, ranAt: new Date().toISOString() };

  // Persist
  try {
    await auth.supabase.from("social_diagnostics_runs").insert({
      url, report, created_by: auth.userId,
    });
  } catch (e) {
    console.error("Failed to persist diagnostics run:", e);
  }

  return new Response(JSON.stringify(report), {
    status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" },
  });
});
