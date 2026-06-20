import { useEffect, useMemo, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { supabase } from "@/integrations/supabase/client";
import { TrendingUp, Loader2, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Funnel Watch — admin view.
 *
 * Charts the three canonical conversion-funnel events from `public.order_events`:
 *   intake_started → checkout_started → payment_complete
 *
 * Shows counts, step-to-step conversion %, and overall conversion %, scoped
 * by a date range. Data is read straight from `order_events` so it stays in
 * lock-step with the unified draft-order source of truth.
 *
 * NOTE: counts are DISTINCT by `order_id` per step so retries/replays don't
 * inflate the funnel (a customer who fires `checkout_started` twice still
 * counts as one).
 */

type FunnelStep = "intake_started" | "checkout_started" | "payment_complete";
const STEPS: FunnelStep[] = ["intake_started", "checkout_started", "payment_complete"];

function isoDate(d: Date) {
  return d.toISOString().slice(0, 10);
}
function startOfDayISO(s: string) {
  return new Date(`${s}T00:00:00.000Z`).toISOString();
}
function endOfDayISO(s: string) {
  return new Date(`${s}T23:59:59.999Z`).toISOString();
}

export default function FunnelWatchTab() {
  const today = new Date();
  const twoWeeksAgo = new Date(today);
  twoWeeksAgo.setDate(today.getDate() - 13);

  const [startDate, setStartDate] = useState<string>(isoDate(twoWeeksAgo));
  const [endDate, setEndDate] = useState<string>(isoDate(today));
  const [loading, setLoading] = useState(true);
  const [counts, setCounts] = useState<Record<FunnelStep, number>>({
    intake_started: 0,
    checkout_started: 0,
    payment_complete: 0,
  });
  const [error, setError] = useState<string | null>(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data, error } = await supabase
        .from("order_events")
        .select("event_type, order_id, created_at")
        .in("event_type", STEPS as unknown as string[])
        .gte("created_at", startOfDayISO(startDate))
        .lte("created_at", endOfDayISO(endDate))
        .limit(50000);
      if (error) throw error;
      const distinct: Record<FunnelStep, Set<string>> = {
        intake_started: new Set(),
        checkout_started: new Set(),
        payment_complete: new Set(),
      };
      (data ?? []).forEach((row: any) => {
        const t = row.event_type as FunnelStep;
        if (row.order_id && distinct[t]) distinct[t].add(row.order_id);
      });
      setCounts({
        intake_started: distinct.intake_started.size,
        checkout_started: distinct.checkout_started.size,
        payment_complete: distinct.payment_complete.size,
      });
    } catch (e: any) {
      setError(e?.message || "Failed to load funnel data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    void load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [startDate, endDate]);

  const rows = useMemo(() => {
    const top = counts.intake_started || 0;
    return STEPS.map((step, i) => {
      const c = counts[step];
      const prev = i === 0 ? c : counts[STEPS[i - 1]];
      const stepRate = prev > 0 ? (c / prev) * 100 : 0;
      const overall = top > 0 ? (c / top) * 100 : 0;
      const widthPct = top > 0 ? (c / top) * 100 : 0;
      return { step, count: c, stepRate, overall, widthPct };
    });
  }, [counts]);

  const finalRate = rows[rows.length - 1]?.overall ?? 0;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4 flex-wrap">
            <div>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" /> Funnel Watch
              </CardTitle>
              <CardDescription>
                Distinct orders that hit each step, from <code>order_events</code>. Use this
                while traffic ramps to see where customers drop off.
              </CardDescription>
            </div>
            <Button variant="outline" size="sm" onClick={() => void load()} disabled={loading}>
              {loading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <RefreshCcw className="h-4 w-4 mr-2" />}
              Refresh
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid sm:grid-cols-2 gap-4 max-w-xl">
            <div>
              <Label htmlFor="funnel-start">Start date</Label>
              <Input
                id="funnel-start"
                type="date"
                value={startDate}
                max={endDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="funnel-end">End date</Label>
              <Input
                id="funnel-end"
                type="date"
                value={endDate}
                min={startDate}
                max={isoDate(new Date())}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          {error && (
            <div className="text-sm text-destructive border border-destructive/40 rounded-md p-3">
              {error}
            </div>
          )}

          <div className="space-y-3" data-testid="funnel-watch-rows">
            {rows.map((r, i) => (
              <div key={r.step} className="space-y-1.5">
                <div className="flex items-center justify-between text-sm">
                  <div className="font-medium flex items-center gap-2">
                    <Badge variant="outline">{i + 1}</Badge>
                    <code className="text-xs sm:text-sm">{r.step}</code>
                  </div>
                  <div className="flex items-center gap-3 text-xs sm:text-sm tabular-nums">
                    <span className="font-semibold">{r.count.toLocaleString()}</span>
                    {i > 0 && (
                      <span className="text-muted-foreground">
                        step: <span className="font-medium text-foreground">{r.stepRate.toFixed(1)}%</span>
                      </span>
                    )}
                    <span className="text-muted-foreground">
                      overall: <span className="font-medium text-foreground">{r.overall.toFixed(1)}%</span>
                    </span>
                  </div>
                </div>
                <div className="h-3 rounded-full bg-muted overflow-hidden">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${Math.max(r.widthPct, r.count > 0 ? 2 : 0)}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="rounded-md border bg-muted/30 p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
            <div className="text-sm">
              <span className="text-muted-foreground">Intake → Payment conversion</span>
              <span className="ml-2 text-xl font-bold tabular-nums">{finalRate.toFixed(1)}%</span>
            </div>
            <div className="text-xs text-muted-foreground">
              {counts.payment_complete.toLocaleString()} paid of {counts.intake_started.toLocaleString()} intakes
              {" "}({startDate} → {endDate})
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
