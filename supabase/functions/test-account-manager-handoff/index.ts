// Admin-only: send a TEST account-manager handoff email to every recipient
// configured in ACCOUNT_MANAGER_EMAIL and return per-recipient delivery
// status. Does NOT touch any order rows, does NOT advance order status,
// and tags the subject with [TEST] so recipients can ignore it.

import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import * as React from "npm:react@18.3.1";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import { template as handoffTemplate } from "../_shared/transactional-email-templates/account-manager-order-handoff.tsx";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

const SITE_URL = "https://www.ezbiz-fs.com";
const DEFAULT_FROM =
  "EZ BIZ FILE SERVICE <notifications@updates.ezbiz-fs.com>";

type RecipientResult = {
  recipient: string;
  ok: boolean;
  message_id?: string;
  status?: number;
  error?: string;
};

function parseRecipients(raw: string): string[] {
  const seen = new Set<string>();
  const out: string[] = [];
  for (const part of raw.split(/[,;\s]+/)) {
    const t = part.trim();
    if (!t) continue;
    const k = t.toLowerCase();
    if (seen.has(k)) continue;
    seen.add(k);
    out.push(t);
  }
  return out;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const anonKey = Deno.env.get("SUPABASE_ANON_KEY")!;
    const recipientsRaw = Deno.env.get("ACCOUNT_MANAGER_EMAIL");
    const resendApiKey = Deno.env.get("RESEND_API_KEY");
    const lovableApiKey = Deno.env.get("LOVABLE_API_KEY");

    if (!recipientsRaw) {
      return new Response(
        JSON.stringify({ error: "ACCOUNT_MANAGER_EMAIL is not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }
    if (!resendApiKey || !lovableApiKey) {
      return new Response(
        JSON.stringify({ error: "Email gateway not configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Admin auth required
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const admin = createClient(supabaseUrl, serviceKey);
    const anon = createClient(supabaseUrl, anonKey);
    const { data: { user } } = await anon.auth.getUser(
      authHeader.replace("Bearer ", ""),
    );
    if (!user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const { data: role } = await admin
      .from("user_roles")
      .select("role")
      .eq("user_id", user.id)
      .eq("role", "admin")
      .maybeSingle();
    if (!role) {
      return new Response(JSON.stringify({ error: "Admin access required" }), {
        status: 403,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const recipients = parseRecipients(recipientsRaw);
    if (recipients.length === 0) {
      return new Response(
        JSON.stringify({ error: "No valid recipients configured" }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } },
      );
    }

    // Mock order data for the template
    const testOrderId = `TEST-${Date.now()}`;
    const templateData = {
      orderId: testOrderId,
      orderNumber: 99999,
      customerName: "Test Customer",
      customerEmail: "test@example.com",
      businessName: "Test Holdings LLC",
      entityType: "LLC",
      state: "TX",
      packageName: "Premium",
      filingSpeed: "standard",
      einService: true,
      totalAmount: 0,
      csvDownloadUrl: `${SITE_URL}/admin`,
      adminDetailUrl: `${SITE_URL}/admin`,
      deliveryMode: "link" as const,
    };

    const html = await renderAsync(
      React.createElement(handoffTemplate.component as any, templateData),
    );
    const baseSubject =
      typeof handoffTemplate.subject === "function"
        ? handoffTemplate.subject(templateData)
        : handoffTemplate.subject;
    const subject = `[TEST — please ignore] ${baseSubject}`;

    const fromAddress =
      Deno.env.get("ACCOUNT_MANAGER_RESEND_FROM") || DEFAULT_FROM;

    // Send individually so we can capture per-recipient delivery status
    const results: RecipientResult[] = [];
    for (const to of recipients) {
      try {
        const resp = await fetch(
          "https://connector-gateway.lovable.dev/resend/emails",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${lovableApiKey}`,
              "X-Connection-Api-Key": resendApiKey,
            },
            body: JSON.stringify({
              from: fromAddress,
              to: [to],
              reply_to: "info@ezbiz-fs.com",
              subject,
              html,
            }),
          },
        );
        const bodyText = await resp.text();
        let json: any = null;
        try { json = JSON.parse(bodyText); } catch { /* ignore */ }
        if (!resp.ok) {
          results.push({
            recipient: to,
            ok: false,
            status: resp.status,
            error: (json?.message || bodyText || "").slice(0, 300),
          });
        } else {
          const messageId = json?.id || null;
          results.push({
            recipient: to,
            ok: true,
            status: resp.status,
            message_id: messageId ?? undefined,
          });
          // Mirror to email_send_log for the delivery dashboard
          await admin.from("email_send_log").insert({
            message_id: messageId || crypto.randomUUID(),
            template_name: "account-manager-order-handoff-test",
            recipient_email: to,
            status: "sent",
          });
        }
      } catch (err) {
        results.push({
          recipient: to,
          ok: false,
          error: err instanceof Error ? err.message : "Unknown error",
        });
      }
    }

    const allOk = results.every((r) => r.ok);
    return new Response(
      JSON.stringify({
        ok: allOk,
        from: fromAddress,
        subject,
        recipients,
        results,
      }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } },
    );
  } catch (err) {
    console.error("test-account-manager-handoff error:", err);
    return new Response(JSON.stringify({ error: "Internal error" }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
