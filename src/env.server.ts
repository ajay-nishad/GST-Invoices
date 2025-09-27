import { z } from 'zod'

// Server-side environment schema (all variables including secrets)
const serverEnvSchema = z.object({
  // Supabase Configuration
  NEXT_PUBLIC_SUPABASE_URL: z
    .string()
    .url('Invalid Supabase URL')
    .optional()
    .default('https://placeholder.supabase.co'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, 'Supabase anon key is required')
    .optional()
    .default('placeholder_anon_key'),
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, 'Supabase service role key is required')
    .optional()
    .default('placeholder_service_key'),

  // Razorpay Configuration
  RAZORPAY_KEY_ID: z
    .string()
    .min(1, 'Razorpay key ID is required')
    .optional()
    .default('placeholder_key_id'),
  RAZORPAY_KEY_SECRET: z
    .string()
    .min(1, 'Razorpay key secret is required')
    .optional()
    .default('placeholder_key_secret'),

  // Optional variables with defaults
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.string().optional().default('3000'),
})

// Validate server-side environment variables
function validateServerEnv() {
  try {
    return serverEnvSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.warn('⚠️  Server environment variables warning - using defaults')
      return serverEnvSchema.parse({})
    }
    throw error
  }
}

// Export validated server environment variables
export const serverEnv = validateServerEnv()

// Type-safe server environment variables
export type ServerEnv = z.infer<typeof serverEnvSchema>

// Utility function to check if we're in development
export const isDevelopment = serverEnv.NODE_ENV === 'development'
export const isProduction = serverEnv.NODE_ENV === 'production'
export const isTest = serverEnv.NODE_ENV === 'test'
