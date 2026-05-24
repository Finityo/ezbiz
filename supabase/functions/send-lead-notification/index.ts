// Sends a notification email to the EZ Biz inbox whenever a lead/contact form is submitted.
// Public endpoint (verify_jwt = false). Forwards to Lovable Emails via send-transactional-email.

import { createClient } from 'npm:@supabase/supabase-js@2'

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
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!
    const admin = createClient(supabaseUrl, serviceKey)

    const idempotencyKey = `lead-${body.source}-${body.email}-${Date.now()}`

    const { data, error } = await admin.functions.invoke('send-transactional-email', {
      body: {
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
      },
    })

    if (error) {
      console.error('send-transactional-email error:', error)
      return new Response(JSON.stringify({ error: 'send failed' }), {
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
