import { Link } from "react-router-dom";
import { CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PACKAGE_PRICES, type PackageType } from "@/lib/pricing";
import { formatPrice } from "@/lib/utils";

/**
 * Package-aware pricing section.
 *
 * Every CTA deep-links to `/order-flow?package=<id>` where <id> is the
 * canonical PackageType key from `src/lib/pricing.ts`. There is intentionally
 * NO fallback to `/pricing` — these buttons must always start the order flow
 * with the matching Stripe Price ID preselected.
 */

interface PackagePricingCTAProps {
  /** Optional eyebrow label above the heading. */
  eyebrow?: string;
  heading?: string;
  subheading?: string;
  /** Which package to visually highlight as "Most Popular". */
  highlightPackage?: PackageType;
  /** Optional state slug appended to deep-links (e.g. "TX"). */
  stateCode?: string;
  /** Optional entity preset appended to deep-links ("llc" | "corporation"). */
  entityType?: "llc" | "corporation";
  /** Show the comparison link below the cards. Defaults to true. */
  showCompareLink?: boolean;
  className?: string;
}

const ORDER = ["basic", "deluxe", "complete"] as const satisfies readonly PackageType[];

const FEATURE_PREVIEW: Record<PackageType, readonly string[]> = {
  basic: [
    "Prepare & file Articles of Organization",
    "Name availability search",
    "Digital filing documents",
    "Lifetime customer support",
  ],
  deluxe: [
    "Everything in Basic",
    "Operating Agreement",
    "Banking Resolution",
    "Priority support",
  ],
  complete: [
    "Everything in Deluxe",
    "EIN filing service",
    "S-Corp election filing",
    "Business license research",
  ],
};

const CTA_COPY: Record<PackageType, string> = {
  basic: "Start with Basic",
  deluxe: "Start with Deluxe",
  complete: "Start with Complete",
};

const PackagePricingCTA = ({
  eyebrow = "Pricing",
  heading = "Pick a plan that matches your stage",
  subheading = "Transparent flat-rate packages. State fees shown upfront — no surprises.",
  highlightPackage = "deluxe",
  stateCode,
  entityType,
  showCompareLink = true,
  className,
}: PackagePricingCTAProps) => {
  const buildHref = (pkg: PackageType) => {
    const params = new URLSearchParams();
    params.set("package", pkg);
    if (stateCode) params.set("state", stateCode);
    if (entityType) params.set("entity", entityType);
    return `/order-flow?${params.toString()}`;
  };

  return (
    <section className={`py-20 bg-background ${className ?? ""}`}>
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          {eyebrow && (
            <p className="text-sm font-semibold tracking-widest text-secondary uppercase mb-3">
              {eyebrow}
            </p>
          )}
          <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">
            {heading}
          </h2>
          {subheading && (
            <p className="text-muted-foreground mt-4 font-body">{subheading}</p>
          )}
        </div>

        <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {ORDER.map((pkg) => {
            const config = PACKAGE_PRICES[pkg];
            const isHighlight = pkg === highlightPackage;
            return (
              <Card
                key={pkg}
                className={
                  isHighlight
                    ? "border-secondary border-2 shadow-xl relative"
                    : "border-border/60"
                }
              >
                {isHighlight && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full">
                    MOST POPULAR
                  </div>
                )}
                <CardHeader>
                  <CardTitle className="font-display capitalize">{config.name}</CardTitle>
                  <div className="flex items-baseline gap-2 pt-2">
                    <span className="text-4xl font-bold font-display text-primary">
                      ${formatPrice(config.price)}
                    </span>
                    <span className="text-sm text-muted-foreground">+ state fee</span>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {FEATURE_PREVIEW[pkg].map((f) => (
                      <li key={f} className="flex items-start gap-2 text-sm font-body">
                        <CheckCircle2 className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                  <Button
                    asChild
                    variant={isHighlight ? "default" : "outline"}
                    className="w-full"
                  >
                    <Link to={buildHref(pkg)} data-package={pkg}>
                      {CTA_COPY[pkg]}
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {showCompareLink && (
          <div className="text-center mt-8">
            <Link
              to="/pricing"
              className="text-sm text-secondary font-semibold hover:underline inline-flex items-center gap-1"
            >
              Compare full pricing →
            </Link>
          </div>
        )}
      </div>
    </section>
  );
};

export default PackagePricingCTA;
