import { useState } from "react";
import { Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { Download, FileText, Users, Gavel, ClipboardList, ArrowRight, CheckCircle } from "lucide-react";
import { generateLLCOperatingAgreement } from "@/lib/pdf-generators/llc-operating-agreement";
import { generateCorporateBylaws } from "@/lib/pdf-generators/corporate-bylaws";
import { generateMeetingMinutes } from "@/lib/pdf-generators/meeting-minutes";

interface Template {
  id: string;
  title: string;
  description: string;
  icon: React.ReactNode;
  features: string[];
  pages: number;
  category: "llc" | "corporation" | "general";
  generator: () => ReturnType<typeof generateLLCOperatingAgreement>;
  filename: string;
}

const templates: Template[] = [
  {
    id: "llc-operating-agreement",
    title: "LLC Operating Agreement",
    description: "A comprehensive operating agreement template for Limited Liability Companies with fillable fields for member information, capital contributions, and management structure.",
    icon: <FileText className="h-8 w-8" />,
    features: [
      "Member ownership percentages",
      "Capital contribution schedules",
      "Profit & loss allocation",
      "Management structure options",
      "Transfer restrictions",
      "Dissolution procedures"
    ],
    pages: 12,
    category: "llc",
    generator: generateLLCOperatingAgreement,
    filename: "LLC-Operating-Agreement-Template.pdf"
  },
  {
    id: "corporate-bylaws",
    title: "Corporate Bylaws",
    description: "Complete corporate bylaws template suitable for C-Corporations and S-Corporations, covering governance, shareholder rights, and officer responsibilities.",
    icon: <Gavel className="h-8 w-8" />,
    features: [
      "Shareholder meeting procedures",
      "Board of Directors structure",
      "Officer duties & powers",
      "Stock certificate provisions",
      "Indemnification clauses",
      "Amendment procedures"
    ],
    pages: 13,
    category: "corporation",
    generator: generateCorporateBylaws,
    filename: "Corporate-Bylaws-Template.pdf"
  },
  {
    id: "meeting-minutes",
    title: "Meeting Minutes Templates",
    description: "A collection of meeting minute templates including organizational meetings, annual meetings, special meetings, and written consent forms.",
    icon: <ClipboardList className="h-8 w-8" />,
    features: [
      "Organizational meeting minutes",
      "Annual shareholder meetings",
      "Special board meetings",
      "Written consent in lieu of meeting",
      "Officer election records",
      "Resolution documentation"
    ],
    pages: 10,
    category: "general",
    generator: generateMeetingMinutes,
    filename: "Meeting-Minutes-Templates.pdf"
  }
];

const BusinessTemplates = () => {
  const { toast } = useToast();
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const handleDownload = async (template: Template) => {
    setDownloadingId(template.id);
    
    toast({
      title: "Generating PDF...",
      description: `Creating your ${template.title} template.`,
    });

    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const doc = template.generator();
      doc.save(template.filename);
      
      toast({
        title: "Download Complete!",
        description: `${template.title} has been downloaded.`,
      });
    } catch (error) {
      toast({
        title: "Download Failed",
        description: "There was an error generating the PDF. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDownloadingId(null);
    }
  };

  const handleDownloadAll = async () => {
    toast({
      title: "Generating All Templates...",
      description: "This may take a moment.",
    });

    for (const template of templates) {
      setDownloadingId(template.id);
      await new Promise(resolve => setTimeout(resolve, 800));
      
      try {
        const doc = template.generator();
        doc.save(template.filename);
      } catch (error) {
        console.error(`Error generating ${template.title}:`, error);
      }
    }

    setDownloadingId(null);
    
    toast({
      title: "All Downloads Complete!",
      description: `${templates.length} templates have been downloaded.`,
    });
  };

  const getCategoryBadge = (category: Template["category"]) => {
    switch (category) {
      case "llc":
        return <Badge variant="secondary" className="bg-primary/10 text-primary">LLC</Badge>;
      case "corporation":
        return <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">Corporation</Badge>;
      case "general":
        return <Badge variant="outline">All Entities</Badge>;
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative py-20 bg-gradient-to-b from-slate-navy to-slate-navy/95">
        <div className="absolute inset-0 bg-[url('/placeholder.svg')] opacity-5"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <Badge className="mb-4 bg-warm-bronze/20 text-warm-bronze border-warm-bronze/30">
              Free Downloads
            </Badge>
            <h1 className="text-4xl md:text-5xl font-playfair font-bold text-warm-white mb-6">
              Business Document Templates
            </h1>
            <p className="text-lg text-warm-white/80 mb-8">
              Professional, attorney-drafted templates with fillable fields. 
              Download and customize for your LLC or Corporation.
            </p>
            <Button 
              size="lg" 
              onClick={handleDownloadAll}
              disabled={downloadingId !== null}
              className="bg-warm-bronze hover:bg-warm-bronze/90 text-slate-navy font-semibold"
            >
              <Download className="mr-2 h-5 w-5" />
              Download All Templates
            </Button>
          </div>
        </div>
      </section>

      {/* Templates Grid */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {templates.map((template) => (
              <Card 
                key={template.id} 
                className="border-border/50 hover:border-warm-bronze/50 transition-all duration-300 hover:shadow-lg group"
              >
                <CardHeader>
                  <div className="flex items-start justify-between mb-2">
                    <div className="p-3 rounded-lg bg-slate-navy/5 text-slate-navy group-hover:bg-warm-bronze/10 group-hover:text-warm-bronze transition-colors">
                      {template.icon}
                    </div>
                    {getCategoryBadge(template.category)}
                  </div>
                  <CardTitle className="text-xl font-playfair">{template.title}</CardTitle>
                  <CardDescription className="text-muted-foreground">
                    {template.description}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <FileText className="h-4 w-4" />
                      <span>{template.pages} pages</span>
                    </div>
                    
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-foreground">Includes:</p>
                      <ul className="space-y-1">
                        {template.features.slice(0, 4).map((feature, index) => (
                          <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="h-3.5 w-3.5 text-warm-bronze flex-shrink-0" />
                            {feature}
                          </li>
                        ))}
                        {template.features.length > 4 && (
                          <li className="text-sm text-muted-foreground pl-5">
                            +{template.features.length - 4} more sections
                          </li>
                        )}
                      </ul>
                    </div>
                    
                    <Button 
                      className="w-full mt-4"
                      onClick={() => handleDownload(template)}
                      disabled={downloadingId !== null}
                    >
                      {downloadingId === template.id ? (
                        <>
                          <span className="animate-spin mr-2">⏳</span>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Download PDF
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* How to Use Section */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-3xl font-playfair font-bold text-center mb-12">
              How to Use These Templates
            </h2>
            
            <div className="space-y-6">
              {[
                {
                  step: 1,
                  title: "Download the Template",
                  description: "Click the download button to generate a professional PDF template with fillable fields."
                },
                {
                  step: 2,
                  title: "Fill in Your Information",
                  description: "Open the PDF and complete the fillable fields with your business details, member information, and specific terms."
                },
                {
                  step: 3,
                  title: "Review with Legal Counsel",
                  description: "We recommend having an attorney review your completed documents to ensure they meet your state's requirements."
                },
                {
                  step: 4,
                  title: "Execute and Store",
                  description: "Have all parties sign the documents and store them with your important business records."
                }
              ].map((item) => (
                <div key={item.step} className="flex gap-4">
                  <div className="flex-shrink-0 w-10 h-10 rounded-full bg-warm-bronze text-slate-navy font-bold flex items-center justify-center">
                    {item.step}
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg mb-1">{item.title}</h3>
                    <p className="text-muted-foreground">{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Related Services */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-playfair font-bold text-center mb-4">
            Need Professional Document Preparation?
          </h2>
          <p className="text-center text-muted-foreground mb-12 max-w-2xl mx-auto">
            Our team can prepare customized legal documents tailored to your specific business needs.
          </p>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            <Card className="border-warm-bronze/30 bg-warm-bronze/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5 text-warm-bronze" />
                  Operating Agreement Service
                </CardTitle>
                <CardDescription>
                  Get a professionally prepared operating agreement customized for your LLC.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/operating-agreement">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
            
            <Card className="border-warm-bronze/30 bg-warm-bronze/5">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Gavel className="h-5 w-5 text-warm-bronze" />
                  Corporate Bylaws Service
                </CardTitle>
                <CardDescription>
                  Professional bylaws preparation for your corporation's governance needs.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button asChild variant="outline" className="w-full">
                  <Link to="/corporate-bylaws">
                    Learn More <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 bg-slate-navy">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-playfair font-bold text-warm-white mb-4">
            Ready to Form Your Business?
          </h2>
          <p className="text-warm-white/80 mb-8 max-w-2xl mx-auto">
            Start your LLC or Corporation today with our professional formation services. 
            We'll handle the paperwork so you can focus on building your business.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="bg-warm-bronze hover:bg-warm-bronze/90 text-slate-navy">
              <Link to="/form-llc">
                Form an LLC <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="border-warm-white/30 text-warm-white hover:bg-warm-white/10">
              <Link to="/c-corporation">
                Form a Corporation <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default BusinessTemplates;
