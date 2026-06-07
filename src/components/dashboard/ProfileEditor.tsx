import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card } from "@/components/ui/card";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface ProfileEditorProps {
  profile: {
    first_name: string;
    last_name: string;
    phone?: string;
  };
  email?: string;
  userId: string;
  onUpdate: () => void;
}

const ProfileEditor = ({ profile, email, userId, onUpdate }: ProfileEditorProps) => {
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: profile.first_name || "",
    last_name: profile.last_name || "",
    phone: profile.phone || "",
    email: email || "",
  });

  const handleSave = async () => {
    setLoading(true);
    try {
      const { error: profileError } = await supabase
        .from("profiles")
        .update({
          first_name: formData.first_name,
          last_name: formData.last_name,
          phone: formData.phone,
        })
        .eq("user_id", userId);

      if (profileError) throw profileError;

      // Email change goes through Supabase Auth and requires re-verification.
      const trimmedEmail = formData.email.trim();
      if (trimmedEmail && trimmedEmail.toLowerCase() !== (email || "").toLowerCase()) {
        const { error: emailError } = await supabase.auth.updateUser({ email: trimmedEmail });
        if (emailError) throw emailError;
        toast.success(
          "Profile updated. Check your new email inbox to confirm the address change.",
        );
      } else {
        toast.success("Profile updated successfully!");
      }

      setEditing(false);
      onUpdate();
    } catch (error: any) {
      console.error("Error updating profile:", error);
      toast.error(error?.message || "Failed to update profile");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Profile Information</h3>
        {!editing && (
          <Button onClick={() => setEditing(true)} variant="outline" size="sm">
            Edit
          </Button>
        )}
      </div>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="firstName">First Name</Label>
            <Input
              id="firstName"
              value={formData.first_name}
              onChange={(e) => setFormData({ ...formData, first_name: e.target.value })}
              disabled={!editing}
            />
          </div>

          <div>
            <Label htmlFor="lastName">Last Name</Label>
            <Input
              id="lastName"
              value={formData.last_name}
              onChange={(e) => setFormData({ ...formData, last_name: e.target.value })}
              disabled={!editing}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="email">Email Address</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            disabled={!editing}
            placeholder="you@example.com"
          />
          {editing && (
            <p className="text-xs text-muted-foreground mt-1">
              Changing your email requires confirmation from the new address before sign-in works.
            </p>
          )}
        </div>

        <div>
          <Label htmlFor="phone">Phone Number</Label>
          <Input
            id="phone"
            type="tel"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            disabled={!editing}
            placeholder="(555) 123-4567"
          />
        </div>

        {editing && (
          <div className="flex gap-2 pt-4">
            <Button onClick={handleSave} disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
            <Button
              onClick={() => {
                setEditing(false);
                setFormData({
                  first_name: profile.first_name || "",
                  last_name: profile.last_name || "",
                  phone: profile.phone || "",
                  email: email || "",
                });
              }}
              variant="outline"
            >
              Cancel
            </Button>
          </div>
        )}
      </div>
    </Card>
  );
};

export default ProfileEditor;
