import { useState } from "react";
import { Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import AnimatedSection from "@/components/AnimatedSection";

const BUSINESS_TYPES = ["LLC", "S-Corp", "C-Corp", "Nonprofit", "Not Sure Yet"] as const;

const LeadCaptureForm = () => {
  const [form, setForm] = useState({ name: "", email: "", phone: "", businessType: "" });
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from("email_list" as any).insert({
        name: form.name.trim(),
        email: form.email.trim(),
        phone: form.phone.trim() || null,
        business_type: form.businessType || null,
        source: "lead_capture",
      } as any);

      if (error) throw error;

      setSubmitted(true);
      toast({ title: "We'll be in touch! 🎉" });
    } catch (err) {
      console.error("Lead capture error:", err);
      toast({ title: "Something went wrong", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <AnimatedSection>
        <div className="max-w-2xl mx-auto bg-muted/50 border border-border rounded-xl p-8 text-center">
          <h3 className="font-display text-xl font-semibold mb-2">Thanks! We'll be in touch 🎉</h3>
          <p className="text-sm text-muted-foreground">
            One of our team members will reach out to help you get started.
          </p>
        </div>
      </AnimatedSection>
    );
  }

  return (
    <AnimatedSection>
      <div className="max-w-2xl mx-auto bg-card border border-border rounded-xl p-6 md:p-8 shadow-smooth">
        <h2 className="font-display text-2xl font-bold text-card-foreground mb-2">
          Not Sure Where to Start?
        </h2>
        <p className="text-muted-foreground text-sm mb-6">
          Tell us a little about your business idea and we'll guide you through
          the best way to form your company.
        </p>

        <form onSubmit={handleSubmit} className="grid gap-4">
          <Input
            name="name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            placeholder="Full Name"
            required
            maxLength={100}
          />
          <Input
            name="email"
            type="email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            placeholder="Email Address"
            required
            maxLength={255}
          />
          <Input
            name="phone"
            type="tel"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
            placeholder="Phone Number (optional)"
            maxLength={20}
          />
          <Select
            value={form.businessType}
            onValueChange={(v) => setForm({ ...form, businessType: v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="What type of business are you starting?" />
            </SelectTrigger>
            <SelectContent>
              {BUSINESS_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Button type="submit" disabled={submitting} className="w-full">
            {submitting ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" />
            ) : (
              <>
                <Send className="h-4 w-4" />
                Get Guidance
              </>
            )}
          </Button>
        </form>

        <p className="text-xs text-muted-foreground mt-4">
          By submitting this form you agree to be contacted by EZ Biz File Service
          regarding business formation assistance.
        </p>
      </div>
    </AnimatedSection>
  );
};

export default LeadCaptureForm;
