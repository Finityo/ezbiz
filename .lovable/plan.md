## Goal

Split `/order-flow` into two filing paths — **Standard LLC** and **Texas Veteran Waiver** — without breaking existing Standard checkout. Waiver customers must reach the dashboard and upload waiver documents BEFORE payment, and the Texas $300 state fee must be removed only after admin approval (verified server-side).

---

## 1. New Step 0: Filing-Path Decision

New component `FilingPathStep` shown as the first step of `/order-flow` (before State). Two large cards:

- **Start Standard LLC Filing** → sets `filingPath: "standard"`, proceeds to existing State step.
- **Use Texas Veteran Waiver** → sets `filingPath: "texas_veteran_waiver"`, locks State to Texas, proceeds to Package step.

Persisted in `OrderContext` as `filingPath`. Default `"standard"` for back-compat with existing entry points (`/order-flow?package=...` keeps Standard behavior).

## 2. Flow Branching

```
Standard:  Path → State → Package → Details → Account → Review → Stripe → Dashboard
Waiver:    Path → (TX) → Package → Details → Account → [create draft] → Dashboard (upload)
```

After Account step in waiver path:
- Insert row into `orders` (status `draft`) and into `business_applications` with `status = 'waiver_documents_pending'` and `application_data = { filingPath, package, addOns, businessDetails, originalStateFee: 300, waivedStateFee: false }`.
- `navigate('/dashboard')` instead of Review.
- Skip Review/Checkout entirely until admin approves or rejects.

## 3. Dashboard Changes

Extend status engine + `OrderStatusCard`/`OrderTimeline` to recognize new waiver statuses:
- `waiver_documents_pending` – show **Upload Waiver Documents** panel.
- `waiver_documents_submitted` – "Submitted, awaiting review."
- `waiver_under_review` – admin reviewing.
- `waiver_needs_correction` – show admin note + re-upload.
- `waiver_approved_payment_required` – show **Continue to Checkout (no state fee)** CTA → `/order/checkout?orderId=...&waiver=1`.
- `waiver_not_approved_standard_checkout_required` – show **Continue with Standard Checkout ($300 TX fee applies)** CTA.

New `WaiverDocumentUpload` component (reuses `DocumentUploader` + `order-documents` bucket) accepts:
- TVC Verification Letter (per owner)
- Comptroller Form 05-904
- Optional supporting docs

On submit: set status to `waiver_documents_submitted`, log `order_events`.

## 4. Admin Dashboard

New tab/section in `AdminDashboard` → "Waiver Reviews" listing orders where `business_applications.status` starts with `waiver_`. Actions:
- **Approve** → status `waiver_approved_payment_required`, set `application_data.waivedStateFee = true`.
- **Request Correction** → status `waiver_needs_correction` + admin note.
- **Reject** → status `waiver_not_approved_standard_checkout_required`.

All writes guarded by `has_role(auth.uid(),'admin')` (existing RLS pattern).

## 5. Checkout Server-Side Verification

Edge function `create-checkout`:
- Accept `orderId`. If present, server fetches `business_applications.application_data` for that order.
- If `filingPath === 'texas_veteran_waiver'` AND `waivedStateFee === true` → force `stateFee = 0` regardless of client payload.
- If waiver flagged but not approved → reject with 403 ("Waiver not approved").
- Standard orders unchanged.

Frontend `Checkout.tsx` hides state fee line + passes `waiver=1` flag when arriving from waiver-approved path; server is the source of truth.

## 6. Registered Agent Copy Fix

In `src/lib/pricing.ts`, replace Basic feature `"Registered agent (1 year FREE)"` with:
- **Basic**: "Registered Agent included for 60 days; auto-renews at $149/year unless canceled."
- **Deluxe**: "Registered Agent included for first year; auto-renews the following year at $149/year unless canceled."
- **Complete**: same as Deluxe.

## 7. Database Migration

Add to `business_applications`:
- Allow `status` values: `waiver_documents_pending`, `waiver_documents_submitted`, `waiver_under_review`, `waiver_needs_correction`, `waiver_approved_payment_required`, `waiver_not_approved_standard_checkout_required` (column is text, no enum change needed — verify).
- No new tables required; reuse `documents` table for uploads with `document_type = 'waiver_*'`.

## 8. Safety / Back-Compat

- Default `filingPath = 'standard'` everywhere it's unset → existing flows untouched.
- New Filing Path step only renders when no `filingPath` and no `?package=` deep-link present. Existing `/order-flow?package=basic` continues straight to State step as today.
- Stripe price IDs, addon logic, account creation unchanged.
- Standard Checkout payload unchanged.

## Files (new / edited)

**New**
- `src/components/order/FilingPathStep.tsx`
- `src/components/dashboard/WaiverDocumentUpload.tsx`
- `src/components/admin/WaiverReviewsTab.tsx`
- `supabase/migrations/*` (status values + indexes if needed)

**Edited**
- `src/contexts/OrderContext.tsx` (add `filingPath`)
- `src/pages/EnhancedOrderFlow.tsx` (insert path step + branch after Account)
- `src/components/order/AccountStep.tsx` (post-account waiver branch creates draft + navigates to dashboard)
- `src/pages/Dashboard.tsx` + `src/components/dashboard/OrderStatusCard.tsx` + `OrderTimeline.tsx`
- `src/lib/orderStatusEngine.ts` (waiver statuses)
- `src/pages/AdminDashboard.tsx` (add Waiver Reviews tab)
- `src/lib/pricing.ts` (Registered Agent feature copy)
- `supabase/functions/create-checkout/index.ts` (server-side waiver verification)
- `src/pages/order/Checkout.tsx` (hide state fee + send orderId when waiver-approved)

## Open Question

For the Texas Veteran Waiver path, should the State step be **skipped entirely** (auto-set to Texas) or **shown but locked to Texas with explanatory copy**? Plan assumes skipped — let me know if you want it shown.
