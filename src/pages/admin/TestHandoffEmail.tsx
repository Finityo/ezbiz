import { useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, Loader2, Mail, CheckCircle2, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";

type RecipientResult = {
  recipient: string;
  ok: boolean;
  message_id?: string;
  status?: number;
  error?: string;
};

type Response = {
  ok: boolean;
  from?: string;
  subject?: string;
  recipients?: string[];
  results?: RecipientResult[];
  error?: string;
};

export default function TestHandoffEmail() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<Response | null>(null);

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
    setResponse(null);
    try {
      const { data, error } = await supabase.functions.invoke(
        "test-account-manager-handoff",
        { body: {} },
      );
      if (error) throw error;
      const res = data as Response;
      setResponse(res);
      if (res.ok) {
        toast({
          title: "Test email sent",
          description: `Delivered to ${res.results?.length ?? 0} recipient(s).`,
        });
      } else {
        toast({
          title: "Some recipients failed",
          description: "Check the per-recipient results below.",
          variant: "destructive",
        });
      }
    } catch (err: any) {
      toast({
        title: "Test failed",
        description: err?.message || "Unknown error",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background py-12 px-4">
      <Helmet>
        <title>Test Order Handoff Email (Admin) — EZ BIZ</title>
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
              <Mail className="h-5 w-5 text-primary" />
              Test Order Handoff Email
            </CardTitle>
            <CardDescription>
              Sends a sample account-manager handoff email to every recipient
              configured in <code>ACCOUNT_MANAGER_EMAIL</code>. No order rows
              are touched. Subject is prefixed with <code>[TEST]</code> so
              recipients can ignore it.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button onClick={run} disabled={loading} size="lg" className="w-full">
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Sending test email…
                </>
              ) : (
                <>
                  <Mail className="h-4 w-4 mr-2" />
                  Send test handoff email
                </>
              )}
            </Button>

            {response && (
              <div className="space-y-3 pt-2">
                {response.from && (
                  <div className="text-xs text-muted-foreground space-y-0.5">
                    <div><span className="font-medium">From:</span> {response.from}</div>
                    {response.subject && (
                      <div><span className="font-medium">Subject:</span> {response.subject}</div>
                    )}
                  </div>
                )}

                <div className="space-y-2">
                  <p className="text-sm font-medium">Delivery results</p>
                  {response.results?.map((r) => (
                    <div
                      key={r.recipient}
                      className="flex items-start justify-between gap-3 rounded-md border p-3 text-sm"
                    >
                      <div className="min-w-0 flex-1">
                        <div className="font-mono text-xs sm:text-sm truncate">
                          {r.recipient}
                        </div>
                        {r.message_id && (
                          <div className="text-xs text-muted-foreground truncate">
                            id: {r.message_id}
                          </div>
                        )}
                        {r.error && (
                          <div className="text-xs text-destructive mt-1 break-words">
                            {r.error}
                          </div>
                        )}
                      </div>
                      <Badge variant={r.ok ? "default" : "destructive"} className="shrink-0">
                        {r.ok ? (
                          <><CheckCircle2 className="h-3 w-3 mr-1" /> Sent</>
                        ) : (
                          <><XCircle className="h-3 w-3 mr-1" /> Failed{r.status ? ` (${r.status})` : ""}</>
                        )}
                      </Badge>
                    </div>
                  ))}
                </div>

                <p className="text-xs text-muted-foreground">
                  Also logged to <code>email_send_log</code> as
                  <code> account-manager-order-handoff-test</code>.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
