ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS add_ons               jsonb,
  ADD COLUMN IF NOT EXISTS filing_path           text,
  ADD COLUMN IF NOT EXISTS current_step          smallint,
  ADD COLUMN IF NOT EXISTS source_path           text,
  ADD COLUMN IF NOT EXISTS last_activity_at      timestamptz DEFAULT now(),
  ADD COLUMN IF NOT EXISTS abandoned_notified_at timestamptz;

CREATE INDEX IF NOT EXISTS idx_orders_status_activity
  ON public.orders (status, last_activity_at DESC);

UPDATE public.business_applications
SET status = 'pending_payment'
WHERE status = 'in-review';