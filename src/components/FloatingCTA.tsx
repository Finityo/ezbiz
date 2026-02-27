import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { trackClick } from "@/hooks/useAnalytics";
import { EZBIZ_COPY } from "@/content/ezbizCopy";

interface FloatingCTAProps {
  text?: string;
  href?: string;
  threshold?: number; // pixels from top before showing
}

const FloatingCTA = ({ 
  text = EZBIZ_COPY.hero.ctaPrimary, 
  href = "/order-flow",
  threshold = 600 
}: FloatingCTAProps) => {
  const [isVisible, setIsVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY;
      setIsVisible(scrollY > threshold);
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll(); // Check initial position

    return () => window.removeEventListener("scroll", handleScroll);
  }, [threshold]);

  const handleClick = () => {
    trackClick(text, 'floating_cta', href);
    navigate(href);
  };

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 md:bottom-6 md:right-6 z-50 transition-all duration-300 ease-out",
        isVisible 
          ? "opacity-100 translate-y-0" 
          : "opacity-0 translate-y-4 pointer-events-none"
      )}
    >
      <Button
        size="lg"
        onClick={handleClick}
        className={cn(
          "group shadow-hero hover:shadow-elegant",
          "bg-secondary hover:bg-secondary-light text-secondary-foreground",
          "font-semibold text-sm md:text-base px-4 md:px-6 py-4 md:py-6 rounded-full",
          "transition-all duration-300"
        )}
      >
        {text}
        <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
      </Button>
    </div>
  );
};

export default FloatingCTA;
