
-- Create app_role enum
CREATE TYPE public.app_role AS ENUM ('admin', 'user');

-- Create profiles table
CREATE TABLE public.profiles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  first_name text,
  last_name text,
  company_name text,
  phone text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create user_roles table
CREATE TABLE public.user_roles (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  role public.app_role NOT NULL DEFAULT 'user'::app_role,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create business_applications table
CREATE TABLE public.business_applications (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  business_type text NOT NULL,
  business_name text NOT NULL,
  state text NOT NULL,
  status text NOT NULL DEFAULT 'draft'::text,
  application_data jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create email_list table
CREATE TABLE public.email_list (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  email text NOT NULL,
  source text NOT NULL DEFAULT 'preview_content'::text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Create click_analytics table
CREATE TABLE public.click_analytics (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  button_type text NOT NULL,
  button_label text NOT NULL,
  destination_url text NOT NULL,
  page_location text NOT NULL,
  clicked_at timestamp with time zone NOT NULL DEFAULT now(),
  session_id text,
  user_agent text
);

-- Create scroll_analytics table
CREATE TABLE public.scroll_analytics (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  session_id text,
  page_location text NOT NULL,
  scroll_depth integer NOT NULL,
  max_scroll_reached integer NOT NULL,
  time_on_page integer NOT NULL,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- Create heatmap_analytics table
CREATE TABLE public.heatmap_analytics (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  element_type text NOT NULL,
  interaction_type text NOT NULL,
  page_location text NOT NULL,
  position_x integer,
  position_y integer,
  element_label text,
  session_id text,
  user_agent text,
  created_at timestamp with time zone DEFAULT now()
);

-- Enable RLS on all tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.business_applications ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.email_list ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.click_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.scroll_analytics ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.heatmap_analytics ENABLE ROW LEVEL SECURITY;

-- has_role function
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS boolean
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $$
  SELECT EXISTS (
    SELECT 1 FROM public.user_roles WHERE user_id = _user_id AND role = _role
  )
$$;

-- handle_new_user trigger function
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  admin_count INTEGER;
BEGIN
  INSERT INTO public.profiles (user_id, first_name, last_name)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name'
  );
  
  SELECT COUNT(*) INTO admin_count 
  FROM public.user_roles 
  WHERE role = 'admin'
  FOR UPDATE;
  
  IF admin_count = 0 THEN
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'admin');
  ELSE
    INSERT INTO public.user_roles (user_id, role)
    VALUES (NEW.id, 'user');
  END IF;
  
  RETURN NEW;
END;
$$;

-- update_updated_at function
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS trigger
LANGUAGE plpgsql
SET search_path TO 'public'
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Updated_at triggers
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_user_roles_updated_at
  BEFORE UPDATE ON public.user_roles
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_business_applications_updated_at
  BEFORE UPDATE ON public.business_applications
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_email_list_updated_at
  BEFORE UPDATE ON public.email_list
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- RLS Policies: profiles
CREATE POLICY "Users can view their own profile" ON public.profiles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own profile" ON public.profiles FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own profile" ON public.profiles FOR UPDATE USING (auth.uid() = user_id);

-- RLS Policies: user_roles
CREATE POLICY "Users can view their own roles" ON public.user_roles FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all roles" ON public.user_roles FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can insert roles" ON public.user_roles FOR INSERT WITH CHECK (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update roles" ON public.user_roles FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies: business_applications
CREATE POLICY "Users can view their own business applications" ON public.business_applications FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own business applications" ON public.business_applications FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update their own business applications" ON public.business_applications FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Admins can view all business applications" ON public.business_applications FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
CREATE POLICY "Admins can update business applications" ON public.business_applications FOR UPDATE USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies: email_list
CREATE POLICY "Anyone can insert into email list" ON public.email_list FOR INSERT WITH CHECK (true);
CREATE POLICY "email_list_authenticated_insert" ON public.email_list FOR INSERT WITH CHECK (auth.uid() IS NOT NULL);
CREATE POLICY "Admins can view all email list entries" ON public.email_list FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies: click_analytics
CREATE POLICY "Anyone can insert click analytics" ON public.click_analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can view analytics" ON public.click_analytics FOR SELECT USING (EXISTS (SELECT 1 FROM user_roles WHERE user_roles.user_id = auth.uid() AND user_roles.role = 'admin'::app_role));

-- RLS Policies: scroll_analytics
CREATE POLICY "Allow anonymous insert on scroll_analytics" ON public.scroll_analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can view scroll analytics" ON public.scroll_analytics FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));

-- RLS Policies: heatmap_analytics
CREATE POLICY "Allow anonymous insert on heatmap_analytics" ON public.heatmap_analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Only admins can view heatmap analytics" ON public.heatmap_analytics FOR SELECT USING (has_role(auth.uid(), 'admin'::app_role));
