// SINGLE SOURCE OF TRUTH FOR ALL EZ BIZ PRICING

export type PackageId = "basic" | "deluxe" | "complete";

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
  whiteGloveBase: {
    name: "White Glove Concierge Filing (First 2 Hours)",
    price: 150,
    stripePriceId: "price_1TAkcOIUysiSR1zwNvOiYDnD",
    description:
      "In-person mobile filing service — first 2 hours included.",
  },
  whiteGloveHourly: {
    name: "White Glove Additional Hour",
    price: 80,
    stripePriceId: "price_1TAkckIUysiSR1zw6EQcZ3lo",
    description:
      "Additional hour of White Glove concierge filing beyond the first 2 hours.",
  },
};

// ── Processing Speed ──
export type ProcessingSpeed = "standard" | "express";

export const PROCESSING_SPEEDS: Record<
  ProcessingSpeed,
  {
    name: string;
    description: string;
    price: number;
    stripePriceId: string | null;
  }
> = {
  standard: {
    name: "Standard Processing",
    description: "7–10 Business Days to your door",
    price: 0,
    stripePriceId: null, // included in package
  },
  express: {
    name: "Express Processing",
    description: "3–5 Business Days to your door",
    price: 150,
    stripePriceId: "price_1TAwtjIUysiSR1zwrXt9vICY",
  },
};

// ── Shipping ──
export const SHIPPING = {
  name: "Shipping & Handling",
  description: "Document delivery and handling",
  price: 29,
  stripePriceId: "price_1TAwu6IUysiSR1zw8TGxG4RI",
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
  stateFee: number,
  processingSpeed: ProcessingSpeed = "standard"
) {
  const packagePrice = PACKAGES[packageId].price;
  const addonsTotal = addons.reduce((sum, addonId) => {
    return sum + ADDONS[addonId].price;
  }, 0);
  const processingFee = PROCESSING_SPEEDS[processingSpeed]?.price || 0;
  return packagePrice + addonsTotal + stateFee + processingFee + SHIPPING.price;
}

export function getStripeLineItems(
  packageId: PackageId,
  addons: AddonId[],
  options?: {
    mode?: "guided" | "whiteglove";
    processingSpeed?: ProcessingSpeed;
  }
) {
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
  if (options?.mode === "whiteglove") {
    const wg = ADDONS.whiteGloveBase;
    if (wg?.stripePriceId) {
      items.push({ priceId: wg.stripePriceId, quantity: 1 });
    }
  }

  // Express processing
  const speed = options?.processingSpeed || "standard";
  const speedConfig = PROCESSING_SPEEDS[speed];
  if (speedConfig?.stripePriceId) {
    items.push({ priceId: speedConfig.stripePriceId, quantity: 1 });
  }

  // Shipping (always included)
  items.push({ priceId: SHIPPING.stripePriceId, quantity: 1 });

  return items;
}
