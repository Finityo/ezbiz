import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, Shield, Clock, Users, Star } from "lucide-react";
import Logo from "@/components/ui/logo";
import Navigation from "@/components/Navigation";
import heroImage from "@/assets/hero-business.jpg";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();
  const businessTypes = [
    {
      title: "Limited Liability Company (LLC)",
      description: "Perfect for small businesses seeking flexibility and protection",
      price: "Starting at $149",
      popular: true,
      features: ["Limited liability protection", "Tax flexibility", "Simple management structure", "Credibility with customers"]
    },
    {
      title: "C Corporation", 
      description: "Ideal for businesses planning to raise capital or go public",
      price: "Starting at $199",
      features: ["Stock issuance capability", "Separate tax entity", "Unlimited growth potential", "Attract investors easily"]
    },
    {
      title: "S Corporation",
      description: "Great for small businesses wanting to avoid double taxation", 
      price: "Starting at $199",
      features: ["Pass-through taxation", "Limited liability protection", "Salary and dividend options", "Up to 100 shareholders"]
    }
  ];

  const whyChooseUs = [
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Fast & Reliable",
      description: "Most filings completed within 24-48 hours with our express service"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "100% Satisfaction Guaranteed", 
      description: "We stand behind our work with a complete satisfaction guarantee"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Expert Support",
      description: "Live business formation experts ready to guide you through the process"
    }
  ];

  const processSteps = [
    {
      step: "1",
      title: "Choose Your Business Type",
      description: "Select the business structure that best fits your needs and goals"
    },
    {
      step: "2", 
      title: "Complete Your Order",
      description: "Provide your business information through our secure, easy-to-use form"
    },
    {
      step: "3",
      title: "We Handle the Filings",
      description: "Our experts prepare and file all required documents with the state"
    },
    {
      step: "4",
      title: "Start Your Business", 
      description: "Receive your official documents and begin operating your new business"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <section className="relative py-20 md:py-32 overflow-hidden">
        <div className="absolute inset-0 gradient-subtle"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="secondary" className="text-sm">
                  Trusted by 50,000+ Entrepreneurs
                </Badge>
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight">
                  Turn Your <span className="gradient-hero bg-clip-text text-transparent">Business Ideas</span> Into Reality
                </h1>
                <p className="text-xl text-muted-foreground leading-relaxed">
                  Professional business formation services made simple. Start your LLC, Corporation, or other business entity quickly and affordably with expert guidance every step of the way.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="lg" className="group" onClick={() => navigate('/form-llc')}>
                  Start Your Business Today
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button variant="professional" size="lg" onClick={() => navigate('/consultation')}>
                  Free Consultation
                </Button>
              </div>
              <div className="flex items-center space-x-6 text-sm text-muted-foreground">
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>No Hidden Fees</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>24-48 Hour Filing</span>
                </div>
                <div className="flex items-center space-x-1">
                  <CheckCircle className="h-4 w-4 text-success" />
                  <span>100% Satisfaction</span>
                </div>
              </div>
            </div>
            <div className="relative">
              <img 
                src={heroImage} 
                alt="Professional entrepreneurs collaborating on business formation"
                className="rounded-2xl shadow-hero w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section id="services" className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Choose Your Business Structure</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Select the business entity that best fits your goals and provides the protection you need
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            {businessTypes.map((type, index) => (
              <Card key={index} className={`relative ${type.popular ? 'border-primary shadow-elegant' : 'shadow-smooth'} hover:shadow-elegant transition-all duration-300`}>
                {type.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-success text-success-foreground">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl">{type.title}</CardTitle>
                  <CardDescription className="text-base">{type.description}</CardDescription>
                  <div className="text-3xl font-bold text-primary mt-4">{type.price}</div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {type.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant={type.popular ? "hero" : "default"} 
                    className="w-full mt-6"
                  >
                    Get Started
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Why Choose Finityo?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We make business formation simple, fast, and affordable with expert support every step of the way
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mb-16">
            {whyChooseUs.map((item, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="inline-flex p-4 rounded-full gradient-primary text-primary-foreground">
                  {item.icon}
                </div>
                <h3 className="text-xl font-semibold">{item.title}</h3>
                <p className="text-muted-foreground">{item.description}</p>
              </div>
            ))}
          </div>

          {/* Trust Indicators */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center border-t border-border pt-16">
            <div>
              <div className="text-3xl font-bold text-primary">50,000+</div>
              <div className="text-sm text-muted-foreground">Businesses Formed</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">24-48hr</div>
              <div className="text-sm text-muted-foreground">Average Filing Time</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">50 States</div>
              <div className="text-sm text-muted-foreground">Nationwide Service</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-primary">4.9★</div>
              <div className="text-sm text-muted-foreground">Customer Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Starting your business is easier than you think. Follow these simple steps to get started today
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="text-center space-y-4 relative">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-primary text-primary-foreground text-xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
                {index < processSteps.length - 1 && (
                  <ArrowRight className="hidden lg:block absolute -right-4 top-8 h-6 w-6 text-muted-foreground" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Start Your Business?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Join thousands of entrepreneurs who trust Finityo to handle their business formation needs. 
            Get started today with our simple, fast, and affordable process.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" className="shadow-lg hover:shadow-xl">
              Start Your LLC - $149
            </Button>
            <Button variant="professional" size="lg" className="bg-primary-foreground/10 border-primary-foreground/20 hover:bg-primary-foreground hover:text-primary">
              Free Consultation
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-border bg-card py-12">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="space-y-4">
              <Logo size="sm" />
              <p className="text-muted-foreground text-sm">
                Professional business formation services trusted by entrepreneurs nationwide.
              </p>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Services</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-fast">LLC Formation</a></li>
                <li><a href="#" className="hover:text-foreground transition-fast">Corporation</a></li>
                <li><a href="#" className="hover:text-foreground transition-fast">DBA Filing</a></li>
                <li><a href="#" className="hover:text-foreground transition-fast">Registered Agent</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Resources</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-fast">Business Guide</a></li>
                <li><a href="#" className="hover:text-foreground transition-fast">State Requirements</a></li>
                <li><a href="#" className="hover:text-foreground transition-fast">Support</a></li>
                <li><a href="#" className="hover:text-foreground transition-fast">Contact</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4">Company</h4>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground transition-fast">About Us</a></li>
                <li><a href="#" className="hover:text-foreground transition-fast">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-foreground transition-fast">Terms of Service</a></li>
                <li><a href="#" className="hover:text-foreground transition-fast">Reviews</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-border mt-12 pt-8 text-center text-sm text-muted-foreground">
            <p>&copy; 2024 Finityo. All rights reserved. Professional business formation services nationwide.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;