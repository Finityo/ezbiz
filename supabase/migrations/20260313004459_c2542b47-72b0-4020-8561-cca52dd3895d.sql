
-- Create admin_notes table for internal order comments
CREATE TABLE public.admin_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid NOT NULL REFERENCES public.orders(id) ON DELETE CASCADE,
  author_id uuid NOT NULL,
  note text NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.admin_notes ENABLE ROW LEVEL SECURITY;

-- Only admins can CRUD admin notes
CREATE POLICY "Admins can view all admin notes"
  ON public.admin_notes FOR SELECT TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can insert admin notes"
  ON public.admin_notes FOR INSERT TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update own admin notes"
  ON public.admin_notes FOR UPDATE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') AND author_id = auth.uid());

CREATE POLICY "Admins can delete own admin notes"
  ON public.admin_notes FOR DELETE TO authenticated
  USING (public.has_role(auth.uid(), 'admin') AND author_id = auth.uid());
