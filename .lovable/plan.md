

## Acuity Scheduling Integration — Replace Calendly with Popup/Modal

**Owner ID:** `38549422`
**Acuity URL:** `https://app.acuityscheduling.com/schedule.php?owner=38549422`

### Files to modify

1. **`src/components/consultation/ConsultationTypeCard.tsx`**
   - Remove `calendlyUsername` prop and `calendlyEvent` from the type
   - Remove `Window.Calendly` global declaration
   - Add `acuityOwnerId` prop instead
   - Replace `handleSchedule` to open Acuity in a popup window via `window.open()` with centered positioning (Acuity doesn't have a JS popup SDK like Calendly — the standard approach is `window.open` to their scheduling page, sized ~600x800)

2. **`src/pages/Consultation.tsx`**
   - Replace `CALENDLY_USERNAME` constant with `ACUITY_OWNER_ID = "38549422"`
   - Remove the Calendly CSS/JS script injection `useEffect`
   - Remove `CalendlyEmbed` import
   - Pass `acuityOwnerId` instead of `calendlyUsername` to `ConsultationTypeCard`
   - Update CTA section "Schedule Free Consultation" button to open same Acuity popup

3. **`src/components/consultation/CalendlyEmbed.tsx`**
   - Delete file contents and replace with an `AcuityEmbed` component (or just delete since we're doing popup-only, not inline embed)
   - Since the chosen style is popup/modal only, this file can be deleted or repurposed. Since the rules say we can delete dead code — but the previous task said no file deletions. I'll repurpose it into an Acuity utility if needed, or simply stop importing it.

### Implementation details

- **Popup approach:** `window.open('https://app.acuityscheduling.com/schedule.php?owner=38549422', 'acuity', 'width=600,height=800,...')` — simple, no external scripts needed
- **No external scripts required** — unlike Calendly, Acuity's embed for popups is just opening their URL; no CSS or JS widget files to load
- **Zero behavior change** to analytics, routing, Stripe, or checkout

### Files deleted
- `src/components/consultation/CalendlyEmbed.tsx` — no longer needed (was only imported, never rendered in current code)

### Summary
- 3 files touched, 1 deleted
- All Calendly references removed
- Acuity popup opens from every "Schedule Now" button and the CTA section

