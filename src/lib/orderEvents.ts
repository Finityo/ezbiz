/**
 * Unified order-lifecycle event taxonomy.
 * Every surface (pricing, order flow, auth, dashboard, admin, webhooks)
 * logs to `public.order_events` through `logOrderEvent` so the admin
 * Flight Control view has one consistent timeline per order.
 */
import { supabase } from "@/integrations/supabase/client";

export const ORDER_EVENT_TYPES = [
  "intake_started",
  "package_selected",
  "addon_selected",
  "state_selected",
  "veteran_check_started",
  "veteran_eligible",
  "vvl_pdf_downloaded",
  "account_created",
  "email_confirmed",
  "business_info_started",
  "business_info_saved",
  "waiver_draft_created",
  "document_uploaded",
  "checkout_started",
  "payment_complete",
  "admin_status_updated",
  "sent_to_account_manager",
  "order_completed",
] as const;

export type OrderEventType = (typeof ORDER_EVENT_TYPES)[number];

export type OrderEventActor = "customer" | "admin" | "system" | "webhook";

/** localStorage keys */
export const ACTIVE_ORDER_KEY = "ezbiz_active_order_id";
export const PENDING_DRAFT_KEY = "ezbiz_pending_draft";

export interface PendingDraft {
  filing_path?: string;
  package?: string;
  selected_addons?: string[];
  selected_state?: string;
  entity_type?: string;
  source_route?: string;
  veteran_eligible?: boolean;
  veteran_waiver_applied?: boolean;
  veteran_waiver_amount?: number;
  vvl_pdf_downloaded?: boolean;
  updated_at?: string;
}

export function readPendingDraft(): PendingDraft | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PENDING_DRAFT_KEY);
    return raw ? (JSON.parse(raw) as PendingDraft) : null;
  } catch {
    return null;
  }
}

export function writePendingDraft(patch: PendingDraft) {
  if (typeof window === "undefined") return;
  const merged: PendingDraft = {
    ...(readPendingDraft() ?? {}),
    ...patch,
    updated_at: new Date().toISOString(),
  };
  try {
    window.localStorage.setItem(PENDING_DRAFT_KEY, JSON.stringify(merged));
  } catch {
    /* quota — ignore */
  }
}

export function clearPendingDraft() {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(PENDING_DRAFT_KEY);
  } catch {
    /* ignore */
  }
}

/** Fire-and-forget event log. Safe on anonymous users (no-op if orderId missing). */
export async function logOrderEvent(
  orderId: string | null | undefined,
  eventType: OrderEventType,
  metadata: Record<string, unknown> = {},
  actor: OrderEventActor = "customer",
): Promise<void> {
  if (!orderId) return;
  try {
    const { error } = await supabase.from("order_events").insert({
      order_id: orderId,
      event_type: eventType,
      actor,
      metadata: metadata as any,
    });
    if (error) console.warn("[logOrderEvent] insert failed", eventType, error);
  } catch (err) {
    console.warn("[logOrderEvent] threw", eventType, err);
  }
}
