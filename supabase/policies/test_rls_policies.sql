-- Test file to verify RLS policies are working correctly
-- Run this after applying all policies to ensure security is working

-- Test 1: Verify RLS is enabled on all tables
SELECT 
    schemaname,
    tablename,
    rowsecurity as rls_enabled
FROM pg_tables 
WHERE schemaname = 'public' 
AND tablename IN (
    'users', 'subscriptions', 'businesses', 'customers', 
    'items', 'invoices', 'invoice_items', 'payments'
)
ORDER BY tablename;

-- Test 2: Check that policies exist for all tables
SELECT 
    schemaname,
    tablename,
    policyname,
    permissive,
    roles,
    cmd,
    qual,
    with_check
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Test 3: Verify user can only access their own data
-- (This should only return data for the authenticated user)
-- Uncomment and run as an authenticated user to test

-- SELECT 'Testing user data access...' as test;
-- SELECT 'users' as table_name, COUNT(*) as accessible_rows FROM users;
-- SELECT 'subscriptions' as table_name, COUNT(*) as accessible_rows FROM subscriptions;
-- SELECT 'businesses' as table_name, COUNT(*) as accessible_rows FROM businesses;
-- SELECT 'customers' as table_name, COUNT(*) as accessible_rows FROM customers;
-- SELECT 'items' as table_name, COUNT(*) as accessible_rows FROM items;
-- SELECT 'invoices' as table_name, COUNT(*) as accessible_rows FROM invoices;
-- SELECT 'invoice_items' as table_name, COUNT(*) as accessible_rows FROM invoice_items;
-- SELECT 'payments' as table_name, COUNT(*) as accessible_rows FROM payments;

-- Test 4: Verify guest users cannot access any data
-- (This should return empty results when run without authentication)
-- Uncomment and run as a guest user to test

-- SELECT 'Testing guest access (should be empty)...' as test;
-- SELECT 'users' as table_name, COUNT(*) as accessible_rows FROM users;
-- SELECT 'subscriptions' as table_name, COUNT(*) as accessible_rows FROM subscriptions;
-- SELECT 'businesses' as table_name, COUNT(*) as accessible_rows FROM businesses;
-- SELECT 'customers' as table_name, COUNT(*) as accessible_rows FROM customers;
-- SELECT 'items' as table_name, COUNT(*) as accessible_rows FROM items;
-- SELECT 'invoices' as table_name, COUNT(*) as accessible_rows FROM invoices;
-- SELECT 'invoice_items' as table_name, COUNT(*) as accessible_rows FROM invoice_items;
-- SELECT 'payments' as table_name, COUNT(*) as accessible_rows FROM payments;

-- Test 5: Verify function security
-- (Functions should only return data for the authenticated user)
-- Uncomment and run as an authenticated user to test

-- SELECT 'Testing function security...' as test;
-- SELECT * FROM get_dashboard_stats(auth.uid());

-- Test 6: Verify view security
-- (Views should only return data for the authenticated user)
-- Uncomment and run as an authenticated user to test

-- SELECT 'Testing view security...' as test;
-- SELECT COUNT(*) as invoice_summary_rows FROM invoice_summary;
-- SELECT COUNT(*) as customer_summary_rows FROM customer_summary;
-- SELECT COUNT(*) as business_summary_rows FROM business_summary;
-- SELECT COUNT(*) as monthly_revenue_rows FROM monthly_revenue;

-- Comments:
-- - Run Test 1 and 2 to verify RLS is enabled and policies exist
-- - Run Test 3 as an authenticated user to verify data access
-- - Run Test 4 as a guest user to verify no data access
-- - Run Test 5 and 6 to verify function and view security
-- - All tests should show proper data isolation
