DROP POLICY IF EXISTS "Users can view own order documents" ON storage.objects;
CREATE POLICY "Users can view own order documents"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'order-documents'
  AND (auth.uid())::text = (storage.foldername(name))[1]
  AND EXISTS (
    SELECT 1 FROM public.orders o
    WHERE (o.id)::text = (storage.foldername(objects.name))[2]
      AND o.user_id = auth.uid()
  )
);