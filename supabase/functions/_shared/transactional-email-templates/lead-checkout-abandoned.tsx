import * as React from 'npm:react@18.3.1'
import type { TemplateEntry } from './registry.ts'
import { FollowupShell, SummaryLine, SITE_URL, type LeadFollowupProps } from './_lead-followup-shell.tsx'

const Email = (p: LeadFollowupProps) => (
  <FollowupShell
    {...p}
    preview="You're one step away from filing your business"
    heading="One step away — complete your checkout"
    intro={<>You reached checkout but didn't finish paying. Your selections are still saved — completing payment takes about a minute.</>}
    body={
      <>
        <SummaryLine label="Business" value={p.businessName} />
        <SummaryLine label="State" value={p.state} />
        <SummaryLine label="Entity" value={p.entityType} />
        <SummaryLine label="Package" value={p.packageName} />
      </>
    }
    ctaLabel="Complete My Payment"
    ctaHref={p.resumeUrl || `${SITE_URL}/dashboard`}
    closing="If something stopped you from completing checkout — a payment issue, a question, or you want to change your package — reply to this email and we'll help."
  />
)

export const template = {
  component: Email,
  subject: 'Your business filing is ready — complete checkout to file',
  displayName: 'Lead — Checkout abandoned (standard)',
  previewData: { firstName: 'Jane', businessName: 'Acme Holdings LLC', state: 'Texas', entityType: 'LLC', packageName: 'Gold' },
} satisfies TemplateEntry
