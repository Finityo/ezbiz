ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS account_manager_sent_at timestamptz,
  ADD COLUMN IF NOT EXISTS account_manager_sent_to text,
  ADD COLUMN IF NOT EXISTS account_manager_email_status text,
  ADD COLUMN IF NOT EXISTS account_manager_email_message_id text;

CREATE INDEX IF NOT EXISTS idx_orders_account_manager_sent_at
  ON public.orders (account_manager_sent_at);