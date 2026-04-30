import { Link } from "react-router-dom";
import {
  Lightbulb,
  Clock,
  DollarSign,
  ShieldCheck,
  Sparkles,
  Rocket,
  ArrowRight,
  CheckCircle2,
  HelpCircle,
} from "lucide-react";
import SEOHead from "@/components/SEOHead";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import BackToTop from "@/components/BackToTop";
import AnimatedSection from "@/components/AnimatedSection";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const PROBLEMS = [
  {
    icon: Clock,
    title: "Endless paperwork eats your runway",
    body:
      "Articles, EIN, operating agreement, state filings — every form is a new rabbit hole when you should be talking to customers.",
  },
  {
    icon: DollarSign,
    title: "Hidden fees stack up fast",
    body:
      "State fees, registered-agent renewals, compliance reminders — the “$49 LLC” usually isn’t.",
  },
  {
    icon: ShieldCheck,
    title: "One mistake can cost you the entity",
    body:
      "Miss an annual report, mis-file an EIN, or pick the wrong structure and you risk fines, dissolution, or piercing the corporate veil.",
  },
  {
    icon: Lightbulb,
    title: "You have an idea — not a legal team",
    body:
      "Most founders aren’t lawyers. You need someone to handle the boring, expensive, easy-to-mess-up parts.",
  },
];

const SOLUTIONS = [
  {
    icon: Sparkles,
    title: "One guided flow, end to end",
    body:
      "Pick a state, answer plain-English questions, and we file everything — formation, EIN, registered agent, operating agreement.",
  },
  {
    icon: DollarSign,
    title: "Flat, transparent pricing",
    body:
      "State fees shown upfront. No surprise renewals. White-glove option for founders who want a human on the line.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance on autopilot",
    body:
      "Annual report reminders, registered-agent service, document vault — all in your dashboard.",
  },
  {
    icon: Rocket,
    title: "Built for founders, not lawyers",
    body:
      "If you can describe your business in two sentences, you can launch it on EZ Biz in under 15 minutes.",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Tell us about your idea",
    body: "Pick your state and entity type. We recommend the right structure based on your goals.",
  },
  {
    number: "02",
    title: "Answer a few questions",
    body: "Owners, address, purpose. We pre-fill everything we can and explain what we can’t.",
  },
  {
    number: "03",
    title: "We file with the state",
    body: "Formation docs, EIN, operating agreement, registered agent — submitted and tracked.",
  },
  {
    number: "04",
    title: "Get back to building",
    body: "Documents land in your dashboard. We keep you compliant year-round.",
  },
];

// Map each plan to the canonical PackageType in src/lib/pricing.ts.
// The order flow reads ?package= and passes the corresponding stripePriceId
// to create-checkout, guaranteeing the right Stripe Price is charged.
const PRICING_TEASER = [
  {
    name: "Basic",
    packageId: "basic",
    price: "$129",
    note: "+ state fee",
    features: [
      "Prepare & file Articles of Organization",
      "Name availability search",
      "Digital filing documents",
      "Lifetime customer support",
    ],
    cta: "Start with Basic",
  },
  {
    name: "Deluxe",
    packageId: "deluxe",
    price: "$279",
    note: "+ state fee",
    highlight: true,
    features: [
      "Everything in Basic",
      "Operating Agreement",
      "Banking Resolution",
      "Priority support",
    ],
    cta: "Start with Deluxe",
  },
  {
    name: "Complete",
    packageId: "complete",
    price: "$349",
    note: "+ state fee",
    features: [
      "Everything in Deluxe",
      "EIN filing service",
      "S-Corp election filing",
      "Business license research",
    ],
    cta: "Start with Complete",
  },
];

