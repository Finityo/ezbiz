import SEOHead from "@/components/SEOHead";
import { useState, useEffect } from "react";
import { useNavigate, useSearchParams, Navigate } from "react-router-dom";
import FilingPathStep from "@/components/order/FilingPathStep";

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
import { isAddonIncludedInPackage } from "@/lib/package-config";

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

export type FilingPath = "standard" | "texas_veteran_waiver";

const EnhancedOrderFlow = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const mode: OrderMode = normalizeMode(searchParams.get("mode"));

  // Filing-path selector. Driven by URL (?path=) so the choice survives reloads
  // and so direct links from CTAs (e.g. /order-flow?path=texas_veteran_waiver)
  // skip the picker.
  const urlPath = searchParams.get("path");
  const initialFilingPath: FilingPath | null =
    urlPath === "texas_veteran_waiver" ? "texas_veteran_waiver"
    : urlPath === "standard" ? "standard"
    : null;
  const [filingPath, setFilingPath] = useState<FilingPath | null>(initialFilingPath);
  const isWaiver = filingPath === "texas_veteran_waiver";

  // Guard: in guided mode the URL MUST include a valid package param.
  // Waiver path picks its package inside the wizard, so don't bounce to /pricing.
  const rawPackage = searchParams.get("package");
  const isValidPackage =
    !!rawPackage && Object.prototype.hasOwnProperty.call(PACKAGE_PRICES, rawPackage);
  const requiresPackage = mode !== "whiteglove" && !isWaiver;
  const missingPackage = requiresPackage && !isValidPackage && filingPath !== null;

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

  // Waiver path skips the state step (TX locked) and starts at Package.
  const [currentStep, setCurrentStep] = useState(isWaiver ? 2 : 1);
  const [selectedState, setSelectedState] = useState(
    isWaiver ? "TX" : (searchParams.get("state") || "")
  );
  const [selectedEntity, setSelectedEntity] = useState(searchParams.get("entity") || "llc");
  const [selectedPackage, setSelectedPackage] = useState(searchParams.get("package") || "");
  const [isVeteran, setIsVeteran] = useState(isWaiver);
  const [isFormedInTexas2022, setIsFormedInTexas2022] = useState(isWaiver);

  const [selectedAddOns, setSelectedAddOns] = useState<string[]>(() => {
    const raw = searchParams.get("addons");
    if (!raw) return [];
    return raw
      .split(",")
      .map((s) => s.trim())
      .filter((id) => id && Object.prototype.hasOwnProperty.call(ADDON_PRICES, id));
  });
  const [addonQuantities, setAddonQuantities] = useState<AddonQuantities>({});
  const [processingSpeed, setProcessingSpeed] = useState<ProcessingType>("standard");
  const [businessDetails, setBusinessDetails] = useState<BusinessDetails>({
    businessName: "",
    designator: "",
    alternateName: "",
    businessPurpose: "",
    businessDescription: "",
    organizerType: "",
    delayedFiling: false,
    address: "",
    city: "",
    zipCode: "",
    managementStructure: "",
    contactFirstName: "",
    contactLastName: "",
    contactPhone: "",
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
          businessDetails.businessPurpose &&
          businessDetails.organizerType &&
          businessDetails.address &&
          businessDetails.city &&
          businessDetails.zipCode &&
          businessDetails.contactFirstName &&
          businessDetails.contactLastName &&
          businessDetails.contactPhone &&
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
      // Already logged in: waiver → create draft + dashboard, standard → Review
      if (isWaiver) {
        void handleWaiverDraftAndRedirect();
        return;
      }
      setCurrentStep(5);
    } else {
      setCurrentStep((s) => Math.min(s + 1, 5));
    }
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const goBack = () => {
    // Waiver path starts at step 2 — don't let users drop back into the locked-TX state step
    const min = isWaiver ? 2 : 1;
    setCurrentStep((s) => Math.max(s - 1, min));
    window.scrollTo({ top: 0, behavior: "smooth" });
  };


  const handleToggleAddon = (addonId: string) => {
    setSelectedAddOns((prev) =>
      prev.includes(addonId) ? prev.filter((id) => id !== addonId) : [...prev, addonId]
    );
  };

  const [applicationId, setApplicationId] = useState<string | null>(null);
  const [orderId, setOrderId] = useState<string | null>(null);

  type CheckoutIds = { orderId: string | null; applicationId: string | null };

  const saveOrderToDb = async (): Promise<CheckoutIds> => {
    if (!user) return { orderId: null, applicationId: null };
    try {
      const total = runningTotal();
      const fullBusinessName = `${businessDetails.businessName} ${businessDetails.designator}`.trim();

      // 1) Orders row — source of truth for the admin dashboard
      const { data: orderRow, error: orderErr } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          email: user.email,
          entity_type: selectedEntity,
          package: selectedPackage,
          package_id: selectedPackage,
          state: selectedState,
          state_fee: stateFee,
          total_amount: total,
          filing_speed: processingSpeed,
          ein_service: selectedAddOns.includes("ein"),
          status: "Pending Payment",
        })
        .select("id")
        .single();

      if (orderErr) throw orderErr;
      const newOrderId = orderRow?.id as string;
      setOrderId(newOrderId);

      // 2) Normalized child rows — these populate the admin "Order Detail" dialog
      //    and the CorpNet CSV / account-manager handoff email.
      const childWrites = await Promise.all([
        supabase.from("business_information").insert({
          order_id: newOrderId,
          company_name: fullBusinessName,
          alternate_company_name: businessDetails.alternateName || null,
          business_purpose: businessDetails.businessPurpose || null,
          business_description: businessDetails.businessDescription || null,
          organizer_type: businessDetails.organizerType || null,
          delayed_filing: !!businessDetails.delayedFiling,
        }),
        supabase.from("contact_information").insert({
          order_id: newOrderId,
          first_name: businessDetails.contactFirstName || null,
          last_name: businessDetails.contactLastName || null,
          email: user.email || null,
          phone: businessDetails.contactPhone || null,
        }),
        supabase.from("addresses").insert({
          order_id: newOrderId,
          type: "business",
          address1: businessDetails.address || null,
          city: businessDetails.city || null,
          state: selectedState || null,
          zip: businessDetails.zipCode || null,
          country: "US",
        }),
        selectedEntity === "llc"
          ? supabase.from("company_management").insert({
              order_id: newOrderId,
              management_type:
                businessDetails.managementStructure === "manager-managed"
                  ? "manager_managed"
                  : "member_managed",
            })
          : Promise.resolve({ error: null } as any),
      ]);
      childWrites.forEach((r: any) => {
        if (r?.error) console.error("Normalized child write failed:", r.error);
      });

      // 3) Keep legacy business_applications row for back-compat with the
      //    Stripe webhook resolver chain (orderId → application_id → session_id).
      const { data: appRow, error: appErr } = await supabase
        .from("business_applications")
        .insert([{
          user_id: user.id,
          business_name: fullBusinessName,
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
            estimatedTotal: total,
            paymentStatus: "pending",
            source: "order-flow",
            order_id: newOrderId,
          } as any,
        }])
        .select("id")
        .single();

      if (appErr) throw appErr;
      const newAppId = appRow?.id ?? null;
      if (newAppId) setApplicationId(newAppId);

      // 4) Link application_id back onto orders so the webhook can resolve either way
      if (newAppId) {
        await supabase
          .from("orders")
          .update({ application_id: newAppId })
          .eq("id", newOrderId);
      }

      return { orderId: newOrderId, applicationId: newAppId };
    } catch (err) {
      console.error("Failed to save order:", err);
      return { orderId: null, applicationId: null };
    }
  };

  const handleCheckoutStarted = async (): Promise<CheckoutIds> => {
    // Reuse the rows across checkout retries within the same session
    if (orderId || applicationId) {
      return { orderId, applicationId };
    }
    return await saveOrderToDb();
  };

  /**
   * WAIVER PATH: persist a draft order + business_applications row marked
   * `waiver_documents_pending` and bounce the user to the dashboard to
   * upload their TVC letter + Form 05-904. Checkout is intentionally NOT
   * triggered here — the state fee can only be waived after admin approval,
   * verified server-side in the create-checkout edge function.
   */
  const handleWaiverDraftAndRedirect = async () => {
    if (!user) {
      setCurrentStep(4);
      return;
    }
    try {
      const total = runningTotal();
      const fullBusinessName = `${businessDetails.businessName} ${businessDetails.designator}`.trim();
      const originalStateFee = stateFee || 300;

      const { data: orderRow, error: orderErr } = await supabase
        .from("orders")
        .insert({
          user_id: user.id,
          email: user.email,
          entity_type: selectedEntity,
          package: selectedPackage,
          package_id: selectedPackage,
          state: "TX",
          state_fee: originalStateFee,
          total_amount: total,
          filing_speed: processingSpeed,
          ein_service: selectedAddOns.includes("ein"),
          status: "waiver_documents_pending",
        })
        .select("id")
        .single();
      if (orderErr) throw orderErr;
      const newOrderId = orderRow!.id as string;
      setOrderId(newOrderId);

      // Best-effort normalized writes (mirrors saveOrderToDb)
      await Promise.all([
        supabase.from("business_information").insert({
          order_id: newOrderId,
          company_name: fullBusinessName,
          alternate_company_name: businessDetails.alternateName || null,
          business_purpose: businessDetails.businessPurpose || null,
          business_description: businessDetails.businessDescription || null,
          organizer_type: businessDetails.organizerType || null,
          delayed_filing: !!businessDetails.delayedFiling,
        }),
        supabase.from("contact_information").insert({
          order_id: newOrderId,
          first_name: businessDetails.contactFirstName || null,
          last_name: businessDetails.contactLastName || null,
          email: user.email || null,
          phone: businessDetails.contactPhone || null,
        }),
        supabase.from("addresses").insert({
          order_id: newOrderId,
          type: "business",
          address1: businessDetails.address || null,
          city: businessDetails.city || null,
          state: "TX",
          zip: businessDetails.zipCode || null,
          country: "US",
        }),
      ]);

      const { data: appRow, error: appErr } = await supabase
        .from("business_applications")
        .insert([{
          user_id: user.id,
          business_name: fullBusinessName,
          business_type: selectedEntity,
          state: "TX",
          status: "waiver_documents_pending",
          application_data: {
            filingPath: "texas_veteran_waiver",
            package: selectedPackage,
            addOns: selectedAddOns,
            addonQuantities,
            businessDetails,
            originalStateFee,
            waivedStateFee: false,
            estimatedTotal: total,
            paymentStatus: "pending",
            source: "order-flow",
            orderId: newOrderId,
          } as any,
        }])
        .select("id")
        .single();
      if (appErr) throw appErr;
      const newAppId = appRow!.id as string;
      setApplicationId(newAppId);

      await supabase.from("orders").update({ application_id: newAppId }).eq("id", newOrderId);
      await supabase.from("order_events").insert({
        order_id: newOrderId,
        event_type: "waiver_draft_created",
        actor: "customer",
        metadata: { application_id: newAppId, filingPath: "texas_veteran_waiver" } as any,
      });

      toast.success("Draft saved. Please upload your waiver documents in your dashboard.");
      navigate("/dashboard");
    } catch (err) {
      console.error("Failed to save waiver draft:", err);
      toast.error("Couldn't save your waiver draft. Please try again.");
    }
  };

  const handleAccountComplete = () => {
    if (isWaiver) {
      void handleWaiverDraftAndRedirect();
    } else {
      setCurrentStep(5);
    }
  };



  // Hard guard: bounce to /pricing when guided flow is opened without a valid package.
  if (missingPackage) {
    return <Navigate to="/pricing" replace />;
  }

  // Filing-path picker (Step 0) — only when the user hasn't chosen yet AND
  // didn't deep-link with ?package=… (legacy entry points still go straight
  // through the Standard flow for back-compat).
  const showFilingPathPicker =
    filingPath === null && !isValidPackage && mode !== "whiteglove";
  if (showFilingPathPicker) {
    return (
      <div className="min-h-screen flex flex-col">
        <SEOHead title="Choose Filing Path" description="Choose your business formation path." path="/order-flow" noIndex />
        <Navigation />
        <div className="flex-grow bg-gradient-to-br from-primary/5 via-background to-accent/5">
          <div className="container mx-auto px-4 py-10">
            <div className="max-w-3xl mx-auto">
              <FilingPathStep
                onSelect={(path) => {
                  if (path === "standard") {
                    // Standard flow picks package on /pricing
                    navigate("/pricing");
                  } else {
                    // Waiver: lock filingPath + TX, drop user into Package step
                    const next = new URLSearchParams(searchParams);
                    next.set("path", "texas_veteran_waiver");
                    next.set("state", "TX");
                    setSearchParams(next, { replace: true });
                    setFilingPath("texas_veteran_waiver");
                    setSelectedState("TX");
                    setIsVeteran(true);
                    setIsFormedInTexas2022(true);
                    setCurrentStep(2);
                  }
                }}
              />
            </div>
          </div>
        </div>
        <Footer />
      </div>
    );
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
              {isWaiver && (
                <Badge className="bg-secondary/20 text-secondary border-secondary/40">
                  🇺🇸 Texas Veteran Waiver
                </Badge>
              )}
            </div>
            <p className="text-center text-muted-foreground mb-6">
              {isWaiver
                ? "Pick your package and details — we'll review your waiver documents before any payment."
                : `Complete your order in ${steps.length} simple steps${mode === "whiteglove" ? " (White Glove)" : " (Guided)"}`}
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
                    <PackageSelector
                      selected={selectedPackage}
                      onSelect={(pkgId) => {
                        setSelectedPackage(pkgId);
                        // Auto-prune any add-ons that become bundled into the new package
                        // so customers never get double-charged for an included service.
                        setSelectedAddOns((prev) =>
                          prev.filter((id) => !isAddonIncludedInPackage(pkgId, id)),
                        );
                      }}
                      stateFees={stateFee}
                    />
                  </div>

                  <div className="border-t pt-6">
                    <AddOnServices
                      selectedPackage={selectedPackage}
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
                  <AccountStep onAuthenticated={handleAccountComplete} />
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
