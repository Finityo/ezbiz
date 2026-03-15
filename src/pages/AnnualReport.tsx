import SEOHead from "@/components/SEOHead";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileText, Calendar, AlertTriangle } from "lucide-react";
import { Link } from "react-router-dom";
import { ANNUAL_REPORT_COPY } from "@/content/ezbizCopy";

const c = ANNUAL_REPORT_COPY;
const featureIcons = [Calendar, FileText, CheckCircle];

const AnnualReport = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Annual Report Filing" description="Stay compliant with annual report filing services. Never miss a deadline with our professional compliance support." path="/annual-report" />
      <Navigation />
      
      <div className="gradient-hero text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">{c.hero.headline}</h1>
            <p className="text-xl mb-8 opacity-90">{c.hero.subheadline}</p>
            <Button size="lg" className="bg-white text-primary hover:bg-white/90 font-bold text-lg px-8 py-6" asChild>
              <Link to="/order-flow">{c.hero.ctaPrimary}</Link>
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 mb-12">
            <h2 className="text-3xl font-bold mb-6">{c.whatIs.heading}</h2>
            <p className="text-muted-foreground mb-4">{c.whatIs.description}</p>
            <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
              <p className="text-sm"><strong>Important:</strong> {c.whatIs.warning}</p>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            {c.features.map((feature, index) => {
              const Icon = featureIcons[index];
              return (
                <Card key={index} className="p-6">
                  <Icon className="h-12 w-12 text-primary mb-4" />
                  <h3 className="font-bold text-lg mb-2">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground">{feature.description}</p>
                </Card>
              );
            })}
          </div>

          <Card className="p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6">{c.stateRequirements.heading}</h2>
            <div className="space-y-4">
              {c.stateRequirements.items.map((item, index) => (
                <div key={index} className={index < c.stateRequirements.items.length - 1 ? "pb-4 border-b" : ""}>
                  <h3 className="font-semibold mb-2">{item.title}</h3>
                  <p className="text-sm text-muted-foreground">{item.description}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">{c.service.heading}</h2>
            <div className="space-y-6">
              {c.service.items.map((item, index) => (
                <div key={index} className="flex items-start gap-4">
                  <CheckCircle className="h-6 w-6 text-success mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-1">{item.title}</h3>
                    <p className="text-sm text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <div className="mt-8 text-center">
              <Button size="lg" asChild>
                <Link to="/order-flow">{c.service.ctaPrimary}</Link>
              </Button>
            </div>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default AnnualReport;
