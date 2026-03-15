import { cn } from "@/lib/utils";
import { Check } from "lucide-react";

const STEPS = [
  { label: "Company Info", path: "/order/company-info" },
  { label: "Processing", path: "/order/processing-speed" },
  { label: "IRS Contact", path: "/order/irs-contact" },
  { label: "Terms", path: "/order/terms" },
  { label: "Checkout", path: "/order/checkout" },
];

interface OrderProgressBarProps {
  currentStep: number; // 1-indexed
}

export default function OrderProgressBar({ currentStep }: OrderProgressBarProps) {
  return (
    <div className="w-full max-w-2xl mx-auto px-4">
      <div className="flex items-center justify-between">
        {STEPS.map((step, i) => {
          const stepNum = i + 1;
          const isCompleted = stepNum < currentStep;
          const isActive = stepNum === currentStep;

          return (
            <div key={step.path} className="flex items-center flex-1 last:flex-none">
              {/* Step circle + label */}
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className={cn(
                    "w-9 h-9 rounded-full flex items-center justify-center text-sm font-semibold border-2 transition-all duration-300",
                    isCompleted && "bg-primary border-primary text-primary-foreground",
                    isActive && "border-primary bg-primary/10 text-primary",
                    !isCompleted && !isActive && "border-muted-foreground/30 bg-muted/50 text-muted-foreground"
                  )}
                >
                  {isCompleted ? <Check className="h-4 w-4" /> : stepNum}
                </div>
                <span
                  className={cn(
                    "text-[11px] font-medium text-center leading-tight hidden sm:block",
                    isActive && "text-primary",
                    isCompleted && "text-foreground",
                    !isCompleted && !isActive && "text-muted-foreground"
                  )}
                >
                  {step.label}
                </span>
              </div>

              {/* Connector line */}
              {stepNum < STEPS.length && (
                <div className="flex-1 mx-2 h-0.5 rounded-full relative overflow-hidden bg-muted-foreground/20">
                  <div
                    className={cn(
                      "absolute inset-y-0 left-0 rounded-full bg-primary transition-all duration-500",
                      isCompleted ? "w-full" : "w-0"
                    )}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
