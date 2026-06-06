// Integration test: forced failure path for the account-manager handoff.
//
// Uses the admin-only `force_failure` test hook on
// `send-order-to-account-manager` to trigger the catch branch deterministically,
// then verifies the failure side effects:
//
//   1. Function returns 200 with results[0].ok === false (per-order failure,
//      not a 5xx — the function is bulk-safe).
//   2. orders.account_manager_email_status === 'failed' for the test order.
//   3. orders.status is NOT regressed (the failure path explicitly avoids
//      touching order.status — it stays whatever it was before).
//   4. A row appears in order_events with event_type='account_manager_handoff_failed'
//      and metadata.error_message containing the forced reason.
//
// Env vars (same as the success test):
//   VITE_SUPABASE_URL, VITE_SUPABASE_PUBLISHABLE_KEY
//   TEST_ADMIN_JWT, TEST_ORDER_ID
//
// Run:
//   deno test --allow-net --allow-env supabase/functions/_tests/account-manager-handoff-failure.test.ts

import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assert, assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const ANON_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")!;
const ADMIN_JWT = Deno.env.get("TEST_ADMIN_JWT");
const ORDER_ID = Deno.env.get("TEST_ORDER_ID");

const FORCE_REASON = `integration-test-forced-${Date.now()}`;

const skipReason = !ADMIN_JWT
  ? "TEST_ADMIN_JWT not set — skipping forced-failure test"
  : !ORDER_ID
  ? "TEST_ORDER_ID not set — skipping forced-failure test"
  : null;

Deno.test({
  name:
    "send-order-to-account-manager: forced failure flips status to 'failed' and logs error event",
  ignore: skipReason !== null,
  fn: async () => {
    if (skipReason) {
      console.log(skipReason);
      return;
    }

    // Snapshot pre-trigger order.status so we can verify it does NOT regress.
    const preResp = await fetch(
      `${SUPABASE_URL}/rest/v1/orders?id=eq.${ORDER_ID}&select=status,account_manager_email_status`,
      { headers: { apikey: ANON_KEY, Authorization: `Bearer ${ADMIN_JWT}` } },
    );
    const preRows = await preResp.json();
    assert(Array.isArray(preRows) && preRows.length === 1, "test order not found");
    const prevStatus: string = preRows[0].status;
    const triggeredAt = new Date(Date.now() - 1_000).toISOString();

    // 1. Trigger with force_failure (admin-only hook)
    const resp = await fetch(
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
          force_failure: FORCE_REASON,
        }),
      },
    );
    const body = await resp.json();
    assertEquals(resp.status, 200, `unexpected status: ${JSON.stringify(body)}`);
    assert(Array.isArray(body.results) && body.results.length === 1, "missing result");
    const result = body.results[0];
    assertEquals(result.ok, false, `expected per-order failure, got: ${JSON.stringify(result)}`);
    assert(
      typeof result.error === "string" && result.error.includes("forced_failure"),
      `expected forced_failure error, got: ${result.error}`,
    );
    assertEquals(body.ok, false, "top-level ok should be false on failure");

    // 2. orders.account_manager_email_status === 'failed', and order.status preserved
    const postResp = await fetch(
      `${SUPABASE_URL}/rest/v1/orders?id=eq.${ORDER_ID}&select=status,account_manager_email_status`,
      { headers: { apikey: ANON_KEY, Authorization: `Bearer ${ADMIN_JWT}` } },
    );
    const postRows = await postResp.json();
    assertEquals(
      postRows[0].account_manager_email_status,
      "failed",
      `expected account_manager_email_status='failed', got '${postRows[0].account_manager_email_status}'`,
    );
    assertEquals(
      postRows[0].status,
      prevStatus,
      `order.status must not regress on failure: was '${prevStatus}', now '${postRows[0].status}'`,
    );

    // 3. order_events has a freshly logged failure with the forced reason in metadata
    const eventsResp = await fetch(
      `${SUPABASE_URL}/rest/v1/order_events` +
        `?order_id=eq.${ORDER_ID}` +
        `&event_type=eq.account_manager_handoff_failed` +
        `&created_at=gte.${encodeURIComponent(triggeredAt)}` +
        `&order=created_at.desc&limit=1`,
      { headers: { apikey: ANON_KEY, Authorization: `Bearer ${ADMIN_JWT}` } },
    );
    const events = await eventsResp.json();
    assertEquals(eventsResp.status, 200, `events read failed: ${JSON.stringify(events)}`);
    assert(
      Array.isArray(events) && events.length === 1,
      `expected one fresh failure event, got: ${JSON.stringify(events)}`,
    );
    const ev = events[0];
    assertEquals(ev.event_type, "account_manager_handoff_failed");
    const msg: string = ev.metadata?.error_message ?? "";
    assert(
      msg.includes(FORCE_REASON),
      `event metadata.error_message did not include forced reason. metadata=${JSON.stringify(ev.metadata)}`,
    );
    assertEquals(ev.metadata?.triggered_by, "admin");

    console.log(
      `forced failure verified · email_status=failed · event=${ev.id} · reason="${FORCE_REASON}"`,
    );
  },
});
