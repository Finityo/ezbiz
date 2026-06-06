import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { buildOrderCsv } from "../_shared/build-order-csv.ts";

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
      });
      results.push(result);
    }

    const allOk = results.every((r) => r.ok || r.skipped);
    return new Response(
      JSON.stringify({ ok: allOk, recipient, results }),
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
}): Promise<HandoffResult> {
  const { admin, orderId, recipient, actor, isManual, triggeredBy } = opts;

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

    // Idempotency key changes for manual re-sends so admins can force redelivery
    const idempotencyKey = isManual
      ? `handoff-${orderId}-${Date.now()}`
      : `handoff-${orderId}`;

    const payload = {
      templateName: 'account-manager-order-handoff',
      recipientEmail: recipient,
      idempotencyKey,
      templateData: {
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
      },
    };

    // Use direct fetch (not supabase-js functions.invoke) so we can read the
    // actual error response body if the email function returns non-2xx.
    // The gateway (verify_jwt=true) requires a legacy-format JWT. The env
    // SUPABASE_ANON_KEY / SUPABASE_SERVICE_ROLE_KEY are now non-JWT secrets
    // (sb_publishable_* / sb_secret_*), so we use the legacy public anon JWT
    // which is safe to embed (already exposed to the browser).
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const LEGACY_ANON_JWT =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtenl4emhxbHJ5a3lnamJldXN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5OTU3NjIsImV4cCI6MjA4NzU3MTc2Mn0.jfEDSfqhoPKns7fJWy4KzlvK1hde3xpfcaXg4mi4ihQ';
    const emailResp = await fetch(`${supabaseUrl}/functions/v1/send-transactional-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${LEGACY_ANON_JWT}`,
        apikey: LEGACY_ANON_JWT,
      },
      body: JSON.stringify(payload),
    });
    const emailBodyText = await emailResp.text();
    if (!emailResp.ok) {
      console.error(
        `send-transactional-email ${emailResp.status} for order ${orderId}: ${emailBodyText}`,
      );
      throw new Error(
        `send-transactional-email ${emailResp.status}: ${emailBodyText.slice(0, 500)}`,
      );
    }
    let emailRes: any = null;
    try { emailRes = JSON.parse(emailBodyText); } catch { /* ignore */ }

    const messageId =
      (emailRes && typeof emailRes === 'object' && (emailRes as any).message_id) || null;

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
