import SEOHead from "@/components/SEOHead";
import { useState, useEffect } from "react";
import { useSearchParams, Navigate } from "react-router-dom";
import { toast } from "sonner";
import Navigation from "@/components/Navigation";
import type { AddonQuantities } from "@/components/order/AddOnServices";
import VeteranEligibilityGate from "@/components/order/VeteranEligibilityGate";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import OrderStepIndicator from "@/components/order/OrderStepIndicator";
import StateSelector from "@/components/order/StateSelector";
import EntityTypeSelector from "@/components/order/EntityTypeSelector";
import PackageSelector from "@/components/order/PackageSelector";
import AddOnServices from "@/components/order/AddOnServices";
import BusinessDetailsForm, { type BusinessDetails } from "@/components/order/BusinessDetailsForm";
import AccountStep from "@/components/order/AccountStep";
import ReviewStep from "@/components/order/ReviewStep";
import { PACKAGE_PRICES, ADDON_PRICES, PROCESSING_PRICES, SHIPPING_PRICE, WHITE_GLOVE_BASE, type PackageType, type AddonId, type ProcessingType } from "@/lib/pricing";
import { getStateFee, getCorpStateFee } from "@/lib/state-fees";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { trackOrderFlowView, trackFormStart, trackEvent } from "@/lib/analytics";
import { formatPrice } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Car, MessageCircle, MapPin, Clock, Zap } from "lucide-react";

export type OrderMode = "guided" | "whiteglove";

export type ServiceDetails = {
  meetingLocation: string;
  preferredDateTime: string;
  notes: string;
};

const normalizeMode = (raw: string | null): OrderMode =>
  raw === "whiteglove" ? "whiteglove" : "guided";

const steps = ["State", "Package", "Details", "Account", "Review"];

const CORP_ENTITIES = ["c-corp", "s-corp", "nonprofit", "professional-corp"];

