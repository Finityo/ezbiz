import { SupabaseClient } from '@supabase/supabase-js';
import { sendOrderStatusEmail } from '@/lib/sendStatusEmail';

export const ORDER_STATUSES = [
  "draft",
  "intake_started",
  "pending_payment",
  "checkout_abandoned",
  "processing",
  "payment_complete",
  "in_processing",
  "submitted",
  "state_processing",
  "filed",
  "completed",
  "cancelled",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const updateOrderStatus = async (
  supabase: SupabaseClient,
  orderId: string,
  newStatus: OrderStatus
) => {
  const [orderRes, bizRes] = await Promise.all([
    supabase.from("orders").select("*").eq("id", orderId).single(),
    supabase.from("business_information").select("company_name").eq("order_id", orderId).maybeSingle(),
  ]);

  if (orderRes.error) throw orderRes.error;
  const order = orderRes.data;

  const { error: updateError } = await supabase
    .from("orders")
    .update({
      status: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (updateError) throw updateError;

  console.log("ORDER STATUS UPDATED", {
    orderId,
    previousStatus: order.status,
    newStatus,
  });

  // Insert both lifecycle event and normalized audit event
  await supabase.from("order_events").insert([
    {
      order_id: orderId,
      event_type: newStatus,
      actor: "system",
      metadata: {
        previous_status: order.status,
        new_status: newStatus,
      },
    },
    {
      order_id: orderId,
      event_type: "status_changed",
      actor: "system",
      metadata: {
        previous_status: order.status,
        new_status: newStatus,
      },
    },
  ]);

  console.log("TIMELINE EVENT INSERTED", {
    orderId,
    eventType: newStatus,
  });

  // Trigger email notification (non-blocking)
  await sendOrderStatusEmail({
    orderId,
    customerEmail: order.email,
    businessName: bizRes.data?.company_name ?? null,
    entityType: order.entity_type,
    state: order.state,
    newStatus,
  });

  console.log("STATUS EMAIL TRIGGERED", {
    orderId,
    status: newStatus,
  });

  return {
    previousStatus: order.status,
    newStatus,
  };
};
