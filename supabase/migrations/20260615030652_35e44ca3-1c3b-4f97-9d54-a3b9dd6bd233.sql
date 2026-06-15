DROP POLICY IF EXISTS "Users can read own order documents" ON storage.objects;

REVOKE EXECUTE ON FUNCTION public.is_ezbiz_admin(uuid) FROM PUBLIC;
REVOKE EXECUTE ON FUNCTION public.is_ezbiz_admin(uuid) FROM anon;
GRANT EXECUTE ON FUNCTION public.is_ezbiz_admin(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.is_ezbiz_admin(uuid) TO service_role;