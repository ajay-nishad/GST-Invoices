-- Sample data for testing and development
-- Note: This should only be run in development environments

-- Sample business types
INSERT INTO businesses (id, user_id, business_name, business_type, gst_number, pan_number, business_address, business_city, business_state, business_pincode, contact_phone, contact_email, is_primary, is_active)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'ABC Trading Co.', 'sole_proprietorship', '29ABCDE1234F1Z5', 'ABCDE1234F', '123 Main Street', 'Mumbai', 'Maharashtra', '400001', '+91-9876543210', 'contact@abctrading.com', true, true),
    ('550e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', 'XYZ Services Pvt Ltd', 'private_limited', '07FGHIJ5678K1L2', 'FGHIJ5678K', '456 Business Park', 'Delhi', 'Delhi', '110001', '+91-9876543211', 'info@xyzservices.com', false, true);

-- Sample customers
INSERT INTO customers (id, user_id, business_id, customer_name, customer_type, email, phone, gst_number, billing_address, billing_city, billing_state, billing_pincode, is_active)
VALUES 
    ('650e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'John Doe', 'individual', 'john.doe@email.com', '+91-9876543212', NULL, '789 Customer Lane', 'Mumbai', 'Maharashtra', '400002', true),
    ('650e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'Tech Solutions Inc', 'business', 'billing@techsolutions.com', '+91-9876543213', '19MNOPQ9012R3S4', '321 Corporate Plaza', 'Bangalore', 'Karnataka', '560001', true),
    ('650e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', 'Jane Smith', 'individual', 'jane.smith@email.com', '+91-9876543214', NULL, '654 Personal Street', 'Delhi', 'Delhi', '110002', true);

-- Sample items
INSERT INTO items (id, user_id, business_id, item_name, item_code, description, unit, hsn_code, sac_code, tax_rate, cgst_rate, sgst_rate, selling_price, stock_quantity, is_service, is_active)
VALUES 
    ('750e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'Laptop Computer', 'LAPTOP001', 'High-performance laptop for business use', 'piece', '8471', NULL, 18.00, 9.00, 9.00, 50000.00, 10, false, true),
    ('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'Office Chair', 'CHAIR001', 'Ergonomic office chair', 'piece', '9401', NULL, 18.00, 9.00, 9.00, 15000.00, 25, false, true),
    ('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', 'Consulting Services', 'CONS001', 'Business consulting and advisory services', 'hour', NULL, '9983', 18.00, 9.00, 9.00, 2000.00, 0, true, true),
    ('750e8400-e29b-41d4-a716-446655440004', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', 'Software Development', 'SOFT001', 'Custom software development services', 'hour', NULL, '9983', 18.00, 9.00, 9.00, 3000.00, 0, true, true);

-- Sample invoices
INSERT INTO invoices (id, user_id, business_id, customer_id, invoice_number, invoice_date, due_date, status, subtotal, tax_amount, total_amount, paid_amount, currency, notes, is_active)
VALUES 
    ('850e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440001', 'ABC-2024-0001', '2024-01-15', '2024-02-14', 'paid', 65000.00, 11700.00, 76700.00, 76700.00, 'INR', 'Thank you for your business!', true),
    ('850e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', '650e8400-e29b-41d4-a716-446655440002', 'ABC-2024-0002', '2024-01-20', '2024-02-19', 'sent', 30000.00, 5400.00, 35400.00, 0.00, 'INR', 'Payment due within 30 days', true),
    ('850e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', '650e8400-e29b-41d4-a716-446655440003', 'XYZ-2024-0001', '2024-01-25', '2024-02-24', 'draft', 10000.00, 1800.00, 11800.00, 0.00, 'INR', 'Draft invoice for review', true);

-- Sample invoice items
INSERT INTO invoice_items (id, invoice_id, item_id, item_name, item_code, description, unit, hsn_code, quantity, unit_price, taxable_amount, tax_rate, cgst_rate, sgst_rate, cgst_amount, sgst_amount, total_amount, is_active)
VALUES 
    -- Invoice 1 items
    ('950e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440001', 'Laptop Computer', 'LAPTOP001', 'High-performance laptop for business use', 'piece', '8471', 1, 50000.00, 50000.00, 18.00, 9.00, 9.00, 4500.00, 4500.00, 59000.00, true),
    ('950e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440001', '750e8400-e29b-41d4-a716-446655440002', 'Office Chair', 'CHAIR001', 'Ergonomic office chair', 'piece', '9401', 1, 15000.00, 15000.00, 18.00, 9.00, 9.00, 1350.00, 1350.00, 17700.00, true),
    
    -- Invoice 2 items
    ('950e8400-e29b-41d4-a716-446655440003', '850e8400-e29b-41d4-a716-446655440002', '750e8400-e29b-41d4-a716-446655440002', 'Office Chair', 'CHAIR001', 'Ergonomic office chair', 'piece', '9401', 2, 15000.00, 30000.00, 18.00, 9.00, 9.00, 2700.00, 2700.00, 35400.00, true),
    
    -- Invoice 3 items
    ('950e8400-e29b-41d4-a716-446655440004', '850e8400-e29b-41d4-a716-446655440003', '750e8400-e29b-41d4-a716-446655440003', 'Consulting Services', 'CONS001', 'Business consulting and advisory services', 'hour', NULL, 5, 2000.00, 10000.00, 18.00, 9.00, 9.00, 900.00, 900.00, 11800.00, true);

-- Sample payments
INSERT INTO payments (id, invoice_id, payment_number, payment_date, amount, payment_method, status, reference_number, notes, is_active)
VALUES 
    ('a50e8400-e29b-41d4-a716-446655440001', '850e8400-e29b-41d4-a716-446655440001', 'ABC-2024-0001-PAY-001', '2024-01-20', 76700.00, 'bank_transfer', 'completed', 'TXN123456789', 'Payment received via bank transfer', true),
    ('a50e8400-e29b-41d4-a716-446655440002', '850e8400-e29b-41d4-a716-446655440002', 'ABC-2024-0002-PAY-001', '2024-01-25', 20000.00, 'upi', 'completed', 'UPI987654321', 'Partial payment via UPI', true);

-- Sample subscription
INSERT INTO subscriptions (id, user_id, plan_name, status, price, currency, billing_cycle, started_at, expires_at, is_active)
VALUES 
    ('b50e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'Professional Plan', 'active', 999.00, 'INR', 'monthly', '2024-01-01', '2024-02-01', true);

-- Update invoice totals (they should be calculated automatically, but let's ensure they're correct)
UPDATE invoices SET 
    subtotal = 65000.00,
    tax_amount = 11700.00,
    total_amount = 76700.00,
    paid_amount = 76700.00
WHERE id = '850e8400-e29b-41d4-a716-446655440001';

UPDATE invoices SET 
    subtotal = 30000.00,
    tax_amount = 5400.00,
    total_amount = 35400.00,
    paid_amount = 20000.00
WHERE id = '850e8400-e29b-41d4-a716-446655440002';

UPDATE invoices SET 
    subtotal = 10000.00,
    tax_amount = 1800.00,
    total_amount = 11800.00,
    paid_amount = 0.00
WHERE id = '850e8400-e29b-41d4-a716-446655440003';