const FAQS = [
  {
    q: "I just have an idea — is it too early to form an LLC?",
    a: "If you’re collecting payments, signing contracts, or building IP, it’s the right time. Forming early protects your personal assets and lets you open a business bank account.",
  },
  {
    q: "Which state should I form in?",
    a: "Most founders should form in the state where they actually operate. Delaware/Wyoming/Nevada make sense for venture-backed companies or specific tax/privacy reasons — we’ll guide you.",
  },
  {
    q: "LLC or Corporation — how do I choose?",
    a: "LLCs offer flexibility and pass-through taxes; great for solo founders and small teams. C-Corps are standard for raising venture capital. Our guided flow recommends one based on your plans.",
  },
  {
    q: "What does ‘registered agent’ mean and do I need one?",
    a: "Every state requires a registered agent — a person or service that receives legal mail on your business’s behalf. We include it in Growth and White Glove.",
  },
  {
    q: "How fast can I get filed?",
    a: "Standard filings complete in your state’s normal turnaround (typically 5–15 business days). White Glove includes priority filing where the state offers it.",
  },
  {
    q: "What if I mess something up later?",
    a: "We track your annual reports, registered-agent renewals, and key compliance dates. If anything needs your attention, you’ll see it in the dashboard and get an email.",
  },
  {
    q: "Do you offer refunds?",
    a: "Yes — full refund before we submit to the state. After submission, state fees are non-refundable but our service fees are. See our refund policy for details.",
  },
];

