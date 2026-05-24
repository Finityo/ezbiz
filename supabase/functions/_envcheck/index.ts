Deno.serve(() => {
  const keys = {
    URL: !!Deno.env.get('SUPABASE_URL'),
    ANON: Deno.env.get('SUPABASE_ANON_KEY')?.slice(0, 20),
    SRK: Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')?.slice(0, 20),
    PUB: Deno.env.get('SUPABASE_PUBLISHABLE_KEY')?.slice(0, 20),
  }
  return new Response(JSON.stringify(keys), { headers: { 'Content-Type': 'application/json' } })
})
