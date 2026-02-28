import { trackClick } from "@/hooks/useAnalytics";
import { trackEvent } from "@/lib/analytics";
import { openAcuityPopup } from "@/components/consultation/ConsultationTypeCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Globe, MessageCircle, Car } from "lucide-react";
import { useNavigate } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";
import StaggeredGrid from "@/components/StaggeredGrid";

const ACUITY_OWNER_ID = "38549422";

const ChooseYourPath = () => {
  const navigate = useNavigate();

  const paths = [
    {
      id: "online",
      badge: "Self-Directed",
      title: "File Online",
      subtitle: "Fast & Independent",
      description:
        "Complete your business formation through our trusted national filing partner. Best for entrepreneurs comfortable filing on their own.",
      price: null,
      cta: "Start Filing Online",
      icon: <Globe className="h-8 w-8" />,
      action: () => {
        trackClick("Start Filing Online", "choose_path_online", "https://www.corpnet.com/?pid=16443");
        window.open("https://www.corpnet.com/?pid=16443", "_blank", "noopener,noreferrer");
      },
      disclaimer:
        "You will be redirected to our trusted filing partner (CorpNet). EZ BIZ File Service, LLC may earn a referral commission at no additional cost to you.",
    },
    {
      id: "guided",
      badge: "Most Popular",
      popular: true,
      title: "Guided Filing",
      subtitle: "Expert-Led & Hassle-Free",
      description:
        "Schedule a free 30-minute consultation with our formation experts. We'll walk you through every step and handle the paperwork for you.",
      price: "Free Consultation",
      cta: "Schedule Free Call",
      icon: <MessageCircle className="h-8 w-8" />,
      action: () => {
        trackEvent("choose_path_guided", { location: "homepage" });
        openAcuityPopup(ACUITY_OWNER_ID);
      },
      disclaimer: null,
    },
    {
      id: "whiteglove",
      badge: "Premium",
      title: "White-Glove Mobile",
      subtitle: "We Come to You!",
      description:
        "Get in-person, step-by-step guidance from a business formation expert at your location. Hands-on help with all paperwork and filing.",
      price: "$150 / 2 hrs",
      extraPrice: "$80/hr after",
      cta: "Book Mobile Session",
      icon: <Car className="h-8 w-8" />,
      action: () => {
        trackEvent("choose_path_whiteglove", { location: "homepage" });
        openAcuityPopup(ACUITY_OWNER_ID);
      },
      disclaimer: null,
    },
  ];

  return (
    <AnimatedSection className="py-14 md:py-20 bg-muted/30 border-y border-border">
      <div className="container mx-auto px-4">
        <div className="text-center space-y-3 mb-10 md:mb-14">
          <div className="accent-line-center mb-4 md:mb-6"></div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display">
            Choose Your Path
          </h2>
          <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
            Three clear options — pick the one that fits your pace and comfort level
          </p>
        </div>

        <StaggeredGrid className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto" staggerDelay={120}>
          {paths.map((path) => (
            <Card
              key={path.id}
              className={`relative flex flex-col h-full transition-all duration-300 hover:shadow-elegant ${
                path.popular
                  ? "border-secondary shadow-lg ring-1 ring-secondary/20"
                  : "border-border shadow-smooth"
              }`}
            >
              {path.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground z-20 px-4">
                  Most Popular
                </Badge>
              )}

              <CardHeader className="text-center pb-2 pt-8">
                <div
                  className={`inline-flex p-4 rounded-2xl mx-auto mb-3 ${
                    path.popular
                      ? "bg-secondary/10 text-secondary"
                      : "bg-primary/10 text-primary"
                  }`}
                >
                  {path.icon}
                </div>
                <Badge variant="outline" className="mx-auto mb-2 text-xs font-body">
                  {path.badge}
                </Badge>
                <CardTitle className="text-xl font-display">{path.title}</CardTitle>
                <p className="text-sm font-semibold text-muted-foreground font-body">
                  {path.subtitle}
                </p>
              </CardHeader>

              <CardContent className="flex-1 flex flex-col text-center space-y-4">
                <p className="text-muted-foreground font-body leading-relaxed flex-1">
                  {path.description}
                </p>

                {/* Pricing */}
                {path.price && (
                  <div className="py-3 px-4 rounded-lg bg-muted/60">
                    <span className="text-lg font-bold text-primary font-display">
                      {path.price}
                    </span>
                    {path.extraPrice && (
                      <span className="block text-xs text-muted-foreground font-body mt-0.5">
                        + {path.extraPrice}
                      </span>
                    )}
                  </div>
                )}

                <Button
                  size="lg"
                  className={`w-full group ${
                    path.popular
                      ? "bg-secondary hover:bg-secondary-light text-secondary-foreground"
                      : ""
                  }`}
                  onClick={path.action}
                >
                  {path.cta}
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>

                {path.disclaimer && (
                  <p className="text-[10px] text-muted-foreground/70 font-body leading-snug">
                    {path.disclaimer}
                  </p>
                )}
              </CardContent>
            </Card>
          ))}
        </StaggeredGrid>
      </div>
    </AnimatedSection>
  );
};

export default ChooseYourPath;
