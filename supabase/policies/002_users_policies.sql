-- RLS Policies for users table
-- Users can only access their own profile data

-- Policy: Users can view their own profile
CREATE POLICY "users_select_own" ON users
    FOR SELECT 
    USING (auth.uid() = id);

-- Policy: Users can insert their own profile (during signup)
CREATE POLICY "users_insert_own" ON users
    FOR INSERT 
    WITH CHECK (auth.uid() = id);

-- Policy: Users can update their own profile
CREATE POLICY "users_update_own" ON users
    FOR UPDATE 
    USING (auth.uid() = id)
    WITH CHECK (auth.uid() = id);

-- Policy: Users can delete their own profile (soft delete via is_active)
-- Note: Hard delete is not allowed for data integrity
-- Users should use soft delete by setting is_active = false

-- Comments:
-- - Users can only access their own user record
-- - No shared access to user profiles
-- - Profile creation happens during authentication flow
-- - Updates are restricted to own profile only
-- - No delete policy - use soft delete instead
