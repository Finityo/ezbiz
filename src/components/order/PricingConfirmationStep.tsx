import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Shield, Clock, Car, AlertCircle } from "lucide-react";
import { STRIPE_PACKAGES, STRIPE_ADDONS, type PackageId, type AddonId } from "@/lib/stripe-config";
import type { AddonQuantities } from "./AddOnServices";

const WHITE_GLOVE_BASE_FEE = 150;
const WHITE_GLOVE_EXTRA_RATE = 80;

interface PricingConfirmationStepProps {
  selectedPackage: string;
  selectedAddOns: string[];
  addonQuantities: AddonQuantities;
  stateFee: number;
  stateName: string;
  isVeteranEligible: boolean;
}

const PricingConfirmationStep = ({
  selectedPackage,
  selectedAddOns,
  addonQuantities,
  stateFee,
  stateName,
  isVeteranEligible,
}: PricingConfirmationStepProps) => {
  const pkg = STRIPE_PACKAGES[selectedPackage as PackageId];

  const addonsTotal = selectedAddOns.reduce((sum, id) => {
    const addon = STRIPE_ADDONS[id as AddonId];
    const qty = addonQuantities[id] || 1;
    return sum + (addon?.price || 0) * qty;
  }, 0);

  const subtotal = (pkg?.price || 0) + addonsTotal + stateFee + WHITE_GLOVE_BASE_FEE;

  return (
    <Card className="p-4 sm:p-6 space-y-5">
      <h3 className="font-semibold text-lg">Pricing Breakdown</h3>

      {/* White Glove fee */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Car className="h-4 w-4 text-primary" />
            <span className="font-medium">White Glove Mobile Service</span>
          </div>
          <span className="font-semibold">${WHITE_GLOVE_BASE_FEE}</span>
        </div>
        <p className="text-xs text-muted-foreground ml-6">
          Includes first 2 hours on-site. Additional time billed at ${WHITE_GLOVE_EXTRA_RATE}/hr.
        </p>
      </div>

      <Separator />

      {/* Package */}
      {pkg && (
        <div className="flex justify-between text-sm">
          <span>{pkg.name} Package</span>
          <span>${pkg.price}</span>
        </div>
      )}

      {/* Add-ons */}
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

      {/* State fee */}
      <div className="flex justify-between text-sm">
        <span>{stateName} State Filing Fee</span>
        <span>${stateFee}</span>
      </div>

      {/* Veteran waiver note */}
      {isVeteranEligible && (
        <div className="flex items-start gap-2 p-3 rounded-lg bg-success/10 border border-success/20 text-sm">
          <Shield className="h-4 w-4 text-success flex-shrink-0 mt-0.5" />
          <span>
            <strong>Veteran fee waiver may apply.</strong> Eligible Texas veterans can save up to $310 in state filing fees.
            Documentation will be verified during your appointment.
          </span>
        </div>
      )}

      <Separator />

      {/* Total */}
      <div className="flex justify-between text-lg font-bold">
        <span>Estimated Total</span>
        <span className="text-primary">${subtotal}</span>
      </div>

      {/* Policy disclosure */}
      <div className="flex items-start gap-2 p-3 rounded-lg bg-muted text-xs text-muted-foreground">
        <AlertCircle className="h-4 w-4 flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p>
            <strong>Time Policy:</strong> Sessions exceeding 2 hours are billed at ${WHITE_GLOVE_EXTRA_RATE}/hr in 30-min increments.
          </p>
          <p>
            <strong>Travel:</strong> Currently serving the San Antonio metro area. Locations outside this area may incur a travel surcharge.
          </p>
        </div>
      </div>
    </Card>
  );
};

export default PricingConfirmationStep;
