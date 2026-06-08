import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, FileText, Users, Shield, Building } from "lucide-react";

const CorporateBylaws = () => {
  const keyProvisions = [
    "Board of directors structure and responsibilities",
    "Shareholder meeting procedures and voting rights", 
    "Officer roles, duties, and appointment processes",
    "Stock issuance and transfer restrictions",
    "Corporate record-keeping requirements",
    "Amendment procedures and dissolution methods"
  ];

  const benefits = [
    {
      title: "Legal Compliance",
      description: "Meet state requirements and maintain good corporate standing",
      icon: Shield
    },
    {
      title: "Clear Governance", 
      description: "Define roles, responsibilities, and decision-making processes",
      icon: Users
    },
    {
      title: "Investor Confidence",
      description: "Professional structure attracts investors and business partners",  
      icon: Building
    },
    {
      title: "Asset Protection",
      description: "Maintain corporate veil and limited liability protection",
      icon: Shield
    }
  ];

  const whatIncluded = [
    "Corporate purpose and powers",
    "Authorized shares and stock classes",
    "Shareholder rights and obligations", 
    "Board composition and meeting procedures",
    "Officer positions and duties",
    "Dividend policies and distributions",
    "Conflict of interest provisions",
    "Indemnification procedures"
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="Corporate Bylaws" description="Professional corporate bylaws drafting service. Define governance and stay compliant with EZ BIZ FILE SERVICE." path="/corporate-bylaws" />
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-primary text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-bold mb-6">Corporate Bylaws</h1>
              <p className="text-xl mb-8 text-white/90">
                Establish proper corporate governance with professional bylaws tailored to your corporation
              </p>
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                Get Your Corporate Bylaws
              </Button>
            </div>
          </div>
        </section>

        {/* What are Bylaws Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">What are Corporate Bylaws?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Corporate bylaws are the internal rules and procedures that govern how your corporation operates. They complement your Articles of Incorporation by providing detailed guidelines for corporate governance, shareholder rights, and officer responsibilities.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-6">Essential Provisions Include:</h3>
                <div className="space-y-4">
                  {keyProvisions.map((provision, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                      <span className="text-muted-foreground">{provision}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-muted/50 p-8 rounded-lg">
                <h4 className="text-xl font-semibold mb-4">Legal Requirement</h4>
                <p className="text-muted-foreground mb-4">
                  Most states require corporations to adopt bylaws as part of the formation process. Bylaws are essential for:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-success" />
                    <span className="text-sm">Maintaining corporate status</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-success" />
                    <span className="text-sm">Opening corporate bank accounts</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-success" />
                    <span className="text-sm">Attracting investors and lenders</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Why Your Corporation Needs Bylaws</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {benefits.map((item, index) => {
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

        {/* What's Included Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">What's Included in Our Bylaws</h2>
              <div className="grid md:grid-cols-2 gap-8">
                {whatIncluded.map((item, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 border border-primary/20 rounded-lg bg-primary/5">
                    <FileText className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">{item}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Service Options Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Corporate Bylaws Services</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Standard Bylaws</CardTitle>
                    <CardDescription>Complete bylaws for most corporations</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-4">$299</div>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">Comprehensive bylaws template</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">Board and shareholder provisions</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">Officer roles and duties</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">Meeting procedures</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">State law compliance</span>
                      </li>
                    </ul>
                    <Button className="w-full mt-6">Get Started</Button>
                  </CardContent>
                </Card>
                
                <Card className="border-primary">
                  <CardHeader>
                    <CardTitle>Custom Bylaws</CardTitle>
                    <CardDescription>Tailored bylaws for complex structures</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-4">$599</div>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">Everything in Standard</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">Custom provisions</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">Multiple stock classes</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">Special voting arrangements</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">Attorney consultation</span>
                      </li>
                    </ul>
                    <Button className="w-full mt-6">Choose Custom</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Bylaws Amendment</CardTitle>
                    <CardDescription>Update existing bylaws</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-4">$199</div>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">Review existing bylaws</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">Draft amendments</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">Board resolution preparation</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">Filing assistance</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">Compliance review</span>
                      </li>
                    </ul>
                    <Button className="w-full mt-6">Amend Bylaws</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Our Process</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                        <span className="text-sm">Review Articles of Incorporation</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                        <span className="text-sm">Complete business structure questionnaire</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                        <span className="text-sm">Draft customized bylaws</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">4</div>
                        <span className="text-sm">Attorney review and approval</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">5</div>
                        <span className="text-sm">Final bylaws delivered</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Information We Need</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Corporate name and formation details</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Number and classes of authorized shares</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Board size and composition preferences</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Officer positions and responsibilities</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Special provisions or restrictions</span>
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
              <h2 className="text-3xl font-bold mb-6">Establish Proper Corporate Governance</h2>
              <p className="text-xl text-white/90 mb-8">
                Don't risk your corporate status. Get professional bylaws that ensure compliance and protect your business interests.
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
          <p className="text-muted-foreground">© 2024 EZ BIZ File Service. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default CorporateBylaws;