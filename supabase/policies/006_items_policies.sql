-- RLS Policies for items table
-- Users can only access their own item/product data

-- Policy: Users can view their own items
CREATE POLICY "items_select_own" ON items
    FOR SELECT 
    USING (auth.uid() = user_id);

-- Policy: Users can create items for themselves
CREATE POLICY "items_insert_own" ON items
    FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own items
CREATE POLICY "items_update_own" ON items
    FOR UPDATE 
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

-- Policy: Users can delete their own items (soft delete)
CREATE POLICY "items_delete_own" ON items
    FOR DELETE 
    USING (auth.uid() = user_id);

-- Comments:
-- - Users can only access items they own
-- - Item creation is restricted to own user_id
-- - Updates are limited to own items
-- - Deletes are allowed for item removal
-- - No shared access to item data
-- - Items can be associated with specific businesses
-- - HSN/SAC codes are user-specific
