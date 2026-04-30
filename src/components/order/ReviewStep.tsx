import * as React from "react";
import { formatPrice } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Edit2, Lock } from "lucide-react";
import { PACKAGE_PRICES, ADDON_PRICES, PROCESSING_PRICES, SHIPPING_PRICE, WHITE_GLOVE_BASE, type PackageType, type AddonId, type ProcessingType, calculateOrderTotal, getStripeLineItems } from "@/lib/pricing";
import { getStateFee, getCorpStateFee } from "@/lib/state-fees";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { trackCheckoutStart } from "@/lib/analytics";
import type { BusinessDetails } from "./BusinessDetailsForm";
import type { AddonQuantities } from "./AddOnServices";


type OrderMode = "guided" | "whiteglove";
type ServiceDetails = {
  meetingLocation: string;
  preferredDateTime: string;
  notes: string;
};

// WHITE_GLOVE_BASE is imported from @/lib/pricing

interface ReviewStepProps {
  state: string;
  entityType: string;
  selectedPackage: string;
  selectedAddOns: string[];
  addonQuantities: AddonQuantities;
  businessDetails: BusinessDetails;
  processingSpeed?: ProcessingType;
  mode?: OrderMode;
  serviceDetails?: ServiceDetails;
  onEdit: (step: number) => void;
  onCheckoutStarted: () => Promise<string | null> | string | null | void;
}

const ENTITY_LABELS: Record<string, string> = {
  llc: "LLC",
  "c-corp": "C Corporation",
  "s-corp": "S Corporation",
  nonprofit: "Nonprofit",
  "professional-corp": "Professional Corporation",
};

const CORP_ENTITIES = ["c-corp", "s-corp", "nonprofit", "professional-corp"];

