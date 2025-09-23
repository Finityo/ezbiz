import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Search, AlertCircle, Shield } from "lucide-react";
import { useState } from "react";

const BusinessNameSearch = () => {
  const [searchName, setSearchName] = useState("");
  const [selectedState, setSelectedState] = useState("");

  const features = [
    "Real-time availability checking",
    "Search across all 50 states",
    "Alternative name suggestions",
    "Domain name availability check",
    "Trademark database search",
    "Professional name consultation"
  ];

  const steps = [
    "Enter your desired business name",
    "Select your state of incorporation",
    "Review search results instantly",
    "Reserve your name if available",
    "Complete your business formation"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-primary text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-bold mb-6">Business Name Search</h1>
              <p className="text-xl mb-8 text-white/90">
                Check if your perfect business name is available for registration
              </p>
            </div>
          </div>
        </section>

        {/* Search Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Search Business Name Availability</CardTitle>
                  <CardDescription>Enter your proposed business name to check availability across states</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Business Name</label>
                    <Input 
                      placeholder="Enter your desired business name"
                      value={searchName}
                      onChange={(e) => setSearchName(e.target.value)}
                      className="text-lg p-4"
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <label className="text-sm font-medium">State of Incorporation</label>
                    <Select value={selectedState} onValueChange={setSelectedState}>
                      <SelectTrigger className="text-lg p-4">
                        <SelectValue placeholder="Select your state" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="AL">Alabama</SelectItem>
                        <SelectItem value="AK">Alaska</SelectItem>
                        <SelectItem value="AZ">Arizona</SelectItem>
                        <SelectItem value="AR">Arkansas</SelectItem>
                        <SelectItem value="CA">California</SelectItem>
                        <SelectItem value="CO">Colorado</SelectItem>
                        <SelectItem value="DE">Delaware</SelectItem>
                        <SelectItem value="FL">Florida</SelectItem>
                        <SelectItem value="GA">Georgia</SelectItem>
                        <SelectItem value="TX">Texas</SelectItem>
                        <SelectItem value="NY">New York</SelectItem>
                        {/* Add more states as needed */}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <Button size="lg" className="w-full text-lg p-4">
                    <Search className="h-5 w-5 mr-2" />
                    Search Name Availability
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <h2 className="text-3xl font-bold mb-8">Comprehensive Name Search Features</h2>
                <div className="space-y-4">
                  {features.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-3">
                      <Check className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                      <span className="text-muted-foreground">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-6">
                <Card>
                  <CardHeader className="text-center">
                    <Search className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle>Instant Results</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>Get real-time availability results across all states instantly</CardDescription>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="text-center">
                    <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle>Name Protection</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>Reserve your name to protect it while you complete formation</CardDescription>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="text-center">
                    <AlertCircle className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle>Trademark Check</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>Search federal trademark database to avoid conflicts</CardDescription>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="text-center">
                    <Check className="h-12 w-12 text-primary mx-auto mb-4" />
                    <CardTitle>Domain Check</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription>Check matching domain name availability for your website</CardDescription>
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
              <div className="grid md:grid-cols-1 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Simple 5-Step Process</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {steps.map((step, index) => (
                        <div key={index} className="flex items-center space-x-4">
                          <div className="w-10 h-10 bg-primary text-white rounded-full flex items-center justify-center text-sm font-semibold">
                            {index + 1}
                          </div>
                          <span className="text-muted-foreground">{step}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* Tips Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Business Name Tips</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle>Choosing a Great Name</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Keep it simple and memorable</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Make it relevant to your business</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Avoid numbers and special characters</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Consider future business expansion</span>
                      </li>
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Common Mistakes to Avoid</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      <li className="flex items-start space-x-3">
                        <AlertCircle className="h-4 w-4 text-warning mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Names too similar to existing businesses</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <AlertCircle className="h-4 w-4 text-warning mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Using restricted words without permission</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <AlertCircle className="h-4 w-4 text-warning mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Not checking trademark conflicts</span>
                      </li>
                      <li className="flex items-start space-x-3">
                        <AlertCircle className="h-4 w-4 text-warning mt-1 flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Ignoring domain name availability</span>
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
              <h2 className="text-3xl font-bold mb-6">Ready to Find Your Perfect Business Name?</h2>
              <p className="text-xl text-white/90 mb-8">
                Start your name search today and take the first step towards forming your business.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-4">Search Names Now</Button>
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

export default BusinessNameSearch;