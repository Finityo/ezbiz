## Side-by-side: G's spec vs what's already shipped

| # | G's requirement | Current state | Action |
|---|---|---|---|
| 1 | Stripe-paid trigger, fire once per order | Webhook calls `send-order-to-account-manager` after status set to "Paid"; idempotency via Lovable email queue key `handoff-<order_id>` | **Harden** with DB-level guard (see #8) |
| 2 | CSV with CorpNet fields | `_shared/build-order-csv.ts` already builds it from 8 tables | Keep — already shared with `export-order-csv` |
| 3 | Branded email `account-manager-order-handoff` w/ summary table + admin link + **CSV attachment** | Template exists w/ summary + admin link + **signed download link (not attachment)** | **Keep signed-link** — Lovable Email infra **does not support attachments** (hard platform limit). Will surface this clearly. |
| 4 | Edge function accepts **array of order_ids**, admin auth for manual, service-role for webhook | Function takes single `order_id`, dual-mode auth already in place | **Rename + extend** to accept `order_ids: string[]` (keep single for back-compat) |
| 5 | Bulk checkbox select + "Send to Account Manager" button + recipient override | Only single re-send button in `OrderDetailDialog` | **Add** checkbox column in `OrdersTab`, bulk action bar, optional recipient override input |
| 6 | Move `paid` → `in_processing` **only on success**, don't regress later states | Status guard exists (only advances from `payment_complete`) | Keep — already correct |
| 7 | Audit `sent_to_account_manager` success + `account_manager_handoff_failed` event | Only success event logged today | **Add** failure-path event with error_message + triggered_by |
| 8 | Idempotency columns on `orders`: `account_manager_sent_at`, `account_manager_sent_to`, `account_manager_email_status`, `account_manager_email_message_id` | Not present | **Migration** to add 4 nullable columns; auto-send checks `account_manager_sent_at IS NULL` |
| 9 | Config: `DEFAULT_ACCOUNT_MANAGER_EMAIL`, `ENABLE_AUTO_ACCOUNT_MANAGER_HANDOFF` | `ACCOUNT_MANAGER_EMAIL` secret exists; no auto-toggle | **Add** `ENABLE_AUTO_ACCOUNT_MANAGER_HANDOFF` secret (defaults to "true" if unset) |
| 10 | On failure: keep status `paid`, log, surface in admin | Currently advances status only after successful invoke | Keep, plus surface failure banner in `OrderDetailDialog` from new columns |
| 11 | Verification checklist | — | Run through after build |

## Hard constraint to surface to you

> **Lovable Email does not support file attachments.** Per the platform guide, the only supported workaround is exactly what's already in place: upload the CSV to Storage and embed a signed download link in the email. The account manager clicks "Download Order CSV" in the email to retrieve the file. If you need a true `.csv` attachment in the inbox, we'd need to switch this one flow to Resend's raw API — happy to do that as a follow-up if you want.

## Files to change (evolutionary, not rewrite)

**Migration (new)**
- Add 4 columns to `orders`: `account_manager_sent_at timestamptz`, `account_manager_sent_to text`, `account_manager_email_status text`, `account_manager_email_message_id text`

**Edge function (extend, don't rewrite)**
- `supabase/functions/send-order-to-account-manager/index.ts`
  - Accept `{ order_id }` **or** `{ order_ids: string[], recipient_override?: string }`
  - Loop per order; skip if `account_manager_sent_at` is set AND request is webhook-triggered (admin manual always allowed → fresh audit event)
  - On success: write the 4 new columns + insert `sent_to_account_manager` event
  - On failure: leave status alone, write `account_manager_email_status='failed'`, insert `account_manager_handoff_failed` event with error
  - Return `{ results: [{ order_id, ok, message_id?, error? }] }`

**Webhook**
- `supabase/functions/stripe-webhook/index.ts`: gate the auto-invoke on `Deno.env.get('ENABLE_AUTO_ACCOUNT_MANAGER_HANDOFF') !== 'false'` and skip if `account_manager_sent_at` already set

**Admin UI**
- `src/components/admin/OrdersTab.tsx`: add row-checkbox column, "Send to Account Manager" bulk button (disabled if any selected isn't paid), optional recipient override input in the action bar, success/error toasts
- `src/components/admin/OrderDetailDialog.tsx`: show "Last sent to {email} at {timestamp} — status: {status}" banner from new columns; keep existing single-order re-send button

**Secret**
- Add `ENABLE_AUTO_ACCOUNT_MANAGER_HANDOFF` (default behavior = enabled when unset)

## What I'm explicitly NOT touching
- Checkout flow / pricing / customer-facing order pages
- Existing webhook resolution logic for `orders.id`
- `export-order-csv` (already uses shared builder)
- Email template branding (already matches Slate Navy + Gold + Playfair/Inter)

## Open questions before I build

1. **Attachment vs signed link** — confirm you're OK keeping the signed-link approach (Lovable Email limitation), or do you want me to swap this one flow to Resend so it's a real `.csv` attachment in the inbox?
2. **Bulk send scope** — for the bulk button, should I cap at e.g. 25 orders per click to avoid timing out, or no cap?
3. **Recipient override** — admin-only and one-off (not persisted), correct? Default always goes back to the secret on the next send?
