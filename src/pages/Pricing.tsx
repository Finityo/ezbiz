import { useState } from "react";
import SEOHead from "@/components/SEOHead";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "@/lib/utils";
import { trackClick } from "@/hooks/useAnalytics";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import BackToTop from "@/components/BackToTop";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Check, Eye, EyeOff } from "lucide-react";
import { PACKAGE_PRICES, ADDON_PRICES } from "@/lib/pricing";

const POPULAR_MAP: Record<string, boolean> = { deluxe: true };

const packages = (Object.entries(PACKAGE_PRICES) as [string, typeof PACKAGE_PRICES["basic"]][]).map(
  ([key, pkg]) => ({
    key,
    name: pkg.name,
    price: pkg.price,
    description: pkg.description,
    features: [...pkg.features],
    popular: !!POPULAR_MAP[key],
  })
);

const Pricing = () => {
  const navigate = useNavigate();
  const [showDescriptions, setShowDescriptions] = useState(false);

  const handleStart = (packageKey: string) => {
    const params = new URLSearchParams();
    params.set("package", packageKey);
    trackClick(`Start ${packageKey}`, "package_cta", `/order-flow?${params.toString()}`);
    navigate(`/order-flow?${params.toString()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Pricing" description="Transparent, affordable business formation packages starting at $0 + state fees. Compare Basic, Standard, and Premium plans." path="/pricing" />
      <Navigation />
      <FloatingCTA />
      <BackToTop />

      <main>
        {/* Hero */}
        <section className="bg-gradient-primary text-white py-12 md:py-20">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h1 className="text-3xl md:text-5xl font-bold mb-4">
              Choose Your Business Formation Package
            </h1>
            <p className="text-lg text-white/90">
              Transparent pricing. No hidden fees. State filing fees additional.
            </p>
          </div>
        </section>

        {/* Comparison Table */}
        <AnimatedSection className="py-10 md:py-16">
          <div className="container mx-auto px-4">

            {/* Description Toggle */}
            <div className="flex justify-end mb-4 max-w-5xl mx-auto">
              <button
                onClick={() => setShowDescriptions(!showDescriptions)}
                className="flex items-center gap-2 text-sm border border-border px-3 py-2 rounded-md hover:bg-muted/50 text-foreground transition-colors"
              >
                {showDescriptions ? (
                  <><EyeOff className="h-4 w-4" /> Hide Descriptions</>
                ) : (
                  <><Eye className="h-4 w-4" /> Show Descriptions</>
                )}
              </button>
            </div>

            <div className="hidden md:block overflow-x-auto">
              <table className="w-full border-collapse max-w-5xl mx-auto">
                <thead>
                  <tr>
                    <th className="text-left p-4 border border-border bg-muted/50 w-[35%]">
                      <span className="text-lg font-bold text-foreground">Features</span>
                    </th>
                    {packages.map((pkg) => (
                      <th
                        key={pkg.key}
                        className={`border border-border p-4 text-center ${
                          pkg.popular ? "bg-primary/5 ring-2 ring-primary ring-inset" : "bg-muted/30"
                        }`}
                      >
                        {pkg.popular && (
                          <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-1">
                            Most Popular
                          </div>
                        )}
                        <h3 className="text-xl font-bold text-foreground">{pkg.name}</h3>
                        <p className="text-2xl font-bold text-primary mt-1">
                          ${formatPrice(pkg.price)}
                        </p>
                        <p className="text-xs text-muted-foreground">+ state filing fee</p>
                        {showDescriptions && (
                          <p className="text-xs text-muted-foreground mt-2 italic">{pkg.description}</p>
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {/* Feature rows: use the longest feature list length */}
                  {Array.from({ length: Math.max(...packages.map((p) => p.features.length)) }).map((_, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? "bg-background" : "bg-muted/20"}>
                      <td className="border border-border p-4">
                        <div className="font-semibold text-foreground">
                          {/* Use complete package feature name as row label */}
                          {packages[packages.length - 1]?.features[idx] || ""}
                        </div>
                      </td>
                      {packages.map((pkg) => (
                        <td
                          key={pkg.key}
                          className={`border border-border p-4 text-center ${
                            pkg.popular ? "bg-primary/5" : ""
                          }`}
                        >
                          {idx < pkg.features.length ? (
                            <Check className="h-5 w-5 text-primary mx-auto" />
                          ) : (
                            <span className="text-muted-foreground">—</span>
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                  {/* CTA row */}
                  <tr>
                    <td className="border border-border p-4 font-bold text-foreground">
                      Start Filing
                    </td>
                    {packages.map((pkg) => (
                      <td
                        key={pkg.key}
                        className={`border border-border p-4 text-center ${
                          pkg.popular ? "bg-primary/5" : ""
                        }`}
                      >
                        <Button
                          className="touch-manipulation"
                          variant={pkg.popular ? "default" : "outline"}
                          onClick={() => handleStart(pkg.key)}
                          style={{ minHeight: "44px" }}
                        >
                          Start {pkg.name}
                        </Button>
                      </td>
                    ))}
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden space-y-6">
              {packages.map((pkg) => (
                <div
                  key={pkg.key}
                  className={`rounded-xl border p-5 ${
                    pkg.popular
                      ? "border-primary shadow-lg ring-2 ring-primary/20"
                      : "border-border"
                  }`}
                >
                  {pkg.popular && (
                    <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 text-center">
                      Most Popular
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-center text-foreground">{pkg.name}</h3>
                  <p className="text-3xl font-bold text-primary text-center mt-1">
                    ${formatPrice(pkg.price)}
                  </p>
                  <p className="text-xs text-muted-foreground text-center mb-2">+ state filing fee</p>
                  {showDescriptions && (
                    <p className="text-xs text-muted-foreground text-center mb-4 italic">{pkg.description}</p>
                  )}

                  <ul className="space-y-3 mb-5">
                    {pkg.features.map((feature) => (
                      <li key={feature} className="flex items-start gap-3">
                        <Check className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm font-medium text-foreground">{feature}</span>
                      </li>
                    ))}
                  </ul>

                  <Button
                    className="w-full touch-manipulation"
                    variant={pkg.popular ? "default" : "outline"}
                    onClick={() => handleStart(pkg.key)}
                    style={{ minHeight: "44px" }}
                  >
                    Start {pkg.name}
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>

        {/* Add-on services */}
        <AnimatedSection className="py-10 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4 max-w-4xl">
            <h2 className="text-2xl md:text-3xl font-bold text-center mb-8">
              Available Add-On Services
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {Object.entries(ADDON_PRICES)
                .filter(([key]) => !key.startsWith("whiteGlove"))
                .map(([, addon]) => (
                <div
                  key={addon.name}
                  className="border border-border rounded-lg p-4 bg-background text-center"
                >
                  <h3 className="font-semibold text-foreground">{addon.name}</h3>
                  <p className="text-xl font-bold text-primary mt-1">${formatPrice(addon.price)}</p>
                  <p className="text-xs text-muted-foreground mt-2">{addon.description}</p>
                </div>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
