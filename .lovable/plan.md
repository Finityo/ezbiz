## Goal
When a customer pays, automatically send the order (with full CSV attached) to the account manager via Lovable Email, and move the order to "In Processing." Admins keep a manual "Re-send" button in the dashboard for any order.

## Architecture

```text
Customer pays
   │
   ▼
Stripe webhook (stripe-webhook)
   │  resolves orders.id, writes payment row, sets status "Paid"
   ▼
NEW: invoke send-order-to-account-manager(order_id)
   │
   ├─► Pulls order + all related tables (reuse export-order-csv internals)
   ├─► Builds CorpNet-format CSV (single row export)
   ├─► Renders branded template: account-manager-order-handoff
   ├─► send-transactional-email
   │      to: ACCOUNT_MANAGER_EMAIL (secret)
   │      attachment: order-<id>.csv
   ├─► Updates orders.status → "In Processing"
   └─► Logs order_events: { event_type: "sent_to_account_manager",
                            metadata: { recipient, message_id } }

Admin Dashboard (OrdersTab)
   └─► "Resend to Account Manager" button per order row
        → calls the same edge function
```

## What gets built

### 1. Secret
- Add `ACCOUNT_MANAGER_EMAIL` runtime secret (prompted via add_secret).

### 2. Shared CSV builder
- Extract the CSV row-building logic from `export-order-csv/index.ts` into `supabase/functions/_shared/build-order-csv.ts` so both the existing admin export AND the new handoff function use one source of truth (no drift, same CorpNet format).

### 3. New edge function: `send-order-to-account-manager`
- Input: `{ order_id: string }`
- Auth: `verify_jwt = true` for admin re-send path; webhook calls it server-side using service role.
- Steps:
  1. Fetch order + related tables (service role).
  2. Build CSV via shared helper.
  3. Invoke `send-transactional-email` with:
     - `templateName: "account-manager-order-handoff"`
     - `recipientEmail: ACCOUNT_MANAGER_EMAIL`
     - `idempotencyKey: handoff-<order_id>` (prevents dup sends on webhook retries)
     - `attachments: [{ filename: "order-<id>.csv", content: base64 }]`
     - `templateData`: order summary fields for the email body
  4. `UPDATE orders SET status = 'In Processing'` (only if currently "Paid" — don't overwrite later statuses).
  5. Insert `order_events` row.
- Returns `{ ok, message_id }`.

### 4. New email template: `account-manager-order-handoff`
- Add `supabase/functions/_shared/transactional-email-templates/account-manager-order-handoff.tsx`
- Register in `registry.ts`.
- Branded (Slate Navy + Gold, Playfair/Inter).
- Content: customer name, company, entity type, state, package, total, filing speed, EIN flag, link to `/admin/orders/<id>`, note that CSV is attached.

### 5. Wire into `stripe-webhook`
- After successful `checkout.session.completed` processing and order status set to "Paid", invoke the new function with `order_id`.
- Wrapped in try/catch — handoff failures must NOT fail the webhook (already covered by queue retries inside send-transactional-email).

### 6. Admin UI — manual re-send
- In `src/components/admin/OrdersTab.tsx` and/or `OrderDetailDialog.tsx`, add a "Send to Account Manager" button.
- Calls `supabase.functions.invoke('send-order-to-account-manager', { body: { order_id }})`.
- Toast on success, shows last-sent timestamp from `order_events`.

### 7. Audit visibility
- In `OrderDetailDialog`, show a small "Handoff history" panel reading `order_events` rows with `event_type = 'sent_to_account_manager'` (recipient + timestamp).

## Files touched
- **New**: `supabase/functions/send-order-to-account-manager/index.ts`
- **New**: `supabase/functions/_shared/build-order-csv.ts`
- **New**: `supabase/functions/_shared/transactional-email-templates/account-manager-order-handoff.tsx`
- **Edit**: `supabase/functions/_shared/transactional-email-templates/registry.ts`
- **Edit**: `supabase/functions/export-order-csv/index.ts` (use shared helper)
- **Edit**: `supabase/functions/stripe-webhook/index.ts` (trigger handoff)
- **Edit**: `supabase/config.toml` (register new function)
- **Edit**: `src/components/admin/OrdersTab.tsx` and `OrderDetailDialog.tsx` (re-send button + history)

## Safeguards
- **Idempotency**: `handoff-<order_id>` key prevents duplicate emails if Stripe retries the webhook.
- **Status guard**: only auto-advance "Paid" → "In Processing" (don't regress later states).
- **Suppression**: account manager email goes through Lovable queue → respects `suppressed_emails`.
- **Auditability**: every send recorded in both `email_send_log` and `order_events`.
- **No PII leakage**: SSN remains `ssn_encrypted` placeholder in CSV (matches current export behavior).

## Open follow-ups (not in this plan)
- Multi-manager routing by state/entity type
- Daily digest mode
- Slack mirror of the handoff
