# Database Migration Guide

## Quick Setup (Recommended)

### Step 1: Apply Database Schema

1. Go to your **Supabase Dashboard**
2. Navigate to **SQL Editor**
3. Copy the entire contents of `scripts/complete-schema.sql`
4. Paste and **Run** the SQL

### Step 2: Verify Setup

```bash
npm run db:check
```

You should see all 8 tables as ✅ Found.

### Step 3: Test Your Application

```bash
npm run dev
```

Visit `http://localhost:3000` - the dashboard and subscription endpoints should now work without errors.

---

## What This Fixes

### Before Migration

- ❌ `GET /api/subscription/status` returns 500 error
- ❌ Dashboard crashes with "Failed to fetch recent invoices"
- ❌ All database queries fail with `PGRST205` errors

### After Migration

- ✅ Subscription API returns proper responses
- ✅ Dashboard loads with empty states (ready for data)
- ✅ All database tables and security policies active
- ✅ Ready to create invoices, customers, and businesses

---

## Alternative: Manual Migration Files

If you prefer to run migrations individually:

1. **Core Schema**: `supabase/migrations/001_initial_schema.sql`
2. **Security**: `supabase/migrations/002_rls_policies.sql`
3. **Functions**: `supabase/migrations/003_views_and_functions.sql`
4. **Sample Data**: `supabase/migrations/004_sample_data.sql`
5. **Additional Tables**: `supabase/migrations/005_invoice_tables.sql`
6. **More Security**: `supabase/migrations/006_invoice_rls_policies.sql`
7. **Email Logs**: `supabase/migrations/007_email_logs.sql`
8. **Recurring**: `supabase/migrations/008_recurrences.sql`
9. **Preferences**: `supabase/migrations/009_user_preferences.sql`

Run these in order in your Supabase SQL Editor.

---

## Troubleshooting

### If tables still don't appear:

1. Check your `.env.local` has correct Supabase credentials
2. Verify you're connected to the right Supabase project
3. Try refreshing your Supabase dashboard
4. Run `npm run db:check` to verify connection

### If you get permission errors:

- Make sure you're using the `SUPABASE_SERVICE_ROLE_KEY` (not anon key)
- Check that RLS policies were created properly

---

## What's Created

### Core Tables

- `users` - User profiles extending Supabase auth
- `subscriptions` - User subscription plans
- `businesses` - Business entities for invoicing
- `customers` - Customer information
- `items` - Products/services catalog
- `invoices` - Invoice records
- `invoice_items` - Line items for invoices
- `payments` - Payment tracking

### Security

- Row Level Security (RLS) enabled on all tables
- Policies ensuring users only access their own data
- Proper foreign key relationships

### Performance

- Indexes on commonly queried columns
- Optimized for dashboard queries
- Auto-updating timestamps
