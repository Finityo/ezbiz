import { useState, useEffect, useCallback } from "react";
import { useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import type { AddonQuantities } from "@/components/order/AddOnServices";
import VeteranEligibilityGate from "@/components/order/VeteranEligibilityGate";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import OrderStepIndicator from "@/components/order/OrderStepIndicator";
import StateSelector from "@/components/order/StateSelector";
import EntityTypeSelector from "@/components/order/EntityTypeSelector";
import PackageSelector from "@/components/order/PackageSelector";
import AddOnServices from "@/components/order/AddOnServices";
import BusinessDetailsForm, { type BusinessDetails } from "@/components/order/BusinessDetailsForm";
import OwnerMemberForm, { type OwnerMember } from "@/components/order/OwnerMemberForm";
import WhiteGloveSchedulingStep, { type WhiteGloveSchedulingData } from "@/components/order/WhiteGloveSchedulingStep";
import PricingConfirmationStep from "@/components/order/PricingConfirmationStep";
import GuidedReviewStep from "@/components/order/GuidedReviewStep";
import AccountStep from "@/components/order/AccountStep";
import ReviewStep from "@/components/order/ReviewStep";
import { STRIPE_PACKAGES, STRIPE_ADDONS, type PackageId, type AddonId } from "@/lib/stripe-config";
import { getStateFee, getCorpStateFee } from "@/lib/state-fees";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { trackOrderFlowView, trackFormStart, trackEvent } from "@/lib/analytics";
import { Car, MessageCircle } from "lucide-react";

export type OrderMode = "guided" | "whiteglove";

function normalizeMode(value: string | null): OrderMode {
  return value === "whiteglove" ? "whiteglove" : "guided";
}

const WHITE_GLOVE_BASE_FEE = 150;

// Guided: Entity+State → Business Details → Owners → Add-ons → Review+Schedule
const GUIDED_STEPS = ["Entity & State", "Business", "Owners", "Add-ons", "Review"];
// White Glove: Scheduling → Entity+State → Business → Owners → Add-ons → Pricing
const WHITEGLOVE_STEPS = ["Scheduling", "Entity & State", "Business", "Owners", "Add-ons", "Pricing"];

const emptyMember: OwnerMember = {
  fullName: "", email: "", phone: "", address: "", city: "", state: "", zipCode: "", ownershipPercentage: "",
};

const EnhancedOrderFlow = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const mode: OrderMode = normalizeMode(searchParams.get("mode"));

  const steps = mode === "whiteglove" ? WHITEGLOVE_STEPS : GUIDED_STEPS;
  const totalSteps = steps.length;

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedState, setSelectedState] = useState(searchParams.get("state") || "");
  const [selectedEntity, setSelectedEntity] = useState(searchParams.get("entity") || "llc");
  const [selectedPackage, setSelectedPackage] = useState(searchParams.get("package") || "");
  const [isVeteran, setIsVeteran] = useState(false);
  const [isFormedInTexas2022, setIsFormedInTexas2022] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [addonQuantities, setAddonQuantities] = useState<AddonQuantities>({});
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails>({
    businessName: "", designator: "", address: "", city: "", zipCode: "", managementStructure: "",
  });
  const [members, setMembers] = useState<OwnerMember[]>([{ ...emptyMember }]);
  const [whiteGloveScheduling, setWhiteGloveScheduling] = useState<WhiteGloveSchedulingData>({
    city: "", zipCode: "", meetingPlaceType: "", meetingPlaceDetails: "",
    preferredDate: undefined, preferredTime: "", notes: "",
  });

  useEffect(() => { trackOrderFlowView(); }, []);

  const isCorpType = ["c-corp", "s-corp", "nonprofit", "professional-corp"].includes(selectedEntity);
  const stateFee = selectedState ? (isCorpType ? getCorpStateFee(selectedState) : getStateFee(selectedState)) : 0;
  const isVeteranEligible = isVeteran && isFormedInTexas2022 && selectedState === "Texas";

  const calculateTotal = () => {
    const pkg = selectedPackage ? STRIPE_PACKAGES[selectedPackage as PackageId] : null;
    const basePrice = pkg?.price || 0;
    const addonsTotal = selectedAddOns.reduce((sum, id) => {
      const addon = STRIPE_ADDONS[id as AddonId];
      const qty = addonQuantities[id] || 1;
      return sum + (addon?.price || 0) * qty;
    }, 0);
    const wgFee = mode === "whiteglove" ? WHITE_GLOVE_BASE_FEE : 0;
    return basePrice + addonsTotal + stateFee + wgFee;
  };

  // --- Step name helpers for current mode ---
  const currentStepName = steps[currentStep - 1];

  const isStepValid = (): boolean => {
    switch (currentStepName) {
      case "Scheduling":
        return !!(whiteGloveScheduling.city && whiteGloveScheduling.zipCode &&
          whiteGloveScheduling.meetingPlaceType && whiteGloveScheduling.preferredDate &&
          whiteGloveScheduling.preferredTime);
      case "Entity & State":
        return !!selectedState && !!selectedEntity && !!selectedPackage;
      case "Business":
        return !!(businessDetails.businessName && businessDetails.designator &&
          businessDetails.address && businessDetails.city && businessDetails.zipCode &&
          (selectedEntity !== "llc" || businessDetails.managementStructure));
      case "Owners":
        return members.length > 0 && members.every(m => m.fullName && m.email && m.phone && m.address && m.city && m.state && m.zipCode);
      case "Add-ons":
        return true; // add-ons are optional
      case "Review":
      case "Pricing":
        return true;
      default:
        return false;
    }
  };

  const goNext = () => {
    if (currentStepName === "Business") trackFormStart("order_business_details");
    setCurrentStep((s) => Math.min(s + 1, totalSteps));
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

  const saveOrderToDb = async () => {
    if (!user) return;
    try {
      await supabase.from("business_applications").insert([{
        user_id: user.id,
        business_name: `${businessDetails.businessName} ${businessDetails.designator}`.trim(),
        business_type: selectedEntity,
        state: selectedState,
        status: "pending",
        application_data: {
          mode,
          package: selectedPackage,
          addOns: selectedAddOns,
          addonQuantities,
          businessDetails,
          members,
          stateFee,
          isVeteranEligible,
          ...(mode === "whiteglove" ? { whiteGloveScheduling, whiteGloveFee: WHITE_GLOVE_BASE_FEE } : {}),
        } as any,
      }]);
    } catch (err) {
      console.error("Failed to save order:", err);
    }
  };

  const handleCheckoutStarted = async () => {
    await saveOrderToDb();
  };

  // --- Render step content ---
  const renderStepContent = () => {
    switch (currentStepName) {
      case "Scheduling":
        return (
          <div className="space-y-6">
            <StepHeader
              title="Where & When Should We Meet?"
              subtitle="Tell us your location and preferred appointment time"
            />
            <WhiteGloveSchedulingStep data={whiteGloveScheduling} onChange={setWhiteGloveScheduling} />
          </div>
        );

      case "Entity & State":
        return (
          <div className="space-y-8">
            <StepHeader
              title="Choose Your Entity, State & Package"
              subtitle="Select your business structure, formation state, and service level"
            />
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Entity Type</h3>
              <EntityTypeSelector selected={selectedEntity} onSelect={setSelectedEntity} />
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Formation State</h3>
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
            </div>
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Service Package</h3>
              <PackageSelector selected={selectedPackage} onSelect={setSelectedPackage} stateFees={stateFee} />
            </div>
          </div>
        );

      case "Business":
        return (
          <div className="space-y-6">
            <StepHeader
              title="Tell Us About Your Business"
              subtitle="Provide the details for your formation documents"
            />
            <BusinessDetailsForm
              data={businessDetails}
              entityType={selectedEntity}
              state={selectedState}
              onChange={setBusinessDetails}
            />
          </div>
        );

      case "Owners":
        return (
          <div className="space-y-6">
            <StepHeader
              title="Owner / Member Information"
              subtitle="Add each owner or member who will be listed on the formation"
            />
            <OwnerMemberForm members={members} onChange={setMembers} entityType={selectedEntity} />
          </div>
        );

      case "Add-ons":
        return (
          <div className="space-y-6">
            <StepHeader
              title="Optional Add-On Services"
              subtitle="Enhance your filing with these popular services"
            />
            <AddOnServices
              selected={selectedAddOns}
              onToggle={handleToggleAddon}
              quantities={addonQuantities}
              onQuantityChange={(id, qty) => setAddonQuantities(prev => ({ ...prev, [id]: qty }))}
            />
          </div>
        );

      case "Review":
        return (
          <div className="space-y-6">
            <StepHeader
              title="Review & Schedule"
              subtitle="Confirm your details, then schedule your guided call"
            />
            <GuidedReviewStep
              state={selectedState}
              entityType={selectedEntity}
              selectedPackage={selectedPackage}
              selectedAddOns={selectedAddOns}
              addonQuantities={addonQuantities}
              businessDetails={businessDetails}
              members={members}
              onEdit={(step) => setCurrentStep(step)}
              onCheckoutStarted={handleCheckoutStarted}
            />
          </div>
        );

      case "Pricing":
        return (
          <div className="space-y-6">
            <StepHeader
              title="Confirm Your Pricing"
              subtitle="Review fees and service costs before we finalize"
            />
            <PricingConfirmationStep
              selectedPackage={selectedPackage}
              selectedAddOns={selectedAddOns}
              addonQuantities={addonQuantities}
              stateFee={stateFee}
              stateName={selectedState}
              isVeteranEligible={isVeteranEligible}
            />
            <ReviewStep
              state={selectedState}
              entityType={selectedEntity}
              selectedPackage={selectedPackage}
              selectedAddOns={selectedAddOns}
              addonQuantities={addonQuantities}
              businessDetails={businessDetails}
              onEdit={(step) => setCurrentStep(step)}
              onCheckoutStarted={handleCheckoutStarted}
            />
          </div>
        );

      default:
        return null;
    }
  };

  // Don't show back/forward on final step (Review/Pricing have their own CTAs)
  const isFinalStep = currentStep === totalSteps;
  const isFirstStep = currentStep === 1;

  return (
    <div className="min-h-screen flex flex-col">
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
              Complete your order in {totalSteps} simple steps
            </p>

            <OrderStepIndicator currentStep={currentStep} steps={steps} />

            {/* Running Total Bar */}
            {selectedPackage && currentStep > (mode === "whiteglove" ? 2 : 1) && (
              <div className="mt-4 p-3 rounded-lg bg-card border flex items-center justify-between text-sm">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-medium">{selectedState}</span>
                  <span className="text-muted-foreground">•</span>
                  <span>{STRIPE_PACKAGES[selectedPackage as PackageId]?.name}</span>
                  {mode === "whiteglove" && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span className="text-primary font-medium">White Glove +${WHITE_GLOVE_BASE_FEE}</span>
                    </>
                  )}
                  {selectedAddOns.length > 0 && (
                    <>
                      <span className="text-muted-foreground">•</span>
                      <span>{selectedAddOns.length} add-on{selectedAddOns.length > 1 ? "s" : ""}</span>
                    </>
                  )}
                </div>
                <span className="font-bold text-primary text-lg">${calculateTotal()}</span>
              </div>
            )}

            <Card className="mt-6 p-4 sm:p-6">
              {renderStepContent()}

              {/* Navigation buttons (skip on final step which has its own CTA) */}
              {!isFinalStep && (
                <div className="flex justify-between mt-8">
                  {!isFirstStep ? (
                    <Button onClick={goBack} variant="outline">Back</Button>
                  ) : <div />}
                  <Button onClick={goNext} disabled={!isStepValid()}>Continue</Button>
                </div>
              )}
              {isFinalStep && !isFirstStep && (
                <div className="flex justify-start mt-6">
                  <Button onClick={goBack} variant="outline">Back</Button>
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

// Small helper component
const StepHeader = ({ title, subtitle }: { title: string; subtitle: string }) => (
  <div className="text-center mb-4">
    <h2 className="text-xl sm:text-2xl font-semibold mb-2">{title}</h2>
    <p className="text-muted-foreground">{subtitle}</p>
  </div>
);

export default EnhancedOrderFlow;
