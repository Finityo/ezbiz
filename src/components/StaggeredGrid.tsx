import { ReactNode, Children, cloneElement, isValidElement } from "react";
import { cn } from "@/lib/utils";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";

interface StaggeredGridProps {
  children: ReactNode;
  className?: string;
  staggerDelay?: number; // ms between each item
  baseDelay?: number; // initial delay before first item
}

const StaggeredGrid = ({
  children,
  className,
  staggerDelay = 100,
  baseDelay = 0,
}: StaggeredGridProps) => {
  const { ref, isVisible } = useScrollAnimation();

  return (
    <div ref={ref as React.RefObject<HTMLDivElement>} className={className}>
      {Children.map(children, (child, index) => {
        if (!isValidElement(child)) return child;

        const delay = baseDelay + index * staggerDelay;

        return (
          <div
            className={cn(
              "transition-all duration-500 ease-out",
              isVisible
                ? "opacity-100 translate-y-0"
                : "opacity-0 translate-y-6"
            )}
            style={{ transitionDelay: `${delay}ms` }}
          >
            {child}
          </div>
        );
      })}
    </div>
  );
};

export default StaggeredGrid;
