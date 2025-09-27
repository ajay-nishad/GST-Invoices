import { test, expect } from '@playwright/test'
import {
  TestHelpers,
  generateTestUser,
  generateTestBusiness,
  generateTestCustomer,
  generateTestItem,
} from './test-helpers'

test.describe('Plan-based Access Control', () => {
  let helpers: TestHelpers

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page)
  })

  test('Free plan restrictions - analytics and settings blocked', async ({
    page,
  }) => {
    const testUser = generateTestUser('free-user')

    // Sign up as free user
    await helpers.signUp(testUser)

    // Verify free user restrictions
    await helpers.verifyFreeRestrictions()

    // Verify basic features are accessible
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/dashboard')

    await page.goto('/invoices')
    await expect(page).toHaveURL('/invoices')

    await page.goto('/customers')
    await expect(page).toHaveURL('/customers')

    await page.goto('/businesses')
    await expect(page).toHaveURL('/businesses')

    await page.goto('/items')
    await expect(page).toHaveURL('/items')
  })

  test('Premium plan access - all features available', async ({ page }) => {
    const testUser = generateTestUser('premium-user')

    // Sign up and upgrade to premium
    await helpers.signUp(testUser)
    await helpers.upgradeToPremium()

    // Verify premium access
    await helpers.verifyPremiumAccess()

    // Verify all basic features are still accessible
    const allRoutes = [
      '/dashboard',
      '/invoices',
      '/customers',
      '/businesses',
      '/items',
      '/analytics',
      '/settings',
    ]

    for (const route of allRoutes) {
      await page.goto(route)
      await expect(page).toHaveURL(route)
    }
  })

  test('Middleware correctly redirects based on plan', async ({ page }) => {
    const testUser = generateTestUser('middleware-test')

    // Test unauthenticated access
    await page.goto('/analytics')
    await expect(page).toHaveURL(/\/auth\/signin/)

    await page.goto('/settings')
    await expect(page).toHaveURL(/\/auth\/signin/)

    // Sign up (free plan)
    await helpers.signUp(testUser)

    // Test free plan restrictions
    await page.goto('/analytics')
    await expect(page).toHaveURL(
      /\/pricing\?upgrade=required&feature=analytics/
    )

    await page.goto('/settings')
    await expect(page).toHaveURL(/\/pricing\?upgrade=required&feature=settings/)

    // Upgrade to premium
    await helpers.upgradeToPremium()

    // Test premium access
    await page.goto('/analytics')
    await expect(page).toHaveURL('/analytics')

    await page.goto('/settings')
    await expect(page).toHaveURL('/settings')
  })
})

test.describe('Feature Limits by Plan', () => {
  let helpers: TestHelpers

  test.beforeEach(async ({ page }) => {
    helpers = new TestHelpers(page)
  })

  test('Free plan invoice limit enforcement', async ({ page }) => {
    const testUser = generateTestUser('invoice-limit')
    const testBusiness = generateTestBusiness('limit-test')
    const testCustomer = generateTestCustomer('limit-test')
    const testItem = generateTestItem('limit-test')

    await helpers.signUp(testUser)
    await helpers.createBusiness(testBusiness)
    await helpers.createCustomer(testCustomer)
    await helpers.createItem(testItem)

    // Create invoices up to free limit (10)
    const invoiceIds: string[] = []
    for (let i = 0; i < 10; i++) {
      const invoiceId = await helpers.createInvoice(
        testCustomer.name,
        testItem.name
      )
      invoiceIds.push(invoiceId)
    }

    // Verify 10 invoices were created
    await page.goto('/invoices')
    const invoiceRows = page.locator('[data-testid="invoice-row"]')
    await expect(invoiceRows).toHaveCount(10)

    // Attempt to create 11th invoice should show upgrade prompt
    await page.goto('/invoices/new')

    // Should show upgrade modal or redirect to pricing
    await expect(
      page
        .locator('[data-testid="upgrade-modal"]')
        .or(page.locator('text=Upgrade to Premium'))
    ).toBeVisible()
  })

  test('Premium plan unlimited invoices', async ({ page }) => {
    const testUser = generateTestUser('premium-unlimited')
    const testBusiness = generateTestBusiness('unlimited-test')
    const testCustomer = generateTestCustomer('unlimited-test')
    const testItem = generateTestItem('unlimited-test')

    await helpers.signUp(testUser)
    await helpers.upgradeToPremium()
    await helpers.createBusiness(testBusiness)
    await helpers.createCustomer(testCustomer)
    await helpers.createItem(testItem)

    // Create more than 10 invoices (premium should allow unlimited)
    const invoiceIds: string[] = []
    for (let i = 0; i < 15; i++) {
      const invoiceId = await helpers.createInvoice(
        testCustomer.name,
        testItem.name
      )
      invoiceIds.push(invoiceId)
    }

    // Verify all invoices were created
    await page.goto('/invoices')
    const invoiceRows = page.locator('[data-testid="invoice-row"]')
    await expect(invoiceRows).toHaveCount(15)

    // Should still be able to create more
    await page.goto('/invoices/new')
    await expect(page.locator('[data-testid="invoice-form"]')).toBeVisible()
  })
})
