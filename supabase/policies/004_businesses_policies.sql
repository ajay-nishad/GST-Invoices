-- RLS Policies for businesses table
-- Users can only access their own business data

-- Policy: Users can view their own businesses
CREATE POLICY "businesses_select_own" ON businesses
    FOR SELECT 
    USING (auth.uid() = user_id);

-- Policy: Users can create businesses for themselves
CREATE POLICY "businesses_insert_own" ON businesses
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own businesses
CREATE POLICY "businesses_update_own" ON businesses
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own businesses (soft delete)
CREATE POLICY "businesses_delete_own" ON businesses
    FOR DELETE 
    USING (auth.uid() = user_id);

-- Comments:
-- - Users can only access businesses they own
-- - Business creation is restricted to own user_id
-- - Updates are limited to own businesses
-- - Deletes are allowed for business removal
-- - No shared access to business data
-- - Multiple businesses per user are supported
