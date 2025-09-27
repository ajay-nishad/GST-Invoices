import { z } from 'zod'

// Define the schema for environment variables
const envSchema = z.object({
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

  // Email Configuration (Resend)
  RESEND_API_KEY: z
    .string()
    .min(1, 'Resend API key is required')
    .optional()
    .default('placeholder_resend_key'),

  // Optional variables with defaults
  NODE_ENV: z
    .enum(['development', 'production', 'test'])
    .default('development'),
  PORT: z.string().optional().default('3000'),
})

// Parse and validate environment variables
function validateEnv() {
  try {
    return envSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map(
        (err) => `${err.path.join('.')}: ${err.message}`
      )
      console.warn(
        `⚠️  Environment variables warning:\n${missingVars.join('\n')}\n\n` +
          `💡 Please check your .env.local file and ensure all required variables are set.\n` +
          `📋 See .env.example for reference.`
      )
      // Return default values for development
      return envSchema.parse({})
    }
    throw error
  }
}

// Export validated environment variables
export const env = validateEnv()

// Type-safe environment variables
export type Env = z.infer<typeof envSchema>

// Client-side environment variables (only public ones)
export const clientEnv = {
  NEXT_PUBLIC_SUPABASE_URL: env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
} as const

// Server-side environment variables (all variables)
export const serverEnv = env

// Utility function to check if we're in development

// Utility function to check if we're in development
export const isDevelopment = env.NODE_ENV === 'development'
export const isProduction = env.NODE_ENV === 'production'
export const isTest = env.NODE_ENV === 'test'
