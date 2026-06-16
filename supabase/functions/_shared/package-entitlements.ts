// Deno-side mirror of `src/lib/package-config.ts` entitlement matrix.
// Keep these two files in sync — both are derived from the Phase Two
// package-included-add-on rules. Account-manager CSV uses this to
// distinguish billable add-ons from package-included services.

export type PackageId = "basic" | "deluxe" | "complete";

export const INCLUDED_ADDONS: Record<PackageId, readonly string[]> = {
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

export const REGISTERED_AGENT_TERMS: Record<PackageId, string> = {
  basic:
    "Registered Agent included for 60 days; auto-renews at $149/year unless canceled.",
  deluxe:
    "Registered Agent included for first year; auto-renews the following year at $149/year unless canceled.",
  complete:
    "Registered Agent included for first year; auto-renews the following year at $149/year unless canceled.",
};

const isPackageId = (id: unknown): id is PackageId =>
  id === "basic" || id === "deluxe" || id === "complete";

export function isAddonIncludedInPackage(packageId: unknown, addonId: string): boolean {
  if (!isPackageId(packageId)) return false;
  return INCLUDED_ADDONS[packageId].includes(addonId);
}

export function splitAddons(
  packageId: unknown,
  selectedAddonIds: readonly string[],
): { billable: string[]; included: string[] } {
  const billable: string[] = [];
  const included: string[] = [];
  for (const id of selectedAddonIds) {
    if (isAddonIncludedInPackage(packageId, id)) included.push(id);
    else billable.push(id);
  }
  // Also surface package-included services that may not appear in the
  // customer's `addOns` array (e.g. RA on Deluxe/Complete) so the account
  // manager sees the full fulfillment list.
  if (isPackageId(packageId)) {
    for (const id of INCLUDED_ADDONS[packageId]) {
      if (!included.includes(id)) included.push(id);
    }
  }
  return { billable, included };
}

export function registeredAgentTermsFor(packageId: unknown): string {
  return isPackageId(packageId) ? REGISTERED_AGENT_TERMS[packageId] : "";
}
