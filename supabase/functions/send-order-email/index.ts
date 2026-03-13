import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface EmailPayload {
  to: string;
  orderId: string;
  businessName: string;
  entityType: string;
  state: string;
  status: string;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: EmailPayload = await req.json();
    
    console.log('Sending order notification email:', {
      to: payload.to,
      orderId: payload.orderId,
      status: payload.status
    });

    // TODO: Integrate with email service (Resend, SendGrid, etc.)
    // For now, just log the email that would be sent
    let subject = `Order Update: ${payload.businessName}`;
    if (payload.status === "Paid" || payload.status === "payment_complete") {
      subject = "Your LLC Filing Has Been Received";
    }
    if (payload.status === "Submitted" || payload.status === "submitted") {
      subject = "Your LLC Filing Has Been Submitted";
    }
    if (payload.status === "filed") {
      subject = "Your LLC Is Officially Filed";
    }
    if (payload.status === "processing") {
      subject = "Your Formation Has Entered Processing";
    }
    if (payload.status === "completed") {
      subject = "Your Formation Is Complete — Documents Available";
    }

    const emailContent = {
      to: payload.to,
      subject,
      html: `
        <h2>Order Status Update</h2>
        <p>Your business formation order has been updated:</p>
        <ul>
          <li><strong>Business Name:</strong> ${payload.businessName}</li>
          <li><strong>Entity Type:</strong> ${payload.entityType}</li>
          <li><strong>State:</strong> ${payload.state}</li>
          <li><strong>Status:</strong> ${payload.status.toUpperCase()}</li>
          <li><strong>Order ID:</strong> ${payload.orderId}</li>
        </ul>
        <p>You can track your order status in your dashboard.</p>
      `
    };

    console.log('Email content:', emailContent);

    return new Response(
      JSON.stringify({
        success: true,
        message: 'Email notification logged (will be sent when email service is configured)'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 200,
      }
    );

  } catch (error) {
    console.error('Error processing email:', error);
    
    return new Response(
      JSON.stringify({
        success: false,
        error: 'Unable to send email notification. Please try again.'
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
