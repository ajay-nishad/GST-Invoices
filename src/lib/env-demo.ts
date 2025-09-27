// This file demonstrates how to use environment variables in different contexts

// Client-side usage (browser)
export function clientSideExample() {
  // These will be available in the browser
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  const razorpayKeyId = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID

  console.log('Client-side environment variables:')
  console.log('Supabase URL:', supabaseUrl)
  console.log('Supabase Anon Key:', supabaseAnonKey ? 'Set' : 'Not set')
  console.log('Razorpay Key ID:', razorpayKeyId ? 'Set' : 'Not set')
}

// Server-side usage (API routes, Server Components)
export function serverSideExample() {
  // These are only available on the server
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
  const razorpayKeySecret = process.env.RAZORPAY_KEY_SECRET

  console.log('Server-side environment variables:')
  console.log('Supabase Service Key:', supabaseServiceKey ? 'Set' : 'Not set')
  console.log('Razorpay Key Secret:', razorpayKeySecret ? 'Set' : 'Not set')
}
