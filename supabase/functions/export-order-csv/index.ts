import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

function escapeCSV(value: string | null | undefined): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify admin via auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) throw new Error('No authorization header');

    const anonClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );
    const { data: { user }, error: authError } = await anonClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );
    if (authError || !user) throw new Error('Unauthorized');

    // Check admin role
    const { data: roleData } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();

    if (!roleData) throw new Error('Admin access required');

    const { order_id } = await req.json();

    // Fetch single order or all orders
    let orderIds: string[] = [];
    if (order_id) {
      orderIds = [order_id];
    } else {
      const { data: allOrders } = await supabaseClient
        .from('orders')
        .select('id')
        .order('created_at', { ascending: false });
      orderIds = (allOrders || []).map((o: any) => o.id);
    }

    if (orderIds.length === 0) {
      return new Response(JSON.stringify({ error: 'No orders found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    // Fetch all related data
    const [orders, contacts, bizInfo, addresses, agents, mgmt, participants, irsParties] = await Promise.all([
      supabaseClient.from('orders').select('*').in('id', orderIds),
      supabaseClient.from('contact_information').select('*').in('order_id', orderIds),
      supabaseClient.from('business_information').select('*').in('order_id', orderIds),
      supabaseClient.from('addresses').select('*').in('order_id', orderIds).eq('type', 'business'),
      supabaseClient.from('registered_agent').select('*').in('order_id', orderIds),
      supabaseClient.from('company_management').select('*').in('order_id', orderIds),
      supabaseClient.from('participants').select('*').in('order_id', orderIds),
      supabaseClient.from('irs_responsible_party').select('*').in('order_id', orderIds),
    ]);

    // Build lookup maps
    const contactMap = new Map((contacts.data || []).map((c: any) => [c.order_id, c]));
    const bizMap = new Map((bizInfo.data || []).map((b: any) => [b.order_id, b]));
    const addressMap = new Map((addresses.data || []).map((a: any) => [a.order_id, a]));
    const agentMap = new Map((agents.data || []).map((a: any) => [a.order_id, a]));
    const mgmtMap = new Map((mgmt.data || []).map((m: any) => [m.order_id, m]));
    const participantMap = new Map<string, any[]>();
    (participants.data || []).forEach((p: any) => {
      if (!participantMap.has(p.order_id)) participantMap.set(p.order_id, []);
      participantMap.get(p.order_id)!.push(p);
    });
    const irsMap = new Map((irsParties.data || []).map((i: any) => [i.order_id, i]));

    // CSV headers matching CorpNet format
    const headers = [
      'order_id', 'submission_date', 'status', 'entity_type', 'package', 'state',
      'filing_speed', 'ein_service',
      'company_name', 'alternate_name', 'business_description', 'organizer_type', 'business_purpose',
      'contact_first_name', 'contact_last_name', 'contact_email', 'contact_phone',
      'business_address', 'business_city', 'business_state', 'business_zip',
      'registered_agent_type', 'registered_agent_name', 'registered_agent_address',
      'management_type',
      'participant_name', 'participant_role', 'participant_title', 'ownership_percent',
      'irs_first_name', 'irs_last_name', 'irs_ssn_masked', 'irs_phone', 'irs_title',
      'created_at',
    ];

    const rows: string[][] = [];

    for (const order of (orders.data || [])) {
      const contact = contactMap.get(order.id) || {};
      const biz = bizMap.get(order.id) || {};
      const addr = addressMap.get(order.id) || {};
      const agent = agentMap.get(order.id) || {};
      const management = mgmtMap.get(order.id) || {};
      const orderParticipants = participantMap.get(order.id) || [];
      const irs = irsMap.get(order.id) || {};

      // If multiple participants, create a row per participant
      const participantRows = orderParticipants.length > 0 ? orderParticipants : [{}];

      for (const p of participantRows) {
        rows.push([
          order.id,
          new Date().toISOString(),
          order.status || '',
          order.entity_type || '',
          order.package || '',
          order.state || '',
          order.filing_speed || 'standard',
          order.ein_service ? 'Yes' : 'No',
          biz.company_name || '',
          biz.alternate_company_name || '',
          biz.business_description || '',
          biz.organizer_type || '',
          biz.business_purpose || '',
          contact.first_name || '',
          contact.last_name || '',
          contact.email || '',
          contact.phone || '',
          addr.address1 || '',
          addr.city || '',
          addr.state || '',
          addr.zip || '',
          agent.agent_type || '',
          agent.name || '',
          agent.address || '',
          management.management_type || '',
          `${p.first_name || ''} ${p.last_name || ''}`.trim(),
          p.role || '',
          p.title || '',
          p.ownership_percent != null ? String(p.ownership_percent) : '',
          irs.first_name || '',
          irs.last_name || '',
          irs.ssn_encrypted ? '***ENCRYPTED***' : '',
          irs.phone || '',
          irs.title || '',
          order.created_at || '',
        ]);
      }
    }

    const csvContent = [
      headers.map(escapeCSV).join(','),
      ...rows.map(row => row.map(escapeCSV).join(',')),
    ].join('\n');

    return new Response(csvContent, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="corpnet-orders-${new Date().toISOString().split('T')[0]}.csv"`,
      },
      status: 200,
    });

  } catch (error) {
    console.error('Error exporting CSV:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
