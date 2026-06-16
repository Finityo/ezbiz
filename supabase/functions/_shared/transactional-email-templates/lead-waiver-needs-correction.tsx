import * as React from 'npm:react@18.3.1'
import type { TemplateEntry } from './registry.ts'
import { FollowupShell, SummaryLine, SITE_URL, type LeadFollowupProps } from './_lead-followup-shell.tsx'

interface Props extends LeadFollowupProps {
  correctionNotes?: string
}

const Email = (p: Props) => (
  <FollowupShell
    {...p}
    preview="A small correction is needed on your Texas Veteran Waiver"
    heading="Quick correction needed on your waiver"
    intro={<>We reviewed your Texas Veteran Fee Waiver documents and need a small correction before we can submit them to the state.</>}
    body={
      <>
        <SummaryLine label="Business" value={p.businessName} />
        <SummaryLine label="What we need" value={p.correctionNotes || 'See details in your dashboard.'} />
      </>
    }
    ctaLabel="Open My Waiver"
    ctaHref={p.resumeUrl || `${SITE_URL}/dashboard`}
    closing="Once you upload the corrected document, we'll re-review within 1–2 business days. The $300 Texas state filing fee is still waived only after the state approves the waiver."
  />
)

export const template = {
  component: Email,
  subject: 'Action needed — correction required on your Texas Veteran Waiver',
  displayName: 'Lead — Waiver needs correction',
  previewData: { firstName: 'Jane', businessName: 'Acme Holdings LLC', correctionNotes: 'DD-214 was unreadable — please re-upload a clearer scan.' },
} satisfies TemplateEntry
