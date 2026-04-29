/**
 * Centralized GA4 Analytics Module
 * ─────────────────────────────────
 * Provides: initAnalytics, trackPageView, trackEvent, trackOutboundLinks, runDiagnostics
 *
 * Debug mode: append ?ga_debug=1 to any URL for verbose console output.
 */

const GA_MEASUREMENT_ID = 'G-9KCZNED9GB';

// ── Helpers ──────────────────────────────────────────────────────────────────

const isDebug = () => {
  try {
    return new URLSearchParams(window.location.search).get('ga_debug') === '1';
  } catch {
    return false;
  }
};

const log = (...args: any[]) => {
  if (isDebug()) console.log('%c[GA4 DEBUG]', 'color:#4285f4;font-weight:bold', ...args);
};

const warn = (...args: any[]) => {
  console.warn('[GA4]', ...args);
};

const gtagAvailable = (): boolean => typeof window !== 'undefined' && typeof window.gtag === 'function';

// ── Core functions ───────────────────────────────────────────────────────────

/** Call once at app mount to verify GA4 is loaded and set SPA-friendly config */
export function initAnalytics() {
  if (!gtagAvailable()) {
    warn('gtag not found – GA4 script may be blocked or missing.');
    return;
  }

  // Disable automatic page_view (we send manually on route change)
  window.gtag('config', GA_MEASUREMENT_ID, {
    send_page_view: false,
    debug_mode: isDebug(),
  });

  log('GA4 initialised with ID', GA_MEASUREMENT_ID, '| debug_mode:', isDebug());

  // Attach global outbound-link listener once
  document.addEventListener('click', handleOutboundClick, { capture: true });
  log('Outbound-link listener attached');
}

/** Send a page_view event – call on every SPA route change */
export function trackPageView(path: string) {
  if (!gtagAvailable()) {
    log('(no-op) trackPageView', path);
    return;
  }

  window.gtag('event', 'page_view', {
    page_path: path,
    page_title: document.title,
    page_location: window.location.origin + path,
    ...(isDebug() && { debug_mode: true }),
  });
  log('page_view →', path);
}

/** Generic event dispatcher with consistent payload shape */
export function trackEvent(
  name: string,
  params: Record<string, string | number | boolean | undefined> = {},
) {
  const payload = {
    ...params,
    page_location: window.location.pathname,
    ...(isDebug() && { debug_mode: true }),
  };

  if (gtagAvailable()) {
    window.gtag('event', name, payload);
  }

  log(`event "${name}" →`, payload);
}

// ── Pre-built convenience trackers ──────────────────────────────────────────

export const trackCTAClick = (label: string, destination: string) =>
  trackEvent('cta_click', { button_label: label, destination_url: destination });

export const trackOrderFlowView = () =>
  trackEvent('order_flow_view');

export const trackCheckoutStart = (packageName: string, value: number) =>
  trackEvent('checkout_start', { package_name: packageName, value, currency: 'USD' });

export const trackFormStart = (formName: string) =>
  trackEvent('form_start', { form_name: formName });

export const trackFormSubmit = (formName: string) =>
  trackEvent('form_submit', { form_name: formName });

/**
 * Renamed from trackConsultationClick → trackStartOrderClick.
 * Checkout funnel now routes directly to /order-flow + Stripe (no booking).
 */
export const trackStartOrderClick = (location: string = 'unknown') =>
  trackEvent('start_order_click', { destination: '/order-flow', location });

/** @deprecated Use trackStartOrderClick. Kept as a thin alias to avoid runtime breakage. */
export const trackConsultationClick = (type: string) =>
  trackStartOrderClick(type);

export const trackPhoneClick = (number: string) =>
  trackEvent('phone_click', { phone_number: number });

export const trackEmailClick = (email: string) =>
  trackEvent('email_click', { email_address: email });

export const trackPurchase = (transactionId: string, value: number, currency = 'USD') =>
  trackEvent('purchase', { transaction_id: transactionId, value, currency });

// ── Outbound link auto-tracking ─────────────────────────────────────────────

