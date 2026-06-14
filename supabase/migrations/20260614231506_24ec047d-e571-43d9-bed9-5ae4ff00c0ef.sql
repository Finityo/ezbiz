
-- 1) Loosen handle_new_user so customers (non-@ezbiz-fs.com) can sign up.
--    Admin role is still gated by prevent_role_escalation() + this function's logic.
CREATE OR REPLACE FUNCTION public.handle_new_user()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  admin_exists BOOLEAN;
  user_email TEXT;
  is_ezbiz BOOLEAN;
BEGIN
  user_email := lower(NEW.email);
  is_ezbiz := user_email IS NOT NULL AND user_email LIKE '%@ezbiz-fs.com';

  INSERT INTO public.profiles (user_id, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );

  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE role = 'admin'
  ) INTO admin_exists;

  -- Master admin: christian@ezbiz-fs.com always gets admin.
  -- Bootstrap: if no admin exists yet AND user is @ezbiz-fs.com, grant admin.
  -- Otherwise: assign 'user' role (works for customers and ezbiz staff alike).
  IF user_email = 'christian@ezbiz-fs.com' OR (NOT admin_exists AND is_ezbiz) THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
  END IF;

  RETURN NEW;
END;
$function$;

-- 2) Defense-in-depth helper: admin role AND @ezbiz-fs.com email.
CREATE OR REPLACE FUNCTION public.is_ezbiz_admin(_user_id uuid)
 RETURNS boolean
 LANGUAGE sql
 STABLE
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles ur
    JOIN auth.users u ON u.id = ur.user_id
    WHERE ur.user_id = _user_id
      AND ur.role = 'admin'
      AND lower(u.email) LIKE '%@ezbiz-fs.com'
  );
$function$;

GRANT EXECUTE ON FUNCTION public.is_ezbiz_admin(uuid) TO authenticated, service_role;
