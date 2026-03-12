import { PACKAGES, ADDONS, type PackageId, type AddonId } from "@/config/pricing";

/**
 * Server-side-safe order total calculation.
 * Use this on checkout AND in backend validation.
 */
export const calculateOrderTotal = (
  pkg: string,
  addons: string[],
  stateFee: number = 0
): number => {
  const packageConfig = PACKAGES[pkg as PackageId];
  if (!packageConfig) {
    throw new Error(`Unknown package: ${pkg}`);
  }

  let total = packageConfig.price;

  addons.forEach((addon) => {
    const addonConfig = ADDONS[addon as AddonId];
    if (addonConfig) {
      total += addonConfig.price;
    }
  });

  total += stateFee;

  return total;
};
