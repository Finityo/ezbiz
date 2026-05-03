import { useEffect, useState } from "react";
import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import { motion, AnimatePresence } from "framer-motion";

const ExitIntentModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !sessionStorage.getItem("exit-intent-shown")) {
        setShowModal(true);
        sessionStorage.setItem("exit-intent-shown", "true");
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);
    return () => document.removeEventListener("mouseleave", handleMouseLeave);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from("email_list").insert({
        email: email.trim(),
        name: "",
        source: "exit_intent",
      });

      if (error) throw error;

      supabase.functions.invoke("send-lead-notification", {
        body: {
          source: "exit_intent",
          email: email.trim(),
          page: typeof window !== "undefined" ? window.location.pathname : null,
        },
      }).catch((e) => console.error("notify error:", e));

      setSubmitted(true);
      toast({ title: "You're on the list! 🎉" });
      setTimeout(() => setShowModal(false), 2500);
    } catch (err) {
      console.error("Exit intent capture error:", err);
      toast({ title: "Something went wrong", variant: "destructive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDismiss = () => setShowModal(false);

  return (
    <AnimatePresence>
      {showModal && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-card p-8 shadow-hero text-center"
          >
            <button
              onClick={handleDismiss}
              className="absolute right-4 top-4 rounded-sm p-1 text-muted-foreground hover:text-foreground transition-fast"
            >
              <X className="h-4 w-4" />
            </button>

            {submitted ? (
              <div className="py-4">
                <h3 className="font-display text-xl font-semibold mb-2">You're on the list! 🎉</h3>
                <p className="text-sm text-muted-foreground">We'll send your launch discount when EZ Biz goes live.</p>
              </div>
            ) : (
              <>
                <h3 className="font-display text-2xl font-bold text-card-foreground mb-2">
                  Wait — Before You Go
                </h3>
                <p className="text-sm text-muted-foreground mb-6">
                  EZ Biz is currently in beta. Leave your email and receive a{" "}
                  <strong className="text-foreground">launch discount</strong> when the full platform goes live.
                </p>

                <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                  <Input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                  <Button type="submit" disabled={submitting} className="w-full">
                    {submitting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" />
                    ) : (
                      "Get Launch Discount"
                    )}
                  </Button>
                  <button
                    type="button"
                    onClick={handleDismiss}
                    className="text-sm text-muted-foreground hover:underline"
                  >
                    No thanks
                  </button>
                </form>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ExitIntentModal;
