UPDATE public.orders
SET status = 'cancelled',
    email = 'e2e-test-row@ezbiz-fs.internal'
WHERE id = '61b1910b-5537-4cc6-b36c-b1ef24606e09';