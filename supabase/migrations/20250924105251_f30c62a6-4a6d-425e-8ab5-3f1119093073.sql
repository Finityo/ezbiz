-- Add admin access to business applications
CREATE POLICY "Admins can view all business applications" 
ON public.business_applications 
FOR SELECT 
USING (public.has_role(auth.uid(), 'admin'));

CREATE POLICY "Admins can update business applications" 
ON public.business_applications 
FOR UPDATE 
USING (public.has_role(auth.uid(), 'admin'));