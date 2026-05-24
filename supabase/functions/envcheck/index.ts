Deno.serve(() => {
  const k = Deno.env.get('SUPABASE_ANON_KEY') || ''
  return new Response(JSON.stringify({ k }), { headers: { 'Content-Type': 'application/json' } })
})
