import { supabase } from '@/integrations/supabase/client';

interface SendStatusEmailParams {
  orderId: string;
  customerEmail: string | null;
  businessName: string | null;
  entityType: string | null;
  state: string | null;
  newStatus: string;
}

const STATUS_SUBJECTS: Record<string, string> = {
  draft: 'Your order has been received.',
  processing: 'Your formation has entered processing.',
  payment_complete: 'Payment confirmed. We are preparing your filing.',
  submitted: 'Your formation has been submitted to the state.',
  state_processing: 'Your filing is being processed by the state.',
  filed: 'Your business has officially been filed.',
  completed: 'Your formation is complete. Documents are now available.',
};

export const sendOrderStatusEmail = async ({
  orderId,
  customerEmail,
  businessName,
  entityType,
  state,
  newStatus,
}: SendStatusEmailParams): Promise<void> => {
  // Only send for statuses that have email messages
  if (!STATUS_SUBJECTS[newStatus] || !customerEmail) return;

  try {
    await supabase.functions.invoke('send-order-email', {
      body: {
        to: customerEmail,
        orderId,
        businessName: businessName || 'Your Business',
        entityType: entityType || 'LLC',
        state: state || '',
        status: newStatus,
      },
    });
  } catch (error) {
    // Log but don't block status update if email fails
    console.error('Failed to send status email:', error);
  }
};
