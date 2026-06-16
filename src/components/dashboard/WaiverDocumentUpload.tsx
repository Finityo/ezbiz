import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import DocumentUploader from "@/components/dashboard/DocumentUploader";
import { useToast } from "@/hooks/use-toast";
import { ShieldCheck, FileText, CheckCircle2, AlertCircle, CreditCard, Lock } from "lucide-react";

interface Props {
  userId: string;
  orderId: string;
  applicationId: string | null;
  status: string;
  adminNote?: string | null;
  onRefresh?: () => void;
}

const REQUIRED_DOCS = [
  { type: "waiver_tvc_letter", label: "TVC Verification Letter (per owner)" },
  { type: "waiver_form_05_904", label: "Texas Comptroller Form 05-904" },
];

const WaiverDocumentUpload = ({ userId, orderId, applicationId, status, adminNote, onRefresh }: Props) => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const isApproved = status === "waiver_approved_payment_required";
  const isRejected = status === "waiver_not_approved_standard_checkout_required";
  const [docs, setDocs] = useState<any[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const loadDocs = async () => {
    const { data } = await supabase
      .from("documents")
      .select("*")
      .eq("order_id", orderId)
      .like("document_type", "waiver_%");
    setDocs(data || []);
  };

  useEffect(() => { loadDocs(); }, [orderId]);

  const hasAllRequired = REQUIRED_DOCS.every(
    (d) => docs.some((x) => (x.document_type || "").startsWith(d.type))
  );

  const submitForReview = async () => {
    if (!applicationId) {
      toast({ title: "Missing application", description: "Cannot submit for review.", variant: "destructive" });
      return;
    }
    setSubmitting(true);
    try {
      await supabase.from("business_applications")
        .update({ status: "waiver_documents_submitted" })
        .eq("id", applicationId);
      await supabase.from("order_events").insert({
        order_id: orderId,
        event_type: "waiver_documents_submitted",
        actor: "customer",
        metadata: { application_id: applicationId, doc_count: docs.length } as any,
      });
      toast({ title: "Submitted", description: "Your waiver documents have been sent for review." });
      onRefresh?.();
    } catch (e: any) {
      toast({ title: "Submit failed", description: e?.message || "Try again.", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const readOnly = status === "waiver_documents_submitted" || status === "waiver_under_review";

  return (
    <Card className="border-secondary/40">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-secondary" />
          Texas Veteran Waiver – Document Review
        </CardTitle>
        <CardDescription>
          Upload the required documents so we can submit your waiver for approval. The $300 Texas state
          filing fee will be removed from your final checkout once approved.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {status === "waiver_needs_correction" && adminNote && (
          <div className="rounded-md border border-amber-300 bg-amber-50 dark:bg-amber-900/20 p-3 text-sm flex gap-2">
            <AlertCircle className="h-4 w-4 text-amber-700 mt-0.5" />
            <div>
              <p className="font-medium text-amber-900 dark:text-amber-200">Correction requested by reviewer</p>
              <p className="text-amber-800 dark:text-amber-300 mt-1">{adminNote}</p>
            </div>
          </div>
        )}

        <div className="space-y-2">
          <p className="text-sm font-semibold">Required documents</p>
          {REQUIRED_DOCS.map((req) => {
            const uploaded = docs.some((x) => (x.document_type || "").startsWith(req.type));
            return (
              <div key={req.type} className="flex items-center justify-between text-sm py-1">
                <span className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  {req.label}
                </span>
                {uploaded ? (
                  <Badge className="bg-green-100 text-green-800"><CheckCircle2 className="h-3 w-3 mr-1" /> Uploaded</Badge>
                ) : (
                  <Badge variant="outline">Missing</Badge>
                )}
              </div>
            );
          })}
        </div>

        {!readOnly && (
          <>
            <DocumentUploader userId={userId} orderId={orderId} onUploaded={loadDocs} />
            <p className="text-xs text-muted-foreground">
              Tip: name your file with the document type (e.g. "TVC-letter.pdf") so we can match it quickly.
            </p>
            <Button
              size="lg"
              className="w-full"
              disabled={!hasAllRequired || submitting}
              onClick={submitForReview}
            >
              {submitting ? "Submitting…" : hasAllRequired ? "Submit for Waiver Review" : "Upload required documents to continue"}
            </Button>
          </>
        )}

        {readOnly && (
          <div className="rounded-md bg-muted/50 p-3 text-sm">
            Your documents are with our team. We'll notify you when the review is complete.
          </div>
        )}

        {/* Waiver APPROVED → payment unlocked, Texas state fee removed. */}
        {isApproved && (
          <div className="rounded-md border border-emerald-300 bg-emerald-50 dark:bg-emerald-900/20 p-4 space-y-3">
            <div className="flex items-start gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-700 mt-0.5" />
              <div>
                <p className="font-semibold text-emerald-900 dark:text-emerald-200">
                  Waiver approved — payment unlocked
                </p>
                <p className="text-sm text-emerald-800 dark:text-emerald-300 mt-1">
                  Texas state filing fee waived after document approval ($0.00). Your final total
                  will exclude the $300 state fee.
                </p>
              </div>
            </div>
            <Button
              size="lg"
              className="w-full"
              onClick={() => navigate("/order-flow?resume=1")}
            >
              <CreditCard className="h-4 w-4 mr-2" /> Continue to Payment
            </Button>
          </div>
        )}

        {/* Waiver REJECTED → standard checkout with full state fee. */}
        {isRejected && (
          <div className="rounded-md border border-rose-300 bg-rose-50 dark:bg-rose-900/20 p-4 space-y-3">
            <div className="flex items-start gap-2">
              <AlertCircle className="h-5 w-5 text-rose-700 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-900 dark:text-rose-200">
                  Waiver not approved
                </p>
                <p className="text-sm text-rose-800 dark:text-rose-300 mt-1">
                  You can still complete your filing through standard checkout. The Texas state
                  filing fee ($300) will apply.
                </p>
              </div>
            </div>
            <Button
              size="lg"
              variant="outline"
              className="w-full"
              onClick={() => navigate("/order-flow?resume=1")}
            >
              <Lock className="h-4 w-4 mr-2" /> Continue to Standard Checkout
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default WaiverDocumentUpload;
