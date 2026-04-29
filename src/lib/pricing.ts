// Canonical pricing engine for EZ Biz checkout
// Single source of truth for all pricing, Stripe IDs, and total calculations.
//
// PRICING POLICY (Nov 2026 update):
//  - All CorpNet-based services use a 30% markup, rounded to public-display tiers.
//  - DBA is the only exception → flat $89.
//  - Public display prices are conversion-optimized (see PAC pricing brief).
//
// IMPORTANT: When a `price` here changes, the matching Stripe Price ID must
// be replaced with a new ID created at the new amount. The `create-checkout`
// edge function validates each Stripe price's unit_amount against
// EXPECTED_PRICE_CENTS below at session-creation time and refuses to charge
// a wrong amount. Update both `price` AND `EXPECTED_PRICE_CENTS` in lockstep.

export type PackageType = "basic" | "deluxe" | "complete";

export type ProcessingType = "standard" | "express";

export const PACKAGE_PRICES: Record<
  PackageType,
  {
    name: string;
    label: string;
    subtitle: string;
    price: number;
    stripePriceId: string;
    description: string;
    features: readonly string[];
  }
> = {
  basic: {
    name: "Basic",
    label: "Starter",
    subtitle: "Essential filing support",
    price: 129,
    stripePriceId: "price_1TRVJJIUysiSR1zwmUpJg0gy",
    description: "Business formation with required filing documents",
    features: [
      "Prepare & File Articles of Organization",
      "Name Availability Search",
      "Digital Filing Documents",
      "Order Tracking Dashboard",
      "Lifetime Customer Support",
    ],
  },
  deluxe: {
    name: "Deluxe",
    label: "Most Popular",
    subtitle: "Best balance of filing support and business setup",
    price: 279,
    stripePriceId: "price_1TRVJjIUysiSR1zwaDaz3ics",
    description: "Formation plus essential compliance documents",
    features: [
      "Everything in Basic",
      "Operating Agreement",
      "Banking Resolution",
      "Initial Compliance Instructions",
      "Priority Support",
    ],
  },
  complete: {
    name: "Complete",
    label: "Full Support",
    subtitle: "Complete formation and document support",
    price: 349,
    // TODO: Update Stripe Price ID to match $349 (current ID is for $399).
    stripePriceId: "price_1TAjSCIUysiSR1zwLXwe8C0Z",
    description: "Full formation package with compliance and filings",
    features: [
      "Everything in Deluxe",
      "EIN Filing Service",
      "S-Corp Election Filing",
      "Business License Research",
      "Compliance Alerts",
    ],
  },
};

export type AddonId =
  | "ein"
  | "operatingAgreement"
  | "bylawsMinutes"
  | "registeredAgent"
  | "sCorp"
  | "licenseResearch"
  | "dba"
  | "annualReport"
  | "amendmentFiling"
  | "dissolution"
  | "foreignQualification"
  | "boiReport"
  | "trademarkWord"
  | "trademarkLogo"
  | "trademarkWordLogo"
  | "corporateKit"
  | "complianceAlerts"
  | "whiteGloveBase"
  | "whiteGloveHourly";

export const ADDON_PRICES: Record<
  AddonId,
  {
    name: string;
    price: number;
    stripePriceId: string | null;
    description: string;
    availableInCheckout: boolean;
  }
