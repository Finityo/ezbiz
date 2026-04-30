ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS application_id uuid;

CREATE INDEX IF NOT EXISTS orders_application_id_idx
  ON public.orders (application_id);