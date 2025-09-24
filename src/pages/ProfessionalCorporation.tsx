import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Shield, Users, FileText } from "lucide-react";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const ProfessionalCorporation = () => {
  const navigate = useNavigate();
  const professions = [
    "Doctors", "Lawyers", "Accountants", "Architects", "Engineers",
    "Dentists", "Veterinarians", "Chiropractors", "Psychologists", "Consultants"
  ];

  const benefits = [
    "Personal liability protection for business debts",
    "Professional credibility and enhanced business image",
    "Tax advantages and deductions",
    "Ability to have multiple professional shareholders",
    "Perpetual existence beyond individual practitioners",
    "Easier to obtain business loans and credit"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-primary text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-bold mb-6">Professional Corporation Formation</h1>
              <p className="text-xl mb-8 text-white/90">
                Specialized corporate structure designed for licensed professionals
              </p>
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4" onClick={() => navigate('/pricing')}>
                Form Your Professional Corporation
              </Button>
            </div>
          </div>
        </section>

        {/* Professional Types Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center mb-12">
              <h2 className="text-3xl font-bold mb-6">Who Can Form a Professional Corporation?</h2>
              <p className="text-xl text-muted-foreground mb-8">
                Professional corporations are designed for licensed professionals who provide personal services
              </p>
            </div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-4 mb-16">
              {professions.map((profession, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="pt-6">
                    <Users className="h-8 w-8 text-primary mx-auto mb-3" />
                    <p className="font-medium">{profession}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-8">Benefits of Professional Corporation</h2>
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
                    <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle>Liability Protection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>Protects personal assets from business liabilities and debts</CardDescription>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="text-center">
                    <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle>Professional Image</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>Enhances credibility with clients and business partners</CardDescription>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="text-center">
                    <Users className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle>Multiple Owners</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>Allow other licensed professionals to become shareholders</CardDescription>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="text-center">
                    <Check className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle>Tax Benefits</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>Access to corporate tax deductions and benefits</CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Requirements Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Formation Requirements</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Eligibility Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">All shareholders must be licensed professionals</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Must provide professional services related to licenses</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Professional licenses must be in good standing</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">May require special state approval</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Formation Process</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">1</div>
                        <span className="text-sm">Verify professional licensing requirements</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                        <span className="text-sm">File Articles of Incorporation</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                        <span className="text-sm">Obtain necessary professional approvals</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">4</div>
                        <span className="text-sm">Issue stock certificates to shareholders</span>
                      </div>
                    </div>
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
              <h2 className="text-3xl font-bold mb-6">Start Your Professional Corporation Today</h2>
              <p className="text-xl text-white/90 mb-8">
                Get the liability protection and professional credibility your practice deserves.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-4" onClick={() => navigate('/pricing')}>Get Started Now</Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary" onClick={() => navigate('/consultation')}>Free Consultation</Button>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
};

export default ProfessionalCorporation;