import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, X, Users, FileText, TrendingUp, Shield, AlertTriangle, Scale, ArrowRight, HelpCircle, Handshake, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";

const Partnership = () => {
  const benefits = [
    {
      title: "Shared Resources & Expertise",
      description: "Pool financial resources, skills, and industry knowledge with your partners to build a stronger business.",
      icon: Users
    },
    {
      title: "Pass-Through Taxation",
      description: "Profits and losses pass through to partners' personal tax returns, avoiding double taxation.",
      icon: DollarSign
    },
    {
      title: "Simple Formation",
      description: "Easier and less expensive to form than corporations. No state filing required for general partnerships in most states.",
      icon: FileText
    },
    {
      title: "Flexible Management",
      description: "Partners can structure management and decision-making however they agree, with no statutory requirements.",
      icon: Handshake
    },
    {
      title: "Combined Capital",
      description: "Multiple partners can contribute capital, making it easier to fund the business than as a sole proprietor.",
      icon: TrendingUp
    },
    {
      title: "Shared Workload",
      description: "Distribute responsibilities among partners based on individual strengths and availability.",
      icon: Users
    }
  ];

  const drawbacks = [
    {
      title: "Unlimited Personal Liability (GP)",
      description: "In a general partnership, each partner is personally liable for all partnership debts and the actions of other partners.",
      severity: "high"
    },
    {
      title: "Joint & Several Liability",
      description: "Any partner can be held responsible for the entire debt of the partnership, not just their proportional share.",
      severity: "high"
    },
    {
      title: "Potential for Conflict",
      description: "Disagreements between partners can disrupt business operations and even lead to dissolution.",
      severity: "medium"
    },
    {
      title: "Shared Profits",
      description: "Profits must be shared according to the partnership agreement, unlike a sole proprietorship where you keep everything.",
      severity: "low"
    },
    {
      title: "Difficulty Transferring Ownership",
      description: "Adding or removing partners typically requires consent of all existing partners and may trigger dissolution.",
      severity: "medium"
    },
    {
      title: "Limited Life",
      description: "A partnership may dissolve when a partner dies, withdraws, or becomes incapacitated unless otherwise agreed.",
      severity: "medium"
    }
  ];

  const partnershipTypes = [
    {
      type: "General Partnership (GP)",
      description: "All partners share equally in management responsibilities and personal liability for business debts.",
      features: [
        "Equal management rights (unless agreed otherwise)",
        "Unlimited personal liability for all partners",
        "Shared profits and losses",
        "No state filing required in most states",
        "Simplest partnership structure"
      ],
      bestFor: "Small businesses where partners want equal involvement and trust each other completely"
    },
    {
      type: "Limited Partnership (LP)",
      description: "Combines general partners (who manage and have liability) with limited partners (passive investors with limited liability).",
      features: [
        "At least one general partner required",
        "Limited partners cannot participate in management",
        "Limited partners' liability capped at investment",
        "State filing required",
        "Common for real estate and investment ventures"
      ],
      bestFor: "Businesses seeking passive investors while maintaining management control"
    },
    {
      type: "Limited Liability Partnership (LLP)",
      description: "All partners have limited liability protection from other partners' negligence or misconduct.",
      features: [
        "Partners protected from other partners' malpractice",
        "All partners can participate in management",
        "State filing required",
        "Often restricted to professional services",
        "Popular with law firms and accounting practices"
      ],
      bestFor: "Professional service firms (lawyers, accountants, architects) wanting liability protection"
    }
  ];

  const taxForms = [
    { form: "Form 1065", purpose: "U.S. Return of Partnership Income (informational return)" },
    { form: "Schedule K-1", purpose: "Each partner's share of income, deductions, and credits" },
    { form: "Form 1040 Schedule E", purpose: "Partners report their K-1 income on personal returns" },
    { form: "Form SE", purpose: "Self-employment tax for general partners" },
    { form: "State Partnership Returns", purpose: "Varies by state; some require separate filings" }
  ];

  const formationSteps = [
    {
      step: 1,
      title: "Choose Your Partnership Type",
      description: "Decide between General Partnership, Limited Partnership, or Limited Liability Partnership based on your needs.",
      timeline: "Day 1"
    },
    {
      step: 2,
      title: "Select a Business Name",
      description: "Choose a name and check availability. File a DBA if using a name other than partners' names.",
      timeline: "1-2 days"
    },
    {
      step: 3,
      title: "Draft Partnership Agreement",
      description: "Create a comprehensive written agreement covering profit sharing, responsibilities, dispute resolution, and exit procedures.",
      timeline: "1-2 weeks"
    },
    {
      step: 4,
      title: "Register with the State (if required)",
      description: "LPs and LLPs require state registration. General partnerships may only need local business licenses.",
      timeline: "1-2 weeks"
    },
    {
      step: 5,
      title: "Obtain an EIN",
      description: "Apply for a free Employer Identification Number from the IRS for tax filing and banking.",
      timeline: "Immediate"
    },
    {
      step: 6,
      title: "Open a Business Bank Account",
      description: "Keep partnership funds separate from personal accounts for proper accounting.",
      timeline: "1-2 days"
    }
  ];

  const faqs = [
    {
      question: "What is the difference between a partnership and an LLC?",
      answer: "The main difference is liability protection. In a general partnership, partners have unlimited personal liability for business debts and each other's actions. An LLC provides limited liability protection, meaning members' personal assets are generally protected from business debts. LLCs also offer more flexibility in management structure and profit distribution. Many businesses that would have formed partnerships now choose LLCs for the liability protection."
    },
    {
      question: "Do I need a written partnership agreement?",
      answer: "While not legally required in most states, a written partnership agreement is strongly recommended. Without one, state default rules govern your partnership, which may not align with your intentions. A good partnership agreement covers: profit and loss allocation, management responsibilities, capital contributions, decision-making processes, partner withdrawal or death procedures, and dispute resolution. Many partnership disputes arise from unclear or unwritten agreements."
    },
    {
      question: "How are partnerships taxed?",
      answer: "Partnerships are 'pass-through' entities, meaning the partnership itself does not pay income tax. Instead, profits and losses pass through to partners, who report them on their personal tax returns. The partnership files an informational return (Form 1065) and issues Schedule K-1 to each partner showing their share. General partners also pay self-employment tax on their share of partnership income."
    },
    {
      question: "Can a partnership have employees?",
      answer: "Yes, partnerships can hire employees. The partnership must obtain an EIN, withhold payroll taxes, and comply with employment laws. Partners themselves are not considered employees—they are self-employed and receive distributions rather than wages. Some partnerships pay partners 'guaranteed payments' for services, which are similar to salary but taxed differently."
    },
    {
      question: "What happens if a partner wants to leave?",
      answer: "This depends on your partnership agreement. Common approaches include: buyout provisions where remaining partners purchase the departing partner's share, right of first refusal before selling to outsiders, and valuation methods for determining the departing partner's payout. Without an agreement, state law applies, which may require dissolution of the partnership. This is why a comprehensive partnership agreement is essential."
    },
    {
      question: "Can I convert a partnership to an LLC?",
      answer: "Yes, partnerships can be converted to LLCs. Many states offer statutory conversion processes that preserve the partnership's history and contracts. The process typically involves filing articles of organization, creating an operating agreement, and updating registrations. Converting to an LLC provides liability protection while maintaining pass-through taxation. Consult a tax professional as there may be tax implications."
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section className="gradient-hero text-primary-foreground py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Handshake className="h-4 w-4" />
                <span className="text-sm font-medium">Multi-Owner Business Structure</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Partnership Formation
              </h1>
              <p className="text-xl md:text-2xl mb-4 text-primary-foreground/90">
                Join forces with partners to build a successful business together
              </p>
              <p className="text-lg mb-8 text-primary-foreground/80 max-w-2xl mx-auto">
                Partnerships combine resources, expertise, and capital while offering tax advantages and management flexibility.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
                  <Link to="/order">
                    Form Your Partnership <ArrowRight className="ml-2 h-5 w-5" />
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
                What Is a Partnership?
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                <p>
                  A <strong className="text-foreground">partnership</strong> is a business structure where two or more individuals share ownership, management responsibilities, and profits. Partnerships are governed by the Uniform Partnership Act (UPA) or Revised Uniform Partnership Act (RUPA), which most states have adopted.
                </p>
                <p>
                  Unlike corporations and LLCs, general partnerships do not require formal state registration—they are created automatically when two or more people go into business together for profit. However, limited partnerships and LLPs do require state filing.
                </p>
                <p>
                  Partnerships offer <strong className="text-foreground">pass-through taxation</strong>, meaning the business itself does not pay income tax. Instead, profits and losses "pass through" to partners' personal tax returns, avoiding the double taxation that affects C corporations.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Partnership Types Section */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Types of Partnerships</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Choose the partnership structure that best fits your business needs and risk tolerance
                </p>
              </div>
              
              <div className="grid lg:grid-cols-3 gap-6">
                {partnershipTypes.map((type, index) => (
                  <Card key={index} className="border-border/50 h-full">
                    <CardHeader>
                      <CardTitle className="text-xl">{type.type}</CardTitle>
                      <CardDescription className="text-sm">{type.description}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <h4 className="font-medium text-sm mb-2">Key Features:</h4>
                        <ul className="space-y-2">
                          {type.features.map((feature, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground">
                              <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                              {feature}
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-4 border-t border-border/50">
                        <p className="text-sm">
                          <span className="font-medium text-foreground">Best For:</span>{" "}
                          <span className="text-muted-foreground">{type.bestFor}</span>
                        </p>
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
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Benefits of a Partnership</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Partnerships offer unique advantages for businesses with multiple owners
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
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Potential Drawbacks</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Consider these important limitations before choosing a partnership structure
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
                    <h4 className="font-semibold text-foreground mb-2">Want Liability Protection?</h4>
                    <p className="text-muted-foreground text-sm">
                      If unlimited liability concerns you, consider an <Link to="/llc" className="text-secondary hover:underline font-medium">LLC</Link> instead. 
                      LLCs provide liability protection while maintaining pass-through taxation, similar to a partnership.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Tax Section */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Partnership Taxation</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Understanding how partnership income flows to partners
                </p>
              </div>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                    <DollarSign className="h-5 w-5 text-secondary" />
                    Pass-Through Taxation
                  </h3>
                  <div className="space-y-4">
                    <div className="p-4 bg-card rounded-lg border border-border/50">
                      <h4 className="font-medium text-foreground mb-2">How It Works</h4>
                      <p className="text-sm text-muted-foreground">
                        The partnership files an informational return (Form 1065) but does not pay income tax. 
                        Each partner receives a Schedule K-1 showing their share of profits, losses, and deductions.
                      </p>
                    </div>
                    <div className="p-4 bg-card rounded-lg border border-border/50">
                      <h4 className="font-medium text-foreground mb-2">Self-Employment Tax</h4>
                      <p className="text-sm text-muted-foreground">
                        General partners pay self-employment tax (15.3%) on their share of partnership income. 
                        Limited partners typically do not pay self-employment tax on their distributive share.
                      </p>
                    </div>
                    <div className="p-4 bg-card rounded-lg border border-border/50">
                      <h4 className="font-medium text-foreground mb-2">Guaranteed Payments</h4>
                      <p className="text-sm text-muted-foreground">
                        Partners may receive guaranteed payments for services or capital use, which are deductible by the partnership 
                        and taxable to the receiving partner regardless of partnership profit.
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
                </div>
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
                <h2 className="text-3xl md:text-4xl font-bold mb-4">How to Form a Partnership</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Follow these steps to establish your partnership properly
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
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Partnership vs. Other Structures</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Compare partnerships to other business entity options
                </p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full bg-card rounded-xl border border-border/50 overflow-hidden">
                  <thead>
                    <tr className="bg-primary text-primary-foreground">
                      <th className="px-6 py-4 text-left font-semibold">Feature</th>
                      <th className="px-6 py-4 text-center font-semibold">General Partnership</th>
                      <th className="px-6 py-4 text-center font-semibold">LLC</th>
                      <th className="px-6 py-4 text-center font-semibold">S Corporation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr>
                      <td className="px-6 py-4 font-medium">Liability Protection</td>
                      <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-destructive mx-auto" /></td>
                      <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-success mx-auto" /></td>
                      <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-success mx-auto" /></td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="px-6 py-4 font-medium">Pass-Through Taxation</td>
                      <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-success mx-auto" /></td>
                      <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-success mx-auto" /></td>
                      <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-success mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">State Filing Required</td>
                      <td className="px-6 py-4 text-center text-success">No (GP)</td>
                      <td className="px-6 py-4 text-center text-warning">Yes</td>
                      <td className="px-6 py-4 text-center text-warning">Yes</td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="px-6 py-4 font-medium">Ownership Flexibility</td>
                      <td className="px-6 py-4 text-center text-success">High</td>
                      <td className="px-6 py-4 text-center text-success">High</td>
                      <td className="px-6 py-4 text-center text-warning">Restricted</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">Formation Cost</td>
                      <td className="px-6 py-4 text-center text-success">$0 - $100</td>
                      <td className="px-6 py-4 text-center text-warning">$50 - $500</td>
                      <td className="px-6 py-4 text-center text-destructive">$100 - $800</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button variant="outline" asChild>
                  <Link to="/llc">Learn About LLCs</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/s-corporation">Learn About S Corps</Link>
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
                  Get answers to common questions about partnerships
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to Partner Up?</h2>
              <p className="text-xl text-primary-foreground/90 mb-8">
                Let us help you establish a strong foundation for your partnership. We will guide you through the formation process and help create a solid partnership agreement.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
                  <Link to="/order">
                    Form Your Partnership <ArrowRight className="ml-2 h-5 w-5" />
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

export default Partnership;
