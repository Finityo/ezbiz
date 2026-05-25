# Email Verification on Signup

## Goal
New clients must verify their email before they can access the Dashboard. Existing verified users are unaffected.

## Changes

### 1. Auth configuration
- Ensure auto-confirm email is **disabled** so Supabase sends the verification email on signup (uses the existing branded `auth-email-hook` → `signup.tsx` template).
- Set `emailRedirectTo` on `signUp()` to `${origin}/auth/callback?next=/dashboard` (or keep `/` — see below) so the confirmation link returns the user to the app and logs them in.

### 2. Signup UX (`src/hooks/useAuth.tsx`, `src/components/order/AccountStep.tsx`, `src/pages/Auth.tsx`)
- After `signUp`, do NOT treat the user as authenticated for protected flows. Show a "Check your email to verify" state (Auth.tsx already does this; AccountStep does not — add the same).
- In `AccountStep`, after successful signup, instead of calling `onAuthenticated()`, render a "Verify your email to continue" panel with a resend button.

### 3. Gate the Dashboard on verified email
- In `src/pages/Dashboard.tsx` (and any route guard / `useAuth` consumer for protected routes), check `user.email_confirmed_at`. If missing, show an "Email not verified" screen with:
  - Message + the email address
  - "Resend verification email" button (`supabase.auth.resend({ type: 'signup', email })`)
  - Sign out button
- Same gate applied to the order flow's post-account steps (Review/Checkout) so unverified users can't proceed to payment.

### 4. Resend endpoint usage
- Use `supabase.auth.resend({ type: 'signup', email, options: { emailRedirectTo } })` for the resend button. No backend change needed — flows through existing `auth-email-hook`.

### 5. Toast copy
- Update signup success toast to: "Check your email — we sent a verification link to {email}."

## Out of scope
- Email template styling (already branded).
- Password reset flow (already implemented).
- Social/Google sign-in (not currently enabled).

## Files touched
- `src/hooks/useAuth.tsx` — signup return signal + redirect URL
- `src/components/order/AccountStep.tsx` — post-signup verification panel
- `src/pages/Dashboard.tsx` — unverified gate
- `src/pages/EnhancedOrderFlow.tsx` (or wherever step progression is gated) — block step 5 if unverified
- Supabase auth config: `auto_confirm_email = false`

## Verification
- Sign up with a fresh email → no dashboard access, verification email arrives.
- Click link → redirected, `email_confirmed_at` set, dashboard loads.
- Resend works and is rate-limited by Supabase defaults.
