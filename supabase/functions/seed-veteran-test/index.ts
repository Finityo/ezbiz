// One-off admin tool: creates the veteran test customer + draft order.
// Invoke once, then this function can be deleted.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { corsHeaders } from "npm:@supabase/supabase-js@2/cors";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response("ok", { headers: corsHeaders });

  try {
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const email = "christian.r.t@outlook.com";
    const password = "VetTest!2026#EZ";

    // Find or create the user
    let userId: string | null = null;
    const { data: list } = await admin.auth.admin.listUsers({ page: 1, perPage: 200 });
    const existing = list?.users?.find((u) => (u.email ?? "").toLowerCase() === email);
    if (existing) {
      userId = existing.id;
      await admin.auth.admin.updateUserById(userId, { password, email_confirm: true });
    } else {
      const { data, error } = await admin.auth.admin.createUser({
        email,
        password,
        email_confirm: true,
        user_metadata: { first_name: "Christian", last_name: "T" },
      });
      if (error) throw error;
      userId = data.user!.id;
    }

    // Create business application
    const { data: app, error: appErr } = await admin
      .from("business_applications")
      .insert({
        user_id: userId,
        business_type: "LLC",
        business_name: "Patriot Holdings LLC",
        state: "Texas",
        status: "draft",
        application_data: {
          filingPath: "texas_veteran_waiver",
          veteran: true,
          package: "standard",
          entityType: "LLC",
        },
      })
      .select()
      .single();
    if (appErr) throw appErr;

    // Create draft order (stops BEFORE Stripe — no stripe_session_id, no payment row)
    const { data: order, error: orderErr } = await admin
      .from("orders")
      .insert({
        user_id: userId,
        email,
        package_id: "standard",
        package: "standard",
        entity_type: "LLC",
        state: "Texas",
        state_fee: 0,
        total_amount: 199,
        status: "draft",
        filing_speed: "standard",
        ein_service: false,
        application_id: app.id,
        filing_path: "texas_veteran_waiver",
        current_step: 5,
        source_path: "guided",
        add_ons: [],
      })
      .select()
      .single();
    if (orderErr) throw orderErr;

    await admin.from("contact_information").insert({
      order_id: order.id,
      first_name: "Christian",
      last_name: "T",
      email,
      phone: "555-555-0123",
    });
    await admin.from("business_information").insert({
      order_id: order.id,
      company_name: "Patriot Holdings LLC",
    });
    await admin.from("addresses").insert({
      order_id: order.id,
      address_type: "principal",
      line1: "123 Veteran Way",
      city: "Austin",
      state: "TX",
      postal_code: "78701",
      country: "US",
    });

    return new Response(
      JSON.stringify({
        success: true,
        userId,
        orderId: order.id,
        orderNumber: order.order_number,
        applicationId: app.id,
        email,
        tempPassword: password,
        stoppedBefore: "stripe_checkout",
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(JSON.stringify({ error: (e as Error).message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