const Entrepreneurs = () => {
  return (
    <div className="min-h-screen bg-background">
      <SEOHead
        title="For Entrepreneurs & Idea Holders | EZ Biz Filing"
        description="Turn your idea into a real business. Form your LLC or Corporation in minutes — paperwork, EIN, registered agent, and compliance handled for you."
        path="/entrepreneurs"
      />
      <Navigation />
      <FloatingCTA />
      <BackToTop />

      <main>
        {/* Hero */}
        <section className="gradient-executive text-primary-foreground py-20 relative overflow-hidden pattern-geometric">
          <div className="absolute inset-0 pattern-grid opacity-30" />
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="accent-line-center mb-6 bg-secondary" />
              <h1 className="text-4xl md:text-5xl font-bold mb-6 font-display">
                You bring the idea. We handle the legal.
              </h1>
              <p className="text-lg md:text-xl mb-8 opacity-90 font-body max-w-2xl mx-auto">
                EZ Biz turns "I should start a business" into a filed entity, EIN, and bank-ready
                docs — usually in under 15 minutes.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Button
                  size="lg"
                  variant="secondary"
                  asChild
                  className="font-semibold"
                >
                  <Link to="/start-order">
                    Start your business <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  asChild
                  className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
                >
                  <Link to="/consultation">Book a free 15-min call</Link>
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* Problem */}
        <AnimatedSection>
          <section className="py-20 bg-card">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center mb-12">
                <p className="text-sm font-semibold tracking-widest text-secondary uppercase mb-3">
                  The Problem
                </p>
                <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">
                  Starting a company shouldn't feel like filing taxes
                </h2>
                <p className="text-muted-foreground mt-4 font-body">
                  Most founders lose weeks (and hundreds of dollars) trying to figure out the boring
                  parts. Here's what slows people down:
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {PROBLEMS.map(({ icon: Icon, title, body }) => (
                  <Card key={title} className="border-border/60">
                    <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                      <div className="rounded-lg bg-secondary/10 p-3">
                        <Icon className="h-6 w-6 text-secondary" />
                      </div>
                      <div>
                        <CardTitle className="text-lg font-display">{title}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="text-muted-foreground font-body">{body}</CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* Solution */}
        <AnimatedSection>
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center mb-12">
                <p className="text-sm font-semibold tracking-widest text-secondary uppercase mb-3">
                  The Solution
                </p>
                <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">
                  EZ Biz is the founder's launchpad
                </h2>
                <p className="text-muted-foreground mt-4 font-body">
                  One guided flow that replaces lawyers, accountants, and a stack of state forms.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6 max-w-5xl mx-auto">
                {SOLUTIONS.map(({ icon: Icon, title, body }) => (
                  <Card key={title} className="border-border/60 hover:shadow-lg transition-shadow">
                    <CardHeader className="flex flex-row items-start gap-4 space-y-0">
                      <div className="rounded-lg bg-primary/5 p-3">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg font-display">{title}</CardTitle>
                    </CardHeader>
                    <CardContent className="text-muted-foreground font-body">{body}</CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* How It Works */}
        <AnimatedSection>
          <section className="py-20 bg-card">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center mb-12">
                <p className="text-sm font-semibold tracking-widest text-secondary uppercase mb-3">
                  How It Works
                </p>
                <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">
                  From idea to filed entity in 4 steps
                </h2>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
                {STEPS.map((step) => (
                  <div
                    key={step.number}
                    className="relative bg-background rounded-lg border border-border p-6"
                  >
                    <div className="text-5xl font-bold font-display text-secondary/30 mb-3">
                      {step.number}
                    </div>
                    <h3 className="text-lg font-semibold font-display mb-2">{step.title}</h3>
                    <p className="text-sm text-muted-foreground font-body">{step.body}</p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* Pricing Teaser */}
        <AnimatedSection>
          <section className="py-20 bg-background">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto text-center mb-12">
                <p className="text-sm font-semibold tracking-widest text-secondary uppercase mb-3">
                  Pricing
                </p>
                <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">
                  Pick a plan that matches your stage
                </h2>
                <p className="text-muted-foreground mt-4 font-body">
                  Transparent flat-rate packages. State fees shown upfront — no surprises.
                </p>
              </div>
              <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {PRICING_TEASER.map((tier) => (
                  <Card
                    key={tier.name}
                    className={
                      tier.highlight
                        ? "border-secondary border-2 shadow-xl relative"
                        : "border-border/60"
                    }
                  >
                    {tier.highlight && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground text-xs font-bold px-3 py-1 rounded-full">
                        MOST POPULAR
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="font-display">{tier.name}</CardTitle>
                      <div className="flex items-baseline gap-2 pt-2">
                        <span className="text-4xl font-bold font-display text-primary">
                          {tier.price}
                        </span>
                        <span className="text-sm text-muted-foreground">{tier.note}</span>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2 mb-6">
                        {tier.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-sm font-body">
                            <CheckCircle2 className="h-4 w-4 text-secondary mt-0.5 flex-shrink-0" />
                            <span>{f}</span>
                          </li>
                        ))}
                      </ul>
                      <Button
                        asChild
                        variant={tier.highlight ? "default" : "outline"}
                        className="w-full"
                      >
                        <Link to={`/order-flow?package=${tier.packageId}`}>{tier.cta}</Link>
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="text-center mt-8">
                <Link
                  to="/pricing"
                  className="text-sm text-secondary font-semibold hover:underline inline-flex items-center gap-1"
                >
                  Compare full pricing <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* FAQ */}
        <AnimatedSection>
          <section className="py-20 bg-card">
            <div className="container mx-auto px-4">
              <div className="max-w-3xl mx-auto">
                <div className="text-center mb-12">
                  <p className="text-sm font-semibold tracking-widest text-secondary uppercase mb-3">
                    FAQ
                  </p>
                  <h2 className="text-3xl md:text-4xl font-bold font-display text-foreground">
                    Questions first-time founders ask
                  </h2>
                </div>
                <Accordion type="single" collapsible className="w-full">
                  {FAQS.map((faq, i) => (
                    <AccordionItem key={i} value={`item-${i}`}>
                      <AccordionTrigger className="text-left font-display">
                        <span className="flex items-start gap-3">
                          <HelpCircle className="h-5 w-5 text-secondary mt-0.5 flex-shrink-0" />
                          {faq.q}
                        </span>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground font-body pl-8">
                        {faq.a}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </div>
            </div>
          </section>
        </AnimatedSection>

        {/* Final CTA */}
        <section className="gradient-executive text-primary-foreground py-16">
          <div className="container mx-auto px-4 text-center max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-bold font-display mb-4">
              Ready to make it real?
            </h2>
            <p className="opacity-90 mb-8 font-body">
              Most founders complete their formation in under 15 minutes. State fees are clearly shown
              before you pay.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" variant="secondary" asChild className="font-semibold">
                <Link to="/start-order">
                  Start now <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button
                size="lg"
                variant="outline"
                asChild
                className="bg-transparent border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10"
              >
                <Link to="/consultation">Talk to a specialist</Link>
              </Button>
            </div>
          </div>
        </section>

        {/* JSON-LD FAQ schema */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: FAQS.map((f) => ({
                "@type": "Question",
                name: f.q,
                acceptedAnswer: { "@type": "Answer", text: f.a },
              })),
            }),
          }}
        />
      </main>

      <Footer />
    </div>
  );
};

export default Entrepreneurs;
