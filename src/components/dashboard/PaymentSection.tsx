import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { CreditCard, Lock, ExternalLink } from "lucide-react";
import { useStripeCheckout } from "@/hooks/useStripeCheckout";

interface LineItem {
  priceId: string;
  quantity?: number;
}

interface StateFee {
  amount: number;
  stateName: string;
}

interface PaymentSectionProps {
  amount: number;
  lineItems: LineItem[];
  stateFee?: StateFee;
  onPaymentSuccess?: () => void;
}

const PaymentSection = ({ amount, lineItems, stateFee, onPaymentSuccess }: PaymentSectionProps) => {
  const { checkout, loading } = useStripeCheckout();

  const handleCheckout = async () => {
    await checkout(lineItems, { stateFee });
    onPaymentSuccess?.();
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <CreditCard className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-semibold">Order Summary</h3>
      </div>

      <div className="pt-4 border-t">
        <div className="flex justify-between mb-4">
          <span className="font-semibold">Total Amount:</span>
          <span className="text-2xl font-bold text-primary">${amount}</span>
        </div>

        <Button 
          onClick={handleCheckout} 
          disabled={loading || lineItems.length === 0}
          className="w-full"
          size="lg"
        >
          {loading ? (
            <>Processing...</>
          ) : (
            <>
              <Lock className="h-4 w-4 mr-2" />
              Proceed to Checkout
              <ExternalLink className="h-3 w-3 ml-2" />
            </>
          )}
        </Button>

        <p className="text-xs text-muted-foreground text-center mt-3 flex items-center justify-center gap-1">
          <Lock className="h-3 w-3" />
          Secure payment powered by Stripe
        </p>
      </div>
    </Card>
  );
};

export default PaymentSection;
