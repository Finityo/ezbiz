-- Defense-in-depth: prevent privilege escalation on user_roles
-- Blocks any non-admin caller from inserting/updating an 'admin' role row,
-- except the bootstrapping path used by handle_new_user (no admins exist yet).

CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  admin_count integer;
BEGIN
  -- Only guard admin role assignments
  IF NEW.role <> 'admin'::app_role THEN
    RETURN NEW;
  END IF;

  SELECT count(*) INTO admin_count FROM public.user_roles WHERE role = 'admin';

  -- Bootstrap case: no admins exist yet (first signup) — allow
  IF admin_count = 0 THEN
    RETURN NEW;
  END IF;

  -- Otherwise the caller MUST already be an admin
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Only admins can assign the admin role';
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS prevent_role_escalation_trigger ON public.user_roles;
CREATE TRIGGER prevent_role_escalation_trigger
BEFORE INSERT OR UPDATE ON public.user_roles
FOR EACH ROW
EXECUTE FUNCTION public.prevent_role_escalation();