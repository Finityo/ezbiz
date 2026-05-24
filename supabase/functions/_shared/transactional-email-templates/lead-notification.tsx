import * as React from 'npm:react@18.3.1'
import {
  Body, Container, Head, Heading, Html, Preview, Section, Text, Row, Column, Hr,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'EZ BIZ File Service'

interface LeadNotificationProps {
  source?: string
  name?: string
  email?: string
  phone?: string
  business_type?: string
  message?: string
  page?: string
}

const Field = ({ label, value }: { label: string; value?: string }) => (
  <Row>
    <Column style={{ padding: '10px 14px', background: '#f9fafb', width: 150, borderBottom: '1px solid #e5e7eb', fontWeight: 600, fontSize: 13, color: '#1f2a44' }}>{label}</Column>
    <Column style={{ padding: '10px 14px', borderBottom: '1px solid #e5e7eb', fontSize: 13, color: '#1f2937' }}>{value || '—'}</Column>
  </Row>
)

const LeadNotificationEmail = ({ source, name, email, phone, business_type, message, page }: LeadNotificationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>New {source || 'lead'} — {name || email || 'inquiry'}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>New Lead — {SITE_NAME}</Heading>
        <Section style={card}>
          <Field label="Source" value={source} />
          <Field label="Name" value={name} />
          <Field label="Email" value={email} />
          <Field label="Phone" value={phone} />
          <Field label="Business Type" value={business_type} />
          <Field label="Page" value={page} />
          {message ? <Field label="Message" value={message} /> : null}
        </Section>
        <Hr style={{ borderColor: '#e5e7eb', margin: '24px 0 12px' }} />
        <Text style={footer}>Reply directly to this email to respond to the lead.</Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: LeadNotificationEmail,
  subject: (d: Record<string, any>) =>
    `New ${d.source || 'lead'} — ${d.name || d.email || 'inquiry'}`,
  displayName: 'Internal lead notification',
  previewData: {
    source: 'order-flow',
    name: 'Jane Doe',
    email: 'jane@example.com',
    phone: '555-0100',
    business_type: 'LLC',
    page: '/order/checkout',
    message: 'Interested in forming an LLC in Texas.',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }
const container = { padding: '24px', maxWidth: 600, margin: '0 auto' }
const h1 = { fontFamily: 'Playfair Display, Georgia, serif', fontSize: 22, color: '#1f2a44', margin: '0 0 16px' }
const card = { background: '#ffffff', border: '1px solid #e5e7eb', borderRadius: 8, overflow: 'hidden' }
const footer = { fontSize: 12, color: '#6b7280', margin: 0 }
