import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, X, FileText, Users, Building, Tag, AlertTriangle, Shield, ArrowRight, HelpCircle, Briefcase, Store } from "lucide-react";
import { Link } from "react-router-dom";

const DBAFiling = () => {
  const benefits = [
    {
      title: "Brand Identity",
      description: "Create a professional business name that resonates with your target market, separate from your personal or legal entity name.",
      icon: Tag
    },
    {
      title: "Banking Flexibility",
      description: "Open business bank accounts and accept payments under your DBA name, keeping finances organized.",
      icon: Briefcase
    },
    {
      title: "Marketing Power",
      description: "Build brand recognition and market your services under a memorable, industry-appropriate name.",
      icon: Store
    },
    {
      title: "Multiple Brands",
      description: "Operate multiple business lines under different names without forming separate legal entities.",
      icon: Building
    },
    {
      title: "Legal Compliance",
      description: "Meet state and local requirements for businesses operating under assumed names.",
      icon: FileText
    },
    {
      title: "Low Cost",
      description: "Establish a professional business presence at a fraction of the cost of forming an LLC or corporation.",
      icon: Check
    }
  ];

  const drawbacks = [
    {
      title: "No Liability Protection",
      description: "A DBA does not create a separate legal entity. You remain personally liable for all business debts and obligations.",
      severity: "high"
    },
    {
      title: "No Exclusive Rights",
      description: "Filing a DBA does not guarantee exclusive use of the name. Others may use similar names if not trademarked.",
      severity: "medium"
    },
    {
      title: "Renewal Requirements",
      description: "Most states require periodic renewal (typically every 5 years), with fees and paperwork.",
      severity: "low"
    },
    {
      title: "Publication Costs",
      description: "Some states require publishing your DBA in local newspapers, which adds to the total cost.",
      severity: "low"
    }
  ];

  const whoNeeds = [
    {
      title: "Sole Proprietors",
      description: "Individuals who want to operate under a business name rather than their personal legal name.",
      icon: Users,
      example: "John Smith operating as 'Smith Consulting Services'"
    },
    {
      title: "Partnerships",
      description: "Partners who want to use a trade name instead of listing all partners' names.",
      icon: Users,
      example: "Smith & Jones operating as 'Metro Law Group'"
    },
    {
      title: "LLCs",
      description: "Limited liability companies that want to market products or services under a different brand.",
      icon: Building,
      example: "ABC Holdings LLC operating as 'Downtown Coffee Shop'"
    },
    {
      title: "Corporations",
      description: "Companies creating divisions, subsidiaries, or separate brand identities.",
      icon: Building,
      example: "XYZ Corporation operating as 'QuickShip Delivery'"
    }
  ];

  const formationSteps = [
    {
      step: 1,
      title: "Choose Your DBA Name",
      description: "Select a name that represents your business, is not already in use, and complies with state naming rules.",
      timeline: "Same day"
    },
    {
      step: 2,
      title: "Search Name Availability",
      description: "Check county and state records to ensure your desired name is not already registered by another business.",
      timeline: "1-2 days"
    },
    {
      step: 3,
      title: "File DBA Registration",
      description: "Submit your DBA filing with the appropriate county clerk or state agency, along with required fees.",
      timeline: "1-2 weeks"
    },
    {
      step: 4,
      title: "Publish Notice (If Required)",
      description: "Some states require publishing your DBA in a local newspaper for a specified period.",
      timeline: "2-4 weeks"
    },
    {
      step: 5,
      title: "Obtain Business Licenses",
      description: "Apply for any required local business licenses and permits to operate under your DBA.",
      timeline: "1-2 weeks"
    }
  ];

  const stateVariations = [
    { state: "California", filedWith: "County Clerk", publication: "Required", renewal: "5 years" },
    { state: "Texas", filedWith: "County Clerk", publication: "Not Required", renewal: "10 years" },
    { state: "New York", filedWith: "County Clerk", publication: "Required", renewal: "None (perpetual)" },
    { state: "Florida", filedWith: "State (Sunbiz)", publication: "Not Required", renewal: "None (perpetual)" },
    { state: "Illinois", filedWith: "County Clerk", publication: "Not Required", renewal: "5 years" }
  ];

  const faqs = [
    {
      question: "What is the difference between a DBA and an LLC?",
      answer: "A DBA (Doing Business As) is simply a registered trade name that allows you to operate under a name different from your legal name. It does not create a new legal entity or provide liability protection. An LLC (Limited Liability Company) is a separate legal entity that provides personal liability protection, separating your personal assets from business debts. If liability protection is important, consider forming an LLC and then filing a DBA for the LLC if you want to operate under a different name."
    },
    {
      question: "Do I need a DBA if I have an LLC?",
      answer: "You only need a DBA for your LLC if you want to operate under a name different from your registered LLC name. For example, if your LLC is registered as 'ABC Holdings LLC' but you want to market a restaurant as 'Downtown Bistro,' you would file a DBA. If you are happy operating under your LLC's registered name, no DBA is needed."
    },
    {
      question: "How long does it take to get a DBA?",
      answer: "The timeline varies by state and county. In most cases, you can file a DBA within 1-2 business days. However, if your state requires newspaper publication (like California or New York), the total process can take 4-6 weeks. States without publication requirements typically complete the process in 1-2 weeks."
    },
    {
      question: "Does a DBA give me trademark protection?",
      answer: "No, a DBA registration does not provide trademark protection. A DBA only registers your business name with local or state authorities for legal and tax purposes. To protect your business name from being used by others nationwide, you would need to file for a federal trademark with the USPTO. We recommend conducting a trademark search before investing heavily in branding."
    },
    {
      question: "Can I have multiple DBAs?",
      answer: "Yes, a single person or business entity can register multiple DBAs. This is common for entrepreneurs who operate several different business lines or brands. Each DBA typically requires a separate filing and fee. For example, a marketing consultant might operate 'Smith Marketing' for B2B clients and 'Creative Co' for small business clients."
    },
    {
      question: "What happens if I do not renew my DBA?",
      answer: "If you fail to renew your DBA before it expires, your registration becomes inactive. This means you may lose the right to use that business name, and someone else could register it. Additionally, you may face penalties or need to re-file as a new application. Some states do not require renewal (perpetual registration), while others require renewal every 5-10 years."
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
                <Tag className="h-4 w-4" />
                <span className="text-sm font-medium">Trade Name Registration</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                DBA Filing Service
              </h1>
              <p className="text-xl md:text-2xl mb-4 text-primary-foreground/90">
                Register your "Doing Business As" name and build your brand identity
              </p>
              <p className="text-lg mb-8 text-primary-foreground/80 max-w-2xl mx-auto">
                Also known as a trade name, fictitious name, or assumed name. Start operating under your chosen business name quickly and affordably.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
                  <Link to="/order">
                    File Your DBA <ArrowRight className="ml-2 h-5 w-5" />
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
                What Is a DBA?
              </h2>
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                <p>
                  A <strong className="text-foreground">DBA (Doing Business As)</strong> is a registered trade name that allows a person or business entity to conduct business under a name different from their legal name. DBAs are also commonly called fictitious business names, assumed names, or trade names.
                </p>
                <p>
                  For example, if your legal name is "John Smith" and you want to operate a landscaping business called "Green Thumb Landscaping," you would file a DBA to legally use that business name. Similarly, if you have an LLC called "Smith Holdings LLC" but want to operate a coffee shop under the name "Morning Brew Cafe," you would file a DBA.
                </p>
                <p>
                  <strong className="text-foreground">Important:</strong> A DBA does not create a new legal entity or provide liability protection. It is simply a registration that allows you to do business under a different name while remaining legally the same person or entity.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6 mt-12">
                <Card className="border-success/30 bg-success/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-success">
                      <Check className="h-5 w-5" />
                      What a DBA Does
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                        <span>Allows you to legally operate under a different name</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                        <span>Enables opening bank accounts in your business name</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                        <span>Creates a public record of business ownership</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                        <span>Satisfies state/local legal requirements</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="border-destructive/30 bg-destructive/5">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-destructive">
                      <X className="h-5 w-5" />
                      What a DBA Does NOT Do
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      <li className="flex items-start gap-2">
                        <X className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                        <span>Does NOT create a separate legal entity</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <X className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                        <span>Does NOT provide liability protection</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <X className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                        <span>Does NOT give exclusive trademark rights</span>
                      </li>
                      <li className="flex items-start gap-2">
                        <X className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" />
                        <span>Does NOT change your tax status</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Who Needs Section */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Who Needs a DBA?</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Various types of individuals and business entities can benefit from filing a DBA
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {whoNeeds.map((item, index) => (
                  <Card key={index} className="border-border/50">
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0">
                          <item.icon className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <CardTitle className="text-lg mb-2">{item.title}</CardTitle>
                          <CardDescription>{item.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="bg-muted/50 p-3 rounded-lg">
                        <p className="text-sm text-muted-foreground">
                          <span className="font-medium text-foreground">Example:</span> {item.example}
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
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Benefits of Filing a DBA</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  A DBA offers several advantages for entrepreneurs and businesses
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
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Limitations to Consider</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Understand what a DBA cannot do before deciding if it is right for you
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
                    <h4 className="font-semibold text-foreground mb-2">Need Liability Protection?</h4>
                    <p className="text-muted-foreground text-sm">
                      If personal liability protection is important for your business, consider forming an <Link to="/llc" className="text-secondary hover:underline font-medium">LLC</Link> first, 
                      then filing a DBA for the LLC if you want to operate under a different name.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Formation Steps Section */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">How to File a DBA</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  The DBA filing process varies by state but generally follows these steps
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

        {/* State Requirements Table */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">DBA Requirements by State</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Requirements vary significantly by state. Here are some examples:
                </p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full bg-card rounded-xl border border-border/50 overflow-hidden">
                  <thead>
                    <tr className="bg-primary text-primary-foreground">
                      <th className="px-6 py-4 text-left font-semibold">State</th>
                      <th className="px-6 py-4 text-center font-semibold">Filed With</th>
                      <th className="px-6 py-4 text-center font-semibold">Publication</th>
                      <th className="px-6 py-4 text-center font-semibold">Renewal</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {stateVariations.map((row, index) => (
                      <tr key={index} className={index % 2 === 1 ? 'bg-muted/30' : ''}>
                        <td className="px-6 py-4 font-medium">{row.state}</td>
                        <td className="px-6 py-4 text-center text-muted-foreground">{row.filedWith}</td>
                        <td className="px-6 py-4 text-center">
                          {row.publication === 'Required' ? (
                            <span className="text-warning">{row.publication}</span>
                          ) : (
                            <span className="text-success">{row.publication}</span>
                          )}
                        </td>
                        <td className="px-6 py-4 text-center text-muted-foreground">{row.renewal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              
              <p className="text-sm text-muted-foreground mt-4 text-center">
                Requirements change frequently. Contact us for current requirements in your state.
              </p>
            </div>
          </div>
        </section>

        {/* Comparison Section */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">DBA vs. Other Business Structures</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                  Understand how a DBA compares to forming a separate business entity
                </p>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full bg-card rounded-xl border border-border/50 overflow-hidden">
                  <thead>
                    <tr className="bg-primary text-primary-foreground">
                      <th className="px-6 py-4 text-left font-semibold">Feature</th>
                      <th className="px-6 py-4 text-center font-semibold">DBA</th>
                      <th className="px-6 py-4 text-center font-semibold">LLC</th>
                      <th className="px-6 py-4 text-center font-semibold">Corporation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr>
                      <td className="px-6 py-4 font-medium">Creates Legal Entity</td>
                      <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-destructive mx-auto" /></td>
                      <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-success mx-auto" /></td>
                      <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-success mx-auto" /></td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="px-6 py-4 font-medium">Liability Protection</td>
                      <td className="px-6 py-4 text-center"><X className="h-5 w-5 text-destructive mx-auto" /></td>
                      <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-success mx-auto" /></td>
                      <td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-success mx-auto" /></td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">Startup Cost</td>
                      <td className="px-6 py-4 text-center text-success">$25 - $150</td>
                      <td className="px-6 py-4 text-center text-warning">$50 - $500</td>
                      <td className="px-6 py-4 text-center text-destructive">$100 - $800</td>
                    </tr>
                    <tr className="bg-muted/30">
                      <td className="px-6 py-4 font-medium">Complexity</td>
                      <td className="px-6 py-4 text-center text-success">Very Simple</td>
                      <td className="px-6 py-4 text-center text-warning">Moderate</td>
                      <td className="px-6 py-4 text-center text-destructive">Complex</td>
                    </tr>
                    <tr>
                      <td className="px-6 py-4 font-medium">Tax Treatment</td>
                      <td className="px-6 py-4 text-center text-muted-foreground">No change</td>
                      <td className="px-6 py-4 text-center text-muted-foreground">Flexible</td>
                      <td className="px-6 py-4 text-center text-muted-foreground">Double taxation*</td>
                    </tr>
                  </tbody>
                </table>
              </div>
              
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button variant="outline" asChild>
                  <Link to="/sole-proprietorship">Learn About Sole Proprietorships</Link>
                </Button>
                <Button variant="outline" asChild>
                  <Link to="/llc">Learn About LLCs</Link>
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
                  Get answers to common questions about DBA filings
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
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Ready to File Your DBA?</h2>
              <p className="text-xl text-primary-foreground/90 mb-8">
                Establish your brand identity and start operating under your chosen business name. We handle the paperwork so you can focus on your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
                  <Link to="/order">
                    File Your DBA Today <ArrowRight className="ml-2 h-5 w-5" />
                  </Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground/30 text-primary-foreground hover:bg-white/10" asChild>
                  <Link to="/consultation">Schedule Free Consultation</Link>
                </Button>
              </div>
              <p className="mt-6 text-sm text-primary-foreground/70">
                Starting at $99 + state filing fees
              </p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DBAFiling;
