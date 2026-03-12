
-- Add unique constraints needed for upsert operations
ALTER TABLE public.contact_information ADD CONSTRAINT contact_information_order_id_key UNIQUE (order_id);
ALTER TABLE public.business_information ADD CONSTRAINT business_information_order_id_key UNIQUE (order_id);
ALTER TABLE public.registered_agent ADD CONSTRAINT registered_agent_order_id_key UNIQUE (order_id);
ALTER TABLE public.company_management ADD CONSTRAINT company_management_order_id_key UNIQUE (order_id);
ALTER TABLE public.irs_responsible_party ADD CONSTRAINT irs_responsible_party_order_id_key UNIQUE (order_id);
ALTER TABLE public.agreements ADD CONSTRAINT agreements_order_id_key UNIQUE (order_id);

-- Composite unique for addresses (one per type per order)
ALTER TABLE public.addresses ADD CONSTRAINT addresses_order_id_type_key UNIQUE (order_id, type);
