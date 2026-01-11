import Logo from "@/components/ui/logo";
import { Separator } from "@/components/ui/separator";

const Footer = () => {
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
    { name: "LLC vs Corporation Guide", href: "/consultation" },
    { name: "Tax Election Guide", href: "/consultation" },
    { name: "Compliance Checklist", href: "/consultation" },
    { name: "Business License Guide", href: "/consultation" },
  ];

  const templates = [
    { name: "LLC Operating Agreement", href: "/LLC-Formation-Guide.pdf", isDownload: true },
    { name: "Corporate Bylaws Template", href: "/Corporation-Handbook.pdf", isDownload: true },
    { name: "Meeting Minutes Template", href: "/consultation" },
    { name: "Business License Checklist", href: "/Business-License-Checklist.pdf", isDownload: true },
    { name: "Tax Election Forms", href: "/Tax-Election-Guide.pdf", isDownload: true },
    { name: "Articles of Amendment", href: "/consultation" },
  ];

  const learningCenter = [
    { name: "How to Start a Business", href: "/consultation" },
    { name: "Choosing Business Structure", href: "/consultation" },
    { name: "Business Banking Guide", href: "/consultation" },
    { name: "Business Insurance Guide", href: "/consultation" },
    { name: "Annual Compliance Guide", href: "/consultation" },
    { name: "Business Tax Guide", href: "/consultation" },
  ];

  const tools = [
    { name: "Business Name Search", href: "/name-search" },
    { name: "State Fee Calculator", href: "/state-requirements" },
    { name: "Business Structure Quiz", href: "/consultation" },
    { name: "Compliance Calendar", href: "/consultation" },
    { name: "Document Checklist", href: "/consultation" },
    { name: "Free Consultation", href: "/consultation" },
  ];

  const company = [
    { name: "About EZ BIZ", href: "/about" },
    { name: "Our Process", href: "/about" },
    { name: "Pricing", href: "/pricing" },
    { name: "Customer Reviews", href: "/consultation" },
    { name: "Contact Us", href: "/consultation" },
    { name: "Support Center", href: "/consultation" },
    { name: "Admin Access", href: "/auth" },
  ];

  const legal = [
    { name: "Privacy Policy", href: "/privacy" },
    { name: "Terms of Service", href: "/terms" },
    { name: "Refund Policy", href: "/refund-policy" },
    { name: "Security", href: "/consultation" },
    { name: "Accessibility", href: "/consultation" },
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
      <div className="py-16">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-8">
            
            {/* Company Info */}
            <div className="col-span-2 space-y-4">
              <Logo size="sm" />
              <p className="text-muted-foreground text-sm max-w-xs">
                Professional business formation services trusted by entrepreneurs nationwide. 
                Fast, reliable, and affordable incorporation services in all 50 states.
              </p>
              <div className="flex flex-col space-y-2 text-sm text-muted-foreground">
                <span>📞 1-888-EZ-BIZ-FILE</span>
                <span>✉️ support@ezbizfile.com</span>
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
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <div className="text-center md:text-left">
              <p className="text-sm text-muted-foreground">
                &copy; 2024 EZ BIZ FILE SERVICE. All rights reserved. Professional business formation services nationwide.
              </p>
            </div>
            <div className="flex items-center space-x-6 text-sm text-muted-foreground">
              <span className="flex items-center space-x-1">
                <span className="text-success">✓</span>
                <span>100% Satisfaction Guaranteed</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="text-success">✓</span>
                <span>All 50 States</span>
              </span>
              <span className="flex items-center space-x-1">
                <span className="text-success">✓</span>
                <span>Fast 24-48 Hour Filing</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;