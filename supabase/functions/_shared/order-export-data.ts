// Shared row-builder for account-manager order exports.
// Returns one Record<string,string> per (order, participant) row so the
// CSV and XLSX serializers can each pick their own column order.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import { splitAddons, registeredAgentTermsFor } from "./package-entitlements.ts";

export type OrderExportRecord = Record<string, string>;

// Canonical, stable field set. Field IDs are the keys both serializers reference.
// Numeric fields are tagged so XLSX can apply currency formatting.
export const ORDER_EXPORT_FIELDS = {
  // Order
  order_number: { label: "order_number" },
  order_id: { label: "order_id" },
  export_date: { label: "export_date" },
  status: { label: "status" },
  entity_type: { label: "entity_type" },
  package: { label: "package" },
  package_stripe_price_id: { label: "package_stripe_price_id" },
  state: { label: "state" },
  filing_speed: { label: "filing_speed" },
  ein_service: { label: "ein_service" },
  delayed_filing: { label: "delayed_filing" },
  state_fee: { label: "state_fee", numeric: true, currency: true },
  total_amount: { label: "total_amount", numeric: true, currency: true },
  stripe_session_id: { label: "stripe_session_id" },
  stripe_payment_intent: { label: "stripe_payment_intent" },
  application_id: { label: "application_id" },
  // Business
  company_name: { label: "company_name" },
  alternate_name: { label: "alternate_name" },
  business_description: { label: "business_description" },
  organizer_type: { label: "organizer_type" },
  business_purpose: { label: "business_purpose" },
  // Contact
  contact_first_name: { label: "contact_first_name" },
  contact_last_name: { label: "contact_last_name" },
  contact_email: { label: "contact_email" },
  contact_phone: { label: "contact_phone" },
  // Business address
  business_address1: { label: "business_address1" },
  business_address2: { label: "business_address2" },
  business_city: { label: "business_city" },
  business_state: { label: "business_state" },
  business_zip: { label: "business_zip" },
  business_country: { label: "business_country" },
  // Shipping address
  shipping_address1: { label: "shipping_address1" },
  shipping_address2: { label: "shipping_address2" },
  shipping_city: { label: "shipping_city" },
  shipping_state: { label: "shipping_state" },
  shipping_zip: { label: "shipping_zip" },
  shipping_country: { label: "shipping_country" },
  // Registered agent
  registered_agent_type: { label: "registered_agent_type" },
  registered_agent_name: { label: "registered_agent_name" },
  registered_agent_address: { label: "registered_agent_address" },
  // Management
  management_type: { label: "management_type" },
  // Participant
  participant_first_name: { label: "participant_first_name" },
  participant_last_name: { label: "participant_last_name" },
  participant_role: { label: "participant_role" },
  participant_title: { label: "participant_title" },
  ownership_percent: { label: "ownership_percent" },
  participant_address: { label: "participant_address" },
  participant_authorized_signer: { label: "participant_authorized_signer" },
  // IRS
  irs_first_name: { label: "irs_first_name" },
  irs_last_name: { label: "irs_last_name" },
  irs_ssn_status: { label: "irs_ssn_status" },
  irs_phone: { label: "irs_phone" },
  irs_title: { label: "irs_title" },
  // Agreements
  terms_accepted: { label: "terms_accepted" },
  privacy_accepted: { label: "privacy_accepted" },
  agreement_ip: { label: "agreement_ip" },
  agreement_timestamp: { label: "agreement_timestamp" },
  // Timestamps
  created_at: { label: "created_at" },
  updated_at: { label: "updated_at" },
  // Phase Three: waiver + entitlement (tail in CSV for positional compatibility)
  filing_path: { label: "filing_path" },
  waiver_status: { label: "waiver_status" },
  original_state_fee: { label: "original_state_fee", numeric: true, currency: true },
  effective_state_fee: { label: "effective_state_fee", numeric: true, currency: true },
  waived_state_fee: { label: "waived_state_fee" },
  selected_package: { label: "selected_package" },
  billable_addons: { label: "billable_addons" },
  included_addons: { label: "included_addons" },
  selected_addons_raw: { label: "selected_addons_raw" },
  registered_agent_terms: { label: "registered_agent_terms" },
  waiver_admin_reviewed_at: { label: "waiver_admin_reviewed_at" },
  waiver_admin_notes: { label: "waiver_admin_notes" },
} as const;

export type OrderExportFieldId = keyof typeof ORDER_EXPORT_FIELDS;

