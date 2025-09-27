import { test, expect, type Page } from '@playwright/test'

// Test data
const testUser = {
  email: `test-${Date.now()}@example.com`,
  password: 'TestPassword123!',
  fullName: 'Test User',
}

const testBusiness = {
  name: 'Test Business Ltd.',
  gstNumber: '27AABCU9603R1ZX',
  address: '123 Test Street',
  city: 'Test City',
  state: 'Test State',
  pincode: '123456',
}

const testCustomer = {
  name: 'Test Customer',
  email: 'customer@test.com',
  phone: '9876543210',
  address: '456 Customer Street',
  city: 'Customer City',
  state: 'Customer State',
  pincode: '654321',
}

const testItem = {
  name: 'Test Product',
  description: 'A test product for e2e testing',
  price: 1000,
  gstRate: 18,
  hsnCode: '1234',
}

// Helper functions
async function signUp(page: Page) {
  await page.goto('/auth/signup')
  await page.fill('[data-testid="email"]', testUser.email)
  await page.fill('[data-testid="password"]', testUser.password)
  await page.fill('[data-testid="full-name"]', testUser.fullName)
  await page.click('[data-testid="signup-button"]')

  // Wait for redirect to dashboard
  await page.waitForURL('/dashboard')
}

async function createBusiness(page: Page) {
  await page.goto('/businesses/new')
  await page.fill('[data-testid="business-name"]', testBusiness.name)
  await page.fill('[data-testid="gst-number"]', testBusiness.gstNumber)
  await page.fill('[data-testid="address"]', testBusiness.address)
  await page.fill('[data-testid="city"]', testBusiness.city)
  await page.fill('[data-testid="state"]', testBusiness.state)
  await page.fill('[data-testid="pincode"]', testBusiness.pincode)
  await page.click('[data-testid="save-business"]')

  // Wait for redirect to businesses list
  await page.waitForURL('/businesses')
  await expect(page.locator('text=' + testBusiness.name)).toBeVisible()
}

async function createCustomer(page: Page) {
  await page.goto('/customers/new')
  await page.fill('[data-testid="customer-name"]', testCustomer.name)
  await page.fill('[data-testid="customer-email"]', testCustomer.email)
  await page.fill('[data-testid="customer-phone"]', testCustomer.phone)
  await page.fill('[data-testid="customer-address"]', testCustomer.address)
  await page.fill('[data-testid="customer-city"]', testCustomer.city)
  await page.fill('[data-testid="customer-state"]', testCustomer.state)
  await page.fill('[data-testid="customer-pincode"]', testCustomer.pincode)
  await page.click('[data-testid="save-customer"]')

  await page.waitForURL('/customers')
  await expect(page.locator('text=' + testCustomer.name)).toBeVisible()
}

async function createItem(page: Page) {
  await page.goto('/items/new')
  await page.fill('[data-testid="item-name"]', testItem.name)
  await page.fill('[data-testid="item-description"]', testItem.description)
  await page.fill('[data-testid="item-price"]', testItem.price.toString())
  await page.fill('[data-testid="gst-rate"]', testItem.gstRate.toString())
  await page.fill('[data-testid="hsn-code"]', testItem.hsnCode)
  await page.click('[data-testid="save-item"]')

  await page.waitForURL('/items')
  await expect(page.locator('text=' + testItem.name)).toBeVisible()
}

async function createInvoice(page: Page) {
  await page.goto('/invoices/new')

  // Select customer
  await page.click('[data-testid="customer-select"]')
  await page.click(`text=${testCustomer.name}`)

  // Add item
  await page.click('[data-testid="add-item"]')
  await page.click('[data-testid="item-select"]')
  await page.click(`text=${testItem.name}`)
  await page.fill('[data-testid="item-quantity"]', '2')

  // Save invoice
  await page.click('[data-testid="save-invoice"]')

  // Should redirect to invoice detail page
  await page.waitForURL(/\/invoices\/[a-zA-Z0-9-]+/)

  // Verify invoice details
  await expect(page.locator('text=' + testCustomer.name)).toBeVisible()
  await expect(page.locator('text=' + testItem.name)).toBeVisible()
  await expect(page.locator('text=₹2,360.00')).toBeVisible() // 2 * 1000 * 1.18

  return page.url().split('/').pop() // Return invoice ID
}

