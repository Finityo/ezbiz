import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Plus, Trash2, User } from "lucide-react";

export interface OwnerMember {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  ownershipPercentage: string;
}

const emptyMember: OwnerMember = {
  fullName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  state: "",
  zipCode: "",
  ownershipPercentage: "",
};

interface OwnerMemberFormProps {
  members: OwnerMember[];
  onChange: (members: OwnerMember[]) => void;
  entityType: string;
}

const OwnerMemberForm = ({ members, onChange, entityType }: OwnerMemberFormProps) => {
  const memberLabel = ["c-corp", "s-corp", "nonprofit", "professional-corp"].includes(entityType)
    ? "Director / Officer"
    : "Owner / Member";

  const addMember = () => {
    onChange([...members, { ...emptyMember }]);
  };

  const removeMember = (index: number) => {
    if (members.length <= 1) return;
    onChange(members.filter((_, i) => i !== index));
  };

  const updateMember = (index: number, field: keyof OwnerMember, value: string) => {
    const updated = members.map((m, i) => (i === index ? { ...m, [field]: value } : m));
    onChange(updated);
  };

  return (
    <div className="space-y-6">
      {members.map((member, index) => (
        <Card key={index} className="p-4 sm:p-5 space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              <User className="h-4 w-4" />
              {memberLabel} {index + 1}
            </div>
            {members.length > 1 && (
              <Button variant="ghost" size="sm" onClick={() => removeMember(index)} className="text-destructive h-7 px-2">
                <Trash2 className="h-3.5 w-3.5 mr-1" /> Remove
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="md:col-span-2">
              <Label>Full Legal Name *</Label>
              <Input
                value={member.fullName}
                onChange={(e) => updateMember(index, "fullName", e.target.value)}
                placeholder="John A. Smith"
              />
            </div>

            <div>
              <Label>Email *</Label>
              <Input
                type="email"
                value={member.email}
                onChange={(e) => updateMember(index, "email", e.target.value)}
                placeholder="john@example.com"
              />
            </div>

            <div>
              <Label>Phone *</Label>
              <Input
                type="tel"
                value={member.phone}
                onChange={(e) => updateMember(index, "phone", e.target.value)}
                placeholder="(555) 123-4567"
              />
            </div>

            <div className="md:col-span-2">
              <Label>Address *</Label>
              <Input
                value={member.address}
                onChange={(e) => updateMember(index, "address", e.target.value)}
                placeholder="Street address"
              />
            </div>

            <div>
              <Label>City *</Label>
              <Input
                value={member.city}
                onChange={(e) => updateMember(index, "city", e.target.value)}
              />
            </div>

            <div>
              <Label>State *</Label>
              <Input
                value={member.state}
                onChange={(e) => updateMember(index, "state", e.target.value)}
                placeholder="TX"
              />
            </div>

            <div>
              <Label>ZIP Code *</Label>
              <Input
                value={member.zipCode}
                onChange={(e) => updateMember(index, "zipCode", e.target.value)}
              />
            </div>

            <div>
              <Label>Ownership %</Label>
              <Input
                value={member.ownershipPercentage}
                onChange={(e) => updateMember(index, "ownershipPercentage", e.target.value)}
                placeholder="e.g. 50"
              />
            </div>
          </div>
        </Card>
      ))}

      <Button variant="outline" onClick={addMember} className="w-full">
        <Plus className="h-4 w-4 mr-2" /> Add Another {memberLabel}
      </Button>
    </div>
  );
};

export default OwnerMemberForm;
