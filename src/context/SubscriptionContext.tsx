// src/context/SubscriptionContext.tsx
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import type { 
  Plan, 
  Subscription, 
  UsageData, 
  SubscriptionStatusResponse,
  PlansResponse,
  CheckoutResponse,
  BillingPortalResponse,
  UsageHistoryResponse,
  SubscriptionActionResponse,
  ApiErrorResponse 
} from '../types/subscription';
import type { Stripe, StripeConfig } from '../types/stripe';
import * as subscriptionApi from '../api/subscription';
import * as stripeApi from '../api/stripe';

interface SubscriptionContextType {
  // Subscription state
  subscription: Subscription | null;
  plans: Plan[];
  usage: UsageData | null;
  isLoading: boolean;
  error: string | null;
  
  // Stripe state
  stripe: Stripe | null;
  isStripeReady: boolean;
  stripeConfig: StripeConfig | null;
  
  // Usage limits
  planLimits: {
    maxCodeInputChars: number;
    maxDailyUsage: number | null;
    maxMonthlyUsage: number | null;
  };
  
  // Methods
  refreshSubscription: () => Promise<void>;
  getPlans: () => Promise<void>;
  createCheckoutSession: (planType: 'developer' | 'professional') => Promise<void>;
  openBillingPortal: () => Promise<void>;
  cancelSubscription: (immediate?: boolean) => Promise<void>;
  reactivateSubscription: () => Promise<void>;
  getUsageHistory: (days?: number, page?: number, perPage?: number) => Promise<UsageHistoryResponse>;
  hasFeatureAccess: (feature: string) => boolean;
  hasExceededLimits: () => { daily: boolean; monthly: boolean; anyLimit: boolean };
  shouldRecommendUpgrade: () => { recommended: boolean; reason: string; suggestedPlan: string };
}

const SubscriptionContext = createContext<SubscriptionContextType | undefined>(undefined);

export const SubscriptionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Subscription state
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [usage, setUsage] = useState<UsageData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Stripe state
  const [stripe, setStripe] = useState<Stripe | null>(null);
  const [stripeConfig, setStripeConfig] = useState<StripeConfig | null>(null);
  
  // Plan limits
  const [planLimits, setPlanLimits] = useState({
    maxCodeInputChars: 0,
    maxDailyUsage: null as number | null,
    maxMonthlyUsage: null as number | null,
  });

  // Initialize Stripe
  useEffect(() => {
    const initStripe = async () => {
      try {
        const stripeInstance = await stripeApi.initializeStripe();
        setStripe(stripeInstance);
        
        const config = await stripeApi.getStripeConfig();
        setStripeConfig(config);
      } catch (err) {
        console.error('Failed to initialize Stripe:', err);
        setError('Failed to initialize payment system');
      }
    };
    
    initStripe();
  }, []);

  // Load subscription data
  const refreshSubscription = useCallback(async () => {
    try {
      setIsLoading(true);
      const response = await subscriptionApi.getSubscriptionStatus();
      
      if (response.data.status === 'success') {
        setSubscription(response.data.subscription);
        setUsage(response.data.usage);
        setPlanLimits({
          maxCodeInputChars: response.data.plan_limits.max_code_input_chars,
          maxDailyUsage: response.data.plan_limits.max_daily_usage,
          maxMonthlyUsage: response.data.plan_limits.max_monthly_usage,
        });
      }
    } catch (err) {
      console.error('Failed to load subscription:', err);
      setError('Failed to load subscription data');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Load plans
  const getPlans = useCallback(async () => {
    try {
      const response = await subscriptionApi.getPlans();
      if (response.data.status === 'success') {
        setPlans(response.data.plans);
      }
    } catch (err) {
      console.error('Failed to load plans:', err);
      setError('Failed to load subscription plans');
    }
  }, []);

  // Initial data load
  useEffect(() => {
    refreshSubscription();
    getPlans();
  }, [refreshSubscription, getPlans]);

  // Subscription management methods
  const createCheckoutSession = async (planType: 'developer' | 'professional') => {
    try {
      await stripeApi.createAndRedirectToCheckout(planType);
    } catch (err) {
      console.error('Checkout creation failed:', err);
      setError('Failed to create checkout session');
      throw err;
    }
  };

  const openBillingPortal = async () => {
    try {
      await stripeApi.openBillingPortal();
    } catch (err) {
      console.error('Billing portal failed:', err);
      setError('Failed to open billing portal');
      throw err;
    }
  };

  const cancelSubscription = async (immediate: boolean = false) => {
    try {
      const response = await subscriptionApi.cancelSubscription(immediate);
      if (response.data.status === 'success') {
        setSubscription(response.data.subscription);
      }
    } catch (err) {
      console.error('Subscription cancellation failed:', err);
      setError('Failed to cancel subscription');
      throw err;
    }
  };

  const reactivateSubscription = async () => {
    try {
      const response = await subscriptionApi.reactivateSubscription();
      if (response.data.status === 'success') {
        setSubscription(response.data.subscription);
      }
    } catch (err) {
      console.error('Subscription reactivation failed:', err);
      setError('Failed to reactivate subscription');
      throw err;
    }
  };

  const getUsageHistory = async (
    days: number = 30,
    page: number = 1,
    perPage: number = 50
  ) => {
    try {
      const response = await subscriptionApi.getUsageHistory(days, page, perPage);
      return response.data;
    } catch (err) {
      console.error('Failed to load usage history:', err);
      setError('Failed to load usage history');
      throw err;
    }
  };

  // Utility methods
  const hasFeatureAccess = (feature: string): boolean => {
    return subscriptionApi.hasFeatureAccess(subscription, feature);
  };

  const hasExceededLimits = () => {
    return subscriptionApi.hasExceededLimits(usage, subscription);
  };

  const shouldRecommendUpgrade = () => {
    return subscriptionApi.shouldRecommendUpgrade(usage, subscription);
  };

  const value: SubscriptionContextType = {
    // State
    subscription,
    plans,
    usage,
    isLoading,
    error,
    stripe,
    isStripeReady: stripeApi.isStripeReady(),
    stripeConfig,
    planLimits,
    
    // Methods
    refreshSubscription,
    getPlans,
    createCheckoutSession,
    openBillingPortal,
    cancelSubscription,
    reactivateSubscription,
    getUsageHistory,
    hasFeatureAccess,
    hasExceededLimits,
    shouldRecommendUpgrade,
  };

  return (
    <SubscriptionContext.Provider value={value}>
      {children}
    </SubscriptionContext.Provider>
  );
};

export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
}; 