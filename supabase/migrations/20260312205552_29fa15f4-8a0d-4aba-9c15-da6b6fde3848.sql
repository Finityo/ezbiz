
-- Update orders table: add new columns (entity_type, package) 
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS entity_type TEXT;
ALTER TABLE public.orders ADD COLUMN IF NOT EXISTS package TEXT;

-- Contact Information
CREATE TABLE public.contact_information (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  email TEXT,
  phone TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.contact_information ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own contact info" ON public.contact_information
  FOR SELECT TO authenticated
  USING (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert own contact info" ON public.contact_information
  FOR INSERT TO authenticated
  WITH CHECK (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()));
CREATE POLICY "Users can update own contact info" ON public.contact_information
  FOR UPDATE TO authenticated
  USING (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()));
CREATE POLICY "Admins can view all contact info" ON public.contact_information
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update all contact info" ON public.contact_information
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Business Information
CREATE TABLE public.business_information (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  company_name TEXT,
  alternate_company_name TEXT,
  business_description TEXT,
  organizer_type TEXT,
  business_purpose TEXT,
  delayed_filing BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.business_information ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own biz info" ON public.business_information
  FOR SELECT TO authenticated
  USING (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert own biz info" ON public.business_information
  FOR INSERT TO authenticated
  WITH CHECK (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()));
CREATE POLICY "Users can update own biz info" ON public.business_information
  FOR UPDATE TO authenticated
  USING (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()));
CREATE POLICY "Admins can view all biz info" ON public.business_information
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update all biz info" ON public.business_information
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Addresses
CREATE TABLE public.addresses (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  type TEXT NOT NULL DEFAULT 'business',
  address1 TEXT,
  address2 TEXT,
  city TEXT,
  state TEXT,
  zip TEXT,
  country TEXT DEFAULT 'US',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.addresses ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own addresses" ON public.addresses
  FOR SELECT TO authenticated
  USING (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert own addresses" ON public.addresses
  FOR INSERT TO authenticated
  WITH CHECK (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()));
CREATE POLICY "Users can update own addresses" ON public.addresses
  FOR UPDATE TO authenticated
  USING (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()));
CREATE POLICY "Admins can view all addresses" ON public.addresses
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update all addresses" ON public.addresses
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Registered Agent
CREATE TABLE public.registered_agent (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  agent_type TEXT DEFAULT 'corpnet',
  name TEXT,
  address TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.registered_agent ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own agent" ON public.registered_agent
  FOR SELECT TO authenticated
  USING (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert own agent" ON public.registered_agent
  FOR INSERT TO authenticated
  WITH CHECK (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()));
CREATE POLICY "Users can update own agent" ON public.registered_agent
  FOR UPDATE TO authenticated
  USING (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()));
CREATE POLICY "Admins can view all agents" ON public.registered_agent
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update all agents" ON public.registered_agent
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Company Management
CREATE TABLE public.company_management (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  management_type TEXT DEFAULT 'member_managed',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.company_management ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own mgmt" ON public.company_management
  FOR SELECT TO authenticated
  USING (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert own mgmt" ON public.company_management
  FOR INSERT TO authenticated
  WITH CHECK (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()));
CREATE POLICY "Users can update own mgmt" ON public.company_management
  FOR UPDATE TO authenticated
  USING (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()));
CREATE POLICY "Admins can view all mgmt" ON public.company_management
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update all mgmt" ON public.company_management
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Participants
CREATE TABLE public.participants (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  role TEXT,
  title TEXT,
  ownership_percent NUMERIC,
  address TEXT,
  authorized_signer BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.participants ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own participants" ON public.participants
  FOR SELECT TO authenticated
  USING (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert own participants" ON public.participants
  FOR INSERT TO authenticated
  WITH CHECK (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()));
CREATE POLICY "Users can update own participants" ON public.participants
  FOR UPDATE TO authenticated
  USING (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()));
CREATE POLICY "Users can delete own participants" ON public.participants
  FOR DELETE TO authenticated
  USING (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()));
CREATE POLICY "Admins can view all participants" ON public.participants
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update all participants" ON public.participants
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- IRS Responsible Party (sensitive - SSN encrypted)
CREATE TABLE public.irs_responsible_party (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  first_name TEXT,
  last_name TEXT,
  ssn_encrypted TEXT,
  phone TEXT,
  title TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.irs_responsible_party ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own irs party" ON public.irs_responsible_party
  FOR SELECT TO authenticated
  USING (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert own irs party" ON public.irs_responsible_party
  FOR INSERT TO authenticated
  WITH CHECK (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()));
CREATE POLICY "Users can update own irs party" ON public.irs_responsible_party
  FOR UPDATE TO authenticated
  USING (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()));
CREATE POLICY "Admins can view all irs parties" ON public.irs_responsible_party
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update all irs parties" ON public.irs_responsible_party
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Agreements
CREATE TABLE public.agreements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  terms_accepted BOOLEAN DEFAULT false,
  privacy_accepted BOOLEAN DEFAULT false,
  timestamp TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  ip_address TEXT
);
ALTER TABLE public.agreements ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own agreements" ON public.agreements
  FOR SELECT TO authenticated
  USING (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert own agreements" ON public.agreements
  FOR INSERT TO authenticated
  WITH CHECK (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()));
CREATE POLICY "Admins can view all agreements" ON public.agreements
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Payments
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id UUID NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  stripe_payment_id TEXT,
  amount NUMERIC,
  status TEXT DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own payments" ON public.payments
  FOR SELECT TO authenticated
  USING (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()));
CREATE POLICY "Users can insert own payments" ON public.payments
  FOR INSERT TO authenticated
  WITH CHECK (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()));
CREATE POLICY "Admins can view all payments" ON public.payments
  FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
CREATE POLICY "Admins can update all payments" ON public.payments
  FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
