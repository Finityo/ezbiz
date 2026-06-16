// Phase Five P2 — Abandoned Checkout Sweeper + High-Intent Admin Notification
//
// Idempotency model:
//   - WHERE clause requires abandoned_notified_at IS NULL.
//   - The UPDATE that flips status -> 'checkout_abandoned' also sets
//     abandoned_notified_at = now() in the SAME statement, gated by
//     status IN ('intake_started','pending_payment') AND stripe_payment_intent IS NULL
//     AND abandoned_notified_at IS NULL. A second concurrent run cannot match.
//   - Only rows whose UPDATE actually returned (RETURNING) are eligible for the
//     admin email. So at most one admin alert is ever sent per order.
//
// Safety:
//   - Never touches paid / processing / fulfilled / cancelled / waiver-review rows.
//   - Never mutates business_applications.
//   - Never sends customer follow-up emails (P3 is templates-only).

import { serve } from 'https://deno.land/std@0.190.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.39.3';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers':
    'authorization, x-client-info, apikey, content-type',
};

// Abandonment windows (minutes)
const INTAKE_STARTED_WINDOW_MIN = 24 * 60; // 24h
const PENDING_PAYMENT_WINDOW_MIN = 2 * 60; // 2h

// Statuses we never touch — fulfillment / paid / waiver review lifecycle.
const PROTECTED_STATUSES = new Set([
  'payment_complete',
  'in_processing',
  'submitted_to_corpnet',
  'filed',
  'completed',
  'cancelled',
  'waiver_documents_pending',
  'waiver_documents_submitted',
  'waiver_under_review',
  'waiver_needs_correction',
  'waiver_approved_payment_required',
  'checkout_abandoned',
]);

interface Candidate {
  id: string;
  order_number: number | null;
  user_id: string | null;
  email: string | null;
  status: string;
  package: string | null;
  package_id: string | null;
  state: string | null;
  entity_type: string | null;
  filing_path: string | null;
  add_ons: any;
  current_step: number | null;
  total_amount: number | null;
  last_activity_at: string | null;
  application_id: string | null;
  stripe_payment_intent: string | null;
  stripe_session_id: string | null;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const serviceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const admin = createClient(supabaseUrl, serviceKey);

    const body = await req.json().catch(() => ({} as Record<string, unknown>));
    const dryRun = body?.dry_run === true;

    const nowIso = new Date().toISOString();
    const intakeCutoff = new Date(Date.now() - INTAKE_STARTED_WINDOW_MIN * 60_000).toISOString();
    const pendingCutoff = new Date(Date.now() - PENDING_PAYMENT_WINDOW_MIN * 60_000).toISOString();

    // Pull candidate set. We filter status + activity windows here; the
    // atomic UPDATE below re-checks every condition to avoid races.
    const baseSelect =
      'id, order_number, user_id, email, status, package, package_id, state, ' +
      'entity_type, filing_path, add_ons, current_step, total_amount, ' +
      'last_activity_at, application_id, stripe_payment_intent, stripe_session_id';

    const [{ data: intakeCandidates, error: e1 }, { data: pendingCandidates, error: e2 }] =
      await Promise.all([
        admin
          .from('orders')
          .select(baseSelect)
          .eq('status', 'intake_started')
          .is('abandoned_notified_at', null)
          .is('stripe_payment_intent', null)
          .lt('last_activity_at', intakeCutoff)
          .limit(200),
        admin
          .from('orders')
          .select(baseSelect)
          .eq('status', 'pending_payment')
          .is('abandoned_notified_at', null)
          .is('stripe_payment_intent', null)
          .lt('last_activity_at', pendingCutoff)
          .limit(200),
      ]);

    if (e1 || e2) {
      console.error('sweeper select error', e1 || e2);
      return new Response(JSON.stringify({ error: 'select failed' }), {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      });
    }

    const candidates: Candidate[] = [
      ...(intakeCandidates ?? []),
      ...(pendingCandidates ?? []),
    ] as Candidate[];

    const results: Array<{
      order_id: string;
      previous_status: string;
      marked_abandoned: boolean;
      high_intent: boolean;
      admin_notified: boolean;
      skipped_reason?: string;
    }> = [];

