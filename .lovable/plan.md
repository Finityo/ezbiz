

## Plan: Clean Up Users and Add Test User

### Current State
6 users exist in the database. The admin account is:
- **Christian Talavera** (user_id: `5fae2e46-4de1-4358-a50e-fa64ff3ac067`, role: admin)

Users to remove (5 total):
1. `eaf2f122` - Christian Talavera (duplicate, no role)
2. `37ecc443` - Mel Hurtado (user)
3. `7a0d84dc` - John Doe (user)
4. `a0dc0918` - unnamed (user)
5. `3318af42` - christian talavera (duplicate, user role)

### What Needs to Happen

**Step 1 (Manual - Supabase Dashboard):**
You must delete the 5 non-admin users from the Supabase Auth dashboard, since we cannot modify `auth.users` programmatically. Deleting them there will cascade-delete their `profiles` and `user_roles` rows (foreign keys with `ON DELETE CASCADE`).

Go to: [Supabase Auth Users](https://supabase.com/dashboard/project/fpclrbfqlyghdyitisox/auth/users)

Delete these 5 users:
- `eaf2f122-676b-4551-a8de-29c1e28c3b84`
- `37ecc443-f31d-4ec5-a93f-7f15abb5df3a`
- `7a0d84dc-4325-45d0-8cb2-3bfcb57960c3`
- `a0dc0918-0045-4fab-b6ec-e9e2648d27fa`
- `3318af42-2dfd-4648-800a-9cef0afd2c4e`

**Step 2 (Manual - Supabase Dashboard):**
Create a test user from the same Auth dashboard page using the "Add user" button. Use something like:
- Email: `testuser@ezbiz.com`
- Password: a secure test password

The `handle_new_user` trigger will automatically create a profile and assign the `user` role.

### Why This Can't Be Automated
The `auth.users` table is in a Supabase-reserved schema. Modifying it directly is prohibited and could cause service issues. User management must go through the Supabase dashboard or Auth API.

### Technical Notes
- The `profiles` table does NOT have a foreign key to `auth.users`, so those rows will NOT auto-delete. If cascade doesn't apply, I will clean up orphaned `profiles` and `user_roles` rows via SQL after you delete the auth users.
- The `handle_new_user` trigger will auto-create profile and role entries for the new test user.

