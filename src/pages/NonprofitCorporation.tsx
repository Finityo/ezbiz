import SEOHead from "@/components/SEOHead";
import Navigation from "@/components/Navigation";
import ServiceJsonLd from "@/components/ServiceJsonLd";
import FaqJsonLd from "@/components/FaqJsonLd";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, Shield, Heart, TrendingUp, FileText, Users, AlertTriangle, ArrowRight, HelpCircle, Building, Gift } from "lucide-react";
import { Link } from "react-router-dom";
import { trackClick } from "@/hooks/useAnalytics";
import { NONPROFIT_COPY } from "@/content/ezbizCopy";

const c = NONPROFIT_COPY;
const benefitIcons = [Heart, Gift, TrendingUp, Shield, Building, Users];

const NonprofitCorporation = () => {
  const faqs = c.faq.items.map(f => ({ question: f.question, answer: f.answer }));

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Nonprofit Corporation Formation" description="Form your 501(c)(3) nonprofit corporation. Tax-exempt status and charitable organization formation services nationwide." path="/nonprofit-corporation" />
      <ServiceJsonLd serviceName="Nonprofit Corporation Formation" description="Form your 501(c)(3) nonprofit corporation. Tax-exempt status, charitable organization formation services nationwide." url="/nonprofit-corporation" />
      <FaqJsonLd faqs={faqs} />
      <Navigation />
      
      <main>
        {/* Hero */}
        <section className="gradient-hero text-primary-foreground py-20 lg:py-28">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm px-4 py-2 rounded-full mb-6">
                <Heart className="h-4 w-4" /><span className="text-sm font-medium">{c.hero.badge}</span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">{c.hero.headline}</h1>
              <p className="text-xl md:text-2xl mb-4 text-primary-foreground/90">{c.hero.subheadline}</p>
              <p className="text-lg mb-8 text-primary-foreground/80 max-w-2xl mx-auto">{c.hero.description}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
                  <Link to="/order-flow">{c.hero.ctaPrimary} <ArrowRight className="ml-2 h-5 w-5" /></Link>
                </Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-6 border-primary-foreground/30 text-primary-foreground hover:bg-white/10" asChild>
                  <Link to="/consultation" onClick={() => trackClick(c.hero.ctaSecondary, 'nonprofit_hero_cta', '/consultation')}>{c.hero.ctaSecondary}</Link>
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

        {/* Types */}
        <section className="py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{c.types.heading}</h2>
                <p className="text-lg text-muted-foreground max-w-2xl mx-auto">{c.types.subheading}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {c.types.items.map((type, index) => (
                  <Card key={index} className={`border-border/50 ${type.code === '501(c)(3)' ? 'border-secondary/50 bg-secondary/5' : ''}`}>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-xl">{type.code}</CardTitle>
                        {type.taxDeductible && <span className="text-xs bg-success/10 text-success px-2 py-1 rounded-full">Tax-Deductible Donations</span>}
                      </div>
                      <CardDescription className="font-medium text-foreground">{type.name}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">{type.description}</p>
                      <div className="text-sm"><span className="font-medium">Examples: </span><span className="text-muted-foreground">{type.examples}</span></div>
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

        {/* Form 1023 Comparison */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{c.form1023.heading}</h2>
                <p className="text-lg text-muted-foreground">{c.form1023.subheading}</p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {[c.form1023.ez, c.form1023.standard].map((form, i) => (
                  <Card key={i} className="border-border/50">
                    <CardHeader>
                      <CardTitle>{form.name}</CardTitle>
                      <div className="text-2xl font-bold text-secondary">{form.fee}</div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      {[
                        { label: "Eligibility", value: form.eligibility },
                        { label: "Length", value: form.length },
                        { label: "Processing Time", value: form.processingTime },
                        { label: "Best For", value: form.bestFor },
                      ].map((item, j) => (
                        <div key={j} className="text-sm"><span className="font-medium">{item.label}: </span><span className="text-muted-foreground">{item.value}</span></div>
                      ))}
                    </CardContent>
                  </Card>
                ))}
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

        {/* Annual Requirements */}
        <section className="py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6" />
                <h2 className="text-3xl md:text-4xl font-bold mb-4">{c.annualRequirements.heading}</h2>
                <p className="text-lg text-muted-foreground">{c.annualRequirements.subheading}</p>
              </div>
              <Card className="border-border/50">
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    {c.annualRequirements.items.map((req, index) => (
                      <div key={index} className="flex items-start gap-4 p-4 bg-muted/30 rounded-lg">
                        <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center flex-shrink-0"><FileText className="h-5 w-5 text-primary" /></div>
                        <div><p className="font-medium text-foreground">{req.form}</p><p className="text-sm text-muted-foreground">{req.description}</p></div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
              <div className="mt-6 p-4 bg-destructive/5 rounded-lg border border-destructive/20">
                <div className="flex items-start gap-3">
                  <AlertTriangle className="h-5 w-5 text-destructive flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-muted-foreground"><span className="font-medium text-destructive">{c.annualRequirements.warning}</span></p>
                </div>
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
                  <Link to="/consultation" onClick={() => trackClick(c.cta.ctaSecondary, 'nonprofit_bottom_cta', '/consultation')}>{c.cta.ctaSecondary}</Link>
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
