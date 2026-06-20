-- Wipe QA veteran test data so the next intake run starts clean.
WITH qa_user AS (SELECT 'e3d27b49-a38b-4f9c-bfff-471f5b793882'::uuid AS id)
DELETE FROM business_applications WHERE user_id = (SELECT id FROM qa_user);

WITH qa_orders AS (SELECT id FROM orders WHERE user_id = 'e3d27b49-a38b-4f9c-bfff-471f5b793882')
DELETE FROM order_events WHERE order_id IN (SELECT id FROM qa_orders);
WITH qa_orders AS (SELECT id FROM orders WHERE user_id = 'e3d27b49-a38b-4f9c-bfff-471f5b793882')
DELETE FROM business_information WHERE order_id IN (SELECT id FROM qa_orders);
WITH qa_orders AS (SELECT id FROM orders WHERE user_id = 'e3d27b49-a38b-4f9c-bfff-471f5b793882')
DELETE FROM contact_information WHERE order_id IN (SELECT id FROM qa_orders);
WITH qa_orders AS (SELECT id FROM orders WHERE user_id = 'e3d27b49-a38b-4f9c-bfff-471f5b793882')
DELETE FROM addresses WHERE order_id IN (SELECT id FROM qa_orders);
DELETE FROM orders WHERE user_id = 'e3d27b49-a38b-4f9c-bfff-471f5b793882';