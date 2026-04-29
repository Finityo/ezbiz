import { useEffect, useMemo, useState } from "react";
import { Helmet } from "react-helmet-async";
import { Link, Navigate } from "react-router-dom";
import { ArrowLeft, RefreshCw, Copy, AlertTriangle, CheckCircle2, HelpCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useAdminAuth } from "@/hooks/useAdminAuth";
import { supabase } from "@/integrations/supabase/client";
import {
  PACKAGE_PRICES,
  ADDON_PRICES,
  PROCESSING_PRICES,
  SHIPPING_PRICE,
  SHIPPING_STRIPE_PRICE_ID,
} from "@/lib/pricing";

type AuditItem = {
  key: string;
  label: string;
  expectedCents: number | null;
  stripePriceId: string | null;
};

type AuditResult = AuditItem & {
  status: "ok" | "mismatch" | "missing_id" | "not_found" | "error";
  liveAmount: number | null;
  currency: string | null;
  active: boolean | null;
  error?: string;
};

function buildItems(): AuditItem[] {
  const items: AuditItem[] = [];
  for (const [key, p] of Object.entries(PACKAGE_PRICES)) {
    items.push({
      key: `pkg:${key}`,
      label: `Package · ${p.name} ($${p.price})`,
      expectedCents: p.price * 100,
      stripePriceId: p.stripePriceId || null,
    });
  }
  for (const [key, a] of Object.entries(ADDON_PRICES)) {
    items.push({
      key: `addon:${key}`,
      label: `Add-on · ${a.name} ($${a.price})`,
      expectedCents: a.price * 100,
      stripePriceId: a.stripePriceId || null,
    });
  }
  for (const [key, s] of Object.entries(PROCESSING_PRICES)) {
    if (!s.stripePriceId && s.price === 0) continue;
    items.push({
      key: `processing:${key}`,
      label: `Processing · ${s.name} ($${s.price})`,
      expectedCents: s.price * 100,
      stripePriceId: s.stripePriceId || null,
    });
  }
  items.push({
    key: "shipping",
    label: `Shipping & Handling ($${SHIPPING_PRICE})`,
    expectedCents: SHIPPING_PRICE * 100,
    stripePriceId: SHIPPING_STRIPE_PRICE_ID,
  });
  return items;
}

function StatusBadge({ status }: { status: AuditResult["status"] }) {
  if (status === "ok")
    return (
      <Badge className="bg-green-600 hover:bg-green-600 text-white gap-1">
        <CheckCircle2 className="h-3 w-3" /> OK
      </Badge>
    );
  if (status === "mismatch")
    return (
      <Badge variant="destructive" className="gap-1">
        <AlertTriangle className="h-3 w-3" /> Mismatch
      </Badge>
    );
  if (status === "missing_id")
    return (
      <Badge variant="secondary" className="gap-1">
        <HelpCircle className="h-3 w-3" /> No Stripe ID
      </Badge>
    );
  if (status === "not_found")
    return (
      <Badge variant="destructive" className="gap-1">
        <AlertTriangle className="h-3 w-3" /> Not Found
      </Badge>
    );
  return <Badge variant="outline">Error</Badge>;
}

