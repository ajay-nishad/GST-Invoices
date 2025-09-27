# Row Level Security (RLS) Policies

This directory contains comprehensive RLS policies for the GST Invoice Management System, ensuring complete data isolation between users.

## Policy Structure

### Core Principle

**All user data is isolated by `user_id = auth.uid()`**

Every table has policies that ensure users can only access their own data. Guest users (no authentication) have no database access.

## Policy Files

### 1. `001_enable_rls.sql`

- Enables RLS on all user-owned tables
- Sets up the foundation for data isolation

### 2. `002_users_policies.sql`

- **Table**: `users`
- **Access**: Users can only access their own profile
- **Operations**: SELECT, INSERT, UPDATE (no DELETE - use soft delete)

### 3. `003_subscriptions_policies.sql`

- **Table**: `subscriptions`
- **Access**: Users can only access their own subscriptions
- **Operations**: SELECT, INSERT, UPDATE, DELETE

### 4. `004_businesses_policies.sql`

- **Table**: `businesses`
- **Access**: Users can only access their own businesses
- **Operations**: SELECT, INSERT, UPDATE, DELETE

### 5. `005_customers_policies.sql`

- **Table**: `customers`
- **Access**: Users can only access their own customers
- **Operations**: SELECT, INSERT, UPDATE, DELETE

### 6. `006_items_policies.sql`

- **Table**: `items`
- **Access**: Users can only access their own items/products
- **Operations**: SELECT, INSERT, UPDATE, DELETE

### 7. `007_invoices_policies.sql`

- **Table**: `invoices`
- **Access**: Users can only access their own invoices
- **Operations**: SELECT, INSERT, UPDATE, DELETE

### 8. `008_invoice_items_policies.sql`

- **Table**: `invoice_items`
- **Access**: Users can only access items for their own invoices
- **Operations**: SELECT, INSERT, UPDATE, DELETE
- **Note**: Access controlled through parent invoice ownership

### 9. `009_payments_policies.sql`

- **Table**: `payments`
- **Access**: Users can only access payments for their own invoices
- **Operations**: SELECT, INSERT, UPDATE, DELETE
- **Note**: Access controlled through parent invoice ownership

### 10. `010_views_policies.sql`

- **Views**: All views inherit RLS from underlying tables
- **Access**: Automatic user data isolation
- **Note**: No additional policies needed

### 11. `011_guest_access.sql`

- **Guest Users**: No database access
- **Behavior**: Can only use client-side state
- **Security**: Complete isolation from user data

### 12. `012_functions_policies.sql`

- **Functions**: Inherit RLS from accessed tables
- **Security**: Functions cannot bypass user data isolation
- **Context**: Uses caller's security context

## Security Model

### Authenticated Users

- ✅ Can access their own data (`user_id = auth.uid()`)
- ✅ Can perform all CRUD operations on their data
- ❌ Cannot access other users' data
- ❌ Cannot bypass RLS policies

### Guest Users

- ❌ No database read access
- ❌ No database write access
- ✅ Can use client-side state (localStorage, sessionStorage, memory)
- ✅ Can access public pages (but data is not persisted)

### Data Isolation

- **Complete isolation**: Users cannot see each other's data
- **No shared reads**: All data is user-specific
- **No cross-user access**: Impossible to access other users' data
- **Function security**: All functions respect user boundaries

## Policy Examples

### Basic User Data Access

```sql
-- Users can only access their own data
CREATE POLICY "table_select_own" ON table_name
    FOR SELECT
    USING (auth.uid() = user_id);
```

### Related Data Access (Invoice Items)

```sql
-- Access controlled through parent relationship
CREATE POLICY "invoice_items_select_own" ON invoice_items
    FOR SELECT
    USING (
        EXISTS (
            SELECT 1 FROM invoices
            WHERE invoices.id = invoice_items.invoice_id
            AND invoices.user_id = auth.uid()
        )
    );
```

## Implementation Notes

### 1. **No Shared Templates/Metadata**

- All data is user-specific
- No shared reads for templates or metadata
- Each user maintains their own data

### 2. **Guest User Handling**

- Guest users have no database access
- All guest state must be handled client-side
- No persistence for guest users

### 3. **Function Security**

- Functions automatically respect RLS policies
- No additional policies needed for functions
- Functions use caller's security context

### 4. **View Security**

- Views inherit RLS from underlying tables
- No additional policies needed for standard views
- All views respect user data isolation

## Testing RLS Policies

### Test Authenticated Access

```sql
-- Should work for authenticated user
SELECT * FROM invoices WHERE user_id = auth.uid();

-- Should return empty for other users
SELECT * FROM invoices WHERE user_id != auth.uid();
```

### Test Guest Access

```sql
-- Should return empty (no auth.uid())
SELECT * FROM invoices;
```

### Test Function Security

```sql
-- Should only return data for the specified user
SELECT * FROM get_dashboard_stats('user-uuid');
```

## Deployment

1. **Run policies in order**: Execute files in numerical order
2. **Test thoroughly**: Verify RLS is working correctly
3. **Monitor access**: Check that users can only access their own data
4. **Validate functions**: Ensure functions respect user boundaries

## Security Benefits

- ✅ **Complete data isolation** between users
- ✅ **No cross-user data leakage** possible
- ✅ **Guest user protection** (no database access)
- ✅ **Function security** (automatic RLS inheritance)
- ✅ **View security** (automatic RLS inheritance)
- ✅ **Audit trail** (all access is logged)
- ✅ **Compliance ready** (meets data protection requirements)
