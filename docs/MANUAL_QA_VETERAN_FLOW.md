# Manual QA — Unified Draft Order & Texas Veteran Waiver

Headless automation can verify routing, console hygiene, draft creation, and
event logging, but it cannot create real auth users (email confirmation
required). Use this checklist with a real disposable inbox once per release.

## Test accounts

Use a real mailbox you control (Gmail "+" aliases work):

- `qa+std-<yyyymmdd>@yourdomain.com` — standard customer
- `qa+vet-<yyyymmdd>@yourdomain.com` — Texas veteran path

Do **NOT** reuse these emails — each pass should create a fresh account so
draft handoff from `ezbiz_pending_draft` → `orders` is exercised cleanly.

## Path 1 — Standard customer (non-veteran)

1. Open `/pricing` (logged out). Toggle one add-on under **Deluxe**.
2. Click **Start Deluxe** → expect `/order-flow?mode=guided&package=deluxe&addons=…`.
3. Confirm the **Selection Confirmation Chip** at the top shows:
   `Deluxe Package` · add-on count · estimated total.
   (`data-testid="selection-summary-chip"`)
4. Select **Texas** → chip now shows `TX` badge.
5. Answer veteran questions as **No** → no waiver chip, no `-$300` line.
6. Continue → fill business details → Continue.
7. **Account gate appears BEFORE business info has a duplicate page.**
   Create the account using `qa+std-…`. Confirm the verification email.
8. After email confirmation, signing in lands you on `/dashboard` and the
   page is scrolled to the top.
9. Dashboard shows **Active Order Resume Card** with Deluxe + TX.
10. Click Continue → returns to `/order-flow` at Review step with all
    selections preserved. Cart total matches what you saw pre-auth.
11. Verify `localStorage.ezbiz_pending_draft` is **gone** and
    `localStorage.ezbiz_active_order_id` holds the real `orders.id`.

Expected `order_events` (in order):
`intake_started → state_selected → veteran_check_started →
package_selected → business_info_started → business_info_saved`

## Path 2 — Texas Veteran (waiver-eligible)

1. Repeat steps 1–4 of Path 1 with Deluxe + Texas.
2. Answer **Yes** to both veteran questions.
3. **VeteranWaiverDialog** opens. Confirm:
   - Title: "🇺🇸 You qualify for the Texas Veteran Waiver"
   - Button: visible text **"Download VVL Form"** with the download icon
     (selector: `[data-testid="download-vvl-form"]`, aria-label
     `"Download VVL Form (PDF)"`).
4. Click **Download VVL Form**. A `Veteran-Verification-Letter-VVL.pdf`
   download starts AND the "Thank You For Your Service" overlay appears.
5. Close the dialog. Confirm the chip now shows the green
   **`🇺🇸 TX Veteran Waiver −$300`** badge and total dropped by $300.
6. Continue to business details → Continue → account gate.
7. Create the account using `qa+vet-…`. Confirm the email.
8. After login: scrolled to top, `/dashboard` shows the Active Order
   Resume Card with the veteran badge and the next action
   ("Upload waiver documents" or "Continue to checkout" depending on
   waiver state).
9. Open the Review step (Continue → Review). The price breakdown shows
   a dedicated line:
   `Texas Veteran Filing Fee Waiver  −$300.00`
   (selector: `[data-testid="veteran-waiver-line"]`) and the TX filing
   fee above it is shown with strikethrough.

Expected `order_events` (in order):
`intake_started → state_selected → veteran_check_started →
veteran_eligible → vvl_pdf_downloaded → package_selected →
business_info_started → business_info_saved → waiver_draft_created`

Critical assertions for the veteran path:

- `vvl_pdf_downloaded` MUST NOT fire if the user clicks **Skip for now**
  or **Got it — continue** without clicking the download button.
- `veteran_eligible` fires once the user answers Yes/Yes, independently
  of any VVL download.
- Only ONE row in `orders` per session — verify via Admin Flight Control.

## Admin Flight Control checks (any admin login)

1. Open `/admin` → Flight Control tab while the QA customer is still
   pre-payment. Their draft row should be visible immediately with:
   - current step
   - selected package, state
   - veteran badges
   - VVL downloaded yes/no
2. As the customer advances through the wizard, the same row updates
   in place (no duplicates).
3. After Stripe checkout completes, the row's status flips to
   `paid` / `in_processing` and `payment_complete` appears in
   `order_events`.

## Cleanup

After QA, remove the test accounts from `auth.users` and the orders rows
they produced, or use the **Admin → Wipe Test Orders** page filtered by
email domain.
