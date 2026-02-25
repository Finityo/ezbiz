import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface LineItem {
  priceId: string;
  quantity?: number;
}

interface StateFee {
  amount: number;
  stateName: string;
}

export const useStripeCheckout = () => {
  const [loading, setLoading] = useState(false);

  const checkout = async (
    lineItems: LineItem[],
    options?: { stateFee?: StateFee; successPath?: string; cancelPath?: string }
  ) => {
    // Stripe checkout temporarily disabled for analytics testing
    toast.info("Checkout is temporarily unavailable. Please check back soon!");
    return;
  };

  return { checkout, loading };
};
