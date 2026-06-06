import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Section, Text, Row, Column, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'EZ BIZ File Service'
const SITE_URL = 'https://www.ezbiz-fs.com'

interface Props {
  orderId?: string
  orderNumber?: number | string
  customerName?: string
  customerEmail?: string
  businessName?: string
  entityType?: string
  state?: string
  packageName?: string
  totalAmount?: number
}

const Field = ({ label, value }: { label: string; value?: string }) => (
  <Row>
    <Column style={{ padding: '10px 14px', background: '#f9fafb', width: 170, borderBottom: '1px solid #e5e7eb', fontWeight: 600, fontSize: 13, color: '#1f2a44' }}>{label}</Column>
    <Column style={{ padding: '10px 14px', borderBottom: '1px solid #e5e7eb', fontSize: 13, color: '#1f2937' }}>{value || '—'}</Column>
  </Row>
)

const Email = ({ orderId, orderNumber, customerName, customerEmail, businessName, entityType, state, packageName, totalAmount }: Props) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New paid order #{orderNumber ?? ''} — review & send to account manager</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>✅ New Paid Order — {SITE_NAME}</Heading>
        <Text style={lead}>A customer just completed checkout. Review the order and click "Send to Account Manager" in the admin dashboard to forward it to CorpNet.</Text>
        <Section style={card}>
          <Field label="Order #" value={orderNumber != null ? String(orderNumber) : undefined} />
          <Field label="Customer" value={customerName} />
          <Field label="Email" value={customerEmail} />
          <Field label="Business Name" value={businessName} />
          <Field label="Entity Type" value={entityType} />
          <Field label="State" value={state} />
          <Field label="Package" value={packageName} />
          <Field label="Total Paid" value={totalAmount != null ? `$${Number(totalAmount).toFixed(2)}` : undefined} />
        </Section>
        <Section style={{ textAlign: 'center', marginTop: 24 }}>
          <Button href={`${SITE_URL}/admin?order=${orderId ?? ''}`} style={btn}>Review Order in Admin</Button>
        </Section>
        <Hr style={{ borderColor: '#e5e7eb', margin: '24px 0 12px' }} />
        <Text style={footer}>This is an internal notification. Stripe sent the customer their receipt automatically.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: Email,
  subject: (d: Record<string, any>) =>
    `🟢 Paid Order #${d.orderNumber ?? ''} — ${d.businessName || d.customerEmail || 'New Customer'}`,
  displayName: 'Admin paid-order notification',
  previewData: {
    orderId: 'abc-123',
    orderNumber: 1000042,
    customerName: 'Jane Doe',
    customerEmail: 'jane@example.com',
    businessName: 'Acme Holdings LLC',
    entityType: 'LLC',
    state: 'Texas',
    packageName: 'Gold',
    totalAmount: 449,
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }
const container = { padding: '24px', maxWidth: 600, margin: '0 auto' }
const h1 = { fontFamily: 'Playfair Display, Georgia, serif', fontSize: 22, color: '#1f2a44', margin: '0 0 12px' }
const lead = { fontSize: 14, color: '#374151', margin: '0 0 20px', lineHeight: 1.5 }
const card = { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }
const btn = { background: '#c9a44a', color: '#1f2a44', padding: '12px 22px', borderRadius: 6, fontWeight: 700, fontSize: 14, textDecoration: 'none' }
const footer = { fontSize: 12, color: '#6b7280', margin: 0 }
