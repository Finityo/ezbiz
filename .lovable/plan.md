# Unified Draft-Order Refactor

Goal: one persistent `orders` draft row that every surface (Pricing → Order Flow → Auth gate → Customer Dashboard → Admin Dashboard) reads from and writes to. No more parallel localStorage/URL-only state.

## 1. Data model (single source of truth)

Extend `public.orders` (migration) — additive only, no destructive changes:

- `selected_addons jsonb default '[]'::jsonb`
- `selected_state text` (mirrors `state` but explicitly the customer-selected pricing-page state)
- `source_route text`
- `veteran_eligible boolean default false`
- `veteran_waiver_applied boolean default false`
- `veteran_waiver_amount integer default 0` (cents-agnostic dollar value: 300)
- `vvl_pdf_downloaded boolean default false`
- `vvl_pdf_downloaded_at timestamptz`
- `email_confirmed_at timestamptz`
- `business_info_saved_at timestamptz`
- `needs_attention boolean default false`
- `attention_reason text`

Keep existing columns (`status`, `current_step`, `package`, `entity_type`, `state`, `state_fee`, `total_amount`, `add_ons`, etc.). `add_ons` stays for legacy reads; new writes go to `selected_addons`.

Extend `order_events.event_type` allowed values (it's already free-text). New events list (sec. 6 of request) becomes the canonical taxonomy — documented in `src/lib/orderEvents.ts`.

No RLS changes needed (existing customer/admin policies already cover these columns). Re-confirm `GRANT`s already in place.

## 2. New shared module: `src/lib/draftOrder.ts`

A thin client API that wraps `useOrderDraft` + `orderStatusEngine` so every page uses the same primitives.

Exports:

- `useDraftOrder()` — returns `{ draft, draftId, ensureDraft, patchDraft, logEvent, clearDraft }`. Auto-rehydrates from `orders` row keyed by `localStorage['active_order_id']` (renaming the existing `phase5_draft_order_id` + `active_order_id` into one key `ezbiz_active_order_id`, with a one-time migration that reads the old keys).
- `logOrderEvent(orderId, event_type, metadata?)` — typed wrapper around `order_events` insert.
- `ORDER_EVENT_TYPES` const — the 16 lifecycle events from the brief.

Anonymous users: draft is held in `localStorage` (package/addons/state/veteran flags) as a `pending_draft` JSON blob. On first authenticated `ensureDraft`, the blob is flushed into the new `orders` row and cleared — this is what makes the cart + waiver "persist across login/logout."

## 3. Pricing page (`src/pages/Pricing.tsx`, `PackagePricingCTA.tsx`)

On package select + addon toggle:

1. Call `patchDraft({ package, selected_addons, selected_state, source_route: '/pricing', current_step: 0 })`.
2. `logEvent('package_selected', { package })` and `logEvent('addon_selected', { addon })`.
3. Navigate to `/order-flow?package=...` (URL param stays for deep-link compatibility, but the draft row is now truth).

If anonymous, write to the `pending_draft` blob; flush on signup/login.

## 4. Order flow (`src/pages/EnhancedOrderFlow.tsx` + step components)

Reorder steps to: **State → Veteran Eligibility → Account Gate → Business Info → Add-ons review → Checkout**.

- State step: `patchDraft({ selected_state, state, state_fee })`, `logEvent('state_selected')`.
- Veteran step (`VeteranEligibilityGate`): `logEvent('veteran_check_started')` on mount. On Yes/Yes (TX 2022+): `patchDraft({ veteran_eligible: true, veteran_waiver_applied: selected_state==='TX', veteran_waiver_amount: selected_state==='TX' ? 300 : 0 })` + `logEvent('veteran_eligible')`.
- New `VeteranWaiverDialog` modal: shows when veteran_eligible && state=TX. Embeds `VVLDownloadButton` and on download fires `patchDraft({ vvl_pdf_downloaded: true, vvl_pdf_downloaded_at: now })` + `logEvent('vvl_pdf_downloaded')`.
- Account gate (`AccountStep`): if `!user`, force auth. On return (post-confirm/login), redirect target = `/order-flow?resume=<draftId>` which reads `current_step` from the draft row and jumps there. `logEvent('account_created')` (on signup), `logEvent('email_confirmed')` (when `auth.user.email_confirmed_at` flips true — detected in `useAuth` and patched once).
- Business Info: guarded — if `business_info_saved_at` is already set on the draft, skip re-collection and pre-fill from `business_information` table. `logEvent('business_info_started')` on entry, `business_info_saved` on submit. Patches `current_step` after each step.

Total calculation honors `veteran_waiver_amount` (subtract from state_fee subtotal when waiver_applied).

## 5. Auth + redirect (`src/pages/Auth.tsx`, `useAuth`)

- Persist `?redirect=` and `draftId` through email confirmation by encoding both in `emailRedirectTo`.
- On successful sign-in/sign-up/confirm: `window.scrollTo({top:0})`, flush pending_draft, navigate to redirect target (default `/dashboard`).
- Email-confirmed detection: in `useAuth`, when `user.email_confirmed_at` newly populated and an active draft exists → patch draft + log `email_confirmed` once (guarded by `email_confirmed_at` column).

## 6. Customer Dashboard (`src/pages/Dashboard.tsx`)

New `ActiveOrderResumeCard` at top:

- Reads the user's most-recent non-terminal order (`status NOT IN ('completed','cancelled')`).
- Shows: package, addons (chips), state, veteran waiver badge (`✓ $300 TX Veteran Waiver Applied` when applicable), payment status, missing docs count, **Next required action** computed from `current_step`/`status`.
- Primary CTA: "Continue where you left off" → `/order-flow?resume=<id>` (jumps to `current_step`).

Existing `OrderStatusCard` / `OrderDocuments` / `PaymentSection` continue to render below — all already read from the same `orders` row, so no duplication.

Scroll-to-top on dashboard mount.

## 7. Admin Dashboard — Flight Control view (`src/components/admin/OrdersTab.tsx` + new `FlightControlTab.tsx`)

New tab "Flight Control" with a dense table/grid. Columns:

| Order # | Customer | Pkg | State | Account ✓ | Email ✓ | Veteran | Waiver | Docs | Payment | Step | Status | ⚠ |

- Status dots (draft / intake_started / pending_payment / processing / payment_complete / completed).
- Filter chips: `Needs attention`, `Draft`, `Awaiting payment`, `Veteran`, `Missing docs`.
- Row click opens existing `OrderDetailDialog` — extend it to show: veteran block (eligible, waiver $, VVL downloaded ✓/✗), `selected_addons` chips, full `order_events` timeline (already present), `admin_notes` (already present).

`needs_attention` computed server-side via SQL `CASE` (no trigger — keep simple): in the dashboard query select `(status='pending_payment' AND last_activity_at < now() - interval '24 hours') OR (veteran_eligible AND NOT vvl_pdf_downloaded AND current_step >= 3) AS needs_attention_calc`.

Realtime: subscribe to `orders` + `order_events` updates so the flight-control view live-updates (pattern already used in `dashboard-realtime-sync` memory).

## 8. Order events instrumentation

Single helper `logOrderEvent` called from:

- Pricing → `package_selected`, `addon_selected`
- State step → `state_selected`
- Veteran step → `veteran_check_started`, `veteran_eligible`
- VVL dialog → `vvl_pdf_downloaded`
- Auth → `account_created`, `email_confirmed`
- Business info → `business_info_started`, `business_info_saved`
- Document upload → `document_uploaded`
- Checkout → `checkout_started`
- Stripe webhook (already logs) → ensure `payment_complete` emitted
- Admin status change → `admin_status_updated`
- Account-manager send (already logs) → `sent_to_account_manager`
- Final status → `order_completed`

## 9. UX fixes

- Global `ScrollToTop` component on route change (already partially present — verify and complete).
- Remove duplicate business-info collection: BusinessInfo step early-returns if `business_info_saved_at` set, with an "Edit" affordance instead of re-asking.
- Dashboard cards all bind to the same `orders` row via a single `useActiveOrder()` hook to guarantee consistency.

## 10. Files

**New:**
- `src/lib/draftOrder.ts`, `src/lib/orderEvents.ts`
- `src/hooks/useActiveOrder.ts`
- `src/components/order/VeteranWaiverDialog.tsx`
- `src/components/dashboard/ActiveOrderResumeCard.tsx`
- `src/components/admin/FlightControlTab.tsx`
- Migration: add new columns to `orders`

**Edited:**
- `src/hooks/useOrderDraft.ts` (extend to cover new fields + anonymous flush)
- `src/hooks/useAuth.tsx` (email-confirmed detection + redirect-with-draft)
- `src/pages/Pricing.tsx`, `src/components/PackagePricingCTA.tsx`
- `src/pages/EnhancedOrderFlow.tsx` (reorder steps, resume logic)
- `src/components/order/VeteranEligibilityGate.tsx`, `AccountStep.tsx`, `BusinessDetailsForm.tsx`
- `src/pages/Auth.tsx` (scroll-top, redirect chain)
- `src/pages/Dashboard.tsx`
- `src/pages/AdminDashboard.tsx` (mount new tab)
- `src/components/admin/OrderDetailDialog.tsx` (veteran + addons sections)
- `src/lib/calculateOrderTotal.ts` (honor `veteran_waiver_amount`)

## 11. Risk / out-of-scope

- No Stripe price changes — waiver applied as a discount line in totals only; Stripe checkout continues to compute the same way (state fee line item reduced when waiver applies, matching existing white-glove override pattern).
- No destructive schema changes; legacy `add_ons` column kept readable.
- No changes to webhook → account-manager flow (manual handoff stays manual per core rules).
- Migration adds columns + defaults; existing rows safe.

## 12. Acceptance

- Anonymous user picks package + addon on /pricing → signs up → lands on order flow at State step with selections intact.
- TX veteran path: waiver badge shows on dashboard, $300 deducted from total, VVL download recorded, admin sees ✓.
- Refresh mid-flow → resumes at `current_step`.
- Admin Flight Control shows live row updates as customer progresses.
- Business Info never asked twice.
- All 16 event types appear in `order_events` for a full end-to-end run.
