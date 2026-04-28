# Domain Canonicalization + Facebook Scraper Diagnostics Plan

Goal: Eliminate every apex/legacy domain reference, give you live in-app tooling to see exactly what Facebook sees, ship a proper 1200x630 OG image, and refresh the sitemap so social crawlers always land on the canonical `https://www.ezbiz-fs.com` URLs.

Note: Items 2 and 3 in your message are duplicates ("Social Preview Tester"). I'm treating them as one feature. If you actually wanted a second, distinct tool there, tell me what and I'll add it.

---

## 1. Code cleanup — force `https://www.ezbiz-fs.com` everywhere

Files to update:

- `src/components/ServiceJsonLd.tsx` — change `https://ezbiz-fs.com` → `https://www.ezbiz-fs.com` for `url` and `provider.url`.
- `supabase/functions/send-order-email/index.ts` — replace `https://ezbiz-fs.com/dashboard` (and any other apex links in the email HTML) with `https://www.ezbiz-fs.com/...`.
- `supabase/functions/create-checkout/index.ts` — fallback `origin` becomes `https://www.ezbiz-fs.com` (origin header still wins for non-prod environments).
- `supabase/functions/corpnet-webhook/index.ts` — remove the stale `https://ezbiz.lovable.app` entry from `ALLOWED_ORIGINS`. Default-allow-origin already `https://www.ezbiz-fs.com` (good).
- `src/lib/pdf-utils.ts` and `src/lib/pdf-generators/llc-guide.ts` — display strings change `ezbiz-fs.com` → `www.ezbiz-fs.com` for consistency in printed PDFs.
- `scripts/robots.config.mjs` — `prod` already correct; no change.

New centralized constant (so this never drifts again):

- `src/lib/site.ts` exports `SITE_URL = "https://www.ezbiz-fs.com"` and `siteUrl(path)`. Refactor `SEOHead.tsx`, `ServiceJsonLd.tsx`, and any future need to import from there.

Acceptance: `rg "https://ezbiz-fs\.com|ezbiz\.lovable\.app"` returns zero hits in `src/` and `supabase/functions/`.

---

## 2/3. In-app "Social Preview Tester" (admin-only)

New page at `/admin/social-preview` (gated by existing `useAdminAuth`).

UI:
- Input for URL (defaults to current site).
- User-Agent dropdown: `facebookexternalhit/1.1`, `Twitterbot/1.0`, `LinkedInBot/1.0`, `Slackbot-LinkExpanding 1.0`, `Googlebot/2.1`, plus a custom field.
- Submit → calls a new edge function `social-preview-fetch` and renders:
  - Final URL after redirects, redirect chain (status + Location at each hop)
  - Final HTTP status, status text
  - Response headers (server, cf-ray, set-cookie, content-type, x-robots-tag, etc.)
  - Detected meta tags: `og:title`, `og:description`, `og:image`, `og:url`, `twitter:card`, `canonical`
  - Inline preview card mimicking Facebook's layout
  - Raw HTML (collapsible, truncated to ~50 KB)

Backend: `supabase/functions/social-preview-fetch/index.ts`
- Validates input with Zod (`url` https-only, `userAgent` optional string ≤200 chars).
- Manually follows up to 5 redirects (`fetch` with `redirect: "manual"`) so we can capture the chain.
- Parses HTML with a tiny regex/`DOMParser`-equivalent (deno-dom) to pull meta tags.
- Returns JSON: `{ chain, finalStatus, headers, meta, html }`.
- `verify_jwt` stays default; admin gating happens client-side + server checks the caller's JWT and `has_role(uid,'admin')` before responding (so it can't be abused as an open proxy).

Add link in `AdminDashboard.tsx` sidebar/nav: "Social Preview Tester".

---

## 4. Generate a real 1200x630 OG image

Approach: pre-rendered static asset (no runtime cost, scrapers love it).

- Add a Node script `scripts/generate-og-image.mjs` using `@vercel/og` or `satori` + `sharp` to render a 1200x630 PNG from a JSX template (logo, brand gradient navy→gold, "EZ BIZ FILE SERVICE", tagline, phone). Run once, commit output to `public/og-image.png`.
- Update `index.html` `og:image` and `twitter:image` to `https://www.ezbiz-fs.com/og-image.png` plus `og:image:width=1200`, `og:image:height=630`, `og:image:type=image/png`, `og:image:alt`.
- Update `SEOHead.tsx` `DEFAULT_IMAGE` to the same.
- Keep the old GCS image as a fallback secondary `og:image` (Facebook accepts multiple).

