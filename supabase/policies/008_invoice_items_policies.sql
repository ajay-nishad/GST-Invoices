-- RLS Policies for invoice_items table
-- Users can only access invoice items for their own invoices

-- Policy: Users can view invoice items for their own invoices
CREATE POLICY "invoice_items_select_own" ON invoice_items
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM invoices 
            WHERE invoices.id = invoice_items.invoice_id 
            AND invoices.user_id = auth.uid()
        )
    );

-- Policy: Users can create invoice items for their own invoices
CREATE POLICY "invoice_items_insert_own" ON invoice_items
    FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM invoices 
            WHERE invoices.id = invoice_items.invoice_id 
            AND invoices.user_id = auth.uid()
        )
    );

-- Policy: Users can update invoice items for their own invoices
CREATE POLICY "invoice_items_update_own" ON invoice_items
    FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM invoices 
            WHERE invoices.id = invoice_items.invoice_id 
            AND invoices.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM invoices 
            WHERE invoices.id = invoice_items.invoice_id 
            AND invoices.user_id = auth.uid()
        )
    );

-- Policy: Users can delete invoice items for their own invoices
CREATE POLICY "invoice_items_delete_own" ON invoice_items
    FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM invoices 
            WHERE invoices.id = invoice_items.invoice_id 
            AND invoices.user_id = auth.uid()
        )
    );

-- Comments:
-- - Access is controlled through the parent invoice
-- - Users can only access items for invoices they own
-- - Invoice item creation is restricted to own invoices
-- - Updates are limited to own invoice items
-- - Deletes are allowed for invoice item removal
-- - No direct access to invoice items without invoice ownership
