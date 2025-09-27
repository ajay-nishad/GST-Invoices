-- RLS Policies for subscriptions table
-- Users can only access their own subscription data

-- Policy: Users can view their own subscriptions
CREATE POLICY "subscriptions_select_own" ON subscriptions
    FOR SELECT 
    USING (auth.uid() = user_id);

-- Policy: Users can create subscriptions for themselves
CREATE POLICY "subscriptions_insert_own" ON subscriptions
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own subscriptions
CREATE POLICY "subscriptions_update_own" ON subscriptions
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own subscriptions (soft delete)
CREATE POLICY "subscriptions_delete_own" ON subscriptions
    FOR DELETE 
    USING (auth.uid() = user_id);

-- Comments:
-- - Users can only access subscriptions they own
-- - Subscription creation is restricted to own user_id
-- - Updates are limited to own subscriptions
-- - Deletes are allowed for subscription cancellation
-- - No shared access to subscription data
