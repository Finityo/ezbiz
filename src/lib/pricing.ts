import { STRIPE_PACKAGES, STRIPE_ADDONS, type PackageId, type AddonId } from "./stripe-config";
import { getStateFee, getCorpStateFee } from "./state-fees";
import type { AddonQuantities } from "@/components/order/AddOnServices";

const CORP_ENTITIES = ["c-corp", "s-corp", "nonprofit", "professional-corp"];

export interface PricingInput {
  packageId: string;
  entityType: string;
  state: string;
  selectedAddOns: string[];
  addonQuantities: AddonQuantities;
  includeWhiteGlove?: boolean;
}

export interface PricingBreakdown {
  packagePrice: number;
  addonsTotal: number;
  stateFee: number;
  whiteGloveFee: number;
  total: number;
}

export function calculatePricing(input: PricingInput): PricingBreakdown {
  const pkg = STRIPE_PACKAGES[input.packageId as PackageId];
  const packagePrice = pkg?.price || 0;

  const addonsTotal = input.selectedAddOns.reduce((sum, id) => {
    const addon = STRIPE_ADDONS[id as AddonId];
    const qty = input.addonQuantities[id] || 1;
    return sum + (addon?.price || 0) * qty;
  }, 0);

  const isCorpType = CORP_ENTITIES.includes(input.entityType);
  const stateFee = input.state
    ? (isCorpType ? getCorpStateFee(input.state) : getStateFee(input.state))
    : 0;

  const whiteGloveFee = input.includeWhiteGlove
    ? (STRIPE_ADDONS["white-glove"]?.price || 0)
    : 0;

  return {
    packagePrice,
    addonsTotal,
    stateFee,
    whiteGloveFee,
    total: packagePrice + addonsTotal + stateFee + whiteGloveFee,
  };
}
