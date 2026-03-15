import SEOHead from "@/components/SEOHead";
import Navigation from "@/components/Navigation";
import { trackClick } from "@/hooks/useAnalytics";
import Footer from "@/components/Footer";
import FloatingCTA from "@/components/FloatingCTA";
import BackToTop from "@/components/BackToTop";
import AnimatedSection from "@/components/AnimatedSection";
import StaggeredGrid from "@/components/StaggeredGrid";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Users, Shield, Clock, Star, Award, Heart, Zap, FileText, Scale } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { EZBIZ_COPY } from "@/content/ezbizCopy";

const { about } = EZBIZ_COPY;

const statIcons = [FileText, Clock, Shield, Star];
const valueIcons = [Scale, Heart, Zap, Award];
const awardIcons = [Award, Star, Shield];

const About = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="About Us" description="Learn about EZ BIZ FILE SERVICE, LLC — trusted business formation experts helping entrepreneurs start their businesses with confidence." path="/about" />
      <Navigation />
      <FloatingCTA />
      <BackToTop />
      
      <main>
        {/* Hero Section */}
        <section className="gradient-executive text-primary-foreground py-20 relative overflow-hidden pattern-geometric">
          <div className="absolute inset-0 pattern-grid opacity-30"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto text-center">
              <div className="accent-line-center mb-6 bg-secondary"></div>
              <h1 className="text-5xl font-bold mb-6 font-display">{about.hero.headline}</h1>
              <p className="text-xl mb-8 opacity-90 font-body">{about.hero.subheadline}</p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-card border-b border-border">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {about.stats.map((stat, index) => {
                const IconComponent = statIcons[index];
                return (
                  <div key={index} className="text-center">
                    <IconComponent className="h-12 w-12 text-secondary mx-auto mb-4" />
                    <div className="text-4xl font-bold text-primary mb-2 font-display">{stat.number}</div>
                    <div className="text-muted-foreground font-body">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6"></div>
                <h2 className="text-3xl font-bold font-display">{about.story.heading}</h2>
              </div>
              <Card className="border-0 shadow-elegant">
                <CardContent className="p-8 md:p-12">
                  <div className="prose prose-lg max-w-none">
                    {about.story.paragraphs.map((p, i) => (
                      <p key={i} className={`text-lg text-muted-foreground leading-relaxed ${i < about.story.paragraphs.length - 1 ? 'mb-6' : ''} font-body`}>{p}</p>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <AnimatedSection className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6"></div>
                <h2 className="text-3xl font-bold font-display">{about.values.heading}</h2>
                <p className="text-xl text-muted-foreground mt-4 font-body">{about.values.subheading}</p>
              </div>
              <StaggeredGrid className="grid md:grid-cols-2 lg:grid-cols-4 gap-8" staggerDelay={100}>
                {about.values.items.map((value, index) => {
                  const IconComponent = valueIcons[index];
                  return (
                    <Card key={index} className="text-center h-full border-0 shadow-smooth hover:shadow-elegant transition-all">
                      <CardHeader>
                        <div className="p-4 rounded-xl bg-primary/5 w-fit mx-auto mb-4">
                          <IconComponent className="h-10 w-10 text-primary" />
                        </div>
                        <CardTitle className="text-xl font-display">{value.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-center font-body">{value.description}</CardDescription>
                      </CardContent>
                    </Card>
                  );
                })}
              </StaggeredGrid>
            </div>
          </div>
        </AnimatedSection>

        {/* Team Section */}
        <AnimatedSection className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6"></div>
                <h2 className="text-3xl font-bold font-display">{about.team.heading}</h2>
                <p className="text-xl text-muted-foreground mt-4 font-body">{about.team.subheading}</p>
              </div>
              <StaggeredGrid className="grid md:grid-cols-2 lg:grid-cols-4 gap-8" staggerDelay={120}>
                {about.team.members.map((member, index) => (
                  <Card key={index} className="text-center border-0 shadow-smooth hover:shadow-elegant transition-all">
                    <CardHeader>
                      <div className="w-20 h-20 bg-gradient-to-br from-primary to-primary-light rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Users className="h-10 w-10 text-primary-foreground" />
                      </div>
                      <CardTitle className="text-lg font-display">{member.name}</CardTitle>
                      <CardDescription className="font-semibold text-secondary">{member.role}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3 font-body">{member.bio}</p>
                      <div className="text-xs font-medium text-primary font-body">{member.credentials}</div>
                    </CardContent>
                  </Card>
                ))}
              </StaggeredGrid>
            </div>
          </div>
        </AnimatedSection>

        {/* Why Choose Us */}
        <AnimatedSection className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6"></div>
                <h2 className="text-3xl font-bold font-display">Why Choose EZ BIZ?</h2>
              </div>
              <StaggeredGrid className="grid md:grid-cols-2 gap-6" staggerDelay={80}>
                {about.whyChooseUs.map((reason, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-card shadow-smooth border border-border">
                    <Check className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                    <span className="text-foreground font-body">{reason}</span>
                  </div>
                ))}
              </StaggeredGrid>
            </div>
          </div>
        </AnimatedSection>

        {/* Awards & Recognition */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="accent-line-center mb-6"></div>
              <h2 className="text-3xl font-bold mb-12 font-display">{about.awards.heading}</h2>
              <div className="grid md:grid-cols-3 gap-8">
                {about.awards.items.map((award, index) => {
                  const IconComponent = awardIcons[index];
                  return (
                    <Card key={index} className="border-0 shadow-smooth">
                      <CardContent className="p-6 text-center">
                        <IconComponent className="h-12 w-12 text-secondary mx-auto mb-4" />
                        <h3 className="text-xl font-semibold mb-2 font-display">{award.title}</h3>
                        <p className="text-sm text-muted-foreground font-body">{award.source}</p>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="accent-line-center mb-6"></div>
              <h2 className="text-3xl font-bold mb-8 font-display">{about.mission.heading}</h2>
              <Card className="border-2 border-secondary/20 shadow-elegant">
                <CardContent className="p-8 md:p-12">
                  <blockquote className="text-2xl font-medium text-center italic text-muted-foreground leading-relaxed font-display">
                    "{about.mission.quote}"
                  </blockquote>
                  <div className="mt-8 text-right">
                    <div className="font-semibold font-display">{about.mission.attribution}</div>
                    <div className="text-sm text-muted-foreground font-body">{about.mission.attributionTitle}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Contact Info Section */}
        <section className="py-16 bg-card border-b border-border">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6 font-display">{about.office.heading}</h2>
              <div className="text-muted-foreground space-y-1 font-body">
                <p className="font-semibold text-foreground text-lg">{about.office.name}</p>
                {about.office.address.map((line, i) => (
                  <p key={i}>{line}</p>
                ))}
                <p>Phone: {about.office.phone}</p>
                <p>Email: {about.office.email}</p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 gradient-executive text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-display">{about.cta.heading}</h2>
              <p className="text-xl opacity-90 mb-8 font-body">{about.cta.subheading}</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-secondary hover:bg-secondary-light text-secondary-foreground text-lg px-8 h-14"
                  onClick={() => { trackClick(about.cta.ctaPrimary, 'about_cta', '/order-flow'); navigate('/order-flow'); }}
                >
                  {about.cta.ctaPrimary}
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 h-14 border-2 border-white/30 text-white hover:bg-white/10"
                  onClick={() => { trackClick(about.cta.ctaSecondary, 'about_cta', '/consultation'); navigate('/consultation'); }}
                >
                  {about.cta.ctaSecondary}
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

export default About;
