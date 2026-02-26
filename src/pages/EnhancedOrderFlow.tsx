import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import type { AddonQuantities } from "@/components/order/AddOnServices";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import OrderStepIndicator from "@/components/order/OrderStepIndicator";
import StateSelector from "@/components/order/StateSelector";
import EntityTypeSelector from "@/components/order/EntityTypeSelector";
import PackageSelector from "@/components/order/PackageSelector";
import AddOnServices from "@/components/order/AddOnServices";
import BusinessDetailsForm, { type BusinessDetails } from "@/components/order/BusinessDetailsForm";
import AccountStep from "@/components/order/AccountStep";
import ReviewStep from "@/components/order/ReviewStep";
import { STRIPE_PACKAGES, STRIPE_ADDONS, type PackageId, type AddonId } from "@/lib/stripe-config";
import { getStateFee } from "@/lib/state-fees";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "sonner";

const steps = ["State", "Package", "Details", "Account", "Review"];

const EnhancedOrderFlow = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { user } = useAuth();

  const [currentStep, setCurrentStep] = useState(1);
  const [selectedState, setSelectedState] = useState(searchParams.get("state") || "");
  const [selectedEntity, setSelectedEntity] = useState(searchParams.get("entity") || "llc");
  const [selectedPackage, setSelectedPackage] = useState(searchParams.get("package") || "");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [addonQuantities, setAddonQuantities] = useState<AddonQuantities>({});
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails>({
    businessName: "",
    designator: "",
    address: "",
    city: "",
    zipCode: "",
    managementStructure: "",
  });

  const stateFee = selectedState ? getStateFee(selectedState) : 0;

  // Running total for sticky bar
  const calculateTotal = () => {
    const pkg = selectedPackage ? STRIPE_PACKAGES[selectedPackage as PackageId] : null;
    const basePrice = pkg?.price || 0;
    const addonsTotal = selectedAddOns.reduce((sum, id) => {
      const addon = STRIPE_ADDONS[id as AddonId];
      const qty = addonQuantities[id] || 1;
      return sum + (addon?.price || 0) * qty;
    }, 0);
    return basePrice + addonsTotal + stateFee;
  };

  const isStepValid = (step: number): boolean => {
    switch (step) {
      case 1: return !!selectedState;
      case 2: return !!selectedPackage && !!selectedEntity;
      case 3: return !!(businessDetails.businessName && businessDetails.designator &&
        businessDetails.address && businessDetails.city && businessDetails.zipCode &&
        (selectedEntity !== "llc" || businessDetails.managementStructure));
      case 4: return !!user;
      default: return false;
    }
  };

  const goNext = () => {
    // If user is already logged in and we're going to step 4, skip to 5
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
          package: selectedPackage,
          addOns: selectedAddOns,
          businessDetails,
          stateFee,
        } as any,
      }]);
    } catch (err) {
      console.error("Failed to save order:", err);
    }
  };

  const handleCheckoutStarted = async () => {
    await saveOrderToDb();
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />

      <div className="flex-grow bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 py-6 sm:py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl sm:text-3xl font-bold text-center mb-1">
              Start Your Business Formation
            </h1>
            <p className="text-center text-muted-foreground mb-6">
              Complete your order in {steps.length} simple steps
            </p>

            <OrderStepIndicator currentStep={currentStep} steps={steps} />

            {/* Running Total Bar (steps 2+) */}
            {currentStep >= 2 && selectedPackage && (
              <div className="mt-4 p-3 rounded-lg bg-card border flex items-center justify-between text-sm">
                <div className="flex items-center gap-3 flex-wrap">
                  <span className="font-medium">{selectedState}</span>
                  <span className="text-muted-foreground">•</span>
                  <span>{STRIPE_PACKAGES[selectedPackage as PackageId]?.name}</span>
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
              {/* Step 1: State Selection */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-4">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-2">Where are you forming your business?</h2>
                    <p className="text-muted-foreground">Select the state where you'd like to register</p>
                  </div>
                  <StateSelector selected={selectedState} onSelect={setSelectedState} />
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
                    <AddOnServices selected={selectedAddOns} onToggle={handleToggleAddon} quantities={addonQuantities} onQuantityChange={(id, qty) => setAddonQuantities(prev => ({ ...prev, [id]: qty }))} />
                  </div>

                  <div className="flex justify-between">
                    <Button onClick={goBack} variant="outline">Back</Button>
                    <Button onClick={goNext} disabled={!isStepValid(2)}>Continue</Button>
                  </div>
                </div>
              )}

              {/* Step 3: Business Details */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-4">
                    <h2 className="text-xl sm:text-2xl font-semibold mb-2">Tell Us About Your Business</h2>
                    <p className="text-muted-foreground">Provide the details for your formation documents</p>
                  </div>
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
