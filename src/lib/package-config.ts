// Package entitlement source of truth.
// Defines which paid add-ons are already included in each package so the
// add-on selector, review step, and checkout cannot double-charge customers.
//
// Bullet points and pricing live in `src/lib/pricing.ts` (PACKAGE_PRICES).
// This file layers entitlement (included-add-on) semantics on top.

import { PACKAGE_PRICES, type PackageType, type AddonId } from "./pricing";

export interface PackageEntitlement {
  id: PackageType;
  name: string;
  label: string;
  price: number;
  processingTime: string;
  /** Bullet points shown in marketing surfaces — derived from PACKAGE_PRICES.features. */
  bullets: readonly string[];
  /** Registered Agent contractual language for this package tier. */
  registeredAgentTerms: string;
  /** Add-on IDs that are already included in this package and must NOT be
   *  selectable in the add-on selector or billed separately at checkout. */
  includedAddons: readonly AddonId[];
}

// NOTE: Basic intentionally has zero `includedAddons`. Its Registered Agent
// benefit is a 60-day intro window, not the full annual `registeredAgent`
// add-on, so customers may still purchase the annual add-on alongside Basic.
//
// TODO: Reconcile against the authoritative CorpNet/EZ Biz package CSV when
// it lands in the repo. Until then, this matrix reflects the rules in the
// Phase Two prompt (Nov 2026) and PACKAGE_PRICES.features.
const INCLUDED_ADDONS: Record<PackageType, readonly AddonId[]> = {
  basic: [],
  deluxe: ["operatingAgreement", "ein", "registeredAgent"],
  complete: [
    "operatingAgreement",
    "ein",
    "registeredAgent",
    "sCorp",
    "licenseResearch",
    "complianceAlerts",
    "corporateKit",
  ],
};

const REGISTERED_AGENT_TERMS: Record<PackageType, string> = {
  basic:
    "Registered Agent included for 60 days; auto-renews at $149/year unless canceled.",
  deluxe:
    "Registered Agent included for first year; auto-renews the following year at $149/year unless canceled.",
  complete:
    "Registered Agent included for first year; auto-renews the following year at $149/year unless canceled.",
};

const PROCESSING_TIME: Record<PackageType, string> = {
  basic: "Standard processing (7–10 business days)",
  deluxe: "Standard processing (7–10 business days)",
  complete: "Standard processing (7–10 business days)",
};

export const PACKAGE_ENTITLEMENTS: Record<PackageType, PackageEntitlement> = (
  Object.keys(PACKAGE_PRICES) as PackageType[]
).reduce((acc, id) => {
  const pkg = PACKAGE_PRICES[id];
  acc[id] = {
    id,
    name: pkg.name,
    label: pkg.label,
    price: pkg.price,
    processingTime: PROCESSING_TIME[id],
    bullets: pkg.features,
    registeredAgentTerms: REGISTERED_AGENT_TERMS[id],
    includedAddons: INCLUDED_ADDONS[id],
  };
  return acc;
}, {} as Record<PackageType, PackageEntitlement>);

/** True when `addonId` is bundled into `packageId` and must not be billed separately. */
export function isAddonIncludedInPackage(
  packageId: PackageType | string | undefined | null,
  addonId: AddonId | string,
): boolean {
  if (!packageId) return false;
  const entitlement = PACKAGE_ENTITLEMENTS[packageId as PackageType];
  if (!entitlement) return false;
  return entitlement.includedAddons.includes(addonId as AddonId);
}

/** Returns the subset of `addonIds` that are NOT already included in the package. */
export function filterBillableAddons(
  packageId: PackageType | string | undefined | null,
  addonIds: readonly string[],
): string[] {
  return addonIds.filter((id) => !isAddonIncludedInPackage(packageId, id));
}
