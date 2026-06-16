import { formatPrice } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { InfoIcon, Check } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ADDON_PRICES, type AddonId, type PackageType } from "@/lib/pricing";
import { isAddonIncludedInPackage } from "@/lib/package-config";

interface AddOn {
  id: AddonId;
  name: string;
  price: number;
  description: string;
  recommended?: boolean;
}

// Only checkout-eligible add-ons (excludes whiteGloveBase/whiteGloveHourly)
const CHECKOUT_ADDON_IDS: AddonId[] = [
  "ein",
  "operatingAgreement",
  "registeredAgent",
  "sCorp",
  "licenseResearch",
  "dba",
  "annualReport",
  "corporateKit",
  "complianceAlerts",
];

const addOns: AddOn[] = CHECKOUT_ADDON_IDS.map((id) => ({
  id,
  name: ADDON_PRICES[id].name,
  price: ADDON_PRICES[id].price,
  description: ADDON_PRICES[id].description,
  ...(id === "ein" ? { recommended: true } : {}),
}));

export interface AddonQuantities {
  [addonId: string]: number;
}

interface AddOnServicesProps {
  selectedPackage?: PackageType | string;
  selected: string[];
  onToggle: (addOnId: string) => void;
  quantities: AddonQuantities;
  onQuantityChange: (addonId: string, quantity: number) => void;
}

const AddOnServices = ({ selectedPackage, selected, onToggle }: AddOnServicesProps) => {
  const calculateTotal = () => {
    return addOns
      .filter(
        (addon) =>
          selected.includes(addon.id) &&
          !isAddonIncludedInPackage(selectedPackage, addon.id),
      )
      .reduce((sum, addon) => sum + addon.price, 0);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Optional Add-On Services</h3>
        {selected.length > 0 && (
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Add-ons Total</p>
            <p className="text-2xl font-bold text-primary">${formatPrice(calculateTotal())}</p>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {addOns.map((addon) => {
          const included = isAddonIncludedInPackage(selectedPackage, addon.id);
          const isSelected = !included && selected.includes(addon.id);

          return (
            <Card
              key={addon.id}
              aria-disabled={included || undefined}
              className={`p-4 transition-smooth ${
                included
                  ? "border-success/40 bg-success/5 opacity-90 cursor-not-allowed"
                  : `cursor-pointer hover:shadow-md ${isSelected ? "border-primary bg-primary/5" : ""}`
              }`}
              onClick={() => {
                if (included) return;
                onToggle(addon.id);
              }}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={included ? true : isSelected}
                  disabled={included}
                  onClick={(e) => e.stopPropagation()}
                  onCheckedChange={() => {
                    if (included) return;
                    onToggle(addon.id);
                  }}
                  className="mt-1"
                  aria-label={
                    included
                      ? `${addon.name} is already included in your package`
                      : `Add ${addon.name}`
                  }
                />

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1 flex-wrap">
                    <h4 className="font-semibold">{addon.name}</h4>
                    {included ? (
                      <span className="inline-flex items-center gap-1 bg-success text-success-foreground px-2 py-0.5 rounded text-xs font-semibold">
                        <Check className="h-3 w-3" /> Included in your package
                      </span>
                    ) : (
                      addon.recommended && (
                        <span className="bg-success text-success-foreground px-2 py-0.5 rounded text-xs font-semibold">
                          Recommended
                        </span>
                      )
                    )}
                    <TooltipProvider>
                      <Tooltip>
                        <TooltipTrigger>
                          <InfoIcon className="h-4 w-4 text-muted-foreground" />
                        </TooltipTrigger>
                        <TooltipContent className="max-w-xs">
                          <p>{addon.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  </div>

                  <p className="text-sm text-muted-foreground mb-2">{addon.description}</p>

                  {included ? (
                    <p className="text-sm font-semibold text-success">
                      No extra charge — bundled with your package
                    </p>
                  ) : (
                    <p className="text-lg font-bold text-primary">${formatPrice(addon.price)}</p>
                  )}
                </div>
              </div>
            </Card>
          );
        })}
      </div>
    </div>
  );
};

export default AddOnServices;