const ReviewStep = ({
  state,
  entityType,
  selectedPackage,
  selectedAddOns,
  addonQuantities,
  businessDetails,
  processingSpeed = "standard",
  mode = "guided",
  serviceDetails,
  onEdit,
  onCheckoutStarted,
}: ReviewStepProps) => {
  const { checkout, loading, error, clearError } = useStripeCheckout();

  const pkg = PACKAGE_PRICES[selectedPackage as PackageType];
  const isCorpType = CORP_ENTITIES.includes(entityType);
  const stateFee = state
    ? isCorpType
      ? getCorpStateFee(state)
      : getStateFee(state)
    : 0;

  const speedConfig = PROCESSING_PRICES[processingSpeed];
  const speedFee = speedConfig?.price || 0;
  const shippingFee = SHIPPING_PRICE;

  const isWhiteGlove = mode === "whiteglove";

  const total = calculateOrderTotal(
    selectedPackage as PackageType,
    selectedAddOns,
    stateFee,
    processingSpeed,
    isWhiteGlove,
  );

  const handleCheckout = async () => {
    const lineItems = getStripeLineItems(
      selectedPackage as PackageType,
      selectedAddOns,
      processingSpeed,
      isWhiteGlove,
    );

    // Persist the business_application BEFORE starting Stripe so the webhook
    // can match `metadata.application_id` back to a real DB row.
    const appId = (await onCheckoutStarted()) || undefined;
    trackCheckoutStart(pkg?.name || selectedPackage, total);

    await checkout(lineItems, {
      stateFee: { amount: stateFee, stateName: state },
      successPath: "/dashboard?checkout=success",
      cancelPath: `/order-flow?mode=${mode}`,
      applicationId: appId,
    });
  };

  const Section = ({ title, step, children }: { title: string; step: number; children: React.ReactNode }) => (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-sm uppercase tracking-wider text-muted-foreground">{title}</h4>
        <Button variant="ghost" size="sm" onClick={() => onEdit(step)} className="text-primary h-7 px-2">
          <Edit2 className="h-3.5 w-3.5 mr-1" /> Edit
        </Button>
      </div>
      {children}
    </div>
  );

  return (
    <Card className="p-4 sm:p-6 space-y-5">
      {/* White Glove appointment details */}
      {isWhiteGlove && serviceDetails && (
        <>
          <Section title="White Glove Appointment" step={3}>
            <div className="space-y-1 text-sm">
              <p><span className="text-muted-foreground">Meeting Location:</span> {serviceDetails.meetingLocation}</p>
              <p><span className="text-muted-foreground">Preferred Date/Time:</span> {serviceDetails.preferredDateTime}</p>
              {serviceDetails.notes && (
                <p><span className="text-muted-foreground">Notes:</span> {serviceDetails.notes}</p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                White Glove base fee: ${formatPrice(WHITE_GLOVE_BASE)} (first 2 hours) — charged today.
                {" "}Overage: $80/hr after 2 hours — charged on-site.
              </p>
            </div>
          </Section>
          <Separator />
        </>
      )}

      <Section title="Formation" step={1}>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <p className="text-muted-foreground">State</p>
            <p className="font-medium">{state}</p>
          </div>
          <div>
            <p className="text-muted-foreground">Entity</p>
            <p className="font-medium">{ENTITY_LABELS[entityType] || entityType}</p>
          </div>
        </div>
      </Section>

      <Separator />

      <Section title="Package" step={2}>
        <p className="font-medium">
          {pkg?.name} Package — <span className="text-primary">${formatPrice(pkg?.price ?? 0)}</span>
        </p>
      </Section>

      <Separator />

      <Section title="Business Details" step={3}>
        <p className="font-medium">{businessDetails.businessName} {businessDetails.designator}</p>
        <p className="text-sm text-muted-foreground">
          {businessDetails.address}, {businessDetails.city}, {state} {businessDetails.zipCode}
        </p>
        {businessDetails.managementStructure && (
          <p className="text-sm text-muted-foreground capitalize">
            {businessDetails.managementStructure.replace("-", "-")}
          </p>
        )}
      </Section>

      {selectedAddOns.length > 0 && (
        <>
          <Separator />
          <Section title="Add-on Services" step={2}>
            <ul className="space-y-1">
              {selectedAddOns.map((id) => {
                const addon = ADDON_PRICES[id as AddonId];
                return addon ? (
                  <li key={id} className="flex justify-between text-sm">
                    <span>{addon.name}</span>
                    <span className="font-medium">${formatPrice(addon.price)}</span>
                  </li>
                ) : null;
              })}
            </ul>
          </Section>
        </>
      )}

      <Separator />

      {/* Price Breakdown */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm">
          <span>{pkg?.name} Package</span>
          <span>${formatPrice(pkg?.price || 0)}</span>
        </div>
        {selectedAddOns.map((id) => {
          const addon = ADDON_PRICES[id as AddonId];
          return addon ? (
            <div key={id} className="flex justify-between text-sm">
              <span>{addon.name}</span>
              <span>${formatPrice(addon.price)}</span>
            </div>
          ) : null;
        })}
        <div className="flex justify-between text-sm">
          <span>{state} Filing Fee</span>
          <span>${formatPrice(stateFee)}</span>
        </div>

        {speedFee > 0 && (
          <div className="flex justify-between text-sm">
            <span>{speedConfig.name}</span>
            <span>${formatPrice(speedFee)}</span>
          </div>
        )}

        <div className="flex justify-between text-sm">
          <span>Shipping & Handling</span>
          <span>${formatPrice(shippingFee)}</span>
        </div>

        {isWhiteGlove && (
          <div className="flex justify-between text-sm">
            <span>White Glove Mobile Service (First 2 Hours)</span>
            <span>${formatPrice(WHITE_GLOVE_BASE)}</span>
          </div>
        )}

        <Separator />
        <div className="flex justify-between text-lg font-bold">
          <span>Total (charged today)</span>
          <span className="text-primary">${formatPrice(total)}</span>
        </div>
        {isWhiteGlove && (
          <p className="text-xs text-muted-foreground">
            Overage ($80/hr after 2 hours) is charged on-site separately.
          </p>
        )}
      </div>

      {error && (
        <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive text-center">
          {error}
          <button onClick={clearError} className="ml-2 underline text-xs">Dismiss</button>
        </div>
      )}

      <Button onClick={handleCheckout} disabled={loading} className="w-full" size="lg">
        <Lock className="h-4 w-4 mr-2" />
        {loading ? "Processing..." : "Proceed to Stripe Checkout"}
      </Button>
      <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
        <Lock className="h-3 w-3" /> Secure payment powered by Stripe
      </p>
    </Card>
  );
};

export default ReviewStep;
