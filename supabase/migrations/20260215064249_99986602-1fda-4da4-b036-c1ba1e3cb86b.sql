-- Fix 1: Add missing admin-only SELECT policies for analytics tables

-- heatmap_analytics: add admin-only SELECT
CREATE POLICY "Only admins can view heatmap analytics"
  ON public.heatmap_analytics
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));

-- scroll_analytics: add admin-only SELECT  
CREATE POLICY "Only admins can view scroll analytics"
  ON public.scroll_analytics
  FOR SELECT
  USING (public.has_role(auth.uid(), 'admin'));