> = {
  ein: {
    name: "EIN Online",
    price: 89,
    stripePriceId: "price_1TAIMzIUysiSR1zw3s47ma4C",
    description: "Recommended for most businesses opening a bank account or hiring.",
    availableInCheckout: true,
  },
  operatingAgreement: {
    name: "Operating Agreement",
    price: 129,
    // TODO: Update Stripe Price ID to match $129 (current ID is for $149).
    stripePriceId: "price_1TAINYIUysiSR1zwwd2NQAiE",
    description: "Often requested by banks and partners.",
    availableInCheckout: true,
  },
  bylawsMinutes: {
    name: "Bylaws / Minutes",
    price: 129,
    // TODO: Create new Stripe Price for $129 and paste ID here.
    stripePriceId: null,
    description: "Corporate bylaws and initial meeting minutes for corporations.",
    availableInCheckout: true,
  },
  registeredAgent: {
    name: "Registered Agent Service",
    price: 149,
    stripePriceId: "price_1TAIO1IUysiSR1zwAm501dWv",
    description: "Professional registered agent service where available.",
    availableInCheckout: true,
  },
  sCorp: {
    name: "S-Corp Election",
    price: 129,
    // TODO: Update Stripe Price ID to match $129 (current ID is for $149).
    stripePriceId: "price_1T0yYLIUysiSR1zwkctIi3Th",
    description: "We prepare and file IRS Form 2553 for S-Corp tax election status.",
    availableInCheckout: true,
  },
  licenseResearch: {
    name: "Business License Research",
    price: 149,
    stripePriceId: "price_1TAISYIUysiSR1zw9QGizV8b",
    description: "Identifies licenses commonly required based on business type and location.",
    availableInCheckout: true,
  },
  dba: {
    name: "DBA Filing",
    price: 89,
    // TODO: Update Stripe Price ID to match $89 (current ID is for $149).
    stripePriceId: "price_1TAjoKIUysiSR1zwBWcDQxr8",
    description: "File a Doing Business As name with your state or county. State/county fees additional.",
    availableInCheckout: true,
  },
  annualReport: {
    name: "Annual Report Filing",
    price: 129,
    // TODO: Update Stripe Price ID to match $129 (current ID is for $224).
    stripePriceId: "price_1TAjudIUysiSR1zw5wkbfPVv",
    description: "We prepare and file your annual report with the state.",
    availableInCheckout: true,
  },
  amendmentFiling: {
    name: "Amendment Filing",
    price: 249,
    // TODO: Create new Stripe Price for $249 and paste ID here.
    stripePriceId: null,
    description: "Amend your formation documents with the state.",
    availableInCheckout: true,
  },
  dissolution: {
    name: "Dissolution",
    price: 379,
    // TODO: Create new Stripe Price for $379 and paste ID here.
    stripePriceId: null,
    description: "Formally dissolve your business entity with the state.",
    availableInCheckout: true,
  },
  foreignQualification: {
    name: "Foreign Qualification",
    price: 309,
    // TODO: Create new Stripe Price for $309 and paste ID here.
    stripePriceId: null,
    description: "Register your business to operate in additional states.",
    availableInCheckout: true,
  },
  boiReport: {
    name: "BOI Report",
    price: 249,
    // TODO: Create new Stripe Price for $249 and paste ID here.
    stripePriceId: null,
    description: "Federal compliance filing support.",
    availableInCheckout: true,
  },
  trademarkWord: {
    name: "Trademark Word Search",
    price: 379,
    // TODO: Create new Stripe Price for $379 and paste ID here.
    stripePriceId: null,
    description: "Search for existing trademarks on your proposed brand name.",
    availableInCheckout: true,
  },
  trademarkLogo: {
    name: "Trademark Logo Search",
    price: 499,
    // TODO: Create new Stripe Price for $499 and paste ID here.
    stripePriceId: null,
    description: "Search for existing trademarks on your proposed logo design.",
    availableInCheckout: true,
  },
  trademarkWordLogo: {
    name: "Trademark Word + Logo Search",
    price: 629,
    // TODO: Create new Stripe Price for $629 and paste ID here.
    stripePriceId: null,
    description: "Combined word and logo trademark search.",
    availableInCheckout: true,
  },
  corporateKit: {
    name: "Corporate Kit",
    price: 59,
    stripePriceId: "price_1TAjy8IUysiSR1zwnphHwavq",
    description: "Professional binder, seal, and member certificates for your company records.",
    availableInCheckout: true,
  },
  complianceAlerts: {
    name: "Compliance Alerts",
    price: 103,
    stripePriceId: "price_1TAjzBIUysiSR1zwapC53gXv",
    description: "Automated reminders for filings, tax deadlines, and compliance requirements.",
    availableInCheckout: true,
  },
  whiteGloveBase: {
    name: "White Glove Concierge Filing (First 2 Hours)",
    price: 150,
    stripePriceId: "price_1TAkcOIUysiSR1zwNvOiYDnD",
    description: "In-person mobile filing service — first 2 hours included.",
    availableInCheckout: false,
  },
  whiteGloveHourly: {
    name: "White Glove Additional Hour",
    price: 80,
    stripePriceId: "price_1TAkckIUysiSR1zw6EQcZ3lo",
    description: "Additional hour of White Glove concierge filing beyond the first 2 hours.",
    availableInCheckout: false,
  },
};

