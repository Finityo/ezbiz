import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, FileCheck, Bell, Users, Building2, Briefcase } from "lucide-react";

const ComplianceServices = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="gradient-hero text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Business Compliance Services
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Stay compliant, avoid penalties, and protect your business with our comprehensive compliance solutions.
            </p>
            <Button 
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-bold text-lg px-8 py-6"
              onClick={() => window.location.href = '/consultation'}
            >
              Get Compliance Consultation
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 mb-12">
            <h2 className="text-3xl font-bold mb-6">Why Business Compliance Matters</h2>
            <p className="text-muted-foreground mb-6">
              Maintaining business compliance isn't just about avoiding penalties—it's about protecting your 
              business, maintaining good standing, and ensuring you can operate without interruption. From 
              annual reports to registered agent services, we help you stay on top of all requirements.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <Shield className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Avoid Penalties</h3>
                  <p className="text-sm text-muted-foreground">
                    Late or missing filings can result in fines, dissolution, or loss of legal protections.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Building2 className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Maintain Good Standing</h3>
                  <p className="text-sm text-muted-foreground">
                    Keep your business in good standing to access banking, contracts, and licenses.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <h2 className="text-3xl font-bold text-center mb-8">Our Compliance Services</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
            <Card className="p-6">
              <FileCheck className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-bold text-xl mb-3">Annual Report Filing</h3>
              <p className="text-sm text-muted-foreground mb-4">
                We track deadlines and file your required annual or biennial reports with the state to keep 
                your business in good standing.
              </p>
              <Button variant="outline" onClick={() => window.location.href = '/annual-report'}>
                Learn More
              </Button>
            </Card>

            <Card className="p-6">
              <Users className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-bold text-xl mb-3">Registered Agent Service</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Professional registered agent service in all 50 states. We receive legal documents and 
                service of process on your behalf.
              </p>
              <Button variant="outline" onClick={() => window.location.href = '/registered-agent'}>
                Learn More
              </Button>
            </Card>

            <Card className="p-6">
              <Bell className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-bold text-xl mb-3">Compliance Alerts</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Receive timely reminders for filing deadlines, renewals, and other state requirements so 
                you never miss a critical date.
              </p>
              <Button variant="outline" onClick={() => window.location.href = '/consultation'}>
                Get Started
              </Button>
            </Card>

            <Card className="p-6">
              <Briefcase className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-bold text-xl mb-3">Business License Assistance</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Get help identifying and obtaining the business licenses and permits required for your 
                industry and location.
              </p>
              <Button variant="outline" onClick={() => window.location.href = '/consultation'}>
                Get Started
              </Button>
            </Card>
          </div>

          <Card className="p-8 mb-12 bg-primary/5 border-primary/20">
            <h2 className="text-2xl font-bold mb-6">State-Specific Compliance Requirements</h2>
            <div className="space-y-4">
              <p className="text-muted-foreground mb-4">
                Each state has unique compliance requirements and deadlines. Our experts know the rules 
                for all 50 states and will ensure your business meets every requirement.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-card rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Annual/Biennial Reports</h3>
                  <p className="text-sm text-muted-foreground">
                    Due dates, fees, and requirements vary by state and entity type.
                  </p>
                </div>
                <div className="bg-card rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Registered Agent</h3>
                  <p className="text-sm text-muted-foreground">
                    Required in your state of formation and any states where you're registered.
                  </p>
                </div>
                <div className="bg-card rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Foreign Qualification</h3>
                  <p className="text-sm text-muted-foreground">
                    Register in additional states where you conduct business.
                  </p>
                </div>
                <div className="bg-card rounded-lg p-4">
                  <h3 className="font-semibold mb-2">Business Licenses</h3>
                  <p className="text-sm text-muted-foreground">
                    Local, state, and federal licenses based on your business activities.
                  </p>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Need Help with Compliance?</h2>
            <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
              Our compliance experts are here to help you understand your obligations and ensure your 
              business stays in good standing. Schedule a consultation to discuss your specific needs.
            </p>
            <Button 
              size="lg"
              onClick={() => window.location.href = '/consultation'}
            >
              Schedule Free Consultation
            </Button>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default ComplianceServices;
