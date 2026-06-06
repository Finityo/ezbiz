/// <reference types="npm:@types/react@18.3.1" />
import * as React from 'npm:react@18.3.1'
import {
  Body, Button, Container, Head, Heading, Hr, Html, Preview, Section, Text,
} from 'npm:@react-email/components@0.0.22'
import type { TemplateEntry } from './registry.ts'

const SITE_NAME = "EZ BIZ FILE SERVICE, LLC"

interface AccountManagerHandoffProps {
  orderId?: string
  customerName?: string
  customerEmail?: string
  businessName?: string
  entityType?: string
  state?: string
  packageName?: string
  filingSpeed?: string
  einService?: boolean
  totalAmount?: number
  csvDownloadUrl?: string
  adminDetailUrl?: string
}

const AccountManagerHandoffEmail = ({
  orderId,
  customerName,
  customerEmail,
  businessName,
  entityType,
  state,
  packageName,
  filingSpeed,
  einService,
  totalAmount,
  csvDownloadUrl,
  adminDetailUrl,
}: AccountManagerHandoffProps) => {
  const fmtAmount = totalAmount != null ? `$${Number(totalAmount).toFixed(2)}` : '—'

  return (
    <Html lang="en" dir="ltr">
      <Head />
      <Preview>New paid order ready for processing — {businessName || 'New filing'}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={brandBar}>
            <Text style={brandText}>{SITE_NAME}</Text>
            <Text style={brandTag}>Account Manager Handoff</Text>
          </Section>

          <Heading style={h1}>New paid order ready for processing</Heading>
          <Text style={text}>
            A customer has just completed payment. Full order details are summarized
            below, with the complete CorpNet-format CSV available for download.
          </Text>

          <Section style={card}>
            <Row label="Order ID" value={orderId ? orderId.substring(0, 8) + '…' : '—'} />
            <Row label="Customer" value={customerName || '—'} />
            <Row label="Email" value={customerEmail || '—'} />
            <Row label="Business" value={businessName || '—'} />
            <Row label="Entity Type" value={(entityType || '—').toUpperCase()} />
            <Row label="State" value={(state || '—').toUpperCase()} />
            <Row label="Package" value={packageName || '—'} />
            <Row label="Filing Speed" value={filingSpeed || 'standard'} />
            <Row label="EIN Service" value={einService ? 'Yes' : 'No'} />
            <Row label="Total Paid" value={fmtAmount} />
          </Section>

          <Section style={{ textAlign: 'center', margin: '28px 0' }}>
            <Text style={hint}>
              📎 The complete order CSV is attached to this email.
            </Text>
            {csvDownloadUrl && (
              <>
                <Button href={csvDownloadUrl} style={btnPrimary}>
                  Download Order CSV (backup link)
                </Button>
                <Text style={hint}>Backup signed link · expires in 7 days</Text>
              </>
            )}
          </Section>

          {adminDetailUrl && (
            <Section style={{ textAlign: 'center', margin: '12px 0 28px' }}>
              <Button href={adminDetailUrl} style={btnSecondary}>
                Open in Admin Dashboard
              </Button>
            </Section>
          )}

          <Hr style={hr} />
          <Text style={footer}>
            Order status has been automatically moved to <strong>In Processing</strong>.
            Please file with the state and upload completed documents back into the
            admin dashboard.
          </Text>
        </Container>
      </Body>
    </Html>
  )
}

const Row = ({ label, value }: { label: string; value: string }) => (
  <div style={rowWrap}>
    <Text style={rowLabel}>{label}</Text>
    <Text style={rowValue}>{value}</Text>
  </div>
)

export const template = {
  component: AccountManagerHandoffEmail,
  subject: (data: Record<string, any>) =>
    `New paid order: ${data?.businessName || 'New filing'} — ${(data?.state || '').toUpperCase()} ${(data?.entityType || '').toUpperCase()}`,
  displayName: 'Account manager order handoff',
  previewData: {
    orderId: '8f2b9c1a-1234-5678-90ab-cdef12345678',
    customerName: 'Maria Talavera',
    customerEmail: 'maria@example.com',
    businessName: 'Talavera Holdings LLC',
    entityType: 'llc',
    state: 'tx',
    packageName: 'Premier',
    filingSpeed: 'express',
    einService: true,
    totalAmount: 549,
    csvDownloadUrl: 'https://example.com/sample.csv',
    adminDetailUrl: 'https://www.ezbiz-fs.com/admin',
  },
} satisfies TemplateEntry

const main = { backgroundColor: '#ffffff', fontFamily: 'Inter, Arial, sans-serif', margin: 0, padding: 0 }
const container = { maxWidth: '600px', margin: '0 auto', padding: '24px' }
const brandBar = { borderBottom: '3px solid hsl(45, 95%, 55%)', paddingBottom: '12px', marginBottom: '24px' }
const brandText = { fontFamily: 'Georgia, "Playfair Display", serif', fontSize: '20px', fontWeight: 700, color: 'hsl(220, 25%, 18%)', margin: 0 }
const brandTag = { fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' as const, color: '#8a8a8a', margin: '4px 0 0' }
const h1 = { fontFamily: 'Georgia, "Playfair Display", serif', fontSize: '24px', fontWeight: 700, color: 'hsl(220, 25%, 18%)', margin: '0 0 16px' }
const text = { fontSize: '14px', color: '#444', lineHeight: '1.6', margin: '0 0 20px' }
const card = { backgroundColor: '#FAF9F6', border: '1px solid #eee', borderRadius: '8px', padding: '16px 20px', margin: '20px 0' }
const rowWrap = { display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #efece6' }
const rowLabel = { fontSize: '13px', color: '#666', margin: 0, fontWeight: 500 }
const rowValue = { fontSize: '13px', color: '#1a1a1a', margin: 0, fontWeight: 600, textAlign: 'right' as const }
const btnPrimary = { backgroundColor: 'hsl(45, 95%, 55%)', color: 'hsl(220, 25%, 18%)', padding: '12px 24px', borderRadius: '6px', fontWeight: 700, textDecoration: 'none', fontSize: '14px', display: 'inline-block' }
const btnSecondary = { backgroundColor: 'hsl(220, 25%, 18%)', color: '#ffffff', padding: '10px 22px', borderRadius: '6px', fontWeight: 600, textDecoration: 'none', fontSize: '13px', display: 'inline-block' }
const hint = { fontSize: '11px', color: '#999', margin: '8px 0 0' }
const hr = { borderColor: '#eee', margin: '24px 0' }
const footer = { fontSize: '12px', color: '#666', lineHeight: '1.5', margin: 0 }
