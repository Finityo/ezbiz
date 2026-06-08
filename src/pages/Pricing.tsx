import React, { useState } from "react";
import SEOHead from "@/components/SEOHead";
import heroLogo from "@/assets/logo-ezbiz-final.webp";
import { useNavigate } from "react-router-dom";
import { formatPrice } from "@/lib/utils";
import { trackClick } from "@/hooks/useAnalytics";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import BackToTop from "@/components/BackToTop";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import {
  PACKAGE_PRICES,
  ADDON_PRICES,
  PROCESSING_PRICES,
  SHIPPING_PRICE,
  type PackageType,
  type AddonId,
} from "@/lib/pricing";
import { Checkbox } from "@/components/ui/checkbox";

/* ------------------------------------------------------------------ */
/*  PACKAGES — derived from pricing config                            */
/* ------------------------------------------------------------------ */

const PACKAGES = Object.entries(PACKAGE_PRICES).map(([key, pkg]) => ({
  key: key as PackageType,
  name: pkg.name,
  price: pkg.price,
  description: pkg.description,
  popular: key === "deluxe",
}));

/* ------------------------------------------------------------------ */
/*  TABLE ROWS — all values from pricing config, zero hardcoded $     */
/* ------------------------------------------------------------------ */

type CellValue = "included" | "not-included" | { price: number } | string;

interface TableRow {
  label: string;
  description?: string;
  section?: string;
  /** When set, dollar-price cells in this row render as selectable add-on checkboxes that flow through to /order-flow. */
  addonId?: AddonId;
  basic: CellValue;
  deluxe: CellValue;
  complete: CellValue;
}

const TABLE_ROWS: TableRow[] = [
  // ── Formation ──
  {
    section: "Formation",
    label: "Articles of Organization Filing",
    description: "Preparation and filing of your formation documents with the state.",
    basic: "included",
    deluxe: "included",
    complete: "included",
  },
  {
    label: "Name Availability Search",
    description: "Ensures your business name is available before filing.",
    basic: "included",
    deluxe: "included",
    complete: "included",
  },
  {
    label: "Digital Filing Documents",
    description: "Receive all official formation documents in digital format.",
    basic: "included",
    deluxe: "included",
    complete: "included",
  },
  {
    label: "Order Tracking Dashboard",
    description: "Track every step of your filing from submission to approval.",
    basic: "included",
    deluxe: "included",
    complete: "included",
  },
  {
    label: "Lifetime Customer Support",
    description: "Get help whenever you need it — no expiration on support access.",
    basic: "included",
    deluxe: "included",
    complete: "included",
  },

  // ── Compliance ──
  {
    section: "Compliance",
    label: "Operating Agreement",
    description: ADDON_PRICES.operatingAgreement.description,
    basic: "not-included",
    deluxe: "included",
    complete: "included",
  },
  {
    label: "Banking Resolution",
    description: "Official resolution authorizing your company to open business bank accounts.",
    basic: "not-included",
    deluxe: "included",
    complete: "included",
  },
  {
    label: "Initial Compliance Instructions",
    description: "Step-by-step guide to keep your new business in good standing.",
    basic: "not-included",
    deluxe: "included",
    complete: "included",
  },
  {
    label: "Compliance Alerts",
    description: ADDON_PRICES.complianceAlerts.description,
    addonId: "complianceAlerts",
    basic: { price: ADDON_PRICES.complianceAlerts.price },
    deluxe: { price: ADDON_PRICES.complianceAlerts.price },
    complete: "included",
  },

  // ── Tax Setup ──
  {
    section: "Tax Setup",
    label: "EIN Filing Service",
    description: ADDON_PRICES.ein.description,
    addonId: "ein",
    basic: { price: ADDON_PRICES.ein.price },
    deluxe: "included",
    complete: "included",
  },
  {
    label: "S-Corp Election Filing",
    description: ADDON_PRICES.sCorp.description,
    addonId: "sCorp",
    basic: { price: ADDON_PRICES.sCorp.price },
    deluxe: { price: ADDON_PRICES.sCorp.price },
    complete: "included",
  },

  // ── Business Tools ──
  {
    section: "Business Tools",
    label: "Business License Research",
    description: ADDON_PRICES.licenseResearch.description,
    addonId: "licenseResearch",
    basic: { price: ADDON_PRICES.licenseResearch.price },
    deluxe: { price: ADDON_PRICES.licenseResearch.price },
    complete: "included",
  },
  {
    label: "Corporate Kit",
    description: ADDON_PRICES.corporateKit.description,
    addonId: "corporateKit",
    basic: { price: ADDON_PRICES.corporateKit.price },
    deluxe: { price: ADDON_PRICES.corporateKit.price },
    complete: "included",
  },
  {
    label: "Registered Agent Service",
    description: ADDON_PRICES.registeredAgent.description,
    addonId: "registeredAgent",
    basic: { price: ADDON_PRICES.registeredAgent.price },
    deluxe: { price: ADDON_PRICES.registeredAgent.price },
    complete: { price: ADDON_PRICES.registeredAgent.price },
  },
  {
    label: "DBA Filing",
    description: ADDON_PRICES.dba.description,
    addonId: "dba",
    basic: { price: ADDON_PRICES.dba.price },
    deluxe: { price: ADDON_PRICES.dba.price },
    complete: { price: ADDON_PRICES.dba.price },
  },
  {
    label: "Annual Report Filing",
    description: ADDON_PRICES.annualReport.description,
    addonId: "annualReport",
    basic: { price: ADDON_PRICES.annualReport.price },
    deluxe: { price: ADDON_PRICES.annualReport.price },
    complete: { price: ADDON_PRICES.annualReport.price },
  },

  // ── Processing Speed ──
  {
    section: "Processing Speed",
    label: "Standard Processing",
    description: PROCESSING_PRICES.standard.description,
    basic: "included",
    deluxe: "included",
    complete: "included",
  },
  {
    label: "Express Processing",
    description: PROCESSING_PRICES.express.description,
    basic: { price: PROCESSING_PRICES.express.price },
    deluxe: { price: PROCESSING_PRICES.express.price },
    complete: { price: PROCESSING_PRICES.express.price },
  },

  // ── Shipping ──
  {
    section: "Shipping",
    label: "Shipping & Handling",
    description: "Delivery of your approved formation documents via U.S. First Class Priority Mail.",
    basic: { price: SHIPPING_PRICE },
    deluxe: { price: SHIPPING_PRICE },
    complete: { price: SHIPPING_PRICE },
  },
];

