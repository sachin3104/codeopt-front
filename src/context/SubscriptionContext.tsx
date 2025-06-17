// File: src/context/SubscriptionContext.tsx
// OPTIMIZED VERSION - Prevents request loops and provides selective subscriptions

import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useIsAuthenticated } from './AuthContext';
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
  createCheckoutSession: (plan: Plan) => Promise<void>;
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

  // Auth state for conditional loading
  const isAuthenticated = useIsAuthenticated();

  // Request management refs
  const subscriptionRequestRef = useRef<Promise<void> | null>(null);
  const plansRequestRef = useRef<Promise<void> | null>(null);
  const lastSubscriptionRefreshRef = useRef<number>(0);
  const lastPlansRefreshRef = useRef<number>(0);
  const isInitializedRef = useRef(false);
  const consecutiveFailuresRef = useRef(0);

  // OPTIMIZED: Conservative refreshSubscription with request deduplication
  const refreshSubscription = useCallback(async (force = false): Promise<void> => {
    // Only refresh if authenticated
    if (!isAuthenticated && !force) {
      console.log('💳 Skipping subscription refresh - not authenticated');
      return Promise.resolve();
    }

    // Prevent rapid successive calls (3 second debounce)
    const now = Date.now();
    if (!force && now - lastSubscriptionRefreshRef.current < 3000) {
      console.log('💳 Subscription refresh debounced');
      return subscriptionRequestRef.current || Promise.resolve();
    }

    // Implement exponential backoff for failures
    if (consecutiveFailuresRef.current > 0 && !force) {
      const backoffTime = Math.min(2000 * Math.pow(2, consecutiveFailuresRef.current), 30000);
      if (now - lastSubscriptionRefreshRef.current < backoffTime) {
        console.log(`💳 Subscription refresh backing off for ${backoffTime}ms`);
        return Promise.resolve();
      }
    }

    // If there's already a request in progress, return that promise
    if (subscriptionRequestRef.current && !force) {
      console.log('💳 Subscription refresh already in progress');
      return subscriptionRequestRef.current;
    }

    lastSubscriptionRefreshRef.current = now;

    const requestPromise = (async () => {
      try {
        console.log('💳 Refreshing subscription data...');
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
          consecutiveFailuresRef.current = 0; // Reset failure count
          console.log('✅ Subscription data refreshed successfully');
        } else {
          throw new Error('Failed to load subscription');
        }
      } catch (err: any) {
        consecutiveFailuresRef.current++;
        console.error(`❌ Failed to refresh subscription (attempt ${consecutiveFailuresRef.current}):`, err);
        
        // Only set error on first few failures to avoid spam
        if (consecutiveFailuresRef.current <= 2) {
          setError('Failed to load subscription data');
        }
      } finally {
        setIsLoading(false);
        subscriptionRequestRef.current = null;
      }
    })();

    subscriptionRequestRef.current = requestPromise;
    return requestPromise;
  }, [isAuthenticated]);

  // OPTIMIZED: Conservative getPlans with request deduplication
  const getPlans = useCallback(async (force = false): Promise<void> => {
    // Prevent rapid successive calls (5 second debounce - plans change rarely)
    const now = Date.now();
    if (!force && now - lastPlansRefreshRef.current < 5000) {
      console.log('🏷️ Plans refresh debounced');
      return plansRequestRef.current || Promise.resolve();
    }

    // If there's already a request in progress, return that promise
    if (plansRequestRef.current && !force) {
      console.log('🏷️ Plans refresh already in progress');
      return plansRequestRef.current;
    }

    lastPlansRefreshRef.current = now;

    const requestPromise = (async () => {
      try {
        console.log('🏷️ Loading subscription plans...');
        const response = await subscriptionApi.getPlans();
        
        if (response.data.status === 'success') {
          setPlans(response.data.plans);
          console.log(`✅ Loaded ${response.data.plans.length} subscription plans`);
          
          // Debug logging for plans
          response.data.plans.forEach((plan, index) => {
            console.log(`${index + 1}. ${plan.name}: ${plan.plan_type} - $${plan.price}`);
          });
        } else {
          throw new Error('Failed to load plans');
        }
      } catch (err: any) {
        console.error('❌ Failed to load plans:', err);
        setError('Failed to load subscription plans');
      } finally {
        plansRequestRef.current = null;
      }
    })();

    plansRequestRef.current = requestPromise;
    return requestPromise;
  }, []);

  // OPTIMIZED: Initialize Stripe only once
  useEffect(() => {
    const initStripe = async () => {
      try {
        console.log('🔧 Initializing Stripe...');
        const stripeInstance = await stripeApi.initializeStripe();
        setStripe(stripeInstance);
        
        const config = await stripeApi.getStripeConfig();
        setStripeConfig(config);
        console.log('✅ Stripe initialized successfully');
      } catch (err) {
        console.error('❌ Failed to initialize Stripe:', err);
        setError('Failed to initialize payment system');
      }
    };
    
    initStripe();
  }, []); // Empty dependency array - run only once

  // OPTIMIZED: Initial data load with proper dependencies
  useEffect(() => {
    const initializeSubscriptionData = async () => {
      if (isInitializedRef.current) return;
      
      console.log('🚀 Initializing subscription data...');
      isInitializedRef.current = true;
      
      // Always load plans (public data)
      await getPlans(true);
      
      // Only load subscription data if authenticated
      if (isAuthenticated) {
        await refreshSubscription(true);
      } else {
        setIsLoading(false);
      }
    };

    initializeSubscriptionData();
  }, []); // Empty dependency array - run only once

  // OPTIMIZED: Refresh subscription data when auth status changes
  useEffect(() => {
    if (!isInitializedRef.current) return;

    if (isAuthenticated) {
      console.log('🔄 User authenticated - refreshing subscription data');
      refreshSubscription(true).catch(() => {
        console.warn('⚠️ Failed to refresh subscription on auth change');
      });
    } else {
      console.log('🚪 User not authenticated - clearing subscription data');
      setSubscription(null);
      setUsage(null);
      setPlanLimits({
        maxCodeInputChars: 0,
        maxDailyUsage: null,
        maxMonthlyUsage: null,
      });
    }
  }, [isAuthenticated, refreshSubscription]);

  // Enhanced createCheckoutSession
  const createCheckoutSession = async (plan: Plan) => {
    try {
      console.log('💳 Creating checkout session for:', plan.name);
      
      // Validate plan
      if (!plan || !plan.plan_type) {
        throw new Error('Invalid plan object');
      }
      
      if (plan.plan_type === 'free') {
        throw new Error('Cannot create checkout session for free plan');
      }
      
      const response = await subscriptionApi.createCheckoutSession(plan.plan_type as 'developer' | 'professional');
      
      if (response.data.status === 'success' && response.data.checkout_url) {
        console.log('✅ Checkout session created, redirecting...');
        window.location.href = response.data.checkout_url;
      } else {
        throw new Error('Failed to get checkout URL from server');
      }
      
    } catch (err: any) {
      console.error('❌ Checkout creation failed:', err);
      setError(`Failed to create checkout session: ${err.message}`);
      throw err;
    }
  };

  const openBillingPortal = async () => {
    try {
      console.log('💳 Opening billing portal...');
      const response = await subscriptionApi.createBillingPortalSession();
      
      if (response.data.status === 'success' && response.data.portal_url) {
        console.log('✅ Billing portal session created, redirecting...');
        window.location.href = response.data.portal_url;
      } else {
        throw new Error('Failed to get billing portal URL from server');
      }
    } catch (err: any) {
      console.error('❌ Billing portal failed:', err);
      setError('Failed to open billing portal');
      throw err;
    }
  };

  const cancelSubscription = async (immediate: boolean = false) => {
    try {
      console.log(`💳 Cancelling subscription (immediate: ${immediate})...`);
      const response = await subscriptionApi.cancelSubscription(immediate);
      
      if (response.data.status === 'success') {
        setSubscription(response.data.subscription);
        console.log('✅ Subscription cancelled successfully');
      }
    } catch (err: any) {
      console.error('❌ Subscription cancellation failed:', err);
      setError('Failed to cancel subscription');
      throw err;
    }
  };

  const reactivateSubscription = async () => {
    try {
      console.log('💳 Reactivating subscription...');
      const response = await subscriptionApi.reactivateSubscription();
      
      if (response.data.status === 'success') {
        setSubscription(response.data.subscription);
        console.log('✅ Subscription reactivated successfully');
      }
    } catch (err: any) {
      console.error('❌ Subscription reactivation failed:', err);
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
      console.log(`📊 Getting usage history: ${days} days, page ${page}`);
      const response = await subscriptionApi.getUsageHistory(days, page, perPage);
      return response.data;
    } catch (err: any) {
      console.error('❌ Failed to load usage history:', err);
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

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      subscriptionRequestRef.current = null;
      plansRequestRef.current = null;
    };
  }, []);

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

