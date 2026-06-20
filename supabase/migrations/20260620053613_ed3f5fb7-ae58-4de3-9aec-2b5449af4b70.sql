-- Mirror WaiverReviewsTab.updateStatus(approval) for the QA test order ONLY.
UPDATE business_applications
SET status = 'waiver_approved_payment_required',
    application_data = application_data
      || jsonb_build_object(
          'waivedStateFee', true,
          'originalStateFee', 100,
          'effectiveStateFee', 0,
          'waiverReviewedAt', now(),
          'waiverReviewStatus', 'waiver_approved_payment_required'
        )
WHERE id = '507e2338-952c-4b3e-b4ed-8d4a455f9c66';

UPDATE orders
SET state_fee = 0, status = 'pending_payment'
WHERE id = '58619089-dca0-4fc1-8094-36875b3c0656';

INSERT INTO order_events (order_id, event_type, actor, metadata)
VALUES (
  '58619089-dca0-4fc1-8094-36875b3c0656',
  'waiver_waiver_approved_payment_required',
  'admin',
  jsonb_build_object(
    'application_id', '507e2338-952c-4b3e-b4ed-8d4a455f9c66',
    'note', 'QA simulated admin approval',
    'originalStateFee', 100,
    'effectiveStateFee', 0,
    'reviewedAt', now(),
    'qa_test_record', true
  )
);