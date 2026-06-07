-- 1) Cascade-delete demo user's orders and dependent rows, then the user itself.
DO $$
DECLARE
  v_user_id uuid := '36a353dd-fd86-4b50-8a8f-115b9eb71a6a';
  v_order_ids uuid[];
BEGIN
  SELECT array_agg(id) INTO v_order_ids FROM public.orders WHERE user_id = v_user_id;

  IF v_order_ids IS NOT NULL THEN
    DELETE FROM public.addresses             WHERE order_id = ANY(v_order_ids);
    DELETE FROM public.agreements            WHERE order_id = ANY(v_order_ids);
    DELETE FROM public.business_information  WHERE order_id = ANY(v_order_ids);
    DELETE FROM public.company_management    WHERE order_id = ANY(v_order_ids);
    DELETE FROM public.contact_information   WHERE order_id = ANY(v_order_ids);
    DELETE FROM public.documents             WHERE order_id = ANY(v_order_ids);
    DELETE FROM public.irs_responsible_party WHERE order_id = ANY(v_order_ids);
    DELETE FROM public.order_events          WHERE order_id = ANY(v_order_ids);
    DELETE FROM public.participants          WHERE order_id = ANY(v_order_ids);
    DELETE FROM public.payments              WHERE order_id = ANY(v_order_ids);
    DELETE FROM public.registered_agent      WHERE order_id = ANY(v_order_ids);
    DELETE FROM public.admin_notes           WHERE order_id = ANY(v_order_ids);
    DELETE FROM public.orders                WHERE id = ANY(v_order_ids);
  END IF;

  DELETE FROM public.business_applications WHERE user_id = v_user_id;
  DELETE FROM public.user_roles            WHERE user_id = v_user_id;
  DELETE FROM public.profiles              WHERE user_id = v_user_id;
  DELETE FROM auth.users                   WHERE id = v_user_id;
END $$;

-- 2) Storage RLS for the private order-documents bucket.
--    Path convention: {user_id}/{order_id}/{filename}
DROP POLICY IF EXISTS "Users can upload own order documents" ON storage.objects;
CREATE POLICY "Users can upload own order documents"
ON storage.objects FOR INSERT TO authenticated
WITH CHECK (
  bucket_id = 'order-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Users can read own order documents" ON storage.objects;
CREATE POLICY "Users can read own order documents"
ON storage.objects FOR SELECT TO authenticated
USING (
  bucket_id = 'order-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Users can delete own order documents" ON storage.objects;
CREATE POLICY "Users can delete own order documents"
ON storage.objects FOR DELETE TO authenticated
USING (
  bucket_id = 'order-documents'
  AND auth.uid()::text = (storage.foldername(name))[1]
);

DROP POLICY IF EXISTS "Admins can manage all order documents" ON storage.objects;
CREATE POLICY "Admins can manage all order documents"
ON storage.objects FOR ALL TO authenticated
USING (bucket_id = 'order-documents' AND public.has_role(auth.uid(), 'admin'))
WITH CHECK (bucket_id = 'order-documents' AND public.has_role(auth.uid(), 'admin'));