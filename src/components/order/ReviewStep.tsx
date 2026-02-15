import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Edit2, Lock, ExternalLink } from "lucide-react";
import { STRIPE_PACKAGES, STRIPE_ADDONS, type PackageId, type AddonId } from "@/lib/stripe-config";
import { getStateFee } from "@/lib/state-fees";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import type { BusinessDetails } from "./BusinessDetailsForm";

interface ReviewStepProps {
  state: string;
  entityType: string;
  selectedPackage: string;
  selectedAddOns: string[];
  businessDetails: BusinessDetails;
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
  businessDetails,
  onEdit,
  onCheckoutStarted,
}: ReviewStepProps) => {
  const { checkout, loading } = useStripeCheckout();

  const pkg = STRIPE_PACKAGES[selectedPackage as PackageId];
  const stateFee = getStateFee(state);
  const addonsTotal = selectedAddOns.reduce((sum, id) => {
    const addon = STRIPE_ADDONS[id as AddonId];
    return sum + (addon?.price || 0);
  }, 0);
  const total = (pkg?.price || 0) + addonsTotal + stateFee;

  const handleCheckout = async () => {
    const lineItems: { priceId: string }[] = [];
    if (pkg) lineItems.push({ priceId: pkg.priceId });
    selectedAddOns.forEach((id) => {
      const addon = STRIPE_ADDONS[id as AddonId];
      if (addon) lineItems.push({ priceId: addon.priceId });
    });

    onCheckoutStarted();
    await checkout(lineItems, {
      stateFee: { amount: stateFee, stateName: state },
      successPath: "/dashboard?checkout=success",
      cancelPath: "/order-flow",
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
          <p className="text-sm text-muted-foreground capitalize">{businessDetails.managementStructure.replace("-", "-")}</p>
        )}
      </Section>

      {selectedAddOns.length > 0 && (
        <>
          <Separator />
          <Section title="Add-on Services" step={2}>
            <ul className="space-y-1">
              {selectedAddOns.map((id) => {
                const addon = STRIPE_ADDONS[id as AddonId];
                return addon ? (
                  <li key={id} className="flex justify-between text-sm">
                    <span>{addon.name}</span>
                    <span className="font-medium">${addon.price}</span>
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
          return addon ? (
            <div key={id} className="flex justify-between text-sm">
              <span>{addon.name}</span>
              <span>${addon.price}</span>
            </div>
          ) : null;
        })}
        <div className="flex justify-between text-sm">
          <span>{state} Filing Fee</span>
          <span>${stateFee}</span>
        </div>
        <Separator />
        <div className="flex justify-between text-lg font-bold">
          <span>Total</span>
          <span className="text-primary">${total}</span>
        </div>
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
