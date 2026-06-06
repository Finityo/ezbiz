// verify-payment: /order-success fallback when Stripe's checkout.session.completed
// webhook hasn't reached us. Idempotently mirrors the webhook's work:
//   - flips orders.status -> payment_complete (atomic guard)
//   - inserts payments row if missing (keyed by stripe_payment_id)
//   - inserts order_events row
//   - triggers customer order-confirmation + admin paid-order emails
// Safe to call repeatedly: idempotent on orders.status and payments uniqueness check.

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { sessionId } = await req.json();
    if (!sessionId || typeof sessionId !== "string") {
      return new Response(JSON.stringify({ error: "sessionId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    const session = await stripe.checkout.sessions.retrieve(sessionId);
    if (session.payment_status !== "paid") {
      return new Response(
        JSON.stringify({ status: "not_paid", payment_status: session.payment_status }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // Resolve orderId
    let orderId: string | null = (session.metadata?.orderId as string) ?? null;
    const applicationId =
      (session.metadata?.application_id as string) || (session.client_reference_id as string) || null;

    if (!orderId && applicationId) {
      const { data } = await supabase
        .from("orders").select("id").eq("application_id", applicationId).maybeSingle();
      orderId = data?.id ?? null;
    }
    if (!orderId) {
      const { data } = await supabase
        .from("orders").select("id").eq("stripe_session_id", sessionId).maybeSingle();
      orderId = data?.id ?? null;
    }
    if (!orderId) {
      return new Response(JSON.stringify({ error: "Order not found for session" }), {
        status: 404,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Atomic idempotency guard — only the first caller to flip status wins
    const { data: flipped } = await supabase
      .from("orders")
      .update({
        status: "payment_complete",
        stripe_session_id: sessionId,
        stripe_payment_intent: session.payment_intent as string,
        total_amount: (session.amount_total || 0) / 100,
      })
      .eq("id", orderId)
      .neq("status", "payment_complete")
      .select("id");

    const wasFirstFlip = (flipped?.length ?? 0) > 0;

    if (!wasFirstFlip) {
      // Webhook (or prior verify-payment) already processed — make sure payment_intent
      // is at least stamped (covers a race where webhook flipped status but PI was null).
      if (session.payment_intent) {
        await supabase
          .from("orders")
          .update({ stripe_payment_intent: session.payment_intent as string })
          .eq("id", orderId)
          .is("stripe_payment_intent", null);
      }
      return new Response(
        JSON.stringify({ status: "already_processed", orderId }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // First-time processing — mirror webhook side-effects
    if (session.payment_intent) {
      const { data: existingPay } = await supabase
        .from("payments").select("id").eq("stripe_payment_id", session.payment_intent as string).maybeSingle();
      if (!existingPay) {
        await supabase.from("payments").insert({
          order_id: orderId,
          stripe_payment_id: session.payment_intent as string,
          amount: (session.amount_total || 0) / 100,
          status: "paid",
        });
      }
    }

    await supabase.from("order_events").insert({
      order_id: orderId,
      event_type: "payment_complete",
      actor: "verify_payment_fallback",
      metadata: {
        session_id: sessionId,
        payment_intent: session.payment_intent,
        application_id: applicationId,
      },
    });

    // Mirror to business_applications for audit
    if (applicationId) {
      try {
        const { data: existing } = await supabase
          .from("business_applications").select("application_data").eq("id", applicationId).maybeSingle();
        const merged = {
          ...((existing?.application_data as Record<string, unknown>) ?? {}),
          paymentStatus: "paid",
          stripeSessionId: sessionId,
          stripePaymentIntent: session.payment_intent,
          paidAt: new Date().toISOString(),
          amountTotal: (session.amount_total || 0) / 100,
          orderId,
        };
        await supabase
          .from("business_applications")
          .update({ status: "paid", application_data: merged })
          .eq("id", applicationId);
      } catch (err) {
        console.error("business_applications mirror failed", err);
      }
    }

    // Fire emails. idempotencyKey is stable per orderId so duplicate calls
    // (webhook + fallback) won't double-send if the queue dedupes; the atomic
    // status guard above is the primary protection.
    const customerEmail =
      (session.customer_email as string) || session.customer_details?.email || null;

    const { data: orderRow } = await supabase
      .from("orders")
      .select("order_number, entity_type, state, package, total_amount")
      .eq("id", orderId).maybeSingle();
    const { data: bizInfo } = await supabase
      .from("business_information").select("company_name").eq("order_id", orderId).maybeSingle();

    if (customerEmail) {
      try {
        await supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: "order-confirmation",
            recipientEmail: customerEmail,
            idempotencyKey: `order-confirmation-${orderId}`,
            templateData: {
              name: session.customer_details?.name || undefined,
              businessName: bizInfo?.company_name || undefined,
              entityType: orderRow?.entity_type || undefined,
              state: orderRow?.state || undefined,
              orderId,
              amountTotal: (session.amount_total || 0) / 100,
            },
          },
        });
      } catch (err) {
        console.error("order-confirmation send failed", err);
      }
    }

    try {
      await supabase.functions.invoke("send-transactional-email", {
        body: {
          templateName: "admin-paid-order-notification",
          recipientEmail: "christian@ezbiz-fs.com",
          idempotencyKey: `admin-paid-order-${orderId}`,
          templateData: {
            orderId,
            orderNumber: orderRow?.order_number,
            customerName: session.customer_details?.name || undefined,
            customerEmail: customerEmail || undefined,
            businessName: bizInfo?.company_name || undefined,
            entityType: orderRow?.entity_type || undefined,
            state: orderRow?.state || undefined,
            packageName: orderRow?.package || undefined,
            totalAmount:
              orderRow?.total_amount != null
                ? Number(orderRow.total_amount)
                : (session.amount_total || 0) / 100,
          },
        },
      });
    } catch (err) {
      console.error("admin paid-order send failed", err);
    }

    return new Response(
      JSON.stringify({ status: "processed", orderId }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (err) {
    console.error("verify-payment error", err);
    return new Response(
      JSON.stringify({ error: "Verification failed. Please refresh in a moment." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
