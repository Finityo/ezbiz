// Social Preview Tester — admin-only edge function.
// Fetches a URL with a configurable User-Agent, follows redirects manually,
// and returns the redirect chain, headers, OG meta, and a truncated HTML body.
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const MAX_REDIRECTS = 5;
const FETCH_TIMEOUT_MS = 10_000;
const MAX_BODY_BYTES = 1_000_000;

const META_TAGS = [
  "og:title", "og:description", "og:image", "og:url", "og:type", "og:site_name",
  "og:image:width", "og:image:height", "og:image:alt",
  "twitter:card", "twitter:title", "twitter:description", "twitter:image",
];

interface Hop {
  url: string;
  status: number;
  statusText: string;
  location?: string | null;
}

function isPrivateHost(host: string): boolean {
  // Block obvious SSRF targets.
  const h = host.toLowerCase();
  if (h === "localhost" || h.endsWith(".local")) return true;
  if (/^127\./.test(h)) return true;
  if (/^10\./.test(h)) return true;
  if (/^192\.168\./.test(h)) return true;
  if (/^169\.254\./.test(h)) return true;
  if (/^172\.(1[6-9]|2\d|3[01])\./.test(h)) return true;
  if (h === "0.0.0.0" || h === "::1") return true;
  return false;
}

function pickHeaders(h: Headers): Record<string, string> {
  const out: Record<string, string> = {};
  h.forEach((v, k) => { out[k] = v; });
  return out;
}

function parseMeta(html: string): Record<string, string> {
  const result: Record<string, string> = {};
  // <title>
  const t = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  if (t) result["title"] = t[1].trim().slice(0, 500);
  // canonical
  const canon = html.match(/<link[^>]+rel=["']canonical["'][^>]*>/i);
  if (canon) {
    const href = canon[0].match(/href=["']([^"']+)["']/i);
    if (href) result["canonical"] = href[1];
  }
  // meta description
  const desc = html.match(/<meta[^>]+name=["']description["'][^>]*>/i);
  if (desc) {
    const c = desc[0].match(/content=["']([^"']+)["']/i);
    if (c) result["description"] = c[1];
  }
  // og:* and twitter:*
  const metaRe = /<meta\b[^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = metaRe.exec(html)) !== null) {
    const tag = m[0];
    const propMatch = tag.match(/(?:property|name)=["']([^"']+)["']/i);
    const contentMatch = tag.match(/content=["']([^"']*)["']/i);
    if (!propMatch || !contentMatch) continue;
    const prop = propMatch[1].toLowerCase();
    if (META_TAGS.includes(prop)) {
      result[prop] = contentMatch[1];
    }
  }
  return result;
}

async function fetchWithRedirects(
  startUrl: string,
  userAgent: string,
): Promise<{ chain: Hop[]; finalResponse: Response | null; error?: string }> {
  const chain: Hop[] = [];
  let current = startUrl;
  for (let i = 0; i <= MAX_REDIRECTS; i++) {
    let parsed: URL;
    try { parsed = new URL(current); } catch { return { chain, finalResponse: null, error: "Invalid URL" }; }
    if (parsed.protocol !== "https:" && parsed.protocol !== "http:") {
      return { chain, finalResponse: null, error: "Only http/https supported" };
    }
    if (isPrivateHost(parsed.hostname)) {
      return { chain, finalResponse: null, error: "Refusing to fetch private/internal host" };
    }

    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), FETCH_TIMEOUT_MS);
    let resp: Response;
    try {
      resp = await fetch(current, {
        method: "GET",
        redirect: "manual",
        signal: ctrl.signal,
        headers: {
          "User-Agent": userAgent,
          "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8",
          "Accept-Language": "en-US,en;q=0.9",
        },
      });
    } catch (e) {
      clearTimeout(t);
      return { chain, finalResponse: null, error: `Fetch failed: ${(e as Error).message}` };
    }
    clearTimeout(t);

    const loc = resp.headers.get("location");
    chain.push({ url: current, status: resp.status, statusText: resp.statusText, location: loc });

    if (resp.status >= 300 && resp.status < 400 && loc) {
      // consume body to free resources
      try { await resp.body?.cancel(); } catch { /* ignore */ }
      current = new URL(loc, current).toString();
      continue;
    }
    return { chain, finalResponse: resp };
  }
  return { chain, finalResponse: null, error: "Too many redirects" };
}

async function readBody(resp: Response): Promise<string> {
  const reader = resp.body?.getReader();
  if (!reader) return "";
  const chunks: Uint8Array[] = [];
  let total = 0;
  while (total < MAX_BODY_BYTES) {
    const { done, value } = await reader.read();
    if (done) break;
    chunks.push(value);
    total += value.length;
  }
  try { await reader.cancel(); } catch { /* ignore */ }
  const merged = new Uint8Array(total);
  let offset = 0;
  for (const c of chunks) { merged.set(c, offset); offset += c.length; }
  return new TextDecoder().decode(merged);
}

async function requireAdmin(req: Request): Promise<{ ok: boolean; reason?: string; userId?: string }> {
  const authHeader = req.headers.get("Authorization");
  if (!authHeader) return { ok: false, reason: "Missing Authorization" };
  const token = authHeader.replace("Bearer ", "");
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? "",
    { global: { headers: { Authorization: authHeader } } },
  );
  const { data: userData, error: userErr } = await supabase.auth.getUser(token);
  if (userErr || !userData.user) return { ok: false, reason: "Invalid auth" };
  const { data: roleData } = await supabase.rpc("has_role", { _user_id: userData.user.id, _role: "admin" });
  if (!roleData) return { ok: false, reason: "Admin only" };
  return { ok: true, userId: userData.user.id };
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

  let body: { url?: string; userAgent?: string };
  try { body = await req.json(); } catch {
    return new Response(JSON.stringify({ error: "Invalid JSON" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const url = (body.url || "").trim();
  const userAgent = (body.userAgent || "facebookexternalhit/1.1").trim().slice(0, 200);
  if (!url || !/^https?:\/\//i.test(url)) {
    return new Response(JSON.stringify({ error: "Provide a valid http(s) URL" }), { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const { chain, finalResponse, error } = await fetchWithRedirects(url, userAgent);
  if (error || !finalResponse) {
    return new Response(JSON.stringify({ chain, error: error || "No response" }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
  }

  const headers = pickHeaders(finalResponse.headers);
  const html = await readBody(finalResponse);
  const meta = parseMeta(html);

  return new Response(JSON.stringify({
    chain,
    finalUrl: chain[chain.length - 1]?.url,
    finalStatus: finalResponse.status,
    finalStatusText: finalResponse.statusText,
    headers,
    meta,
    htmlPreview: html.slice(0, 50_000),
    htmlBytes: html.length,
    userAgent,
  }), { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } });
});
