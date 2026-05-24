import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, Mail, CheckCircle2, AlertTriangle, ShieldAlert, Clock } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type EmailLogRow = {
  id: string;
  message_id: string | null;
  template_name: string;
  recipient_email: string;
  status: string;
  error_message: string | null;
  metadata: any;
  created_at: string;
};

type TimeRange = "24h" | "7d" | "30d";

function StatusBadge({ status }: { status: string }) {
  const normalized = status?.toLowerCase() || "";
  if (normalized === "sent")
    return (
      <Badge className="bg-green-600 hover:bg-green-600 text-white gap-1">
        <CheckCircle2 className="h-3 w-3" /> Sent
      </Badge>
    );
  if (normalized === "failed" || normalized === "dlq")
    return (
      <Badge variant="destructive" className="gap-1">
        <AlertTriangle className="h-3 w-3" /> Failed
      </Badge>
    );
  if (normalized === "suppressed")
    return (
      <Badge className="bg-amber-500 hover:bg-amber-500 text-white gap-1">
        <ShieldAlert className="h-3 w-3" /> Suppressed
      </Badge>
    );
  if (normalized === "pending")
    return (
      <Badge variant="secondary" className="gap-1">
        <Clock className="h-3 w-3" /> Pending
      </Badge>
    );
  if (normalized === "bounced")
    return (
      <Badge variant="destructive" className="gap-1">
        <AlertTriangle className="h-3 w-3" /> Bounced
      </Badge>
    );
  if (normalized === "complained")
    return (
      <Badge className="bg-orange-600 hover:bg-orange-600 text-white gap-1">
        <AlertTriangle className="h-3 w-3" /> Complained
      </Badge>
    );
  return <Badge variant="outline">{status}</Badge>;
}

