import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertTriangle,
  Check,
  CircleDot,
  Mail,
  Search,
  ShieldCheck,
  UserCheck,
  X,
} from "lucide-react";
import { Link } from "react-router-dom";

type FlightRow = {
  id: string;
  order_number: number | null;
  email: string | null;
  user_id: string | null;
  package: string | null;
  state: string | null;
  selected_state: string | null;
  status: string | null;
  current_step: number | null;
  veteran_eligible: boolean | null;
  veteran_waiver_applied: boolean | null;
  veteran_waiver_amount: number | null;
  vvl_pdf_downloaded: boolean | null;
  email_confirmed_at: string | null;
  business_info_saved_at: string | null;
  total_amount: number | null;
  last_activity_at: string | null;
  needs_attention: boolean | null;
};

type FilterKey = "all" | "attention" | "draft" | "awaiting_payment" | "veteran" | "missing_docs";

const STATUS_TONE: Record<string, string> = {
  draft: "bg-gray-200 text-gray-800",
  intake_started: "bg-slate-200 text-slate-800",
  pending_payment: "bg-yellow-100 text-yellow-900",
  waiver_documents_pending: "bg-amber-100 text-amber-900",
  payment_complete: "bg-emerald-100 text-emerald-900",
  in_processing: "bg-blue-100 text-blue-900",
  submitted_to_corpnet: "bg-blue-100 text-blue-900",
  filed: "bg-green-100 text-green-900",
  completed: "bg-green-200 text-green-900",
  cancelled: "bg-rose-100 text-rose-900",
  rejected: "bg-rose-100 text-rose-900",
};

const YesNo = ({ on, label }: { on: boolean; label?: string }) =>
  on ? (
    <span className="inline-flex items-center gap-1 text-success" title={label}>
      <Check className="h-4 w-4" />
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 text-muted-foreground/70" title={label}>
      <X className="h-4 w-4" />
    </span>
  );

