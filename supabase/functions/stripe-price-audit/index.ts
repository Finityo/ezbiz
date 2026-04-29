import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import Stripe from "https://esm.sh/stripe@18.5.0";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Admin tool: given a list of { key, label, expectedCents, stripePriceId },
 * return each item's live Stripe unit_amount + currency + active flag,
 * and a status (ok | mismatch | missing_id | not_found | error).
 *
 * Auth: requires a logged-in user with the `admin` role in user_roles.
 */
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );

    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const token = authHeader.replace("Bearer ", "");
    const { data: userData } = await supabaseClient.auth.getUser(token);
    const user = userData.user;
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    // Use service role to verify admin role (bypasses RLS safely server-side).
    const admin = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
      { auth: { persistSession: false } }
    );
    const { data: roleRow } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!roleRow) {
      return new Response(JSON.stringify({ error: "Forbidden" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const body = await req.json().catch(() => ({}));
    const items: Array<{
      key: string;
      label: string;
      expectedCents: number | null;
      stripePriceId: string | null;
    }> = Array.isArray(body?.items) ? body.items : [];

    const stripe = new Stripe(Deno.env.get("STRIPE_SECRET_KEY") || "", {
      apiVersion: "2025-08-27.basil",
    });

    const results = await Promise.all(
      items.map(async (it) => {
        if (!it.stripePriceId) {
          return { ...it, status: "missing_id", liveAmount: null, currency: null, active: null };
        }
        try {
          const price = await stripe.prices.retrieve(it.stripePriceId);
          const liveAmount = price.unit_amount ?? null;
          let status: "ok" | "mismatch" | "error" = "ok";
          if (it.expectedCents == null || liveAmount == null) status = "error";
          else if (liveAmount !== it.expectedCents) status = "mismatch";
          return {
            ...it,
            status,
            liveAmount,
            currency: price.currency,
            active: price.active,
          };
        } catch (e: any) {
          return {
            ...it,
            status: "not_found",
            liveAmount: null,
            currency: null,
            active: null,
            error: e?.message || "retrieve failed",
          };
        }
      })
    );

    return new Response(JSON.stringify({ results }), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("stripe-price-audit error:", e);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
