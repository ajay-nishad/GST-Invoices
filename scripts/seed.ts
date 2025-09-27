#!/usr/bin/env tsx
/**
 * Database Seeding Script for GST Invoice Management System
 *
 * This script creates demo data for testing and development:
 * - Demo user account
 * - Sample business
 * - Multiple customers
 * - Product/service items
 * - Sample invoices with items
 * - Payment records
 *
 * Usage: npm run db:seed
 *
 * Requirements:
 * - SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be set
 * - Database schema must be migrated
 * - RLS policies must be applied
 */

import { createClient } from '@supabase/supabase-js'
import type { Database } from '../src/types/db'

// Types for seeding
type UserInsert = Database['public']['Tables']['users']['Insert']
type BusinessInsert = Database['public']['Tables']['businesses']['Insert']
type CustomerInsert = Database['public']['Tables']['customers']['Insert']
type ItemInsert = Database['public']['Tables']['items']['Insert']
type InvoiceInsert = Database['public']['Tables']['invoices']['Insert']
type InvoiceItemInsert = Database['public']['Tables']['invoice_items']['Insert']
type PaymentInsert = Database['public']['Tables']['payments']['Insert']

// Demo data configuration
const DEMO_USER: UserInsert = {
  id: '550e8400-e29b-41d4-a716-446655440000',
  email: 'demo@gstinvoices.com',
  full_name: 'Demo User',
  phone: '+91-9876543210',
  gst_number: '29ABCDE1234F1Z5',
  pan_number: 'ABCDE1234F',
  address: '123 Demo Street, Tech Park',
  city: 'Mumbai',
  state: 'Maharashtra',
  pincode: '400001',
  country: 'India',
}

const DEMO_BUSINESS: BusinessInsert = {
  id: '550e8400-e29b-41d4-a716-446655440001',
  business_name: 'Tech Solutions Pvt Ltd',
  business_type: 'private_limited',
  gst_number: '29ABCDE1234F1Z5',
  pan_number: 'ABCDE1234F',
  cin_number: 'U72900MH2020PTC123456',
  registration_number: 'REG123456789',
  business_address: '456 Business Park, Sector 5',
  business_city: 'Mumbai',
  business_state: 'Maharashtra',
  business_pincode: '400001',
  business_country: 'India',
  contact_phone: '+91-9876543210',
  contact_email: 'contact@techsolutions.com',
  website: 'https://techsolutions.com',
  is_primary: true,
  bank_details: {
    account_holder_name: 'Tech Solutions Pvt Ltd',
    account_number: '1234567890123456',
    ifsc_code: 'SBIN0001234',
    bank_name: 'State Bank of India',
    branch_name: 'Mumbai Main Branch',
    account_type: 'current',
  },
}

const DEMO_CUSTOMERS: CustomerInsert[] = [
  {
    id: '650e8400-e29b-41d4-a716-446655440001',
    customer_name: 'John Doe',
    customer_type: 'individual',
    email: 'john.doe@email.com',
    phone: '+91-9876543211',
    billing_address: '789 Customer Lane, Andheri West',
    billing_city: 'Mumbai',
    billing_state: 'Maharashtra',
    billing_pincode: '400058',
    billing_country: 'India',
    shipping_address: '789 Customer Lane, Andheri West',
    shipping_city: 'Mumbai',
    shipping_state: 'Maharashtra',
    shipping_pincode: '400058',
    shipping_country: 'India',
    notes: 'Regular customer, prefers email communication',
  },
  {
    id: '650e8400-e29b-41d4-a716-446655440002',
    customer_name: 'ABC Corporation',
    customer_type: 'business',
    email: 'billing@abccorp.com',
    phone: '+91-9876543212',
    gst_number: '19MNOPQ9012R3S4',
    pan_number: 'MNOPQ9012R',
    billing_address: '321 Corporate Plaza, Bandra Kurla Complex',
    billing_city: 'Mumbai',
    billing_state: 'Maharashtra',
    billing_pincode: '400051',
    billing_country: 'India',
    shipping_address: '321 Corporate Plaza, Bandra Kurla Complex',
    shipping_city: 'Mumbai',
    shipping_state: 'Maharashtra',
    shipping_pincode: '400051',
    shipping_country: 'India',
    notes: 'Large corporate client, bulk orders',
  },
  {
    id: '650e8400-e29b-41d4-a716-446655440003',
    customer_name: 'Jane Smith',
    customer_type: 'individual',
    email: 'jane.smith@email.com',
    phone: '+91-9876543213',
    billing_address: '654 Personal Street, Powai',
    billing_city: 'Mumbai',
    billing_state: 'Maharashtra',
    billing_pincode: '400076',
    billing_country: 'India',
    shipping_address: '654 Personal Street, Powai',
    shipping_city: 'Mumbai',
    shipping_state: 'Maharashtra',
    shipping_pincode: '400076',
    shipping_country: 'India',
    notes: 'Frequent small orders, prefers phone contact',
  },
  {
    id: '650e8400-e29b-41d4-a716-446655440004',
    customer_name: 'XYZ Enterprises',
    customer_type: 'business',
    email: 'accounts@xyzent.com',
    phone: '+91-9876543214',
    gst_number: '07FGHIJ5678K1L2',
    pan_number: 'FGHIJ5678K',
    billing_address: '987 Enterprise Tower, Lower Parel',
    billing_city: 'Mumbai',
    billing_state: 'Maharashtra',
    billing_pincode: '400013',
    billing_country: 'India',
    shipping_address: '987 Enterprise Tower, Lower Parel',
    shipping_city: 'Mumbai',
    shipping_state: 'Maharashtra',
    shipping_pincode: '400013',
    shipping_country: 'India',
    notes: 'Startup company, flexible payment terms',
  },
]

