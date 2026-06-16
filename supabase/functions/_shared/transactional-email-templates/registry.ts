/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'

export interface TemplateEntry {
  component: React.ComponentType<any>
  subject: string | ((data: Record<string, any>) => string)
  to?: string
  displayName?: string
  previewData?: Record<string, any>
}

import { template as leadNotification } from './lead-notification.tsx'
import { template as orderConfirmation } from './order-confirmation.tsx'
import { template as consultationConfirmation } from './consultation-confirmation.tsx'
import { template as orderStatusUpdate } from './order-status-update.tsx'
import { template as accountManagerOrderHandoff } from './account-manager-order-handoff.tsx'
import { template as adminPaidOrderNotification } from './admin-paid-order-notification.tsx'
import { template as adminAbandonedCheckout } from './admin-abandoned-checkout.tsx'
import { template as leadIntakeIncomplete } from './lead-intake-incomplete.tsx'
import { template as leadCheckoutAbandoned } from './lead-checkout-abandoned.tsx'
import { template as leadWaiverDocsPending } from './lead-waiver-docs-pending.tsx'
import { template as leadWaiverApprovedPaymentPending } from './lead-waiver-approved-payment-pending.tsx'
import { template as leadWaiverNeedsCorrection } from './lead-waiver-needs-correction.tsx'
import { template as leadWaiverNotApproved } from './lead-waiver-not-approved.tsx'

export const TEMPLATES: Record<string, TemplateEntry> = {
  'lead-notification': leadNotification,
  'order-confirmation': orderConfirmation,
  'consultation-confirmation': consultationConfirmation,
  'order-status-update': orderStatusUpdate,
  'account-manager-order-handoff': accountManagerOrderHandoff,
  'admin-paid-order-notification': adminPaidOrderNotification,
  'admin-abandoned-checkout': adminAbandonedCheckout,
  // Customer follow-up templates — registered for previewing/manual sends only.
  // Phase Five P3 explicitly DOES NOT auto-send these yet.
  'lead-intake-incomplete': leadIntakeIncomplete,
  'lead-checkout-abandoned': leadCheckoutAbandoned,
  'lead-waiver-docs-pending': leadWaiverDocsPending,
  'lead-waiver-approved-payment-pending': leadWaiverApprovedPaymentPending,
  'lead-waiver-needs-correction': leadWaiverNeedsCorrection,
  'lead-waiver-not-approved': leadWaiverNotApproved,
}
