-- RLS Policies for Functions
-- Functions that access user data must respect RLS policies

-- Note: Functions inherit RLS from the tables they access
-- The following functions automatically respect user data isolation:
-- - generate_invoice_number(business_uuid)
-- - generate_payment_number(invoice_uuid)
-- - calculate_invoice_totals(invoice_uuid)
-- - update_invoice_totals(invoice_uuid)
-- - get_dashboard_stats(user_uuid)

-- Function security considerations:
-- 1. Functions use the security context of the calling user
-- 2. RLS policies are applied to all table access within functions
-- 3. Functions cannot bypass RLS policies
-- 4. User-specific functions require user_uuid parameter

-- Example function security:
-- get_dashboard_stats(user_uuid) function:
-- - Only returns stats for the specified user_uuid
-- - All underlying queries respect RLS policies
-- - Cannot access other users' data even if called with different user_uuid

-- Comments:
-- - Functions automatically respect RLS policies
-- - No additional policies needed for functions
-- - Functions use caller's security context
-- - User-specific functions are secure by design
-- - No function can bypass user data isolation
