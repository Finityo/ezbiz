import { supabase } from '@/integrations/supabase/client';

interface SendStatusEmailParams {
  orderId: string;
  customerEmail: string | null;
  businessName: string | null;
  entityType: string | null;
  state: string | null;
  newStatus: string;
  customerName?: string | null;
}

const SUPPORTED_STATUSES = new Set([
  'draft',
  'processing',
  'payment_complete',
  'submitted',
  'state_processing',
  'filed',
  'completed',
]);

export const sendOrderStatusEmail = async ({
  orderId,
  customerEmail,
  businessName,
  entityType,
  state,
  newStatus,
  customerName,
}: SendStatusEmailParams): Promise<void> => {
  if (!customerEmail || !SUPPORTED_STATUSES.has(newStatus)) return;

  try {
    await supabase.functions.invoke('send-transactional-email', {
      body: {
        templateName: 'order-status-update',
        recipientEmail: customerEmail,
        idempotencyKey: `order-status-${orderId}-${newStatus}`,
        templateData: {
          name: customerName || undefined,
          businessName: businessName || 'Your Business',
          entityType: entityType || 'LLC',
          state: state || '',
          orderId,
          status: newStatus,
        },
      },
    });
  } catch (error) {
    // Log but don't block status update if email fails
    console.error('Failed to send status email:', error);
  }
};
