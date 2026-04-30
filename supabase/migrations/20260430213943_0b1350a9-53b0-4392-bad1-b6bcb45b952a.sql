-- 1) Reset the test order to Pending Payment so we can prove the flip
UPDATE public.orders
SET status = 'Pending Payment'
WHERE id = '61b1910b-5537-4cc6-b36c-b1ef24606e09';

-- 2) Apply the exact updates the new stripe-webhook would apply
--    (resolved via application_id lookup -> orders.id)
UPDATE public.orders
SET status = 'payment_complete',
    stripe_session_id = 'cs_test_e2e_simulated_001',
    stripe_payment_intent = 'pi_test_e2e_simulated_001',
    total_amount = 429
WHERE application_id = '00000000-0000-0000-0000-000000000abc';

INSERT INTO public.payments (order_id, stripe_payment_id, amount, status)
VALUES ('61b1910b-5537-4cc6-b36c-b1ef24606e09', 'pi_test_e2e_simulated_001', 429, 'paid');

INSERT INTO public.order_events (order_id, event_type, actor, metadata)
VALUES (
  '61b1910b-5537-4cc6-b36c-b1ef24606e09',
  'payment_complete',
  'stripe_webhook',
  jsonb_build_object(
    'session_id', 'cs_test_e2e_simulated_001',
    'payment_intent', 'pi_test_e2e_simulated_001',
    'application_id', '00000000-0000-0000-0000-000000000abc',
    'simulation', true
  )
);