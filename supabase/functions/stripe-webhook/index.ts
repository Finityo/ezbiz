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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;
    const orderId = session.metadata.orderId;

    await supabase
      .from("orders")
      .update({
        status: "Paid",
        stripe_session_id: session.id,
        stripe_payment_intent: session.payment_intent,
      })
      .eq("id", orderId);

    // Trigger confirmation email
    await supabase.functions.invoke("send-order-email", {
      body: {
        orderId,
        email: session.customer_email,
        status: "Paid",
      },
    });
  }

  return new Response("ok", { status: 200 });
});
