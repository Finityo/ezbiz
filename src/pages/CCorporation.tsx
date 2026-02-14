import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import BackToTop from "@/components/BackToTop";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, X, Shield, TrendingUp, Users, FileText, DollarSign, AlertTriangle, ArrowRight, HelpCircle, Globe, Building, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

const CCorporation = () => {
  const benefits = [
    {
      title: "Unlimited Growth Potential",
      description: "No limit on the number of shareholders or classes of stock. Issue common stock, preferred stock, and stock options.",
      icon: TrendingUp
    },
    {
      title: "Attract Investors",
      description: "The preferred structure for venture capital, angel investors, and institutional investors seeking equity stakes.",
      icon: Users
    },
    {
      title: "Limited Liability Protection",
      description: "Shareholders' personal assets are protected from corporate debts and legal liabilities.",
      icon: Shield
    },
    {
      title: "Go Public Ready",
      description: "Only C Corporations can conduct IPOs. Perfect structure for companies planning to go public eventually.",
      icon: Globe
    },
    {
      title: "Perpetual Existence",
      description: "The corporation continues indefinitely, unaffected by changes in ownership or management succession.",
      icon: Building
    },
    {
      title: "Employee Benefits",
      description: "Offer tax-advantaged benefits: health insurance, retirement plans, stock options, and fringe benefits.",
      icon: Briefcase
    }
  ];

  const drawbacks = [
    {
      title: "Double Taxation",
      description: "Corporate profits are taxed at the corporate level, then again when distributed as dividends to shareholders.",
      severity: "high"
    },
    {
      title: "Complex Compliance",
      description: "Extensive formalities required: board meetings, shareholder meetings, detailed minutes, and annual reports.",
      severity: "high"
    },
    {
      title: "Higher Costs",
      description: "Formation and ongoing costs are higher than LLCs: legal fees, franchise taxes, and compliance requirements.",
      severity: "medium"
    },
    {
      title: "Rigid Structure",
      description: "Must follow statutory requirements for board of directors, officers, and shareholder voting procedures.",
      severity: "medium"
    },
    {
      title: "State Franchise Taxes",
      description: "Many states impose franchise taxes on corporations based on income, shares, or capital.",
      severity: "medium"
    }
  ];

  const taxDetails = {
    corporateRate: "21%",
    qualifiedDividendRate: "0%, 15%, or 20%",
    example: {
      profit: "$100,000",
      corpTax: "$21,000 (21% corporate tax)",
      afterTax: "$79,000 available for dividends",
      dividendTax: "$11,850 (15% qualified dividend rate)",
      totalTax: "$32,850 (32.85% effective rate)"
    }
  };

  const formationSteps = [
    {
      step: 1,
      title: "Choose Your State of Incorporation",
      description: "Most businesses incorporate in their home state. Delaware is popular for larger companies seeking investor-friendly laws.",
      timeline: "Day 1"
    },
    {
      step: 2,
      title: "Name Your Corporation",
      description: "Choose a unique name including 'Corporation,' 'Incorporated,' 'Company,' or abbreviation. Check availability.",
      timeline: "1-2 days"
    },
    {
      step: 3,
      title: "Appoint Directors and Officers",
      description: "Designate initial board of directors and officers (President, Secretary, Treasurer at minimum).",
      timeline: "Day 1"
    },
    {
      step: 4,
      title: "File Articles of Incorporation",
      description: "Submit formation documents to the state, including registered agent information and authorized shares.",
      timeline: "1-4 weeks"
    },
    {
      step: 5,
      title: "Create Corporate Bylaws",
      description: "Draft bylaws governing operations: meeting procedures, officer duties, voting requirements, etc.",
      timeline: "1-2 weeks"
    },
    {
      step: 6,
      title: "Hold Organizational Meeting",
      description: "Board adopts bylaws, elects officers, authorizes stock issuance, and handles initial business.",
      timeline: "Day 1 post-formation"
    },
    {
      step: 7,
      title: "Issue Stock Certificates",
      description: "Issue stock to initial shareholders and record in stock ledger. Consider 83(b) elections for founders.",
      timeline: "1-2 weeks"
    },
    {
      step: 8,
      title: "Obtain EIN and Open Accounts",
      description: "Apply for EIN, open corporate bank accounts, and set up accounting systems.",
      timeline: "Immediate"
    }
  ];

  const delawareAdvantages = [
    "Court of Chancery with corporate law expertise",
    "Well-developed body of corporate case law",
    "Business-friendly statutory framework",
    "No state corporate income tax for companies not operating in Delaware",
    "Privacy protections for shareholders",
    "Preferred by investors and VCs"
  ];

  const faqs = [
    {
      question: "Why do so many companies incorporate in Delaware?",
      answer: "Delaware has the most developed body of corporate law in the U.S., with a specialized Court of Chancery for business disputes. The state offers predictable legal outcomes, flexible corporate statutes, privacy protections, and no state income tax for corporations that do not operate in Delaware. Most venture-backed startups and public companies incorporate there. However, if you operate in another state, you will need to register there as a 'foreign corporation' as well."
    },
    {
      question: "How can I avoid double taxation as a C Corporation?",
      answer: "Several strategies can minimize double taxation: (1) Pay reasonable salaries to shareholder-employees (deductible to the corporation), (2) Retain earnings for reinvestment rather than paying dividends, (3) Provide tax-free fringe benefits to employees, (4) Consider electing S-Corp status if you qualify and do not need C-Corp features, (5) Defer dividends until lower-income years. Consult a tax advisor for your specific situation."
    },
    {
      question: "What is the difference between authorized and issued shares?",
      answer: "Authorized shares are the maximum number of shares the corporation can issue, specified in the Articles of Incorporation. Issued shares are the shares actually distributed to shareholders. Companies typically authorize more shares than initially needed to allow for future issuances (employee options, investor rounds) without amending articles. For example, you might authorize 10 million shares but only issue 1 million to founders initially."
    },
    {
      question: "Do I need a board of directors?",
      answer: "Yes, all corporations must have a board of directors. The board oversees major decisions, hires officers, and represents shareholder interests. Minimum requirements vary by state—some allow a single director, while others require three. For small corporations, the same person can be the sole shareholder, director, and officer. As you grow and add investors, board composition becomes more complex."
    },
    {
      question: "What corporate formalities must I follow?",
      answer: "C Corporations must: (1) Hold annual shareholder and board meetings, (2) Keep detailed minutes of all meetings, (3) Maintain corporate records (bylaws, stock ledger, resolutions), (4) File annual reports with the state, (5) Keep corporate finances separate from personal, (6) Act in the corporation's name (sign contracts as 'Name, Title, for XYZ Corp'). Failure to follow formalities can result in 'piercing the corporate veil,' exposing shareholders to personal liability."
    },
    {
      question: "When should I choose a C Corporation over an LLC?",
      answer: "Choose a C Corporation if you: (1) Plan to raise venture capital or go public, (2) Want to offer stock options to employees, (3) Need multiple classes of stock, (4) Plan to reinvest all profits (no dividend distributions), (5) Want maximum employee benefits. Choose an LLC if you: want simpler compliance, plan to distribute profits regularly, do not need outside investors, or prefer pass-through taxation."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <FloatingCTA />
      <BackToTop />
      
      <main>
        {/* Hero Section */}
        <section className="gradient-hero text-primary-foreground py-20 lg:py-28 relative overflow-hidden pattern-geometric">
          <div className="absolute inset-0 pattern-dots opacity-30"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-6 bg-white/20 text-primary-foreground hover:bg-white/30">
                Best for Growth & Investment
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                C Corporation Formation
              </h1>
              <p className="text-xl md:text-2xl mb-4 text-primary-foreground/90">
                The ultimate structure for growth, investment, and going public
              </p>
              <p className="text-lg mb-8 text-primary-foreground/80 max-w-2xl mx-auto">
                C Corporations offer unlimited growth potential with multiple stock classes, no ownership restrictions, and the ability to attract venture capital.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
                  <Link to="/order">
                    Incorporate Now - $199 <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground/30 text-primary-foreground hover:bg-white/10" asChild>
                  <Link to="/consultation">Free Incorporation Guide</Link>
                </Button>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-primary-foreground/80">
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <span>Delaware Incorporation Available</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <span>Investor Ready</span>
                </div>
                <div className="flex items-center gap-2">
                  <Check className="h-4 w-4" />
                  <span>IPO Ready</span>
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
                What Is a C Corporation?
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                <p>
                  A <strong className="text-foreground">C Corporation</strong> (named after Subchapter C of the Internal Revenue Code) is the standard corporate structure in the United States. It is a separate legal entity from its owners (shareholders), providing strong liability protection and unlimited growth potential.
                </p>
                <p>
                  C Corporations are subject to <strong className="text-foreground">corporate income tax</strong> at the federal level (currently 21%) and may also pay state corporate taxes. When profits are distributed as dividends, shareholders pay tax again on their personal returns—this is often called "double taxation."
                </p>
                <p>
                  Despite the tax complexity, C Corporations are the preferred structure for companies seeking <strong className="text-foreground">venture capital</strong>, planning to <strong className="text-foreground">go public</strong>, or wanting to offer <strong className="text-foreground">stock options</strong> and multiple classes of stock.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Double Taxation Explained */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Understanding Double Taxation</h2>
                <p className="text-lg text-muted-foreground">
                  How corporate profits are taxed at two levels
                </p>
              </div>
              
              <Card className="border-warning/30">
                <CardHeader>
                  <CardTitle>Example: {taxDetails.example.profit} Corporate Profit</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span>Corporate Profit</span>
                      <span className="font-semibold">{taxDetails.example.profit}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-destructive/5 rounded-lg">
                      <span>Corporate Tax ({taxDetails.corporateRate})</span>
                      <span className="font-semibold text-destructive">- {taxDetails.example.corpTax}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg">
                      <span>Available for Dividends</span>
                      <span className="font-semibold">{taxDetails.example.afterTax}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-destructive/5 rounded-lg">
                      <span>Dividend Tax ({taxDetails.qualifiedDividendRate})</span>
                      <span className="font-semibold text-destructive">- {taxDetails.example.dividendTax}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-warning/10 rounded-lg border border-warning/20">
                      <span className="font-semibold">Total Tax Paid</span>
                      <span className="font-bold text-warning">{taxDetails.example.totalTax}</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">
                    Note: Retained earnings (profits not distributed) are only taxed at the corporate level. 
                    This makes C Corporations advantageous for companies reinvesting profits for growth.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Benefits of C Corporations</h2>
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
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Considerations & Drawbacks</h2>
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
            </div>
          </div>
        </section>

        {/* Delaware Section */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="accent-line mb-6" />
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">Why Incorporate in Delaware?</h2>
                  <p className="text-muted-foreground mb-6">
                    Over 65% of Fortune 500 companies and most venture-backed startups are incorporated in Delaware. 
                    Here is why Delaware is the gold standard for incorporation:
                  </p>
                  <ul className="space-y-3">
                    {delawareAdvantages.map((advantage, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{advantage}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <Card className="border-secondary/30 bg-secondary/5">
                  <CardHeader>
                    <CardTitle>Delaware vs. Home State</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-success mb-2">Choose Delaware If:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Seeking venture capital or angel investment</li>
                        <li>• Planning to go public eventually</li>
                        <li>• Operating in multiple states</li>
                        <li>• Want sophisticated corporate law protections</li>
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-primary mb-2">Choose Home State If:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>• Small business with local operations</li>
                        <li>• Not seeking outside investors</li>
                        <li>• Want to avoid registering in two states</li>
                        <li>• Keeping costs minimal</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Formation Steps */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">How to Form a C Corporation</h2>
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

        {/* Comparison Table */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">C Corporation vs. Other Structures</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full bg-card rounded-xl border border-border/50 overflow-hidden">
                  <thead>
                    <tr className="bg-primary text-primary-foreground">
                      <th className="px-6 py-4 text-left font-semibold">Feature</th>
                      <th className="px-6 py-4 text-center font-semibold">LLC</th>
                      <th className="px-6 py-4 text-center font-semibold">S-Corp</th>
                      <th className="px-6 py-4 text-center font-semibold bg-secondary/20">C-Corp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr>
                      <td className="px-6 py-4 font-medium">Unlimited Shareholders</td>
                      <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-success mx-auto" /></td>
                      <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-destructive mx-auto" /></td>
                      <td className="px-6 py-4 text-center bg-secondary/5"><Check className="h-5 w-5 text-success mx-auto" /></td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="px-6 py-4 font-medium">Multiple Stock Classes</td>
                      <td className="px-6 py-4 text-center text-muted-foreground">N/A</td>
                      <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-destructive mx-auto" /></td>
                      <td className="px-6 py-4 text-center bg-secondary/5"><Check className="h-5 w-5 text-success mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">Venture Capital Ready</td>
                      <td className="px-6 py-4 text-center text-warning">Limited</td>
                      <td className="px-6 py-4 text-center text-warning">Limited</td>
                      <td className="px-6 py-4 text-center bg-secondary/5 text-success">Yes</td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="px-6 py-4 font-medium">Can Go Public (IPO)</td>
                      <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-destructive mx-auto" /></td>
                      <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-destructive mx-auto" /></td>
                      <td className="px-6 py-4 text-center bg-secondary/5"><Check className="h-5 w-5 text-success mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">Double Taxation</td>
                      <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-success mx-auto" /></td>
                      <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-success mx-auto" /></td>
                      <td className="px-6 py-4 text-center bg-secondary/5"><Check className="h-5 w-5 text-destructive mx-auto" /></td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button variant="outline" asChild>
                  <Link to="/llc">Learn About LLCs</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/s-corporation">Learn About S-Corps</Link>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Incorporate?</h2>
              <p className="text-xl text-primary-foreground/90 mb-8">
                Start your C Corporation today and unlock unlimited growth potential. Our experts will handle all the paperwork and filings.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
                  <Link to="/order">
                    Start Incorporation - $199 <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground/30 text-primary-foreground hover:bg-white/10" asChild>
                  <Link to="/consultation">Speak with Expert</Link>
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

export default CCorporation;
