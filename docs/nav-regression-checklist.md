# Navigation Regression Checklist

Run after any change to `Navigation.tsx`, `Footer.tsx`, or routing.

## Mobile hamburger
- [ ] Hamburger icon toggles menu open/closed
- [ ] "Pricing" link visible at top of mobile menu
- [ ] "Pricing" routes to `/pricing` and closes the menu
- [ ] When on `/pricing`, mobile Pricing item shows active styling (primary color + left border)
- [ ] Mobile Pricing click fires `trackClick("Pricing", "mobile_nav_pricing", "/pricing")`
- [ ] "White Glove Support" link routes to `/order-flow?mode=whiteglove` (only approved direct order-flow link)
- [ ] Mobile "Get Started" CTA routes to `/pricing`

## Desktop nav
- [ ] Logo → `/`
- [ ] Pricing link → `/pricing`
- [ ] On `/pricing`, desktop Pricing shows active styling (bottom border-primary + `aria-current="page"`)
- [ ] Business Structures / Services / Resources dropdowns open and links work
- [ ] "Get Started" CTA → `/pricing`

## Accessibility
- [ ] Mobile Pricing carries `aria-current="page"` only on `/pricing`
- [ ] Mobile White Glove carries `aria-current="page"` only on `/order-flow?mode=whiteglove`
- [ ] Hamburger toggle is keyboard-operable; menu items are focusable links
- [ ] Clicking a menu item closes the menu (no focus trap)

## Automated coverage
- [ ] `bunx vitest run src/components/Navigation.test.tsx` passes
  (covers menu open, Pricing & White Glove routing, both tracking events, aria-current states)

## Footer
- [ ] Company → Pricing link routes to `/pricing`
- [ ] Tools → Start Your Filing routes to `/pricing`

## Pricing routing rule
- [ ] No public CTA bypasses `/pricing` to reach `/order-flow?mode=guided` directly
- [ ] White Glove is the only approved direct `/order-flow` link
- [ ] Package "Start" buttons on `/pricing` route to `/order-flow?mode=guided&package=…`

## Build
- [ ] `bun run build` exits 0
- [ ] No new console errors on `/` or `/pricing`
