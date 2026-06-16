import * as React from 'npm:react@18.3.1'
import type { TemplateEntry } from './registry.ts'
import { FollowupShell, SummaryLine, SITE_URL, type LeadFollowupProps } from './_lead-followup-shell.tsx'

const Email = (p: LeadFollowupProps) => (
  <FollowupShell
    {...p}
    preview="Update on your Texas Veteran Waiver — standard filing is still available"
    heading="Waiver not approved — standard filing is still available"
    intro={<>We received a response on your Texas Veteran Fee Waiver and unfortunately it was not approved. You can still file your business with us through the standard process. If you continue, the standard Texas state filing fee ($300) will apply in addition to your EZ BIZ FILE SERVICE package.</>}
    body={
      <>
        <SummaryLine label="Business" value={p.businessName} />
        <SummaryLine label="State" value="Texas" />
        <SummaryLine label="Entity" value={p.entityType} />
        <SummaryLine label="Package" value={p.packageName} />
        <SummaryLine label="Texas State Filing Fee" value="$300.00 (standard)" />
      </>
    }
    ctaLabel="Continue With Standard Filing"
    ctaHref={p.resumeUrl || `${SITE_URL}/dashboard`}
    closing="If you'd like to talk through your options — or appeal the waiver decision — reply to this email and our team will walk you through next steps."
  />
)

export const template = {
  component: Email,
  subject: 'Texas Veteran Waiver update — standard filing still available',
  displayName: 'Lead — Waiver not approved, standard checkout',
  previewData: { firstName: 'Jane', businessName: 'Acme Holdings LLC', entityType: 'LLC', packageName: 'Gold' },
} satisfies TemplateEntry
