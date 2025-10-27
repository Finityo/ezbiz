import { Card } from "@/components/ui/card";
import { Building2, Users, Briefcase, Heart, Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface EntityType {
  id: string;
  name: string;
  description: string;
  icon: React.ElementType;
  recommended?: boolean;
}

const entityTypes: EntityType[] = [
  {
    id: "llc",
    name: "LLC",
    description: "Limited liability with flexible management",
    icon: Building2,
    recommended: true
  },
  {
    id: "c-corp",
    name: "C Corporation",
    description: "Best for raising venture capital",
    icon: Briefcase
  },
  {
    id: "s-corp",
    name: "S Corporation",
    description: "Tax advantages for smaller businesses",
    icon: Shield
  },
  {
    id: "nonprofit",
    name: "Nonprofit",
    description: "Tax-exempt charitable organization",
    icon: Heart
  },
  {
    id: "professional-corp",
    name: "Professional Corporation",
    description: "For licensed professionals",
    icon: Users
  }
];

interface EntityTypeSelectorProps {
  selected: string;
  onSelect: (entityId: string) => void;
}

const EntityTypeSelector = ({ selected, onSelect }: EntityTypeSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {entityTypes.map((entity) => {
        const Icon = entity.icon;
        const isSelected = selected === entity.id;
        
        return (
          <Card
            key={entity.id}
            className={cn(
              "p-6 cursor-pointer transition-smooth hover:shadow-md relative",
              isSelected && "border-primary shadow-md bg-primary/5"
            )}
            onClick={() => onSelect(entity.id)}
          >
            {entity.recommended && (
              <div className="absolute -top-2 -right-2">
                <span className="bg-success text-success-foreground px-2 py-1 rounded-full text-xs font-semibold">
                  Popular
                </span>
              </div>
            )}
            
            <div className={cn(
              "w-12 h-12 rounded-lg flex items-center justify-center mb-4",
              isSelected ? "bg-primary text-primary-foreground" : "bg-muted"
            )}>
              <Icon className="h-6 w-6" />
            </div>
            
            <h3 className="font-bold text-lg mb-2">{entity.name}</h3>
            <p className="text-sm text-muted-foreground">{entity.description}</p>
          </Card>
        );
      })}
    </div>
  );
};

export default EntityTypeSelector;
