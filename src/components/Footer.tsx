import Logo from "@/components/ui/logo";
import { trackPhoneClick, trackEmailClick } from "@/lib/analytics";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/hooks/use-toast";
import { generateLLCGuide } from "@/lib/pdf-generators/llc-guide";
import { generateCorporationHandbook } from "@/lib/pdf-generators/corporation-handbook";
import { generateLicenseChecklist } from "@/lib/pdf-generators/license-checklist";
import { generateTaxGuide } from "@/lib/pdf-generators/tax-guide";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useAdminAuth } from "@/hooks/useAdminAuth";


const Footer = () => {
  const { toast } = useToast();
  const { user } = useAuth();
  const { isAdmin } = useAdminAuth();
  const adminHref = user && isAdmin ? "/admin" : "/admin/login";


  const handlePDFDownload = (title: string, generator: () => any, filename: string) => {
    toast({ title: "Generating PDF...", description: `Creating your ${title}.` });
    try {
      const doc = generator();
      doc.save(filename);
      toast({ title: "Download Complete!", description: `${title} has been downloaded.` });
    } catch (error) {
      toast({ title: "Download Failed", description: "Please try again.", variant: "destructive" });
    }
  };

  const pdfDownloads = [
    { name: "LLC Formation Guide", generator: generateLLCGuide, filename: "LLC-Formation-Guide.pdf" },
    { name: "Corporation Handbook", generator: generateCorporationHandbook, filename: "Corporation-Handbook.pdf" },
    { name: "Business License Checklist", generator: generateLicenseChecklist, filename: "Business-License-Checklist.pdf" },
    { name: "Tax Election Guide", generator: generateTaxGuide, filename: "Tax-Election-Guide.pdf" },
  ];
  const businessStructures = [
    { name: "LLC Formation", href: "/form-llc" },
    { name: "C Corporation", href: "/c-corporation" },
    { name: "S Corporation", href: "/s-corporation" },
    { name: "Professional Corp", href: "/professional-corporation" },
    { name: "Nonprofit Corp", href: "/nonprofit-corporation" },
    { name: "Partnership", href: "/partnership" },
  ];

  const services = [
    { name: "Business Filings", href: "/business-filings" },
    { name: "Registered Agent", href: "/registered-agent" },
    { name: "DBA Filing", href: "/dba-filing" },
    { name: "EIN Number", href: "/ein-number" },
    { name: "Annual Reports", href: "/annual-report" },
    { name: "Compliance Services", href: "/compliance" },
  ];

  const guides = [
    { name: "Business Formation Guide", href: "/business-guide" },
    { name: "State Requirements", href: "/state-requirements" },
    { name: "LLC vs Corporation Guide", href: "/business-guide" },
    { name: "Tax Election Guide", href: "/business-guide" },
    { name: "Compliance Checklist", href: "/business-guide" },
    { name: "Business License Guide", href: "/business-guide" },
  ];

  const templates = [
    { name: "LLC Operating Agreement", href: "/business-guide" },
    { name: "Corporate Bylaws Template", href: "/business-guide" },
    { name: "Meeting Minutes Template", href: "/business-guide" },
    { name: "Business License Checklist", href: "/business-guide" },
    { name: "Tax Election Forms", href: "/business-guide" },
    { name: "Articles of Amendment", href: "/business-guide" },
  ];

  const learningCenter = [
    { name: "How to Start a Business", href: "/business-guide" },
    { name: "Choosing Business Structure", href: "/business-guide" },
    { name: "Business Banking Guide", href: "/business-guide" },
    { name: "Business Insurance Guide", href: "/business-guide" },
    { name: "Annual Compliance Guide", href: "/business-guide" },
    { name: "Business Tax Guide", href: "/business-guide" },
  ];

  const tools = [
    { name: "Business Name Search", href: "/name-search" },
    { name: "State Fee Calculator", href: "/state-requirements" },
    { name: "Business Structure Quiz", href: "/business-guide" },
    { name: "Compliance Calendar", href: "/business-guide" },
    { name: "Document Checklist", href: "/business-guide" },
    { name: "Start Your Filing", href: "/pricing" },
  ];

  const company = [
    { name: "About EZ BIZ", href: "/about" },
    { name: "Our Process", href: "/about" },
    { name: "Pricing", href: "/pricing" },
    { name: "Customer Reviews", href: "/about" },
    { name: "Contact Us", href: "/about" },
    { name: "Support Center", href: "/about" },
    { name: "Admin Access", href: "/admin/login" },
  ];

  const legal = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Refund Policy", href: "/refund-policy" },
    { name: "Security", href: "/business-guide" },
    { name: "Accessibility", href: "/business-guide" },
  ];

  const FooterLink = ({ item }: { item: { name: string; href: string; isDownload?: boolean } }) => {
    if (item.isDownload) {
      return (
        <li>
          <a 
            href={item.href} 
            download 
            className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-1"
          >
            {item.name}
            <span className="text-xs bg-success text-success-foreground px-1 py-0.5 rounded">PDF</span>
          </a>
        </li>
      );
    }
    
    return (
      <li>
        <a 
          href={item.href} 
          className="text-muted-foreground hover:text-foreground transition-colors text-sm"
        >
          {item.name}
        </a>
      </li>
    );
  };

  return (
    <footer className="border-t border-border bg-card">
      {/* Main Footer Content */}
      <div className="py-10 md:py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-8 gap-6 md:gap-8">
            
            {/* Company Info */}
            <div className="col-span-2 space-y-4">
              <Logo size="sm" />
              <p className="text-muted-foreground text-sm max-w-xs">
                Professional business formation services trusted by entrepreneurs nationwide. 
                Fast, reliable, and affordable incorporation services in all 50 states.
              </p>
              <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
                <span>📍 1101 Thorpe Lane Ste 105-1028</span>
                <span className="ml-5">San Marcos, TX 78666</span>
                <a href="tel:+18308371955" onClick={() => trackPhoneClick('(830) 837-1955')} className="hover:text-foreground transition-colors">📞 (830) 837-1955</a>
                <a href="mailto:info@ezbiz-fs.com" onClick={() => trackEmailClick('info@ezbiz-fs.com')} className="hover:text-foreground transition-colors">✉️ info@ezbiz-fs.com</a>
                <span>🕒 Mon-Fri 9AM-6PM EST</span>
              </div>
            </div>

            {/* Business Structures */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Business Structures</h4>
              <ul className="space-y-2">
                {businessStructures.map((item) => (
                  <FooterLink key={item.name} item={item} />
                ))}
              </ul>
            </div>

            {/* Services */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Services</h4>
              <ul className="space-y-2">
                {services.map((item) => (
                  <FooterLink key={item.name} item={item} />
                ))}
              </ul>
            </div>

            {/* Guides & Resources */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Guides & Resources</h4>
              <ul className="space-y-2">
                {guides.map((item) => (
                  <FooterLink key={item.name} item={item} />
                ))}
              </ul>
            </div>

            {/* Templates */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Templates</h4>
              <ul className="space-y-2">
                {templates.map((item) => (
                  <FooterLink key={item.name} item={item} />
                ))}
              </ul>
            </div>

            {/* Learning Center */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Learning Center</h4>
              <ul className="space-y-2">
                {learningCenter.map((item) => (
                  <FooterLink key={item.name} item={item} />
                ))}
              </ul>
            </div>

            {/* Tools */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Tools</h4>
              <ul className="space-y-2">
                {tools.map((item) => (
                  <FooterLink key={item.name} item={item} />
                ))}
              </ul>
            </div>
            {/* Free Downloads */}
            <div>
              <h4 className="font-semibold text-foreground mb-4">Free Downloads</h4>
              <ul className="space-y-2">
                {pdfDownloads.map((item) => (
                  <li key={item.filename}>
                    <button
                      onClick={() => handlePDFDownload(item.name, item.generator, item.filename)}
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm flex items-center gap-1 cursor-pointer"
                    >
                      {item.name}
                      <span className="text-xs bg-success/20 text-success px-1 py-0.5 rounded">PDF</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Secondary Footer Section */}
          <div className="mt-12 pt-8 border-t border-border">
            <div className="grid md:grid-cols-2 gap-8">
              {/* Company Links */}
              <div>
                <h4 className="font-semibold text-foreground mb-4">Company</h4>
                <ul className="grid grid-cols-2 gap-2">
                  {company.map((item) => (
                    <FooterLink key={item.name} item={item} />
                  ))}
                </ul>
              </div>

              {/* Legal Links */}
              <div>
                <h4 className="font-semibold text-foreground mb-4">Legal</h4>
                <ul className="grid grid-cols-2 gap-2">
                  {legal.map((item) => (
                    <FooterLink key={item.name} item={item} />
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Separator />

      {/* Bottom Footer */}
      <div className="py-6">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4 md:gap-0">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                &copy; 2024 EZ BIZ FILE SERVICE, LLC. All rights reserved.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-6 text-sm text-muted-foreground">
              <span className="flex items-center space-x-1">
                <span className="text-success">✓</span>
                <span>Service-Fee Satisfaction Guarantee</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="text-success">✓</span>
                <span>All 50 States</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="text-success">✓</span>
                <span>24-48 Hour Document Prep</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;