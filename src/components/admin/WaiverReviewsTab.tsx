import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, FileText, CheckCircle2, XCircle, MessageSquare } from "lucide-react";

interface WaiverApp {
  id: string;
  user_id: string;
  business_name: string;
  state: string;
  status: string;
  application_data: any;
  created_at: string;
}

const WAIVER_STATUSES = [
  "waiver_documents_pending",
  "waiver_documents_submitted",
  "waiver_under_review",
  "waiver_needs_correction",
  "waiver_approved_payment_required",
  "waiver_not_approved_standard_checkout_required",
];

const statusLabel: Record<string, string> = {
  waiver_documents_pending: "Awaiting Documents",
  waiver_documents_submitted: "Submitted — Needs Review",
  waiver_under_review: "Under Review",
  waiver_needs_correction: "Correction Requested",
  waiver_approved_payment_required: "Approved — Payment Required",
  waiver_not_approved_standard_checkout_required: "Not Approved",
};

const WaiverReviewsTab = () => {
  const { toast } = useToast();
  const [apps, setApps] = useState<WaiverApp[]>([]);
  const [loading, setLoading] = useState(true);
  const [docsByOrder, setDocsByOrder] = useState<Record<string, any[]>>({});
  const [noteDraft, setNoteDraft] = useState<Record<string, string>>({});

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("business_applications")
      .select("*")
      .in("status", WAIVER_STATUSES)
      .order("created_at", { ascending: false });

    if (error) {
      toast({ title: "Load failed", description: error.message, variant: "destructive" });
      setLoading(false);
      return;
    }
    const list = (data || []) as WaiverApp[];
    setApps(list);

    // Load related documents
    const orderIds = list.map(a => a.application_data?.orderId).filter(Boolean);
    if (orderIds.length) {
      const { data: docs } = await supabase
        .from("documents")
        .select("*")
        .in("order_id", orderIds)
        .like("document_type", "waiver_%");
      const grouped: Record<string, any[]> = {};
      (docs || []).forEach((d: any) => {
        grouped[d.order_id] = grouped[d.order_id] || [];
        grouped[d.order_id].push(d);
      });
      setDocsByOrder(grouped);
    }
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const updateStatus = async (app: WaiverApp, newStatus: string, opts: { waivedStateFee?: boolean; adminNote?: string } = {}) => {
    try {
      const orderId = app.application_data?.orderId;
      const nowIso = new Date().toISOString();
      const isApproval = newStatus === "waiver_approved_payment_required";
      const isRejection = newStatus === "waiver_not_approved_standard_checkout_required";
      const originalStateFee = app.application_data?.originalStateFee ?? 300;
      const effectiveStateFee = isApproval ? 0 : originalStateFee;

      const mergedData = {
        ...(app.application_data || {}),
        ...(opts.waivedStateFee !== undefined ? { waivedStateFee: opts.waivedStateFee } : {}),
        ...(opts.adminNote ? { adminNote: opts.adminNote } : {}),
        // Preserve audit trail for CSV/account-manager handoff.
        originalStateFee,
        effectiveStateFee,
        waiverReviewedAt: nowIso,
        waiverReviewStatus: newStatus,
      };
      const { error } = await supabase
        .from("business_applications")
        .update({ status: newStatus, application_data: mergedData })
        .eq("id", app.id);
      if (error) throw error;

      if (orderId) {
        // Update orders.state_fee when waiver is approved/rejected so admin views
        // and pre-payment CSV exports reflect what the customer actually owes.
        // On approval/rejection, also flip orders.status to pending_payment so
        // the customer's dashboard status bar shows "Pending Payment" and the
        // next sign-in fast-paths them to Stripe checkout.
        if (isApproval) {
          await supabase
            .from("orders")
            .update({ state_fee: 0, status: "pending_payment" })
            .eq("id", orderId);
        } else if (isRejection) {
          await supabase
            .from("orders")
            .update({ state_fee: originalStateFee, status: "pending_payment" })
            .eq("id", orderId);
        }
        await supabase.from("order_events").insert({
          order_id: orderId,
          event_type: `waiver_${newStatus}`,
          actor: "admin",
          metadata: {
            application_id: app.id,
            note: opts.adminNote || null,
            originalStateFee,
            effectiveStateFee,
            reviewedAt: nowIso,
          } as any,
        });
      }
      toast({ title: "Updated", description: `Status set to ${statusLabel[newStatus] || newStatus}` });
      load();
    } catch (e: any) {
      toast({ title: "Update failed", description: e?.message || "Try again.", variant: "destructive" });
    }
  };

  const viewDoc = async (path: string) => {
    const { data } = await supabase.storage.from("order-documents").createSignedUrl(path, 300);
    if (data?.signedUrl) window.open(data.signedUrl, "_blank");
  };

  if (loading) return <p className="text-muted-foreground p-4">Loading waiver reviews…</p>;

  if (apps.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          <ShieldCheck className="h-10 w-10 mx-auto mb-2 opacity-50" />
          No waiver applications yet.
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {apps.map((app) => {
        const orderId = app.application_data?.orderId;
        const docs = orderId ? (docsByOrder[orderId] || []) : [];
        const note = noteDraft[app.id] ?? "";
        return (
          <Card key={app.id}>
            <CardHeader>
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <CardTitle className="text-base">{app.business_name}</CardTitle>
                  <p className="text-xs text-muted-foreground mt-1">
                    {app.state} • Submitted {new Date(app.created_at).toLocaleDateString()}
                  </p>
                </div>
                <Badge variant="outline">{statusLabel[app.status] || app.status}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="text-sm">
                <p><span className="text-muted-foreground">Package:</span> {app.application_data?.package || "—"}</p>
                <p><span className="text-muted-foreground">Original state fee:</span> ${app.application_data?.originalStateFee ?? 300}</p>
                <p><span className="text-muted-foreground">Waived:</span> {app.application_data?.waivedStateFee ? "Yes" : "No"}</p>
              </div>

              <div>
                <p className="text-sm font-semibold mb-1">Uploaded documents ({docs.length})</p>
                {docs.length === 0 ? (
                  <p className="text-xs text-muted-foreground">Customer hasn't uploaded yet.</p>
                ) : (
                  <ul className="space-y-1">
                    {docs.map((d: any) => (
                      <li key={d.id} className="flex items-center justify-between text-sm">
                        <span className="flex items-center gap-2">
                          <FileText className="h-3.5 w-3.5 text-muted-foreground" />
                          {d.document_type}
                        </span>
                        <Button size="sm" variant="ghost" onClick={() => viewDoc(d.file_url)}>View</Button>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              <div className="space-y-2 pt-2 border-t">
                <Textarea
                  placeholder="Optional note to customer (required for 'Request Correction')"
                  value={note}
                  onChange={(e) => setNoteDraft({ ...noteDraft, [app.id]: e.target.value })}
                  rows={2}
                />
                <div className="flex flex-wrap gap-2">
                  <Button size="sm" onClick={() => updateStatus(app, "waiver_approved_payment_required", { waivedStateFee: true })}>
                    <CheckCircle2 className="h-4 w-4 mr-1" /> Approve
                  </Button>
                  <Button size="sm" variant="outline" disabled={!note.trim()} onClick={() => updateStatus(app, "waiver_needs_correction", { adminNote: note })}>
                    <MessageSquare className="h-4 w-4 mr-1" /> Request Correction
                  </Button>
                  <Button size="sm" variant="destructive" onClick={() => updateStatus(app, "waiver_not_approved_standard_checkout_required", { waivedStateFee: false, adminNote: note || "Waiver not approved. Please proceed with standard checkout." })}>
                    <XCircle className="h-4 w-4 mr-1" /> Reject
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default WaiverReviewsTab;