export default function StripePriceAudit() {
  const { user, loading: authLoading } = useAuth();
  const { isAdmin, loading: adminLoading } = useAdminAuth();
  const { toast } = useToast();

  const items = useMemo(buildItems, []);
  const [results, setResults] = useState<AuditResult[]>([]);
  const [overrides, setOverrides] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);

  const runAudit = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("stripe-price-audit", {
        body: { items },
      });
      if (error) throw error;
      setResults((data as { results: AuditResult[] }).results);
    } catch (e: any) {
      toast({
        title: "Audit failed",
        description: e?.message || "Could not fetch Stripe price data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAdmin) runAudit();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAdmin]);

  if (authLoading || adminLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
      </div>
    );
  }
  if (!user) return <Navigate to="/auth" replace />;
  if (!isAdmin) return <Navigate to="/" replace />;

  const summary = {
    ok: results.filter((r) => r.status === "ok").length,
    mismatch: results.filter((r) => r.status === "mismatch").length,
    missing: results.filter((r) => r.status === "missing_id" || r.status === "not_found").length,
  };

  const copyJson = () => {
    const lines = results
      .filter((r) => overrides[r.key])
      .map((r) => `  "${r.key}": "${overrides[r.key]}"`);
    const json = `{\n${lines.join(",\n")}\n}`;
    navigator.clipboard.writeText(json);
    toast({ title: "Copied", description: "Override map copied to clipboard." });
  };

  return (
    <div className="min-h-screen bg-background">
      <Helmet>
        <title>Stripe Price Audit | Admin</title>
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
            <h1 className="text-2xl font-semibold">Stripe Price Audit</h1>
          </div>
          <Button onClick={runAudit} disabled={loading} size="sm">
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Summary</CardTitle>
            <CardDescription>
              Compares each item's expected unit_amount in <code>src/lib/pricing.ts</code> against the
              live Stripe Price.
            </CardDescription>
          </CardHeader>
          <CardContent className="flex flex-wrap gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">OK: </span>
              <span className="font-semibold text-green-700">{summary.ok}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Mismatched: </span>
              <span className="font-semibold text-destructive">{summary.mismatch}</span>
            </div>
            <div>
              <span className="text-muted-foreground">Missing / Not found: </span>
              <span className="font-semibold">{summary.missing}</span>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Items</CardTitle>
              <CardDescription>
                Paste a replacement Price ID in any row to record an override, then copy the JSON.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={copyJson}>
              <Copy className="h-4 w-4 mr-2" /> Copy overrides
            </Button>
          </CardHeader>
          <CardContent className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left text-muted-foreground">
                  <th className="py-2 pr-4">Item</th>
                  <th className="py-2 pr-4">Expected</th>
                  <th className="py-2 pr-4">Live (Stripe)</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Current Price ID</th>
                  <th className="py-2 pr-4">Replacement Price ID</th>
                </tr>
              </thead>
              <tbody>
                {results.map((r) => (
                  <tr key={r.key} className="border-b align-top">
                    <td className="py-3 pr-4 font-medium">{r.label}</td>
                    <td className="py-3 pr-4 whitespace-nowrap">
                      {r.expectedCents != null
                        ? `$${(r.expectedCents / 100).toFixed(2)}`
                        : "—"}
                    </td>
                    <td className="py-3 pr-4 whitespace-nowrap">
                      {r.liveAmount != null ? `$${(r.liveAmount / 100).toFixed(2)}` : "—"}
                      {r.active === false && (
                        <Badge variant="outline" className="ml-2 text-xs">inactive</Badge>
                      )}
                    </td>
                    <td className="py-3 pr-4">
                      <StatusBadge status={r.status} />
                    </td>
                    <td className="py-3 pr-4 font-mono text-xs break-all">
                      {r.stripePriceId || <span className="text-muted-foreground">—</span>}
                    </td>
                    <td className="py-3 pr-4 min-w-[260px]">
                      <Input
                        placeholder="price_..."
                        value={overrides[r.key] || ""}
                        onChange={(e) =>
                          setOverrides((o) => ({ ...o, [r.key]: e.target.value.trim() }))
                        }
                        className="font-mono text-xs"
                      />
                    </td>
                  </tr>
                ))}
                {results.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-muted-foreground">
                      No data. Click Refresh.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </CardContent>
        </Card>

        <p className="text-xs text-muted-foreground mt-4">
          Replacement IDs entered here are NOT applied automatically. After copying, paste the
          replacements into the pricing config (<code>src/lib/pricing.ts</code>) and the matching
          <code>EXPECTED_PRICE_CENTS</code> map in the Lovable Cloud checkout function.
        </p>
      </div>
    </div>
  );
}
