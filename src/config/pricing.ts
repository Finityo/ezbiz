// SINGLE SOURCE OF TRUTH FOR ALL EZ BIZ PRICING

export type PackageId = "basic" | "deluxe" | "complete";

export type AddonId =
  | "ein"
  | "operatingAgreement"
  | "registeredAgent"
  | "sCorp"
  | "licenseResearch";

export const PACKAGES: Record<
  PackageId,
  {
    name: string;
    price: number;
    stripePriceId: string;
    description: string;
  }
> = {
  basic: {
    name: "Basic",
    price: 99,
    stripePriceId: "price_1TAIL4IUysiSR1zw3M01ArWS",
    description: "Business formation with required filing documents",
  },
  deluxe: {
    name: "Deluxe",
    price: 219,
    stripePriceId: "price_1TAIMKIUysiSR1zwu3f0jHW4",
    description: "Formation plus essential compliance documents",
  },
  complete: {
    name: "Complete",
    price: 269,
    stripePriceId: "price_1TAIMdIUysiSR1zwqXRGk7WY",
    description: "Full formation package with compliance and filings",
  },
};

export const ADDONS: Record<
  AddonId,
  {
    name: string;
    price: number;
    stripePriceId: string;
    description: string;
  }
> = {
  ein: {
    name: "Federal Tax ID (EIN)",
    price: 89,
    stripePriceId: "price_1TAIMzIUysiSR1zw3s47ma4C",
    description:
      "We obtain your EIN from the IRS so you can open bank accounts and hire employees.",
  },
  operatingAgreement: {
    name: "Operating Agreement",
    price: 148.5,
    stripePriceId: "price_1TAINYIUysiSR1zwwd2NQAiE",
    description:
      "Defines ownership and operating procedures for your LLC.",
  },
  registeredAgent: {
    name: "Registered Agent Service",
    price: 149,
    stripePriceId: "price_1TAIO1IUysiSR1zwAm501dWv",
    description:
      "Maintains a legal address to receive official government documents.",
  },
  sCorp: {
    name: "S-Corp Tax Election",
    price: 99,
    stripePriceId: "price_1T0yYLIUysiSR1zwkctIi3Th",
    description:
      "We prepare and file IRS Form 2553 for S-Corp tax election status.",
  },
  licenseResearch: {
    name: "Business License Research",
    price: 118.5,
    stripePriceId: "price_1TAISYIUysiSR1zw9QGizV8b",
    description:
      "Identifies all licenses required based on business type and location.",
  },
};

// UTILITIES
export function getPackage(packageId: PackageId) {
  return PACKAGES[packageId];
}

export function getAddon(addonId: AddonId) {
  return ADDONS[addonId];
}

export function calculateOrderTotal(
  packageId: PackageId,
  addons: AddonId[],
  stateFee: number
) {
  const packagePrice = PACKAGES[packageId].price;
  const addonsTotal = addons.reduce((sum, addonId) => {
    return sum + ADDONS[addonId].price;
  }, 0);
  return packagePrice + addonsTotal + stateFee;
}
