import SEOHead from "@/components/SEOHead";
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
import { Check, X, Users, FileText, TrendingUp, Shield, AlertTriangle, ArrowRight, HelpCircle, Handshake, DollarSign } from "lucide-react";
import { Link } from "react-router-dom";
import { trackClick } from "@/hooks/useAnalytics";
import { PARTNERSHIP_COPY } from "@/content/ezbizCopy";

const c = PARTNERSHIP_COPY;
const benefitIcons = [Users, DollarSign, FileText, Handshake, TrendingUp, Users];

const Partnership = () => {
  const faqs = c.faq.items.map(f => ({ question: f.question, answer: f.answer }));

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Partnership Formation" description="Form your business partnership with expert guidance. General and limited partnership formation in all 50 states." path="/partnership" />
      <ServiceJsonLd serviceName="Partnership Formation" description="Form your business partnership with expert guidance. General and limited partnership formation services in all 50 states." url="/partnership" />
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
                <Handshake className="h-4 w-4" /><span className="text-sm font-medium">{c.hero.badge}</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">{c.hero.headline}</h1>
              <p className="text-xl md:text-2xl mb-4 text-primary-foreground/90">{c.hero.subheadline}</p>
              <p className="text-lg mb-8 text-primary-foreground/80 max-w-2xl mx-auto">{c.hero.description}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
                  <Link to="/order-flow">{c.hero.ctaPrimary} <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground/30 text-primary-foreground hover:bg-white/10" asChild>
                  <Link to="/consultation" onClick={() => trackClick(c.hero.ctaSecondary, 'partnership_hero_cta', '/consultation')}>{c.hero.ctaSecondary}</Link>
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
            </div>
          </div>
        </section>

        {/* Partnership Types */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{c.types.heading}</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{c.types.subheading}</p>
              </div>
              <div className="grid lg:grid-cols-3 gap-6">
                {c.types.items.map((type, index) => (
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
                            <li key={idx} className="flex items-start gap-2 text-sm text-muted-foreground"><Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />{feature}</li>
                          ))}
                        </ul>
                      </div>
                      <div className="pt-4 border-t border-border/50">
                        <p className="text-sm"><span className="font-medium text-foreground">Best For:</span> <span className="text-muted-foreground">{type.bestFor}</span></p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
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
            <div className="max-w-6xl mx-auto">
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
                    <h4 className="font-semibold text-foreground mb-2">Want Liability Protection?</h4>
                    <p className="text-muted-foreground text-sm">If unlimited liability concerns you, consider an <Link to="/form-llc" className="text-secondary hover:underline font-medium">LLC</Link> instead. LLCs provide liability protection while maintaining pass-through taxation, similar to a partnership.</p>
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
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{c.tax.heading}</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{c.tax.subheading}</p>
              </div>
              <div className="grid lg:grid-cols-2 gap-8">
                <div>
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2"><DollarSign className="h-5 w-5 text-secondary" />Pass-Through Taxation</h3>
                  <div className="space-y-4">
                    {[c.tax.howItWorks, c.tax.selfEmployment, c.tax.guaranteed].map((item, i) => (
                      <div key={i} className="p-4 bg-card rounded-lg border border-border/50">
                        <h4 className="font-medium text-foreground mb-2">{item.title}</h4>
                        <p className="text-sm text-muted-foreground">{item.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-6 flex items-center gap-2"><FileText className="h-5 w-5 text-secondary" />Required Tax Forms</h3>
                  <Card className="border-border/50">
                    <CardContent className="p-0">
                      <div className="divide-y divide-border/50">
                        {c.taxForms.map((item, index) => (
                          <div key={index} className="p-4 flex items-start gap-4">
                            <div className="w-8 h-8 bg-primary/10 rounded flex items-center justify-center flex-shrink-0"><span className="text-xs font-semibold text-primary">{index + 1}</span></div>
                            <div><p className="font-medium text-foreground text-sm">{item.form}</p><p className="text-sm text-muted-foreground">{item.purpose}</p></div>
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

        {/* Formation Steps */}
        <section className="py-16 lg:py-20 bg-muted/30">
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

        {/* Comparison Table */}
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
                      <th className="px-6 py-4 text-center font-semibold">General Partnership</th>
                      <th className="px-6 py-4 text-center font-semibold">LLC</th>
                      <th className="px-6 py-4 text-center font-semibold">S Corporation</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    <tr><td className="px-6 py-4 font-medium">Liability Protection</td><td className="px-6 py-4 text-center"><X className="h-5 w-5 text-destructive mx-auto" /></td><td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-success mx-auto" /></td><td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-success mx-auto" /></td></tr>
                    <tr className="bg-muted/30"><td className="px-6 py-4 font-medium">Pass-Through Taxation</td><td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-success mx-auto" /></td><td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-success mx-auto" /></td><td className="px-6 py-4 text-center"><Check className="h-5 w-5 text-success mx-auto" /></td></tr>
                    <tr><td className="px-6 py-4 font-medium">State Filing Required</td><td className="px-6 py-4 text-center text-success">No (GP)</td><td className="px-6 py-4 text-center text-warning">Yes</td><td className="px-6 py-4 text-center text-warning">Yes</td></tr>
                    <tr className="bg-muted/30"><td className="px-6 py-4 font-medium">Ownership Flexibility</td><td className="px-6 py-4 text-center text-success">High</td><td className="px-6 py-4 text-center text-success">High</td><td className="px-6 py-4 text-center text-warning">Restricted</td></tr>
                    <tr><td className="px-6 py-4 font-medium">Formation Cost</td><td className="px-6 py-4 text-center text-success">$0 - $100</td><td className="px-6 py-4 text-center text-warning">$50 - $500</td><td className="px-6 py-4 text-center text-destructive">$100 - $800</td></tr>
                  </tbody>
                </table>
              </div>
              <div className="mt-8 flex flex-wrap justify-center gap-4">
                <Button variant="outline" asChild><Link to="/form-llc">Learn About LLCs</Link></Button>
                <Button variant="outline" asChild><Link to="/s-corporation">Learn About S Corps</Link></Button>
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

        <RelatedStructures currentStructureId="partnership" relatedIds={["llc", "sole-proprietorship", "s-corp", "c-corp"]} />

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
                  <Link to="/consultation" onClick={() => trackClick(c.cta.ctaSecondary, 'partnership_bottom_cta', '/consultation')}>{c.cta.ctaSecondary}</Link>
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
