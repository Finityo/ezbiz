import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import * as React from "npm:react@18.3.1";
import { renderAsync } from "npm:@react-email/components@0.0.22";
import { buildOrderCsv } from "../_shared/build-order-csv.ts";
import { template as handoffTemplate } from "../_shared/transactional-email-templates/account-manager-order-handoff.tsx";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

const SITE_URL = 'https://www.ezbiz-fs.com';
const BUCKET = 'order-documents';
const SIGNED_URL_TTL_SECONDS = 60 * 60 * 24 * 7; // 7 days
const MAX_BULK = 25;

type HandoffResult = {
  order_id: string;
  ok: boolean;
  message_id?: string;
  recipient?: string;
  csv_path?: string;
  skipped?: boolean;
  reason?: string;
  error?: string;
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const defaultRecipient = Deno.env.get('ACCOUNT_MANAGER_EMAIL');

    if (!defaultRecipient) {
      console.error('ACCOUNT_MANAGER_EMAIL is not configured');
      return new Response(JSON.stringify({ error: 'Service not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const admin = createClient(supabaseUrl, serviceKey);

    // Auth: allow service-role internal calls (no Authorization header) OR admin user JWT.
    const authHeader = req.headers.get('Authorization');
    let actor = 'system';
    let isManual = false;
    if (authHeader) {
      const anonClient = createClient(supabaseUrl, anonKey);
      const { data: { user } } = await anonClient.auth.getUser(
        authHeader.replace('Bearer ', '')
      );
      if (user) {
        const { data: role } = await admin
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();
        if (!role) {
          return new Response(JSON.stringify({ error: 'Admin access required' }), {
            status: 403,
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
          });
        }
        actor = `admin:${user.id}`;
        isManual = true;
      }
    }

    const body = await req.json().catch(() => ({}));
    // Back-compat: accept either { order_id } or { order_ids: [...] }
    let orderIds: string[] = [];
    if (Array.isArray(body?.order_ids)) {
      orderIds = body.order_ids.filter((v: unknown) => typeof v === 'string');
    } else if (typeof body?.order_id === 'string') {
      orderIds = [body.order_id];
    }
    const recipientOverride =
      isManual && typeof body?.recipient_override === 'string' && body.recipient_override.trim()
        ? body.recipient_override.trim()
        : null;
    // Admin-only test hook: force the handoff to fail synthetically so the
    // failure-handling branch (orders.account_manager_email_status='failed' +
    // order_events 'account_manager_handoff_failed') can be integration tested.
    const forceFailure =
      isManual && typeof body?.force_failure === 'string' && body.force_failure.trim()
        ? body.force_failure.trim().slice(0, 200)
        : null;

    // Delivery mode: 'attachment' (CSV file attached) or 'link' (signed
    // download link only). Defaults to env ACCOUNT_MANAGER_DELIVERY_MODE,
    // then 'attachment'.
    const envDefaultMode =
      (Deno.env.get('ACCOUNT_MANAGER_DELIVERY_MODE') || 'attachment').toLowerCase();
    const rawMode =
      typeof body?.delivery_mode === 'string' ? body.delivery_mode.toLowerCase() : envDefaultMode;
    const deliveryMode: 'attachment' | 'link' =
      rawMode === 'link' ? 'link' : 'attachment';

    if (orderIds.length === 0) {
      return new Response(JSON.stringify({ error: 'order_id or order_ids is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }
    if (orderIds.length > MAX_BULK) {
      return new Response(
        JSON.stringify({ error: `Too many orders (max ${MAX_BULK} per request)` }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
      );
    }

    const recipient = recipientOverride || defaultRecipient;
    const triggeredBy = isManual ? 'admin' : 'webhook';

    const results: HandoffResult[] = [];

      for (const orderId of orderIds) {
      const result = await processOne({
        admin,
        orderId,
        recipient,
        actor,
        isManual,
        triggeredBy,
        forceFailure,
        deliveryMode,
      });
      results.push(result);
    }

    const allOk = results.every((r) => r.ok || r.skipped);
    return new Response(
      JSON.stringify({ ok: allOk, recipient, delivery_mode: deliveryMode, results }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('send-order-to-account-manager error:', err);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

async function processOne(opts: {
  admin: ReturnType<typeof createClient>;
  orderId: string;
  recipient: string;
  actor: string;
  isManual: boolean;
  triggeredBy: 'admin' | 'webhook';
  forceFailure?: string | null;
}): Promise<HandoffResult> {
  const { admin, orderId, recipient, actor, isManual, triggeredBy, forceFailure } = opts;

  try {
    const { data: order, error: orderErr } = await admin
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .maybeSingle();

    if (orderErr || !order) {
      return { order_id: orderId, ok: false, error: 'Order not found' };
    }

    // Auto-trigger idempotency: webhook never re-sends a previously-sent order.
    // Admins (manual) can always re-send — a fresh audit event is created.
    if (!isManual && (order as any).account_manager_sent_at) {
      return {
        order_id: orderId,
        ok: true,
        skipped: true,
        reason: 'already_sent',
        recipient: (order as any).account_manager_sent_to ?? undefined,
      };
    }

    // Admin-only test hook: synthesize a failure here so the catch block runs
    // through the real failure-handling path (status + audit event).
    if (forceFailure) {
      throw new Error(`forced_failure: ${forceFailure}`);
    }


    const [bizRes, contactRes] = await Promise.all([
      admin
        .from('business_information')
        .select('company_name')
        .eq('order_id', orderId)
        .maybeSingle(),
      admin
        .from('contact_information')
        .select('first_name,last_name,email')
        .eq('order_id', orderId)
        .maybeSingle(),
    ]);

    // Build CSV
    const csv = await buildOrderCsv(admin as any, [orderId]);
    const csvBytes = new TextEncoder().encode(csv);
    const objectPath = `account-manager-handoffs/${orderId}/${Date.now()}.csv`;

    const { error: uploadErr } = await admin
      .storage
      .from(BUCKET)
      .upload(objectPath, csvBytes, { contentType: 'text/csv', upsert: false });
    if (uploadErr) {
      throw new Error(`Failed to upload CSV: ${uploadErr.message}`);
    }

    const { data: signed, error: signErr } = await admin
      .storage
      .from(BUCKET)
      .createSignedUrl(objectPath, SIGNED_URL_TTL_SECONDS);
    if (signErr || !signed?.signedUrl) {
      throw new Error('Failed to create download link');
    }

    const customerName = [contactRes.data?.first_name, contactRes.data?.last_name]
      .filter(Boolean)
      .join(' ') || undefined;

    const templateData = {
      orderId,
      customerName,
      customerEmail: contactRes.data?.email || (order as any).email || undefined,
      businessName: bizRes.data?.company_name || undefined,
      entityType: (order as any).entity_type || undefined,
      state: (order as any).state || undefined,
      packageName: (order as any).package || undefined,
      filingSpeed: (order as any).filing_speed || 'standard',
      einService: !!(order as any).ein_service,
      totalAmount:
        (order as any).total_amount != null ? Number((order as any).total_amount) : undefined,
      csvDownloadUrl: signed.signedUrl,
      adminDetailUrl: `${SITE_URL}/admin?order=${orderId}`,
    };

    // Render the email HTML + subject from the React Email template
    const html = await renderAsync(
      React.createElement(handoffTemplate.component as any, templateData),
    );
    const subject =
      typeof handoffTemplate.subject === 'function'
        ? handoffTemplate.subject(templateData)
        : handoffTemplate.subject;

    // Build CSV attachment (base64 for Resend)
    let csvBase64 = '';
    {
      let binary = '';
      const chunk = 0x8000;
      for (let i = 0; i < csvBytes.length; i += chunk) {
        binary += String.fromCharCode.apply(
          null,
          Array.from(csvBytes.subarray(i, i + chunk)) as any,
        );
      }
      csvBase64 = btoa(binary);
    }
    const safeName = (bizRes.data?.company_name || `order-${orderId.slice(0, 8)}`)
      .replace(/[^a-zA-Z0-9-_]/g, '_')
      .slice(0, 60);
    const csvFilename = `${safeName}-${orderId.slice(0, 8)}.csv`;

    // Send via Resend directly — Lovable's queue worker doesn't support
    // attachments, and we want the CSV delivered as a real file.
    const resendApiKey = Deno.env.get('RESEND_API_KEY');
    if (!resendApiKey) {
      throw new Error('RESEND_API_KEY is not configured');
    }

    const fromAddress = 'EZ BIZ FILE SERVICE <noreply@notify.ezbiz-fs.com>';
    const resendResp = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${resendApiKey}`,
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [recipient],
        reply_to: 'christian@ezbiz-fs.com',
        subject,
        html,
        attachments: [
          {
            filename: csvFilename,
            content: csvBase64,
            content_type: 'text/csv',
          },
        ],
      }),
    });

    const resendBody = await resendResp.text();
    if (!resendResp.ok) {
      console.error(`Resend ${resendResp.status} for order ${orderId}: ${resendBody}`);
      throw new Error(`Resend ${resendResp.status}: ${resendBody.slice(0, 500)}`);
    }
    let resendJson: any = null;
    try { resendJson = JSON.parse(resendBody); } catch { /* ignore */ }
    const messageId = resendJson?.id || null;

    // Mirror to email_send_log for the admin email-delivery view
    await admin.from('email_send_log').insert({
      message_id: messageId || crypto.randomUUID(),
      template_name: 'account-manager-order-handoff',
      recipient_email: recipient,
      status: 'sent',
    });

    // Advance status only if currently "payment_complete" (don't regress later states)
    const previousStatus = (order as any).status;
    let newStatus = previousStatus;
    if (previousStatus === 'payment_complete') {
      const { data: upd } = await admin
        .from('orders')
        .update({ status: 'In Processing' })
        .eq('id', orderId)
        .eq('status', 'payment_complete')
        .select('status')
        .maybeSingle();
      if (upd?.status) newStatus = upd.status;
    }

    // Persist idempotency / audit columns
    await admin
      .from('orders')
      .update({
        account_manager_sent_at: new Date().toISOString(),
        account_manager_sent_to: recipient,
        account_manager_email_status: 'sent',
        account_manager_email_message_id: messageId,
      })
      .eq('id', orderId);

    await admin.from('order_events').insert({
      order_id: orderId,
      event_type: 'sent_to_account_manager',
      actor,
      metadata: {
        recipient,
        csv_path: objectPath,
        csv_filename: `order-${orderId}.csv`,
        triggered_by: triggeredBy,
        email_message_id: messageId,
        previous_status: previousStatus,
        new_status: newStatus,
        sent_at: new Date().toISOString(),
      },
    });

    return {
      order_id: orderId,
      ok: true,
      message_id: messageId ?? undefined,
      recipient,
      csv_path: objectPath,
    };
  } catch (err) {
    const errorMessage = err instanceof Error ? err.message : 'Unknown error';
    console.error(`handoff failed for ${orderId}:`, err);

    // Persist failure status (do not touch order.status — keep at paid)
    await admin
      .from('orders')
      .update({
        account_manager_email_status: 'failed',
      })
      .eq('id', orderId);

    await admin.from('order_events').insert({
      order_id: orderId,
      event_type: 'account_manager_handoff_failed',
      actor,
      metadata: {
        recipient,
        triggered_by: triggeredBy,
        failed_at: new Date().toISOString(),
        error_message: errorMessage,
      },
    });

    return { order_id: orderId, ok: false, error: errorMessage };
  }
}
