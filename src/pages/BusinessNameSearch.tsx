import Navigation from "@/components/Navigation";
import logoImage from "@/assets/logo-ezbiz-final.webp";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Search, AlertCircle, Shield, X, Loader } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useNavigate } from "react-router-dom";


const BusinessNameSearch = () => {
  const [searchName, setSearchName] = useState("");
  const [selectedState, setSelectedState] = useState("");
  const [isSearching, setIsSearching] = useState(false);
  const [searchResults, setSearchResults] = useState(null);
  const { toast } = useToast();
  const navigate = useNavigate();

  // Mock search function - simulates real API call
  const handleNameSearch = async () => {
    if (!searchName.trim()) {
      toast({
        title: "Missing Information",
        description: "Please enter a business name to search.",
        variant: "destructive"
      });
      return;
    }

    if (!selectedState) {
      toast({
        title: "Missing Information", 
        description: "Please select a state for incorporation.",
        variant: "destructive"
      });
      return;
    }

    setIsSearching(true);
    
    // Simulate API delay
    setTimeout(() => {
      // Mock search logic - in reality this would call your backend
      const isAvailable = Math.random() > 0.3; // 70% chance of being available
      const hasTrademarkConflict = Math.random() > 0.8; // 20% chance of trademark issue
      const isDomainAvailable = Math.random() > 0.4; // 60% chance domain available
      
      const results = {
        searchedName: searchName,
        state: selectedState,
        isAvailable,
        hasTrademarkConflict,
        isDomainAvailable,
        suggestions: isAvailable ? [] : [
          `${searchName} LLC`,
          `${searchName} Corp`,
          `${searchName} Solutions`,
          `${searchName} Group`,
          `New ${searchName}`
        ]
      };
      
      setSearchResults(results);
      setIsSearching(false);
      
      toast({
        title: "Search Complete",
        description: `Found ${isAvailable ? 'availability' : 'conflicts'} for "${searchName}" in ${selectedState}`,
      });
    }, 2000);
  };

  const handleReserveClick = () => {
    toast({
      title: "Name Reservation",
      description: "Redirecting to complete name reservation and business formation...",
    });
    
    setTimeout(() => {
      navigate("/consultation", { 
        state: { 
          businessName: searchName,
          selectedState: selectedState,
          action: "reserve-name" 
        } 
      });
    }, 1500);
  };

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
            <div className="max-w-2xl mx-auto -mt-80">
              <div className="flex justify-center mb-8">
                <img 
                  src={logoImage} 
                  alt="EZ BIZ FILE SERVICE" 
                  className="w-full max-w-[18rem] sm:max-w-[24rem] md:max-w-[32rem] h-auto object-contain mx-auto mix-blend-multiply"
                  style={{ filter: 'contrast(1.03) saturate(1.05)' }}
                />
              </div>
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
                  
                  <Button 
                    size="lg" 
                    className="w-full text-lg p-4"
                    disabled={true}
                  >
                    <Search className="h-5 w-5 mr-2" />
                    Coming Soon
                  </Button>
                  <p className="text-sm text-muted-foreground text-center mt-2">
                    Business name search is currently under maintenance. Please check back soon.
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Search Results Section */}
        {searchResults && (
          <section className="py-16 bg-muted/50">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-8">Search Results</h2>
                
                <Card className="mb-8">
                  <CardHeader className="text-center">
                    <CardTitle className="text-2xl">
                      "{searchResults.searchedName}" in {searchResults.state}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-3 gap-6">
                      {/* Name Availability */}
                      <Card className={`${searchResults.isAvailable ? 'border-success' : 'border-destructive'}`}>
                        <CardHeader className="text-center">
                          {searchResults.isAvailable ? (
                            <Check className="h-12 w-12 text-success mx-auto mb-2" />
                          ) : (
                            <X className="h-12 w-12 text-destructive mx-auto mb-2" />
                          )}
                          <CardTitle className="text-lg">Business Name</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                          <p className={`font-semibold ${searchResults.isAvailable ? 'text-success' : 'text-destructive'}`}>
                            {searchResults.isAvailable ? 'Available' : 'Not Available'}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {searchResults.isAvailable 
                              ? 'This name can be registered in your state'
                              : 'This name is already taken or restricted'
                            }
                          </p>
                        </CardContent>
                      </Card>

                      {/* Trademark Check */}
                      <Card className={`${searchResults.hasTrademarkConflict ? 'border-warning' : 'border-success'}`}>
                        <CardHeader className="text-center">
                          {searchResults.hasTrademarkConflict ? (
                            <AlertCircle className="h-12 w-12 text-warning mx-auto mb-2" />
                          ) : (
                            <Check className="h-12 w-12 text-success mx-auto mb-2" />
                          )}
                          <CardTitle className="text-lg">Trademark Check</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                          <p className={`font-semibold ${searchResults.hasTrademarkConflict ? 'text-warning' : 'text-success'}`}>
                            {searchResults.hasTrademarkConflict ? 'Potential Conflict' : 'Clear'}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {searchResults.hasTrademarkConflict 
                              ? 'Similar trademarks found - review recommended'
                              : 'No conflicting trademarks found'
                            }
                          </p>
                        </CardContent>
                      </Card>

                      {/* Domain Availability */}
                      <Card className={`${searchResults.isDomainAvailable ? 'border-success' : 'border-warning'}`}>
                        <CardHeader className="text-center">
                          {searchResults.isDomainAvailable ? (
                            <Check className="h-12 w-12 text-success mx-auto mb-2" />
                          ) : (
                            <AlertCircle className="h-12 w-12 text-warning mx-auto mb-2" />
                          )}
                          <CardTitle className="text-lg">Domain Name</CardTitle>
                        </CardHeader>
                        <CardContent className="text-center">
                          <p className={`font-semibold ${searchResults.isDomainAvailable ? 'text-success' : 'text-warning'}`}>
                            {searchResults.isDomainAvailable ? 'Available' : 'Taken'}
                          </p>
                          <p className="text-sm text-muted-foreground mt-1">
                            {searchResults.isDomainAvailable 
                              ? '.com domain is available for registration'
                              : '.com taken - other extensions may be available'
                            }
                          </p>
                        </CardContent>
                      </Card>
                    </div>

                    {/* Action Buttons */}
                    <div className="mt-8 text-center space-y-4">
                      {searchResults.isAvailable ? (
                        <div className="space-y-4">
                          <Button 
                            size="lg" 
                            className="px-8"
                            onClick={handleReserveClick}
                          >
                            <Shield className="h-5 w-5 mr-2" />
                            Reserve This Name & Start Business
                          </Button>
                          <p className="text-sm text-muted-foreground">
                            Secure your business name now and complete formation when ready
                          </p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <h3 className="text-xl font-semibold">Alternative Suggestions</h3>
                          <div className="grid md:grid-cols-2 gap-4">
                            {searchResults.suggestions.map((suggestion, index) => (
                              <Button 
                                key={index}
                                variant="outline" 
                                className="w-full"
                                onClick={() => setSearchName(suggestion)}
                              >
                                {suggestion}
                              </Button>
                            ))}
                          </div>
                          <p className="text-sm text-muted-foreground">
                            Click any suggestion to search again, or try a different name
                          </p>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </section>
        )}

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
                <Button 
                  size="lg" 
                  variant="secondary" 
                  className="text-lg px-8 py-4"
                  onClick={() => window.scrollTo({ top: 48, behavior: 'smooth' })}
                >
                  Search Names Now
                </Button>
                <Button 
                  size="lg" 
                  variant="outline" 
                  className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary"
                  onClick={() => navigate("/consultation")}
                >
                  Free Consultation
                </Button>
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

export default BusinessNameSearch;