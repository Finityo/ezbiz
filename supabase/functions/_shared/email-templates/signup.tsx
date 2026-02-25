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

interface SignupEmailProps {
  siteName: string
  siteUrl: string
  recipient: string
  confirmationUrl: string
}

export const SignupEmail = ({
  siteName,
  siteUrl,
  recipient,
  confirmationUrl,
}: SignupEmailProps) => (
  <Html lang="en" dir="ltr">
    <Head />
    <Preview>Welcome to EZ BIZ FILE SERVICE — confirm your email</Preview>
    <Body style={main}>
      <Container style={container}>
        <Img
          src="https://umzyxzhqlrykygjbeusu.supabase.co/storage/v1/object/public/email-assets/logo.png?v=1"
          alt="EZ BIZ FILE SERVICE"
          width="180"
          style={logo}
        />
        <Heading style={h1}>Welcome aboard!</Heading>
        <Text style={text}>
          Thanks for signing up with{' '}
          <Link href={siteUrl} style={link}>
            <strong>EZ BIZ FILE SERVICE</strong>
          </Link>
          . We're here to make your business formation simple and stress-free.
        </Text>
        <Text style={text}>
          Please confirm your email address (
          <Link href={`mailto:${recipient}`} style={link}>
            {recipient}
          </Link>
          ) to get started:
        </Text>
        <Button style={button} href={confirmationUrl}>
          Confirm My Email
        </Button>
        <Text style={divider}>—</Text>
        <Text style={footer}>
          If you didn't create an account, you can safely ignore this email.
        </Text>
        <Text style={footer}>© EZ BIZ FILE SERVICE · ezbizs.com</Text>
      </Container>
    </Body>
  </Html>
)

export default SignupEmail

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
