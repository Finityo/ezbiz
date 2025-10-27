import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface OrderStepIndicatorProps {
  currentStep: number;
  steps: string[];
}

const OrderStepIndicator = ({ currentStep, steps }: OrderStepIndicatorProps) => {
  return (
    <div className="w-full py-8">
      <div className="flex items-center justify-between max-w-3xl mx-auto px-4">
        {steps.map((step, index) => {
          const stepNumber = index + 1;
          const isCompleted = stepNumber < currentStep;
          const isCurrent = stepNumber === currentStep;
          
          return (
            <div key={stepNumber} className="flex items-center flex-1">
              <div className="flex flex-col items-center">
                <div
                  className={cn(
                    "w-10 h-10 rounded-full flex items-center justify-center font-semibold transition-smooth",
                    isCompleted && "bg-success text-success-foreground",
                    isCurrent && "bg-primary text-primary-foreground shadow-md",
                    !isCompleted && !isCurrent && "bg-muted text-muted-foreground"
                  )}
                >
                  {isCompleted ? <Check className="h-5 w-5" /> : stepNumber}
                </div>
                <span className={cn(
                  "text-xs mt-2 font-medium text-center",
                  isCurrent ? "text-primary" : "text-muted-foreground"
                )}>
                  {step}
                </span>
              </div>
              
              {index < steps.length - 1 && (
                <div className={cn(
                  "h-0.5 flex-1 mx-2 transition-smooth",
                  stepNumber < currentStep ? "bg-success" : "bg-border"
                )} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default OrderStepIndicator;
