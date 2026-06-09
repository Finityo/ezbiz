# Webhook Fix Log — Stripe ↔ Supabase

## Date
2025-06-09

## Summary
Resolved a live-mode Stripe webhook failure by correcting the endpoint target, updating the signing secret, and verifying end-to-end delivery.

---

## 1. Original Issue
The Stripe webhook endpoint was pointed to the **wrong Supabase project host**, causing all live `checkout.session.completed` events to be rejected (HTTP 400 — signature mismatch against a non-existent/foreign endpoint).

## 2. Correct Endpoint (Stripe Dashboard)
Updated Stripe Dashboard → Webhooks → Endpoint URL to:

```
https://umzyxzhqlrykygjbeusu.supabase.co/functions/v1/stripe-webhook
```

## 3. Webhook Signing Secret Rotated / Updated
The old signing secret was stale/invalid for the corrected endpoint. A new `whsec_*` signing secret was generated in the Stripe Dashboard and pushed to the project secrets (`STRIPE_WEBHOOK_SECRET`).

## 4. Signing Secret Formatting Issue & Fix
The new secret contained **trailing whitespace / newline characters**, which Stripe's Deno SDK flagged as:

> "The provided signing secret contains whitespace. This often indicates an extra newline or space is in the value."

**Fix applied in `supabase/functions/stripe-webhook/index.ts`:**

```ts
const webhookSecret = (Deno.env.get("STRIPE_WEBHOOK_SECRET") ?? "").trim();
```

The `.trim()` ensures any accidental whitespace or newline is stripped before `constructEventAsync` is called.

## 5. Stripe Resend Test Result
Sent a test event (`checkout.session.completed`) from the Stripe Dashboard → **HTTP 200 OK** returned.

## 6. Supabase Logs Confirmation
Edge function logs confirmed:

- ✅ Signature verification passed.
- ✅ Event received and parsed correctly.

```
[stripe-webhook] event received { type: "checkout.session.completed", id: "evt_1TfQ2eIUysiSR1zwZn9ZTl0s" }
```

## 7. Idempotency Guard Verified
The matching order had already been marked `payment_complete` during an earlier fallback/manual update. The webhook's atomic guard:

```ts
.update({ status: "payment_complete", ... })
.eq("id", orderId)
.eq("status", "Pending Payment")
```

returned **zero affected rows**, so side effects (payments row insert, order event log, confirmation emails) were correctly **skipped**.

```
[stripe-webhook] order already processed — skipping side effects { orderId: "417ed26c-7309-4032-a70f-1d81ce6045c4" }
```

This confirms the idempotency mechanism is working as designed.

## 8. Final Status
- **Webhook fully live.**
- Stripe events are now correctly routed to the Supabase Edge Function.
- Signature verification is stable (trimmed secret + raw body passthrough).
- Duplicate events are safely de-duplicated by the `Pending Payment` → `payment_complete` atomic update guard.
