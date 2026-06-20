import { useCallback, useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import type { User } from "@supabase/supabase-js";
import {
  ACTIVE_ORDER_KEY,
  clearPendingDraft,
  logOrderEvent,
  readPendingDraft,
  type OrderEventType,
} from "@/lib/orderEvents";

/**
 * Unified draft order persistence.
 *
 * Authenticated users get a real `orders` row (status='intake_started')
 * keyed by `localStorage[ACTIVE_ORDER_KEY]`. Anonymous users continue to
 * stack changes into the `pending_draft` localStorage blob (see
 * `writePendingDraft` callers on /pricing) — the first authenticated
 * `ensureDraft` call flushes that blob into the new orders row and
 * clears it. This is what makes the cart + veteran waiver persist
 * across login/logout.
 */

const LEGACY_KEYS = ["phase5_draft_order_id", "active_order_id"];

export type OrderDraftFields = {
  filing_path?: string | null;
  entity_type?: string | null;
  package?: string | null;
  package_id?: string | null;
  state?: string | null;
  selected_state?: string | null;
  state_fee?: number | null;
  total_amount?: number | null;
  add_ons?: Record<string, unknown> | null;
  selected_addons?: unknown[] | null;
  current_step?: number | null;
  source_path?: string | null;
  source_route?: string | null;
  email?: string | null;
  // Veteran waiver
  veteran_eligible?: boolean | null;
  veteran_waiver_applied?: boolean | null;
  veteran_waiver_amount?: number | null;
  vvl_pdf_downloaded?: boolean | null;
  vvl_pdf_downloaded_at?: string | null;
  // Lifecycle
  email_confirmed_at?: string | null;
  business_info_saved_at?: string | null;
  needs_attention?: boolean | null;
  attention_reason?: string | null;
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

function readCachedDraftId(): string | null {
  if (typeof window === "undefined") return null;
  const current = window.localStorage.getItem(ACTIVE_ORDER_KEY);
  if (current) return current;
  // One-shot migration from legacy keys.
  for (const k of LEGACY_KEYS) {
    const v = window.localStorage.getItem(k);
    if (v) {
      window.localStorage.setItem(ACTIVE_ORDER_KEY, v);
      return v;
    }
  }
  return null;
}

export function useOrderDraft(
  user: User | null | undefined,
  opts?: { disabled?: boolean },
) {
  const [draftId, setDraftId] = useState<string | null>(() => readCachedDraftId());
  const inFlightRef = useRef<Promise<string | null> | null>(null);
  const pendingPatchRef = useRef<Record<string, unknown>>({});
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const flushedRef = useRef(false);

  // Drop the cached draft id if it doesn't belong to the current user.
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
      if (
        !data ||
        data.user_id !== user.id ||
        (data.status !== "intake_started" && data.status !== "draft")
      ) {
        window.localStorage.removeItem(ACTIVE_ORDER_KEY);
        setDraftId(null);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [user, draftId]);

  const ensureDraft = useCallback(
    async (fields: OrderDraftFields): Promise<string | null> => {
      if (opts?.disabled) return null;
      if (!user) return null;
      if (draftId) return draftId;
      if (inFlightRef.current) return inFlightRef.current;

      const pending = readPendingDraft();
      const promise = (async () => {
        const payload = sanitize({
          ...(pending ?? {}),
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
        window.localStorage.setItem(ACTIVE_ORDER_KEY, data.id);
        setDraftId(data.id);
        await supabase.from("order_events").insert({
          order_id: data.id,
          event_type: "intake_started",
          actor: "customer",
          metadata: {
            source_path: fields.source_path ?? null,
            had_pending_draft: !!pending,
          } as any,
        });
        // Flush the pending anonymous draft now that it lives in the DB.
        if (pending) clearPendingDraft();
        flushedRef.current = true;
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
        const patch = {
          ...pendingPatchRef.current,
          last_activity_at: new Date().toISOString(),
        };
        pendingPatchRef.current = {};
        let id = draftId;
        if (!id) id = await ensureDraft(fields);
        if (!id) return;
        const { error } = await supabase.from("orders").update(patch).eq("id", id);
        if (error) console.warn("[useOrderDraft] patch failed", error);
      }, 1200);
    },
    [user, draftId, ensureDraft, opts?.disabled],
  );

  /** Convenience: log an event tied to the active draft. */
  const logEvent = useCallback(
    async (type: OrderEventType, metadata: Record<string, unknown> = {}) => {
      let id = draftId;
      if (!id && user) id = await ensureDraft({});
      if (!id) return;
      await logOrderEvent(id, type, metadata);
    },
    [draftId, ensureDraft, user],
  );

  const clearDraft = useCallback(() => {
    window.localStorage.removeItem(ACTIVE_ORDER_KEY);
    setDraftId(null);
  }, []);

  useEffect(
    () => () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    },
    [],
  );

  return { draftId, ensureDraft, patchDraft, logEvent, clearDraft };
}
