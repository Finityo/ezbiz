UPDATE public.orders
SET status='payment_complete',
    account_manager_sent_at=NULL,
    account_manager_sent_to=NULL,
    account_manager_email_status=NULL,
    account_manager_email_message_id=NULL,
    updated_at=now()
WHERE id='bd237e58-3c7a-426d-8adb-7be9f6d5bc89';