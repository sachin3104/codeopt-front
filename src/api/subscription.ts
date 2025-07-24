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
  ApiErrorResponse,
  ConsultationPlansResponse,
  ConsultationCheckoutResponse,
  ConsultationBookingStatusResponse,
  ConsultationBookingsResponse,
  ConsultationBooking,
  PlansResponse,
  SubscriptionStatusResponse
} from '../types/subscription'

// Plan types available in the system
export enum PlanType {
  FREE = 'FREE',
  PRO = 'PRO',
  ULTIMATE = 'ULTIMATE',
  ENTERPRISE = 'ENTERPRISE',
  CALL_WITH_EXPERT = 'CALL_WITH_EXPERT',
}

// Subscription API wrapper
export const subscriptionService = {
  /**
   * Fetch all available subscription plans
   */
  async getPlans(): Promise<Plan[]> {
    try {
      const response = await api.get<PlansResponse>('/api/subscription/plans')
      if (response.data.status === 'error') {
        throw new Error(response.data.message || 'Failed to fetch plans')
      }
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
      const response = await api.get<SubscriptionStatusResponse>('/api/subscription/status')
      if (response.data.status === 'error') {
        throw new Error(response.data.message || 'Failed to fetch subscription status')
      }
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
      if (response.data.status === 'error') {
        throw new Error(response.data.message || 'Failed to create checkout session')
      }
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
      if (response.data.status === 'error') {
        throw new Error(response.data.message || 'Failed to create subscription')
      }
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
      if (response.data.status === 'error') {
        throw new Error(response.data.message || 'Failed to update subscription')
      }
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
      if (response.data.status === 'error') {
        throw new Error(response.data.message || 'Failed to cancel subscription')
      }
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
      if (response.data.status === 'error') {
        throw new Error(response.data.message || 'Failed to fetch usage history')
      }
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
      if (response.data.status === 'error') {
        throw new Error(response.data.message || 'Failed to open billing portal')
      }
      return response.data
    } catch (err: any) {
      throw err as AxiosError<ApiErrorResponse>
    }
  },

  //
  // ────────────────────────────────────────────────────────────────────────────────
  //   Consultation endpoints
  // ────────────────────────────────────────────────────────────────────────────────
  /**
   * Fetch available consultation plans
   */
  async getConsultationPlans(): Promise<Plan[]> {
    try {
      const response = await api.get<ConsultationPlansResponse>(
        '/api/subscription/consultation/plans'
      )
      if (response.data.status === 'error') {
        throw new Error(response.data.message || 'Failed to fetch consultation plans')
      }
      return response.data.consultation_plans
    } catch (err: any) {
      throw err as AxiosError<ApiErrorResponse>
    }
  },

  /**
   * Create a Stripe checkout session for a consultation booking
   */
  async createConsultationCheckout(
    consultationType: string,
    selectedDate: string,
    description?: string
  ): Promise<ConsultationCheckoutResponse> {
    try {
      const response = await api.post<ConsultationCheckoutResponse>(
        '/api/subscription/consultation/create-checkout',
        {
          consultation_type: consultationType,
          selected_date: selectedDate,
          description
        }
      )
      if (response.data.status === 'error') {
        throw new Error(response.data.message || 'Failed to create consultation checkout')
      }
      return response.data
    } catch (err: any) {
      throw err as AxiosError<ApiErrorResponse>
    }
  },

  /**
   * Get the status of a single consultation booking
   */
  async getConsultationBookingStatus(
    bookingId: number
  ): Promise<ConsultationBooking> {
    try {
      const response = await api.get<ConsultationBookingStatusResponse>(
        `/api/subscription/consultation/booking/${bookingId}/status`
      )
      if (response.data.status === 'error') {
        throw new Error(response.data.message || 'Failed to fetch consultation booking status')
      }
      return response.data.booking
    } catch (err: any) {
      throw err as AxiosError<ApiErrorResponse>
    }
  },

  /**
   * List consultation bookings for the current user
   */
  async getConsultationBookings(
    page = 1,
    perPage = 20
  ): Promise<ConsultationBookingsResponse> {
    try {
      const response = await api.get<ConsultationBookingsResponse>(
        '/api/subscription/consultation/bookings',
        { params: { page, per_page: perPage } }
      )
      if (response.data.status === 'error') {
        throw new Error(response.data.message || 'Failed to fetch consultation bookings')
      }
      return response.data
    } catch (err: any) {
      throw err as AxiosError<ApiErrorResponse>
    }
  },

  /**
   * (Dev only) Simulate payment completion for a consultation booking
   */
  async simulateConsultationPayment(
    bookingId: number
  ): Promise<ConsultationBooking> {
    try {
      const response = await api.post<ConsultationBookingStatusResponse>(
        `/api/subscription/consultation/booking/${bookingId}/simulate-payment`
      )
      if (response.data.status === 'error') {
        throw new Error(response.data.message || 'Failed to simulate consultation payment')
      }
      return response.data.booking
    } catch (err: any) {
      throw err as AxiosError<ApiErrorResponse>
    }
  },

  //
  // ────────────────────────────────────────────────────────────────────────────────
  //   Reactivation & Cleanup
  // ────────────────────────────────────────────────────────────────────────────────
  /**
   * Reactivate a cancelled subscription
   */
  async reactivateSubscription(): Promise<Subscription> {
    try {
      const response = await api.post<SubscriptionActionResponse>(
        '/api/subscription/reactivate'
      )
      if (response.data.status === 'error') {
        throw new Error(response.data.message || 'Failed to reactivate subscription')
      }
      return response.data.subscription
    } catch (err: any) {
      throw err as AxiosError<ApiErrorResponse>
    }
  },

  /**
   * Clean up duplicate or stale subscriptions
   */
  async cleanupSubscriptions(): Promise<{ cleanup_results: any }> {
    try {
      const { data } = await api.post<{ cleanup_results: any }>(
        '/api/subscription/cleanup'
      )
      return data.cleanup_results
    } catch (err: any) {
      throw err as AxiosError<ApiErrorResponse>
    }
  },

  /**
   * Send enterprise contact request
   */
  async sendEnterpriseContactRequest(data: {
    first_name: string;
    last_name: string;
    phone: string;
    subject: string;
    message: string;
  }): Promise<{ status: string }> {
    try {
      const response = await api.post<{ status: string }>(
        '/api/subscription/enterprise-contact',
        data
      );
      return response.data;
    } catch (err: any) {
      throw err as AxiosError<ApiErrorResponse>;
    }
  },
}
