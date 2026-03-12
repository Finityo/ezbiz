
-- Add unique constraint on (order_id, type) for addresses table to support upsert
CREATE UNIQUE INDEX IF NOT EXISTS addresses_order_id_type_key ON public.addresses (order_id, type);
