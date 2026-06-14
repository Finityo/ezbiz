import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Loader2, Zap } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";

/**
 * ADMIN-ONLY $1 Live Payment Smoke Test
 *
 * Invokes the real `create-checkout` edge function with `smokeTest: true`.
 * The edge function re-verifies admin role server-side, swaps the line items
 * for a single $1 live price (STRIPE_SMOKE_PRICE_ID), and otherwise runs the
 * full production payment pipeline (order row → webhook → verify-payment →
 * /order-success → emails → GA4).
 *
 * NOT exposed in public navigation. Cleanup instructions are in the docs.
 */
export default function LiveSmokeTest() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  const run = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          smokeTest: true,
          successPath: "/order-success",
          cancelPath: "/admin/live-smoke-test",
        },
      });
      if (error) throw error;
      const url = (data as { url?: string } | null)?.url;
      if (!url) throw new Error("No checkout URL returned.");
      // Redirect this tab to Stripe so the success redirect lands us back
      // on /order-success with session_id (identical to the customer flow).
      window.location.href = url;
    } catch (err: any) {
      console.error("Smoke test invocation failed", err);
      toast({
        title: "Smoke test failed to start",
        description: err?.message || "Unknown error",
        variant: "destructive",
      });
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <Helmet>
        <title>Live Smoke Test (Admin) — EZ BIZ</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>
      <div className="max-w-2xl mx-auto space-y-6">
        <Link
          to="/admin"
          className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4 mr-1" /> Back to Admin
        </Link>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-primary" />
              $1 Live Payment Smoke Test
            </CardTitle>
            <CardDescription>
              Production live-Stripe end-to-end validation. Charges a real $1
              to your card via the real <code>create-checkout</code> path.
              Refund in the Stripe Dashboard after verification.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="rounded-md border border-amber-300 bg-amber-50 p-4 text-sm text-amber-900 flex gap-3">
              <AlertTriangle className="h-5 w-5 shrink-0 mt-0.5" />
              <div className="space-y-1">
                <p className="font-semibold">Before clicking:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>
                    Confirm <code>STRIPE_SMOKE_PRICE_ID</code> secret is set
                    to a live $1 price.
                  </li>
                  <li>This will charge a real card. Refund afterward.</li>
                  <li>
                    The created order will be tagged
                    <code> source=ezbiz_admin_smoke_test </code> and have an
                    <code> order_events.event_type=smoke_test_checkout_started </code>
                    audit row.
                  </li>
                </ul>
              </div>
            </div>

            <Button onClick={run} disabled={loading} size="lg" className="w-full">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Creating live checkout…
                </>
              ) : (
                <>
                  <Zap className="h-4 w-4 mr-2" />
                  Run $1 Live Smoke Test
                </>
              )}
            </Button>

            <p className="text-xs text-muted-foreground">
              You'll be redirected to Stripe Checkout. After successful payment
              you'll return to <code>/order-success?session_id=…</code>, which
              triggers <code>verify-payment</code>, the customer + admin
              emails, and the GA4 <code>order_confirmed</code> event.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
