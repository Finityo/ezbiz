import SEOHead from "@/components/SEOHead";
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
import OrderTimeline from "@/components/dashboard/OrderTimeline";
import ProfileEditor from "@/components/dashboard/ProfileEditor";
import DocumentUploader from "@/components/dashboard/DocumentUploader";
import WaiverDocumentUpload from "@/components/dashboard/WaiverDocumentUpload";
import VerifyEmailNotice from "@/components/auth/VerifyEmailNotice";

/* ─── Types ─── */

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

/* ─── Constants ─── */

const STATUS_STEPS = [
  "draft",
  "in_progress",
  "pending_payment",
  "payment_complete",
  "in_processing",
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
  "Pending Payment": "Pending Payment",
  payment_complete: "Payment Complete",
  in_processing: "In Processing",
  "In Processing": "In Processing",
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
  "Pending Payment": "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300",
  payment_complete: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  in_processing: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  "In Processing": "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  ready_for_submission: "bg-cyan-100 text-cyan-800 dark:bg-cyan-900/30 dark:text-cyan-300",
  submitted_to_corpnet: "bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300",
  processing: "bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300",
  filed: "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300",
  completed: "bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300",
  rejected: "bg-destructive/10 text-destructive",
};

/* ─── Helpers ─── */

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
  const normalized = status === "Pending Payment" ? "pending_payment" : status;
  const index = STATUS_STEPS.indexOf(normalized as (typeof STATUS_STEPS)[number]);
  if (index < 0) return 5;
  return Math.max(8, Math.round(((index + 1) / STATUS_STEPS.length) * 100));
};

const getPrimaryNextAction = (status?: string | null) => {
  const normalized = status === "Pending Payment" ? "pending_payment" : status;
  switch (normalized) {
    case "draft":
    case "in_progress":
      return {
        title: "Finish Your Order",
        description: "Complete your intake so we can move your business filing forward.",
        cta: "Resume Order",
        href: "/order/company-info",
      };
    case "pending_payment":
      return {
        title: "Complete Payment",
        description: "Your business filing is almost ready. Finish checkout to activate your order.",
        cta: "Go to Checkout",
        href: "/order/checkout",
      };
    case "payment_complete":
      return {
        title: "We're Preparing Your Filing",
        description: "Your order is paid. Our team is organizing your information for submission.",
        cta: "View Order Status",
        href: "/dashboard",
      };
    case "ready_for_submission":
      return {
        title: "Ready for Submission",
        description: "Your filing package is ready. The next step is sending it through our filing pipeline.",
        cta: "View Order Status",
        href: "/dashboard",
      };
    case "submitted_to_corpnet":
    case "processing":
      return {
        title: "Filing In Progress",
        description: "Your order is moving through the filing pipeline. Check back here for updates and documents.",
        cta: "Refresh Status",
        href: "/dashboard",
      };
    case "filed":
      return {
        title: "Documents Coming In",
        description: "Your business appears to be filed. Watch this dashboard for official document delivery.",
        cta: "Open Documents",
        href: "#documents",
      };
    case "completed":
      return {
        title: "Your Business Dashboard Is Live",
        description: "Your filing is complete. Use this space to manage documents, compliance, and next steps.",
        cta: "View Documents",
        href: "#documents",
      };
    case "rejected":
      return {
        title: "Action Needed",
        description: "Your filing needs attention. Review your order and contact support for the fastest resolution.",
        cta: "Contact Support",
        href: "/consultation",
      };
    default:
      return {
        title: "Welcome to EZ Biz",
        description: "Track your filing, documents, and next steps in one place.",
        cta: "Start a Business",
        href: "/pricing",
      };
  }
};

/* ─── Info Row Sub-component ─── */

function InfoRow({
  label,
  value,
  icon: Icon,
}: {
  label: string;
  value: string;
  icon: React.ComponentType<{ className?: string }>;
}) {
  return (
    <div className="flex items-start gap-3 py-2">
      <div className="rounded-md bg-primary/10 p-1.5 mt-0.5">
        <Icon className="h-4 w-4 text-primary" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-xs text-muted-foreground">{label}</p>
        <p className="text-sm font-medium text-foreground truncate">{value || "—"}</p>
      </div>
    </div>
  );
}

/* ─── Skeleton ─── */

