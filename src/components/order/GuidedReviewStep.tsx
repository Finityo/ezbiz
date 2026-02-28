import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Edit2, Calendar, Phone } from "lucide-react";
import { STRIPE_PACKAGES, STRIPE_ADDONS, type PackageId, type AddonId } from "@/lib/stripe-config";
import { getStateFee, getCorpStateFee } from "@/lib/state-fees";
import type { BusinessDetails } from "./BusinessDetailsForm";
import type { OwnerMember } from "./OwnerMemberForm";
import type { AddonQuantities } from "./AddOnServices";
import { openAcuityPopup } from "@/components/consultation/ConsultationTypeCard";
import { trackEvent } from "@/lib/analytics";

const ACUITY_OWNER_ID = "38549422";

const ENTITY_LABELS: Record<string, string> = {
  llc: "LLC",
  "c-corp": "C Corporation",
  "s-corp": "S Corporation",
  nonprofit: "Nonprofit",
  "professional-corp": "Professional Corporation",
};

interface GuidedReviewStepProps {
  state: string;
  entityType: string;
  selectedPackage: string;
  selectedAddOns: string[];
  addonQuantities: AddonQuantities;
  businessDetails: BusinessDetails;
  members: OwnerMember[];
  onEdit: (step: number) => void;
  onCheckoutStarted: () => void;
}

const GuidedReviewStep = ({
  state,
  entityType,
  selectedPackage,
  selectedAddOns,
  addonQuantities,
  businessDetails,
  members,
  onEdit,
  onCheckoutStarted,
}: GuidedReviewStepProps) => {
  const pkg = STRIPE_PACKAGES[selectedPackage as PackageId];
  const isCorpType = ["c-corp", "s-corp", "nonprofit", "professional-corp"].includes(entityType);
  const stateFee = isCorpType ? getCorpStateFee(state) : getStateFee(state);
  const addonsTotal = selectedAddOns.reduce((sum, id) => {
    const addon = STRIPE_ADDONS[id as AddonId];
    const qty = addonQuantities[id] || 1;
    return sum + (addon?.price || 0) * qty;
  }, 0);
  const total = (pkg?.price || 0) + addonsTotal + stateFee;

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
      <Section title="Entity & State" step={1}>
        <p className="font-medium">{ENTITY_LABELS[entityType] || entityType} — {state}</p>
      </Section>

      <Separator />

      <Section title="Business Details" step={2}>
        <p className="font-medium">{businessDetails.businessName} {businessDetails.designator}</p>
        <p className="text-sm text-muted-foreground">
          {businessDetails.address}, {businessDetails.city}, {state} {businessDetails.zipCode}
        </p>
        {businessDetails.managementStructure && (
          <p className="text-sm text-muted-foreground capitalize">{businessDetails.managementStructure}</p>
        )}
      </Section>

      <Separator />

      <Section title="Owners / Members" step={3}>
        {members.filter(m => m.fullName).map((m, i) => (
          <div key={i} className="text-sm">
            <span className="font-medium">{m.fullName}</span>
            {m.ownershipPercentage && <span className="text-muted-foreground"> — {m.ownershipPercentage}%</span>}
          </div>
        ))}
      </Section>

      {selectedAddOns.length > 0 && (
        <>
          <Separator />
          <Section title="Add-on Services" step={4}>
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
        {pkg && (
          <div className="flex justify-between text-sm">
            <span>{pkg.name} Package</span>
            <span>${pkg.price}</span>
          </div>
        )}
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
        <Separator />
        <div className="flex justify-between text-lg font-bold">
          <span>Estimated Total</span>
          <span className="text-primary">${total}</span>
        </div>
      </div>

      {/* Guided CTA: Schedule call */}
      <div className="space-y-3 pt-2">
        <Button
          size="lg"
          className="w-full"
          onClick={() => {
            trackEvent("guided_schedule_call", { total, package: selectedPackage });
            onCheckoutStarted();
            openAcuityPopup(ACUITY_OWNER_ID);
          }}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Schedule Your Guided Call
        </Button>
        <p className="text-xs text-muted-foreground text-center">
          We'll review your information together and submit your filing on the call.
        </p>
      </div>
    </Card>
  );
};

export default GuidedReviewStep;
