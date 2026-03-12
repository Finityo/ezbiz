import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "npm:@supabase/supabase-js@2.57.2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  const supabaseClient = createClient(
    Deno.env.get("SUPABASE_URL") ?? "",
    Deno.env.get("SUPABASE_ANON_KEY") ?? ""
  );

  try {
    // Authenticate user
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) throw new Error("Not authenticated");

    const token = authHeader.replace("Bearer ", "");
    const { data: userData, error: authError } = await supabaseClient.auth.getUser(token);
    if (authError || !userData.user) throw new Error("Not authenticated");

    const { ssn } = await req.json();
    if (!ssn || typeof ssn !== "string") throw new Error("SSN is required");

    // Validate SSN format
    const cleaned = ssn.replace(/\D/g, "");
    if (cleaned.length !== 9) throw new Error("Invalid SSN format");

    // Encrypt using Web Crypto API (AES-GCM)
    const encryptionKey = Deno.env.get("SSN_ENCRYPTION_KEY");
    if (!encryptionKey) throw new Error("Encryption key not configured");

    const keyData = new TextEncoder().encode(encryptionKey.padEnd(32, "0").slice(0, 32));
    const cryptoKey = await crypto.subtle.importKey(
      "raw",
      keyData,
      { name: "AES-GCM" },
      false,
      ["encrypt"]
    );

    const iv = crypto.getRandomValues(new Uint8Array(12));
    const encodedSsn = new TextEncoder().encode(cleaned);
    const encrypted = await crypto.subtle.encrypt(
      { name: "AES-GCM", iv },
      cryptoKey,
      encodedSsn
    );

    // Combine IV + ciphertext and base64 encode
    const combined = new Uint8Array(iv.length + new Uint8Array(encrypted).length);
    combined.set(iv);
    combined.set(new Uint8Array(encrypted), iv.length);

    const base64 = btoa(String.fromCharCode(...combined));

    return new Response(
      JSON.stringify({ encrypted: base64 }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
    );
  } catch (error: any) {
    console.error("Encryption error:", error);
    return new Response(
      JSON.stringify({ error: error.message || "Encryption failed" }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 500 }
    );
  }
});
