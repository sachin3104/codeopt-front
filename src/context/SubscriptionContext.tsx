import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
  useCallback,
} from 'react'
import { useNavigate } from 'react-router-dom'
import { AxiosError } from 'axios'
import { PlanType, subscriptionService } from '@/api/subscription'
import type { 
  Plan,
  Subscription, 
  ApiErrorResponse, 
  UsageHistoryResponse,
  ConsultationPlansResponse,
  ConsultationCheckoutResponse,
  ConsultationBookingStatusResponse,
  ConsultationBookingsResponse,
  ConsultationBooking
} from '@/types/subscription'
import { redirectToStripeCheckout } from '@/api/stripe'
import { useAuth } from '@/hooks/use-auth'

export interface SubscriptionContextType {
  subscription: Subscription | null
  
  // Fetch subscription
  fetching: boolean
  fetchError: AxiosError<ApiErrorResponse> | null
  refresh: () => Promise<void>

  // Usage data
  usageData: UsageHistoryResponse | null
  fetchingUsage: boolean
  usageError: AxiosError<ApiErrorResponse> | null
  fetchUsage: (days?: number) => Promise<void>

  // Checkout
  checkoutLoading: boolean
  checkoutError: AxiosError<ApiErrorResponse> | null
  startCheckout: (plan: PlanType) => Promise<void>

  // Create subscription
  createLoading: boolean
  createError: AxiosError<ApiErrorResponse> | null
  createSubscription: (
    plan: PlanType,
    paymentMethodId?: string
  ) => Promise<void>

  // Update subscription
  updateLoading: boolean
  updateError: AxiosError<ApiErrorResponse> | null
  updateSubscription: (plan: PlanType) => Promise<void>

  // Cancel subscription
  cancelLoading: boolean
  cancelError: AxiosError<ApiErrorResponse> | null
  cancelSubscription: (immediate?: boolean) => Promise<void>

  // Billing portal
  portalLoading: boolean
  portalError: AxiosError<ApiErrorResponse> | null
  openBillingPortal: () => Promise<void>

  // Consultation plans
  consultationPlans: Plan[] | null
  fetchingConsultationPlans: boolean
  consultationPlansError: AxiosError<ApiErrorResponse> | null
  fetchConsultationPlans: () => Promise<void>

  // Consultation checkout
  consultationCheckoutLoading: boolean
  consultationCheckoutError: AxiosError<ApiErrorResponse> | null
  startConsultationCheckout: (
    consultationType: string,
    selectedDate: string,
    description?: string
  ) => Promise<void>

  // Consultation bookings
  consultationBookings: ConsultationBookingsResponse | null
  fetchingConsultationBookings: boolean
  consultationBookingsError: AxiosError<ApiErrorResponse> | null
  fetchConsultationBookings: (page?: number, perPage?: number) => Promise<void>

  // Reactivation & Cleanup
  reactivateLoading: boolean
  reactivateError: AxiosError<ApiErrorResponse> | null
  reactivateSubscription: () => Promise<void>

  cleanupLoading: boolean
  cleanupError: AxiosError<ApiErrorResponse> | null
  cleanupSubscriptions: () => Promise<void>
}

export const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined)

