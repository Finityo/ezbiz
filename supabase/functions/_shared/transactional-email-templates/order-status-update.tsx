import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'EZ BIZ FILE SERVICE'
const BRAND_NAVY = '#23304a'
const BRAND_GOLD = '#c9a84c'

interface OrderStatusUpdateProps {
  name?: string
  businessName?: string
  entityType?: string
  state?: string
  orderId?: string
  status?: string
  statusLabel?: string
  message?: string
}

const STATUS_MESSAGES: Record<string, { label: string; body: string }> = {
  draft: { label: 'Order Received', body: 'Your order has been received and is being prepared.' },
  pending_payment: { label: 'Payment Pending', body: 'Your order is saved. Complete checkout to move it into processing.' },
  processing: { label: 'Processing', body: 'Your formation has entered processing. Our team is preparing your documents.' },
  payment_complete: { label: 'Payment Confirmed', body: 'We received your payment and are preparing your filing.' },
  in_processing: { label: 'In Processing', body: 'Your order is with our account manager and moving into the filing pipeline.' },
  submitted: { label: 'Submitted to State', body: 'Your formation paperwork has been submitted to the state.' },
  state_processing: { label: 'State Processing', body: 'The state is now processing your filing.' },
  filed: { label: 'Officially Filed', body: 'Your business has officially been filed. Documents are being prepared.' },
  completed: { label: 'Complete', body: 'Your formation is complete. All documents are available in your dashboard.' },
  cancelled: { label: 'Order Cancelled', body: 'This order has been cancelled. Contact us if this was unexpected.' },
}

const OrderStatusUpdateEmail = ({
  name, businessName, entityType, state, orderId, status, statusLabel, message,
}: OrderStatusUpdateProps) => {
  const meta = (status && STATUS_MESSAGES[status]) || { label: statusLabel || 'Status Update', body: message || 'Your order status has been updated.' }
  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>{meta.label} — {businessName || 'your filing'}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Heading style={brand}>{SITE_NAME}</Heading>
          </Section>
          <Heading style={h1}>{meta.label}</Heading>
          <Text style={text}>{name ? `Hi ${name}, ` : ''}{message || meta.body}</Text>

          <Section style={card}>
            <Row label="Business Name" value={businessName} />
            <Row label="Entity Type" value={entityType} />
            <Row label="State" value={state} />
            <Row label="Status" value={meta.label} />
            <Row label="Order ID" value={orderId} last />
          </Section>

          <Section style={{ textAlign: 'center', margin: '28px 0 8px' }}>
            <Button href="https://www.ezbiz-fs.com/dashboard" style={button}>
              View Your Dashboard
            </Button>
          </Section>

          <Hr style={hr} />
          <Text style={footer}>
            Questions? Reply to this email or contact info@ezbiz-fs.com.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const Row = ({ label, value, last }: { label: string; value?: string; last?: boolean }) => (
  <div style={{ display: 'table', width: '100%' }}>
    <div style={{ display: 'table-row' }}>
      <div style={{ display: 'table-cell', padding: '10px 14px', background: '#f9fafb', width: 160, borderBottom: last ? 'none' : '1px solid #e5e7eb', fontWeight: 600, fontSize: 13, color: '#1f2a44' }}>{label}</div>
      <div style={{ display: 'table-cell', padding: '10px 14px', borderBottom: last ? 'none' : '1px solid #e5e7eb', fontSize: 13, color: '#1f2937' }}>{value || '—'}</div>
    </div>
  </div>
)

export const template = {
  component: OrderStatusUpdateEmail,
  subject: (d: Record<string, any>) => {
    const meta = (d.status && STATUS_MESSAGES[d.status]) || { label: d.statusLabel || 'Status Update' }
    return `${meta.label} — ${d.businessName || 'Your EZ Biz Filing'}`
  },
  displayName: 'Order status update (customer)',
  previewData: {
    name: 'Jane',
    businessName: 'Talavera Holdings LLC',
    entityType: 'LLC',
    state: 'Texas',
    orderId: 'ord_abc123',
    status: 'submitted',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }
const container = { padding: '24px', maxWidth: 600, margin: '0 auto' }
const header = { padding: '8px 0 16px', borderBottom: `2px solid ${BRAND_GOLD}` }
const brand = { fontFamily: 'Playfair Display, Georgia, serif', fontSize: 20, color: BRAND_NAVY, margin: 0, letterSpacing: '0.04em' }
const h1 = { fontFamily: 'Playfair Display, Georgia, serif', fontSize: 24, color: BRAND_NAVY, margin: '24px 0 12px' }
const text = { fontSize: 14, color: '#374151', lineHeight: 1.6, margin: '0 0 20px' }
const card = { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden', margin: '8px 0' }
const button = { backgroundColor: BRAND_NAVY, color: '#ffffff', padding: '12px 28px', borderRadius: 6, fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'inline-block' }
const hr = { borderColor: '#e5e7eb', margin: '24px 0 12px' }
const footer = { fontSize: 12, color: '#6b7280', margin: 0 }
