/**
 * Razorpay configuration
 * Uses environment variables validated by Zod
 */

import Razorpay from 'razorpay'
import { serverEnv } from '@/env.server'

// Create Razorpay instance for server-side usage
export const razorpay = new Razorpay({
  key_id: serverEnv.RAZORPAY_KEY_ID,
  key_secret: serverEnv.RAZORPAY_KEY_SECRET,
})

// Razorpay types
export interface RazorpayOrder {
  id: string
  amount: number
  currency: string
  receipt: string
  status: string
  created_at: number
}

export interface RazorpayPayment {
  id: string
  order_id: string
  amount: number
  currency: string
  status: string
  method: string
  created_at: number
}

// Utility functions for Razorpay operations
export const razorpayUtils = {
  /**
   * Create a new order
   */
  async createOrder(
    amount: number,
    currency: string = 'INR',
    receipt?: string
  ) {
    const options = {
      amount: amount * 100, // Razorpay expects amount in paise
      currency,
      receipt: receipt || `receipt_${Date.now()}`,
    }

    return await razorpay.orders.create(options)
  },

  /**
   * Verify payment signature
   */
  verifyPaymentSignature(
    razorpayOrderId: string,
    razorpayPaymentId: string,
    razorpaySignature: string
  ) {
    const crypto = require('crypto')
    const expectedSignature = crypto
      .createHmac('sha256', serverEnv.RAZORPAY_KEY_SECRET)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest('hex')

    return expectedSignature === razorpaySignature
  },

  /**
   * Get order details
   */
  async getOrder(orderId: string) {
    return await razorpay.orders.fetch(orderId)
  },

  /**
   * Get payment details
   */
  async getPayment(paymentId: string) {
    return await razorpay.payments.fetch(paymentId)
  },
}
