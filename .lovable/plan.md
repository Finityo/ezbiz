
# Phase Five — Lead / Abandoned Checkout / Intake Capture

## 1. Audit findings (current state)

### Where data is captured today
| Trigger | Writes | Status set |
|---|---|---|
| `/start-order` button | `orders` (bare row, no enrichment) | `draft` |
| EnhancedOrderFlow `saveOrderToDb()` — runs **only on click-to-checkout** at Step 4/5 | `orders` + `business_information` + `contact_information` + `addresses` + `company_management` + `business_applications` | `pending_payment` |
| EnhancedOrderFlow waiver branch — runs when user submits waiver intake | same set | `waiver_documents_pending` |
| `create-checkout` edge fn (after Stripe session is created) | `order_events` insert | event `checkout_started` |
| `stripe-webhook` | `orders.status` | `payment_complete` |

### Where data is lost
1. **Steps 1–3 (State, Package, Add-ons, Business Details) write nothing to DB.** A user who picks Texas + LLC + Complete + EIN + RA and bounces at Step 3 leaves zero trace. All state lives in React `useState` only.
2. **Account creation (Step 4) writes nothing of its own.** A user who signs up but closes the tab leaves a `profiles` row with no business context.
3. **No `intake_started`, `lead_started`, `account_created`, or `checkout_abandoned` statuses exist.** Order status table currently holds only: `pending_payment`, `submitted_to_corpnet`.
4. **`pending_payment` is overloaded**: it means both "row just created, customer is on the Stripe page" and "row created hours/days ago, customer ghosted." No way to distinguish.
5. **No sweeper.** Nothing transitions stale `pending_payment` → `checkout_abandoned`.
6. **No admin Leads view.** `OrdersTab` only surfaces lifecycle statuses; abandoned/lead rows would appear but aren't filterable as such.
7. **No high-intent admin notification** for partial orders. `send-order-to-account-manager` only fires post-payment.
8. **One stray `business_applications.status = 'in-review'`** (legacy) — minor cleanup.

### What already works (do not break)
- Phase One waiver flow (`waiver_documents_pending` → `waiver_under_review` → `waiver_approved_payment_required`).
- Stripe `payment_complete` write path + webhook guards `.in(["pending_payment","Pending Payment"])`.
- Account-manager handoff (gated on `payment_complete`).
- Package entitlement filtering (`isAddonIncludedInPackage`).
- CSV/XLSX export.

## 2. Schema changes

Single migration. Adds columns + extends status vocabulary; no destructive ops.

```sql
-- orders: extend status vocabulary + lead tracking columns
ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS add_ons             jsonb,
  ADD COLUMN IF NOT EXISTS filing_path         text,        -- 'standard' | 'texas_veteran_waiver'
  ADD COLUMN IF NOT EXISTS current_step        smallint,    -- 1..5 wizard step reached
  ADD COLUMN IF NOT EXISTS source_path         text,        -- entry route
  ADD COLUMN IF NOT EXISTS last_activity_at    timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS abandoned_notified_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_orders_status_activity
  ON public.orders (status, last_activity_at DESC);

-- Normalize stray legacy row
UPDATE public.business_applications SET status = 'pending_payment' WHERE status = 'in-review';
```

No new tables. No FK changes. No RLS edits (existing user/admin policies cover the new columns).

### Status vocabulary (added to `orderStatusEngine.ORDER_STATUSES`)
```
draft → intake_started → pending_payment → payment_complete → in_processing → ...
                       ↘ checkout_abandoned
waiver_documents_pending → waiver_documents_submitted → waiver_under_review
  → waiver_needs_correction | waiver_approved_payment_required → payment_complete
```

`lead_started` and `account_created` are tracked as **`order_events.event_type`**, not as `orders.status` (no orders row exists yet for pre-account leads). The existing `email_list` table already handles pure pre-account leads.

## 3. Capture strategy — debounced autosave

Add a single client helper `useOrderDraft(user)` invoked from `EnhancedOrderFlow`:

- On Step 1 completion (`selectedState` set): if `user`, upsert an `orders` row with `status='intake_started'`, `current_step=1`, `source_path=document.referrer`. Cache `orderId` in state and `localStorage('active_order_id')`.
- On every step transition or 3s debounce after a field change: PATCH that row with current `filing_path`, `entity_type`, `package`, `state`, `state_fee`, `total_amount`, `add_ons` (jsonb of `{selectedAddOns, addonQuantities, includedAddOns}`), `current_step`, `last_activity_at = now()`.
- Anonymous users (Steps 1–3 with no account yet): write to `localStorage` only; on AccountStep success, flush the buffered draft to DB as a single `intake_started` insert. **No anon DB writes** (RLS requires `user_id`).
- `saveOrderToDb()` at checkout becomes **update-in-place** of the existing row (flip status `intake_started` → `pending_payment`) instead of insert. This eliminates the duplication risk the user called out.

For waiver path: same row, status flips to `waiver_documents_pending` on submission. No second insert.

