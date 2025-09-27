-- Create useful views for common queries

-- Invoice summary view
CREATE VIEW invoice_summary AS
SELECT 
    i.id,
    i.invoice_number,
    i.invoice_date,
    i.due_date,
    i.status,
    i.total_amount,
    i.paid_amount,
    i.balance_amount,
    i.currency,
    c.customer_name,
    c.email as customer_email,
    c.phone as customer_phone,
    b.business_name,
    b.gst_number as business_gst,
    u.full_name as user_name,
    u.email as user_email,
    CASE 
        WHEN i.due_date < CURRENT_DATE AND i.status != 'paid' THEN true
        ELSE false
    END as is_overdue,
    CASE 
        WHEN i.balance_amount <= 0 THEN 'paid'
        WHEN i.paid_amount > 0 THEN 'partially_paid'
        ELSE 'unpaid'
    END as payment_status
FROM invoices i
JOIN customers c ON i.customer_id = c.id
JOIN businesses b ON i.business_id = b.id
JOIN users u ON i.user_id = u.id
WHERE i.is_active = true;

-- Customer summary view
CREATE VIEW customer_summary AS
SELECT 
    c.id,
    c.customer_name,
    c.customer_type,
    c.email,
    c.phone,
    c.gst_number,
    c.billing_city,
    c.billing_state,
    b.business_name,
    u.full_name as user_name,
    COUNT(i.id) as total_invoices,
    COALESCE(SUM(i.total_amount), 0) as total_amount,
    COALESCE(SUM(i.paid_amount), 0) as total_paid,
    COALESCE(SUM(i.balance_amount), 0) as total_balance,
    MAX(i.invoice_date) as last_invoice_date
FROM customers c
JOIN users u ON c.user_id = u.id
LEFT JOIN businesses b ON c.business_id = b.id
LEFT JOIN invoices i ON c.id = i.customer_id AND i.is_active = true
WHERE c.is_active = true
GROUP BY c.id, c.customer_name, c.customer_type, c.email, c.phone, 
         c.gst_number, c.billing_city, c.billing_state, b.business_name, u.full_name;

-- Business summary view
CREATE VIEW business_summary AS
SELECT 
    b.id,
    b.business_name,
    b.business_type,
    b.gst_number,
    b.business_city,
    b.business_state,
    u.full_name as user_name,
    u.email as user_email,
    COUNT(DISTINCT c.id) as total_customers,
    COUNT(DISTINCT i.id) as total_invoices,
    COUNT(DISTINCT it.id) as total_items,
    COALESCE(SUM(i.total_amount), 0) as total_revenue,
    COALESCE(SUM(i.paid_amount), 0) as total_collected,
    COALESCE(SUM(i.balance_amount), 0) as total_outstanding
FROM businesses b
JOIN users u ON b.user_id = u.id
LEFT JOIN customers c ON b.id = c.business_id AND c.is_active = true
LEFT JOIN invoices i ON b.id = i.business_id AND i.is_active = true
LEFT JOIN items it ON b.id = it.business_id AND it.is_active = true
WHERE b.is_active = true
GROUP BY b.id, b.business_name, b.business_type, b.gst_number, 
         b.business_city, b.business_state, u.full_name, u.email;

-- Monthly revenue view
CREATE VIEW monthly_revenue AS
SELECT 
    u.id as user_id,
    u.full_name as user_name,
    DATE_TRUNC('month', i.invoice_date) as month,
    COUNT(i.id) as invoice_count,
    SUM(i.total_amount) as total_revenue,
    SUM(i.paid_amount) as collected_amount,
    SUM(i.balance_amount) as outstanding_amount
FROM users u
JOIN invoices i ON u.id = i.user_id
WHERE i.is_active = true
GROUP BY u.id, u.full_name, DATE_TRUNC('month', i.invoice_date)
ORDER BY u.id, month DESC;

-- Create function to generate next invoice number
CREATE OR REPLACE FUNCTION generate_invoice_number(business_uuid UUID)
RETURNS TEXT AS $$
DECLARE
    next_number INTEGER;
    business_prefix TEXT;
    current_year TEXT;
BEGIN
    -- Get current year
    current_year := EXTRACT(YEAR FROM CURRENT_DATE)::TEXT;
    
    -- Get business prefix (first 3 letters of business name or 'INV')
    SELECT COALESCE(UPPER(LEFT(business_name, 3)), 'INV')
    INTO business_prefix
    FROM businesses
    WHERE id = business_uuid;
    
    -- Get the next invoice number for this business and year
    SELECT COALESCE(MAX(
        CASE 
            WHEN invoice_number ~ ('^' || business_prefix || '-' || current_year || '-[0-9]+$')
            THEN CAST(SUBSTRING(invoice_number FROM '([0-9]+)$') AS INTEGER)
            ELSE 0
        END
    ), 0) + 1
    INTO next_number
    FROM invoices
    WHERE business_id = business_uuid
    AND is_active = true;
    
    -- Return formatted invoice number
    RETURN business_prefix || '-' || current_year || '-' || LPAD(next_number::TEXT, 4, '0');
