# Canonical UTM Links — EZ Biz File Service

**Source of truth.** Every external link to https://www.ezbiz-fs.com pasted into Facebook,
Google Business Profile, Bizipedia, Resend campaigns, QR codes, podcast read-outs, or
partner sites MUST use one of the URLs in this document — or be generated through
`buildUtmUrl()` in `src/lib/utm.ts`.

The goal: zero `direct / (none)` traffic in GA4 except actual type-the-URL visitors.

## Naming rules

- All values lowercased, dash-separated. No spaces, no punctuation.
- `utm_source` = where the click came from (a domain, channel, or named partner).
- `utm_medium` = the kind of channel: `social`, `paid-social`, `cpc`, `email`,
  `referral`, `listing`, `qr`, `sms`, `podcast`, `video`.
- `utm_campaign` = a meaningful campaign name with year/quarter when applicable,
  e.g. `veteran-launch-2026q3`, `evergreen-pricing`, `gbp-profile`.
- `utm_content` (optional) = creative/placement variant for A/B testing.
- `utm_term` (optional, `cpc` only) = the keyword.
- NEVER put emails, names, session ids, or any PII in UTM params.

## Approved canonical links

| Channel | Destination | URL |
|---|---|---|
| Facebook page bio | `/` | https://www.ezbiz-fs.com/?utm_source=facebook&utm_medium=social&utm_campaign=fb-profile |
| Facebook organic post — pricing | `/pricing` | https://www.ezbiz-fs.com/pricing?utm_source=facebook&utm_medium=social&utm_campaign=evergreen-pricing |
| Facebook organic post — veteran | `/veteran-llc-texas` | https://www.ezbiz-fs.com/veteran-llc-texas?utm_source=facebook&utm_medium=social&utm_campaign=veteran-launch-2026q3 |
| Facebook paid — veteran lead | `/veteran-llc-texas` | https://www.ezbiz-fs.com/veteran-llc-texas?utm_source=facebook&utm_medium=paid-social&utm_campaign=veteran-launch-2026q3&utm_content=hero-vet-v1 |
| Instagram bio | `/` | https://www.ezbiz-fs.com/?utm_source=instagram&utm_medium=social&utm_campaign=ig-profile |
| LinkedIn company page | `/` | https://www.ezbiz-fs.com/?utm_source=linkedin&utm_medium=social&utm_campaign=li-profile |
| X (Twitter) profile | `/` | https://www.ezbiz-fs.com/?utm_source=x&utm_medium=social&utm_campaign=x-profile |
| Google Business Profile — website | `/` | https://www.ezbiz-fs.com/?utm_source=google-business&utm_medium=listing&utm_campaign=gbp-profile |
| Google Business Profile — appointment | `/order-flow?mode=guided&package=deluxe` | https://www.ezbiz-fs.com/order-flow?mode=guided&package=deluxe&utm_source=google-business&utm_medium=listing&utm_campaign=gbp-cta-deluxe |
| Bing Places | `/` | https://www.ezbiz-fs.com/?utm_source=bing-places&utm_medium=listing&utm_campaign=bing-profile |
| Yelp | `/` | https://www.ezbiz-fs.com/?utm_source=yelp&utm_medium=listing&utm_campaign=yelp-profile |
| Bizipedia listing | `/` | https://www.ezbiz-fs.com/?utm_source=bizipedia&utm_medium=referral&utm_campaign=bizipedia-profile |
| CorpNet partner referral | `/pricing` | https://www.ezbiz-fs.com/pricing?utm_source=corpnet&utm_medium=referral&utm_campaign=corpnet-partner |
| Resend newsletter — welcome | `/pricing` | https://www.ezbiz-fs.com/pricing?utm_source=newsletter&utm_medium=email&utm_campaign=welcome-series&utm_content=cta-pricing |
| Resend transactional — order confirmation | `/dashboard` | https://www.ezbiz-fs.com/dashboard?utm_source=transactional&utm_medium=email&utm_campaign=order-confirmation |
| QR — printed flyer (veteran) | `/veteran-llc-texas` | https://www.ezbiz-fs.com/veteran-llc-texas?utm_source=qr-flyer&utm_medium=qr&utm_campaign=veteran-flyer-2026q3 |
| QR — business card | `/` | https://www.ezbiz-fs.com/?utm_source=qr-card&utm_medium=qr&utm_campaign=biz-card-2026 |
| Podcast read | `/pricing` | https://www.ezbiz-fs.com/pricing?utm_source=podcast&utm_medium=podcast&utm_campaign=podcast-2026q3 |

## How to generate new links

In code:

```ts
import { buildUtmUrl, CHANNEL_PRESETS } from "@/lib/utm";

buildUtmUrl("/pricing", CHANNEL_PRESETS.facebookOrganic("evergreen-pricing"));
// → https://www.ezbiz-fs.com/pricing?utm_source=facebook&utm_medium=social&utm_campaign=evergreen-pricing
```

By hand: copy a row above, change only `utm_campaign` / `utm_content`. Never invent
new `utm_source` or `utm_medium` values — add them to `src/lib/utm.ts` first so the
type checker enforces consistency.

## Verifying attribution after a campaign goes live

1. Visit the link in an incognito window.
2. Open DevTools → Network → filter `g/collect`. The first GA4 request
   should include `utm_source` / `utm_medium` / `utm_campaign` in `dl=` or `dr=`.
3. In GA4: Reports → Acquisition → Traffic acquisition. Within ~30 min you should
   see a row for your `Session source / medium / campaign` combination.
4. If the row falls into `(direct) / (none)`, the link wasn't tagged — fix at the
   posting location, not in the app.

## Anti-patterns (do not do)

- Pasting `https://www.ezbiz-fs.com` raw into any external surface. Always tag.
- Using `utm_medium=link` or `utm_medium=button` (meaningless — pick a real medium).
- Different sources for the same channel (e.g. `fb`, `FB`, `facebook.com`) — use exactly `facebook`.
- Re-using one campaign name across unrelated initiatives. Add a quarter suffix.