function DashboardSkeleton() {
  return (
    <div className="min-h-screen flex flex-col">
      <SEOHead title="Dashboard" description="Your EZ BIZ FILE SERVICE client dashboard." path="/dashboard" noIndex />
      <Navigation />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-6">
          <Skeleton className="h-10 w-64" />
          <Skeleton className="h-48 rounded-lg" />
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
  const [data, setData] = useState<DashboardData>({
    order: null,
    business: null,
    contact: null,
    payments: [],
    documents: [],
  });

  useEffect(() => {
    if (!authLoading && !user) navigate("/auth");
  }, [authLoading, user, navigate]);

  const emailVerified = !!user?.email_confirmed_at;

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
    if (user && emailVerified) loadDashboard();
  }, [user, emailVerified]);

  // ─── Realtime: refresh dashboard when admin updates orders/events/documents ───
  useEffect(() => {
    if (!user || !data.order?.id) return;
    const orderId = data.order.id;

    const channel = supabase
      .channel(`dashboard-order-${orderId}`)
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "orders", filter: `id=eq.${orderId}` },
        () => loadDashboard()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "order_events", filter: `order_id=eq.${orderId}` },
        () => loadDashboard()
      )
      .on(
        "postgres_changes",
        { event: "*", schema: "public", table: "documents", filter: `order_id=eq.${orderId}` },
        () => loadDashboard()
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user, data.order?.id]);

  const progressPercent = useMemo(() => getProgressPercent(data.order?.status), [data.order?.status]);
  const primaryAction = useMemo(() => getPrimaryNextAction(data.order?.status), [data.order?.status]);

  const latestPayment = data.payments?.[0] ?? null;
  const companyName = data.business?.company_name || "Your Business";
  const firstName = data.contact?.first_name || user?.email?.split("@")[0] || "there";
  const isTexas = (data.order?.state || "").toLowerCase() === "texas";
  const orderStatus = data.order?.status || "draft";
  const normalizedStatus = orderStatus === "Pending Payment" ? "pending_payment" : orderStatus;

  const nextSteps = [
    {
      title: "Apply for EIN",
      body: data.order?.ein_service
        ? "EIN service is selected for this order. We'll track it here once available."
        : "Add EIN support or complete it directly with the IRS when your filing is approved.",
      icon: Landmark,
      href: "/ein-number",
    },
    {
      title: "Open a Business Bank Account",
      body: "Once your filing is approved, use your formation documents and EIN to open a bank account.",
      icon: BadgeDollarSign,
      href: "/business-guide",
    },
    {
      title: "Keep Your Documents Organized",
      body: "Use your document vault below to keep formation records, approvals, and compliance docs together.",
      icon: FolderOpen,
      href: "#documents",
    },
    {
      title: "Stay Compliant",
      body: "We'll continue expanding compliance tools so annual reports and deadlines are easier to manage.",
      icon: CalendarDays,
      href: "/annual-report",
    },
  ];

  if (authLoading) return <DashboardSkeleton />;

  /* ── Email verification gate ── */
  if (user && !emailVerified) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <main className="flex-grow">
          <VerifyEmailNotice email={user.email || ""} onSignOut={() => navigate("/auth")} />
        </main>
        <Footer />
      </div>
    );
  }

  if (loading) return <DashboardSkeleton />;

  /* ── Empty state ── */
  if (!data.order) {
    return (
      <div className="min-h-screen flex flex-col bg-background">
        <Navigation />
        <main className="flex-grow container mx-auto px-4 py-16">
          <div className="max-w-2xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <div className="mx-auto rounded-full bg-primary/10 p-5 w-fit">
                <Sparkles className="h-10 w-10 text-primary" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Welcome to EZ Biz</h1>
              <p className="text-muted-foreground text-lg">
                Start your business, track progress, and manage documents from one dashboard.
              </p>
            </div>

            <div className="text-left space-y-4 bg-muted/50 rounded-xl p-6">
              <p className="font-semibold text-foreground">What you'll get here</p>
              <div className="space-y-3">
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  Track your business formation status
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  Download formation documents in one place
                </div>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <CheckCircle2 className="h-4 w-4 text-primary shrink-0" />
                  See next steps for EIN, banking, and compliance
                </div>
              </div>
            </div>

            <Button size="lg" onClick={() => navigate("/pricing")} className="px-8">
              Start Your Business <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  /* ── Full premium dashboard ── */
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Navigation />
      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto space-y-8">

          {/* ═══ HERO / COMMAND CENTER HEADER ═══ */}
          <Card className="overflow-hidden border-primary/20">
            <CardContent className="p-0">
              <div className="grid lg:grid-cols-3 gap-0">
                {/* Left: Main Hero */}
                <div className="lg:col-span-2 p-6 lg:p-8 space-y-6">
                  {/* Status badges */}
                  <div className="flex flex-wrap items-center gap-2">
                    {(() => {
                      const isActive =
                        orderStatus === "completed" ||
                        orderStatus === "filed_with_sos" ||
                        String(data.order?.status || "").toLowerCase().includes("active");
                      if (isActive) {
                        return (
                          <Badge className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300 border-green-300/40 gap-1.5">
                            <span className="inline-block h-2 w-2 rounded-full bg-green-500 animate-pulse" />
                            Active with SOS
                          </Badge>
                        );
                      }
                      return (
                        <Badge className={statusToneMap[orderStatus] || statusToneMap.draft}>
                          {statusLabelMap[orderStatus] || "Draft"}
                        </Badge>
                      );
                    })()}
                    <Badge variant="outline">
                      {data.order?.state || "State Pending"}{" "}
                      {String(data.order?.entity_type || "LLC").toUpperCase()}
                    </Badge>
                    {data.order?.package && (
                      <Badge variant="secondary">{data.order.package}</Badge>
                    )}
                  </div>


                  {/* Welcome */}
                  <div className="space-y-2">
                    <h1 className="text-2xl lg:text-3xl font-bold text-foreground">
                      Welcome back, {firstName}
                    </h1>
                    <p className="text-muted-foreground leading-relaxed max-w-xl">
                      This is your business command center for{" "}
                      <span className="font-semibold text-foreground">{companyName}</span>.
                      Track your filing, monitor progress, download documents, and stay on top of
                      next steps without chasing emails.
                    </p>
                  </div>

                  {/* Progress bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground font-medium">Order Progress</span>
                      <span className="font-semibold text-foreground">{progressPercent}% complete</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
                      <div
                        className="h-full bg-primary rounded-full transition-all duration-700 ease-out"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  {/* CTAs */}
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

                {/* Right: Priority Card */}
                <div className="bg-muted/50 p-6 lg:p-8 border-t lg:border-t-0 lg:border-l border-border space-y-6">
                  <Card>
                    <CardHeader className="pb-2">
                      <CardDescription>Current Priority</CardDescription>
                      <CardTitle className="text-lg">{primaryAction.title}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <p className="text-sm text-muted-foreground">{primaryAction.description}</p>
                      <Separator />
                      <div className="space-y-1">
                        <p className="text-xs text-muted-foreground">Latest order</p>
                        <p className="text-sm font-medium text-foreground">{companyName}</p>
                        <p className="text-xs text-muted-foreground">
                          Created {formatDate(data.order?.created_at)}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {isTexas && (
                    <Card className="border-emerald-200 bg-emerald-50 dark:bg-emerald-900/20 dark:border-emerald-800">
                      <CardContent className="p-4 flex gap-3">
                        <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="text-sm font-medium text-emerald-800 dark:text-emerald-300">
                            Texas veteran opportunity
                          </p>
                          <p className="text-xs text-emerald-700 dark:text-emerald-400 mt-1">
                            If this business qualifies, you may be able to reduce the Texas filing
                            burden significantly.
                          </p>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* ═══ KPI ROW ═══ */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              {
                label: "Order Status",
                value: statusLabelMap[orderStatus] || "Draft",
                icon: Clock3,
              },
              {
                label: "Documents Ready",
                value: String(data.documents.length),
                icon: FileText,
              },
              {
                label: "Latest Payment",
                value: latestPayment ? currency(latestPayment.amount) : "—",
                icon: Receipt,
              },
              {
                label: "Filing Speed",
                value: data.order?.filing_speed || "Standard",
                icon: Sparkles,
              },
            ].map(kpi => (
              <Card key={kpi.label}>
                <CardContent className="p-4 flex items-start gap-3">
                  <div className="rounded-md bg-primary/10 p-2">
                    <kpi.icon className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground">{kpi.label}</p>
                    <p className="text-xl font-bold text-foreground">{kpi.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* ═══ MAIN TWO-COLUMN GRID ═══ */}
          <div className="grid lg:grid-cols-3 gap-6">

            {/* ─── LEFT COLUMN (2/3) ─── */}
            <div className="lg:col-span-2 space-y-6">

              {/* Status Timeline */}
              <Card>
                <CardHeader>
                  <CardTitle>Formation Status</CardTitle>
                  <CardDescription>
                    Track exactly where your business formation sits in the workflow.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-0">
                    {STATUS_STEPS.map((step, index) => {
                      const stepIndex = STATUS_STEPS.indexOf(
                        normalizedStatus as (typeof STATUS_STEPS)[number]
                      );
                      const active = stepIndex >= index;
                      const current = normalizedStatus === step;
                      return (
                        <div key={step} className="flex gap-4 pb-4 last:pb-0">
                          <div className="flex flex-col items-center">
                            <div
                              className={`rounded-full w-8 h-8 flex items-center justify-center text-xs font-bold shrink-0 ${
                                active
                                  ? "bg-primary text-primary-foreground"
                                  : "bg-muted text-muted-foreground"
                              } ${current ? "ring-2 ring-primary ring-offset-2" : ""}`}
                            >
                              {active ? (
                                <CheckCircle2 className="h-4 w-4" />
                              ) : (
                                index + 1
                              )}
                            </div>
                            {index < STATUS_STEPS.length - 1 && (
                              <div
                                className={`w-0.5 flex-1 min-h-[24px] ${
                                  active ? "bg-primary" : "bg-muted"
                                }`}
                              />
                            )}
                          </div>
                          <div className="pb-4 last:pb-0">
                            <div className="flex items-center gap-2">
                              <p
                                className={`text-sm font-medium ${
                                  active ? "text-foreground" : "text-muted-foreground"
                                }`}
                              >
                                {statusLabelMap[step]}
                              </p>
                              {current && (
                                <Badge variant="outline" className="text-xs bg-primary/10 text-primary">
                                  Current
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground mt-1">
                              {step === "draft" && "Order started but not finished yet."}
                              {step === "in_progress" && "Intake is being completed and saved."}
                              {step === "pending_payment" && "Payment is still needed before the order can move forward."}
                              {step === "payment_complete" && "Payment is complete and the order is ready for review."}
                              {step === "ready_for_submission" && "Order data is complete and staged for filing submission."}
                              {step === "submitted_to_corpnet" && "The order has been passed into the filing pipeline."}
                              {step === "processing" && "The filing is currently being processed."}
                              {step === "filed" && "The business appears to be filed and documents may begin arriving."}
                              {step === "completed" && "The order workflow is complete."}
                            </p>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>

              {/* Order Timeline */}
              <OrderTimeline orderId={data.order.id} />

              {/* Waiver flow panel — only when order is on a waiver track */}
              {String(data.order.status || "").startsWith("waiver_") && (
                <WaiverDocumentUpload
                  userId={user!.id}
                  orderId={data.order.id}
                  applicationId={(data.order as any).application_id || null}
                  status={data.order.status as string}
                  onRefresh={loadDashboard}
                />
              )}


              {/* Document Vault */}
              <Card id="documents">
                <CardHeader className="flex flex-row items-center justify-between space-y-0">
                  <div>
                    <CardTitle>Document Vault</CardTitle>
                    <CardDescription>
                      Keep formation documents, confirmations, and supporting files in one place.
                    </CardDescription>
                  </div>
                  <Button variant="outline" size="sm" onClick={loadDashboard}>
                    <RefreshCw className="h-3 w-3 mr-1" /> Refresh
                  </Button>
                </CardHeader>
                <CardContent className="space-y-4">
                  <DocumentUploader
                    userId={user!.id}
                    orderId={data.order.id}
                    onUploaded={loadDashboard}
                  />
                  {data.documents.length === 0 ? (
                    <div className="text-center py-10 space-y-3">
                      <FolderOpen className="h-12 w-12 mx-auto text-muted-foreground" />
                      <p className="text-sm font-medium text-muted-foreground">No documents yet</p>
                      <p className="text-xs text-muted-foreground max-w-sm mx-auto">
                        As your order moves forward, approved filings, confirmations, and supporting
                        documents will appear here.
                      </p>
                    </div>
                  ) : (
                    <div className="divide-y">
                      {data.documents.map(doc => (
                        <div key={doc.id} className="flex items-center justify-between py-3 gap-4">
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-medium text-foreground truncate">
                              {(doc.document_type || "Document").replace(/_/g, " ")}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              Uploaded {formatDate(doc.uploaded_at)}
                            </p>
                          </div>
                          <div>
                            {doc.file_url ? (
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={async () => {
                                  const path = doc.file_url || "";
                                  // External URL fallback
                                  if (/^https?:\/\//i.test(path)) {
                                    window.open(path, "_blank", "noopener");
                                    return;
                                  }
                                  const { data: signed, error } = await supabase
                                    .storage
                                    .from("order-documents")
                                    .createSignedUrl(path, 60);
                                  if (signed?.signedUrl) window.open(signed.signedUrl, "_blank", "noopener");
                                  else console.error("Signed URL failed:", error);
                                }}
                              >
                                <Download className="h-3 w-3 mr-1" /> Open
                              </Button>
                            ) : (
                              <Badge variant="secondary" className="text-xs">
                                Pending
                              </Badge>
                            )}
                          </div>
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
                  <CardDescription>
                    Stay guided after checkout — not abandoned.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    {nextSteps.map(item => {
                      const Icon = item.icon;
                      return (
                        <div
                          key={item.title}
                          className="rounded-lg border border-border bg-muted/30 p-4 space-y-3"
                        >
                          <div className="flex items-center gap-3">
                            <div className="rounded-md bg-primary/10 p-2">
                              <Icon className="h-4 w-4 text-primary" />
                            </div>
                            <p className="text-sm font-semibold text-foreground">{item.title}</p>
                          </div>
                          <p className="text-xs text-muted-foreground leading-relaxed">
                            {item.body}
                          </p>
                          <Button variant="ghost" size="sm" asChild className="px-0 text-primary">
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

            {/* ─── RIGHT COLUMN (1/3) ─── */}
            <div className="space-y-6">

              {/* Business Snapshot */}
              <Card>
                <CardHeader>
                  <CardTitle>Business Snapshot</CardTitle>
                  <CardDescription>Core information tied to your current order.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-1">
                  <InfoRow
                    label="Company Name"
                    value={data.business?.company_name || "—"}
                    icon={Building2}
                  />
                  <InfoRow
                    label="Entity Type"
                    value={String(data.order?.entity_type || "LLC").toUpperCase()}
                    icon={FileText}
                  />
                  <InfoRow
                    label="State"
                    value={data.order?.state || "—"}
                    icon={Landmark}
                  />
                  <InfoRow
                    label="Business Purpose"
                    value={data.business?.business_purpose || "General"}
                    icon={Sparkles}
                  />
                  <InfoRow
                    label="Organizer Type"
                    value={data.business?.organizer_type || "—"}
                    icon={UserCircle2}
                  />
                </CardContent>
              </Card>

              {/* Editable Primary Contact */}
              <ProfileEditor
                profile={{
                  first_name: data.contact?.first_name || "",
                  last_name: data.contact?.last_name || "",
                  phone: data.contact?.phone || "",
                }}
                email={data.contact?.email || user?.email || ""}
                userId={user!.id}
                orderId={data.order?.id || null}
                onUpdate={loadDashboard}
              />


              {/* Billing & Order Details */}
              <Card>
                <CardHeader>
                  <CardTitle>Billing & Order Details</CardTitle>
                  <CardDescription>High-trust summary for your records.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">Order Total</span>
                      <span className="text-lg font-bold text-foreground">
                        {currency(data.order?.total_amount)}
                      </span>
                    </div>
                    <Separator className="my-3" />
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Latest Payment Status</span>
                        <span className="font-medium text-foreground">
                          {latestPayment?.status || "—"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Paid On</span>
                        <span className="font-medium text-foreground">
                          {formatDate(latestPayment?.created_at)}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Order Created</span>
                        <span className="font-medium text-foreground">
                          {formatDate(data.order?.created_at)}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="rounded-lg bg-muted/50 p-3 flex gap-3">
                    <Sparkles className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                    <p className="text-xs text-muted-foreground">
                      This dashboard is designed to evolve into a full business control center with
                      document delivery, compliance reminders, support history, and filing
                      milestones.
                    </p>
                  </div>
                </CardContent>
              </Card>

              {/* Trust / Brand Positioning */}
              <Card>
                <CardHeader>
                  <CardTitle>Why this feels different</CardTitle>
                  <CardDescription>
                    EZ Biz is a guided platform, not just a one-time filing form.
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-3">
                  {[
                    "Clear filing status instead of vague email-only updates.",
                    "Central document access instead of scattered attachments.",
                    "Next-step business guidance that creates trust and future growth paths.",
                    "Veteran positioning stays visible without excluding non-veteran customers.",
                  ].map((text, i) => (
                    <div key={i} className="flex items-start gap-3">
                      <CheckCircle2 className="h-4 w-4 text-primary shrink-0 mt-0.5" />
                      <p className="text-sm text-muted-foreground">{text}</p>
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
}
