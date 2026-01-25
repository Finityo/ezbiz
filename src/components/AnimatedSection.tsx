import { ReactNode, forwardRef } from "react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface AnimatedSectionProps {
  children: ReactNode;
  className?: string;
  animation?: "fade-up" | "fade-in" | "fade-left" | "fade-right" | "scale";
  delay?: number;
}

const AnimatedSection = ({
  children,
  className,
  animation = "fade-up",
  delay = 0,
}: AnimatedSectionProps) => {
  const { ref, isVisible } = useScrollAnimation();

  const animationClasses = {
    "fade-up": "translate-y-8 opacity-0",
    "fade-in": "opacity-0",
    "fade-left": "-translate-x-8 opacity-0",
    "fade-right": "translate-x-8 opacity-0",
    "scale": "scale-95 opacity-0",
  };

  const visibleClasses = "translate-y-0 translate-x-0 scale-100 opacity-100";

  return (
    <section
      ref={ref as React.RefObject<HTMLElement>}
      className={cn(
        "transition-all duration-700 ease-out",
        isVisible ? visibleClasses : animationClasses[animation],
        className
      )}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </section>
  );
};

export default AnimatedSection;
