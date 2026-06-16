import * as React from 'npm:react@18.3.1'
import type { TemplateEntry } from './registry.ts'
import { FollowupShell, SummaryLine, SITE_URL, type LeadFollowupProps } from './_lead-followup-shell.tsx'

const Email = (p: LeadFollowupProps) => (
  <FollowupShell
    {...p}
    preview="Texas Veteran Waiver — your documents are needed to continue"
    heading="Texas Veteran Waiver — documents needed"
    intro={<>You started the Texas Veteran Fee Waiver application. We still need your supporting documents (DD‑214 or Veterans Affairs verification, plus a government-issued ID) before our team can submit the waiver to the Texas Secretary of State.</>}
    body={
      <>
        <SummaryLine label="Business" value={p.businessName} />
        <SummaryLine label="State" value="Texas" />
        <SummaryLine label="Entity" value={p.entityType} />
        <SummaryLine label="Package" value={p.packageName} />
      </>
    }
    ctaLabel="Upload My Documents"
    ctaHref={p.resumeUrl || `${SITE_URL}/dashboard`}
    closing="Once we receive your documents, we'll review them and update you within 1–2 business days. The $300 Texas state filing fee is waived only after the state approves the waiver."
  />
)

export const template = {
  component: Email,
  subject: 'Texas Veteran Waiver — upload your documents to continue',
  displayName: 'Lead — Waiver documents pending',
  previewData: { firstName: 'Jane', businessName: 'Acme Holdings LLC', entityType: 'LLC', packageName: 'Gold' },
} satisfies TemplateEntry
