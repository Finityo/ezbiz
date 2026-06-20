import SEOHead from "@/components/SEOHead";
import { motion } from "framer-motion";
import { trackClick } from "@/hooks/useAnalytics";
import { EZBIZ_COPY } from "@/content/ezbizCopy";
import { trackEvent } from "@/lib/analytics";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, Shield, Clock, Users, Star, Building, FileText, TrendingUp, Award, Download, Zap, X } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import BackToTop from "@/components/BackToTop";
import AnimatedSection from "@/components/AnimatedSection";
import StaggeredGrid from "@/components/StaggeredGrid";
import TiltCard from "@/components/TiltCard";
import Hero from "@/components/Hero";
import CountUpDisplay from "@/components/CountUpDisplay";
import { useNavigate, useLocation } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import ChooseYourPath from "@/components/ChooseYourPath";
import LeadCaptureForm from "@/components/LeadCaptureForm";
import TrustStrip from "@/components/TrustStrip";
import HowItWorks from "@/components/HowItWorks";
import BetaLaunchCountdown from "@/components/BetaLaunchCountdown";
import VVLDownloadButton from "@/components/veteran/VVLDownloadButton";
import christianPortrait from "@/assets/christian-talavera.jpg";

// Homepage component
const Index = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const query = useMemo(() => new URLSearchParams(location.search), [location.search]);
  const qpVeteran = query.get("veteran") === "1";
  const qpMobile = query.get("mobile") === "1";
  const veteranGateRef = useRef<HTMLDivElement | null>(null);
  const mobileAddonRef = useRef<HTMLDivElement | null>(null);
  const [isVeteran, setIsVeteran] = useState(false);
  const [isFormedInTexas2022, setIsFormedInTexas2022] = useState(false);
  const [mobileAddonSelected, setMobileAddonSelected] = useState(false);
  const [highlightVeteran, setHighlightVeteran] = useState(qpVeteran);

  useEffect(() => {
    if (qpVeteran) {
      setIsVeteran(true);
      setTimeout(() => {
        veteranGateRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 250);
    }
    if (qpMobile) {
      setMobileAddonSelected(true);
      setTimeout(() => {
        mobileAddonRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 350);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [qpVeteran, qpMobile]);

  // Clean query params from URL after processing
  useEffect(() => {
    if (!location.search) return;
    if (!qpVeteran && !qpMobile) return;
    const cleaned = new URLSearchParams(location.search);
    cleaned.delete("veteran");
    cleaned.delete("mobile");
    const next = cleaned.toString();
    window.history.replaceState({}, "", `${location.pathname}${next ? `?${next}` : ""}`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Business structures ordered from simple to complex
  const businessStructures = [
    {
      title: "Sole Proprietorship",
      description: "Simplest structure for solo entrepreneurs",
      href: "/sole-proprietorship",
      complexity: "Simple",
      icon: <Users className="h-6 w-6" />
    },
    {
      title: "DBA Filing",
      description: "Operate under a trade name",
      href: "/dba-filing",
      complexity: "Simple",
      icon: <FileText className="h-6 w-6" />
    },
    {
      title: "Partnership",
      description: "Shared ownership with partners",
      href: "/partnership",
      complexity: "Moderate",
      icon: <Users className="h-6 w-6" />
    },
    {
      title: "LLC",
      description: "Limited liability with tax flexibility",
      href: "/form-llc",
      complexity: "Moderate",
      popular: true,
      icon: <Shield className="h-6 w-6" />
    },
    {
      title: "S Corporation",
      description: "Pass-through taxation, limited shareholders",
      href: "/s-corporation",
      complexity: "Complex",
      icon: <Building className="h-6 w-6" />
    },
    {
      title: "C Corporation",
      description: "Unlimited growth potential, raise capital",
      href: "/c-corporation",
      complexity: "Complex",
      icon: <TrendingUp className="h-6 w-6" />
    }
  ];

  const capabilityIcons = [<FileText className="h-8 w-8" />, <Shield className="h-8 w-8" />, <Award className="h-8 w-8" />];
  const capabilities = EZBIZ_COPY.capabilities.items.map((c, i) => ({ ...c, icon: capabilityIcons[i] }));

  const processSteps = EZBIZ_COPY.howItWorks.steps;

  // trustIndicators kept as numeric data (not copy)

  return (
    <div className="min-h-screen bg-background">
      <SEOHead path="/" />
      <Navigation />
      <FloatingCTA />
      <BackToTop />

      {/* Hero Section */}
      <Hero />

      {/* Veteran Benefits Strip */}
      <section ref={veteranGateRef} className={`relative overflow-hidden py-10 md:py-16 transition-all ${highlightVeteran ? "ring-2 ring-primary/30 rounded-xl p-3" : ""}`}>
        {/* Patriotic background */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-950 via-slate-900 to-red-900/80" />
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.1) 20px, rgba(255,255,255,0.1) 40px)' }} />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-8">
               <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-4">
                 <span className="text-xl">🇺🇸</span>
                 <span className="text-sm font-semibold text-white uppercase tracking-wider">Veteran Owned &amp; Operated</span>
                 <span className="text-xl">🇺🇸</span>
               </div>
               <h2 className="text-2xl md:text-3xl font-bold font-display text-white flex items-center justify-center gap-3">
                 <Star className="h-5 w-5 text-red-400 fill-red-400" /> {EZBIZ_COPY.veteranStrip.heading} <Star className="h-5 w-5 text-red-400 fill-red-400" />
               </h2>
               <p className="text-sm text-white/70 font-body mt-3 max-w-2xl mx-auto">
                 {EZBIZ_COPY.veteranStrip.subheading}
               </p>
            </div>
            <div className="grid sm:grid-cols-2 gap-4 md:gap-6 mb-8">
               {EZBIZ_COPY.veteranStrip.benefits.map((item, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-lg bg-white/5 border border-white/10">
                  <CheckCircle className="h-5 w-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm md:text-base font-body text-white/90">{item}</span>
                </div>
              ))}
            </div>
            <div className="text-center flex flex-col sm:flex-row items-center justify-center gap-3">
              <Button
                className="bg-yellow-400 text-slate-900 hover:bg-yellow-300 font-bold px-8 py-6 text-lg shadow-lg hover:shadow-xl transition-all border-0"
                onClick={() => { trackEvent('veteran_cta_click', { location: 'homepage' }); trackClick('Check Veteran Eligibility', 'veteran_strip_cta', '/veteran-llc-texas'); navigate('/veteran-llc-texas'); }}
              >
                 {EZBIZ_COPY.veteranStrip.cta}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <VVLDownloadButton source="homepage_veteran_strip" />
            </div>
            <p className="text-xs text-white/50 mt-3 text-center">
              Honoring those who served. Texas veteran-owned business benefits available.
            </p>
          </div>
        </div>
      </section>

      {/* Trust Strip */}
      <TrustStrip />

      {/* How It Works */}
      <HowItWorks />

      {/* Founders teaser → /entrepreneurs */}
      <section className="py-12 md:py-16 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center">
            <p className="text-xs font-semibold tracking-widest text-secondary uppercase mb-3">
              For Founders & Idea Holders
            </p>
            <h2 className="text-2xl md:text-3xl font-bold font-display text-foreground mb-3">
              Have an idea? We'll handle the filing.
            </h2>
            <p className="text-muted-foreground font-body mb-6 max-w-2xl mx-auto">
              See how EZ BIZ takes you from "I should start a business" to a filed entity, EIN, and
              bank-ready documents — with guided filing support from start to finish.
            </p>
            <a
              href="/entrepreneurs"
              className="inline-flex items-center gap-2 text-secondary font-semibold hover:underline"
            >
              See the founder's path →
            </a>
          </div>
        </div>
      </section>

      {/* Beta Launch Countdown */}
      <BetaLaunchCountdown />




      {/* Trust Indicators Bar */}
      <section className="py-6 md:py-8 border-y border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
            <div className="text-center">
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary font-display">🇺🇸</div>
              <div className="text-xs md:text-sm text-muted-foreground font-body mt-1">Veteran-Owned Filing Support</div>
            </div>
            <div className="text-center">
              <CountUpDisplay end={50} className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary font-display min-h-[1.2em]" duration={1600} />
              <div className="text-xs md:text-sm text-muted-foreground font-body mt-1">States Available via Partner Network</div>
            </div>
            <div className="text-center">
              <div className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary font-display">✓</div>
              <div className="text-xs md:text-sm text-muted-foreground font-body mt-1">Accuracy-Focused Document Review</div>
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground/70 text-center mt-3">
            Filing infrastructure provided by our partner network. Not a law firm. We do not provide legal advice.
          </p>
        </div>
      </section>

      {/* 3-Point Clarity Block */}
      <AnimatedSection className="py-12 md:py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-3 md:space-y-4 mb-10 md:mb-14">
            <div className="accent-line-center mb-4 md:mb-6"></div>
             <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display">
               {EZBIZ_COPY.clarityBlock.heading}
             </h2>
          </div>

          <StaggeredGrid className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto" staggerDelay={120}>
             {EZBIZ_COPY.clarityBlock.points.map((point, index) => (
              <div key={index} className="text-center space-y-3 p-6">
                <CheckCircle className="h-8 w-8 text-success mx-auto" />
                <h3 className="text-lg md:text-xl font-semibold font-display">{point.title}</h3>
                <p className="text-muted-foreground font-body leading-relaxed">{point.description}</p>
              </div>
            ))}
          </StaggeredGrid>
        </div>
      </AnimatedSection>

      {/* Differentiation Section */}
      <AnimatedSection className="py-12 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-3 md:space-y-4 mb-10 md:mb-16">
            <div className="accent-line-center mb-4 md:mb-6"></div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display">{EZBIZ_COPY.differentiation.heading}</h2>
          </div>
          
          <StaggeredGrid className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto" staggerDelay={150}>
             {EZBIZ_COPY.differentiation.items.map((item, index) => {
               const icons = [<Shield className="h-8 w-8" key="s" />, <Award className="h-8 w-8" key="a" />, <Zap className="h-8 w-8" key="z" />];
               return (
              <TiltCard key={index} className="border-0 shadow-smooth bg-card" tiltMax={6} scale={1.02}>
                 <CardHeader className="space-y-4">
                   <div className="inline-flex p-3 rounded-xl bg-primary/5 text-primary w-fit">
                     {icons[index]}
                  </div>
                  <CardTitle className="text-xl font-display">{item.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base font-body leading-relaxed">
                    {item.description}
                  </CardDescription>
                </CardContent>
              </TiltCard>
              );})}
          </StaggeredGrid>
        </div>
      </AnimatedSection>

      {/* Business Structures Section */}
      <AnimatedSection className="py-12 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-3 md:space-y-4 mb-10 md:mb-16">
            <div className="accent-line-center mb-4 md:mb-6"></div>
             <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display">{EZBIZ_COPY.businessStructures.heading}</h2>
             <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-body">
               {EZBIZ_COPY.businessStructures.subheading}
             </p>
          </div>
          
           <StaggeredGrid className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={100}>
             {businessStructures.map((structure, index) => (
               <TiltCard 
                 key={index} 
                 className={`relative ${
                   structure.popular ? 'border-secondary shadow-lg ring-1 ring-secondary/20' : 'border-border shadow-smooth'
                 }`}
                 onClick={() => navigate(structure.href)}
                 tiltMax={8}
                 scale={1.02}
               >
                 {structure.popular && (
                   <Badge className="absolute -top-3 left-6 bg-secondary text-secondary-foreground z-20">
                     Most Popular
                   </Badge>
                 )}
                 <CardHeader className="pb-3">
                   <div className="flex items-center justify-between mb-2">
                     <div className="p-2 rounded-lg bg-primary/5 text-primary">
                       {structure.icon}
                     </div>
                     <Badge variant="outline" className="text-xs font-body">
                       {structure.complexity}
                     </Badge>
                   </div>
                   <CardTitle className="text-lg font-display">{structure.title}</CardTitle>
                 </CardHeader>
                 <CardContent>
                   <CardDescription className="font-body">{structure.description}</CardDescription>
                   <Button variant="link" className="px-0 mt-4 text-primary font-body group">
                     Learn More 
                     <ArrowRight className="ml-1 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                   </Button>
                 </CardContent>
               </TiltCard>
             ))}
           </StaggeredGrid>
        </div>
      </AnimatedSection>

      {/* How It Works */}
      <AnimatedSection className="py-12 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-3 md:space-y-4 mb-10 md:mb-14">
            <div className="accent-line-center mb-4 md:mb-6"></div>
             <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display">{EZBIZ_COPY.howItWorks.heading}</h2>
           </div>

           <div className="max-w-2xl mx-auto space-y-6 md:space-y-8">
             {EZBIZ_COPY.howItWorks.steps.map((step, index) => (
              <div key={index} className="flex items-start gap-4 md:gap-6">
                <div className="flex-shrink-0 w-10 h-10 md:w-12 md:h-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <span className="text-lg md:text-xl font-bold text-primary font-display">{index + 1}</span>
                </div>
                <p className="text-base md:text-lg text-foreground font-body pt-2 md:pt-2.5">{step}</p>
              </div>
            ))}
          </div>
        </div>
      </AnimatedSection>

      {/* Founder Authority Block */}
      <AnimatedSection className="py-12 md:py-20 bg-card border-y border-border">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto text-center space-y-4">
            <div className="accent-line-center mb-6"></div>
            {/* Founder Portrait with fade vignette */}
            <div className="flex justify-center mb-4">
              <div className="relative group">
                <div className="absolute -inset-3 rounded-full bg-gradient-to-tr from-secondary/40 via-primary/20 to-secondary/40 blur-2xl opacity-70 group-hover:opacity-100 transition-opacity duration-700" />
                <div
                  className="relative w-52 h-52 md:w-64 md:h-64 rounded-full overflow-hidden ring-1 ring-secondary/40 shadow-elegant"
                  style={{
                    WebkitMaskImage:
                      "radial-gradient(circle at center, black 55%, rgba(0,0,0,0.85) 72%, transparent 100%)",
                    maskImage:
                      "radial-gradient(circle at center, black 55%, rgba(0,0,0,0.85) 72%, transparent 100%)",
                  }}
                >
                  <img
                    src={christianPortrait}
                    alt="Christian Talavera, MBA, MSL — Founder of EZ BIZ File Service"
                    loading="lazy"
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ objectPosition: "center 30%" }}
                  />
                </div>
              </div>
            </div>
             <h3 className="text-xl md:text-2xl font-bold font-display">{EZBIZ_COPY.founder.name}</h3>
             <p className="text-sm text-muted-foreground font-body">
               {EZBIZ_COPY.founder.credentials}
             </p>
             <p className="text-base text-secondary font-semibold font-display">
               {EZBIZ_COPY.founder.title}
             </p>
             <p className="text-muted-foreground font-body leading-relaxed max-w-lg mx-auto">
               {EZBIZ_COPY.founder.bio}
             </p>
          </div>
        </div>
      </AnimatedSection>

      {/* Mobile White-Glove Service */}
      <AnimatedSection className="py-12 md:py-20">
        <div ref={mobileAddonRef} className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="border-secondary/20 shadow-elegant overflow-hidden">
              <div className="p-6 md:p-10 space-y-5">
                 <Badge className="bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/15">
                   {EZBIZ_COPY.mobileService.badge}
                 </Badge>
                 <h3 className="text-2xl md:text-3xl font-bold font-display">
                   {EZBIZ_COPY.mobileService.heading}
                </h3>
                 <p className="text-muted-foreground font-body leading-relaxed">
                   {EZBIZ_COPY.mobileService.description}
                 </p>
                <div className="flex flex-col sm:flex-row gap-4 p-4 rounded-lg bg-muted/50">
                  <div className="text-center sm:text-left">
                    <span className="text-2xl font-bold text-primary font-display">$150</span>
                    <span className="text-sm text-muted-foreground font-body ml-1">first 2 hours</span>
                  </div>
                  <div className="hidden sm:block w-px bg-border"></div>
                  <div className="text-center sm:text-left">
                    <span className="text-2xl font-bold text-primary font-display">$80</span>
                    <span className="text-sm text-muted-foreground font-body ml-1">per hour thereafter</span>
                  </div>
                </div>
                <div className="flex items-center gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="mobile-addon-toggle"
                    checked={mobileAddonSelected}
                    onChange={(e) => {
                      setMobileAddonSelected(e.target.checked);
                      trackEvent('mobile_service_addon_click', { location: 'homepage', selected: e.target.checked });
                    }}
                    className="h-5 w-5 rounded border-border text-primary focus:ring-primary"
                  />
                   <label htmlFor="mobile-addon-toggle" className="text-sm font-medium font-body cursor-pointer">
                     {EZBIZ_COPY.mobileService.checkboxLabel}
                   </label>
                </div>
                <Button 
                  variant="outline"
                  className="border-secondary text-secondary hover:bg-secondary/5"
                  onClick={() => { trackEvent('mobile_service_addon_click', { location: 'homepage' }); trackClick('Learn More Mobile Service', 'mobile_service_cta', '/veteran-llc-texas'); navigate('/veteran-llc-texas'); }}
                >
                  {EZBIZ_COPY.mobileService.cta}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </AnimatedSection>

      {/* Objection Removal FAQ */}
      <AnimatedSection className="py-12 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <div className="text-center space-y-3 md:space-y-4 mb-10 md:mb-14">
               <div className="accent-line-center mb-4 md:mb-6"></div>
               <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display">{EZBIZ_COPY.faq.heading}</h2>
            </div>

            <Accordion type="single" collapsible className="space-y-3">
               {EZBIZ_COPY.faq.items.map((item, index) => (
                <AccordionItem key={index} value={`faq-${index}`} className="bg-card rounded-lg border px-6">
                  <AccordionTrigger className="text-base md:text-lg font-semibold font-display hover:no-underline">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground font-body text-base leading-relaxed">
                    {item.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </AnimatedSection>

      {/* Common Situations We Help With */}
      <AnimatedSection className="py-12 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-3 md:space-y-4 mb-10 md:mb-16">
            <div className="accent-line-center mb-4 md:mb-6"></div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display">Common Situations We Help With</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-body">
              Examples of what customers often ask about when starting a business.
            </p>
          </div>

          <StaggeredGrid className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={120}>
            {[
              { scenario: "First-time Founder", quote: "I need help forming my LLC correctly the first time." },
              { scenario: "Texas Veteran", quote: "I want to understand my Texas veteran fee-waiver options." },
              { scenario: "Post-Filing Clarity", quote: "I need clear next steps after my business is filed." },
              { scenario: "Choosing a Structure", quote: "I'm not sure whether an LLC, S-Corp, or C-Corp is right for me." },
              { scenario: "Compliance Reminders", quote: "I want help staying on top of annual reports and renewals." },
              { scenario: "Document Preparation", quote: "I want my Operating Agreement and EIN handled accurately." },
            ].map((item, index) => (
              <TiltCard key={index} className="border-border shadow-smooth" tiltMax={5} scale={1.01}>
                <CardHeader className="pb-2">
                  <div className="text-xs font-semibold uppercase tracking-wider text-secondary">{item.scenario}</div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground font-body leading-relaxed italic">
                    "{item.quote}"
                  </p>
                </CardContent>
              </TiltCard>
            ))}
          </StaggeredGrid>
          <p className="text-xs text-muted-foreground/70 text-center mt-6 max-w-xl mx-auto">
            Illustrative examples of common customer needs — not verified customer reviews.
          </p>
        </div>
      </AnimatedSection>

      {/* Why Choose Us Section */}
      <AnimatedSection className="py-12 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-8 md:gap-16 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <div className="accent-line mb-6"></div>
                 <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display">
                   {EZBIZ_COPY.whyChooseUs.heading}
                 </h2>
                 <p className="text-xl text-muted-foreground font-body leading-relaxed">
                   {EZBIZ_COPY.whyChooseUs.subheading}
                 </p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 p-3 rounded-xl bg-success/10 text-success">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                     <h3 className="font-semibold text-lg font-display">{EZBIZ_COPY.whyChooseUs.features[0].title}</h3>
                     <p className="text-muted-foreground font-body">
                       {EZBIZ_COPY.whyChooseUs.features[0].description}
                     </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 p-3 rounded-xl bg-secondary/10 text-secondary">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                     <h3 className="font-semibold text-lg font-display">{EZBIZ_COPY.whyChooseUs.features[1].title}</h3>
                     <p className="text-muted-foreground font-body">
                       {EZBIZ_COPY.whyChooseUs.features[1].description}
                     </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 p-3 rounded-xl bg-primary/10 text-primary">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                     <h3 className="font-semibold text-lg font-display">{EZBIZ_COPY.whyChooseUs.features[2].title}</h3>
                     <p className="text-muted-foreground font-body">
                       {EZBIZ_COPY.whyChooseUs.features[2].description}
                     </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <Card className="p-6 text-center shadow-smooth border-0 bg-gradient-subtle">
                <div className="text-4xl font-bold text-primary font-display mb-2">$0</div>
                <div className="text-sm text-muted-foreground font-body">State Filing Fee Markup</div>
              </Card>
              <Card className="p-6 text-center shadow-smooth border-0 bg-gradient-subtle">
                <div className="text-4xl font-bold text-primary font-display mb-2">24hr</div>
                <div className="text-sm text-muted-foreground font-body">Typical Response Window</div>
              </Card>
              <Card className="p-6 text-center shadow-smooth border-0 bg-gradient-subtle">
                <div className="text-4xl font-bold text-primary font-display mb-2">🇺🇸</div>
                <div className="text-sm text-muted-foreground font-body">Veteran-Owned</div>
              </Card>
              <Card className="p-6 text-center shadow-smooth border-0 bg-gradient-subtle">
                <div className="text-4xl font-bold text-primary font-display mb-2">✓</div>
                <div className="text-sm text-muted-foreground font-body">Accuracy-Focused Review</div>
              </Card>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Competitor Comparison Table */}
      <AnimatedSection className="py-12 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-3 md:space-y-4 mb-10 md:mb-16">
            <div className="accent-line-center mb-4 md:mb-6"></div>
             <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display">{EZBIZ_COPY.comparison.heading}</h2>
             <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-body">
               {EZBIZ_COPY.comparison.subheading}
             </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="border-border shadow-smooth overflow-hidden">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-primary/5">
                      <TableHead className="font-display text-base w-[200px]">Feature</TableHead>
                      <TableHead className="font-display text-base text-center bg-secondary/10 border-x border-secondary/20">
                        <span className="text-secondary font-bold">EZ BIZ</span>
                      </TableHead>
                      <TableHead className="font-display text-base text-center">LegalZoom</TableHead>
                      <TableHead className="font-display text-base text-center">ZenBusiness</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[
                      { feature: "LLC Formation", ezbiz: "From $129", legalzoom: "From $0 + upsells", zenbusiness: "From $0 + upsells" },
                      { feature: "Registered Agent (1yr)", ezbiz: "Add-on: $149/yr", legalzoom: "$249/yr", zenbusiness: "$199/yr" },
                      { feature: "Operating Agreement", ezbiz: "Included with Deluxe & Complete", legalzoom: "$99 extra", zenbusiness: "Paid plans only" },
                      { feature: "EIN Filing", ezbiz: "$89", legalzoom: "$79", zenbusiness: "$99" },
                      { feature: "Transparent Pricing", ezbiz: true, legalzoom: false, zenbusiness: false },
                      { feature: "Free Consultation", ezbiz: true, legalzoom: false, zenbusiness: false },
                      { feature: "24–48hr Filing", ezbiz: true, legalzoom: "7–30 days", zenbusiness: "2–3 weeks" },
                      { feature: "Dedicated Support", ezbiz: true, legalzoom: "Chatbot first", zenbusiness: "Email only" },
                    ].map((row, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium font-body">{row.feature}</TableCell>
                        <TableCell className="text-center bg-secondary/5 border-x border-secondary/10">
                          {row.ezbiz === true ? (
                            <CheckCircle className="h-5 w-5 text-success mx-auto" />
                          ) : (
                            <span className="font-semibold text-primary font-body">{row.ezbiz}</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {row.legalzoom === false ? (
                            <X className="h-5 w-5 text-destructive/60 mx-auto" />
                          ) : row.legalzoom === true ? (
                            <CheckCircle className="h-5 w-5 text-success mx-auto" />
                          ) : (
                            <span className="text-muted-foreground text-sm font-body">{row.legalzoom}</span>
                          )}
                        </TableCell>
                        <TableCell className="text-center">
                          {row.zenbusiness === false ? (
                            <X className="h-5 w-5 text-destructive/60 mx-auto" />
                          ) : row.zenbusiness === true ? (
                            <CheckCircle className="h-5 w-5 text-success mx-auto" />
                          ) : (
                            <span className="text-muted-foreground text-sm font-body">{row.zenbusiness}</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </Card>
            <div className="text-center mt-8">
              <Button 
                size="lg" 
                className="group bg-primary hover:bg-primary-light shadow-lg hover:shadow-elegant"
                onClick={() => { trackClick('See Our Packages', 'comparison_cta', '/pricing'); navigate('/pricing'); }}
              >
                 {EZBIZ_COPY.comparison.cta}
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* Lead Magnet Section */}
      <AnimatedSection className="py-12 md:py-20 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Card className="border-secondary/20 shadow-elegant overflow-hidden">
              <div className="grid md:grid-cols-5">
                <div className="md:col-span-3 p-6 md:p-10 space-y-5">
                   <Badge className="bg-secondary/10 text-secondary border-secondary/20 hover:bg-secondary/15">
                     {EZBIZ_COPY.leadMagnet.badge}
                   </Badge>
                   <h3 className="text-2xl md:text-3xl font-bold font-display">
                     {EZBIZ_COPY.leadMagnet.heading}
                   </h3>
                   <p className="text-muted-foreground font-body leading-relaxed">
                     {EZBIZ_COPY.leadMagnet.description}
                   </p>
                  <div className="space-y-2 text-sm font-body">
                    {EZBIZ_COPY.leadMagnet.bullets.map((item, i) => (
                      <div key={i} className="flex items-center gap-2">
                        <CheckCircle className="h-4 w-4 text-success flex-shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                  <Button 
                    size="lg"
                    className="group bg-secondary hover:bg-secondary-light text-secondary-foreground shadow-lg"
                    onClick={() => { trackClick('Get Your Free Checklist', 'lead_magnet_cta', '/business-guide'); navigate('/business-guide'); }}
                  >
                    <Download className="mr-2 h-5 w-5" />
                     {EZBIZ_COPY.leadMagnet.cta}
                  </Button>
                </div>
                <div className="md:col-span-2 bg-gradient-to-br from-primary/10 via-secondary/10 to-primary/5 flex items-center justify-center p-8">
                  <div className="text-center space-y-4">
                    <div className="inline-flex p-5 rounded-2xl bg-primary/10">
                      <FileText className="h-16 w-16 text-primary" />
                    </div>
                    <div className="space-y-1">
                      <p className="font-display font-bold text-lg">Free Guide</p>
                      <p className="text-sm text-muted-foreground font-body">PDF • No email required</p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </AnimatedSection>

      {/* (Beta CTA moved above the fold) */}

      {/* Lead Capture Form */}
      <section className="py-10 md:py-14 bg-muted/30">
        <div className="container mx-auto px-4">
          <LeadCaptureForm />
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 md:py-24 gradient-executive text-primary-foreground">
        <div className="container mx-auto px-4 text-center space-y-6 md:space-y-8">
           <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display">
             {EZBIZ_COPY.finalCta.heading}
           </h2>
          <div>
            <Button 
              size="lg" 
               className="bg-secondary hover:bg-secondary-light text-secondary-foreground shadow-lg hover:shadow-xl text-base md:text-lg px-6 md:px-8 h-12 md:h-14"
              onClick={() => { trackClick('Get Started Today', 'final_cta', '/pricing'); navigate('/pricing'); }}
            >
               {EZBIZ_COPY.finalCta.cta}
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
