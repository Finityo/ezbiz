import SEOHead from "@/components/SEOHead";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2, ArrowRight, ShieldCheck, FileText, Clock } from "lucide-react";

export default function StartOrder() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const startOrder = async () => {
    if (!user) {
      navigate("/auth?redirect=/start-order");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const { data, error: insertError } = await supabase
        .from("orders")
        .insert({
          status: "draft",
          user_id: user.id,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (insertError) throw insertError;

      // Log the order creation event
      await supabase.from("order_events").insert({
        order_id: data.id,
        event_type: "order_created",
        actor: "user",
        metadata: { user_id: user.id },
      });

      localStorage.setItem("active_order_id", data.id);
      navigate("/order/company-info");
    } catch (err: any) {
      console.error("Failed to start order:", err);
      setError("Something went wrong creating your order. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      <SEOHead title="Start Your Order" description="Start your business formation order." path="/start-order" noIndex />
      <Navigation />
      <main className="flex-grow container mx-auto px-4 py-12">
        <div className="max-w-2xl mx-auto space-y-8">
          <div className="text-center space-y-3">
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Start Your Business Formation
            </h1>
            <p className="text-lg text-muted-foreground">
              We'll guide you through every step. Your progress is saved automatically.
            </p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>What happens next</CardTitle>
              <CardDescription>A quick overview of the formation process</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {[
                { icon: FileText, title: "Provide your business details", desc: "Company name, entity type, state, and ownership structure." },
                { icon: ShieldCheck, title: "Review & confirm", desc: "Verify everything before checkout for accurate filing." },
                { icon: Clock, title: "We handle the filing", desc: "Your documents are filed and tracked through completion." },
              ].map((step, i) => (
                <div key={i} className="flex gap-4 items-start">
                  <div className="rounded-md bg-primary/10 p-2">
                    <step.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-foreground">{step.title}</p>
                    <p className="text-sm text-muted-foreground">{step.desc}</p>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>

          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive text-center">
              {error}
            </div>
          )}

          <div className="text-center">
            <Button size="lg" onClick={startOrder} disabled={loading} className="min-w-[240px]">
              {loading ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Creating Order...</>
              ) : (
                <>Begin Formation <ArrowRight className="h-4 w-4 ml-2" /></>
              )}
            </Button>
            {!user && (
              <p className="text-xs text-muted-foreground mt-2">
                You'll be asked to sign in first to save your progress.
              </p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
