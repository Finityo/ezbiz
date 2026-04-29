import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * EXPECTED PRICE GUARD — LIVE
 * Mirror of `EXPECTED_PRICE_CENTS` in src/lib/pricing.ts.
 * Refuses to create a Stripe Checkout Session if the live Stripe Price's
 * unit_amount differs from what the app config expects.
 */
const EXPECTED_PRICE_CENTS: Record<string, number> = {
  // Packages
  "price_1TRVJJIUysiSR1zwmUpJg0gy": 12900, // Basic $129
  "price_1TRVJjIUysiSR1zwaDaz3ics": 27900, // Deluxe $279
  "price_1TRVK3IUysiSR1zw7hfeeub7": 34900, // Complete $349
  // Add-ons
  "price_1TAIMzIUysiSR1zw3s47ma4C": 8900,
  "price_1TRVKdIUysiSR1zw1HP19iOp": 12900,
  "price_1TRVLJIUysiSR1zwWwikkHZo": 12900,
  "price_1TAIO1IUysiSR1zwAm501dWv": 14900,
  "price_1TRVLlIUysiSR1zwmHR4FjJs": 12900,
  "price_1TRVYvIUysiSR1zwCZJc1iHf": 14900,
  "price_1TRVMCIUysiSR1zwVo7ifJBd": 8900,
  "price_1TRVMYIUysiSR1zwVtaPc60F": 12900,
  "price_1TRVMtIUysiSR1zwFNe49mLG": 24900,
  "price_1TRVNLIUysiSR1zwJCnMKUrt": 37900,
  "price_1TRVNkIUysiSR1zwfBfD2Png": 30900,
  "price_1TRVOFIUysiSR1zw3KJWpCt3": 24900,
  "price_1TRVOnIUysiSR1zw83x4pjmf": 37900,
  "price_1TRVPGIUysiSR1zwgnm6BOaV": 49900,
  "price_1TRVPsIUysiSR1zw4R0pqYEr": 62900,
  "price_1TAjy8IUysiSR1zwnphHwavq": 5900,
  "price_1TAjzBIUysiSR1zwapC53gXv": 10300,
  "price_1TAkcOIUysiSR1zwNvOiYDnD": 15000,
  "price_1TAkckIUysiSR1zw6EQcZ3lo": 8000,
  // Processing & shipping
  "price_1TAwtjIUysiSR1zwrXt9vICY": 15000,
  "price_1TAwu6IUysiSR1zw8TGxG4RI": 2900,
};

/**
 * EXPECTED PRICE GUARD — TEST MODE
 * Populate this map with the Stripe TEST-MODE price IDs (sk_test_) the
 * admin creates for safe 4242-card validation. Until populated, any
 * test-mode checkout will be blocked by STRICT_UNKNOWN_PRICES.
 */
const EXPECTED_PRICE_CENTS_TEST: Record<string, number> = {
  // Example shape — replace with real test Price IDs after creation:
  // "price_TEST_xxx_basic":   12900,
  // "price_TEST_xxx_deluxe":  27900,
  // "price_TEST_xxx_license": 14900,
  // "price_TEST_xxx_ship":     2900,
};

