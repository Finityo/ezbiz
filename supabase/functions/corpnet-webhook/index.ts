import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { logAndBuildErrorResponse, newRequestId } from "../_shared/error-logger.ts";

// Restrict CORS to known partner/admin origins for the webhook endpoint.
const ALLOWED_ORIGINS = new Set<string>([
  'https://www.ezbiz-fs.com',
  'https://ezbiz-fs.com',
  'https://ezbiz.lovable.app',
  'https://api.corpnet.com',
]);

function buildCorsHeaders(req: Request): Record<string, string> {
  const origin = req.headers.get('origin') || '';
  const allowOrigin = ALLOWED_ORIGINS.has(origin) ? origin : 'https://www.ezbiz-fs.com';
  return {
    'Access-Control-Allow-Origin': allowOrigin,
    'Access-Control-Allow-Headers':
      'authorization, x-client-info, apikey, content-type, x-corpnet-signature',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Vary': 'Origin',
  };
}

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

// Constant-time comparison to prevent timing attacks.
function timingSafeEqualHex(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let mismatch = 0;
  for (let i = 0; i < a.length; i++) {
    mismatch |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return mismatch === 0;
}

async function computeHmacSha256Hex(body: string, secret: string): Promise<string> {
  const encoder = new TextEncoder();
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", key, encoder.encode(body));
  return Array.from(new Uint8Array(sig))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

async function verifyWebhookSignature(
  body: string,
  signatureHeader: string | null,
  secret: string,
): Promise<boolean> {
  if (!signatureHeader || !secret) return false;
  // Accept either raw hex or "sha256=<hex>" formats.
  const provided = signatureHeader.startsWith("sha256=")
    ? signatureHeader.slice("sha256=".length)
    : signatureHeader;
  if (!/^[0-9a-f]+$/i.test(provided)) return false;
  const expected = await computeHmacSha256Hex(body, secret);
  return timingSafeEqualHex(provided.toLowerCase(), expected.toLowerCase());
}

serve(async (req) => {
  const corsHeaders = buildCorsHeaders(req);

  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  const requestId = newRequestId();
  try {
    if (req.method !== 'POST') {
      return new Response(JSON.stringify({ success: false, error: 'Method not allowed' }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 405,
      });
    }

    const body = await req.text();

    // Verify webhook signature (HMAC-SHA256, constant-time compare).
    const webhookSecret = Deno.env.get('CORPNET_WEBHOOK_SECRET');
    if (!webhookSecret) {
      console.error(JSON.stringify({ level: 'error', fn: 'corpnet-webhook', requestId, message: 'CORPNET_WEBHOOK_SECRET not configured' }));
      return new Response(JSON.stringify({ success: false, error: 'Webhook not configured', requestId }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500,
      });
    }

    const signature = req.headers.get('X-CorpNet-Signature') || req.headers.get('x-corpnet-signature');
    if (!signature) {
      console.warn(JSON.stringify({ level: 'warn', fn: 'corpnet-webhook', requestId, message: 'Missing signature header', origin: req.headers.get('origin') }));
      return new Response(JSON.stringify({ success: false, error: 'Missing signature', requestId }), {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 401,
      });
    }

    const isValid = await verifyWebhookSignature(body, signature, webhookSecret);
    if (!isValid) {
      console.warn(JSON.stringify({ level: 'warn', fn: 'corpnet-webhook', requestId, message: 'Invalid signature', origin: req.headers.get('origin') }));
      return new Response(JSON.stringify({ success: false, error: 'Invalid signature', requestId }), {
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
    return logAndBuildErrorResponse({
      functionName: 'corpnet-webhook',
      error,
      requestId,
      corsHeaders,
      fallbackStatus: 400,
      fallbackMessage: 'Webhook processing failed.',
      mappings: [
        { match: 'Missing or invalid orderId', status: 400, userMessage: 'Invalid payload.' },
        { match: 'Invalid status', status: 400, userMessage: 'Invalid payload.' },
        { match: 'Invalid orderId format', status: 400, userMessage: 'Invalid payload.' },
      ],
    });
  }
});
