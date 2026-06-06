## Scope

Ten distinct items, grouped by risk. I'll execute top-down and verify each.

---

### A. Quick reverts (low risk, no UI changes)

1. **Pricing**: `src/lib/pricing.ts` — `basic.price` back to `129` and `basic.stripePriceId` back to `"price_1TRVJJIUysiSR1zwmUpJg0gy"`. Remove the "$1 LIVE TEST MODE" comment block. The `EXPECTED_PRICE_CENTS` map auto-derives, so create-checkout will stop rejecting.

2. **Account manager email — send to BOTH**:
   - Update `ACCOUNT_MANAGER_EMAIL` secret value to `Chrislumbi@outlook.com,ABeren@corpnet.com` (comma-separated).
   - Patch `supabase/functions/send-order-to-account-manager/index.ts` to split the env var on commas, trim, dedupe, and pass the array to Resend `to`. Audit columns (`account_manager_sent_to`) get the joined string. Re-deploy the function.

3. **Delete demo user `Talavera.c.t@outlook.com`** via SQL migration (deletes from `auth.users` cascades to `profiles`, `user_roles`, `orders.user_id` set null via existing schema — I'll inspect first and use cascade where safe).

---

### B. Second checkout-path audit + patch (Dashboard → Resume)

I'll diff the data captured by:
- **Main path**: `/order-flow` → `/order/checkout` (writes to `business_information`, `contact_information`, `addresses`, `registered_agent`, `participants`, `irs_responsible_party`, `agreements`, `company_management`, `orders`).
- **Quick path**: Resume-application route (likely `EnhancedOrderFlow` reading `business_applications.application_data` JSON).

Report missing fields in chat, then patch the quick path to write the same normalized rows before create-checkout so downstream CSV/admin tooling sees parity.

---

### C. Customer dashboard

4. **Editable contact card** — extend the existing `ProfileEditor` already on Dashboard so users can edit `email` and `phone` (email change goes through `supabase.auth.updateUser`, profile row updates `phone` + `first_name` + `last_name`). The component already exists at `src/components/dashboard/ProfileEditor.tsx` — wire it into the visible card if not already, and add email.

5. **Welcome card status fix** — currently shows `"State Pending"` next to the entity type even when order is complete. Change to a status pill: if `orders.status === 'Completed'` or `'Filed with SOS'` show **green dot + "Active with SOS"**; otherwise the existing label.

6. **Customer document upload** — new "Documents" section on Dashboard:
   - Uses the existing **private** `order-documents` bucket (already in storage).
   - Storage path: `${user_id}/${order_id}/${uuid}-${filename}`.
   - Client validates MIME (`application/pdf`, `image/jpeg`, `image/png`) and size (≤ 10 MB).
   - On successful upload, insert a row into `documents` table (already exists with RLS — users can insert+view their own).
   - Downloads via `createSignedUrl` (60 s TTL), matching existing admin pattern.
   - Storage RLS migration: add object-level policies on `storage.objects` for the `order-documents` bucket so customers can insert under their own `user_id/order_id/*` prefix and read their own files (admins already have full access via existing policies).

---

### D. Admin dashboard

7. **Quick-view editor in Applications tab** — next to the "Copy to Clipboard" button on each row/detail card, add an "Edit" button opening a dialog that lets admins inline-edit **contact + business basics only**: `business_information.company_name`, `contact_information.first_name/last_name/email/phone`, `addresses.address1/city/state/zip` (business address). Saves via existing admin RLS (admins can update those tables already). Logs an `order_events` row of type `admin_edit_application`.

8. **Remove user button** — on UsersTab, each row gets a "Remove" button (destructive, with confirm dialog). Calls a new edge function `admin-remove-user` that:
   - Verifies caller is admin.
   - Deletes from `auth.users` via service role (cascades to `profiles`, `user_roles`).
   - Does NOT delete orders (preserves audit).
   - Logs to `order_events` / console.

---

### E. Memory + verification

- Update memory: account manager now dual-recipient; basic package restored to $129.
- Verify build, then ask user to test: (1) sign-in & profile edit, (2) document upload + admin view, (3) admin user removal, (4) admin application edit, (5) Welcome card status, (6) checkout still works at $129 (Stripe price ID restored — no new Stripe object needed since it's the original ID).

---

### Files I will touch

- `src/lib/pricing.ts`
- `supabase/functions/send-order-to-account-manager/index.ts`
- `src/pages/Dashboard.tsx` (+ small new components: `DocumentUpload.tsx`, status-pill update)
- `src/components/dashboard/ProfileEditor.tsx` (add email)
- `src/pages/AdminDashboard.tsx` and `src/components/admin/UsersTab.tsx` (remove button)
- `src/components/admin/OrderDetailDialog.tsx` or new `ApplicationQuickEditDialog.tsx`
- New edge function `supabase/functions/admin-remove-user/index.ts`
- New migration: storage RLS policy for customer uploads + delete demo user
- The quick-checkout path file(s) once I confirm which one (likely `EnhancedOrderFlow.tsx`)

---

### What I am NOT doing (flag for later if you want)

- App-layer AES encryption of uploaded files (you chose private-bucket + signed-URL pattern, which is the standard secure approach).
- Adding ABeren back as a CC on every legacy admin manual re-send override (those already accept `recipient_override`).
- Touching the main checkout flow data model.

OK to proceed?