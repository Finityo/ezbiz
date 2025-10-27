import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { InfoIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

interface AddOn {
  id: string;
  name: string;
  price: number;
  description: string;
  recommended?: boolean;
}

const addOns: AddOn[] = [
  {
    id: "ein",
    name: "Federal Tax ID (EIN)",
    price: 0,
    description: "Required for hiring employees and opening business bank accounts",
    recommended: true
  },
  {
    id: "operating-agreement",
    name: "Custom Operating Agreement",
    price: 49,
    description: "Detailed agreement outlining ownership and operating procedures"
  },
  {
    id: "s-corp-election",
    name: "S-Corp Tax Election",
    price: 99,
    description: "IRS Form 2553 filing for potential tax savings",
    recommended: true
  },
  {
    id: "business-license",
    name: "Business License Research",
    price: 79,
    description: "Comprehensive research of required licenses for your industry"
  },
  {
    id: "boi-reporting",
    name: "FinCEN BOI Reporting",
    price: 99,
    description: "Beneficial Ownership Information reporting compliance"
  },
  {
    id: "annual-report",
    name: "Annual Report Filing (1 Year)",
    price: 149,
    description: "State compliance report filing service for one year"
  },
  {
    id: "corporate-kit",
    name: "Corporate Kit & Seal",
    price: 59,
    description: "Professional binder with stock certificates, minutes, and embosser"
  },
  {
    id: "dba",
    name: "DBA / Fictitious Name Filing",
    price: 99,
    description: "File a 'Doing Business As' name for your company"
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
                  
                  <p className="text-lg font-bold text-primary">
                    {addon.price === 0 ? "Included" : `$${addon.price}`}
                  </p>
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
