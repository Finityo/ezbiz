import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useOrderContext } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import OrderProgressBar from "@/components/order/OrderProgressBar";
import { ArrowRight, ArrowLeft, Loader2, ShieldCheck } from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";

const irsSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50),
  lastName: z.string().trim().min(1, "Last name is required").max(50),
  ssn: z
    .string()
    .trim()
    .regex(/^\d{3}-?\d{2}-?\d{4}$/, "Enter a valid SSN (XXX-XX-XXXX)"),
  phone: z.string().trim().min(7, "Phone number is required").max(20),
  title: z.string().trim().min(1, "Title is required").max(100),
});

export default function IrsContact() {
  const navigate = useNavigate();
  const { order, updateField, saveStep, saving } = useOrderContext();
  const [errors, setErrors] = useState<Record<string, string>>({});

  const setField = (field: string, value: string) =>
    updateField("irsParty", { ...order.irsParty, [field]: value });

  const formatSsn = (raw: string): string => {
    const digits = raw.replace(/\D/g, "").slice(0, 9);
    if (digits.length <= 3) return digits;
    if (digits.length <= 5) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
    return `${digits.slice(0, 3)}-${digits.slice(3, 5)}-${digits.slice(5)}`;
  };

  const handleSsnChange = (value: string) => {
    setField("ssn", formatSsn(value));
  };

  const validate = (): boolean => {
    const result = irsSchema.safeParse(order.irsParty);
    if (result.success) {
      setErrors({});
      return true;
    }
    const errs: Record<string, string> = {};
    result.error.issues.forEach((i) => (errs[String(i.path[0])] = i.message));
    setErrors(errs);
    toast.error("Please fill in all required fields.");
    return false;
  };

  const handleContinue = async () => {
    if (!validate()) return;
    await saveStep(2);
    navigate("/order/terms");
  };

  const FieldError = ({ name }: { name: string }) =>
    errors[name] ? <p className="text-xs text-destructive mt-1">{errors[name]}</p> : null;

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-grow bg-gradient-to-br from-primary/5 via-background to-accent/5 py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <OrderProgressBar currentStep={3} />

          <h1 className="text-2xl sm:text-3xl font-bold text-center">IRS Responsible Party</h1>
          <p className="text-center text-muted-foreground">
            The IRS requires a responsible party for your EIN application. This person controls, manages, or directs the entity.
          </p>

          <Card className="p-5 sm:p-6 space-y-5">
            <div className="flex items-center gap-2 p-3 rounded-lg bg-primary/5 border border-primary/20">
              <ShieldCheck className="h-5 w-5 text-primary shrink-0" />
              <p className="text-sm text-muted-foreground">
                Your SSN is encrypted before storage and never stored in plain text. We use industry-standard encryption to protect your data.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>First Name *</Label>
                <Input
                  value={order.irsParty.firstName}
                  onChange={(e) => setField("firstName", e.target.value)}
                  placeholder="John"
                />
                <FieldError name="firstName" />
              </div>
              <div>
                <Label>Last Name *</Label>
                <Input
                  value={order.irsParty.lastName}
                  onChange={(e) => setField("lastName", e.target.value)}
                  placeholder="Doe"
                />
                <FieldError name="lastName" />
              </div>
              <div>
                <Label>Social Security Number (SSN) *</Label>
                <Input
                  type="password"
                  value={order.irsParty.ssn}
                  onChange={(e) => handleSsnChange(e.target.value)}
                  placeholder="XXX-XX-XXXX"
                  maxLength={11}
                  autoComplete="off"
                />
                <FieldError name="ssn" />
              </div>
              <div>
                <Label>Phone Number *</Label>
                <Input
                  type="tel"
                  value={order.irsParty.phone}
                  onChange={(e) => setField("phone", e.target.value)}
                  placeholder="(555) 123-4567"
                />
                <FieldError name="phone" />
              </div>
              <div className="md:col-span-2">
                <Label>Title *</Label>
                <Input
                  value={order.irsParty.title}
                  onChange={(e) => setField("title", e.target.value)}
                  placeholder="e.g. Managing Member, CEO, President"
                />
                <FieldError name="title" />
              </div>
            </div>
          </Card>

          <div className="flex justify-between items-center pt-2">
            <Button variant="outline" onClick={() => navigate("/order/processing-speed")} disabled={saving}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <Button onClick={handleContinue} disabled={saving} size="lg">
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ArrowRight className="h-4 w-4 mr-2" />}
              {saving ? "Encrypting & Saving..." : "Continue"}
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
