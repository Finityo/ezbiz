import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Users, Shield, Clock, Star, Award, Heart, Zap } from "lucide-react";

const About = () => {
  const stats = [
    { number: "50,000+", label: "Businesses Formed", icon: Users },
    { number: "15+", label: "Years Experience", icon: Clock },
    { number: "50", label: "States Covered", icon: Shield },
    { number: "4.9/5", label: "Customer Rating", icon: Star }
  ];

  const values = [
    {
      icon: Shield,
      title: "Trust & Transparency",
      description: "We believe in complete transparency with no hidden fees and honest guidance about what's best for your business."
    },
    {
      icon: Heart,
      title: "Customer Success",
      description: "Your success is our success. We're committed to helping entrepreneurs achieve their business dreams."
    },
    {
      icon: Zap,
      title: "Speed & Efficiency", 
      description: "We streamline the business formation process so you can get up and running as quickly as possible."
    },
    {
      icon: Award,
      title: "Excellence",
      description: "We maintain the highest standards in everything we do, from customer service to document preparation."
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
        <section className="bg-gradient-primary text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-bold mb-6">About Finityo</h1>
              <p className="text-xl mb-8 text-white/90">
                Empowering entrepreneurs to turn their ideas into successful businesses through expert formation services and ongoing support.
              </p>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-4 gap-8 max-w-4xl mx-auto">
              {stats.map((stat, index) => {
                const IconComponent = stat.icon;
                return (
                  <div key={index} className="text-center">
                    <IconComponent className="h-12 w-12 text-primary mx-auto mb-4" />
                    <div className="text-4xl font-bold text-primary mb-2">{stat.number}</div>
                    <div className="text-muted-foreground">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* Our Story Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Our Story</h2>
              <Card>
                <CardContent className="p-8">
                  <div className="prose prose-lg max-w-none">
                    <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                      Finityo was founded in 2009 with a simple mission: to make business formation accessible, affordable, and straightforward for entrepreneurs across America. Our founder, Christian Talavera, experienced firsthand the confusion and complexity of starting a business and knew there had to be a better way.
                    </p>
                    <p className="text-lg text-muted-foreground leading-relaxed mb-6">
                      What started as a small practice helping local entrepreneurs has grown into a nationwide service that has helped over 50,000 businesses get started. We've maintained our commitment to personal service while leveraging technology to make the process faster and more efficient.
                    </p>
                    <p className="text-lg text-muted-foreground leading-relaxed">
                      Today, Finityo is recognized as one of the leading business formation companies in the United States, but we never forget our roots. Every client receives the same personalized attention and expert guidance that built our reputation.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Our Values */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Our Values</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {values.map((value, index) => {
                  const IconComponent = value.icon;
                  return (
                    <Card key={index} className="text-center h-full">
                      <CardHeader>
                        <IconComponent className="h-12 w-12 text-primary mx-auto mb-4" />
                        <CardTitle className="text-xl">{value.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription className="text-center">{value.description}</CardDescription>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Meet Our Team</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
                {teamMembers.map((member, index) => (
                  <Card key={index} className="text-center">
                    <CardHeader>
                      <div className="w-20 h-20 bg-primary rounded-full mx-auto mb-4 flex items-center justify-center">
                        <Users className="h-10 w-10 text-white" />
                      </div>
                      <CardTitle className="text-xl">{member.name}</CardTitle>
                      <CardDescription className="font-semibold text-primary">{member.role}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-3">{member.bio}</p>
                      <div className="text-xs font-medium text-primary">{member.credentials}</div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Why Choose Finityo?</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {whyChooseUs.map((reason, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 rounded-lg bg-muted/50">
                    <Check className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">{reason}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Awards & Recognition */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-12">Awards & Recognition</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <Card>
                  <CardContent className="p-6 text-center">
                    <Award className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">Best Business Service 2023</h3>
                    <p className="text-sm text-muted-foreground">Entrepreneur Magazine</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <Star className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">5-Star Customer Rating</h3>
                    <p className="text-sm text-muted-foreground">Trustpilot & Google Reviews</p>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardContent className="p-6 text-center">
                    <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                    <h3 className="text-xl font-semibold mb-2">A+ BBB Rating</h3>
                    <p className="text-sm text-muted-foreground">Better Business Bureau</p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Mission Statement */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-8">Our Mission</h2>
              <Card className="border-primary">
                <CardContent className="p-8">
                  <blockquote className="text-2xl font-medium text-center italic text-muted-foreground leading-relaxed">
                    "To empower entrepreneurs and small business owners by providing expert, accessible, and affordable business formation services, helping them turn their dreams into successful enterprises that contribute to economic growth and innovation."
                  </blockquote>
                  <div className="mt-6 text-right">
                    <div className="font-semibold">- Christian Talavera, MBA, MSL</div>
                    <div className="text-sm text-muted-foreground">CEO & Founder</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-primary text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Ready to Start Your Business Journey?</h2>
              <p className="text-xl text-white/90 mb-8">
                Join thousands of successful entrepreneurs who trusted Finityo to help them start their businesses.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-4">Get Started Today</Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary">Free Consultation</Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="bg-muted py-12">
        <div className="container mx-auto px-4 text-center">
          <p className="text-muted-foreground">© 2024 Finityo. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default About;