/* ------------------------------------------------------------------ */
/*  CELL RENDERER                                                     */
/* ------------------------------------------------------------------ */

function CellContent({
  value,
  addonId,
  pkg,
  selected,
  onToggle,
}: {
  value: CellValue;
  addonId?: AddonId;
  pkg: PackageType;
  selected: boolean;
  onToggle: (pkg: PackageType, addonId: AddonId) => void;
}) {
  if (value === "included") {
    return <Check className="h-5 w-5 text-primary mx-auto" />;
  }
  if (value === "not-included") {
    return <span className="text-muted-foreground">—</span>;
  }
  if (typeof value === "string") {
    return <span className="text-sm font-semibold text-primary">{value}</span>;
  }
  // dollar-priced cell
  if (addonId) {
    return (
      <label
        className="inline-flex items-center gap-2 cursor-pointer select-none"
        onClick={(e) => e.stopPropagation()}
      >
        <Checkbox
          checked={selected}
          onCheckedChange={() => onToggle(pkg, addonId)}
          aria-label={`Add ${ADDON_PRICES[addonId].name} to ${pkg} package`}
        />
        <span className={`text-sm font-semibold ${selected ? "text-primary" : "text-foreground"}`}>
          +${formatPrice(value.price)}
        </span>
      </label>
    );
  }
  return <span className="text-sm font-semibold text-foreground">${formatPrice(value.price)}</span>;
}

/* ------------------------------------------------------------------ */
/*  PAGE                                                              */
/* ------------------------------------------------------------------ */