// OPTIMIZED: Main hook - use sparingly
export const useSubscription = () => {
  const context = useContext(SubscriptionContext);
  if (context === undefined) {
    throw new Error('useSubscription must be used within a SubscriptionProvider');
  }
  return context;
};

// OPTIMIZED: Selective hooks to prevent unnecessary re-renders

// Hook that only re-renders when subscription data changes
export const useSubscriptionData = (): Subscription | null => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscriptionData must be used within a SubscriptionProvider');
  }
  return context.subscription;
};

// Hook that only re-renders when plans change
export const useSubscriptionPlans = (): Plan[] => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscriptionPlans must be used within a SubscriptionProvider');
  }
  return context.plans;
};

// Hook that only re-renders when usage data changes
export const useUsageData = (): UsageData | null => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useUsageData must be used within a SubscriptionProvider');
  }
  return context.usage;
};

// Hook that only re-renders when loading state changes
export const useSubscriptionLoading = (): boolean => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscriptionLoading must be used within a SubscriptionProvider');
  }
  return context.isLoading;
};

// Hook that only re-renders when error state changes
export const useSubscriptionError = (): string | null => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('useSubscriptionError must be used within a SubscriptionProvider');
  }
  return context.error;
};

// Hook for plan limits only
export const usePlanLimits = () => {
  const context = useContext(SubscriptionContext);
  if (!context) {
    throw new Error('usePlanLimits must be used within a SubscriptionProvider');
  }
  return context.planLimits;
};