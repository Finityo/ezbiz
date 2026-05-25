import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = 'EZ BIZ FILE SERVICE'
const BRAND_NAVY = '#23304a'
const BRAND_GOLD = '#c9a84c'

interface ConsultationConfirmationProps {
  name?: string
  consultationType?: string
  businessType?: string
}

const ConsultationConfirmationEmail = ({
  name, consultationType, businessType,
}: ConsultationConfirmationProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>We received your request — we'll be in touch within 24 hours</Preview>
    <Body style={main}>
      <Container style={container}>
        <Section style={header}>
          <Heading style={brand}>{SITE_NAME}</Heading>
        </Section>
        <Heading style={h1}>Thanks{name ? `, ${name}` : ''} — we got your request</Heading>
        <Text style={text}>
          Your request has been received. A member of our team will reach out within
          one business day to confirm details and schedule a time that works for you.
        </Text>
        {(consultationType || businessType) ? (
          <Section style={card}>
            {consultationType ? (
              <Text style={cardRow}>
                <strong>Consultation Type:</strong> {consultationType}
              </Text>
            ) : null}
            {businessType ? (
              <Text style={cardRow}>
                <strong>Business Type:</strong> {businessType}
              </Text>
            ) : null}
          </Section>
        ) : null}
        <Text style={text}>
          In the meantime, you can explore our services and pricing on our website.
        </Text>
        <Section style={{ textAlign: 'center', margin: '24px 0 8px' }}>
          <Button href="https://www.ezbiz-fs.com" style={button}>
            Visit EZ Biz File Service
          </Button>
        </Section>
        <Hr style={hr} />
        <Text style={footer}>
          Questions? Reply to this email or contact christian@ezbiz-fs.com.
        </Text>
      </Container>
    </Body>
  </Html>
)

export const template = {
  component: ConsultationConfirmationEmail,
  subject: 'We received your request — EZ Biz File Service',
  displayName: 'Consultation confirmation (customer)',
  previewData: {
    name: 'Jane',
    consultationType: 'Video Call',
    businessType: 'LLC',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }
const container = { padding: '24px', maxWidth: 600, margin: '0 auto' }
const header = { padding: '8px 0 16px', borderBottom: `2px solid ${BRAND_GOLD}` }
const brand = { fontFamily: 'Playfair Display, Georgia, serif', fontSize: 20, color: BRAND_NAVY, margin: 0, letterSpacing: '0.04em' }
const h1 = { fontFamily: 'Playfair Display, Georgia, serif', fontSize: 24, color: BRAND_NAVY, margin: '24px 0 12px' }
const text = { fontSize: 14, color: '#374151', lineHeight: 1.6, margin: '0 0 16px' }
const card = { background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: '12px 16px', margin: '8px 0 16px' }
const cardRow = { fontSize: 13, color: '#1f2937', margin: '4px 0' }
const button = { backgroundColor: BRAND_NAVY, color: '#ffffff', padding: '12px 28px', borderRadius: 6, fontSize: 14, fontWeight: 600, textDecoration: 'none', display: 'inline-block' }
const hr = { borderColor: '#e5e7eb', margin: '24px 0 12px' }
const footer = { fontSize: 12, color: '#6b7280', margin: 0 }
