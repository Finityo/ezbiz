Deno.serve(() => {
  const keys = {
    URL: !!Deno.env.get('SUPABASE_URL'),
    ANON: Deno.env.get('SUPABASE_ANON_KEY')?.slice(0, 25),
    SRK: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')?.slice(0, 25),
    PUB: Deno.env.get('SUPABASE_PUBLISHABLE_KEY')?.slice(0, 25),
    SECRETS: Deno.env.get('SUPABASE_SECRET_KEYS')?.slice(0, 25),
  }
  return new Response(JSON.stringify(keys), { headers: { 'Content-Type': 'application/json' } })
})
