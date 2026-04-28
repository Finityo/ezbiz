// Verifies the email-assets bucket policy:
//   1. Objects under the `public/` prefix are readable anonymously.
//   2. Objects outside `public/` are NOT readable anonymously.
//   3. Listing the bucket as anon is blocked (no objects returned / error).
//
// Run with: deno test --allow-net --allow-env supabase/functions/_tests/email-assets-policy.test.ts
import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { assert, assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const SUPABASE_ANON_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")!;
const BUCKET = "email-assets";

const anon = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

async function anonCanRead(path: string): Promise<{ ok: boolean; status?: number; error?: string }> {
  // Hit the storage REST endpoint directly with the anon key so RLS applies.
  const url = `${SUPABASE_URL}/storage/v1/object/email-assets/${path}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      apikey: SUPABASE_ANON_KEY,
      Authorization: `Bearer ${SUPABASE_ANON_KEY}`,
    },
  });
  await res.body?.cancel();
  return { ok: res.ok, status: res.status };
}

Deno.test("email-assets: public/ prefix object is readable by anon (via SELECT policy)", async () => {
  const { ok, status } = await anonCanRead("public/logo.png");
  assert(ok, `Expected public/logo.png to be readable, got status ${status}`);
});

Deno.test("email-assets: object outside public/ is NOT readable by anon", async () => {
  const { status } = await anonCanRead("private/should-not-be-readable.png");
  assert(
    status === 400 || status === 403 || status === 404,
    `Expected non-public path to be blocked (400/403/404), got ${status}`,
  );
});

Deno.test("email-assets: anon cannot list bucket contents", async () => {
  // Listing the bucket root should return zero objects (or an error) for anon —
  // the SELECT policy is scoped to (storage.foldername(name))[1] = 'public',
  // so list() at the root should not enumerate arbitrary objects.
  const { data, error } = await anon.storage.from(BUCKET).list("", {
    limit: 100,
    offset: 0,
  });

  if (error) {
    // Listing rejected entirely — acceptable.
    assert(true);
    return;
  }

  // If listing succeeded, it must not reveal anything outside `public/`.
  const leaked = (data ?? []).filter((obj) => {
    // Folders show up as entries with id === null.
    const name = obj.name ?? "";
    return name !== "public" && name !== "";
  });

  assertEquals(
    leaked.length,
    0,
    `Anon listing leaked non-public entries: ${leaked.map((o) => o.name).join(", ")}`,
  );
});
