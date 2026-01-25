import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";

interface StateHeroSectionProps {
  stateName: string;
  entityType: "llc" | "corporation";
  stateFee: number;
  processingTime: string;
}

const StateHeroSection = ({ 
  stateName, 
  entityType, 
  stateFee, 
  processingTime 
}: StateHeroSectionProps) => {
  const entityLabel = entityType === "llc" ? "LLC" : "Corporation";
  
  return (
    <div className="gradient-hero text-primary-foreground py-16 relative overflow-hidden pattern-geometric">
      <div className="absolute inset-0 pattern-dots opacity-30"></div>
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl lg:text-5xl font-bold mb-4">
            Form Your {stateName} {entityLabel}
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Fast, affordable, and hassle-free business formation in {stateName}
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm opacity-80 mb-1">State Filing Fee</p>
              <p className="text-3xl font-bold">${stateFee}</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm opacity-80 mb-1">Processing Time</p>
              <p className="text-3xl font-bold">{processingTime}</p>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-lg p-4">
              <p className="text-sm opacity-80 mb-1">Our Service Fee</p>
              <p className="text-3xl font-bold">From $99</p>
            </div>
          </div>
          
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90 font-bold text-lg px-8 py-6"
            onClick={() => window.location.href = '/order-flow'}
          >
            Start Your {entityLabel} Now
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default StateHeroSection;
