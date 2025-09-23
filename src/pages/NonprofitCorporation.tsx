import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Heart, Shield, TrendingUp } from "lucide-react";

const NonprofitCorporation = () => {
  const benefits = [
    "Tax-exempt status under section 501(c)(3)",
    "Ability to accept tax-deductible donations",
    "Grants and funding opportunities from foundations",
    "Personal liability protection for directors and officers",
    "Enhanced credibility with donors and volunteers",
    "Potential property tax exemptions"
  ];

  const requirements = [
    "Must serve a charitable, educational, religious, or scientific purpose",
    "Cannot distribute profits to shareholders or members",
    "Must have a board of directors",
    "Detailed record-keeping and reporting requirements",
    "Annual filing requirements with state and federal agencies",
    "Restrictions on political activities and lobbying"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-primary text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-bold mb-6">Nonprofit Corporation Formation</h1>
              <p className="text-xl mb-8 text-white/90">
                Create a tax-exempt organization dedicated to serving the greater good
              </p>
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                Start Your Nonprofit Corporation
              </Button>
            </div>
          </div>
        </section>

        {/* Benefits Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-8">Benefits of Nonprofit Corporation</h2>
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
                    <Heart className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle>Tax-Exempt Status</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>Qualify for 501(c)(3) status and eliminate federal income taxes</CardDescription>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="text-center">
                    <TrendingUp className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle>Funding Access</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>Access grants, donations, and funding not available to for-profit entities</CardDescription>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="text-center">
                    <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle>Liability Protection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>Protect directors and officers from personal liability</CardDescription>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="text-center">
                    <Check className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle>Credibility</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>Enhanced trust and credibility with donors and the community</CardDescription>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Types Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Types of Nonprofit Organizations</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Charitable Organizations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Organizations focused on relieving poverty, advancing religion, education, or other charitable purposes.
                    </CardDescription>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Educational Institutions</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Schools, universities, libraries, and other organizations dedicated to education and learning.
                    </CardDescription>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Religious Organizations</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Churches, temples, mosques, and other organizations focused on religious activities and worship.
                    </CardDescription>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Scientific Research</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Organizations conducting research in the public interest for scientific advancement.
                    </CardDescription>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Community Development</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Organizations working to improve communities and provide social services.
                    </CardDescription>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Arts & Culture</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>
                      Museums, theaters, and organizations promoting arts, culture, and historical preservation.
                    </CardDescription>
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
                    <CardTitle>Key Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {requirements.map((req, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                          <span className="text-sm text-muted-foreground">{req}</span>
                        </li>
                      ))}
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
                        <span className="text-sm">File Articles of Incorporation</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">2</div>
                        <span className="text-sm">Create organizational bylaws</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">3</div>
                        <span className="text-sm">Apply for federal tax exemption (Form 1023)</span>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">4</div>
                        <span className="text-sm">Register for state tax exemptions</span>
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
              <h2 className="text-3xl font-bold mb-6">Ready to Make a Difference?</h2>
              <p className="text-xl text-white/90 mb-8">
                Start your nonprofit corporation and begin making a positive impact in your community.
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

export default NonprofitCorporation;