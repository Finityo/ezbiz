// QA-only utility: cleans up the bounced plus-address signup and provisions
// a confirmed veteran QA customer. Guarded by a one-shot secret. Delete this
// file after QA is complete.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-qa-secret",
};

const QA_SECRET = "ezbiz-qa-veteran-0620-oneshot";
const BOUNCED_USER_ID = "7742bc2f-dc01-4ea6-84c4-0881ad05ef66";
const BOUNCED_EMAIL = "christian+vetqa0619@ezbiz-fs.com";
const QA_EMAIL = "qa-veteran-test@ezbiz-fs.com";

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });
  if (req.headers.get("x-qa-secret") !== QA_SECRET) {
    return new Response(JSON.stringify({ ok: false, error: "forbidden" }), {
      status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }

  try {
    const admin = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    const result: any = {};

    // 1. Clean up bounced plus-address user
    try {
      const { error } = await admin.auth.admin.deleteUser(BOUNCED_USER_ID);
      result.deletedBounced = error ? `error: ${error.message}` : "ok";
    } catch (e) { result.deletedBounced = `error: ${(e as Error).message}`; }

    // 2. Remove suppressed_emails rows for the bounced address
    const { error: supErr, count: supCount } = await admin
      .from("suppressed_emails").delete({ count: "exact" }).eq("email", BOUNCED_EMAIL);
    result.suppressedRemoved = supErr ? `error: ${supErr.message}` : supCount;

    // 3. Create / refresh the QA veteran customer (confirmed, with password)
    const tempPassword = "EZBizQA!" + crypto.randomUUID().slice(0, 8) + "Vx";

    // If the QA user already exists from a prior run, delete first for a clean slate
    let existingId: string | null = null;
    let page = 1;
    while (true) {
      const { data, error } = await admin.auth.admin.listUsers({ page, perPage: 200 });
      if (error) throw error;
      const f = data.users.find((u) => (u.email ?? "").toLowerCase() === QA_EMAIL);
      if (f) { existingId = f.id; break; }
      if (!data.users.length || data.users.length < 200) break;
      page++;
    }
    if (existingId) {
      await admin.auth.admin.deleteUser(existingId);
      result.deletedExistingQa = existingId;
    }

    const { data: created, error: createErr } = await admin.auth.admin.createUser({
      email: QA_EMAIL,
      password: tempPassword,
      email_confirm: true,
      user_metadata: {
        first_name: "EZ Biz",
        last_name: "Veteran QA Test",
        customer_segment: "veteran",
        qa_test_record: true,
      },
    });
    if (createErr) throw createErr;
    result.qaUserId = created.user?.id;
    result.qaEmail = QA_EMAIL;
    result.tempPassword = tempPassword;

    return new Response(JSON.stringify({ ok: true, ...result }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
