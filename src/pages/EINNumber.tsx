import Navigation from "@/components/Navigation";
import ServiceJsonLd from "@/components/ServiceJsonLd";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, FileText, Shield, Clock, Building } from "lucide-react";

const EINNumber = () => {
  const whoNeeds = [
    "Businesses with employees",
    "LLCs with multiple members", 
    "All corporations and partnerships",
    "Sole proprietors who want to separate business and personal finances",
    "Businesses opening bank accounts",
    "Companies applying for business licenses"
  ];

  const benefits = [
    "Required for business bank accounts",
    "Needed to hire employees",
    "Protects your Social Security Number",
    "Required for business tax filings",
    "Necessary for business credit applications",
    "Professional credibility with vendors"
  ];

  const process = [
    "Verify your business entity type",
    "Gather required business information",
    "Complete IRS Form SS-4 application", 
    "Submit application to the IRS",
    "Receive your EIN immediately"
  ];

  return (
    <div className="min-h-screen bg-background">
      <ServiceJsonLd serviceName="EIN Number Filing" description="Get your Employer Identification Number (EIN) from the IRS. Required for business bank accounts, hiring employees, and tax filing." url="/ein-number" />
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-primary text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-bold mb-6">EIN Number Service</h1>
              <p className="text-xl mb-8 text-white/90">
                Get your Federal Tax ID Number (EIN) fast and hassle-free
              </p>
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                Get Your EIN Today
              </Button>
            </div>
          </div>
        </section>

        {/* What is EIN Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">What is an EIN?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                An Employer Identification Number (EIN), also known as a Federal Tax ID Number, is a unique nine-digit number assigned by the IRS to identify your business for tax purposes.
              </p>
            </div>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h3 className="text-2xl font-bold mb-6">Who Needs an EIN?</h3>
                <div className="space-y-4">
                  {whoNeeds.map((need, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                      <span className="text-muted-foreground">{need}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="bg-muted/50 p-8 rounded-lg">
                <h4 className="text-xl font-semibold mb-4">EIN Format:</h4>
                <div className="text-center">
                  <div className="text-3xl font-mono font-bold text-primary mb-4">XX-XXXXXXX</div>
                  <p className="text-sm text-muted-foreground">
                    Your EIN is a permanent number that stays with your business throughout its lifetime.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="text-center">
                    <Building className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle>Business Banking</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>Required to open business bank accounts and establish business credit</CardDescription>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="text-center">
                    <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle>Privacy Protection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>Protects your Social Security Number from business use</CardDescription>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="text-center">
                    <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle>Tax Compliance</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>Required for business tax filings and IRS correspondence</CardDescription>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="text-center">
                    <Clock className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle>Instant Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>Get your EIN immediately upon successful application</CardDescription>
                  </CardContent>
                </Card>
              </div>
              
              <div>
                <h2 className="text-3xl font-bold mb-8">Benefits of Having an EIN</h2>
                <div className="space-y-4">
                  {benefits.map((benefit, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                      <span className="text-muted-foreground">{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Process Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">EIN Application Process</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>How We Help</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {process.map((step, index) => (
                        <div key={index} className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
                            {index + 1}
                          </div>
                          <span className="text-sm text-muted-foreground">{step}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Required Information</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Legal business name</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Business entity type</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Principal business address</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Responsible party information</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Reason for applying</span>
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
              <h2 className="text-3xl font-bold text-center mb-12">EIN Services</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Standard EIN Service</CardTitle>
                    <CardDescription>Get your EIN quickly and efficiently</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-4">$79</div>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">IRS Form SS-4 preparation</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">Direct IRS submission</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">Same-day processing</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">Email confirmation</span>
                      </li>
                    </ul>
                    <Button className="w-full mt-6">Get Started</Button>
                  </CardContent>
                </Card>
                
                <Card className="border-primary">
                  <CardHeader>
                    <CardTitle>Express EIN Service</CardTitle>
                    <CardDescription>Priority processing with additional support</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold mb-4">$149</div>
                    <ul className="space-y-2">
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">Everything in Standard</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">Priority processing</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">Expedited delivery</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">Dedicated support specialist</span>
                      </li>
                      <li className="flex items-center space-x-2">
                        <Check className="h-4 w-4 text-success" />
                        <span className="text-sm">Banking resolution included</span>
                      </li>
                    </ul>
                    <Button className="w-full mt-6">Choose Express</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">How long does it take to get an EIN?</h4>
                    <p className="text-sm text-muted-foreground">With our service, you can receive your EIN the same day your application is processed by the IRS.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Is an EIN free from the IRS?</h4>
                    <p className="text-sm text-muted-foreground">Yes, the IRS doesn't charge for EINs. Our fee covers the preparation, submission, and professional service.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Can I apply for an EIN myself?</h4>
                    <p className="text-sm text-muted-foreground">Yes, but our service ensures accuracy, saves time, and provides ongoing support for your business needs.</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Do I need an EIN for my LLC?</h4>
                    <p className="text-sm text-muted-foreground">Single-member LLCs don't require an EIN unless they have employees or elect corporate tax treatment.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Can I change my EIN later?</h4>
                    <p className="text-sm text-muted-foreground">EINs are permanent. You'd only get a new one if your business structure fundamentally changes.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">What if my application is rejected?</h4>
                    <p className="text-sm text-muted-foreground">We'll work with you to correct any issues and resubmit your application at no additional charge.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-primary text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Get Your EIN Today</h2>
              <p className="text-xl text-white/90 mb-8">
                Don't let paperwork slow down your business. Get your Federal Tax ID Number quickly and professionally.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-4">Start Application</Button>
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

export default EINNumber;