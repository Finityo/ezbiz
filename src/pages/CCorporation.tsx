import Navigation from "@/components/Navigation";
import ServiceJsonLd from "@/components/ServiceJsonLd";
import FaqJsonLd from "@/components/FaqJsonLd";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import BackToTop from "@/components/BackToTop";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, X, Shield, TrendingUp, Users, DollarSign, AlertTriangle, ArrowRight, HelpCircle, Globe, Building, Briefcase } from "lucide-react";
import { Link } from "react-router-dom";
import { CCORP_COPY } from "@/content/ezbizCopy";

const c = CCORP_COPY;
const benefitIcons = [TrendingUp, Users, Shield, Globe, Building, Briefcase];

const CCorporation = () => {
  const faqs = c.faq.items.map(f => ({ question: f.question, answer: f.answer }));

  return (
    <div className="min-h-screen bg-background">
      <ServiceJsonLd serviceName="C Corporation Formation" description="Incorporate your C Corporation for unlimited growth potential, investor attraction, and IPO readiness. Professional formation in all 50 states." url="/c-corporation" />
      <FaqJsonLd faqs={faqs} />
      <Navigation />
      <FloatingCTA />
      <BackToTop />
      
      <main>
        {/* Hero */}
        <section className="gradient-hero text-primary-foreground py-20 lg:py-28 relative overflow-hidden pattern-geometric">
          <div className="absolute inset-0 pattern-dots opacity-30"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-6 bg-white/20 text-primary-foreground hover:bg-white/30">{c.hero.badge}</Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">{c.hero.headline}</h1>
              <p className="text-xl md:text-2xl mb-4 text-primary-foreground/90">{c.hero.subheadline}</p>
              <p className="text-lg mb-8 text-primary-foreground/80 max-w-2xl mx-auto">{c.hero.description}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
                  <Link to="/order-flow">{c.hero.ctaPrimary} <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground/30 text-primary-foreground hover:bg-white/10" asChild>
                  <Link to="/consultation">{c.hero.ctaSecondary}</Link>
                </Button>
              </div>
              <div className="flex flex-wrap items-center justify-center gap-6 mt-8 text-sm text-primary-foreground/80">
                {c.hero.badges.map((badge, i) => (
                  <div key={i} className="flex items-center gap-2"><Check className="h-4 w-4" /><span>{badge}</span></div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* What Is */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="accent-line-center mb-6" />
              <h2 className="text-3xl md:text-4xl font-bold text-center mb-6">{c.whatIs.heading}</h2>
              <div className="prose prose-lg max-w-none text-muted-foreground space-y-4">
                {c.whatIs.paragraphs.map((p, i) => <p key={i} dangerouslySetInnerHTML={{ __html: p }} />)}
              </div>
            </div>
          </div>
        </section>

        {/* Double Taxation */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{c.doubleTaxation.heading}</h2>
                <p className="text-lg text-muted-foreground">{c.doubleTaxation.subheading}</p>
              </div>
              <Card className="border-warning/30">
                <CardHeader><CardTitle>Example: {c.doubleTaxation.example.profit} Corporate Profit</CardTitle></CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg"><span>Corporate Profit</span><span className="font-semibold">{c.doubleTaxation.example.profit}</span></div>
                    <div className="flex justify-between items-center p-3 bg-destructive/5 rounded-lg"><span>Corporate Tax ({c.doubleTaxation.corporateRate})</span><span className="font-semibold text-destructive">- {c.doubleTaxation.example.corpTax}</span></div>
                    <div className="flex justify-between items-center p-3 bg-muted/50 rounded-lg"><span>Available for Dividends</span><span className="font-semibold">{c.doubleTaxation.example.afterTax}</span></div>
                    <div className="flex justify-between items-center p-3 bg-destructive/5 rounded-lg"><span>Dividend Tax ({c.doubleTaxation.qualifiedDividendRate})</span><span className="font-semibold text-destructive">- {c.doubleTaxation.example.dividendTax}</span></div>
                    <div className="flex justify-between items-center p-3 bg-warning/10 rounded-lg border border-warning/20"><span className="font-semibold">Total Tax Paid</span><span className="font-bold text-warning">{c.doubleTaxation.example.totalTax}</span></div>
                  </div>
                  <p className="text-sm text-muted-foreground mt-4">{c.doubleTaxation.note}</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{c.benefits.heading}</h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {c.benefits.items.map((benefit, index) => {
                  const Icon = benefitIcons[index];
                  return (
                    <Card key={index} className="border-border/50 hover:shadow-elegant transition-smooth">
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <div className="w-10 h-10 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0"><Icon className="h-5 w-5 text-success" /></div>
                          <div><CardTitle className="text-lg mb-2">{benefit.title}</CardTitle><CardDescription className="text-sm leading-relaxed">{benefit.description}</CardDescription></div>
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Drawbacks */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{c.drawbacks.heading}</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {c.drawbacks.items.map((drawback, index) => (
                  <Card key={index} className={`border-l-4 ${drawback.severity === 'high' ? 'border-l-destructive' : drawback.severity === 'medium' ? 'border-l-warning' : 'border-l-muted-foreground'}`}>
                    <CardHeader>
                      <div className="flex items-start gap-4">
                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${drawback.severity === 'high' ? 'bg-destructive/10' : drawback.severity === 'medium' ? 'bg-warning/10' : 'bg-muted'}`}>
                          <AlertTriangle className={`h-5 w-5 ${drawback.severity === 'high' ? 'text-destructive' : drawback.severity === 'medium' ? 'text-warning' : 'text-muted-foreground'}`} />
                        </div>
                        <div><CardTitle className="text-lg mb-2">{drawback.title}</CardTitle><CardDescription className="text-sm leading-relaxed">{drawback.description}</CardDescription></div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Delaware */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12 items-center">
                <div>
                  <div className="accent-line mb-6" />
                  <h2 className="text-3xl md:text-4xl font-bold mb-6">{c.delaware.heading}</h2>
                  <p className="text-muted-foreground mb-6">{c.delaware.intro}</p>
                  <ul className="space-y-3">
                    {c.delaware.advantages.map((adv, i) => (
                      <li key={i} className="flex items-start gap-3"><Check className="h-5 w-5 text-success mt-0.5 flex-shrink-0" /><span className="text-muted-foreground">{adv}</span></li>
                    ))}
                  </ul>
                </div>
                <Card className="border-secondary/30 bg-secondary/5">
                  <CardHeader><CardTitle>Delaware vs. Home State</CardTitle></CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-medium text-success mb-2">Choose Delaware If:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {c.delaware.chooseDelaware.map((item, i) => <li key={i}>• {item}</li>)}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-primary mb-2">Choose Home State If:</h4>
                      <ul className="text-sm text-muted-foreground space-y-1">
                        {c.delaware.chooseHomeState.map((item, i) => <li key={i}>• {item}</li>)}
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
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{c.formationSteps.heading}</h2>
              </div>
              <div className="space-y-6">
                {c.formationSteps.steps.map((step, index) => (
                  <div key={index} className="flex gap-6 items-start">
                    <div className="w-12 h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-lg font-bold flex-shrink-0">{step.step}</div>
                    <Card className="flex-1 border-border/50">
                      <CardHeader className="pb-2">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{step.title}</CardTitle>
                          <span className="text-xs bg-secondary/10 text-secondary px-3 py-1 rounded-full font-medium">{step.timeline}</span>
                        </div>
                      </CardHeader>
                      <CardContent><CardDescription>{step.description}</CardDescription></CardContent>
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
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{c.comparison.heading}</h2>
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
                    <tr><td className="px-6 py-4 font-medium">Unlimited Shareholders</td><td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-success mx-auto" /></td><td className="px-6 py-4 text-center"><X className="h-5 w-5 text-destructive mx-auto" /></td><td className="px-6 py-4 text-center bg-secondary/5"><Check className="h-5 w-5 text-success mx-auto" /></td></tr>
                    <tr className="bg-muted/30"><td className="px-6 py-4 font-medium">Multiple Stock Classes</td><td className="px-6 py-4 text-center text-muted-foreground">N/A</td><td className="px-6 py-4 text-center"><X className="h-5 w-5 text-destructive mx-auto" /></td><td className="px-6 py-4 text-center bg-secondary/5"><Check className="h-5 w-5 text-success mx-auto" /></td></tr>
                    <tr><td className="px-6 py-4 font-medium">Venture Capital Ready</td><td className="px-6 py-4 text-center text-warning">Limited</td><td className="px-6 py-4 text-center text-warning">Limited</td><td className="px-6 py-4 text-center bg-secondary/5 text-success">Yes</td></tr>
                    <tr className="bg-muted/30"><td className="px-6 py-4 font-medium">Can Go Public (IPO)</td><td className="px-6 py-4 text-center"><X className="h-5 w-5 text-destructive mx-auto" /></td><td className="px-6 py-4 text-center"><X className="h-5 w-5 text-destructive mx-auto" /></td><td className="px-6 py-4 text-center bg-secondary/5"><Check className="h-5 w-5 text-success mx-auto" /></td></tr>
                    <tr><td className="px-6 py-4 font-medium">Double Taxation</td><td className="px-6 py-4 text-center"><X className="h-5 w-5 text-success mx-auto" /></td><td className="px-6 py-4 text-center"><X className="h-5 w-5 text-success mx-auto" /></td><td className="px-6 py-4 text-center bg-secondary/5"><Check className="h-5 w-5 text-destructive mx-auto" /></td></tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button variant="outline" asChild><Link to="/form-llc">Learn About LLCs</Link></Button>
                <Button variant="outline" asChild><Link to="/s-corporation">Learn About S-Corps</Link></Button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{c.faq.heading}</h2>
              </div>
              <Accordion type="single" collapsible className="space-y-4">
                {c.faq.items.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="bg-card border border-border/50 rounded-lg px-6">
                    <AccordionTrigger className="text-left hover:no-underline py-6">
                      <span className="flex items-start gap-3 pr-4"><HelpCircle className="h-5 w-5 text-secondary flex-shrink-0 mt-0.5" /><span className="font-medium">{faq.question}</span></span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-6 pl-8 text-muted-foreground leading-relaxed">{faq.answer}</AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 lg:py-20 gradient-hero text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6">{c.cta.heading}</h2>
              <p className="text-xl text-primary-foreground/90 mb-8">{c.cta.subheading}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
                  <Link to="/order-flow">{c.cta.ctaPrimary} <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground/30 text-primary-foreground hover:bg-white/10" asChild>
                  <Link to="/consultation">{c.cta.ctaSecondary}</Link>
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
