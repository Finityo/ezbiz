/**
 * Canonical UTM builder.
 *
 * Every external link to ezbiz-fs.com MUST be built through this helper so
 * GA4 (and any future attribution tool) can credit the right source/medium/
 * campaign instead of dropping the visit into "direct / (none)".
 *
 * Source of truth: docs/UTM_LINKS.md
 *
 * Hard rules (do not loosen):
 *  - source / medium / campaign are REQUIRED on every external link
 *  - all values are lowercased + dash-separated
 *  - no spaces, no punctuation, no PII
 *  - never include access tokens, emails, or session ids in UTM params
 */

import { SITE_URL } from "@/lib/site";

export type UtmMedium =
  | "social"        // organic social posts (Facebook, LinkedIn, X, Threads, IG bio)
  | "cpc"           // paid search / Google Ads
  | "paid-social"   // paid Facebook / Meta / LinkedIn ads
  | "email"         // Resend marketing / newsletter / nurture
  | "referral"      // partner/affiliate sites (CorpNet, Bizipedia, etc.)
  | "listing"       // directory listings (Google Business Profile, Bing Places, Yelp)
  | "qr"            // printed QR codes (brochures, business cards)
  | "sms"           // text campaigns
  | "podcast"       // podcast sponsorships
  | "video";        // YouTube / TikTok organic

export type UtmSource =
  | "facebook"
  | "instagram"
  | "linkedin"
  | "x"
  | "threads"
  | "youtube"
  | "tiktok"
  | "google"
  | "bing"
  | "google-business"
  | "bing-places"
  | "yelp"
  | "bizipedia"
  | "corpnet"
  | "newsletter"
  | "transactional"
  | "qr-flyer"
  | "qr-card"
  | "podcast"
  | "partner"
  | "press";

export interface UtmParams {
  source: UtmSource;
  medium: UtmMedium;
  campaign: string;        // e.g. "veteran-launch-2026q3"
  content?: string;        // ad/creative variant: "hero-blue-cta-v1"
  term?: string;           // keyword (cpc only)
}

const slugify = (v: string) =>
  v.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");

/**
 * Build a fully-qualified, UTM-tagged URL for any path on the site.
 *
 * @example
 *   buildUtmUrl("/pricing", { source: "facebook", medium: "social", campaign: "veteran-launch-2026q3" })
 *   // → https://www.ezbiz-fs.com/pricing?utm_source=facebook&utm_medium=social&utm_campaign=veteran-launch-2026q3
 */
export function buildUtmUrl(path: string, params: UtmParams): string {
  if (!params.source || !params.medium || !params.campaign) {
    throw new Error("buildUtmUrl: source, medium, and campaign are REQUIRED");
  }
  const url = new URL(path.startsWith("http") ? path : `${SITE_URL}${path.startsWith("/") ? path : `/${path}`}`);
  url.searchParams.set("utm_source", slugify(params.source));
  url.searchParams.set("utm_medium", slugify(params.medium));
  url.searchParams.set("utm_campaign", slugify(params.campaign));
  if (params.content) url.searchParams.set("utm_content", slugify(params.content));
  if (params.term) url.searchParams.set("utm_term", slugify(params.term));
  return url.toString();
}

/**
 * Approved channel presets — keep in lock-step with docs/UTM_LINKS.md.
 * Use these in code instead of typing UTM params by hand at call sites.
 */
export const CHANNEL_PRESETS = {
  facebookOrganic: (campaign: string, content?: string): UtmParams =>
    ({ source: "facebook", medium: "social", campaign, content }),
  facebookPaid: (campaign: string, content?: string): UtmParams =>
    ({ source: "facebook", medium: "paid-social", campaign, content }),
  googleBusiness: (campaign: string): UtmParams =>
    ({ source: "google-business", medium: "listing", campaign }),
  bizipedia: (campaign: string): UtmParams =>
    ({ source: "bizipedia", medium: "referral", campaign }),
  corpnetReferral: (campaign: string): UtmParams =>
    ({ source: "corpnet", medium: "referral", campaign }),
  newsletter: (campaign: string, content?: string): UtmParams =>
    ({ source: "newsletter", medium: "email", campaign, content }),
  googleAds: (campaign: string, term: string, content?: string): UtmParams =>
    ({ source: "google", medium: "cpc", campaign, term, content }),
} as const;
