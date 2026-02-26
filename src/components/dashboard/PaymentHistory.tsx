import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, ExternalLink, FileText, Loader2, Receipt } from "lucide-react";
import { toast } from "sonner";

interface Payment {
  id: string;
  type: "invoice" | "payment";
  number: string | null;
  description: string;
  amount: number;
  currency: string;
  status: string;
  created: number;
  hostedUrl: string | null;
  pdfUrl: string | null;
}

const statusColors: Record<string, string> = {
  paid: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  succeeded: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  open: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  requires_payment_method: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
  draft: "bg-muted text-muted-foreground",
  void: "bg-muted text-muted-foreground",
  uncollectible: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  canceled: "bg-muted text-muted-foreground",
};

const statusLabels: Record<string, string> = {
  paid: "Paid",
  succeeded: "Paid",
  open: "Pending",
  requires_payment_method: "Awaiting Payment",
  draft: "Draft",
  void: "Void",
  uncollectible: "Uncollectible",
  canceled: "Canceled",
};

function formatCurrency(amount: number, currency: string) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency.toUpperCase(),
  }).format(amount / 100);
}

function formatDate(timestamp: number) {
  return new Date(timestamp * 1000).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

const PaymentHistory = () => {
  const [payments, setPayments] = useState<Payment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchPayments();
  }, []);

  const fetchPayments = async () => {
    try {
      const { data, error } = await supabase.functions.invoke("get-payment-history");
      if (error) throw error;
      setPayments(data.payments || []);
    } catch (error: any) {
      console.error("Error fetching payments:", error);
      toast.error("Failed to load payment history");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="bg-card rounded-lg border p-8 flex items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        <span className="ml-2 text-muted-foreground">Loading payment history...</span>
      </div>
    );
  }

  if (payments.length === 0) {
    return (
      <div className="bg-card rounded-lg border p-8 text-center">
        <Receipt className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
        <h3 className="text-lg font-semibold mb-2">No payments yet</h3>
        <p className="text-muted-foreground">
          Your payment history and invoices will appear here.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="bg-card rounded-lg border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Payment History
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            All your transactions and invoices
          </p>
        </div>
        <div className="divide-y">
          {payments.map((payment) => (
            <div
              key={payment.id}
              className="p-4 flex items-center justify-between gap-4 hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-start gap-3 min-w-0">
                <div className="flex-shrink-0 mt-0.5">
                  {payment.type === "invoice" ? (
                    <FileText className="h-5 w-5 text-muted-foreground" />
                  ) : (
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-medium truncate">{payment.description}</p>
                  <div className="flex items-center gap-2 text-sm text-muted-foreground mt-0.5">
                    {payment.number && <span>{payment.number}</span>}
                    <span>{formatDate(payment.created)}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3 flex-shrink-0">
                <span className="font-semibold">
                  {formatCurrency(payment.amount, payment.currency)}
                </span>
                <Badge
                  variant="secondary"
                  className={statusColors[payment.status] || ""}
                >
                  {statusLabels[payment.status] || payment.status}
                </Badge>
                {payment.hostedUrl && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-8 w-8 p-0"
                    onClick={() => window.open(payment.hostedUrl!, "_blank")}
                    title="View Invoice"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaymentHistory;
