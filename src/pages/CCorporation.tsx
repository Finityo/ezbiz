import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, ArrowRight, TrendingUp, Users, Shield, Globe } from "lucide-react";
import Footer from "@/components/Footer";
import { useNavigate } from "react-router-dom";

const CCorporation = () => {
  const navigate = useNavigate();
  const benefits = [
    {
      icon: <TrendingUp className="h-8 w-8" />,
      title: "Unlimited Growth Potential",
      description: "No limit on number of shareholders or types of stock you can issue"
    },
    {
      icon: <Users className="h-8 w-8" />,
      title: "Attract Investors",
      description: "Preferred structure for venture capital and institutional investors"
    },
    {
      icon: <Shield className="h-8 w-8" />,
      title: "Limited Liability Protection",
      description: "Personal assets are protected from business debts and liabilities"
    },
    {
      icon: <Globe className="h-8 w-8" />,
      title: "Go Public Ready", 
      description: "Easily transition to public company status when you're ready"
    }
  ];

  const features = [
    "Separate legal entity from owners",
    "Limited liability protection for shareholders",
    "Perpetual existence",
    "Easy transfer of ownership through stock",
    "Professional management structure",
    "Access to capital markets",
    "Deductible business expenses",
    "Employee stock ownership plans"
  ];

  const comparisonData = [
    { feature: "Liability Protection", llc: "Yes", scorp: "Yes", ccorp: "Yes" },
    { feature: "Number of Owners", llc: "Unlimited", scorp: "Max 100", ccorp: "Unlimited" },
    { feature: "Ownership Transfer", llc: "Complex", scorp: "Restricted", ccorp: "Easy" },
    { feature: "Investment Attraction", llc: "Limited", scorp: "Limited", ccorp: "Excellent" },
    { feature: "Going Public", llc: "Difficult", scorp: "Cannot", ccorp: "Yes" },
    { feature: "Tax Treatment", llc: "Pass-through", scorp: "Pass-through", ccorp: "Double taxation" }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="py-16 md:py-24 gradient-subtle">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <Badge variant="secondary" className="text-sm">
              Best for Growth & Investment
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Incorporate Your <span className="gradient-hero bg-clip-text text-transparent">C Corporation</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
              C Corporation formation is ideal for businesses planning to raise capital, go public, 
              or scale rapidly. Get unlimited growth potential with professional incorporation services.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="hero" size="lg" className="group" onClick={() => navigate('/pricing')}>
                Incorporate Now - $199
                <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
              </Button>
              <Button variant="professional" size="lg" onClick={() => navigate('/consultation')}>
                Free Incorporation Guide
              </Button>
            </div>
            <div className="flex items-center justify-center space-x-6 text-sm text-muted-foreground">
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Delaware Incorporation Available</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Professional Management Structure</span>
              </div>
              <div className="flex items-center space-x-1">
                <CheckCircle className="h-4 w-4 text-success" />
                <span>Investor Ready</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Benefits of C Corporation</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              The C Corporation structure offers maximum flexibility for growth, 
              investment, and eventual public offering
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="inline-flex p-4 rounded-full gradient-primary text-primary-foreground">
                  {benefit.icon}
                </div>
                <h3 className="text-xl font-semibold">{benefit.title}</h3>
                <p className="text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20 bg-card">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold">Key Features of C Corporations</h2>
              <p className="text-xl text-muted-foreground">
                C Corporations provide the most sophisticated business structure with 
                features designed for growth and investment.
              </p>
              <ul className="space-y-3">
                {features.map((feature, index) => (
                  <li key={index} className="flex items-start space-x-3">
                    <CheckCircle className="h-5 w-5 text-success mt-1 flex-shrink-0" />
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
              <Button variant="hero" size="lg" onClick={() => navigate('/pricing')}>
                Start Incorporation Process
              </Button>
            </div>
            <div className="bg-gradient-subtle rounded-lg p-8">
              <h3 className="text-xl font-semibold mb-6">Perfect for businesses that:</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>Plan to raise venture capital</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>Want to go public eventually</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>Need multiple classes of stock</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>Have institutional investors</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  <span>Plan rapid scaling</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Comparison Table */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-3xl md:text-4xl font-bold">Compare Business Structures</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              See how C Corporation compares to other business structures
            </p>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-border bg-card rounded-lg">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-left p-4 font-semibold">Feature</th>
                  <th className="text-center p-4 font-semibold">LLC</th>
                  <th className="text-center p-4 font-semibold">S Corporation</th>
                  <th className="text-center p-4 font-semibold bg-primary/10">C Corporation</th>
                </tr>
              </thead>
              <tbody>
                {comparisonData.map((row, index) => (
                  <tr key={index} className="border-b border-border last:border-b-0">
                    <td className="p-4 font-medium">{row.feature}</td>
                    <td className="p-4 text-center">{row.llc}</td>
                    <td className="p-4 text-center">{row.scorp}</td>
                    <td className="p-4 text-center bg-primary/5 font-semibold">{row.ccorp}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 gradient-hero text-primary-foreground">
        <div className="container mx-auto px-4 text-center space-y-8">
          <h2 className="text-3xl md:text-4xl font-bold">Ready to Incorporate?</h2>
          <p className="text-xl opacity-90 max-w-2xl mx-auto">
            Start your C Corporation today and unlock unlimited growth potential. 
            Our experts will handle all the paperwork and filings.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button variant="secondary" size="lg" className="shadow-lg hover:shadow-xl" onClick={() => navigate('/pricing')}>
              Start Incorporation - $199
            </Button>
            <Button variant="professional" size="lg" className="bg-primary-foreground/10 border-primary-foreground/20 hover:bg-primary-foreground hover:text-primary" onClick={() => navigate('/consultation')}>
              Speak with Expert
            </Button>
          </div>
        </div>
      </section>
      
      <Footer />
    </div>
  );
};

export default CCorporation;