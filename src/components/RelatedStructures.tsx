import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowRight, Building2, Shield, Users, DollarSign, Scale, Briefcase, Heart, FileText } from "lucide-react";
import { Link } from "react-router-dom";

export interface BusinessStructure {
  id: string;
  title: string;
  shortTitle: string;
  href: string;
  description: string;
  icon: typeof Building2;
  highlight?: string;
}

export const allBusinessStructures: BusinessStructure[] = [
  {
    id: "llc",
    title: "Limited Liability Company (LLC)",
    shortTitle: "LLC",
    href: "/form-llc",
    description: "Most popular choice combining liability protection with tax flexibility and simple management.",
    icon: Shield,
    highlight: "Most Popular"
  },
  {
    id: "s-corp",
    title: "S Corporation",
    shortTitle: "S-Corp",
    href: "/s-corporation",
    description: "Avoid double taxation while maintaining corporate structure. Potential self-employment tax savings.",
    icon: DollarSign,
    highlight: "Tax Advantaged"
  },
  {
    id: "c-corp",
    title: "C Corporation",
    shortTitle: "C-Corp",
    href: "/c-corporation",
    description: "Best for growth, investment, and going public. Unlimited shareholders and stock classes.",
    icon: Building2,
    highlight: "Investor Ready"
  },
  {
    id: "partnership",
    title: "Partnership",
    shortTitle: "Partnership",
    href: "/partnership",
    description: "For multi-owner businesses sharing profits, management, and liabilities together.",
    icon: Users
  },
  {
    id: "sole-proprietorship",
    title: "Sole Proprietorship",
    shortTitle: "Sole Prop",
    href: "/sole-proprietorship",
    description: "Simplest structure with no separate entity. Owner has complete control but unlimited liability.",
    icon: Briefcase
  },
  {
    id: "professional-corp",
    title: "Professional Corporation",
    shortTitle: "Prof. Corp",
    href: "/professional-corporation",
    description: "For licensed professionals like doctors, lawyers, and accountants seeking liability protection.",
    icon: Scale
  },
  {
    id: "nonprofit",
    title: "Nonprofit Corporation",
    shortTitle: "Nonprofit",
    href: "/nonprofit-corporation",
    description: "Tax-exempt organizations serving charitable, educational, religious, or scientific purposes.",
    icon: Heart
  },
  {
    id: "dba",
    title: "DBA / Trade Name",
    shortTitle: "DBA",
    href: "/dba-filing",
    description: "Register a trade name to operate under a different business name without forming a new entity.",
    icon: FileText
  }
];

interface RelatedStructuresProps {
  currentStructureId: string;
  title?: string;
  subtitle?: string;
  maxItems?: number;
  relatedIds?: string[];
}

const RelatedStructures = ({ 
  currentStructureId, 
  title = "Compare Other Business Structures",
  subtitle = "Not sure if this is the right structure for you? Explore other options:",
  maxItems = 4,
  relatedIds
}: RelatedStructuresProps) => {
  // Filter out current structure and optionally filter by related IDs
  let structures = allBusinessStructures.filter(s => s.id !== currentStructureId);
  
  if (relatedIds && relatedIds.length > 0) {
    structures = structures.filter(s => relatedIds.includes(s.id));
  }
  
  // Limit to maxItems
  structures = structures.slice(0, maxItems);

  return (
    <section className="py-16 lg:py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12">
            <div className="accent-line-center mb-6" />
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{title}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {subtitle}
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {structures.map((structure) => (
              <Card key={structure.id} className="border-border/50 hover:shadow-elegant transition-smooth group">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between mb-3">
                    <div className="w-10 h-10 bg-secondary/10 rounded-lg flex items-center justify-center">
                      <structure.icon className="h-5 w-5 text-secondary" />
                    </div>
                    {structure.highlight && (
                      <span className="text-xs font-medium bg-secondary/10 text-secondary px-2 py-1 rounded">
                        {structure.highlight}
                      </span>
                    )}
                  </div>
                  <CardTitle className="text-lg group-hover:text-secondary transition-colors">
                    {structure.shortTitle}
                  </CardTitle>
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription className="text-sm leading-relaxed mb-4">
                    {structure.description}
                  </CardDescription>
                  <Button variant="link" className="p-0 h-auto text-secondary" asChild>
                    <Link to={structure.href}>
                      Learn More <ArrowRight className="ml-1 h-4 w-4" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="text-center mt-10">
            <Button variant="outline" size="lg" asChild>
              <Link to="/business-guide">
                View Complete Business Structure Guide <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RelatedStructures;
