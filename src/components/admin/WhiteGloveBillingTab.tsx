import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, CheckCircle2, ExternalLink, Loader2, RefreshCw } from "lucide-react";

interface BillingResult {
  success?: boolean;
  message?: string;
  invoiceId?: string;
  invoiceUrl?: string;
  billedHours?: number;
  amount?: number;
  error?: string;
}

interface WhiteGloveInvoice {
  id: string;
  customerEmail: string;
  hours: number;
  amount: number;
  status: string;
  created: string;
  invoiceUrl: string | null;
  orderId: string | null;
}

const WhiteGloveBillingTab = () => {
  const [email, setEmail] = useState("");
  const [hours, setHours] = useState(3);
  const [orderId, setOrderId] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<BillingResult | null>(null);

  // History state
  const [invoices, setInvoices] = useState<WhiteGloveInvoice[]>([]);
  const [historyLoading, setHistoryLoading] = useState(true);

  const loadInvoices = useCallback(async () => {
    setHistoryLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("list-white-glove-invoices");
      if (error) throw error;
      setInvoices(data || []);
    } catch (err) {
      console.error("Failed to load invoices", err);
    }
    setHistoryLoading(false);
  }, []);

  useEffect(() => {
    loadInvoices();
  }, [loadInvoices]);

  const submitBilling = async () => {
    if (!email.trim()) return;
    setLoading(true);
    setResult(null);

    try {
      const { data, error } = await supabase.functions.invoke(
        "bill-white-glove-hours",
        {
          body: {
            customerEmail: email,
            hours: Number(hours),
            orderId: orderId || undefined,
          },
        }
      );

      if (error) throw error;
      setResult(data);
      if (data?.success) loadInvoices();
    } catch (err: any) {
      setResult({ error: err.message });
    }

    setLoading(false);
  };

  const includedHours = 2;
  const extraHours = Math.max(0, hours - includedHours);
  const estimatedAmount = extraHours * 80;

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "paid":
        return <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Paid</Badge>;
      case "open":
        return <Badge variant="outline">Open</Badge>;
      case "void":
        return <Badge variant="secondary">Void</Badge>;
      default:
        return <Badge variant="secondary">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-6">
      {/* Billing Form */}
      <Card>
        <CardHeader>
          <CardTitle>White Glove Overage Billing</CardTitle>
          <CardDescription>
            Bill customers for White Glove hours beyond the 2 included hours ($80/hr)
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="customer-email">Customer Email</Label>
              <Input
                id="customer-email"
                type="email"
                placeholder="customer@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="total-hours">Total Hours Used</Label>
              <Input
                id="total-hours"
                type="number"
                min={1}
                value={hours}
                onChange={(e) => setHours(Number(e.target.value))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="order-id">Order ID (optional)</Label>
              <Input
                id="order-id"
                placeholder="Order UUID"
                value={orderId}
                onChange={(e) => setOrderId(e.target.value)}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 p-3 rounded-md bg-muted text-sm">
            <span>Included: <strong>{includedHours} hrs</strong></span>
            <span>Billable: <strong>{extraHours} hrs</strong></span>
            <span>Estimated: <strong>${estimatedAmount}</strong></span>
            {extraHours === 0 && (
              <Badge variant="secondary">No overage</Badge>
            )}
          </div>

          <Button
            onClick={submitBilling}
            disabled={loading || !email.trim() || extraHours === 0}
          >
            {loading && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
            {loading ? "Sending Invoice..." : `Bill ${extraHours} Overage Hour${extraHours !== 1 ? "s" : ""}`}
          </Button>
        </CardContent>
      </Card>

      {/* Result feedback */}
      {result && (
        <Card>
          <CardContent className="pt-6">
            {result.success && (
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="space-y-1">
                  <p className="font-medium">Invoice Sent Successfully</p>
                  <p className="text-sm text-muted-foreground">
                    Billed {result.billedHours} overage hour{result.billedHours !== 1 ? "s" : ""} — <strong>${result.amount}</strong>
                  </p>
                  {result.invoiceUrl && (
                    <a
                      href={result.invoiceUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                    >
                      View Invoice <ExternalLink className="h-3 w-3" />
                    </a>
                  )}
                </div>
              </div>
            )}

            {result.success === false && result.message && (
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                <p className="text-sm">{result.message}</p>
              </div>
            )}

            {result.error && (
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-destructive mt-0.5" />
                <p className="text-sm text-destructive">{result.error}</p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {/* Billing History */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <div>
            <CardTitle>Recent White Glove Invoices</CardTitle>
            <CardDescription>History of overage billing invoices sent via Stripe</CardDescription>
          </div>
          <Button variant="outline" size="sm" onClick={loadInvoices} disabled={historyLoading}>
            <RefreshCw className={`h-4 w-4 mr-2 ${historyLoading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {historyLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <Skeleton key={i} className="h-10 w-full" />
              ))}
            </div>
          ) : invoices.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-8">
              No White Glove overage invoices found.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Customer</TableHead>
                    <TableHead>Hours</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Invoice</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {invoices.map((inv) => (
                    <TableRow key={inv.id}>
                      <TableCell className="font-medium">{inv.customerEmail}</TableCell>
                      <TableCell>{inv.hours}</TableCell>
                      <TableCell>${inv.amount}</TableCell>
                      <TableCell>{getStatusBadge(inv.status ?? "unknown")}</TableCell>
                      <TableCell className="text-sm text-muted-foreground">
                        {new Date(inv.created).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {inv.invoiceUrl ? (
                          <a
                            href={inv.invoiceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-sm text-primary hover:underline"
                          >
                            View <ExternalLink className="h-3 w-3" />
                          </a>
                        ) : (
                          <span className="text-sm text-muted-foreground">—</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default WhiteGloveBillingTab;
