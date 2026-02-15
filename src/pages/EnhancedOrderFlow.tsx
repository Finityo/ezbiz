import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import OrderStepIndicator from "@/components/order/OrderStepIndicator";
import EntityTypeSelector from "@/components/order/EntityTypeSelector";
import PackageSelector from "@/components/order/PackageSelector";
import AddOnServices from "@/components/order/AddOnServices";
import PaymentSection from "@/components/dashboard/PaymentSection";
import { STRIPE_PACKAGES, STRIPE_ADDONS, type PackageId, type AddonId } from "@/lib/stripe-config";
import { getStateFee } from "@/lib/state-fees";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const steps = ['Entity Type', 'Package', 'Information', 'Payment'];
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
  const [currentStep, setCurrentStep] = useState(1);
  const [submitting, setSubmitting] = useState(false);
  const [selectedEntity, setSelectedEntity] = useState("");
  const [selectedPackage, setSelectedPackage] = useState("");
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [formData, setFormData] = useState({
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

  const isStepComplete = (step: number): boolean => {
    switch (step) {
      case 1: return selectedEntity !== "";
      case 2: return selectedPackage !== "";
      case 3: return !!(formData.state && formData.businessName && formData.firstName && 
                       formData.lastName && formData.email && formData.phone);
      default: return false;
    }
  };

  const stateFee = formData.state ? getStateFee(formData.state) : 0;

  const calculateTotal = () => {
    const pkg = selectedPackage ? STRIPE_PACKAGES[selectedPackage as PackageId] : null;
    const basePrice = pkg?.price || 0;
    const addonsTotal = selectedAddOns.reduce((sum, addonId) => {
      const addon = STRIPE_ADDONS[addonId as AddonId];
      return sum + (addon?.price || 0);
    }, 0);
    return basePrice + addonsTotal + stateFee;
  };

  const buildLineItems = () => {
    const items: { priceId: string; quantity?: number }[] = [];
    if (selectedPackage && STRIPE_PACKAGES[selectedPackage as PackageId]) {
      items.push({ priceId: STRIPE_PACKAGES[selectedPackage as PackageId].priceId });
    }
    selectedAddOns.forEach((addonId) => {
      const addon = STRIPE_ADDONS[addonId as AddonId];
      if (addon) items.push({ priceId: addon.priceId });
    });
    return items;
  };

  const handleSubmit = async () => {
    setSubmitting(true);
    
    try {
      const { data: { session } } = await supabase.auth.getSession();
      
      if (!session) {
        toast.error("Please sign in to submit your order");
        navigate('/auth');
        return;
      }

      // First create the order
      const response = await supabase.functions.invoke('corpnet-api', {
        body: {
          entityType: selectedEntity,
          package: selectedPackage,
          state: formData.state,
          businessName: formData.businessName,
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          address: formData.address,
          city: formData.city,
          zipCode: formData.zipCode,
          addOns: selectedAddOns
        }
      });

      if (response.error) throw response.error;

      // Move to payment step
      setCurrentStep(4);
      
    } catch (error) {
      console.error('Error submitting order:', error);
      toast.error("Failed to submit order. Please try again.");
      setSubmitting(false);
    }
  };

  const handlePaymentSuccess = () => {
    setSubmitting(false);
    toast.success("Payment processed! Your order has been submitted.");
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      
      <div className="flex-grow bg-gradient-to-br from-primary/5 via-background to-accent/5">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-center mb-2">
              Start Your Business Formation
            </h1>
            <p className="text-center text-muted-foreground mb-8">
              Complete your order in {steps.length} simple steps
            </p>

            <OrderStepIndicator currentStep={currentStep} steps={steps} />

            <Card className="mt-8 p-6">
              {/* Step 1: Entity Type */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-semibold mb-2">Choose Your Entity Type</h2>
                    <p className="text-muted-foreground">Select the business structure that fits your needs</p>
                  </div>
                  
                  <EntityTypeSelector
                    selected={selectedEntity}
                    onSelect={setSelectedEntity}
                  />
                  
                  <div className="flex justify-end">
                    <Button 
                      onClick={() => setCurrentStep(2)}
                      disabled={!isStepComplete(1)}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Package Selection */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-semibold mb-2">Select Your Package</h2>
                    <p className="text-muted-foreground">Choose the service level that matches your requirements</p>
                  </div>
                  
                  <PackageSelector
                    selected={selectedPackage}
                    onSelect={setSelectedPackage}
                    stateFees={stateFee}
                  />
                  
                  <div className="flex justify-between">
                    <Button onClick={() => setCurrentStep(1)} variant="outline">
                      Back
                    </Button>
                    <Button 
                      onClick={() => setCurrentStep(3)}
                      disabled={!isStepComplete(2)}
                    >
                      Continue
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Information & Add-ons */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-semibold mb-2">Business Information</h2>
                    <p className="text-muted-foreground">Tell us about your business</p>
                  </div>
                  
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="state">State *</Label>
                        <Select value={formData.state} onValueChange={(value) => setFormData({ ...formData, state: value })}>
                          <SelectTrigger>
                            <SelectValue placeholder="Select state" />
                          </SelectTrigger>
                          <SelectContent>
                            {US_STATES.map((state) => (
                              <SelectItem key={state} value={state}>{state}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div>
                        <Label htmlFor="businessName">Business Name *</Label>
                        <Input
                          id="businessName"
                          value={formData.businessName}
                          onChange={(e) => setFormData({ ...formData, businessName: e.target.value })}
                          placeholder="Enter business name"
                        />
                      </div>

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
                    </div>
                  </div>

                  <div className="border-t pt-6 mt-6">
                    <h3 className="text-lg font-semibold mb-4">Optional Add-on Services</h3>
                    <AddOnServices
                      selected={selectedAddOns}
                      onToggle={(addonId) => {
                        setSelectedAddOns(prev =>
                          prev.includes(addonId)
                            ? prev.filter(id => id !== addonId)
                            : [...prev, addonId]
                        );
                      }}
                    />
                  </div>
                  
                  <div className="flex justify-between">
                    <Button onClick={() => setCurrentStep(2)} variant="outline">
                      Back
                    </Button>
                    <Button 
                      onClick={handleSubmit}
                      disabled={!isStepComplete(3) || submitting}
                    >
                      {submitting ? "Processing..." : "Continue to Payment"}
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 4: Payment */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <PaymentSection
                    amount={calculateTotal()}
                    lineItems={buildLineItems()}
                    stateFee={formData.state ? { amount: stateFee, stateName: formData.state } : undefined}
                    onPaymentSuccess={handlePaymentSuccess}
                  />
                  
                  <div className="flex justify-between">
                    <Button onClick={() => setCurrentStep(3)} variant="outline" disabled={submitting}>
                      Back
                    </Button>
                  </div>
                </div>
              )}
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default EnhancedOrderFlow;
