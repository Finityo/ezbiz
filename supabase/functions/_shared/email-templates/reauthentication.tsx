/// <reference types="npm:@types/react@18.3.1" />

import * as React from 'npm:react@18.3.1'

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Preview,
  Text,
} from 'npm:@react-email/components@0.0.22'

interface ReauthenticationEmailProps {
  token: string
}

export const ReauthenticationEmail = ({ token }: ReauthenticationEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Your verification code for EZ BIZ FILE SERVICE</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://umzyxzhqlrykygjbeusu.supabase.co/storage/v1/object/public/email-assets/logo.png?v=1"
          alt="EZ BIZ FILE SERVICE"
          width="180"
          style={logo}
        />
        <Heading style={h1}>Confirm your identity</Heading>
        <Text style={text}>Use the code below to verify your identity:</Text>
        <Text style={codeStyle}>{token}</Text>
        <Text style={divider}>—</Text>
        <Text style={footer}>
          This code will expire shortly. If you didn't request this, you can safely ignore this email.
        </Text>
        <Text style={footer}>© EZ BIZ FILE SERVICE · ezbizs.com</Text>
      </Container>
    </Body>
  </Html>
)

export default ReauthenticationEmail

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
const codeStyle = {
  fontFamily: "'Courier New', Courier, monospace",
  fontSize: '28px',
  fontWeight: 'bold' as const,
  color: 'hsl(220, 25%, 12%)',
  backgroundColor: 'hsl(220, 15%, 95%)',
  padding: '16px 24px',
  borderRadius: '8px',
  border: '1px solid hsl(220, 15%, 88%)',
  display: 'inline-block' as const,
  margin: '0 0 30px',
  letterSpacing: '4px',
}
const divider = { fontSize: '14px', color: 'hsl(220, 15%, 88%)', margin: '30px 0 10px', textAlign: 'center' as const }
const footer = { fontSize: '12px', color: '#999999', margin: '4px 0', textAlign: 'center' as const }
