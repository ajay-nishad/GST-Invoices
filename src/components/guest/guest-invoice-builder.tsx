'use client'

import { SignupBanner } from './signup-banner'
import { GuestInvoiceForm } from './guest-invoice-form'

export function GuestInvoiceBuilder() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Signup Banner */}
      <SignupBanner />

      {/* Guest Invoice Form */}
      <GuestInvoiceForm isGuest={true} />
    </div>
  )
}
