import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

export interface BusinessDetails {
  businessName: string;
  designator: string;
  address: string;
  city: string;
  zipCode: string;
  managementStructure: string;
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

const BusinessDetailsForm = ({ data, entityType, state, onChange }: BusinessDetailsFormProps) => {
  const designators = DESIGNATORS[entityType] || DESIGNATORS.llc;
  const showManagement = entityType === "llc";

  const update = (field: keyof BusinessDetails, value: string) => {
    onChange({ ...data, [field]: value });
  };

  return (
    <div className="space-y-6">
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
          <Label htmlFor="address">Principal Address *</Label>
          <Input
            id="address"
            value={data.address}
            onChange={(e) => update("address", e.target.value)}
            placeholder="Street address"
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

      {showManagement && (
        <div className="space-y-3 pt-2">
          <Label>Management Structure *</Label>
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
        </div>
      )}
    </div>
  );
};

export default BusinessDetailsForm;
