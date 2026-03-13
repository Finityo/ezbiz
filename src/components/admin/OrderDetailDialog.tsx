import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { supabase } from '@/integrations/supabase/client';
import { Eye, Loader2, Building2, User, MapPin, Users, Shield, FileText, CreditCard, Clock, Gavel, Settings } from 'lucide-react';

interface OrderDetailDialogProps {
  orderId: string;
  companyName?: string;
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

function DetailSection({ icon: Icon, title, children }: { icon: any; title: string; children: React.ReactNode }) {
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

function Field({ label, value }: { label: string; value: any }) {
  const display = value === null || value === undefined || value === '' ? '—' : String(value);
  return (
    <div className="flex justify-between gap-4">
      <span className="text-muted-foreground shrink-0">{label}</span>
      <span className="text-right font-medium break-all">{display}</span>
    </div>
  );
}

const OrderDetailDialog = ({ orderId, companyName }: OrderDetailDialogProps) => {
  const [detail, setDetail] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  const fetchDetails = async () => {
    if (detail) return; // already loaded
    setLoading(true);
    try {
      const [
        orderRes,
        bizRes,
        contactRes,
        addressRes,
        participantsRes,
        agentRes,
        mgmtRes,
        irsRes,
        agreementRes,
        paymentsRes,
        docsRes,
        eventsRes,
      ] = await Promise.all([
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

  return (
    <Dialog open={open} onOpenChange={(v) => { setOpen(v); if (v) fetchDetails(); }}>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className="h-7 w-7 shrink-0" title="View Full Details">
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
              {/* Order Summary */}
              <DetailSection icon={FileText} title="Order Summary">
                <Field label="Order ID" value={detail.order?.id} />
                <Field label="Status" value={detail.order?.status} />
                <Field label="Entity Type" value={detail.order?.entity_type} />
                <Field label="State" value={detail.order?.state} />
                <Field label="Package" value={detail.order?.package} />
                <Field label="Filing Speed" value={detail.order?.filing_speed} />
                <Field label="EIN Service" value={detail.order?.ein_service ? 'Yes' : 'No'} />
                <Field label="Total Amount" value={detail.order?.total_amount != null ? `$${Number(detail.order.total_amount).toFixed(2)}` : null} />
                <Field label="State Fee" value={detail.order?.state_fee != null ? `$${Number(detail.order.state_fee).toFixed(2)}` : null} />
                <Field label="Created" value={detail.order?.created_at ? new Date(detail.order.created_at).toLocaleString() : null} />
              </DetailSection>

              <Separator />

              {/* Business Information */}
              {detail.businessInfo && (
                <DetailSection icon={Building2} title="Business Information">
                  <Field label="Company Name" value={detail.businessInfo.company_name} />
                  <Field label="Alternate Name" value={detail.businessInfo.alternate_company_name} />
                  <Field label="Business Purpose" value={detail.businessInfo.business_purpose} />
                  <Field label="Description" value={detail.businessInfo.business_description} />
                  <Field label="Organizer Type" value={detail.businessInfo.organizer_type} />
                  <Field label="Delayed Filing" value={detail.businessInfo.delayed_filing ? 'Yes' : 'No'} />
                </DetailSection>
              )}

              {/* Contact Information */}
              {detail.contactInfo && (
                <DetailSection icon={User} title="Contact Information">
                  <Field label="First Name" value={detail.contactInfo.first_name} />
                  <Field label="Last Name" value={detail.contactInfo.last_name} />
                  <Field label="Email" value={detail.contactInfo.email} />
                  <Field label="Phone" value={detail.contactInfo.phone} />
                </DetailSection>
              )}

              {/* Addresses */}
              {detail.addresses.length > 0 && (
                <DetailSection icon={MapPin} title={`Addresses (${detail.addresses.length})`}>
                  {detail.addresses.map((addr, i) => (
                    <div key={addr.id} className={i > 0 ? 'pt-2 border-t border-border mt-2' : ''}>
                      <Field label="Type" value={addr.type} />
                      <Field label="Address" value={[addr.address1, addr.address2].filter(Boolean).join(', ') || null} />
                      <Field label="City / State / ZIP" value={[addr.city, addr.state, addr.zip].filter(Boolean).join(', ') || null} />
                      <Field label="Country" value={addr.country} />
                    </div>
                  ))}
                </DetailSection>
              )}

              {/* Participants / Members */}
              {detail.participants.length > 0 && (
                <DetailSection icon={Users} title={`Members / Officers (${detail.participants.length})`}>
                  {detail.participants.map((p, i) => (
                    <div key={p.id} className={i > 0 ? 'pt-2 border-t border-border mt-2' : ''}>
                      <Field label="Name" value={[p.first_name, p.last_name].filter(Boolean).join(' ') || null} />
                      <Field label="Role" value={p.role} />
                      <Field label="Title" value={p.title} />
                      <Field label="Ownership %" value={p.ownership_percent != null ? `${p.ownership_percent}%` : null} />
                      <Field label="Auth. Signer" value={p.authorized_signer ? 'Yes' : 'No'} />
                      <Field label="Address" value={p.address} />
                    </div>
                  ))}
                </DetailSection>
              )}

              {/* Registered Agent */}
              {detail.registeredAgent && (
                <DetailSection icon={Shield} title="Registered Agent">
                  <Field label="Type" value={detail.registeredAgent.agent_type} />
                  <Field label="Name" value={detail.registeredAgent.name} />
                  <Field label="Address" value={detail.registeredAgent.address} />
                </DetailSection>
              )}

              {/* Company Management */}
              {detail.companyManagement && (
                <DetailSection icon={Settings} title="Company Management">
                  <Field label="Management Type" value={detail.companyManagement.management_type} />
                </DetailSection>
              )}

              {/* IRS Responsible Party */}
              {detail.irsParty && (
                <DetailSection icon={Gavel} title="IRS Responsible Party">
                  <Field label="First Name" value={detail.irsParty.first_name} />
                  <Field label="Last Name" value={detail.irsParty.last_name} />
                  <Field label="Title" value={detail.irsParty.title} />
                  <Field label="Phone" value={detail.irsParty.phone} />
                  <Field label="SSN" value={detail.irsParty.ssn_encrypted ? '●●●-●●-●●●● (encrypted)' : null} />
                </DetailSection>
              )}

              {/* Agreements */}
              {detail.agreements && (
                <DetailSection icon={FileText} title="Agreements">
                  <Field label="Terms Accepted" value={detail.agreements.terms_accepted ? 'Yes' : 'No'} />
                  <Field label="Privacy Accepted" value={detail.agreements.privacy_accepted ? 'Yes' : 'No'} />
                  <Field label="IP Address" value={detail.agreements.ip_address} />
                  <Field label="Timestamp" value={detail.agreements.timestamp ? new Date(detail.agreements.timestamp).toLocaleString() : null} />
                </DetailSection>
              )}

              {/* Payments */}
              {detail.payments.length > 0 && (
                <DetailSection icon={CreditCard} title={`Payments (${detail.payments.length})`}>
                  {detail.payments.map((p, i) => (
                    <div key={p.id} className={i > 0 ? 'pt-2 border-t border-border mt-2' : ''}>
                      <Field label="Amount" value={p.amount != null ? `$${Number(p.amount).toFixed(2)}` : null} />
                      <Field label="Status" value={p.status} />
                      <Field label="Stripe ID" value={p.stripe_payment_id} />
                      <Field label="Date" value={p.created_at ? new Date(p.created_at).toLocaleString() : null} />
                    </div>
                  ))}
                </DetailSection>
              )}

              {/* Documents */}
              {detail.documents.length > 0 && (
                <DetailSection icon={FileText} title={`Documents (${detail.documents.length})`}>
                  {detail.documents.map((d, i) => (
                    <div key={d.id} className={i > 0 ? 'pt-2 border-t border-border mt-2' : ''}>
                      <Field label="Type" value={d.document_type} />
                      <div className="flex justify-between gap-4">
                        <span className="text-muted-foreground">File</span>
                        <a href={d.file_url} target="_blank" rel="noopener noreferrer" className="text-primary underline text-right text-xs">
                          View / Download
                        </a>
                      </div>
                      <Field label="Uploaded" value={d.uploaded_at ? new Date(d.uploaded_at).toLocaleString() : null} />
                    </div>
                  ))}
                </DetailSection>
              )}

              {/* Event Timeline */}
              {detail.events.length > 0 && (
                <DetailSection icon={Clock} title={`Event Log (${detail.events.length})`}>
                  {detail.events.map((e, i) => (
                    <div key={e.id} className={i > 0 ? 'pt-2 border-t border-border mt-2' : ''}>
                      <Field label="Event" value={e.event_type} />
                      <Field label="Actor" value={e.actor} />
                      <Field label="Date" value={e.created_at ? new Date(e.created_at).toLocaleString() : null} />
                      {e.metadata && Object.keys(e.metadata).length > 0 && (
                        <Field label="Details" value={JSON.stringify(e.metadata)} />
                      )}
                    </div>
                  ))}
                </DetailSection>
              )}
            </div>
          ) : null}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailDialog;
