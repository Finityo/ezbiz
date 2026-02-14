import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, Shield, Clock, Users, Star, Building, FileText, TrendingUp, Award } from "lucide-react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import BackToTop from "@/components/BackToTop";
import AnimatedSection from "@/components/AnimatedSection";
import StaggeredGrid from "@/components/StaggeredGrid";
import TiltCard from "@/components/TiltCard";
import heroImage from "@/assets/hero-business.jpg";
import logoImage from "@/assets/logo-ezbiz-cropped.png";
import ParallaxImage from "@/components/ParallaxImage";
import CountUpDisplay from "@/components/CountUpDisplay";
import { useNavigate } from "react-router-dom";

const Index = () => {
  const navigate = useNavigate();

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

  const capabilities = [
    {
      icon: <FileText className="h-8 w-8" />,
      title: "Complete Formation Services",
      description: "From Articles of Organization to Operating Agreements, we handle every document your business needs."
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Registered Agent Services",
      description: "Professional representation in all 50 states, ensuring you never miss critical legal correspondence."
    },
    {
      icon: <Award className="h-8 w-8" />,
      title: "Compliance & Ongoing Support",
      description: "Annual reports, tax filings, and compliance monitoring to keep your business in good standing."
    }
  ];

  const processSteps = [
    {
      step: "01",
      title: "Choose Your Structure",
      description: "Select the business entity that aligns with your goals, liability needs, and tax preferences."
    },
    {
      step: "02", 
      title: "Provide Your Details",
      description: "Complete our streamlined form with your business information. Takes less than 15 minutes."
    },
    {
      step: "03",
      title: "We Handle the Filing",
      description: "Our experts prepare and submit all documents to the appropriate state authorities."
    },
    {
      step: "04",
      title: "Launch Your Business", 
      description: "Receive your official documents and begin operating your legally formed business."
    }
  ];

  const trustIndicators = [
    { value: "50,000+", label: "Businesses Formed" },
    { value: "15+", label: "Years of Experience" },
    { value: "50", label: "States Served" },
    { value: "4.9★", label: "Customer Rating" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <FloatingCTA />
      <BackToTop />

      {/* Hero Section - Executive Style */}
      <section className="relative py-10 md:py-16 lg:py-24 overflow-hidden" style={{ backgroundColor: '#fff' }}>
        <div className="container mx-auto px-4 relative z-10">
          {/* Centered Logo */}
          <div className="flex justify-center items-center mb-8 md:mb-16 lg:mb-20">
            <motion.div
              className="relative"
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              style={{ filter: 'drop-shadow(0 6px 20px rgba(0,0,0,0.15)) drop-shadow(0 2px 6px rgba(0,0,0,0.1))' }}
            >
              <img 
                src={logoImage} 
                alt="EZ BIZ FILE SERVICE" 
                className="h-48 sm:h-64 md:h-80 lg:h-[26rem] w-auto object-contain mix-blend-multiply mx-auto"
                style={{ filter: 'contrast(1.03) saturate(1.05)' }}
              />
            </motion.div>
          </div>

          <div className="grid lg:grid-cols-2 gap-8 md:gap-12 lg:gap-16 items-center">
            <div className="space-y-6 md:space-y-8">
              <div className="space-y-4 md:space-y-6">
                <div className="inline-flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-secondary/10 text-secondary border border-secondary/20">
                  <Star className="h-4 w-4 fill-current" />
                  <span className="text-xs md:text-sm font-medium font-body">Trusted by 50,000+ Entrepreneurs</span>
                </div>
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold leading-tight font-display">
                  Build Your Business on a{" "}
                  <span className="text-bronze">Solid Foundation</span>
                </h1>
                <p className="text-base md:text-xl text-muted-foreground leading-relaxed font-body max-w-xl">
                  Professional business formation services that combine legal expertise with 
                  personalized guidance. From sole proprietorship to corporation, we make 
                  entity formation simple and reliable.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 md:gap-4">
                <Button 
                  size="lg" 
                  className="group text-base md:text-lg px-6 md:px-8 h-12 md:h-14 bg-primary hover:bg-primary-light shadow-lg hover:shadow-elegant transition-all" 
                  onClick={() => navigate('/order-now')}
                >
                  Start Your Business
                  <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button 
                  variant="outline" 
                  size="lg" 
                  className="text-base md:text-lg px-6 md:px-8 h-12 md:h-14 border-2 hover:bg-muted"
                  onClick={() => navigate('/consultation')}
                >
                  Free Consultation
                </Button>
              </div>

              <div className="flex flex-col sm:flex-row sm:flex-wrap items-start sm:items-center gap-3 sm:gap-6 pt-2 md:pt-4 text-sm text-muted-foreground font-body">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                  <span>No Hidden Fees</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                  <span>24-48 Hour Filing</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-success flex-shrink-0" />
                  <span>100% Satisfaction Guarantee</span>
                </div>
              </div>
            </div>

            <div className="relative lg:pl-8 hidden md:block">
              <div className="absolute -inset-4 bg-gradient-to-r from-secondary/10 to-primary/10 rounded-3xl blur-2xl"></div>
              <ParallaxImage 
                src={heroImage} 
                alt="Professional business consultation"
                className="relative shadow-hero w-full h-auto object-cover scale-110"
                speed={0.2}
                maxOffset={80}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators Bar */}
      <section className="py-6 md:py-8 border-y border-border bg-card">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-8">
            <div className="text-center">
              <CountUpDisplay end={50000} suffix="+" className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary font-display" duration={2200} />
              <div className="text-xs md:text-sm text-muted-foreground font-body mt-1">Businesses Formed</div>
            </div>
            <div className="text-center">
              <CountUpDisplay end={15} suffix="+" className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary font-display" duration={1800} />
              <div className="text-xs md:text-sm text-muted-foreground font-body mt-1">Years of Experience</div>
            </div>
            <div className="text-center">
              <CountUpDisplay end={50} className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary font-display" duration={1600} />
              <div className="text-xs md:text-sm text-muted-foreground font-body mt-1">States Served</div>
            </div>
            <div className="text-center">
              <CountUpDisplay end={4.9} suffix="★" decimals={1} className="text-2xl md:text-3xl lg:text-4xl font-bold text-primary font-display" duration={1400} />
              <div className="text-xs md:text-sm text-muted-foreground font-body mt-1">Customer Rating</div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Capabilities Section */}
      <AnimatedSection className="py-12 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-3 md:space-y-4 mb-10 md:mb-16">
            <div className="accent-line-center mb-4 md:mb-6"></div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display">What We Do</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-body">
              Comprehensive business formation and compliance services designed for 
              entrepreneurs who value expertise and reliability.
            </p>
          </div>
          
          <StaggeredGrid className="grid md:grid-cols-3 gap-8" staggerDelay={150}>
            {capabilities.map((capability, index) => (
              <TiltCard key={index} className="border-0 shadow-smooth bg-card" tiltMax={6} scale={1.02}>
                <CardHeader className="space-y-4">
                  <div className="inline-flex p-3 rounded-xl bg-primary/5 text-primary w-fit">
                    {capability.icon}
                  </div>
                  <CardTitle className="text-xl font-display">{capability.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <CardDescription className="text-base font-body leading-relaxed">
                    {capability.description}
                  </CardDescription>
                </CardContent>
              </TiltCard>
            ))}
          </StaggeredGrid>
        </div>
      </AnimatedSection>

      {/* Business Structures Section */}
      <AnimatedSection className="py-12 md:py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-3 md:space-y-4 mb-10 md:mb-16">
            <div className="accent-line-center mb-4 md:mb-6"></div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display">Choose Your Business Structure</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-body">
              From simple to sophisticated, we help you select and form the right entity 
              for your business goals.
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

      {/* Simple Steps Process */}
      <AnimatedSection className="py-12 md:py-24">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-3 md:space-y-4 mb-10 md:mb-16">
            <div className="accent-line-center mb-4 md:mb-6"></div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display">How It Works</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-body">
              A straightforward process designed to get your business legally formed 
              quickly and correctly.
            </p>
          </div>

          <StaggeredGrid className="grid md:grid-cols-2 lg:grid-cols-4 gap-8" staggerDelay={120}>
            {processSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="text-center space-y-4">
                  <div className="text-5xl font-display font-bold text-primary/15">
                    {step.step}
                  </div>
                  <h3 className="text-xl font-semibold font-display -mt-8 relative">{step.title}</h3>
                  <p className="text-muted-foreground font-body">{step.description}</p>
                </div>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-8 -right-4 w-8">
                    <ArrowRight className="h-5 w-5 text-border" />
                  </div>
                )}
              </div>
            ))}
          </StaggeredGrid>
        </div>
      </AnimatedSection>

      {/* Testimonials Section */}
      <AnimatedSection className="py-12 md:py-24 bg-card">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-3 md:space-y-4 mb-10 md:mb-16">
            <div className="accent-line-center mb-4 md:mb-6"></div>
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display">What Our Clients Say</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto font-body">
              Thousands of entrepreneurs trust EZ BIZ to launch their businesses.
            </p>
          </div>

          <StaggeredGrid className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" staggerDelay={120}>
            {[
              {
                name: "Sarah M.",
                role: "LLC Owner, Texas",
                stars: 5,
                quote: "EZ BIZ made forming my LLC incredibly simple. The whole process took less than a week and their team was responsive every step of the way."
              },
              {
                name: "James T.",
                role: "S-Corp Founder, Florida",
                stars: 5,
                quote: "I compared several services before choosing EZ BIZ. Their pricing transparency and expert guidance set them apart. Highly recommend!"
              },
              {
                name: "Maria L.",
                role: "Nonprofit Director, California",
                stars: 5,
                quote: "As a first-time founder, I had so many questions. The free consultation was invaluable and they handled all the paperwork flawlessly."
              },
              {
                name: "David K.",
                role: "C-Corp CEO, Delaware",
                stars: 5,
                quote: "Professional, fast, and accurate. My corporation was formed in 48 hours. The registered agent service gives me peace of mind."
              },
              {
                name: "Priya N.",
                role: "Partnership, New York",
                stars: 4,
                quote: "Great experience overall. The team helped us understand the differences between entity types and choose the right structure for our business."
              },
              {
                name: "Robert W.",
                role: "LLC Owner, Wyoming",
                stars: 5,
                quote: "Second time using EZ BIZ for a new venture. Consistent quality and they remembered my preferences. That's real customer service."
              }
            ].map((testimonial, index) => (
              <TiltCard key={index} className="border-border shadow-smooth" tiltMax={5} scale={1.01}>
                <CardHeader className="pb-2">
                  <div className="flex gap-0.5 mb-2">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < testimonial.stars ? 'text-secondary fill-secondary' : 'text-muted'}`}
                      />
                    ))}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-muted-foreground font-body leading-relaxed italic">
                    "{testimonial.quote}"
                  </p>
                  <div>
                    <div className="font-semibold font-display">{testimonial.name}</div>
                    <div className="text-sm text-muted-foreground font-body">{testimonial.role}</div>
                  </div>
                </CardContent>
              </TiltCard>
            ))}
          </StaggeredGrid>
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
                  Why Entrepreneurs Choose EZ BIZ
                </h2>
                <p className="text-xl text-muted-foreground font-body leading-relaxed">
                  We combine legal expertise with personalized service to ensure your 
                  business formation is handled correctly from day one.
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex gap-4">
                  <div className="flex-shrink-0 p-3 rounded-xl bg-success/10 text-success">
                    <Clock className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg font-display">Fast & Reliable</h3>
                    <p className="text-muted-foreground font-body">
                      Most filings completed within 24-48 hours with our express service.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 p-3 rounded-xl bg-secondary/10 text-secondary">
                    <Shield className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg font-display">100% Satisfaction Guaranteed</h3>
                    <p className="text-muted-foreground font-body">
                      We stand behind our work with a complete satisfaction guarantee.
                    </p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <div className="flex-shrink-0 p-3 rounded-xl bg-primary/10 text-primary">
                    <Users className="h-6 w-6" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg font-display">Expert Support</h3>
                    <p className="text-muted-foreground font-body">
                      Live business formation experts ready to guide you through the process.
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
                <div className="text-sm text-muted-foreground font-body">Average Response Time</div>
              </Card>
              <Card className="p-6 text-center shadow-smooth border-0 bg-gradient-subtle">
                <div className="text-4xl font-bold text-primary font-display mb-2">A+</div>
                <div className="text-sm text-muted-foreground font-body">BBB Rating</div>
              </Card>
              <Card className="p-6 text-center shadow-smooth border-0 bg-gradient-subtle">
                <div className="text-4xl font-bold text-primary font-display mb-2">100%</div>
                <div className="text-sm text-muted-foreground font-body">Accuracy Rate</div>
              </Card>
            </div>
          </div>
        </div>
      </AnimatedSection>

      {/* CTA Section */}
      <section className="py-12 md:py-24 gradient-executive text-primary-foreground">
        <div className="container mx-auto px-4 text-center space-y-6 md:space-y-8">
          <div className="space-y-3 md:space-y-4">
            <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display">
              Ready to Start Your Business?
            </h2>
            <p className="text-base md:text-xl opacity-90 max-w-2xl mx-auto font-body">
              Join thousands of entrepreneurs who trust EZ BIZ FILE SERVICE to handle their 
              business formation. Get started today with our simple, fast, and reliable process.
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                size="lg" 
                className="bg-secondary hover:bg-secondary-light text-secondary-foreground shadow-lg hover:shadow-xl text-base md:text-lg px-6 md:px-8 h-12 md:h-14"
              onClick={() => navigate('/order-now')}
            >
              Form Your Business — Starting at $149
            </Button>
              <Button 
                size="lg" 
                variant="outline"
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-base md:text-lg px-6 md:px-8 h-12 md:h-14"
              onClick={() => navigate('/consultation')}
            >
              Schedule Free Consultation
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Index;
