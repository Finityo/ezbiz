// Sends a notification email to the EZ Biz inbox whenever a lead/contact form is submitted.
// Public endpoint (verify_jwt = false). Forwards to Lovable Emails via send-transactional-email.



const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

const NOTIFY_TO = 'christian@ezbiz-fs.com'

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
    // Use the legacy JWT anon key — the new sb_publishable_* env value is
    // rejected by the gateway with UNAUTHORIZED_INVALID_JWT_FORMAT.
    const anonKey =
      'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtenl4emhxbHJ5a3lnamJldXN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5OTU3NjIsImV4cCI6MjA4NzU3MTc2Mn0.jfEDSfqhoPKns7fJWy4KzlvK1hde3xpfcaXg4mi4ihQ'

    const idempotencyKey = `lead-${body.source}-${body.email}-${Date.now()}`

    const res = await fetch(`${supabaseUrl}/functions/v1/send-transactional-email`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${anonKey}`,
        apikey: anonKey,
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
