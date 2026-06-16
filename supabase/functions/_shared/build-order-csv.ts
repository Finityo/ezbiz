// Shared CSV builder for order exports + account-manager handoff.
// Source of truth for CorpNet handoff CSV format.
// Exports ALL data points captured during the checkout flow across the
// normalized order schema (orders, business_information, contact_information,
// addresses [business + shipping], registered_agent, company_management,
// participants, irs_responsible_party, agreements) plus Phase Three
// waiver + entitlement context joined from business_applications.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { splitAddons, registeredAgentTermsFor } from "./package-entitlements.ts";

function escapeCSV(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export const CSV_HEADERS = [
  // Order
  'order_number', 'order_id', 'export_date', 'status', 'entity_type', 'package', 'package_stripe_price_id',
  'state', 'filing_speed', 'ein_service', 'delayed_filing',
  'state_fee', 'total_amount',
  'stripe_session_id', 'stripe_payment_intent', 'application_id',
  // Phase Three: waiver + entitlement context
  'filing_path', 'waiver_status', 'original_state_fee', 'effective_state_fee', 'waived_state_fee',
  'selected_package', 'billable_addons', 'included_addons', 'selected_addons_raw',
  'registered_agent_terms', 'waiver_admin_reviewed_at', 'waiver_admin_notes',
  // Business
  'company_name', 'alternate_name', 'business_description', 'organizer_type', 'business_purpose',
  // Contact
  'contact_first_name', 'contact_last_name', 'contact_email', 'contact_phone',
  // Business address
  'business_address1', 'business_address2', 'business_city', 'business_state',
  'business_zip', 'business_country',
  // Shipping address
  'shipping_address1', 'shipping_address2', 'shipping_city', 'shipping_state',
  'shipping_zip', 'shipping_country',
  // Registered agent
  'registered_agent_type', 'registered_agent_name', 'registered_agent_address',
  // Management
  'management_type',
  // Participant (one row per participant)
  'participant_first_name', 'participant_last_name', 'participant_role',
  'participant_title', 'ownership_percent', 'participant_address',
  'participant_authorized_signer',
  // IRS responsible party
  'irs_first_name', 'irs_last_name', 'irs_ssn_status', 'irs_phone', 'irs_title',
  // Agreements
  'terms_accepted', 'privacy_accepted', 'agreement_ip', 'agreement_timestamp',
  // Timestamps
  'created_at', 'updated_at',
];


export async function buildOrderCsv(
  supabase: ReturnType<typeof createClient>,
  orderIds: string[],
): Promise<string> {
  if (orderIds.length === 0) {
    return CSV_HEADERS.map(escapeCSV).join(',') + '\n';
  }

  const [orders, contacts, bizInfo, addresses, agents, mgmt, participants, irsParties, agreements] = await Promise.all([
    supabase.from('orders').select('*').in('id', orderIds),
    supabase.from('contact_information').select('*').in('order_id', orderIds),
    supabase.from('business_information').select('*').in('order_id', orderIds),
    supabase.from('addresses').select('*').in('order_id', orderIds), // both business + shipping
    supabase.from('registered_agent').select('*').in('order_id', orderIds),
    supabase.from('company_management').select('*').in('order_id', orderIds),
    supabase.from('participants').select('*').in('order_id', orderIds),
    supabase.from('irs_responsible_party').select('*').in('order_id', orderIds),
    supabase.from('agreements').select('*').in('order_id', orderIds),
  ]);

  // Phase Three: join business_applications to surface waiver context and
  // package entitlement details. application_id lives on the orders row.
  const applicationIds = ((orders.data || []) as any[])
    .map((o: any) => o.application_id)
    .filter((v: unknown): v is string => typeof v === 'string' && v.length > 0);
  const appsRes = applicationIds.length
    ? await supabase
        .from('business_applications')
        .select('id, status, application_data')
        .in('id', applicationIds)
    : { data: [] as any[] };
  const appMap = new Map((appsRes.data || []).map((a: any) => [a.id, a]));

  const contactMap = new Map((contacts.data || []).map((c: any) => [c.order_id, c]));
  const bizMap = new Map((bizInfo.data || []).map((b: any) => [b.order_id, b]));
  const businessAddrMap = new Map(
    (addresses.data || []).filter((a: any) => a.type === 'business').map((a: any) => [a.order_id, a]),
  );
  const shippingAddrMap = new Map(
    (addresses.data || []).filter((a: any) => a.type === 'shipping').map((a: any) => [a.order_id, a]),
  );
  const agentMap = new Map((agents.data || []).map((a: any) => [a.order_id, a]));
  const mgmtMap = new Map((mgmt.data || []).map((m: any) => [m.order_id, m]));
  const participantMap = new Map<string, any[]>();
  (participants.data || []).forEach((p: any) => {
    if (!participantMap.has(p.order_id)) participantMap.set(p.order_id, []);
    participantMap.get(p.order_id)!.push(p);
  });
  const irsMap = new Map((irsParties.data || []).map((i: any) => [i.order_id, i]));
  const agreementMap = new Map((agreements.data || []).map((a: any) => [a.order_id, a]));

  const exportDate = new Date().toISOString();
  const rows: string[][] = [];

  for (const order of ((orders.data || []) as any[])) {
    const contact = contactMap.get(order.id) || {} as any;
    const biz = bizMap.get(order.id) || {} as any;
    const bAddr = businessAddrMap.get(order.id) || {} as any;
    const sAddr = shippingAddrMap.get(order.id) || {} as any;
    const agent = agentMap.get(order.id) || {} as any;
    const management = mgmtMap.get(order.id) || {} as any;
    const orderParticipants = participantMap.get(order.id) || [];
    const irs = irsMap.get(order.id) || {} as any;
    const agreement = agreementMap.get(order.id) || {} as any;
    const participantRows = orderParticipants.length > 0 ? orderParticipants : [{} as any];

    for (const p of participantRows) {
      rows.push([
        // Order
        order.order_number != null ? String(order.order_number) : '',
        order.id ?? '',
        exportDate,
        order.status ?? '',
        order.entity_type ?? '',
        order.package ?? '',
        order.package_id ?? '',
        order.state ?? '',
        order.filing_speed ?? 'standard',
        order.ein_service ? 'Yes' : 'No',
        biz.delayed_filing ? 'Yes' : 'No',
        order.state_fee != null ? String(order.state_fee) : '',
        order.total_amount != null ? String(order.total_amount) : '',
        order.stripe_session_id ?? '',
        order.stripe_payment_intent ?? '',
        order.application_id ?? '',
        // Business
        biz.company_name ?? '',
        biz.alternate_company_name ?? '',
        biz.business_description ?? '',
        biz.organizer_type ?? '',
        biz.business_purpose ?? '',
        // Contact
        contact.first_name ?? '',
        contact.last_name ?? '',
        contact.email ?? order.email ?? '',
        contact.phone ?? '',
        // Business address
        bAddr.address1 ?? '',
        bAddr.address2 ?? '',
        bAddr.city ?? '',
        bAddr.state ?? '',
        bAddr.zip ?? '',
        bAddr.country ?? '',
        // Shipping address
        sAddr.address1 ?? '',
        sAddr.address2 ?? '',
        sAddr.city ?? '',
        sAddr.state ?? '',
        sAddr.zip ?? '',
        sAddr.country ?? '',
        // Registered agent
        agent.agent_type ?? '',
        agent.name ?? '',
        agent.address ?? '',
        // Management
        management.management_type ?? '',
        // Participant
        p.first_name ?? '',
        p.last_name ?? '',
        p.role ?? '',
        p.title ?? '',
        p.ownership_percent != null ? String(p.ownership_percent) : '',
        p.address ?? '',
        p.authorized_signer ? 'Yes' : (p.authorized_signer === false ? 'No' : ''),
        // IRS
        irs.first_name ?? '',
        irs.last_name ?? '',
        irs.ssn_encrypted ? 'ENCRYPTED (request via secure channel)' : 'NOT PROVIDED',
        irs.phone ?? '',
        irs.title ?? '',
        // Agreements
        agreement.terms_accepted ? 'Yes' : (agreement.terms_accepted === false ? 'No' : ''),
        agreement.privacy_accepted ? 'Yes' : (agreement.privacy_accepted === false ? 'No' : ''),
        agreement.ip_address ?? '',
        agreement.timestamp ?? '',
        // Timestamps
        order.created_at ?? '',
        order.updated_at ?? '',
      ]);
    }
  }

  return [
    CSV_HEADERS.map(escapeCSV).join(','),
    ...rows.map(row => row.map(escapeCSV).join(',')),
  ].join('\n');
}
