import React, { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  CheckCircle2,
  Clock3,
  FileText,
  ShieldCheck,
  Landmark,
  ArrowRight,
  Download,
  AlertCircle,
  CalendarDays,
  Building2,
  BadgeDollarSign,
  FolderOpen,
  Sparkles,
  Receipt,
  UserCircle2,
  RefreshCw,
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

/* ─────────────── Types ─────────────── */

type OrderRow = {
  id: string;
  user_id: string;
  state: string | null;
  entity_type: string | null;
  package: string | null;
  status: string | null;
  total_amount?: number | null;
  stripe_session_id?: string | null;
  filing_speed?: string | null;
  ein_service?: boolean | null;
  created_at?: string | null;
};

type BusinessInfoRow = {
  order_id: string;
  company_name: string | null;
  alternate_company_name?: string | null;
  business_description?: string | null;
  organizer_type?: string | null;
  business_purpose?: string | null;
  delayed_filing?: boolean | null;
};

type ContactInfoRow = {
  order_id: string;
  first_name?: string | null;
  last_name?: string | null;
  email?: string | null;
  phone?: string | null;
};

type PaymentRow = {
  id: string;
  order_id: string;
  amount?: number | null;
  status?: string | null;
  created_at?: string | null;
  stripe_payment_id?: string | null;
};

type DocumentRow = {
  id: string;
  order_id: string;
  document_type?: string | null;
  file_url?: string | null;
  uploaded_at?: string | null;
};

type DashboardData = {
  order: OrderRow | null;
  business: BusinessInfoRow | null;
  contact: ContactInfoRow | null;
  payments: PaymentRow[];
  documents: DocumentRow[];
};

/* ─────────────── Constants ─────────────── */

const STATUS_STEPS = [
  "draft",
  "in_progress",
  "pending_payment",
  "payment_complete",
  "ready_for_submission",
  "submitted_to_corpnet",
  "processing",
  "filed",
  "completed",
] as const;

const statusLabelMap: Record<string, string> = {
  draft: "Draft",
  in_progress: "In Progress",
  pending_payment: "Pending Payment",
  payment_complete: "Payment Complete",
  ready_for_submission: "Ready for Submission",
  submitted_to_corpnet: "Submitted to CorpNet",
  processing: "Processing",
  filed: "Filed",
  completed: "Completed",
  rejected: "Rejected",
};

const statusToneMap: Record<string, string> = {
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

/* ─────────────── Helpers ─────────────── */

const currency = (value?: number | null) =>
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(Number(value || 0));

const formatDate = (value?: string | null) => {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
};

const getProgressPercent = (status?: string | null) => {
  if (!status) return 5;
  const index = STATUS_STEPS.indexOf(status as (typeof STATUS_STEPS)[number]);
  if (index < 0) return 5;
  return Math.max(8, Math.round(((index + 1) / STATUS_STEPS.length) * 100));
};

const getPrimaryNextAction = (status?: string | null) => {
  switch (status) {
    case "draft":
    case "in_progress":
      return { title: "Finish Your Order", description: "Complete your intake so we can move your business filing forward.", cta: "Resume Order", href: "/order/company-info" };
    case "pending_payment":
      return { title: "Complete Payment", description: "Your business filing is almost ready. Finish checkout to activate your order.", cta: "Go to Checkout", href: "/order/checkout" };
    case "payment_complete":
      return { title: "We're Preparing Your Filing", description: "Your order is paid. Our team is organizing your information for submission.", cta: "View Order Status", href: "/dashboard" };
    case "ready_for_submission":
      return { title: "Ready for Submission", description: "Your filing package is ready. The next step is sending it through our filing pipeline.", cta: "View Order Status", href: "/dashboard" };
    case "submitted_to_corpnet":
    case "processing":
      return { title: "Filing In Progress", description: "Your order is moving through the filing pipeline. Check back here for updates and documents.", cta: "Refresh Status", href: "/dashboard" };
    case "filed":
      return { title: "Documents Coming In", description: "Your business appears to be filed. Watch this dashboard for official document delivery.", cta: "Open Documents", href: "#documents" };
    case "completed":
      return { title: "Your Business Dashboard Is Live", description: "Your filing is complete. Use this space to manage documents, compliance, and next steps.", cta: "View Documents", href: "#documents" };
    case "rejected":
      return { title: "Action Needed", description: "Your filing needs attention. Review your order and contact support for the fastest resolution.", cta: "Contact Support", href: "/consultation" };
    default:
      return { title: "Welcome to EZ Biz", description: "Track your filing, documents, and next steps in one place.", cta: "Start a Business", href: "/pricing" };
  }
};

/* ─────────────── Sub-components ─────────────── */

function InfoRow({ label, value, icon: Icon }: { label: string; value: string; icon: React.ComponentType<{ className?: string }> }) {
  return (
    <div className="flex items-start gap-3 py-2">
      <div className="mt-0.5 rounded-md bg-primary/10 p-1.5">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground truncate">{value || "—"}</p>
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto space-y-6">
          <div className="flex items-center gap-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-6 w-48" />
              <Skeleton className="h-4 w-64" />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-28 rounded-lg" />
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <Skeleton className="h-96 rounded-lg lg:col-span-2" />
            <Skeleton className="h-96 rounded-lg" />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

/* ─────────────── Main Component ─────────────── */

const Dashboard = () => {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [data, setData] = useState<DashboardData>({
    order: null, business: null, contact: null, payments: [], documents: [],
  });

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [authLoading, user, navigate]);

  const loadDashboard = async () => {
    if (!user) return;
    setLoading(true);
    try {
      const { data: latestOrder, error: orderError } = await supabase
        .from("orders")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false })
        .limit(1)
        .maybeSingle();

      if (orderError) throw orderError;
      if (!latestOrder) {
        setData({ order: null, business: null, contact: null, payments: [], documents: [] });
        return;
      }

      const orderId = latestOrder.id;
      const [businessRes, contactRes, paymentsRes, documentsRes] = await Promise.all([
        supabase.from("business_information").select("*").eq("order_id", orderId).maybeSingle(),
        supabase.from("contact_information").select("*").eq("order_id", orderId).maybeSingle(),
        supabase.from("payments").select("*").eq("order_id", orderId).order("created_at", { ascending: false }),
        supabase.from("documents").select("*").eq("order_id", orderId).order("uploaded_at", { ascending: false }),
      ]);

      if (businessRes.error) throw businessRes.error;
      if (contactRes.error) throw contactRes.error;
      if (paymentsRes.error) throw paymentsRes.error;
      if (documentsRes.error) throw documentsRes.error;

      setData({
        order: latestOrder as OrderRow,
        business: (businessRes.data as BusinessInfoRow | null) ?? null,
        contact: (contactRes.data as ContactInfoRow | null) ?? null,
        payments: (paymentsRes.data as PaymentRow[]) ?? [],
        documents: (documentsRes.data as DocumentRow[]) ?? [],
      });
    } catch (error) {
      console.error("Dashboard load failed:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) loadDashboard();
  }, [user]);

  const progressPercent = useMemo(() => getProgressPercent(data.order?.status), [data.order?.status]);
  const primaryAction = useMemo(() => getPrimaryNextAction(data.order?.status), [data.order?.status]);

  const latestPayment = data.payments?.[0] ?? null;
  const companyName = data.business?.company_name || "Your Business";
  const firstName = data.contact?.first_name || user?.email?.split("@")[0] || "there";
  const isTexas = (data.order?.state || "").toLowerCase() === "texas";
  const orderStatus = data.order?.status || "draft";

  const nextSteps = [
    { title: "Apply for EIN", body: data.order?.ein_service ? "EIN service is selected for this order. We'll track it here once available." : "Add EIN support or complete it directly with the IRS when your filing is approved.", icon: Landmark, href: "/ein-number" },
    { title: "Open a Business Bank Account", body: "Once your filing is approved, use your formation documents and EIN to open a bank account.", icon: BadgeDollarSign, href: "/business-guide" },
    { title: "Keep Your Documents Organized", body: "Use your document vault below to keep formation records, approvals, and compliance docs together.", icon: FolderOpen, href: "#documents" },
    { title: "Stay Compliant", body: "We'll continue expanding compliance tools so annual reports and deadlines are easier to manage.", icon: CalendarDays, href: "/annual-report" },
  ];

  if (authLoading || loading) return <DashboardSkeleton />;

  /* ── Empty state ── */
  if (!data.order) {
    return (
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-grow container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <Card className="overflow-hidden">
              <CardHeader className="bg-primary/5 pb-8 pt-10">
                <div className="mx-auto mb-4 rounded-full bg-primary/10 p-4 w-fit">
                  <Sparkles className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl">Welcome to EZ Biz</CardTitle>
                <CardDescription className="text-base">
                  Start your business, track progress, and manage documents from one dashboard.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-8 space-y-6">
                <div className="text-left space-y-4">
                  <p className="font-semibold text-foreground">What you'll get here</p>
                  <ul className="space-y-3">
                    {["Track your business formation status", "Download formation documents in one place", "See next steps for EIN, banking, and compliance"].map((item) => (
                      <li key={item} className="flex items-center gap-3 text-sm text-muted-foreground">
                        <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
                <Button size="lg" className="w-full" onClick={() => navigate("/pricing")}>
                  Start Your Business <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
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
        <div className="max-w-7xl mx-auto space-y-8">

          {/* ═══ HERO / COMMAND CENTER HEADER ═══ */}
          <Card className="overflow-hidden border-0 shadow-lg">
            <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-background p-6 md:p-8">
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
                {/* Left – main info */}
                <div className="lg:col-span-3 space-y-5">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge className={statusToneMap[orderStatus] || statusToneMap.draft}>
                      {statusLabelMap[orderStatus] || "Draft"}
                    </Badge>
                    <span className="text-sm text-muted-foreground">
                      {data.order?.state || "State Pending"} {String(data.order?.entity_type || "LLC").toUpperCase()}
                    </span>
                    {data.order?.package && (
                      <Badge variant="outline" className="text-xs">{data.order.package}</Badge>
                    )}
                  </div>

                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-foreground">
                      Welcome back, {firstName}
                    </h1>
                    <p className="mt-2 text-muted-foreground max-w-xl">
                      This is your business command center for <span className="font-semibold text-foreground">{companyName}</span>.
                      Track your filing, monitor progress, download documents, and stay on top of next steps.
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Order Progress</span>
                      <span className="font-medium text-foreground">{progressPercent}% complete</span>
                    </div>
                    <Progress value={progressPercent} className="h-2.5" />
                  </div>

                  <div className="flex flex-wrap gap-3">
                    <Button asChild>
                      <Link to={primaryAction.href}>
                        {primaryAction.cta} <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    </Button>
                    <Button variant="outline" asChild>
                      <a href="#documents">
                        View Documents <FileText className="ml-2 h-4 w-4" />
                      </a>
                    </Button>
                  </div>
                </div>

                {/* Right – priority card */}
                <div className="lg:col-span-2 space-y-4">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Current Priority</CardDescription>
                      <CardTitle className="text-lg">{primaryAction.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-sm text-muted-foreground">{primaryAction.description}</p>
                      <div className="text-xs text-muted-foreground space-y-1">
                        <p>Latest order</p>
                        <p className="font-medium text-foreground">{companyName}</p>
                        <p>Created {formatDate(data.order?.created_at)}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {isTexas && (
                    <Card className="border-primary/20 bg-primary/5">
                      <CardContent className="p-4 flex gap-3">
                        <ShieldCheck className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-foreground">Texas veteran opportunity</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            If this business qualifies, you may be able to reduce the Texas filing burden significantly.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          </Card>

          {/* ═══ KPI ROW ═══ */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { label: "Order Status", value: statusLabelMap[orderStatus] || "Draft", icon: Clock3 },
              { label: "Documents Ready", value: String(data.documents.length), icon: FileText },
              { label: "Latest Payment", value: latestPayment ? currency(latestPayment.amount) : "—", icon: Receipt },
              { label: "Filing Speed", value: data.order?.filing_speed || "Standard", icon: Sparkles },
            ].map((kpi) => (
              <Card key={kpi.label}>
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="rounded-md bg-primary/10 p-2">
                    <kpi.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{kpi.label}</p>
                    <p className="text-lg font-bold text-foreground">{kpi.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ═══ MAIN GRID ═══ */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* ── LEFT COLUMN ── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Status Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Formation Status</CardTitle>
                  <CardDescription>Track exactly where your business formation sits in the workflow.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-0">
                    {STATUS_STEPS.map((step, index) => {
                      const stepIndex = STATUS_STEPS.indexOf(orderStatus as (typeof STATUS_STEPS)[number]);
                      const active = stepIndex >= index;
                      const current = orderStatus === step;
                      const stepDescriptions: Record<string, string> = {
                        draft: "Order started but not finished yet.",
                        in_progress: "Intake is being completed and saved.",
                        pending_payment: "Payment is still needed before the order can move forward.",
                        payment_complete: "Payment is complete and the order is ready for operational review.",
                        ready_for_submission: "Order data is complete and staged for filing submission.",
                        submitted_to_corpnet: "The order has been passed into the filing submission pipeline.",
                        processing: "The filing is currently being processed.",
                        filed: "The business appears to be filed and documents may begin arriving.",
                        completed: "The order workflow is complete.",
                      };
                      return (
                        <div key={step} className="flex gap-4 py-3">
                          <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold ${active ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}>
                            {active ? <CheckCircle2 className="h-4 w-4" /> : index + 1}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="flex items-center gap-2">
                              <p className={`text-sm font-medium ${active ? "text-foreground" : "text-muted-foreground"}`}>
                                {statusLabelMap[step]}
                              </p>
                              {current && (
                                <Badge variant="outline" className="text-[10px] px-1.5 py-0">Current</Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">{stepDescriptions[step]}</p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Document Vault */}
              <Card id="documents">
                <CardHeader className="flex flex-row items-center justify-between">
                  <div>
                    <CardTitle>Document Vault</CardTitle>
                    <CardDescription>Keep formation documents, confirmations, and supporting files in one place.</CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={loadDashboard}>
                    <RefreshCw className="h-4 w-4 mr-1" /> Refresh
                  </Button>
                </CardHeader>
                <CardContent>
                  {data.documents.length === 0 ? (
                    <div className="text-center py-10 space-y-2">
                      <FolderOpen className="h-10 w-10 mx-auto text-muted-foreground" />
                      <p className="text-sm font-medium text-muted-foreground">No documents yet</p>
                      <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                        As your order moves forward, approved filings, confirmations, and supporting documents will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {data.documents.map((doc) => (
                        <div key={doc.id} className="flex items-center justify-between py-3">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground truncate">
                              {(doc.document_type || "Document").replace(/_/g, " ")}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Uploaded {formatDate(doc.uploaded_at)}
                            </p>
                          </div>
                          {doc.file_url ? (
                            <Button size="sm" variant="outline" asChild>
                              <a href={doc.file_url} target="_blank" rel="noopener noreferrer">
                                <Download className="h-3 w-3 mr-1" /> Open
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

              {/* Next Steps */}
              <Card>
                <CardHeader>
                  <CardTitle>Next Steps for Your Business</CardTitle>
                  <CardDescription>Guided actions to keep your business moving after filing.</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {nextSteps.map((item) => {
                      const Icon = item.icon;
                      return (
                        <div key={item.title} className="rounded-lg border p-4 space-y-3 hover:bg-muted/50 transition-colors">
                          <div className="flex items-center gap-2">
                            <div className="rounded-md bg-primary/10 p-1.5">
                              <Icon className="h-4 w-4 text-primary" />
                            </div>
                            <p className="text-sm font-semibold text-foreground">{item.title}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">{item.body}</p>
                          <Button variant="link" size="sm" className="p-0 h-auto text-xs" asChild>
                            <Link to={item.href}>
                              Learn More <ArrowRight className="ml-1 h-3 w-3" />
                            </Link>
                          </Button>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* ── RIGHT COLUMN ── */}
            <div className="space-y-6">

              {/* Business Snapshot */}
              <Card>
                <CardHeader>
                  <CardTitle>Business Snapshot</CardTitle>
                  <CardDescription>Core information tied to your current order.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-1">
                  <InfoRow label="Company Name" value={data.business?.company_name || "—"} icon={Building2} />
                  <InfoRow label="Entity Type" value={data.order?.entity_type || "—"} icon={FileText} />
                  <InfoRow label="State" value={data.order?.state || "—"} icon={Landmark} />
                  <InfoRow label="Filing Speed" value={data.order?.filing_speed || "Standard"} icon={Clock3} />
                  <InfoRow label="EIN Service" value={data.order?.ein_service ? "Yes" : "No"} icon={BadgeDollarSign} />
                </CardContent>
              </Card>

              {/* Client Profile */}
              <Card>
                <CardHeader>
                  <CardTitle>Primary Contact</CardTitle>
                  <CardDescription>The person attached to this order.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-1">
                  <InfoRow label="Name" value={`${data.contact?.first_name || ""} ${data.contact?.last_name || ""}`.trim()} icon={UserCircle2} />
                  <InfoRow label="Email" value={data.contact?.email || user?.email || "—"} icon={FileText} />
                  <InfoRow label="Phone" value={data.contact?.phone || "—"} icon={Clock3} />
                </CardContent>
              </Card>

              {/* Billing */}
              <Card>
                <CardHeader>
                  <CardTitle>Billing & Order Details</CardTitle>
                  <CardDescription>High-trust summary for clients after checkout.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-baseline">
                      <span className="text-sm text-muted-foreground">Order Total</span>
                      <span className="text-xl font-bold text-foreground">{currency(data.order?.total_amount)}</span>
                    </div>
                    <Separator className="my-3" />
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Latest Payment Status</span>
                        <span className="font-medium text-foreground">{latestPayment?.status || "—"}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Paid On</span>
                        <span className="font-medium text-foreground">{formatDate(latestPayment?.created_at)}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Order Created</span>
                        <span className="font-medium text-foreground">{formatDate(data.order?.created_at)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-md bg-muted/50 p-3 flex gap-3">
                    <Sparkles className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground">
                      This dashboard is designed to evolve into a full business control center with document delivery,
                      compliance reminders, support history, and filing milestones.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Trust / Brand Positioning */}
              <Card>
                <CardHeader>
                  <CardTitle>Why this feels different</CardTitle>
                  <CardDescription>EZ Biz is a guided platform, not just a one-time filing form.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    { icon: CheckCircle2, text: "Clear filing status instead of vague email-only updates." },
                    { icon: FileText, text: "Central document access instead of scattered attachments." },
                    { icon: Sparkles, text: "Next-step business guidance that creates trust and future upsell paths." },
                    { icon: ShieldCheck, text: "Veteran positioning stays visible without making non-veteran customers feel excluded." },
                  ].map((item, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <item.icon className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                      <p className="text-sm text-muted-foreground">{item.text}</p>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default Dashboard;
