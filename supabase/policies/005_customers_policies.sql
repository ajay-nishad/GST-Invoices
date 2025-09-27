-- RLS Policies for customers table
-- Users can only access their own customer data

-- Policy: Users can view their own customers
CREATE POLICY "customers_select_own" ON customers
    FOR SELECT 
    USING (auth.uid() = user_id);

-- Policy: Users can create customers for themselves
CREATE POLICY "customers_insert_own" ON customers
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own customers
CREATE POLICY "customers_update_own" ON customers
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own customers (soft delete)
CREATE POLICY "customers_delete_own" ON customers
    FOR DELETE 
    USING (auth.uid() = user_id);

-- Comments:
-- - Users can only access customers they own
-- - Customer creation is restricted to own user_id
-- - Updates are limited to own customers
-- - Deletes are allowed for customer removal
-- - No shared access to customer data
-- - Customers can be associated with specific businesses
