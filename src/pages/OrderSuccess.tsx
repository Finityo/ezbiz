import SEOHead from "@/components/SEOHead";
import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, FileText, ArrowRight, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { supabase } from "@/integrations/supabase/client";

export default function OrderSuccess() {
  const [searchParams] = useSearchParams();
  const sessionId = searchParams.get("session_id");
  const [verifying, setVerifying] = useState<boolean>(Boolean(sessionId));

  // Fallback: ask the backend to reconcile this Stripe session in case the
  // checkout.session.completed webhook hasn't reached us yet. Idempotent — safe
  // to call regardless of whether the webhook already processed the order.
  useEffect(() => {
    if (!sessionId) return;
    let cancelled = false;
    (async () => {
      try {
        await supabase.functions.invoke("verify-payment", { body: { sessionId } });
      } catch (err) {
        console.error("verify-payment fallback failed", err);
      } finally {
        if (!cancelled) setVerifying(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [sessionId]);

  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead title="Order Confirmed" description="Your order has been confirmed." path="/order-success" noIndex />
      <Navigation />
      <div className="flex-grow flex items-center justify-center bg-gradient-to-br from-primary/5 via-background to-accent/5 py-16 px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-lg w-full"
        >
          <Card className="p-8 text-center space-y-6">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
              className="mx-auto w-16 h-16 rounded-full bg-green-100 flex items-center justify-center"
            >
              <CheckCircle className="h-10 w-10 text-green-600" />
            </motion.div>

            <div>
              <h1 className="text-2xl font-bold mb-2">Payment Confirmed!</h1>
              <p className="text-muted-foreground">
                Your business formation order has been received and is being processed.
              </p>
            </div>

            <div className="space-y-3 text-sm text-left bg-muted/50 rounded-lg p-4">
              <div className="flex items-start gap-3">
                {verifying ? (
                  <Loader2 className="h-4 w-4 text-primary mt-0.5 shrink-0 animate-spin" />
                ) : (
                  <FileText className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                )}
                <p>{verifying ? "Finalizing your order…" : "A confirmation email will be sent to you shortly."}</p>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <p>We are preparing your filing documents now.</p>
              </div>
              <div className="flex items-start gap-3">
                <FileText className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                <p>You can track your order status in your dashboard.</p>
              </div>
            </div>

            <Button asChild className="w-full" size="lg" disabled={verifying}>
              <Link to="/dashboard">
                Go to Dashboard <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </Card>
        </motion.div>
      </div>
      <Footer />
    </div>
  );
}
