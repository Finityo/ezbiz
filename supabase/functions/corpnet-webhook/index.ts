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

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // TODO: Add webhook signature verification when CorpNet provides it
    // const signature = req.headers.get('X-CorpNet-Signature');
    // if (!verifySignature(signature, body)) {
    //   throw new Error('Invalid webhook signature');
    // }

    const payload: CorpNetWebhookPayload = await req.json();

    console.log('Received CorpNet webhook:', {
      orderId: payload.orderId,
      status: payload.status
    });

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Update the business application status
    const { error: updateError } = await supabaseClient
      .from('business_applications')
      .update({
        status: payload.status,
        application_data: supabaseClient.rpc('jsonb_set', {
          target: 'application_data',
          path: '{corpnetOrderId}',
          new_value: JSON.stringify(payload.corpnetOrderId)
        }),
        updated_at: new Date().toISOString()
      })
      .eq('id', payload.orderId);

    if (updateError) {
      console.error('Error updating application:', updateError);
      throw updateError;
    }

    // TODO: Send email notification to user about status change
    // This can be done by calling another edge function or using Resend

    console.log('Application updated successfully:', payload.orderId);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Webhook processed successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error processing webhook:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: error.message
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
