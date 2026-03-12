import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { PACKAGES, type PackageId } from "@/config/pricing";

interface Package {
  id: PackageId;
  name: string;
  price: number;
  features: string[];
  badge?: string;
  processingTime: string;
}

const packages: Package[] = [
  {
    id: "basic",
    name: PACKAGES.basic.name,
    price: PACKAGES.basic.price,
    processingTime: "15-20 business days",
    features: [
      "Name availability check",
      "Articles of organization filing",
      "Registered agent (1 year FREE)",
      "Federal Tax ID (EIN)",
      "Operating agreement template",
      "Email delivery of documents",
    ],
  },
  {
    id: "deluxe",
    name: PACKAGES.deluxe.name,
    price: PACKAGES.deluxe.price,
    badge: "Most Popular",
    processingTime: "10-15 business days",
    features: [
      "Everything in Basic",
      "Expedited filing service",
      "Custom operating agreement",
      "Banking resolution",
      "Organizational minutes",
      "Membership certificates",
      "Priority support",
    ],
  },
  {
    id: "complete",
    name: PACKAGES.complete.name,
    price: PACKAGES.complete.price,
    badge: "Best Value",
    processingTime: "5-7 business days",
    features: [
      "Everything in Deluxe",
      "Rush processing",
      "S-Corp tax election filing",
      "Business license research",
      "Compliance calendar",
      "Annual report filing (1 year)",
      "FinCEN BOI reporting",
      "Dedicated account manager",
    ],
  },
];

interface PackageSelectorProps {
  selected: string;
  onSelect: (packageId: string) => void;
  stateFees?: number;
}

const PackageSelector = ({ selected, onSelect, stateFees = 0 }: PackageSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {packages.map((pkg) => {
        const isSelected = selected === pkg.id;
        const totalPrice = pkg.price + stateFees;
        
        return (
          <Card
            key={pkg.id}
            className={cn(
              "p-6 relative transition-smooth",
              isSelected && "border-primary shadow-elegant",
              pkg.badge && "border-primary/50"
            )}
          >
            {pkg.badge && (
              <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                <span className="bg-primary text-primary-foreground px-4 py-1 rounded-full text-sm font-bold shadow-md">
                  {pkg.badge}
                </span>
              </div>
            )}
            
            <div className="text-center mb-6 pt-2">
              <h3 className="text-2xl font-bold mb-2">{pkg.name}</h3>
              <div className="flex items-baseline justify-center gap-1 mb-1">
                <span className="text-4xl font-bold text-primary">${formatPrice(pkg.price)}</span>
              </div>
              {stateFees > 0 && (
                <p className="text-sm text-muted-foreground">+ ${stateFees} state fees</p>
              )}
              <p className="text-xs text-muted-foreground mt-2">{pkg.processingTime}</p>
            </div>

            <ul className="space-y-3 mb-6 min-h-[280px]">
              {pkg.features.map((feature, index) => (
                <li key={index} className="flex items-start text-sm">
                  <Check className="h-4 w-4 text-success mr-2 mt-0.5 flex-shrink-0" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>

            <Button
              className={cn(
                "w-full font-bold transition-smooth",
                isSelected 
                  ? "bg-primary hover:bg-primary-dark" 
                  : "bg-secondary hover:bg-secondary-light"
              )}
              size="lg"
              onClick={() => onSelect(pkg.id)}
            >
              {isSelected ? "Selected" : "Select Package"}
            </Button>
          </Card>
        );
      })}
    </div>
  );
};

export default PackageSelector;
