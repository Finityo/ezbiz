import React, { useState, useCallback } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Eye, Loader2, Building2, User, MapPin, Users, Shield, FileText,
  CreditCard, Clock, Gavel, Settings, Pencil, Save, X, Check,
} from 'lucide-react';

interface OrderDetailDialogProps {
  orderId: string;
  companyName?: string;
  onUpdated?: () => void;
}

interface OrderDetail {
  order: any;
  businessInfo: any;
  contactInfo: any;
  addresses: any[];
  participants: any[];
  registeredAgent: any;
  companyManagement: any;
  irsParty: any;
  agreements: any;
  payments: any[];
  documents: any[];
  events: any[];
}

/* ── Editable Section wrapper ── */

function EditableSection({
  icon: Icon,
  title,
  editing,
  dirty,
  saving,
  onToggleEdit,
  onSave,
  onCancel,
  children,
}: {
  icon: any;
  title: string;
  editing: boolean;
  dirty: boolean;
  saving: boolean;
  onToggleEdit: () => void;
  onSave: () => void;
  onCancel: () => void;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between">
        <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
          <Icon className="h-4 w-4 text-primary" />
          {title}
        </h3>
        <div className="flex items-center gap-1">
          {editing ? (
            <>
              <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={onCancel} disabled={saving}>
                <X className="h-3 w-3 mr-1" /> Cancel
              </Button>
              <Button size="sm" className="h-7 px-2 text-xs" onClick={onSave} disabled={!dirty || saving}>
                {saving ? <Loader2 className="h-3 w-3 mr-1 animate-spin" /> : <Save className="h-3 w-3 mr-1" />}
                Save
              </Button>
            </>
          ) : (
            <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={onToggleEdit}>
              <Pencil className="h-3 w-3 mr-1" /> Edit
            </Button>
          )}
        </div>
      </div>
      <div className="rounded-lg border bg-muted/30 p-3 text-sm space-y-2">
        {children}
      </div>
    </div>
  );
}

/* ── Read-only section (for payments, events, etc.) ── */
function ReadOnlySection({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
  return (
    <div className="space-y-2">
      <h3 className="flex items-center gap-2 text-sm font-semibold text-foreground">
        <Icon className="h-4 w-4 text-primary" />
        {title}
      </h3>
      <div className="rounded-lg border bg-muted/30 p-3 text-sm space-y-1">
        {children}
      </div>
    </div>
  );
}

/* ── Field components ── */

function ReadField({ label, value }: { label: string; value: any }) {
  const display = value === null || value === undefined || value === '' ? '—' : String(value);
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="text-right font-medium break-all">{display}</span>
    </div>
  );
}

function EditField({
  label,
  value,
  onChange,
  type = 'text',
  multiline = false,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  multiline?: boolean;
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="text-muted-foreground shrink-0 pt-2 min-w-[100px] text-xs">{label}</span>
      {multiline ? (
        <Textarea value={value} onChange={(e) => onChange(e.target.value)} className="h-16 text-sm" />
      ) : (
        <Input value={value} onChange={(e) => onChange(e.target.value)} type={type} className="h-8 text-sm" />
      )}
    </div>
  );
}

function EditBoolField({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground text-xs">{label}</span>
      <Switch checked={value} onCheckedChange={onChange} />
    </div>
  );
}

/* ── Helper: use section editing state ── */
function useSectionEdit<T extends Record<string, any>>(initial: T | null) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<T | null>(null);
  const [saving, setSaving] = useState(false);

  const startEdit = () => {
    setDraft(initial ? { ...initial } : null);
    setEditing(true);
  };

  const cancel = () => {
    setDraft(null);
    setEditing(false);
  };

  const updateField = (key: keyof T, value: any) => {
    setDraft((prev) => prev ? { ...prev, [key]: value } : prev);
  };

  const dirty = editing && draft && initial
    ? JSON.stringify(draft) !== JSON.stringify(initial)
    : false;

  return { editing, draft, saving, setSaving, dirty, startEdit, cancel, updateField, setEditing, setDraft };
}

