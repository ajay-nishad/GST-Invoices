-- RLS Policies for payments table
-- Users can only access payments for their own invoices

-- Policy: Users can view payments for their own invoices
CREATE POLICY "payments_select_own" ON payments
    FOR SELECT 
    USING (
        EXISTS (
            SELECT 1 FROM invoices 
            WHERE invoices.id = payments.invoice_id 
            AND invoices.user_id = auth.uid()
        )
    );

-- Policy: Users can create payments for their own invoices
CREATE POLICY "payments_insert_own" ON payments
    FOR INSERT 
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM invoices 
            WHERE invoices.id = payments.invoice_id 
            AND invoices.user_id = auth.uid()
        )
    );

-- Policy: Users can update payments for their own invoices
CREATE POLICY "payments_update_own" ON payments
    FOR UPDATE 
    USING (
        EXISTS (
            SELECT 1 FROM invoices 
            WHERE invoices.id = payments.invoice_id 
            AND invoices.user_id = auth.uid()
        )
    )
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM invoices 
            WHERE invoices.id = payments.invoice_id 
            AND invoices.user_id = auth.uid()
        )
    );

-- Policy: Users can delete payments for their own invoices
CREATE POLICY "payments_delete_own" ON payments
    FOR DELETE 
    USING (
        EXISTS (
            SELECT 1 FROM invoices 
            WHERE invoices.id = payments.invoice_id 
            AND invoices.user_id = auth.uid()
        )
    );

-- Comments:
-- - Access is controlled through the parent invoice
-- - Users can only access payments for invoices they own
-- - Payment creation is restricted to own invoices
-- - Updates are limited to own payments
-- - Deletes are allowed for payment removal
-- - No direct access to payments without invoice ownership
-- - Razorpay payment data is user-specific
