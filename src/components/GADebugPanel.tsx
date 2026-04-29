import { useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";

/**
 * On-screen GA4 debug panel.
 * Activate with ?ga_debug=1 in the URL.
 *
 * Shows:
 * - gtag availability
 * - Each page_view fired on SPA route change (with timestamp + path)
 * - Live dataLayer push count
 *
 * Listens to dataLayer.push to capture every gtag('event', 'page_view', …) call.
 */

interface PageViewEntry {
  ts: string;
  path: string;
  title: string;
}

const isDebugEnabled = () => {
  try {
    return new URLSearchParams(window.location.search).get("ga_debug") === "1";
  } catch {
    return false;
  }
};

export default function GADebugPanel() {
  const enabled = isDebugEnabled();
  const location = useLocation();
  const [open, setOpen] = useState(true);
  const [events, setEvents] = useState<PageViewEntry[]>([]);
  const [pushCount, setPushCount] = useState(0);
  const [gtagReady, setGtagReady] = useState(false);
  const patchedRef = useRef(false);

  // Patch dataLayer.push once to observe page_view events
  useEffect(() => {
    if (!enabled || patchedRef.current) return;
    patchedRef.current = true;

    const w = window as any;
    w.dataLayer = w.dataLayer || [];
    const originalPush = w.dataLayer.push.bind(w.dataLayer);

    w.dataLayer.push = (...args: any[]) => {
      setPushCount((c) => c + args.length);
      for (const arg of args) {
        // gtag('event', 'page_view', { page_path, page_title, … }) becomes
        // an arguments-like object on dataLayer.
        try {
          const isPageView =
            (Array.isArray(arg) && arg[0] === "event" && arg[1] === "page_view") ||
            (arg && arg[0] === "event" && arg[1] === "page_view");
          if (isPageView) {
            const params = arg[2] || {};
            setEvents((prev) =>
              [
                {
                  ts: new Date().toLocaleTimeString(),
                  path: params.page_path || window.location.pathname,
                  title: params.page_title || document.title,
                },
                ...prev,
              ].slice(0, 25),
            );
          }
        } catch {
          /* ignore */
        }
      }
      return originalPush(...args);
    };

    // Poll briefly for gtag readiness
    const start = Date.now();
    const id = setInterval(() => {
      if (typeof w.gtag === "function") {
        setGtagReady(true);
        clearInterval(id);
      } else if (Date.now() - start > 5000) {
        clearInterval(id);
      }
    }, 200);

    return () => clearInterval(id);
  }, [enabled]);

  // Mark route changes (helpful timeline alongside captured page_views)
  useEffect(() => {
    if (!enabled) return;
    // No-op: route shown via URL bar; events list confirms gtag fired.
  }, [enabled, location.pathname, location.search]);

  if (!enabled) return null;

  return (
    <div
      style={{
        position: "fixed",
        bottom: 12,
        right: 12,
        zIndex: 99999,
        width: open ? 360 : 140,
        fontFamily: "ui-monospace, SFMono-Regular, Menlo, monospace",
        fontSize: 11,
        background: "rgba(15, 23, 42, 0.95)",
        color: "#e2e8f0",
        border: "1px solid #334155",
        borderRadius: 8,
        boxShadow: "0 10px 25px rgba(0,0,0,0.35)",
      }}
    >
      <div
        onClick={() => setOpen((o) => !o)}
        style={{
          cursor: "pointer",
          padding: "6px 10px",
          background: "#1e293b",
          borderTopLeftRadius: 8,
          borderTopRightRadius: 8,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <span style={{ fontWeight: 700, color: "#60a5fa" }}>
          GA4 Debug {gtagReady ? "●" : "○"}
        </span>
        <span style={{ opacity: 0.7 }}>{open ? "▾" : "▸"}</span>
      </div>

      {open && (
        <div style={{ padding: 10, maxHeight: 320, overflow: "auto" }}>
          <div style={{ marginBottom: 8, lineHeight: 1.5 }}>
            <div>
              gtag:{" "}
              <span style={{ color: gtagReady ? "#4ade80" : "#f87171" }}>
                {gtagReady ? "ready" : "not loaded"}
              </span>
            </div>
            <div>dataLayer pushes: {pushCount}</div>
            <div>page_views captured: {events.length}</div>
            <div style={{ opacity: 0.7 }}>current: {location.pathname}{location.search}</div>
          </div>
          <div style={{ borderTop: "1px solid #334155", paddingTop: 6 }}>
            {events.length === 0 ? (
              <div style={{ opacity: 0.6 }}>
                Navigate to another route to see page_view events fire here.
              </div>
            ) : (
              events.map((e, i) => (
                <div
                  key={i}
                  style={{
                    padding: "4px 0",
                    borderBottom: i === events.length - 1 ? "none" : "1px dashed #334155",
                  }}
                >
                  <div style={{ color: "#fbbf24" }}>page_view · {e.ts}</div>
                  <div style={{ color: "#e2e8f0" }}>{e.path}</div>
                  <div style={{ color: "#94a3b8", fontSize: 10 }}>{e.title}</div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
}
