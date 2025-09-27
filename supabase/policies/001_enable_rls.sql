-- Enable Row Level Security (RLS) on all user-owned tables
-- This ensures that users can only access their own data

-- Core user tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE businesses ENABLE ROW LEVEL SECURITY;
ALTER TABLE customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE items ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE payments ENABLE ROW LEVEL SECURITY;

-- Views (if they need RLS)
-- Note: Views inherit RLS from their underlying tables
-- No need to enable RLS on views directly

-- Comments on RLS strategy:
-- 1. All user-owned tables have RLS enabled
-- 2. Policies ensure users can only access data where user_id = auth.uid()
-- 3. Guest users (no auth.uid()) cannot access any user data
-- 4. No shared reads for user data - all data is user-specific
-- 5. Templates/metadata tables (if any) will have separate policies