    for (const c of candidates) {
      if (PROTECTED_STATUSES.has(c.status) && c.status !== 'intake_started' && c.status !== 'pending_payment') {
        results.push({ order_id: c.id, previous_status: c.status, marked_abandoned: false, high_intent: false, admin_notified: false, skipped_reason: 'protected_status' });
        continue;
      }

      if (dryRun) {
        results.push({
          order_id: c.id,
          previous_status: c.status,
          marked_abandoned: false,
          high_intent: isHighIntent(c),
          admin_notified: false,
          skipped_reason: 'dry_run',
        });
        continue;
      }

      // Atomic claim: only one runner can flip the row and stamp the
      // notification timestamp. The combined predicate prevents resends
      // even if two cron instances overlap.
      const { data: claimed, error: claimErr } = await admin
        .from('orders')
        .update({
          status: 'checkout_abandoned',
          abandoned_notified_at: nowIso,
          updated_at: nowIso,
        })
        .eq('id', c.id)
        .in('status', ['intake_started', 'pending_payment'])
        .is('stripe_payment_intent', null)
        .is('abandoned_notified_at', null)
        .select('id')
        .maybeSingle();

      if (claimErr) {
        console.error('sweeper claim failed', c.id, claimErr);
        results.push({ order_id: c.id, previous_status: c.status, marked_abandoned: false, high_intent: false, admin_notified: false, skipped_reason: 'claim_error' });
        continue;
      }
      if (!claimed) {
        // Lost the race or a webhook landed first — leave it alone.
        results.push({ order_id: c.id, previous_status: c.status, marked_abandoned: false, high_intent: false, admin_notified: false, skipped_reason: 'not_eligible_at_claim' });
        continue;
      }

      // Resolve enrichment data: business name + customer name.
      const [{ data: app }, { data: profile }] = await Promise.all([
        c.application_id
          ? admin.from('business_applications').select('business_name').eq('id', c.application_id).maybeSingle()
          : Promise.resolve({ data: null as any }),
        c.user_id
          ? admin.from('profiles').select('first_name, last_name').eq('user_id', c.user_id).maybeSingle()
          : Promise.resolve({ data: null as any }),
      ]);
      const businessName: string | undefined = app?.business_name ?? undefined;
      const customerName = [profile?.first_name, profile?.last_name].filter(Boolean).join(' ').trim() || undefined;
      const highIntent = isHighIntent({ ...c, businessName } as any);
      const estimatedValue = c.total_amount != null ? Number(c.total_amount) : undefined;

      // Audit event — always logged, regardless of high-intent decision.
      await admin.from('order_events').insert({
        order_id: c.id,
        event_type: 'checkout_abandoned',
        actor: 'system:sweeper',
        metadata: {
          previous_status: c.status,
          last_activity_at: c.last_activity_at,
          package: c.package ?? c.package_id,
          state: c.state,
          entity: c.entity_type,
          filing_path: c.filing_path,
          add_ons: c.add_ons,
          current_step: c.current_step,
          estimated_value: estimatedValue,
          high_intent: highIntent,
        },
      });

      let adminNotified = false;
      if (highIntent) {
        try {
          const adminEmail = (Deno.env.get('ACCOUNT_MANAGER_EMAIL') || '').split(/[,;\s]+/).filter(Boolean)[0];
          if (adminEmail) {
            const resp = await admin.functions.invoke('send-transactional-email', {
              body: {
                templateName: 'admin-abandoned-checkout',
                recipientEmail: adminEmail,
                idempotencyKey: `abandoned-${c.id}`,
                templateData: {
                  orderId: c.id,
                  orderNumber: c.order_number,
                  customerName,
                  customerEmail: c.email,
                  businessName,
                  entityType: c.entity_type,
                  state: c.state,
                  packageName: c.package ?? c.package_id,
                  filingPath: c.filing_path,
                  addOns: Array.isArray(c.add_ons) ? c.add_ons : undefined,
                  lastStep: c.current_step,
                  lastActivityAt: c.last_activity_at,
                  previousStatus: c.status,
                  estimatedValue,
                },
              },
            });
            adminNotified = !resp.error;
            if (resp.error) console.error('admin notify error', c.id, resp.error);
          }
        } catch (err) {
          console.error('admin notify threw', c.id, err);
        }
      }

      results.push({
        order_id: c.id,
        previous_status: c.status,
        marked_abandoned: true,
        high_intent: highIntent,
        admin_notified: adminNotified,
      });
    }

    return new Response(
      JSON.stringify({
        ok: true,
        dry_run: dryRun,
        scanned: candidates.length,
        marked: results.filter((r) => r.marked_abandoned).length,
        notified: results.filter((r) => r.admin_notified).length,
        results,
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    console.error('mark-abandoned-checkouts error', err);
    return new Response(JSON.stringify({ error: 'Internal error' }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});

function isHighIntent(c: Pick<Candidate, 'user_id' | 'package' | 'package_id' | 'filing_path' | 'current_step' | 'total_amount' | 'status'> & { businessName?: string }): boolean {
  const hasAccount = !!c.user_id;
  const hasPackage = !!(c.package || c.package_id);
  const hasBusinessName = !!c.businessName;
  const reachedCheckout = c.status === 'pending_payment' || (c.current_step ?? 0) >= 4;
  const waiverPath = (c.filing_path || '').toLowerCase().includes('waiver') || (c.filing_path || '').toLowerCase().includes('veteran');
  const hasValue = c.total_amount != null && Number(c.total_amount) > 0;
  return hasAccount && hasPackage && (hasBusinessName || reachedCheckout || waiverPath) && hasValue;
}
