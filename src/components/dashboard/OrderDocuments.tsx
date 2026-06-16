import React, { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Download, FolderOpen, RefreshCw } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { openOrderDocument } from "@/lib/openOrderDocument";
import DocumentUploader from "@/components/dashboard/DocumentUploader";

export interface OrderDocumentRow {
  id: string;
  order_id: string;
  document_type: string | null;
  file_url: string | null;
  uploaded_at: string | null;
  uploaded_by?: string | null;
  seen_by_customer?: boolean | null;
  seen_by_admin?: boolean | null;
}

interface Props {
  /** Order owner user_id — drives storage path so RLS works for the customer. */
  ownerUserId: string;
  orderId: string;
  /** Who is viewing the list — controls upload attribution and which side's "NEW" flag clears on open. */
  viewer: "customer" | "admin";
  /** Initial docs (parent already fetched). Component refetches/refreshes itself afterwards. */
  initialDocuments?: OrderDocumentRow[];
  /** Notified after upload or seen-mark so the parent can refresh aggregate state. */
  onChanged?: () => void;
  /** Hide the uploader (rare). Default false. */
  hideUploader?: boolean;
  className?: string;
}

const fmtDate = (iso: string | null | undefined) =>
  iso ? new Date(iso).toLocaleString() : "—";

const prettyType = (t: string | null | undefined) =>
  (t || "Document").replace(/_/g, " ");

const OrderDocuments: React.FC<Props> = ({
  ownerUserId,
  orderId,
  viewer,
  initialDocuments,
  onChanged,
  hideUploader,
  className,
}) => {
  const { toast } = useToast();
  const [docs, setDocs] = useState<OrderDocumentRow[]>(initialDocuments ?? []);
  const [loading, setLoading] = useState(!initialDocuments);

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("documents")
      .select("*")
      .eq("order_id", orderId)
      .order("uploaded_at", { ascending: false });
    if (!error) setDocs((data || []) as OrderDocumentRow[]);
    setLoading(false);
  };

  useEffect(() => {
    if (!initialDocuments) load();
    // Realtime: refresh when any row changes for this order.
    const ch = supabase
      .channel(`docs-${orderId}-${viewer}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "documents", filter: `order_id=eq.${orderId}` },
        () => load(),
      )
      .subscribe();
    return () => {
      supabase.removeChannel(ch);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [orderId]);

  const isNew = (d: OrderDocumentRow) =>
    viewer === "customer" ? d.seen_by_customer === false : d.seen_by_admin === false;

  const handleOpen = async (doc: OrderDocumentRow) => {
    const res = await openOrderDocument(doc.file_url);
    if (!res.ok) {
      toast({
        title: "Couldn't open document",
        description: res.error || "Please try again.",
        variant: "destructive",
      });
      return;
    }
    // Mark seen for this viewer, only if it was new.
    if (isNew(doc)) {
      const patch =
        viewer === "customer" ? { seen_by_customer: true } : { seen_by_admin: true };
      const { error } = await supabase.from("documents").update(patch as any).eq("id", doc.id);
      if (!error) {
        setDocs((prev) => prev.map((x) => (x.id === doc.id ? { ...x, ...patch } : x)));
        onChanged?.();
      }
    }
  };

  const newCount = useMemo(() => docs.filter(isNew).length, [docs, viewer]);

  return (
    <div className={className}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium text-foreground">
            Documents ({docs.length})
          </span>
          {newCount > 0 && (
            <Badge className="bg-amber-500 text-white hover:bg-amber-500">
              {newCount} NEW
            </Badge>
          )}
        </div>
        <Button variant="ghost" size="sm" onClick={load} disabled={loading}>
          <RefreshCw className={`h-3 w-3 mr-1 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {!hideUploader && (
        <div className="mb-4">
          <DocumentUploader
            userId={ownerUserId}
            orderId={orderId}
            actor={viewer}
            onUploaded={() => {
              load();
              onChanged?.();
            }}
          />
        </div>
      )}

      {docs.length === 0 ? (
        <div className="text-center py-8 space-y-2 border border-dashed border-border rounded-md">
          <FolderOpen className="h-10 w-10 mx-auto text-muted-foreground" />
          <p className="text-sm font-medium text-muted-foreground">No documents yet</p>
          <p className="text-xs text-muted-foreground max-w-sm mx-auto">
            Uploads from {viewer === "customer" ? "you or our team" : "the customer or your team"}{" "}
            will appear here.
          </p>
        </div>
      ) : (
        <div className="divide-y">
          {docs.map((doc) => {
            const fresh = isNew(doc);
            return (
              <div
                key={doc.id}
                className="flex items-center justify-between py-3 gap-4"
              >
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-medium text-foreground truncate">
                      {prettyType(doc.document_type)}
                    </p>
                    {fresh && (
                      <Badge className="bg-amber-500 text-white hover:bg-amber-500 text-[10px] px-1.5 py-0">
                        NEW
                      </Badge>
                    )}
                    {doc.uploaded_by && (
                      <Badge variant="outline" className="text-[10px] px-1.5 py-0">
                        from {doc.uploaded_by}
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Uploaded {fmtDate(doc.uploaded_at)}
                  </p>
                </div>
                <div>
                  {doc.file_url ? (
                    <Button size="sm" variant="outline" onClick={() => handleOpen(doc)}>
                      <Download className="h-3 w-3 mr-1" /> Open
                    </Button>
                  ) : (
                    <Badge variant="secondary" className="text-xs">
                      Pending
                    </Badge>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default OrderDocuments;
