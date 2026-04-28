/**
 * Single source of truth for the canonical site origin.
 * All public URLs (canonical, OG, JSON-LD, emails) MUST use this value.
 * The www host avoids an apex→www redirect hop that breaks Facebook's scraper.
 */
export const SITE_URL = "https://www.ezbiz-fs.com";
export const SITE_HOST = "www.ezbiz-fs.com";

export const siteUrl = (path = "/"): string => {
  if (!path.startsWith("/")) path = `/${path}`;
  return `${SITE_URL}${path}`;
};
