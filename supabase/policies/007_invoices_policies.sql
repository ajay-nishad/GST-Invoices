-- RLS Policies for invoices table
-- Users can only access their own invoice data

-- Policy: Users can view their own invoices
CREATE POLICY "invoices_select_own" ON invoices
    FOR SELECT 
    USING (auth.uid() = user_id);

-- Policy: Users can create invoices for themselves
CREATE POLICY "invoices_insert_own" ON invoices
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own invoices
CREATE POLICY "invoices_update_own" ON invoices
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own invoices (soft delete)
CREATE POLICY "invoices_delete_own" ON invoices
    FOR DELETE 
    USING (auth.uid() = user_id);

-- Comments:
-- - Users can only access invoices they own
-- - Invoice creation is restricted to own user_id
-- - Updates are limited to own invoices
-- - Deletes are allowed for invoice removal
-- - No shared access to invoice data
-- - Invoices are linked to user's businesses and customers
-- - Invoice numbers are unique per business
