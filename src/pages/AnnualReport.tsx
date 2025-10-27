import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileText, Calendar, AlertTriangle } from "lucide-react";

const AnnualReport = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="gradient-hero text-primary-foreground py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl lg:text-5xl font-bold mb-4">
              Annual Report Filing Service
            </h1>
            <p className="text-xl mb-8 opacity-90">
              Stay compliant with state requirements. We handle your annual report filings on time, every time.
            </p>
            <Button 
              size="lg"
              className="bg-white text-primary hover:bg-white/90 font-bold text-lg px-8 py-6"
              onClick={() => window.location.href = '/order-flow'}
            >
              File Annual Report Now
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <Card className="p-8 mb-12">
            <h2 className="text-3xl font-bold mb-6">What is an Annual Report?</h2>
            <p className="text-muted-foreground mb-4">
              An annual report is a required filing that updates your state about your business's current 
              information, including business address, registered agent, and ownership details. Most states 
              require this filing to maintain your business's good standing status.
            </p>
            <div className="bg-warning/10 border border-warning/30 rounded-lg p-4 flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-warning mt-0.5 flex-shrink-0" />
              <p className="text-sm">
                <strong>Important:</strong> Failing to file your annual report can result in late fees, 
                penalties, or even dissolution of your business entity.
              </p>
            </div>
          </Card>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <Card className="p-6">
              <Calendar className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-2">Track Deadlines</h3>
              <p className="text-sm text-muted-foreground">
                We monitor your state's filing deadlines and remind you before they're due.
              </p>
            </Card>

            <Card className="p-6">
              <FileText className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-2">Complete Filing</h3>
              <p className="text-sm text-muted-foreground">
                We prepare and file your annual report with all required information.
              </p>
            </Card>

            <Card className="p-6">
              <CheckCircle className="h-12 w-12 text-primary mb-4" />
              <h3 className="font-bold text-lg mb-2">Guaranteed Compliance</h3>
              <p className="text-sm text-muted-foreground">
                Stay in good standing with your state and avoid penalties or dissolution.
              </p>
            </Card>
          </div>

          <Card className="p-8 mb-12">
            <h2 className="text-2xl font-bold mb-6">State-Specific Requirements</h2>
            <div className="space-y-4">
              <div className="pb-4 border-b">
                <h3 className="font-semibold mb-2">Filing Frequency</h3>
                <p className="text-sm text-muted-foreground">
                  Most states require annual reports yearly, but some require biennial (every two years) filings.
                </p>
              </div>
              <div className="pb-4 border-b">
                <h3 className="font-semibold mb-2">Due Dates</h3>
                <p className="text-sm text-muted-foreground">
                  Due dates vary by state - some align with your formation date, others have fixed calendar dates.
                </p>
              </div>
              <div className="pb-4 border-b">
                <h3 className="font-semibold mb-2">Filing Fees</h3>
                <p className="text-sm text-muted-foreground">
                  State fees range from $0 to $800+ depending on your state and business type.
                </p>
              </div>
              <div>
                <h3 className="font-semibold mb-2">Required Information</h3>
                <p className="text-sm text-muted-foreground">
                  Typically includes business address, registered agent details, member/officer names, and business activities.
                </p>
              </div>
            </div>
          </Card>

          <Card className="p-8">
            <h2 className="text-2xl font-bold mb-6">Our Annual Report Service</h2>
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-success mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Deadline Monitoring</h3>
                  <p className="text-sm text-muted-foreground">
                    We track your filing deadlines and send advance reminders.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-success mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Form Preparation</h3>
                  <p className="text-sm text-muted-foreground">
                    We prepare your annual report with accurate, up-to-date information.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-success mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">State Filing</h3>
                  <p className="text-sm text-muted-foreground">
                    We submit your report directly to the state on your behalf.
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <CheckCircle className="h-6 w-6 text-success mt-1 flex-shrink-0" />
                <div>
                  <h3 className="font-semibold mb-1">Confirmation & Records</h3>
                  <p className="text-sm text-muted-foreground">
                    Receive filed copies and state confirmation for your records.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="mt-8 text-center">
              <Button 
                size="lg"
                onClick={() => window.location.href = '/order-flow'}
              >
                Get Started with Annual Report Filing
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
