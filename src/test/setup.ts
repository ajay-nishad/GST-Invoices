import { beforeAll, vi } from 'vitest'

// Mock environment variables
beforeAll(() => {
  vi.stubEnv('NEXT_PUBLIC_SUPABASE_URL', 'http://localhost:54321')
  vi.stubEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY', 'test-anon-key')
  vi.stubEnv('SUPABASE_SERVICE_ROLE_KEY', 'test-service-key')
  vi.stubEnv('RAZORPAY_KEY_ID', 'test-razorpay-key')
  vi.stubEnv('RAZORPAY_KEY_SECRET', 'test-razorpay-secret')
})
