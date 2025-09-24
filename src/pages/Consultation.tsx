import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, Clock, Users, MessageCircle, Phone, Video, Calendar } from "lucide-react"
import Navigation from "@/components/Navigation"
import { supabase } from "@/integrations/supabase/client"
import { useAuth } from "@/hooks/useAuth"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import consultationMeeting from "@/assets/consultation-meeting.jpg"

const Consultation = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    businessType: "",
    consultationType: "",
    questions: ""
  });
  const [loading, setLoading] = useState(false);
  
  const { user } = useAuth();
  const { toast } = useToast();
  const navigate = useNavigate();

  const consultationTypes = [
    {
      title: "Business Structure Consultation",
      description: "Get personalized advice on choosing the right business entity (LLC, Corporation, etc.) for your specific needs and goals.",
      icon: <Users className="h-8 w-8" />,
      duration: "30 minutes"
    },
    {
      title: "State-Specific Guidance", 
      description: "Learn about the requirements, benefits, and considerations for forming your business in your preferred state.",
      icon: <MessageCircle className="h-8 w-8" />,
      duration: "20 minutes"
    },
    {
      title: "Tax Strategy Discussion",
      description: "Understand the tax implications of different business structures and strategies to minimize your tax burden.",
      icon: <CheckCircle className="h-8 w-8" />,
      duration: "45 minutes"
    }
  ];

  const meetingFormats = [
    {
      title: "Phone Call",
      description: "Quick and convenient phone consultation at your preferred time",
      icon: <Phone className="h-6 w-6" />
    },
    {
      title: "Video Conference", 
      description: "Face-to-face video call with screen sharing for documents",
      icon: <Video className="h-6 w-6" />
    },
    {
      title: "In-Person Meeting",
      description: "Meet at our office or a convenient location near you",
      icon: <Users className="h-6 w-6" />
    }
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await supabase
        .from('consultation_requests')
        .insert({
          user_id: user?.id || null,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          business_type: formData.businessType,
          consultation_type: formData.consultationType,
          questions: formData.questions
        });

      if (error) throw error;

      toast({
        title: "Consultation Request Submitted!",
        description: "We'll contact you within 24 hours to schedule your free consultation.",
      });

      // Reset form
      setFormData({
        name: "",
        email: "",
        phone: "",
        businessType: "",
        consultationType: "",
        questions: ""
      });

      // If user is logged in, redirect to dashboard
      if (user) {
        navigate('/dashboard');
      }
    } catch (error) {
      console.error('Error submitting consultation request:', error);
      toast({
        title: "Error",
        description: "There was a problem submitting your request. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main>
        {/* Hero Section */}
        <section className="py-16 bg-gradient-subtle">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center">
              <Badge variant="secondary" className="mb-4">Free Consultation</Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Get Expert Guidance for Your <span className="gradient-hero bg-clip-text text-transparent">Business Formation</span>
              </h1>
              <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
                Schedule a free consultation with our business formation experts. Get personalized advice, 
                understand your options, and make informed decisions about your business structure.
              </p>
              <div className="flex items-center justify-center space-x-8 text-sm text-muted-foreground">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>100% Free</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>No Obligations</span>
                </div>
                <div className="flex items-center space-x-2">
                  <CheckCircle className="h-5 w-5 text-success" />
                  <span>Expert Advice</span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Consultation Types */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl font-bold mb-4">What We Can Help You With</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                Our experienced consultants can provide guidance on a wide range of business formation topics
              </p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-8 mb-16">
              {consultationTypes.map((type, index) => (
                <Card key={index} className="text-center hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="inline-flex p-4 rounded-full bg-primary/10 text-primary mb-4 mx-auto">
                      {type.icon}
                    </div>
                    <CardTitle className="text-xl">{type.title}</CardTitle>
                    <Badge variant="outline">{type.duration}</Badge>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground">{type.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>

            {/* Meeting Formats */}
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold mb-4">Choose Your Preferred Format</h3>
              <p className="text-muted-foreground">We offer flexible consultation options to fit your schedule</p>
            </div>
            
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              {meetingFormats.map((format, index) => (
                <Card key={index} className="text-center">
                  <CardContent className="p-6">
                    <div className="inline-flex p-3 rounded-full bg-accent text-accent-foreground mb-3">
                      {format.icon}
                    </div>
                    <h4 className="font-semibold mb-2">{format.title}</h4>
                    <p className="text-sm text-muted-foreground">{format.description}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Request Form */}
        <section className="py-16 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto">
              <div className="text-center mb-8">
                <h2 className="text-3xl font-bold mb-4">Request Your Free Consultation</h2>
                <p className="text-muted-foreground">
                  Fill out the form below and we'll get back to you within 24 hours to schedule your consultation
                </p>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle>Consultation Request Form</CardTitle>
                  <CardDescription>
                    All fields marked with * are required
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                      <Label htmlFor="name">Full Name *</Label>
                      <Input
                        id="name"
                        placeholder="Your full name"
                        value={formData.name}
                        onChange={(e) => handleInputChange("name", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="email">Email Address *</Label>
                      <Input
                        id="email"
                        type="email"
                        placeholder="your@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        required
                      />
                    </div>

                    <div>
                      <Label htmlFor="phone">Phone Number</Label>
                      <Input
                        id="phone"
                        type="tel"
                        placeholder="(555) 123-4567"
                        value={formData.phone}
                        onChange={(e) => handleInputChange("phone", e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="businessType">What type of business are you starting? *</Label>
                      <Select value={formData.businessType} onValueChange={(value) => handleInputChange("businessType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select business type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="llc">Limited Liability Company (LLC)</SelectItem>
                          <SelectItem value="c-corp">C Corporation</SelectItem>
                          <SelectItem value="s-corp">S Corporation</SelectItem>
                          <SelectItem value="partnership">Partnership</SelectItem>
                          <SelectItem value="sole-proprietorship">Sole Proprietorship</SelectItem>
                          <SelectItem value="nonprofit">Nonprofit Organization</SelectItem>
                          <SelectItem value="unsure">Not sure yet</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="consultationType">What type of consultation do you need? *</Label>
                      <Select value={formData.consultationType} onValueChange={(value) => handleInputChange("consultationType", value)}>
                        <SelectTrigger>
                          <SelectValue placeholder="Select consultation type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="business-structure">Business Structure Consultation</SelectItem>
                          <SelectItem value="state-guidance">State-Specific Guidance</SelectItem>
                          <SelectItem value="tax-strategy">Tax Strategy Discussion</SelectItem>
                          <SelectItem value="general">General Questions</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="questions">Questions or Additional Information</Label>
                      <Textarea
                        id="questions"
                        placeholder="Tell us about your business goals, specific questions you have, or anything else you'd like to discuss..."
                        value={formData.questions}
                        onChange={(e) => handleInputChange("questions", e.target.value)}
                        className="min-h-[100px]"
                      />
                    </div>

                    <Button type="submit" size="lg" className="w-full" disabled={loading}>
                      {loading ? "Submitting..." : "Request Free Consultation"}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto">
              <div className="text-center mb-12">
                <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
                <p className="text-muted-foreground">
                  Common questions about our free consultation service
                </p>
              </div>
              
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