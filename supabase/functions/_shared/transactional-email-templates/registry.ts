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

export const TEMPLATES: Record<string, TemplateEntry> = {
  'lead-notification': leadNotification,
  'order-confirmation': orderConfirmation,
  'consultation-confirmation': consultationConfirmation,
  'order-status-update': orderStatusUpdate,
  'account-manager-order-handoff': accountManagerOrderHandoff,
}
