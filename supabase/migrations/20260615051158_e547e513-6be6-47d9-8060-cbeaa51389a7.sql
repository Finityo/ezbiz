
-- Snapshots table
CREATE TABLE IF NOT EXISTS public.gsc_monitoring_snapshots (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  checked_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  sitemap_count INTEGER NOT NULL DEFAULT 0,
  submitted_urls INTEGER NOT NULL DEFAULT 0,
  indexed_urls INTEGER NOT NULL DEFAULT 0,
  errors INTEGER NOT NULL DEFAULT 0,
  warnings INTEGER NOT NULL DEFAULT 0,
  issues_detected INTEGER NOT NULL DEFAULT 0,
  raw JSONB,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS gsc_monitoring_snapshots_checked_at_idx
  ON public.gsc_monitoring_snapshots (checked_at DESC);

GRANT SELECT ON public.gsc_monitoring_snapshots TO authenticated;
GRANT ALL ON public.gsc_monitoring_snapshots TO service_role;

ALTER TABLE public.gsc_monitoring_snapshots ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Admins can view GSC snapshots"
  ON public.gsc_monitoring_snapshots
  FOR SELECT
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'::app_role));

-- Cron extensions
CREATE EXTENSION IF NOT EXISTS pg_cron;
CREATE EXTENSION IF NOT EXISTS pg_net;

-- Remove any prior schedule before re-creating (idempotent)
DO $$
BEGIN
  PERFORM cron.unschedule('gsc-monitor-daily');
EXCEPTION WHEN OTHERS THEN NULL;
END $$;

SELECT cron.schedule(
  'gsc-monitor-daily',
  '0 7 * * *',
  $$
  SELECT net.http_post(
    url := 'https://umzyxzhqlrykygjbeusu.supabase.co/functions/v1/gsc-monitor',
    headers := '{"Content-Type":"application/json","apikey":"eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InVtenl4emhxbHJ5a3lnamJldXN1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE5OTU3NjIsImV4cCI6MjA4NzU3MTc2Mn0.jfEDSfqhoPKns7fJWy4KzlvK1hde3xpfcaXg4mi4ihQ"}'::jsonb,
    body := jsonb_build_object('triggered_at', now())
  );
  $$
);
