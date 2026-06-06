import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, AlertTriangle, Loader2, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";

export default function WipeOrders() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminAuth();
  const { toast } = useToast();
  const [scope, setScope] = useState<"test" | "all">("test");
  const [confirmText, setConfirmText] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

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
    if (confirmText !== "WIPE") {
      toast({
        title: "Type WIPE to confirm",
        description: "Confirmation phrase doesn't match.",
        variant: "destructive",
      });
      return;
    }
    setLoading(true);
    setResult(null);
    try {
      const { data, error } = await supabase.functions.invoke("wipe-test-orders", {
        body: { confirm: "WIPE", scope },
      });
      if (error) throw error;
      setResult(data);
      toast({
        title: "Wipe complete",
        description: `Deleted ${data?.deleted ?? 0} order(s).`,
      });
      setConfirmText("");
    } catch (e: any) {
      toast({
        title: "Wipe failed",
        description: e?.message || "Unknown error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Wipe Orders | Admin</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-3xl">
        <div className="flex items-center gap-3 mb-6">
          <Button variant="ghost" size="sm" asChild>
            <Link to="/admin">
              <ArrowLeft className="h-4 w-4 mr-1" /> Admin
            </Link>
          </Button>
          <h1 className="text-2xl font-semibold">Wipe Orders</h1>
        </div>

        <Card className="border-2 border-destructive/40">
          <CardHeader>
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <CardTitle>Destructive: clean-slate reset</CardTitle>
            </div>
            <CardDescription>
              Deletes orders and every related row (addresses, business info, contacts, management,
              participants, IRS party, registered agent, agreements, payments, documents, events,
              admin notes). This cannot be undone.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label>Scope</Label>
              <RadioGroup value={scope} onValueChange={(v) => setScope(v as "test" | "all")}>
                <div className="flex items-start gap-2">
                  <RadioGroupItem value="test" id="scope-test" className="mt-1" />
                  <Label htmlFor="scope-test" className="font-normal">
                    Test orders only{" "}
                    <span className="text-muted-foreground text-sm">
                      (email null, or contains <code>test</code>, <code>example.com</code>,{" "}
                      <code>ezbiz-fs.internal</code>)
                    </span>
                  </Label>
                </div>
                <div className="flex items-start gap-2">
                  <RadioGroupItem value="all" id="scope-all" className="mt-1" />
                  <Label htmlFor="scope-all" className="font-normal">
                    <span className="text-destructive font-medium">ALL orders</span> — full reset
                  </Label>
                </div>
              </RadioGroup>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm">
                Type <code className="bg-muted px-1 rounded">WIPE</code> to confirm
              </Label>
              <Input
                id="confirm"
                value={confirmText}
                onChange={(e) => setConfirmText(e.target.value)}
                placeholder="WIPE"
                autoComplete="off"
              />
            </div>

            <Button
              onClick={run}
              disabled={loading || confirmText !== "WIPE"}
              variant="destructive"
              className="w-full"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Trash2 className="h-4 w-4 mr-2" />
              )}
              {scope === "all" ? "Delete ALL orders" : "Delete test orders"}
            </Button>

            {result && (
              <pre className="text-xs bg-muted p-3 rounded overflow-auto max-h-96">
                {JSON.stringify(result, null, 2)}
              </pre>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
