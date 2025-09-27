import { describe, it, expect } from 'vitest'
import {
  cn,
  getUserPlan,
  hasFeatureAccess,
  canAccessRoute,
  getInvoiceLimit,
  formatCurrency,
  formatDate,
  isValidEmail,
  generateInvoiceNumber,
  calculateGST,
  debounce,
  type Subscription,
  type PlanType,
} from './utils'

describe('Utils', () => {
  describe('cn', () => {
    it('should merge class names correctly', () => {
      expect(cn('class1', 'class2')).toBe('class1 class2')
      expect(cn('class1', null, 'class2')).toBe('class1 class2')
      expect(cn('px-2', 'px-4')).toBe('px-4') // tailwind-merge should handle conflicts
    })
  })

  describe('getUserPlan', () => {
    it('should return free plan for null subscription', () => {
      expect(getUserPlan(null)).toBe('free')
    })

    it('should return free plan for inactive subscription', () => {
      const subscription: Subscription = {
        id: '1',
        user_id: 'user1',
        plan_name: 'premium',
        status: 'inactive',
        price: 500,
        currency: 'INR',
        billing_cycle: 'monthly',
        started_at: '2024-01-01T00:00:00Z',
        expires_at: '2024-02-01T00:00:00Z',
        is_active: false,
      }
      expect(getUserPlan(subscription)).toBe('free')
    })

    it('should return free plan for expired subscription', () => {
      const subscription: Subscription = {
        id: '1',
        user_id: 'user1',
        plan_name: 'premium',
        status: 'active',
        price: 500,
        currency: 'INR',
        billing_cycle: 'monthly',
        started_at: '2024-01-01T00:00:00Z',
        expires_at: '2024-01-01T00:00:00Z', // Expired
        is_active: true,
      }
      expect(getUserPlan(subscription)).toBe('free')
    })

    it('should return premium plan for active premium subscription', () => {
      const subscription: Subscription = {
        id: '1',
        user_id: 'user1',
        plan_name: 'premium',
        status: 'active',
        price: 500,
        currency: 'INR',
        billing_cycle: 'monthly',
        started_at: '2024-01-01T00:00:00Z',
        expires_at: '2025-12-01T00:00:00Z', // Future date
        is_active: true,
      }
      expect(getUserPlan(subscription)).toBe('premium')
    })
  })

  describe('hasFeatureAccess', () => {
    it('should return correct access for free plan', () => {
      expect(hasFeatureAccess('free', 'analytics')).toBe(false)
      expect(hasFeatureAccess('free', 'bulkOperations')).toBe(false)
      expect(hasFeatureAccess('free', 'prioritySupport')).toBe(false)
      expect(hasFeatureAccess('free', 'apiAccess')).toBe(false)
    })

    it('should return correct access for premium plan', () => {
      expect(hasFeatureAccess('premium', 'analytics')).toBe(true)
      expect(hasFeatureAccess('premium', 'bulkOperations')).toBe(true)
      expect(hasFeatureAccess('premium', 'prioritySupport')).toBe(true)
      expect(hasFeatureAccess('premium', 'apiAccess')).toBe(true)
    })
  })

  describe('canAccessRoute', () => {
    it('should allow free plan to access basic routes', () => {
      expect(canAccessRoute('free', '/dashboard')).toBe(true)
      expect(canAccessRoute('free', '/invoices')).toBe(true)
      expect(canAccessRoute('free', '/customers')).toBe(true)
    })

    it('should restrict free plan from premium routes', () => {
      expect(canAccessRoute('free', '/analytics')).toBe(false)
      expect(canAccessRoute('free', '/settings')).toBe(false)
    })

    it('should allow premium plan to access all routes', () => {
      expect(canAccessRoute('premium', '/dashboard')).toBe(true)
      expect(canAccessRoute('premium', '/invoices')).toBe(true)
      expect(canAccessRoute('premium', '/analytics')).toBe(true)
      expect(canAccessRoute('premium', '/settings')).toBe(true)
    })
  })

  describe('getInvoiceLimit', () => {
    it('should return correct limits for each plan', () => {
      expect(getInvoiceLimit('free')).toBe(10)
      expect(getInvoiceLimit('premium')).toBe(Infinity)
    })
  })

  describe('formatCurrency', () => {
    it('should format currency correctly', () => {
      expect(formatCurrency(500)).toBe('₹500.00')
      expect(formatCurrency(1500.5)).toBe('₹1,500.50')
    })

    it('should handle different currencies', () => {
      expect(formatCurrency(100, 'USD')).toContain('100.00')
    })
  })

  describe('formatDate', () => {
    it('should format date correctly', () => {
      const result = formatDate('2024-01-15T10:00:00Z')
      expect(result).toContain('2024')
      expect(result).toContain('January')
      expect(result).toContain('15')
    })
  })

  describe('isValidEmail', () => {
    it('should validate emails correctly', () => {
      expect(isValidEmail('test@example.com')).toBe(true)
      expect(isValidEmail('user@domain.co.in')).toBe(true)
      expect(isValidEmail('invalid-email')).toBe(false)
      expect(isValidEmail('test@')).toBe(false)
      expect(isValidEmail('@domain.com')).toBe(false)
    })
  })

  describe('generateInvoiceNumber', () => {
    it('should generate invoice number with default prefix', () => {
      const invoiceNumber = generateInvoiceNumber()
      expect(invoiceNumber).toMatch(/^INV-[A-Z0-9]+-[A-Z0-9]+$/)
    })

    it('should generate invoice number with custom prefix', () => {
      const invoiceNumber = generateInvoiceNumber('BILL')
      expect(invoiceNumber).toMatch(/^BILL-[A-Z0-9]+-[A-Z0-9]+$/)
    })

    it('should generate unique invoice numbers', () => {
      const invoice1 = generateInvoiceNumber()
      const invoice2 = generateInvoiceNumber()
      expect(invoice1).not.toBe(invoice2)
    })
  })

  describe('calculateGST', () => {
    it('should calculate GST correctly', () => {
      const result = calculateGST(1000, 18)
      expect(result.cgst).toBe(90) // 18% of 1000 / 2
      expect(result.sgst).toBe(90) // 18% of 1000 / 2
      expect(result.igst).toBe(180) // 18% of 1000
      expect(result.total).toBe(1180) // 1000 + 180
    })

    it('should handle zero GST rate', () => {
      const result = calculateGST(1000, 0)
      expect(result.cgst).toBe(0)
      expect(result.sgst).toBe(0)
      expect(result.igst).toBe(0)
      expect(result.total).toBe(1000)
    })
  })

  describe('debounce', () => {
    it('should debounce function calls', async () => {
      let callCount = 0
      const debouncedFn = debounce(() => {
        callCount++
      }, 100)

      // Call multiple times quickly
      debouncedFn()
      debouncedFn()
      debouncedFn()

      expect(callCount).toBe(0) // Should not have been called yet

      // Wait for debounce delay
      await new Promise((resolve) => setTimeout(resolve, 150))
      expect(callCount).toBe(1) // Should have been called once
    })
  })
})
