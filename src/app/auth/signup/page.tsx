import { redirectIfAuthenticated } from '@/lib/auth'
import { SignupForm } from '@/components/signup-form'

/**
 * Signup page - redirects to dashboard if already authenticated
 */
export default async function SignupPage() {
  // Redirect to dashboard if already authenticated
  await redirectIfAuthenticated()

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900 dark:text-white">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
            Start managing your GST invoices today
          </p>
        </div>
        <SignupForm />
      </div>
    </div>
  )
}
