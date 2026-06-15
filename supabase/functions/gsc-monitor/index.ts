// GSC Monitor — daily check of sitemap status & indexing coverage.
// Compares latest Google Search Console data to last snapshot and emails
// alerts on sitemap errors/warnings or indexed-URL decreases.

import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

const SITE_URL = "https://www.ezbiz-fs.com/";
const SITE_URL_ENC = encodeURIComponent(SITE_URL);
const ALERT_EMAIL = "info@ezbiz-fs.com";
const FROM = "EZ Biz Filing <notifications@updates.ezbiz-fs.com>";

const GATEWAY = "https://connector-gateway.lovable.dev";
const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY")!;
const GSC_KEY = Deno.env.get("GOOGLE_SEARCH_CONSOLE_API_KEY")!;
const RESEND_KEY = Deno.env.get("RESEND_API_KEY")!;

const SUPABASE_URL = Deno.env.get("SUPABASE_URL")!;
const SERVICE_ROLE = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

interface SitemapContent { type: string; submitted?: string; indexed?: string; }
interface SitemapEntry {
  path: string;
  lastSubmitted?: string;
  isPending?: boolean;
  isSitemapsIndex?: boolean;
  lastDownloaded?: string;
  warnings?: string;
  errors?: string;
  contents?: SitemapContent[];
}

async function gscFetch(path: string): Promise<any> {
  const res = await fetch(`${GATEWAY}/google_search_console${path}`, {
    headers: {
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": GSC_KEY,
    },
  });
  if (!res.ok) throw new Error(`GSC ${path} ${res.status}: ${await res.text()}`);
  return res.json();
}

function sumIndexed(entries: SitemapEntry[]): { submitted: number; indexed: number } {
  let submitted = 0, indexed = 0;
  for (const e of entries) {
    for (const c of e.contents ?? []) {
      submitted += Number(c.submitted ?? 0);
      indexed += Number(c.indexed ?? 0);
    }
  }
  return { submitted, indexed };
}

async function sendAlert(subject: string, html: string) {
  const res = await fetch(`${GATEWAY}/resend/emails`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${LOVABLE_API_KEY}`,
      "X-Connection-Api-Key": RESEND_KEY,
    },
    body: JSON.stringify({ from: FROM, to: [ALERT_EMAIL], subject, html }),
  });
  if (!res.ok) console.error("Resend failed:", res.status, await res.text());
}

function renderAlert(issues: string[], current: any, previous: any): string {
  const list = issues.map((i) => `<li style="margin:6px 0">${i}</li>`).join("");
  return `
  <div style="font-family:Inter,Arial,sans-serif;max-width:600px;margin:auto;padding:24px;background:#FAF9F6;color:#1c2333">
    <h2 style="color:hsl(220,25%,18%);margin-top:0">⚠️ Search Console Alert</h2>
    <p>Issues detected for <strong>${SITE_URL}</strong>:</p>
    <ul style="background:#fff;border-left:4px solid hsl(45,95%,55%);padding:14px 14px 14px 30px;border-radius:4px">${list}</ul>
    <h3 style="margin-top:24px">Current snapshot</h3>
    <pre style="background:#fff;padding:12px;border-radius:4px;overflow:auto;font-size:12px">${JSON.stringify(current, null, 2)}</pre>
    <h3>Previous snapshot</h3>
    <pre style="background:#fff;padding:12px;border-radius:4px;overflow:auto;font-size:12px">${JSON.stringify(previous, null, 2)}</pre>
    <p style="margin-top:24px"><a href="https://search.google.com/search-console?resource_id=${SITE_URL_ENC}" style="background:hsl(220,25%,18%);color:hsl(45,95%,55%);padding:10px 18px;border-radius:6px;text-decoration:none;font-weight:600">Open Search Console</a></p>
  </div>`;
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  const supabase = createClient(SUPABASE_URL, SERVICE_ROLE);
  const issues: string[] = [];

  try {
    // 1. Pull all sitemaps for the site
    const listRes = await gscFetch(`/webmasters/v3/sites/${SITE_URL_ENC}/sitemaps`);
    const sitemaps: SitemapEntry[] = listRes.sitemap ?? [];

    if (sitemaps.length === 0) {
      issues.push("No sitemaps registered in Search Console.");
    }

    const totals = sumIndexed(sitemaps);
    const errorCount = sitemaps.reduce((n, s) => n + Number(s.errors ?? 0), 0);
    const warningCount = sitemaps.reduce((n, s) => n + Number(s.warnings ?? 0), 0);

    const snapshot = {
      checked_at: new Date().toISOString(),
      sitemap_count: sitemaps.length,
      submitted_urls: totals.submitted,
      indexed_urls: totals.indexed,
      errors: errorCount,
      warnings: warningCount,
      sitemaps,
    };

    // 2. Load previous snapshot
    const { data: prev } = await supabase
      .from("gsc_monitoring_snapshots")
      .select("*")
      .order("checked_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    // 3. Detect issues
    if (errorCount > 0) issues.push(`Sitemap errors: <strong>${errorCount}</strong>`);
    if (prev && warningCount > Number(prev.warnings ?? 0)) {
      issues.push(`Sitemap warnings increased: ${prev.warnings} → <strong>${warningCount}</strong>`);
    }
    for (const s of sitemaps) {
      if (s.isPending) issues.push(`Sitemap still pending: ${s.path}`);
    }
    if (prev && totals.indexed > 0 && totals.indexed < Number(prev.indexed_urls ?? 0)) {
      const drop = Number(prev.indexed_urls) - totals.indexed;
      issues.push(`Indexed URLs dropped by <strong>${drop}</strong> (${prev.indexed_urls} → ${totals.indexed})`);
    }
    if (prev && totals.submitted < Number(prev.submitted_urls ?? 0)) {
      const drop = Number(prev.submitted_urls) - totals.submitted;
      issues.push(`Submitted URLs dropped by ${drop} (${prev.submitted_urls} → ${totals.submitted})`);
    }

    // 4. Save snapshot
    await supabase.from("gsc_monitoring_snapshots").insert({
      checked_at: snapshot.checked_at,
      sitemap_count: snapshot.sitemap_count,
      submitted_urls: snapshot.submitted_urls,
      indexed_urls: snapshot.indexed_urls,
      errors: snapshot.errors,
      warnings: snapshot.warnings,
      issues_detected: issues.length,
      raw: snapshot,
    });

    // 5. Email if issues
    if (issues.length > 0) {
      await sendAlert(
        `[EZ Biz GSC] ${issues.length} issue${issues.length > 1 ? "s" : ""} detected`,
        renderAlert(issues, snapshot, prev ?? {}),
      );
    }

    return new Response(
      JSON.stringify({ ok: true, issues, snapshot }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("gsc-monitor failed:", err);
    // Send failure alert too
    await sendAlert(
      "[EZ Biz GSC] Monitor failed to run",
      `<p>The GSC monitor edge function threw an error:</p><pre>${String((err as Error).message)}</pre>`,
    ).catch(() => {});
    return new Response(JSON.stringify({ ok: false, error: String((err as Error).message) }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
