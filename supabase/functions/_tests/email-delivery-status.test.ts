// End-to-end delivery-status test.
//
// Flow:
//   1. Trigger a real send via `send-order-to-account-manager` (which internally
//      calls `send-transactional-email`, which enqueues onto pgmq).
//   2. Poll `email_send_log` (the source-of-truth ledger that records provider
//      acknowledgements written back by the `process-email-queue` worker) for
//      the latest status of this message, deduplicated by `message_id`.
//   3. Assert final delivery state transitions from `pending` → `sent`.
//      If it lands in `dlq`, `failed`, `suppressed`, or stays `pending` past
//      the timeout, the test fails with the recorded `error_message` and
//      surfaces the full row for diagnosis.
//
// Provider correlation:
//   The Lovable email gateway is the upstream provider in this project. Its
//   acceptance / failure is what flips `email_send_log.status` from `pending`
//   to `sent` / `dlq` / `failed`. The `message_id` written into the log is
//   the same id passed to the gateway, so correlation is exact.
//
// Env vars:
//   VITE_SUPABASE_URL              — project URL
//   VITE_SUPABASE_PUBLISHABLE_KEY  — anon/publishable JWT
//   TEST_ADMIN_JWT                 — access_token for an admin user
//   TEST_ORDER_ID                  — uuid of an existing paid order
//   TEST_RECIPIENT (optional)      — recipient override (default ct26nb@icloud.com)
//   TEST_POLL_TIMEOUT_MS (optional, default 60000)
//   TEST_POLL_INTERVAL_MS (optional, default 2000)
//
// Run:
//   deno test --allow-net --allow-env supabase/functions/_tests/email-delivery-status.test.ts

import "https://deno.land/std@0.224.0/dotenv/load.ts";
import { assert, assertEquals } from "https://deno.land/std@0.224.0/assert/mod.ts";

const SUPABASE_URL = Deno.env.get("VITE_SUPABASE_URL")!;
const ANON_KEY = Deno.env.get("VITE_SUPABASE_PUBLISHABLE_KEY")!;
const ADMIN_JWT = Deno.env.get("TEST_ADMIN_JWT");
const ORDER_ID = Deno.env.get("TEST_ORDER_ID");
const RECIPIENT = Deno.env.get("TEST_RECIPIENT") ?? "ct26nb@icloud.com";
const POLL_TIMEOUT_MS = Number(Deno.env.get("TEST_POLL_TIMEOUT_MS") ?? 60_000);
const POLL_INTERVAL_MS = Number(Deno.env.get("TEST_POLL_INTERVAL_MS") ?? 2_000);

const TEMPLATE_NAME = "account-manager-order-handoff";

const skipReason = !ADMIN_JWT
  ? "TEST_ADMIN_JWT not set — skipping delivery-status test"
  : !ORDER_ID
  ? "TEST_ORDER_ID not set — skipping delivery-status test"
  : null;

type LogRow = {
  message_id: string | null;
  template_name: string;
  recipient_email: string;
  status: string;
  error_message: string | null;
  created_at: string;
};

async function fetchLatestLogRow(messageId: string): Promise<LogRow | null> {
  // Deduplicate by message_id: the latest row reflects the current provider
  // ack state (pending → sent / dlq / failed / suppressed).
  const url =
    `${SUPABASE_URL}/rest/v1/email_send_log` +
    `?message_id=eq.${encodeURIComponent(messageId)}` +
    `&order=created_at.desc&limit=1`;
  const res = await fetch(url, {
    headers: {
      apikey: ANON_KEY,
      Authorization: `Bearer ${ADMIN_JWT}`,
    },
  });
  if (!res.ok) {
    const body = await res.text();
    throw new Error(`email_send_log read failed (${res.status}): ${body}`);
  }
  const rows = (await res.json()) as LogRow[];
  return rows[0] ?? null;
}

async function fetchLatestByRecipient(
  recipient: string,
  template: string,
  since: string,
): Promise<LogRow | null> {
  // Fallback resolver when the trigger function did not surface a message_id.
  const url =
    `${SUPABASE_URL}/rest/v1/email_send_log` +
    `?recipient_email=eq.${encodeURIComponent(recipient)}` +
    `&template_name=eq.${encodeURIComponent(template)}` +
    `&created_at=gte.${encodeURIComponent(since)}` +
    `&order=created_at.desc&limit=1`;
  const res = await fetch(url, {
    headers: { apikey: ANON_KEY, Authorization: `Bearer ${ADMIN_JWT}` },
  });
  if (!res.ok) return null;
  const rows = (await res.json()) as LogRow[];
  return rows[0] ?? null;
}

Deno.test({
  name:
    "email delivery: provider ack lands in email_send_log as 'sent' (pending → sent)",
  ignore: skipReason !== null,
  fn: async () => {
    if (skipReason) {
      console.log(skipReason);
      return;
    }

    const triggeredAt = new Date(Date.now() - 5_000).toISOString();

    // 1. Trigger the send (admin re-send is allowed and produces a fresh
    //    idempotency key + message_id for clean per-test correlation).
    const triggerResp = await fetch(
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
    const triggerBody = await triggerResp.json();
    assertEquals(
      triggerResp.status,
      200,
      `trigger failed: ${JSON.stringify(triggerBody)}`,
    );
    assertEquals(triggerBody.ok, true, `trigger not ok: ${JSON.stringify(triggerBody)}`);
    const result = triggerBody.results?.[0];
    assert(result?.ok, `result not ok: ${JSON.stringify(result)}`);
    const messageIdFromTrigger: string | undefined = result.message_id;

    // 2. Resolve the message_id we will poll for. The handoff function does
    //    not always surface it, so fall back to recipient+template+recent.
    let messageId = messageIdFromTrigger ?? null;
    if (!messageId) {
      // Give the inner send a moment to write its first pending row.
      await new Promise((r) => setTimeout(r, 1_500));
      const seedRow = await fetchLatestByRecipient(
        RECIPIENT,
        TEMPLATE_NAME,
        triggeredAt,
      );
      messageId = seedRow?.message_id ?? null;
      assert(
        messageId,
        `could not resolve message_id from email_send_log after trigger`,
      );
    }

    // 3. Poll for terminal status — provider acceptance flips pending → sent.
    const deadline = Date.now() + POLL_TIMEOUT_MS;
    let lastRow: LogRow | null = null;
    let terminal: LogRow | null = null;

    while (Date.now() < deadline) {
      lastRow = await fetchLatestLogRow(messageId!);
      if (lastRow && lastRow.status !== "pending") {
        terminal = lastRow;
        break;
      }
      await new Promise((r) => setTimeout(r, POLL_INTERVAL_MS));
    }

    assert(
      terminal,
      `email_send_log never left 'pending' for message_id=${messageId} within ${POLL_TIMEOUT_MS}ms. Last row: ${JSON.stringify(lastRow)}`,
    );

    // Correlate: same message_id, same recipient, expected template.
    assertEquals(terminal.message_id, messageId, "message_id correlation drift");
    assertEquals(
      terminal.recipient_email,
      RECIPIENT,
      "recipient correlation drift",
    );
    assertEquals(
      terminal.template_name,
      TEMPLATE_NAME,
      "template correlation drift",
    );

    // Final delivery assertion.
    assertEquals(
      terminal.status,
      "sent",
      `provider did not accept the email — status=${terminal.status}, error=${terminal.error_message}, row=${JSON.stringify(terminal)}`,
    );

    console.log(
      `delivery OK · message_id=${messageId} · status=${terminal.status} · recipient=${RECIPIENT}`,
    );
  },
});
