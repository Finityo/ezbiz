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

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const anonKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const accountManagerEmail = Deno.env.get('ACCOUNT_MANAGER_EMAIL');

    if (!accountManagerEmail) {
      console.error('ACCOUNT_MANAGER_EMAIL is not configured');
      return new Response(JSON.stringify({ error: 'Service not configured' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const admin = createClient(supabaseUrl, serviceKey);

    // Auth: allow service-role caller (no JWT) OR admin user.
    const authHeader = req.headers.get('Authorization');
    let actor = 'system';
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
      }
    }

    const { order_id } = await req.json();
    if (!order_id || typeof order_id !== 'string') {
      return new Response(JSON.stringify({ error: 'order_id is required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    // Fetch order + related summary data
    const { data: order, error: orderErr } = await admin
      .from('orders')
      .select('*')
      .eq('id', order_id)
      .maybeSingle();

    if (orderErr || !order) {
      return new Response(JSON.stringify({ error: 'Order not found' }), {
        status: 404,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const [bizRes, contactRes] = await Promise.all([
      admin.from('business_information').select('company_name').eq('order_id', order_id).maybeSingle(),
      admin.from('contact_information').select('first_name,last_name,email').eq('order_id', order_id).maybeSingle(),
    ]);

    // Build CSV
    const csv = await buildOrderCsv(admin as any, [order_id]);
    const csvBytes = new TextEncoder().encode(csv);
    const objectPath = `account-manager-handoffs/${order_id}/${Date.now()}.csv`;

    const { error: uploadErr } = await admin
      .storage
      .from(BUCKET)
      .upload(objectPath, csvBytes, { contentType: 'text/csv', upsert: false });
    if (uploadErr) {
      console.error('CSV upload failed', uploadErr);
      throw new Error('Failed to upload CSV');
    }

    const { data: signed, error: signErr } = await admin
      .storage
      .from(BUCKET)
      .createSignedUrl(objectPath, SIGNED_URL_TTL_SECONDS);
    if (signErr || !signed?.signedUrl) {
      console.error('Signed URL creation failed', signErr);
      throw new Error('Failed to create download link');
    }

    // Send email via Lovable transactional pipeline (idempotent)
    const customerName = [contactRes.data?.first_name, contactRes.data?.last_name]
      .filter(Boolean).join(' ') || undefined;

    const { data: emailRes, error: emailErr } = await admin.functions.invoke(
      'send-transactional-email',
      {
        body: {
          templateName: 'account-manager-order-handoff',
          recipientEmail: accountManagerEmail,
          idempotencyKey: `handoff-${order_id}`,
          templateData: {
            orderId: order_id,
            customerName,
            customerEmail: contactRes.data?.email || order.email || undefined,
            businessName: bizRes.data?.company_name || undefined,
            entityType: order.entity_type || undefined,
            state: order.state || undefined,
            packageName: order.package || undefined,
            filingSpeed: order.filing_speed || 'standard',
            einService: !!order.ein_service,
            totalAmount: order.total_amount != null ? Number(order.total_amount) : undefined,
            csvDownloadUrl: signed.signedUrl,
            adminDetailUrl: `${SITE_URL}/admin?order=${order_id}`,
          },
        },
      }
    );

    if (emailErr) {
      console.error('send-transactional-email failed', emailErr);
      throw new Error('Failed to send email');
    }

    // Advance status only if currently "payment_complete" (don't regress later states)
    if (order.status === 'payment_complete') {
      await admin
        .from('orders')
        .update({ status: 'In Processing' })
        .eq('id', order_id)
        .eq('status', 'payment_complete');
    }

    // Audit log
    await admin.from('order_events').insert({
      order_id,
      event_type: 'sent_to_account_manager',
      actor,
      metadata: {
        recipient: accountManagerEmail,
        csv_path: objectPath,
        previous_status: order.status,
        new_status: order.status === 'payment_complete' ? 'In Processing' : order.status,
      },
    });

    return new Response(
      JSON.stringify({ ok: true, recipient: accountManagerEmail, csv_path: objectPath }),
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
