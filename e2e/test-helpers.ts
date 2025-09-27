import { Page, expect } from '@playwright/test'

export interface TestUser {
  email: string
  password: string
  fullName: string
}

export interface TestBusiness {
  name: string
  gstNumber: string
  address: string
  city: string
  state: string
  pincode: string
}

export interface TestCustomer {
  name: string
  email: string
  phone: string
  address: string
  city: string
  state: string
  pincode: string
}

export interface TestItem {
  name: string
  description: string
  price: number
  gstRate: number
  hsnCode: string
}

export class TestHelpers {
  constructor(private page: Page) {}

  async signUp(user: TestUser) {
    await this.page.goto('/auth/signup')

    // Wait for form to be visible
    await expect(this.page.locator('[data-testid="signup-form"]')).toBeVisible()

    await this.page.fill('[data-testid="email"]', user.email)
    await this.page.fill('[data-testid="password"]', user.password)
    await this.page.fill('[data-testid="full-name"]', user.fullName)

    await this.page.click('[data-testid="signup-button"]')

    // Wait for redirect to dashboard
    await this.page.waitForURL('/dashboard', { timeout: 10000 })

    // Verify successful signup
    await expect(this.page.locator('[data-testid="user-menu"]')).toBeVisible()
  }

  async signIn(email: string, password: string) {
    await this.page.goto('/auth/signin')

    await expect(this.page.locator('[data-testid="signin-form"]')).toBeVisible()

    await this.page.fill('[data-testid="email"]', email)
    await this.page.fill('[data-testid="password"]', password)

    await this.page.click('[data-testid="signin-button"]')

    await this.page.waitForURL('/dashboard', { timeout: 10000 })
    await expect(this.page.locator('[data-testid="user-menu"]')).toBeVisible()
  }

  async signOut() {
    await this.page.click('[data-testid="user-menu"]')
    await this.page.click('[data-testid="sign-out"]')

    await this.page.waitForURL('/', { timeout: 5000 })
  }

  async createBusiness(business: TestBusiness) {
    await this.page.goto('/businesses/new')

    await expect(
      this.page.locator('[data-testid="business-form"]')
    ).toBeVisible()

    await this.page.fill('[data-testid="business-name"]', business.name)
    await this.page.fill('[data-testid="gst-number"]', business.gstNumber)
    await this.page.fill('[data-testid="address"]', business.address)
    await this.page.fill('[data-testid="city"]', business.city)
    await this.page.fill('[data-testid="state"]', business.state)
    await this.page.fill('[data-testid="pincode"]', business.pincode)

    await this.page.click('[data-testid="save-business"]')

    // Wait for redirect and success
    await this.page.waitForURL('/businesses', { timeout: 5000 })
    await expect(this.page.locator(`text=${business.name}`)).toBeVisible()
  }

  async createCustomer(customer: TestCustomer) {
    await this.page.goto('/customers/new')

    await expect(
      this.page.locator('[data-testid="customer-form"]')
    ).toBeVisible()

    await this.page.fill('[data-testid="customer-name"]', customer.name)
    await this.page.fill('[data-testid="customer-email"]', customer.email)
    await this.page.fill('[data-testid="customer-phone"]', customer.phone)
    await this.page.fill('[data-testid="customer-address"]', customer.address)
    await this.page.fill('[data-testid="customer-city"]', customer.city)
    await this.page.fill('[data-testid="customer-state"]', customer.state)
    await this.page.fill('[data-testid="customer-pincode"]', customer.pincode)

    await this.page.click('[data-testid="save-customer"]')

    await this.page.waitForURL('/customers', { timeout: 5000 })
    await expect(this.page.locator(`text=${customer.name}`)).toBeVisible()
  }

  async createItem(item: TestItem) {
    await this.page.goto('/items/new')

    await expect(this.page.locator('[data-testid="item-form"]')).toBeVisible()

    await this.page.fill('[data-testid="item-name"]', item.name)
    await this.page.fill('[data-testid="item-description"]', item.description)
    await this.page.fill('[data-testid="item-price"]', item.price.toString())
    await this.page.fill('[data-testid="gst-rate"]', item.gstRate.toString())
    await this.page.fill('[data-testid="hsn-code"]', item.hsnCode)

    await this.page.click('[data-testid="save-item"]')

    await this.page.waitForURL('/items', { timeout: 5000 })
    await expect(this.page.locator(`text=${item.name}`)).toBeVisible()
  }

  async createInvoice(
    customerName: string,
    itemName: string,
    quantity: number = 1
  ): Promise<string> {
    await this.page.goto('/invoices/new')

    await expect(
      this.page.locator('[data-testid="invoice-form"]')
    ).toBeVisible()

    // Select customer
    await this.page.click('[data-testid="customer-select"]')
    await this.page.click(`[data-testid="customer-option-${customerName}"]`)

    // Add item
    await this.page.click('[data-testid="add-item"]')
    await this.page.click('[data-testid="item-select"]')
    await this.page.click(`[data-testid="item-option-${itemName}"]`)
    await this.page.fill('[data-testid="item-quantity"]', quantity.toString())

    // Save invoice
    await this.page.click('[data-testid="save-invoice"]')

    // Wait for redirect to invoice detail page
    await this.page.waitForURL(/\/invoices\/[a-zA-Z0-9-]+/, { timeout: 10000 })

    // Verify invoice was created
    await expect(this.page.locator(`text=${customerName}`)).toBeVisible()
    await expect(this.page.locator(`text=${itemName}`)).toBeVisible()

    // Extract and return invoice ID from URL
    const url = this.page.url()
    const invoiceId = url.split('/').pop()!
    return invoiceId
  }

