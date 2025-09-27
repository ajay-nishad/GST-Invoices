// Database types for GST Invoice Management System
// Generated from Supabase schema

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

// Enums
export type SubscriptionStatus = 'active' | 'inactive' | 'cancelled' | 'expired'
export type InvoiceStatus = 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled'
export type PaymentStatus = 'pending' | 'completed' | 'failed' | 'refunded'
export type PaymentMethod =
  | 'cash'
  | 'bank_transfer'
  | 'upi'
  | 'card'
  | 'cheque'
  | 'razorpay'

// Database Tables
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          gst_number: string | null
          pan_number: string | null
          address: string | null
          city: string | null
          state: string | null
          pincode: string | null
          country: string
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          gst_number?: string | null
          pan_number?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          pincode?: string | null
          country?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          gst_number?: string | null
          pan_number?: string | null
          address?: string | null
          city?: string | null
          state?: string | null
          pincode?: string | null
          country?: string
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      subscriptions: {
        Row: {
          id: string
          user_id: string
          plan_name: string
          status: SubscriptionStatus
          price: number
          currency: string
          billing_cycle: string
          started_at: string
          expires_at: string | null
          razorpay_subscription_id: string | null
          razorpay_plan_id: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          plan_name: string
          status?: SubscriptionStatus
          price: number
          currency?: string
          billing_cycle?: string
          started_at?: string
          expires_at?: string | null
          razorpay_subscription_id?: string | null
          razorpay_plan_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          plan_name?: string
          status?: SubscriptionStatus
          price?: number
          currency?: string
          billing_cycle?: string
          started_at?: string
          expires_at?: string | null
          razorpay_subscription_id?: string | null
          razorpay_plan_id?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      businesses: {
        Row: {
          id: string
          user_id: string
          business_name: string
          business_type: string | null
          gst_number: string | null
          pan_number: string | null
          cin_number: string | null
          registration_number: string | null
          business_address: string
          business_city: string
          business_state: string
          business_pincode: string
          business_country: string
          contact_phone: string | null
          contact_email: string | null
          website: string | null
          logo_url: string | null
          bank_details: Json | null
          is_primary: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_name: string
          business_type?: string | null
          gst_number?: string | null
          pan_number?: string | null
          cin_number?: string | null
          registration_number?: string | null
          business_address: string
          business_city: string
          business_state: string
          business_pincode: string
          business_country?: string
          contact_phone?: string | null
          contact_email?: string | null
          website?: string | null
          logo_url?: string | null
          bank_details?: Json | null
          is_primary?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_name?: string
          business_type?: string | null
          gst_number?: string | null
          pan_number?: string | null
          cin_number?: string | null
          registration_number?: string | null
          business_address?: string
          business_city?: string
          business_state?: string
          business_pincode?: string
          business_country?: string
          contact_phone?: string | null
          contact_email?: string | null
          website?: string | null
          logo_url?: string | null
          bank_details?: Json | null
          is_primary?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      customers: {
        Row: {
          id: string
          user_id: string
          business_id: string | null
          customer_name: string
          customer_type: string
          email: string | null
          phone: string | null
          gst_number: string | null
          pan_number: string | null
          billing_address: string | null
          billing_city: string | null
          billing_state: string | null
          billing_pincode: string | null
          billing_country: string
          shipping_address: string | null
          shipping_city: string | null
          shipping_state: string | null
          shipping_pincode: string | null
          shipping_country: string
          notes: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_id?: string | null
          customer_name: string
          customer_type?: string
          email?: string | null
          phone?: string | null
          gst_number?: string | null
          pan_number?: string | null
          billing_address?: string | null
          billing_city?: string | null
          billing_state?: string | null
          billing_pincode?: string | null
          billing_country?: string
          shipping_address?: string | null
          shipping_city?: string | null
          shipping_state?: string | null
          shipping_pincode?: string | null
          shipping_country?: string
          notes?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_id?: string | null
          customer_name?: string
          customer_type?: string
          email?: string | null
          phone?: string | null
          gst_number?: string | null
          pan_number?: string | null
          billing_address?: string | null
          billing_city?: string | null
          billing_state?: string | null
          billing_pincode?: string | null
          billing_country?: string
          shipping_address?: string | null
          shipping_city?: string | null
          shipping_state?: string | null
          shipping_pincode?: string | null
          shipping_country?: string
          notes?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      items: {
        Row: {
          id: string
          user_id: string
          business_id: string | null
          item_name: string
          item_code: string | null
          description: string | null
          unit: string
          hsn_code: string | null
          sac_code: string | null
          tax_rate: number
          cgst_rate: number
          sgst_rate: number
          igst_rate: number
          cess_rate: number
          purchase_price: number | null
          selling_price: number
          stock_quantity: number
          min_stock_level: number
          is_service: boolean
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_id?: string | null
          item_name: string
          item_code?: string | null
          description?: string | null
          unit?: string
          hsn_code?: string | null
          sac_code?: string | null
          tax_rate?: number
          cgst_rate?: number
          sgst_rate?: number
          igst_rate?: number
          cess_rate?: number
          purchase_price?: number | null
          selling_price: number
          stock_quantity?: number
          min_stock_level?: number
          is_service?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_id?: string | null
          item_name?: string
          item_code?: string | null
          description?: string | null
          unit?: string
          hsn_code?: string | null
          sac_code?: string | null
          tax_rate?: number
          cgst_rate?: number
          sgst_rate?: number
          igst_rate?: number
          cess_rate?: number
          purchase_price?: number | null
          selling_price?: number
          stock_quantity?: number
          min_stock_level?: number
          is_service?: boolean
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      invoices: {
        Row: {
          id: string
          user_id: string
          business_id: string
          customer_id: string
          invoice_number: string
          invoice_date: string
          due_date: string | null
          status: InvoiceStatus
          subtotal: number
          tax_amount: number
          discount_amount: number
          total_amount: number
          paid_amount: number
          balance_amount: number
          currency: string
          notes: string | null
          terms_conditions: string | null
          payment_terms: string | null
          reference_number: string | null
          is_recurring: boolean
          recurring_frequency: string | null
          recurring_end_date: string | null
          razorpay_invoice_id: string | null
          pdf_url: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          business_id: string
          customer_id: string
          invoice_number: string
          invoice_date?: string
          due_date?: string | null
          status?: InvoiceStatus
          subtotal?: number
          tax_amount?: number
          discount_amount?: number
          total_amount?: number
          paid_amount?: number
          currency?: string
          notes?: string | null
          terms_conditions?: string | null
          payment_terms?: string | null
          reference_number?: string | null
          is_recurring?: boolean
          recurring_frequency?: string | null
          recurring_end_date?: string | null
          razorpay_invoice_id?: string | null
          pdf_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          business_id?: string
          customer_id?: string
          invoice_number?: string
          invoice_date?: string
          due_date?: string | null
          status?: InvoiceStatus
          subtotal?: number
          tax_amount?: number
          discount_amount?: number
          total_amount?: number
          paid_amount?: number
          currency?: string
          notes?: string | null
          terms_conditions?: string | null
          payment_terms?: string | null
          reference_number?: string | null
          is_recurring?: boolean
          recurring_frequency?: string | null
          recurring_end_date?: string | null
          razorpay_invoice_id?: string | null
          pdf_url?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      invoice_items: {
        Row: {
          id: string
          invoice_id: string
          item_id: string | null
          item_name: string
          item_code: string | null
          description: string | null
          unit: string
          hsn_code: string | null
          sac_code: string | null
          quantity: number
          unit_price: number
          discount_percentage: number
          discount_amount: number
          taxable_amount: number
          tax_rate: number
          cgst_rate: number
          sgst_amount: number
          igst_rate: number
          cess_rate: number
          cgst_amount: number
          total_amount: number
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          invoice_id: string
          item_id?: string | null
          item_name: string
          item_code?: string | null
          description?: string | null
          unit?: string
          hsn_code?: string | null
          sac_code?: string | null
          quantity: number
          unit_price: number
          discount_percentage?: number
          discount_amount?: number
          taxable_amount: number
          tax_rate: number
          cgst_rate?: number
          sgst_amount?: number
          igst_rate?: number
          cess_rate?: number
          cgst_amount?: number
          total_amount: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          invoice_id?: string
          item_id?: string | null
          item_name?: string
          item_code?: string | null
          description?: string | null
          unit?: string
          hsn_code?: string | null
          sac_code?: string | null
          quantity?: number
          unit_price?: number
          discount_percentage?: number
          discount_amount?: number
          taxable_amount?: number
          tax_rate?: number
          cgst_rate?: number
          sgst_amount?: number
          igst_rate?: number
          cess_rate?: number
          cgst_amount?: number
          total_amount?: number
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
      }
      payments: {
        Row: {
          id: string
          invoice_id: string
          payment_number: string
          payment_date: string
          amount: number
          payment_method: PaymentMethod
          status: PaymentStatus
          reference_number: string | null
          notes: string | null
          razorpay_payment_id: string | null
          razorpay_order_id: string | null
          razorpay_signature: string | null
          bank_transaction_id: string | null
          cheque_number: string | null
          cheque_date: string | null
          cheque_bank: string | null
          is_active: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          invoice_id: string
          payment_number: string
          payment_date?: string
          amount: number
          payment_method: PaymentMethod
          status?: PaymentStatus
          reference_number?: string | null
          notes?: string | null
          razorpay_payment_id?: string | null
          razorpay_order_id?: string | null
          razorpay_signature?: string | null
          bank_transaction_id?: string | null
          cheque_number?: string | null
          cheque_date?: string | null
          cheque_bank?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          invoice_id?: string
          payment_number?: string
          payment_date?: string
          amount?: number
          payment_method?: PaymentMethod
          status?: PaymentStatus
          reference_number?: string | null
          notes?: string | null
          razorpay_payment_id?: string | null
          razorpay_order_id?: string | null
          razorpay_signature?: string | null
          bank_transaction_id?: string | null
          cheque_number?: string | null
          cheque_date?: string | null
          cheque_bank?: string | null
          is_active?: boolean
          created_at?: string
          updated_at?: string
        }
        user_preferences: {
          Row: {
            id: string
            user_id: string
            default_tax_rate: number
            default_currency: string
            default_invoice_template: string
            default_payment_terms: string
            default_notes: string | null
            default_terms_conditions: string | null
            invoice_number_prefix: string
            invoice_number_start: number
            auto_generate_invoice_number: boolean
            email_notifications: boolean
            payment_reminders: boolean
            invoice_updates: boolean
            theme: string
            language: string
            created_at: string
            updated_at: string
          }
          Insert: {
            id?: string
            user_id: string
            default_tax_rate?: number
            default_currency?: string
            default_invoice_template?: string
            default_payment_terms?: string
            default_notes?: string | null
            default_terms_conditions?: string | null
            invoice_number_prefix?: string
            invoice_number_start?: number
            auto_generate_invoice_number?: boolean
            email_notifications?: boolean
            payment_reminders?: boolean
            invoice_updates?: boolean
            theme?: string
            language?: string
            created_at?: string
            updated_at?: string
          }
          Update: {
            id?: string
            user_id?: string
            default_tax_rate?: number
            default_currency?: string
            default_invoice_template?: string
            default_payment_terms?: string
            default_notes?: string | null
            default_terms_conditions?: string | null
            invoice_number_prefix?: string
            invoice_number_start?: number
            auto_generate_invoice_number?: boolean
            email_notifications?: boolean
            payment_reminders?: boolean
            invoice_updates?: boolean
            theme?: string
            language?: string
            created_at?: string
            updated_at?: string
          }
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      subscription_status: SubscriptionStatus
      invoice_status: InvoiceStatus
      payment_status: PaymentStatus
      payment_method: PaymentMethod
    }
  }
}

// Convenience types for common operations
export type User = Database['public']['Tables']['users']['Row']
export type UserInsert = Database['public']['Tables']['users']['Insert']
export type UserUpdate = Database['public']['Tables']['users']['Update']

export type Subscription = Database['public']['Tables']['subscriptions']['Row']
export type SubscriptionInsert =
  Database['public']['Tables']['subscriptions']['Insert']
export type SubscriptionUpdate =
  Database['public']['Tables']['subscriptions']['Update']

export type Business = Database['public']['Tables']['businesses']['Row']
export type BusinessInsert =
  Database['public']['Tables']['businesses']['Insert']
export type BusinessUpdate =
  Database['public']['Tables']['businesses']['Update']

export type Customer = Database['public']['Tables']['customers']['Row']
export type CustomerInsert = Database['public']['Tables']['customers']['Insert']
export type CustomerUpdate = Database['public']['Tables']['customers']['Update']

export type Item = Database['public']['Tables']['items']['Row']
export type ItemInsert = Database['public']['Tables']['items']['Insert']
export type ItemUpdate = Database['public']['Tables']['items']['Update']

export type Invoice = Database['public']['Tables']['invoices']['Row']
export type InvoiceInsert = Database['public']['Tables']['invoices']['Insert']
export type InvoiceUpdate = Database['public']['Tables']['invoices']['Update']

export type InvoiceItem = Database['public']['Tables']['invoice_items']['Row']
export type InvoiceItemInsert =
  Database['public']['Tables']['invoice_items']['Insert']
export type InvoiceItemUpdate =
  Database['public']['Tables']['invoice_items']['Update']

export type Payment = Database['public']['Tables']['payments']['Row']
export type PaymentInsert = Database['public']['Tables']['payments']['Insert']
export type PaymentUpdate = Database['public']['Tables']['payments']['Update']

// Extended types with relationships
export type InvoiceWithItems = Invoice & {
  invoice_items: InvoiceItem[]
  customer: Customer
  business: Business
}

export type InvoiceWithDetails = Invoice & {
  invoice_items: (InvoiceItem & { item: Item | null })[]
  customer: Customer
  business: Business
  payments: Payment[]
}

export type CustomerWithBusiness = Customer & {
  business: Business | null
}

export type BusinessWithStats = Business & {
  _count: {
    customers: number
    invoices: number
    items: number
  }
}

// Bank details type for businesses
export interface BankDetails {
  account_holder_name: string
  account_number: string
  ifsc_code: string
  bank_name: string
  branch_name?: string
  account_type?: 'savings' | 'current'
}
