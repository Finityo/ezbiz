import { useNavigate } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Footer from "@/components/Footer";
import { useOrderContext } from "@/contexts/OrderContext";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";
import { PACKAGES, ADDONS, PROCESSING_SPEEDS, SHIPPING, type PackageId, type AddonId, getStripeLineItems, calculateOrderTotal } from "@/config/pricing";
import { getStateFee, getCorpStateFee } from "@/lib/state-fees";
import { trackCheckoutStart } from "@/lib/analytics";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import OrderProgressBar from "@/components/order/OrderProgressBar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Lock, ArrowLeft, Loader2, Building2, User, MapPin, FileText, CreditCard,
} from "lucide-react";
import { formatPrice } from "@/lib/utils";

const ENTITY_LABELS: Record<string, string> = {
  llc: "LLC",
  "c-corp": "C Corporation",
  "s-corp": "S Corporation",
  nonprofit: "Nonprofit",
  "professional-corp": "Professional Corporation",
};

const CORP_ENTITIES = ["c-corp", "s-corp", "nonprofit", "professional-corp"];

export default function Checkout() {
  const navigate = useNavigate();
  const { order } = useOrderContext();
  const { checkout, loading, error, clearError } = useStripeCheckout();

  const pkg = PACKAGES[order.packageId as PackageId];
  const isCorpType = CORP_ENTITIES.includes(order.entityType);
  const stateFee = order.state
    ? isCorpType
      ? getCorpStateFee(order.state)
      : getStateFee(order.state)
    : 0;

  const addonsTotal = order.selectedAddOns.reduce((sum, id) => {
    const addon = ADDONS[id as AddonId];
    return sum + (addon?.price || 0);
  }, 0);

  const speedConfig = PROCESSING_SPEEDS[order.processingSpeed || "standard"];
  const processingFee = speedConfig?.price || 0;
  const shippingFee = SHIPPING.price;

  const total = (pkg?.price || 0) + addonsTotal + stateFee + processingFee + shippingFee;

  const handleCheckout = async () => {
    const lineItems = getStripeLineItems(
      order.packageId as PackageId,
      order.selectedAddOns as AddonId[],
      { processingSpeed: order.processingSpeed || "standard" }
    );

    trackCheckoutStart(pkg?.name || order.packageId, total);

    await checkout(lineItems, {
      stateFee: { amount: stateFee, stateName: order.state },
      successPath: "/order-success",
      cancelPath: "/order/checkout",
      orderId: order.orderId || undefined,
    });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Navigation />
      <div className="flex-grow bg-gradient-to-br from-primary/5 via-background to-accent/5 py-8 px-4">
        <div className="max-w-2xl mx-auto space-y-6">
          <OrderProgressBar currentStep={5} />

          <h1 className="text-2xl sm:text-3xl font-bold text-center">Review Your Order</h1>
          <p className="text-center text-muted-foreground">
            Confirm your details and proceed to secure payment.
          </p>

          {/* Order Summary */}
          <Card className="p-5 sm:p-6 space-y-4">
            {/* Company Details */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <Building2 className="h-4 w-4" /> Company
              </h3>
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div>
                  <p className="text-muted-foreground">Business Name</p>
                  <p className="font-medium">{order.business.companyName || "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Entity Type</p>
                  <p className="font-medium">{ENTITY_LABELS[order.entityType] || order.entityType}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">State</p>
                  <p className="font-medium">{order.state || "—"}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Management</p>
                  <p className="font-medium capitalize">{order.managementType.replace("_", "-")}</p>
                </div>
              </div>
            </div>

            <Separator />

            {/* Contact */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <User className="h-4 w-4" /> Contact
              </h3>
              <p className="text-sm">
                {order.contact.firstName} {order.contact.lastName} • {order.contact.email} • {order.contact.phone}
              </p>
            </div>

            <Separator />

            {/* Address */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <MapPin className="h-4 w-4" /> Business Address
              </h3>
              <p className="text-sm">
                {order.businessAddress.address1}
                {order.businessAddress.address2 && `, ${order.businessAddress.address2}`}
                {order.businessAddress.city && `, ${order.businessAddress.city}`}
                {order.businessAddress.state && `, ${order.businessAddress.state}`} {order.businessAddress.zip}
              </p>
            </div>

            <Separator />

            {/* Participants */}
            {order.participants.length > 0 && (
              <>
                <div className="space-y-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground">
                    Participants ({order.participants.length})
                  </h3>
                  <div className="space-y-1">
                    {order.participants.map((p) => (
                      <p key={p.id} className="text-sm">
                        {p.firstName} {p.lastName} — {p.role} ({p.ownershipPercent}%)
                        {p.authorizedSigner && <Badge variant="outline" className="ml-2 text-xs">Signer</Badge>}
                      </p>
                    ))}
                  </div>
                </div>
                <Separator />
              </>
            )}

            {/* IRS Party (masked) */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
                <FileText className="h-4 w-4" /> IRS Responsible Party
              </h3>
              <p className="text-sm">
                {order.irsParty.firstName} {order.irsParty.lastName} — {order.irsParty.title}
              </p>
              <p className="text-sm text-muted-foreground">SSN: •••-••-{order.irsParty.ssn.slice(-4)}</p>
            </div>
          </Card>

          {/* Pricing Breakdown */}
          <Card className="p-5 sm:p-6 space-y-3">
            <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-2">
              <CreditCard className="h-4 w-4" /> Pricing Summary
            </h3>

            <div className="space-y-2">
              {pkg && (
                <div className="flex justify-between text-sm">
                  <span>{pkg.name} Package</span>
                  <span>${formatPrice(pkg.price)}</span>
                </div>
              )}

              {order.selectedAddOns.map((id) => {
                const addon = ADDONS[id as AddonId];
                return addon ? (
                  <div key={id} className="flex justify-between text-sm">
                    <span>{addon.name}</span>
                    <span>${formatPrice(addon.price)}</span>
                  </div>
                ) : null;
              })}

              <div className="flex justify-between text-sm">
                <span>{order.state || "State"} Filing Fee</span>
                <span>${formatPrice(stateFee)}</span>
              </div>

              {processingFee > 0 && (
                <div className="flex justify-between text-sm">
                  <span>{speedConfig.name}</span>
                  <span>${formatPrice(processingFee)}</span>
                </div>
              )}

              <div className="flex justify-between text-sm">
                <span>{SHIPPING.name}</span>
                <span>${formatPrice(shippingFee)}</span>
              </div>

              <Separator />

              <div className="flex justify-between text-lg font-bold">
                <span>Total</span>
                <span className="text-primary">${formatPrice(total)}</span>
              </div>
            </div>
          </Card>

          {/* Error display */}
          {error && (
            <div className="rounded-lg border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive text-center">
              {error}
              <button onClick={clearError} className="ml-2 underline text-xs">Dismiss</button>
            </div>
          )}

          {/* Actions */}
          <div className="flex justify-between items-center pt-2">
            <Button variant="outline" onClick={() => navigate("/order/terms")} disabled={loading}>
              <ArrowLeft className="h-4 w-4 mr-2" /> Back
            </Button>
            <Button onClick={handleCheckout} disabled={loading} size="lg" className="min-w-[200px]">
              {loading ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" /> Processing...</>
              ) : (
                <><Lock className="h-4 w-4 mr-2" /> Pay ${formatPrice(total)}</>
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center flex items-center justify-center gap-1">
            <Lock className="h-3 w-3" /> Secure payment powered by Stripe
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}
