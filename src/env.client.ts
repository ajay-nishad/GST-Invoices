import { z } from 'zod'

// Client-side environment schema (only public variables)
const clientEnvSchema = z.object({
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
})

// Validate client-side environment variables
function validateClientEnv() {
  try {
    return clientEnvSchema.parse({
      NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
      NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    })
  } catch (error) {
    if (error instanceof z.ZodError) {
      console.warn('⚠️  Client environment variables warning - using defaults')
      return clientEnvSchema.parse({})
    }
    throw error
  }
}

// Export validated client environment variables
export const clientEnv = validateClientEnv()

// Type-safe client environment variables
export type ClientEnv = z.infer<typeof clientEnvSchema>
