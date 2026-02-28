import * as React from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Edit2, Lock } from "lucide-react";
import { STRIPE_ADDONS, STRIPE_PACKAGES, type AddonId, type PackageId } from "@/lib/stripe-config";
import { getStateFee, getCorpStateFee } from "@/lib/state-fees";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { trackCheckoutStart } from "@/lib/analytics";
import type { BusinessDetails } from "./BusinessDetailsForm";
import type { AddonQuantities } from "./AddOnServices";
import AcuityScheduler from "./AcuityScheduler";

type OrderMode = "guided" | "whiteglove";
type ServiceDetails = {
  meetingLocation: string;
  preferredDateTime: string;
  notes: string;
};

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

const WHITE_GLOVE_ADDON = STRIPE_ADDONS["white-glove"];

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
  const [guidedScheduled, setGuidedScheduled] = React.useState(false);
  const guidedGateOk = mode !== "guided" ? true : guidedScheduled;
  const { checkout, loading } = useStripeCheckout();
  const pkg = STRIPE_PACKAGES[selectedPackage as PackageId];
  const isCorpType = ["c-corp", "s-corp", "nonprofit", "professional-corp"].includes(entityType);
  const stateFee = isCorpType ? getCorpStateFee(state) : getStateFee(state);
  const addonsTotal = selectedAddOns.reduce((sum, id) => {
    const addon = STRIPE_ADDONS[id as AddonId];
    const qty = addonQuantities[id] || 1;
    return sum + (addon?.price || 0) * qty;
  }, 0);

  const whiteGloveFee = mode === "whiteglove" ? WHITE_GLOVE_ADDON.price : 0;
  const total = (pkg?.price || 0) + addonsTotal + stateFee + whiteGloveFee;

  const handleCheckout = async () => {
    const lineItems: { priceId: string; quantity?: number }[] = [];
    if (pkg) lineItems.push({ priceId: pkg.priceId });
    selectedAddOns.forEach((id) => {
      const addon = STRIPE_ADDONS[id as AddonId];
      const qty = addonQuantities[id] || 1;
      if (addon) lineItems.push({ priceId: addon.priceId, quantity: qty });
    });
    if (mode === "whiteglove") {
      lineItems.push({ priceId: WHITE_GLOVE_ADDON.priceId });
    }

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
      {/* White Glove appointment details */}
      {mode === "whiteglove" && serviceDetails && (
        <>
          <Section title="White Glove Appointment" step={3}>
            <div className="space-y-1 text-sm">
              <p><span className="text-muted-foreground">Meeting Location:</span> {serviceDetails.meetingLocation}</p>
              <p><span className="text-muted-foreground">Preferred Date/Time:</span> {serviceDetails.preferredDateTime}</p>
              {serviceDetails.notes && (
                <p><span className="text-muted-foreground">Notes:</span> {serviceDetails.notes}</p>
              )}
              <p className="text-xs text-muted-foreground mt-2">
                White Glove base fee: ${WHITE_GLOVE_ADDON.price} (first 2 hours) — charged today.
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
          {pkg?.name} Package — <span className="text-primary">${pkg?.price}</span>
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
          <span>${pkg?.price || 0}</span>
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
            <span>White Glove Mobile Service (First 2 Hours)</span>
            <span>${WHITE_GLOVE_ADDON.price}</span>
          </div>
        )}

        <Separator />
        <div className="flex justify-between text-lg font-bold">
          <span>Total (charged today)</span>
          <span className="text-primary">${total}</span>
        </div>
        {mode === "whiteglove" && (
          <p className="text-xs text-muted-foreground">
            Overage ($80/hr after 2 hours) is charged on-site separately.
          </p>
        )}
      </div>

      {mode === "guided" && (
        <>
          <Section title="Schedule Your Guided Filing Call" step={3}>
            <Card className="p-4">
              <p className="text-sm text-muted-foreground">
                Schedule your Zoom/call below. After scheduling, confirm the checkbox to unlock payment.
              </p>
              <AcuityScheduler />
              <div className="mt-4">
                <label className="flex items-start gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={guidedScheduled}
                    onChange={(e) => setGuidedScheduled(e.target.checked)}
                  />
                  <span>I scheduled my call and I'm ready to continue to payment.</span>
                </label>
              </div>
            </Card>
          </Section>
          <Separator />
        </>
      )}

      <Button onClick={handleCheckout} disabled={loading || !guidedGateOk} className="w-full" size="lg">
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
