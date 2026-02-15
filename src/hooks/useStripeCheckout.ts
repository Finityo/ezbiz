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
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke("create-checkout", {
        body: {
          lineItems,
          stateFee: options?.stateFee,
          successPath: options?.successPath || "/dashboard",
          cancelPath: options?.cancelPath || "/pricing",
        },
      });

      if (error) throw error;
      if (!data?.url) throw new Error("No checkout URL returned");

      window.open(data.url, "_blank");
    } catch (err: any) {
      console.error("Checkout error:", err);
      toast.error("Failed to start checkout. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return { checkout, loading };
};
