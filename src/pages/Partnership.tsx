import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Users, FileText, TrendingUp } from "lucide-react";

const Partnership = () => {
  const benefits = [
    "Simple and inexpensive to establish",
    "Pass-through taxation - no double taxation",
    "Shared financial responsibility and resources",
    "Combined skills and expertise of partners",
    "Flexible management structure",
    "Easy to dissolve if needed"
  ];

  const partnershipTypes = [
    {
      title: "General Partnership",
      description: "All partners share equal responsibility for management and liability",
      features: ["Equal management rights", "Unlimited personal liability", "Shared profits and losses"]
    },
    {
      title: "Limited Partnership",
      description: "Combines general partners with limited partners who have restricted liability",
      features: ["General partners manage business", "Limited partners are passive investors", "Limited liability for some partners"]
    },
    {
      title: "Limited Liability Partnership",
      description: "Partners have limited liability protection from other partners' actions",
      features: ["Professional liability protection", "Limited personal liability", "Ideal for professional services"]
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-primary text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-bold mb-6">Partnership Formation</h1>
              <p className="text-xl mb-8 text-white/90">
                Join forces with partners to build a successful business together
              </p>
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                Form Your Partnership Today
              </Button>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-8">Why Choose a Partnership?</h2>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="text-center">
                    <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle>Shared Resources</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>Pool financial resources, skills, and expertise with your partners</CardDescription>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="text-center">
                    <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle>Tax Benefits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>Pass-through taxation eliminates double taxation on business profits</CardDescription>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="text-center">
                    <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle>Simple Setup</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>Easy and cost-effective to establish compared to corporations</CardDescription>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="text-center">
                    <Check className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle>Flexibility</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>Flexible management structure and operational decisions</CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Partnership Types Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Types of Partnerships</h2>
              <div className="grid md:grid-cols-1 lg:grid-cols-3 gap-8">
                {partnershipTypes.map((type, index) => (
                  <Card key={index} className="h-full">
                    <CardHeader>
                      <CardTitle className="text-xl">{type.title}</CardTitle>
                      <CardDescription>{type.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-2">
                        {type.features.map((feature, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Formation Process Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Partnership Formation Process</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Required Steps</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                        <span className="text-sm">Choose your business name</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                        <span className="text-sm">Register with state authorities</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                        <span className="text-sm">Create partnership agreement</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">4</div>
                        <span className="text-sm">Obtain necessary permits and licenses</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">5</div>
                        <span className="text-sm">Get federal tax ID (EIN)</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Important Considerations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Define profit and loss sharing arrangements</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Establish management responsibilities</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Plan for partner withdrawal or death</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Consider liability implications</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Document all agreements in writing</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-primary text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Ready to Partner Up?</h2>
              <p className="text-xl text-white/90 mb-8">
                Let us help you establish a strong foundation for your partnership business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-4">Get Started Now</Button>
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

export default Partnership;