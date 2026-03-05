import { useState, useEffect } from "react";
import { Zap, MessageCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { trackClick } from "@/hooks/useAnalytics";
import { trackCorpNetClick, trackConsultationClickHero } from "@/lib/analytics";

const CORPNET_AFFILIATE_LINK = "https://www.corpnet.com/?pid=16443";

interface FloatingCTAProps {
  threshold?: number;
}

const FloatingCTA = ({ threshold = 600 }: FloatingCTAProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => setIsVisible(window.scrollY > threshold);
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 z-50 transition-all duration-300 ease-out",
        isVisible
          ? "opacity-100 translate-y-0"
          : "opacity-0 translate-y-full pointer-events-none"
      )}
    >
      <div className="border-t border-border bg-card/95 backdrop-blur-md shadow-hero">
        <div className="max-w-6xl mx-auto flex items-center justify-between px-4 py-3">
          <p className="hidden sm:block text-sm font-medium text-card-foreground">
            Ready to start your business?
          </p>

          <div className="flex gap-3 w-full sm:w-auto">
            {/* File Instantly */}
            <button
              onClick={() => {
                trackCorpNetClick();
                trackClick("File Instantly", "sticky_bar_file", CORPNET_AFFILIATE_LINK);
                window.open(CORPNET_AFFILIATE_LINK, "_blank", "noopener,noreferrer");
              }}
              className={cn(
                "flex-1 sm:flex-none inline-flex items-center justify-center gap-2",
                "bg-secondary text-secondary-foreground px-5 py-2.5 rounded-lg",
                "font-semibold text-sm hover:bg-secondary-light transition-all duration-200 cursor-pointer"
              )}
            >
              <Zap className="h-4 w-4" />
              File Instantly
            </button>

            {/* Talk to an Expert */}
            <button
              onClick={() => {
                trackConsultationClickHero();
                trackClick("Talk to an Expert", "sticky_bar_consult", "/consultation");
                navigate("/consultation");
              }}
              className={cn(
                "flex-1 sm:flex-none inline-flex items-center justify-center gap-2",
                "border border-border px-5 py-2.5 rounded-lg",
                "font-semibold text-sm hover:bg-muted transition-all duration-200 cursor-pointer"
              )}
            >
              <MessageCircle className="h-4 w-4" />
              <span className="hidden xs:inline">Talk to an Expert</span>
              <span className="xs:hidden">Get Help</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FloatingCTA;
