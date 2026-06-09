# Stripe Webhook Signing Secret Runbook

Internal runbook for rotating or repairing the Stripe webhook signing secret used by the `stripe-webhook` edge function.

---

## Endpoints

- **Correct live endpoint (current):**
  `https://umzyxzhqlrykygjbeusu.supabase.co/functions/v1/stripe-webhook`
- **Old / incorrect endpoint (do NOT use — wrong Supabase project host):**
  `https://abbasyiwzbtqeuewoxcf.supabase.co/functions/v1/stripe-webhook`

## Health check

You can verify the deployed function is reachable without firing a real Stripe event:

```
curl -i https://umzyxzhqlrykygjbeusu.supabase.co/functions/v1/stripe-webhook
```

Expected response:

```json
{ "ok": true, "service": "stripe-webhook", "status": "reachable" }
```

The health check responds to `GET`, `HEAD`, and `OPTIONS` only. It does **not** process orders, payments, emails, `order_events`, or dashboard updates, and it does **not** require a Stripe signature. Real Stripe webhook deliveries are `POST` and continue to require valid `stripe-signature` verification.

---

## 1. Locate the webhook in Stripe Dashboard

1. Sign in to the Stripe Dashboard (live mode).
2. Go to **Developers → Webhooks**.
3. Open the endpoint pointing to the correct URL above.

## 2. Rotate or reveal the signing secret

- To reveal: click **Signing secret → Click to reveal**.
- To rotate: click **Roll secret** (Stripe will issue a new `whsec_...` value). Note the rollover window if offered.

## 3. Update `STRIPE_WEBHOOK_SECRET` in Supabase

1. Open Supabase → Project Settings → Edge Functions → Secrets (or Lovable: Backend → Secrets).
2. Update `STRIPE_WEBHOOK_SECRET` with the new `whsec_...` value.
3. **Trim carefully** — remove any leading/trailing whitespace, hidden newlines, trailing characters, or accidental wrapping quotes (`"..."` or `'...'`). A single stray character causes signature verification to fail.

## 4. Redeploy / restart if needed

Lovable-managed edge functions pick up new secrets automatically on next invocation. If a stale instance lingers, redeploy the `stripe-webhook` function (or trigger any small change) to force a cold start.

## 5. Resend a Stripe webhook event

1. In Stripe Dashboard → **Developers → Webhooks → [endpoint] → Events**.
2. Pick a recent `checkout.session.completed` event.
3. Click **... → Resend**.

## 6. Expected result

- Stripe delivery shows **HTTP 200**.
- Supabase `stripe-webhook` logs show `event received` (signature verified).
- If the event was already processed, the **idempotency guard** skips duplicate side effects (no duplicate orders, emails, or `order_events`).

---

## Troubleshooting

| Symptom | Likely cause | Fix |
|---|---|---|
| Stripe shows delivery failed / no response | Wrong endpoint host — Stripe cannot reach the function | Update the endpoint URL to the correct Supabase project host (see top of this doc) |
| HTTP 400 `Invalid signature` | Wrong/stale `STRIPE_WEBHOOK_SECRET`, or whitespace / quotes in the secret value | Reveal or roll the secret in Stripe, update in Supabase, re-trim |
| Stripe keeps retrying | Function returned non-2xx, timed out, or crashed | Check edge function logs; resolve error; resend event |
| Duplicate processing concerns | Same event delivered twice | The idempotency guard in `stripe-webhook` skips already-processed orders — no action needed |
| Health check returns non-200 | Function not deployed / project paused | Redeploy `stripe-webhook`, check Lovable Cloud status |

## Security notes

- Never log or echo `STRIPE_SECRET_KEY`, `STRIPE_WEBHOOK_SECRET`, or any signing secret value.
- The health check intentionally returns no environment data.
- Only `@ezbiz-fs.com` admins should have access to rotate secrets.
