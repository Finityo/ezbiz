import { motion } from "framer-motion";
import { trackEvent } from "@/lib/analytics";
import { trackClick } from "@/hooks/useAnalytics";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, Shield, Award, FileText, MapPin, AlertTriangle, ClipboardList } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import BackToTop from "@/components/BackToTop";
import AnimatedSection from "@/components/AnimatedSection";
import { useNavigate } from "react-router-dom";

const VeteranLLCTexas = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <FloatingCTA />
      <BackToTop />

      {/* Hero */}
      <section className="relative py-16 md:py-24 overflow-hidden">
        <div className="absolute inset-0 bg-primary/[0.03]"></div>
        <div className="absolute inset-0 opacity-[0.02]" style={{ backgroundImage: 'radial-gradient(circle, hsl(var(--primary)) 1px, transparent 1px)', backgroundSize: '24px 24px' }}></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <Badge className="bg-primary/10 text-primary border-primary/20 text-sm px-4 py-1.5">
              🇺🇸 Veteran & Active Duty
            </Badge>
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight font-display">
              Texas Veteran-Owned{" "}
              <span className="text-bronze">Business Benefits</span>
            </h1>
            <p className="text-base md:text-xl text-muted-foreground leading-relaxed font-body max-w-2xl mx-auto">
              If your Texas business is 100% owned by honorably discharged U.S. veterans 
              and formed on or after January 1, 2022, you may qualify for relief from certain 
              filing fees and Texas franchise tax for up to five years.*
            </p>
            <p className="text-xs text-muted-foreground/70 font-body">
              Based on Texas Secretary of State and Comptroller guidance.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button 
                size="lg" 
                className="group text-base md:text-lg px-8 h-14 bg-primary hover:bg-primary-light shadow-lg hover:shadow-elegant"
                onClick={() => { trackEvent('veteran_cta_click', { location: 'veteran_page' }); navigate('/order-flow'); }}
              >
                Check My Eligibility
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="group text-base md:text-lg px-8 h-14"
                onClick={() => { trackEvent('veteran_cta_click', { location: 'veteran_page' }); navigate('/order-flow'); }}
              >
                Start My Texas LLC
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Section 1: Qualification Requirements */}
      <AnimatedSection className="py-12 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center space-y-4 mb-10">
              <div className="accent-line-center mb-6"></div>
              <h2 className="text-2xl md:text-3xl font-bold font-display">
                Who Qualifies?
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { icon: <FileText className="h-6 w-6" />, text: "Entity must be formed in Texas on or after January 1, 2022" },
                { icon: <Shield className="h-6 w-6" />, text: "Must be 100% owned by one or more honorably discharged U.S. veterans" },
                { icon: <ClipboardList className="h-6 w-6" />, text: "Each owner must obtain a Texas Veterans Commission Verification Letter" },
                { icon: <MapPin className="h-6 w-6" />, text: "Must submit Comptroller Form 05-904 (Certification of New Veteran-Owned Business)" },
              ].map((item, i) => (
                <Card key={i} className="border-border shadow-smooth">
                  <CardContent className="flex items-start gap-4 p-5">
                    <div className="p-2 rounded-lg bg-primary/5 text-primary flex-shrink-0">
                      {item.icon}
                    </div>
                    <p className="font-body text-foreground">{item.text}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
            <p className="text-sm text-muted-foreground font-body mt-6 text-center italic">
              Even during exemption, certain reports may still be required with the Texas Comptroller.
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* Section 2: Required Steps */}
      <AnimatedSection className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center space-y-4 mb-10">
              <div className="accent-line-center mb-6"></div>
              <h2 className="text-2xl md:text-3xl font-bold font-display">
                How the Process Works
              </h2>
            </div>
            <div className="space-y-6">
              {[
                {
                  step: "1",
                  title: "Obtain Veteran Verification Letter",
                  description: "Request a Verification Letter from the Texas Veterans Commission for each owner."
                },
                {
                  step: "2",
                  title: "Complete Comptroller Certification",
                  description: "Fill out Comptroller Certification Form 05-904 (Certification of New Veteran-Owned Business)."
                },
                {
                  step: "3",
                  title: "Submit Certificate of Formation",
                  description: "Submit your Certificate of Formation along with both required documents to the Texas Secretary of State."
                }
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-5">
                  <div className="flex-shrink-0 w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-xl font-bold text-primary font-display">{item.step}</span>
                  </div>
                  <div className="pt-1">
                    <h3 className="text-lg font-semibold font-display">{item.title}</h3>
                    <p className="text-muted-foreground font-body mt-1">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted-foreground font-body mt-6 text-center italic">
              Electronic filing is recommended for faster processing.
            </p>
          </div>
        </div>
      </AnimatedSection>

      {/* Section 3: Name Compliance Notice */}
      <AnimatedSection className="py-12 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center space-y-4 mb-8">
              <div className="accent-line-center mb-6"></div>
              <h2 className="text-2xl md:text-3xl font-bold font-display">
                Avoid Filing Delays
              </h2>
            </div>
            <Card className="border-border shadow-smooth">
              <CardContent className="flex items-start gap-4 p-6 md:p-8">
                <div className="p-2 rounded-lg bg-destructive/10 text-destructive flex-shrink-0">
                  <AlertTriangle className="h-6 w-6" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold font-display mb-2">Important Name Compliance Notice</h3>
                  <p className="text-muted-foreground font-body leading-relaxed">
                    Texas has restrictions on certain words such as "Veteran," "Legion," "War," 
                    or similar terms in entity names unless written permission is provided. We help 
                    ensure your business name complies to avoid rejection or delay.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </AnimatedSection>

      {/* Section 4: Founder Credibility */}
      <AnimatedSection className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center p-8 rounded-xl bg-primary/[0.03] border border-primary/10">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 text-primary mb-4">
                <Award className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-bold font-display">Christian Talavera</h3>
              <p className="text-sm text-muted-foreground font-body mt-1">
                U.S. Marine Veteran · MBA · MSL
              </p>
              <p className="text-base text-secondary font-semibold font-display mt-1">
                Founder, EZ BIZ File Service, LLC
              </p>
              <p className="text-muted-foreground font-body leading-relaxed max-w-lg mx-auto mt-3">
                Built on structure, compliance, and execution — helping Texas veterans 
                form correctly from day one.
              </p>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Section 5: Mobile Filing */}
      <AnimatedSection className="py-12 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center space-y-4 mb-10">
              <div className="accent-line-center mb-6"></div>
              <h2 className="text-2xl md:text-3xl font-bold font-display">
                White-Glove Mobile Filing
              </h2>
            </div>
            <Card className="border-secondary/20 shadow-elegant">
              <CardContent className="p-6 md:p-10 space-y-5">
                <Badge className="bg-secondary/10 text-secondary border-secondary/20">
                  Optional Add-On
                </Badge>
                <p className="text-muted-foreground font-body leading-relaxed">
                  Prefer in-person support? We offer optional mobile filing sessions for clients 
                  who want guided, structured assistance. We can meet at your residence or a 
                  public location and complete your filing together in real time.
                </p>
                <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg bg-muted/50">
                  <div className="text-center sm:text-left">
                    <span className="text-2xl font-bold text-primary font-display">$150</span>
                    <span className="text-sm text-muted-foreground font-body ml-1">first 2 hours</span>
                  </div>
                  <div className="hidden sm:block w-px bg-border"></div>
                  <div className="text-center sm:text-left">
                    <span className="text-2xl font-bold text-primary font-display">$80</span>
                    <span className="text-sm text-muted-foreground font-body ml-1">/hour thereafter</span>
                  </div>
                </div>
                <Button 
                  size="lg"
                  className="group bg-primary hover:bg-primary-light shadow-lg"
                  onClick={() => { trackEvent('mobile_service_addon_click', { location: 'veteran_page' }); navigate('/order-flow'); }}
                >
                  Add Mobile Filing to My Order
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </AnimatedSection>

      {/* Final CTA */}
      <section className="py-12 md:py-24 gradient-executive text-primary-foreground">
        <div className="container mx-auto px-4 text-center space-y-6">
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display">
            Ready to Start Your Texas LLC?
          </h2>
          <p className="text-lg text-primary-foreground/80 font-body max-w-xl mx-auto">
            Whether you're a Veteran, Active Duty, or civilian entrepreneur — we file it right.
          </p>
          <Button 
            size="lg" 
            className="bg-secondary hover:bg-secondary-light text-secondary-foreground shadow-lg text-base md:text-lg px-8 h-14"
            onClick={() => { trackEvent('veteran_cta_click', { location: 'veteran_page' }); navigate('/order-flow'); }}
          >
            Get Started Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      {/* Legal Footnote */}
      <section className="py-6 border-t border-border bg-muted/20">
        <div className="container mx-auto px-4">
          <p className="text-xs text-muted-foreground/70 font-body text-center max-w-3xl mx-auto leading-relaxed">
            *Information based on Texas Secretary of State and Texas Comptroller guidance. 
            Qualification requirements must be met in full. EZ BIZ File Service does not 
            determine eligibility — final determination is made by applicable state authorities.
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VeteranLLCTexas;
