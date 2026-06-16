import * as React from 'npm:react@18.3.1'
import type { TemplateEntry } from './registry.ts'
import { FollowupShell, SummaryLine, SITE_URL, type LeadFollowupProps } from './_lead-followup-shell.tsx'

const Email = (p: LeadFollowupProps) => (
  <FollowupShell
    {...p}
    preview="Pick up where you left off — your business filing is saved"
    heading="Your filing is saved — finish when you're ready"
    intro={<>Thanks for starting your business filing with EZ BIZ FILE SERVICE. We saved your progress so you can pick up exactly where you left off — no need to re-enter anything.</>}
    body={
      <>
        <SummaryLine label="Business" value={p.businessName} />
        <SummaryLine label="State" value={p.state} />
        <SummaryLine label="Entity" value={p.entityType} />
        <SummaryLine label="Package" value={p.packageName} />
      </>
    }
    ctaLabel="Resume My Filing"
    ctaHref={p.resumeUrl || `${SITE_URL}/dashboard`}
    closing="If you have questions before continuing, just reply to this email and a real person will help."
  />
)

export const template = {
  component: Email,
  subject: 'Your business filing is saved — pick up where you left off',
  displayName: 'Lead — Intake started (not completed)',
  previewData: { firstName: 'Jane', businessName: 'Acme Holdings LLC', state: 'Texas', entityType: 'LLC', packageName: 'Gold' },
} satisfies TemplateEntry
