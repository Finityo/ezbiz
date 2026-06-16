## Goal
Create a pseudo veteran customer account and walk an order through the guided flow up to the Stripe checkout handoff, then stop before payment.

## Steps

1. **Create customer account**
   - Email: `christian.r.t@outlook.com`
   - Temporary password: `VetTest!2026#EZ` (16 chars, mixed case + number + symbol — meets HIBP-safe complexity)
   - Provision via Lovable Cloud auth (email/password, auto-confirmed so login works immediately without verification email)
   - `handle_new_user` trigger will auto-create the `profiles` + `user_roles` (role: `user`) rows
   - First name: `Christian`, Last name: `T` (veteran test persona)

2. **Seed pseudo veteran order** (draft in DB tied to the new user)
   - Insert one `business_applications` row + linked `orders` row in `draft` status
   - Persona data:
     - Business name: `Patriot Holdings LLC`
     - Entity type: `LLC`
     - State: `Texas` (veteran fee waiver state)
     - Package: `Standard` (or whichever tier you prefer — see Q1)
     - Veteran flag: `true` (triggers veteran benefits / fee waiver in `state-fees.ts`)
     - Contact: `christian.r.t@outlook.com`
     - Address: placeholder TX address
     - Add-ons: none by default
   - Populate the linked normalized tables minimally so the flow can resume at checkout: `contact_information`, `business_information`, `addresses` (principal), `registered_agent` (use EZ BIZ default), `irs_responsible_party` (Christian T, placeholder SSN unencrypted? — see Q2)

3. **Stop point — DO NOT cross**
   - No call to `create-checkout` edge function
   - No Stripe Session creation
   - No `payments` row, no `payment_complete` event, no CorpNet handoff
   - Order remains `status = draft`, ready for the user to log in, open `/order-flow`, and land on Step 5 (Review & Pay) where the "Pay" button would invoke Stripe

4. **Deliverables reported back in chat**
   - Login email + temp password
   - Order ID / order number
   - Direct link to resume: `/order-flow?resume=<orderId>` (or `/dashboard` then the draft card)
   - Explicit confirmation: "Stopped before Stripe checkout — no live charge created."

## Clarifying questions before I build

1. **Package tier?** Standard ($199 + state fee), Premium, or White Glove ($150 base)?
2. **IRS Responsible Party SSN** — leave blank (Step 4 will require it before checkout), or insert a fake `000-00-0000` placeholder so the draft is checkout-ready?
3. **Add-ons?** EIN, Operating Agreement, Registered Agent upgrade — any to include, or keep it base package only?

Once you answer (or say "your call"), I'll switch to build mode and execute.
