import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, User, Shield } from "lucide-react"
import Logo from "@/components/ui/logo"
import { useAuth } from "@/hooks/useAuth"
import { Link, useNavigate } from "react-router-dom"
import { supabase } from "@/integrations/supabase/client"
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

  const businessStructures = [
    { title: "Limited Liability Company (LLC)", href: "/form-llc", description: "Most popular choice for small businesses" },
    { title: "C Corporation", href: "/c-corporation", description: "Best for raising capital and going public" },
    { title: "S Corporation", href: "/s-corporation", description: "Avoid double taxation" },
    { title: "Professional Corporation", href: "/professional-corporation", description: "For licensed professionals" },
    { title: "Nonprofit Corporation", href: "/nonprofit-corporation", description: "For charitable organizations" },
    { title: "Partnership", href: "/partnership", description: "For multi-owner businesses" },
    { title: "Sole Proprietorship", href: "/sole-proprietorship", description: "Simplest business structure" },
  ];

  const services = [
    { title: "Business Filings", href: "/business-filings", description: "Comprehensive filing and compliance services" },
    { title: "Registered Agent", href: "/registered-agent", description: "Professional registered agent services" },
    { title: "Business Name Search", href: "/name-search", description: "Check name availability" },
    { title: "DBA Filing", href: "/dba-filing", description: "Doing Business As registration" },
    { title: "EIN Number", href: "/ein-number", description: "Federal tax ID number" },
    { title: "Operating Agreement", href: "/operating-agreement", description: "LLC operating agreements" },
    { title: "Corporate Bylaws", href: "/corporate-bylaws", description: "Corporation bylaws" },
  ];

  const resources = [
    { title: "Business Formation Guide", href: "/business-guide", description: "Complete guide to starting a business" },
    { title: "State Requirements", href: "/state-requirements", description: "Requirements by state" },
    { title: "Pricing", href: "/pricing", description: "Transparent pricing for all services" },
    { title: "Free Consultation", href: "/consultation", description: "Speak with a business expert" },
    // Downloadable PDFs
    { title: "LLC Formation Guide", href: "/LLC-Formation-Guide.pdf", description: "Comprehensive LLC formation guide", isDownload: true },
    { title: "Corporation Handbook", href: "/Corporation-Handbook.pdf", description: "Complete corporation handbook", isDownload: true },
    { title: "Business License Checklist", href: "/Business-License-Checklist.pdf", description: "Essential business license checklist", isDownload: true },
    { title: "Tax Election Guide", href: "/Tax-Election-Guide.pdf", description: "Understanding tax elections", isDownload: true },
  ];

  return (
    <nav className="border-b border-border bg-background/95 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Logo size="md" />
          
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
                    <div className="grid w-[600px] gap-3 p-6 md:grid-cols-2">
                      {businessStructures.map((item) => (
                        <NavigationMenuLink key={item.href} asChild>
                          <Link
                            to={item.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">{item.title}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {item.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Services Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-muted-foreground hover:text-foreground transition-fast bg-transparent">
                    Services
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="grid w-[500px] gap-3 p-6 md:grid-cols-2">
                      {services.map((item) => (
                        <NavigationMenuLink key={item.href} asChild>
                          <Link
                            to={item.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">{item.title}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {item.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>

                {/* Resources Dropdown */}
                <NavigationMenuItem>
                  <NavigationMenuTrigger className="text-muted-foreground hover:text-foreground transition-fast bg-transparent">
                    Resources
                  </NavigationMenuTrigger>
                  <NavigationMenuContent>
                    <div className="w-[400px] gap-3 p-6">
                      {resources.map((item) => (
                        <NavigationMenuLink key={item.href} asChild>
                          {item.isDownload ? (
                            <a
                              href={item.href}
                              download
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none flex items-center">
                                {item.title}
                                <span className="ml-2 text-xs bg-success text-success-foreground px-2 py-1 rounded">PDF</span>
                              </div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {item.description}
                              </p>
                            </a>
                          ) : (
                            <Link
                              to={item.href}
                              className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                            >
                              <div className="text-sm font-medium leading-none">{item.title}</div>
                              <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                                {item.description}
                              </p>
                            </Link>
                          )}
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <Link to="/pricing" className="text-muted-foreground hover:text-foreground transition-fast">
              Pricing
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
                {isAdmin && (
                  <Button variant="outline" onClick={() => navigate('/admin')}>
                    <Shield className="h-4 w-4 mr-2" />
                    Admin
                  </Button>
                )}
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
                    {isAdmin && (
                      <DropdownMenuItem onClick={() => navigate('/admin')}>
                        <Shield className="h-4 w-4 mr-2" />
                        Admin Panel
                      </DropdownMenuItem>
                    )}
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
                <Button variant="hero" size="sm" onClick={() => navigate('/form-llc')}>
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
                  {businessStructures.slice(0, 4).map((item) => (
                    <a key={item.href} href={item.href} className="block text-sm text-muted-foreground hover:text-foreground py-1">
                      {item.title}
                    </a>
                  ))}
                </div>
              </div>

              {/* Mobile Services */}
              <div className="space-y-2">
                <h3 className="font-semibold text-sm text-foreground">Services</h3>
                <div className="space-y-1 pl-4">
                  {services.slice(0, 4).map((item) => (
                    <a key={item.href} href={item.href} className="block text-sm text-muted-foreground hover:text-foreground py-1">
                      {item.title}
                    </a>
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
                    {isAdmin && (
                      <Button variant="outline" className="justify-start" onClick={() => navigate('/admin')}>
                        <Shield className="h-4 w-4 mr-2" />
                        Admin Panel
                      </Button>
                    )}
                    <Button variant="outline" onClick={signOut}>
                      Sign Out
                    </Button>
                  </>
                ) : (
                  <>
                    <Button variant="ghost" className="justify-start" onClick={() => navigate('/auth')}>
                      Sign In
                    </Button>
                    <Button variant="hero" size="sm" onClick={() => navigate('/form-llc')}>
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