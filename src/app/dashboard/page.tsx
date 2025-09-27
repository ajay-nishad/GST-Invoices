import { requireUserWithProfile } from '@/lib/auth'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { LogoutButton } from '@/components/logout-button'
import Link from 'next/link'

/**
 * Dashboard page - requires authentication
 * This is a server component that uses server-side auth
 */
export default async function DashboardPage() {
  try {
    // This will redirect to login if not authenticated
    const { user, profile } = await requireUserWithProfile()

    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Dashboard
              </h1>
              <p className="text-gray-600 dark:text-gray-300">
                Welcome back, {profile?.full_name || user.email}!
              </p>
            </div>
            <LogoutButton />
          </div>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  Total Invoices
                </CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M22 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">0</div>
                <p className="text-xs text-muted-foreground">
                  +0% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹0</div>
                <p className="text-xs text-muted-foreground">
                  +0% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Paid</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <rect width="20" height="14" x="2" y="5" rx="2" />
                  <path d="M2 10h20" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹0</div>
                <p className="text-xs text-muted-foreground">
                  +0% from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Overdue</CardTitle>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  className="h-4 w-4 text-muted-foreground"
                >
                  <circle cx="12" cy="12" r="10" />
                  <polyline points="12,6 12,12 16,14" />
                </svg>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">₹0</div>
                <p className="text-xs text-muted-foreground">
                  +0% from last month
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Create Invoice</CardTitle>
                <CardDescription>
                  Generate a new GST invoice for your client
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button className="w-full">Create New Invoice</Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Manage Clients</CardTitle>
                <CardDescription>
                  Add, edit, or view your client information
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  Manage Clients
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>View Reports</CardTitle>
                <CardDescription>
                  Generate detailed reports and analytics
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="outline" className="w-full">
                  View Reports
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* User Info Debug */}
          <Card className="mt-8">
            <CardHeader>
              <CardTitle>User Information</CardTitle>
              <CardDescription>
                Debug information about the current user
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 text-sm">
                <p>
                  <strong>User ID:</strong> {user.id}
                </p>
                <p>
                  <strong>Email:</strong> {user.email}
                </p>
                <p>
                  <strong>Full Name:</strong> {profile?.full_name || 'Not set'}
                </p>
                <p>
                  <strong>Created:</strong>{' '}
                  {new Date(user.created_at).toLocaleDateString()}
                </p>
                <p>
                  <strong>Last Sign In:</strong>{' '}
                  {user.last_sign_in_at
                    ? new Date(user.last_sign_in_at).toLocaleDateString()
                    : 'Never'}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  } catch (error) {
    // Handle case when Supabase is not configured
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
        <div className="container mx-auto px-4 py-8">
          <Card className="max-w-2xl mx-auto">
            <CardHeader>
              <CardTitle className="text-center">
                Supabase Not Configured
              </CardTitle>
              <CardDescription className="text-center">
                Please set up your Supabase credentials to access the dashboard
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md dark:bg-yellow-900/20 dark:border-yellow-800">
                <h3 className="font-medium text-yellow-800 dark:text-yellow-200 mb-2">
                  Setup Required
                </h3>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">
                  To use the authentication features, you need to:
                </p>
                <ol className="list-decimal list-inside text-sm text-yellow-700 dark:text-yellow-300 mt-2 space-y-1">
                  <li>Create a Supabase project</li>
                  <li>
                    Update your{' '}
                    <code className="bg-yellow-100 dark:bg-yellow-800 px-1 rounded">
                      .env.local
                    </code>{' '}
                    file with your credentials
                  </li>
                  <li>Set up the database schema</li>
                </ol>
              </div>

              <div className="text-center">
                <Button asChild>
                  <Link href="/">Back to Home</Link>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }
}
