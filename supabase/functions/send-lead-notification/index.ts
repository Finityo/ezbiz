// Sends a notification email to the EZ Biz inbox whenever a lead/contact form is submitted.
// Public endpoint (verify_jwt = false). Forwards to Lovable Emails via send-transactional-email.



const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const NOTIFY_TO = 'info@ezbiz-fs.com'

interface LeadPayload {
  source: string
  name?: string | null
  email: string
  phone?: string | null
  business_type?: string | null
  message?: string | null
  page?: string | null
}

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') return new Response(null, { headers: corsHeaders })

  try {
    const body = (await req.json()) as LeadPayload
    if (!body?.email || !body?.source) {
      return new Response(JSON.stringify({ error: 'email and source required' }), {
        status: 400,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    const supabaseUrl = Deno.env.get('SUPABASE_URL')!
    // Forward the caller's Authorization header (frontend supabase client
    // sends a valid publishable JWT). Falls back to the apikey header.
    const incomingAuth =
      req.headers.get('Authorization') ||
      (req.headers.get('apikey') ? `Bearer ${req.headers.get('apikey')}` : '')

    const idempotencyKey = `lead-${body.source}-${body.email}-${Date.now()}`

    const res = await fetch(`${supabaseUrl}/functions/v1/send-transactional-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: incomingAuth,
        apikey: req.headers.get('apikey') || incomingAuth.replace(/^Bearer\s+/i, ''),
      },
      body: JSON.stringify({
        templateName: 'lead-notification',
        recipientEmail: NOTIFY_TO,
        idempotencyKey,
        templateData: {
          source: body.source,
          name: body.name ?? undefined,
          email: body.email,
          phone: body.phone ?? undefined,
          business_type: body.business_type ?? undefined,
          message: body.message ?? undefined,
          page: body.page ?? undefined,
        },
      }),
    })

    const data = await res.json().catch(() => ({}))
    if (!res.ok) {
      console.error('send-transactional-email error:', res.status, data)
      return new Response(JSON.stringify({ error: 'send failed', detail: data }), {
        status: 502,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      })
    }

    return new Response(JSON.stringify({ success: true, data }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  } catch (err) {
    console.error('send-lead-notification error:', err)
    return new Response(JSON.stringify({ error: 'internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    })
  }
})
