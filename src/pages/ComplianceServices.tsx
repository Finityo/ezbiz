import Navigation from "@/components/Navigation";
import { trackClick } from "@/hooks/useAnalytics";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, FileCheck, Bell, Users, Building2, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { COMPLIANCE_COPY } from "@/content/ezbizCopy";

const c = COMPLIANCE_COPY;
const serviceIcons = [FileCheck, Users, Bell, Briefcase];
const whyIcons = [Shield, Building2];

const ComplianceServices = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="gradient-hero text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">{c.hero.headline}</h1>
            <p className="text-xl mb-8 opacity-90">{c.hero.subheadline}</p>
            <Button 
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-bold text-lg px-8 py-6"
              onClick={() => { trackClick(c.hero.ctaPrimary, 'compliance_hero_cta', '/consultation'); window.location.href = '/consultation'; }}
            >
              {c.hero.ctaPrimary}
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 mb-12">
            <h2 className="text-3xl font-bold mb-6">{c.why.heading}</h2>
            <p className="text-muted-foreground mb-6">{c.why.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {c.why.items.map((item, index) => {
                const Icon = whyIcons[index];
                return (
                  <div key={index} className="flex items-start gap-3">
                    <Icon className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <div>
                      <h3 className="font-semibold mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground">{item.description}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>

          <h2 className="text-3xl font-bold text-center mb-8">{c.services.heading}</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            {c.services.items.map((service, index) => {
              const Icon = serviceIcons[index];
              return (
                <Card key={index} className="p-6">
                  <Icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="font-bold text-xl mb-3">{service.title}</h3>
                  <p className="text-sm text-muted-foreground mb-4">{service.description}</p>
                  <Button variant="outline" asChild>
                    <Link to={service.link}>{service.linkText}</Link>
                  </Button>
                </Card>
              );
            })}
          </div>

          <Card className="p-8 mb-12 bg-primary/5 border-primary/20">
            <h2 className="text-2xl font-bold mb-6">{c.stateRequirements.heading}</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground mb-4">{c.stateRequirements.description}</p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {c.stateRequirements.items.map((item, index) => (
                  <div key={index} className="bg-card rounded-lg p-4">
                    <h3 className="font-semibold mb-2">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </Card>

          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">{c.cta.heading}</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">{c.cta.subheading}</p>
            <Button 
              size="lg"
              onClick={() => { trackClick(c.cta.ctaPrimary, 'compliance_bottom_cta', '/consultation'); window.location.href = '/consultation'; }}
            >
              {c.cta.ctaPrimary}
            </Button>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ComplianceServices;
