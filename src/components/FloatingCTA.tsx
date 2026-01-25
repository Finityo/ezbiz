import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

interface FloatingCTAProps {
  text?: string;
  href?: string;
  threshold?: number; // pixels from top before showing
}

const FloatingCTA = ({ 
  text = "Start Your Business", 
  href = "/order-now",
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
    navigate(href);
  };

  return (
    <div
      className={cn(
        "fixed bottom-6 right-6 z-50 transition-all duration-300 ease-out",
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
          "font-semibold text-base px-6 py-6 rounded-full",
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