const EnhancedOrderFlow = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();

  const mode: OrderMode = normalizeMode(searchParams.get("mode"));

  // Guard: in guided mode the URL MUST include a valid package param.
  // This prevents any page from dropping users into a generic pricing flow
  // by linking to /order-flow without a plan.
  const rawPackage = searchParams.get("package");
  const isValidPackage =
    !!rawPackage && Object.prototype.hasOwnProperty.call(PACKAGE_PRICES, rawPackage);
  const requiresPackage = mode !== "whiteglove";
  const missingPackage = requiresPackage && !isValidPackage;

  useEffect(() => {
    if (missingPackage) {
      toast.error("Please choose a package to start your order.");
    }
  }, [missingPackage]);

  useEffect(() => {
    const raw = searchParams.get("mode");
    const normalized = normalizeMode(raw);
    if (raw !== normalized) {
      const next = new URLSearchParams(searchParams);
      next.set("mode", normalized);
      setSearchParams(next, { replace: true });
    }
  }, [searchParams, setSearchParams]);

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedState, setSelectedState] = useState(searchParams.get("state") || "");
  const [selectedEntity, setSelectedEntity] = useState(searchParams.get("entity") || "llc");
  const [selectedPackage, setSelectedPackage] = useState(searchParams.get("package") || "");
  const [isVeteran, setIsVeteran] = useState(false);
  const [isFormedInTexas2022, setIsFormedInTexas2022] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [addonQuantities, setAddonQuantities] = useState<AddonQuantities>({});
  const [processingSpeed, setProcessingSpeed] = useState<ProcessingType>("standard");
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails>({
    businessName: "",
    designator: "",
    address: "",
    city: "",
    zipCode: "",
    managementStructure: "",
  });

  const [serviceDetails, setServiceDetails] = useState<ServiceDetails>({
    meetingLocation: "",
    preferredDateTime: "",
    notes: "",
  });

  useEffect(() => { trackOrderFlowView(); }, []);

  const isCorpType = CORP_ENTITIES.includes(selectedEntity);
  const stateFee = selectedState ? (isCorpType ? getCorpStateFee(selectedState) : getStateFee(selectedState)) : 0;

  const runningTotal = () => {
    const pkgPrice = PACKAGE_PRICES[selectedPackage as PackageType]?.price || 0;
    const addonsTotal = selectedAddOns.reduce((sum, id) => {
      const addon = ADDON_PRICES[id as AddonId];
      return sum + (addon?.price || 0);
    }, 0);
    const speedFee = PROCESSING_PRICES[processingSpeed]?.price || 0;
    const whiteGloveFee = mode === "whiteglove" ? WHITE_GLOVE_BASE : 0;
    return pkgPrice + addonsTotal + stateFee + speedFee + SHIPPING_PRICE + whiteGloveFee;
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1:
        return !!selectedState;
      case 2:
        return !!selectedPackage && !!selectedEntity;
      case 3: {
        const baseOk = !!(
          businessDetails.businessName &&
          businessDetails.designator &&
          businessDetails.address &&
          businessDetails.city &&
          businessDetails.zipCode &&
          (selectedEntity !== "llc" || businessDetails.managementStructure)
        );
        if (mode === "whiteglove") {
          return baseOk && !!serviceDetails.meetingLocation && !!serviceDetails.preferredDateTime;
        }
        return baseOk;
      }
      case 4:
        return !!user;
      default:
        return false;
    }
  };

  const goNext = () => {
    if (currentStep === 2) trackFormStart("order_business_details");
    if (currentStep === 3 && user) {
      setCurrentStep(5);
    } else {
      setCurrentStep((s) => Math.min(s + 1, 5));
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    setCurrentStep((s) => Math.max(s - 1, 1));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleToggleAddon = (addonId: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  const [applicationId, setApplicationId] = useState<string | null>(null);

  const saveOrderToDb = async (): Promise<string | null> => {
    if (!user) return null;
    try {
      const { data, error } = await supabase
        .from("business_applications")
        .insert([{
          user_id: user.id,
          business_name: `${businessDetails.businessName} ${businessDetails.designator}`.trim(),
          business_type: selectedEntity,
          state: selectedState,
          status: "pending_payment",
          application_data: {
            mode,
            guidedScheduling: "inside",
            package: selectedPackage,
            addOns: selectedAddOns,
            addonQuantities,
            businessDetails,
            serviceDetails: mode === "whiteglove" ? serviceDetails : null,
            stateFee,
            estimatedTotal: runningTotal(),
            paymentStatus: "pending",
            source: "order-flow",
          } as any,
        }])
        .select("id")
        .single();
      if (error) throw error;
      const newId = data?.id ?? null;
      if (newId) setApplicationId(newId);
      return newId;
    } catch (err) {
      console.error("Failed to save order:", err);
      return null;
    }
  };

  const handleCheckoutStarted = async (): Promise<string | null> => {
    // Reuse the application row across checkout retries within the same session
    if (applicationId) return applicationId;
    return await saveOrderToDb();
  };

  // Hard guard: bounce to /pricing when guided flow is opened without a valid package.
  if (missingPackage) {
    return <Navigate to="/pricing" replace />;
  }

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead title="Order Flow" description="Complete your business formation order with EZ BIZ FILE SERVICE." path="/order-flow" noIndex />
      <Navigation />

      <div className="flex-grow bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-center gap-3 mb-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-center">
                Start Your Business Formation
              </h1>
              <Badge
                variant="outline"
                className={mode === "whiteglove"
                  ? "border-primary/30 bg-primary/10 text-primary"
                  : "border-secondary/30 bg-secondary/10 text-secondary"
                }
              >
                {mode === "whiteglove" ? (
                  <><Car className="h-3 w-3 mr-1" /> White Glove</>
                ) : (
                  <><MessageCircle className="h-3 w-3 mr-1" /> Guided</>
                )}
              </Badge>
            </div>
            <p className="text-center text-muted-foreground mb-6">
              Complete your order in {steps.length} simple steps
              {mode === "whiteglove" ? " (White Glove)" : " (Guided)"}
            </p>

            <OrderStepIndicator currentStep={currentStep} steps={steps} />

            {/* Running Total Bar (steps 2+) */}
            {currentStep >= 2 && selectedPackage && (
              <div className="mt-4 p-3 rounded-lg bg-card border flex items-center justify-between text-sm">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-medium">{selectedState}</span>
                  <span className="text-muted-foreground">•</span>
                  <span>{PACKAGE_PRICES[selectedPackage as PackageType]?.name}</span>
                  {selectedAddOns.length > 0 && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span>{selectedAddOns.length} add-on{selectedAddOns.length > 1 ? "s" : ""}</span>
                    </>
                  )}
                </div>
                <span className="font-bold text-primary text-lg">${runningTotal()}</span>
              </div>
            )}

            <Card className="mt-6 p-4 sm:p-6">
              {/* Step 1: State Selection */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-4">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-2">Where are you forming your business?</h2>
                    <p className="text-muted-foreground">Select the state where you'd like to register</p>
                  </div>
                  <StateSelector
                    selected={selectedState}
                    onSelect={setSelectedState}
                    slotAfterPopular={
                      <VeteranEligibilityGate
                        isVeteran={isVeteran}
                        setIsVeteran={setIsVeteran}
                        isFormedInTexas2022={isFormedInTexas2022}
                        setIsFormedInTexas2022={setIsFormedInTexas2022}
                      />
                    }
                  />
                  <div className="flex justify-end">
                    <Button onClick={goNext} disabled={!isStepValid(1)}>Continue</Button>
                  </div>
                </div>
              )}

              {/* Step 2: Entity + Package + Add-ons */}
              {currentStep === 2 && (
                <div className="space-y-8">
                  <div className="text-center mb-4">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-2">Choose Your Entity & Package</h2>
                    <p className="text-muted-foreground">Select your business structure and service level</p>
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Entity Type</h3>
                    <EntityTypeSelector selected={selectedEntity} onSelect={setSelectedEntity} />
                  </div>

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold">Service Package</h3>
                    <PackageSelector selected={selectedPackage} onSelect={setSelectedPackage} stateFees={stateFee} />
                  </div>

                  <div className="border-t pt-6">
                    <AddOnServices
                      selected={selectedAddOns}
                      onToggle={handleToggleAddon}
                      quantities={addonQuantities}
                      onQuantityChange={(id, qty) => setAddonQuantities(prev => ({ ...prev, [id]: qty }))}
                    />
                  </div>

                  {/* Processing Speed */}
                  <div className="border-t pt-6 space-y-4">
                    <h3 className="text-lg font-semibold flex items-center gap-2">
                      <Zap className="h-5 w-5 text-primary" /> Processing Speed
                    </h3>
                    <RadioGroup
                      value={processingSpeed}
                      onValueChange={(v) => setProcessingSpeed(v as ProcessingType)}
                      className="space-y-2"
                    >
                      {(Object.entries(PROCESSING_PRICES) as [ProcessingType, typeof PROCESSING_PRICES[ProcessingType]][]).map(
                        ([key, speed]) => (
                          <div
                            key={key}
                            className={`flex items-center space-x-3 p-4 rounded-lg border cursor-pointer transition-colors ${
                              processingSpeed === key ? "border-primary bg-primary/5" : "hover:bg-muted/50"
                            }`}
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
                  </div>

                  <div className="flex justify-between">
                    <Button onClick={goBack} variant="outline">Back</Button>
                    <Button onClick={goNext} disabled={!isStepValid(2)}>Continue</Button>
                  </div>
                </div>
              )}

              {/* Step 3: Business Details (+ White Glove service details) */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-4">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-2">Tell Us About Your Business</h2>
                    <p className="text-muted-foreground">Provide the details for your formation documents</p>
                  </div>

                  {mode === "whiteglove" && (
                    <Card className="p-4 sm:p-5 border-primary/20 bg-primary/[0.03] space-y-4">
                      <div>
                        <h3 className="text-lg font-semibold flex items-center gap-2">
                          <Car className="h-5 w-5 text-primary" />
                          White Glove Service Details
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1">
                          Where should we meet, and when? (Required for White Glove)
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="meetingLocation" className="flex items-center gap-1.5">
                            <MapPin className="h-3.5 w-3.5" /> Meeting Location *
                          </Label>
                          <Input
                            id="meetingLocation"
                            value={serviceDetails.meetingLocation}
                            onChange={(e) =>
                              setServiceDetails((s) => ({ ...s, meetingLocation: e.target.value }))
                            }
                            placeholder="e.g. 123 Main St, San Antonio, TX"
                          />
                        </div>
                        <div>
                          <Label htmlFor="preferredDateTime" className="flex items-center gap-1.5">
                            <Clock className="h-3.5 w-3.5" /> Preferred Date / Time *
                          </Label>
                          <Input
                            id="preferredDateTime"
                            value={serviceDetails.preferredDateTime}
                            onChange={(e) =>
                              setServiceDetails((s) => ({ ...s, preferredDateTime: e.target.value }))
                            }
                            placeholder="e.g. Tuesday 3/4 at 2 PM"
                          />
                        </div>
                      </div>

                      <div>
                        <Label htmlFor="serviceNotes">Notes (optional)</Label>
                        <Textarea
                          id="serviceNotes"
                          value={serviceDetails.notes}
                          onChange={(e) =>
                            setServiceDetails((s) => ({ ...s, notes: e.target.value }))
                          }
                          placeholder="Gate codes, parking info, special requests…"
                          rows={2}
                        />
                      </div>

                      <p className="text-xs text-muted-foreground">
                        White Glove service fee:{" "}
                        <span className="font-medium">${formatPrice(WHITE_GLOVE_BASE)} for the first 2 hours</span> +{" "}
                        <span className="font-medium">$80/hr</span> after. Currently serving the San Antonio metro area.
                      </p>
                    </Card>
                  )}

                  <BusinessDetailsForm
                    data={businessDetails}
                    entityType={selectedEntity}
                    state={selectedState}
                    onChange={setBusinessDetails}
                  />

                  <div className="flex justify-between">
                    <Button onClick={goBack} variant="outline">Back</Button>
                    <Button onClick={goNext} disabled={!isStepValid(3)}>Continue</Button>
                  </div>
                </div>
              )}

              {/* Step 4: Account */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="text-center mb-4">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-2">Create Your Account</h2>
                    <p className="text-muted-foreground">Sign up to track your order progress</p>
                  </div>
                  <AccountStep onAuthenticated={() => setCurrentStep(5)} />
                  <div className="flex justify-start">
                    <Button onClick={goBack} variant="outline">Back</Button>
                  </div>
                </div>
              )}

              {/* Step 5: Review & Checkout */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="text-center mb-4">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-2">Review Your Order</h2>
                    <p className="text-muted-foreground">Confirm your details before checkout</p>
                  </div>
                  <ReviewStep
                    state={selectedState}
                    entityType={selectedEntity}
                    selectedPackage={selectedPackage}
                    selectedAddOns={selectedAddOns}
                    addonQuantities={addonQuantities}
                    businessDetails={businessDetails}
                    processingSpeed={processingSpeed}
                    mode={mode}
                    serviceDetails={mode === "whiteglove" ? serviceDetails : undefined}
                    onEdit={(step) => setCurrentStep(step)}
                    onCheckoutStarted={handleCheckoutStarted}
                  />
                  <div className="flex justify-start">
                    <Button onClick={() => setCurrentStep(user ? 3 : 4)} variant="outline">Back</Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EnhancedOrderFlow;
