import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, Shield, Clock, DollarSign, Users, FileText, Building } from "lucide-react";
import Navigation from "@/components/Navigation";
import { useNavigate } from "react-router-dom";

const LLC = () => {
  const navigate = useNavigate();
  const benefits = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Limited Liability Protection",
      description: "Personal assets are protected from business debts and liabilities"
    },
    {
      icon: <DollarSign className="h-8 w-8" />,
      title: "Tax Flexibility",
      description: "Choose how you want to be taxed - as sole proprietorship, partnership, S-Corp, or C-Corp"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Simple Management",
      description: "Fewer formalities and paperwork compared to corporations"
    },
    {
      icon: <Building className="h-8 w-8" />,
      title: "Business Credibility",
      description: "Establish credibility with customers, vendors, and lenders"
    }
  ];

  const packages = [
    {
      name: "Basic LLC",
      price: "$149",
      description: "Essential LLC formation with state filing",
      features: [
        "State filing of Articles of Organization",
        "Email confirmation of completion",
        "Customer support",
        "Registered agent service (1st year free)"
      ],
      popular: false
    },
    {
      name: "Standard LLC",
      price: "$249", 
      description: "Most popular package with extra protection",
      features: [
        "Everything in Basic LLC",
        "Operating Agreement template",
        "EIN (Federal Tax ID) application",
        "Banking resolution",
        "Express filing (24-48 hours)",
        "Registered agent service (1st year free)"
      ],
      popular: true
    },
    {
      name: "Premium LLC",
      price: "$349",
      description: "Complete LLC package with maximum benefits",
      features: [
        "Everything in Standard LLC", 
        "Corporate bylaws template",
        "Meeting minutes template",
        "Stock certificates",
        "Corporate seal",
        "Compliance calendar",
        "Express filing (24-48 hours)"
      ],
      popular: false
    }
  ];

  const states = [
    "Delaware", "Nevada", "Wyoming", "California", "Texas", "Florida", 
    "New York", "Illinois", "Pennsylvania", "Ohio", "Georgia", "North Carolina"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-16 md:py-24 gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="text-sm">
              Most Popular Business Structure
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Form Your <span className="gradient-hero bg-clip-text text-transparent">LLC Today</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Limited Liability Company formation is simple with Finityo. Get liability protection, 
              tax flexibility, and business credibility with our fast, affordable LLC filing service.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" className="group" onClick={() => navigate('/pricing')}>
                Start Your LLC - $149
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="professional" size="lg" onClick={() => navigate('/consultation')}>
                Free LLC Guide
              </Button>
            </div>
            <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Fast 24-48 Hour Filing</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>100% Satisfaction Guaranteed</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>All 50 States Available</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Why Form an LLC?</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              An LLC combines the best features of corporations and partnerships while 
              keeping formalities to a minimum
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="inline-flex p-4 rounded-full gradient-primary text-primary-foreground">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Packages */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Choose Your LLC Package</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Transparent pricing with no hidden fees. All packages include our satisfaction guarantee
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {packages.map((pkg, index) => (
              <Card key={index} className={`relative ${pkg.popular ? 'border-primary shadow-elegant scale-105' : 'shadow-smooth'} hover:shadow-elegant transition-all duration-300`}>
                {pkg.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-success text-success-foreground">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl">{pkg.name}</CardTitle>
                  <CardDescription className="text-base">{pkg.description}</CardDescription>
                  <div className="text-4xl font-bold text-primary mt-4">{pkg.price}</div>
                  <div className="text-sm text-muted-foreground">+ State filing fee</div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <ul className="space-y-3">
                    {pkg.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-start space-x-2">
                        <CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </li>
                    ))}
                  </ul>
                  <Button 
                    variant={pkg.popular ? "hero" : "default"} 
                    className="w-full mt-6"
                    onClick={() => navigate('/pricing')}
                  >
                    Select Package
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* State Selection */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Form Your LLC in Any State</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              We can file your LLC in all 50 states. Choose the state that's right for your business
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 max-w-4xl mx-auto">
            {states.map((state) => (
              <Button key={state} variant="outline" className="h-12" onClick={() => navigate('/state-requirements')}>
                {state}
              </Button>
            ))}
          </div>
          
          <div className="text-center mt-8">
            <Button variant="hero" size="lg" onClick={() => navigate('/state-requirements')}>
              View All States
            </Button>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">How LLC Formation Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Starting your LLC is easy with our simple 4-step process
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Choose Your Package", description: "Select the LLC package that fits your needs and budget" },
              { step: "2", title: "Complete Your Order", description: "Provide your LLC information through our secure online form" },
              { step: "3", title: "We File Your LLC", description: "Our experts prepare and file your Articles of Organization" },
              { step: "4", title: "Start Your Business", description: "Receive your LLC documents and begin operating legally" }
            ].map((step, index) => (
              <div key={index} className="text-center space-y-4 relative">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full gradient-primary text-primary-foreground text-xl font-bold">
                  {step.step}
                </div>
                <h3 className="text-lg font-semibold">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
                {index < 3 && (
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
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Form Your LLC?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Join thousands of entrepreneurs who have started their LLC with Finityo. 
            Get liability protection and tax benefits today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" className="shadow-lg hover:shadow-xl" onClick={() => navigate('/pricing')}>
              Start Your LLC - $149
            </Button>
            <Button variant="professional" size="lg" className="bg-primary-foreground/10 border-primary-foreground/20 hover:bg-primary-foreground hover:text-primary" onClick={() => navigate('/consultation')}>
              Free Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LLC;