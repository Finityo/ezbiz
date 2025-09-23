import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, Shield, Clock, MapPin, FileText } from "lucide-react";
import Navigation from "@/components/Navigation";

const RegisteredAgent = () => {
  const benefits = [
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Privacy Protection",
      description: "Keep your personal address private from public business records"
    },
    {
      icon: <Clock className="h-8 w-8" />,
      title: "Reliable Service",
      description: "Professional acceptance of important legal documents during business hours"
    },
    {
      icon: <MapPin className="h-8 w-8" />,
      title: "Compliance Assured",
      description: "Meet state requirements and maintain good standing"
    },
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Document Management",
      description: "Secure storage and quick access to all registered agent documents"
    }
  ];

  const services = [
    "Accept service of process",
    "Receive official state correspondence", 
    "Forward legal documents promptly",
    "Maintain compliance records",
    "Annual report reminders",
    "Document scanning and storage",
    "Email and mail forwarding",
    "Business hours availability"
  ];

  const packages = [
    {
      name: "Standard Service",
      price: "$149",
      period: "per year",
      description: "Professional registered agent service",
      features: [
        "Accept service of process",
        "Forward legal documents",
        "Email notifications",
        "Document scanning",
        "Business hours coverage",
        "Online account access"
      ],
      popular: false
    },
    {
      name: "Premium Service", 
      price: "$199",
      period: "per year",
      description: "Enhanced service with compliance support",
      features: [
        "Everything in Standard Service",
        "Annual report filing reminders",
        "Compliance calendar",
        "Priority document processing", 
        "Phone support",
        "Document storage (5 years)"
      ],
      popular: true
    }
  ];

  const states = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado",
    "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho",
    "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana",
    "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi",
    "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey",
    "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma",
    "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee",
    "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia",
    "Wisconsin", "Wyoming"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-16 md:py-24 gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="text-sm">
              Required in All 50 States
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Professional <span className="gradient-hero bg-clip-text text-transparent">Registered Agent</span> Service
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              Protect your privacy and ensure compliance with our reliable registered agent service. 
              We accept legal documents and maintain your business in good standing.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" className="group">
                Get Started - $149/year
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="professional" size="lg">
                Learn More
              </Button>
            </div>
            <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>All 50 States Available</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Privacy Protection</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Compliance Guaranteed</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What is a Registered Agent */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">What is a Registered Agent?</h2>
              <p className="text-xl text-muted-foreground">
                A registered agent is a person or company designated to receive important legal 
                documents on behalf of your business entity.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                  <div>
                    <strong>Legal Requirement:</strong> Every LLC and corporation must have a registered agent
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                  <div>
                    <strong>Business Hours:</strong> Must be available during normal business hours
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                  <div>
                    <strong>Physical Address:</strong> Must have a physical address in the state of incorporation
                  </div>
                </div>
              </div>
              <Button variant="hero" size="lg">
                Choose Professional Service
              </Button>
            </div>
            <div className="bg-gradient-subtle rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-6">Documents We Handle:</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>Lawsuit summons and complaints</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>Tax notices and correspondence</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>Annual report notices</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>Government compliance notices</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>Legal process service</span>
                </div>
                <div className="flex items-center space-x-3">
                  <FileText className="h-5 w-5 text-primary" />
                  <span>Official state correspondence</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Benefits of Professional Service</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Why choose a professional registered agent service over serving yourself
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
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

          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Our Services Include:</h3>
              <ul className="space-y-3">
                {services.map((service, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                    <span>{service}</span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Why Not Serve Yourself?</h3>
              <div className="space-y-4 text-muted-foreground">
                <p>
                  <strong className="text-foreground">Privacy Concerns:</strong> Your personal address becomes public record
                </p>
                <p>
                  <strong className="text-foreground">Availability Issues:</strong> Must be available during business hours
                </p>
                <p>
                  <strong className="text-foreground">Professional Image:</strong> Legal documents served at your business
                </p>
                <p>
                  <strong className="text-foreground">Compliance Risk:</strong> Missing documents can result in penalties
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing Packages */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Choose Your Service Level</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional registered agent service with transparent annual pricing
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {packages.map((pkg, index) => (
              <Card key={index} className={`${pkg.popular ? 'border-primary shadow-elegant' : 'shadow-smooth'} hover:shadow-elegant transition-all duration-300`}>
                {pkg.popular && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-success text-success-foreground">
                    Most Popular
                  </Badge>
                )}
                <CardHeader className="text-center pb-4">
                  <CardTitle className="text-xl">{pkg.name}</CardTitle>
                  <CardDescription className="text-base">{pkg.description}</CardDescription>
                  <div className="space-y-1">
                    <div className="text-4xl font-bold text-primary">{pkg.price}</div>
                    <div className="text-sm text-muted-foreground">{pkg.period}</div>
                  </div>
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
                  >
                    Select Service
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Available States */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Available in All 50 States</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Professional registered agent service nationwide
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 text-sm max-w-6xl mx-auto">
            {states.map((state) => (
              <div key={state} className="p-2 text-center hover:bg-accent rounded transition-colors">
                {state}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">Protect Your Privacy Today</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Don't risk missing important legal documents or exposing your personal address. 
            Choose professional registered agent service.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" className="shadow-lg hover:shadow-xl">
              Get Started - $149/year
            </Button>
            <Button variant="professional" size="lg" className="bg-primary-foreground/10 border-primary-foreground/20 hover:bg-primary-foreground hover:text-primary">
              Free Consultation
            </Button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default RegisteredAgent;