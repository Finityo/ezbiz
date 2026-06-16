import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";

/**
 * Read-only mirror of the server-side waiver guard in `create-checkout`.
 *
 * The backend remains the source of truth and independently re-verifies waiver
 * approval before zeroing the Texas state filing fee. This hook only exists so
 * that customer-facing summaries (legacy /order/checkout and the Dashboard
 * payment surface) don't display an estimate that contradicts the final
 * Stripe charge. If this hook is wrong, Stripe still bills correctly.
 */
export interface WaiverPricingState {
  /** True while the row is being fetched. */
  loading: boolean;
  /** True if this order is on the Texas Veteran Waiver track. */
  isWaiverPath: boolean;
  /** Raw business_applications.status (or null). */
  status: string | null;
  /** Waiver approved & flagged for fee removal → safe to show $0 state fee. */
  isApproved: boolean;
  /** Waiver was rejected → fall back to the standard state filing fee. */
  isRejected: boolean;
  /** Waiver still pending / under review → payment must be blocked. */
  isLocked: boolean;
}

const APPROVED_STATUS = "waiver_approved_payment_required";
const REJECTED_STATUS = "waiver_not_approved_standard_checkout_required";

export function useWaiverPricing(orderId: string | null | undefined): WaiverPricingState {
  const [state, setState] = useState<WaiverPricingState>({
    loading: !!orderId,
    isWaiverPath: false,
    status: null,
    isApproved: false,
    isRejected: false,
    isLocked: false,
  });

  useEffect(() => {
    let cancelled = false;
    if (!orderId) {
      setState({
        loading: false,
        isWaiverPath: false,
        status: null,
        isApproved: false,
        isRejected: false,
        isLocked: false,
      });
      return;
    }

    (async () => {
      // Same resolver pattern used by create-checkout: match by application_id
      // OR by application_data->>'orderId' so either side of the link works.
      const { data } = await supabase
        .from("business_applications")
        .select("status, application_data")
        .or(`id.eq.${orderId},application_data->>orderId.eq.${orderId}`)
        .maybeSingle();

      if (cancelled) return;

      const appData = (data?.application_data ?? {}) as Record<string, unknown>;
      const isWaiverPath = appData.filingPath === "texas_veteran_waiver";
      const status = (data?.status as string) ?? null;
      const isApproved =
        isWaiverPath && status === APPROVED_STATUS && appData.waivedStateFee === true;
      const isRejected = isWaiverPath && status === REJECTED_STATUS;
      const isLocked = isWaiverPath && !isApproved && !isRejected;

      setState({
        loading: false,
        isWaiverPath,
        status,
        isApproved,
        isRejected,
        isLocked,
      });
    })();

    return () => {
      cancelled = true;
    };
  }, [orderId]);

  return state;
}

/** Given a raw state fee and waiver state, returns the customer-visible fee. */
export function getEffectiveStateFee(rawStateFee: number, waiver: WaiverPricingState): number {
  if (waiver.isApproved) return 0;
  return rawStateFee;
}
