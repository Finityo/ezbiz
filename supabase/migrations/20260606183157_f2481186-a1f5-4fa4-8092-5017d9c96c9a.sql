
TRUNCATE TABLE
  public.order_events,
  public.admin_notes,
  public.documents,
  public.payments,
  public.agreements,
  public.participants,
  public.irs_responsible_party,
  public.company_management,
  public.registered_agent,
  public.contact_information,
  public.business_information,
  public.addresses,
  public.orders,
  public.business_applications,
  public.email_send_log,
  public.email_unsubscribe_tokens,
  public.suppressed_emails,
  public.feedback,
  public.click_analytics,
  public.scroll_analytics,
  public.heatmap_analytics,
  public.social_diagnostics_runs
RESTART IDENTITY CASCADE;

ALTER SEQUENCE public.orders_order_number_seq RESTART WITH 1000000;

DELETE FROM public.email_list;

DELETE FROM auth.users WHERE email <> 'christian.r.t@outlook.com';

DELETE FROM public.user_roles
 WHERE user_id <> '6060915c-488a-4425-a622-9be2055f5521';

DELETE FROM public.user_roles
 WHERE user_id = '6060915c-488a-4425-a622-9be2055f5521'
   AND role <> 'admin';

INSERT INTO public.user_roles (user_id, role)
SELECT '6060915c-488a-4425-a622-9be2055f5521', 'admin'
WHERE NOT EXISTS (
  SELECT 1 FROM public.user_roles
  WHERE user_id = '6060915c-488a-4425-a622-9be2055f5521' AND role = 'admin'
);
