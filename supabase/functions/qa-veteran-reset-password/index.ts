// QA-only: rotate the password for the existing QA veteran user WITHOUT
// deleting the user (which would cascade and destroy the live QA order +
// application records). Guarded by a shared secret. Delete after QA.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-qa-secret",
};

const QA_SECRET = "ezbiz-qa-veteran-0620-oneshot";
const QA_USER_ID = "e3d27b49-a38b-4f9c-bfff-471f5b793882";

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
    const tempPassword = "EZBizQA!" + crypto.randomUUID().slice(0, 8) + "Rx";
    const { error } = await admin.auth.admin.updateUserById(QA_USER_ID, {
      password: tempPassword,
      email_confirm: true,
    });
    if (error) throw error;
    return new Response(JSON.stringify({ ok: true, userId: QA_USER_ID, tempPassword }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    return new Response(JSON.stringify({ ok: false, error: (e as Error).message }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
