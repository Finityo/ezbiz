import Navigation from "@/components/Navigation";
import ServiceJsonLd from "@/components/ServiceJsonLd";
import FaqJsonLd from "@/components/FaqJsonLd";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import BackToTop from "@/components/BackToTop";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, X, User, Zap, DollarSign, FileText, Shield, AlertTriangle, TrendingUp, Building2, Scale, BadgeCheck, ArrowRight, HelpCircle } from "lucide-react";
import { Link } from "react-router-dom";

const SoleProprietorship = () => {
  const benefits = [
    {
      title: "Simplest Business Structure",
      description: "No formal registration required with the state in most cases. You can start operating immediately under your own legal name.",
      icon: Zap
    },
    {
      title: "Complete Control",
      description: "You make all business decisions without needing approval from partners, board members, or shareholders.",
      icon: User
    },
    {
      title: "Keep All Profits",
      description: "All business income belongs to you. There are no profit-sharing requirements with partners or dividend distributions to shareholders.",
      icon: DollarSign
    },
    {
      title: "Simple Tax Filing",
      description: "Business income and expenses are reported on Schedule C of your personal tax return (Form 1040). No separate business tax return required.",
      icon: FileText
    },
    {
      title: "Low Startup Costs",
      description: "Minimal fees to get started. No state filing fees for the business entity itself, though you may need local business licenses.",
      icon: TrendingUp
    },
    {
      title: "Easy to Dissolve",
      description: "Simply stop operating. No formal dissolution paperwork or state filings required to close the business.",
      icon: BadgeCheck
    }
  ];

  const drawbacks = [
    {
      title: "Unlimited Personal Liability",
      description: "Your personal assets (home, savings, vehicles) can be seized to pay business debts, lawsuits, or judgments against the business.",
      severity: "high"
    },
    {
      title: "Self-Employment Tax",
      description: "You pay both the employer and employee portions of Social Security and Medicare taxes (15.3% on net earnings up to the Social Security wage base).",
      severity: "medium"
    },
    {
      title: "Difficulty Raising Capital",
      description: "Cannot sell stock or ownership interests. Limited to personal funds, loans, and credit lines for business financing.",
      severity: "medium"
    },
    {
      title: "Limited Business Continuity",
      description: "The business legally ends when you die or become incapacitated. Cannot easily transfer ownership to heirs or successors.",
      severity: "medium"
    },
    {
      title: "Perceived Lack of Credibility",
      description: "Some customers, vendors, and lenders may view sole proprietorships as less established than LLCs or corporations.",
      severity: "low"
    },
    {
      title: "No Separation of Business Credit",
      description: "Business credit history is tied to your personal credit. Business debts affect your personal credit score.",
      severity: "medium"
    }
  ];

  const taxForms = [
    { form: "Schedule C (Form 1040)", purpose: "Report business income and expenses" },
    { form: "Schedule SE (Form 1040)", purpose: "Calculate self-employment tax" },
    { form: "Form 1040-ES", purpose: "Make quarterly estimated tax payments" },
    { form: "Form W-9", purpose: "Provide taxpayer ID to clients who pay you $600+" },
    { form: "Form 1099-NEC", purpose: "Report payments to contractors you pay $600+" }
  ];

  const formationSteps = [
    {
      step: 1,
      title: "Choose Your Business Name",
      description: "You can operate under your legal name or file a DBA (Doing Business As) to use a different business name.",
      timeline: "Same day"
    },
    {
      step: 2,
      title: "Obtain Required Licenses",
      description: "Check with your city, county, and state for required business licenses, permits, and zoning approvals.",
      timeline: "1-4 weeks"
    },
    {
      step: 3,
      title: "Get an EIN (Optional but Recommended)",
      description: "Apply for a free Employer Identification Number from the IRS. Required if you have employees or want to open a business bank account.",
      timeline: "Immediate online"
    },
    {
      step: 4,
      title: "Open a Business Bank Account",
      description: "Keep business and personal finances separate for easier bookkeeping and tax preparation.",
      timeline: "Same day"
    },
    {
      step: 5,
      title: "Set Up Bookkeeping",
      description: "Track all income and expenses for tax reporting. Consider accounting software or a professional bookkeeper.",
      timeline: "Ongoing"
    }
  ];

  const idealFor = [
    "Freelancers and consultants",
    "Home-based businesses with low liability",
    "Part-time or side businesses",
    "Testing a business idea before formal incorporation",
    "Service providers with minimal equipment",
    "Artists, writers, and creative professionals"
  ];

  const notIdealFor = [
    "Businesses with significant liability exposure",
    "Companies seeking outside investors",
    "Businesses with multiple owners",
    "Industries with high lawsuit risk",
    "Businesses planning rapid growth",
    "Those wanting to build separate business credit"
  ];

  const faqs = [
    {
      question: "Do I need to register my sole proprietorship with the state?",
      answer: "In most states, no formal registration is required to operate as a sole proprietorship under your legal name. However, if you want to use a business name different from your personal name, you will need to file a DBA (Doing Business As) or fictitious business name registration with your county or state. Additionally, you may need local business licenses regardless of your business name."
    },
    {
      question: "What is the difference between a sole proprietorship and an LLC?",
      answer: "The main difference is liability protection. In a sole proprietorship, you and the business are legally the same entity—your personal assets are at risk for business debts. An LLC creates a separate legal entity that protects your personal assets from business liabilities (with some exceptions). LLCs also require state registration and annual fees, while sole proprietorships have minimal formal requirements."
    },
    {
      question: "How are sole proprietorship taxes calculated?",
      answer: "Your business profit (income minus expenses) is reported on Schedule C and flows through to your personal Form 1040. You pay income tax at your personal tax rate plus self-employment tax of 15.3% (12.4% Social Security + 2.9% Medicare) on net earnings. You can deduct half of self-employment tax as an adjustment to income. Quarterly estimated tax payments are typically required."
    },
    {
      question: "Can I hire employees as a sole proprietor?",
      answer: "Yes, sole proprietors can hire employees. You will need to obtain an EIN from the IRS, register for state employer taxes, withhold payroll taxes, and comply with employment laws. Many sole proprietors also hire independent contractors, which has fewer requirements but must be properly classified according to IRS guidelines."
    },
    {
      question: "Should I get business insurance as a sole proprietor?",
      answer: "Business insurance is highly recommended since you have unlimited personal liability. General liability insurance protects against customer injuries and property damage. Professional liability (errors & omissions) insurance is important for service providers. You may also need commercial auto insurance if using vehicles for business. Insurance costs vary by industry and coverage level."
    },
    {
      question: "Can I convert my sole proprietorship to an LLC or corporation later?",
      answer: "Yes, you can convert to an LLC or corporation at any time. The process involves forming the new entity with your state, transferring assets and contracts, obtaining new licenses, and updating bank accounts. Tax implications vary—consult a tax professional. Many entrepreneurs start as sole proprietors and convert when their business grows or liability concerns increase."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <ServiceJsonLd serviceName="Sole Proprietorship Registration" description="Start your sole proprietorship with expert guidance. The simplest business structure for solo entrepreneurs." url="/sole-proprietorship" />
      <FaqJsonLd faqs={faqs} />
      <Navigation />
      <FloatingCTA />
      <BackToTop />
      
      <main>
        {/* Hero Section */}
        <section className="gradient-hero text-primary-foreground py-20 lg:py-28 relative overflow-hidden pattern-geometric">
          <div className="absolute inset-0 pattern-dots opacity-30"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <User className="h-4 w-4" />
                <span className="text-sm font-medium">Simplest Business Structure</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Sole Proprietorship
              </h1>
              <p className="text-xl md:text-2xl mb-4 text-primary-foreground/90">
                The fastest, simplest way to start your business as a single owner
              </p>
              <p className="text-lg mb-8 text-primary-foreground/80 max-w-2xl mx-auto">
                Over 23 million Americans operate as sole proprietors, making it the most common business structure in the United States.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
                  <Link to="/order-flow">
                    Start Your Business <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground/30 text-primary-foreground hover:bg-white/10" asChild>
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
                What Is a Sole Proprietorship?
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                <p>
                  A <strong className="text-foreground">sole proprietorship</strong> is an unincorporated business owned and operated by a single individual. It is the simplest and most common form of business organization in the United States, with no legal distinction between the owner and the business entity.
                </p>
                <p>
                  According to the <a href="https://www.irs.gov" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">Internal Revenue Service (IRS)</a>, a sole proprietorship is automatically created when you start conducting business activities as an individual. There is no need to file formation documents with the state (though local licenses may be required).
                </p>
                <p>
                  Because the business has no separate legal existence, you report all business income and expenses on your personal tax return. You are also personally responsible for all debts, obligations, and liabilities of the business.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                <Card className="text-center border-border/50">
                  <CardHeader>
                    <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <User className="h-6 w-6 text-secondary" />
                    </div>
                    <CardTitle className="text-lg">Single Owner</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>One person owns and controls the entire business</CardDescription>
                  </CardContent>
                </Card>
                
                <Card className="text-center border-border/50">
                  <CardHeader>
                    <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Scale className="h-6 w-6 text-secondary" />
                    </div>
                    <CardTitle className="text-lg">No Legal Separation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>You and your business are legally the same entity</CardDescription>
                  </CardContent>
                </Card>
                
                <Card className="text-center border-border/50">
                  <CardHeader>
                    <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <FileText className="h-6 w-6 text-secondary" />
                    </div>
                    <CardTitle className="text-lg">Pass-Through Taxation</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>All income passes through to your personal tax return</CardDescription>
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
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Benefits of a Sole Proprietorship</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Understand the advantages that make sole proprietorship the go-to choice for millions of business owners
                </p>
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

        {/* Drawbacks Section */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Potential Drawbacks to Consider</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Every business structure has trade-offs. Here are the limitations you should understand before choosing a sole proprietorship.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {drawbacks.map((drawback, index) => (
                  <Card key={index} className={`border-l-4 ${
                    drawback.severity === 'high' ? 'border-l-destructive' :
                    drawback.severity === 'medium' ? 'border-l-warning' :
                    'border-l-muted-foreground'
                  }`}>
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          drawback.severity === 'high' ? 'bg-destructive/10' :
                          drawback.severity === 'medium' ? 'bg-warning/10' :
                          'bg-muted'
                        }`}>
                          <AlertTriangle className={`h-5 w-5 ${
                            drawback.severity === 'high' ? 'text-destructive' :
                            drawback.severity === 'medium' ? 'text-warning' :
                            'text-muted-foreground'
                          }`} />
                        </div>
                        <div>
                          <CardTitle className="text-lg mb-2">{drawback.title}</CardTitle>
                          <CardDescription className="text-sm leading-relaxed">{drawback.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
              
              <div className="mt-8 p-6 bg-primary/5 rounded-xl border border-primary/10">
                <div className="flex items-start gap-4">
                  <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Consider Liability Protection</h4>
                    <p className="text-muted-foreground text-sm">
                      If unlimited personal liability is a concern, consider forming an <Link to="/form-llc" className="text-secondary hover:underline font-medium">LLC</Link> instead. 
                      An LLC provides personal asset protection while maintaining tax simplicity similar to a sole proprietorship.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tax Implications Section */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Tax Implications</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Understanding how sole proprietorship taxes work according to IRS guidelines
                </p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-secondary" />
                    How You Are Taxed
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-card rounded-lg border border-border/50">
                      <h4 className="font-medium text-foreground mb-2">Income Tax</h4>
                      <p className="text-sm text-muted-foreground">
                        Business profits are taxed at your personal income tax rate (10% to 37% for 2024). 
                        Profits flow through to your Form 1040 via Schedule C.
                      </p>
                    </div>
                    <div className="p-4 bg-card rounded-lg border border-border/50">
                      <h4 className="font-medium text-foreground mb-2">Self-Employment Tax</h4>
                      <p className="text-sm text-muted-foreground">
                        You pay 15.3% self-employment tax on net earnings (12.4% Social Security up to $168,600 in 2024, plus 2.9% Medicare on all earnings). 
                        An additional 0.9% Medicare tax applies to earnings over $200,000 ($250,000 if married filing jointly).
                      </p>
                    </div>
                    <div className="p-4 bg-card rounded-lg border border-border/50">
                      <h4 className="font-medium text-foreground mb-2">Quarterly Estimated Taxes</h4>
                      <p className="text-sm text-muted-foreground">
                        If you expect to owe $1,000 or more in taxes, you must make quarterly estimated tax payments 
                        (due April 15, June 15, September 15, and January 15).
                      </p>
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <FileText className="h-5 w-5 text-secondary" />
                    Required Tax Forms
                  </h3>
                  <Card className="border-border/50">
                    <CardContent className="p-0">
                      <div className="divide-y divide-border/50">
                        {taxForms.map((item, index) => (
                          <div key={index} className="p-4 flex items-start gap-4">
                            <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center flex-shrink-0">
                              <span className="text-xs font-semibold text-primary">{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-medium text-foreground text-sm">{item.form}</p>
                              <p className="text-sm text-muted-foreground">{item.purpose}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                  <p className="text-xs text-muted-foreground mt-4">
                    Source: <a href="https://www.irs.gov/businesses/small-businesses-self-employed/sole-proprietorships" target="_blank" rel="noopener noreferrer" className="text-secondary hover:underline">IRS Sole Proprietorships Guide</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Liability Section */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Liability & Asset Protection</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Understanding your personal exposure as a sole proprietor
                </p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <Card className="border-destructive/30 bg-destructive/5">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-destructive/10 rounded-lg flex items-center justify-center">
                        <X className="h-5 w-5 text-destructive" />
                      </div>
                      <CardTitle className="text-xl">No Personal Asset Protection</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      As a sole proprietor, you have <strong className="text-foreground">unlimited personal liability</strong>. 
                      This means creditors can pursue your personal assets to satisfy business debts, including:
                    </p>
                    <ul className="space-y-2">
                      {["Personal bank accounts and savings", "Your home and real estate", "Personal vehicles", "Investment accounts", "Other personal property"].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <X className="h-4 w-4 text-destructive flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="border-success/30 bg-success/5">
                  <CardHeader>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center">
                        <Shield className="h-5 w-5 text-success" />
                      </div>
                      <CardTitle className="text-xl">How to Mitigate Risk</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <p className="text-muted-foreground">
                      While you cannot eliminate liability as a sole proprietor, you can reduce your exposure:
                    </p>
                    <ul className="space-y-2">
                      {[
                        "Obtain general liability insurance",
                        "Get professional liability (E&O) insurance",
                        "Use contracts with liability limitations",
                        "Keep adequate business reserves",
                        "Consider converting to an LLC as you grow"
                      ].map((item, i) => (
                        <li key={i} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <Check className="h-4 w-4 text-success flex-shrink-0" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Who Should Choose Section */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Is a Sole Proprietorship Right for You?</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Evaluate whether this structure aligns with your business goals and risk tolerance
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-success/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-success">
                      <Check className="h-5 w-5" />
                      Ideal For
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {idealFor.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <Check className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="border-destructive/30">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                      <X className="h-5 w-5" />
                      Not Ideal For
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {notIdealFor.map((item, index) => (
                        <li key={index} className="flex items-start gap-3">
                          <X className="h-4 w-4 text-destructive mt-1 flex-shrink-0" />
                          <span className="text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Formation Requirements Section */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">How to Start a Sole Proprietorship</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Follow these steps to establish your sole proprietorship the right way
                </p>
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
              
              <div className="mt-12 text-center">
                <p className="text-muted-foreground mb-6">
                  Need help getting started? We can guide you through the process.
                </p>
                <Button size="lg" className="px-8" asChild>
                  <Link to="/order-flow">
                    Start Your Sole Proprietorship <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table Section */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Compare Business Structures</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  See how a sole proprietorship compares to other common business structures
                </p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full bg-card rounded-xl border border-border/50 overflow-hidden">
                  <thead>
                    <tr className="bg-primary text-primary-foreground">
                      <th className="px-6 py-4 text-left font-semibold">Feature</th>
                      <th className="px-6 py-4 text-center font-semibold">Sole Proprietorship</th>
                      <th className="px-6 py-4 text-center font-semibold">LLC</th>
                      <th className="px-6 py-4 text-center font-semibold">S Corporation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr>
                      <td className="px-6 py-4 font-medium">Formation Complexity</td>
                      <td className="px-6 py-4 text-center text-success">Simple</td>
                      <td className="px-6 py-4 text-center text-warning">Moderate</td>
                      <td className="px-6 py-4 text-center text-destructive">Complex</td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="px-6 py-4 font-medium">Personal Liability Protection</td>
                      <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-destructive mx-auto" /></td>
                      <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-success mx-auto" /></td>
                      <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-success mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">State Filing Required</td>
                      <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-success mx-auto" /></td>
                      <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-warning mx-auto" /></td>
                      <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-warning mx-auto" /></td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="px-6 py-4 font-medium">Separate Tax Return</td>
                      <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-success mx-auto" /></td>
                      <td className="px-6 py-4 text-center text-muted-foreground text-sm">Optional</td>
                      <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-warning mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">Self-Employment Tax</td>
                      <td className="px-6 py-4 text-center text-destructive">Full (15.3%)</td>
                      <td className="px-6 py-4 text-center text-destructive">Full (15.3%)</td>
                      <td className="px-6 py-4 text-center text-success">Reduced</td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="px-6 py-4 font-medium">Startup Cost</td>
                      <td className="px-6 py-4 text-center text-success">$0 - $100</td>
                      <td className="px-6 py-4 text-center text-warning">$50 - $500</td>
                      <td className="px-6 py-4 text-center text-destructive">$100 - $800</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">Annual Compliance</td>
                      <td className="px-6 py-4 text-center text-success">Minimal</td>
                      <td className="px-6 py-4 text-center text-warning">Moderate</td>
                      <td className="px-6 py-4 text-center text-destructive">Significant</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button variant="outline" asChild>
                  <Link to="/form-llc">Learn About LLCs</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/s-corporation">Learn About S Corps</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/dba">Learn About DBAs</Link>
                </Button>
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
                <p className="text-lg text-muted-foreground">
                  Get answers to common questions about sole proprietorships
                </p>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Start Your Business?</h2>
              <p className="text-xl text-primary-foreground/90 mb-8">
                Get expert guidance on starting your sole proprietorship. We will help you understand your options and set up your business correctly.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
                  <Link to="/order-flow">
                    Get Started Today <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground/30 text-primary-foreground hover:bg-white/10" asChild>
                  <Link to="/consultation">Schedule Free Consultation</Link>
                </Button>
              </div>
              <p className="mt-6 text-sm text-primary-foreground/70">
                No obligation. Speak with a business formation specialist.
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default SoleProprietorship;
