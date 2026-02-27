
-- Rate-limit analytics inserts: max 60 per session per 5 minutes per table
CREATE OR REPLACE FUNCTION public.check_analytics_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  recent_count integer;
BEGIN
  IF NEW.session_id IS NULL THEN
    RETURN NEW;
  END IF;

  EXECUTE format(
    'SELECT count(*) FROM %I.%I WHERE session_id = $1 AND created_at > now() - interval ''5 minutes''',
    TG_TABLE_SCHEMA, TG_TABLE_NAME
  ) INTO recent_count USING NEW.session_id;

  IF recent_count >= 60 THEN
    RAISE EXCEPTION 'Rate limit exceeded for analytics inserts';
  END IF;

  RETURN NEW;
END;
$$;

-- Rate-limit email_list inserts: max 3 per email per hour
CREATE OR REPLACE FUNCTION public.check_email_list_rate_limit()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO 'public'
AS $$
DECLARE
  recent_count integer;
BEGIN
  SELECT count(*) INTO recent_count
  FROM public.email_list
  WHERE email = NEW.email
    AND created_at > now() - interval '1 hour';

  IF recent_count >= 3 THEN
    RAISE EXCEPTION 'Rate limit exceeded for email submissions';
  END IF;

  RETURN NEW;
END;
$$;

-- Apply triggers to analytics tables
CREATE TRIGGER trg_rate_limit_click_analytics
  BEFORE INSERT ON public.click_analytics
  FOR EACH ROW EXECUTE FUNCTION public.check_analytics_rate_limit();

CREATE TRIGGER trg_rate_limit_scroll_analytics
  BEFORE INSERT ON public.scroll_analytics
  FOR EACH ROW EXECUTE FUNCTION public.check_analytics_rate_limit();

CREATE TRIGGER trg_rate_limit_heatmap_analytics
  BEFORE INSERT ON public.heatmap_analytics
  FOR EACH ROW EXECUTE FUNCTION public.check_analytics_rate_limit();

CREATE TRIGGER trg_rate_limit_feedback
  BEFORE INSERT ON public.feedback
  FOR EACH ROW EXECUTE FUNCTION public.check_analytics_rate_limit();

-- Apply trigger to email_list
CREATE TRIGGER trg_rate_limit_email_list
  BEFORE INSERT ON public.email_list
  FOR EACH ROW EXECUTE FUNCTION public.check_email_list_rate_limit();
