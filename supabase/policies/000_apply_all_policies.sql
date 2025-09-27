-- Master file to apply all RLS policies in correct order
-- Run this file to set up complete RLS security for the application

-- 1. Enable RLS on all tables
\i 001_enable_rls.sql

-- 2. Apply policies for core user tables
\i 002_users_policies.sql
\i 003_subscriptions_policies.sql
\i 004_businesses_policies.sql
\i 005_customers_policies.sql
\i 006_items_policies.sql
\i 007_invoices_policies.sql
\i 008_invoice_items_policies.sql
\i 009_payments_policies.sql

-- 3. Apply policies for views and functions
\i 010_views_policies.sql
\i 011_guest_access.sql
\i 012_functions_policies.sql

-- Verification queries (commented out - uncomment to test)
-- These queries should return empty results for any user

-- Test that users can only see their own data
-- SELECT 'users' as table_name, COUNT(*) as accessible_rows FROM users;
-- SELECT 'subscriptions' as table_name, COUNT(*) as accessible_rows FROM subscriptions;
-- SELECT 'businesses' as table_name, COUNT(*) as accessible_rows FROM businesses;
-- SELECT 'customers' as table_name, COUNT(*) as accessible_rows FROM customers;
-- SELECT 'items' as table_name, COUNT(*) as accessible_rows FROM items;
-- SELECT 'invoices' as table_name, COUNT(*) as accessible_rows FROM invoices;
-- SELECT 'invoice_items' as table_name, COUNT(*) as accessible_rows FROM invoice_items;
-- SELECT 'payments' as table_name, COUNT(*) as accessible_rows FROM payments;

-- Comments:
-- - All policies are applied in the correct order
-- - RLS is enabled on all user-owned tables
-- - Complete data isolation is enforced
-- - Guest users have no database access
-- - Functions and views inherit RLS security
