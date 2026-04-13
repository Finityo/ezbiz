import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";

const TermsOfService = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold mb-2">Terms of Service</h1>
          <p className="text-muted-foreground mb-8">Last Updated: January 2025</p>

          <Card className="p-8 space-y-8">
            <section>
              <h2 className="text-2xl font-bold mb-4">1. Acceptance of Terms</h2>
              <p className="text-muted-foreground">
                By accessing and using EZ BIZ File Service's services, you agree to be bound by these Terms of Service 
                and all applicable laws and regulations. If you do not agree with any of these terms, you 
                are prohibited from using our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">2. Services Description</h2>
              <p className="text-muted-foreground mb-4">
                EZ BIZ File Service provides business formation, compliance, and related services including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>LLC and Corporation formation services</li>
                <li>Registered agent services</li>
                <li>Annual report filing</li>
                <li>DBA name registration</li>
                <li>EIN application assistance</li>
                <li>Business compliance services</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">3. User Obligations</h2>
              <p className="text-muted-foreground mb-4">You agree to:</p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>Provide accurate, complete, and current information</li>
                <li>Maintain the security of your account credentials</li>
                <li>Notify us immediately of any unauthorized account access</li>
                <li>Comply with all applicable federal, state, and local laws</li>
                <li>Not use our services for any unlawful purpose</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">4. Fees and Payment</h2>
              <p className="text-muted-foreground mb-4">
                All fees are stated in U.S. dollars and are non-refundable except as expressly stated in 
                our Refund Policy. You agree to pay all fees associated with services you order, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground ml-4">
                <li>EZ BIZ File Service fees</li>
                <li>State filing fees</li>
                <li>Any additional add-on services you select</li>
              </ul>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">5. Service Processing Times</h2>
              <p className="text-muted-foreground">
                Processing times are estimates based on state filing times and are not guaranteed. Actual 
                processing times may vary depending on state processing volumes, accuracy of submitted 
                information, and other factors beyond our control.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">6. Limitation of Liability</h2>
              <p className="text-muted-foreground">
                EZ BIZ File Service provides document preparation and filing services. We are not a law firm and do not 
                provide legal advice. In no event shall EZ BIZ File Service be liable for any indirect, incidental, 
                special, consequential, or punitive damages arising from your use of our services.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">7. Intellectual Property</h2>
              <p className="text-muted-foreground">
                All content on the EZ BIZ File Service website, including text, graphics, logos, and software, is the 
                property of EZ BIZ File Service and is protected by copyright, trademark, and other intellectual 
                property laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">8. Privacy</h2>
              <p className="text-muted-foreground">
                Your use of our services is also governed by our Privacy Policy. Please review our Privacy 
                Policy to understand our practices regarding your personal information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">9. Modifications to Terms</h2>
              <p className="text-muted-foreground">
                EZ BIZ File Service reserves the right to modify these Terms of Service at any time. We will notify 
                users of any material changes via email or through our website. Continued use of our 
                services after changes constitutes acceptance of the modified terms.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">10. Governing Law</h2>
              <p className="text-muted-foreground">
                These Terms of Service shall be governed by and construed in accordance with the laws of 
                the United States and the state in which EZ BIZ File Service is registered, without regard to conflict 
                of law provisions.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-bold mb-4">11. Contact Information</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about these Terms of Service, please contact us:
              </p>
              <div className="text-muted-foreground space-y-1">
                <p className="font-semibold text-foreground">EZ BIZ FILE SERVICE, LLC</p>
                <p>1101 Thorpe Lane Ste 105-1028</p>
                <p>San Marcos, TX 78666 United States</p>
                <p>Phone: (830) 837-1955</p>
                <p>Email: info@ezbiz-fs.com</p>
              </div>
            </section>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default TermsOfService;
