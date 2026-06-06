import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Checkbox } from "@/components/ui/checkbox";
import { User, Building2, Mail } from "lucide-react";

export interface BusinessDetails {
  // Core business
  businessName: string;
  designator: string;
  alternateName: string;
  businessPurpose: string;
  businessDescription: string;
  organizerType: string;
  delayedFiling: boolean;

  // Address
  address: string;
  city: string;
  zipCode: string;

  // LLC management
  managementStructure: string;

  // Contact person
  contactFirstName: string;
  contactLastName: string;
  contactPhone: string;
}

interface BusinessDetailsFormProps {
  data: BusinessDetails;
  entityType: string;
  state: string;
  onChange: (data: BusinessDetails) => void;
}

const DESIGNATORS: Record<string, string[]> = {
  llc: ["LLC", "L.L.C.", "Limited Liability Company"],
  "c-corp": ["Inc.", "Corp.", "Corporation", "Incorporated"],
  "s-corp": ["Inc.", "Corp.", "Corporation", "Incorporated"],
  nonprofit: ["Inc.", "Corp.", "Foundation"],
  "professional-corp": ["P.C.", "Prof. Corp.", "Professional Corporation"],
};

const ORGANIZER_TYPES = [
  { value: "individual", label: "Individual / Owner" },
  { value: "attorney", label: "Attorney" },
  { value: "cpa", label: "CPA / Accountant" },
  { value: "filing_service", label: "Filing Service" },
  { value: "other", label: "Other" },
];

