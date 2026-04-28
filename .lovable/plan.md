## Current State (verified just now via live curl)

| Check | Result |
|---|---|
| `curl -A facebookexternalhit https://ezbiz-fs.com/` | **302 → www** (NOT 403 anymore) |
| `curl -A facebookexternalhit https://www.ezbiz-fs.com/` | **200 OK** ✅ |
| `https://www.ezbiz-fs.com/og-image.png` | **200 OK**, 670KB PNG ✅ |
| `https://www.ezbiz-fs.com/og-preview.png` | **404** ❌ (filename you spec'd doesn't exist) |
| `robots.txt` | Already allows `facebookexternalhit` + `Facebot` ✅ |
| OG tags in `index.html` | Already complete (title/desc/image/url/type + twitter card) ✅ |
| Cloudflare WAF | Not blocking — apex returns 302, not 403 |

**The 403 you saw in Meta Sharing Debugger is almost certainly a cached result from before the previous turn's fixes deployed.** The site is now serving 200 to Facebook's UA on both apex (via redirect) and www.

## What's actually missing

Only one real gap: the file path you specified (`/og-preview.png`) doesn't exist. We have `/og-image.png` instead. Two options — I recommend Option A:

### Option A (recommended): Add `og-preview.png` as a copy
- Copy `public/og-image.png` → `public/og-preview.png` (same 1200×630 asset, both URLs work)
- No meta tag changes needed — existing `og-image.png` references stay valid
- New `og-preview.png` URL also works for any external references that use it

### Option B: Rename and update all references
- Rename file + update `index.html`, `SEOHead.tsx`, `site.ts` defaults
- Higher regression risk, no functional benefit

## Plan (Option A)

1. **Add `public/og-preview.png`** — duplicate of existing `og-image.png` (1200×630 PNG, already QA'd)
2. **Verify `robots.txt`** — already correct, no change
3. **Verify OG tags** — already correct in `index.html`, no change
4. **Keep canonical as `www.ezbiz-fs.com`** — apex 302→www is FB-scraper-safe (Meta follows redirects); flipping canonical to apex would re-introduce the redirect-hop issue we just fixed last turn
5. **Post-deploy verification steps for you:**
   - Visit Meta Sharing Debugger → enter `https://www.ezbiz-fs.com/` → click **"Scrape Again" twice** (first scrape clears cache, second shows fresh result)
   - Also try `https://ezbiz-fs.com/` — should show "redirected to www" notice but still preview correctly
   - Use the in-app `/admin/social-preview` tester (built last turn) to confirm 200 responses across all 11 scraper UAs

## Files changed
- `public/og-preview.png` (new, copied from og-image.png)

## Why not change canonical to apex
Your task spec uses `https://ezbiz-fs.com/` in OG tags, but the entire previous-turn refactor canonicalized everything to `www` precisely to eliminate the redirect hop that Cloudflare's bot challenge sometimes intercepts. Reverting OG URLs to apex would undo that hardening. Cloudflare's 302 on apex is clean (verified above), so keeping `www` canonical is the safer call.