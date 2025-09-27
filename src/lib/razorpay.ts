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

export interface RazorpayPlan {
  id: string
  item: {
    name: string
    description: string
    amount: number
    currency: string
  }
  period: string
  interval: number
  created_at: number
}

export interface RazorpaySubscription {
  id: string
  plan_id: string
  status: string
  current_start: number
  current_end: number
  ended_at: number | null
  quantity: number
  notes: Record<string, any>
  charge_at: number
  start_at: number
  end_at: number
  auth_attempts: number
  total_count: number
  paid_count: number
  customer_notify: boolean
  created_at: number
  expire_by: number
  short_url: string
  has_scheduled_changes: boolean
  change_scheduled_at: number | null
  remaining_count: number
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
   * Create a subscription plan
   */
  async createPlan(
    name: string,
    amount: number,
    currency: string = 'INR',
    interval: number = 1,
    period: 'monthly' | 'daily' | 'weekly' | 'yearly' = 'monthly'
  ) {
    const options = {
      period,
      interval,
      item: {
        name,
        description: `${name} Plan`,
        amount: amount * 100, // Razorpay expects amount in paise
        currency,
      },
    }

    return await razorpay.plans.create(options)
  },

  /**
   * Create a subscription
   */
  async createSubscription(
    planId: string,
    customerId: string,
    notes?: Record<string, any>
  ) {
    const options = {
      plan_id: planId,
      customer_id: customerId,
      total_count: 12, // 12 months
      quantity: 1,
      notes: notes || {},
    }

    return await razorpay.subscriptions.create(options)
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
   * Verify webhook signature
   */
  verifyWebhookSignature(body: string, signature: string) {
    const crypto = require('crypto')
    const expectedSignature = crypto
      .createHmac('sha256', serverEnv.RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex')

    return expectedSignature === signature
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

  /**
   * Get subscription details
   */
  async getSubscription(subscriptionId: string) {
    return await razorpay.subscriptions.fetch(subscriptionId)
  },

  /**
   * Cancel subscription
   */
  async cancelSubscription(subscriptionId: string) {
    return await razorpay.subscriptions.cancel(subscriptionId)
  },
}
