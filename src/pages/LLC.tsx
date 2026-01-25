import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import RelatedStructures from "@/components/RelatedStructures";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, X, Shield, DollarSign, Users, FileText, Building, AlertTriangle, TrendingUp, ArrowRight, HelpCircle, Scale, BadgeCheck } from "lucide-react";
import { Link } from "react-router-dom";

const LLC = () => {
  const benefits = [
    {
      title: "Limited Liability Protection",
      description: "Your personal assets (home, savings, vehicles) are protected from business debts and lawsuits against the company.",
      icon: Shield
    },
    {
      title: "Tax Flexibility",
      description: "Choose how you want to be taxed: as a sole proprietorship, partnership, S-Corp, or C-Corp depending on your situation.",
      icon: DollarSign
    },
    {
      title: "Simple Management",
      description: "Fewer formalities than corporations. No required board meetings, minutes, or complex record-keeping requirements.",
      icon: FileText
    },
    {
      title: "Business Credibility",
      description: "Adding 'LLC' to your business name establishes credibility with customers, vendors, and financial institutions.",
      icon: Building
    },
    {
      title: "Flexible Ownership",
      description: "No restrictions on the number or type of members. Individuals, corporations, other LLCs, and foreign nationals can be members.",
      icon: Users
    },
    {
      title: "Pass-Through Taxation",
      description: "By default, LLC profits pass through to members' personal tax returns, avoiding double taxation.",
      icon: TrendingUp
    }
  ];

  const drawbacks = [
    {
      title: "State Filing Fees",
      description: "Unlike sole proprietorships, LLCs require state registration with filing fees that vary by state ($50 to $500+).",
      severity: "low"
    },
    {
      title: "Annual Requirements",
      description: "Most states require annual reports and fees to maintain LLC status, adding ongoing costs and administrative tasks.",
      severity: "medium"
    },
    {
      title: "Self-Employment Tax",
      description: "By default, all LLC profits are subject to self-employment tax (15.3%), though S-Corp election can reduce this.",
      severity: "medium"
    },
    {
      title: "Limited Life in Some States",
      description: "Some states require dissolution when a member leaves, though this can be addressed in the operating agreement.",
      severity: "low"
    }
  ];

  const taxOptions = [
    {
      election: "Default (Disregarded Entity / Partnership)",
      description: "Single-member LLCs are taxed like sole proprietorships; multi-member LLCs like partnerships. Profits pass through to personal returns.",
      bestFor: "Most small businesses wanting simplicity"
    },
    {
      election: "S Corporation Election",
      description: "File Form 2553 to be taxed as an S-Corp. Can reduce self-employment tax by paying reasonable salary and taking remaining profits as distributions.",
      bestFor: "Profitable businesses with $50K+ net income"
    },
    {
      election: "C Corporation Election",
      description: "File Form 8832 to be taxed as a C-Corp. Subject to corporate income tax and potential double taxation on dividends.",
      bestFor: "Businesses planning to reinvest all profits or seek venture capital"
    }
  ];

  const formationSteps = [
    {
      step: 1,
      title: "Choose Your State",
      description: "Decide where to form your LLC. Most businesses form in their home state, though Delaware, Nevada, and Wyoming offer benefits for some.",
      timeline: "Day 1"
    },
    {
      step: 2,
      title: "Name Your LLC",
      description: "Choose a unique name that includes 'LLC' or 'Limited Liability Company' and check availability with your state.",
      timeline: "1-2 days"
    },
    {
      step: 3,
      title: "Appoint a Registered Agent",
      description: "Designate a person or service to receive legal documents on behalf of your LLC. Required in all states.",
      timeline: "Same day"
    },
    {
      step: 4,
      title: "File Articles of Organization",
      description: "Submit formation documents to your state's Secretary of State office, along with the required filing fee.",
      timeline: "1-4 weeks"
    },
    {
      step: 5,
      title: "Create an Operating Agreement",
      description: "Draft a document outlining ownership, management, profit sharing, and member responsibilities.",
      timeline: "1-2 weeks"
    },
    {
      step: 6,
      title: "Obtain an EIN",
      description: "Apply for a free Employer Identification Number from the IRS for tax filing and opening a business bank account.",
      timeline: "Immediate"
    }
  ];

  const idealFor = [
    "Small to medium-sized businesses seeking liability protection",
    "Real estate investors protecting rental properties",
    "Freelancers and consultants with liability exposure",
    "E-commerce businesses and online sellers",
    "Businesses with multiple owners needing flexibility",
    "Startups not planning to seek venture capital"
  ];

  const notIdealFor = [
    "Businesses planning to go public (IPO)",
    "Startups seeking venture capital (VCs prefer C-Corps)",
    "Very simple, low-risk side businesses",
    "Professionals in states requiring Professional LLCs (PLLCs)"
  ];

  const faqs = [
    {
      question: "What is the difference between an LLC and a corporation?",
      answer: "The main differences are management structure and tax treatment. Corporations have a formal structure with shareholders, directors, and officers, plus required meetings and minutes. LLCs are more flexible with member-managed or manager-managed options and no required formalities. Tax-wise, C-Corporations face potential double taxation, while LLCs default to pass-through taxation. S-Corporations and LLCs with S-Corp election both avoid double taxation."
    },
    {
      question: "How much does it cost to form an LLC?",
      answer: "Costs vary by state. State filing fees range from $50 (Colorado, Iowa) to $500+ (Massachusetts, California). Additional costs may include: registered agent service ($100-300/year), operating agreement drafting ($0-500), EIN (free from IRS), and business licenses (varies). Ongoing costs include annual report fees ($0-800 depending on state) and franchise taxes in some states."
    },
    {
      question: "Can a single person form an LLC?",
      answer: "Yes, single-member LLCs are very common and provide liability protection for solo business owners. A single-member LLC is taxed as a 'disregarded entity' by default—meaning you report business income on Schedule C of your personal tax return, similar to a sole proprietorship, but with liability protection. You can also elect S-Corp or C-Corp taxation if beneficial."
    },
    {
      question: "Do I need an operating agreement?",
      answer: "While not required in all states, an operating agreement is strongly recommended. It documents: ownership percentages, profit/loss distribution, member roles and responsibilities, voting rights and procedures, what happens if a member leaves, and dissolution procedures. Without one, state default rules apply, which may not match your intentions. Banks often require one to open a business account."
    },
    {
      question: "What is a registered agent and do I need one?",
      answer: "A registered agent is a person or service designated to receive legal documents (lawsuits, subpoenas) and official correspondence on behalf of your LLC. Every state requires LLCs to have a registered agent with a physical address in the state of formation. You can be your own registered agent, but many businesses use professional services for privacy and reliability."
    },
    {
      question: "Should I form my LLC in Delaware, Nevada, or Wyoming?",
      answer: "For most small businesses, forming in your home state is best. Delaware, Nevada, and Wyoming are popular for their business-friendly laws, but if you operate in another state, you will need to register as a 'foreign LLC' there anyway, paying fees in both states. These states make sense for: large companies with complex structures, businesses prioritizing privacy, or those with operations in multiple states."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <FloatingCTA text="Form Your LLC" />
      
      <main>
        {/* Hero Section */}
        <section className="gradient-hero text-primary-foreground py-20 lg:py-28 relative overflow-hidden pattern-geometric">
          <div className="absolute inset-0 pattern-dots opacity-30"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-6 bg-white/20 text-primary-foreground hover:bg-white/30">
                Most Popular Business Structure
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Form Your LLC Today
              </h1>
              <p className="text-xl md:text-2xl mb-4 text-primary-foreground/90">
                Limited Liability Company — the perfect blend of protection and simplicity
              </p>
              <p className="text-lg mb-8 text-primary-foreground/80 max-w-2xl mx-auto">
                LLCs are the most popular business structure in America, offering liability protection, tax flexibility, and simple management requirements.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
                  <Link to="/order">
                    Start Your LLC - $149 <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground/30 text-primary-foreground hover:bg-white/10" asChild>
                  <Link to="/consultation">Free LLC Guide</Link>
                </Button>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-primary-foreground/80">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <span>Fast 24-48 Hour Filing</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <span>All 50 States</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <span>100% Satisfaction Guaranteed</span>
                </div>
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
                What Is an LLC?
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                <p>
                  A <strong className="text-foreground">Limited Liability Company (LLC)</strong> is a business structure that combines the liability protection of a corporation with the simplicity and tax benefits of a sole proprietorship or partnership. LLCs are formed under state law and are recognized in all 50 states.
                </p>
                <p>
                  The key feature of an LLC is <strong className="text-foreground">limited liability protection</strong>. This means that the LLC is a separate legal entity from its owners (called "members"), and members' personal assets are generally protected from business debts and lawsuits against the company.
                </p>
                <p>
                  LLCs are "pass-through" entities for tax purposes by default, meaning business income passes through to members' personal tax returns and is taxed only once. However, LLCs can also elect to be taxed as S-Corporations or C-Corporations if that provides tax advantages.
                </p>
              </div>
              
              <div className="grid md:grid-cols-3 gap-6 mt-12">
                <Card className="text-center border-border/50">
                  <CardHeader>
                    <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Shield className="h-6 w-6 text-secondary" />
                    </div>
                    <CardTitle className="text-lg">Liability Shield</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>Personal assets protected from business debts and legal claims</CardDescription>
                  </CardContent>
                </Card>
                
                <Card className="text-center border-border/50">
                  <CardHeader>
                    <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Scale className="h-6 w-6 text-secondary" />
                    </div>
                    <CardTitle className="text-lg">Separate Entity</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>Legally distinct from its owners with its own rights and obligations</CardDescription>
                  </CardContent>
                </Card>
                
                <Card className="text-center border-border/50">
                  <CardHeader>
                    <div className="w-12 h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                      <DollarSign className="h-6 w-6 text-secondary" />
                    </div>
                    <CardTitle className="text-lg">Tax Flexibility</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>Choose your tax treatment: pass-through, S-Corp, or C-Corp</CardDescription>
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
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Benefits of an LLC</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Discover why millions of business owners choose the LLC structure
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
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Considerations</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  A few things to keep in mind when forming an LLC
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {drawbacks.map((drawback, index) => (
                  <Card key={index} className={`border-l-4 ${
                    drawback.severity === 'medium' ? 'border-l-warning' : 'border-l-muted-foreground'
                  }`}>
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${
                          drawback.severity === 'medium' ? 'bg-warning/10' : 'bg-muted'
                        }`}>
                          <AlertTriangle className={`h-5 w-5 ${
                            drawback.severity === 'medium' ? 'text-warning' : 'text-muted-foreground'
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
            </div>
          </div>
        </section>

        {/* Tax Options Section */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">LLC Tax Options</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  One of the biggest advantages of an LLC is tax flexibility
                </p>
              </div>
              
              <div className="grid lg:grid-cols-3 gap-6">
                {taxOptions.map((option, index) => (
                  <Card key={index} className="border-border/50 h-full">
                    <CardHeader>
                      <CardTitle className="text-lg">{option.election}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{option.description}</p>
                      <div className="pt-4 border-t border-border/50">
                        <p className="text-sm">
                          <span className="font-medium text-foreground">Best For:</span>{" "}
                          <span className="text-muted-foreground">{option.bestFor}</span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <p className="text-sm text-muted-foreground mt-6 text-center">
                Consult a tax professional to determine the best election for your situation.
              </p>
            </div>
          </div>
        </section>

        {/* Who Should Choose Section */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Is an LLC Right for You?</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  LLCs are ideal for many businesses, but not all
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
                      Consider Alternatives
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

        {/* Formation Steps Section */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">How to Form an LLC</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Our simple 6-step process gets your LLC up and running quickly
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
                <Button size="lg" className="px-8" asChild>
                  <Link to="/order">
                    Start Your LLC <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">LLC vs. Other Structures</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  See how LLCs compare to other business entity options
                </p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full bg-card rounded-xl border border-border/50 overflow-hidden">
                  <thead>
                    <tr className="bg-primary text-primary-foreground">
                      <th className="px-6 py-4 text-left font-semibold">Feature</th>
                      <th className="px-6 py-4 text-center font-semibold">Sole Prop</th>
                      <th className="px-6 py-4 text-center font-semibold bg-secondary/20">LLC</th>
                      <th className="px-6 py-4 text-center font-semibold">S-Corp</th>
                      <th className="px-6 py-4 text-center font-semibold">C-Corp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr>
                      <td className="px-6 py-4 font-medium">Liability Protection</td>
                      <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-destructive mx-auto" /></td>
                      <td className="px-6 py-4 text-center bg-secondary/5"><Check className="h-5 w-5 text-success mx-auto" /></td>
                      <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-success mx-auto" /></td>
                      <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-success mx-auto" /></td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="px-6 py-4 font-medium">Pass-Through Taxation</td>
                      <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-success mx-auto" /></td>
                      <td className="px-6 py-4 text-center bg-secondary/5"><Check className="h-5 w-5 text-success mx-auto" /></td>
                      <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-success mx-auto" /></td>
                      <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-destructive mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">Tax Flexibility</td>
                      <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-destructive mx-auto" /></td>
                      <td className="px-6 py-4 text-center bg-secondary/5"><Check className="h-5 w-5 text-success mx-auto" /></td>
                      <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-destructive mx-auto" /></td>
                      <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-destructive mx-auto" /></td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="px-6 py-4 font-medium">Ownership Restrictions</td>
                      <td className="px-6 py-4 text-center text-success">None</td>
                      <td className="px-6 py-4 text-center bg-secondary/5 text-success">None</td>
                      <td className="px-6 py-4 text-center text-warning">Limited</td>
                      <td className="px-6 py-4 text-center text-success">None</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">Formation Complexity</td>
                      <td className="px-6 py-4 text-center text-success">Simple</td>
                      <td className="px-6 py-4 text-center bg-secondary/5 text-success">Moderate</td>
                      <td className="px-6 py-4 text-center text-warning">Complex</td>
                      <td className="px-6 py-4 text-center text-destructive">Complex</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button variant="outline" asChild>
                  <Link to="/sole-proprietorship">Sole Proprietorships</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/s-corporation">S Corporations</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/c-corporation">C Corporations</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
                <p className="text-lg text-muted-foreground">
                  Get answers to common questions about LLCs
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

        {/* Related Structures */}
        <RelatedStructures 
          currentStructureId="llc"
          relatedIds={["s-corp", "c-corp", "sole-proprietorship", "partnership"]}
        />

        {/* CTA Section */}
        <section className="py-16 lg:py-20 gradient-hero text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Form Your LLC?</h2>
              <p className="text-xl text-primary-foreground/90 mb-8">
                Join thousands of entrepreneurs who have started their LLC with Finityo. Get liability protection and tax benefits today.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
                  <Link to="/order">
                    Start Your LLC - $149 <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground/30 text-primary-foreground hover:bg-white/10" asChild>
                  <Link to="/consultation">Schedule Free Consultation</Link>
                </Button>
              </div>
              <p className="mt-6 text-sm text-primary-foreground/70">
                Includes registered agent service for the first year
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LLC;
