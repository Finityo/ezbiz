import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShieldCheck, FileWarning, CreditCard, Sparkles } from "lucide-react";

export interface ActiveOrderSummary {
  id: string;
  package: string | null;
  selected_addons?: unknown[] | null;
  state: string | null;
  selected_state?: string | null;
  current_step?: number | null;
  status: string | null;
  veteran_eligible?: boolean | null;
  veteran_waiver_applied?: boolean | null;
  veteran_waiver_amount?: number | null;
  vvl_pdf_downloaded?: boolean | null;
  total_amount?: number | null;
  documents_count?: number;
  payments_count?: number;
}

const STEP_LABELS = [
  "Start your order",
  "Select your state",
  "Choose your package",
  "Tell us about your business",
  "Create your account",
  "Review & checkout",
];

function nextAction(order: ActiveOrderSummary) {
  const status = (order.status ?? "").toLowerCase();
  if (status === "pending_payment")
    return {
      icon: CreditCard,
      title: "Complete checkout",
      desc: "Your order is ready — finish payment to begin filing.",
      cta: "Pay now",
      href: `/order-flow?resume=1&orderId=${order.id}`,
    };
  if (status === "waiver_documents_pending")
    return {
      icon: FileWarning,
      title: "Upload your waiver documents",
      desc: "We need your VVL + Form 05-904 before the $300 state fee can be waived.",
      cta: "Upload documents",
      href: "#documents",
    };
  if (status === "payment_complete" || status === "in_processing")
    return {
      icon: Sparkles,
      title: "We're processing your filing",
      desc: "Your order is paid. Watch this page for documents and status updates.",
      cta: "View status",
      href: "#status",
    };
  const step = Math.max(1, Math.min(5, order.current_step ?? 1));
  return {
    icon: ArrowRight,
    title: STEP_LABELS[step] ?? "Continue your order",
    desc: "Pick up right where you left off — your selections are saved.",
    cta: "Resume",
    href: `/order-flow?resume=1&orderId=${order.id}`,
  };
}

export default function ActiveOrderResumeCard({ order }: { order: ActiveOrderSummary }) {
  const action = nextAction(order);
  const Icon = action.icon;
  const addons = Array.isArray(order.selected_addons) ? order.selected_addons : [];
  const stateLabel = order.selected_state || order.state || "—";
  const waiverActive = !!order.veteran_waiver_applied && !!order.veteran_waiver_amount;

  return (
    <Card className="overflow-hidden border-primary/30">
      <CardContent className="p-0">
        <div className="grid md:grid-cols-3">
          <div className="md:col-span-2 p-6 space-y-4">
            <div className="flex flex-wrap items-center gap-2">
              <Badge variant="outline" className="border-primary/30 text-primary">
                Active order
              </Badge>
              {order.package && (
                <Badge variant="secondary" className="uppercase tracking-wide">
                  {order.package}
                </Badge>
              )}
              <Badge variant="outline">{stateLabel}</Badge>
              {waiverActive && (
                <Badge className="bg-success/15 text-success border-success/30 hover:bg-success/20">
                  <ShieldCheck className="h-3.5 w-3.5 mr-1" />
                  ${order.veteran_waiver_amount} TX Veteran Waiver
                </Badge>
              )}
              {order.veteran_eligible && !order.vvl_pdf_downloaded && (
                <Badge className="bg-yellow-100 text-yellow-900 border-yellow-300">
                  VVL not downloaded
                </Badge>
              )}
            </div>

            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <Icon className="h-5 w-5 text-primary" />
                <h2 className="text-xl font-bold">{action.title}</h2>
              </div>
              <p className="text-sm text-muted-foreground">{action.desc}</p>
            </div>

            {addons.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {addons.map((a, i) => (
                  <span
                    key={i}
                    className="text-xs rounded-full bg-muted px-2.5 py-1 text-muted-foreground"
                  >
                    {String(a)}
                  </span>
                ))}
              </div>
            )}

            <Button asChild size="lg" className="mt-2">
              <Link to={action.href}>
                {action.cta} <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>

          <div className="bg-muted/30 p-6 border-t md:border-t-0 md:border-l border-border space-y-3 text-sm">
            <div>
              <p className="text-xs uppercase text-muted-foreground">Status</p>
              <p className="font-semibold capitalize">
                {(order.status ?? "draft").replace(/_/g, " ")}
              </p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">Documents</p>
              <p className="font-semibold">{order.documents_count ?? 0} on file</p>
            </div>
            <div>
              <p className="text-xs uppercase text-muted-foreground">Payments</p>
              <p className="font-semibold">{order.payments_count ?? 0} recorded</p>
            </div>
            {typeof order.total_amount === "number" && order.total_amount > 0 && (
              <div>
                <p className="text-xs uppercase text-muted-foreground">Estimated total</p>
                <p className="font-semibold">${order.total_amount}</p>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
