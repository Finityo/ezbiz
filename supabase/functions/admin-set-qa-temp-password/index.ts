// One-shot admin utility: resets a temporary password for QA test users only.
// Restricted to emails matching qa-*@ezbiz-fs.com to prevent touching real accounts.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const url = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const admin = createClient(url, serviceKey);

    const body = await req.json().catch(() => ({}));
    const targetEmail = String(body.email ?? "").toLowerCase().trim();

    // Hard guard: QA-only namespace, never christian or any other real user.
    if (!/^qa-[a-z0-9._-]+@ezbiz-fs\.com$/.test(targetEmail)) {
      return new Response(
        JSON.stringify({ ok: false, error: "Email must match qa-*@ezbiz-fs.com" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    const tempPassword = "EZBizQA!" + crypto.randomUUID().slice(0, 8) + "Vx";

    let userId: string | null = null;
    let page = 1;
    while (!userId) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
      if (error) throw error;
      const found = data.users.find((u) => (u.email ?? "").toLowerCase() === targetEmail);
      if (found) userId = found.id;
      if (!data.users.length || data.users.length < 200) break;
      page++;
    }
    if (!userId) throw new Error("Target QA user not found");

    const { error: updErr } = await admin.auth.admin.updateUserById(userId, {
      password: tempPassword,
      email_confirm: true,
    });
    if (updErr) throw updErr;

    return new Response(
      JSON.stringify({ ok: true, email: targetEmail, tempPassword }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, error: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
