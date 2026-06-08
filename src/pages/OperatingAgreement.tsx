import SEOHead from "@/components/SEOHead";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, FileText, Shield, Users, AlertTriangle } from "lucide-react";

const OperatingAgreement = () => {
  const keyProvisions = [
    "Ownership percentages and capital contributions",
    "Management structure and decision-making authority", 
    "Profit and loss distribution methods",
    "Member rights and responsibilities",
    "Procedures for adding or removing members",
    "Dissolution and exit strategies"
  ];

  const whyImportant = [
    {
      title: "Legal Protection",
      description: "Provides legal clarity and reduces disputes between members",
      icon: Shield
    },
    {
      title: "IRS Compliance", 
      description: "Ensures proper tax treatment and IRS recognition",
      icon: FileText
    },
    {
      title: "Member Relations",
      description: "Defines roles, responsibilities, and decision-making processes",  
      icon: Users
    },
    {
      title: "Asset Protection",
      description: "Maintains LLC liability protection and corporate veil",
      icon: Shield
    }
  ];

  const consequences = [
    "LLC may be treated as partnership for tax purposes",
    "State default rules govern your LLC operations",
    "Increased risk of member disputes and litigation",
    "Difficulty in decision-making without clear procedures",
    "Potential loss of limited liability protection",
    "Complications when adding investors or selling business"
  ];

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="LLC Operating Agreement" description="Custom LLC operating agreements that protect your business and clarify member roles." path="/operating-agreement" />
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-primary text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-bold mb-6">LLC Operating Agreement</h1>
              <p className="text-xl mb-8 text-white/90">
                Protect your LLC with a comprehensive operating agreement tailored to your business
              </p>
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                Get Your Operating Agreement
              </Button>
            </div>
          </div>
        </section>

        {/* What is Operating Agreement Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">What is an LLC Operating Agreement?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                An LLC Operating Agreement is a legal document that outlines the ownership, management structure, and operating procedures of your Limited Liability Company. It serves as the foundation for how your LLC will operate and how members will interact.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-6">Key Provisions Include:</h3>
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
                <h4 className="text-xl font-semibold mb-4">Did You Know?</h4>
                <p className="text-muted-foreground mb-4">
                  While most states don't legally require an Operating Agreement, having one is crucial for:
                </p>
                <ul className="space-y-2">
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-success" />
                    <span className="text-sm">Maintaining limited liability protection</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-success" />
                    <span className="text-sm">Avoiding state default rules</span>
                  </li>
                  <li className="flex items-center space-x-2">
                    <Check className="h-4 w-4 text-success" />
                    <span className="text-sm">Establishing business credibility</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* Why Important Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Why Your LLC Needs an Operating Agreement</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                {whyImportant.map((item, index) => {
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

        {/* Consequences Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <AlertTriangle className="h-16 w-16 text-warning mx-auto mb-6" />
                <h2 className="text-3xl font-bold mb-6">Risks of Not Having an Operating Agreement</h2>
                <p className="text-xl text-muted-foreground">
                  Without an Operating Agreement, your LLC is subject to state default rules, which may not align with your business goals.
                </p>
              </div>
              
              <div className="grid md:grid-cols-2 gap-8">
                {consequences.map((consequence, index) => (
                  <div key={index} className="flex items-start space-x-3 p-4 border border-warning/20 rounded-lg bg-warning/5">
                    <AlertTriangle className="h-5 w-5 text-warning mt-1 flex-shrink-0" />
                    <span className="text-muted-foreground">{consequence}</span>
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
              <h2 className="text-3xl font-bold text-center mb-12">Operating Agreement Services</h2>
              <div className="grid md:grid-cols-3 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Basic Operating Agreement</CardTitle>
                    <CardDescription>Essential provisions for single-member LLCs</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-4">$199</div>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">Single-member LLC template</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">Management structure</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">Basic tax elections</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">Dissolution procedures</span>
                      </li>
                    </ul>
                    <Button className="w-full mt-6">Get Started</Button>
                  </CardContent>
                </Card>
                
                <Card className="border-primary">
                  <CardHeader>
                    <CardTitle>Multi-Member Agreement</CardTitle>
                    <CardDescription>Comprehensive agreement for multiple owners</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-4">$399</div>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">Everything in Basic</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">Multi-member provisions</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">Buy-sell agreements</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">Capital contribution rules</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">Voting procedures</span>
                      </li>
                    </ul>
                    <Button className="w-full mt-6">Choose Multi-Member</Button>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Custom Agreement</CardTitle>
                    <CardDescription>Fully customized agreement for complex businesses</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-4">$699</div>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">Everything in Multi-Member</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">Fully customized provisions</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">Attorney consultation</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">Complex ownership structures</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">Ongoing support</span>
                      </li>
                    </ul>
                    <Button className="w-full mt-6">Get Custom Agreement</Button>
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
                        <span className="text-sm">Complete business questionnaire</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                        <span className="text-sm">Attorney reviews your needs</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                        <span className="text-sm">Custom agreement drafted</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">4</div>
                        <span className="text-sm">Review and revisions</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">5</div>
                        <span className="text-sm">Final agreement delivered</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>What We Need From You</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">LLC name and formation details</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Member information and ownership percentages</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Management structure preferences</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Capital contribution requirements</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Special provisions or requirements</span>
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
              <h2 className="text-3xl font-bold mb-6">Protect Your LLC Today</h2>
              <p className="text-xl text-white/90 mb-8">
                Don't leave your LLC vulnerable. Get a professional operating agreement that protects your business and defines clear operating procedures.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-4">Get Started Now</Button>
                <Button asChild size="lg" className="text-lg px-8 py-4 bg-yellow-400 hover:bg-yellow-300 text-slate-900 font-bold shadow-lg hover:shadow-xl border-0"><Link to="/consultation">Free Consultation</Link></Button>
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

export default OperatingAgreement;