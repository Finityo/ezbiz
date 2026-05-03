import SEOHead from "@/components/SEOHead";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { AlertTriangle, CheckCircle } from "lucide-react";

const RefundPolicy = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Refund Policy" description="Refund Policy for EZ BIZ FILE SERVICE business formation services." path="/refund-policy" />
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Refund Policy</h1>
          <p className="text-muted-foreground mb-8">Last Updated: January 2025</p>

          <div className="bg-primary/5 border border-primary/20 rounded-lg p-6 mb-8 flex items-start gap-4">
            <AlertTriangle className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
            <div>
              <h3 className="font-semibold mb-2">Important Notice</h3>
              <p className="text-sm text-muted-foreground">
                Due to the nature of our business formation services, certain fees are non-refundable once 
                work has begun or documents have been filed with state agencies. Please review this policy 
                carefully before placing an order.
              </p>
            </div>
          </div>

          <Card className="p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. EZ BIZ File Service Fees</h2>
              <div className="space-y-4">
                <div className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">Before Filing</h3>
                    <p className="text-sm text-muted-foreground">
                      You may request a full refund of EZ BIZ File Service fees if you cancel your order 
                      <strong> before</strong> we begin processing your documents or submitting them to the state.
                    </p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-warning mt-1 flex-shrink-0" />
                  <div>
                    <h3 className="font-semibold mb-2">After Filing Begins</h3>
                    <p className="text-sm text-muted-foreground">
                      Once we have begun preparing or submitting your documents, EZ BIZ File Service fees are 
                      <strong> non-refundable</strong> as work has already been performed.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. State Filing Fees</h2>
              <p className="text-muted-foreground mb-4">
                State filing fees are collected by government agencies and are <strong>non-refundable</strong> in 
                all circumstances, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>If your application is rejected by the state</li>
                <li>If you change your mind after filing</li>
                <li>If your business name becomes unavailable</li>
                <li>For any other reason once fees have been submitted</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. Add-On Services</h2>
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Refundable Add-Ons</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    The following add-on services may be refunded if cancelled before work begins:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                    <li>Operating Agreement preparation</li>
                    <li>Corporate Bylaws preparation</li>
                    <li>Business name search services</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Non-Refundable Add-Ons</h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    The following add-on services are non-refundable once purchased:
                  </p>
                  <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground ml-4">
                    <li>EIN application filing (once submitted to IRS)</li>
                    <li>Expedited/Rush filing fees</li>
                    <li>Certified copies</li>
                    <li>Express shipping</li>
                  </ul>
                </div>
              </div>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Registered Agent Services</h2>
              <p className="text-muted-foreground">
                Annual registered agent service fees are non-refundable after the service year begins. If 
                you cancel within 30 days of purchase and before the service year starts, you may receive 
                a full refund.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. State Rejections</h2>
              <p className="text-muted-foreground mb-4">
                If your filing is rejected by the state for reasons within our control (errors in document 
                preparation), we will:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Correct the errors at no additional charge</li>
                <li>Refile your documents with the state</li>
                <li>Cover any additional state filing fees required for refiling</li>
              </ul>
              <p className="text-muted-foreground mt-4">
                If rejection is due to information you provided (unavailable business name, incorrect 
                information, etc.), additional fees may apply for refiling.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Refund Request Process</h2>
              <p className="text-muted-foreground mb-4">To request a refund:</p>
              <ol className="list-decimal list-inside space-y-2 text-muted-foreground ml-4">
                <li>Contact our customer support team via email or phone</li>
                <li>Provide your order number and reason for refund request</li>
                <li>Allow 5-7 business days for review and processing</li>
                <li>Approved refunds will be issued to the original payment method within 10-14 business days</li>
              </ol>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Satisfaction Guarantee</h2>
              <p className="text-muted-foreground">
                We stand behind the quality of our work. If you are not satisfied with our document 
                preparation services, contact us within 30 days and we will work with you to resolve 
                any issues or concerns.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Changes to This Policy</h2>
              <p className="text-muted-foreground">
                EZ BIZ File Service reserves the right to modify this Refund Policy at any time. Changes will be 
                effective immediately upon posting to our website. Your continued use of our services 
                after changes constitutes acceptance of the updated policy.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have questions about this Refund Policy or need to request a refund, please contact us:
              </p>
              <div className="text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">EZ BIZ FILE SERVICE, LLC</p>
                <p>1101 Thorpe Lane Ste 105-1028</p>
                <p>San Marcos, TX 78666 United States</p>
                <p>Phone: (830) 837-1955</p>
                <p>Email: christian@ezbiz-fs.com</p>
              </div>
            </section>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default RefundPolicy;
