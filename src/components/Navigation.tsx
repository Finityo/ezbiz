import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, User, Shield } from "lucide-react"
import Logo from "@/components/ui/logo"
import { useAuth } from "@/hooks/useAuth"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
import { useToast } from "@/hooks/use-toast"
import { generateLLCGuide } from "@/lib/pdf-generators/llc-guide"
import { generateCorporationHandbook } from "@/lib/pdf-generators/corporation-handbook"
import { generateLicenseChecklist } from "@/lib/pdf-generators/license-checklist"
import { generateTaxGuide } from "@/lib/pdf-generators/tax-guide"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  const handlePDFDownload = async (title: string, generator: () => any, filename: string) => {
    toast({ title: "Generating PDF...", description: `Creating your ${title}.` });
    try {
      await new Promise(resolve => setTimeout(resolve, 100));
      const doc = generator();
      doc.save(filename);
      toast({ title: "Download Complete!", description: `${title} has been downloaded.` });
    } catch (error) {
      toast({ title: "Download Failed", description: "Please try again.", variant: "destructive" });
    }
  };

  // Check if user is admin
  useEffect(() => {
    const checkAdminStatus = async () => {
      if (user) {
        try {
          const { data } = await supabase
            .from('user_roles')
            .select('role')
            .eq('user_id', user.id)
            .eq('role', 'admin')
            .maybeSingle();
          
          setIsAdmin(!!data);
        } catch (error) {
          console.error('Error checking admin status:', error);
        }
      } else {
        setIsAdmin(false);
      }
    };

    checkAdminStatus();
  }, [user]);

  // Business Structures - organized by category
  const businessStructuresLLC = [
    { title: "LLC Formation", href: "/form-llc", description: "Most popular choice for small businesses", badge: "Popular" },
  ];

  const businessStructuresCorporations = [
    { title: "C Corporation", href: "/c-corporation", description: "Best for raising capital and going public" },
    { title: "S Corporation", href: "/s-corporation", description: "Avoid double taxation with pass-through" },
    { title: "Professional Corporation", href: "/professional-corporation", description: "For licensed professionals" },
    { title: "Nonprofit Corporation", href: "/nonprofit-corporation", description: "For charitable organizations" },
  ];

  const businessStructuresOther = [
    { title: "Partnership", href: "/partnership", description: "General, Limited, and LLP structures" },
    { title: "Sole Proprietorship", href: "/sole-proprietorship", description: "Simplest business structure" },
    { title: "DBA / Trade Name", href: "/dba-filing", description: "Doing Business As registration" },
  ];

  const services = [
    { title: "Business Filings", href: "/business-filings", description: "Comprehensive filing and compliance services" },
    { title: "Registered Agent", href: "/registered-agent", description: "Professional registered agent services" },
    { title: "Annual Reports", href: "/annual-report", description: "Annual report filing services" },
    { title: "Compliance Services", href: "/compliance", description: "Stay compliant with state requirements" },
  ];

  const businessDocuments = [
    { title: "Business Name Search", href: "/name-search", description: "Check name availability" },
    { title: "EIN Number", href: "/ein-number", description: "Federal tax ID number" },
    { title: "Operating Agreement", href: "/operating-agreement", description: "LLC operating agreements" },
    { title: "Corporate Bylaws", href: "/corporate-bylaws", description: "Corporation bylaws" },
  ];

  const resources = [
    { title: "Business Formation Guide", href: "/business-guide", description: "Complete guide to starting a business" },
    { title: "Blog", href: "/blog", description: "Expert articles on formation & compliance" },
    { title: "Business Templates", href: "/business-templates", description: "Free fillable document templates" },
    { title: "State Requirements", href: "/state-requirements", description: "Requirements by state" },
    { title: "Pricing", href: "/pricing", description: "Transparent pricing for all services" },
    
  ];

  const downloads = [
    { title: "LLC Formation Guide", description: "Comprehensive LLC formation guide", generator: generateLLCGuide, filename: "LLC-Formation-Guide.pdf" },
    { title: "Corporation Handbook", description: "Complete corporation handbook", generator: generateCorporationHandbook, filename: "Corporation-Handbook.pdf" },
    { title: "Business License Checklist", description: "Essential business license checklist", generator: generateLicenseChecklist, filename: "Business-License-Checklist.pdf" },
    { title: "Tax Election Guide", description: "Understanding tax elections", generator: generateTaxGuide, filename: "Tax-Election-Guide.pdf" },
  ];

  

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link to="/">
            <Logo size="md" />
          </Link>
          
          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center space-x-8">
            <NavigationMenu>
              <NavigationMenuList>
              {/* Business Structures Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-muted-foreground hover:text-foreground transition-fast bg-transparent">
                    Business Structures
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[650px] p-6">
                      <div className="grid grid-cols-3 gap-6">
                        {/* LLC Column */}
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-3 flex items-center">
                            LLC Formation
                            <span className="ml-2 text-xs bg-secondary/20 text-secondary px-2 py-0.5 rounded">Popular</span>
                          </h4>
                          {businessStructuresLLC.map((item) => (
                            <NavigationMenuLink key={item.href} asChild>
                              <Link
                                to={item.href}
                                className="block select-none rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                              >
                                <div className="text-sm font-medium leading-none">{item.title}</div>
                                <p className="text-xs leading-snug text-muted-foreground mt-1">{item.description}</p>
                              </Link>
                            </NavigationMenuLink>
                          ))}
                        </div>
                        
                        {/* Corporations Column */}
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-3">Corporations</h4>
                          {businessStructuresCorporations.map((item) => (
                            <NavigationMenuLink key={item.href} asChild>
                              <Link
                                to={item.href}
                                className="block select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                              >
                                <div className="text-sm font-medium leading-none">{item.title}</div>
                                <p className="text-xs leading-snug text-muted-foreground mt-1">{item.description}</p>
                              </Link>
                            </NavigationMenuLink>
                          ))}
                        </div>
                        
                        {/* Other Structures Column */}
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-3">Other Structures</h4>
                          {businessStructuresOther.map((item) => (
                            <NavigationMenuLink key={item.href} asChild>
                              <Link
                                to={item.href}
                                className="block select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                              >
                                <div className="text-sm font-medium leading-none">{item.title}</div>
                                <p className="text-xs leading-snug text-muted-foreground mt-1">{item.description}</p>
                              </Link>
                            </NavigationMenuLink>
                          ))}
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Services Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-muted-foreground hover:text-foreground transition-fast bg-transparent">
                    Services
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[550px] p-6">
                      <div className="grid grid-cols-2 gap-6">
                        {/* Filing Services */}
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-3">Filing Services</h4>
                          {services.map((item) => (
                            <NavigationMenuLink key={item.href} asChild>
                              <Link
                                to={item.href}
                                className="block select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                              >
                                <div className="text-sm font-medium leading-none">{item.title}</div>
                                <p className="text-xs leading-snug text-muted-foreground mt-1">{item.description}</p>
                              </Link>
                            </NavigationMenuLink>
                          ))}
                        </div>
                        
                        {/* Business Documents */}
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-3">Business Documents</h4>
                          {businessDocuments.map((item) => (
                            <NavigationMenuLink key={item.href} asChild>
                              <Link
                                to={item.href}
                                className="block select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                              >
                                <div className="text-sm font-medium leading-none">{item.title}</div>
                                <p className="text-xs leading-snug text-muted-foreground mt-1">{item.description}</p>
                              </Link>
                            </NavigationMenuLink>
                          ))}
                        </div>
                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Resources Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-muted-foreground hover:text-foreground transition-fast bg-transparent">
                    Resources
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[500px] p-6">
                      <div className="grid grid-cols-2 gap-6">
                        {/* Guides & Info */}
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-3">Guides & Info</h4>
                          {resources.map((item) => (
                            <NavigationMenuLink key={item.href} asChild>
                              <Link
                                to={item.href}
                                className="block select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                              >
                                <div className="text-sm font-medium leading-none">{item.title}</div>
                                <p className="text-xs leading-snug text-muted-foreground mt-1">{item.description}</p>
                              </Link>
                            </NavigationMenuLink>
                          ))}
                        </div>
                        
                        {/* Downloads */}
                        <div>
                          <h4 className="text-sm font-semibold text-foreground mb-3">Free Downloads</h4>
                          {downloads.map((item) => (
                            <NavigationMenuLink key={item.filename} asChild>
                              <button
                                onClick={() => handlePDFDownload(item.title, item.generator, item.filename)}
                                className="block w-full text-left select-none rounded-md p-2 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground cursor-pointer"
                              >
                                <div className="text-sm font-medium leading-none flex items-center">
                                  {item.title}
                                  <span className="ml-2 text-xs bg-success/20 text-success px-1.5 py-0.5 rounded">PDF</span>
                                </div>
                                <p className="text-xs leading-snug text-muted-foreground mt-1">{item.description}</p>
                              </button>
                            </NavigationMenuLink>
                          ))}
                        </div>

                      </div>
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-fast">
              Pricing
            </Link>
            <Link to="/entrepreneurs" className="text-muted-foreground hover:text-foreground transition-fast">
              For Founders
            </Link>
            <Link to="/about" className="text-muted-foreground hover:text-foreground transition-fast">
              About
            </Link>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            {user ? (
              <>
                <Button variant="ghost" onClick={() => navigate('/dashboard')}>
                  <User className="h-4 w-4 mr-2" />
                  Dashboard
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost">
                      Account
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => navigate('/dashboard')}>
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />

                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={signOut}>
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={() => navigate('/auth')}>
                  Sign In
                </Button>
                <Button variant="hero" size="sm" onClick={() => navigate('/order-flow')}>
                  Get Started
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <Button
            variant="ghost"
            size="icon"
            className="lg:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </Button>
        </div>

        {/* Mobile Navigation */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 pb-4 border-t border-border pt-4">
            <div className="space-y-4">
              {/* Mobile Business Structures */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-foreground">Business Structures</h3>
                <div className="space-y-1 pl-4">
                  {[...businessStructuresLLC, ...businessStructuresCorporations.slice(0, 2), ...businessStructuresOther.slice(0, 1)].map((item) => (
                    <Link key={item.href} to={item.href} className="block text-sm text-muted-foreground hover:text-foreground py-1">
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mobile Services */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-foreground">Services</h3>
                <div className="space-y-1 pl-4">
                  {[...services, ...businessDocuments.slice(0, 2)].slice(0, 6).map((item) => (
                    <Link key={item.href} to={item.href} className="block text-sm text-muted-foreground hover:text-foreground py-1">
                      {item.title}
                    </Link>
                  ))}
                </div>
              </div>

              {/* Mobile Free Downloads */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-foreground">Free Downloads</h3>
                <div className="space-y-1 pl-4">
                  {downloads.map((item) => (
                    <button
                      key={item.filename}
                      onClick={() => {
                        setIsMobileMenuOpen(false);
                        handlePDFDownload(item.title, item.generator, item.filename);
                      }}
                      className="flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground py-1 w-full text-left"
                    >
                      {item.title}
                      <span className="text-xs bg-success/20 text-success px-1.5 py-0.5 rounded">PDF</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Mobile Action Buttons */}
              <div className="flex flex-col space-y-2 pt-4 border-t border-border">
                {user ? (
                  <>
                    <Button variant="ghost" className="justify-start" onClick={() => navigate('/dashboard')}>
                      <User className="h-4 w-4 mr-2" />
                      Dashboard
                    </Button>
                    <Button variant="outline" onClick={signOut}>

                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" className="justify-start" onClick={() => navigate('/auth')}>
                      Sign In
                    </Button>
                    <Button variant="hero" size="sm" onClick={() => navigate('/order-flow')}>
                      Get Started
                    </Button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;