END;
$$ LANGUAGE plpgsql;

-- Create function to generate next payment number
CREATE OR REPLACE FUNCTION generate_payment_number(invoice_uuid UUID)
RETURNS TEXT AS $$
DECLARE
    next_number INTEGER;
    invoice_prefix TEXT;
BEGIN
    -- Get invoice prefix from invoice number
    SELECT invoice_number
    INTO invoice_prefix
    FROM invoices
    WHERE id = invoice_uuid;
    
    -- Get the next payment number for this invoice
    SELECT COALESCE(MAX(
        CASE 
            WHEN payment_number ~ ('^' || invoice_prefix || '-PAY-[0-9]+$')
            THEN CAST(SUBSTRING(payment_number FROM '([0-9]+)$') AS INTEGER)
            ELSE 0
        END
    ), 0) + 1
    INTO next_number
    FROM payments
    WHERE invoice_id = invoice_uuid
    AND is_active = true;
    
    -- Return formatted payment number
    RETURN invoice_prefix || '-PAY-' || LPAD(next_number::TEXT, 3, '0');
END;
$$ LANGUAGE plpgsql;

-- Create function to calculate invoice totals
CREATE OR REPLACE FUNCTION calculate_invoice_totals(invoice_uuid UUID)
RETURNS TABLE(
    subtotal DECIMAL(12,2),
    tax_amount DECIMAL(12,2),
    total_amount DECIMAL(12,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        COALESCE(SUM(ii.taxable_amount), 0) as subtotal,
        COALESCE(SUM(ii.cgst_amount + ii.sgst_amount + ii.igst_amount + ii.cess_amount), 0) as tax_amount,
        COALESCE(SUM(ii.total_amount), 0) as total_amount
    FROM invoice_items ii
    WHERE ii.invoice_id = invoice_uuid
    AND ii.is_active = true;
END;
$$ LANGUAGE plpgsql;

-- Create function to update invoice totals
CREATE OR REPLACE FUNCTION update_invoice_totals(invoice_uuid UUID)
RETURNS VOID AS $$
DECLARE
    calc_totals RECORD;
BEGIN
    -- Calculate totals
    SELECT * INTO calc_totals FROM calculate_invoice_totals(invoice_uuid);
    
    -- Update invoice with calculated totals
    UPDATE invoices 
    SET 
        subtotal = calc_totals.subtotal,
        tax_amount = calc_totals.tax_amount,
        total_amount = calc_totals.total_amount,
        updated_at = NOW()
    WHERE id = invoice_uuid;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update invoice totals when invoice items change
CREATE OR REPLACE FUNCTION trigger_update_invoice_totals()
RETURNS TRIGGER AS $$
BEGIN
    -- Update totals for the affected invoice
    PERFORM update_invoice_totals(COALESCE(NEW.invoice_id, OLD.invoice_id));
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Create triggers for invoice items
CREATE TRIGGER invoice_items_update_totals
    AFTER INSERT OR UPDATE OR DELETE ON invoice_items
    FOR EACH ROW
    EXECUTE FUNCTION trigger_update_invoice_totals();

-- Create function to get dashboard stats
CREATE OR REPLACE FUNCTION get_dashboard_stats(user_uuid UUID)
RETURNS TABLE(
    total_customers BIGINT,
    total_invoices BIGINT,
    total_items BIGINT,
    total_revenue DECIMAL(12,2),
    total_collected DECIMAL(12,2),
    total_outstanding DECIMAL(12,2),
    overdue_invoices BIGINT,
    this_month_revenue DECIMAL(12,2)
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        (SELECT COUNT(*) FROM customers WHERE user_id = user_uuid AND is_active = true) as total_customers,
        (SELECT COUNT(*) FROM invoices WHERE user_id = user_uuid AND is_active = true) as total_invoices,
        (SELECT COUNT(*) FROM items WHERE user_id = user_uuid AND is_active = true) as total_items,
        (SELECT COALESCE(SUM(total_amount), 0) FROM invoices WHERE user_id = user_uuid AND is_active = true) as total_revenue,
        (SELECT COALESCE(SUM(paid_amount), 0) FROM invoices WHERE user_id = user_uuid AND is_active = true) as total_collected,
        (SELECT COALESCE(SUM(balance_amount), 0) FROM invoices WHERE user_id = user_uuid AND is_active = true) as total_outstanding,
        (SELECT COUNT(*) FROM invoices WHERE user_id = user_uuid AND is_active = true AND due_date < CURRENT_DATE AND status != 'paid') as overdue_invoices,
        (SELECT COALESCE(SUM(total_amount), 0) FROM invoices WHERE user_id = user_uuid AND is_active = true AND DATE_TRUNC('month', invoice_date) = DATE_TRUNC('month', CURRENT_DATE)) as this_month_revenue;
END;
$$ LANGUAGE plpgsql;