export const PROCESSING_PRICES: Record<
  ProcessingType,
  { name: string; description: string; price: number; stripePriceId: string | null }
> = {
  standard: {
    name: "Standard Processing",
    description: "7–10 Business Days to your door",
    price: 0,
    stripePriceId: null,
  },
  express: {
    name: "Express Processing",
    description: "3–5 Business Days to your door",
    price: 150,
    stripePriceId: "price_1TAwtjIUysiSR1zwrXt9vICY",
  },
};

export const SHIPPING_PRICE = 29;
export const SHIPPING_STRIPE_PRICE_ID = "price_1TAwu6IUysiSR1zw8TGxG4RI";

export const WHITE_GLOVE_BASE = ADDON_PRICES.whiteGloveBase.price;

/**
 * Map of stripePriceId → expected unit_amount in cents.
 * The `create-checkout` edge function fetches each Price from Stripe and
 * refuses to create a session if the live amount doesn't match.
 * This prevents charging old amounts during the gap between updating
 * config prices and creating new Stripe Price IDs.
 */
export const EXPECTED_PRICE_CENTS: Record<string, number> = (() => {
  const map: Record<string, number> = {};
  for (const pkg of Object.values(PACKAGE_PRICES)) {
    if (pkg.stripePriceId) map[pkg.stripePriceId] = pkg.price * 100;
  }
  for (const addon of Object.values(ADDON_PRICES)) {
    if (addon.stripePriceId) map[addon.stripePriceId] = addon.price * 100;
  }
  for (const speed of Object.values(PROCESSING_PRICES)) {
    if (speed.stripePriceId) map[speed.stripePriceId] = speed.price * 100;
  }
  map[SHIPPING_STRIPE_PRICE_ID] = SHIPPING_PRICE * 100;
  return map;
})();

export function calculateOrderTotal(
  pkg: PackageType,
  addons: string[],
  stateFee: number,
  processing: ProcessingType = "standard",
  whiteGloveSelected: boolean = false,
): number {
  const packagePrice = PACKAGE_PRICES[pkg]?.price || 0;

  const addonTotal = addons.reduce((sum, addon) => {
    const config = ADDON_PRICES[addon as AddonId];
    if (!config || !config.availableInCheckout) return sum;
    return sum + config.price;
  }, 0);

  const processingFee = PROCESSING_PRICES[processing].price;
  const whiteGloveBase = whiteGloveSelected ? WHITE_GLOVE_BASE : 0;

  return packagePrice + addonTotal + stateFee + processingFee + SHIPPING_PRICE + whiteGloveBase;
}

export function getStripeLineItems(
  pkg: PackageType,
  addons: string[],
  processing: ProcessingType = "standard",
  whiteGloveSelected: boolean = false,
) {
  const items: { priceId: string; quantity: number }[] = [];

  // Package
  const pkgConfig = PACKAGE_PRICES[pkg];
  if (pkgConfig?.stripePriceId) {
    items.push({ priceId: pkgConfig.stripePriceId, quantity: 1 });
  }

  // Checkout-eligible add-ons (skip ones without a Stripe ID yet)
  addons.forEach((addonId) => {
    const config = ADDON_PRICES[addonId as AddonId];
    if (config && config.availableInCheckout && config.stripePriceId) {
      items.push({ priceId: config.stripePriceId, quantity: 1 });
    }
  });

  // Express processing
  if (processing === "express" && PROCESSING_PRICES.express.stripePriceId) {
    items.push({ priceId: PROCESSING_PRICES.express.stripePriceId, quantity: 1 });
  }

  // Shipping (always)
  items.push({ priceId: SHIPPING_STRIPE_PRICE_ID, quantity: 1 });

  // White Glove base
  if (whiteGloveSelected && ADDON_PRICES.whiteGloveBase.stripePriceId) {
    items.push({ priceId: ADDON_PRICES.whiteGloveBase.stripePriceId, quantity: 1 });
  }

  return items;
}