export const SubscriptionProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const navigate = useNavigate()
  const { isAuthenticated, loading: authLoading } = useAuth()
  const [subscription, setSubscription] = useState<Subscription | null>(null)
  
  // Fetch subscription states
  const [fetching, setFetching] = useState(false)
  const [fetchError, setFetchError] = useState<AxiosError<ApiErrorResponse> | null>(null)

  // Usage data states
  const [usageData, setUsageData] = useState<UsageHistoryResponse | null>(null)
  const [fetchingUsage, setFetchingUsage] = useState(false)
  const [usageError, setUsageError] = useState<AxiosError<ApiErrorResponse> | null>(null)

  // Checkout states
  const [checkoutLoading, setCheckoutLoading] = useState(false)
  const [checkoutError, setCheckoutError] = useState<AxiosError<ApiErrorResponse> | null>(null)

  // Create subscription states
  const [createLoading, setCreateLoading] = useState(false)
  const [createError, setCreateError] = useState<AxiosError<ApiErrorResponse> | null>(null)

  // Update subscription states
  const [updateLoading, setUpdateLoading] = useState(false)
  const [updateError, setUpdateError] = useState<AxiosError<ApiErrorResponse> | null>(null)

  // Cancel subscription states
  const [cancelLoading, setCancelLoading] = useState(false)
  const [cancelError, setCancelError] = useState<AxiosError<ApiErrorResponse> | null>(null)

  // Billing portal states
  const [portalLoading, setPortalLoading] = useState(false)
  const [portalError, setPortalError] = useState<AxiosError<ApiErrorResponse> | null>(null)

  // Consultation plans states
  const [consultationPlans, setConsultationPlans] = useState<Plan[] | null>(null)
  const [fetchingConsultationPlans, setFetchingConsultationPlans] = useState(false)
  const [consultationPlansError, setConsultationPlansError] = useState<AxiosError<ApiErrorResponse> | null>(null)

  // Consultation checkout states
  const [consultationCheckoutLoading, setConsultationCheckoutLoading] = useState(false)
  const [consultationCheckoutError, setConsultationCheckoutError] = useState<AxiosError<ApiErrorResponse> | null>(null)

  // Consultation bookings states
  const [consultationBookings, setConsultationBookings] = useState<ConsultationBookingsResponse | null>(null)
  const [fetchingConsultationBookings, setFetchingConsultationBookings] = useState(false)
  const [consultationBookingsError, setConsultationBookingsError] = useState<AxiosError<ApiErrorResponse> | null>(null)

  // Reactivation & Cleanup states
  const [reactivateLoading, setReactivateLoading] = useState(false)
  const [reactivateError, setReactivateError] = useState<AxiosError<ApiErrorResponse> | null>(null)

  const [cleanupLoading, setCleanupLoading] = useState(false)
  const [cleanupError, setCleanupError] = useState<AxiosError<ApiErrorResponse> | null>(null)

  /** Fetch current subscription status */
  const fetchSubscription = useCallback(async () => {
    setFetching(true)
    setFetchError(null)
    try {
      const sub = await subscriptionService.getSubscriptionStatus()
      setSubscription(sub)
    } catch (err: any) {
      setFetchError(err)
    } finally {
      setFetching(false)
    }
  }, [])

  /** Fetch usage history */
  const fetchUsage = useCallback(async (days = 30) => {
    setFetchingUsage(true)
    setUsageError(null)
    try {
      const usage = await subscriptionService.getUsageHistory(days)
      setUsageData(usage)
    } catch (err: any) {
      setUsageError(err)
    } finally {
      setFetchingUsage(false)
    }
  }, [])

  /** Public API: refresh */
  const refresh = useCallback(async () => {
    await fetchSubscription()
    await fetchUsage()
  }, [fetchSubscription, fetchUsage])

  /** Start Stripe checkout */
  const startCheckout = useCallback(
    async (plan: PlanType) => {
      setCheckoutLoading(true)
      setCheckoutError(null)
      try {
        const url = await subscriptionService.createCheckoutSession(plan)
        await redirectToStripeCheckout(url)
      } catch (err: any) {
        setCheckoutError(err)
      } finally {
        setCheckoutLoading(false)
      }
    },
    []
  )

  /** Direct create subscription */
  const createSubscription = useCallback(
    async (plan: PlanType, paymentMethodId?: string) => {
      setCreateLoading(true)
      setCreateError(null)
      try {
        const sub = await subscriptionService.createSubscription(plan, paymentMethodId)
        setSubscription(sub)
      } catch (err: any) {
        setCreateError(err)
      } finally {
        setCreateLoading(false)
      }
    },
    []
  )

  /** Update subscription plan */
  const updateSubscription = useCallback(
    async (plan: PlanType) => {
      setUpdateLoading(true)
      setUpdateError(null)
      try {
        const sub = await subscriptionService.updateSubscription(plan)
        setSubscription(sub)
      } catch (err: any) {
        setUpdateError(err)
      } finally {
        setUpdateLoading(false)
      }
    },
    []
  )

  /** Cancel subscription */
  const cancelSubscription = useCallback(
    async (immediate = false) => {
      setCancelLoading(true)
      setCancelError(null)
      try {
        const sub = await subscriptionService.cancelSubscription(immediate)
        setSubscription(sub)
      } catch (err: any) {
        setCancelError(err)
      } finally {
        setCancelLoading(false)
      }
    },
    []
  )

  /** Open billing portal */
  const openBillingPortal = useCallback(async () => {
    setPortalLoading(true)
    setPortalError(null)
    try {
      const { portal_url } = await subscriptionService.openBillingPortal()
      window.location.href = portal_url
    } catch (err: any) {
      setPortalError(err)
    } finally {
      setPortalLoading(false)
    }
  }, [])

  /** Fetch consultation plans */
  const fetchConsultationPlans = useCallback(async () => {
    setFetchingConsultationPlans(true)
    setConsultationPlansError(null)
    try {
      const plans = await subscriptionService.getConsultationPlans()
      setConsultationPlans(plans)
    } catch (err: any) {
      setConsultationPlansError(err)
    } finally {
      setFetchingConsultationPlans(false)
    }
  }, [])

  /** Start consultation checkout */
  const startConsultationCheckout = useCallback(
    async (consultationType: string, selectedDate: string, description?: string) => {
      setConsultationCheckoutLoading(true)
      setConsultationCheckoutError(null)
      try {
        const response = await subscriptionService.createConsultationCheckout(
          consultationType,
          selectedDate,
          description
        )
        await redirectToStripeCheckout(response.checkout_url)
      } catch (err: any) {
        setConsultationCheckoutError(err)
      } finally {
        setConsultationCheckoutLoading(false)
      }
    },
    []
  )

  /** Fetch consultation bookings */
  const fetchConsultationBookings = useCallback(
    async (page = 1, perPage = 20) => {
      setFetchingConsultationBookings(true)
      setConsultationBookingsError(null)
      try {
        const bookings = await subscriptionService.getConsultationBookings(page, perPage)
        setConsultationBookings(bookings)
      } catch (err: any) {
        setConsultationBookingsError(err)
      } finally {
        setFetchingConsultationBookings(false)
      }
    },
    []
  )

  /** Reactivate subscription */
  const reactivateSubscription = useCallback(async () => {
    setReactivateLoading(true)
    setReactivateError(null)
    try {
      const sub = await subscriptionService.reactivateSubscription()
      setSubscription(sub)
    } catch (err: any) {
      setReactivateError(err)
    } finally {
      setReactivateLoading(false)
    }
  }, [])

  /** Cleanup subscriptions */
  const cleanupSubscriptions = useCallback(async () => {
    setCleanupLoading(true)
    setCleanupError(null)
    try {
      await subscriptionService.cleanupSubscriptions()
    } catch (err: any) {
      setCleanupError(err)
    } finally {
      setCleanupLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      fetchSubscription()
      fetchUsage()
      fetchConsultationPlans()
    }
  }, [fetchSubscription, fetchUsage, fetchConsultationPlans, authLoading, isAuthenticated])

  return (
    <SubscriptionContext.Provider
      value={{
        subscription,
        fetching,
        fetchError,
        refresh,
        usageData,
        fetchingUsage,
        usageError,
        fetchUsage,
        checkoutLoading,
        checkoutError,
        startCheckout,
        createLoading,
        createError,
        createSubscription,
        updateLoading,
        updateError,
        updateSubscription,
        cancelLoading,
        cancelError,
        cancelSubscription,
        portalLoading,
        portalError,
        openBillingPortal,
        consultationPlans,
        fetchingConsultationPlans,
        consultationPlansError,
        fetchConsultationPlans,
        consultationCheckoutLoading,
        consultationCheckoutError,
        startConsultationCheckout,
        consultationBookings,
        fetchingConsultationBookings,
        consultationBookingsError,
        fetchConsultationBookings,
        reactivateLoading,
        reactivateError,
        reactivateSubscription,
        cleanupLoading,
        cleanupError,
        cleanupSubscriptions,
      }}
    >
      {children}
    </SubscriptionContext.Provider>
  )
}


