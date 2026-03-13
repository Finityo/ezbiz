
CREATE OR REPLACE FUNCTION public.check_analytics_rate_limit()
 RETURNS trigger
 LANGUAGE plpgsql
 SECURITY DEFINER
 SET search_path TO 'public'
AS $function$
DECLARE
  recent_count integer;
  ts_col text;
BEGIN
  IF NEW.session_id IS NULL THEN
    RETURN NEW;
  END IF;

  -- Determine the correct timestamp column name
  IF TG_TABLE_NAME = 'click_analytics' THEN
    ts_col := 'clicked_at';
  ELSE
    ts_col := 'created_at';
  END IF;

  EXECUTE format(
    'SELECT count(*) FROM %I.%I WHERE session_id = $1 AND %I > now() - interval ''5 minutes''',
    TG_TABLE_SCHEMA, TG_TABLE_NAME, ts_col
  ) INTO recent_count USING NEW.session_id;

  IF recent_count >= 60 THEN
    RAISE EXCEPTION 'Rate limit exceeded for analytics inserts';
  END IF;

  RETURN NEW;
END;
$function$;
