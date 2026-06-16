import React from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import "./index.css";

// Auto-recover from stale lazy-chunk imports after a redeploy.
// When the hashed bundle references a chunk that no longer exists,
// dynamic import() throws "Importing a module script failed" / "Failed to fetch
// dynamically imported module". Reload once to pick up the new index.html.
const STALE_CHUNK_RELOAD_KEY = "__stale_chunk_reloaded__";
const isStaleChunkError = (msg: string) =>
  /Importing a module script failed|Failed to fetch dynamically imported module|error loading dynamically imported module/i.test(
    msg ?? ""
  );

const tryReloadOnce = () => {
  try {
    if (sessionStorage.getItem(STALE_CHUNK_RELOAD_KEY)) return;
    sessionStorage.setItem(STALE_CHUNK_RELOAD_KEY, "1");
    window.location.reload();
  } catch {
    window.location.reload();
  }
};

window.addEventListener("error", (e) => {
  if (isStaleChunkError(e?.message)) tryReloadOnce();
});
window.addEventListener("unhandledrejection", (e) => {
  const msg = (e?.reason && (e.reason.message || String(e.reason))) || "";
  if (isStaleChunkError(msg)) tryReloadOnce();
});

createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