## 4. Abandoned sweeper (edge function + cron)

New edge function `mark-abandoned-checkouts`:

```ts
// Mark stale pending_payment as checkout_abandoned (NEVER touches paid rows)
UPDATE orders SET status='checkout_abandoned', updated_at=now()
WHERE status IN ('pending_payment','intake_started')
  AND last_activity_at < now() - interval '2 hours'
  AND stripe_payment_intent IS NULL;  -- defense in depth
```

Schedule via pg_cron every 30 min (uses the documented `net.http_post` pattern). Webhook already excludes abandoned from its `.in([...])` guard — verified safe.

## 5. Admin visibility — `OrdersTab` extensions

Add filter chips:
- All leads (status in `intake_started`, `pending_payment`, `checkout_abandoned`)
- Intake started
- Pending payment
- Checkout abandoned
- Waiver document pending
- Waiver under review
- Paid orders (`payment_complete`)
- In processing
- Completed

Columns added to the row: **Last Activity**, **Est. Value** (already have `total_amount`), **Next Action** (computed: "Send follow-up", "Request waiver docs", "Approve waiver", "Send to AM").

No schema change required — all derivable from existing columns.

## 6. High-intent admin notification

New edge function `notify-high-intent-lead` invoked from client at these milestones (deduped by `orders.abandoned_notified_at`):
- `intake_started` row reaches Step 3 (Business Details complete)
- `pending_payment` reached but no webhook hit after 30 min (fired by sweeper, not client)
- Waiver documents uploaded
- Waiver `waiver_needs_correction` set

Sends a single internal email per order with name, email, business name, package, state, status, link to admin order detail. Idempotent via `abandoned_notified_at IS NULL` check.

## 7. Customer follow-up email **templates only** (no auto-send yet)

Add six React Email templates under `supabase/functions/_shared/transactional-email-templates/`:
- `lead-intake-incomplete.tsx`
- `lead-checkout-abandoned.tsx`
- `lead-waiver-docs-pending.tsx`
- `lead-waiver-approved-payment-pending.tsx`
- `lead-waiver-needs-correction.tsx`
- `lead-standard-checkout-abandoned.tsx`

Register in `registry.ts`. Add preview support via existing `preview-transactional-email` fn. **No cron, no auto-trigger** until you explicitly approve Phase Five.b.

## 8. Files to change

| File | Change |
|---|---|
| `supabase/migrations/<new>.sql` | columns + index + legacy normalize |
| `src/hooks/useOrderDraft.ts` | NEW — debounced upsert helper |
| `src/pages/EnhancedOrderFlow.tsx` | wire `useOrderDraft`; convert `saveOrderToDb` to update-in-place |
| `src/lib/orderStatusEngine.ts` | add `intake_started`, `checkout_abandoned` to `ORDER_STATUSES` |
| `src/components/admin/OrdersTab.tsx` | new filter chips, Last Activity / Next Action columns |
| `src/components/dashboard/OrderStatusCard.tsx` | display labels for new statuses |
| `src/pages/Dashboard.tsx` | STATUS_LABELS / STATUS_BADGE_CLASSES entries |
| `supabase/functions/mark-abandoned-checkouts/index.ts` | NEW sweeper |
| `supabase/functions/notify-high-intent-lead/index.ts` | NEW |
| `supabase/functions/_shared/transactional-email-templates/lead-*.tsx` | NEW (×6) + registry |
| `supabase/insert` SQL | pg_cron schedule for sweeper |

## 9. Patch priority

1. **P1 — schema + autosave + status engine** (capture first; no risk to paid flow).
2. **P1 — admin OrdersTab filters & Last Activity column** (visibility for newly captured rows).
3. **P2 — sweeper edge function + cron** (turn stale rows into actionable "abandoned").
4. **P2 — high-intent admin notification** (sales recovery).
5. **P3 — follow-up email templates** (copy ready, sending deferred).
6. **P3 — wire automated customer follow-ups** (future phase, opt-in only).

## 10. Data safety guarantees

- Single `orders` + single `business_applications` row per session, mutated in place — **no duplicates**.
- Sweeper filters `status IN ('pending_payment','intake_started')` and `stripe_payment_intent IS NULL` — **cannot touch paid rows**.
- Webhook `.in(["pending_payment","Pending Payment"])` guard unchanged — webhook still wins any race.
- Anonymous draft persistence is localStorage-only — **no RLS exposure**.
- Waiver lineage (`application_data.filingPath`, `waivedStateFee`, etc.) preserved verbatim.
- Email templates are inert until explicit Phase Five.b approval.

## 11. Rollback risk: Low

- Migration is additive only (new nullable columns, one UPDATE on a single legacy row).
- New edge functions are independent; deleting them is the rollback.
- Frontend autosave gated behind `if (user)` — failure modes degrade to current behavior.

---

**Awaiting approval to implement P1 (schema + autosave + status engine + admin OrdersTab filters).** P2 and P3 will follow as separate approved batches.
