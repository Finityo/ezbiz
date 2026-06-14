import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

/**
 * Admin gate (defense-in-depth).
 *
 * Server-side enforcement is the real boundary:
 *  - `prevent_role_escalation` trigger blocks admin role inserts for any
 *    email that is not @ezbiz-fs.com.
 *  - Every admin edge function re-checks `user_roles.role = 'admin'` via
 *    the service-role client after validating the caller's JWT.
 *  - `public.is_ezbiz_admin(uid)` also re-checks role + domain at the DB.
 *
 * This client hook additionally requires BOTH the admin role and an
 * @ezbiz-fs.com email so the UI never reveals admin surfaces to anyone
 * outside the company domain, even if a stale/legacy role row existed.
 */
export const useAdminAuth = () => {
  const { user } = useAuth();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminRole = async () => {
      if (!user) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      const email = (user.email ?? '').toLowerCase();
      const isCompanyDomain = email.endsWith('@ezbiz-fs.com');

      if (!isCompanyDomain) {
        setIsAdmin(false);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('user_roles')
          .select('role')
          .eq('user_id', user.id)
          .eq('role', 'admin')
          .maybeSingle();

        setIsAdmin(!!data && !error);
      } catch (error) {
        console.error('Error checking admin role:', error);
        setIsAdmin(false);
      } finally {
        setLoading(false);
      }
    };

    checkAdminRole();
  }, [user]);

  return { isAdmin, loading };
};
