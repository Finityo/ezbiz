// Shared CSV builder for order exports + account-manager handoff.
// Source of truth for CorpNet handoff CSV format.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

function escapeCSV(value: string | null | undefined): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export const CSV_HEADERS = [
  'order_id', 'submission_date', 'status', 'entity_type', 'package', 'state',
  'filing_speed', 'ein_service',
  'company_name', 'alternate_name', 'business_description', 'organizer_type', 'business_purpose',
  'contact_first_name', 'contact_last_name', 'contact_email', 'contact_phone',
  'business_address', 'business_city', 'business_state', 'business_zip',
  'registered_agent_type', 'registered_agent_name', 'registered_agent_address',
  'management_type',
  'participant_name', 'participant_role', 'participant_title', 'ownership_percent',
  'irs_first_name', 'irs_last_name', 'irs_ssn_masked', 'irs_phone', 'irs_title',
  'created_at',
];

export async function buildOrderCsv(
  supabase: ReturnType<typeof createClient>,
  orderIds: string[],
): Promise<string> {
  if (orderIds.length === 0) {
    return CSV_HEADERS.map(escapeCSV).join(',') + '\n';
  }

  const [orders, contacts, bizInfo, addresses, agents, mgmt, participants, irsParties] = await Promise.all([
    supabase.from('orders').select('*').in('id', orderIds),
    supabase.from('contact_information').select('*').in('order_id', orderIds),
    supabase.from('business_information').select('*').in('order_id', orderIds),
    supabase.from('addresses').select('*').in('order_id', orderIds).eq('type', 'business'),
    supabase.from('registered_agent').select('*').in('order_id', orderIds),
    supabase.from('company_management').select('*').in('order_id', orderIds),
    supabase.from('participants').select('*').in('order_id', orderIds),
    supabase.from('irs_responsible_party').select('*').in('order_id', orderIds),
  ]);

  const contactMap = new Map((contacts.data || []).map((c: any) => [c.order_id, c]));
  const bizMap = new Map((bizInfo.data || []).map((b: any) => [b.order_id, b]));
  const addressMap = new Map((addresses.data || []).map((a: any) => [a.order_id, a]));
  const agentMap = new Map((agents.data || []).map((a: any) => [a.order_id, a]));
  const mgmtMap = new Map((mgmt.data || []).map((m: any) => [m.order_id, m]));
  const participantMap = new Map<string, any[]>();
  (participants.data || []).forEach((p: any) => {
    if (!participantMap.has(p.order_id)) participantMap.set(p.order_id, []);
    participantMap.get(p.order_id)!.push(p);
  });
  const irsMap = new Map((irsParties.data || []).map((i: any) => [i.order_id, i]));

  const rows: string[][] = [];

  for (const order of ((orders.data || []) as any[])) {
    const contact = contactMap.get(order.id) || {} as any;
    const biz = bizMap.get(order.id) || {} as any;
    const addr = addressMap.get(order.id) || {} as any;
    const agent = agentMap.get(order.id) || {} as any;
    const management = mgmtMap.get(order.id) || {} as any;
    const orderParticipants = participantMap.get(order.id) || [];
    const irs = irsMap.get(order.id) || {} as any;
    const participantRows = orderParticipants.length > 0 ? orderParticipants : [{} as any];

    for (const p of participantRows) {
      rows.push([
        order.id,
        new Date().toISOString(),
        order.status || '',
        order.entity_type || '',
        order.package || '',
        order.state || '',
        order.filing_speed || 'standard',
        order.ein_service ? 'Yes' : 'No',
        biz.company_name || '',
        biz.alternate_company_name || '',
        biz.business_description || '',
        biz.organizer_type || '',
        biz.business_purpose || '',
        contact.first_name || '',
        contact.last_name || '',
        contact.email || '',
        contact.phone || '',
        addr.address1 || '',
        addr.city || '',
        addr.state || '',
        addr.zip || '',
        agent.agent_type || '',
        agent.name || '',
        agent.address || '',
        management.management_type || '',
        `${p.first_name || ''} ${p.last_name || ''}`.trim(),
        p.role || '',
        p.title || '',
        p.ownership_percent != null ? String(p.ownership_percent) : '',
        irs.first_name || '',
        irs.last_name || '',
        irs.ssn_encrypted ? '***ENCRYPTED***' : '',
        irs.phone || '',
        irs.title || '',
        order.created_at || '',
      ]);
    }
  }

  return [
    CSV_HEADERS.map(escapeCSV).join(','),
    ...rows.map(row => row.map(escapeCSV).join(',')),
  ].join('\n');
}
