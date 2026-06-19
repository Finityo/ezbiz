-- Unified draft-order refactor: additive columns on public.orders
-- All additions are nullable / have defaults so existing rows are unaffected.

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS selected_addons jsonb NOT NULL DEFAULT '[]'::jsonb,
  ADD COLUMN IF NOT EXISTS selected_state text,
  ADD COLUMN IF NOT EXISTS source_route text,
  ADD COLUMN IF NOT EXISTS veteran_eligible boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS veteran_waiver_applied boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS veteran_waiver_amount integer NOT NULL DEFAULT 0,
  ADD COLUMN IF NOT EXISTS vvl_pdf_downloaded boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS vvl_pdf_downloaded_at timestamptz,
  ADD COLUMN IF NOT EXISTS email_confirmed_at timestamptz,
  ADD COLUMN IF NOT EXISTS business_info_saved_at timestamptz,
  ADD COLUMN IF NOT EXISTS needs_attention boolean NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS attention_reason text;

-- Helpful indexes for admin Flight Control queries.
CREATE INDEX IF NOT EXISTS idx_orders_status_last_activity
  ON public.orders (status, last_activity_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_needs_attention
  ON public.orders (needs_attention) WHERE needs_attention = true;
CREATE INDEX IF NOT EXISTS idx_orders_veteran
  ON public.orders (veteran_eligible) WHERE veteran_eligible = true;