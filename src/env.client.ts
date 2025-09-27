import { z } from 'zod'

// Client-side environment schema (only public variables)
const clientEnvSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('Invalid Supabase URL'),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, 'Supabase anon key is required'),
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
      const missingVars = error.issues.map(
        (err) => `${err.path.join('.')}: ${err.message}`
      )
      throw new Error(
        `❌ Invalid client environment variables:\n${missingVars.join('\n')}\n\n` +
          `💡 Please check your .env file and ensure all required public variables are set.\n` +
          `📋 See .env.example for reference.`
      )
    }
    throw error
  }
}

// Export validated client environment variables
export const clientEnv = validateClientEnv()

// Type-safe client environment variables
export type ClientEnv = z.infer<typeof clientEnvSchema>
