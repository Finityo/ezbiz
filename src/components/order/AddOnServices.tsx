import { formatPrice } from "@/lib/utils";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { InfoIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { ADDONS, type AddonId } from "@/config/pricing";

interface AddOn {
  id: AddonId;
  name: string;
  price: number;
  description: string;
  recommended?: boolean;
}

const addOns: AddOn[] = [
  {
    id: "ein",
    name: ADDONS.ein.name,
    price: ADDONS.ein.price,
    description: ADDONS.ein.description,
    recommended: true,
  },
  {
    id: "operatingAgreement",
    name: ADDONS.operatingAgreement.name,
    price: ADDONS.operatingAgreement.price,
    description: ADDONS.operatingAgreement.description,
  },
  {
    id: "registeredAgent",
    name: ADDONS.registeredAgent.name,
    price: ADDONS.registeredAgent.price,
    description: ADDONS.registeredAgent.description,
  },
  {
    id: "sCorp",
    name: ADDONS.sCorp.name,
    price: ADDONS.sCorp.price,
    description: ADDONS.sCorp.description,
  },
  {
    id: "licenseResearch",
    name: ADDONS.licenseResearch.name,
    price: ADDONS.licenseResearch.price,
    description: ADDONS.licenseResearch.description,
  },
  {
    id: "dba",
    name: ADDONS.dba.name,
    price: ADDONS.dba.price,
    description: ADDONS.dba.description,
  },
  {
    id: "annualReport",
    name: ADDONS.annualReport.name,
    price: ADDONS.annualReport.price,
    description: ADDONS.annualReport.description,
  },
  {
    id: "corporateKit",
    name: ADDONS.corporateKit.name,
    price: ADDONS.corporateKit.price,
    description: ADDONS.corporateKit.description,
  },
  {
    id: "complianceAlerts",
    name: ADDONS.complianceAlerts.name,
    price: ADDONS.complianceAlerts.price,
    description: ADDONS.complianceAlerts.description,
  },
];

export interface AddonQuantities {
  [addonId: string]: number;
}

interface AddOnServicesProps {
  selected: string[];
  onToggle: (addOnId: string) => void;
  quantities: AddonQuantities;
  onQuantityChange: (addonId: string, quantity: number) => void;
}

const AddOnServices = ({ selected, onToggle }: AddOnServicesProps) => {
  const calculateTotal = () => {
    return addOns
      .filter((addon) => selected.includes(addon.id))
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
          const isSelected = selected.includes(addon.id);

          return (
            <Card
              key={addon.id}
              className={`p-4 cursor-pointer transition-smooth hover:shadow-md ${
                isSelected ? "border-primary bg-primary/5" : ""
              }`}
              onClick={() => onToggle(addon.id)}
            >
              <div className="flex items-start gap-3">
                <Checkbox
                  checked={isSelected}
                  onClick={(e) => e.stopPropagation()}
                  onCheckedChange={() => onToggle(addon.id)}
                  className="mt-1"
                />

                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-semibold">{addon.name}</h4>
                    {addon.recommended && (
                      <span className="bg-success text-success-foreground px-2 py-0.5 rounded text-xs font-semibold">
                        Recommended
                      </span>
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

                  <p className="text-lg font-bold text-primary">${formatPrice(addon.price)}</p>
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
