import { z } from 'zod'

// Define the schema for environment variables
const envSchema = z.object({
  // Supabase Configuration
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, 'Supabase anon key is required'),
  SUPABASE_SERVICE_ROLE_KEY: z
    .string()
    .min(1, 'Supabase service role key is required'),

  // Razorpay Configuration
  RAZORPAY_KEY_ID: z.string().min(1, 'Razorpay key ID is required'),
  RAZORPAY_KEY_SECRET: z.string().min(1, 'Razorpay key secret is required'),

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
      throw new Error(
        `❌ Invalid environment variables:\n${missingVars.join('\n')}\n\n` +
          `💡 Please check your .env file and ensure all required variables are set.\n` +
          `📋 See .env.example for reference.`
      )
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
export const isDevelopment = env.NODE_ENV === 'development'
export const isProduction = env.NODE_ENV === 'production'
export const isTest = env.NODE_ENV === 'test'
