import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CorpNetWebhookPayload {
  orderId: string;
  status: 'pending' | 'processing' | 'filed' | 'completed' | 'rejected';
  corpnetOrderId?: string;
  documents?: Array<{
    name: string;
    url: string;
  }>;
  message?: string;
  updatedAt: string;
}

const VALID_STATUSES = ['pending', 'processing', 'filed', 'completed', 'rejected'];

async function verifyWebhookSignature(body: string, signature: string | null, secret: string): Promise<boolean> {
  if (!signature || !secret) return false;
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  const expectedSig = Array.from(new Uint8Array(sig))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('');
  return signature === expectedSig;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.text();
    
    // Verify webhook signature
    const webhookSecret = Deno.env.get('CORPNET_WEBHOOK_SECRET');
    if (!webhookSecret) {
      console.error('CORPNET_WEBHOOK_SECRET not configured');
      return new Response(JSON.stringify({ success: false, error: 'Webhook not configured' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }
    const signature = req.headers.get('X-CorpNet-Signature');
    const isValid = await verifyWebhookSignature(body, signature, webhookSecret);
    if (!isValid) {
      console.error('Invalid webhook signature');
      return new Response(JSON.stringify({ success: false, error: 'Unauthorized' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    const payload: CorpNetWebhookPayload = JSON.parse(body);

    // Validate required fields
    if (!payload.orderId || typeof payload.orderId !== 'string') {
      throw new Error('Missing or invalid orderId');
    }
    if (!payload.status || !VALID_STATUSES.includes(payload.status)) {
      throw new Error(`Invalid status: ${payload.status}`);
    }

    // Validate orderId format (UUID)
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(payload.orderId)) {
      throw new Error('Invalid orderId format');
    }

    console.log('Received CorpNet webhook:', {
      orderId: payload.orderId,
      status: payload.status
    });

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Verify the order exists before updating
    const { data: existingOrder, error: fetchError } = await supabaseClient
      .from('business_applications')
      .select('id, status')
      .eq('id', payload.orderId)
      .single();

    if (fetchError || !existingOrder) {
      console.error('Order not found:', payload.orderId);
      return new Response(JSON.stringify({ success: false, error: 'Order not found' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 404,
      });
    }

    // Update the business application status
    const { error: updateError } = await supabaseClient
      .from('business_applications')
      .update({
        status: payload.status,
        updated_at: new Date().toISOString()
      })
      .eq('id', payload.orderId);

    if (updateError) {
      console.error('Error updating application:', updateError);
      throw updateError;
    }

    console.log('Application updated successfully:', payload.orderId);

    return new Response(
      JSON.stringify({ success: true, message: 'Webhook processed successfully' }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error processing webhook:', error);
    return new Response(
      JSON.stringify({ success: false, error: error.message }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
