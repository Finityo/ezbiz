import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, FileText, Users, Building } from "lucide-react";

const DBAFiling = () => {
  const benefits = [
    "Operate under a different business name",
    "Create separate brand identities",
    "Accept payments in your DBA name",
    "Open bank accounts with your DBA name",
    "Build brand recognition and credibility",
    "Comply with state and local requirements"
  ];

  const whoNeeds = [
    {
      title: "Sole Proprietors",
      description: "Operating under a name different from your legal name",
      icon: Users
    },
    {
      title: "Partnerships", 
      description: "Using a trade name instead of partners' names",
      icon: Building
    },
    {
      title: "LLCs",
      description: "Marketing under an alternative business name", 
      icon: FileText
    },
    {
      title: "Corporations",
      description: "Creating divisions or subsidiary brands",
      icon: Building
    }
  ];

  const requirements = [
    "Choose an available DBA name",
    "Check name availability in your jurisdiction",
    "File appropriate DBA paperwork", 
    "Pay required filing fees",
    "Publish notice if required by state",
    "Renew registration as required"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-primary text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-bold mb-6">DBA Filing Service</h1>
              <p className="text-xl mb-8 text-white/90">
                Register your "Doing Business As" name and expand your brand identity
              </p>
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                File Your DBA Today
              </Button>
            </div>
          </div>
        </section>

        {/* What is DBA Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">What is a DBA?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                A DBA (Doing Business As) allows you to conduct business under a name different from your legal business name or personal name. Also known as a "trade name," "fictitious name," or "assumed name."
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-6">Benefits of Filing a DBA</h3>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-muted/50 p-8 rounded-lg">
                <h4 className="text-xl font-semibold mb-4">Example:</h4>
                <div className="space-y-3">
                  <p><strong>Legal Name:</strong> John Smith (Sole Proprietor)</p>
                  <p><strong>DBA Name:</strong> Smith's Auto Repair</p>
                  <p className="text-sm text-muted-foreground">
                    John can now accept checks, open bank accounts, and market his business under "Smith's Auto Repair" instead of his personal name.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Who Needs DBA Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Who Needs a DBA?</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {whoNeeds.map((item, index) => {
                  const IconComponent = item.icon;
                  return (
                    <Card key={index} className="text-center h-full">
                      <CardHeader>
                        <IconComponent className="h-12 w-12 text-primary mx-auto mb-4" />
                        <CardTitle className="text-lg">{item.title}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <CardDescription>{item.description}</CardDescription>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Requirements Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">DBA Filing Requirements</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Filing Process</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {requirements.map((req, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
                            {index + 1}
                          </div>
                          <span className="text-sm text-muted-foreground">{req}</span>
                        </div>
                      ))}
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
                        <span className="text-sm text-muted-foreground">DBA doesn't create a separate legal entity</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Personal liability still applies to sole proprietors</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Must renew periodically (varies by state)</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Separate federal tax ID may be required</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Check local business license requirements</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">DBA Filing Service</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic DBA Filing</CardTitle>
                    <CardDescription>Essential DBA registration service</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-4">$99</div>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">Name availability search</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">DBA filing preparation</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">State filing included</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card className="border-primary">
                  <CardHeader>
                    <CardTitle>Complete DBA Package</CardTitle>
                    <CardDescription>Everything you need for your DBA</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-4">$199</div>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">Everything in Basic</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">Federal tax ID (EIN)</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">Publication service</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">Banking resolution</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Premium Support</CardTitle>
                    <CardDescription>Full-service DBA with ongoing support</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-4">$299</div>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">Everything in Complete</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">Business license research</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">Trademark search</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">1 year compliance support</span>
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
              <h2 className="text-3xl font-bold mb-6">Ready to File Your DBA?</h2>
              <p className="text-xl text-white/90 mb-8">
                Establish your brand identity and start operating under your chosen business name today.
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

export default DBAFiling;