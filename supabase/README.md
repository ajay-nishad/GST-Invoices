# GST Invoice Management System - Database Schema

This directory contains the database schema and migrations for the GST Invoice Management System.

## Database Structure

### Core Tables

#### 1. **users**

- Extends Supabase auth.users
- Stores user profile information
- Includes GST, PAN, and address details

#### 2. **subscriptions**

- Manages user subscription plans
- Integrates with Razorpay for payment processing
- Tracks billing cycles and expiration dates

#### 3. **businesses**

- Stores business information for each user
- Supports multiple businesses per user
- Includes GST registration and bank details

#### 4. **customers**

- Customer information for invoicing
- Supports both individual and business customers
- Separate billing and shipping addresses

#### 5. **items**

- Product/service catalog
- Includes HSN/SAC codes for GST compliance
- Tax rate configuration and inventory tracking

#### 6. **invoices**

- Main invoice records
- Calculated fields for totals and balances
- Support for recurring invoices

#### 7. **invoice_items**

- Line items for each invoice
- Detailed tax calculations (CGST, SGST, IGST, Cess)
- Links to items table for consistency

#### 8. **payments**

- Payment records for invoices
- Multiple payment methods support
- Razorpay integration fields

## Key Features

### 🔒 **Security**

- Row Level Security (RLS) enabled on all tables
- Users can only access their own data
- Proper foreign key constraints

### 📊 **Analytics**

- Pre-built views for common queries
- Dashboard statistics function
- Monthly revenue tracking

### 🔄 **Automation**

- Auto-generated invoice numbers
- Automatic total calculations
- Updated timestamps on all records

### 💰 **GST Compliance**

- HSN/SAC code support
- Separate CGST, SGST, IGST calculations
- Cess support for specific items

## Migration Files

### `001_initial_schema.sql`

- Creates all tables with proper constraints
- Sets up indexes for performance
- Defines custom types and enums

### `002_rls_policies.sql`

- Enables Row Level Security
- Creates policies for data isolation
- Ensures users can only access their own data

### `003_views_and_functions.sql`

- Creates useful views for reporting
- Implements helper functions
- Sets up automated calculations

## Views

### `invoice_summary`

- Complete invoice information with customer and business details
- Payment status and overdue indicators

### `customer_summary`

- Customer statistics including invoice counts and amounts
- Last invoice date tracking

### `business_summary`

- Business performance metrics
- Revenue and customer statistics

### `monthly_revenue`

- Monthly revenue breakdown by user
- Useful for analytics and reporting

## Functions

### `generate_invoice_number(business_uuid)`

- Generates sequential invoice numbers
- Format: `BUS-YYYY-NNNN` (e.g., ABC-2024-0001)

### `generate_payment_number(invoice_uuid)`

- Generates payment reference numbers
- Format: `INV-NUMBER-PAY-NNN` (e.g., ABC-2024-0001-PAY-001)

### `calculate_invoice_totals(invoice_uuid)`

- Calculates subtotal, tax, and total amounts
- Returns structured totals for an invoice

### `update_invoice_totals(invoice_uuid)`

- Updates invoice totals automatically
- Triggered when invoice items change

### `get_dashboard_stats(user_uuid)`

- Returns comprehensive dashboard statistics
- Includes revenue, customer, and invoice metrics

## Usage Examples

### Creating a New Invoice

```sql
-- 1. Create invoice
INSERT INTO invoices (user_id, business_id, customer_id, invoice_number)
VALUES (user_uuid, business_uuid, customer_uuid, generate_invoice_number(business_uuid));

-- 2. Add invoice items
INSERT INTO invoice_items (invoice_id, item_name, quantity, unit_price, taxable_amount, tax_rate, total_amount)
VALUES (invoice_uuid, 'Product Name', 1, 100.00, 100.00, 18.00, 118.00);

-- 3. Totals are automatically calculated via trigger
```

### Getting Dashboard Stats

```sql
SELECT * FROM get_dashboard_stats('user-uuid-here');
```

### Viewing Invoice Summary

```sql
SELECT * FROM invoice_summary
WHERE user_id = 'user-uuid-here'
ORDER BY invoice_date DESC;
```

## TypeScript Integration

The `src/types/db.ts` file contains:

- Complete TypeScript types for all tables
- Insert/Update type definitions
- Extended types with relationships
- Enum types for status fields

## Razorpay Integration

The schema includes fields for Razorpay integration:

- `razorpay_subscription_id` in subscriptions
- `razorpay_invoice_id` in invoices
- `razorpay_payment_id`, `razorpay_order_id`, `razorpay_signature` in payments

## Soft Delete Support

All tables include:

- `is_active` boolean field for soft deletes
- Proper filtering in views and functions
- Maintains data integrity while allowing "deletion"

## Performance Optimizations

- Strategic indexes on frequently queried columns
- Composite indexes for complex queries
- Efficient views for common operations
- Proper foreign key constraints for data integrity
