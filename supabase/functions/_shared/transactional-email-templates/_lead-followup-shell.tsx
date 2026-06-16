import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Html, Preview, Section, Text, Hr,
} from 'npm:@react-email/components@0.0.22'

export const SITE_NAME = 'EZ BIZ FILE SERVICE'
export const SITE_URL = 'https://www.ezbiz-fs.com'
export const SUPPORT_EMAIL = 'support@ezbiz-fs.com'

export interface LeadFollowupProps {
  firstName?: string
  businessName?: string
  state?: string
  entityType?: string
  packageName?: string
  resumeUrl?: string
}

interface BaseProps extends LeadFollowupProps {
  preview: string
  heading: string
  intro: React.ReactNode
  body: React.ReactNode
  ctaLabel?: string
  ctaHref?: string
  closing?: React.ReactNode
}

export const FollowupShell = ({
  preview, heading, intro, body, ctaLabel, ctaHref, closing, firstName,
}: BaseProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>{preview}</Preview>
    <Body style={main}>
      <Container style={container}>
        <Heading style={h1}>{heading}</Heading>
        <Text style={p}>Hi{firstName ? ` ${firstName}` : ' there'},</Text>
        <Text style={p}>{intro}</Text>
        <Section style={card}>{body}</Section>
        {ctaLabel && ctaHref ? (
          <Section style={{ textAlign: 'center', marginTop: 24 }}>
            <Button href={ctaHref} style={btn}>{ctaLabel}</Button>
          </Section>
        ) : null}
        {closing ? <Text style={p}>{closing}</Text> : null}
        <Hr style={{ borderColor: '#e5e7eb', margin: '24px 0 12px' }} />
        <Text style={footer}>
          Questions? Reply to this email or contact us at {SUPPORT_EMAIL}.<br />
          {SITE_NAME} — <a href={SITE_URL} style={{ color: '#1f2a44' }}>{SITE_URL.replace('https://', '')}</a>
        </Text>
      </Container>
    </Body>
  </Html>
)

export const SummaryLine = ({ label, value }: { label: string; value?: string }) =>
  value ? (
    <Text style={{ margin: '4px 0', fontSize: 14, color: '#1f2937' }}>
      <strong style={{ color: '#1f2a44' }}>{label}:</strong> {value}
    </Text>
  ) : null

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif' }
const container = { padding: '24px', maxWidth: 600, margin: '0 auto' }
const h1 = { fontFamily: 'Playfair Display, Georgia, serif', fontSize: 22, color: '#1f2a44', margin: '0 0 16px' }
const p = { fontSize: 15, color: '#374151', margin: '0 0 14px', lineHeight: 1.55 }
const card = { background: '#f9fafb', border: '1px solid #e5e7eb', borderRadius: 8, padding: '16px 18px', margin: '8px 0 4px' }
const btn = { background: '#c9a44a', color: '#1f2a44', padding: '12px 24px', borderRadius: 6, fontWeight: 700, fontSize: 14, textDecoration: 'none' }
const footer = { fontSize: 12, color: '#6b7280', margin: 0, lineHeight: 1.6 }
