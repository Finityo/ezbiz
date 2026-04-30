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
  "price_1TRWTlIUysiSR1zwZxdGtoik": 12900, // Basic $129
  "price_1TRWVAIUysiSR1zwnyhVFD5p": 27900, // Deluxe $279
  "price_1TRWWDIUysiSR1zwcDP98wz9": 14900, // Business License Research $149
  "price_1TRWWoIUysiSR1zwSmodfF9J":  2900, // Shipping & Handling $29
};

const TEST_PRICE_ID_BY_LIVE_ID: Record<string, string> = {
  "price_1TRVJJIUysiSR1zwmUpJg0gy": "price_1TRWTlIUysiSR1zwZxdGtoik", // Basic $129
  "price_1TRVJjIUysiSR1zwaDaz3ics": "price_1TRWVAIUysiSR1zwnyhVFD5p", // Deluxe $279
  "price_1TRVYvIUysiSR1zwCZJc1iHf": "price_1TRWWDIUysiSR1zwcDP98wz9", // Business License Research $149
  "price_1TAwu6IUysiSR1zw8TGxG4RI": "price_1TRWWoIUysiSR1zwSmodfF9J", // Shipping & Handling $29
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
      applicationId,
      orderEnrichment,
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
    // Admins are AUTOMATICALLY routed to Stripe TEST mode (so they can safely
    // verify checkout with the 4242 card). Non-admins always use LIVE mode.
    // The `testMode` flag from the client is treated as a hint only — the
    // server makes the final decision based on admin role + key availability.
    const hasTestKey = !!Deno.env.get("STRIPE_SECRET_KEY_TEST");
    const useTestMode = isAdmin && hasTestKey;

    const stripeKey = useTestMode
      ? Deno.env.get("STRIPE_SECRET_KEY_TEST") || ""
      : Deno.env.get("STRIPE_SECRET_KEY") || "";

    const stripe = new Stripe(stripeKey, { apiVersion: "2025-08-27.basil" });
    const expectedMap = useTestMode ? EXPECTED_PRICE_CENTS_TEST : EXPECTED_PRICE_CENTS;
    // In TEST mode we no longer hard-block on unknown IDs — we synthesize
    // inline price_data from the LIVE catalog so admins can validate the
    // full real-world cart with the 4242 card without recreating every
    // price in the test account.
    const strictUnknown = useTestMode ? false : STRICT_UNKNOWN_PRICES;

    // Map known LIVE → TEST IDs first; anything still pointing at a LIVE
    // ID will be resolved to inline price_data below.
    const activeLineItems = useTestMode
      ? lineItems.map((item: { priceId: string; quantity?: number }) => ({
          ...item,
          priceId: TEST_PRICE_ID_BY_LIVE_ID[item.priceId] || item.priceId,
        }))
      : lineItems;

    // ── Price-amount guard ──────────────────────────────────────────────
    const uniquePriceIds: string[] = Array.from(
      new Set(
        activeLineItems
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

    // Use service-role client for orders + child-table writes so RLS doesn't
    // block server-side persistence of order metadata before checkout.
    const dbClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? ""
    );

    let finalOrderId = orderId;

    // Build the orders payload, including any enrichment passed from the order flow.
    const ordersPayload: Record<string, unknown> = {
      package_id: lineItems[0]?.priceId,
      state_fee: stateFee?.amount || 0,
      status: "Pending Payment",
    };
    if (orderEnrichment?.entityType) ordersPayload.entity_type = orderEnrichment.entityType;
    if (orderEnrichment?.packageLabel) ordersPayload.package = orderEnrichment.packageLabel;
    if (applicationId) ordersPayload.application_id = applicationId;

    if (orderId) {
      await dbClient.from("orders").update(ordersPayload).eq("id", orderId);
    } else {
      const { data: order, error: insertErr } = await dbClient
        .from("orders")
        .insert({
          ...ordersPayload,
          user_id: userId,
          email: userEmail ?? orderEnrichment?.contactEmail,
          state: stateFee?.stateName,
        })
        .select("id")
        .single();
      if (insertErr) {
        console.error("orders insert failed", insertErr);
      }
      finalOrderId = order?.id;
    }

    // Persist child rows (business_information, contact_information) so the
    // admin Orders tab + per-order detail dialog show the same rich data the
    // user entered in /order-flow.
    if (finalOrderId && orderEnrichment) {
      try {
        if (orderEnrichment.businessName) {
          await dbClient.from("business_information").insert({
            order_id: finalOrderId,
            company_name: orderEnrichment.businessName,
          });
        }
        if (orderEnrichment.businessAddress || orderEnrichment.businessCity || orderEnrichment.businessZip) {
          await dbClient.from("addresses").insert({
            order_id: finalOrderId,
            type: "business",
            address1: orderEnrichment.businessAddress ?? null,
            city: orderEnrichment.businessCity ?? null,
            state: stateFee?.stateName ?? null,
            zip: orderEnrichment.businessZip ?? null,
          });
        }
        const contactEmail = orderEnrichment.contactEmail || userEmail;
        if (contactEmail || orderEnrichment.contactFirstName) {
          await dbClient.from("contact_information").insert({
            order_id: finalOrderId,
            first_name: orderEnrichment.contactFirstName ?? null,
            last_name: orderEnrichment.contactLastName ?? null,
            email: contactEmail ?? null,
            phone: orderEnrichment.contactPhone ?? null,
          });
        }
        await dbClient.from("order_events").insert({
          order_id: finalOrderId,
          event_type: "checkout_started",
          actor: "system",
          metadata: {
            application_id: applicationId ?? null,
            package_id: orderEnrichment.packageId ?? null,
            total: orderEnrichment.totalAmount ?? null,
          },
        });
      } catch (childErr) {
        console.error("child-row inserts failed", childErr);
      }
    }

    // Cross-link the business_application back to the orders row.
    if (applicationId && finalOrderId) {
      try {
        const { data: existingApp } = await dbClient
          .from("business_applications")
          .select("application_data")
          .eq("id", applicationId)
          .maybeSingle();
        const merged = {
          ...((existingApp?.application_data as Record<string, unknown>) ?? {}),
          orderId: finalOrderId,
        };
        await dbClient
          .from("business_applications")
          .update({ application_data: merged })
          .eq("id", applicationId);
      } catch (linkErr) {
        console.error("application <-> order link failed", linkErr);
      }
    }

    const origin = req.headers.get("origin") || "https://www.ezbiz-fs.com";

    // Build the Stripe line items.
    // In TEST mode, any priceId that isn't a known TEST price is resolved by
    // looking up the matching LIVE price (using STRIPE_SECRET_KEY) and
    // synthesizing inline price_data with the same name + amount. This lets
    // admins validate the full real cart with the 4242 card without having
    // to recreate every price in the test account.
    const liveStripeForLookup =
      useTestMode && Deno.env.get("STRIPE_SECRET_KEY")
        ? new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
            apiVersion: "2025-08-27.basil",
          })
        : null;

    const stripeLineItems: any[] = [];
    for (const item of activeLineItems as Array<{ priceId: string; quantity?: number }>) {
      const qty = item.quantity || 1;

      // Try to use the price ID directly in the active mode.
      let priceExistsHere = false;
      try {
        await stripe.prices.retrieve(item.priceId);
        priceExistsHere = true;
      } catch {
        priceExistsHere = false;
      }

      if (priceExistsHere) {
        stripeLineItems.push({ price: item.priceId, quantity: qty });
        continue;
      }

      // Fallback (test mode only): look the price up in LIVE and clone it
      // as inline price_data so test checkout still works end-to-end.
      if (useTestMode && liveStripeForLookup) {
        try {
          const livePrice = await liveStripeForLookup.prices.retrieve(item.priceId, {
            expand: ["product"],
          });
          const productName =
            (livePrice.product as any)?.name || "EZ BIZ Service";
          const productDescription =
            (livePrice.product as any)?.description || undefined;
          stripeLineItems.push({
            price_data: {
              currency: livePrice.currency || "usd",
              product_data: {
                name: productName,
                ...(productDescription ? { description: productDescription } : {}),
              },
              unit_amount: livePrice.unit_amount ?? 0,
            },
            quantity: qty,
          });
          continue;
        } catch (e) {
          console.error(
            `Test-mode fallback failed for ${item.priceId}:`,
            (e as any)?.message,
          );
        }
      }

      // Last resort: pass through (Stripe will surface a clear error).
      stripeLineItems.push({ price: item.priceId, quantity: qty });
    }

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
      ...(applicationId ? { client_reference_id: applicationId } : {}),
      metadata: {
        orderId: finalOrderId,
        ...(applicationId ? { application_id: applicationId } : {}),
        ...(userId ? { user_id: userId } : {}),
        source: "ezbiz_order_flow",
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
      await dbClient
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
