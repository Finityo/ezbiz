import React, { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { Loader2, Upload, Lock } from "lucide-react";

const MAX_BYTES = 10 * 1024 * 1024; // 10 MB
const ACCEPTED = ["application/pdf", "image/jpeg", "image/png"];
const ACCEPTED_LABEL = ".pdf, .jpg, .png (max 10 MB)";

interface Props {
  /** Order owner's user_id — used as the first folder segment for RLS path matching. */
  userId: string;
  orderId: string;
  /** Who is doing the upload. Defaults to 'customer' for backwards compatibility. */
  actor?: "customer" | "admin";
  onUploaded?: () => void;
}

const DocumentUploader: React.FC<Props> = ({ userId, orderId, actor = "customer", onUploaded }) => {
  const { toast } = useToast();
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const handlePick = () => inputRef.current?.click();

  const handleFile = async (file: File) => {
    if (!ACCEPTED.includes(file.type)) {
      toast({ title: "Unsupported file", description: "Only PDF, JPEG, or PNG allowed.", variant: "destructive" });
      return;
    }
    if (file.size > MAX_BYTES) {
      toast({ title: "File too large", description: "Maximum size is 10 MB.", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      const safeName = file.name.replace(/[^a-zA-Z0-9._-]+/g, "_");
      const path = `${userId}/${orderId}/${Date.now()}_${safeName}`;

      const { error: upErr } = await supabase.storage
        .from("order-documents")
        .upload(path, file, { contentType: file.type, upsert: false });
      if (upErr) throw upErr;

      const { error: dbErr } = await supabase.from("documents").insert({
        order_id: orderId,
        document_type: actor === "admin" ? "admin_upload" : "customer_upload",
        file_url: path,
        uploaded_by: actor,
        // The uploader has already "seen" their own doc; flag the other side as unseen → "NEW" badge.
        seen_by_customer: actor === "customer",
        seen_by_admin: actor === "admin",
      } as any);
      if (dbErr) throw dbErr;

      // Audit
      await supabase.from("order_events").insert({
        order_id: orderId,
        event_type: actor === "admin" ? "admin_document_uploaded" : "customer_document_uploaded",
        actor,
        metadata: { file_name: file.name, size: file.size, mime: file.type } as any,
      });

      toast({ title: "Uploaded", description: `${file.name} uploaded securely.` });
      onUploaded?.();
    } catch (e: any) {
      console.error("Upload failed:", e);
      toast({ title: "Upload failed", description: e?.message || "Please try again.", variant: "destructive" });
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="rounded-lg border border-dashed border-border bg-muted/30 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <div className="flex items-start gap-3">
        <div className="rounded-md bg-primary/10 p-2 mt-0.5">
          <Lock className="h-4 w-4 text-primary" />
        </div>
        <div>
          <p className="text-sm font-medium text-foreground">Securely upload a document</p>
          <p className="text-xs text-muted-foreground">{ACCEPTED_LABEL} • End-to-end encrypted private vault</p>
        </div>
      </div>
      <div>
        <input
          ref={inputRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,application/pdf,image/jpeg,image/png"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
          }}
        />
        <Button size="sm" onClick={handlePick} disabled={uploading}>
          {uploading ? (
            <><Loader2 className="h-4 w-4 mr-1 animate-spin" /> Uploading…</>
          ) : (
            <><Upload className="h-4 w-4 mr-1" /> Upload File</>
          )}
        </Button>
      </div>
    </div>
  );
};

export default DocumentUploader;
