import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useOrderContext, type Participant } from "@/contexts/OrderContext";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { AddressAutocomplete, type ParsedAddress } from "@/components/ui/address-autocomplete";
import { type ProcessingSpeed } from "@/config/pricing";
import { formatPrice } from "@/lib/utils";
import {
  User, Building2, MapPin, Shield, Users, Plus, Trash2, ArrowRight, Save, Loader2, Zap, Clock,
} from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { z } from "zod";

// ──── Validation ────
const contactSchema = z.object({
  firstName: z.string().trim().min(1, "First name is required").max(50),
  lastName: z.string().trim().min(1, "Last name is required").max(50),
  email: z.string().trim().email("Invalid email").max(255),
  phone: z.string().trim().min(7, "Phone is required").max(20),
});

const businessSchema = z.object({
  companyName: z.string().trim().min(1, "Company name is required").max(200),
});

const addressSchema = z.object({
  address1: z.string().trim().min(1, "Street address is required").max(200),
  city: z.string().trim().min(1, "City is required").max(100),
  state: z.string().trim().min(1, "State is required").max(50),
  zip: z.string().trim().min(5, "ZIP code is required").max(10),
});

const US_STATES = [
  "Alabama","Alaska","Arizona","Arkansas","California","Colorado","Connecticut","Delaware",
  "Florida","Georgia","Hawaii","Idaho","Illinois","Indiana","Iowa","Kansas","Kentucky",
  "Louisiana","Maine","Maryland","Massachusetts","Michigan","Minnesota","Mississippi",
  "Missouri","Montana","Nebraska","Nevada","New Hampshire","New Jersey","New Mexico",
  "New York","North Carolina","North Dakota","Ohio","Oklahoma","Oregon","Pennsylvania",
  "Rhode Island","South Carolina","South Dakota","Tennessee","Texas","Utah","Vermont",
  "Virginia","Washington","West Virginia","Wisconsin","Wyoming",
];

