import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Clock3,
  FileText,
  ArrowRight,
  Download,
  Building2,
  Receipt,
  FolderOpen,
  Sparkles,
  RefreshCw,
  Loader2,
} from "lucide-react";

import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";

/* ─── Types ─── */

type OrderRow = {
  id: string;
  state: string | null;
  entity_type: string | null;
  package: string | null;
  status: string | null;
  total_amount?: number | null;
  created_at?: string | null;
};

type DocumentRow = {
  id: string;
  order_id: string;
  document_type?: string | null;
  file_url?: string | null;
  uploaded_at?: string | null;
};

/* ─── Constants ─── */

const STATUS_STEPS = [
  "draft", "in_progress", "pending_payment", "payment_complete",
  "ready_for_submission", "submitted_to_corpnet", "processing", "filed", "completed",
] as const;

const statusLabel: Record<string, string> = {
  draft: "Draft", in_progress: "In Progress", pending_payment: "Pending Payment",
  payment_complete: "Payment Complete", ready_for_submission: "Ready for Submission",
  submitted_to_corpnet: "Submitted", processing: "Processing",
  filed: "Filed", completed: "Completed", rejected: "Rejected",
};

const statusTone: Record<string, string> = {
  draft: "bg-muted text-muted-foreground",
  in_progress: "bg-primary/10 text-primary",
  pending_payment: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  payment_complete: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  ready_for_submission: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  submitted_to_corpnet: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  processing: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  filed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  rejected: "bg-destructive/10 text-destructive",
};

/* ─── Helpers ─── */

const currency = (v?: number | null) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(v || 0));

const fmtDate = (v?: string | null) => {
  if (!v) return "—";
  const d = new Date(v);
  return Number.isNaN(d.getTime()) ? "—" : d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const getProgress = (status?: string | null) => {
  if (!status) return 5;
  const idx = STATUS_STEPS.indexOf(status as (typeof STATUS_STEPS)[number]);
  return idx < 0 ? 5 : Math.max(8, Math.round(((idx + 1) / STATUS_STEPS.length) * 100));
};

/* ─── Skeleton ─── */

function DashboardSkeleton() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-6">
          <Skeleton className="h-10 w-64" />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => <Skeleton key={i} className="h-24 rounded-lg" />)}
          </div>
          <Skeleton className="h-96 rounded-lg" />
        </div>
      </main>
      <Footer />
    </div>
  );
}

/* ─── Main Dashboard ─── */

