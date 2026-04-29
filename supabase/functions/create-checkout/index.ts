import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * EXPECTED PRICE GUARD
 * Mirror of `EXPECTED_PRICE_CENTS` in src/lib/pricing.ts.
 * Refuses to create a Stripe Checkout Session if the live Stripe Price's
 * unit_amount differs from what the app config expects. Prevents charging
 * old amounts during the gap between updating displayed prices and
 * creating new Stripe Price IDs.
 *
 * Keep this in lockstep with src/lib/pricing.ts whenever prices change.
 */
const EXPECTED_PRICE_CENTS: Record<string, number> = {
  // Packages
  "price_1TAjRYIUysiSR1zwBUBS2jDQ": 12900, // Basic $129
  "price_1TAjRsIUysiSR1zwaDwDhUBl": 27900, // Deluxe $279
  "price_1TAjSCIUysiSR1zwLXwe8C0Z": 34900, // Complete $349
  // Add-ons
  "price_1TAIMzIUysiSR1zw3s47ma4C": 8900,  // EIN $89
  "price_1TAINYIUysiSR1zwwd2NQAiE": 12900, // Operating Agreement $129
  "price_1TAIO1IUysiSR1zwAm501dWv": 14900, // Registered Agent $149
  "price_1T0yYLIUysiSR1zwkctIi3Th": 12900, // S-Corp $129
  "price_1TAISYIUysiSR1zw9QGizV8b": 14900, // License Research $149
  "price_1TAjoKIUysiSR1zwBWcDQxr8": 8900,  // DBA $89
  "price_1TAjudIUysiSR1zw5wkbfPVv": 12900, // Annual Report $129
  "price_1TAjy8IUysiSR1zwnphHwavq": 5900,  // Corporate Kit $59
  "price_1TAjzBIUysiSR1zwapC53gXv": 10300, // Compliance Alerts $103
  "price_1TAkcOIUysiSR1zwNvOiYDnD": 15000, // White Glove Base $150
  "price_1TAkckIUysiSR1zw6EQcZ3lo": 8000,  // White Glove Hourly $80
  // Processing & shipping
  "price_1TAwtjIUysiSR1zwrXt9vICY": 15000, // Express Processing $150
  "price_1TAwu6IUysiSR1zw8TGxG4RI": 2900,  // Shipping & Handling $29
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
    const { lineItems, stateFee, successPath = "/dashboard", cancelPath = "/pricing", orderId } = await req.json();

    if (!lineItems || !Array.isArray(lineItems) || lineItems.length === 0) {
      throw new Error("lineItems array is required");
    }

    // Authenticate user (optional - supports guest checkout)
    let userEmail: string | undefined;
    let userId: string | undefined;
    let customerId: string | undefined;
    const authHeader = req.headers.get("Authorization");

    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabaseClient.auth.getUser(token);
      userEmail = data.user?.email ?? undefined;
      userId = data.user?.id;
    }

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    // ── Price-amount guard ──────────────────────────────────────────────
    // Verify each Stripe Price's live unit_amount matches what the app
    // expects. Refuse the session if any price is mismatched (or missing
    // from the expected map). This blocks accidental wrong charges when
    // displayed prices change before new Stripe Price IDs are created.
    const uniquePriceIds: string[] = Array.from(
      new Set(
        lineItems
          .map((li: { priceId?: string }) => li?.priceId)
          .filter((id: string | undefined): id is string => typeof id === "string" && id.length > 0)
      )
    );

    const priceChecks = await Promise.all(
      uniquePriceIds.map(async (id) => {
        try {
          const price = await stripe.prices.retrieve(id);
          return { id, amount: price.unit_amount ?? null, error: null as string | null };
        } catch (e: any) {
          return { id, amount: null, error: e?.message || "retrieve failed" };
        }
      })
    );

    const mismatches = priceChecks.filter((c) => {
      const expected = EXPECTED_PRICE_CENTS[c.id];
      if (expected === undefined) return true; // unknown price → reject
      if (c.amount === null) return true;
      return c.amount !== expected;
    });

    if (mismatches.length > 0) {
      console.error(
        "Price guard rejected checkout. Mismatches:",
        JSON.stringify(
          mismatches.map((m) => ({
            id: m.id,
            stripeAmount: m.amount,
            expected: EXPECTED_PRICE_CENTS[m.id] ?? "(not in expected map)",
            error: m.error,
          }))
        )
      );
      return new Response(
        JSON.stringify({
          error:
            "We're updating our pricing. Checkout is temporarily unavailable for the selected items. Please contact support or try again shortly.",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 409 }
      );
    }
    // ────────────────────────────────────────────────────────────────────

    // Find existing Stripe customer
    if (userEmail) {
      const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      }
    }

    let finalOrderId = orderId;

    // Use existing order or create new one
    if (orderId) {
      // Update existing order
      await supabaseClient
        .from("orders")
        .update({
          package_id: lineItems[0]?.priceId,
          state_fee: stateFee?.amount || 0,
          status: "Pending Payment",
        })
        .eq("id", orderId);
    } else {
      // Create new order record
      const { data: order } = await supabaseClient
        .from("orders")
        .insert({
          user_id: userId,
          email: userEmail,
          package_id: lineItems[0]?.priceId,
          state: stateFee?.stateName,
          state_fee: stateFee?.amount || 0,
          status: "Pending Payment",
        })
        .select()
        .single();
      finalOrderId = order?.id;
    }

    const origin = req.headers.get("origin") || "https://www.ezbiz-fs.com";

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
        orderId: finalOrderId,
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
    if (finalOrderId) {
      await supabaseClient
        .from("orders")
        .update({
          stripe_session_id: session.id,
          total_amount: (session.amount_total || 0) / 100,
        })
        .eq("id", finalOrderId);
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
