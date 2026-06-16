// XLSX serializer for account-manager handoff. Produces a styled workbook
// optimized for human review: bold 14pt header row, frozen header, wrapped
// text, top alignment, currency formatting on fee columns, and computed
// column widths so headers are visible without manual resize.
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";
import ExcelJS from "npm:exceljs@4.4.0";
import {
  buildOrderExportRecords,
  ORDER_EXPORT_FIELDS,
  type OrderExportFieldId,
} from "./order-export-data.ts";

// Operational fields first; remaining fields appended in their canonical
// order so nothing from the CSV is lost in the XLSX.
const XLSX_LEAD_FIELDS: OrderExportFieldId[] = [
  'order_id',
  'application_id',
  'contact_first_name',         // customer_name halves
  'contact_last_name',
  'contact_email',              // customer_email
  'company_name',               // business_name
  'entity_type',
  'state',
  'status',
  'selected_package',
  'filing_path',
  'waiver_status',
  'original_state_fee',
  'effective_state_fee',
  'waived_state_fee',
  'billable_addons',
  'included_addons',
  'selected_addons_raw',
  'registered_agent_terms',
  'waiver_admin_reviewed_at',
  'waiver_admin_notes',
];

function buildXlsxFieldOrder(): OrderExportFieldId[] {
  const seen = new Set<OrderExportFieldId>(XLSX_LEAD_FIELDS);
  const rest = (Object.keys(ORDER_EXPORT_FIELDS) as OrderExportFieldId[]).filter(
    (id) => !seen.has(id),
  );
  return [...XLSX_LEAD_FIELDS, ...rest];
}

function currencyValue(raw: string | undefined): number | string {
  if (!raw) return '';
  const n = Number(raw);
  return Number.isFinite(n) ? n : raw;
}

export async function buildOrderXlsx(
  supabase: ReturnType<typeof createClient>,
  orderIds: string[],
): Promise<Uint8Array> {
  const records = await buildOrderExportRecords(supabase, orderIds);
  const fields = buildXlsxFieldOrder();

  const workbook = new ExcelJS.Workbook();
  workbook.creator = 'EZ BIZ FILE SERVICE';
  workbook.created = new Date();
  const sheet = workbook.addWorksheet('Account Manager Orders', {
    views: [{ state: 'frozen', ySplit: 1 }],
  });

  // Configure columns: header label + initial width sized to header length.
  sheet.columns = fields.map((id) => {
    const meta = ORDER_EXPORT_FIELDS[id];
    return {
      header: meta.label,
      key: id,
      width: Math.max(meta.label.length + 4, 14),
    };
  });

  // Append data rows.
  for (const rec of records) {
    const row: Record<string, unknown> = {};
    for (const id of fields) {
      const meta = ORDER_EXPORT_FIELDS[id] as { currency?: boolean };
      const raw = rec[id] ?? '';
      row[id] = meta.currency ? currencyValue(raw) : raw;
    }
    sheet.addRow(row);
  }

  // Auto-fit column widths from actual cell content (capped to keep sane).
  fields.forEach((id, idx) => {
    const col = sheet.getColumn(idx + 1);
    let maxLen = String(ORDER_EXPORT_FIELDS[id].label).length;
    col.eachCell({ includeEmpty: false }, (cell, rowNumber) => {
      if (rowNumber === 1) return;
      const v = cell.value;
      const str = v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v);
      // For wrapped text, base width on the longest line, not full string.
      const longest = str.split(/\r?\n/).reduce((m, line) => Math.max(m, line.length), 0);
      if (longest > maxLen) maxLen = longest;
    });
    col.width = Math.min(Math.max(maxLen + 4, 14), 60);
  });

  // Apply currency number format to fee columns.
  fields.forEach((id, idx) => {
    const meta = ORDER_EXPORT_FIELDS[id] as { currency?: boolean };
    if (meta.currency) {
      sheet.getColumn(idx + 1).numFmt = '"$"#,##0.00;[Red]("$"#,##0.00)';
    }
  });

  // Header row styling.
  const header = sheet.getRow(1);
  header.height = 26;
  header.font = { bold: true, size: 14, color: { argb: 'FFFFFFFF' } };
  header.alignment = { vertical: 'middle', horizontal: 'left', wrapText: true };
  header.eachCell((cell) => {
    cell.fill = {
      type: 'pattern',
      pattern: 'solid',
      fgColor: { argb: 'FF1F2D4D' }, // executive slate navy
    };
    cell.border = {
      bottom: { style: 'thin', color: { argb: 'FFCBA135' } }, // gold accent
    };
  });

  // Body styling: top-aligned, wrapped text.
  for (let r = 2; r <= sheet.rowCount; r++) {
    const row = sheet.getRow(r);
    row.alignment = { vertical: 'top', wrapText: true };
  }

  // Enable autofilter across the data range.
  if (sheet.rowCount > 1) {
    sheet.autoFilter = {
      from: { row: 1, column: 1 },
      to: { row: 1, column: fields.length },
    };
  }

  const buf = await workbook.xlsx.writeBuffer();
  return new Uint8Array(buf as ArrayBuffer);
}
