import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: claimsError } =
      await supabase.auth.getClaims(token);
    if (claimsError || !claimsData?.claims) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: corsHeaders,
      });
    }

    const userEmail = claimsData.claims.email as string;
    if (!userEmail) {
      return new Response(
        JSON.stringify({ error: "No email found for user" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Find Stripe customer by email
    const customers = await stripe.customers.list({
      email: userEmail,
      limit: 1,
    });

    if (customers.data.length === 0) {
      return new Response(JSON.stringify({ payments: [] }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const customerId = customers.data[0].id;

    // Fetch invoices
    const invoices = await stripe.invoices.list({
      customer: customerId,
      limit: 50,
    });

    // Fetch payment intents (for non-invoice payments)
    const paymentIntents = await stripe.paymentIntents.list({
      customer: customerId,
      limit: 50,
    });

    const payments = [
      ...invoices.data.map((inv) => ({
        id: inv.id,
        type: "invoice" as const,
        number: inv.number,
        description: inv.description || inv.lines?.data?.[0]?.description || "Invoice",
        amount: inv.total,
        currency: inv.currency,
        status: inv.status,
        created: inv.created,
        hostedUrl: inv.hosted_invoice_url,
        pdfUrl: inv.invoice_pdf,
      })),
      ...paymentIntents.data
        .filter((pi) => !pi.invoice) // exclude invoice-linked ones to avoid duplicates
        .map((pi) => ({
          id: pi.id,
          type: "payment" as const,
          number: null,
          description: pi.description || "Payment",
          amount: pi.amount,
          currency: pi.currency,
          status: pi.status,
          created: pi.created,
          hostedUrl: null,
          pdfUrl: null,
        })),
    ].sort((a, b) => b.created - a.created);

    return new Response(JSON.stringify({ payments }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error fetching payment history:", error);
    return new Response(JSON.stringify({ error: error.message }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 500,
    });
  }
});
