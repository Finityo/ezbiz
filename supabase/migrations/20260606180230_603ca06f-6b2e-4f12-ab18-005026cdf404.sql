ALTER SEQUENCE public.orders_order_number_seq OWNED BY public.orders.order_number;

CREATE OR REPLACE FUNCTION public.assign_order_number()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  NEW.order_number := nextval('public.orders_order_number_seq');
  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS assign_order_number_trigger ON public.orders;
CREATE TRIGGER assign_order_number_trigger
  BEFORE INSERT ON public.orders
  FOR EACH ROW
  EXECUTE FUNCTION public.assign_order_number();