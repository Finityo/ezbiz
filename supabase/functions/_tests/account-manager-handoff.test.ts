// Integration test for the account-manager handoff email flow.
//
// End-to-end verification:
//   1. POST to `send-order-to-account-manager` with an admin JWT and a real
//      order_id (admin re-send is idempotency-safe — a new audit event is logged).
//   2. Assert the function responds 200 with { ok: true, results: [{ ok: true, message_id }] }.
//   3. Assert a corresponding row appears in `email_send_log` with status='sent'.
//   4. Assert the `orders` row reflects account_manager_email_status='sent'.
//
// Required env vars (set in .env or shell):
//   VITE_SUPABASE_URL              — project URL
//   VITE_SUPABASE_PUBLISHABLE_KEY  — anon/publishable JWT
//   TEST_ADMIN_JWT                 — a valid access_token for an admin user
//   TEST_ORDER_ID                  — uuid of an existing paid order to re-send
//   TEST_RECIPIENT (optional)      — override recipient (default ct26nb@icloud.com)
//
// The test SKIPS (does not fail) when TEST_ADMIN_JWT or TEST_ORDER_ID are absent,
// so it stays safe to run in CI without a fixture.
//
// Run with:
//   deno test --allow-net --allow-env supabase/functions/_tests/account-manager-handoff.test.ts

import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assert, assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const ANON_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")!;
const ADMIN_JWT = Deno.env.get("TEST_ADMIN_JWT");
const ORDER_ID = Deno.env.get("TEST_ORDER_ID");
const RECIPIENT = Deno.env.get("TEST_RECIPIENT") ?? "ct26nb@icloud.com";

const skipReason = !ADMIN_JWT
  ? "TEST_ADMIN_JWT not set — skipping live handoff test"
  : !ORDER_ID
  ? "TEST_ORDER_ID not set — skipping live handoff test"
  : null;

Deno.test({
  name: "send-order-to-account-manager: end-to-end delivers to account manager",
  ignore: skipReason !== null,
  fn: async () => {
    if (skipReason) {
      console.log(skipReason);
      return;
    }

    // 1. Trigger handoff
    const handoffResp = await fetch(
      `${SUPABASE_URL}/functions/v1/send-order-to-account-manager`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: ANON_KEY,
          Authorization: `Bearer ${ADMIN_JWT}`,
        },
        body: JSON.stringify({
          order_id: ORDER_ID,
          recipient_override: RECIPIENT,
        }),
      },
    );
    const handoffBody = await handoffResp.json();
    assertEquals(
      handoffResp.status,
      200,
      `handoff failed: ${JSON.stringify(handoffBody)}`,
    );
    assertEquals(handoffBody.ok, true, `handoff body not ok: ${JSON.stringify(handoffBody)}`);
    assert(
      Array.isArray(handoffBody.results) && handoffBody.results.length === 1,
      "expected exactly one result row",
    );
    const result = handoffBody.results[0];
    assertEquals(result.ok, true, `result not ok: ${JSON.stringify(result)}`);
    assertEquals(result.recipient, RECIPIENT, "recipient mismatch");
    assert(result.csv_path, "csv_path missing — CSV upload likely failed");
    // message_id may be null if the email function did not echo it back, but
    // the email log row check below covers the actual delivery proof.

    // 2. Verify orders table reflects the send (admin can read via PostgREST)
    const orderResp = await fetch(
      `${SUPABASE_URL}/rest/v1/orders?id=eq.${ORDER_ID}&select=account_manager_email_status,account_manager_sent_to`,
      {
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${ADMIN_JWT}`,
        },
      },
    );
    const orderRows = await orderResp.json();
    assertEquals(orderResp.status, 200, `orders read failed: ${JSON.stringify(orderRows)}`);
    assert(Array.isArray(orderRows) && orderRows.length === 1, "order row not found");
    assertEquals(
      orderRows[0].account_manager_email_status,
      "sent",
      "account_manager_email_status not 'sent'",
    );
    assertEquals(orderRows[0].account_manager_sent_to, RECIPIENT, "sent_to mismatch");

    // 3. Verify email_send_log has a recent 'sent' entry for this recipient
    const since = new Date(Date.now() - 5 * 60 * 1000).toISOString();
    const logResp = await fetch(
      `${SUPABASE_URL}/rest/v1/email_send_log?recipient_email=eq.${encodeURIComponent(
        RECIPIENT,
      )}&template_name=eq.account-manager-order-handoff&created_at=gte.${since}&order=created_at.desc&limit=1`,
      {
        headers: {
          apikey: ANON_KEY,
          Authorization: `Bearer ${ADMIN_JWT}`,
        },
      },
    );
    const logRows = await logResp.json();
    assertEquals(logResp.status, 200, `email_send_log read failed: ${JSON.stringify(logRows)}`);
    assert(
      Array.isArray(logRows) && logRows.length === 1,
      `expected a recent email_send_log row for ${RECIPIENT}, got ${JSON.stringify(logRows)}`,
    );
    assertEquals(logRows[0].status, "sent", `email_send_log status not 'sent': ${logRows[0].status}`);
  },
});
