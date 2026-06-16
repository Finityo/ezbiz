# Priority 2 — Normalize Order Status to snake_case

Plan only. No code changes yet.

## Target normalization

| Legacy value      | Canonical value    |
| ----------------- | ------------------ |
| `Pending Payment` | `pending_payment`  |
| `In Processing`   | `in_processing`    |
| `payment_complete`| `payment_complete` (already canonical, keep) |
| `paid` (rare/tooltip only) | map to `payment_complete` |
| `cancelled`       | `cancelled` (already canonical) |

`business_applications.status` (`waiver_*`, `draft`, etc.) is already snake_case — **out of scope**, no changes.

`order_events.event_type` history values (`payment_complete`, etc.) are already snake_case — leave historical rows untouched.

## Files to change

### Backend writes (source of truth — must change first)
1. **`supabase/functions/create-checkout/index.ts`** L288
   - `status: "Pending Payment"` → `status: "pending_payment"`
2. **`supabase/functions/stripe-webhook/index.ts`** L117, L123, L318
   - update payload stays `payment_complete` (no change)
   - guard `.eq("status", "Pending Payment")` → `.eq("status", "pending_payment")`
   - L318 rollback `update({ status: "Pending Payment" })` → `"pending_payment"`
3. **`supabase/functions/verify-payment/index.ts`** L74, L80
   - guard `.eq("status", "Pending Payment")` → `"pending_payment"`
4. **`supabase/functions/send-order-to-account-manager/index.ts`** L445, L448, L450
   - `update({ status: 'In Processing' })` → `'in_processing'`
   - `.eq('status', 'payment_complete')` unchanged
5. **`src/pages/EnhancedOrderFlow.tsx`** L327
   - draft insert `status: "Pending Payment"` → `"pending_payment"` (L387 already snake)

### Schema default
6. **New migration** — `ALTER TABLE public.orders ALTER COLUMN status SET DEFAULT 'pending_payment';`

### Admin UI
7. **`src/components/admin/OrdersTab.tsx`** L146-147, L380, L409, L549, L552, L558
   - status arrays: replace `'Pending Payment'` / `'In Processing'` with snake_case
   - filter count uses snake_case
   - `<SelectItem value="Pending Payment">` → `value="pending_payment"` (keep human label "Pending Payment" as display text)
   - fallback `order.status || 'Pending Payment'` → `|| 'pending_payment'`
   - `getStatusColor` add `in_processing` / `pending_payment` keys

### Customer UI / display consumers
8. **`src/components/dashboard/OrderStatusCard.tsx`** L109-119
   - Remove the mixed-case alias block (`"Pending Payment"`, `"In Processing"`) added in Priority 1 — no longer needed once data is migrated. **Keep as commented safety aliases for one release cycle** (see Aliases section).
9. **`src/components/dashboard/OrderTimeline.tsx`** L19
   - `"Pending Payment": "Awaiting Payment"` — keep alias for safety, optionally remove later.
10. **`src/pages/Dashboard.tsx`** L116, L130, L154, L161, L380
    - Remove `"Pending Payment"` alias keys from `STATUS_LABELS` / `STATUS_BADGE_CLASSES`
    - Remove the runtime `status === "Pending Payment" ? "pending_payment" : status` normalizations (no longer needed)

### Engine
11. **`src/lib/orderStatusEngine.ts`** — add `pending_payment` and `in_processing` to canonical `ORDER_STATUSES` ordering (currently missing per Phase Four audit).

### Email templates
12. **`supabase/functions/_shared/transactional-email-templates/order-status-update.tsx`** L25
    - Add `in_processing` key; `payment_complete` already present.
13. **`supabase/functions/_shared/transactional-email-templates/account-manager-order-handoff.tsx`** L113
    - Visible text "moved to **In Processing**" — leave as human copy (display only, no equality check).

### No change required
- `supabase/functions/send-order-email/index.ts` — keyed by `payment_complete` already.
- `src/lib/sendStatusEmail.ts` — already snake.
- `order_events` historical metadata — leave intact.
- RLS policies / DB functions — none compare status strings (verified by grep — no policy or `has_role`/SQL function references status values).

## One-shot data migration

```sql
-- Update existing orders
UPDATE public.orders
SET status = 'pending_payment', updated_at = now()
WHERE status = 'Pending Payment';

UPDATE public.orders
SET status = 'in_processing', updated_at = now()
WHERE status = 'In Processing';

-- Normalize legacy 'paid' if any exist
UPDATE public.orders
SET status = 'payment_complete', updated_at = now()
WHERE status = 'paid';

-- New default for the column
ALTER TABLE public.orders ALTER COLUMN status SET DEFAULT 'pending_payment';
```

Pre-flight read (run via `supabase--read_query` before migration) to confirm row counts:
```sql
SELECT status, count(*) FROM public.orders GROUP BY status ORDER BY 2 DESC;
```

`business_applications.status` and `order_events` — **no UPDATE**, audit-preserving.

## Aliases — keep or drop?

**Recommend: keep display-only aliases for one release; drop write paths immediately.**

- All **write paths** flip in one shot (no aliases — single source of truth).
- **Read/display aliases** (`OrderStatusCard`, `OrderTimeline`, `Dashboard` STATUS_LABELS) stay for one release to absorb:
  - Any in-flight Stripe webhook retries holding a stale `Pending Payment` row reference.
  - Cached browser sessions that loaded data mid-migration.
- Remove aliases in a follow-up cleanup PR after one week of production confirmation.

## Regression tests (manual smoke)

1. Start new order → confirm DB row inserts as `pending_payment`.
2. Complete Stripe checkout → webhook flips to `payment_complete` (guard matches snake_case).
3. verify-payment fallback (simulate webhook miss) → flips to `payment_complete`.
4. Trigger account-manager handoff → status advances to `in_processing`.
5. OrdersTab filter dropdown — each option returns expected rows.
6. Customer Dashboard + OrderStatusCard — no "Draft" fallback for any live order.
7. Run `SELECT status, count(*) FROM orders GROUP BY status` post-migration — zero legacy Title Case rows.
8. `tsc --noEmit` clean.

## Rollback risk

- **Low for code**: changes are string literals; revert via git.
- **Medium for data migration**: UPDATE is one-way but trivially reversible with the inverse UPDATE (`pending_payment` → `Pending Payment`, `in_processing` → `In Processing`) — include rollback SQL in PR description.
- **Webhook race window**: small risk during deploy that an in-flight webhook with old code writes Title Case after the data migration ran. Mitigation: deploy edge functions and frontend together; run data migration *after* edge functions deploy succeeds; aliases on read side absorb the rest.

## Deploy order

1. Deploy edge functions (write paths) with snake_case values.
2. Deploy frontend (admin filters + dashboard) with snake_case + read aliases.
3. Run data migration UPDATE + default change.
4. Verify smoke tests.
5. Schedule alias-cleanup PR for next release.

Awaiting approval to implement.