const BusinessDetailsForm = ({ data, entityType, state, onChange }: BusinessDetailsFormProps) => {
  const designators = DESIGNATORS[entityType] || DESIGNATORS.llc;
  const showManagement = entityType === "llc";

  const update = <K extends keyof BusinessDetails>(field: K, value: BusinessDetails[K]) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-8">
      {/* SECTION: Business Information */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-1 border-b">
          <Building2 className="h-4 w-4 text-primary" />
          <h3 className="text-base font-semibold">Business Information</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="businessName">Business Name *</Label>
            <Input
              id="businessName"
              value={data.businessName}
              onChange={(e) => update("businessName", e.target.value)}
              placeholder="e.g. Acme Holdings"
            />
          </div>

          <div>
            <Label htmlFor="designator">Designator *</Label>
            <Select value={data.designator} onValueChange={(v) => update("designator", v)}>
              <SelectTrigger>
                <SelectValue placeholder="Select designator" />
              </SelectTrigger>
              <SelectContent>
                {designators.map((d) => (
                  <SelectItem key={d} value={d}>{d}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label>Formation State</Label>
            <Input value={state} disabled className="bg-muted" />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="alternateName">
              Alternate Name <span className="text-muted-foreground text-xs">(optional, used if first name is unavailable)</span>
            </Label>
            <Input
              id="alternateName"
              value={data.alternateName}
              onChange={(e) => update("alternateName", e.target.value)}
              placeholder="e.g. Acme Ventures"
            />
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="businessPurpose">Business Purpose *</Label>
            <Input
              id="businessPurpose"
              value={data.businessPurpose}
              onChange={(e) => update("businessPurpose", e.target.value)}
              placeholder="e.g. Consulting services, e-commerce, real estate investment"
            />
            <p className="text-xs text-muted-foreground mt-1">
              Brief statement of primary business activity (required by most states).
            </p>
          </div>

          <div className="md:col-span-2">
            <Label htmlFor="businessDescription">
              Detailed Description <span className="text-muted-foreground text-xs">(optional)</span>
            </Label>
            <Textarea
              id="businessDescription"
              value={data.businessDescription}
              onChange={(e) => update("businessDescription", e.target.value)}
              placeholder="Provide additional context about products, services, or industry"
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="organizerType">Organizer Type *</Label>
            <Select value={data.organizerType} onValueChange={(v) => update("organizerType", v)}>
              <SelectTrigger id="organizerType">
                <SelectValue placeholder="Who is organizing this filing?" />
              </SelectTrigger>
              <SelectContent>
                {ORGANIZER_TYPES.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex items-center gap-2 pt-6">
            <Checkbox
              id="delayedFiling"
              checked={data.delayedFiling}
              onCheckedChange={(checked) => update("delayedFiling", checked === true)}
            />
            <Label htmlFor="delayedFiling" className="cursor-pointer text-sm font-normal">
              Request delayed effective filing date (e.g. January 1)
            </Label>
          </div>
        </div>
      </section>

      {/* SECTION: Principal Address */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-1 border-b">
          <Building2 className="h-4 w-4 text-primary" />
          <h3 className="text-base font-semibold">Principal Business Address</h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="md:col-span-2">
            <Label htmlFor="address">Street Address *</Label>
            <Input
              id="address"
              value={data.address}
              onChange={(e) => update("address", e.target.value)}
              placeholder="123 Main St, Suite 100"
            />
          </div>

          <div>
            <Label htmlFor="city">City *</Label>
            <Input
              id="city"
              value={data.city}
              onChange={(e) => update("city", e.target.value)}
            />
          </div>

          <div>
            <Label htmlFor="zipCode">ZIP Code *</Label>
            <Input
              id="zipCode"
              value={data.zipCode}
              onChange={(e) => update("zipCode", e.target.value)}
            />
          </div>
        </div>
      </section>

      {/* SECTION: LLC Management (LLC only) */}
      {showManagement && (
        <section className="space-y-3">
          <div className="flex items-center gap-2 pb-1 border-b">
            <Building2 className="h-4 w-4 text-primary" />
            <h3 className="text-base font-semibold">Management Structure</h3>
          </div>
          <RadioGroup
            value={data.managementStructure}
            onValueChange={(v) => update("managementStructure", v)}
            className="space-y-2"
          >
            <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="member-managed" id="member" />
              <Label htmlFor="member" className="cursor-pointer flex-1">
                <span className="font-medium">Member-Managed</span>
                <p className="text-sm text-muted-foreground">All members participate in daily operations</p>
              </Label>
            </div>
            <div className="flex items-center space-x-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer">
              <RadioGroupItem value="manager-managed" id="manager" />
              <Label htmlFor="manager" className="cursor-pointer flex-1">
                <span className="font-medium">Manager-Managed</span>
                <p className="text-sm text-muted-foreground">Designated managers handle operations</p>
              </Label>
            </div>
          </RadioGroup>
        </section>
      )}

      {/* SECTION: Primary Contact */}
      <section className="space-y-4">
        <div className="flex items-center gap-2 pb-1 border-b">
          <User className="h-4 w-4 text-primary" />
          <h3 className="text-base font-semibold">Primary Contact Person</h3>
        </div>
        <p className="text-xs text-muted-foreground -mt-2">
          The person we should contact about this filing. Used on formation documents and order updates.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contactFirstName">First Name *</Label>
            <Input
              id="contactFirstName"
              value={data.contactFirstName}
              onChange={(e) => update("contactFirstName", e.target.value)}
              placeholder="Jane"
            />
          </div>
          <div>
            <Label htmlFor="contactLastName">Last Name *</Label>
            <Input
              id="contactLastName"
              value={data.contactLastName}
              onChange={(e) => update("contactLastName", e.target.value)}
              placeholder="Doe"
            />
          </div>
          <div className="md:col-span-2">
            <Label htmlFor="contactPhone" className="flex items-center gap-1.5">
              <Mail className="h-3.5 w-3.5" /> Contact Phone *
            </Label>
            <Input
              id="contactPhone"
              type="tel"
              value={data.contactPhone}
              onChange={(e) => update("contactPhone", e.target.value)}
              placeholder="(555) 555-1234"
            />
          </div>
        </div>
      </section>
    </div>
  );
};

export default BusinessDetailsForm;
