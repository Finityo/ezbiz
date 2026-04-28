import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { logAndBuildErrorResponse, newRequestId } from "../_shared/error-logger.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const requestId = newRequestId();
  let orderIdForLog: string | undefined;
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify admin auth
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

    const { order_id } = await req.json();
    if (!order_id) throw new Error('order_id is required');
    orderIdForLog = order_id;

    // Fetch all order data from normalized tables
    const [order, contact, bizInfo, address, agent, mgmt, participants, irs] = await Promise.all([
      supabaseClient.from('orders').select('*').eq('id', order_id).single(),
      supabaseClient.from('contact_information').select('*').eq('order_id', order_id).maybeSingle(),
      supabaseClient.from('business_information').select('*').eq('order_id', order_id).maybeSingle(),
      supabaseClient.from('addresses').select('*').eq('order_id', order_id).eq('type', 'business').maybeSingle(),
      supabaseClient.from('registered_agent').select('*').eq('order_id', order_id).maybeSingle(),
      supabaseClient.from('company_management').select('*').eq('order_id', order_id).maybeSingle(),
      supabaseClient.from('participants').select('*').eq('order_id', order_id),
      supabaseClient.from('irs_responsible_party').select('*').eq('order_id', order_id).maybeSingle(),
    ]);

    if (order.error) throw new Error(`Order not found: ${order.error.message}`);

    // Build CorpNet API payload
    const payload = {
      // Order meta
      orderId: order.data.id,
      entityType: order.data.entity_type,
      package: order.data.package,
      state: order.data.state,
      filingSpeed: order.data.filing_speed || 'standard',
      einService: order.data.ein_service || false,
      
      // Business info
      companyName: bizInfo.data?.company_name || '',
      alternateName: bizInfo.data?.alternate_company_name || '',
      businessDescription: bizInfo.data?.business_description || '',
      organizerType: bizInfo.data?.organizer_type || '',
      businessPurpose: bizInfo.data?.business_purpose || '',
      delayedFiling: bizInfo.data?.delayed_filing || false,

      // Contact
      contactFirstName: contact.data?.first_name || '',
      contactLastName: contact.data?.last_name || '',
      contactEmail: contact.data?.email || '',
      contactPhone: contact.data?.phone || '',

      // Business address
      businessAddress: {
        address1: address.data?.address1 || '',
        address2: address.data?.address2 || '',
        city: address.data?.city || '',
        state: address.data?.state || '',
        zip: address.data?.zip || '',
        country: address.data?.country || 'US',
      },

      // Registered agent
      registeredAgent: {
        type: agent.data?.agent_type || 'corpnet',
        name: agent.data?.name || '',
        address: agent.data?.address || '',
      },

      // Management
      managementType: mgmt.data?.management_type || 'member_managed',

      // Participants/Members
      participants: (participants.data || []).map((p: any) => ({
        firstName: p.first_name || '',
        lastName: p.last_name || '',
        role: p.role || '',
        title: p.title || '',
        ownershipPercent: p.ownership_percent,
        address: p.address || '',
        authorizedSigner: p.authorized_signer || false,
      })),

      // IRS responsible party
      irsResponsibleParty: irs.data ? {
        firstName: irs.data.first_name || '',
        lastName: irs.data.last_name || '',
        ssnEncrypted: irs.data.ssn_encrypted || '',
        phone: irs.data.phone || '',
        title: irs.data.title || '',
      } : null,

      submittedAt: new Date().toISOString(),
    };

    // TODO: When CorpNet API credentials are available:
    // const CORPNET_API_URL = Deno.env.get('CORPNET_API_URL');
    // const CORPNET_API_KEY = Deno.env.get('CORPNET_API_KEY');
    // const response = await fetch(CORPNET_API_URL, {
    //   method: 'POST',
    //   headers: {
    //     'Authorization': `Bearer ${CORPNET_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(payload),
    // });
    // const corpnetResult = await response.json();

    // For now, store the mapped payload and update status
    await supabaseClient
      .from('orders')
      .update({ status: 'submitted_to_corpnet', updated_at: new Date().toISOString() })
      .eq('id', order_id);

    console.log('CorpNet payload prepared for order:', order_id);

    return new Response(
      JSON.stringify({
        success: true,
        orderId: order_id,
        status: 'submitted_to_corpnet',
        payload,
        message: 'Order mapped and ready for CorpNet submission',
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    // Log full error details server-side only.
    console.error('Error in corpnet-api:', error);

    // Map known auth errors to specific status codes; everything else is generic.
    const raw = error instanceof Error ? error.message : '';
    let status = 500;
    let userMessage = 'Unable to process request. Please try again.';
    if (raw === 'No authorization header' || raw === 'Unauthorized') {
      status = 401;
      userMessage = 'Authentication required.';
    } else if (raw === 'Admin access required') {
      status = 403;
      userMessage = 'Admin access required.';
    } else if (raw === 'order_id is required') {
      status = 400;
      userMessage = 'Invalid request.';
    }

    return new Response(
      JSON.stringify({ success: false, error: userMessage }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status,
      }
    );
  }
});