const STRICT_UNKNOWN_PRICES = true; // production: unknown live IDs blocked
const STRICT_UNKNOWN_PRICES_TEST = true; // test: unknown test IDs also blocked

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    const {
      lineItems,
      stateFee,
      successPath = "/dashboard",
      cancelPath = "/pricing",
      orderId,
      testMode = false,
    } = await req.json();

    if (!lineItems || !Array.isArray(lineItems) || lineItems.length === 0) {
      throw new Error("lineItems array is required");
    }

    // Authenticate user (optional - supports guest checkout)
    let userEmail: string | undefined;
    let userId: string | undefined;
    let customerId: string | undefined;
    let isAdmin = false;
    const authHeader = req.headers.get("Authorization");

    if (authHeader) {
      const token = authHeader.replace("Bearer ", "");
      const { data } = await supabaseClient.auth.getUser(token);
      userEmail = data.user?.email ?? undefined;
      userId = data.user?.id;

      if (userId) {
        // Use service-role client to bypass RLS for the role lookup
        const adminClient = createClient(
          Deno.env.get("SUPABASE_URL") ?? "",
          Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
        );
        const { data: roleRow } = await adminClient
          .from("user_roles")
          .select("role")
          .eq("user_id", userId)
          .eq("role", "admin")
          .maybeSingle();
        isAdmin = !!roleRow;
      }
    }

    // ── Test-mode authorization ────────────────────────────────────────
    // Test mode is admin-only AND requires STRIPE_SECRET_KEY_TEST to be set.
    // Any non-admin attempting testMode silently falls back to live? NO —
    // we reject explicitly so misuse is loud, not silent.
    const useTestMode = testMode === true;
    if (useTestMode && !isAdmin) {
      return new Response(
        JSON.stringify({ error: "Test mode is restricted to administrators." }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 403 }
      );
    }

    const stripeKey = useTestMode
      ? Deno.env.get("STRIPE_SECRET_KEY_TEST") || ""
      : Deno.env.get("STRIPE_SECRET_KEY") || "";

    if (useTestMode && !stripeKey) {
      return new Response(
        JSON.stringify({
          error: "Test mode is not configured (STRIPE_SECRET_KEY_TEST missing).",
        }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
      );
    }

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const expectedMap = useTestMode ? EXPECTED_PRICE_CENTS_TEST : EXPECTED_PRICE_CENTS;
    const strictUnknown = useTestMode ? STRICT_UNKNOWN_PRICES_TEST : STRICT_UNKNOWN_PRICES;

    // ── Price-amount guard ──────────────────────────────────────────────
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
      const expected = expectedMap[c.id];
      if (expected === undefined) return strictUnknown;
      if (c.amount === null) return true;
      return c.amount !== expected;
    });

    if (mismatches.length > 0) {
      const unknownIds = mismatches
        .filter((m) => expectedMap[m.id] === undefined)
        .map((m) => m.id);
      const knownMismatchIds = mismatches
        .filter((m) => expectedMap[m.id] !== undefined)
        .map((m) => m.id);

      console.error(
        `Price guard rejected checkout (${useTestMode ? "TEST" : "LIVE"}).`,
        JSON.stringify({
          unknownIds,
          knownMismatches: mismatches
            .filter((m) => expectedMap[m.id] !== undefined)
            .map((m) => ({
              id: m.id,
              stripeAmount: m.amount,
              expected: expectedMap[m.id],
              error: m.error,
            })),
        })
      );

      const mapName = useTestMode ? "EXPECTED_PRICE_CENTS_TEST" : "EXPECTED_PRICE_CENTS";
      let userMessage =
        "We're updating our pricing. Checkout is temporarily unavailable for the selected items.";
      if (unknownIds.length > 0) {
        userMessage = `Checkout blocked: unrecognized Stripe price ID(s) ${unknownIds.join(
          ", "
        )}. If this is intentional, an administrator must add the ID(s) to ${mapName} in supabase/functions/create-checkout/index.ts before checkout will be allowed.`;
      } else if (knownMismatchIds.length > 0) {
        userMessage = `Checkout blocked: Stripe price amount mismatch for ${knownMismatchIds.join(
          ", "
        )}. The live Stripe unit_amount no longer matches ${mapName} — update the expected map or fix the Stripe price.`;
      }

      return new Response(
        JSON.stringify({ error: userMessage }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 409 }
      );
    }
    // ────────────────────────────────────────────────────────────────────

    // Find existing Stripe customer (in the active mode's account)
    if (userEmail) {
      const customers = await stripe.customers.list({ email: userEmail, limit: 1 });
      if (customers.data.length > 0) {
        customerId = customers.data[0].id;
      }
    }

    let finalOrderId = orderId;

    if (orderId) {
      await supabaseClient
        .from("orders")
        .update({
          package_id: lineItems[0]?.priceId,
          state_fee: stateFee?.amount || 0,
          status: "Pending Payment",
        })
        .eq("id", orderId);
    } else {
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

    const stripeLineItems: any[] = lineItems.map(
      (item: { priceId: string; quantity?: number }) => ({
        price: item.priceId,
        quantity: item.quantity || 1,
      })
    );

    if (stateFee && stateFee.amount > 0) {
      stripeLineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: `${stateFee.stateName || "State"} Filing Fee`,
            description: `Government filing fee for ${stateFee.stateName || "your state"}`,
          },
          unit_amount: Math.round(stateFee.amount * 100),
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
        test_mode: useTestMode ? "true" : "false",
      },
      invoice_creation: {
        enabled: true,
        invoice_data: {
          description: useTestMode
            ? "EZ BIZ File Service - TEST MODE - Business Formation"
            : "EZ BIZ File Service - Business Formation",
        },
      },
      success_url: `${origin}${successPath}`,
      cancel_url: `${origin}${cancelPath}`,
    });

    if (finalOrderId) {
      await supabaseClient
        .from("orders")
        .update({
          stripe_session_id: session.id,
          total_amount: (session.amount_total || 0) / 100,
        })
        .eq("id", finalOrderId);
    }

    return new Response(
      JSON.stringify({ url: session.url, testMode: useTestMode }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error) {
    console.error("Checkout error:", error);
    return new Response(
      JSON.stringify({ error: "Unable to process checkout. Please try again." }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
