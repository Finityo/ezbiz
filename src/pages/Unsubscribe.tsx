import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import Navigation from '@/components/Navigation'
import Footer from '@/components/Footer'
import SEOHead from '@/components/SEOHead'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CheckCircle2, AlertTriangle } from 'lucide-react'

const SUPABASE_URL = import.meta.env.VITE_SUPABASE_URL as string
const SUPABASE_ANON_KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string

type State =
  | { kind: 'loading' }
  | { kind: 'valid'; email?: string }
  | { kind: 'already' }
  | { kind: 'invalid'; reason: string }
  | { kind: 'submitting' }
  | { kind: 'done' }

export default function Unsubscribe() {
  const [params] = useSearchParams()
  const token = params.get('token') || ''
  const [state, setState] = useState<State>({ kind: 'loading' })

  useEffect(() => {
    if (!token) {
      setState({ kind: 'invalid', reason: 'Missing unsubscribe token.' })
      return
    }
    ;(async () => {
      try {
        const res = await fetch(
          `${SUPABASE_URL}/functions/v1/handle-email-unsubscribe?token=${encodeURIComponent(token)}`,
          { headers: { apikey: SUPABASE_ANON_KEY } },
        )
        const data = await res.json().catch(() => ({}))
        if (!res.ok) {
          setState({ kind: 'invalid', reason: data?.error || 'Invalid link.' })
          return
        }
        if (data?.alreadyUnsubscribed || data?.already_unsubscribed) {
          setState({ kind: 'already' })
          return
        }
        setState({ kind: 'valid', email: data?.email })
      } catch {
        setState({ kind: 'invalid', reason: 'Unable to validate link.' })
      }
    })()
  }, [token])

  const confirm = async () => {
    setState({ kind: 'submitting' })
    try {
      const res = await fetch(`${SUPABASE_URL}/functions/v1/handle-email-unsubscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', apikey: SUPABASE_ANON_KEY },
        body: JSON.stringify({ token }),
      })
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        setState({ kind: 'invalid', reason: data?.error || 'Could not unsubscribe.' })
        return
      }
      setState({ kind: 'done' })
    } catch {
      setState({ kind: 'invalid', reason: 'Network error.' })
    }
  }

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead title="Unsubscribe" description="Manage your email preferences." path="/unsubscribe" noIndex />
      <Navigation />
      <main className="flex-grow container mx-auto px-4 py-16">
        <Card className="max-w-md mx-auto">
          <CardHeader>
            <CardTitle>Email preferences</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {state.kind === 'loading' && (
              <p className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Validating your link…
              </p>
            )}
            {state.kind === 'valid' && (
              <>
                <p className="text-sm text-muted-foreground">
                  Click below to unsubscribe {state.email ? <strong>{state.email}</strong> : 'this address'} from EZ BIZ emails.
                </p>
                <Button onClick={confirm} className="w-full">Confirm unsubscribe</Button>
              </>
            )}
            {state.kind === 'submitting' && (
              <p className="flex items-center gap-2 text-muted-foreground">
                <Loader2 className="h-4 w-4 animate-spin" /> Unsubscribing…
              </p>
            )}
            {state.kind === 'done' && (
              <p className="flex items-center gap-2 text-foreground">
                <CheckCircle2 className="h-5 w-5 text-primary" /> You've been unsubscribed.
              </p>
            )}
            {state.kind === 'already' && (
              <p className="flex items-center gap-2 text-foreground">
                <CheckCircle2 className="h-5 w-5 text-primary" /> This address is already unsubscribed.
              </p>
            )}
            {state.kind === 'invalid' && (
              <p className="flex items-center gap-2 text-destructive">
                <AlertTriangle className="h-5 w-5" /> {state.reason}
              </p>
            )}
          </CardContent>
        </Card>
      </main>
      <Footer />
    </div>
  )
}
