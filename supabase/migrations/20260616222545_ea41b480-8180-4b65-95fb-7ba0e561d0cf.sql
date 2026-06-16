
ALTER TABLE public.documents
  ADD COLUMN IF NOT EXISTS uploaded_by text NOT NULL DEFAULT 'customer',
  ADD COLUMN IF NOT EXISTS seen_by_customer boolean NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS seen_by_admin boolean NOT NULL DEFAULT true;

-- Allow customers to update only the seen_by_customer flag on their own docs.
DROP POLICY IF EXISTS "Users can mark own documents seen" ON public.documents;
CREATE POLICY "Users can mark own documents seen"
ON public.documents
FOR UPDATE
TO authenticated
USING (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()))
WITH CHECK (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()));
