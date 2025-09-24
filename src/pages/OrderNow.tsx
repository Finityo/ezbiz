import { useState } from "react";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Star, Phone, CheckCircle } from "lucide-react";

const OrderNow = () => {
  const [selectedState, setSelectedState] = useState("");
  const [selectedBusinessType, setSelectedBusinessType] = useState("");
  const [activeTab, setActiveTab] = useState("new");

  const states = [
    "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
    "Delaware", "District Of Columbia", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", 
    "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", 
    "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", 
    "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", 
    "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
    "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", 
    "Wisconsin", "Wyoming"
  ];

  const businessTypes = [
    "LLC (Limited Liability Company)",
    "Corporation",
    "S Corporation", 
    "C Corporation",
    "Partnership",
    "Sole Proprietorship",
    "Nonprofit Corporation"
  ];

  const includedServices = [
    "Name Availability Check",
    "Document Preparation and Submission", 
    "Official Filed Articles of Incorporation/Organization",
    "FREE Registered Agent Services (1st Year ONLY)",
    "Federal Tax ID/EIN Obtainment",
    "Customized Bylaws, Minutes, and Resolutions (Corporations)",
    "Customized Operating Agreement, Minutes, and Resolutions (LLC's)",
    "Customized Kit & Seal"
  ];

  const additionalServices = [
    "S-Corp Election Submission and Filing (IRS Form 2553)",
    "Business License Research Package", 
    "FinCEN BOI Reporting Submission and Filing",
    "Initial/Annual Report Submission and Filing"
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />

      {/* Hero Section */}
      <div className="bg-gradient-to-br from-primary/5 via-background to-primary/10 py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto">
            <div className="lg:w-2/3 mb-8 lg:mb-0">
              <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-4">
                The Smartest Way to Start a Business.
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                Each package is backed by our 100% Satisfaction Guarantee
              </p>
            </div>
            
            {/* Trustpilot Widget */}
            <div className="lg:w-1/3 flex justify-center lg:justify-end">
              <div className="bg-white p-4 rounded-lg shadow-md border">
                <div className="flex items-center mb-2">
                  <div className="flex text-green-500 mr-3">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <span className="font-bold text-green-600">Trustpilot</span>
                </div>
                <div className="text-sm">
                  <span className="font-bold">TrustScore 4.9</span> | <span className="font-bold">1,157</span> reviews
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        {/* Tabs */}
        <div className="flex mb-6 border-b">
          <button 
            onClick={() => setActiveTab("new")}
            className={`pb-3 px-4 font-medium border-b-2 transition-colors ${
              activeTab === "new" 
                ? "border-primary text-primary" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            New Business
          </button>
          <button 
            onClick={() => setActiveTab("existing")}
            className={`pb-3 px-4 font-medium border-b-2 transition-colors ml-6 ${
              activeTab === "existing" 
                ? "border-primary text-primary" 
                : "border-transparent text-muted-foreground hover:text-foreground"
            }`}
          >
            Existing Business
          </button>
        </div>

        {/* New Business Tab Content */}
        {activeTab === "new" && (
          <Card className="p-6 lg:p-8">
            <div className="mb-6">
              <h2 className="text-2xl lg:text-3xl font-bold mb-2">Form A New Business With BusinessForm</h2>
              <p className="text-muted-foreground">All The Filing Services You Need To Keep Your Business Running Smoothly</p>
            </div>
            
            {/* Form */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              <Select value={selectedState} onValueChange={setSelectedState}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select State" />
                </SelectTrigger>
                <SelectContent>
                  {states.map((state) => (
                    <SelectItem key={state} value={state}>
                      {state}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Select value={selectedBusinessType} onValueChange={setSelectedBusinessType}>
                <SelectTrigger className="h-12">
                  <SelectValue placeholder="Select Business Type" />
                </SelectTrigger>
                <SelectContent>
                  {businessTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <Button 
                size="lg" 
                className="h-12 bg-orange-500 hover:bg-orange-600 text-white font-bold tracking-wide"
                disabled={!selectedState || !selectedBusinessType}
              >
                CONTINUE
              </Button>
            </div>

            {/* Services Lists */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold mb-4 text-foreground">Included With A Complete Formation Package:</h3>
                <ul className="space-y-3">
                  {includedServices.map((service, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-green-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm leading-relaxed">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-4 text-foreground">Additional Optional Services (Add-Ons):</h3>
                <ul className="space-y-3">
                  {additionalServices.map((service, index) => (
                    <li key={index} className="flex items-start">
                      <CheckCircle className="h-5 w-5 text-blue-600 mr-3 mt-0.5 flex-shrink-0" />
                      <span className="text-sm leading-relaxed">{service}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </Card>
        )}

        {/* Existing Business Tab Content */}
        {activeTab === "existing" && (
          <Card className="p-6 lg:p-8">
            <div className="text-center py-12">
              <h2 className="text-2xl font-bold mb-4">Services for Existing Businesses</h2>
              <p className="text-muted-foreground mb-6">
                We offer comprehensive services to help maintain and grow your established business.
              </p>
              <Button size="lg" className="bg-orange-500 hover:bg-orange-600">
                View Services
              </Button>
            </div>
          </Card>
        )}
      </div>

      <Footer />
    </div>
  );
};

export default OrderNow;
