import Navigation from "@/components/Navigation";
import ServiceJsonLd from "@/components/ServiceJsonLd";
import FaqJsonLd from "@/components/FaqJsonLd";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, X, Shield, Heart, TrendingUp, FileText, Users, AlertTriangle, ArrowRight, HelpCircle, Building, Gift, BookOpen } from "lucide-react";
import { Link } from "react-router-dom";

const NonprofitCorporation = () => {
  const nonprofitTypes = [
    {
      code: "501(c)(3)",
      name: "Charitable Organizations",
      description: "Religious, educational, charitable, scientific, literary organizations, and prevention of cruelty to children or animals",
      taxDeductible: true,
      examples: "Churches, schools, hospitals, food banks, animal shelters"
    },
    {
      code: "501(c)(4)",
      name: "Social Welfare Organizations",
      description: "Civic leagues and organizations promoting community welfare, including some lobbying",
      taxDeductible: false,
      examples: "Advocacy groups, volunteer fire departments, homeowner associations"
    },
    {
      code: "501(c)(6)",
      name: "Business Leagues",
      description: "Trade associations, professional organizations, chambers of commerce",
      taxDeductible: false,
      examples: "Industry trade groups, bar associations, real estate boards"
    },
    {
      code: "501(c)(7)",
      name: "Social & Recreation Clubs",
      description: "Clubs organized for pleasure, recreation, and social activities",
      taxDeductible: false,
      examples: "Country clubs, hobby clubs, fraternal organizations"
    }
  ];

  const benefits = [
    {
      title: "Tax-Exempt Status",
      description: "Exempt from federal income tax on revenue related to your exempt purpose. May also be exempt from state and local taxes.",
      icon: Heart
    },
    {
      title: "Tax-Deductible Donations",
      description: "501(c)(3) donors can deduct contributions on their personal taxes, encouraging greater giving.",
      icon: Gift
    },
    {
      title: "Grant Eligibility",
      description: "Access foundation grants, government funding, and other funding sources only available to nonprofits.",
      icon: TrendingUp
    },
    {
      title: "Limited Liability",
      description: "Directors, officers, and members are generally protected from personal liability for organizational debts.",
      icon: Shield
    },
    {
      title: "Credibility & Trust",
      description: "Official nonprofit status enhances credibility with donors, volunteers, and the community.",
      icon: Building
    },
    {
      title: "Perpetual Existence",
      description: "The organization continues beyond the involvement of any particular founder or leader.",
      icon: Users
    }
  ];

  const drawbacks = [
    {
      title: "No Private Benefit",
      description: "Cannot distribute profits to founders, directors, or members. All earnings must further the exempt purpose.",
      severity: "high"
    },
    {
      title: "Political Restrictions",
      description: "501(c)(3) organizations cannot participate in political campaigns and face strict limits on lobbying activities.",
      severity: "high"
    },
    {
      title: "Public Scrutiny",
      description: "Tax returns (Form 990) are public documents. Financial information and executive compensation are disclosed.",
      severity: "medium"
    },
    {
      title: "Complex Compliance",
      description: "Must follow strict IRS rules, maintain detailed records, and file annual returns to maintain tax-exempt status.",
      severity: "medium"
    },
    {
      title: "Lengthy Approval Process",
      description: "IRS determination letter for 501(c)(3) status can take 3-12 months to obtain.",
      severity: "medium"
    }
  ];

  const formationSteps = [
    {
      step: 1,
      title: "Form a Nonprofit Corporation",
      description: "File Articles of Incorporation with your state, including required nonprofit language about purpose and dissolution.",
      timeline: "1-2 weeks"
    },
    {
      step: 2,
      title: "Create Bylaws",
      description: "Draft comprehensive bylaws covering governance, board structure, membership, meetings, and amendment procedures.",
      timeline: "1-2 weeks"
    },
    {
      step: 3,
      title: "Appoint Initial Board",
      description: "Select your initial board of directors. Most states require at least 3 directors who are not related.",
      timeline: "Day 1"
    },
    {
      step: 4,
      title: "Hold Organizational Meeting",
      description: "Board adopts bylaws, elects officers, approves initial resolutions, and sets fiscal year.",
      timeline: "Day 1"
    },
    {
      step: 5,
      title: "Obtain EIN",
      description: "Apply for a free Employer Identification Number from the IRS (required for all nonprofits).",
      timeline: "Immediate"
    },
    {
      step: 6,
      title: "File Form 1023 or 1023-EZ",
      description: "Apply for 501(c)(3) status. Form 1023-EZ is simpler for small organizations; Form 1023 for larger ones.",
      timeline: "3-12 months"
    },
    {
      step: 7,
      title: "Register for State Fundraising",
      description: "Many states require charitable solicitation registration before you can solicit donations.",
      timeline: "2-4 weeks"
    }
  ];

  const form1023Comparison = {
    standard: {
      name: "Form 1023",
      fee: "$600",
      eligibility: "All organizations",
      length: "28 pages + attachments",
      processingTime: "6-12 months",
      bestFor: "Organizations expecting >$50K revenue, complex structures"
    },
    ez: {
      name: "Form 1023-EZ",
      fee: "$275",
      eligibility: "Projected revenue < $50K, assets < $250K",
      length: "3 pages",
      processingTime: "3-6 months",
      bestFor: "Small, simple organizations just starting out"
    }
  };

  const annualRequirements = [
    { form: "Form 990", description: "Annual information return for larger nonprofits (gross receipts ≥ $200K or assets ≥ $500K)" },
    { form: "Form 990-EZ", description: "Simplified return for mid-sized nonprofits (gross receipts < $200K and assets < $500K)" },
    { form: "Form 990-N", description: "E-postcard for small nonprofits (gross receipts ≤ $50K)" },
    { form: "State Reports", description: "Annual reports and charitable solicitation renewals as required by your state" }
  ];

  const faqs = [
    {
      question: "What is the difference between a nonprofit and a 501(c)(3)?",
      answer: "A nonprofit corporation is a legal entity formed under state law that does not distribute profits to owners. A 501(c)(3) is a federal tax designation from the IRS that grants tax-exempt status. You first form a nonprofit corporation with your state, then apply to the IRS for 501(c)(3) status. Not all nonprofits are 501(c)(3)s—there are other tax-exempt categories like 501(c)(4), 501(c)(6), etc."
    },
    {
      question: "Can nonprofit founders and employees be paid?",
      answer: "Yes, nonprofits can pay reasonable compensation to employees, including founders who work for the organization. What nonprofits cannot do is distribute profits to shareholders or pay excessive compensation. The key is 'reasonable compensation' based on what similar organizations pay for similar work. Executive compensation is reported on Form 990 and subject to public scrutiny."
    },
    {
      question: "How long does it take to get 501(c)(3) status?",
      answer: "The timeline varies. Form 1023-EZ (for smaller organizations) typically takes 3-6 months. The full Form 1023 can take 6-12 months, sometimes longer for complex applications or if the IRS requests additional information. During the waiting period, you can operate as a nonprofit, but donors cannot claim tax deductions until status is approved (though approval is retroactive to your formation date)."
    },
    {
      question: "What happens if we fail to file Form 990?",
      answer: "Failing to file Form 990 (or 990-N/990-EZ) for three consecutive years results in automatic revocation of your tax-exempt status. This means you become a taxable corporation and must apply again for exemption. Penalties also apply for late filings. Set up reminders and consider working with a CPA experienced in nonprofit accounting."
    },
    {
      question: "Can a nonprofit engage in political activities?",
      answer: "501(c)(3) organizations cannot participate in political campaigns for or against candidates. They can engage in limited lobbying (attempting to influence legislation), but it cannot be a 'substantial part' of activities. 501(c)(4) organizations have more flexibility for lobbying and some political activity. If political engagement is important to your mission, consider the appropriate tax-exempt category."
    },
    {
      question: "Do we need a board of directors?",
      answer: "Yes, all nonprofit corporations must have a board of directors (sometimes called board of trustees). Most states require at least 3 directors. Best practices recommend that the majority of directors be independent (not related to each other or compensated by the organization). The board is responsible for governance, oversight, and fiduciary duties."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <ServiceJsonLd serviceName="Nonprofit Corporation Formation" description="Form your 501(c)(3) nonprofit corporation. Tax-exempt status, charitable organization formation services nationwide." url="/nonprofit-corporation" />
      <FaqJsonLd faqs={faqs} />
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section className="gradient-hero text-primary-foreground py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Heart className="h-4 w-4" />
                <span className="text-sm font-medium">Make a Difference</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Nonprofit Corporation Formation
              </h1>
              <p className="text-xl md:text-2xl mb-4 text-primary-foreground/90">
                Create a tax-exempt organization dedicated to serving the greater good
              </p>
              <p className="text-lg mb-8 text-primary-foreground/80 max-w-2xl mx-auto">
                Form a 501(c)(3) nonprofit to receive tax-deductible donations, apply for grants, and build an organization that makes a lasting impact.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
                  <Link to="/order-flow">
                    Start Your Nonprofit <ArrowRight className="ml-2 h-5 w-5" />
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
                What Is a Nonprofit Corporation?
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                <p>
                  A <strong className="text-foreground">nonprofit corporation</strong> is a legal entity organized for purposes other than generating profit for owners or shareholders. Instead, any surplus revenue is used to further the organization's mission—whether charitable, educational, religious, scientific, or social.
                </p>
                <p>
                  Forming a nonprofit involves two steps: (1) incorporating as a nonprofit under state law, and (2) applying to the IRS for federal tax-exempt status under Section 501(c) of the Internal Revenue Code. The most common designation is <strong className="text-foreground">501(c)(3)</strong>, which applies to charitable, religious, educational, and scientific organizations.
                </p>
                <p>
                  501(c)(3) organizations enjoy significant benefits: exemption from federal income tax, eligibility for tax-deductible donations, and access to grants from foundations and government agencies. However, they must follow strict rules about political activities, private benefit, and public disclosure.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Types of Nonprofits */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Types of Tax-Exempt Organizations</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Different IRS designations for different types of nonprofit purposes
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {nonprofitTypes.map((type, index) => (
                  <Card key={index} className={`border-border/50 ${type.code === '501(c)(3)' ? 'border-secondary/50 bg-secondary/5' : ''}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">{type.code}</CardTitle>
                        {type.taxDeductible && (
                          <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">
                            Tax-Deductible Donations
                          </span>
                        )}
                      </div>
                      <CardDescription className="font-medium text-foreground">{type.name}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                      <div className="text-sm">
                        <span className="font-medium">Examples: </span>
                        <span className="text-muted-foreground">{type.examples}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Benefits of Nonprofit Status</h2>
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
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Restrictions & Considerations</h2>
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

        {/* Form 1023 Comparison */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">501(c)(3) Application Options</h2>
                <p className="text-lg text-muted-foreground">
                  Choose the right IRS application form for your organization
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle>{form1023Comparison.ez.name}</CardTitle>
                    <div className="text-2xl font-bold text-secondary">{form1023Comparison.ez.fee}</div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <span className="font-medium">Eligibility: </span>
                      <span className="text-muted-foreground">{form1023Comparison.ez.eligibility}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Length: </span>
                      <span className="text-muted-foreground">{form1023Comparison.ez.length}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Processing Time: </span>
                      <span className="text-muted-foreground">{form1023Comparison.ez.processingTime}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Best For: </span>
                      <span className="text-muted-foreground">{form1023Comparison.ez.bestFor}</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card className="border-border/50">
                  <CardHeader>
                    <CardTitle>{form1023Comparison.standard.name}</CardTitle>
                    <div className="text-2xl font-bold text-secondary">{form1023Comparison.standard.fee}</div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="text-sm">
                      <span className="font-medium">Eligibility: </span>
                      <span className="text-muted-foreground">{form1023Comparison.standard.eligibility}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Length: </span>
                      <span className="text-muted-foreground">{form1023Comparison.standard.length}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Processing Time: </span>
                      <span className="text-muted-foreground">{form1023Comparison.standard.processingTime}</span>
                    </div>
                    <div className="text-sm">
                      <span className="font-medium">Best For: </span>
                      <span className="text-muted-foreground">{form1023Comparison.standard.bestFor}</span>
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
                <h2 className="text-3xl md:text-4xl font-bold mb-4">How to Form a 501(c)(3) Nonprofit</h2>
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

        {/* Annual Requirements */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Annual Filing Requirements</h2>
                <p className="text-lg text-muted-foreground">
                  Maintaining tax-exempt status requires annual filings with the IRS
                </p>
              </div>
              
              <Card className="border-border/50">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {annualRequirements.map((req, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <FileText className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-foreground">{req.form}</p>
                          <p className="text-sm text-muted-foreground">{req.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              
              <div className="mt-6 p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground">
                    <span className="font-medium text-destructive">Warning:</span> Failure to file for three consecutive years results in automatic revocation of tax-exempt status.
                  </p>
                </div>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Make a Difference?</h2>
              <p className="text-xl text-primary-foreground/90 mb-8">
                Start your nonprofit corporation and begin making a positive impact in your community. We will guide you through every step of the formation and 501(c)(3) application process.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
                  <Link to="/order-flow">
                    Start Your Nonprofit <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground/30 text-primary-foreground hover:bg-white/10" asChild>
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

export default NonprofitCorporation;