export default function EmailDeliveryLog() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminAuth();
  const { toast } = useToast();

  const [rows, setRows] = useState<EmailLogRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [timeRange, setTimeRange] = useState<TimeRange>("7d");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [templateFilter, setTemplateFilter] = useState<string>("all");
  const [page, setPage] = useState(0);
  const PAGE_SIZE = 50;

  const fetchLogs = async () => {
    setLoading(true);
    try {
      let query = supabase
        .from("email_send_log")
        .select("*")
        .order("created_at", { ascending: false });

      const now = new Date();
      let startDate = new Date();
      if (timeRange === "24h") startDate.setHours(now.getHours() - 24);
      else if (timeRange === "7d") startDate.setDate(now.getDate() - 7);
      else if (timeRange === "30d") startDate.setDate(now.getDate() - 30);
      query = query.gte("created_at", startDate.toISOString());

      if (statusFilter !== "all") {
        query = query.eq("status", statusFilter);
      }

      if (templateFilter !== "all") {
        query = query.eq("template_name", templateFilter);
      }

      const { data, error } = await query;
      if (error) throw error;
      setRows((data as EmailLogRow[]) || []);
    } catch (e: any) {
      toast({
        title: "Failed to load logs",
        description: e?.message || "Could not fetch email delivery log.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) fetchLogs();
  }, [isAdmin, timeRange, statusFilter, templateFilter]);

  const dedupedRows = useMemo(() => {
    const map = new Map<string, EmailLogRow>();
    for (const row of rows) {
      const key = row.message_id || row.id;
      const existing = map.get(key);
      if (!existing || new Date(row.created_at) > new Date(existing.created_at)) {
        map.set(key, row);
      }
    }
    return Array.from(map.values()).sort(
      (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    );
  }, [rows]);

  const templates = useMemo(() => {
    const set = new Set<string>();
    for (const row of rows) {
      if (row.template_name) set.add(row.template_name);
    }
    return Array.from(set).sort();
  }, [rows]);

  const summary = useMemo(() => {
    const total = dedupedRows.length;
    const sent = dedupedRows.filter((r) => r.status?.toLowerCase() === "sent").length;
    const failed = dedupedRows.filter(
      (r) => r.status?.toLowerCase() === "failed" || r.status?.toLowerCase() === "dlq"
    ).length;
    const suppressed = dedupedRows.filter((r) => r.status?.toLowerCase() === "suppressed").length;
    return { total, sent, failed, suppressed };
  }, [dedupedRows]);

  const paginatedRows = useMemo(() => {
    return dedupedRows.slice(page * PAGE_SIZE, (page + 1) * PAGE_SIZE);
  }, [dedupedRows, page]);

  const totalPages = Math.ceil(dedupedRows.length / PAGE_SIZE);

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Email Delivery Log | Admin</title>
        <meta name="robots" content="noindex,nofollow" />
      </Helmet>

      <div className="container mx-auto px-4 py-8 max-w-6xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/admin">
                <ArrowLeft className="h-4 w-4 mr-1" /> Admin
              </Link>
            </Button>
            <h1 className="text-2xl font-semibold">Email Delivery Log</h1>
          </div>
          <Button onClick={fetchLogs} disabled={loading} size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.total}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Sent</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-green-700">{summary.sent}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Failed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-destructive">{summary.failed}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Suppressed</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-amber-600">{summary.suppressed}</div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle className="text-sm">Filters</CardTitle>
            <CardDescription>Narrow results by time, template, or delivery status.</CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4">
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Time range:</span>
              <div className="flex gap-1">
                {(["24h", "7d", "30d"] as TimeRange[]).map((r) => (
                  <Button
                    key={r}
                    variant={timeRange === r ? "default" : "outline"}
                    size="sm"
                    onClick={() => {
                      setTimeRange(r);
                      setPage(0);
                    }}
                  >
                    {r === "24h" ? "Last 24h" : r === "7d" ? "7 days" : "30 days"}
                  </Button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Template:</span>
              <Select
                value={templateFilter}
                onValueChange={(v) => {
                  setTemplateFilter(v);
                  setPage(0);
                }}
              >
                <SelectTrigger className="w-[200px]">
                  <SelectValue placeholder="All templates" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All templates</SelectItem>
                  {templates.map((t) => (
                    <SelectItem key={t} value={t}>
                      {t}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground whitespace-nowrap">Status:</span>
              <Select
                value={statusFilter}
                onValueChange={(v) => {
                  setStatusFilter(v);
                  setPage(0);
                }}
              >
                <SelectTrigger className="w-[160px]">
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All statuses</SelectItem>
                  <SelectItem value="sent">Sent</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                  <SelectItem value="dlq">DLQ</SelectItem>
                  <SelectItem value="suppressed">Suppressed</SelectItem>
                  <SelectItem value="bounced">Bounced</SelectItem>
                  <SelectItem value="complained">Complained</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-5 w-5" />
              Notifications
            </CardTitle>
            <CardDescription>
              Showing {dedupedRows.length} unique email(s) (latest status per message).
            </CardDescription>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="py-2 pr-4">Template</th>
                  <th className="py-2 pr-4">Recipient</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Timestamp</th>
                  <th className="py-2 pr-4">Error</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRows.map((row) => (
                  <tr key={row.id} className="border-b align-top hover:bg-muted/40 transition-colors">
                    <td className="py-3 pr-4 font-medium">{row.template_name}</td>
                    <td className="py-3 pr-4">{row.recipient_email}</td>
                    <td className="py-3 pr-4">
                      <StatusBadge status={row.status} />
                    </td>
                    <td className="py-3 pr-4 whitespace-nowrap">
                      {new Date(row.created_at).toLocaleString()}
                    </td>
                    <td className="py-3 pr-4 text-destructive max-w-xs truncate" title={row.error_message || ""}>
                      {row.error_message || "—"}
                    </td>
                  </tr>
                ))}
                {paginatedRows.length === 0 && !loading && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      No emails found for the selected filters.
                    </td>
                  </tr>
                )}
                {loading && (
                  <tr>
                    <td colSpan={5} className="py-8 text-center text-muted-foreground">
                      <RefreshCw className="h-4 w-4 animate-spin inline mr-2" />
                      Loading...
                    </td>
                  </tr>
                )}
              </tbody>
            </table>

            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4">
                <div className="text-sm text-muted-foreground">
                  Page {page + 1} of {totalPages}
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={page === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
                    disabled={page >= totalPages - 1}
                  >
                    Next
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
