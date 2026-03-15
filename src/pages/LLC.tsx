import SEOHead from "@/components/SEOHead";
import Navigation from "@/components/Navigation";
import { trackClick } from "@/hooks/useAnalytics";
import ServiceJsonLd from "@/components/ServiceJsonLd";
import FaqJsonLd from "@/components/FaqJsonLd";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import BackToTop from "@/components/BackToTop";
import AnimatedSection from "@/components/AnimatedSection";
import StaggeredGrid from "@/components/StaggeredGrid";
import RelatedStructures from "@/components/RelatedStructures";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Check, X, Shield, DollarSign, Users, FileText, Building, AlertTriangle, TrendingUp, ArrowRight, HelpCircle, Scale } from "lucide-react";
import { Link } from "react-router-dom";
import { EZBIZ_COPY } from "@/content/ezbizCopy";

const { llcPage } = EZBIZ_COPY;

const benefitIcons = [Shield, DollarSign, FileText, Building, Users, TrendingUp];
const whatIsIcons = [Shield, Scale, DollarSign];

const LLC = () => {
  // Map FAQ items for JSON-LD
  const faqs = llcPage.faq.items.map(f => ({ question: f.question, answer: f.answer }));

  const ComparisonValue = ({ value }: { value: boolean | string }) => {
    if (typeof value === "boolean") {
      return value 
        ? <Check className="h-5 w-5 text-success mx-auto" /> 
        : <X className="h-5 w-5 text-destructive mx-auto" />;
    }
    const colorClass = value === "None" ? "text-success" : value === "Limited" ? "text-warning" : value === "Simple" ? "text-success" : value === "Moderate" ? "text-success" : "text-destructive";
    return <span className={colorClass}>{value}</span>;
  };

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="LLC Formation Services" description="Form your Limited Liability Company quickly and affordably. Expert LLC formation in all 50 states with liability protection and tax flexibility." path="/form-llc" />
      <ServiceJsonLd serviceName="LLC Formation Services" description="Form your Limited Liability Company quickly and affordably. Expert LLC formation in all 50 states with liability protection and tax flexibility." url="/form-llc" />
      <FaqJsonLd faqs={faqs} />
      <Navigation />
      <FloatingCTA />
      <BackToTop />
      
      <main>
        {/* Hero Section */}
        <section className="gradient-hero text-primary-foreground py-12 sm:py-16 lg:py-28 relative overflow-hidden pattern-geometric">
          <div className="absolute inset-0 pattern-dots opacity-30"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <Badge className="mb-4 sm:mb-6 bg-white/20 text-primary-foreground hover:bg-white/30 text-xs sm:text-sm">
                {llcPage.hero.badge}
              </Badge>
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6">{llcPage.hero.headline}</h1>
              <p className="text-base sm:text-xl md:text-2xl mb-3 sm:mb-4 text-primary-foreground/90">{llcPage.hero.subheadline}</p>
              <p className="text-sm sm:text-lg mb-6 sm:mb-8 text-primary-foreground/80 max-w-2xl mx-auto">{llcPage.hero.description}</p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6" asChild>
                  <Link to="/order-flow">{llcPage.hero.ctaPrimary} <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" /></Link>
                </Button>
                <Button size="lg" variant="outline" className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 border-primary-foreground/30 text-primary-foreground hover:bg-white/10" asChild>
                  <Link to="/consultation">{llcPage.hero.ctaSecondary}</Link>
                </Button>
              </div>
              <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-6 mt-6 sm:mt-8 text-xs sm:text-sm text-primary-foreground/80">
                {llcPage.hero.badges.map((badge, i) => (
                  <div key={i} className="flex items-center gap-2">
                    <Check className="h-4 w-4" />
                    <span>{badge}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* What Is Section */}
        <AnimatedSection className="py-10 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="accent-line-center mb-4 sm:mb-6" />
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-center mb-4 sm:mb-6">{llcPage.whatIs.heading}</h2>
              <div className="prose prose-sm sm:prose-lg max-w-none text-muted-foreground space-y-3 sm:space-y-4">
                {llcPage.whatIs.paragraphs.map((p, i) => (
                  <p key={i} className={i === 2 ? "hidden sm:block" : ""} dangerouslySetInnerHTML={{ __html: p }} />
                ))}
              </div>
              
              <StaggeredGrid className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12" staggerDelay={150}>
                {llcPage.whatIs.cards.map((card, i) => {
                  const IconComponent = whatIsIcons[i];
                  return (
                    <Card key={i} className="text-center border-border/50">
                      <CardHeader className="pb-2 sm:pb-4">
                        <div className="w-10 h-10 sm:w-12 sm:h-12 bg-secondary/10 rounded-full flex items-center justify-center mx-auto mb-3 sm:mb-4">
                          <IconComponent className="h-5 w-5 sm:h-6 sm:w-6 text-secondary" />
                        </div>
                        <CardTitle className="text-base sm:text-lg">{card.title}</CardTitle>
                      </CardHeader>
                      <CardContent className="pt-0">
                        <CardDescription className="text-xs sm:text-sm">{card.description}</CardDescription>
                      </CardContent>
                    </Card>
                  );
                })}
              </StaggeredGrid>
            </div>
          </div>
        </AnimatedSection>

        {/* Benefits Section */}
        <AnimatedSection className="py-10 sm:py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8 sm:mb-12">
                <div className="accent-line-center mb-4 sm:mb-6" />
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">{llcPage.benefits.heading}</h2>
                <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto">{llcPage.benefits.subheading}</p>
              </div>
              
              <StaggeredGrid className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6" staggerDelay={100}>
                {llcPage.benefits.items.map((benefit, index) => {
                  const IconComponent = benefitIcons[index];
                  return (
                    <Card key={index} className="border-border/50 hover:shadow-elegant transition-smooth">
                      <CardHeader className="p-4 sm:p-6">
                        <div className="flex items-start gap-3 sm:gap-4">
                          <div className="w-9 h-9 sm:w-10 sm:h-10 bg-success/10 rounded-lg flex items-center justify-center flex-shrink-0">
                            <IconComponent className="h-4 w-4 sm:h-5 sm:w-5 text-success" />
                          </div>
                          <div>
                            <CardTitle className="text-base sm:text-lg mb-1.5 sm:mb-2">{benefit.title}</CardTitle>
                            <CardDescription className="text-xs sm:text-sm leading-relaxed">{benefit.description}</CardDescription>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  );
                })}
              </StaggeredGrid>
            </div>
          </div>
        </AnimatedSection>

        {/* Drawbacks Section */}
        <AnimatedSection className="py-10 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-8 sm:mb-12">
                <div className="accent-line-center mb-4 sm:mb-6" />
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">{llcPage.drawbacks.heading}</h2>
                <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto">{llcPage.drawbacks.subheading}</p>
              </div>
              
              <StaggeredGrid className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6" staggerDelay={120}>
                {llcPage.drawbacks.items.map((drawback, index) => (
                  <Card key={index} className={`border-l-4 ${drawback.severity === 'medium' ? 'border-l-warning' : 'border-l-muted-foreground'}`}>
                    <CardHeader className="p-4 sm:p-6">
                      <div className="flex items-start gap-3 sm:gap-4">
                        <div className={`w-9 h-9 sm:w-10 sm:h-10 rounded-lg flex items-center justify-center flex-shrink-0 ${drawback.severity === 'medium' ? 'bg-warning/10' : 'bg-muted'}`}>
                          <AlertTriangle className={`h-4 w-4 sm:h-5 sm:w-5 ${drawback.severity === 'medium' ? 'text-warning' : 'text-muted-foreground'}`} />
                        </div>
                        <div>
                          <CardTitle className="text-base sm:text-lg mb-1.5 sm:mb-2">{drawback.title}</CardTitle>
                          <CardDescription className="text-xs sm:text-sm leading-relaxed">{drawback.description}</CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                ))}
              </StaggeredGrid>
            </div>
          </div>
        </AnimatedSection>

        {/* Tax Options Section */}
        <AnimatedSection className="py-10 sm:py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-8 sm:mb-12">
                <div className="accent-line-center mb-4 sm:mb-6" />
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">{llcPage.taxOptions.heading}</h2>
                <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto">{llcPage.taxOptions.subheading}</p>
              </div>
              
              <StaggeredGrid className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6" staggerDelay={150}>
                {llcPage.taxOptions.items.map((option, index) => (
                  <Card key={index} className="border-border/50 h-full">
                    <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                      <CardTitle className="text-base sm:text-lg">{option.election}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 sm:p-6 pt-0 space-y-3 sm:space-y-4">
                      <p className="text-xs sm:text-sm text-muted-foreground">{option.description}</p>
                      <div className="pt-3 sm:pt-4 border-t border-border/50">
                        <p className="text-xs sm:text-sm">
                          <span className="font-medium text-foreground">Best For:</span>{" "}
                          <span className="text-muted-foreground">{option.bestFor}</span>
                        </p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </StaggeredGrid>
              
              <p className="text-xs sm:text-sm text-muted-foreground mt-4 sm:mt-6 text-center">{llcPage.taxOptions.disclaimer}</p>
            </div>
          </div>
        </AnimatedSection>

        {/* Who Should Choose Section */}
        <section className="py-10 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-8 sm:mb-12">
                <div className="accent-line-center mb-4 sm:mb-6" />
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">{llcPage.suitability.heading}</h2>
                <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto">{llcPage.suitability.subheading}</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-8">
                <Card className="border-success/30">
                  <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                    <CardTitle className="flex items-center gap-2 text-success text-base sm:text-xl">
                      <Check className="h-4 w-4 sm:h-5 sm:w-5" />
                      Ideal For
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <ul className="space-y-2 sm:space-y-3">
                      {llcPage.suitability.idealFor.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 sm:gap-3">
                          <Check className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-success mt-0.5 sm:mt-1 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="border-destructive/30">
                  <CardHeader className="p-4 sm:p-6 pb-2 sm:pb-4">
                    <CardTitle className="flex items-center gap-2 text-destructive text-base sm:text-xl">
                      <X className="h-4 w-4 sm:h-5 sm:w-5" />
                      Consider Alternatives
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6 pt-0">
                    <ul className="space-y-2 sm:space-y-3">
                      {llcPage.suitability.notIdealFor.map((item, index) => (
                        <li key={index} className="flex items-start gap-2 sm:gap-3">
                          <X className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-destructive mt-0.5 sm:mt-1 flex-shrink-0" />
                          <span className="text-xs sm:text-sm text-muted-foreground">{item}</span>
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
        <section className="py-10 sm:py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-8 sm:mb-12">
                <div className="accent-line-center mb-4 sm:mb-6" />
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">{llcPage.formationSteps.heading}</h2>
                <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto">{llcPage.formationSteps.subheading}</p>
              </div>
              
              <div className="space-y-4 sm:space-y-6">
                {llcPage.formationSteps.steps.map((step, index) => (
                  <div key={index} className="flex gap-3 sm:gap-6 items-start">
                    <div className="w-10 h-10 sm:w-12 sm:h-12 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm sm:text-lg font-bold flex-shrink-0">
                      {step.step}
                    </div>
                    <Card className="flex-1 border-border/50">
                      <CardHeader className="p-3 sm:p-6 pb-1 sm:pb-2">
                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 sm:gap-0">
                          <CardTitle className="text-sm sm:text-lg">{step.title}</CardTitle>
                          <span className="text-[10px] sm:text-xs bg-secondary/10 text-secondary px-2 sm:px-3 py-0.5 sm:py-1 rounded-full font-medium self-start sm:self-auto">
                            {step.timeline}
                          </span>
                        </div>
                      </CardHeader>
                      <CardContent className="p-3 sm:p-6 pt-0">
                        <CardDescription className="text-xs sm:text-sm">{step.description}</CardDescription>
                      </CardContent>
                    </Card>
                  </div>
                ))}
              </div>
              
              <div className="mt-8 sm:mt-12 text-center">
                <Button size="lg" className="px-6 sm:px-8" asChild>
                  <Link to="/order-flow">{llcPage.hero.ctaPrimary} <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" /></Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Comparison Table */}
        <section className="py-10 sm:py-16 lg:py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto">
              <div className="text-center mb-8 sm:mb-12">
                <div className="accent-line-center mb-4 sm:mb-6" />
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">{llcPage.comparison.heading}</h2>
                <p className="text-sm sm:text-lg text-muted-foreground max-w-2xl mx-auto">{llcPage.comparison.subheading}</p>
              </div>
              
              {/* Desktop Table */}
              <div className="hidden sm:block overflow-x-auto">
                <table className="w-full bg-card rounded-xl border border-border/50 overflow-hidden">
                  <thead>
                    <tr className="bg-primary text-primary-foreground">
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-left font-semibold text-sm">Feature</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-center font-semibold text-sm">Sole Prop</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-center font-semibold text-sm bg-secondary/20">LLC</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-center font-semibold text-sm">S-Corp</th>
                      <th className="px-4 sm:px-6 py-3 sm:py-4 text-center font-semibold text-sm">C-Corp</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-border/50">
                    {llcPage.comparison.data.map((row, i) => (
                      <tr key={i} className={i % 2 === 1 ? "bg-muted/30" : ""}>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 font-medium text-sm">{row.feature}</td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-sm"><ComparisonValue value={row.soleProp} /></td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-sm bg-secondary/5"><ComparisonValue value={row.llc} /></td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-sm"><ComparisonValue value={row.sCorp} /></td>
                        <td className="px-4 sm:px-6 py-3 sm:py-4 text-center text-sm"><ComparisonValue value={row.cCorp} /></td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Cards */}
              <div className="sm:hidden space-y-3">
                {llcPage.comparison.data.map((row, i) => (
                  <Card key={i} className="border-border/50">
                    <CardHeader className="p-3 pb-2">
                      <CardTitle className="text-sm font-semibold">{row.feature}</CardTitle>
                    </CardHeader>
                    <CardContent className="p-3 pt-0">
                      <div className="grid grid-cols-4 gap-2 text-center text-xs">
                        <div>
                          <div className="text-muted-foreground mb-1">Sole Prop</div>
                          <ComparisonValue value={row.soleProp} />
                        </div>
                        <div className="bg-secondary/5 rounded-md py-1">
                          <div className="text-secondary font-medium mb-1">LLC</div>
                          <ComparisonValue value={row.llc} />
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">S-Corp</div>
                          <ComparisonValue value={row.sCorp} />
                        </div>
                        <div>
                          <div className="text-muted-foreground mb-1">C-Corp</div>
                          <ComparisonValue value={row.cCorp} />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
              
              <div className="mt-6 sm:mt-8 flex flex-wrap justify-center gap-3 sm:gap-4">
                <Button variant="outline" size="sm" className="text-xs sm:text-sm" asChild>
                  <Link to="/sole-proprietorship">Sole Proprietorships</Link>
                </Button>
                <Button variant="outline" size="sm" className="text-xs sm:text-sm" asChild>
                  <Link to="/s-corporation">S Corporations</Link>
                </Button>
                <Button variant="outline" size="sm" className="text-xs sm:text-sm" asChild>
                  <Link to="/c-corporation">C Corporations</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-10 sm:py-16 lg:py-20 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-8 sm:mb-12">
                <div className="accent-line-center mb-4 sm:mb-6" />
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-3 sm:mb-4">{llcPage.faq.heading}</h2>
                <p className="text-sm sm:text-lg text-muted-foreground">{llcPage.faq.subheading}</p>
              </div>
              
              <Accordion type="single" collapsible className="space-y-3 sm:space-y-4">
                {llcPage.faq.items.map((faq, index) => (
                  <AccordionItem key={index} value={`item-${index}`} className="bg-card border border-border/50 rounded-lg px-4 sm:px-6">
                    <AccordionTrigger className="text-left hover:no-underline py-4 sm:py-6">
                      <span className="flex items-start gap-2 sm:gap-3 pr-4">
                        <HelpCircle className="h-4 w-4 sm:h-5 sm:w-5 text-secondary flex-shrink-0 mt-0.5" />
                        <span className="font-medium text-sm sm:text-base">{faq.question}</span>
                      </span>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 sm:pb-6 pl-6 sm:pl-8 text-xs sm:text-sm text-muted-foreground leading-relaxed">
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
        <section className="py-10 sm:py-16 lg:py-20 gradient-hero text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 sm:mb-6">{llcPage.cta.heading}</h2>
              <p className="text-base sm:text-xl text-primary-foreground/90 mb-6 sm:mb-8">{llcPage.cta.subheading}</p>
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6" asChild>
                  <Link to="/order-flow">{llcPage.cta.ctaPrimary} <ArrowRight className="ml-2 h-4 w-4 sm:h-5 sm:w-5" /></Link>
                </Button>
                <Button size="lg" variant="outline" className="text-base sm:text-lg px-6 sm:px-8 py-5 sm:py-6 border-primary-foreground/30 text-primary-foreground hover:bg-white/10" asChild>
                  <Link to="/consultation">{llcPage.cta.ctaSecondary}</Link>
                </Button>
              </div>
              <p className="mt-4 sm:mt-6 text-xs sm:text-sm text-primary-foreground/70">{llcPage.cta.footnote}</p>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default LLC;
