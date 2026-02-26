import Navigation from "@/components/Navigation";
import ServiceJsonLd from "@/components/ServiceJsonLd";
import FaqJsonLd from "@/components/FaqJsonLd";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import BackToTop from "@/components/BackToTop";
import RelatedStructures from "@/components/RelatedStructures";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, X, Shield, TrendingUp, Users, FileText, DollarSign, AlertTriangle, ArrowRight, HelpCircle, Scale, Building } from "lucide-react";
import { Link } from "react-router-dom";

const SCorporation = () => {
  const benefits = [
    {
      title: "Pass-Through Taxation",
      description: "Profits and losses pass through to shareholders' personal tax returns, avoiding corporate-level taxation.",
      icon: DollarSign
    },
    {
      title: "Self-Employment Tax Savings",
      description: "Only salary is subject to payroll taxes. Distributions above reasonable salary avoid self-employment tax.",
      icon: TrendingUp
    },
    {
      title: "Limited Liability Protection",
      description: "Shareholders' personal assets are protected from business debts and legal claims.",
      icon: Shield
    },
    {
      title: "Business Credibility",
      description: "Corporate structure enhances credibility with customers, vendors, and financial institutions.",
      icon: Building
    },
    {
      title: "Perpetual Existence",
      description: "The corporation continues to exist regardless of changes in ownership or management.",
      icon: Scale
    },
    {
      title: "Employee Benefits",
      description: "Shareholders can be employees and receive benefits, with some limitations compared to C-Corps.",
      icon: Users
    }
  ];

  const drawbacks = [
    {
      title: "Ownership Restrictions",
      description: "Limited to 100 shareholders, all of whom must be U.S. citizens or residents. No corporations, partnerships, or non-resident aliens.",
      severity: "high"
    },
    {
      title: "One Class of Stock",
      description: "Can only have one class of stock, limiting flexibility for investors who want preferred shares or different voting rights.",
      severity: "high"
    },
    {
      title: "Reasonable Salary Requirement",
      description: "Shareholder-employees must pay themselves a 'reasonable salary' before taking distributions, which the IRS scrutinizes.",
      severity: "medium"
    },
    {
      title: "Formation Complexity",
      description: "Requires forming a corporation first, then filing Form 2553 with the IRS to elect S-Corp status.",
      severity: "medium"
    },
    {
      title: "Corporate Formalities",
      description: "Must follow corporate formalities: board meetings, meeting minutes, bylaws, and annual reports.",
      severity: "medium"
    },
    {
      title: "State Recognition Varies",
      description: "Some states do not recognize S-Corp election and tax S-Corps as regular corporations.",
      severity: "low"
    }
  ];

  const eligibilityRequirements = [
    "Must be a domestic corporation (formed in the U.S.)",
    "Cannot have more than 100 shareholders",
    "Shareholders must be individuals, certain trusts, or estates",
    "Shareholders cannot be corporations, partnerships, or non-resident aliens",
    "Only one class of stock is permitted (though voting rights can differ)",
    "Cannot be an ineligible corporation (certain financial institutions, insurance companies)"
  ];

  const taxForms = [
    { form: "Form 1120-S", purpose: "U.S. Income Tax Return for an S Corporation" },
    { form: "Schedule K-1", purpose: "Each shareholder's share of income, deductions, and credits" },
    { form: "Form W-2", purpose: "Wages paid to shareholder-employees" },
    { form: "Form 940/941", purpose: "Employer payroll tax returns" },
    { form: "State S-Corp Returns", purpose: "Varies by state; some states tax S-Corps differently" }
  ];

  const formationSteps = [
    {
      step: 1,
      title: "Form a Corporation",
      description: "First, form a regular C corporation by filing Articles of Incorporation with your state.",
      timeline: "1-2 weeks"
    },
    {
      step: 2,
      title: "Meet Eligibility Requirements",
      description: "Ensure your corporation meets all S-Corp eligibility requirements (ownership, stock class, etc.).",
      timeline: "Same day"
    },
    {
      step: 3,
      title: "File Form 2553",
      description: "Submit IRS Form 2553 (Election by a Small Business Corporation) signed by all shareholders.",
      timeline: "Immediately"
    },
    {
      step: 4,
      title: "File Deadline",
      description: "Form 2553 must be filed within 75 days of formation or by March 15 for existing corporations.",
      timeline: "Critical deadline"
    },
    {
      step: 5,
      title: "Set Up Payroll",
      description: "Establish payroll for shareholder-employees with reasonable salaries and proper tax withholding.",
      timeline: "1-2 weeks"
    },
    {
      step: 6,
      title: "Maintain Compliance",
      description: "Follow corporate formalities: hold meetings, keep minutes, file annual reports.",
      timeline: "Ongoing"
    }
  ];

  const selfEmploymentTaxExample = {
    scenario: "Business with $150,000 net profit",
    llcTax: "Self-employment tax on $150,000 = $21,195 (15.3% up to SS wage base + 2.9%)",
    sCorpSalary: "$80,000 reasonable salary",
    sCorpPayrollTax: "Payroll taxes on $80,000 = ~$12,240",
    sCorpDistribution: "$70,000 distribution (no self-employment tax)",
    savings: "Potential savings: ~$8,955 per year"
  };

  const faqs = [
    {
      question: "What is the difference between an S-Corp and a C-Corp?",
      answer: "The main difference is taxation. C-Corps pay corporate income tax on profits, and shareholders pay personal tax on dividends—'double taxation.' S-Corps avoid this because profits pass through to shareholders' personal returns. However, S-Corps have ownership restrictions (100 shareholders, one stock class, U.S. persons only) while C-Corps have none. C-Corps can go public and attract venture capital more easily."
    },
    {
      question: "Should I form an S-Corp or an LLC with S-Corp election?",
      answer: "Both achieve similar tax results. An LLC with S-Corp election offers more flexibility (no corporate formalities required in the operating agreement) and simpler compliance in some states. A true S-Corp may be preferred for businesses planning to eventually become C-Corps or go public. Many small business owners choose the LLC + S-Corp election path for simplicity."
    },
    {
      question: "What is a 'reasonable salary' for an S-Corp owner?",
      answer: "The IRS requires S-Corp shareholder-employees to pay themselves a salary that would be reasonable for someone doing their job at another company. Factors include: industry standards, experience level, time devoted to the business, and comparable salaries in your area. Setting salary too low to avoid payroll taxes is a red flag for IRS audits. Consult a CPA to determine an appropriate amount."
    },
    {
      question: "When does it make sense to elect S-Corp status?",
      answer: "S-Corp election typically makes sense when your business has consistent net profits of $50,000 or more annually. At lower income levels, the payroll tax savings may not offset the additional complexity and costs (payroll processing, separate tax returns, reasonable salary requirements). Run the numbers with a tax professional for your specific situation."
    },
    {
      question: "Can I convert my LLC to an S-Corp?",
      answer: "Yes, you can elect S-Corp tax treatment for an existing LLC by filing Form 2553 with the IRS. The LLC remains an LLC for legal purposes but is taxed as an S-Corp. This is a common strategy. You can also revoke S-Corp election later if it no longer makes sense. The election must be filed by March 15 of the year you want it to take effect, or within 75 days of forming a new entity."
    },
    {
      question: "What happens if I miss the Form 2553 deadline?",
      answer: "If you miss the deadline, you can request late election relief from the IRS. The IRS grants relief for late elections if: less than 3 years and 75 days have passed since the intended effective date, you have reasonable cause, and you have consistently treated the entity as an S-Corp. Attach a statement explaining the delay when filing Form 2553."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <ServiceJsonLd serviceName="S Corporation Formation" description="Form your S Corporation to enjoy pass-through taxation and self-employment tax savings with corporate liability protection." url="/s-corporation" />
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
                <TrendingUp className="h-4 w-4" />
                <span className="text-sm font-medium">Tax-Advantaged Structure</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                S Corporation Formation
              </h1>
              <p className="text-xl md:text-2xl mb-4 text-primary-foreground/90">
                Avoid double taxation while maintaining corporate structure
              </p>
              <p className="text-lg mb-8 text-primary-foreground/80 max-w-2xl mx-auto">
                S Corporations combine pass-through taxation with liability protection, potentially saving thousands on self-employment taxes.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
                  <Link to="/order-flow">
                    Form Your S-Corp <ArrowRight className="ml-2 h-5 w-5" />
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
                What Is an S Corporation?
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                <p>
                  An <strong className="text-foreground">S Corporation</strong> is a special tax designation that a corporation or LLC can elect with the IRS. It is not a type of business entity—it is a tax election that allows a corporation to pass its income, losses, deductions, and credits through to shareholders' personal tax returns.
                </p>
                <p>
                  The "S" in S Corporation refers to <strong className="text-foreground">Subchapter S</strong> of the Internal Revenue Code. Unlike C Corporations (which are taxed under Subchapter C and face double taxation), S Corporations only pay taxes once at the individual shareholder level.
                </p>
                <p>
                  The main advantage of S-Corp status is the potential to reduce <strong className="text-foreground">self-employment taxes</strong>. Shareholder-employees can pay themselves a reasonable salary (subject to payroll taxes) and take additional profits as distributions (not subject to self-employment tax).
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Tax Savings Example */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Potential Tax Savings</h2>
                <p className="text-lg text-muted-foreground">
                  See how S-Corp election can reduce self-employment taxes
                </p>
              </div>
              
              <Card className="border-secondary/30">
                <CardHeader>
                  <CardTitle>Example: {selfEmploymentTaxExample.scenario}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                      <h4 className="font-semibold text-destructive mb-2">LLC/Sole Prop (Default)</h4>
                      <p className="text-sm text-muted-foreground">{selfEmploymentTaxExample.llcTax}</p>
                    </div>
                    <div className="p-4 bg-success/5 rounded-lg border border-success/20">
                      <h4 className="font-semibold text-success mb-2">S Corporation</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        <li>Salary: {selfEmploymentTaxExample.sCorpSalary}</li>
                        <li>Payroll taxes: {selfEmploymentTaxExample.sCorpPayrollTax}</li>
                        <li>Distribution: {selfEmploymentTaxExample.sCorpDistribution}</li>
                      </ul>
                    </div>
                  </div>
                  <div className="p-4 bg-secondary/10 rounded-lg text-center">
                    <p className="text-lg font-semibold text-secondary">{selfEmploymentTaxExample.savings}</p>
                    <p className="text-sm text-muted-foreground mt-1">Actual savings depend on your specific situation. Consult a tax professional.</p>
                  </div>
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
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Benefits of S Corporations</h2>
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
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Limitations & Drawbacks</h2>
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

        {/* Eligibility Requirements */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">S-Corp Eligibility Requirements</h2>
                <p className="text-lg text-muted-foreground">
                  To qualify for S-Corp status, your corporation must meet these IRS requirements
                </p>
              </div>
              
              <Card className="border-border/50">
                <CardContent className="pt-6">
                  <ul className="grid md:grid-cols-2 gap-4">
                    {eligibilityRequirements.map((req, index) => (
                      <li key={index} className="flex items-start gap-3">
                        <Check className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{req}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Formation Steps */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">How to Form an S Corporation</h2>
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
                <h2 className="text-3xl md:text-4xl font-bold mb-4">S-Corp vs. Other Structures</h2>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full bg-card rounded-xl border border-border/50 overflow-hidden">
                  <thead>
                    <tr className="bg-primary text-primary-foreground">
                      <th className="px-6 py-4 text-left font-semibold">Feature</th>
                      <th className="px-6 py-4 text-center font-semibold">LLC</th>
                      <th className="px-6 py-4 text-center font-semibold bg-secondary/20">S-Corp</th>
                      <th className="px-6 py-4 text-center font-semibold">C-Corp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr>
                      <td className="px-6 py-4 font-medium">Double Taxation</td>
                      <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-success mx-auto" /></td>
                      <td className="px-6 py-4 text-center bg-secondary/5"><X className="h-5 w-5 text-success mx-auto" /></td>
                      <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-destructive mx-auto" /></td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="px-6 py-4 font-medium">SE Tax on All Profits</td>
                      <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-destructive mx-auto" /></td>
                      <td className="px-6 py-4 text-center bg-secondary/5"><X className="h-5 w-5 text-success mx-auto" /></td>
                      <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-success mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">Ownership Restrictions</td>
                      <td className="px-6 py-4 text-center text-success">None</td>
                      <td className="px-6 py-4 text-center bg-secondary/5 text-warning">Yes (100 max)</td>
                      <td className="px-6 py-4 text-center text-success">None</td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="px-6 py-4 font-medium">Multiple Stock Classes</td>
                      <td className="px-6 py-4 text-center text-muted-foreground">N/A</td>
                      <td className="px-6 py-4 text-center bg-secondary/5"><X className="h-5 w-5 text-destructive mx-auto" /></td>
                      <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-success mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">Venture Capital Ready</td>
                      <td className="px-6 py-4 text-center text-warning">Limited</td>
                      <td className="px-6 py-4 text-center bg-secondary/5 text-warning">Limited</td>
                      <td className="px-6 py-4 text-center text-success">Yes</td>
                    </tr>
                  </tbody>
                </table>
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

        {/* Related Structures */}
        <RelatedStructures 
          currentStructureId="s-corp"
          relatedIds={["llc", "c-corp", "professional-corp", "partnership"]}
        />

        {/* CTA Section */}
        <section className="py-16 lg:py-20 gradient-hero text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Save on Taxes?</h2>
              <p className="text-xl text-primary-foreground/90 mb-8">
                Let our experts help you determine if S-Corp status is right for your business and guide you through the formation process.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
                  <Link to="/order-flow">
                    Form Your S-Corp <ArrowRight className="ml-2 h-5 w-5" />
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

export default SCorporation;