const DEMO_ITEMS: ItemInsert[] = [
  {
    id: '750e8400-e29b-41d4-a716-446655440001',
    item_name: 'Laptop Computer - Dell Inspiron 15',
    item_code: 'LAPTOP001',
    description:
      'High-performance laptop for business use, Intel i7, 16GB RAM, 512GB SSD',
    unit: 'piece',
    hsn_code: '8471',
    tax_rate: 18.0,
    cgst_rate: 9.0,
    sgst_rate: 9.0,
    igst_rate: 0.0,
    cess_rate: 0.0,
    purchase_price: 45000.0,
    selling_price: 55000.0,
    stock_quantity: 25,
    min_stock_level: 5,
    is_service: false,
  },
  {
    id: '750e8400-e29b-41d4-a716-446655440002',
    item_name: 'Office Chair - Ergonomic',
    item_code: 'CHAIR001',
    description:
      'Ergonomic office chair with lumbar support and adjustable height',
    unit: 'piece',
    hsn_code: '9401',
    tax_rate: 18.0,
    cgst_rate: 9.0,
    sgst_rate: 9.0,
    igst_rate: 0.0,
    cess_rate: 0.0,
    purchase_price: 12000.0,
    selling_price: 15000.0,
    stock_quantity: 50,
    min_stock_level: 10,
    is_service: false,
  },
  {
    id: '750e8400-e29b-41d4-a716-446655440003',
    item_name: 'Software Development Services',
    item_code: 'SOFT001',
    description: 'Custom software development and consulting services',
    unit: 'hour',
    sac_code: '9983',
    tax_rate: 18.0,
    cgst_rate: 9.0,
    sgst_rate: 9.0,
    igst_rate: 0.0,
    cess_rate: 0.0,
    purchase_price: 0.0,
    selling_price: 2500.0,
    stock_quantity: 0,
    min_stock_level: 0,
    is_service: true,
  },
  {
    id: '750e8400-e29b-41d4-a716-446655440004',
    item_name: 'IT Consulting Services',
    item_code: 'CONS001',
    description: 'Business consulting and IT advisory services',
    unit: 'hour',
    sac_code: '9983',
    tax_rate: 18.0,
    cgst_rate: 9.0,
    sgst_rate: 9.0,
    igst_rate: 0.0,
    cess_rate: 0.0,
    purchase_price: 0.0,
    selling_price: 2000.0,
    stock_quantity: 0,
    min_stock_level: 0,
    is_service: true,
  },
  {
    id: '750e8400-e29b-41d4-a716-446655440005',
    item_name: 'Printer - HP LaserJet Pro',
    item_code: 'PRINT001',
    description:
      'High-speed laser printer for office use, wireless connectivity',
    unit: 'piece',
    hsn_code: '8443',
    tax_rate: 18.0,
    cgst_rate: 9.0,
    sgst_rate: 9.0,
    igst_rate: 0.0,
    cess_rate: 0.0,
    purchase_price: 18000.0,
    selling_price: 22000.0,
    stock_quantity: 15,
    min_stock_level: 3,
    is_service: false,
  },
]