const Pricing = () => {
  const navigate = useNavigate();
  const [showDescriptions, setShowDescriptions] = useState(false);
  const [selectedAddOns, setSelectedAddOns] = useState<Record<PackageType, Set<AddonId>>>({
    basic: new Set(),
    deluxe: new Set(),
    complete: new Set(),
  });

  const toggleAddon = (pkg: PackageType, addonId: AddonId) => {
    setSelectedAddOns((prev) => {
      const next = new Set(prev[pkg]);
      if (next.has(addonId)) next.delete(addonId); else next.add(addonId);
      return { ...prev, [pkg]: next };
    });
  };

  const addonsTotal = (pkg: PackageType) =>
    Array.from(selectedAddOns[pkg]).reduce(
      (sum, id) => sum + (ADDON_PRICES[id]?.price || 0),
      0,
    );

  const handleStart = (packageKey: PackageType) => {
    const params = new URLSearchParams();
    params.set("package", packageKey);
    const addons = Array.from(selectedAddOns[packageKey]);
    if (addons.length) params.set("addons", addons.join(","));
    const href = `/order-flow?${params.toString()}`;
    trackClick(`Start ${packageKey}`, "package_cta", href);
    navigate(href);
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="Pricing"
        description="Transparent, affordable business formation packages starting at $149 + state fees. Compare Basic, Deluxe, and Complete plans."
        path="/pricing"
      />
      <Navigation />
      <FloatingCTA />
      <BackToTop />

      <main>
        {/* Hero */}
        <section className="gradient-primary text-white py-10 md:py-14">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <div className="flex justify-center mb-5">
              <div className="bg-white rounded-xl p-3 shadow-lg">
                <img
                  src={heroLogo}
                  alt="EZ Biz Filing logo"
                  className="w-56 md:w-80 object-contain"
                />
              </div>
            </div>
            <p className="text-base md:text-lg text-white/80 mb-2">
              Veteran-owned business formation guidance
            </p>
            <h1 className="text-3xl md:text-5xl font-bold mb-3">
              Choose Your Package &amp; Launch Today
            </h1>
            <p className="text-base text-white/90">
              Each package is backed by our 100% Satisfaction Guarantee.
            </p>
          </div>
        </section>

        {/* ── DESKTOP TABLE ── */}
        <section className="hidden md:block py-4 md:py-8">
          <div className="container mx-auto px-4 max-w-6xl">
            <table className="w-full border-collapse">
              {/* Sticky header */}
              <thead className="sticky top-0 z-30 bg-background border-b border-border">
                <tr>
                  <th className="text-left p-4 border border-border bg-background w-[40%] align-bottom">
                    <span className="text-sm font-semibold text-muted-foreground">Features</span>
                  </th>

                  {PACKAGES.map((pkg) => (
                    <th
                      key={pkg.key}
                      className={`border border-border p-5 text-center align-top transition-transform ${
                        pkg.popular
                          ? "bg-primary/5 ring-2 ring-primary ring-inset scale-[1.02] shadow-sm"
                          : "bg-muted/30"
                      }`}
                    >
                      {pkg.popular && (
                        <span className="inline-block text-[10px] font-bold text-primary-foreground bg-primary rounded-full px-3 py-0.5 uppercase tracking-wider mb-2">
                          Most Popular
                        </span>
                      )}
                      <h3 className="text-xl font-bold text-foreground">{pkg.name}</h3>
                      <p className="text-xs text-muted-foreground">one-time fee</p>
                      <p className="text-2xl font-bold text-primary mt-1">${formatPrice(pkg.price)}</p>
                      <p className="text-xs text-muted-foreground mt-1">+ State Fees</p>
                      {pkg.popular && (
                        <p className="text-xs text-primary font-medium mt-2">
                          Best balance of protection &amp; value
                        </p>
                      )}
                      {showDescriptions && (
                        <p className="text-xs text-muted-foreground mt-2 italic">{pkg.description}</p>
                      )}
                      <Button
                        className="mt-3 touch-manipulation"
                        variant={pkg.popular ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleStart(pkg.key)}
                        style={{ minHeight: "40px" }}
                      >
                        Continue
                      </Button>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody>
                {TABLE_ROWS.map((row, idx) => (
                  <React.Fragment key={idx}>
                    {row.section && (
                      <tr>
                        <td colSpan={4} className="border border-border p-4 bg-muted/40">
                          <span className="text-sm font-bold text-primary uppercase tracking-wide">
                            {row.section}
                          </span>
                        </td>
                      </tr>
                    )}

                    <tr className="group border-b border-border hover:bg-muted/40 transition-colors">
                      <td className="border border-border px-4 py-3">
                        <div className="text-sm font-semibold text-foreground">{row.label}</div>
                        {showDescriptions && row.description && (
                          <p className="text-xs text-muted-foreground mt-1 leading-relaxed">
                            {row.description}
                          </p>
                        )}
                      </td>

                      {PACKAGES.map((pkg) => (
                        <td
                          key={pkg.key}
                          className={`border border-border px-4 py-3 text-center align-middle transition-colors ${
                            pkg.popular
                              ? "bg-primary/5 group-hover:bg-primary/10"
                              : "group-hover:bg-muted/50"
                          }`}
                        >
                          <CellContent
                            value={row[pkg.key]}
                            addonId={row.addonId}
                            pkg={pkg.key}
                            selected={!!row.addonId && selectedAddOns[pkg.key].has(row.addonId)}
                            onToggle={toggleAddon}
                          />
                        </td>
                      ))}
                    </tr>
                  </React.Fragment>
                ))}

                {/* CTA row */}
                <tr className="bg-muted/20">
                  <td className="border border-border p-4 font-bold text-foreground text-lg">
                    Start Filing
                  </td>
                  {PACKAGES.map((pkg) => (
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
                      {addonsTotal(pkg.key) > 0 && (
                        <p className="text-xs text-muted-foreground mt-2">
                          {selectedAddOns[pkg.key].size} add-on{selectedAddOns[pkg.key].size === 1 ? "" : "s"} · +${formatPrice(addonsTotal(pkg.key))}
                        </p>
                      )}
                    </td>
                  ))}
                </tr>
              </tbody>
            </table>

            <p className="text-xs text-muted-foreground mt-4 text-center">
              Prices shown are one-time service fees. State filing fees are additional and vary by state.
            </p>
            <p className="text-sm text-muted-foreground mt-3 text-center">
              Most customers choose the <span className="font-semibold text-foreground">Deluxe</span> package because it includes the essential compliance documents needed to properly operate and protect a new business.
            </p>
          </div>
        </section>

        {/* ── MOBILE CARDS ── */}
        <section className="md:hidden py-4">
          <div className="container mx-auto px-4">
            <div className="space-y-6">
              {PACKAGES.map((pkg) => (
                <div
                  key={pkg.key}
                  className={`rounded-xl border p-5 ${
                    pkg.popular ? "border-primary shadow-lg ring-2 ring-primary/20" : "border-border"
                  }`}
                >
                  {pkg.popular && (
                    <div className="text-xs font-semibold text-primary uppercase tracking-wider mb-2 text-center">
                      Best Value
                    </div>
                  )}
                  <h3 className="text-xl font-bold text-center text-foreground">{pkg.name}</h3>
                  <p className="text-xs text-muted-foreground text-center">one-time fee</p>
                  <p className="text-3xl font-bold text-primary text-center mt-1">
                    ${formatPrice(pkg.price)}
                  </p>
                  <p className="text-xs text-muted-foreground text-center mb-1">+ State Fees</p>
                  {showDescriptions && (
                    <p className="text-xs text-muted-foreground text-center mb-3 italic">{pkg.description}</p>
                  )}

                  <div className="divide-y divide-border mt-4 mb-5">
                    {TABLE_ROWS.map((row, idx) => {
                      const val = row[pkg.key];
                      if (val === "not-included") return null;
                      return (
                        <div key={idx} className="py-3 flex items-start justify-between gap-3">
                          <div className="flex-1">
                            <span className="text-sm font-medium text-foreground">{row.label}</span>
                            {showDescriptions && row.description && (
                              <p className="text-xs text-muted-foreground mt-0.5">{row.description}</p>
                            )}
                          </div>
                          <div className="flex-shrink-0 pt-0.5">
                            <CellContent
                              value={val}
                              addonId={row.addonId}
                              pkg={pkg.key}
                              selected={!!row.addonId && selectedAddOns[pkg.key].has(row.addonId)}
                              onToggle={toggleAddon}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>

                  <Button
                    className="w-full touch-manipulation"
                    variant={pkg.popular ? "default" : "outline"}
                    onClick={() => handleStart(pkg.key)}
                    style={{ minHeight: "44px" }}
                  >
                    Continue
                  </Button>
                  {addonsTotal(pkg.key) > 0 && (
                    <p className="text-xs text-center text-muted-foreground mt-2">
                      {selectedAddOns[pkg.key].size} add-on{selectedAddOns[pkg.key].size === 1 ? "" : "s"} selected · +${formatPrice(addonsTotal(pkg.key))}
                    </p>
                  )}
                </div>
              ))}
            </div>

            <p className="text-xs text-muted-foreground mt-4 text-center">
              Prices shown are one-time service fees. State filing fees are additional and vary by state.
            </p>
          </div>
        </section>

        {/* Satisfaction guarantee */}
        <section className="py-10 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4 max-w-2xl text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-3">100% Satisfaction Guaranteed</h2>
            <p className="text-muted-foreground">
              Or we will refund 100% of our service fees, no questions asked!
            </p>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
