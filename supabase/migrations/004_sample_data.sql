-- Sample data for testing and development
-- Note: This should only be run in development environments

-- Sample user (for testing purposes)
INSERT INTO auth.users (id, email, encrypted_password, email_confirmed_at, created_at, updated_at, raw_app_meta_data, raw_user_meta_data, is_super_admin, role)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440000', 'test@example.com', '$2a$10$dummy.hash.for.testing', NOW(), NOW(), NOW(), '{"provider": "email", "providers": ["email"]}', '{}', false, 'authenticated');

-- Sample user profile
INSERT INTO users (id, email, full_name, phone, address, city, state, pincode, country, is_active)
VALUES 
    ('550e8400-e29b-41d4-a716-446655440000', 'test@example.com', 'Test User', '+91-9876543210', '123 Test Street', 'Mumbai', 'Maharashtra', '400001', 'India', true);

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
    ('750e8400-e29b-41d4-a716-446655440002', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440001', 'Consulting Service', 'CONS001', 'Business consulting services', 'hour', NULL, '9983', 18.00, 9.00, 9.00, 2000.00, 0, true, true),
    ('750e8400-e29b-41d4-a716-446655440003', '550e8400-e29b-41d4-a716-446655440000', '550e8400-e29b-41d4-a716-446655440002', 'Software License', 'SOFT001', 'Annual software license', 'license', '8523', NULL, 18.00, 9.00, 9.00, 15000.00, 100, false, true);

-- Sample subscription
INSERT INTO subscriptions (id, user_id, plan_name, status, price, currency, billing_cycle, started_at, expires_at, razorpay_subscription_id, razorpay_plan_id, is_active)
VALUES 
    ('850e8400-e29b-41d4-a716-446655440001', '550e8400-e29b-41d4-a716-446655440000', 'premium', 'active', 500.00, 'INR', 'monthly', NOW(), NOW() + INTERVAL '30 days', 'sub_test123', 'plan_test123', true);
