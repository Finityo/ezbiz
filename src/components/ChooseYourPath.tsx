import { trackClick } from "@/hooks/useAnalytics";
import { trackEvent } from "@/lib/analytics";
import { openAcuityPopup } from "@/components/consultation/ConsultationTypeCard";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Globe,
  MessageCircle,
  Car,
  Shield,
  Zap,
  Star,
  Crown,
  Phone,
  Video,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import AnimatedSection from "@/components/AnimatedSection";
import StaggeredGrid from "@/components/StaggeredGrid";

const ACUITY_OWNER_ID = "38549422";

const ChooseYourPath = () => {
  const navigate = useNavigate();

  return (
    <AnimatedSection className="py-14 md:py-20 bg-muted/30 border-y border-border">
      <div className="container mx-auto px-4">
        {/* Beta Banner */}
        <div className="max-w-3xl mx-auto mb-8">
          <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-secondary/10 border border-secondary/20 text-sm font-body">
            <span className="font-semibold text-secondary">🧪 Beta Testing:</span>
            <span className="text-muted-foreground">
              Please click through the full flow and leave feedback using the floating box.
            </span>
          </div>
        </div>

        {/* Veteran Highlight */}
        <div className="max-w-3xl mx-auto mb-10">
          <div className="flex items-center gap-2 px-4 py-2.5 rounded-lg bg-primary/[0.06] border border-primary/15 text-sm font-body">
            <Shield className="h-4 w-4 text-primary flex-shrink-0" />
            <span>
              <strong className="font-semibold text-foreground">Veteran-Owned.</strong>{" "}
              <span className="text-muted-foreground">
                Eligible Texas veterans may qualify for a state filing fee waiver (up to $310).
              </span>
            </span>
          </div>
        </div>

        {/* Section Heading */}
        <div className="text-center space-y-3 mb-10 md:mb-14">
          <div className="accent-line-center mb-4 md:mb-6"></div>
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-bold font-display">
            Start Your Business — Choose Your Path
          </h2>
          <p className="text-lg text-muted-foreground font-body max-w-2xl mx-auto">
            Pick the experience that matches how hands-on you want this to be.
          </p>
        </div>

        {/* 3-Card Grid */}
        <StaggeredGrid
          className="grid md:grid-cols-3 gap-6 lg:gap-8 max-w-6xl mx-auto"
          staggerDelay={120}
        >
          {/* ── Option 1: File Online (CorpNet) ── */}
          <Card className="relative flex flex-col h-full border-border shadow-smooth transition-all duration-300 hover:shadow-elegant">
            <CardHeader className="text-center pb-2 pt-8">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary/10 text-primary border-primary/20 z-20 px-4">
                <Zap className="h-3 w-3 mr-1" />
                Fastest
              </Badge>
              <div className="inline-flex p-4 rounded-2xl mx-auto mb-3 bg-primary/10 text-primary">
                <Globe className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl font-display">
                Option 1: File Online (Self-Directed)
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col text-center space-y-4">
              <p className="text-muted-foreground font-body leading-relaxed flex-1">
                Complete your formation through our trusted filing partner. Best for
                self-starters who want to move fast.
              </p>

              <Button
                size="lg"
                className="w-full group"
                onClick={() => {
                  trackEvent("choose_path_click", {
                    option: "online_filing",
                    destination: "corpnet",
                  });
                  trackClick(
                    "Start Filing Online",
                    "choose_path_online",
                    "https://www.corpnet.com/?pid=16443"
                  );
                  window.open(
                    "https://www.corpnet.com/?pid=16443",
                    "_blank",
                    "noopener,noreferrer"
                  );
                }}
              >
                Start Filing Online
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>

              <p className="text-[10px] text-muted-foreground/70 font-body leading-snug">
                You will be redirected to our trusted filing partner (CorpNet) to
                complete your formation. EZ BIZ File Service, LLC may earn a referral
                commission at no additional cost to you.
              </p>
            </CardContent>
          </Card>

          {/* ── Option 2: Guided Filing ── */}
          <Card className="relative flex flex-col h-full border-secondary shadow-lg ring-1 ring-secondary/20 transition-all duration-300 hover:shadow-elegant">
            <CardHeader className="text-center pb-2 pt-8">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-secondary text-secondary-foreground z-20 px-4">
                <Star className="h-3 w-3 mr-1 fill-current" />
                Most Popular
              </Badge>
              <div className="inline-flex p-4 rounded-2xl mx-auto mb-3 bg-secondary/10 text-secondary">
                <MessageCircle className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl font-display">
                Option 2: Guided Filing (Zoom / Call)
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col text-center space-y-4">
              <p className="text-muted-foreground font-body leading-relaxed flex-1">
                We meet with you on Zoom or by phone, walk you through the
                information, and submit the order with you.
              </p>

              <div className="flex flex-col gap-2">
                <Button
                  size="lg"
                  className="w-full group bg-secondary hover:bg-secondary-light text-secondary-foreground"
                  onClick={() => {
                    trackEvent("choose_path_click", {
                      option: "guided_filing",
                      destination: "/order-flow?mode=guided",
                    });
                    trackClick(
                      "Start Guided Order Flow",
                      "choose_path_guided",
                      "/order-flow?mode=guided"
                    );
                    navigate("/order-flow?mode=guided");
                  }}
                >
                  Start Guided Order Flow
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
                <Button
                  variant="outline"
                  className="w-full group border-secondary/30 text-secondary hover:bg-secondary/5"
                  onClick={() => {
                    trackEvent("choose_path_click", {
                      option: "guided_schedule_call",
                      destination: "acuity_popup",
                    });
                    openAcuityPopup(ACUITY_OWNER_ID);
                  }}
                >
                  <Phone className="h-4 w-4 mr-2" />
                  Schedule a Call
                </Button>
              </div>

              <p className="text-[10px] text-muted-foreground/70 font-body leading-snug">
                The guided flow collects your details first, then we
                schedule/confirm and submit together.
              </p>
            </CardContent>
          </Card>

          {/* ── Option 3: White Glove Mobile ── */}
          <Card className="relative flex flex-col h-full border-border shadow-smooth transition-all duration-300 hover:shadow-elegant">
            <CardHeader className="text-center pb-2 pt-8">
              <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-primary/10 text-primary border-primary/20 z-20 px-4">
                <Crown className="h-3 w-3 mr-1" />
                Premium
              </Badge>
              <div className="inline-flex p-4 rounded-2xl mx-auto mb-3 bg-primary/10 text-primary">
                <Car className="h-8 w-8" />
              </div>
              <CardTitle className="text-xl font-display">
                Option 3: White Glove Mobile Service
              </CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col text-center space-y-4">
              <p className="text-muted-foreground font-body leading-relaxed flex-1">
                We come to you (home, office, or public spot) and file your business
                live with you.
                <span className="block mt-1 font-semibold text-foreground">
                  $150 for the first 2 hours + $80/hr after.
                </span>
              </p>

              <Button
                size="lg"
                className="w-full group"
                onClick={() => {
                  trackEvent("choose_path_click", {
                    option: "whiteglove",
                    destination: "/order-flow?mode=whiteglove",
                  });
                  trackClick(
                    "Start White Glove Order Flow",
                    "choose_path_whiteglove",
                    "/order-flow?mode=whiteglove"
                  );
                  navigate("/order-flow?mode=whiteglove");
                }}
              >
                Start White Glove Order Flow
                <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
              </Button>

              <p className="text-[10px] text-muted-foreground/70 font-body leading-snug">
                Pricing in the flow will show filing fees + state fees + White Glove
                service fee.
              </p>
            </CardContent>
          </Card>
        </StaggeredGrid>
      </div>
    </AnimatedSection>
  );
};

export default ChooseYourPath;
