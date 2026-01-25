import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, FileText, Loader2, CheckCircle } from 'lucide-react';
import Navigation from '@/components/Navigation';
import Footer from '@/components/Footer';
import { generateLLCGuide } from '@/lib/pdf-generators/llc-guide';
import { generateCorporationHandbook } from '@/lib/pdf-generators/corporation-handbook';
import { generateTaxGuide } from '@/lib/pdf-generators/tax-guide';
import { generateLicenseChecklist } from '@/lib/pdf-generators/license-checklist';

const pdfGuides = [
  {
    id: 'llc-guide',
    title: 'LLC Formation Guide',
    description: 'Complete guide to forming and operating an LLC',
    pages: '~15 pages',
    generator: generateLLCGuide,
    filename: 'LLC-Formation-Guide.pdf',
  },
  {
    id: 'corporation-handbook',
    title: 'Corporation Handbook',
    description: 'Everything you need to know about incorporating',
    pages: '~16 pages',
    generator: generateCorporationHandbook,
    filename: 'Corporation-Handbook.pdf',
  },
  {
    id: 'tax-guide',
    title: 'Tax Election Guide',
    description: 'Understanding business tax options and elections',
    pages: '~12 pages',
    generator: generateTaxGuide,
    filename: 'Tax-Election-Guide.pdf',
  },
  {
    id: 'license-checklist',
    title: 'Business License Checklist',
    description: 'State-by-state license and permit requirements',
    pages: '~12 pages',
    generator: generateLicenseChecklist,
    filename: 'Business-License-Checklist.pdf',
  },
];

const GeneratePDFs = () => {
  const [generating, setGenerating] = useState<string | null>(null);
  const [generated, setGenerated] = useState<string[]>([]);

  const handleGenerate = async (guide: typeof pdfGuides[0]) => {
    setGenerating(guide.id);
    
    // Small delay to show loading state
    await new Promise(resolve => setTimeout(resolve, 100));
    
    try {
      const doc = guide.generator();
      doc.save(guide.filename);
      setGenerated(prev => [...prev, guide.id]);
    } catch (error) {
      console.error('Error generating PDF:', error);
    } finally {
      setGenerating(null);
    }
  };

  const handleGenerateAll = async () => {
    for (const guide of pdfGuides) {
      if (!generated.includes(guide.id)) {
        await handleGenerate(guide);
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <div className="accent-line-center mb-6"></div>
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Download Business Guides
            </h1>
            <p className="text-lg text-muted-foreground mb-6">
              Professional, branded PDF guides to help you start and grow your business.
            </p>
            <Button 
              onClick={handleGenerateAll}
              size="lg"
              className="bg-primary hover:bg-primary/90"
              disabled={generating !== null}
            >
              {generating ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Download className="mr-2 h-5 w-5" />
                  Download All Guides
                </>
              )}
            </Button>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {pdfGuides.map((guide) => (
              <Card key={guide.id} className="border-border">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <FileText className="h-6 w-6 text-primary" />
                    </div>
                    {generated.includes(guide.id) && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                  </div>
                  <CardTitle className="text-xl">{guide.title}</CardTitle>
                  <CardDescription>{guide.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{guide.pages}</span>
                    <Button
                      onClick={() => handleGenerate(guide)}
                      variant="outline"
                      disabled={generating !== null}
                    >
                      {generating === guide.id ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Generating...
                        </>
                      ) : (
                        <>
                          <Download className="mr-2 h-4 w-4" />
                          Download
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default GeneratePDFs;