export default function Dashboard() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [orders, setOrders] = useState<OrderRow[]>([]);
  const [documents, setDocuments] = useState<DocumentRow[]>([]);

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [authLoading, user, navigate]);

  const loadData = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const [ordersRes, docsRes] = await Promise.all([
        supabase.from("orders").select("*").eq("user_id", user.id).order("created_at", { ascending: false }),
        supabase.from("documents").select("*").order("uploaded_at", { ascending: false }),
      ]);

      setOrders((ordersRes.data as OrderRow[]) || []);
      setDocuments((docsRes.data as DocumentRow[]) || []);
    } catch (err) {
      console.error("Dashboard load failed:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadData();
  }, [user]);

  if (authLoading || loading) return <DashboardSkeleton />;

  const activeOrders = orders.filter(o => o.status !== "completed" && o.status !== "rejected");
  const completedOrders = orders.filter(o => o.status === "completed");
  const latestOrder = orders[0] || null;
  const progress = getProgress(latestOrder?.status);

  /* ── Empty state ── */
  if (!latestOrder) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <main className="flex-grow container mx-auto px-4 py-16">
          <div className="max-w-lg mx-auto text-center space-y-6">
            <div className="mx-auto rounded-full bg-primary/10 p-4 w-fit">
              <Sparkles className="h-8 w-8 text-primary" />
            </div>
            <h1 className="text-2xl font-bold text-foreground">Welcome to EZ Biz</h1>
            <p className="text-muted-foreground">
              Start your business, track progress, and manage documents from one dashboard.
            </p>
            <Button size="lg" onClick={() => navigate("/pricing")}>
              Start Your Business <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  /* ── Full dashboard ── */
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-5xl mx-auto space-y-8">

          {/* Header */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl font-bold text-foreground">Your Business Dashboard</h1>
              <p className="text-sm text-muted-foreground mt-1">
                Track orders, manage documents, and stay on top of your filings.
              </p>
            </div>
            <Button variant="outline" size="sm" onClick={loadData}>
              <RefreshCw className="h-4 w-4 mr-1" /> Refresh
            </Button>
          </div>

          {/* Stats Row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Total Orders", value: String(orders.length), icon: Receipt },
              { label: "Active Filings", value: String(activeOrders.length), icon: Clock3 },
              { label: "Completed", value: String(completedOrders.length), icon: CheckCircle2 },
              { label: "Documents", value: String(documents.length), icon: FileText },
            ].map(kpi => (
              <Card key={kpi.label}>
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="rounded-md bg-primary/10 p-2">
                    <kpi.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{kpi.label}</p>
                    <p className="text-2xl font-bold text-foreground">{kpi.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Latest Order Progress */}
          {latestOrder && (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle>Latest Order</CardTitle>
                    <CardDescription>
                      {latestOrder.entity_type?.toUpperCase() || "LLC"} in {latestOrder.state || "—"} · Created {fmtDate(latestOrder.created_at)}
                    </CardDescription>
                  </div>
                  <Badge className={statusTone[latestOrder.status || "draft"]}>
                    {statusLabel[latestOrder.status || "draft"] || "Draft"}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-muted-foreground">Progress</span>
                    <span className="font-medium">{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2.5" />
                </div>
                <div className="flex flex-wrap gap-3 text-sm">
                  {latestOrder.package && (
                    <span className="text-muted-foreground">
                      Package: <span className="font-medium text-foreground">{latestOrder.package}</span>
                    </span>
                  )}
                  {latestOrder.total_amount != null && (
                    <span className="text-muted-foreground">
                      Total: <span className="font-medium text-foreground">{currency(latestOrder.total_amount)}</span>
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Orders List */}
          <Card>
            <CardHeader>
              <CardTitle>Your Orders</CardTitle>
            </CardHeader>
            <CardContent>
              {orders.length === 0 ? (
                <p className="text-center text-muted-foreground py-6">No orders yet.</p>
              ) : (
                <div className="divide-y">
                  {orders.map(order => (
                    <div key={order.id} className="flex items-center justify-between py-3 gap-4">
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <Building2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                          <span className="font-medium text-sm text-foreground truncate">
                            {order.entity_type?.toUpperCase() || "LLC"} — {order.state || "—"}
                          </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-0.5">
                          {fmtDate(order.created_at)} · {order.package || "—"}
                        </p>
                      </div>
                      <Badge className={statusTone[order.status || "draft"] + " text-xs"}>
                        {statusLabel[order.status || "draft"] || "Draft"}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Documents */}
          <Card id="documents">
            <CardHeader>
              <CardTitle>Documents</CardTitle>
              <CardDescription>Formation documents, confirmations, and filings.</CardDescription>
            </CardHeader>
            <CardContent>
              {documents.length === 0 ? (
                <div className="text-center py-8 space-y-2">
                  <FolderOpen className="h-10 w-10 mx-auto text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">
                    Documents will appear here as your order progresses.
                  </p>
                </div>
              ) : (
                <div className="divide-y">
                  {documents.map(doc => (
                    <div key={doc.id} className="flex items-center justify-between py-3">
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-foreground truncate">
                          {(doc.document_type || "Document").replace(/_/g, " ")}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Uploaded {fmtDate(doc.uploaded_at)}
                        </p>
                      </div>
                      {doc.file_url ? (
                        <Button size="sm" variant="outline" asChild>
                          <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                            <Download className="h-3 w-3 mr-1" /> Download
                          </a>
                        </Button>
                      ) : (
                        <Badge variant="secondary" className="text-xs">Pending</Badge>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
