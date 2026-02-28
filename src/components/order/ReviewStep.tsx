import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Edit2, Lock, ExternalLink, Car, MapPin, Clock } from "lucide-react";
import { STRIPE_PACKAGES, STRIPE_ADDONS, type PackageId, type AddonId } from "@/lib/stripe-config";
import { getStateFee, getCorpStateFee } from "@/lib/state-fees";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { trackCheckoutStart } from "@/lib/analytics";
import type { BusinessDetails } from "./BusinessDetailsForm";
import type { AddonQuantities } from "./AddOnServices";
import type { OrderMode, ServiceDetails } from "@/pages/EnhancedOrderFlow";

const WHITE_GLOVE_BASE_FEE = 150;

interface ReviewStepProps {
  state: string;
  entityType: string;
  selectedPackage: string;
  selectedAddOns: string[];
  addonQuantities: AddonQuantities;
  businessDetails: BusinessDetails;
  mode?: OrderMode;
  serviceDetails?: ServiceDetails;
  onEdit: (step: number) => void;
  onCheckoutStarted: () => void;
}

const ENTITY_LABELS: Record<string, string> = {
  llc: "LLC",
  "c-corp": "C Corporation",
  "s-corp": "S Corporation",
  nonprofit: "Nonprofit",
  "professional-corp": "Professional Corporation",
};

const ReviewStep = ({
  state,
  entityType,
  selectedPackage,
  selectedAddOns,
  addonQuantities,
  businessDetails,
  mode = "guided",
  serviceDetails,
  onEdit,
  onCheckoutStarted,
}: ReviewStepProps) => {
  const { checkout, loading } = useStripeCheckout();

  const pkg = STRIPE_PACKAGES[selectedPackage as PackageId];
  const isCorpType = ["c-corp", "s-corp", "nonprofit", "professional-corp"].includes(entityType);
  const stateFee = isCorpType ? getCorpStateFee(state) : getStateFee(state);
  const addonsTotal = selectedAddOns.reduce((sum, id) => {
    const addon = STRIPE_ADDONS[id as AddonId];
    const qty = addonQuantities[id] || 1;
    return sum + (addon?.price || 0) * qty;
  }, 0);
  const whiteGloveFee = mode === "whiteglove" ? WHITE_GLOVE_BASE_FEE : 0;
  const total = (pkg?.price || 0) + addonsTotal + stateFee + whiteGloveFee;

  const handleCheckout = async () => {
    const lineItems: { priceId: string; quantity?: number }[] = [];
    if (pkg) lineItems.push({ priceId: pkg.priceId });
    selectedAddOns.forEach((id) => {
      const addon = STRIPE_ADDONS[id as AddonId];
      const qty = addonQuantities[id] || 1;
      if (addon) lineItems.push({ priceId: addon.priceId, quantity: qty });
    });

    onCheckoutStarted();
    trackCheckoutStart(pkg?.name || selectedPackage, total);
    await checkout(lineItems, {
      stateFee: { amount: stateFee, stateName: state },
      successPath: "/dashboard?checkout=success",
      cancelPath: `/order-flow?mode=${mode}`,
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
      <Section title="Formation State" step={1}>
        <p className="font-medium">{state}</p>
      </Section>

      <Separator />

      <Section title="Entity & Package" step={2}>
        <p className="font-medium">{ENTITY_LABELS[entityType] || entityType}</p>
        <p>{pkg?.name} Package — <span className="font-semibold text-primary">${pkg?.price}</span></p>
      </Section>

      <Separator />

      <Section title="Business Details" step={3}>
        <p className="font-medium">{businessDetails.businessName} {businessDetails.designator}</p>
        <p className="text-sm text-muted-foreground">
          {businessDetails.address}, {businessDetails.city}, {state} {businessDetails.zipCode}
        </p>
        {businessDetails.managementStructure && (
          <p className="text-sm text-muted-foreground capitalize">{businessDetails.managementStructure}</p>
        )}
      </Section>

      {/* White Glove service details */}
      {mode === "whiteglove" && serviceDetails && (
        <>
          <Separator />
          <Section title="White Glove Appointment" step={3}>
            <div className="space-y-1 text-sm">
              <p className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-medium">{serviceDetails.meetingLocation}</span>
              </p>
              <p className="flex items-center gap-1.5">
                <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="font-medium">{serviceDetails.preferredDateTime}</span>
              </p>
              {serviceDetails.notes && (
                <p className="text-muted-foreground mt-1">{serviceDetails.notes}</p>
              )}
            </div>
          </Section>
        </>
      )}

      {selectedAddOns.length > 0 && (
        <>
          <Separator />
          <Section title="Add-on Services" step={2}>
            <ul className="space-y-1">
              {selectedAddOns.map((id) => {
                const addon = STRIPE_ADDONS[id as AddonId];
                const qty = addonQuantities[id] || 1;
                return addon ? (
                  <li key={id} className="flex justify-between text-sm">
                    <span>{addon.name}{qty > 1 ? ` × ${qty}` : ""}</span>
                    <span className="font-medium">${addon.price * qty}</span>
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
          <span>${pkg?.price}</span>
        </div>
        {selectedAddOns.map((id) => {
          const addon = STRIPE_ADDONS[id as AddonId];
          const qty = addonQuantities[id] || 1;
          return addon ? (
            <div key={id} className="flex justify-between text-sm">
              <span>{addon.name}{qty > 1 ? ` × ${qty}` : ""}</span>
              <span>${addon.price * qty}</span>
            </div>
          ) : null;
        })}
        <div className="flex justify-between text-sm">
          <span>{state} Filing Fee</span>
          <span>${stateFee}</span>
        </div>
        {mode === "whiteglove" && (
          <div className="flex justify-between text-sm">
            <span className="flex items-center gap-1.5">
              <Car className="h-3.5 w-3.5 text-primary" />
              White Glove Service (2 hrs)
            </span>
            <span>${WHITE_GLOVE_BASE_FEE}</span>
          </div>
        )}
        <Separator />
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-primary">${total}</span>
        </div>
        {mode === "whiteglove" && (
          <p className="text-xs text-muted-foreground">
            Additional time beyond 2 hours billed at $80/hr in 30-min increments.
          </p>
        )}
      </div>

      <Button onClick={handleCheckout} disabled={loading} className="w-full" size="lg">
        {loading ? "Processing..." : (
          <>
            <Lock className="h-4 w-4 mr-2" />
            Proceed to Stripe Checkout
            <ExternalLink className="h-3 w-3 ml-2" />
          </>
        )}
      </Button>

      <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
        <Lock className="h-3 w-3" /> Secure payment powered by Stripe
      </p>
    </Card>
  );
};

export default ReviewStep;
