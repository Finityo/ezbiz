import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Check, Phone, Video, MessageSquare, Calendar, Users, Shield, Clock } from "lucide-react";
import { useState } from "react";

const Consultation = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessType: "",
    consultationType: "",
    questions: ""
  });

  const consultationTypes = [
    {
      type: "Business Structure",
      icon: Shield,
      description: "Choose the right entity type for your business",
      duration: "30 minutes",
      topics: [
        "LLC vs Corporation comparison", 
        "Tax implications analysis",
        "Liability protection options",
        "Ownership structure planning"
      ]
    },
    {
      type: "State Selection",
      icon: Users,
      description: "Find the best state to incorporate your business",
      duration: "25 minutes", 
      topics: [
        "Delaware vs Wyoming vs Nevada",
        "Home state vs foreign state pros/cons",
        "Tax considerations by state",
        "Compliance requirements comparison"
      ]
    },
    {
      type: "Ongoing Compliance",
      icon: Calendar,
      description: "Understand your ongoing business obligations",
      duration: "20 minutes",
      topics: [
        "Annual report requirements",
        "Tax filing obligations", 
        "Record keeping best practices",
        "Corporate formalities maintenance"
      ]
    }
  ];

  const meetingFormats = [
    {
      format: "Phone Call",
      icon: Phone,
      description: "Traditional phone consultation",
      availability: "Mon-Fri 9am-6pm EST"
    },
    {
      format: "Video Call", 
      icon: Video,
      description: "Zoom or Teams video meeting",
      availability: "Mon-Fri 9am-6pm EST"
    },
    {
      format: "Live Chat",
      icon: MessageSquare, 
      description: "Real-time text-based consultation",
      availability: "Mon-Fri 9am-8pm EST"
    }
  ];

  const benefits = [
    "Expert guidance from business formation specialists",
    "Personalized recommendations for your specific situation", 
    "No-pressure consultation - we're here to educate",
    "Follow-up resources and next steps provided",
    "Same-day scheduling available",
    "100% free with no obligation"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section className="bg-gradient-primary text-white py-20">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <h1 className="text-5xl font-bold mb-6">Free Business Consultation</h1>
              <p className="text-xl mb-8 text-white/90">
                Get expert advice on business formation, structure selection, and compliance requirements
              </p>
              <Button size="lg" variant="secondary" className="text-lg px-8 py-4">
                Schedule Your Free Call
              </Button>
            </div>
          </div>
        </section>

        {/* Consultation Types */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-6xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">What We Can Help You With</h2>
              <div className="grid lg:grid-cols-3 gap-8">
                {consultationTypes.map((consultation, index) => {
                  const IconComponent = consultation.icon;
                  return (
                    <Card key={index} className="h-full">
                      <CardHeader className="text-center">
                        <IconComponent className="h-12 w-12 text-primary mx-auto mb-4" />
                        <CardTitle className="text-xl">{consultation.type}</CardTitle>
                        <CardDescription>{consultation.description}</CardDescription>
                        <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                          <Clock className="h-4 w-4" />
                          <span>{consultation.duration}</span>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <h4 className="font-semibold mb-3">Topics Covered:</h4>
                        <ul className="space-y-2">
                          {consultation.topics.map((topic, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <Check className="h-4 w-4 text-success mt-1 flex-shrink-0" />
                              <span className="text-sm">{topic}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Meeting Formats */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Choose Your Preferred Format</h2>
              <div className="grid md:grid-cols-3 gap-6">
                {meetingFormats.map((format, index) => {
                  const IconComponent = format.icon;
                  return (
                    <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                      <CardHeader>
                        <IconComponent className="h-12 w-12 text-primary mx-auto mb-4" />
                        <CardTitle className="text-lg">{format.format}</CardTitle>
                        <CardDescription>{format.description}</CardDescription>
                      </CardHeader>
                      <CardContent>
                        <p className="text-sm text-muted-foreground mb-4">{format.availability}</p>
                        <Button variant="outline" className="w-full">Select Format</Button>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* Consultation Request Form */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="grid lg:grid-cols-2 gap-12">
                <div>
                  <h2 className="text-3xl font-bold mb-6">Request Your Free Consultation</h2>
                  <p className="text-muted-foreground mb-8">
                    Fill out the form below and we'll contact you within 24 hours to schedule your free consultation.
                  </p>
                  
                  <div className="space-y-4 mb-8">
                    <h3 className="text-xl font-semibold">What You'll Get:</h3>
                    {benefits.map((benefit, index) => (
                      <div key={index} className="flex items-start space-x-3">
                        <Check className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                        <span className="text-muted-foreground">{benefit}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Consultation Request Form</CardTitle>
                    <CardDescription>Tell us about your business needs</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Full Name *</Label>
                        <Input 
                          id="name"
                          placeholder="Enter your full name"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number *</Label>
                        <Input 
                          id="phone"
                          placeholder="(555) 123-4567"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address *</Label>
                      <Input 
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => setFormData({...formData, email: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="businessType">What type of business are you starting?</Label>
                      <Select value={formData.businessType} onValueChange={(value) => setFormData({...formData, businessType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="service">Service Business</SelectItem>
                          <SelectItem value="product">Product/Retail Business</SelectItem>
                          <SelectItem value="professional">Professional Practice</SelectItem>
                          <SelectItem value="restaurant">Restaurant/Food Service</SelectItem>
                          <SelectItem value="ecommerce">E-commerce</SelectItem>
                          <SelectItem value="consulting">Consulting</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="consultationType">What would you like to discuss?</Label>
                      <Select value={formData.consultationType} onValueChange={(value) => setFormData({...formData, consultationType: value})}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select consultation topic" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="structure">Business Structure Selection</SelectItem>
                          <SelectItem value="state">State of Incorporation</SelectItem>
                          <SelectItem value="compliance">Ongoing Compliance</SelectItem>
                          <SelectItem value="general">General Business Formation</SelectItem>
                          <SelectItem value="multiple">Multiple Topics</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="questions">Specific Questions or Details</Label>
                      <Textarea 
                        id="questions"
                        placeholder="Tell us about your specific situation or questions..."
                        rows={4}
                        value={formData.questions}
                        onChange={(e) => setFormData({...formData, questions: e.target.value})}
                      />
                    </div>
                    
                    <Button className="w-full" size="lg">
                      Request Free Consultation
                    </Button>
                    
                    <p className="text-xs text-muted-foreground text-center">
                      By submitting this form, you agree to receive communications from Finityo. 
                      We respect your privacy and will never share your information.
                    </p>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Is the consultation really free?</h4>  
                    <p className="text-sm text-muted-foreground">Yes, our consultation is completely free with no hidden fees or obligations. We believe in providing value upfront.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">How long does a consultation take?</h4>
                    <p className="text-sm text-muted-foreground">Most consultations take 20-30 minutes, depending on the complexity of your questions and needs.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">What if I'm not ready to form my business yet?</h4>
                    <p className="text-sm text-muted-foreground">That's perfectly fine! We're happy to provide educational guidance even if you're still in the planning stages.</p>
                  </div>
                </div>
                <div className="space-y-6">
                  <div>
                    <h4 className="font-semibold mb-2">Who will I be speaking with?</h4>
                    <p className="text-sm text-muted-foreground">You'll speak with one of our experienced business formation specialists who can answer your questions and provide expert guidance.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">Can you help me if I'm in any state?</h4>
                    <p className="text-sm text-muted-foreground">Yes, we help clients form businesses in all 50 states and can advise on the best state for your specific needs.</p>
                  </div>
                  <div>
                    <h4 className="font-semibold mb-2">What happens after the consultation?</h4>
                    <p className="text-sm text-muted-foreground">We'll provide you with a summary of our discussion and next steps. There's no pressure to move forward if you're not ready.</p>
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
              <h2 className="text-3xl font-bold mb-6">Ready to Get Expert Guidance?</h2>
              <p className="text-xl text-white/90 mb-8">
                Don't navigate business formation alone. Get personalized advice from our experts - completely free.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="text-lg px-8 py-4">Schedule Free Consultation</Button>
                <Button size="lg" variant="outline" className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-primary">Call (555) 123-4567</Button>
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

export default Consultation;