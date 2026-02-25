import { useEffect, useRef, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';

const getSessionId = () => {
  let id = sessionStorage.getItem('analytics_session_id');
  if (!id) {
    id = crypto.randomUUID();
    sessionStorage.setItem('analytics_session_id', id);
  }
  return id;
};

// ── Scroll depth tracking ──
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

      // Flush on route change / unmount
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

// ── Page view (GA4 only – Supabase scroll_analytics already captures visits) ──
const usePageViewTracking = () => {
  const location = useLocation();

  useEffect(() => {
    if (typeof window.gtag === 'function') {
      window.gtag('event', 'page_view', {
        page_path: location.pathname + location.search,
        page_title: document.title,
      });
    }
  }, [location.pathname, location.search]);
};

// ── CTA click tracker (callable) ──
export const trackClick = (label: string, type: string, destination: string) => {
  // GA4
  if (typeof window.gtag === 'function') {
    window.gtag('event', 'cta_click', {
      button_label: label,
      button_type: type,
      destination_url: destination,
    });
  }

  // Supabase
  supabase.from('click_analytics').insert({
    button_label: label,
    button_type: type,
    destination_url: destination,
    page_location: window.location.pathname,
    session_id: getSessionId(),
    user_agent: navigator.userAgent,
  }).then(() => {});
};

// ── Combined hook – mount once near the root ──
export const useAnalytics = () => {
  usePageViewTracking();
  useScrollTracking();
};

export default useAnalytics;
