
-- =========================================================
-- 1. user_roles: restrict to authenticated; tighten admin checks; add DELETE
-- =========================================================
DROP POLICY IF EXISTS "Admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own roles" ON public.user_roles;

CREATE POLICY "Admins can insert roles"
ON public.user_roles
FOR INSERT
TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can update roles"
ON public.user_roles
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete roles"
ON public.user_roles
FOR DELETE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view all roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can view their own roles"
ON public.user_roles
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- =========================================================
-- 2. orders: restrict to authenticated; require non-null user_id on insert
-- =========================================================
DROP POLICY IF EXISTS "Admins can update orders" ON public.orders;
DROP POLICY IF EXISTS "Admins can view all orders" ON public.orders;
DROP POLICY IF EXISTS "Users can insert their own orders" ON public.orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON public.orders;

CREATE POLICY "Admins can update orders"
ON public.orders
FOR UPDATE
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can view all orders"
ON public.orders
FOR SELECT
TO authenticated
USING (public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Users can insert their own orders"
ON public.orders
FOR INSERT
TO authenticated
WITH CHECK (auth.uid() IS NOT NULL AND user_id IS NOT NULL AND auth.uid() = user_id);

CREATE POLICY "Users can view their own orders"
ON public.orders
FOR SELECT
TO authenticated
USING (auth.uid() = user_id);

-- =========================================================
-- 3. Storage: restrict email-assets listing; manage order-documents
-- =========================================================
-- Replace broad public SELECT on email-assets with object-only public read
DROP POLICY IF EXISTS "Email assets are publicly accessible" ON storage.objects;

CREATE POLICY "Email assets public read by name"
ON storage.objects
FOR SELECT
TO anon, authenticated
USING (bucket_id = 'email-assets');

-- Admin-only management for email-assets
CREATE POLICY "Admins manage email assets - insert"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'email-assets' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage email assets - update"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'email-assets' AND public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (bucket_id = 'email-assets' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins manage email assets - delete"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'email-assets' AND public.has_role(auth.uid(), 'admin'::app_role));

-- Admin-only update/delete for order-documents
CREATE POLICY "Admins can update order documents"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'order-documents' AND public.has_role(auth.uid(), 'admin'::app_role))
WITH CHECK (bucket_id = 'order-documents' AND public.has_role(auth.uid(), 'admin'::app_role));

CREATE POLICY "Admins can delete order documents"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'order-documents' AND public.has_role(auth.uid(), 'admin'::app_role));

-- =========================================================
-- 4. Revoke public/anon EXECUTE on SECURITY DEFINER helper functions
--    (Keep accessible to authenticated where needed for RLS evaluation;
--     RLS policies invoke these via the policy owner, not the caller.)
-- =========================================================
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, app_role) FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.check_email_list_rate_limit() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.check_analytics_rate_limit() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.update_updated_at_column() FROM PUBLIC, anon, authenticated;
