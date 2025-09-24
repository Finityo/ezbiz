import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  CheckCircle, 
  ArrowRight, 
  Shield, 
  Calendar, 
  Building, 
  Globe, 
  Users, 
  Briefcase,
  ClipboardCheck,
  FileCheck,
  Gavel
} from "lucide-react";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const BusinessFilings = () => {
  const navigate = useNavigate();

  const filingServices = [
    {
      title: "Registered Agent Services",
      description: "Professional registered agent service in all 50 states to receive official notices",
      icon: <Shield className="h-8 w-8" />,
      category: "compliance",
      href: "/registered-agent"
    },
    {
      title: "Annual Reports",
      description: "Keep your business in good standing with required annual state filings",
      icon: <Calendar className="h-8 w-8" />,
      category: "compliance",
      href: "/consultation"
    },
    {
      title: "Articles of Amendment",
      description: "Make changes to your business structure, name, or registered information",
      icon: <FileText className="h-8 w-8" />,
      category: "changes",
      href: "/consultation"
    },
    {
      title: "Doing Business As (DBA)",
      description: "Register a trade name or assumed business name for your company",
      icon: <Building className="h-8 w-8" />,
      category: "filings",
      href: "/dba-filing"
    },
    {
      title: "Foreign Qualifications",
      description: "Register to do business in states outside your home state",
      icon: <Globe className="h-8 w-8" />,
      category: "expansion",
      href: "/consultation"
    },
    {
      title: "Federal Tax ID (EIN)",
      description: "Obtain your business tax identification number from the IRS",
      icon: <FileCheck className="h-8 w-8" />,
      category: "filings",
      href: "/ein-number"
    },
    {
      title: "BOI Reporting",
      description: "Comply with new Beneficial Ownership Information reporting requirements",
      icon: <Users className="h-8 w-8" />,
      category: "compliance",
      href: "/consultation"
    },
    {
      title: "Corporate Bylaws",
      description: "Professional corporate bylaws and operating agreement preparation",
      icon: <Gavel className="h-8 w-8" />,
      category: "documents",
      href: "/corporate-bylaws"
    },
    {
      title: "Entity Conversions",
      description: "Convert your business from one entity type to another (LLC to Corp, etc.)",
      icon: <ArrowRight className="h-8 w-8" />,
      category: "changes",
      href: "/consultation"
    },
    {
      title: "Business Reinstatements",
      description: "Restore your dissolved or revoked business to good standing",
      icon: <CheckCircle className="h-8 w-8" />,
      category: "compliance",
      href: "/consultation"
    },
    {
      title: "Operating Agreements",
      description: "Custom LLC operating agreements tailored to your business needs",
      icon: <Briefcase className="h-8 w-8" />,
      category: "documents",
      href: "/operating-agreement"
    },
    {
      title: "Certificates of Good Standing",
      description: "Obtain official certificates proving your business is in compliance",
      icon: <ClipboardCheck className="h-8 w-8" />,
      category: "compliance",
      href: "/consultation"
    }
  ];

  const categories = {
    filings: "Business Formation & Registration",
    compliance: "Ongoing Compliance Services", 
    changes: "Business Changes & Amendments",
    expansion: "Business Expansion Services",
    documents: "Legal Documents & Templates"
  };

  const groupedServices = filingServices.reduce((acc, service) => {
    const category = service.category;
    if (!acc[category]) acc[category] = [];
    acc[category].push(service);
    return acc;
  }, {} as Record<string, typeof filingServices>);

  const benefits = [
    "Fast, reliable service in all 50 states",
    "100% satisfaction guarantee",
    "Expert preparation and filing",
    "Competitive pricing with no hidden fees",
    "Dedicated customer support",
    "Secure document handling"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-16 md:py-24 gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="text-sm">
              Complete Business Compliance Solutions
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Business <span className="gradient-hero bg-clip-text text-transparent">Filings & Compliance</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Maintain corporate compliance and keep your business in good standing with our comprehensive 
              filing services. From annual reports to business changes, we handle the paperwork so you can focus on growth.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" className="group" onClick={() => navigate('/consultation')}>
                Free Consultation
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="professional" size="lg" onClick={() => navigate('/pricing')}>
                View All Services
              </Button>
            </div>
            <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>All 50 States Covered</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Expert Preparation</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>100% Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-16 bg-card">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <h2 className="text-3xl md:text-4xl font-bold">Why Choose Finityo for Business Filings?</h2>
            <p className="text-xl text-muted-foreground">
              We make business compliance simple with fast, reliable, and affordable filing services
            </p>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {benefits.map((benefit, index) => (
                <div key={index} className="flex items-center space-x-3 text-left">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                  <span>{benefit}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services by Category */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Complete Business Filing Services</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              From formation to ongoing compliance, we provide all the filing services your business needs
            </p>
          </div>

          {Object.entries(groupedServices).map(([categoryKey, services]) => (
            <div key={categoryKey} className="mb-16">
              <h3 className="text-2xl font-bold mb-8 text-center">{categories[categoryKey as keyof typeof categories]}</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service, index) => (
                  <Card key={index} className="group hover:shadow-elegant transition-all duration-300 cursor-pointer" onClick={() => navigate(service.href)}>
                    <CardHeader className="text-center pb-4">
                      <div className="inline-flex p-4 rounded-full gradient-primary text-primary-foreground mx-auto mb-4">
                        {service.icon}
                      </div>
                      <CardTitle className="text-xl group-hover:text-primary transition-colors">
                        {service.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="text-center">
                      <CardDescription className="text-base mb-4">
                        {service.description}
                      </CardDescription>
                      <Button variant="outline" className="w-full group-hover:border-primary group-hover:text-primary transition-colors">
                        Learn More
                        <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Process Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">How Our Filing Process Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Simple, fast, and reliable business filing process designed for busy entrepreneurs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Choose Your Service", description: "Select the filing service you need from our comprehensive menu" },
              { step: "2", title: "Provide Information", description: "Complete our secure online form with your business details" },
              { step: "3", title: "Expert Preparation", description: "Our legal experts prepare and review your documents for accuracy" },
              { step: "4", title: "Filing Complete", description: "We file your documents with the appropriate agencies and send confirmations" }
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
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Get Your Business Filings Done?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Don't let compliance deadlines stress you out. Let our experts handle your business filings 
            so you can focus on what matters most - growing your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" className="shadow-lg hover:shadow-xl" onClick={() => navigate('/consultation')}>
              Get Free Consultation
            </Button>
            <Button variant="professional" size="lg" className="bg-primary-foreground/10 border-primary-foreground/20 hover:bg-primary-foreground hover:text-primary" onClick={() => navigate('/pricing')}>
              View Pricing
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default BusinessFilings;