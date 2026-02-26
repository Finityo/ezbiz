import { useState, useEffect, useCallback } from 'react';
import { Star, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

const ExitIntentModal = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [hasFired, setHasFired] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleExitIntent = useCallback((e: MouseEvent) => {
    // Trigger when mouse moves to top of viewport (toward browser chrome)
    if (e.clientY <= 5 && !hasFired) {
      setHasFired(true);
      setIsOpen(true);
    }
  }, [hasFired]);

  useEffect(() => {
    // Only activate after 60 seconds on page
    const timer = setTimeout(() => {
      // Check if user already submitted feedback this session
      const alreadySubmitted = sessionStorage.getItem('exit_feedback_shown');
      if (!alreadySubmitted) {
        document.addEventListener('mouseleave', handleExitIntent);
        document.addEventListener('mousemove', handleExitIntent);
      }
    }, 60000);

    return () => {
      clearTimeout(timer);
      document.removeEventListener('mouseleave', handleExitIntent);
      document.removeEventListener('mousemove', handleExitIntent);
    };
  }, [handleExitIntent]);

  const handleSubmit = async () => {
    if (rating === 0) return;

    setSubmitting(true);
    try {
      const { error } = await supabase.from('feedback' as any).insert({
        rating,
        category: 'exit_intent',
        message: message.trim() || null,
        page_visited: window.location.pathname,
        user_agent: navigator.userAgent,
        session_id: sessionStorage.getItem('session_id') || null,
      } as any);

      if (error) throw error;

      setSubmitted(true);
      sessionStorage.setItem('exit_feedback_shown', 'true');
      toast({ title: 'Thanks for your feedback! 🙏' });

      setTimeout(() => setIsOpen(false), 2000);
    } catch (err) {
      console.error('Exit intent feedback error:', err);
      toast({ title: 'Something went wrong', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDismiss = () => {
    setIsOpen(false);
    sessionStorage.setItem('exit_feedback_shown', 'true');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={handleDismiss}
            className="fixed inset-0 z-50 bg-foreground/60 backdrop-blur-sm"
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed left-1/2 top-1/2 z-50 w-[calc(100vw-2rem)] max-w-md -translate-x-1/2 -translate-y-1/2 rounded-xl border bg-card p-6 shadow-hero"
          >
            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute right-4 top-4 rounded-sm p-1 text-muted-foreground hover:text-foreground transition-fast"
            >
              <X className="h-4 w-4" />
            </button>

            {submitted ? (
              <div className="text-center py-4">
                <h3 className="font-display text-xl font-semibold mb-2">Thanks! 🎉</h3>
                <p className="text-sm text-muted-foreground">Your feedback helps us build a better experience.</p>
              </div>
            ) : (
              <>
                <div className="text-center mb-5">
                  <h3 className="font-display text-xl font-semibold text-card-foreground">
                    Wait — before you go!
                  </h3>
                  <p className="text-sm text-muted-foreground mt-1.5">
                    How would you rate your experience so far?
                  </p>
                </div>

                {/* Star Rating */}
                <div className="flex justify-center gap-1.5 mb-5">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      onMouseEnter={() => setHoveredStar(star)}
                      onMouseLeave={() => setHoveredStar(0)}
                      onClick={() => setRating(star)}
                      className="p-0.5 transition-fast"
                      aria-label={`Rate ${star} star${star > 1 ? 's' : ''}`}
                    >
                      <Star
                        className={`h-9 w-9 transition-colors ${
                          star <= (hoveredStar || rating)
                            ? 'fill-secondary text-secondary'
                            : 'text-muted-foreground/25'
                        }`}
                      />
                    </button>
                  ))}
                </div>

                {/* Comment */}
                <Textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value.slice(0, 300))}
                  placeholder="Any quick thoughts? (optional)"
                  className="min-h-[60px] resize-none text-sm mb-4"
                  maxLength={300}
                />

                <div className="flex gap-3">
                  <Button
                    onClick={handleDismiss}
                    variant="outline"
                    className="flex-1"
                    size="sm"
                  >
                    No thanks
                  </Button>
                  <Button
                    onClick={handleSubmit}
                    disabled={submitting || rating === 0}
                    className="flex-1"
                    size="sm"
                  >
                    {submitting ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" />
                    ) : (
                      <>
                        <Send className="h-4 w-4" />
                        Submit
                      </>
                    )}
                  </Button>
                </div>
              </>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ExitIntentModal;
