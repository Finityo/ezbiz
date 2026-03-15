// Canonical pricing engine for EZ Biz checkout
// Single source of truth for all pricing, Stripe IDs, and total calculations.

export type PackageType = "basic" | "deluxe" | "complete";

export type ProcessingType = "standard" | "express";

export const PACKAGE_PRICES: Record<
  PackageType,
  { name: string; price: number; stripePriceId: string; description: string; features: readonly string[] }
> = {
  basic: {
    name: "Basic",
    price: 149,
    stripePriceId: "price_1TAjRYIUysiSR1zwBUBS2jDQ",
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
    price: 329,
    stripePriceId: "price_1TAjRsIUysiSR1zwaDwDhUBl",
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
    price: 399,
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
  | "registeredAgent"
  | "sCorp"
  | "licenseResearch"
  | "dba"
  | "annualReport"
  | "corporateKit"
  | "complianceAlerts"
  | "whiteGloveBase"
  | "whiteGloveHourly";

export const ADDON_PRICES: Record<
  AddonId,
  {
    name: string;
    price: number;
    stripePriceId: string;
    description: string;
    availableInCheckout: boolean;
  }
> = {
  ein: {
    name: "EIN Filing Service",
    price: 89,
    stripePriceId: "price_1TAIMzIUysiSR1zw3s47ma4C",
    description: "We obtain your EIN from the IRS so you can open bank accounts and hire employees.",
    availableInCheckout: true,
  },
  operatingAgreement: {
    name: "Operating Agreement",
    price: 149,
    stripePriceId: "price_1TAINYIUysiSR1zwwd2NQAiE",
    description: "Defines ownership and operating procedures for your LLC.",
    availableInCheckout: true,
  },
  registeredAgent: {
    name: "Registered Agent Service",
    price: 149,
    stripePriceId: "price_1TAIO1IUysiSR1zwAm501dWv",
    description: "Maintains a legal address to receive official government documents.",
    availableInCheckout: true,
  },
  sCorp: {
    name: "S-Corp Election",
    price: 149,
    stripePriceId: "price_1T0yYLIUysiSR1zwkctIi3Th",
    description: "We prepare and file IRS Form 2553 for S-Corp tax election status.",
    availableInCheckout: true,
  },
  licenseResearch: {
    name: "Business License Research",
    price: 149,
    stripePriceId: "price_1TAISYIUysiSR1zw9QGizV8b",
    description: "Identifies all licenses required based on business type and location.",
    availableInCheckout: true,
  },
  dba: {
    name: "DBA Filing",
    price: 149,
    stripePriceId: "price_1TAjoKIUysiSR1zwBWcDQxr8",
    description: "File a Doing Business As name with your state or county.",
    availableInCheckout: true,
  },
  annualReport: {
    name: "Annual Report Filing",
    price: 224,
    stripePriceId: "price_1TAjudIUysiSR1zw5wkbfPVv",
    description: "We prepare and file your annual report with the state.",
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

export function calculateOrderTotal(
  pkg: PackageType,
  addons: string[],
  stateFee: number,
  processing: ProcessingType = "standard",
  whiteGloveSelected: boolean = false,
): number {
  const packagePrice = PACKAGE_PRICES[pkg].price;

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

  // Checkout-eligible add-ons
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
