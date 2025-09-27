-- Guest Access Policies
-- Guest users (no auth.uid()) have no database write access
-- They can only use ephemeral in-memory or local state

-- No policies are created for guest access because:
-- 1. All tables require auth.uid() = user_id for access
-- 2. Guest users have auth.uid() = NULL
-- 3. NULL = user_id will never be true
-- 4. This effectively blocks all database access for guests

-- Guest user behavior:
-- - Cannot read any user data
-- - Cannot write to any tables
-- - Cannot access views or functions
-- - Can only use client-side state (localStorage, sessionStorage, memory)
-- - Can access public pages and forms (but data is not persisted)

-- If you need guest access to specific data, create separate tables:
-- Example: public_templates, public_metadata, etc.
-- These would have different RLS policies allowing public read access

-- Comments:
-- - Guest users are completely isolated from user data
-- - No database persistence for guest users
-- - All user data requires authentication
-- - Guest state must be handled client-side
-- - Public data (if any) should be in separate tables
