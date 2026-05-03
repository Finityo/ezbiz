// Sends a notification email to the EZ Biz inbox whenever a lead/contact form is submitted.
// Public endpoint (verify_jwt = false). No PII beyond what the visitor entered themselves.

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const NOTIFY_TO = "christian@ezbiz-fs.com";
const FROM = "EZ Biz Leads <notifications@updates.ezbiz-fs.com>";

interface LeadPayload {
  source: string;
  name?: string | null;
  email: string;
  phone?: string | null;
  business_type?: string | null;
  message?: string | null;
  page?: string | null;
}

function escape(s: string): string {
  return s.replace(/[&<>"']/g, (c) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  }[c]!));
}

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
    if (!RESEND_API_KEY) throw new Error("RESEND_API_KEY missing");

    const body = (await req.json()) as LeadPayload;
    if (!body?.email || !body?.source) {
      return new Response(JSON.stringify({ error: "email and source required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const rows: Array<[string, string]> = [
      ["Source", body.source],
      ["Name", body.name || "—"],
      ["Email", body.email],
      ["Phone", body.phone || "—"],
      ["Business Type", body.business_type || "—"],
      ["Page", body.page || "—"],
    ];
    if (body.message) rows.push(["Message", body.message]);

    const html = `
      <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;padding:24px;background:#FAF9F6;color:#1f2937">
        <h2 style="font-family:'Playfair Display',Georgia,serif;color:#1f2a44;margin:0 0 16px">New Lead — EZ Biz</h2>
        <table style="width:100%;border-collapse:collapse;background:#fff;border:1px solid #e5e7eb;border-radius:8px;overflow:hidden">
          ${rows.map(([k, v]) => `
            <tr>
              <td style="padding:10px 14px;font-weight:600;background:#f9fafb;width:140px;border-bottom:1px solid #e5e7eb">${escape(k)}</td>
              <td style="padding:10px 14px;border-bottom:1px solid #e5e7eb">${escape(String(v))}</td>
            </tr>`).join("")}
        </table>
        <p style="font-size:12px;color:#6b7280;margin-top:16px">Reply directly to this email to respond to the lead.</p>
      </div>`;

    const r = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM,
        to: [NOTIFY_TO],
        reply_to: body.email,
        subject: `New ${body.source} lead — ${body.name || body.email}`,
        html,
      }),
    });

    const data = await r.json();
    if (!r.ok) {
      console.error("Resend error:", data);
      return new Response(JSON.stringify({ error: "send failed" }), {
        status: 502,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    return new Response(JSON.stringify({ success: true, id: data.id }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (err) {
    console.error("send-lead-notification error:", err);
    return new Response(JSON.stringify({ error: "internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
