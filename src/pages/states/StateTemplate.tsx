import SEOHead from "@/components/SEOHead";
import Navigation from "@/components/Navigation";
import { formatPrice } from "@/lib/utils";
import Footer from "@/components/Footer";
import StateHeroSection from "@/components/state/StateHeroSection";
import { Card } from "@/components/ui/card";
import { CheckCircle, FileText, Clock, Shield, Building2 } from "lucide-react";

interface StateTemplateProps {
  stateName: string;
  stateCode: string;
  entityType: "llc" | "corporation";
  stateFee: number;
  processingTime: string;
  requirements: string[];
  benefits: string[];
}

const StateTemplate = ({
  stateName,
  stateCode,
  entityType,
  stateFee,
  processingTime,
  requirements,
  benefits
}: StateTemplateProps) => {
  const entityLabel = entityType === "llc" ? "LLC" : "Corporation";
  const entityFull = entityType === "llc" 
    ? "Limited Liability Company" 
    : "Corporation";

  const slugState = stateName.toLowerCase().replace(/\s+/g, "-");
  const slugEntity = entityType === "llc" ? "llc" : "corporation";
  const seoPath = `/state/${slugState}/${slugEntity}`;
  const seoTitle = `Form a ${stateName} ${entityLabel} — State Filing Service`;
  const seoDesc = `Start your ${stateName} ${entityFull} with EZ BIZ FILE SERVICE. State fee ${formatPrice(stateFee)}. Processing in ${processingTime}.`;

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title={seoTitle} description={seoDesc} path={seoPath} />
      <Navigation />
      
      <StateHeroSection
        stateName={stateName}
        entityType={entityType}
        stateFee={stateFee}
        processingTime={processingTime}
      />

      <div className="container mx-auto px-4 py-12">
        {/* Overview Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <Card className="p-8">
            <div className="accent-line mb-6"></div>
            <h2 className="text-3xl font-bold mb-4">
              Why Form a {stateName} {entityLabel}?
            </h2>
            <p className="text-muted-foreground mb-6">
              A {stateName} {entityFull} provides limited liability protection for your personal assets 
              while offering flexibility in management and taxation. {stateName} makes it easy to start 
              and maintain your business with straightforward filing requirements and business-friendly regulations.
            </p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Shield className="h-5 w-5 text-primary" />
                  Key Benefits
                </h3>
                <ul className="space-y-2">
                  {benefits.map((benefit, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <CheckCircle className="h-4 w-4 text-success mr-2 mt-0.5 flex-shrink-0" />
                      <span>{benefit}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-primary" />
                  Requirements
                </h3>
                <ul className="space-y-2">
                  {requirements.map((req, index) => (
                    <li key={index} className="flex items-start text-sm">
                      <CheckCircle className="h-4 w-4 text-primary mr-2 mt-0.5 flex-shrink-0" />
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        </div>

        {/* Process Section */}
        <div className="max-w-4xl mx-auto mb-12">
          <div className="text-center mb-8">
            <div className="accent-line-center mb-6"></div>
            <h2 className="text-3xl font-bold">
              How to Form Your {stateName} {entityLabel}
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {[
              { icon: FileText, title: "Choose Name", desc: "Select a unique business name" },
              { icon: Building2, title: "Select Package", desc: "Pick the right service level" },
              { icon: Clock, title: "We File", desc: "We handle all the paperwork" },
              { icon: CheckCircle, title: "Get Documents", desc: "Receive your official documents" }
            ].map((step, index) => (
              <Card key={index} className="p-6 text-center">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <step.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-bold mb-2">{step.title}</h3>
                <p className="text-sm text-muted-foreground">{step.desc}</p>
              </Card>
            ))}
          </div>
        </div>

        {/* Cost Breakdown */}
        <div className="max-w-4xl mx-auto">
          <Card className="p-8">
            <div className="accent-line mb-6"></div>
            <h2 className="text-2xl font-bold mb-6">Cost Breakdown</h2>
            
            <div className="space-y-4">
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="font-medium">{stateName} State Filing Fee</span>
                <span className="text-xl font-bold text-primary">${formatPrice(stateFee)}</span>
              </div>
              
              <div className="flex justify-between items-center pb-4 border-b">
                <span className="font-medium">EZ BIZ File Service Fee</span>
                <span className="text-xl font-bold text-primary">From $129 + state fees</span>
              </div>
              
              <div className="bg-muted/50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-bold text-lg">Total Starting Cost</span>
                  <span className="text-2xl font-bold text-success">From ${formatPrice(stateFee + 129)}</span>
                </div>
                <p className="text-sm text-muted-foreground mt-2">
                  Includes everything you need to get started
                </p>
              </div>
            </div>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default StateTemplate;
