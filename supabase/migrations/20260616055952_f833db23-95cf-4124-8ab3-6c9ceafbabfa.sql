-- Phase One: speed up admin filtering by application status and by waiver path.
CREATE INDEX IF NOT EXISTS idx_business_applications_status
  ON public.business_applications (status);

-- Partial expression index: waiver-track applications keyed by filingPath in JSONB.
-- Keeps the index small (only waiver rows) while accelerating WaiverReviewsTab queries.
CREATE INDEX IF NOT EXISTS idx_business_applications_waiver_path
  ON public.business_applications ((application_data->>'filingPath'))
  WHERE application_data->>'filingPath' = 'texas_veteran_waiver';