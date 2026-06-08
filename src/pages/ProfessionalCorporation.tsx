import SEOHead from "@/components/SEOHead";
import Navigation from "@/components/Navigation";
import ServiceJsonLd from "@/components/ServiceJsonLd";
import FaqJsonLd from "@/components/FaqJsonLd";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, X, Shield, Users, FileText, Scale, AlertTriangle, ArrowRight, HelpCircle, Briefcase, Award, Building } from "lucide-react";
import { Link } from "react-router-dom";
import { trackClick } from "@/hooks/useAnalytics";

const ProfessionalCorporation = () => {
  const professions = [
    { name: "Physicians & Surgeons", icon: "🩺" },
    { name: "Attorneys & Lawyers", icon: "⚖️" },
    { name: "Certified Public Accountants", icon: "📊" },
    { name: "Architects", icon: "🏛️" },
    { name: "Engineers", icon: "⚙️" },
    { name: "Dentists", icon: "🦷" },
    { name: "Veterinarians", icon: "🐾" },
    { name: "Chiropractors", icon: "🦴" },
    { name: "Psychologists & Therapists", icon: "🧠" },
    { name: "Optometrists", icon: "👁️" }
  ];

  const benefits = [
    {
      title: "Limited Liability for Business Debts",
      description: "Shareholders are protected from business debts, lease obligations, and general corporate liabilities.",
      icon: Shield
    },
    {
      title: "Professional Credibility",
      description: "The PC or PLLC designation signals legitimacy and professionalism to clients and referral sources.",
      icon: Award
    },
    {
      title: "Tax Flexibility",
      description: "Can elect to be taxed as an S Corporation to reduce self-employment taxes on professional income.",
      icon: FileText
    },
    {
      title: "Multiple Professionals",
      description: "Allows multiple licensed professionals to practice together as shareholders of the same entity.",
      icon: Users
    },
    {
      title: "Perpetual Existence",
      description: "The corporation continues even if a shareholder retires, dies, or leaves the practice.",
      icon: Building
    },
    {
      title: "Retirement Plan Options",
      description: "Access to corporate retirement plans, profit sharing, and other tax-advantaged benefits.",
      icon: Briefcase
    }
  ];

  const drawbacks = [
    {
      title: "No Protection from Malpractice",
      description: "You remain personally liable for your own professional negligence and malpractice. The corporate shield does not protect against personal professional errors.",
      severity: "high"
    },
    {
      title: "Ownership Restrictions",
      description: "All shareholders must be licensed professionals in the same field. Cannot have outside investors or non-licensed owners.",
      severity: "high"
    },
    {
      title: "Regulatory Approval Required",
      description: "Many states require approval from the relevant licensing board (medical board, bar association, etc.) before formation.",
      severity: "medium"
    },
    {
      title: "Annual Compliance",
      description: "Must maintain professional licenses, file annual reports, and meet ongoing state requirements.",
      severity: "low"
    }
  ];

  const liabilityExplained = [
    {
      protected: true,
      item: "Business debts and contracts",
      description: "Personal assets protected from office leases, equipment loans, vendor debts"
    },
    {
      protected: true,
      item: "Other shareholders' malpractice",
      description: "Not liable for professional errors made by your partners or employees"
    },
    {
      protected: true,
      item: "Employee actions (non-professional)",
      description: "Protected from liability for administrative staff's general negligence"
    },
    {
      protected: false,
      item: "Your own malpractice",
      description: "Personally liable for your own professional errors and negligence"
    },
    {
      protected: false,
      item: "Direct supervision failures",
      description: "Liable for malpractice by those you directly supervise"
    }
  ];

  const formationSteps = [
    {
      step: 1,
      title: "Verify Professional Eligibility",
      description: "Confirm your profession qualifies for PC/PLLC status in your state and all shareholders hold required licenses.",
      timeline: "Day 1"
    },
    {
      step: 2,
      title: "Check Licensing Board Requirements",
      description: "Some states require pre-approval from your professional licensing board before formation.",
      timeline: "1-4 weeks"
    },
    {
      step: 3,
      title: "Choose Entity Type",
      description: "Decide between Professional Corporation (PC) or Professional LLC (PLLC) based on your state and preferences.",
      timeline: "Day 1"
    },
    {
      step: 4,
      title: "File Formation Documents",
      description: "Submit Articles of Incorporation (PC) or Articles of Organization (PLLC) with required professional designations.",
      timeline: "1-2 weeks"
    },
    {
      step: 5,
      title: "Obtain Professional Registration",
      description: "Register the entity with your professional licensing board and obtain any required certificates.",
      timeline: "2-4 weeks"
    },
    {
      step: 6,
      title: "Create Governing Documents",
      description: "Draft bylaws (PC) or operating agreement (PLLC) addressing professional practice issues.",
      timeline: "1-2 weeks"
    },
    {
      step: 7,
      title: "Obtain Malpractice Insurance",
      description: "Secure professional liability insurance—often required and always recommended.",
      timeline: "1-2 weeks"
    }
  ];

  const pcVsPllc = {
    pc: [
      "More formal structure with directors and officers",
      "Traditional corporate governance",
      "May be required for certain professions in some states",
      "Can elect S-Corp tax status"
    ],
    pllc: [
      "Simpler management structure",
      "Fewer formalities required",
      "More flexibility in profit distribution",
      "Default pass-through taxation"
    ]
  };

  const faqs = [
    {
      question: "What is the difference between a Professional Corporation and a regular corporation?",
      answer: "A Professional Corporation (PC) is specifically designed for licensed professionals like doctors, lawyers, and accountants. The key differences are: (1) All shareholders must be licensed professionals in the same field, (2) The corporate shield does not protect against personal malpractice, (3) May require approval from licensing boards, (4) Uses special designations like 'PC,' 'P.C.,' or 'Professional Corporation.' Regular corporations have no such restrictions on owners or activities."
    },
    {
      question: "Should I choose a Professional Corporation or Professional LLC?",
      answer: "Both provide similar liability protection and tax benefits. Choose a PC if: your state requires it for your profession, you prefer traditional corporate structure, or your licensing board mandates it. Choose a PLLC if: your state allows it, you prefer simpler management, or you want more flexibility. Some states only allow one or the other for certain professions, so check your state's rules first."
    },
    {
      question: "Does a Professional Corporation protect me from malpractice claims?",
      answer: "No. This is a critical distinction. A PC protects your personal assets from general business liabilities (debts, leases, contracts) and from other shareholders' malpractice. However, you remain personally liable for your own professional negligence and malpractice. You also may be liable for malpractice by those you directly supervise. This is why professional liability insurance is essential."
    },
    {
      question: "Can non-professionals work for a Professional Corporation?",
      answer: "Yes, a PC can hire non-licensed employees for administrative, support, and operational roles. However, only licensed professionals can be shareholders (owners) of the corporation. This means your receptionist, billing staff, and office manager can be employees, but they cannot own shares in the PC."
    },
    {
      question: "What happens if a shareholder loses their professional license?",
      answer: "If a shareholder loses their professional license (through suspension, revocation, or failure to renew), they typically must divest their shares within a specified timeframe—often 90 days. Your governing documents should address this scenario, including how shares are valued and purchased. Failure to address this can result in the corporation losing its professional status."
    },
    {
      question: "Can I convert my existing practice to a Professional Corporation?",
      answer: "Yes, existing sole proprietorships, partnerships, or general professional practices can be converted to a PC or PLLC. The process involves: (1) Forming the new entity, (2) Transferring assets and contracts, (3) Updating licenses and registrations, (4) Notifying clients and insurers. Consider tax implications and consult with a CPA before converting."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Professional Corporation Formation" description="Form your Professional Corporation for licensed professionals. Liability protection for doctors, lawyers, accountants, and more." path="/professional-corporation" />
      <ServiceJsonLd serviceName="Professional Corporation Formation" description="Form your Professional Corporation for licensed professionals. Liability protection for doctors, lawyers, accountants, and more." url="/professional-corporation" />
      <FaqJsonLd faqs={faqs} />
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section className="gradient-hero text-primary-foreground py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Award className="h-4 w-4" />
                <span className="text-sm font-medium">For Licensed Professionals</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Professional Corporation Formation
              </h1>
              <p className="text-xl md:text-2xl mb-4 text-primary-foreground/90">
                Specialized corporate structure for licensed professionals
              </p>
              <p className="text-lg mb-8 text-primary-foreground/80 max-w-2xl mx-auto">
                Doctors, lawyers, accountants, architects, and other licensed professionals can protect their personal assets while maintaining their professional practice.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
                  <Link to="/order-flow">
                    Form Your PC <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground/30 text-primary-foreground hover:bg-white/10" asChild onClick={() => trackClick('Free Consultation', 'professional_corp_hero_cta', '/consultation')}>
                  <Link to="/consultation">Free Consultation</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* What Is Section */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="accent-line-center mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">
                What Is a Professional Corporation?
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                <p>
                  A <strong className="text-foreground">Professional Corporation (PC)</strong> is a special type of corporation designed for licensed professionals who provide personal services requiring a state license. Also known as a Professional Service Corporation (PSC) in some states.
                </p>
                <p>
                  Unlike regular corporations, PCs have specific requirements: all shareholders must be licensed professionals in the same field, and the corporation can only provide services within that professional scope. Many states also offer the <strong className="text-foreground">Professional Limited Liability Company (PLLC)</strong> as an alternative.
                </p>
                <p>
                  <strong className="text-foreground">Important:</strong> While a PC protects personal assets from general business liabilities, it does NOT protect you from liability for your own professional malpractice. Professional liability insurance remains essential.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Who Can Form Section */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Who Can Form a Professional Corporation?</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  PCs are available to state-licensed professionals including:
                </p>
              </div>
              
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
                {professions.map((profession, index) => (
                  <Card key={index} className="text-center border-border/50 hover:shadow-elegant transition-smooth">
                    <CardContent className="pt-6">
                      <div className="text-3xl mb-2">{profession.icon}</div>
                      <p className="text-sm font-medium">{profession.name}</p>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <p className="text-sm text-muted-foreground text-center mt-6">
                Eligible professions vary by state. Contact us to verify your profession qualifies in your state.
              </p>
            </div>
          </div>
        </section>

        {/* Liability Explained Section */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Understanding Liability Protection</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Know exactly what a Professional Corporation protects and what it does not
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-success/30 bg-success/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-success">
                      <Shield className="h-5 w-5" />
                      Protected From
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {liabilityExplained.filter(item => item.protected).map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-foreground">{item.item}</p>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="border-destructive/30 bg-destructive/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                      <AlertTriangle className="h-5 w-5" />
                      NOT Protected From
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {liabilityExplained.filter(item => !item.protected).map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <X className="h-5 w-5 text-destructive mt-0.5 flex-shrink-0" />
                          <div>
                            <p className="font-medium text-foreground">{item.item}</p>
                            <p className="text-sm text-muted-foreground">{item.description}</p>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-4 p-3 bg-destructive/10 rounded-lg">
                      <p className="text-sm font-medium text-destructive">
                        Professional liability (malpractice) insurance is essential!
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Benefits of Professional Corporations</h2>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {benefits.map((benefit, index) => (
                  <Card key={index} className="border-border/50 hover:shadow-elegant transition-smooth">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <benefit.icon className="h-5 w-5 text-success" />
                        </div>
                        <div>
                          <CardTitle className="text-lg mb-2">{benefit.title}</CardTitle>
                          <CardDescription className="text-sm leading-relaxed">{benefit.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* PC vs PLLC */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Professional Corporation vs. Professional LLC</h2>
                <p className="text-lg text-muted-foreground">
                  Both structures serve similar purposes but have different characteristics
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-primary/30">
                  <CardHeader>
                    <CardTitle className="text-xl">Professional Corporation (PC)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {pcVsPllc.pc.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-primary mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="border-secondary/30">
                  <CardHeader>
                    <CardTitle className="text-xl">Professional LLC (PLLC)</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {pcVsPllc.pllc.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
              
              <p className="text-sm text-muted-foreground text-center mt-6">
                Note: Not all states allow PLLCs for all professions. Some licensing boards only permit PCs.
              </p>
            </div>
          </div>
        </section>

        {/* Formation Steps */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">How to Form a Professional Corporation</h2>
              </div>
              
              <div className="space-y-6">
                {formationSteps.map((step, index) => (
                  <div key={index} className="flex gap-6 items-start">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">
                      {step.step}
                    </div>
                    <Card className="flex-1 border-border/50">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{step.title}</CardTitle>
                          <span className="text-xs bg-secondary/10 text-secondary px-3 py-1 rounded-full font-medium">
                            {step.timeline}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{step.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
              </div>
              
              <Accordion type="single" collapsible className="space-y-4">
                {faqs.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="bg-card border border-border/50 rounded-lg px-6">
                    <AccordionTrigger className="text-left hover:no-underline py-6">
                      <span className="flex items-start gap-3 pr-4">
                        <HelpCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" />
                        <span className="font-medium">{faq.question}</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6 pl-8 text-muted-foreground leading-relaxed">
                      {faq.answer}
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 lg:py-20 gradient-hero text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Protect Your Professional Practice</h2>
              <p className="text-xl text-primary-foreground/90 mb-8">
                Get the liability protection and professional credibility your practice deserves. We understand the unique requirements for licensed professionals.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
                  <Link to="/order-flow">
                    Form Your Professional Corporation <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground/30 text-primary-foreground hover:bg-white/10" asChild onClick={() => trackClick('Schedule Free Consultation', 'professional_corp_bottom_cta', '/consultation')}>
                  <Link to="/consultation">Schedule Free Consultation</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProfessionalCorporation;
