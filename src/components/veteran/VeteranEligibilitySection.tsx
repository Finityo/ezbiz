import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";

const VeteranEligibilitySection = () => {
  return (
    <section className="w-full py-16 px-6 text-center">
      <div className="flex items-center justify-center gap-3 mb-6">
        <span className="text-3xl">🇺🇸</span>
        <h2 className="text-3xl font-bold font-display text-foreground">
          Veteran-Owned Business Benefits
        </h2>
        <span className="text-3xl">🇺🇸</span>
      </div>
      <p className="max-w-2xl mx-auto text-lg mb-8 text-muted-foreground font-body">
        If you are a qualified Texas Veteran, you may be eligible for
        franchise tax exemptions and filing benefits.
        EZ Biz handles your entity filing. The resources below are
        official state pages for independent veteran verification.
      </p>
      <div className="mb-10">
        <Button variant="success" size="lg" className="px-8">
          ✓ You May Be Eligible
        </Button>
      </div>
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card className="border-border">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold font-display mb-3 text-foreground">
              Texas Veteran Verification Letter (VVL)
            </h3>
            <p className="mb-4 text-sm text-muted-foreground font-body">
              Request your official Veteran Verification Letter required
              when processing formation documents.
            </p>
            <Button variant="outline" className="group" asChild>
              <a
                href="https://tvc.texas.gov/entrepreneurs/veteran-verification-letter/"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit Texas Veterans Commission
                <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </Button>
          </CardContent>
        </Card>
        <Card className="border-border">
          <CardContent className="p-6">
            <h3 className="text-xl font-semibold font-display mb-3 text-foreground">
              Texas Veteran Franchise Tax Exemption
            </h3>
            <p className="mb-4 text-sm text-muted-foreground font-body">
              Review eligibility requirements and franchise tax exemption
              details directly from the Texas Comptroller.
            </p>
            <Button variant="outline" className="group" asChild>
              <a
                href="https://comptroller.texas.gov/taxes/franchise/veteran-business.php"
                target="_blank"
                rel="noopener noreferrer"
              >
                Visit Texas Comptroller
                <ExternalLink className="ml-2 h-4 w-4 group-hover:translate-x-0.5 transition-transform" />
              </a>
            </Button>
          </CardContent>
        </Card>
      </div>
    </section>
  );
};

export default VeteranEligibilitySection;
