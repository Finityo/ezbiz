
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  admin_exists BOOLEAN;
  user_email TEXT;
BEGIN
  user_email := lower(NEW.email);

  -- Domain restriction: only @ezbiz-fs.com may sign up
  IF user_email IS NULL OR user_email NOT LIKE '%@ezbiz-fs.com' THEN
    RAISE EXCEPTION 'Signups are restricted to @ezbiz-fs.com email addresses.'
      USING ERRCODE = 'check_violation';
  END IF;

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
  -- Bootstrap: if no admin exists yet, first @ezbiz-fs.com signup becomes admin.
  IF user_email = 'christian@ezbiz-fs.com' OR NOT admin_exists THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
  END IF;

  RETURN NEW;
END;
$$;