export async function buildOrderExportRecords(
  supabase: ReturnType<typeof createClient>,
  orderIds: string[],
): Promise<OrderExportRecord[]> {
  if (orderIds.length === 0) return [];

  const [orders, contacts, bizInfo, addresses, agents, mgmt, participants, irsParties, agreements] = await Promise.all([
    supabase.from('orders').select('*').in('id', orderIds),
    supabase.from('contact_information').select('*').in('order_id', orderIds),
    supabase.from('business_information').select('*').in('order_id', orderIds),
    supabase.from('addresses').select('*').in('order_id', orderIds),
    supabase.from('registered_agent').select('*').in('order_id', orderIds),
    supabase.from('company_management').select('*').in('order_id', orderIds),
    supabase.from('participants').select('*').in('order_id', orderIds),
    supabase.from('irs_responsible_party').select('*').in('order_id', orderIds),
    supabase.from('agreements').select('*').in('order_id', orderIds),
  ]);

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
  const records: OrderExportRecord[] = [];

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

    const app: any = order.application_id ? appMap.get(order.application_id) : null;
    const appData: any = (app?.application_data ?? {}) as Record<string, unknown>;
    const filingPath: string =
      typeof appData.filingPath === 'string' ? appData.filingPath : 'standard';
    const isWaiver = filingPath === 'texas_veteran_waiver';
    const waiverStatus = isWaiver ? (app?.status ?? '') : '';
    const selectedPackage =
      (typeof appData.package === 'string' ? appData.package : null) ?? order.package ?? '';
    const selectedAddonsRaw: string[] = Array.isArray(appData.addOns)
      ? appData.addOns.filter((x: unknown) => typeof x === 'string')
      : [];
    const { billable, included } = splitAddons(selectedPackage, selectedAddonsRaw);
    const orderStateFee = order.state_fee != null ? Number(order.state_fee) : 0;
    const originalStateFee: number = isWaiver
      ? Number(appData.originalStateFee ?? 300)
      : orderStateFee;
    const effectiveStateFee: number = isWaiver
      ? Number(appData.effectiveStateFee ?? orderStateFee)
      : orderStateFee;
    const waivedStateFee = isWaiver && appData.waivedStateFee === true;
    const raTerms = registeredAgentTermsFor(selectedPackage);
    const waiverReviewedAt =
      typeof appData.waiverReviewedAt === 'string' ? appData.waiverReviewedAt : '';
    const waiverAdminNotes =
      typeof appData.adminNote === 'string' ? appData.adminNote : '';

    for (const p of participantRows) {
      records.push({
        order_number: order.order_number != null ? String(order.order_number) : '',
        order_id: order.id ?? '',
        export_date: exportDate,
        status: order.status ?? '',
        entity_type: order.entity_type ?? '',
        package: order.package ?? '',
        package_stripe_price_id: order.package_id ?? '',
        state: order.state ?? '',
        filing_speed: order.filing_speed ?? 'standard',
        ein_service: order.ein_service ? 'Yes' : 'No',
        delayed_filing: biz.delayed_filing ? 'Yes' : 'No',
        state_fee: order.state_fee != null ? String(order.state_fee) : '',
        total_amount: order.total_amount != null ? String(order.total_amount) : '',
        stripe_session_id: order.stripe_session_id ?? '',
        stripe_payment_intent: order.stripe_payment_intent ?? '',
        application_id: order.application_id ?? '',
        company_name: biz.company_name ?? '',
        alternate_name: biz.alternate_company_name ?? '',
        business_description: biz.business_description ?? '',
        organizer_type: biz.organizer_type ?? '',
        business_purpose: biz.business_purpose ?? '',
        contact_first_name: contact.first_name ?? '',
        contact_last_name: contact.last_name ?? '',
        contact_email: contact.email ?? order.email ?? '',
        contact_phone: contact.phone ?? '',
        business_address1: bAddr.address1 ?? '',
        business_address2: bAddr.address2 ?? '',
        business_city: bAddr.city ?? '',
        business_state: bAddr.state ?? '',
        business_zip: bAddr.zip ?? '',
        business_country: bAddr.country ?? '',
        shipping_address1: sAddr.address1 ?? '',
        shipping_address2: sAddr.address2 ?? '',
        shipping_city: sAddr.city ?? '',
        shipping_state: sAddr.state ?? '',
        shipping_zip: sAddr.zip ?? '',
        shipping_country: sAddr.country ?? '',
        registered_agent_type: agent.agent_type ?? '',
        registered_agent_name: agent.name ?? '',
        registered_agent_address: agent.address ?? '',
        management_type: management.management_type ?? '',
        participant_first_name: p.first_name ?? '',
        participant_last_name: p.last_name ?? '',
        participant_role: p.role ?? '',
        participant_title: p.title ?? '',
        ownership_percent: p.ownership_percent != null ? String(p.ownership_percent) : '',
        participant_address: p.address ?? '',
        participant_authorized_signer: p.authorized_signer
          ? 'Yes'
          : p.authorized_signer === false ? 'No' : '',
        irs_first_name: irs.first_name ?? '',
        irs_last_name: irs.last_name ?? '',
        irs_ssn_status: irs.ssn_encrypted
          ? 'ENCRYPTED (request via secure channel)'
          : 'NOT PROVIDED',
        irs_phone: irs.phone ?? '',
        irs_title: irs.title ?? '',
        terms_accepted: agreement.terms_accepted
          ? 'Yes'
          : agreement.terms_accepted === false ? 'No' : '',
        privacy_accepted: agreement.privacy_accepted
          ? 'Yes'
          : agreement.privacy_accepted === false ? 'No' : '',
        agreement_ip: agreement.ip_address ?? '',
        agreement_timestamp: agreement.timestamp ?? '',
        created_at: order.created_at ?? '',
        updated_at: order.updated_at ?? '',
        filing_path: filingPath,
        waiver_status: waiverStatus,
        original_state_fee: String(originalStateFee),
        effective_state_fee: String(effectiveStateFee),
        waived_state_fee: waivedStateFee ? 'Yes' : 'No',
        selected_package: selectedPackage,
        billable_addons: billable.join('|'),
        included_addons: included.join('|'),
        selected_addons_raw: selectedAddonsRaw.join('|'),
        registered_agent_terms: raTerms,
        waiver_admin_reviewed_at: waiverReviewedAt,
        waiver_admin_notes: waiverAdminNotes,
      });
    }
  }

  return records;
}
