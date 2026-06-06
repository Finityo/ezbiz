CREATE OR REPLACE FUNCTION public.prevent_role_escalation()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $function$
DECLARE
  admin_count integer;
  target_email text;
BEGIN
  -- Only guard admin role assignments.
  IF NEW.role <> 'admin'::app_role THEN
    RETURN NEW;
  END IF;

  SELECT lower(email)
  INTO target_email
  FROM auth.users
  WHERE id = NEW.user_id;

  -- Admin accounts must belong to the company domain.
  IF target_email IS NULL OR target_email NOT LIKE '%@ezbiz-fs.com' THEN
    RAISE EXCEPTION 'Admin access is restricted to @ezbiz-fs.com email addresses';
  END IF;

  -- Master admin signup is explicitly allowed, even if stale/admin rows already exist.
  IF target_email = 'christian@ezbiz-fs.com' THEN
    RETURN NEW;
  END IF;

  SELECT count(*) INTO admin_count FROM public.user_roles WHERE role = 'admin';

  -- Bootstrap case: no admins exist yet — allow the first company-domain admin.
  IF admin_count = 0 THEN
    RETURN NEW;
  END IF;

  -- Otherwise the caller MUST already be an admin.
  IF auth.uid() IS NULL OR NOT public.has_role(auth.uid(), 'admin'::app_role) THEN
    RAISE EXCEPTION 'Only admins can assign the admin role';
  END IF;

  RETURN NEW;
END;
$function$;