// CSV serializer for account-manager handoff. Phase Three waiver/entitlement
// columns are appended to the TAIL so any positional consumer that locked
// onto the original CorpNet column order stays compatible.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import {
  buildOrderExportRecords,
  type OrderExportFieldId,
} from "./order-export-data.ts";

function escapeCSV(value: string | number | boolean | null | undefined): string {
  if (value === null || value === undefined) return '';
  const str = String(value);
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

// Original (pre-Phase-Three) columns kept in their historical order.
const LEGACY_CSV_FIELDS: OrderExportFieldId[] = [
  'order_number', 'order_id', 'export_date', 'status', 'entity_type', 'package',
  'package_stripe_price_id', 'state', 'filing_speed', 'ein_service', 'delayed_filing',
  'state_fee', 'total_amount', 'stripe_session_id', 'stripe_payment_intent', 'application_id',
  'company_name', 'alternate_name', 'business_description', 'organizer_type', 'business_purpose',
  'contact_first_name', 'contact_last_name', 'contact_email', 'contact_phone',
  'business_address1', 'business_address2', 'business_city', 'business_state',
  'business_zip', 'business_country',
  'shipping_address1', 'shipping_address2', 'shipping_city', 'shipping_state',
  'shipping_zip', 'shipping_country',
  'registered_agent_type', 'registered_agent_name', 'registered_agent_address',
  'management_type',
  'participant_first_name', 'participant_last_name', 'participant_role',
  'participant_title', 'ownership_percent', 'participant_address',
  'participant_authorized_signer',
  'irs_first_name', 'irs_last_name', 'irs_ssn_status', 'irs_phone', 'irs_title',
  'terms_accepted', 'privacy_accepted', 'agreement_ip', 'agreement_timestamp',
  'created_at', 'updated_at',
];

// Phase Three additions — appended at the tail to preserve positional layout.
const PHASE_THREE_TAIL_FIELDS: OrderExportFieldId[] = [
  'filing_path', 'waiver_status', 'original_state_fee', 'effective_state_fee', 'waived_state_fee',
  'selected_package', 'billable_addons', 'included_addons', 'selected_addons_raw',
  'registered_agent_terms', 'waiver_admin_reviewed_at', 'waiver_admin_notes',
];

export const CSV_FIELDS: OrderExportFieldId[] = [
  ...LEGACY_CSV_FIELDS,
  ...PHASE_THREE_TAIL_FIELDS,
];

export const CSV_HEADERS: string[] = CSV_FIELDS.map((id) => id);

export async function buildOrderCsv(
  supabase: ReturnType<typeof createClient>,
  orderIds: string[],
): Promise<string> {
  const records = await buildOrderExportRecords(supabase, orderIds);
  const headerLine = CSV_HEADERS.map(escapeCSV).join(',');
  if (records.length === 0) return headerLine + '\n';
  const rows = records.map((r) =>
    CSV_FIELDS.map((id) => escapeCSV(r[id] ?? '')).join(','),
  );
  return [headerLine, ...rows].join('\n');
}
