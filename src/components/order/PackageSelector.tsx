import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import { cn, formatPrice } from "@/lib/utils";
import { PACKAGE_PRICES, type PackageType } from "@/lib/pricing";

const BADGE_MAP: Partial<Record<PackageType, string>> = {
  deluxe: "Most Popular",
};

const packages = (Object.entries(PACKAGE_PRICES) as [PackageType, typeof PACKAGE_PRICES[PackageType]][]).map(
  ([id, pkg]) => ({
    id,
    name: pkg.name,
    label: pkg.label,
    subtitle: pkg.subtitle,
    price: pkg.price,
    features: [...pkg.features],
    badge: BADGE_MAP[id],
  })
);

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
              <h3 className="text-2xl font-bold mb-1">{pkg.label}</h3>
              <p className="text-xs text-muted-foreground mb-3 min-h-[2rem]">{pkg.subtitle}</p>
              <div className="flex items-baseline justify-center gap-1 mb-1">
                <span className="text-4xl font-bold text-primary">${formatPrice(pkg.price)}</span>
              </div>
              <p className="text-sm text-muted-foreground">
                + {stateFees > 0 ? `$${formatPrice(stateFees)}` : ""} state fees
              </p>
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
