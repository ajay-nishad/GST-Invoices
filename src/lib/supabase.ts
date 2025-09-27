/**
 * Supabase client configuration
 * Uses environment variables validated by Zod
 */

import { createClient } from '@supabase/supabase-js'
import { clientEnv } from '@/env.client'

// Create Supabase client for client-side usage
export const supabase = createClient(
  clientEnv.NEXT_PUBLIC_SUPABASE_URL,
  clientEnv.NEXT_PUBLIC_SUPABASE_ANON_KEY
)

// Database types (you can generate these from your Supabase schema)
export type Database = {
  public: {
    Tables: {
      // Define your database tables here
      // Example:
      // invoices: {
      //   Row: {
      //     id: string
      //     created_at: string
      //     // ... other fields
      //   }
      //   Insert: {
      //     id?: string
      //     created_at?: string
      //     // ... other fields
      //   }
      //   Update: {
      //     id?: string
      //     created_at?: string
      //     // ... other fields
      //   }
    }
  }
}
