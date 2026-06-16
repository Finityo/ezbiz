import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { buildOrderCsv } from "../_shared/build-order-csv.ts";
import { buildOrderXlsx } from "../_shared/build-order-xlsx.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

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

    const { data: roleData } = await supabaseClient
      .from('user_roles')
      .select('role')
      .eq('user_id', user.id)
      .eq('role', 'admin')
      .maybeSingle();
    if (!roleData) throw new Error('Admin access required');

    const body = await req.json().catch(() => ({} as any));
    const order_id: string | undefined = body?.order_id;
    const rawFormat = typeof body?.format === 'string' ? body.format.toLowerCase() : 'csv';
    const format: 'csv' | 'xlsx' = rawFormat === 'xlsx' ? 'xlsx' : 'csv';

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

    const dateStr = new Date().toISOString().split('T')[0];

    if (format === 'xlsx') {
      const bytes = await buildOrderXlsx(supabaseClient as any, orderIds);
      return new Response(bytes, {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
          'Content-Disposition': `attachment; filename="corpnet-orders-${dateStr}.xlsx"`,
        },
        status: 200,
      });
    }

    const csvContent = await buildOrderCsv(supabaseClient as any, orderIds);
    return new Response(csvContent, {
      headers: {
        ...corsHeaders,
        'Content-Type': 'text/csv',
        'Content-Disposition': `attachment; filename="corpnet-orders-${dateStr}.csv"`,
      },
      status: 200,
    });

  } catch (error) {
    console.error('Error exporting orders:', error);
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(JSON.stringify({ error: message }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      status: 400,
    });
  }
});
