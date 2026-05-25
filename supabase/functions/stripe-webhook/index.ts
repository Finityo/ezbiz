import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

serve(async (req) => {
  const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY")!, {
    apiVersion: "2025-08-27.basil",
  });

  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;
  const webhookSecret = Deno.env.get("STRIPE_WEBHOOK_SECRET")!;

  let event;
  try {
    event = stripe.webhooks.constructEvent(body, sig, webhookSecret);
  } catch (err) {
    return new Response("Invalid signature", { status: 400 });
  }

  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // Helper: merge application_data and update business_applications by id
  const updateApplication = async (
    applicationId: string,
    status: string,
    extraData: Record<string, unknown>,
  ) => {
    try {
      const { data: existing } = await supabase
        .from("business_applications")
        .select("application_data")
        .eq("id", applicationId)
        .maybeSingle();

      const merged = {
        ...((existing?.application_data as Record<string, unknown>) ?? {}),
        ...extraData,
      };

      await supabase
        .from("business_applications")
        .update({ status, application_data: merged })
        .eq("id", applicationId);
    } catch (err) {
      console.error("Failed to update business_application", applicationId, err);
    }
  };

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const applicationId =
      session.metadata?.application_id || session.client_reference_id || null;

    // Resolve the matching `orders` row. Prefer explicit metadata.orderId,
    // then fall back to (application_id) and (stripe_session_id) so /order-flow
    // checkouts — which only stamp application_id — still flip status.
    let orderId: string | null = session.metadata?.orderId ?? null;

    if (!orderId && applicationId) {
      const { data: byApp } = await supabase
        .from("orders")
        .select("id")
        .eq("application_id", applicationId)
        .maybeSingle();
      orderId = byApp?.id ?? null;
    }

    if (!orderId && session.id) {
      const { data: bySession } = await supabase
        .from("orders")
        .select("id")
        .eq("stripe_session_id", session.id)
        .maybeSingle();
      orderId = bySession?.id ?? null;
    }

    // Existing normalized `orders` flow — single source of truth for admin
    if (orderId) {
      await supabase
        .from("orders")
        .update({
          status: "payment_complete",
          stripe_session_id: session.id,
          stripe_payment_intent: session.payment_intent,
          total_amount: (session.amount_total || 0) / 100,
        })
        .eq("id", orderId);

      await supabase
        .from("payments")
        .insert({
          order_id: orderId,
          stripe_payment_id: session.payment_intent,
          amount: (session.amount_total || 0) / 100,
          status: "paid",
        });

      await supabase
        .from("order_events")
        .insert({
          order_id: orderId,
          event_type: "payment_complete",
          actor: "stripe_webhook",
          metadata: {
            session_id: session.id,
            payment_intent: session.payment_intent,
            application_id: applicationId,
          },
        });
    } else {
      console.warn("checkout.session.completed: no matching orders row", {
        sessionId: session.id,
        applicationId,
      });
    }

    // Mirror flow into business_applications (audit only)
    if (applicationId) {
      await updateApplication(applicationId, "paid", {
        paymentStatus: "paid",
        stripeSessionId: session.id,
        stripePaymentIntent: session.payment_intent,
        paidAt: new Date().toISOString(),
        amountTotal: (session.amount_total || 0) / 100,
        currency: session.currency,
        orderId: orderId,
      });
    }

    // Trigger customer order-confirmation email (best-effort)
    const customerEmail =
      session.customer_email || session.customer_details?.email || null;
    if (orderId && customerEmail) {
      try {
        const { data: orderRow } = await supabase
          .from("orders")
          .select("entity_type, state")
          .eq("id", orderId)
          .maybeSingle();

        const { data: bizInfo } = await supabase
          .from("business_information")
          .select("business_name")
          .eq("order_id", orderId)
          .maybeSingle();

        await supabase.functions.invoke("send-transactional-email", {
          body: {
            templateName: "order-confirmation",
            recipientEmail: customerEmail,
            idempotencyKey: `order-confirmation-${orderId}`,
            templateData: {
              name: session.customer_details?.name || undefined,
              businessName: bizInfo?.business_name || undefined,
              entityType: orderRow?.entity_type || undefined,
              state: orderRow?.state || undefined,
              orderId,
              amountTotal: (session.amount_total || 0) / 100,
            },
          },
        });
      } catch (err) {
        console.error("order-confirmation email failed", err);
      }
    }
  } else if (event.type === "checkout.session.expired") {
    const session = event.data.object as any;
    const applicationId =
      session.metadata?.application_id || session.client_reference_id || null;
    if (applicationId) {
      await updateApplication(applicationId, "payment_expired", {
        paymentStatus: "expired",
        stripeSessionId: session.id,
        expiredAt: new Date().toISOString(),
      });
      // Mirror to orders
      const { data: ord } = await supabase
        .from("orders").select("id").eq("application_id", applicationId).maybeSingle();
      if (ord?.id) {
        await supabase.from("orders").update({ status: "cancelled" }).eq("id", ord.id);
      }
    }
  } else if (event.type === "payment_intent.payment_failed") {
    const intent = event.data.object as any;
    const applicationId = intent.metadata?.application_id || null;
    if (applicationId) {
      await updateApplication(applicationId, "payment_failed", {
        paymentStatus: "failed",
        stripePaymentIntent: intent.id,
        failureMessage: intent.last_payment_error?.message ?? null,
        failedAt: new Date().toISOString(),
      });
      const { data: ord } = await supabase
        .from("orders").select("id").eq("application_id", applicationId).maybeSingle();
      if (ord?.id) {
        await supabase.from("orders").update({ status: "Pending Payment" }).eq("id", ord.id);
      }
    }
  }

  return new Response("ok", { status: 200 });
});
