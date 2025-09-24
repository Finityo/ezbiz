import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Download, FileText, Users, Building, Shield } from "lucide-react";

const BusinessGuide = () => {
  const guideSteps = [
    {
      step: 1,
      title: "Choose Your Business Structure",
      description: "Select the right entity type for your business goals",
      details: [
        "Consider liability protection needs",
        "Evaluate tax implications", 
        "Think about ownership structure",
        "Plan for future growth"
      ]
    },
    {
      step: 2,
      title: "Select Your State",
      description: "Choose where to incorporate your business",
      details: [
        "Delaware for corporations seeking investment",
        "Wyoming for LLCs with privacy needs",
        "Home state for local businesses",
        "Consider filing fees and requirements"
      ]
    },
    {
      step: 3,
      title: "Choose and Reserve Your Name",
      description: "Find an available business name",
      details: [
        "Check state availability",
        "Search trademark database",
        "Secure matching domain name",
        "Reserve name if needed"
      ]
    },
    {
      step: 4,
      title: "File Formation Documents",
      description: "Submit required paperwork to the state",
      details: [
        "Prepare Articles of Incorporation/Organization",
        "Pay state filing fees",
        "Appoint registered agent",
        "Wait for state approval"
      ]
    },
    {
      step: 5,
      title: "Obtain Required IDs and Permits",
      description: "Get necessary identification numbers",
      details: [
        "Apply for federal EIN",
        "Register for state taxes",
        "Obtain business licenses",
        "Apply for permits if needed"
      ]
    },
    {
      step: 6,
      title: "Set Up Business Operations",
      description: "Establish your business infrastructure",
      details: [
        "Open business bank account",
        "Set up accounting system",
        "Get business insurance",
        "Create operating agreements"
      ]
    }
  ];

  const resources = [
    {
      title: "LLC Formation Guide",
      description: "Complete guide to forming your LLC",
      type: "PDF",
      pages: "24 pages",
      icon: FileText,
      downloadUrl: "/LLC-Formation-Guide.pdf"
    },
    {
      title: "Corporation Handbook",
      description: "Everything you need to know about corporations",
      type: "PDF", 
      pages: "32 pages",
      icon: Building,
      downloadUrl: "/Corporation-Handbook.pdf"
    },
    {
      title: "Tax Election Guide",
      description: "Understanding business tax elections",
      type: "PDF",
      pages: "16 pages", 
      icon: Shield,
      downloadUrl: "/Tax-Election-Guide.pdf"
    },
    {
      title: "Business License Checklist",
      description: "State-by-state license requirements",
      type: "PDF",
      pages: "28 pages",
      icon: Users,
      downloadUrl: "/Business-License-Checklist.pdf"
    }
  ];

  const businessTypes = [
    {
      type: "Service Business",
      examples: "Consulting, Marketing, IT Services",
      considerations: ["Low startup costs", "Minimal inventory", "Professional liability insurance"]
    },
    {
      type: "Product Business", 
      examples: "Manufacturing, Retail, E-commerce",
      considerations: ["Inventory management", "Product liability", "Distribution channels"]
    },
    {
      type: "Professional Practice",
      examples: "Law, Medicine, Accounting", 
      considerations: ["Professional licensing", "Malpractice insurance", "Regulatory compliance"]
    },
    {
      type: "Restaurant/Food Service",
      examples: "Restaurants, Catering, Food Trucks",
      considerations: ["Health permits", "Liquor licenses", "Food safety regulations"]
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
              <h1 className="text-5xl font-bold mb-6">Complete Business Formation Guide</h1>
              <p className="text-xl mb-8 text-white/90">
                Everything you need to know to start your business the right way
              </p>
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                <Download className="h-5 w-5 mr-2" />
                Download Complete Guide
              </Button>
            </div>
          </div>
        </section>

        {/* Step by Step Guide */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">6 Steps to Start Your Business</h2>
              <div className="space-y-8">
                {guideSteps.map((step, index) => (
                  <Card key={index} className="overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex">
                        <div className="bg-primary text-white p-8 flex items-center justify-center min-w-[120px]">
                          <div className="text-center">
                            <div className="text-3xl font-bold mb-2">Step</div>
                            <div className="text-4xl font-bold">{step.step}</div>
                          </div>
                        </div>
                        <div className="flex-1 p-8">
                          <h3 className="text-2xl font-bold mb-3">{step.title}</h3>
                          <p className="text-muted-foreground mb-4">{step.description}</p>
                          <ul className="grid md:grid-cols-2 gap-2">
                            {step.details.map((detail, idx) => (
                              <li key={idx} className="flex items-start space-x-2">
                                <Check className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                                <span className="text-sm">{detail}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Business Types Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Choose the Right Structure for Your Business Type</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {businessTypes.map((business, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-xl">{business.type}</CardTitle>
                      <CardDescription>{business.examples}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <h4 className="font-semibold mb-3">Key Considerations:</h4>
                      <ul className="space-y-2">
                        {business.considerations.map((consideration, idx) => (
                          <li key={idx} className="flex items-start space-x-2">
                            <Check className="h-4 w-4 text-primary mt-1 flex-shrink-0" />
                            <span className="text-sm text-muted-foreground">{consideration}</span>
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

        {/* Downloadable Resources */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Free Resources & Guides</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {resources.map((resource, index) => {
                  const IconComponent = resource.icon;
                  return (
                    <Card key={index} className="hover:shadow-lg transition-shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-4">
                          <div className="bg-primary/10 p-3 rounded-lg">
                            <IconComponent className="h-8 w-8 text-primary" />
                          </div>
                          <div className="flex-1">
                            <h3 className="text-xl font-semibold mb-2">{resource.title}</h3>
                            <p className="text-muted-foreground mb-3">{resource.description}</p>
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-muted-foreground">{resource.type} • {resource.pages}</span>
                              <Button 
                                size="sm" 
                                variant="outline"
                                asChild
                              >
                                <a href={resource.downloadUrl} download>
                                  <Download className="h-4 w-4 mr-2" />
                                  Download
                                </a>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Common Mistakes Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Common Mistakes to Avoid</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <Card className="border-warning">
                  <CardHeader>
                    <CardTitle className="text-warning">Choosing Wrong Business Structure</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Many entrepreneurs choose their business structure without understanding the long-term implications.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <Check className="h-4 w-4 text-success mt-1" />
                        <span className="text-sm">Research tax implications</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Check className="h-4 w-4 text-success mt-1" />
                        <span className="text-sm">Consider liability protection</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Check className="h-4 w-4 text-success mt-1" />
                        <span className="text-sm">Plan for growth and investors</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-warning">
                  <CardHeader>
                    <CardTitle className="text-warning">Inadequate Record Keeping</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Poor record keeping can lead to tax problems and loss of liability protection.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <Check className="h-4 w-4 text-success mt-1" />
                        <span className="text-sm">Separate business and personal finances</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Check className="h-4 w-4 text-success mt-1" />
                        <span className="text-sm">Maintain corporate formalities</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Check className="h-4 w-4 text-success mt-1" />
                        <span className="text-sm">Keep detailed financial records</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-warning">
                  <CardHeader>
                    <CardTitle className="text-warning">Ignoring Compliance Requirements</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Failing to meet ongoing compliance requirements can result in penalties or loss of good standing.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <Check className="h-4 w-4 text-success mt-1" />
                        <span className="text-sm">File annual reports on time</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Check className="h-4 w-4 text-success mt-1" />
                        <span className="text-sm">Pay required fees and taxes</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Check className="h-4 w-4 text-success mt-1" />
                        <span className="text-sm">Maintain registered agent service</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card className="border-warning">
                  <CardHeader>
                    <CardTitle className="text-warning">No Operating Agreement or Bylaws</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">
                      Operating without proper governing documents can lead to disputes and legal problems.
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-start space-x-2">
                        <Check className="h-4 w-4 text-success mt-1" />
                        <span className="text-sm">Create operating agreement for LLCs</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Check className="h-4 w-4 text-success mt-1" />
                        <span className="text-sm">Adopt bylaws for corporations</span>
                      </div>
                      <div className="flex items-start space-x-2">
                        <Check className="h-4 w-4 text-success mt-1" />
                        <span className="text-sm">Define roles and responsibilities</span>
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
              <h2 className="text-3xl font-bold mb-6">Ready to Start Your Business?</h2>
              <p className="text-xl text-white/90 mb-8">
                Let our experts guide you through the business formation process step by step.
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

export default BusinessGuide;