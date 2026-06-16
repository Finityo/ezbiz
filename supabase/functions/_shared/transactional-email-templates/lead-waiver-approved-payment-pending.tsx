import * as React from 'npm:react@18.3.1'
import type { TemplateEntry } from './registry.ts'
import { FollowupShell, SummaryLine, SITE_URL, type LeadFollowupProps } from './_lead-followup-shell.tsx'

const Email = (p: LeadFollowupProps) => (
  <FollowupShell
    {...p}
    preview="Your Texas Veteran Waiver was approved — finish checkout"
    heading="Waiver approved — the $300 state fee is waived"
    intro={<>Great news — your Texas Veteran Fee Waiver was approved. The $300 Texas state filing fee has been waived. You only owe the EZ BIZ FILE SERVICE service fee for your selected package to finish filing.</>}
    body={
      <>
        <SummaryLine label="Business" value={p.businessName} />
        <SummaryLine label="State" value="Texas" />
        <SummaryLine label="Entity" value={p.entityType} />
        <SummaryLine label="Package" value={p.packageName} />
        <SummaryLine label="State Filing Fee" value="$0.00 (waived)" />
      </>
    }
    ctaLabel="Complete Checkout"
    ctaHref={p.resumeUrl || `${SITE_URL}/dashboard`}
    closing="As soon as payment clears, we file your formation documents with the Texas Secretary of State. Questions? Just reply to this email."
  />
)

export const template = {
  component: Email,
  subject: 'Your Texas Veteran Waiver was approved — complete checkout',
  displayName: 'Lead — Waiver approved, payment pending',
  previewData: { firstName: 'Jane', businessName: 'Acme Holdings LLC', entityType: 'LLC', packageName: 'Gold' },
} satisfies TemplateEntry
