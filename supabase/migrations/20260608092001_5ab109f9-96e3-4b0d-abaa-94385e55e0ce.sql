
-- Replace the user INSERT and DELETE policies on the order-documents bucket
-- to require that the file path corresponds to an order owned by the user.
-- Path convention used by the app: <auth.uid()>/<order_id>/<filename>

DROP POLICY IF EXISTS "Users can upload own order documents" ON storage.objects;
DROP POLICY IF EXISTS "Users can delete own order documents" ON storage.objects;

CREATE POLICY "Users can upload own order documents"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'order-documents'
  AND (auth.uid())::text = (storage.foldername(name))[1]
  AND EXISTS (
    SELECT 1 FROM public.orders o
    WHERE (o.id)::text = (storage.foldername(name))[2]
      AND o.user_id = auth.uid()
  )
);

CREATE POLICY "Users can delete own order documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (
  bucket_id = 'order-documents'
  AND (auth.uid())::text = (storage.foldername(name))[1]
  AND EXISTS (
    SELECT 1 FROM public.orders o
    WHERE (o.id)::text = (storage.foldername(name))[2]
      AND o.user_id = auth.uid()
  )
);
