import { useState } from "react";
import { useSearchParams } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import BackToTop from "@/components/BackToTop";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, CheckCircle, ExternalLink } from "lucide-react";
import { STRIPE_PACKAGES } from "@/lib/stripe-config";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";

const BusinessFormation = () => {
  const [searchParams] = useSearchParams();
  const [selectedState, setSelectedState] = useState(searchParams.get("state") || "");
  const [selectedBusinessType, setSelectedBusinessType] = useState(searchParams.get("entityType") || "");
  const { checkout, loading: checkoutLoading } = useStripeCheckout();

  const states = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
    "Delaware", "District Of Columbia", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", 
    "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", 
    "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", 
    "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", 
    "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", 
    "Wisconsin", "Wyoming"
  ];

  const businessTypes = [
    "C-Corporation",
    "Limited Liability Company",
    "Non-Profit Corporation", 
    "Professional Corporation",
    "S-Corporation"
  ];

  const packages = [
    {
      name: STRIPE_PACKAGES.basic.name,
      price: `$${STRIPE_PACKAGES.basic.price}`,
      priceId: STRIPE_PACKAGES.basic.priceId,
      features: [
        "Name Availability Check",
        "Official Filed Articles of Incorporation",
        "Registered Agent Service (1st Year)",
        "Federal Tax ID Number (EIN)",
        "Operating Agreement Template"
      ]
    },
    {
      name: STRIPE_PACKAGES.standard.name, 
      price: `$${STRIPE_PACKAGES.standard.price}`,
      priceId: STRIPE_PACKAGES.standard.priceId,
      features: [
        "Everything in Basic",
        "Expedited Processing",
        "Banking Resolution",
        "Minutes & Bylaws",
        "Stock Certificates",
        "Corporate Seal"
      ]
    },
    {
      name: STRIPE_PACKAGES.premium.name,
      price: `$${STRIPE_PACKAGES.premium.price}`,
      priceId: STRIPE_PACKAGES.premium.priceId,
      badge: "Best Value",
      features: [
        "Everything in Deluxe",
        "S-Corp Tax Election",
        "Business License Research",
        "Compliance Calendar",
        "Annual Report Filing"
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <FloatingCTA />
      <BackToTop />

      {/* Header Section */}
      <div className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-8 relative overflow-hidden pattern-geometric">
        <div className="absolute inset-0 pattern-dots opacity-30"></div>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-3xl lg:text-4xl font-bold text-foreground mb-4 font-display">
              Form Your {selectedState} {selectedBusinessType}
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Each package is backed by our 100% Satisfaction Guarantee
            </p>
          </div>
        </div>
      </div>

      {/* Form Controls */}
      <div className="container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          <Card className="p-6 mb-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
              <div>
                <label className="block text-sm font-medium mb-2">State</label>
                <Select value={selectedState} onValueChange={setSelectedState}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select State" />
                  </SelectTrigger>
                  <SelectContent>
                    {states.map((state) => (
                      <SelectItem key={state} value={state}>
                        {state}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Business Type</label>
                <Select value={selectedBusinessType} onValueChange={setSelectedBusinessType}>
                  <SelectTrigger className="h-12">
                    <SelectValue placeholder="Select Business Type" />
                  </SelectTrigger>
                  <SelectContent>
                    {businessTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <Button size="lg" className="h-12 bg-primary hover:bg-primary-light">
                Update
              </Button>
            </div>
          </Card>

          {/* Trustpilot Widget */}
          <div className="flex justify-center mb-8">
            <div className="bg-card p-4 rounded-lg shadow-smooth border border-border">
              <div className="flex items-center mb-2">
                <div className="flex text-success mr-3">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 fill-current" />
                  ))}
                </div>
                <span className="font-bold text-success">Trustpilot</span>
              </div>
              <div className="text-sm">
                <span className="font-bold">TrustScore 4.9</span> | <span className="font-bold">1,157</span> reviews
              </div>
            </div>
          </div>

          {/* Pricing Packages */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {packages.map((pkg, index) => (
              <Card key={index} className={`p-6 relative ${pkg.badge ? 'border-primary shadow-lg' : ''}`}>
                {pkg.badge && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-sm font-medium">
                      {pkg.badge}
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-6">
                  <h3 className="text-xl font-bold mb-2 font-display">{pkg.name}</h3>
                  <div className="text-3xl font-bold text-primary mb-1">{pkg.price}</div>
                  <div className="text-sm text-muted-foreground">+ state fees</div>
                </div>

                <ul className="space-y-3 mb-6">
                  {pkg.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-start">
                      <CheckCircle className="h-4 w-4 text-success mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm">{feature}</span>
                    </li>
                  ))}
                </ul>

                <Button 
                  className="w-full bg-primary hover:bg-primary-light text-primary-foreground font-bold"
                  size="lg"
                  disabled={checkoutLoading}
                  onClick={() => checkout([{ priceId: pkg.priceId }])}
                >
                  {checkoutLoading ? "Processing..." : "Continue"}
                </Button>
              </Card>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default BusinessFormation;