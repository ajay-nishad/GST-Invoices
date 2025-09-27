# Database Seeding Scripts

This directory contains scripts for seeding the database with demo data for testing and development.

## Overview

The seeding system creates a complete demo environment with:

- Demo user account
- Sample business with GST details
- Multiple customers (individual and business)
- Product and service items
- Sample invoices with line items
- Payment records
- Subscription data

## Prerequisites

### 1. Environment Variables

Ensure you have the following environment variables set in your `.env.local` file:

```bash
SUPABASE_URL=your_supabase_project_url
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
```

### 2. Database Setup

Make sure you have:

- ✅ Applied all database migrations
- ✅ Applied all RLS policies
- ✅ Database schema is up to date

## Usage

### Basic Seeding

```bash
npm run db:seed
```

### Development Seeding

```bash
npm run db:seed:dev
```

## Demo Data Created

### 👤 Demo User

- **Email**: `demo@gstinvoices.com`
- **Name**: Demo User
- **GST Number**: 29ABCDE1234F1Z5
- **PAN Number**: ABCDE1234F
- **Location**: Mumbai, Maharashtra

### 🏢 Demo Business

- **Name**: Tech Solutions Pvt Ltd
- **Type**: Private Limited Company
- **GST Number**: 29ABCDE1234F1Z5
- **CIN Number**: U72900MH2020PTC123456
- **Bank Details**: State Bank of India (Current Account)

### 👥 Demo Customers (4)

1. **John Doe** - Individual customer
2. **ABC Corporation** - Business customer with GST
3. **Jane Smith** - Individual customer
4. **XYZ Enterprises** - Business customer with GST

### 📦 Demo Items (5)

1. **Laptop Computer** - Dell Inspiron 15 (₹55,000)
2. **Office Chair** - Ergonomic (₹15,000)
3. **Software Development** - Services (₹2,500/hour)
4. **IT Consulting** - Services (₹2,000/hour)
5. **Printer** - HP LaserJet Pro (₹22,000)

### 📄 Demo Invoices (4)

1. **TECH-2024-0001** - Paid invoice (₹82,600)
2. **TECH-2024-0002** - Partially paid (₹35,400)
3. **TECH-2024-0003** - Draft invoice (₹17,700)
4. **TECH-2024-0004** - Overdue invoice (₹59,000)

### 💳 Demo Payments (2)

1. **TECH-2024-0001-PAY-001** - Bank transfer (₹82,600)
2. **TECH-2024-0002-PAY-001** - UPI payment (₹20,000)

### 📋 Demo Subscription

- **Plan**: Professional Plan
- **Price**: ₹999/month
- **Status**: Active
- **Billing**: Monthly

## Data Relationships

```
User (demo@gstinvoices.com)
├── Business (Tech Solutions Pvt Ltd)
│   ├── Customers (4 customers)
│   ├── Items (5 products/services)
│   └── Invoices (4 invoices)
│       ├── Invoice Items (5 line items)
│       └── Payments (2 payments)
└── Subscription (Professional Plan)
```

## GST Compliance

All demo data includes proper GST compliance:

- ✅ HSN codes for products
- ✅ SAC codes for services
- ✅ CGST/SGST calculations
- ✅ Proper tax rates (18%)
- ✅ GST numbers for business customers

## Testing Scenarios

The seeded data supports testing of:

### 📊 Dashboard Features

- Revenue statistics
- Customer counts
- Invoice summaries
- Payment tracking

### 📄 Invoice Management

- Create new invoices
- Edit existing invoices
- Add/remove line items
- Calculate taxes automatically

### 👥 Customer Management

- Individual vs business customers
- GST vs non-GST customers
- Billing and shipping addresses

### �� Payment Processing

- Multiple payment methods
- Partial payments
- Payment tracking
- Razorpay integration fields

### 📦 Inventory Management

- Product vs service items
- Stock tracking
- HSN/SAC codes
- Tax rate configuration

## Customization

### Adding More Data

To add more demo data, modify the constants in `scripts/seed.ts`:

```typescript
const DEMO_CUSTOMERS = [
  // Add more customers here
]

const DEMO_ITEMS = [
  // Add more items here
]
```

### Changing Demo User

Update the `DEMO_USER` constant:

```typescript
const DEMO_USER = {
  id: 'your-uuid-here',
  email: 'your-email@example.com',
  // ... other fields
}
```

### Modifying Business Details

Update the `DEMO_BUSINESS` constant:

```typescript
const DEMO_BUSINESS = {
  business_name: 'Your Business Name',
  gst_number: 'Your GST Number',
  // ... other fields
}
```

## Troubleshooting

### Common Issues

#### 1. Environment Variables Missing

```
Error: Missing required environment variables
```

**Solution**: Ensure `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are set in `.env.local`

#### 2. Database Connection Failed

```
Error: Failed to create user: ...
```

**Solution**: Check your Supabase credentials and network connection

#### 3. RLS Policies Not Applied

```
Error: Permission denied
```

**Solution**: Run the RLS policies first: `\i supabase/policies/000_apply_all_policies.sql`

#### 4. Schema Not Migrated

```
Error: relation "users" does not exist
```

**Solution**: Apply database migrations first: `\i supabase/migrations/001_initial_schema.sql`

### Reset Demo Data

To reset the demo data:

1. **Delete existing data** (optional):

```sql
-- WARNING: This will delete all data for the demo user
DELETE FROM payments WHERE invoice_id IN (
  SELECT id FROM invoices WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'
);
DELETE FROM invoice_items WHERE invoice_id IN (
  SELECT id FROM invoices WHERE user_id = '550e8400-e29b-41d4-a716-446655440000'
);
DELETE FROM invoices WHERE user_id = '550e8400-e29b-41d4-a716-446655440000';
DELETE FROM items WHERE user_id = '550e8400-e29b-41d4-a716-446655440000';
DELETE FROM customers WHERE user_id = '550e8400-e29b-41d4-a716-446655440000';
DELETE FROM businesses WHERE user_id = '550e8400-e29b-41d4-a716-446655440000';
DELETE FROM subscriptions WHERE user_id = '550e8400-e29b-41d4-a716-446655440000';
DELETE FROM users WHERE id = '550e8400-e29b-41d4-a716-446655440000';
```

2. **Re-run the seed script**:

```bash
npm run db:seed
```

## Security Notes

- The seed script uses the **service role key** to bypass RLS
- Demo data is created with specific UUIDs for consistency
- All demo data is associated with the demo user account
- RLS policies ensure users can only access their own data

## Next Steps

After seeding:

1. **Set up authentication** in Supabase
2. **Create a user account** with the demo email
3. **Test the application** with the seeded data
4. **Explore the dashboard** to see all features
5. **Create new invoices** using the demo data
6. **Test payment flows** with the existing data

## Support

If you encounter issues:

1. Check the troubleshooting section above
2. Verify your environment variables
3. Ensure database migrations are applied
4. Check Supabase logs for detailed error messages
