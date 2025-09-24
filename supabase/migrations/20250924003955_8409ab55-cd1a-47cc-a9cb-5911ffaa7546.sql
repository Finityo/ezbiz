-- Fix the security vulnerability in consultation_requests table
-- Remove the ability for users to view anonymous consultation requests

-- Drop the existing vulnerable SELECT policy
DROP POLICY "Users can view their own consultation requests" ON public.consultation_requests;

-- Create a new secure SELECT policy
-- Only allows users to view their own consultation requests (user_id matches auth.uid())
-- Anonymous requests (user_id IS NULL) are no longer visible to regular users
CREATE POLICY "Users can view only their own consultation requests" 
ON public.consultation_requests 
FOR SELECT 
USING (auth.uid() = user_id);

-- Optional: Create a separate policy for admin access to all consultation requests
-- This would need to be implemented with a proper admin role system
-- For now, direct database access would be needed for viewing anonymous requests