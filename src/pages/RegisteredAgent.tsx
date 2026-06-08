import SEOHead from "@/components/SEOHead";
import ServiceJsonLd from "@/components/ServiceJsonLd";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, Shield, Clock, MapPin, FileText } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import BackToTop from "@/components/BackToTop";
import { Link } from "react-router-dom";
import { trackClick } from "@/hooks/useAnalytics";
import { REGISTERED_AGENT_COPY } from "@/content/ezbizCopy";

const c = REGISTERED_AGENT_COPY;
const benefitIcons = [Shield, Clock, MapPin, FileText];

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

const RegisteredAgent = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Registered Agent Service" description="Professional registered agent service in all 50 states. Privacy protection, compliance assurance, and reliable document handling." path="/registered-agent" />
      <ServiceJsonLd serviceName="Registered Agent Service" description="Professional registered agent service in all 50 states. Privacy protection, compliance assurance, and reliable document handling." url="/registered-agent" />
      <Navigation />
      <FloatingCTA />
      <BackToTop />

      {/* Hero */}
      <section className="py-16 md:py-24 gradient-subtle relative overflow-hidden pattern-geometric">
        <div className="absolute inset-0 pattern-dots opacity-30"></div>
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="text-sm">{c.hero.badge}</Badge>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Professional <span className="gradient-hero bg-clip-text text-transparent">Registered Agent</span> Service
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">{c.hero.subheadline}</p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="group bg-primary hover:bg-primary-light text-primary-foreground" asChild>
                <Link to="/order-flow">{c.hero.ctaPrimary} <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" /></Link>
              </Button>
              <Button variant="outline" size="lg" className="border-2 hover:bg-muted" asChild><Link to="/consultation" onClick={() => trackClick(c.hero.ctaSecondary, 'registered_agent_hero_cta', '/consultation')}>{c.hero.ctaSecondary}</Link></Button>
            </div>
            <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
              {c.hero.badges.map((badge, i) => (
                <div key={i} className="flex items-center space-x-1"><CheckCircle className="h-4 w-4 text-success" /><span>{badge}</span></div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* What Is */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">{c.whatIs.heading}</h2>
              <p className="text-xl text-muted-foreground">{c.whatIs.description}</p>
              <div className="space-y-4">
                {c.whatIs.requirements.map((req, i) => (
                  <div key={i} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                    <div><strong>{req.label}:</strong> {req.description}</div>
                  </div>
                ))}
              </div>
              <Button size="lg" className="bg-primary hover:bg-primary-light text-primary-foreground" asChild>
                <Link to="/order-flow">Choose Professional Service</Link>
              </Button>
            </div>
            <div className="bg-gradient-subtle rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-6">Documents We Handle:</h3>
              <div className="space-y-3">
                {c.whatIs.documentsHandled.map((doc, i) => (
                  <div key={i} className="flex items-center space-x-3"><FileText className="h-5 w-5 text-primary" /><span>{doc}</span></div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">{c.benefits.heading}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{c.benefits.subheading}</p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
            {c.benefits.items.map((benefit, index) => {
              const Icon = benefitIcons[index];
              return (
                <div key={index} className="text-center space-y-4">
                  <div className="inline-flex p-4 rounded-full gradient-primary text-primary-foreground"><Icon className="h-8 w-8" /></div>
                  <h3 className="text-xl font-semibold">{benefit.title}</h3>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </div>
              );
            })}
          </div>
          <div className="grid lg:grid-cols-2 gap-8">
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Our Services Include:</h3>
              <ul className="space-y-3">
                {c.benefits.services.map((service, index) => (
                  <li key={index} className="flex items-start space-x-3"><CheckCircle className="h-5 w-5 text-success mt-1 flex-shrink-0" /><span>{service}</span></li>
                ))}
              </ul>
            </div>
            <div className="space-y-4">
              <h3 className="text-2xl font-semibold">Why Not Serve Yourself?</h3>
              <div className="space-y-4 text-muted-foreground">
                {c.benefits.whyNotSelf.map((item, i) => (
                  <p key={i}><strong className="text-foreground">{item.label}:</strong> {item.description}</p>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">{c.pricing.heading}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">{c.pricing.subheading}</p>
          </div>
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {c.pricing.packages.map((pkg, index) => (
              <Card key={index} className={`${pkg.popular ? 'border-primary shadow-elegant' : 'shadow-smooth'} hover:shadow-elegant transition-all duration-300`}>
                {pkg.popular && <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-success text-success-foreground">Most Popular</Badge>}
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
                    {pkg.features.map((feature, i) => (
                      <li key={i} className="flex items-start space-x-2"><CheckCircle className="h-5 w-5 text-success mt-0.5 flex-shrink-0" /><span className="text-sm">{feature}</span></li>
                    ))}
                  </ul>
                  <Button className={`w-full mt-6 ${pkg.popular ? 'bg-primary hover:bg-primary-light text-primary-foreground' : ''}`} asChild>
                    <Link to="/order-flow">Select Service</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* States */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Available in All 50 States</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">Professional registered agent service nationwide</p>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-2 text-sm max-w-6xl mx-auto">
            {states.map((state) => (
              <div key={state} className="p-2 text-center hover:bg-accent rounded transition-colors">{state}</div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">{c.cta.heading}</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">{c.cta.subheading}</p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" className="shadow-lg hover:shadow-xl text-lg px-8 h-14" asChild>
              <Link to="/order-flow">{c.cta.ctaPrimary}</Link>
            </Button>
            <Button variant="outline" size="lg" className="text-lg px-8 h-14 border-2 border-white/30 text-white hover:bg-white/10" asChild>
              <Link to="/consultation" onClick={() => trackClick(c.cta.ctaSecondary, 'registered_agent_bottom_cta', '/consultation')}>{c.cta.ctaSecondary}</Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default RegisteredAgent;
