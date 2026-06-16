UPDATE public.orders SET status = 'pending_payment', updated_at = now() WHERE status = 'Pending Payment';
UPDATE public.orders SET status = 'in_processing', updated_at = now() WHERE status = 'In Processing';
UPDATE public.orders SET status = 'payment_complete', updated_at = now() WHERE status = 'paid';
ALTER TABLE public.orders ALTER COLUMN status SET DEFAULT 'pending_payment';