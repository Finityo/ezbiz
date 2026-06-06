import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

/**
 * Admin-only: deletes orders + all related child rows. Used to reset to a
 * clean slate after testing. Requires:
 *  - Authenticated admin user
 *  - Body: { confirm: "WIPE", scope?: "all" | "test", ids?: string[] }
 *      scope=test => only orders whose email matches test patterns
 *      scope=all  => every order in the table
 *      ids        => explicit order id list (overrides scope)
 */
serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  const json = (status: number, body: unknown) =>
    new Response(JSON.stringify(body), {
      status,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });

  try {
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) return json(401, { error: "Unauthorized" });

    const anon = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? ""
    );
    const token = authHeader.replace("Bearer ", "");
    const { data: userData } = await anon.auth.getUser(token);
    const user = userData.user;
    if (!user) return json(401, { error: "Unauthorized" });

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
    if (!roleRow) return json(403, { error: "Forbidden" });

    const body = await req.json().catch(() => ({}));
    if (body?.confirm !== "WIPE") {
      return json(400, { error: "Missing confirmation. Pass { confirm: 'WIPE' }." });
    }

    const scope: "all" | "test" = body.scope === "all" ? "all" : "test";
    const explicitIds: string[] | undefined = Array.isArray(body.ids) ? body.ids : undefined;

    // Resolve target order ids
    let targetIds: string[] = [];
    if (explicitIds && explicitIds.length > 0) {
      targetIds = explicitIds;
    } else if (scope === "all") {
      const { data } = await admin.from("orders").select("id");
      targetIds = (data ?? []).map((r: { id: string }) => r.id);
    } else {
      // test scope: emails matching test patterns OR null email (drafts)
      const { data } = await admin
        .from("orders")
        .select("id,email")
        .or(
          "email.is.null,email.ilike.%test%,email.ilike.%ezbiz-fs.internal%,email.ilike.%example.com%,email.ilike.%+test%"
        );
      targetIds = (data ?? []).map((r: { id: string }) => r.id);
    }

    if (targetIds.length === 0) {
      return json(200, { ok: true, deleted: 0, orderIds: [], message: "No matching orders." });
    }

    const childTables = [
      "addresses",
      "business_information",
      "contact_information",
      "company_management",
      "participants",
      "irs_responsible_party",
      "registered_agent",
      "agreements",
      "payments",
      "documents",
      "order_events",
      "admin_notes",
    ];

    const childResults: Record<string, number | string> = {};
    for (const t of childTables) {
      const { error, count } = await admin
        .from(t)
        .delete({ count: "exact" })
        .in("order_id", targetIds);
      childResults[t] = error ? `error: ${error.message}` : count ?? 0;
    }

    const { error: orderErr, count: orderCount } = await admin
      .from("orders")
      .delete({ count: "exact" })
      .in("id", targetIds);
    if (orderErr) return json(500, { error: orderErr.message, childResults });

    return json(200, {
      ok: true,
      deleted: orderCount ?? targetIds.length,
      orderIds: targetIds,
      childResults,
      scope: explicitIds ? "ids" : scope,
    });
  } catch (e) {
    return json(500, { error: (e as Error).message });
  }
});