export default function CompanyInfo() {
  const navigate = useNavigate();
  const { order, updateField, saveStep, saving } = useOrderContext();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [sameAsBusinessAddr, setSameAsBusinessAddr] = useState(false);

  const setContact = (field: string, value: string) =>
    updateField("contact", { ...order.contact, [field]: value });

  const setBusiness = (field: string, value: any) =>
    updateField("business", { ...order.business, [field]: value });

  const setBusinessAddr = (field: string, value: string) => {
    const updated = { ...order.businessAddress, [field]: value };
    updateField("businessAddress", updated);
    if (sameAsBusinessAddr) updateField("shippingAddress", { ...updated, type: "shipping" as const });
  };

  const setShippingAddr = (field: string, value: string) =>
    updateField("shippingAddress", { ...order.shippingAddress, [field]: value });

  const setAgent = (field: string, value: string) =>
    updateField("registeredAgent", { ...order.registeredAgent, [field]: value });

  const addParticipant = () => {
    const p: Participant = {
      id: crypto.randomUUID(),
      firstName: "",
      lastName: "",
      role: "member",
      title: "",
      ownershipPercent: 0,
      address: "",
      authorizedSigner: false,
    };
    updateField("participants", [...order.participants, p]);
  };

  const removeParticipant = (id: string) =>
    updateField("participants", order.participants.filter((p) => p.id !== id));

  const updateParticipant = (id: string, field: string, value: any) =>
    updateField(
      "participants",
      order.participants.map((p) => (p.id === id ? { ...p, [field]: value } : p))
    );

  const handleSameAddress = (checked: boolean) => {
    setSameAsBusinessAddr(checked);
    if (checked) updateField("shippingAddress", { ...order.businessAddress, type: "shipping" as const });
  };

  const validate = (): boolean => {
    const errs: Record<string, string> = {};

    const cr = contactSchema.safeParse(order.contact);
    if (!cr.success) cr.error.issues.forEach((i) => (errs[`contact.${i.path[0]}`] = i.message));

    const br = businessSchema.safeParse(order.business);
    if (!br.success) br.error.issues.forEach((i) => (errs[`business.${i.path[0]}`] = i.message));

    const ar = addressSchema.safeParse(order.businessAddress);
    if (!ar.success) ar.error.issues.forEach((i) => (errs[`bizAddr.${i.path[0]}`] = i.message));

    if (!sameAsBusinessAddr) {
      const sr = addressSchema.safeParse(order.shippingAddress);
      if (!sr.success) sr.error.issues.forEach((i) => (errs[`shipAddr.${i.path[0]}`] = i.message));
    }

    setErrors(errs);
    if (Object.keys(errs).length > 0) {
      toast.error("Please fill in all required fields.");
      return false;
    }
    return true;
  };

  const handleContinue = async () => {
    if (!validate()) return;
    await saveStep(1);
    navigate("/order/processing-speed");
  };

  const FieldError = ({ name }: { name: string }) =>
    errors[name] ? <p className="text-xs text-destructive mt-1">{errors[name]}</p> : null;

  // ── Address Block Component ──
  const AddressBlock = ({
    label,
    prefix,
    addr,
    setter,
    disabled = false,
  }: {
    label: string;
    prefix: string;
    addr: typeof order.businessAddress;
    setter: (f: string, v: string) => void;
    disabled?: boolean;
  }) => {
    const handleAddressSelect = (parsed: ParsedAddress) => {
      setter("address1", parsed.address1);
      setter("address2", parsed.address2);
      setter("city", parsed.city);
      setter("state", parsed.state);
      setter("zip", parsed.zip);
      setter("country", parsed.country);
    };

    return (
      <div className="space-y-4">
        {label && (
          <h3 className="text-base font-semibold flex items-center gap-2">
            <MapPin className="h-4 w-4 text-primary" /> {label}
          </h3>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label>Street Address *</Label>
            <AddressAutocomplete
              value={addr.address1}
              onChange={(v) => setter("address1", v)}
              onSelect={handleAddressSelect}
              placeholder="Start typing an address..."
              disabled={disabled}
            />
            <FieldError name={`${prefix}.address1`} />
          </div>
          <div className="md:col-span-2">
            <Label>Address Line 2</Label>
            <Input value={addr.address2} onChange={(e) => setter("address2", e.target.value)} disabled={disabled} placeholder="Suite, Apt, Unit" />
          </div>
          <div>
            <Label>City *</Label>
            <Input value={addr.city} onChange={(e) => setter("city", e.target.value)} disabled={disabled} />
            <FieldError name={`${prefix}.city`} />
          </div>
          <div>
            <Label>State *</Label>
            <Select value={addr.state} onValueChange={(v) => setter("state", v)} disabled={disabled}>
              <SelectTrigger><SelectValue placeholder="Select state" /></SelectTrigger>
              <SelectContent>
                {US_STATES.map((s) => (
                  <SelectItem key={s} value={s}>{s}</SelectItem>
                ))}
              </SelectContent>
            </Select>
            <FieldError name={`${prefix}.state`} />
          </div>
          <div>
            <Label>ZIP Code *</Label>
            <Input value={addr.zip} onChange={(e) => setter("zip", e.target.value)} disabled={disabled} maxLength={10} />
            <FieldError name={`${prefix}.zip`} />
          </div>
          <div>
            <Label>Country</Label>
            <Input value={addr.country} disabled className="bg-muted" />
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-grow bg-gradient-to-br from-primary/5 via-background to-accent/5 py-8 px-4">
        <div className="max-w-3xl mx-auto space-y-6">
          <OrderProgressBar currentStep={1} />

          <h1 className="text-2xl sm:text-3xl font-bold text-center">Company Information</h1>
          <p className="text-center text-muted-foreground">
            Fill in your contact details, business information, and company structure.
          </p>

          {/* ── Contact Information ── */}
          <Card className="p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <User className="h-4 w-4 text-primary" /> Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label>First Name *</Label>
                <Input value={order.contact.firstName} onChange={(e) => setContact("firstName", e.target.value)} />
                <FieldError name="contact.firstName" />
              </div>
              <div>
                <Label>Last Name *</Label>
                <Input value={order.contact.lastName} onChange={(e) => setContact("lastName", e.target.value)} />
                <FieldError name="contact.lastName" />
              </div>
              <div>
                <Label>Email *</Label>
                <Input type="email" value={order.contact.email} onChange={(e) => setContact("email", e.target.value)} />
                <FieldError name="contact.email" />
              </div>
              <div>
                <Label>Phone *</Label>
                <Input type="tel" value={order.contact.phone} onChange={(e) => setContact("phone", e.target.value)} />
                <FieldError name="contact.phone" />
              </div>
            </div>
          </Card>

          {/* ── Business Information ── */}
          <Card className="p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <Building2 className="h-4 w-4 text-primary" /> Business Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="md:col-span-2">
                <Label>Company Name *</Label>
                <Input value={order.business.companyName} onChange={(e) => setBusiness("companyName", e.target.value)} placeholder="e.g. Acme Holdings" />
                <FieldError name="business.companyName" />
              </div>
              <div className="md:col-span-2">
                <Label>Alternate Company Name</Label>
                <Input value={order.business.alternateCompanyName} onChange={(e) => setBusiness("alternateCompanyName", e.target.value)} placeholder="Second choice if first is unavailable" />
              </div>
              <div className="md:col-span-2">
                <Label>Business Description</Label>
                <Textarea value={order.business.businessDescription} onChange={(e) => setBusiness("businessDescription", e.target.value)} placeholder="Brief description of your business activities" rows={3} />
              </div>
              <div>
                <Label>Organizer Type</Label>
                <Select value={order.business.organizerType} onValueChange={(v) => setBusiness("organizerType", v)}>
                  <SelectTrigger><SelectValue placeholder="Select type" /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="individual">Individual</SelectItem>
                    <SelectItem value="company">Company</SelectItem>
                    <SelectItem value="attorney">Attorney</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label>Business Purpose</Label>
                <Input value={order.business.businessPurpose} onChange={(e) => setBusiness("businessPurpose", e.target.value)} placeholder="e.g. General consulting" />
              </div>
              <div className="flex items-center gap-3">
                <Switch checked={order.business.delayedFiling} onCheckedChange={(v) => setBusiness("delayedFiling", v)} />
                <Label>Delayed Filing (file at a later date)</Label>
              </div>
            </div>
          </Card>

          {/* ── Business Address ── */}
          <Card className="p-5 sm:p-6 space-y-4">
            <AddressBlock label="Business Address" prefix="bizAddr" addr={order.businessAddress} setter={setBusinessAddr} />
          </Card>

          {/* ── Shipping Address ── */}
          <Card className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <MapPin className="h-4 w-4 text-primary" /> Shipping Address
              </h3>
              <label className="flex items-center gap-2 text-sm">
                <Switch checked={sameAsBusinessAddr} onCheckedChange={handleSameAddress} />
                Same as business
              </label>
            </div>
            {!sameAsBusinessAddr && (
              <AddressBlock label="" prefix="shipAddr" addr={order.shippingAddress} setter={setShippingAddr} />
            )}
            {sameAsBusinessAddr && (
              <p className="text-sm text-muted-foreground">Using business address for shipping.</p>
            )}
          </Card>



          {/* ── Registered Agent ── */}
          <Card className="p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-semibold flex items-center gap-2">
              <Shield className="h-4 w-4 text-primary" /> Registered Agent
            </h3>
            <RadioGroup
              value={order.registeredAgent.agentType}
              onValueChange={(v) => setAgent("agentType", v)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="corpnet" id="agent-corpnet" />
                <Label htmlFor="agent-corpnet" className="cursor-pointer flex-1">
                  <span className="font-medium">Use EZ BIZ Registered Agent Service</span>
                  <p className="text-sm text-muted-foreground">We'll serve as your registered agent ($149/yr)</p>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="custom" id="agent-custom" />
                <Label htmlFor="agent-custom" className="cursor-pointer flex-1">
                  <span className="font-medium">I have my own registered agent</span>
                </Label>
              </div>
            </RadioGroup>
            {order.registeredAgent.agentType === "custom" && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                <div>
                  <Label>Agent Name *</Label>
                  <Input value={order.registeredAgent.name} onChange={(e) => setAgent("name", e.target.value)} />
                </div>
                <div>
                  <Label>Agent Address *</Label>
                  <Input value={order.registeredAgent.address} onChange={(e) => setAgent("address", e.target.value)} />
                </div>
              </div>
            )}
          </Card>

          {/* ── Management Structure ── */}
          <Card className="p-5 sm:p-6 space-y-4">
            <h3 className="text-base font-semibold">Management Structure</h3>
            <RadioGroup
              value={order.managementType}
              onValueChange={(v) => updateField("managementType", v)}
              className="space-y-2"
            >
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="member_managed" id="mgmt-member" />
                <Label htmlFor="mgmt-member" className="cursor-pointer flex-1">
                  <span className="font-medium">Member-Managed</span>
                  <p className="text-sm text-muted-foreground">All members participate in daily operations</p>
                </Label>
              </div>
              <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
                <RadioGroupItem value="manager_managed" id="mgmt-manager" />
                <Label htmlFor="mgmt-manager" className="cursor-pointer flex-1">
                  <span className="font-medium">Manager-Managed</span>
                  <p className="text-sm text-muted-foreground">Designated managers handle operations</p>
                </Label>
              </div>
            </RadioGroup>
          </Card>

          {/* ── Participants ── */}
          <Card className="p-5 sm:p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-base font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-primary" /> Members / Participants
              </h3>
              <Button variant="outline" size="sm" onClick={addParticipant}>
                <Plus className="h-4 w-4 mr-1" /> Add
              </Button>
            </div>

            {order.participants.length === 0 && (
              <p className="text-sm text-muted-foreground text-center py-4">
                No participants added yet. Click "Add" to include owners or managers.
              </p>
            )}

            {order.participants.map((p, i) => (
              <div key={p.id} className="border rounded-lg p-4 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-medium text-sm">Participant {i + 1}</span>
                  <Button variant="ghost" size="sm" onClick={() => removeParticipant(p.id)} className="text-destructive h-7">
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <Label>First Name</Label>
                    <Input value={p.firstName} onChange={(e) => updateParticipant(p.id, "firstName", e.target.value)} />
                  </div>
                  <div>
                    <Label>Last Name</Label>
                    <Input value={p.lastName} onChange={(e) => updateParticipant(p.id, "lastName", e.target.value)} />
                  </div>
                  <div>
                    <Label>Role</Label>
                    <Select value={p.role} onValueChange={(v) => updateParticipant(p.id, "role", v)}>
                      <SelectTrigger><SelectValue /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="member">Member</SelectItem>
                        <SelectItem value="manager">Manager</SelectItem>
                        <SelectItem value="organizer">Organizer</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Title</Label>
                    <Input value={p.title} onChange={(e) => updateParticipant(p.id, "title", e.target.value)} placeholder="e.g. CEO, Managing Member" />
                  </div>
                  <div>
                    <Label>Ownership %</Label>
                    <Input type="number" min={0} max={100} value={p.ownershipPercent} onChange={(e) => updateParticipant(p.id, "ownershipPercent", Number(e.target.value))} />
                  </div>
                  <div>
                    <Label>Address</Label>
                    <Input value={p.address} onChange={(e) => updateParticipant(p.id, "address", e.target.value)} />
                  </div>
                  <div className="flex items-center gap-2">
                    <Switch checked={p.authorizedSigner} onCheckedChange={(v) => updateParticipant(p.id, "authorizedSigner", v)} />
                    <Label>Authorized Signer</Label>
                  </div>
                </div>
              </div>
            ))}
          </Card>

          {/* ── Actions ── */}
          <div className="flex justify-between items-center pt-2">
            <Button variant="outline" onClick={() => navigate("/order-flow")} disabled={saving}>
              Back to Packages
            </Button>
            <Button onClick={handleContinue} disabled={saving} size="lg">
              {saving ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <ArrowRight className="h-4 w-4 mr-2" />}
              {saving ? "Saving..." : "Continue"}
            </Button>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
}
