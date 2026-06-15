import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'EZ BIZ FILE SERVICE'
const BRAND_NAVY = '#23304a'
const BRAND_GOLD = '#c9a84c'

interface OrderConfirmationProps {
  name?: string
  businessName?: string
  entityType?: string
  state?: string
  orderId?: string
  amountTotal?: number | string
  receiptUrl?: string
}

const fmtMoney = (v?: number | string) => {
  if (v === undefined || v === null || v === '') return '—'
  const n = typeof v === 'number' ? v : Number(v)
  if (Number.isNaN(n)) return String(v)
  return `$${n.toFixed(2)}`
}

const OrderConfirmationEmail = ({
  name, businessName, entityType, state, orderId, amountTotal, receiptUrl,
}: OrderConfirmationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Payment received — your filing is being prepared</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={brand}>{SITE_NAME}</Heading>
        </Section>
        <Heading style={h1}>Thank you{name ? `, ${name}` : ''} — payment received</Heading>
        <Text style={text}>
          We've received your payment and your business filing is now in our queue.
          Our team will begin preparing your documents and submit them to the state
          on your behalf. You'll receive status updates by email as your order moves
          through each stage.
        </Text>

        <Section style={card}>
          <Row label="Business Name" value={businessName} />
          <Row label="Entity Type" value={entityType} />
          <Row label="State" value={state} />
          <Row label="Total Paid" value={fmtMoney(amountTotal)} />
          <Row label="Order ID" value={orderId} last />
        </Section>

        <Section style={{ textAlign: 'center', margin: '28px 0 8px' }}>
          <Button href="https://www.ezbiz-fs.com/dashboard" style={button}>
            View Your Dashboard
          </Button>
        </Section>

        {receiptUrl ? (
          <Text style={subtle}>
            Stripe receipt: <a href={receiptUrl} style={link}>{receiptUrl}</a>
          </Text>
        ) : null}

        <Hr style={hr} />
        <Text style={footer}>
          Questions? Reply to this email or contact us at info@ezbiz-fs.com.
        </Text>
      </Container>
    </Body>
  </Html>
)

const Row = ({ label, value, last }: { label: string; value?: string; last?: boolean }) => (
  <div style={{ display: 'table', width: '100%' }}>
    <div style={{ display: 'table-row' }}>
      <div style={{ display: 'table-cell', padding: '10px 14px', background: '#f9fafb', width: 160, borderBottom: last ? 'none' : '1px solid #e5e7eb', fontWeight: 600, fontSize: 13, color: '#1f2a44' }}>{label}</div>
      <div style={{ display: 'table-cell', padding: '10px 14px', borderBottom: last ? 'none' : '1px solid #e5e7eb', fontSize: 13, color: '#1f2937' }}>{value || '—'}</div>
    </div>
  </div>
)

export const template = {
  component: OrderConfirmationEmail,
  subject: 'Payment received — your filing is being prepared',
  displayName: 'Order confirmation (customer)',
  previewData: {
    name: 'Jane',
    businessName: 'Talavera Holdings LLC',
    entityType: 'LLC',
    state: 'Texas',
    orderId: 'ord_abc123',
    amountTotal: 299,
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
const link = { color: BRAND_NAVY, textDecoration: 'underline' }
const subtle = { fontSize: 12, color: '#6b7280', margin: '12px 0 0' }
const hr = { borderColor: '#e5e7eb', margin: '24px 0 12px' }
const footer = { fontSize: 12, color: '#6b7280', margin: 0 }
