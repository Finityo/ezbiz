import { useState } from "react";
import { Button } from "@/components/ui/button";
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
import Logo from "@/components/ui/logo";
import { ChevronDown, Menu, X } from "lucide-react";

const Navigation = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
                          <a
                            href={item.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">{item.title}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {item.description}
                            </p>
                          </a>
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
                          <a
                            href={item.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">{item.title}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {item.description}
                            </p>
                          </a>
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
                          <a
                            href={item.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">{item.title}</div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {item.description}
                            </p>
                          </a>
                        </NavigationMenuLink>
                      ))}
                    </div>
                  </NavigationMenuContent>
                </NavigationMenuItem>
              </NavigationMenuList>
            </NavigationMenu>

            <a href="/pricing" className="text-muted-foreground hover:text-foreground transition-fast">
              Pricing
            </a>
            <a href="/about" className="text-muted-foreground hover:text-foreground transition-fast">
              About
            </a>
          </div>

          {/* Desktop Action Buttons */}
          <div className="hidden lg:flex items-center space-x-4">
            <Button variant="ghost">Sign In</Button>
            <Button variant="hero" size="sm">Get Started</Button>
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
                <Button variant="ghost" className="justify-start">Sign In</Button>
                <Button variant="hero" size="sm">Get Started</Button>
              </div>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navigation;