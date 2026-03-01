
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid,
  email text,
  package_id text,
  state text,
  state_fee numeric,
  total_amount numeric,
  stripe_session_id text,
  stripe_payment_intent text,
  status text DEFAULT 'Pending Payment',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- RLS
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;

-- Users can view their own orders
CREATE POLICY "Users can view their own orders"
  ON public.orders FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own orders
CREATE POLICY "Users can insert their own orders"
  ON public.orders FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Admins can view all orders
CREATE POLICY "Admins can view all orders"
  ON public.orders FOR SELECT
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Admins can update orders
CREATE POLICY "Admins can update orders"
  ON public.orders FOR UPDATE
  USING (has_role(auth.uid(), 'admin'::app_role));

-- Auto-update updated_at
CREATE TRIGGER update_orders_updated_at
  BEFORE UPDATE ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
