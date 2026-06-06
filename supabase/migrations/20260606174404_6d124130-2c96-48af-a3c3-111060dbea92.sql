-- Sequential 7-digit human-friendly order number, in addition to the internal UUID id.
CREATE SEQUENCE IF NOT EXISTS public.orders_order_number_seq
  START WITH 1000000
  MINVALUE 1000000
  INCREMENT BY 1
  NO CYCLE;

ALTER TABLE public.orders
  ADD COLUMN IF NOT EXISTS order_number integer;

-- Backfill existing rows in created_at order so the oldest order gets the lowest number.
WITH numbered AS (
  SELECT id, row_number() OVER (ORDER BY created_at ASC, id ASC) AS rn
  FROM public.orders
  WHERE order_number IS NULL
)
UPDATE public.orders o
SET order_number = (1000000 + numbered.rn - 1)
FROM numbered
WHERE o.id = numbered.id;

-- Advance the sequence past any backfilled values so new inserts continue sequentially.
SELECT setval(
  'public.orders_order_number_seq',
  GREATEST(1000000, COALESCE((SELECT MAX(order_number) FROM public.orders), 999999)),
  true
);

-- Default + uniqueness for all future inserts.
ALTER TABLE public.orders
  ALTER COLUMN order_number SET DEFAULT nextval('public.orders_order_number_seq');

ALTER SEQUENCE public.orders_order_number_seq OWNED BY public.orders.order_number;

ALTER TABLE public.orders
  ALTER COLUMN order_number SET NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS orders_order_number_key
  ON public.orders(order_number);
