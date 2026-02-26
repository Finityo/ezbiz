import { useState } from 'react';
import { MessageSquarePlus, Star, Send, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  { value: 'general', label: 'General Feedback' },
  { value: 'usability', label: 'Ease of Use' },
  { value: 'pricing', label: 'Pricing' },
  { value: 'services', label: 'Services Offered' },
  { value: 'design', label: 'Website Design' },
  { value: 'suggestion', label: 'Feature Request' },
];

const FeedbackWidget = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredStar, setHoveredStar] = useState(0);
  const [category, setCategory] = useState('general');
  const [message, setMessage] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async () => {
    if (rating === 0) {
      toast({ title: 'Please select a rating', variant: 'destructive' });
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from('feedback' as any).insert({
        rating,
        category,
        message: message.trim() || null,
        page_visited: window.location.pathname,
        user_agent: navigator.userAgent,
        session_id: sessionStorage.getItem('session_id') || null,
      } as any);

      if (error) throw error;

      setSubmitted(true);
      toast({ title: 'Thank you for your feedback! 🙏' });

      setTimeout(() => {
        setIsOpen(false);
        setSubmitted(false);
        setRating(0);
        setCategory('general');
        setMessage('');
      }, 2000);
    } catch (err) {
      console.error('Feedback error:', err);
      toast({ title: 'Something went wrong', description: 'Please try again.', variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {/* Trigger Button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            onClick={() => setIsOpen(true)}
            className="fixed bottom-24 left-4 z-40 flex items-center gap-2 rounded-full bg-primary px-4 py-3 text-primary-foreground shadow-elegant transition-smooth hover:shadow-hero hover:scale-105 md:bottom-6"
            aria-label="Leave feedback"
          >
            <MessageSquarePlus className="h-5 w-5" />
            <span className="text-sm font-semibold hidden sm:inline">Feedback</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Feedback Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed bottom-24 left-4 z-50 w-[calc(100vw-2rem)] max-w-sm rounded-xl border bg-card p-5 shadow-hero md:bottom-6"
          >
            {/* Header */}
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-display text-lg font-semibold text-card-foreground">
                {submitted ? 'Thanks! 🎉' : 'How\'s your experience?'}
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                className="rounded-sm p-1 text-muted-foreground hover:text-foreground transition-fast"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {submitted ? (
              <p className="text-sm text-muted-foreground">Your feedback helps us improve. We appreciate you!</p>
            ) : (
              <div className="space-y-4">
                {/* Star Rating */}
                <div>
                  <label className="text-sm font-medium text-card-foreground mb-1.5 block">Rating</label>
                  <div className="flex gap-1">
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
                          className={`h-7 w-7 transition-colors ${
                            star <= (hoveredStar || rating)
                              ? 'fill-secondary text-secondary'
                              : 'text-muted-foreground/30'
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Category */}
                <div>
                  <label className="text-sm font-medium text-card-foreground mb-1.5 block">Category</label>
                  <Select value={category} onValueChange={setCategory}>
                    <SelectTrigger className="h-9">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {CATEGORIES.map((c) => (
                        <SelectItem key={c.value} value={c.value}>{c.label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {/* Message */}
                <div>
                  <label className="text-sm font-medium text-card-foreground mb-1.5 block">
                    Comments <span className="text-muted-foreground font-normal">(optional)</span>
                  </label>
                  <Textarea
                    value={message}
                    onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                    placeholder="Tell us what you think..."
                    className="min-h-[70px] resize-none text-sm"
                    maxLength={500}
                  />
                  <p className="text-xs text-muted-foreground mt-1 text-right">{message.length}/500</p>
                </div>

                {/* Submit */}
                <Button
                  onClick={handleSubmit}
                  disabled={submitting || rating === 0}
                  className="w-full"
                  size="sm"
                >
                  {submitting ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary-foreground" />
                  ) : (
                    <>
                      <Send className="h-4 w-4" />
                      Submit Feedback
                    </>
                  )}
                </Button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FeedbackWidget;