Acceptance: `curl -A facebookexternalhit https://www.ezbiz-fs.com/og-image.png` returns 200 PNG, exactly 1200x630.

---

## 5. Automated scraper diagnostics report

New edge function `social-diagnostics` + admin UI tab "Diagnostics" on the same `/admin/social-preview` page.

- Runs the fetch above with a battery of User-Agents in parallel: facebookexternalhit (both 1.1 and the newer one), Twitterbot, LinkedInBot, Slackbot, Discordbot, WhatsApp, Googlebot, plain `curl/8`, and a real Chrome UA.
- For each: records DNS resolution success (via `Deno.resolveDns`), TCP/TLS reachability, redirect chain, every status code, presence of Cloudflare challenge markers (`cf-mitigated`, `cf-chl-bypass`, `__cf_bm`, 403 with `server: cloudflare`), and final body length.
- Classifies the failure point: `DNS` | `TLS` | `Redirect loop` | `Edge challenge (Cloudflare)` | `App 4xx/5xx` | `OK`.
- Returns a single structured report; UI shows a color-coded table and a "Copy as Markdown" button so you can paste into a Lovable support ticket.
- Persists each run to a new table `social_diagnostics_runs` (admin-only RLS) so we have history.

Migration:
```sql
create table public.social_diagnostics_runs (
  id uuid primary key default gen_random_uuid(),
  url text not null,
  report jsonb not null,
  created_by uuid references auth.users(id),
  created_at timestamptz default now()
);
alter table public.social_diagnostics_runs enable row level security;
create policy "admins read" on public.social_diagnostics_runs
  for select to authenticated using (public.has_role(auth.uid(),'admin'));
create policy "admins insert" on public.social_diagnostics_runs
  for insert to authenticated with check (public.has_role(auth.uid(),'admin'));
```

---

## 6. Sitemap regeneration + sitemap index

- Rewrite `public/sitemap.xml` so every `<loc>` uses `https://www.ezbiz-fs.com` (already true) AND bump every `<lastmod>` to today's date (`2026-04-28`) so Facebook/Google retry.
- Add missing routes I found in `App.tsx` that aren't in the sitemap: `/blog`, `/entrepreneurs` (already there), `/start-order` (intentionally skip — transactional). Audit pass to confirm coverage.
- New `public/sitemap-index.xml` referencing `sitemap.xml` (room to split later by section). Update `public/robots.txt` (via `scripts/robots.config.mjs`) to point `Sitemap:` at the index.
- Add a `scripts/generate-sitemap.mjs` that walks `App.tsx` routes and writes both files, so it stays in sync. Run it once now and commit the output.

Acceptance: `curl https://www.ezbiz-fs.com/sitemap-index.xml` → 200 XML; FB sharing debugger shows the canonical www URL with no redirect hops.

---

## Why this fixes the Facebook 403 (or proves it isn't us)

Right now the live site returns the correct OG tags to a Facebook UA, but Facebook still 403s. The diagnostics tool above will pinpoint whether the 403 happens at:

1. **DNS** (IONOS misroute) — unlikely, you confirmed records.
2. **Cloudflare edge challenge** at Lovable's hosting layer — most likely; the report will show `server: cloudflare` + 403 + `cf-mitigated: challenge`. That's a screenshot you can hand to Lovable Support to allowlist Facebook's UA.
3. **App 5xx** — the diagnostics will surface a stack trace path.

Combined with the canonical-URL cleanup (no apex→www 301 hop) and a proper 1200x630 image, the Facebook debugger should re-validate cleanly the moment Cloudflare stops challenging the bot.

---

## Technical details (for the dev pass)

- All new edge functions: Deno + Zod validation, generic 500 errors to client, structured logs server-side, admin JWT check via `supabase.auth.getUser` + `has_role`.
- No client-side admin trust — server validates every diagnostics call.
- `social-preview-fetch` adds a 10s timeout per fetch, max body 1 MB, blocks private IP ranges (SSRF guard).
- New page lazy-loaded in `App.tsx` to keep main bundle small.
- Memory updates: add a `mem://features/social-preview-tester` note pointing at admin-only diagnostics tooling.

After approval I'll execute steps 1→6 in order, deploy edge functions, run `social-diagnostics` against `https://www.ezbiz-fs.com/`, and report back with the actual classification of where the 403 originates.
