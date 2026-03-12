-- Order events table for audit logging
CREATE TABLE public.order_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  event_type text NOT NULL,
  actor text DEFAULT 'system',
  metadata jsonb DEFAULT '{}',
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.order_events ENABLE ROW LEVEL SECURITY;

-- Users can view events for their own orders
CREATE POLICY "Users can view own order events"
  ON public.order_events FOR SELECT TO authenticated
  USING (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()));

-- Users can insert events for their own orders
CREATE POLICY "Users can insert own order events"
  ON public.order_events FOR INSERT TO authenticated
  WITH CHECK (order_id IN (SELECT id FROM public.orders WHERE user_id = auth.uid()));

-- Admins can view all order events
CREATE POLICY "Admins can view all order events"
  ON public.order_events FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Admins can insert all order events
CREATE POLICY "Admins can insert all order events"
  ON public.order_events FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Create storage bucket for order documents (admin uploads)
INSERT INTO storage.buckets (id, name, public)
VALUES ('order-documents', 'order-documents', false)
ON CONFLICT (id) DO NOTHING;

-- Storage RLS: admins can upload
CREATE POLICY "Admins can upload order documents"
  ON storage.objects FOR INSERT TO authenticated
  WITH CHECK (bucket_id = 'order-documents' AND public.has_role(auth.uid(), 'admin'));

-- Storage RLS: admins can view
CREATE POLICY "Admins can view order documents"
  ON storage.objects FOR SELECT TO authenticated
  USING (bucket_id = 'order-documents' AND public.has_role(auth.uid(), 'admin'));

-- Storage RLS: users can view their own order docs
CREATE POLICY "Users can view own order documents"
  ON storage.objects FOR SELECT TO authenticated
  USING (
    bucket_id = 'order-documents'
    AND (storage.foldername(name))[1] = 'orders'
    AND EXISTS (
      SELECT 1 FROM public.orders
      WHERE id::text = (storage.foldername(name))[2]
      AND user_id = auth.uid()
    )
  );