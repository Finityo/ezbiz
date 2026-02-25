
-- Delete the user from auth.users (this will cascade to profiles/roles via trigger cleanup)
DELETE FROM auth.users WHERE id = '4dc88e42-7db4-47e4-a7af-cd769a1dff77';
