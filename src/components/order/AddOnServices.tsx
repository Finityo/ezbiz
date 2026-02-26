import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { InfoIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { STRIPE_ADDONS, type AddonId } from "@/lib/stripe-config";

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
    name: STRIPE_ADDONS.ein.name,
    price: STRIPE_ADDONS.ein.price,
    description: "Required for hiring employees and opening business bank accounts",
    recommended: true
  },
  {
    id: "operating-agreement",
    name: STRIPE_ADDONS["operating-agreement"].name,
    price: STRIPE_ADDONS["operating-agreement"].price,
    description: "Detailed agreement outlining ownership and operating procedures"
  },
  {
    id: "s-corp-election",
    name: STRIPE_ADDONS["s-corp-election"].name,
    price: STRIPE_ADDONS["s-corp-election"].price,
    description: "IRS Form 2553 filing for potential tax savings",
    recommended: true
  },
  {
    id: "business-license",
    name: STRIPE_ADDONS["business-license"].name,
    price: STRIPE_ADDONS["business-license"].price,
    description: "Comprehensive research of required licenses for your industry"
  },
  {
    id: "boi-reporting",
    name: STRIPE_ADDONS["boi-reporting"].name,
    price: STRIPE_ADDONS["boi-reporting"].price,
    description: "Beneficial Ownership Information reporting compliance"
  },
  {
    id: "annual-report",
    name: STRIPE_ADDONS["annual-report"].name,
    price: STRIPE_ADDONS["annual-report"].price,
    description: "State compliance report filing service for one year"
  },
  {
    id: "corporate-kit",
    name: STRIPE_ADDONS["corporate-kit"].name,
    price: STRIPE_ADDONS["corporate-kit"].price,
    description: "Professional binder with stock certificates, minutes, and embosser"
  },
  {
    id: "dba",
    name: STRIPE_ADDONS.dba.name,
    price: STRIPE_ADDONS.dba.price,
    description: "File a 'Doing Business As' name for your company"
  },
  {
    id: "consultation",
    name: STRIPE_ADDONS.consultation.name,
    price: STRIPE_ADDONS.consultation.price,
    description: "2-hour remote consultation. $80/hr for each additional hour beyond the initial 2 hours."
  },
  {
    id: "extra-consultation-hour",
    name: STRIPE_ADDONS["extra-consultation-hour"].name,
    price: STRIPE_ADDONS["extra-consultation-hour"].price,
    description: "Add extra consultation hours at $80/hr (requires the 2-hour consultation above)"
  }
];

interface AddOnServicesProps {
  selected: string[];
  onToggle: (addOnId: string) => void;
}

const AddOnServices = ({ selected, onToggle }: AddOnServicesProps) => {
  const calculateTotal = () => {
    return addOns
      .filter(addon => selected.includes(addon.id))
      .reduce((sum, addon) => sum + addon.price, 0);
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold">Optional Add-On Services</h3>
        {selected.length > 0 && (
          <div className="text-right">
            <p className="text-sm text-muted-foreground">Add-ons Total</p>
            <p className="text-2xl font-bold text-primary">${calculateTotal()}</p>
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
                  
                  <p className="text-lg font-bold text-primary">${addon.price}</p>
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
