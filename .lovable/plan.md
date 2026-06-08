# Surgical Routing & Performance Fix

## Root cause
`/order-flow?mode=guided` (no `package=`) shows a blank page because the lazy `EnhancedOrderFlow` chunk is large (Supabase, auth, 5 step components, Stripe) and the redirect-on-missing-package only fires **after** the chunk parses. Meanwhile most public CTAs link bare `/order-flow`, dropping users straight into that broken state. `/pricing` itself is already lightweight.

## What I'll change (surgical only)

### 1. Pre-route guard for `/order-flow` (App.tsx)
Wrap the lazy route in a tiny inline component that reads `useSearchParams` **before** the chunk loads:
- If `mode !== "whiteglove"` AND `package` param is missing/invalid → `<Navigate to="/pricing" replace />` immediately.
- Otherwise render the lazy `<EnhancedOrderFlow />`.

This eliminates the blank-screen wait entirely for the broken URL.

### 2. Branded Suspense fallback for `/order-flow`
Replace the generic spinner Suspense (only for this route) with:
```
Preparing your EZ Biz filing options...
```
plus a small spinner. Keeps the global Suspense untouched.

### 3. Error recovery boundary around `/order-flow`
Add a minimal `OrderFlowErrorBoundary` class component wrapping the lazy route. On error it shows:
```
We had trouble loading your order flow.
Please return to pricing and choose your package.
[ Back to Pricing ]   (Link to /pricing)
```
No global error-boundary changes.

### 4. Fix public CTAs → `/pricing`
Update the routes flagged "✅ change" in the audit table to point to `/pricing`. Includes:
- `Hero.tsx`, `FloatingCTA.tsx`, `Navigation.tsx` (2), `Footer.tsx`, `ChooseYourPath.tsx` (guided card only — whiteglove unchanged), `StateHeroSection.tsx`, `Index.tsx` (2), `About.tsx`, `Consultation.tsx` (2), `VeteranLLCTexas.tsx` (3), `Entrepreneurs.tsx` (2 `/start-order` links).
- Entity/service pages: `LLC`, `CCorporation`, `SCorporation`, `NonprofitCorporation`, `ProfessionalCorporation`, `Partnership`, `SoleProprietorship`, `RegisteredAgent`, `DBAFiling`, `EINNumber`, `AnnualReport`.
- `content/blogPosts.ts` 4 markdown links.
- Analytics `trackClick` destination strings updated to match new route.
- Keep `components/order/ReviewStep.tsx` Stripe `cancelPath` and `pages/order/CompanyInfo.tsx` back-button as `/order-flow?mode=...` (these are in-flow, not public CTAs).

### 5. Pricing.tsx package buttons
Update `handleStart` so the deep link includes `mode=guided` and any pre-selected state:
```
/order-flow?mode=guided&package=<pkg>[&state=<state>][&addons=...]
```
State currently isn't captured on `/pricing`, so this is a forward-compatible addition — today it just always emits `mode=guided&package=...`.

### 6. Leave legacy `/start-order` route in place
Route stays registered in `App.tsx`. After the CTA updates above, the only references to `/start-order` are:
- The route definition itself
- `pages/StartOrder.tsx` internal `redirect=/start-order` auth round-trip
No public CTAs will point at it anymore. Reported, not removed (per instructions).

## Files to change
- `src/App.tsx` — add guard wrapper, scoped Suspense fallback, error boundary around `/order-flow` route only.
- `src/pages/Pricing.tsx` — `handleStart` URL adds `mode=guided` and optional `state`.
- CTA route updates in:
  - `src/components/Hero.tsx`, `FloatingCTA.tsx`, `Navigation.tsx`, `Footer.tsx`, `ChooseYourPath.tsx`
  - `src/components/state/StateHeroSection.tsx`
  - `src/pages/Index.tsx`, `About.tsx`, `Consultation.tsx`, `VeteranLLCTexas.tsx`, `Entrepreneurs.tsx`
  - `src/pages/LLC.tsx`, `CCorporation.tsx`, `SCorporation.tsx`, `NonprofitCorporation.tsx`, `ProfessionalCorporation.tsx`, `Partnership.tsx`, `SoleProprietorship.tsx`, `RegisteredAgent.tsx`, `DBAFiling.tsx`, `EINNumber.tsx`, `AnnualReport.tsx`
  - `src/content/blogPosts.ts`

## Explicitly NOT changed
- Wizard structure, step components, business logic, Stripe logic, pricing values.
- `EnhancedOrderFlow.tsx` internals (only the route wrapper around it).
- Legacy `/start-order` route registration.
- `/pricing` page UI/data.
- In-flow back/cancel routes inside the wizard.

## Verification after build
- Visit `/order-flow?mode=guided` → instant redirect to `/pricing`, no blank screen.
- Visit `/order-flow?mode=guided&package=deluxe` → wizard loads with branded "Preparing…" fallback during chunk download.
- Click each public CTA listed above → lands on `/pricing`.
- `/pricing` package "Continue/Start" buttons → land on `/order-flow?mode=guided&package=<pkg>`, wizard renders normally.
- Force a thrown error in the lazy chunk (dev check) → error fallback shows with "Back to Pricing" button.
