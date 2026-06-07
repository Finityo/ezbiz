import React, { useEffect, useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  applicationId: string | null;
  onSaved?: () => void;
}

type Form = {
  business_name: string;
  contact_first_name: string;
  contact_last_name: string;
  contact_email: string;
  contact_phone: string;
};

const empty: Form = {
  business_name: "",
  contact_first_name: "",
  contact_last_name: "",
  contact_email: "",
  contact_phone: "",
};

const ApplicationQuickEditDialog: React.FC<Props> = ({ open, onOpenChange, applicationId, onSaved }) => {
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [form, setForm] = useState<Form>(empty);

  useEffect(() => {
    if (!open || !applicationId) return;
    (async () => {
      setLoading(true);
      try {
        const { data: app, error } = await supabase
          .from("business_applications")
          .select("business_name, application_data")
          .eq("id", applicationId)
          .maybeSingle();
        if (error) throw error;
        const bd = (app?.application_data as any)?.businessDetails || {};
        setForm({
          business_name: app?.business_name || "",
          contact_first_name: bd.contactFirstName || "",
          contact_last_name: bd.contactLastName || "",
          contact_email: bd.contactEmail || "",
          contact_phone: bd.contactPhone || "",
        });
      } catch (e: any) {
        toast({ title: "Load failed", description: e?.message || "Could not load application", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    })();
  }, [open, applicationId, toast]);

  const save = async () => {
    if (!applicationId) return;
    setSaving(true);
    try {
      const { data: current, error: ce } = await supabase
        .from("business_applications")
        .select("application_data")
        .eq("id", applicationId)
        .maybeSingle();
      if (ce) throw ce;

      const merged = {
        ...(current?.application_data as any || {}),
        businessDetails: {
          ...((current?.application_data as any)?.businessDetails || {}),
          contactFirstName: form.contact_first_name,
          contactLastName: form.contact_last_name,
          contactEmail: form.contact_email,
          contactPhone: form.contact_phone,
        },
      };

      const { error: ue } = await supabase
        .from("business_applications")
        .update({ business_name: form.business_name, application_data: merged })
        .eq("id", applicationId);
      if (ue) throw ue;

      // Also sync to the matched order's contact_information / business_information if linked
      const orderId = (current?.application_data as any)?.order_id;
      if (orderId) {
        await Promise.all([
          supabase.from("business_information").update({ company_name: form.business_name }).eq("order_id", orderId),
          supabase.from("contact_information").update({
            first_name: form.contact_first_name,
            last_name: form.contact_last_name,
            email: form.contact_email,
            phone: form.contact_phone,
          }).eq("order_id", orderId),
          supabase.from("order_events").insert({
            order_id: orderId,
            event_type: "admin_edit_application",
            actor: "admin",
            metadata: { fields: ["business_name", "contact"] } as any,
          }),
        ]);
      }

      toast({ title: "Saved", description: "Application updated." });
      onSaved?.();
      onOpenChange(false);
    } catch (e: any) {
      toast({ title: "Save failed", description: e?.message || "Could not save", variant: "destructive" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Quick Edit Application</DialogTitle>
        </DialogHeader>
        {loading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="space-y-4 py-2">
            <div>
              <Label>Business Name</Label>
              <Input value={form.business_name} onChange={(e) => setForm({ ...form, business_name: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>First Name</Label>
                <Input value={form.contact_first_name} onChange={(e) => setForm({ ...form, contact_first_name: e.target.value })} />
              </div>
              <div>
                <Label>Last Name</Label>
                <Input value={form.contact_last_name} onChange={(e) => setForm({ ...form, contact_last_name: e.target.value })} />
              </div>
            </div>
            <div>
              <Label>Email</Label>
              <Input type="email" value={form.contact_email} onChange={(e) => setForm({ ...form, contact_email: e.target.value })} />
            </div>
            <div>
              <Label>Phone</Label>
              <Input value={form.contact_phone} onChange={(e) => setForm({ ...form, contact_phone: e.target.value })} />
            </div>
          </div>
        )}
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={saving}>Cancel</Button>
          <Button onClick={save} disabled={saving || loading}>
            {saving && <Loader2 className="h-4 w-4 mr-1 animate-spin" />} Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ApplicationQuickEditDialog;
