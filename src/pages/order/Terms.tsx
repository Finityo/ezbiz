import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useOrderContext } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, ArrowLeft, Loader2, FileText, Shield } from "lucide-react";
import { toast } from "sonner";

export default function Terms() {
  const navigate = useNavigate();
  const { order, updateField, saveStep, saving } = useOrderContext();

  const setAgreement = (field: string, value: boolean) =>
    updateField("agreements", { ...order.agreements, [field]: value });

  const canContinue = order.agreements.termsAccepted && order.agreements.privacyAccepted;

  const handleContinue = async () => {
    if (!canContinue) {
      toast.error("You must accept both terms and privacy policy to continue.");
      return;
    }
    await saveStep(3);
    navigate("/order/checkout");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-grow bg-gradient-to-br from-primary/5 via-background to-accent/5 py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <Badge className="bg-primary text-primary-foreground">Step 3 of 4</Badge>
            <span>Terms & Agreements</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-bold text-center">Terms & Agreements</h1>
          <p className="text-center text-muted-foreground">
            Please review and accept the following terms before proceeding to checkout.
          </p>

          {/* Terms of Service */}
          <Card className="p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" /> Terms of Service
            </h3>
            <ScrollArea className="h-48 rounded-md border p-4 text-sm text-muted-foreground">
              <div className="space-y-3">
                <p className="font-medium text-foreground">EZ BIZ FILE SERVICE — Terms of Service</p>
                <p>
                  By using EZ BIZ File Service ("Company," "we," "us"), you agree to the following terms and conditions. Please read them carefully before placing your order.
                </p>
                <p className="font-medium text-foreground">1. Service Description</p>
                <p>
                  EZ BIZ File Service assists with the preparation and filing of business formation documents with appropriate state agencies. We are not a law firm and do not provide legal advice. Our services include document preparation, filing assistance, and registered agent services.
                </p>
                <p className="font-medium text-foreground">2. Accuracy of Information</p>
                <p>
                  You are responsible for the accuracy of all information provided. EZ BIZ File Service is not liable for errors resulting from incorrect or incomplete information supplied by you.
                </p>
                <p className="font-medium text-foreground">3. Filing Fees</p>
                <p>
                  State filing fees are separate from our service fees and are subject to change without notice. We will inform you of the current fees at the time of your order.
                </p>
                <p className="font-medium text-foreground">4. Processing Times</p>
                <p>
                  Processing times vary by state and are estimates only. We are not responsible for delays caused by state agencies, holidays, or other factors beyond our control.
                </p>
                <p className="font-medium text-foreground">5. Refund Policy</p>
                <p>
                  Service fees are refundable if your order has not yet been submitted to the state. Once submitted, state filing fees are non-refundable. See our full refund policy for details.
                </p>
                <p className="font-medium text-foreground">6. Limitation of Liability</p>
                <p>
                  Our total liability for any claim is limited to the amount of fees paid by you for the specific service giving rise to the claim.
                </p>
              </div>
            </ScrollArea>

            <div className="flex items-start gap-3 pt-2">
              <Checkbox
                id="terms"
                checked={order.agreements.termsAccepted}
                onCheckedChange={(v) => setAgreement("termsAccepted", v === true)}
              />
              <label htmlFor="terms" className="text-sm cursor-pointer leading-tight">
                I have read and agree to the <span className="text-primary font-medium">Terms of Service</span>.
              </label>
            </div>
          </Card>

          <Separator />

          {/* Privacy Policy */}
          <Card className="p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" /> Privacy Policy
            </h3>
            <ScrollArea className="h-48 rounded-md border p-4 text-sm text-muted-foreground">
              <div className="space-y-3">
                <p className="font-medium text-foreground">EZ BIZ FILE SERVICE — Privacy Policy</p>
                <p>
                  Your privacy is important to us. This Privacy Policy explains how we collect, use, disclose, and safeguard your information.
                </p>
                <p className="font-medium text-foreground">1. Information We Collect</p>
                <p>
                  We collect personal information you provide, including: name, email, phone number, business details, Social Security Number (for EIN filing only), mailing address, and payment information.
                </p>
                <p className="font-medium text-foreground">2. How We Use Your Information</p>
                <p>
                  We use the information to: process your business formation orders, file documents with state agencies, communicate order status, improve our services, and comply with legal obligations.
                </p>
                <p className="font-medium text-foreground">3. Data Security</p>
                <p>
                  We implement industry-standard security measures including encryption (AES-256) for sensitive data like Social Security Numbers, secure HTTPS connections, and access controls.
                </p>
                <p className="font-medium text-foreground">4. Data Sharing</p>
                <p>
                  We do not sell your personal information. We share data only with: state agencies (for filings), payment processors (Stripe), and service partners necessary to fulfill your order.
                </p>
                <p className="font-medium text-foreground">5. Your Rights</p>
                <p>
                  You have the right to access, correct, or delete your personal information. Contact us at support@ezbizfile.com to exercise these rights.
                </p>
              </div>
            </ScrollArea>

            <div className="flex items-start gap-3 pt-2">
              <Checkbox
                id="privacy"
                checked={order.agreements.privacyAccepted}
                onCheckedChange={(v) => setAgreement("privacyAccepted", v === true)}
              />
              <label htmlFor="privacy" className="text-sm cursor-pointer leading-tight">
                I have read and agree to the <span className="text-primary font-medium">Privacy Policy</span>.
              </label>
            </div>
          </Card>

          <div className="flex justify-between items-center pt-2">
            <Button variant="outline" onClick={() => navigate("/order/irs-contact")} disabled={saving}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <Button onClick={handleContinue} disabled={saving || !canContinue} size="lg">
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ArrowRight className="h-4 w-4 mr-2" />}
              {saving ? "Saving..." : "Continue to Checkout"}
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