export default function FlightControlTab() {
  const [rows, setRows] = useState<FlightRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [search, setSearch] = useState("");

  const load = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from("orders")
      .select(
        "id, order_number, email, user_id, package, state, selected_state, status, current_step, veteran_eligible, veteran_waiver_applied, veteran_waiver_amount, vvl_pdf_downloaded, email_confirmed_at, business_info_saved_at, total_amount, last_activity_at, needs_attention",
      )
      .order("last_activity_at", { ascending: false, nullsFirst: false })
      .limit(200);
    if (!error && data) setRows(data as FlightRow[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
    const channel = supabase
      .channel("admin-flight-control")
      .on("postgres_changes", { event: "*", schema: "public", table: "orders" }, () => load())
      .on("postgres_changes", { event: "*", schema: "public", table: "order_events" }, () => load())
      .subscribe();
    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const filtered = useMemo(() => {
    let out = rows;
    if (filter === "attention")
      out = out.filter(
        (r) =>
          r.needs_attention ||
          (r.status === "pending_payment" && r.last_activity_at && Date.now() - new Date(r.last_activity_at).getTime() > 24 * 3600 * 1000) ||
          (r.veteran_eligible && !r.vvl_pdf_downloaded && (r.current_step ?? 0) >= 3),
      );
    if (filter === "draft") out = out.filter((r) => r.status === "draft" || r.status === "intake_started");
    if (filter === "awaiting_payment") out = out.filter((r) => r.status === "pending_payment");
    if (filter === "veteran") out = out.filter((r) => r.veteran_eligible);
    if (filter === "missing_docs")
      out = out.filter((r) => r.veteran_eligible && !r.vvl_pdf_downloaded);
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      out = out.filter(
        (r) =>
          (r.email ?? "").toLowerCase().includes(q) ||
          (r.package ?? "").toLowerCase().includes(q) ||
          (r.state ?? "").toLowerCase().includes(q) ||
          String(r.order_number ?? "").includes(q),
      );
    }
    return out;
  }, [rows, filter, search]);

  const counts = useMemo(() => {
    return {
      total: rows.length,
      attention: rows.filter(
        (r) =>
          r.needs_attention ||
          (r.veteran_eligible && !r.vvl_pdf_downloaded && (r.current_step ?? 0) >= 3),
      ).length,
      draft: rows.filter((r) => r.status === "draft" || r.status === "intake_started").length,
      awaiting: rows.filter((r) => r.status === "pending_payment").length,
      veteran: rows.filter((r) => r.veteran_eligible).length,
    };
  }, [rows]);

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <StatCard label="Active orders" value={counts.total} />
        <StatCard label="Needs attention" value={counts.attention} tone="amber" />
        <StatCard label="Drafts" value={counts.draft} />
        <StatCard label="Awaiting payment" value={counts.awaiting} tone="yellow" />
        <StatCard label="Veteran orders" value={counts.veteran} tone="green" />
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-3 flex-wrap">
          <CardTitle className="text-lg">Flight Control</CardTitle>
          <div className="flex items-center gap-2 flex-wrap">
            <div className="relative">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search email, package, state…"
                className="pl-8 w-64"
              />
            </div>
            {(
              [
                ["all", "All"],
                ["attention", "Needs attention"],
                ["draft", "Drafts"],
                ["awaiting_payment", "Awaiting payment"],
                ["veteran", "Veteran"],
                ["missing_docs", "Missing VVL"],
              ] as [FilterKey, string][]
            ).map(([key, label]) => (
              <Button
                key={key}
                size="sm"
                variant={filter === key ? "default" : "outline"}
                onClick={() => setFilter(key)}
              >
                {label}
              </Button>
            ))}
            <Button size="sm" variant="ghost" onClick={load}>
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Order</TableHead>
                  <TableHead>Customer</TableHead>
                  <TableHead>Pkg</TableHead>
                  <TableHead>State</TableHead>
                  <TableHead className="text-center">Email ✓</TableHead>
                  <TableHead className="text-center">Veteran</TableHead>
                  <TableHead className="text-center">Waiver</TableHead>
                  <TableHead className="text-center">VVL</TableHead>
                  <TableHead className="text-center">Biz info</TableHead>
                  <TableHead>Step</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-center">⚠</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading && (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center text-muted-foreground py-8">
                      Loading orders…
                    </TableCell>
                  </TableRow>
                )}
                {!loading && filtered.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={12} className="text-center text-muted-foreground py-8">
                      No orders match the current filter.
                    </TableCell>
                  </TableRow>
                )}
                {filtered.map((r) => {
                  const needsAttention =
                    r.needs_attention ||
                    (r.veteran_eligible && !r.vvl_pdf_downloaded && (r.current_step ?? 0) >= 3);
                  return (
                    <TableRow key={r.id} className={needsAttention ? "bg-amber-50/40 dark:bg-amber-950/10" : ""}>
                      <TableCell className="font-mono text-xs">#{r.order_number ?? "—"}</TableCell>
                      <TableCell className="max-w-[180px] truncate" title={r.email ?? ""}>
                        {r.email ?? <span className="text-muted-foreground italic">guest</span>}
                      </TableCell>
                      <TableCell className="uppercase text-xs">{r.package ?? "—"}</TableCell>
                      <TableCell>{r.selected_state ?? r.state ?? "—"}</TableCell>
                      <TableCell className="text-center">
                        <YesNo on={!!r.email_confirmed_at} label="Email confirmed" />
                      </TableCell>
                      <TableCell className="text-center">
                        <YesNo on={!!r.veteran_eligible} label="Veteran eligible" />
                      </TableCell>
                      <TableCell className="text-center">
                        {r.veteran_waiver_applied ? (
                          <Badge className="bg-success/15 text-success border-success/30">
                            <ShieldCheck className="h-3 w-3 mr-1" />${r.veteran_waiver_amount ?? 0}
                          </Badge>
                        ) : (
                          <span className="text-muted-foreground/60 text-xs">—</span>
                        )}
                      </TableCell>
                      <TableCell className="text-center">
                        <YesNo on={!!r.vvl_pdf_downloaded} label="VVL downloaded" />
                      </TableCell>
                      <TableCell className="text-center">
                        <YesNo on={!!r.business_info_saved_at} label="Business info saved" />
                      </TableCell>
                      <TableCell>{r.current_step ?? 0}/5</TableCell>
                      <TableCell>
                        <Badge className={STATUS_TONE[r.status ?? ""] ?? "bg-muted text-foreground"}>
                          {(r.status ?? "draft").replace(/_/g, " ")}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-center">
                        {needsAttention ? (
                          <AlertTriangle className="h-4 w-4 text-amber-600 mx-auto" />
                        ) : (
                          <CircleDot className="h-3 w-3 text-muted-foreground/40 mx-auto" />
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <p className="text-xs text-muted-foreground">
        Tip: click into the “Orders” tab for the full order detail dialog including timeline, internal notes, and document vault.
      </p>
    </div>
  );
}

function StatCard({
  label,
  value,
  tone,
}: {
  label: string;
  value: number;
  tone?: "amber" | "yellow" | "green";
}) {
  const toneClass =
    tone === "amber"
      ? "text-amber-700"
      : tone === "yellow"
      ? "text-yellow-700"
      : tone === "green"
      ? "text-success"
      : "text-foreground";
  return (
    <Card>
      <CardContent className="p-4">
        <p className="text-xs uppercase text-muted-foreground">{label}</p>
        <p className={`text-2xl font-bold ${toneClass}`}>{value}</p>
      </CardContent>
    </Card>
  );
}
