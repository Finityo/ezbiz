import Navigation from "@/components/Navigation";
import FloatingCTA from "@/components/FloatingCTA";
import BackToTop from "@/components/BackToTop";
import AnimatedSection from "@/components/AnimatedSection";
import StaggeredGrid from "@/components/StaggeredGrid";
import TiltCard from "@/components/TiltCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Star, Shield, Users, FileText } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useToast } from "@/hooks/use-toast";
import businessConsultation from "@/assets/business-consultation.jpg";
import businessDocuments from "@/assets/business-documents.jpg";
import businessSuccess from "@/assets/business-success.jpg";
import pricingHero from "@/assets/pricing-hero.jpg";
import transparentPricing from "@/assets/transparent-pricing.jpg";
import customerSatisfaction from "@/assets/customer-satisfaction.jpg";
import ParallaxImage from "@/components/ParallaxImage";

const Pricing = () => {
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePackageSelect = (packageName: string, packageType: string) => {
    // Prevent event bubbling on mobile
    console.log(`Package selected: ${packageName} (${packageType})`);
    
    toast({
      title: "Package Selected!",
      description: `You selected ${packageName}. Redirecting to order form...`,
    });
    
    // Navigate to consultation page for now, can be updated to specific order page later
    setTimeout(() => {
      navigate("/consultation", { 
        state: { 
          selectedPackage: packageName, 
          packageType: packageType 
        } 
      });
    }, 1500);
  };

  const handleServiceAdd = (serviceName: string) => {
    console.log(`Service added: ${serviceName}`);
    
    toast({
      title: "Service Added!",
      description: `${serviceName} has been noted. Contact us to add this service.`,
    });
  };
  const llcPackages = [
    {
      name: "Basic LLC",
      price: "$49",
      period: "+ State Fee",
      description: "Essential LLC formation service",
      features: [
        "Articles of Organization filing",
        "Registered Agent service (1 year)",
        "EIN application",
        "Operating Agreement template",
        "Email support"
      ],
      popular: false
    },
    {
      name: "Standard LLC", 
      price: "$149",
      period: "+ State Fee",
      description: "Most popular LLC package",
      features: [
        "Everything in Basic",
        "Express processing",
        "Banking resolution",
        "Compliance calendar",
        "Priority phone support",
        "Business name search"
      ],
      popular: true
    },
    {
      name: "Premium LLC",
      price: "$299", 
      period: "+ State Fee",
      description: "Complete LLC formation with extras",
      features: [
        "Everything in Standard",
        "Custom Operating Agreement",
        "Business license research",
        "Domain name consultation", 
        "Trademark search",
        "1-hour attorney consultation"
      ],
      popular: false
    }
  ];

  const corpPackages = [
    {
      name: "Basic Corporation",
      price: "$99",
      period: "+ State Fee", 
      description: "Essential corporation formation",
      features: [
        "Articles of Incorporation filing",
        "Registered Agent service (1 year)",
        "EIN application",
        "Corporate bylaws template",
        "Email support"
      ]
    },
    {
      name: "Standard Corporation",
      price: "$199",
      period: "+ State Fee",
      description: "Complete corporation package", 
      features: [
        "Everything in Basic",
        "Custom Corporate Bylaws",
        "Stock certificates",
        "Corporate seal",
        "Priority support",
        "Banking resolution"
      ]
    },
    {
      name: "Premium Corporation", 
      price: "$399",
      period: "+ State Fee",
      description: "Full-service corporation formation",
      features: [
        "Everything in Standard",
        "Attorney consultation",
        "S-Corp election assistance",
        "Compliance calendar",
        "Business license research",
        "Ongoing support"
      ]
    }
  ];

  const additionalServices = [
    { name: "Registered Agent Service", price: "$199/year" },
    { name: "Business Name Search", price: "$49" },
    { name: "DBA Filing", price: "$99" },
    { name: "EIN Application", price: "$79" },
    { name: "Operating Agreement", price: "$199" },
    { name: "Corporate Bylaws", price: "$299" },
    { name: "Business License Research", price: "$149" },
    { name: "Trademark Search", price: "$99" }
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
          <div className="container mx-auto px-4 py-20 relative z-10">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="max-w-2xl">
                <h1 className="text-5xl font-bold mb-6">Transparent Pricing</h1>
                <p className="text-xl mb-8 text-white/90">
                  No hidden fees. No surprises. Choose the package that's right for your business.
                </p>
                <div className="flex items-center space-x-6 text-white/80">
                  <div className="flex items-center space-x-2">
                    <Check className="h-5 w-5" />
                    <span>No Hidden Fees</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-5 w-5" />
                    <span>Money-Back Guarantee</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Check className="h-5 w-5" />
                    <span>Expert Support</span>
                  </div>
                </div>
              </div>
              <div className="relative">
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
        <AnimatedSection className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Why Choose Finityo?</h2>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Shield className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">100% Satisfaction Guaranteed</h3>
                        <p className="text-muted-foreground">We stand behind our work with a complete money-back guarantee.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <Users className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Expert Support</h3>
                        <p className="text-muted-foreground">Our experienced team guides you through every step of formation.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary/10 p-3 rounded-lg">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">All Documents Included</h3>
                        <p className="text-muted-foreground">Get all necessary formation documents and ongoing compliance support.</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="relative order-1 lg:order-2">
                  <img 
                    src={transparentPricing} 
                    alt="Business calculator and financial documents showing transparent pricing" 
                    className="rounded-lg shadow-lg w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/20 to-transparent rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </AnimatedSection>

        {/* LLC Packages */}
        <AnimatedSection className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="accent-line-center mb-6"></div>
              <h2 className="text-3xl font-bold mb-4">LLC Formation Packages</h2>
              <p className="text-xl text-muted-foreground">Start your Limited Liability Company with confidence</p>
            </div>
            
            <StaggeredGrid className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto" staggerDelay={150}>
              {llcPackages.map((pkg, index) => (
                <TiltCard key={index} className={`relative ${pkg.popular ? 'border-primary shadow-lg' : ''}`} tiltMax={6} scale={1.02}>
                  {pkg.popular && (
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
                    <div className="text-sm text-muted-foreground">{pkg.period}</div>
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
                      className={`w-full touch-manipulation ${pkg.popular ? 'bg-primary' : ''}`}
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handlePackageSelect(pkg.name, 'LLC');
                      }}
                      onTouchStart={(e) => e.stopPropagation()}
                      style={{ 
                        minHeight: '44px',
                        WebkitTapHighlightColor: 'transparent'
                      }}
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
        <AnimatedSection className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="accent-line-center mb-6"></div>
              <h2 className="text-3xl font-bold mb-4">Corporation Formation Packages</h2>
              <p className="text-xl text-muted-foreground">Establish your corporation with professional service</p>
            </div>
            
            <StaggeredGrid className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto" staggerDelay={150}>
              {corpPackages.map((pkg, index) => (
                <TiltCard key={index} tiltMax={6} scale={1.02}>
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">{pkg.name}</CardTitle>
                    <div className="text-4xl font-bold text-primary">{pkg.price}</div>
                    <div className="text-sm text-muted-foreground">{pkg.period}</div>
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
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handlePackageSelect(pkg.name, 'Corporation');
                      }}
                      onTouchStart={(e) => e.stopPropagation()}
                      style={{ 
                        minHeight: '44px',
                        WebkitTapHighlightColor: 'transparent'
                      }}
                    >
                      Choose {pkg.name}
                    </Button>
                  </CardContent>
                </TiltCard>
              ))}
            </StaggeredGrid>
          </div>
        </AnimatedSection>

        {/* Process Overview */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div className="relative order-2 lg:order-1">
                  <img 
                    src={businessDocuments} 
                    alt="Business formation documents and legal paperwork" 
                    className="rounded-lg shadow-lg w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-bl from-primary/20 to-transparent rounded-lg"></div>
                </div>
                <div className="order-1 lg:order-2">
                  <h2 className="text-3xl font-bold mb-6">Simple 3-Step Process</h2>
                  <div className="space-y-6">
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">1</div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Choose Your Package</h3>
                        <p className="text-muted-foreground">Select the formation package that best fits your business needs and budget.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">2</div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">Provide Information</h3>
                        <p className="text-muted-foreground">Complete our simple form with your business details and preferences.</p>
                      </div>
                    </div>
                    <div className="flex items-start space-x-4">
                      <div className="bg-primary text-white w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm">3</div>
                      <div>
                        <h3 className="text-xl font-semibold mb-2">We Handle the Rest</h3>
                        <p className="text-muted-foreground">Our experts prepare and file all documents while keeping you informed.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Additional Services */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <div className="accent-line-center mb-6"></div>
              <h2 className="text-3xl font-bold mb-4">Additional Services</h2>
              <p className="text-xl text-muted-foreground">Add-on services to complement your business formation</p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
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
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                        handleServiceAdd(service.name);
                      }}
                      onTouchStart={(e) => e.stopPropagation()}
                      style={{ 
                        minHeight: '44px',
                        WebkitTapHighlightColor: 'transparent'
                      }}
                    >
                      Add Service
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* State Fees Info */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-8">State Filing Fees</h2>
              <Card>
                <CardContent className="p-8">
                  <div className="grid md:grid-cols-2 gap-8">
                    <div>
                      <h3 className="text-xl font-semibold mb-4">LLC State Fees</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Delaware</span>
                          <span>$90</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Wyoming</span>
                          <span>$100</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Nevada</span>
                          <span>$75</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Florida</span>
                          <span>$125</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Texas</span>
                          <span>$300</span>
                        </div>
                        <div className="flex justify-between">
                          <span>California</span>
                          <span>$70</span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold mb-4">Corporation State Fees</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Delaware</span>
                          <span>$89</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Wyoming</span>
                          <span>$100</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Nevada</span>
                          <span>$75</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Florida</span>
                          <span>$70</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Texas</span>
                          <span>$300</span>
                        </div>
                        <div className="flex justify-between">
                          <span>California</span>
                          <span>$100</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="mt-6 p-4 bg-muted rounded-lg">
                    <p className="text-sm text-muted-foreground">
                      * State fees are paid directly to the state and are in addition to our service fees. 
                      Fees may vary by state and are subject to change. Contact us for current fees in your state.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Money Back Guarantee */}
        <section className="py-16 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <h2 className="text-3xl font-bold mb-6">100% Satisfaction Guarantee</h2>
                  <Card className="border-success">
                    <CardContent className="p-8">
                      <div className="flex items-center justify-center mb-6">
                        <div className="w-16 h-16 bg-success rounded-full flex items-center justify-center">
                          <Check className="h-8 w-8 text-white" />
                        </div>
                      </div>
                      <h3 className="text-2xl font-semibold mb-4">Money-Back Guarantee</h3>
                      <p className="text-muted-foreground mb-6">
                        We're so confident in our services that we offer a 100% money-back guarantee. 
                        If you're not completely satisfied with our service, we'll refund your money within 60 days.
                      </p>
                      <div className="grid md:grid-cols-3 gap-4 text-sm">
                        <div>
                          <Check className="h-5 w-5 text-success mx-auto mb-2" />
                          <div className="font-semibold">Fast Processing</div>
                          <div className="text-muted-foreground">Quick turnaround times</div>
                        </div>
                        <div>
                          <Check className="h-5 w-5 text-success mx-auto mb-2" />
                          <div className="font-semibold">Expert Support</div>
                          <div className="text-muted-foreground">Professional guidance</div>
                        </div>
                        <div>
                          <Check className="h-5 w-5 text-success mx-auto mb-2" />
                          <div className="font-semibold">Accuracy Guaranteed</div>
                          <div className="text-muted-foreground">Error-free filing</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
                <div className="relative">
                  <img 
                    src={customerSatisfaction} 
                    alt="Satisfied customers reviewing business services with happy expressions" 
                    className="rounded-lg shadow-lg w-full h-auto"
                  />
                  <div className="absolute inset-0 bg-gradient-to-tl from-success/20 to-transparent rounded-lg"></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-primary text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Ready to Start Your Business?</h2>
              <p className="text-xl text-white/90 mb-8">
                Choose your package and get started today. Our experts are here to help you every step of the way.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="text-lg px-8 py-4"
                  onClick={() => navigate("/llc")}
                >
                  Start Your LLC
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary"
                  onClick={() => navigate("/c-corporation")}
                >
                  Start Your Corporation
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">© 2024 Finityo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Pricing;