// src/api/subscription.ts

import type { AxiosError } from 'axios'
import api from './client'
import type { 
  Plan, 
  Subscription, 
  UsageHistoryResponse, 
  CheckoutResponse, 
  SubscriptionActionResponse,
  BillingPortalResponse,
  ApiErrorResponse
} from '../types/subscription'

// Plan types available in the system
export enum PlanType {
  FREE = 'free',
  DEVELOPER = 'developer',
  PROFESSIONAL = 'professional',
}

// Subscription API wrapper
export const subscriptionService = {
  /**
   * Fetch all available subscription plans
   */
  async getPlans(): Promise<Plan[]> {
    try {
      const response = await api.get<{ plans: Plan[] }>('/api/subscription/plans')
      return response.data.plans
    } catch (err: any) {
      throw err as AxiosError<ApiErrorResponse>
    }
  },

  /**
   * Get the current user's subscription status and details
   */
  async getSubscriptionStatus(): Promise<Subscription> {
    try {
      const response = await api.get<{ subscription: Subscription }>('/api/subscription/status')
      return response.data.subscription
    } catch (err: any) {
      throw err as AxiosError<ApiErrorResponse>
    }
  },

  /**
   * Create a Stripe Checkout session for a paid plan
   * and return the session URL to redirect the user
   */
  async createCheckoutSession(planType: PlanType): Promise<string> {
    try {
      const response = await api.post<CheckoutResponse>(
        '/api/subscription/create-checkout',
        { plan_type: planType }
      )
      return response.data.checkout_url
    } catch (err: any) {
      throw err as AxiosError<ApiErrorResponse>
    }
  },

  /**
   * Directly create or switch subscription (alternative to checkout)
   */
  async createSubscription(
    planType: PlanType,
    paymentMethodId?: string
  ): Promise<Subscription> {
    try {
      const payload: Record<string, any> = { plan_type: planType }
      if (paymentMethodId) payload.payment_method_id = paymentMethodId

      const response = await api.post<SubscriptionActionResponse>(
        '/api/subscription/create',
        payload
      )
      return response.data.subscription
    } catch (err: any) {
      throw err as AxiosError<ApiErrorResponse>
    }
  },

  /**
   * Update the user's existing subscription to a new plan
   */
  async updateSubscription(planType: PlanType): Promise<Subscription> {
    try {
      const response = await api.post<SubscriptionActionResponse>(
        '/api/subscription/update',
        { plan_type: planType }
      )
      return response.data.subscription
    } catch (err: any) {
      throw err as AxiosError<ApiErrorResponse>
    }
  },

  /**
   * Cancel the current subscription
   * @param immediate - set to true to cancel immediately, false to end of period
   */
  async cancelSubscription(immediate = false): Promise<Subscription> {
    try {
      const response = await api.post<SubscriptionActionResponse>(
        '/api/subscription/cancel',
        { immediate }
      )
      return response.data.subscription
    } catch (err: any) {
      throw err as AxiosError<ApiErrorResponse>
    }
  },

  /**
   * Fetch detailed usage history
   */
  async getUsageHistory(
    days = 30,
    page = 1,
    perPage = 50
  ): Promise<UsageHistoryResponse> {
    try {
      const response = await api.get<UsageHistoryResponse>('/api/subscription/usage', {
        params: { days, page, per_page: perPage },
      })
      return response.data
    } catch (err: any) {
      throw err as AxiosError<ApiErrorResponse>
    }
  },

  /**
   * Open Stripe billing portal for the current user
   */
  async openBillingPortal(): Promise<{ portal_url: string }> {
    try {
      const response = await api.post<BillingPortalResponse>('/api/subscription/billing-portal')
      return response.data
    } catch (err: any) {
      throw err as AxiosError<ApiErrorResponse>
    }
  },
}
