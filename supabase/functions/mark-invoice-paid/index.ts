import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { invoiceId } = await req.json();
    if (!invoiceId) throw new Error("invoiceId is required");

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const invoice = await stripe.invoices.pay(invoiceId, {
      paid_out_of_band: true,
    });

    // Send the invoice receipt email via Stripe
    if (invoice.status === "paid") {
      try {
        await stripe.invoices.sendInvoice(invoiceId);
      } catch (sendErr) {
        // Invoice may already have been sent or may not support sending — log but don't fail
        console.warn("Could not send invoice email:", sendErr.message);
      }
    }

    return new Response(JSON.stringify({ success: true, status: invoice.status }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Unable to process payment update." }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
