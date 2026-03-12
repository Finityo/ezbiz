
-- Add filing_speed and ein_service to orders
ALTER TABLE public.orders
ADD COLUMN IF NOT EXISTS filing_speed text DEFAULT 'standard',
ADD COLUMN IF NOT EXISTS ein_service boolean DEFAULT false;

-- Create documents table for tracking uploaded files per order
CREATE TABLE IF NOT EXISTS public.documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  document_type text NOT NULL,
  file_url text NOT NULL,
  uploaded_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS on documents
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- RLS: Users can view their own order documents
CREATE POLICY "Users can view own documents"
ON public.documents FOR SELECT TO authenticated
USING (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()));

-- RLS: Users can insert documents for their own orders
CREATE POLICY "Users can insert own documents"
ON public.documents FOR INSERT TO authenticated
WITH CHECK (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()));

-- RLS: Admins can view all documents
CREATE POLICY "Admins can view all documents"
ON public.documents FOR SELECT TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS: Admins can insert documents
CREATE POLICY "Admins can insert all documents"
ON public.documents FOR INSERT TO authenticated
WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- RLS: Admins can update documents
CREATE POLICY "Admins can update all documents"
ON public.documents FOR UPDATE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));

-- RLS: Admins can delete documents
CREATE POLICY "Admins can delete all documents"
ON public.documents FOR DELETE TO authenticated
USING (public.has_role(auth.uid(), 'admin'));
