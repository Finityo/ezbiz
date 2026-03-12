import { useState, useCallback } from "react";
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

interface CheckoutOptions {
  stateFee?: StateFee;
  successPath?: string;
  cancelPath?: string;
  orderId?: string;
}

export const useStripeCheckout = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const checkout = useCallback(
    async (lineItems: LineItem[], options?: CheckoutOptions) => {
      setLoading(true);
      setError(null);

      // Validate inputs before calling edge function
      if (!lineItems || lineItems.length === 0) {
        const msg = "No items selected. Please go back and choose a package.";
        setError(msg);
        toast.error(msg);
        setLoading(false);
        return;
      }

      const invalidItem = lineItems.find((li) => !li.priceId);
      if (invalidItem) {
        const msg = "Invalid package selection. Please go back and re-select your package.";
        setError(msg);
        toast.error(msg);
        setLoading(false);
        return;
      }

      try {
        const { data, error: fnError } = await supabase.functions.invoke(
          "create-checkout",
          {
            body: {
              lineItems,
              stateFee: options?.stateFee
                ? { amount: options.stateFee.amount, stateName: options.stateFee.stateName }
                : undefined,
              successPath: options?.successPath || "/order-success",
              cancelPath: options?.cancelPath || "/pricing",
            },
          }
        );

        if (fnError) {
          console.error("Edge function error:", fnError);
          throw new Error("Our payment system is temporarily unavailable. Please try again in a moment.");
        }

        if (!data) {
          throw new Error("No response from payment system. Please try again.");
        }

        if (data.error) {
          console.error("Checkout response error:", data.error);
          throw new Error("Unable to create checkout session. Please try again.");
        }

        if (!data.url || typeof data.url !== "string") {
          throw new Error("Invalid checkout response. Please try again or contact support.");
        }

        // Redirect to Stripe — use current tab for reliability
        window.location.href = data.url;
      } catch (err: any) {
        const message =
          err?.message || "Something went wrong starting checkout. Please try again.";
        console.error("Checkout error:", err);
        setError(message);
        toast.error(message);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const clearError = useCallback(() => setError(null), []);

  return { checkout, loading, error, clearError };
};
