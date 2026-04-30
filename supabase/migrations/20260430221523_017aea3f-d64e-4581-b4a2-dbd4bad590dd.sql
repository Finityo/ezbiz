-- Add a status column to email_list so consultation requests sourced there can be tracked.
-- We keep using email_list (per the existing consolidation memory) but add a nullable status
-- field so admins can persist consultation lifecycle state.
ALTER TABLE public.email_list
  ADD COLUMN IF NOT EXISTS status text;

-- Allow admins to update email_list rows (currently only INSERT is allowed for anyone, and
-- there is no UPDATE policy at all, so the previous code path silently no-op'd in the DB).
DROP POLICY IF EXISTS "Admins can update email list entries" ON public.email_list;
CREATE POLICY "Admins can update email list entries"
ON public.email_list
FOR UPDATE
TO authenticated
USING (has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (has_role(auth.uid(), 'admin'::app_role));

-- Enable Realtime broadcasts for the user dashboard tables so admin changes propagate live.
-- Set REPLICA IDENTITY FULL so UPDATE payloads include the previous row state for the client.
ALTER TABLE public.orders REPLICA IDENTITY FULL;
ALTER TABLE public.order_events REPLICA IDENTITY FULL;
ALTER TABLE public.documents REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'orders'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.orders';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'order_events'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.order_events';
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables
    WHERE pubname = 'supabase_realtime' AND schemaname = 'public' AND tablename = 'documents'
  ) THEN
    EXECUTE 'ALTER PUBLICATION supabase_realtime ADD TABLE public.documents';
  END IF;
END $$;