import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";

/**
 * Phase Five — Lead / Intake / Abandoned Checkout capture.
 *
 * Debounced autosave for the order wizard. Creates a single `orders` row
 * with status='intake_started' the moment we have enough signal (state +
 * authenticated user), then patches that same row on each change. The
 * checkout-time `saveOrderToDb()` flips status → 'pending_payment' in
 * place, so we never duplicate rows.
 *
 * Anonymous users do not write to the DB (RLS requires user_id). For
 * pre-account drafts, the existing in-memory wizard state is preserved
 * — flushed to DB on AccountStep completion the same way checkout does.
 */

const LS_KEY = "phase5_draft_order_id";

export type OrderDraftFields = {
  filing_path?: string | null;
  entity_type?: string | null;
  package?: string | null;
  package_id?: string | null;
  state?: string | null;
  state_fee?: number | null;
  total_amount?: number | null;
  add_ons?: Record<string, unknown> | null;
  current_step?: number | null;
  source_path?: string | null;
  email?: string | null;
};

const sanitize = (fields: OrderDraftFields): Record<string, unknown> => {
  const out: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(fields)) {
    if (v === undefined) continue;
    if (typeof v === "string" && v.trim() === "") continue;
    out[k] = v;
  }
  return out;
};

export function useOrderDraft(user: User | null | undefined, opts?: { disabled?: boolean }) {
  const [draftId, setDraftId] = useState<string | null>(() => {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(LS_KEY);
  });
  const inFlightRef = useRef<Promise<string | null> | null>(null);
  const pendingPatchRef = useRef<Record<string, unknown>>({});
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Drop the cached draft id if it doesn't belong to the current user
  // (e.g. customer signed out and a different user signed in).
  useEffect(() => {
    if (!user || !draftId) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("orders")
        .select("id,status,user_id")
        .eq("id", draftId)
        .maybeSingle();
      if (cancelled) return;
      if (!data || data.user_id !== user.id || data.status !== "intake_started") {
        window.localStorage.removeItem(LS_KEY);
        setDraftId(null);
      }
    })();
    return () => { cancelled = true; };
  }, [user, draftId]);

  const ensureDraft = useCallback(
    async (fields: OrderDraftFields): Promise<string | null> => {
      if (opts?.disabled) return null;
      if (!user) return null;
      if (draftId) return draftId;
      if (inFlightRef.current) return inFlightRef.current;

      const promise = (async () => {
        const payload = sanitize({
          ...fields,
          email: fields.email ?? user.email ?? null,
        });
        const { data, error } = await supabase
          .from("orders")
          .insert({
            user_id: user.id,
            status: "intake_started",
            last_activity_at: new Date().toISOString(),
            ...payload,
          })
          .select("id")
          .single();
        if (error || !data) {
          console.warn("[useOrderDraft] insert failed", error);
          return null;
        }
        window.localStorage.setItem(LS_KEY, data.id);
        setDraftId(data.id);
        await supabase.from("order_events").insert({
          order_id: data.id,
          event_type: "intake_started",
          actor: "customer",
          metadata: { source_path: fields.source_path ?? null } as any,
        });
        return data.id as string;
      })();

      inFlightRef.current = promise;
      const id = await promise;
      inFlightRef.current = null;
      return id;
    },
    [user, draftId, opts?.disabled],
  );

  const patchDraft = useCallback(
    (fields: OrderDraftFields) => {
      if (opts?.disabled || !user) return;
      Object.assign(pendingPatchRef.current, sanitize(fields));
      if (debounceRef.current) clearTimeout(debounceRef.current);
      debounceRef.current = setTimeout(async () => {
        const patch = { ...pendingPatchRef.current, last_activity_at: new Date().toISOString() };
        pendingPatchRef.current = {};
        let id = draftId;
        if (!id) id = await ensureDraft(fields);
        if (!id) return;
        const { error } = await supabase.from("orders").update(patch).eq("id", id);
        if (error) console.warn("[useOrderDraft] patch failed", error);
      }, 1500);
    },
    [user, draftId, ensureDraft, opts?.disabled],
  );

  const clearDraft = useCallback(() => {
    window.localStorage.removeItem(LS_KEY);
    setDraftId(null);
  }, []);

  useEffect(() => () => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
  }, []);

  return { draftId, ensureDraft, patchDraft, clearDraft };
}
