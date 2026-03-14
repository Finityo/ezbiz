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

const STATUS_SUBJECTS: Record<string, string> = {
  processing: "Your Formation Has Entered Processing",
  submitted: "Your LLC Filing Has Been Submitted",
  filed: "Your LLC Is Officially Filed",
  completed: "Your Formation Is Complete — Documents Available",
  payment_complete: "Your LLC Filing Has Been Received",
  Paid: "Your LLC Filing Has Been Received",
  Submitted: "Your LLC Filing Has Been Submitted",
};

const buildEmailHtml = (payload: EmailPayload): string => `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f5;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f5;padding:40px 20px;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:8px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.1);">
          <tr>
            <td style="background-color:#1a365d;padding:24px 32px;">
              <h1 style="color:#ffffff;margin:0;font-size:20px;font-weight:600;">EZ Biz Filing</h1>
            </td>
          </tr>
          <tr>
            <td style="padding:32px;">
              <h2 style="color:#1a365d;margin:0 0 16px;font-size:22px;">Your EZ Biz Filing Update</h2>
              <p style="color:#4a5568;font-size:15px;line-height:1.6;margin:0 0 24px;">
                Your business formation order has been updated. Here are the details:
              </p>
              <table width="100%" cellpadding="12" cellspacing="0" style="background-color:#f7fafc;border-radius:6px;margin-bottom:24px;">
                <tr>
                  <td style="color:#718096;font-size:13px;border-bottom:1px solid #e2e8f0;">Business Name</td>
                  <td style="color:#1a202c;font-size:14px;font-weight:600;border-bottom:1px solid #e2e8f0;">${payload.businessName}</td>
                </tr>
                <tr>
                  <td style="color:#718096;font-size:13px;border-bottom:1px solid #e2e8f0;">Entity Type</td>
                  <td style="color:#1a202c;font-size:14px;font-weight:600;border-bottom:1px solid #e2e8f0;">${payload.entityType}</td>
                </tr>
                <tr>
                  <td style="color:#718096;font-size:13px;border-bottom:1px solid #e2e8f0;">State</td>
                  <td style="color:#1a202c;font-size:14px;font-weight:600;border-bottom:1px solid #e2e8f0;">${payload.state}</td>
                </tr>
                <tr>
                  <td style="color:#718096;font-size:13px;">Status</td>
                  <td style="color:#2b6cb0;font-size:14px;font-weight:700;text-transform:uppercase;">${payload.status}</td>
                </tr>
              </table>
              <a href="https://ezbizs.com/dashboard" style="display:inline-block;background-color:#2b6cb0;color:#ffffff;text-decoration:none;padding:12px 28px;border-radius:6px;font-size:14px;font-weight:600;">
                View Your Dashboard
              </a>
              <p style="color:#a0aec0;font-size:12px;margin-top:24px;">
                Order ID: ${payload.orderId}
              </p>
            </td>
          </tr>
          <tr>
            <td style="background-color:#f7fafc;padding:20px 32px;text-align:center;">
              <p style="color:#a0aec0;font-size:12px;margin:0;">
                © ${new Date().getFullYear()} EZ Biz Filing. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`;

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

    const subject = STATUS_SUBJECTS[payload.status] || `Order Update: ${payload.businessName}`;
    const html = buildEmailHtml(payload);

    const RESEND_API_KEY = Deno.env.get('RESEND_API_KEY');
    if (!RESEND_API_KEY) {
      console.error('RESEND_API_KEY not configured');
      return new Response(
        JSON.stringify({ success: false, error: 'Email service not configured' }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 500 }
      );
    }

    const resendRes = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: 'EZ Biz Filing <notifications@updates.ezbizs.com>',
        to: [payload.to],
        subject,
        html,
      }),
    });

    const resendData = await resendRes.json();

    if (!resendRes.ok) {
      console.error('Resend API error:', resendData);
      return new Response(
        JSON.stringify({ success: false, error: resendData }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
      );
    }

    console.log('Email sent successfully:', resendData);

    return new Response(
      JSON.stringify({ success: true, id: resendData.id }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 200 }
    );

  } catch (error) {
    console.error('Error processing email:', error);
    
    return new Response(
      JSON.stringify({ success: false, error: 'Unable to send email notification.' }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' }, status: 400 }
    );
  }
});
