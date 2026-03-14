import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const WHITE_GLOVE_HOURLY_PRICE_ID = "price_1TAkckIUysiSR1zw6EQcZ3lo";

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    { auth: { persistSession: false } }
  );

  try {
    // Verify admin
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("No authorization header");
    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: userError } = await supabaseClient.auth.getUser(token);
    if (userError || !userData.user) throw new Error("Not authenticated");

    const { data: roleData } = await supabaseClient
      .from("user_roles")
      .select("role")
      .eq("user_id", userData.user.id)
      .eq("role", "admin")
      .maybeSingle();

    if (!roleData) throw new Error("Admin access required");

    const { customerEmail, hours, orderId } = await req.json();
    if (!customerEmail || !hours || hours < 1) {
      throw new Error("customerEmail and hours (>=1) are required");
    }

    const stripeKey = Deno.env.get("STRIPE_SECRET_KEY");
    if (!stripeKey) throw new Error("STRIPE_SECRET_KEY not configured");

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });

    // Find or create Stripe customer
    const customers = await stripe.customers.list({ email: customerEmail, limit: 1 });
    let customerId: string;
    if (customers.data.length > 0) {
      customerId = customers.data[0].id;
    } else {
      const customer = await stripe.customers.create({ email: customerEmail });
      customerId = customer.id;
    }

    // Pricing rules
    const INCLUDED_HOURS = 2;
    const HOURLY_RATE = 80;

    // Calculate billable hours (only hours beyond the first 2)
    const extraHours = Math.max(0, hours - INCLUDED_HOURS);

    if (extraHours === 0) {
      return new Response(
        JSON.stringify({ success: false, message: "No billable overage hours." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    // Create invoice
    const invoice = await stripe.invoices.create({
      customer: customerId,
      collection_method: "send_invoice",
      days_until_due: 7,
      metadata: { orderId: orderId || "", type: "white_glove_overage" },
    });

    await stripe.invoiceItems.create({
      customer: customerId,
      price: WHITE_GLOVE_HOURLY_PRICE_ID,
      quantity: extraHours,
      invoice: invoice.id,
    });

    const finalizedInvoice = await stripe.invoices.finalizeInvoice(invoice.id);
    await stripe.invoices.sendInvoice(invoice.id);

    const amount = extraHours * HOURLY_RATE;

    return new Response(
      JSON.stringify({
        success: true,
        invoiceId: finalizedInvoice.id,
        invoiceUrl: finalizedInvoice.hosted_invoice_url,
        billedHours: extraHours,
        amount,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    console.error("bill-white-glove-hours error:", message);
    return new Response(
      JSON.stringify({ error: message }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
