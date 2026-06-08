import SEOHead from "@/components/SEOHead";
import Navigation from "@/components/Navigation";
import ServiceJsonLd from "@/components/ServiceJsonLd";
import FaqJsonLd from "@/components/FaqJsonLd";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import BackToTop from "@/components/BackToTop";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, X, FileText, Users, Building, Tag, AlertTriangle, Shield, ArrowRight, HelpCircle, Briefcase, Store } from "lucide-react";
import { Link } from "react-router-dom";
import { trackClick } from "@/hooks/useAnalytics";
import { DBA_COPY } from "@/content/ezbizCopy";

const c = DBA_COPY;
const benefitIcons = [Tag, Briefcase, Store, Building, FileText, Check];
const whoNeedsIcons = [Users, Users, Building, Building];

const DBAFiling = () => {
  const faqs = c.faq.items.map(f => ({ question: f.question, answer: f.answer }));

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="DBA Filing Service" description="File your Doing Business As (DBA) name professionally. Operate under a trade name with proper legal registration." path="/dba-filing" />
      <ServiceJsonLd serviceName="DBA Filing Service" description="File your Doing Business As (DBA) name professionally. Operate under a trade name with proper legal registration." url="/dba-filing" />
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
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Tag className="h-4 w-4" /><span className="text-sm font-medium">{c.hero.badge}</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">{c.hero.headline}</h1>
              <p className="text-xl md:text-2xl mb-4 text-primary-foreground/90">{c.hero.subheadline}</p>
              <p className="text-lg mb-8 text-primary-foreground/80 max-w-2xl mx-auto">{c.hero.description}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
                  <Link to="/order-flow">{c.hero.ctaPrimary} <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground/30 text-primary-foreground hover:bg-white/10" asChild>
                  <Link to="/consultation" onClick={() => trackClick(c.hero.ctaSecondary, 'dba_filing_hero_cta', '/consultation')}>{c.hero.ctaSecondary}</Link>
                </Button>
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
              <div className="grid md:grid-cols-2 gap-6 mt-12">
                <Card className="border-success/30 bg-success/5">
                  <CardHeader><CardTitle className="flex items-center gap-2 text-success"><Check className="h-5 w-5" />What a DBA Does</CardTitle></CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {c.whatIs.does.map((item, i) => (
                        <li key={i} className="flex items-start gap-2"><Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" /><span>{item}</span></li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                <Card className="border-destructive/30 bg-destructive/5">
                  <CardHeader><CardTitle className="flex items-center gap-2 text-destructive"><X className="h-5 w-5" />What a DBA Does NOT Do</CardTitle></CardHeader>
                  <CardContent>
                    <ul className="space-y-2 text-sm">
                      {c.whatIs.doesNot.map((item, i) => (
                        <li key={i} className="flex items-start gap-2"><X className="h-4 w-4 text-destructive mt-0.5 flex-shrink-0" /><span>{item}</span></li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Who Needs */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{c.whoNeeds.heading}</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{c.whoNeeds.subheading}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {c.whoNeeds.items.map((item, index) => {
                  const Icon = whoNeedsIcons[index];
                  return (
                    <Card key={index} className="border-border/50">
                      <CardHeader>
                        <div className="flex items-start gap-4">
                          <div className="w-12 h-12 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0"><Icon className="h-6 w-6 text-primary" /></div>
                          <div><CardTitle className="text-lg mb-2">{item.title}</CardTitle><CardDescription>{item.description}</CardDescription></div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="bg-muted/50 p-3 rounded-lg">
                          <p className="text-sm text-muted-foreground"><span className="font-medium text-foreground">Example:</span> {item.example}</p>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
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
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{c.benefits.subheading}</p>
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
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{c.drawbacks.subheading}</p>
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
              <div className="mt-8 p-6 bg-primary/5 rounded-xl border border-primary/10">
                <div className="flex items-start gap-4">
                  <Shield className="h-6 w-6 text-primary flex-shrink-0 mt-1" />
                  <div>
                    <h4 className="font-semibold text-foreground mb-2">Need Liability Protection?</h4>
                    <p className="text-muted-foreground text-sm">If personal liability protection is important for your business, consider forming an <Link to="/form-llc" className="text-secondary hover:underline font-medium">LLC</Link> first, then filing a DBA for the LLC if you want to operate under a different name.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Formation Steps */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{c.formationSteps.heading}</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{c.formationSteps.subheading}</p>
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

        {/* State Requirements */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{c.stateVariations.heading}</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{c.stateVariations.subheading}</p>
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
                    {c.stateVariations.items.map((row, index) => (
                      <tr key={index} className={index % 2 === 1 ? 'bg-muted/30' : ''}>
                        <td className="px-6 py-4 font-medium">{row.state}</td>
                        <td className="px-6 py-4 text-center text-muted-foreground">{row.filedWith}</td>
                        <td className="px-6 py-4 text-center">
                          <span className={row.publication === 'Required' ? 'text-warning' : 'text-success'}>{row.publication}</span>
                        </td>
                        <td className="px-6 py-4 text-center text-muted-foreground">{row.renewal}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="text-sm text-muted-foreground mt-4 text-center">{c.stateVariations.footnote}</p>
            </div>
          </div>
        </section>

        {/* Comparison */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{c.comparison.heading}</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{c.comparison.subheading}</p>
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
                    <tr><td className="px-6 py-4 font-medium">Creates Legal Entity</td><td className="px-6 py-4 text-center"><X className="h-5 w-5 text-destructive mx-auto" /></td><td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-success mx-auto" /></td><td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-success mx-auto" /></td></tr>
                    <tr className="bg-muted/30"><td className="px-6 py-4 font-medium">Liability Protection</td><td className="px-6 py-4 text-center"><X className="h-5 w-5 text-destructive mx-auto" /></td><td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-success mx-auto" /></td><td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-success mx-auto" /></td></tr>
                    <tr><td className="px-6 py-4 font-medium">Startup Cost</td><td className="px-6 py-4 text-center text-success">$25 - $150</td><td className="px-6 py-4 text-center text-warning">$50 - $500</td><td className="px-6 py-4 text-center text-destructive">$100 - $800</td></tr>
                    <tr className="bg-muted/30"><td className="px-6 py-4 font-medium">Complexity</td><td className="px-6 py-4 text-center text-success">Very Simple</td><td className="px-6 py-4 text-center text-warning">Moderate</td><td className="px-6 py-4 text-center text-destructive">Complex</td></tr>
                    <tr><td className="px-6 py-4 font-medium">Tax Treatment</td><td className="px-6 py-4 text-center text-muted-foreground">No change</td><td className="px-6 py-4 text-center text-muted-foreground">Flexible</td><td className="px-6 py-4 text-center text-muted-foreground">Double taxation*</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button variant="outline" asChild><Link to="/sole-proprietorship">Learn About Sole Proprietorships</Link></Button>
                <Button variant="outline" asChild><Link to="/form-llc">Learn About LLCs</Link></Button>
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
                <p className="text-lg text-muted-foreground">{c.faq.subheading}</p>
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
                  <Link to="/consultation" onClick={() => trackClick(c.cta.ctaSecondary, 'dba_filing_bottom_cta', '/consultation')}>{c.cta.ctaSecondary}</Link>
                </Button>
              </div>
              <p className="mt-6 text-sm text-primary-foreground/70">{c.cta.footnote}</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default DBAFiling;