  async exportInvoicePDF(invoiceId: string) {
    await this.page.goto(`/invoices/${invoiceId}`)

    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.page.click('[data-testid="export-pdf"]'),
    ])

    expect(download.suggestedFilename()).toMatch(/\.pdf$/)
    return download
  }

  async exportInvoiceExcel(invoiceId: string) {
    await this.page.goto(`/invoices/${invoiceId}`)

    const [download] = await Promise.all([
      this.page.waitForEvent('download'),
      this.page.click('[data-testid="export-excel"]'),
    ])

    expect(download.suggestedFilename()).toMatch(/\.xlsx$/)
    return download
  }

  async emailInvoice(
    invoiceId: string,
    email: string,
    subject: string,
    message: string
  ) {
    await this.page.goto(`/invoices/${invoiceId}`)

    await this.page.click('[data-testid="email-invoice"]')

    // Wait for email dialog
    await expect(
      this.page.locator('[data-testid="email-dialog"]')
    ).toBeVisible()

    await this.page.fill('[data-testid="email-to"]', email)
    await this.page.fill('[data-testid="email-subject"]', subject)
    await this.page.fill('[data-testid="email-message"]', message)

    await this.page.click('[data-testid="send-email"]')

    // Wait for success message
    await expect(
      this.page.locator('[data-testid="success-message"]')
    ).toBeVisible()
    await expect(
      this.page.locator('text=Email sent successfully')
    ).toBeVisible()
  }

  async upgradeToPremium() {
    await this.page.goto('/pricing')

    await expect(
      this.page.locator('[data-testid="pricing-cards"]')
    ).toBeVisible()

    // Click upgrade button for premium plan
    await this.page.click('[data-testid="upgrade-premium"]')

    // In a real scenario, this would handle Razorpay payment flow
    // For testing, we'll assume the payment is successful and the subscription is updated
    // This would typically be mocked or handled through test database seeding

    // Wait for redirect to success page or dashboard
    await this.page.waitForURL(/\/(dashboard|settings|success)/, {
      timeout: 10000,
    })
  }

  async verifyPremiumAccess() {
    // Check that premium routes are accessible
    const premiumRoutes = ['/analytics', '/settings']

    for (const route of premiumRoutes) {
      await this.page.goto(route)
      await expect(this.page).toHaveURL(route)

      // Verify the page content loads (not a redirect to pricing)
      await expect(
        this.page.locator('[data-testid="page-content"]')
      ).toBeVisible()
    }
  }

  async verifyFreeRestrictions() {
    // Check that premium routes redirect to pricing
    const premiumRoutes = ['/analytics', '/settings']

    for (const route of premiumRoutes) {
      await this.page.goto(route)
      await expect(this.page).toHaveURL(/\/pricing\?upgrade=required/)
    }
  }

  async waitForToast(message: string) {
    await expect(
      this.page.locator(`[data-testid="toast"]:has-text("${message}")`)
    ).toBeVisible()
  }

  async fillForm(formData: Record<string, string>) {
    for (const [field, value] of Object.entries(formData)) {
      await this.page.fill(`[data-testid="${field}"]`, value)
    }
  }

  async clickAndWaitForNavigation(
    selector: string,
    expectedUrl: string | RegExp
  ) {
    await Promise.all([
      this.page.waitForURL(expectedUrl, { timeout: 10000 }),
      this.page.click(selector),
    ])
  }
}

// Test data generators
export function generateTestUser(suffix?: string): TestUser {
  const timestamp = Date.now()
  const uniqueId = suffix || timestamp.toString()

  return {
    email: `test-${uniqueId}@example.com`,
    password: 'TestPassword123!',
    fullName: `Test User ${uniqueId}`,
  }
}

export function generateTestBusiness(suffix?: string): TestBusiness {
  const uniqueId = suffix || Date.now().toString()

  return {
    name: `Test Business ${uniqueId}`,
    gstNumber: '27AABCU9603R1ZX',
    address: `${uniqueId} Test Street`,
    city: 'Test City',
    state: 'Test State',
    pincode: '123456',
  }
}

export function generateTestCustomer(suffix?: string): TestCustomer {
  const uniqueId = suffix || Date.now().toString()

  return {
    name: `Test Customer ${uniqueId}`,
    email: `customer-${uniqueId}@test.com`,
    phone: '9876543210',
    address: `${uniqueId} Customer Street`,
    city: 'Customer City',
    state: 'Customer State',
    pincode: '654321',
  }
}

export function generateTestItem(suffix?: string): TestItem {
  const uniqueId = suffix || Date.now().toString()

  return {
    name: `Test Product ${uniqueId}`,
    description: `A test product for e2e testing ${uniqueId}`,
    price: 1000,
    gstRate: 18,
    hsnCode: '1234',
  }
}
