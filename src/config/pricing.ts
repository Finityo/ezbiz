// SINGLE SOURCE OF TRUTH FOR ALL EZ BIZ PRICING

export type PackageId = "basic" | "deluxe" | "complete";

export type AddonId =
  | "ein"
  | "operatingAgreement"
  | "registeredAgent"
  | "sCorp"
  | "licenseResearch"
  | "boiFiling"
  | "dba"
  | "annualReport"
  | "corporateKit"
  | "complianceAlerts";

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
    price: 149,
    stripePriceId: "price_1TAjRYIUysiSR1zwBUBS2jDQ",
    description: "Business formation with required filing documents",
  },
  deluxe: {
    name: "Deluxe",
    price: 329,
    stripePriceId: "price_1TAjRsIUysiSR1zwaDwDhUBl",
    description: "Formation plus essential compliance documents",
  },
  complete: {
    name: "Complete",
    price: 399,
    stripePriceId: "price_1TAjSCIUysiSR1zwLXwe8C0Z",
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
    name: "EIN Filing Service",
    price: 89,
    stripePriceId: "price_1TAIMzIUysiSR1zw3s47ma4C",
    description:
      "We obtain your EIN from the IRS so you can open bank accounts and hire employees.",
  },
  operatingAgreement: {
    name: "Operating Agreement",
    price: 149,
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
    name: "S-Corp Election",
    price: 149,
    stripePriceId: "price_1T0yYLIUysiSR1zwkctIi3Th",
    description:
      "We prepare and file IRS Form 2553 for S-Corp tax election status.",
  },
  licenseResearch: {
    name: "Business License Research",
    price: 149,
    stripePriceId: "price_1TAISYIUysiSR1zw9QGizV8b",
    description:
      "Identifies all licenses required based on business type and location.",
  },
  boiFiling: {
    name: "FinCEN BOI Filing",
    price: 149,
    stripePriceId: "",
    description:
      "We file your Beneficial Ownership Information report with FinCEN.",
  },
  dba: {
    name: "DBA Filing",
    price: 149,
    stripePriceId: "price_1TAjoKIUysiSR1zwBWcDQxr8",
    description:
      "File a Doing Business As name with your state or county.",
  },
  annualReport: {
    name: "Annual Report Filing",
    price: 224,
    stripePriceId: "price_1TAjudIUysiSR1zw5wkbfPVv",
    description:
      "We prepare and file your annual report with the state.",
  },
  corporateKit: {
    name: "Corporate Kit",
    price: 59,
    stripePriceId: "price_1TAjy8IUysiSR1zwnphHwavq",
    description:
      "Professional binder, seal, and member certificates for your company records.",
  },
  complianceAlerts: {
    name: "Compliance Alerts",
    price: 103,
    stripePriceId: "price_1TAjzBIUysiSR1zwapC53gXv",
    description:
      "Automated reminders for filings, tax deadlines, and compliance requirements.",
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

export function getStripeLineItems(packageId: PackageId, addons: AddonId[]) {
  const items: { priceId: string; quantity: number }[] = [];
  const pkg = PACKAGES[packageId];
  if (pkg?.stripePriceId) {
    items.push({ priceId: pkg.stripePriceId, quantity: 1 });
  }
  addons.forEach((addonId) => {
    const addon = ADDONS[addonId];
    if (addon?.stripePriceId && addon.stripePriceId.length > 0) {
      items.push({ priceId: addon.stripePriceId, quantity: 1 });
    }
  });
  return items;
}
