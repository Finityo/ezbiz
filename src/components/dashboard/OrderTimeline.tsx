import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle2, Clock } from "lucide-react";

interface OrderEvent {
  id: string;
  order_id: string;
  event_type: string;
  actor: string | null;
  metadata: Record<string, unknown> | null;
  created_at: string | null;
}

const EVENT_LABELS: Record<string, string> = {
  draft: "Order Created",
  in_progress: "Intake In Progress",
  pending_payment: "Awaiting Payment",
  "Pending Payment": "Awaiting Payment",
  payment_complete: "Payment Received",
  ready_for_submission: "Ready for Submission",
  submitted_to_corpnet: "Submitted for Filing",
  submitted: "Submitted for Filing",
  processing: "Formation Processing",
  state_processing: "State Processing",
  filed: "Business Filed",
  completed: "Formation Complete",
  rejected: "Filing Rejected",
  document_uploaded: "Document Uploaded",
  status_changed: "Status Updated",
};

interface OrderTimelineProps {
  orderId: string;
}

export default function OrderTimeline({ orderId }: OrderTimelineProps) {
  const [events, setEvents] = useState<OrderEvent[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadEvents = async () => {
      setLoading(true);
      const { data } = await supabase
        .from("order_events")
        .select("*")
        .eq("order_id", orderId)
        .order("created_at", { ascending: true });

      console.log("TIMELINE EVENTS LOADED", data);
      setEvents((data as OrderEvent[]) || []);
      setLoading(false);
    };

    loadEvents();
  }, [orderId]);

  if (loading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order Timeline</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">Loading timeline…</p>
        </CardContent>
      </Card>
    );
  }

  if (events.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Order Timeline</CardTitle>
          <CardDescription>Activity events will appear here as your order progresses.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-center py-6">
            <Clock className="h-10 w-10 mx-auto text-muted-foreground mb-2" />
            <p className="text-sm text-muted-foreground">No events yet</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Order Timeline</CardTitle>
        <CardDescription>A chronological record of your order's progress.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-0">
          {events.map((event, index) => {
            const label = EVENT_LABELS[event.event_type] || event.event_type;
            const isLast = index === events.length - 1;
            return (
              <div key={event.id} className="flex gap-4 pb-4 last:pb-0">
                <div className="flex flex-col items-center">
                  <div className={`rounded-full w-7 h-7 flex items-center justify-center shrink-0 ${
                    isLast
                      ? "bg-primary text-primary-foreground ring-2 ring-primary ring-offset-2"
                      : "bg-muted text-muted-foreground"
                  }`}>
                    <CheckCircle2 className="h-3.5 w-3.5" />
                  </div>
                  {index < events.length - 1 && (
                    <div className="w-0.5 flex-1 min-h-[20px] bg-muted" />
                  )}
                </div>
                <div className="pb-2">
                  <p className={`text-sm font-medium ${isLast ? "text-foreground" : "text-muted-foreground"}`}>
                    {label}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {event.created_at
                      ? new Date(event.created_at).toLocaleString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        })
                      : "—"}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
