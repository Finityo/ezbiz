
-- Delete all order child rows then orders
TRUNCATE TABLE public.order_events, public.admin_notes, public.documents, public.payments, public.agreements, public.participants, public.irs_responsible_party, public.company_management, public.registered_agent, public.contact_information, public.business_information, public.addresses, public.orders RESTART IDENTITY CASCADE;
ALTER SEQUENCE public.orders_order_number_seq RESTART WITH 1000000;

-- Remove christian.r.t@outlook.com user and their roles/profile
DELETE FROM public.user_roles WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'christian.r.t@outlook.com');
DELETE FROM public.profiles WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'christian.r.t@outlook.com');
DELETE FROM public.business_applications WHERE user_id IN (SELECT id FROM auth.users WHERE email = 'christian.r.t@outlook.com');
DELETE FROM public.email_list WHERE email = 'christian.r.t@outlook.com';
DELETE FROM auth.users WHERE email = 'christian.r.t@outlook.com';
