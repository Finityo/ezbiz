import { useState } from "react";
import { Download, Star } from "lucide-react";
import vvlAsset from "@/assets/vvl.pdf.asset.json";
import { trackClick } from "@/hooks/useAnalytics";

interface Props {
  source: string;
  label?: string;
  className?: string;
}

export default function VVLDownloadButton({ source, label = "Download VVL Form (PDF)", className = "" }: Props) {
  const [showThanks, setShowThanks] = useState(false);

  const handleDownload = () => {
    try {
      trackClick?.("VVL Download", `vvl_download_${source}`, vvlAsset.url);
    } catch {}
    const a = document.createElement("a");
    a.href = vvlAsset.url;
    a.download = "Veteran-Verification-Letter-VVL.pdf";
    a.rel = "noopener";
    document.body.appendChild(a);
    a.click();
    a.remove();
    setShowThanks(true);
    setTimeout(() => setShowThanks(false), 4000);
  };

  return (
    <>
      <button
        onClick={handleDownload}
        className={
          className ||
          "inline-flex items-center gap-2 px-6 py-3 rounded-lg font-semibold bg-yellow-400 text-blue-950 hover:bg-yellow-300 shadow-md transition"
        }
      >
        <Download className="w-4 h-4" />
        {label}
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
