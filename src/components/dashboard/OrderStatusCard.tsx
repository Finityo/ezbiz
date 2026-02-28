import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Download, Clock, CheckCircle, AlertCircle, XCircle, Send, Eye } from "lucide-react";
import { cn } from "@/lib/utils";

export interface Order {
  id: string;
  businessName: string;
  entityType: string;
  state: string;
  status: string;
  package: string;
  submittedDate: string;
  lastUpdated: string;
  documents?: Array<{
    name: string;
    url: string;
  }>;
}

const statusConfig: Record<string, { label: string; color: string; icon: typeof Clock }> = {
  draft: {
    label: "Draft",
    color: "bg-muted text-muted-foreground",
    icon: Clock
  },
  pending: {
    label: "Pending",
    color: "bg-warning text-warning-foreground",
    icon: Clock
  },
  processing: {
    label: "Processing",
    color: "bg-blue-500 text-white",
    icon: Clock
  },
  submitted: {
    label: "Submitted",
    color: "bg-blue-600 text-white",
    icon: Send
  },
  "in-review": {
    label: "In Review",
    color: "bg-amber-500 text-white",
    icon: Eye
  },
  filed: {
    label: "Filed",
    color: "bg-primary text-primary-foreground",
    icon: FileText
  },
  completed: {
    label: "Completed",
    color: "bg-success text-success-foreground",
    icon: CheckCircle
  },
  rejected: {
    label: "Rejected",
    color: "bg-destructive text-destructive-foreground",
    icon: XCircle
  }
};

interface OrderStatusCardProps {
  order: Order;
  onViewDetails?: (orderId: string) => void;
}

const OrderStatusCard = ({ order, onViewDetails }: OrderStatusCardProps) => {
  const config = statusConfig[order.status] || statusConfig.draft;
  const StatusIcon = config.icon;

  return (
    <Card className="p-6 hover:shadow-md transition-smooth">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h3 className="text-xl font-bold">{order.businessName}</h3>
            <Badge className={cn(config.color, "flex items-center gap-1")}>
              <StatusIcon className="h-3 w-3" />
              {config.label}
            </Badge>
          </div>
          
          <div className="space-y-1 text-sm text-muted-foreground">
            <p><span className="font-medium">Type:</span> {order.entityType}</p>
            <p><span className="font-medium">State:</span> {order.state}</p>
            <p><span className="font-medium">Package:</span> {order.package}</p>
            <p><span className="font-medium">Order ID:</span> {order.id}</p>
          </div>
        </div>
      </div>

      <div className="border-t pt-4 space-y-3">
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Submitted:</span>
          <span className="font-medium">{new Date(order.submittedDate).toLocaleDateString()}</span>
        </div>
        
        <div className="flex justify-between text-sm">
          <span className="text-muted-foreground">Last Updated:</span>
          <span className="font-medium">{new Date(order.lastUpdated).toLocaleDateString()}</span>
        </div>
      </div>

      {order.documents && order.documents.length > 0 && (
        <div className="mt-4 pt-4 border-t">
          <h4 className="text-sm font-semibold mb-3 flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Available Documents
          </h4>
          <div className="space-y-2">
            {order.documents.map((doc, index) => (
              <Button
                key={index}
                variant="outline"
                size="sm"
                className="w-full justify-between"
                onClick={() => window.open(doc.url, '_blank')}
              >
                <span className="truncate">{doc.name}</span>
                <Download className="h-4 w-4 ml-2 flex-shrink-0" />
              </Button>
            ))}
          </div>
        </div>
      )}

      {onViewDetails && (
        <Button
          className="w-full mt-4"
          variant="secondary"
          onClick={() => onViewDetails(order.id)}
        >
          View Details
        </Button>
      )}
    </Card>
  );
};

export default OrderStatusCard;
