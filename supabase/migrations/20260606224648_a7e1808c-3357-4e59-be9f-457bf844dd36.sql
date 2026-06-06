REVOKE ALL ON FUNCTION public.prevent_role_escalation() FROM PUBLIC;
REVOKE ALL ON FUNCTION public.prevent_role_escalation() FROM anon;
REVOKE ALL ON FUNCTION public.prevent_role_escalation() FROM authenticated;
GRANT EXECUTE ON FUNCTION public.prevent_role_escalation() TO service_role;