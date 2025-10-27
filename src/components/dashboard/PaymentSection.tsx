import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CreditCard, Lock } from "lucide-react";
import { toast } from "sonner";

interface PaymentSectionProps {
  amount: number;
  orderId: string;
  onPaymentSuccess: () => void;
}

const PaymentSection = ({ amount, orderId, onPaymentSuccess }: PaymentSectionProps) => {
  const [loading, setLoading] = useState(false);
  const [cardDetails, setCardDetails] = useState({
    number: "",
    expiry: "",
    cvc: "",
    name: ""
  });

  const handlePayment = async () => {
    setLoading(true);
    
    try {
      // TODO: Integrate with Stripe when API is ready
      // For now, simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      toast.success("Payment processed successfully!");
      onPaymentSuccess();
    } catch (error) {
      toast.error("Payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="p-6">
      <div className="flex items-center gap-2 mb-6">
        <CreditCard className="h-5 w-5 text-primary" />
        <h3 className="text-xl font-semibold">Payment Information</h3>
      </div>

      <div className="space-y-4">
        <div>
          <Label htmlFor="cardName">Cardholder Name</Label>
          <Input
            id="cardName"
            placeholder="John Doe"
            value={cardDetails.name}
            onChange={(e) => setCardDetails({ ...cardDetails, name: e.target.value })}
          />
        </div>

        <div>
          <Label htmlFor="cardNumber">Card Number</Label>
          <Input
            id="cardNumber"
            placeholder="1234 5678 9012 3456"
            value={cardDetails.number}
            onChange={(e) => setCardDetails({ ...cardDetails, number: e.target.value })}
            maxLength={19}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="expiry">Expiry Date</Label>
            <Input
              id="expiry"
              placeholder="MM/YY"
              value={cardDetails.expiry}
              onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
              maxLength={5}
            />
          </div>
          <div>
            <Label htmlFor="cvc">CVC</Label>
            <Input
              id="cvc"
              placeholder="123"
              value={cardDetails.cvc}
              onChange={(e) => setCardDetails({ ...cardDetails, cvc: e.target.value })}
              maxLength={4}
            />
          </div>
        </div>

        <div className="pt-4 border-t">
          <div className="flex justify-between mb-4">
            <span className="font-semibold">Total Amount:</span>
            <span className="text-2xl font-bold text-primary">${amount}</span>
          </div>

          <Button 
            onClick={handlePayment} 
            disabled={loading}
            className="w-full"
            size="lg"
          >
            {loading ? (
              <>Processing...</>
            ) : (
              <>
                <Lock className="h-4 w-4 mr-2" />
                Complete Payment
              </>
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center mt-3 flex items-center justify-center gap-1">
            <Lock className="h-3 w-3" />
            Secure payment powered by Stripe
          </p>
        </div>
      </div>
    </Card>
  );
};

export default PaymentSection;
