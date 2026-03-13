import { SupabaseClient } from '@supabase/supabase-js';

export const ORDER_STATUSES = [
  "draft",
  "processing",
  "payment_complete",
  "submitted",
  "state_processing",
  "filed",
  "completed",
] as const;

export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const updateOrderStatus = async (
  supabase: SupabaseClient,
  orderId: string,
  newStatus: OrderStatus
) => {
  const { data: order, error } = await supabase
    .from("orders")
    .select("status")
    .eq("id", orderId)
    .single();

  if (error) throw error;

  const { error: updateError } = await supabase
    .from("orders")
    .update({
      status: newStatus,
      updated_at: new Date().toISOString(),
    })
    .eq("id", orderId);

  if (updateError) throw updateError;

  return {
    previousStatus: order.status,
    newStatus,
  };
};
