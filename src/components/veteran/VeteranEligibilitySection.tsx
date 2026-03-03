import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { trackEvent } from "@/lib/analytics";

const VeteranEligibilitySection = () => {
  const [isEligible, setIsEligible] = useState(false);
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    if (isEligible) {
      setAnimate(true);
      const timer = setTimeout(() => setAnimate(false), 2500);
      return () => clearTimeout(timer);
    }
  }, [isEligible]);

  return (
    <section className="w-full py-16 px-6 bg-transparent text-center">
      {/* Header */}
      <div className="flex items-center justify-center gap-3 mb-6">
        <span className="text-3xl">🇺🇸</span>
        <h2 className="text-3xl font-bold font-display text-foreground">
          Veteran-Owned Business Benefits
        </h2>
        <span className="text-3xl">🇺🇸</span>
      </div>
      <p className="max-w-2xl mx-auto text-lg text-muted-foreground font-body mb-8">
        If you are a qualified Texas Veteran, you may be eligible for
        franchise tax exemptions and filing benefits. EZ Biz will file your
        entity, but you must independently request your verification and
        review eligibility through the official state resources below.
      </p>

      {/* Eligibility Toggle */}
      <div className="mb-8">
        <Button
          size="lg"
          variant={isEligible ? "success" : "outline"}
          onClick={() => {
            setIsEligible(!isEligible);
            trackEvent("veteran_eligibility_toggle", { eligible: !isEligible });
          }}
          className="px-8"
        >
          {isEligible ? "✓ You May Be Eligible" : "Check Veteran Eligibility"}
        </Button>
        {isEligible && (
          <div
            className={`mt-4 text-success font-bold text-lg font-display transition-transform duration-500 ${
              animate ? "scale-110" : "scale-100"
            }`}
          >
            🎉 YAY — You May Be Eligible!
          </div>
        )}
      </div>

      {/* Authority Links */}
      <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
        <Card className="border-border">
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold font-display mb-3 text-foreground">
              Texas Veteran Verification Letter (VVL)
            </h3>
            <p className="mb-4 text-sm text-muted-foreground font-body">
              Request your official Veteran Verification Letter required when
              processing formation documents.
            </p>
            <Button
              variant="outline"
              className="group"
              asChild
            >
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
          <CardContent className="p-6 text-center">
            <h3 className="text-xl font-semibold font-display mb-3 text-foreground">
              Texas Veteran Franchise Tax Exemption
            </h3>
            <p className="mb-4 text-sm text-muted-foreground font-body">
              Review eligibility requirements and franchise tax exemption details
              directly from the Texas Comptroller.
            </p>
            <Button
              variant="outline"
              className="group"
              asChild
            >
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
