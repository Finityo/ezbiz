/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface InviteEmailProps {
  siteName: string
  siteUrl: string
  confirmationUrl: string
}

export const InviteEmail = ({
  siteName,
  siteUrl,
  confirmationUrl,
}: InviteEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>You've been invited to EZ BIZ FILE SERVICE</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://umzyxzhqlrykygjbeusu.supabase.co/storage/v1/object/public/email-assets/logo.png?v=1"
          alt="EZ BIZ FILE SERVICE"
          width="180"
          style={logo}
        />
        <Heading style={h1}>You've been invited</Heading>
        <Text style={text}>
          You've been invited to join{' '}
          <Link href={siteUrl} style={link}>
            <strong>EZ BIZ FILE SERVICE</strong>
          </Link>
          . Click below to accept the invitation and create your account.
        </Text>
        <Button style={button} href={confirmationUrl}>
          Accept Invitation
        </Button>
        <Text style={divider}>—</Text>
        <Text style={footer}>
          If you weren't expecting this invitation, you can safely ignore this email.
        </Text>
        <Text style={footer}>© EZ BIZ FILE SERVICE · ezbizs.com</Text>
      </Container>
    </Body>
  </Html>
)

export default InviteEmail

const main = { backgroundColor: '#ffffff', fontFamily: "'Inter', 'Segoe UI', Arial, sans-serif" }
const container = { padding: '40px 30px', maxWidth: '520px', margin: '0 auto' }
const logo = { margin: '0 0 30px 0' }
const h1 = {
  fontFamily: "'Playfair Display', Georgia, 'Times New Roman', serif",
  fontSize: '26px',
  fontWeight: 'bold' as const,
  color: 'hsl(220, 25%, 12%)',
  margin: '0 0 20px',
}
const text = {
  fontSize: '15px',
  color: 'hsl(220, 12%, 42%)',
  lineHeight: '1.6',
  margin: '0 0 20px',
}
const link = { color: 'hsl(38, 45%, 52%)', textDecoration: 'underline' }
const button = {
  backgroundColor: 'hsl(220, 30%, 18%)',
  color: 'hsl(40, 20%, 98%)',
  fontSize: '15px',
  fontWeight: '600' as const,
  borderRadius: '8px',
  padding: '14px 28px',
  textDecoration: 'none',
  display: 'inline-block' as const,
}
const divider = { fontSize: '14px', color: 'hsl(220, 15%, 88%)', margin: '30px 0 10px', textAlign: 'center' as const }
const footer = { fontSize: '12px', color: '#999999', margin: '4px 0', textAlign: 'center' as const }
