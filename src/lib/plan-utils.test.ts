import { describe, it, expect } from 'vitest'
import {
  getUserPlan,
  hasFeatureAccess,
  canAccessRoute,
  getInvoiceLimit,
  PLAN_FEATURES,
  type Subscription,
  type PlanType,
} from './utils'

describe('Plan Management Integration', () => {
  const mockFreeSubscription: Subscription = {
    id: 'sub-1',
    user_id: 'user-1',
    plan_name: 'free',
    status: 'inactive',
    price: 0,
    currency: 'INR',
    billing_cycle: 'monthly',
    started_at: '2024-01-01T00:00:00Z',
    expires_at: null,
    is_active: false,
  }

  const mockPremiumSubscription: Subscription = {
    id: 'sub-2',
    user_id: 'user-2',
    plan_name: 'premium',
    status: 'active',
    price: 500,
    currency: 'INR',
    billing_cycle: 'monthly',
    started_at: '2024-01-01T00:00:00Z',
    expires_at: '2025-12-01T00:00:00Z',
    is_active: true,
  }

  const mockExpiredSubscription: Subscription = {
    id: 'sub-3',
    user_id: 'user-3',
    plan_name: 'premium',
    status: 'active',
    price: 500,
    currency: 'INR',
    billing_cycle: 'monthly',
    started_at: '2024-01-01T00:00:00Z',
    expires_at: '2024-01-01T00:00:00Z', // Expired
    is_active: true,
  }

  describe('Plan Feature Matrix', () => {
    it('should correctly define feature availability for free plan', () => {
      expect(PLAN_FEATURES.free.invoices).toBe(10)
      expect(PLAN_FEATURES.free.analytics).toBe(false)
      expect(PLAN_FEATURES.free.bulkOperations).toBe(false)
      expect(PLAN_FEATURES.free.prioritySupport).toBe(false)
      expect(PLAN_FEATURES.free.apiAccess).toBe(false)
    })

    it('should correctly define feature availability for premium plan', () => {
      expect(PLAN_FEATURES.premium.invoices).toBe(Infinity)
      expect(PLAN_FEATURES.premium.analytics).toBe(true)
      expect(PLAN_FEATURES.premium.bulkOperations).toBe(true)
      expect(PLAN_FEATURES.premium.prioritySupport).toBe(true)
      expect(PLAN_FEATURES.premium.apiAccess).toBe(true)
    })
  })

  describe('Plan Resolution Logic', () => {
    it('should resolve to free plan for various inactive scenarios', () => {
      expect(getUserPlan(null)).toBe('free')
      expect(getUserPlan(mockFreeSubscription)).toBe('free')
      expect(getUserPlan(mockExpiredSubscription)).toBe('free')
    })

    it('should resolve to premium plan for active premium subscription', () => {
      expect(getUserPlan(mockPremiumSubscription)).toBe('premium')
    })
  })

  describe('Feature Access Control', () => {
    const testCases: Array<{
      plan: PlanType
      feature: keyof typeof PLAN_FEATURES.free
      expected: boolean
      description: string
    }> = [
      {
        plan: 'free',
        feature: 'analytics',
        expected: false,
        description: 'free plan should not have analytics',
      },
      {
        plan: 'free',
        feature: 'bulkOperations',
        expected: false,
        description: 'free plan should not have bulk operations',
      },
      {
        plan: 'premium',
        feature: 'analytics',
        expected: true,
        description: 'premium plan should have analytics',
      },
      {
        plan: 'premium',
        feature: 'bulkOperations',
        expected: true,
        description: 'premium plan should have bulk operations',
      },
      {
        plan: 'premium',
        feature: 'prioritySupport',
        expected: true,
        description: 'premium plan should have priority support',
      },
      {
        plan: 'premium',
        feature: 'apiAccess',
        expected: true,
        description: 'premium plan should have API access',
      },
    ]

    testCases.forEach(({ plan, feature, expected, description }) => {
      it(description, () => {
        expect(hasFeatureAccess(plan, feature)).toBe(expected)
      })
    })
  })

  describe('Route Access Control', () => {
    const routeTestCases: Array<{
      plan: PlanType
      route: string
      expected: boolean
      description: string
    }> = [
      {
        plan: 'free',
        route: '/dashboard',
        expected: true,
        description: 'free plan should access dashboard',
      },
      {
        plan: 'free',
        route: '/invoices',
        expected: true,
        description: 'free plan should access invoices',
      },
      {
        plan: 'free',
        route: '/customers',
        expected: true,
        description: 'free plan should access customers',
      },
      {
        plan: 'free',
        route: '/analytics',
        expected: false,
        description: 'free plan should not access analytics',
      },
      {
        plan: 'free',
        route: '/settings',
        expected: false,
        description: 'free plan should not access settings',
      },
      {
        plan: 'premium',
        route: '/dashboard',
        expected: true,
        description: 'premium plan should access dashboard',
      },
      {
        plan: 'premium',
        route: '/invoices',
        expected: true,
        description: 'premium plan should access invoices',
      },
      {
        plan: 'premium',
        route: '/analytics',
        expected: true,
        description: 'premium plan should access analytics',
      },
      {
        plan: 'premium',
        route: '/settings',
        expected: true,
        description: 'premium plan should access settings',
      },
    ]

    routeTestCases.forEach(({ plan, route, expected, description }) => {
      it(description, () => {
        expect(canAccessRoute(plan, route)).toBe(expected)
      })
    })
  })

  describe('Invoice Limits', () => {
    it('should return correct invoice limits for each plan', () => {
      expect(getInvoiceLimit('free')).toBe(10)
      expect(getInvoiceLimit('premium')).toBe(Infinity)
    })
  })

  describe('End-to-End Plan Flow', () => {
    it('should handle complete free user flow', () => {
      // User with no subscription
      const plan = getUserPlan(null)
      expect(plan).toBe('free')

      // Check feature access
      expect(hasFeatureAccess(plan, 'analytics')).toBe(false)
      expect(hasFeatureAccess(plan, 'bulkOperations')).toBe(false)

      // Check route access
      expect(canAccessRoute(plan, '/dashboard')).toBe(true)
      expect(canAccessRoute(plan, '/analytics')).toBe(false)

      // Check limits
      expect(getInvoiceLimit(plan)).toBe(10)
    })

    it('should handle complete premium user flow', () => {
      // User with active premium subscription
      const plan = getUserPlan(mockPremiumSubscription)
      expect(plan).toBe('premium')

      // Check feature access
      expect(hasFeatureAccess(plan, 'analytics')).toBe(true)
      expect(hasFeatureAccess(plan, 'bulkOperations')).toBe(true)
      expect(hasFeatureAccess(plan, 'prioritySupport')).toBe(true)

      // Check route access
      expect(canAccessRoute(plan, '/dashboard')).toBe(true)
      expect(canAccessRoute(plan, '/analytics')).toBe(true)
      expect(canAccessRoute(plan, '/settings')).toBe(true)

      // Check limits
      expect(getInvoiceLimit(plan)).toBe(Infinity)
    })

    it('should handle subscription expiry correctly', () => {
      // User with expired premium subscription should be treated as free
      const plan = getUserPlan(mockExpiredSubscription)
      expect(plan).toBe('free')

      // Should have free plan restrictions
      expect(hasFeatureAccess(plan, 'analytics')).toBe(false)
      expect(canAccessRoute(plan, '/analytics')).toBe(false)
      expect(getInvoiceLimit(plan)).toBe(10)
    })
  })
})