/* ── Main Component ── */

const OrderDetailDialog = ({ orderId, companyName, onUpdated }: OrderDetailDialogProps) => {
  const { toast } = useToast();
  const [detail, setDetail] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  // Section edit states
  const orderEdit = useSectionEdit(detail?.order);
  const bizEdit = useSectionEdit(detail?.businessInfo);
  const contactEdit = useSectionEdit(detail?.contactInfo);
  const agentEdit = useSectionEdit(detail?.registeredAgent);
  const mgmtEdit = useSectionEdit(detail?.companyManagement);
  const irsEdit = useSectionEdit(detail?.irsParty);

  const fetchDetails = async (force = false) => {
    if (detail && !force) return;
    setLoading(true);
    try {
      const [orderRes, bizRes, contactRes, addressRes, participantsRes, agentRes, mgmtRes, irsRes, agreementRes, paymentsRes, docsRes, eventsRes] =
        await Promise.all([
          supabase.from('orders').select('*').eq('id', orderId).single(),
          supabase.from('business_information').select('*').eq('order_id', orderId).maybeSingle(),
          supabase.from('contact_information').select('*').eq('order_id', orderId).maybeSingle(),
          supabase.from('addresses').select('*').eq('order_id', orderId),
          supabase.from('participants').select('*').eq('order_id', orderId),
          supabase.from('registered_agent').select('*').eq('order_id', orderId).maybeSingle(),
          supabase.from('company_management').select('*').eq('order_id', orderId).maybeSingle(),
          supabase.from('irs_responsible_party').select('*').eq('order_id', orderId).maybeSingle(),
          supabase.from('agreements').select('*').eq('order_id', orderId).maybeSingle(),
          supabase.from('payments').select('*').eq('order_id', orderId).order('created_at', { ascending: false }),
          supabase.from('documents').select('*').eq('order_id', orderId).order('uploaded_at', { ascending: false }),
          supabase.from('order_events').select('*').eq('order_id', orderId).order('created_at', { ascending: false }),
        ]);

      setDetail({
        order: orderRes.data,
        businessInfo: bizRes.data,
        contactInfo: contactRes.data,
        addresses: addressRes.data || [],
        participants: participantsRes.data || [],
        registeredAgent: agentRes.data,
        companyManagement: mgmtRes.data,
        irsParty: irsRes.data,
        agreements: agreementRes.data,
        payments: paymentsRes.data || [],
        documents: docsRes.data || [],
        events: eventsRes.data || [],
      });
    } catch (err) {
      console.error('Failed to fetch order details:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveSection = async (
    table: string,
    idField: string,
    idValue: string,
    data: Record<string, any>,
    editState: ReturnType<typeof useSectionEdit>,
    sectionName: string,
  ) => {
    editState.setSaving(true);
    try {
      // Strip id and metadata fields
      const { id, order_id, created_at, updated_at, ...updateData } = data;
      const { error } = await supabase.from(table as any).update(updateData).eq(idField, idValue);
      if (error) throw error;

      // Log amendment event
      await supabase.from('order_events').insert({
        order_id: orderId,
        event_type: 'admin_amendment',
        actor: 'admin',
        metadata: { section: sectionName, fields_updated: Object.keys(updateData) },
      });

      toast({ title: 'Saved', description: `${sectionName} updated successfully.` });
      editState.setEditing(false);
      editState.setDraft(null);
      await fetchDetails(true);
      onUpdated?.();
    } catch (err: any) {
      console.error('Save error:', err);
      toast({ title: 'Save Failed', description: err.message || 'Could not save changes.', variant: 'destructive' });
    } finally {
      editState.setSaving(false);
    }
  };

  const str = (v: any) => (v == null ? '' : String(v));
  const num = (v: string) => (v === '' ? null : Number(v));
  const bool = (v: any) => !!v;

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (v) fetchDetails(); }}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className="h-7 w-7 shrink-0" title="View / Edit Details">
          <Eye className="h-3 w-3" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[85vh] p-0">
        <DialogHeader className="px-6 pt-6 pb-2">
          <DialogTitle className="flex items-center gap-2 text-lg">
            <Building2 className="h-5 w-5 text-primary" />
            {companyName || 'Order Details'}
            <span className="text-xs font-mono text-muted-foreground ml-2">{orderId.substring(0, 8)}</span>
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="px-6 pb-6 max-h-[70vh]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-6 w-6 animate-spin text-primary" />
              <span className="ml-2 text-muted-foreground">Loading details…</span>
            </div>
          ) : detail ? (
            <div className="space-y-4">

              {/* ── Order Summary ── */}
              <EditableSection
                icon={FileText}
                title="Order Summary"
                editing={orderEdit.editing}
                dirty={!!orderEdit.dirty}
                saving={orderEdit.saving}
                onToggleEdit={() => orderEdit.startEdit()}
                onSave={() => saveSection('orders', 'id', orderId, orderEdit.draft!, orderEdit, 'Order Summary')}
                onCancel={orderEdit.cancel}
              >
                {orderEdit.editing && orderEdit.draft ? (
                  <>
                    <ReadField label="Order ID" value={detail.order?.id} />
                    <EditField label="Status" value={str(orderEdit.draft.status)} onChange={(v) => orderEdit.updateField('status', v)} />
                    <EditField label="Entity Type" value={str(orderEdit.draft.entity_type)} onChange={(v) => orderEdit.updateField('entity_type', v)} />
                    <EditField label="State" value={str(orderEdit.draft.state)} onChange={(v) => orderEdit.updateField('state', v)} />
                    <EditField label="Package" value={str(orderEdit.draft.package)} onChange={(v) => orderEdit.updateField('package', v)} />
                    <EditField label="Filing Speed" value={str(orderEdit.draft.filing_speed)} onChange={(v) => orderEdit.updateField('filing_speed', v)} />
                    <EditBoolField label="EIN Service" value={bool(orderEdit.draft.ein_service)} onChange={(v) => orderEdit.updateField('ein_service', v)} />
                    <EditField label="Total Amount" value={str(orderEdit.draft.total_amount)} onChange={(v) => orderEdit.updateField('total_amount', num(v))} type="number" />
                    <EditField label="State Fee" value={str(orderEdit.draft.state_fee)} onChange={(v) => orderEdit.updateField('state_fee', num(v))} type="number" />
                  </>
                ) : (
                  <>
                    <ReadField label="Order ID" value={detail.order?.id} />
                    <ReadField label="Status" value={detail.order?.status} />
                    <ReadField label="Entity Type" value={detail.order?.entity_type} />
                    <ReadField label="State" value={detail.order?.state} />
                    <ReadField label="Package" value={detail.order?.package} />
                    <ReadField label="Filing Speed" value={detail.order?.filing_speed} />
                    <ReadField label="EIN Service" value={detail.order?.ein_service ? 'Yes' : 'No'} />
                    <ReadField label="Total Amount" value={detail.order?.total_amount != null ? `$${Number(detail.order.total_amount).toFixed(2)}` : null} />
                    <ReadField label="State Fee" value={detail.order?.state_fee != null ? `$${Number(detail.order.state_fee).toFixed(2)}` : null} />
                    <ReadField label="Created" value={detail.order?.created_at ? new Date(detail.order.created_at).toLocaleString() : null} />
                  </>
                )}
              </EditableSection>

              <Separator />

              {/* ── Business Information ── */}
              {detail.businessInfo && (
                <EditableSection
                  icon={Building2}
                  title="Business Information"
                  editing={bizEdit.editing}
                  dirty={!!bizEdit.dirty}
                  saving={bizEdit.saving}
                  onToggleEdit={() => bizEdit.startEdit()}
                  onSave={() => saveSection('business_information', 'order_id', orderId, bizEdit.draft!, bizEdit, 'Business Information')}
                  onCancel={bizEdit.cancel}
                >
                  {bizEdit.editing && bizEdit.draft ? (
                    <>
                      <EditField label="Company Name" value={str(bizEdit.draft.company_name)} onChange={(v) => bizEdit.updateField('company_name', v)} />
                      <EditField label="Alternate Name" value={str(bizEdit.draft.alternate_company_name)} onChange={(v) => bizEdit.updateField('alternate_company_name', v)} />
                      <EditField label="Business Purpose" value={str(bizEdit.draft.business_purpose)} onChange={(v) => bizEdit.updateField('business_purpose', v)} multiline />
                      <EditField label="Description" value={str(bizEdit.draft.business_description)} onChange={(v) => bizEdit.updateField('business_description', v)} multiline />
                      <EditField label="Organizer Type" value={str(bizEdit.draft.organizer_type)} onChange={(v) => bizEdit.updateField('organizer_type', v)} />
                      <EditBoolField label="Delayed Filing" value={bool(bizEdit.draft.delayed_filing)} onChange={(v) => bizEdit.updateField('delayed_filing', v)} />
                    </>
                  ) : (
                    <>
                      <ReadField label="Company Name" value={detail.businessInfo.company_name} />
                      <ReadField label="Alternate Name" value={detail.businessInfo.alternate_company_name} />
                      <ReadField label="Business Purpose" value={detail.businessInfo.business_purpose} />
                      <ReadField label="Description" value={detail.businessInfo.business_description} />
                      <ReadField label="Organizer Type" value={detail.businessInfo.organizer_type} />
                      <ReadField label="Delayed Filing" value={detail.businessInfo.delayed_filing ? 'Yes' : 'No'} />
                    </>
                  )}
                </EditableSection>
              )}

              {/* ── Contact Information ── */}
              {detail.contactInfo && (
                <EditableSection
                  icon={User}
                  title="Contact Information"
                  editing={contactEdit.editing}
                  dirty={!!contactEdit.dirty}
                  saving={contactEdit.saving}
                  onToggleEdit={() => contactEdit.startEdit()}
                  onSave={() => saveSection('contact_information', 'order_id', orderId, contactEdit.draft!, contactEdit, 'Contact Information')}
                  onCancel={contactEdit.cancel}
                >
                  {contactEdit.editing && contactEdit.draft ? (
                    <>
                      <EditField label="First Name" value={str(contactEdit.draft.first_name)} onChange={(v) => contactEdit.updateField('first_name', v)} />
                      <EditField label="Last Name" value={str(contactEdit.draft.last_name)} onChange={(v) => contactEdit.updateField('last_name', v)} />
                      <EditField label="Email" value={str(contactEdit.draft.email)} onChange={(v) => contactEdit.updateField('email', v)} type="email" />
                      <EditField label="Phone" value={str(contactEdit.draft.phone)} onChange={(v) => contactEdit.updateField('phone', v)} type="tel" />
                    </>
                  ) : (
                    <>
                      <ReadField label="First Name" value={detail.contactInfo.first_name} />
                      <ReadField label="Last Name" value={detail.contactInfo.last_name} />
                      <ReadField label="Email" value={detail.contactInfo.email} />
                      <ReadField label="Phone" value={detail.contactInfo.phone} />
                    </>
                  )}
                </EditableSection>
              )}

              {/* ── Addresses (editable per address) ── */}
              {detail.addresses.length > 0 && detail.addresses.map((addr, idx) => (
                <AddressEditSection key={addr.id} addr={addr} orderId={orderId} onSaved={() => fetchDetails(true)} />
              ))}

              {/* ── Participants (editable per participant) ── */}
              {detail.participants.length > 0 && detail.participants.map((p, idx) => (
                <ParticipantEditSection key={p.id} participant={p} orderId={orderId} onSaved={() => fetchDetails(true)} />
              ))}

              {/* ── Registered Agent ── */}
              {detail.registeredAgent && (
                <EditableSection
                  icon={Shield}
                  title="Registered Agent"
                  editing={agentEdit.editing}
                  dirty={!!agentEdit.dirty}
                  saving={agentEdit.saving}
                  onToggleEdit={() => agentEdit.startEdit()}
                  onSave={() => saveSection('registered_agent', 'order_id', orderId, agentEdit.draft!, agentEdit, 'Registered Agent')}
                  onCancel={agentEdit.cancel}
                >
                  {agentEdit.editing && agentEdit.draft ? (
                    <>
                      <EditField label="Type" value={str(agentEdit.draft.agent_type)} onChange={(v) => agentEdit.updateField('agent_type', v)} />
                      <EditField label="Name" value={str(agentEdit.draft.name)} onChange={(v) => agentEdit.updateField('name', v)} />
                      <EditField label="Address" value={str(agentEdit.draft.address)} onChange={(v) => agentEdit.updateField('address', v)} />
                    </>
                  ) : (
                    <>
                      <ReadField label="Type" value={detail.registeredAgent.agent_type} />
                      <ReadField label="Name" value={detail.registeredAgent.name} />
                      <ReadField label="Address" value={detail.registeredAgent.address} />
                    </>
                  )}
                </EditableSection>
              )}

              {/* ── Company Management ── */}
              {detail.companyManagement && (
                <EditableSection
                  icon={Settings}
                  title="Company Management"
                  editing={mgmtEdit.editing}
                  dirty={!!mgmtEdit.dirty}
                  saving={mgmtEdit.saving}
                  onToggleEdit={() => mgmtEdit.startEdit()}
                  onSave={() => saveSection('company_management', 'order_id', orderId, mgmtEdit.draft!, mgmtEdit, 'Company Management')}
                  onCancel={mgmtEdit.cancel}
                >
                  {mgmtEdit.editing && mgmtEdit.draft ? (
                    <EditField label="Management Type" value={str(mgmtEdit.draft.management_type)} onChange={(v) => mgmtEdit.updateField('management_type', v)} />
                  ) : (
                    <ReadField label="Management Type" value={detail.companyManagement.management_type} />
                  )}
                </EditableSection>
              )}

              {/* ── IRS Responsible Party ── */}
              {detail.irsParty && (
                <EditableSection
                  icon={Gavel}
                  title="IRS Responsible Party"
                  editing={irsEdit.editing}
                  dirty={!!irsEdit.dirty}
                  saving={irsEdit.saving}
                  onToggleEdit={() => irsEdit.startEdit()}
                  onSave={() => saveSection('irs_responsible_party', 'order_id', orderId, irsEdit.draft!, irsEdit, 'IRS Responsible Party')}
                  onCancel={irsEdit.cancel}
                >
                  {irsEdit.editing && irsEdit.draft ? (
                    <>
                      <EditField label="First Name" value={str(irsEdit.draft.first_name)} onChange={(v) => irsEdit.updateField('first_name', v)} />
                      <EditField label="Last Name" value={str(irsEdit.draft.last_name)} onChange={(v) => irsEdit.updateField('last_name', v)} />
                      <EditField label="Title" value={str(irsEdit.draft.title)} onChange={(v) => irsEdit.updateField('title', v)} />
                      <EditField label="Phone" value={str(irsEdit.draft.phone)} onChange={(v) => irsEdit.updateField('phone', v)} type="tel" />
                      <ReadField label="SSN" value={irsEdit.draft.ssn_encrypted ? '●●●-●●-●●●● (encrypted)' : '—'} />
                    </>
                  ) : (
                    <>
                      <ReadField label="First Name" value={detail.irsParty.first_name} />
                      <ReadField label="Last Name" value={detail.irsParty.last_name} />
                      <ReadField label="Title" value={detail.irsParty.title} />
                      <ReadField label="Phone" value={detail.irsParty.phone} />
                      <ReadField label="SSN" value={detail.irsParty.ssn_encrypted ? '●●●-●●-●●●● (encrypted)' : null} />
                    </>
                  )}
                </EditableSection>
              )}

              {/* ── Agreements (read-only) ── */}
              {detail.agreements && (
                <ReadOnlySection icon={FileText} title="Agreements">
                  <ReadField label="Terms Accepted" value={detail.agreements.terms_accepted ? 'Yes' : 'No'} />
                  <ReadField label="Privacy Accepted" value={detail.agreements.privacy_accepted ? 'Yes' : 'No'} />
                  <ReadField label="IP Address" value={detail.agreements.ip_address} />
                  <ReadField label="Timestamp" value={detail.agreements.timestamp ? new Date(detail.agreements.timestamp).toLocaleString() : null} />
                </ReadOnlySection>
              )}

              {/* ── Payments (read-only) ── */}
              {detail.payments.length > 0 && (
                <ReadOnlySection icon={CreditCard} title={`Payments (${detail.payments.length})`}>
                  {detail.payments.map((p, i) => (
                    <div key={p.id} className={i > 0 ? 'pt-2 border-t border-border mt-2' : ''}>
                      <ReadField label="Amount" value={p.amount != null ? `$${Number(p.amount).toFixed(2)}` : null} />
                      <ReadField label="Status" value={p.status} />
                      <ReadField label="Stripe ID" value={p.stripe_payment_id} />
                      <ReadField label="Date" value={p.created_at ? new Date(p.created_at).toLocaleString() : null} />
                    </div>
                  ))}
                </ReadOnlySection>
              )}

              {/* ── Documents (read-only) ── */}
              {detail.documents.length > 0 && (
                <ReadOnlySection icon={FileText} title={`Documents (${detail.documents.length})`}>
                  {detail.documents.map((d, i) => (
                    <div key={d.id} className={i > 0 ? 'pt-2 border-t border-border mt-2' : ''}>
                      <ReadField label="Type" value={d.document_type} />
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">File</span>
                        <a href={d.file_url} target="_blank" rel="noopener noreferrer" className="text-primary underline text-right text-xs">View / Download</a>
                      </div>
                      <ReadField label="Uploaded" value={d.uploaded_at ? new Date(d.uploaded_at).toLocaleString() : null} />
                    </div>
                  ))}
                </ReadOnlySection>
              )}

              {/* ── Event Log (read-only) ── */}
              {detail.events.length > 0 && (
                <ReadOnlySection icon={Clock} title={`Event Log (${detail.events.length})`}>
                  {detail.events.map((e, i) => (
                    <div key={e.id} className={i > 0 ? 'pt-2 border-t border-border mt-2' : ''}>
                      <ReadField label="Event" value={e.event_type} />
                      <ReadField label="Actor" value={e.actor} />
                      <ReadField label="Date" value={e.created_at ? new Date(e.created_at).toLocaleString() : null} />
                      {e.metadata && Object.keys(e.metadata).length > 0 && (
                        <ReadField label="Details" value={JSON.stringify(e.metadata)} />
                      )}
                    </div>
                  ))}
                </ReadOnlySection>
              )}
            </div>
          ) : null}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

