import { useState } from "react";
import { Download, Star } from "lucide-react";
import vvlAsset from "@/assets/vvl.pdf.asset.json";
import { trackClick } from "@/hooks/useAnalytics";
import { trackEvent } from "@/lib/analytics";
import { ACTIVE_ORDER_KEY, logOrderEvent } from "@/lib/orderEvents";

const getActiveOrderId = (): string | null => {
  if (typeof window === "undefined") return null;
  try { return window.localStorage.getItem(ACTIVE_ORDER_KEY); } catch { return null; }
};

const FILE_NAME = "Veteran-Verification-Letter-VVL.pdf";

interface Props {
  source: string;
  label?: string;
  className?: string;
  /** Fires AFTER the actual download click has been triggered. Used by
   *  VeteranWaiverDialog to flip orders.vvl_pdf_downloaded + log the
   *  `vvl_pdf_downloaded` order_events row. */
  onDownloaded?: () => void;
}

export default function VVLDownloadButton({
  source,
  label = "Download VVL Form",
  className = "",
  onDownloaded,
}: Props) {
  const [showThanks, setShowThanks] = useState(false);

  const [downloading, setDownloading] = useState(false);

  const triggerBlobDownload = async (): Promise<boolean> => {
    try {
      const res = await fetch(vvlAsset.url, { credentials: "omit" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const blob = await res.blob();
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = FILE_NAME;
      a.rel = "noopener";
      document.body.appendChild(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(blobUrl), 4000);
      return true;
    } catch (err) {
      console.warn("VVL blob download failed, falling back to direct link", err);
      // Safari/Chrome fallback: open in a new tab so the user still gets the file
      window.open(vvlAsset.url, "_blank", "noopener");
      return false;
    }
  };

  const handleDownload = async () => {
    if (downloading) return;
    setDownloading(true);
    const pageLocation =
      typeof window !== "undefined" ? window.location.href : "";
    const orderId = getActiveOrderId();
    const clickedAt = new Date().toISOString();
    try {
      trackClick?.("VVL Download", `vvl_download_${source}`, vvlAsset.url);
      trackEvent("pdf_download", {
        file_name: FILE_NAME,
        destination_url: vvlAsset.url,
        page_location: pageLocation,
        source,
      });
    } catch {}
    // Always log click attempt against the active draft order (if any).
    void logOrderEvent(orderId, "vvl_pdf_download_clicked", {
      source,
      file_name: FILE_NAME,
      page_location: pageLocation,
      clicked_at: clickedAt,
    });
    const ok = await triggerBlobDownload();
    void logOrderEvent(
      orderId,
      ok ? "vvl_pdf_download_succeeded" : "vvl_pdf_download_failed",
      {
        source,
        file_name: FILE_NAME,
        page_location: pageLocation,
        clicked_at: clickedAt,
        completed_at: new Date().toISOString(),
        fallback_used: !ok,
      },
    );
    setShowThanks(true);
    setTimeout(() => setShowThanks(false), 4000);
    setDownloading(false);
    try { onDownloaded?.(); } catch {}
  };

  return (
    <>
      <button
        type="button"
        onClick={handleDownload}
        aria-label="Download VVL Form (PDF)"
        data-testid="download-vvl-form"
        disabled={downloading}
        className={
          className ||
          "inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-yellow-400 text-blue-950 hover:bg-yellow-300 shadow-md transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-yellow-500 focus-visible:ring-offset-2"
        }
      >
        <Download className="w-4 h-4" aria-hidden="true" />
        <span>{label}</span>
      </button>

      {showThanks && (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 animate-fade-in"
          role="dialog"
          aria-live="polite"
        >
          <div className="relative animate-scale-in max-w-md w-[90%] rounded-2xl overflow-hidden shadow-2xl border-4 border-yellow-400">
            <div className="bg-gradient-to-br from-blue-950 via-slate-900 to-red-800 p-8 text-center text-white">
              <div
                className="absolute inset-0 opacity-10 pointer-events-none"
                style={{
                  backgroundImage:
                    "repeating-linear-gradient(45deg, #fff 0 12px, transparent 12px 24px)",
                }}
              />
              <div className="relative flex justify-center gap-2 mb-4 text-4xl">
                <span>🇺🇸</span>
                <Star className="w-10 h-10 text-yellow-400 fill-yellow-400" />
                <span>🇺🇸</span>
              </div>
              <h3 className="relative text-3xl font-bold mb-2 tracking-wide">
                Thank You For Your Service
              </h3>
              <p className="relative text-yellow-200 text-sm">
                Your download has started. We're proud to support our veterans.
              </p>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