async function exportInvoice(page: Page, invoiceId: string) {
  await page.goto(`/invoices/${invoiceId}`)

  // Test PDF export
  const [download] = await Promise.all([
    page.waitForEvent('download'),
    page.click('[data-testid="export-pdf"]'),
  ])

  expect(download.suggestedFilename()).toContain('.pdf')

  // Test Excel export
  const [excelDownload] = await Promise.all([
    page.waitForEvent('download'),
    page.click('[data-testid="export-excel"]'),
  ])

  expect(excelDownload.suggestedFilename()).toContain('.xlsx')
}

async function emailInvoice(page: Page, invoiceId: string) {
  await page.goto(`/invoices/${invoiceId}`)
  await page.click('[data-testid="email-invoice"]')

  // Fill email dialog
  await page.fill('[data-testid="email-to"]', testCustomer.email)
  await page.fill('[data-testid="email-subject"]', 'Your Invoice')
  await page.fill(
    '[data-testid="email-message"]',
    'Please find your invoice attached.'
  )

  await page.click('[data-testid="send-email"]')

  // Wait for success message
  await expect(page.locator('text=Email sent successfully')).toBeVisible()
}

async function upgradeToPremium(page: Page) {
  await page.goto('/pricing')

  // Click upgrade button for premium plan
  await page.click('[data-testid="upgrade-premium"]')

  // In a real test, we would handle Razorpay payment flow
  // For now, we'll mock the successful payment by directly updating the subscription
  // This would be done through a test API endpoint or database seeding

  // Verify upgrade success
  await page.goto('/settings')
  await expect(page.locator('text=Premium Plan')).toBeVisible()
}

async function verifyAnalyticsAccess(page: Page) {
  // Before upgrade, analytics should be restricted
  await page.goto('/analytics')
  await expect(page).toHaveURL('/pricing?upgrade=required&feature=analytics')

  // After upgrade, analytics should be accessible
  await upgradeToPremium(page)
  await page.goto('/analytics')
  await expect(page).toHaveURL('/analytics')

  // Verify analytics content is visible
  await expect(
    page.locator('[data-testid="analytics-dashboard"]')
  ).toBeVisible()
  await expect(page.locator('text=Revenue Analytics')).toBeVisible()
}

test.describe('Happy Path E2E Test', () => {
  test('Complete user journey: signup → business → invoice → export → email → upgrade → analytics', async ({
    page,
  }) => {
    // Step 1: Sign up
    await signUp(page)

    // Step 2: Create business
    await createBusiness(page)

    // Step 3: Create customer
    await createCustomer(page)

    // Step 4: Create item
    await createItem(page)

    // Step 5: Create invoice
    const invoiceId = await createInvoice(page)

    // Step 6: Export invoice
    await exportInvoice(page, invoiceId!)

    // Step 7: Email invoice
    await emailInvoice(page, invoiceId!)

    // Step 8: Verify analytics restriction and upgrade
    await verifyAnalyticsAccess(page)

    // Final verification: Check dashboard shows all created entities
    await page.goto('/dashboard')
    await expect(page.locator('[data-testid="recent-invoices"]')).toBeVisible()
    await expect(page.locator('[data-testid="stats-cards"]')).toBeVisible()

    // Verify premium features are now accessible
    await page.goto('/settings')
    await expect(page.locator('text=Premium Plan')).toBeVisible()

    await page.goto('/analytics')
    await expect(
      page.locator('[data-testid="analytics-dashboard"]')
    ).toBeVisible()
  })
})

test.describe('Plan-based Access Control', () => {
  test('Free plan restrictions', async ({ page }) => {
    await signUp(page)

    // Analytics should be restricted for free users
    await page.goto('/analytics')
    await expect(page).toHaveURL('/pricing?upgrade=required&feature=analytics')

    // Settings should be restricted for free users
    await page.goto('/settings')
    await expect(page).toHaveURL('/pricing?upgrade=required&feature=settings')

    // Basic features should be accessible
    await page.goto('/dashboard')
    await expect(page).toHaveURL('/dashboard')

    await page.goto('/invoices')
    await expect(page).toHaveURL('/invoices')

    await page.goto('/customers')
    await expect(page).toHaveURL('/customers')
  })

  test('Premium plan access', async ({ page }) => {
    await signUp(page)
    await upgradeToPremium(page)

    // All features should be accessible for premium users
    const routes = [
      '/dashboard',
      '/invoices',
      '/analytics',
      '/settings',
      '/customers',
      '/businesses',
      '/items',
    ]

    for (const route of routes) {
      await page.goto(route)
      await expect(page).toHaveURL(route)
    }
  })
})
