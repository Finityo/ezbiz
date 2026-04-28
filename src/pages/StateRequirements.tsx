import SEOHead from "@/components/SEOHead";
import Navigation from "@/components/Navigation"; 
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Download, MapPin, DollarSign, Clock, FileText } from "lucide-react";
import { useState } from "react";
import { STATE_FILING_FEES, STATE_CORP_FILING_FEES } from "@/lib/state-fees";

const StateRequirements = () => {
  const [selectedState, setSelectedState] = useState("");

  const popularStates = [
    {
      state: "Delaware",
      llcFee: `$${STATE_FILING_FEES["Delaware"]}`,
      corpFee: `$${STATE_CORP_FILING_FEES["Delaware"]}`,
      processingTime: "7-10 days",
      benefits: ["Business-friendly courts", "Strong corporate law", "Privacy protection", "No sales tax"],
      annualReport: "Required",
      description: "The most popular state for corporations seeking investment"
    },
    {
      state: "Wyoming",
      llcFee: `$${STATE_FILING_FEES["Wyoming"]}`,
      corpFee: `$${STATE_CORP_FILING_FEES["Wyoming"]}`,
      processingTime: "3-5 days", 
      benefits: ["Strong privacy laws", "No state income tax", "Low fees", "Asset protection"],
      annualReport: "Required",
      description: "Premier state for LLCs with excellent privacy protection"
    },
    {
      state: "Nevada", 
      llcFee: `$${STATE_FILING_FEES["Nevada"]}`,
      corpFee: `$${STATE_CORP_FILING_FEES["Nevada"]}`,
      processingTime: "5-7 days",
      benefits: ["No corporate income tax", "Strong privacy laws", "Flexible corporate structure", "Asset protection"],
      annualReport: "Required", 
      description: "Business-friendly state with strong privacy protections"
    },
    {
      state: "Florida",
      llcFee: `$${STATE_FILING_FEES["Florida"]}`,
      corpFee: `$${STATE_CORP_FILING_FEES["Florida"]}`,
      processingTime: "5-7 days",
      benefits: ["No state income tax", "Strong economy", "Business incentives", "Growing market"],
      annualReport: "Required",
      description: "Fast-growing state with no personal income tax"
    },
    {
      state: "Texas", 
      llcFee: `$${STATE_FILING_FEES["Texas"]}`,
      corpFee: `$${STATE_CORP_FILING_FEES["Texas"]}`,
      processingTime: "7-14 days",
      benefits: ["No state income tax", "Large market", "Business incentives", "Strong economy"],
      annualReport: "Required",
      description: "Large state with strong business climate and no income tax"
    },
    {
      state: "California",
      llcFee: `$${STATE_FILING_FEES["California"]}`,
      corpFee: `$${STATE_CORP_FILING_FEES["California"]}`,
      processingTime: "10-15 days",
      benefits: ["Large market", "Access to capital", "Innovation hub", "Diverse economy"],
      annualReport: "Required + $800 minimum tax",
      description: "Innovation capital with access to venture funding"
    }
  ];

  const requirements = {
    llc: [
      "Articles of Organization filing",
      "Registered Agent appointment", 
      "Operating Agreement (recommended)",
      "EIN application with IRS",
      "Business licenses (if required)",
      "Annual report filing"
    ],
    corporation: [
      "Articles of Incorporation filing",
      "Corporate Bylaws adoption",
      "Registered Agent appointment", 
      "Board of Directors appointment",
      "Stock certificates issuance",
      "Annual report filing"
    ]
  };

  const stateFees = Object.keys(STATE_FILING_FEES).sort().map(state => ({
    state,
    llc: `$${STATE_FILING_FEES[state]}`,
    corp: `$${STATE_CORP_FILING_FEES[state] || STATE_FILING_FEES[state]}`
  }));

  return (
    <div className="min-h-screen bg-background">
      <SEOHead title="State Filing Requirements" description="Compare LLC and corporation filing fees, processing times, and requirements across all 50 states." path="/state-requirements" />
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-primary text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-bold mb-6">State Requirements Guide</h1>
              <p className="text-xl mb-8 text-white/90">
                Compare requirements, fees, and benefits across all 50 states
              </p>
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                <Download className="h-5 w-5 mr-2" />
                Download State Guide
              </Button>
            </div>
          </div>
        </section>

        {/* State Selector */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <Card>
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">Find Requirements for Your State</CardTitle>
                  <CardDescription>Select a state to view specific formation requirements and fees</CardDescription>
                </CardHeader>
                <CardContent>
                  <Select value={selectedState} onValueChange={setSelectedState}>
                    <SelectTrigger className="text-lg p-4">
                      <SelectValue placeholder="Select your state" />
                    </SelectTrigger>
                    <SelectContent>
                      {stateFees.map((state) => (
                        <SelectItem key={state.state} value={state.state}>
                          {state.state}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  
                  {selectedState && (
                    <div className="mt-6 p-4 border rounded-lg bg-background">
                      <h3 className="text-xl font-semibold mb-4">{selectedState} Requirements</h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <h4 className="font-medium mb-2">LLC Formation</h4>
                          <p className="text-2xl font-bold text-primary mb-2">
                            {stateFees.find(s => s.state === selectedState)?.llc}
                          </p>
                          <p className="text-sm text-muted-foreground">State filing fee</p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Corporation Formation</h4>
                          <p className="text-2xl font-bold text-primary mb-2">
                            {stateFees.find(s => s.state === selectedState)?.corp}
                          </p>
                          <p className="text-sm text-muted-foreground">State filing fee</p>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* Popular States */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Most Popular States for Business Formation</h2>
              <div className="grid lg:grid-cols-2 gap-8">
                {popularStates.map((state, index) => (
                  <Card key={index} className="hover:shadow-lg transition-shadow">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-2xl flex items-center">
                          <MapPin className="h-6 w-6 mr-2 text-primary" />
                          {state.state}
                        </CardTitle>
                      </div>
                      <CardDescription>{state.description}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-3 gap-4 mb-6">
                        <div className="text-center">
                          <DollarSign className="h-6 w-6 text-primary mx-auto mb-2" />
                          <div className="font-semibold">LLC: {state.llcFee}</div>
                          <div className="font-semibold">Corp: {state.corpFee}</div>
                          <div className="text-xs text-muted-foreground">Filing Fees</div>
                        </div>
                        <div className="text-center">
                          <Clock className="h-6 w-6 text-primary mx-auto mb-2" />
                          <div className="font-semibold">{state.processingTime}</div>
                          <div className="text-xs text-muted-foreground">Processing</div>
                        </div>
                        <div className="text-center">
                          <FileText className="h-6 w-6 text-primary mx-auto mb-2" />
                          <div className="font-semibold">{state.annualReport}</div>
                          <div className="text-xs text-muted-foreground">Annual Report</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <h4 className="font-semibold">Key Benefits:</h4>
                        <div className="grid grid-cols-2 gap-1">
                          {state.benefits.map((benefit, idx) => (
                            <div key={idx} className="flex items-start space-x-2">
                              <Check className="h-4 w-4 text-success mt-0.5 flex-shrink-0" />
                              <span className="text-sm">{benefit}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Requirements Comparison */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Formation Requirements Comparison</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">LLC Requirements</CardTitle>
                    <CardDescription>Standard requirements for LLC formation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {requirements.llc.map((req, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <Check className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle className="text-2xl">Corporation Requirements</CardTitle>
                    <CardDescription>Standard requirements for corporation formation</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-3">
                      {requirements.corporation.map((req, index) => (
                        <li key={index} className="flex items-start space-x-3">
                          <Check className="h-5 w-5 text-success mt-0.5 flex-shrink-0" />
                          <span>{req}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* All States Table */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Complete State Fee Schedule</h2>
              <Card>
                <CardContent className="p-0">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead className="bg-muted">
                        <tr>
                          <th className="text-left p-4 font-semibold">State</th>
                          <th className="text-left p-4 font-semibold">LLC Fee</th>
                          <th className="text-left p-4 font-semibold">Corporation Fee</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stateFees.map((state, index) => (
                          <tr key={index} className="border-b hover:bg-muted/50">
                            <td className="p-4 font-medium">{state.state}</td>
                            <td className="p-4 text-primary font-semibold">{state.llc}</td>
                            <td className="p-4 text-primary font-semibold">{state.corp}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </CardContent>
              </Card>
              <div className="mt-4 p-4 bg-muted/50 rounded-lg">
                <p className="text-sm text-muted-foreground">
                  * Fees are current as of 2024 and subject to change. Additional fees may apply for expedited processing, registered agent services, and other options.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-16 bg-gradient-primary text-white">
          <div className="container mx-auto px-4">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl font-bold mb-6">Need Help Choosing the Right State?</h2>
              <p className="text-xl text-white/90 mb-8">
                Our business formation experts can help you choose the best state for your specific business needs.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-4">Get Expert Advice</Button>
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

export default StateRequirements;