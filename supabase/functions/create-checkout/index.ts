import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    const { lineItems, stateFee, successPath = "/dashboard", cancelPath = "/pricing" } = await req.json();

    if (!lineItems || !Array.isArray(lineItems) || lineItems.length === 0) {
      throw new Error("lineItems array is required");
    }

    // Authenticate user (optional - supports guest checkout)
    let userEmail: string | undefined;
    let customerId: string | undefined;
    const authHeader = req.headers.get("Authorization");

    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabaseClient.auth.getUser(token);
      userEmail = data.user?.email ?? undefined;
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // Find existing Stripe customer
    if (userEmail) {
      const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      }
    }

    // Insert order record before creating checkout session
    const { data: order } = await supabaseClient
      .from("orders")
      .insert({
        user_id: data.user?.id,
        email: userEmail,
        package_id: lineItems[0]?.priceId,
        state: stateFee?.stateName,
        state_fee: stateFee?.amount || 0,
        status: "Pending Payment",
      })
      .select()
      .single();

    const origin = req.headers.get("origin") || "https://ezbiz.lovable.app";

    // Build Stripe line items
    const stripeLineItems: any[] = lineItems.map((item: { priceId: string; quantity?: number; description?: string }) => {
      const lineItem: any = {
        price: item.priceId,
        quantity: item.quantity || 1,
      };
      return lineItem;
    });

    // Add state filing fee as a dynamic line item if provided
    if (stateFee && stateFee.amount > 0) {
      stripeLineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: `${stateFee.stateName || "State"} Filing Fee`,
            description: `Government filing fee for ${stateFee.stateName || "your state"}`,
          },
          unit_amount: Math.round(stateFee.amount * 100), // Convert dollars to cents
        },
        quantity: 1,
      });
    }

    const session = await stripe.checkout.sessions.create({
      customer: customerId,
      customer_email: customerId ? undefined : userEmail,
      line_items: stripeLineItems,
      mode: "payment",
      metadata: {
        orderId: order?.id,
      },
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: "EZ BIZ File Service - Business Formation",
        },
      },
      success_url: `${origin}${successPath}`,
      cancel_url: `${origin}${cancelPath}`,
    });

    // Update order with stripe session id and total
    if (order?.id) {
      await supabaseClient
        .from("orders")
        .update({
          stripe_session_id: session.id,
          total_amount: (session.amount_total || 0) / 100,
        })
        .eq("id", order.id);
    }

    return new Response(JSON.stringify({ url: session.url }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });
  } catch (error) {
    console.error("Checkout error:", error);
    return new Response(
      JSON.stringify({ error: "Unable to process checkout. Please try again." }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
