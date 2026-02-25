import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface OrderSubmission {
  entityType: string;
  package: string;
  state: string;
  businessName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address?: string;
  city?: string;
  zipCode?: string;
  addOns: string[];
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const { data: { user }, error: authError } = await supabaseClient.auth.getUser(
      authHeader.replace('Bearer ', '')
    );

    if (authError || !user) {
      throw new Error('Unauthorized');
    }

    const orderData: OrderSubmission = await req.json();

    console.log('Processing order submission:', {
      user: user.id,
      entityType: orderData.entityType,
      state: orderData.state,
      businessName: orderData.businessName
    });

    // TODO: This will be replaced with actual CorpNet API integration
    // For now, we'll store it in our database with pending status
    
    const { data: application, error: dbError } = await supabaseClient
      .from('business_applications')
      .insert({
        user_id: user.id,
        business_name: orderData.businessName,
        business_type: orderData.entityType,
        state: orderData.state,
        status: 'pending',
        application_data: {
          package: orderData.package,
          addOns: orderData.addOns,
          contactInfo: {
            firstName: orderData.firstName,
            lastName: orderData.lastName,
            email: orderData.email,
            phone: orderData.phone,
            address: orderData.address,
            city: orderData.city,
            zipCode: orderData.zipCode
          },
          submittedAt: new Date().toISOString()
        }
      })
      .select()
      .single();

    if (dbError) {
      console.error('Database error:', dbError);
      throw dbError;
    }

    // TODO: When CorpNet API keys are available, add integration here:
    // 1. Transform data to CorpNet API format
    // 2. POST to CorpNet API endpoint
    // 3. Store CorpNet order ID
    // 4. Update status based on response

    console.log('Order stored successfully:', application.id);

    return new Response(
      JSON.stringify({
        success: true,
        orderId: application.id,
        status: 'pending',
        message: 'Order submitted successfully'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error processing order:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Unable to process your order. Please try again.'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