/* ── Address Edit Sub-component ── */

function AddressEditSection({ addr, orderId, onSaved }: { addr: any; orderId: string; onSaved: () => void }) {
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const startEdit = () => { setDraft({ ...addr }); setEditing(true); };
  const cancel = () => { setDraft(null); setEditing(false); };
  const update = (key: string, value: any) => setDraft((p: any) => ({ ...p, [key]: value }));
  const dirty = draft ? JSON.stringify(draft) !== JSON.stringify(addr) : false;

  const save = async () => {
    setSaving(true);
    try {
      const { id, order_id, created_at, ...data } = draft;
      const { error } = await supabase.from('addresses').update(data).eq('id', addr.id);
      if (error) throw error;
      await supabase.from('order_events').insert({
        order_id: orderId, event_type: 'admin_amendment', actor: 'admin',
        metadata: { section: `Address (${addr.type})`, fields_updated: Object.keys(data) },
      });
      toast({ title: 'Saved', description: `Address updated.` });
      setEditing(false);
      onSaved();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally { setSaving(false); }
  };

  return (
    <EditableSection
      icon={MapPin}
      title={`Address — ${addr.type}`}
      editing={editing}
      dirty={dirty}
      saving={saving}
      onToggleEdit={startEdit}
      onSave={save}
      onCancel={cancel}
    >
      {editing && draft ? (
        <>
          <EditField label="Type" value={draft.type || ''} onChange={(v) => update('type', v)} />
          <EditField label="Address 1" value={draft.address1 || ''} onChange={(v) => update('address1', v)} />
          <EditField label="Address 2" value={draft.address2 || ''} onChange={(v) => update('address2', v)} />
          <EditField label="City" value={draft.city || ''} onChange={(v) => update('city', v)} />
          <EditField label="State" value={draft.state || ''} onChange={(v) => update('state', v)} />
          <EditField label="ZIP" value={draft.zip || ''} onChange={(v) => update('zip', v)} />
          <EditField label="Country" value={draft.country || ''} onChange={(v) => update('country', v)} />
        </>
      ) : (
        <>
          <ReadField label="Type" value={addr.type} />
          <ReadField label="Address" value={[addr.address1, addr.address2].filter(Boolean).join(', ') || null} />
          <ReadField label="City / State / ZIP" value={[addr.city, addr.state, addr.zip].filter(Boolean).join(', ') || null} />
          <ReadField label="Country" value={addr.country} />
        </>
      )}
    </EditableSection>
  );
}

/* ── Participant Edit Sub-component ── */

function ParticipantEditSection({ participant, orderId, onSaved }: { participant: any; orderId: string; onSaved: () => void }) {
  const { toast } = useToast();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<any>(null);
  const [saving, setSaving] = useState(false);

  const startEdit = () => { setDraft({ ...participant }); setEditing(true); };
  const cancel = () => { setDraft(null); setEditing(false); };
  const update = (key: string, value: any) => setDraft((p: any) => ({ ...p, [key]: value }));
  const dirty = draft ? JSON.stringify(draft) !== JSON.stringify(participant) : false;

  const save = async () => {
    setSaving(true);
    try {
      const { id, order_id, created_at, ...data } = draft;
      const { error } = await supabase.from('participants').update(data).eq('id', participant.id);
      if (error) throw error;
      await supabase.from('order_events').insert({
        order_id: orderId, event_type: 'admin_amendment', actor: 'admin',
        metadata: { section: `Participant (${participant.first_name} ${participant.last_name})`, fields_updated: Object.keys(data) },
      });
      toast({ title: 'Saved', description: `Participant updated.` });
      setEditing(false);
      onSaved();
    } catch (err: any) {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    } finally { setSaving(false); }
  };

  const name = [participant.first_name, participant.last_name].filter(Boolean).join(' ') || 'Member';

  return (
    <EditableSection
      icon={Users}
      title={`Member — ${name}`}
      editing={editing}
      dirty={dirty}
      saving={saving}
      onToggleEdit={startEdit}
      onSave={save}
      onCancel={cancel}
    >
      {editing && draft ? (
        <>
          <EditField label="First Name" value={draft.first_name || ''} onChange={(v) => update('first_name', v)} />
          <EditField label="Last Name" value={draft.last_name || ''} onChange={(v) => update('last_name', v)} />
          <EditField label="Role" value={draft.role || ''} onChange={(v) => update('role', v)} />
          <EditField label="Title" value={draft.title || ''} onChange={(v) => update('title', v)} />
          <EditField label="Ownership %" value={draft.ownership_percent != null ? String(draft.ownership_percent) : ''} onChange={(v) => update('ownership_percent', v === '' ? null : Number(v))} type="number" />
          <EditBoolField label="Auth. Signer" value={!!draft.authorized_signer} onChange={(v) => update('authorized_signer', v)} />
          <EditField label="Address" value={draft.address || ''} onChange={(v) => update('address', v)} />
        </>
      ) : (
        <>
          <ReadField label="Name" value={[participant.first_name, participant.last_name].filter(Boolean).join(' ') || null} />
          <ReadField label="Role" value={participant.role} />
          <ReadField label="Title" value={participant.title} />
          <ReadField label="Ownership %" value={participant.ownership_percent != null ? `${participant.ownership_percent}%` : null} />
          <ReadField label="Auth. Signer" value={participant.authorized_signer ? 'Yes' : 'No'} />
          <ReadField label="Address" value={participant.address} />
        </>
      )}
    </EditableSection>
  );
}

export default OrderDetailDialog;
