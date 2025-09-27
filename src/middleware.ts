import { createServerClient } from '@supabase/ssr'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getUserPlan, canAccessRoute, type Subscription } from '@/lib/utils'

export async function middleware(req: NextRequest) {
  let res = NextResponse.next({
    request: {
      headers: req.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        get(name: string) {
          return req.cookies.get(name)?.value
        },
        set(name: string, value: string, options: any) {
          req.cookies.set({
            name,
            value,
            ...options,
          })
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          res.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: any) {
          req.cookies.set({
            name,
            value: '',
            ...options,
          })
          res = NextResponse.next({
            request: {
              headers: req.headers,
            },
          })
          res.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    }
  )

  const {
    data: { session },
  } = await supabase.auth.getSession()

  const pathname = req.nextUrl.pathname

  // Protected routes that require authentication
  const protectedRoutes = [
    '/dashboard',
    '/invoices',
    '/analytics',
    '/settings',
    '/businesses',
    '/customers',
    '/items',
  ]
  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  )

  // Auth routes that should redirect if already authenticated
  const authRoutes = ['/auth/signin', '/auth/signup']
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route))

  // Redirect to sign in if accessing protected route without session
  if (isProtectedRoute && !session) {
    const redirectUrl = new URL('/auth/signin', req.url)
    redirectUrl.searchParams.set('redirectTo', pathname)
    return NextResponse.redirect(redirectUrl)
  }

  // Redirect to dashboard if accessing auth routes with session
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL('/dashboard', req.url))
  }

  // Plan-based route gating
  if (session && isProtectedRoute) {
    try {
      // Get user's subscription
      const { data: subscription } = await (supabase as any)
        .from('subscriptions')
        .select('*')
        .eq('user_id', session.user.id)
        .eq('is_active', true)
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      const userPlan = getUserPlan(subscription as Subscription | null)

      // Check if user can access the route based on their plan
      if (!canAccessRoute(userPlan, pathname)) {
        const upgradeUrl = new URL('/pricing', req.url)
        upgradeUrl.searchParams.set('upgrade', 'required')
        upgradeUrl.searchParams.set('feature', pathname.split('/')[1])
        return NextResponse.redirect(upgradeUrl)
      }

      // Add plan info to headers for downstream use
      res.headers.set('x-user-plan', userPlan)
      res.headers.set('x-subscription-status', subscription?.status || 'none')
    } catch (error) {
      console.error('Error checking subscription:', error)
      // In case of error, treat as free plan
      if (!canAccessRoute('free', pathname)) {
        const upgradeUrl = new URL('/pricing', req.url)
        upgradeUrl.searchParams.set('upgrade', 'required')
        upgradeUrl.searchParams.set('feature', pathname.split('/')[1])
        return NextResponse.redirect(upgradeUrl)
      }
    }
  }

  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
