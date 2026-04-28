import SEOHead from "@/components/SEOHead";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useOrderContext } from "@/contexts/OrderContext";
import { PROCESSING_PRICES, type ProcessingType as ProcessingSpeedType } from "@/lib/pricing";
import { formatPrice } from "@/lib/utils";
import OrderProgressBar from "@/components/order/OrderProgressBar";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowRight, ArrowLeft, Zap, Clock } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ProcessingSpeed() {
  const navigate = useNavigate();
  const { order, updateField } = useOrderContext();

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead title="Processing Speed" description="Order step: processing speed." path="/order/processing-speed" noIndex />
      <Navigation />
      <div className="flex-grow bg-gradient-to-br from-primary/5 via-background to-accent/5 py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <OrderProgressBar currentStep={2} />

          <h1 className="text-2xl sm:text-3xl font-bold text-center">Choose Your Processing Speed</h1>
          <p className="text-center text-muted-foreground">
            Select how quickly you'd like your formation documents processed and filed.
          </p>

          <Card className="p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <Zap className="h-4 w-4 text-primary" /> Processing Speed
            </h3>
            <RadioGroup
              value={order.processingSpeed}
              onValueChange={(v) => updateField("processingSpeed", v as ProcessingSpeedType)}
              className="space-y-2"
            >
              {(Object.entries(PROCESSING_PRICES) as [ProcessingSpeedType, typeof PROCESSING_PRICES[ProcessingSpeedType]][]).map(
                ([key, speed]) => (
                  <div
                    key={key}
                    className={cn(
                      "flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-colors",
                      order.processingSpeed === key
                        ? "border-primary bg-primary/5"
                        : "hover:bg-muted/50"
                    )}
                  >
                    <RadioGroupItem value={key} id={`speed-${key}`} />
                    <Label htmlFor={`speed-${key}`} className="cursor-pointer flex-1">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          {key === "express" ? (
                            <Zap className="h-4 w-4 text-primary" />
                          ) : (
                            <Clock className="h-4 w-4 text-muted-foreground" />
                          )}
                          <span className="font-medium">{speed.name}</span>
                        </div>
                        <span className="font-semibold text-primary">
                          {speed.price === 0 ? "Included" : `+$${formatPrice(speed.price)}`}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground mt-1 ml-6">{speed.description}</p>
                    </Label>
                  </div>
                )
              )}
            </RadioGroup>
          </Card>

          <div className="flex justify-between items-center pt-2">
            <Button variant="outline" onClick={() => navigate("/order/company-info")}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <Button onClick={() => navigate("/order/irs-contact")} size="lg">
              <ArrowRight className="h-4 w-4 mr-2" /> Continue
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
