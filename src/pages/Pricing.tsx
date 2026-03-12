import { useState } from "react";
import { formatPrice } from "@/lib/utils";
import { trackClick } from "@/hooks/useAnalytics";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import BackToTop from "@/components/BackToTop";
import AnimatedSection from "@/components/AnimatedSection";
import StaggeredGrid from "@/components/StaggeredGrid";
import TiltCard from "@/components/TiltCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, Shield, Users, FileText, MapPin } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useNavigate } from "react-router-dom";
import { PACKAGES, ADDONS } from "@/config/pricing";
import { getStateFee, getCorpStateFee, STATE_FILING_FEES, STATE_CORP_FILING_FEES } from "@/lib/state-fees";
import businessDocuments from "@/assets/business-documents.jpg";
import pricingHero from "@/assets/business-success.jpg";
import transparentPricing from "@/assets/transparent-pricing.jpg";
import customerSatisfaction from "@/assets/customer-satisfaction.jpg";
import ParallaxImage from "@/components/ParallaxImage";
import { EZBIZ_COPY } from "@/content/ezbizCopy";

const { pricing } = EZBIZ_COPY;
const trustIcons = [Shield, Users, FileText];

const packageKeyMap = ["basic", "deluxe", "complete"] as const;

const Pricing = () => {
  const navigate = useNavigate();
  const [selectedState, setSelectedState] = useState("");
  const stateFee = selectedState ? getStateFee(selectedState) : 0;
  const corpStateFee = selectedState ? getCorpStateFee(selectedState) : 0;

  const handlePackageCheckout = (packageKey: string) => {
    const params = new URLSearchParams();
    params.set('package', packageKey);
    if (selectedState) params.set('state', selectedState);
    trackClick(`Choose ${packageKey}`, 'package_cta', `/order-flow?${params.toString()}`);
    navigate(`/order-flow?${params.toString()}`);
  };

  const handleAddOnClick = () => {
    trackClick('Get Started Add-on', 'addon_cta', '/order-flow');
    navigate('/order-flow');
  };

  const llcPackages = pricing.llcPackages.map((pkg, i) => ({
    ...pkg,
    price: `$${formatPrice(PACKAGES[packageKeyMap[i]].price)}`,
    packageKey: packageKeyMap[i],
    period: "+ State Fee",
  }));

  const corpPackages = pricing.corpPackages.map((pkg, i) => ({
    ...pkg,
    price: `$${formatPrice(PACKAGES[packageKeyMap[i]].price)}`,
    packageKey: packageKeyMap[i],
    period: "+ State Fee",
  }));

  const additionalServices = [
    { name: ADDONS.ein.name, price: `$${formatPrice(ADDONS.ein.price)}` },
    { name: ADDONS.operatingAgreement.name, price: `$${formatPrice(ADDONS.operatingAgreement.price)}` },
    { name: ADDONS.registeredAgent.name, price: `$${formatPrice(ADDONS.registeredAgent.price)}` },
    { name: ADDONS.boiFiling.name, price: `$${formatPrice(ADDONS.boiFiling.price)}` },
    { name: ADDONS.licenseResearch.name, price: `$${formatPrice(ADDONS.licenseResearch.price)}` },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <FloatingCTA />
      <BackToTop />
      
      <main>
        {/* Hero Section */}
        <section className="relative bg-gradient-primary text-white overflow-hidden pattern-geometric">
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute inset-0 pattern-dots opacity-40"></div>
          <div className="container mx-auto px-4 py-12 md:py-20 relative z-10">
            <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="max-w-2xl">
                <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold mb-4 md:mb-6">{pricing.hero.headline}</h1>
                <p className="text-base md:text-xl mb-6 md:mb-8 text-white/90">{pricing.hero.subheadline}</p>
                <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 text-white/80 text-sm">
                  {pricing.hero.badges.map((badge, i) => (
                    <div key={i} className="flex items-center space-x-2">
                      <Check className="h-5 w-5 flex-shrink-0" />
                      <span>{badge}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="relative hidden md:block">
                <div className="absolute -inset-4 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-3xl blur-2xl"></div>
                <ParallaxImage 
                  src={pricingHero} 
                  alt="Professional business team celebrating success" 
                  className="relative shadow-2xl w-full h-auto object-cover scale-110"
                  speed={0.2}
                  maxOffset={80}
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-primary/30 to-transparent rounded-2xl pointer-events-none"></div>
              </div>
            </div>
          </div>
        </section>

        {/* Trust Indicators */}
        <AnimatedSection className="py-10 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">{pricing.trust.heading}</h2>
                  <div className="space-y-6">
                    {pricing.trust.items.map((item, i) => {
                      const IconComponent = trustIcons[i];
                      return (
                        <div key={i} className="flex items-start space-x-4">
                          <div className="bg-primary/10 p-3 rounded-lg">
                            <IconComponent className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                            <p className="text-muted-foreground">{item.description}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                <div className="relative order-1 lg:order-2">
                  <img 
                    src={transparentPricing} 
                    alt="Business calculator and financial documents showing transparent pricing" 
                    className="rounded-lg shadow-lg w-full h-auto"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* State Selector */}
        <AnimatedSection className="py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="max-w-xl mx-auto text-center">
              <div className="flex items-center justify-center gap-2 mb-3">
                <MapPin className="h-5 w-5 text-primary" />
                <h2 className="text-xl md:text-2xl font-bold">{pricing.stateSelector.heading}</h2>
              </div>
              <p className="text-muted-foreground mb-5 text-sm">{pricing.stateSelector.subheading}</p>
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="w-full max-w-xs mx-auto">
                  <SelectValue placeholder={pricing.stateSelector.placeholder} />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(STATE_FILING_FEES).map((state) => (
                    <SelectItem key={state} value={state}>
                      {state} — ${formatPrice(STATE_FILING_FEES[state])}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedState && (
                <div className="mt-3 text-sm font-medium text-primary flex flex-col sm:flex-row gap-1 sm:gap-4 justify-center">
                   <span>LLC filing fee: <span className="font-bold">${formatPrice(stateFee)}</span></span>
                   <span>Corp filing fee: <span className="font-bold">${formatPrice(corpStateFee)}</span></span>
                </div>
              )}
            </div>
          </div>
        </AnimatedSection>

        {/* LLC Packages */}
        <AnimatedSection className="py-10 md:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 md:mb-12">
              <div className="accent-line-center mb-4 md:mb-6"></div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">{pricing.llcSection.heading}</h2>
              <p className="text-base md:text-xl text-muted-foreground">{pricing.llcSection.subheading}</p>
            </div>
            
            <StaggeredGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto" staggerDelay={150}>
              {llcPackages.map((pkg, index) => (
                <TiltCard key={index} className={`relative ${'popular' in pkg && pkg.popular ? 'border-primary shadow-lg' : ''}`} tiltMax={6} scale={1.02}>
                  {'popular' in pkg && pkg.popular && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 z-20">
                      <div className="bg-primary text-white px-4 py-2 rounded-full text-sm font-semibold flex items-center">
                        <Star className="h-4 w-4 mr-1" />
                        Most Popular
                      </div>
                    </div>
                  )}
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                    <div className="text-4xl font-bold text-primary">{pkg.price}</div>
                    {selectedState ? (
                      <div className="text-sm text-muted-foreground">+ ${stateFee} {selectedState} filing fee = <span className="font-semibold text-foreground">${parseInt(pkg.price.replace('$', '')) + stateFee} total</span></div>
                    ) : (
                      <div className="text-sm text-muted-foreground">{pkg.period}</div>
                    )}
                    <CardDescription>{pkg.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start space-x-3">
                          <Check className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className={`w-full touch-manipulation ${'popular' in pkg && pkg.popular ? 'bg-primary' : ''}`}
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handlePackageCheckout(pkg.packageKey); }}
                      onTouchStart={(e) => e.stopPropagation()}
                      style={{ minHeight: '44px', WebkitTapHighlightColor: 'transparent' }}
                    >
                      Choose {pkg.name}
                    </Button>
                  </CardContent>
                </TiltCard>
              ))}
            </StaggeredGrid>
          </div>
        </AnimatedSection>

        {/* Corporation Packages */}
        <AnimatedSection className="py-10 md:py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 md:mb-12">
              <div className="accent-line-center mb-4 md:mb-6"></div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">{pricing.corpSection.heading}</h2>
              <p className="text-base md:text-xl text-muted-foreground">{pricing.corpSection.subheading}</p>
            </div>
            
            <StaggeredGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8 max-w-6xl mx-auto" staggerDelay={150}>
              {corpPackages.map((pkg, index) => (
                <TiltCard key={index} tiltMax={6} scale={1.02}>
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                    <div className="text-4xl font-bold text-primary">{pkg.price}</div>
                    {selectedState ? (
                      <div className="text-sm text-muted-foreground">+ ${corpStateFee} {selectedState} filing fee = <span className="font-semibold text-foreground">${parseInt(pkg.price.replace('$', '')) + corpStateFee} total</span></div>
                    ) : (
                      <div className="text-sm text-muted-foreground">{pkg.period}</div>
                    )}
                    <CardDescription>{pkg.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <ul className="space-y-3">
                      {pkg.features.map((feature, idx) => (
                        <li key={idx} className="flex items-start space-x-3">
                          <Check className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                          <span className="text-sm">{feature}</span>
                        </li>
                      ))}
                    </ul>
                    <Button 
                      className="w-full touch-manipulation" 
                      variant="outline"
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); handlePackageCheckout(pkg.packageKey); }}
                      onTouchStart={(e) => e.stopPropagation()}
                      style={{ minHeight: '44px', WebkitTapHighlightColor: 'transparent' }}
                    >
                      Choose {pkg.name}
                    </Button>
                  </CardContent>
                </TiltCard>
              ))}
            </StaggeredGrid>
          </div>
        </AnimatedSection>

        {/* Additional Services */}
        <section className="py-10 md:py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-8 md:mb-12">
              <div className="accent-line-center mb-4 md:mb-6"></div>
              <h2 className="text-2xl md:text-3xl font-bold mb-3 md:mb-4">{pricing.addOns.heading}</h2>
              <p className="text-base md:text-xl text-muted-foreground">{pricing.addOns.subheading}</p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-5xl mx-auto">
              {additionalServices.map((service, index) => (
                <Card key={index} className="text-center">
                  <CardHeader>
                    <CardTitle className="text-lg">{service.name}</CardTitle>
                    <div className="text-2xl font-bold text-primary">{service.price}</div>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full touch-manipulation"
                      onClick={() => handleAddOnClick()}
                      style={{ minHeight: '44px', WebkitTapHighlightColor: 'transparent' }}
                    >
                      Get Started
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Process Overview */}
        <section className="py-10 md:py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
                <div className="relative order-2 lg:order-1">
                  <img 
                    src={businessDocuments} 
                    alt="Business formation documents and legal paperwork" 
                    className="rounded-lg shadow-lg w-full h-auto"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-bl from-primary/20 to-transparent rounded-lg"></div>
                </div>
                <div className="order-1 lg:order-2">
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">{pricing.process.heading}</h2>
                  <div className="space-y-6">
                    {pricing.process.steps.map((step, i) => (
                      <div key={i} className="flex items-start space-x-4">
                        <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">{i + 1}</div>
                        <div>
                          <h3 className="text-xl font-semibold mb-2">{step.title}</h3>
                          <p className="text-muted-foreground">{step.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* State Fees Info */}
        <section className="py-10 md:py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-2xl md:text-3xl font-bold mb-4">{pricing.stateFees.heading}</h2>
                <p className="text-muted-foreground">State fees are in addition to our service fees and vary by state.</p>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>LLC Filing Fees by State</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-64 overflow-y-auto space-y-1">
                      {Object.entries(STATE_FILING_FEES).map(([state, fee]) => (
                        <div key={state} className="flex justify-between text-sm py-1 border-b border-border/50">
                          <span>{state}</span>
                          <span className="font-medium">${fee}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Corporation Filing Fees by State</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="max-h-64 overflow-y-auto space-y-1">
                      {Object.entries(STATE_CORP_FILING_FEES).map(([state, fee]) => (
                        <div key={state} className="flex justify-between text-sm py-1 border-b border-border/50">
                          <span>{state}</span>
                          <span className="font-medium">${fee}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Customer Satisfaction */}
        <section className="py-10 md:py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">
                <div>
                  <h2 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">Ready to Get Started?</h2>
                  <p className="text-lg text-muted-foreground mb-6">Join thousands of business owners who trust EZ Biz for their formation needs.</p>
                  <Button 
                    size="lg" 
                    className="touch-manipulation"
                    onClick={() => navigate('/order-flow')}
                    style={{ minHeight: '44px', WebkitTapHighlightColor: 'transparent' }}
                  >
                    Get Started Today
                  </Button>
                </div>
                <div className="relative">
                  <img 
                    src={customerSatisfaction} 
                    alt="Happy business owners reviewing their formation documents" 
                    className="rounded-lg shadow-lg w-full h-auto"
                    loading="lazy"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tl from-primary/20 to-transparent rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default Pricing;
