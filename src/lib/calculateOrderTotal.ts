import { PACKAGES, ADDONS, PROCESSING_SPEEDS, SHIPPING, type PackageId, type AddonId, type ProcessingSpeed } from "@/config/pricing";

/**
 * Server-side-safe order total calculation.
 * Use this on checkout AND in backend validation.
 */
export const calculateOrderTotal = (
  pkg: string,
  addons: string[],
  stateFee: number = 0,
  processingSpeed: ProcessingSpeed = "standard"
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
  total += PROCESSING_SPEEDS[processingSpeed]?.price || 0;
  total += SHIPPING.price;

  return total;
};
