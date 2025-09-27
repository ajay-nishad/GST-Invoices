import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// Plan management types
export type PlanType = 'free' | 'premium'
export type SubscriptionStatus = 'active' | 'inactive' | 'cancelled' | 'expired'

export interface Subscription {
  id: string
  user_id: string
  plan_name: string
  status: SubscriptionStatus
  price: number
  currency: string
  billing_cycle: string
  started_at: string
  expires_at: string | null
  is_active: boolean
}

// Plan feature definitions
export const PLAN_FEATURES = {
  free: {
    invoices: 10, // per month
    analytics: false,
    bulkOperations: false,
    prioritySupport: false,
    apiAccess: false,
  },
  premium: {
    invoices: Infinity,
    analytics: true,
    bulkOperations: true,
    prioritySupport: true,
    apiAccess: true,
  },
} as const

// Plan utility functions
export function getUserPlan(subscription: Subscription | null): PlanType {
  if (
    !subscription ||
    !subscription.is_active ||
    subscription.status !== 'active'
  ) {
    return 'free'
  }

  // Check if subscription is expired
  if (
    subscription.expires_at &&
    new Date(subscription.expires_at) < new Date()
  ) {
    return 'free'
  }

  return subscription.plan_name === 'premium' ? 'premium' : 'free'
}

export function hasFeatureAccess(
  plan: PlanType,
  feature: keyof typeof PLAN_FEATURES.free
): boolean {
  return (
    PLAN_FEATURES[plan][feature] === true ||
    PLAN_FEATURES[plan][feature] === Infinity
  )
}

export function canAccessRoute(plan: PlanType, route: string): boolean {
  const premiumRoutes = ['/analytics', '/settings']

  if (premiumRoutes.some((premiumRoute) => route.startsWith(premiumRoute))) {
    return plan === 'premium'
  }

  return true // All other routes are accessible to both plans
}

export function getInvoiceLimit(plan: PlanType): number {
  return PLAN_FEATURES[plan].invoices
}

export function formatCurrency(
  amount: number,
  currency: string = 'INR'
): string {
  const formatter = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: currency,
  })
  return formatter.format(amount)
}

export function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('en-IN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export function generateInvoiceNumber(prefix: string = 'INV'): string {
  const timestamp = Date.now().toString(36)
  const random = Math.random().toString(36).substring(2, 8)
  return `${prefix}-${timestamp}-${random}`.toUpperCase()
}

export function calculateGST(
  amount: number,
  gstRate: number
): {
  cgst: number
  sgst: number
  igst: number
  total: number
} {
  const gstAmount = (amount * gstRate) / 100
  const cgst = gstAmount / 2
  const sgst = gstAmount / 2
  const igst = gstAmount // For interstate transactions

  return {
    cgst,
    sgst,
    igst,
    total: amount + gstAmount,
  }
}

export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout
  return (...args: Parameters<T>) => {
    clearTimeout(timeout)
    timeout = setTimeout(() => func(...args), wait)
  }
}