function handleOutboundClick(e: MouseEvent) {
  const anchor = (e.target as HTMLElement).closest?.('a[href]') as HTMLAnchorElement | null;
  if (!anchor) return;
  try {
    const url = new URL(anchor.href, window.location.origin);
    if (url.hostname && url.hostname !== window.location.hostname) {
      trackEvent('outbound_click', { outbound_url: anchor.href });
    }
  } catch { /* ignore malformed URLs */ }
}

// ── Diagnostics (console summary) ───────────────────────────────────────────

interface CheckResult { check: string; status: 'PASS' | 'FAIL' | 'WARN'; detail: string }

export function runDiagnostics(): CheckResult[] {
  const results: CheckResult[] = [];

  // 1. dataLayer exists
  const dlExists = Array.isArray((window as any).dataLayer);
  results.push({ check: 'window.dataLayer exists', status: dlExists ? 'PASS' : 'FAIL', detail: dlExists ? 'Array found' : 'Missing' });

  // 2. gtag function
  const gtagOk = gtagAvailable();
  results.push({ check: 'window.gtag is function', status: gtagOk ? 'PASS' : 'FAIL', detail: gtagOk ? 'Available' : 'Missing – script blocked?' });

  // 3. GA script tag
  const scriptTag = document.querySelector(`script[src*="googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"]`);
  results.push({ check: 'GA4 script tag present', status: scriptTag ? 'PASS' : 'FAIL', detail: scriptTag ? 'Found in DOM' : 'Not found' });

  // 4. Measurement ID
  const dlStr = JSON.stringify((window as any).dataLayer || []);
  const idPresent = dlStr.includes(GA_MEASUREMENT_ID);
  results.push({ check: `Measurement ID ${GA_MEASUREMENT_ID} in dataLayer`, status: idPresent ? 'PASS' : 'WARN', detail: idPresent ? 'Found' : 'Not yet pushed (may appear after config)' });

  // 5. Config call count
  const configCount = ((window as any).dataLayer || []).filter((e: any) => Array.isArray(e) ? e[0] === 'config' : e?.[0] === 'config').length;
  // Heuristic: look for "config" strings
  const configEntries = ((window as any).dataLayer || []).filter((e: any) => JSON.stringify(e).includes('config'));
  results.push({ check: 'Config calls in dataLayer', status: configEntries.length >= 1 ? 'PASS' : 'WARN', detail: `${configEntries.length} config-related entries found` });

  // 6. Debug mode
  results.push({ check: 'Debug mode (?ga_debug=1)', status: isDebug() ? 'PASS' : 'WARN', detail: isDebug() ? 'Active' : 'Inactive – add ?ga_debug=1 to URL' });

  // Print table
  console.log('%c╔══ GA4 Flow Fire Check ══╗', 'color:#4285f4;font-weight:bold;font-size:14px');
  console.table(results.map(r => ({ Check: r.check, Status: r.status, Detail: r.detail })));
  const fails = results.filter(r => r.status === 'FAIL').length;
  if (fails === 0) {
    console.log('%c✅ All checks passed!', 'color:green;font-weight:bold');
  } else {
    console.log(`%c❌ ${fails} check(s) failed – see table above`, 'color:red;font-weight:bold');
  }

  return results;
}

// ── Hero routing trackers ────────────────────────────────────────────────────

export const trackHeroPath = (option: "file_instantly" | "talk_expert" | "learn_first") =>
  trackEvent("hero_path_click", { option, location: "hero_router" });

export const trackCorpNetClick = () =>
  trackEvent("corpnet_affiliate_click", { partner: "corpnet", location: "hero" });

export const trackStartOrderClickHero = () =>
  trackEvent("start_order_click", { location: "hero", destination: "/order-flow" });

/** @deprecated Use trackStartOrderClickHero. */
export const trackConsultationClickHero = trackStartOrderClickHero;

export const trackLearnClick = () =>
  trackEvent("learn_click", { location: "hero" });

export default { initAnalytics, trackPageView, trackEvent, runDiagnostics };
