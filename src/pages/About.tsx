import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Users, Shield, Clock, Star, Award, Heart, Zap, FileText, Scale } from "lucide-react";
import { useNavigate } from "react-router-dom";

const About = () => {
  const navigate = useNavigate();
  
  const stats = [
    { number: "50,000+", label: "Businesses Formed", icon: FileText },
    { number: "15+", label: "Years Experience", icon: Clock },
    { number: "50", label: "States Covered", icon: Shield },
    { number: "4.9/5", label: "Customer Rating", icon: Star }
  ];

  const values = [
    {
      icon: Scale,
      title: "Old-Fashioned Integrity",
      description: "Like the filing clerks of old, we believe in doing things right the first time. Your documents deserve meticulous attention to detail."
    },
    {
      icon: Heart,
      title: "Personal Service",
      description: "Every business owner deserves the same white-glove treatment. We treat your formation like it's our own."
    },
    {
      icon: Zap,
      title: "Modern Efficiency", 
      description: "We combine timeless values with modern technology to file your documents faster than ever before."
    },
    {
      icon: Award,
      title: "Professional Excellence",
      description: "We maintain the highest standards of accuracy and professionalism in every document we prepare."
    }
  ];

  const teamMembers = [
    {
      name: "Christian Talavera, MBA, MSL",
      role: "CEO & Founder",
      bio: "15+ years in business formation law with a passion for helping entrepreneurs succeed.",
      credentials: "University of Southern California Gould School of Law"
    },
    {
      name: "Michael Chen",
      role: "Head of Operations", 
      bio: "Expert in streamlining business processes and ensuring accurate, timely filings.",
      credentials: "MBA, Wharton School"
    },
    {
      name: "Jessica Rodriguez",
      role: "Customer Success Manager",
      bio: "Dedicated to providing exceptional customer service and support throughout your business journey.",
      credentials: "B.A. Business Administration"
    },
    {
      name: "David Kim",
      role: "Legal Compliance Director",
      bio: "Ensures all filings meet state requirements and maintains relationships with state agencies.",
      credentials: "J.D., Stanford Law School"
    }
  ];

  const whyChooseUs = [
    "Expert guidance from business formation specialists",
    "Transparent pricing with no hidden fees", 
    "Fast, accurate document preparation and filing",
    "Comprehensive support throughout the process",
    "Ongoing compliance assistance and reminders",
    "100% satisfaction guarantee",
    "Licensed in all 50 states",
    "Award-winning customer service"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section className="gradient-executive text-primary-foreground py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="accent-line-center mb-6 bg-secondary"></div>
              <h1 className="text-5xl font-bold mb-6 font-display">About EZ BIZ FILE SERVICE</h1>
              <p className="text-xl mb-8 opacity-90 font-body">
                Where timeless professionalism meets modern convenience. We handle your business filings with the care and precision of a master clerk.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16 bg-card border-b border-border">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
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
                <h2 className="text-3xl font-bold font-display">Our Story</h2>
              </div>
              <Card className="border-0 shadow-elegant">
                <CardContent className="p-8 md:p-12">
                  <div className="prose prose-lg max-w-none">
                    <p className="text-lg text-muted-foreground leading-relaxed mb-6 font-body">
                      EZ BIZ FILE SERVICE was born from a simple belief: that filing your business documents should be as straightforward and dignified as walking into a clerk's office in 1929—pen in hand, paperwork in order, and a professional ready to help you make it official.
                    </p>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-6 font-body">
                      Our founder, Christian Talavera, a military veteran and legal professional, understood that behind every LLC formation and annual report is someone's dream taking shape. After experiencing the confusing maze of modern business formation services—hidden fees, impersonal processes, and unclear guidance—he set out to create something different.
                    </p>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-6 font-body">
                      What started in New Braunfels, Texas—one of the nation's fastest-growing cities—has grown into a nationwide service that has helped over 50,000 entrepreneurs file their business documents correctly the first time. We've embraced technology to make the process faster, but we've never forgotten the old-fashioned values that built trust: meticulous attention to detail, honest pricing, and treating every client like a neighbor.
                    </p>
                    <p className="text-lg text-muted-foreground leading-relaxed font-body">
                      Today, EZ BIZ FILE SERVICE combines the precision of a master filing clerk with the convenience of modern technology. Whether you're forming your first LLC or filing your tenth annual report, we handle your paperwork with the same care and professionalism that defined a more dignified era of business.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6"></div>
                <h2 className="text-3xl font-bold font-display">Our Values</h2>
                <p className="text-xl text-muted-foreground mt-4 font-body">
                  The principles that guide every document we file
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {values.map((value, index) => {
                  const IconComponent = value.icon;
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
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6"></div>
                <h2 className="text-3xl font-bold font-display">Meet Our Team</h2>
                <p className="text-xl text-muted-foreground mt-4 font-body">
                  Dedicated professionals committed to your success
                </p>
              </div>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {teamMembers.map((member, index) => (
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
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <div className="accent-line-center mb-6"></div>
                <h2 className="text-3xl font-bold font-display">Why Choose EZ BIZ?</h2>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                {whyChooseUs.map((reason, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-card shadow-smooth border border-border">
                    <Check className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                    <span className="text-foreground font-body">{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Awards & Recognition */}
        <section className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="accent-line-center mb-6"></div>
              <h2 className="text-3xl font-bold mb-12 font-display">Awards & Recognition</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <Card className="border-0 shadow-smooth">
                  <CardContent className="p-6 text-center">
                    <Award className="h-12 w-12 text-secondary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2 font-display">Best Business Service 2023</h3>
                    <p className="text-sm text-muted-foreground font-body">Entrepreneur Magazine</p>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-smooth">
                  <CardContent className="p-6 text-center">
                    <Star className="h-12 w-12 text-secondary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2 font-display">5-Star Customer Rating</h3>
                    <p className="text-sm text-muted-foreground font-body">Trustpilot & Google Reviews</p>
                  </CardContent>
                </Card>
                
                <Card className="border-0 shadow-smooth">
                  <CardContent className="p-6 text-center">
                    <Shield className="h-12 w-12 text-secondary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2 font-display">A+ BBB Rating</h3>
                    <p className="text-sm text-muted-foreground font-body">Better Business Bureau</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-24">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <div className="accent-line-center mb-6"></div>
              <h2 className="text-3xl font-bold mb-8 font-display">Our Mission</h2>
              <Card className="border-2 border-secondary/20 shadow-elegant">
                <CardContent className="p-8 md:p-12">
                  <blockquote className="text-2xl font-medium text-center italic text-muted-foreground leading-relaxed font-display">
                    "To bring back the dignity and precision of professional document filing—combining old-fashioned integrity with modern convenience to help every entrepreneur make their business official, correctly and affordably."
                  </blockquote>
                  <div className="mt-8 text-right">
                    <div className="font-semibold font-display">— Christian Talavera, MBA, MSL</div>
                    <div className="text-sm text-muted-foreground font-body">CEO & Founder</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-24 gradient-executive text-primary-foreground">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-4xl font-bold mb-6 font-display">Ready to Start Your Business Journey?</h2>
              <p className="text-xl opacity-90 mb-8 font-body">
                Join thousands of successful entrepreneurs who trusted EZ BIZ FILE SERVICE to handle their business formation with care and precision.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button 
                  size="lg" 
                  className="bg-secondary hover:bg-secondary-light text-secondary-foreground text-lg px-8 h-14"
                  onClick={() => navigate('/order-now')}
                >
                  Get Started Today
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 h-14 border-2 border-white/30 text-white hover:bg-white/10"
                  onClick={() => navigate('/consultation')}
                >
                  Free Consultation
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
