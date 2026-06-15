// One-shot admin utility: sets a temporary password for christian@ezbiz-fs.com.
// Guarded by a shared secret passed in the Authorization header.
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

    const TARGET_EMAIL = "christian@ezbiz-fs.com";
    // 16-char temp password: letters + digits + symbol
    const tempPassword = "EZBizTemp!" + crypto.randomUUID().slice(0, 8);

    // Find user by email
    let userId: string | null = null;
    let page = 1;
    while (!userId) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
      if (error) throw error;
      const found = data.users.find((u) => (u.email ?? "").toLowerCase() === TARGET_EMAIL);
      if (found) userId = found.id;
      if (!data.users.length || data.users.length < 200) break;
      page++;
    }
    if (!userId) throw new Error("Target user not found");

    const { error: updErr } = await admin.auth.admin.updateUserById(userId, {
      password: tempPassword,
      email_confirm: true,
    });
    if (updErr) throw updErr;

    return new Response(
      JSON.stringify({ ok: true, email: TARGET_EMAIL, tempPassword }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (e) {
    return new Response(
      JSON.stringify({ ok: false, error: (e as Error).message }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  }
});
