import { z } from 'zod'

// Server-side environment schema (all variables including secrets)
const serverEnvSchema = z.object({
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

// Validate server-side environment variables
function validateServerEnv() {
  try {
    return serverEnvSchema.parse(process.env)
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map(
        (err) => `${err.path.join('.')}: ${err.message}`
      )
      throw new Error(
        `❌ Invalid server environment variables:\n${missingVars.join('\n')}\n\n` +
          `💡 Please check your .env file and ensure all required variables are set.\n` +
          `📋 See .env.example for reference.`
      )
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
