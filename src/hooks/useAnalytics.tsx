import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import {
  initAnalytics,
  trackPageView,
  trackEvent,
  trackCTAClick,
  runDiagnostics,
} from '@/lib/analytics';

// ── Session helper ──
const getSessionId = () => {
  let id = sessionStorage.getItem('analytics_session_id');
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem('analytics_session_id', id);
  }
  return id;
};

// ── Scroll depth tracking (Supabase) ──
const useScrollTracking = () => {
  const location = useLocation();
  const maxScrollRef = useRef(0);
  const startTimeRef = useRef(Date.now());

  useEffect(() => {
    maxScrollRef.current = 0;
    startTimeRef.current = Date.now();

    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? Math.round((scrollTop / docHeight) * 100) : 0;
      if (pct > maxScrollRef.current) maxScrollRef.current = pct;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      const depth = maxScrollRef.current;
      if (depth > 5) {
        const timeOnPage = Math.round((Date.now() - startTimeRef.current) / 1000);
        supabase.from('scroll_analytics').insert({
          page_location: location.pathname,
          scroll_depth: depth,
          max_scroll_reached: depth,
          time_on_page: timeOnPage,
          session_id: getSessionId(),
          user_agent: navigator.userAgent,
        }).then(() => {});
      }
    };
  }, [location.pathname]);
};

// ── SPA page-view tracking (GA4 + no duplicate) ──
const usePageViewTracking = () => {
  const location = useLocation();
  const prevPathRef = useRef<string | null>(null);

  useEffect(() => {
    const fullPath = location.pathname + location.search;
    // Prevent duplicate on same path (e.g. StrictMode double-mount)
    if (prevPathRef.current === fullPath) return;
    prevPathRef.current = fullPath;

    trackPageView(fullPath);
  }, [location.pathname, location.search]);
};

// ── Combined hook – mount once near the root ──
export const useAnalytics = () => {
  // Init GA4 once
  useEffect(() => {
    initAnalytics();

    // Run diagnostics automatically in debug mode
    const isDebug = new URLSearchParams(window.location.search).get('ga_debug') === '1';
    if (isDebug) {
      // Small delay to let dataLayer populate
      setTimeout(() => runDiagnostics(), 1500);
    }
  }, []);

  usePageViewTracking();
  useScrollTracking();
};

// ── Re-export trackClick for backward compatibility ──
export const trackClick = (label: string, type: string, destination: string) => {
  // GA4 via centralized module
  trackCTAClick(label, destination);

  // Supabase (keep existing behaviour)
  supabase.from('click_analytics').insert({
    button_label: label,
    button_type: type,
    destination_url: destination,
    page_location: window.location.pathname,
    session_id: getSessionId(),
    user_agent: navigator.userAgent,
  }).then(() => {});
};

export default useAnalytics;
