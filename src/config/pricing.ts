// SINGLE SOURCE OF TRUTH FOR ALL EZ BIZ PRICING

export type PackageId = "basic" | "deluxe" | "complete";

export type AddonId =
  | "ein"
  | "operatingAgreement"
  | "registeredAgent"
  | "boiFiling"
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
    price: 148,
    stripePriceId: "price_1TAIL4IUysiSR1zw3M01ArWS",
    description: "Business formation with required filing documents",
  },
  deluxe: {
    name: "Deluxe",
    price: 328,
    stripePriceId: "price_1TAIMKIUysiSR1zwu3f0jHW4",
    description: "Formation plus essential compliance documents",
  },
  complete: {
    name: "Complete",
    price: 403,
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
  boiFiling: {
    name: "FinCEN BOI Filing",
    price: 118.5,
    stripePriceId: "price_boi_REPLACE",
    description:
      "We prepare and submit your Beneficial Ownership Information report.",
  },
  licenseResearch: {
    name: "Business License Research",
    price: 118.5,
    stripePriceId: "price_license_REPLACE",
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
