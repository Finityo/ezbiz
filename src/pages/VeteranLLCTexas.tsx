import { motion } from "framer-motion";
import { trackClick } from "@/hooks/useAnalytics";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, Shield, Award, Users, FileText, MapPin } from "lucide-react";
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
              Texas Veterans and Active Duty:{" "}
              <span className="text-bronze">You May Qualify for State Filing Fee Waivers.</span>
            </h1>
            <p className="text-base md:text-xl text-muted-foreground leading-relaxed font-body max-w-2xl mx-auto">
              As a Marine-founded Texas filing service, we guide Veterans and Active Service 
              Members through compliant business formation with clarity and professionalism.
            </p>
            <Button 
              size="lg" 
              className="group text-base md:text-lg px-8 h-14 bg-primary hover:bg-primary-light shadow-lg hover:shadow-elegant"
              onClick={() => { trackClick('Check My Eligibility', 'veteran_hero_cta', '/order-flow'); navigate('/order-flow'); }}
            >
              Check My Eligibility
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Section 1: Texas Filing Benefits */}
      <AnimatedSection className="py-12 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center space-y-4 mb-10">
              <div className="accent-line-center mb-6"></div>
              <h2 className="text-2xl md:text-3xl font-bold font-display">
                Texas Filing Benefits for Veterans
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-6">
              {[
                { icon: <Shield className="h-6 w-6" />, text: "Possible state filing fee exemptions for qualifying Veterans" },
                { icon: <FileText className="h-6 w-6" />, text: "Structured document preparation" },
                { icon: <MapPin className="h-6 w-6" />, text: "Texas-compliant filing process" },
                { icon: <CheckCircle className="h-6 w-6" />, text: "Transparent pricing with no hidden fees" },
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
          </div>
        </div>
      </AnimatedSection>

      {/* Section 2: Why Marine-Founded */}
      <AnimatedSection className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center space-y-4 mb-10">
              <div className="accent-line-center mb-6"></div>
              <h2 className="text-2xl md:text-3xl font-bold font-display">
                Why Work With a Marine-Founded Service
              </h2>
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              {[
                "Direct communication",
                "Clear expectations",
                "No unnecessary upsells",
                "Process-driven execution"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3 p-4 rounded-lg bg-card border">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                  <span className="font-body font-medium">{item}</span>
                </div>
              ))}
            </div>

            {/* Founder Block */}
            <div className="mt-10 text-center p-8 rounded-xl bg-primary/[0.03] border border-primary/10">
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
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Section 3: Mobile Filing */}
      <AnimatedSection className="py-12 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center space-y-4 mb-10">
              <div className="accent-line-center mb-6"></div>
              <h2 className="text-2xl md:text-3xl font-bold font-display">
                Optional White-Glove Mobile Filing
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
                  onClick={() => { trackClick('Start My Texas LLC', 'veteran_mobile_cta', '/order-flow'); navigate('/order-flow'); }}
                >
                  Start My Texas LLC
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
            onClick={() => { trackClick('Get Started Veteran Page', 'veteran_final_cta', '/order-flow'); navigate('/order-flow'); }}
          >
            Get Started Today
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default VeteranLLCTexas;
