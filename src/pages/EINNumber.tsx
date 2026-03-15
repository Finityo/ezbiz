import SEOHead from "@/components/SEOHead";
import Navigation from "@/components/Navigation";
import ServiceJsonLd from "@/components/ServiceJsonLd";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, FileText, Shield, Clock, Building, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { EIN_COPY } from "@/content/ezbizCopy";

const c = EIN_COPY;
const cardIcons = [Building, Shield, FileText, Clock];

const EINNumber = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="EIN Number Filing" description="Get your Employer Identification Number (EIN) from the IRS. Required for business bank accounts, hiring, and tax filing." path="/ein-number" />
      <ServiceJsonLd serviceName="EIN Number Filing" description="Get your Employer Identification Number (EIN) from the IRS. Required for business bank accounts, hiring employees, and tax filing." url="/ein-number" />
      <Navigation />
      
      <main>
        {/* Hero */}
        <section className="gradient-hero text-primary-foreground py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-bold mb-6">{c.hero.headline}</h1>
              <p className="text-xl mb-8 text-primary-foreground/90">{c.hero.subheadline}</p>
              <Button size="lg" variant="secondary" className="text-lg px-8 py-6" asChild>
                <Link to="/order-flow">{c.hero.ctaPrimary} <ArrowRight className="ml-2 h-5 w-5" /></Link>
              </Button>
            </div>
          </div>
        </section>

        {/* What is EIN */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">{c.whatIs.heading}</h2>
              <p className="text-xl text-muted-foreground mb-8">{c.whatIs.description}</p>
            </div>
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-6">{c.whoNeeds.heading}</h3>
                <div className="space-y-4">
                  {c.whoNeeds.items.map((need, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                      <span className="text-muted-foreground">{need}</span>
                    </div>
                  ))}
                </div>
              </div>
              <div className="bg-muted/50 p-8 rounded-lg">
                <h4 className="text-xl font-semibold mb-4">EIN Format:</h4>
                <div className="text-center">
                  <div className="text-3xl font-mono font-bold text-primary mb-4">{c.whatIs.format}</div>
                  <p className="text-sm text-muted-foreground">{c.whatIs.formatNote}</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="grid grid-cols-2 gap-6">
                {c.benefitCards.map((card, index) => {
                  const Icon = cardIcons[index];
                  return (
                    <Card key={index}>
                      <CardHeader className="text-center">
                        <Icon className="h-12 w-12 text-primary mx-auto mb-4" />
                        <CardTitle>{card.title}</CardTitle>
                      </CardHeader>
                      <CardContent><CardDescription>{card.description}</CardDescription></CardContent>
                    </Card>
                  );
                })}
              </div>
              <div>
                <h2 className="text-3xl font-bold mb-8">{c.benefits.heading}</h2>
                <div className="space-y-4">
                  {c.benefits.items.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">{c.process.heading}</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader><CardTitle>{c.process.howWeHelp}</CardTitle></CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {c.process.steps.map((step, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary text-primary-foreground rounded-full flex items-center justify-center text-sm font-semibold">{index + 1}</div>
                          <span className="text-sm text-muted-foreground">{step}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader><CardTitle>{c.process.requiredInfo.heading}</CardTitle></CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {c.process.requiredInfo.items.map((item, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">{c.pricing.heading}</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {[c.pricing.standard, c.pricing.express].map((pkg, index) => (
                  <Card key={index} className={index === 1 ? "border-primary" : ""}>
                    <CardHeader>
                      <CardTitle>{pkg.name}</CardTitle>
                      <CardDescription>{pkg.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="text-3xl font-bold mb-4">{pkg.price}</div>
                      <ul className="space-y-2">
                        {pkg.features.map((feature, i) => (
                          <li key={i} className="flex items-center space-x-2">
                            <Check className="h-4 w-4 text-success" />
                            <span className="text-sm">{feature}</span>
                          </li>
                        ))}
                      </ul>
                      <Button className="w-full mt-6" asChild>
                        <Link to="/order-flow">{index === 0 ? "Get Started" : "Choose Express"}</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">{c.faq.heading}</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {[c.faq.items.slice(0, 3), c.faq.items.slice(3)].map((col, colIndex) => (
                  <div key={colIndex} className="space-y-6">
                    {col.map((faq, index) => (
                      <div key={index}>
                        <h4 className="font-semibold mb-2">{faq.question}</h4>
                        <p className="text-sm text-muted-foreground">{faq.answer}</p>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* CTA */}
        <section className="py-16 gradient-hero text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">{c.cta.heading}</h2>
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

export default EINNumber;
