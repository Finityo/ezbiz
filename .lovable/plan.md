# Fix: account_manager_handoff_failed (Resend 401)

## Root cause
`supabase/functions/send-order-to-account-manager/index.ts` (line 343) calls `https://api.resend.com/emails` directly using `RESEND_API_KEY` as a Bearer token. But `RESEND_API_KEY` in this project is a **Lovable connector gateway connection key**, not a raw Resend API key. Resend's own API rejects it as invalid → `401 validation_error: API key is invalid`.

The earlier test email succeeded because it went through `https://connector-gateway.lovable.dev/resend/emails` with both `Authorization: Bearer LOVABLE_API_KEY` and `X-Connection-Api-Key: RESEND_API_KEY` headers — the correct gateway pattern.

## Change
In `supabase/functions/send-order-to-account-manager/index.ts`, attachment-mode send branch (~lines 319–350):

1. Read `LOVABLE_API_KEY` in addition to `RESEND_API_KEY`; throw if missing.
2. Change fetch URL from `https://api.resend.com/emails` → `https://connector-gateway.lovable.dev/resend/emails`.
3. Send both headers:
   - `Authorization: Bearer ${LOVABLE_API_KEY}`
   - `X-Connection-Api-Key: ${RESEND_API_KEY}`
4. Leave payload (from, to, reply_to, subject, html, CSV attachment), error handling, idempotency, status update, and event logging untouched.

## Deploy & verify
- Deploy `send-order-to-account-manager` edge function.
- Re-trigger "Send w/ CSV" on the failed order from the admin dashboard.
- Confirm `order_events` records `account_manager_handoff_sent` and the email lands in `christian@ezbiz-fs.com` with the CSV attached.

## Out of scope
No DB migrations, no other functions, no UI changes.
