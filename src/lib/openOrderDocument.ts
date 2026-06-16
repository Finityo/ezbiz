import { supabase } from "@/integrations/supabase/client";

/**
 * Open an uploaded order document in a new tab.
 * Used by BOTH the customer dashboard and the admin dashboard so they
 * share one identical action: signed URL → window.open. External http(s)
 * URLs (legacy rows) are opened directly.
 */
export async function openOrderDocument(fileUrl: string | null | undefined): Promise<{ ok: boolean; error?: string }> {
  const path = (fileUrl || "").trim();
  if (!path) return { ok: false, error: "No file path on document." };

  if (/^https?:\/\//i.test(path)) {
    window.open(path, "_blank", "noopener");
    return { ok: true };
  }

  const { data, error } = await supabase
    .storage
    .from("order-documents")
    .createSignedUrl(path, 60);

  if (error || !data?.signedUrl) {
    console.error("Signed URL failed:", error);
    return { ok: false, error: error?.message || "Could not generate download link." };
  }
  window.open(data.signedUrl, "_blank", "noopener");
  return { ok: true };
}