// Helper function to create Supabase client with service role
function createServiceClient() {
  const supabaseUrl = process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    throw new Error(
      'Missing required environment variables:\n' +
        '- SUPABASE_URL\n' +
        '- SUPABASE_SERVICE_ROLE_KEY\n\n' +
        'Please set these in your .env.local file'
    )
  }

  return createClient<Database>(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

// Helper function to generate invoice number
function generateInvoiceNumber(businessId: string, index: number): string {
  const currentYear = new Date().getFullYear()
  const businessPrefix = 'TECH'
  const paddedNumber = String(index).padStart(4, '0')
  return `${businessPrefix}-${currentYear}-${paddedNumber}`
}

// Helper function to generate payment number
function generatePaymentNumber(invoiceNumber: string, index: number): string {
  const paddedNumber = String(index).padStart(3, '0')
  return `${invoiceNumber}-PAY-${paddedNumber}`
}

// Main seeding function
async function seedDatabase() {
  console.log('🌱 Starting database seeding...')

  const supabase = createServiceClient()

  try {
    // 1. Create demo user
    console.log('👤 Creating demo user...')
    const { data: user, error: userError } = await supabase
      .from('users')
      .upsert(DEMO_USER, { onConflict: 'id' })
      .select()
      .single()

    if (userError) {
      throw new Error(`Failed to create user: ${userError.message}`)
    }
    console.log(`✅ Created user: ${user?.email}`)

    // 2. Create demo business
    console.log('🏢 Creating demo business...')
    const businessData: BusinessInsert = {
      ...DEMO_BUSINESS,
      user_id: user!.id,
    }

    const { data: business, error: businessError } = await supabase
      .from('businesses')
      .upsert(businessData, { onConflict: 'id' })
      .select()
      .single()

    if (businessError) {
      throw new Error(`Failed to create business: ${businessError.message}`)
    }
    console.log(`✅ Created business: ${business?.business_name}`)

    // 3. Create demo customers
    console.log('👥 Creating demo customers...')
    const customersData: CustomerInsert[] = DEMO_CUSTOMERS.map((customer) => ({
      ...customer,
      user_id: user!.id,
      business_id: business!.id,
    }))

    const { data: customers, error: customersError } = await supabase
      .from('customers')
      .upsert(customersData, { onConflict: 'id' })
      .select()

    if (customersError) {
      throw new Error(`Failed to create customers: ${customersError.message}`)
    }
    console.log(`✅ Created ${customers?.length || 0} customers`)

    // 4. Create demo items
    console.log('📦 Creating demo items...')
    const itemsData: ItemInsert[] = DEMO_ITEMS.map((item) => ({
      ...item,
      user_id: user!.id,
      business_id: business!.id,
    }))

    const { data: items, error: itemsError } = await supabase
      .from('items')
      .upsert(itemsData, { onConflict: 'id' })
      .select()

    if (itemsError) {
      throw new Error(`Failed to create items: ${itemsError.message}`)
    }
    console.log(`✅ Created ${items?.length || 0} items`)

    // 5. Create demo invoices
    console.log('📄 Creating demo invoices...')
    const invoices = [
      {
        id: '850e8400-e29b-41d4-a716-446655440001',
        invoice_number: generateInvoiceNumber(business!.id, 1),
        invoice_date: '2024-01-15',
        due_date: '2024-02-14',
        status: 'paid' as const,
        customer_id: customers![0].id,
        subtotal: 70000.0,
        tax_amount: 12600.0,
        total_amount: 82600.0,
        paid_amount: 82600.0,
        notes: 'Thank you for your business!',
      },
      {
        id: '850e8400-e29b-41d4-a716-446655440002',
        invoice_number: generateInvoiceNumber(business!.id, 2),
        invoice_date: '2024-01-20',
        due_date: '2024-02-19',
        status: 'sent' as const,
        customer_id: customers![1].id,
        subtotal: 30000.0,
        tax_amount: 5400.0,
        total_amount: 35400.0,
        paid_amount: 20000.0,
        notes: 'Payment due within 30 days',
      },
      {
        id: '850e8400-e29b-41d4-a716-446655440003',
        invoice_number: generateInvoiceNumber(business!.id, 3),
        invoice_date: '2024-01-25',
        due_date: '2024-02-24',
        status: 'draft' as const,
        customer_id: customers![2].id,
        subtotal: 15000.0,
        tax_amount: 2700.0,
        total_amount: 17700.0,
        paid_amount: 0.0,
        notes: 'Draft invoice for review',
      },
      {
        id: '850e8400-e29b-41d4-a716-446655440004',
        invoice_number: generateInvoiceNumber(business!.id, 4),
        invoice_date: '2024-02-01',
        due_date: '2024-03-02',
        status: 'overdue' as const,
        customer_id: customers![3].id,
        subtotal: 50000.0,
        tax_amount: 9000.0,
        total_amount: 59000.0,
        paid_amount: 0.0,
        notes: 'Overdue invoice - please pay immediately',
      },
    ]

    const invoicesData: InvoiceInsert[] = invoices.map((invoice) => ({
      ...invoice,
      user_id: user!.id,
      business_id: business!.id,
    }))

    const { data: createdInvoices, error: invoicesError } = await supabase
      .from('invoices')
      .upsert(invoicesData, { onConflict: 'id' })
      .select()

    if (invoicesError) {
      throw new Error(`Failed to create invoices: ${invoicesError.message}`)
    }
    console.log(`✅ Created ${createdInvoices?.length || 0} invoices`)

    // 6. Create invoice items
    console.log('📋 Creating invoice items...')
    const invoiceItems: InvoiceItemInsert[] = [
      // Invoice 1 items
      {
        id: '950e8400-e29b-41d4-a716-446655440001',
        invoice_id: createdInvoices![0].id,
        item_id: items![0].id,
        item_name: items![0].item_name,
        item_code: items![0].item_code,
        description: items![0].description,
        unit: items![0].unit,
        hsn_code: items![0].hsn_code,
        quantity: 1,
        unit_price: items![0].selling_price,
        taxable_amount: items![0].selling_price,
        tax_rate: items![0].tax_rate,
        cgst_rate: items![0].cgst_rate,
        sgst_rate: items![0].sgst_rate,
        cgst_amount: (items![0].selling_price * items![0].cgst_rate) / 100,
        sgst_amount: (items![0].selling_price * items![0].sgst_rate) / 100,
        total_amount: items![0].selling_price * (1 + items![0].tax_rate / 100),
      },
      {
        id: '950e8400-e29b-41d4-a716-446655440002',
        invoice_id: createdInvoices![0].id,
        item_id: items![1].id,
        item_name: items![1].item_name,
        item_code: items![1].item_code,
        description: items![1].description,
        unit: items![1].unit,
        hsn_code: items![1].hsn_code,
        quantity: 1,
        unit_price: items![1].selling_price,
        taxable_amount: items![1].selling_price,
        tax_rate: items![1].tax_rate,
        cgst_rate: items![1].cgst_rate,
        sgst_rate: items![1].sgst_rate,
        cgst_amount: (items![1].selling_price * items![1].cgst_rate) / 100,
        sgst_amount: (items![1].selling_price * items![1].sgst_rate) / 100,
        total_amount: items![1].selling_price * (1 + items![1].tax_rate / 100),
      },
      // Invoice 2 items
      {
        id: '950e8400-e29b-41d4-a716-446655440003',
        invoice_id: createdInvoices![1].id,
        item_id: items![1].id,
        item_name: items![1].item_name,
        item_code: items![1].item_code,
        description: items![1].description,
        unit: items![1].unit,
        hsn_code: items![1].hsn_code,
        quantity: 2,
        unit_price: items![1].selling_price,
        taxable_amount: items![1].selling_price * 2,
        tax_rate: items![1].tax_rate,
        cgst_rate: items![1].cgst_rate,
        sgst_rate: items![1].sgst_rate,
        cgst_amount: (items![1].selling_price * 2 * items![1].cgst_rate) / 100,
        sgst_amount: (items![1].selling_price * 2 * items![1].sgst_rate) / 100,
        total_amount:
          items![1].selling_price * 2 * (1 + items![1].tax_rate / 100),
      },
      // Invoice 3 items
      {
        id: '950e8400-e29b-41d4-a716-446655440004',
        invoice_id: createdInvoices![2].id,
        item_id: items![2].id,
        item_name: items![2].item_name,
        item_code: items![2].item_code,
        description: items![2].description,
        unit: items![2].unit,
        sac_code: items![2].sac_code,
        quantity: 6,
        unit_price: items![2].selling_price,
        taxable_amount: items![2].selling_price * 6,
        tax_rate: items![2].tax_rate,
        cgst_rate: items![2].cgst_rate,
        sgst_rate: items![2].sgst_rate,
        cgst_amount: (items![2].selling_price * 6 * items![2].cgst_rate) / 100,
        sgst_amount: (items![2].selling_price * 6 * items![2].sgst_rate) / 100,
        total_amount:
          items![2].selling_price * 6 * (1 + items![2].tax_rate / 100),
      },
      // Invoice 4 items
      {
        id: '950e8400-e29b-41d4-a716-446655440005',
        invoice_id: createdInvoices![3].id,
        item_id: items![0].id,
        item_name: items![0].item_name,
        item_code: items![0].item_code,
        description: items![0].description,
        unit: items![0].unit,
        hsn_code: items![0].hsn_code,
        quantity: 1,
        unit_price: items![0].selling_price,
        taxable_amount: items![0].selling_price,
        tax_rate: items![0].tax_rate,
        cgst_rate: items![0].cgst_rate,
        sgst_rate: items![0].sgst_rate,
        cgst_amount: (items![0].selling_price * items![0].cgst_rate) / 100,
        sgst_amount: (items![0].selling_price * items![0].sgst_rate) / 100,
        total_amount: items![0].selling_price * (1 + items![0].tax_rate / 100),
      },
    ]

    const { data: createdInvoiceItems, error: invoiceItemsError } =
      await supabase
        .from('invoice_items')
        .upsert(invoiceItems, { onConflict: 'id' })
        .select()

    if (invoiceItemsError) {
      throw new Error(
        `Failed to create invoice items: ${invoiceItemsError.message}`
      )
    }
    console.log(`✅ Created ${createdInvoiceItems?.length || 0} invoice items`)

    // 7. Create payments
    console.log('💳 Creating payments...')
    const payments: PaymentInsert[] = [
      {
        id: 'a50e8400-e29b-41d4-a716-446655440001',
        invoice_id: createdInvoices![0].id,
        payment_number: generatePaymentNumber(
          createdInvoices![0].invoice_number,
          1
        ),
        payment_date: '2024-01-20',
        amount: 82600.0,
        payment_method: 'bank_transfer',
        status: 'completed',
        reference_number: 'TXN123456789',
        notes: 'Payment received via bank transfer',
      },
      {
        id: 'a50e8400-e29b-41d4-a716-446655440002',
        invoice_id: createdInvoices![1].id,
        payment_number: generatePaymentNumber(
          createdInvoices![1].invoice_number,
          1
        ),
        payment_date: '2024-01-25',
        amount: 20000.0,
        payment_method: 'upi',
        status: 'completed',
        reference_number: 'UPI987654321',
        notes: 'Partial payment via UPI',
      },
    ]

    const { data: createdPayments, error: paymentsError } = await supabase
      .from('payments')
      .upsert(payments, { onConflict: 'id' })
      .select()

    if (paymentsError) {
      throw new Error(`Failed to create payments: ${paymentsError.message}`)
    }
    console.log(`✅ Created ${createdPayments?.length || 0} payments`)

    // 8. Create subscription
    console.log('📋 Creating subscription...')
    const subscription = {
      id: 'b50e8400-e29b-41d4-a716-446655440001',
      user_id: user!.id,
      plan_name: 'Professional Plan',
      status: 'active' as const,
      price: 999.0,
      currency: 'INR',
      billing_cycle: 'monthly',
      started_at: '2024-01-01',
      expires_at: '2024-02-01',
    }

    const { data: createdSubscription, error: subscriptionError } =
      await supabase
        .from('subscriptions')
        .upsert(subscription, { onConflict: 'id' })
        .select()
        .single()

    if (subscriptionError) {
      throw new Error(
        `Failed to create subscription: ${subscriptionError.message}`
      )
    }
    console.log(`✅ Created subscription: ${createdSubscription?.plan_name}`)

    // Summary
    console.log('\n🎉 Database seeding completed successfully!')
    console.log('\n📊 Summary:')
    console.log(`👤 User: ${user?.email}`)
    console.log(`🏢 Business: ${business?.business_name}`)
    console.log(`👥 Customers: ${customers?.length || 0}`)
    console.log(`📦 Items: ${items?.length || 0}`)
    console.log(`📄 Invoices: ${createdInvoices?.length || 0}`)
    console.log(`📋 Invoice Items: ${createdInvoiceItems?.length || 0}`)
    console.log(`💳 Payments: ${createdPayments?.length || 0}`)
    console.log(`📋 Subscription: ${createdSubscription?.plan_name}`)

    console.log('\n🔑 Demo Login Credentials:')
    console.log(`Email: ${user?.email}`)
    console.log('Password: (Use Supabase Auth to set password)')

    console.log('\n📝 Next Steps:')
    console.log('1. Set up authentication in Supabase')
    console.log('2. Create a user account with the demo email')
    console.log('3. Test the application with the seeded data')
    console.log('4. Use the dashboard to view invoices, customers, and items')
  } catch (error) {
    console.error('❌ Seeding failed:', error)
    process.exit(1)
  }
}

// Run the seeding function
if (require.main === module) {
  seedDatabase()
}

export { seedDatabase }
