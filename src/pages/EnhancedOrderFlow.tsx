import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import OrderStepIndicator from "@/components/order/OrderStepIndicator";
import EntityTypeSelector from "@/components/order/EntityTypeSelector";
import PackageSelector from "@/components/order/PackageSelector";
import AddOnServices from "@/components/order/AddOnServices";
import { ArrowRight, ArrowLeft } from "lucide-react";

const STEPS = ["Entity Type", "Package", "Add-ons", "Information", "Review"];

const US_STATES = [
  "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", 
  "Delaware", "District Of Columbia", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", 
  "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", 
  "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", 
  "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", 
  "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", 
  "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", 
  "Wisconsin", "Wyoming"
];

const EnhancedOrderFlow = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [currentStep, setCurrentStep] = useState(1);
  
  // Order data
  const [formData, setFormData] = useState({
    entityType: "",
    package: "",
    addOns: [] as string[],
    state: "",
    businessName: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    city: "",
    zipCode: ""
  });

  const handleNext = () => {
    // Validation for each step
    if (currentStep === 1 && !formData.entityType) {
      toast({
        title: "Entity Type Required",
        description: "Please select a business entity type",
        variant: "destructive"
      });
      return;
    }
    
    if (currentStep === 2 && !formData.package) {
      toast({
        title: "Package Required",
        description: "Please select a formation package",
        variant: "destructive"
      });
      return;
    }

    if (currentStep === 4) {
      if (!formData.state || !formData.businessName || !formData.firstName || 
          !formData.lastName || !formData.email || !formData.phone) {
        toast({
          title: "Missing Information",
          description: "Please fill in all required fields",
          variant: "destructive"
        });
        return;
      }
    }

    if (currentStep < STEPS.length) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleSubmit = () => {
    // This will be connected to CorpNet API
    toast({
      title: "Order Submitted!",
      description: "We're processing your business formation request.",
    });
    
    // Navigate to dashboard (to be created)
    navigate("/dashboard");
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="bg-gradient-to-br from-primary/5 via-background to-primary/10">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-5xl mx-auto">
            <h1 className="text-3xl lg:text-4xl font-bold text-center mb-2">
              Start Your Business with Finityo
            </h1>
            <p className="text-center text-muted-foreground mb-6">
              Complete your business formation in just a few steps
            </p>
            
            <OrderStepIndicator currentStep={currentStep} steps={STEPS} />
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto">
          
          {/* Step 1: Entity Type */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Choose Your Entity Type</h2>
                <p className="text-muted-foreground">Select the business structure that best fits your needs</p>
              </div>
              
              <EntityTypeSelector
                selected={formData.entityType}
                onSelect={(entityType) => setFormData({ ...formData, entityType })}
              />
            </div>
          )}

          {/* Step 2: Package Selection */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Select Your Package</h2>
                <p className="text-muted-foreground">Choose the service level that matches your requirements</p>
              </div>
              
              <PackageSelector
                selected={formData.package}
                onSelect={(pkg) => setFormData({ ...formData, package: pkg })}
                stateFees={formData.state ? 100 : 0}
              />
            </div>
          )}

          {/* Step 3: Add-ons */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Add Optional Services</h2>
                <p className="text-muted-foreground">Enhance your package with additional services</p>
              </div>
              
              <AddOnServices
                selected={formData.addOns}
                onToggle={(addOnId) => {
                  const newAddOns = formData.addOns.includes(addOnId)
                    ? formData.addOns.filter(id => id !== addOnId)
                    : [...formData.addOns, addOnId];
                  setFormData({ ...formData, addOns: newAddOns });
                }}
              />
            </div>
          )}

          {/* Step 4: Information */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Business & Contact Information</h2>
                <p className="text-muted-foreground">Tell us about your business and how to reach you</p>
              </div>
              
              <Card className="p-6">
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="state">State of Formation *</Label>
                      <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
                        <SelectTrigger id="state">
                          <SelectValue placeholder="Select state" />
                        </SelectTrigger>
                        <SelectContent className="bg-popover z-50">
                          {US_STATES.map((state) => (
                            <SelectItem key={state} value={state}>{state}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="businessName">Desired Business Name *</Label>
                      <Input
                        id="businessName"
                        value={formData.businessName}
                        onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                        placeholder="Enter business name"
                      />
                    </div>
                  </div>

                  <div className="border-t pt-6">
                    <h3 className="font-semibold mb-4">Contact Information</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input
                          id="firstName"
                          value={formData.firstName}
                          onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input
                          id="lastName"
                          value={formData.lastName}
                          onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="phone">Phone *</Label>
                        <Input
                          id="phone"
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        />
                      </div>

                      <div className="md:col-span-2">
                        <Label htmlFor="address">Street Address</Label>
                        <Input
                          id="address"
                          value={formData.address}
                          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="city">City</Label>
                        <Input
                          id="city"
                          value={formData.city}
                          onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                        />
                      </div>

                      <div>
                        <Label htmlFor="zipCode">ZIP Code</Label>
                        <Input
                          id="zipCode"
                          value={formData.zipCode}
                          onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Step 5: Review */}
          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold mb-2">Review Your Order</h2>
                <p className="text-muted-foreground">Please verify your information before submitting</p>
              </div>
              
              <Card className="p-6">
                <div className="space-y-6">
                  <div>
                    <h3 className="font-semibold mb-2">Business Information</h3>
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                      <p><span className="font-medium">Entity Type:</span> {formData.entityType}</p>
                      <p><span className="font-medium">State:</span> {formData.state}</p>
                      <p><span className="font-medium">Business Name:</span> {formData.businessName}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Package & Add-ons</h3>
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                      <p><span className="font-medium">Package:</span> {formData.package}</p>
                      <p><span className="font-medium">Add-ons:</span> {formData.addOns.length > 0 ? formData.addOns.join(", ") : "None"}</p>
                    </div>
                  </div>

                  <div>
                    <h3 className="font-semibold mb-2">Contact Information</h3>
                    <div className="bg-muted/50 p-4 rounded-lg space-y-2">
                      <p>{formData.firstName} {formData.lastName}</p>
                      <p>{formData.email}</p>
                      <p>{formData.phone}</p>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <Button
              variant="outline"
              onClick={handleBack}
              disabled={currentStep === 1}
              size="lg"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back
            </Button>

            {currentStep < STEPS.length ? (
              <Button onClick={handleNext} size="lg" className="bg-primary hover:bg-primary-dark">
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            ) : (
              <Button onClick={handleSubmit} size="lg" className="bg-success hover:bg-success/90">
                Submit Order
              </Button>
            )}
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EnhancedOrderFlow;
