import { useCallback } from 'react';
import { 
  useSubscription, // Only for methods
  useSubscriptionData,
  useSubscriptionPlans, 
  useUsageData,
  useSubscriptionLoading,
  useSubscriptionError,
  usePlanLimits
} from '@/context/SubscriptionContext';
import type { Plan } from '@/types/subscription';

export const useSubscriptionHook = () => {
  // ✅ FIXED: Use selective hooks instead of full context
  const subscription = useSubscriptionData();
  const plans = useSubscriptionPlans();
  const usage = useUsageData();
  const isLoading = useSubscriptionLoading();
  const error = useSubscriptionError();
  const planLimits = usePlanLimits();

  // ✅ FIXED: Only get methods from full context (these don't cause re-renders)
  const {
    stripe,
    isStripeReady,
    stripeConfig,
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
  } = useSubscription();

  // Get current plan
  const getCurrentPlan = useCallback((): Plan | null => {
    return subscription?.plan || null;
  }, [subscription]);

  // Check if user is on free plan
  const isFreePlan = useCallback((): boolean => {
    return subscription?.plan.plan_type === 'free';
  }, [subscription]);

  // Check if user is on developer plan
  const isDeveloperPlan = useCallback((): boolean => {
    return subscription?.plan.plan_type === 'developer';
  }, [subscription]);

  // Check if user is on professional plan
  const isProfessionalPlan = useCallback((): boolean => {
    return subscription?.plan.plan_type === 'professional';
  }, [subscription]);

  // Check if subscription is active
  const isSubscriptionActive = useCallback((): boolean => {
    return subscription?.is_active || false;
  }, [subscription]);

  // Check if subscription is cancelled
  const isSubscriptionCancelled = useCallback((): boolean => {
    return subscription?.status === 'cancelled';
  }, [subscription]);

  // Get days until renewal
  const getDaysUntilRenewal = useCallback((): number | null => {
    return subscription?.days_until_renewal || null;
  }, [subscription]);

  // Get current period dates
  const getCurrentPeriod = useCallback(() => {
    return {
      start: subscription?.current_period_start || null,
      end: subscription?.current_period_end || null,
    };
  }, [subscription]);

  // Get usage statistics
  const getUsageStats = useCallback(() => {
    if (!usage) return null;

    return {
      daily: {
        used: usage.daily.usage_count,
        limit: usage.daily.limit,
        remaining: usage.daily.remaining,
        characters: usage.daily.characters_processed,
      },
      monthly: {
        used: usage.monthly.usage_count,
        limit: usage.monthly.limit,
        remaining: usage.monthly.remaining,
        characters: usage.monthly.characters_processed,
      },
    };
  }, [usage]);

  // Check if user can access a specific feature
  const canAccessFeature = useCallback(
    (feature: string): boolean => {
      return hasFeatureAccess(feature);
    },
    [hasFeatureAccess]
  );

  // Get recommended plan based on usage
  const getRecommendedPlan = useCallback(() => {
    const { recommended, reason, suggestedPlan } = shouldRecommendUpgrade();
    return {
      recommended,
      reason,
      suggestedPlan,
    };
  }, [shouldRecommendUpgrade]);

  // Check if user has exceeded any limits
  const checkLimits = useCallback(() => {
    const limits = hasExceededLimits();
    return {
      ...limits,
      canProceed: !limits.anyLimit,
    };
  }, [hasExceededLimits]);

  // ✅ FIXED: Enhanced createCheckoutSession that accepts full plan object
  const createCheckoutSessionForPlan = useCallback(
    async (plan: Plan) => {
      console.log('=== Creating checkout session ===');
      console.log('Plan object:', plan);
      console.log('Plan name:', plan.name);
      console.log('Plan type:', plan.plan_type);
      console.log('Plan price:', plan.price);
      console.log('Plan ID:', plan.id);
      console.log('===============================');

      if (!plan.plan_type) {
        throw new Error('Plan type is required');
      }

      if (plan.plan_type === 'free') {
        throw new Error('Cannot create checkout session for free plan');
      }

      // Call the context method with the plan object
      return await createCheckoutSession(plan);
    },
    [createCheckoutSession]
  );

  // ✅ ADDED: Debug helper to log available plans
  const logAvailablePlans = useCallback(() => {
    console.log('=== Available Plans ===');
    plans?.forEach((plan, index) => {
      console.log(`${index + 1}. ${plan.name}:`, {
        id: plan.id,
        type: plan.plan_type,
        price: plan.price,
        currency: plan.currency || 'USD',
      });
    });
    console.log('=====================');
  }, [plans]);

  // ✅ ADDED: Helper to find plan by type
  const findPlanByType = useCallback(
    (planType: string): Plan | null => {
      return plans?.find(plan => plan.plan_type === planType) || null;
    },
    [plans]
  );

  return {
    // State - ✅ FIXED: Now from selective hooks
    subscription,
    plans,
    usage,
    isLoading,
    error,
    stripe,
    isStripeReady,
    stripeConfig,
    planLimits,

    // Current plan info - computed from selective hook data
    currentPlan: getCurrentPlan(),
    isFreePlan: isFreePlan(),
    isDeveloperPlan: isDeveloperPlan(),
    isProfessionalPlan: isProfessionalPlan(),
    isActive: isSubscriptionActive(),
    isCancelled: isSubscriptionCancelled(),
    daysUntilRenewal: getDaysUntilRenewal(),
    currentPeriod: getCurrentPeriod(),
    usageStats: getUsageStats(),

    // Methods - same as before
    refreshSubscription,
    getPlans,
    createCheckoutSession: createCheckoutSessionForPlan, // ✅ Use enhanced version
    openBillingPortal,
    cancelSubscription,
    reactivateSubscription,
    getUsageHistory,
    canAccessFeature,
    getRecommendedPlan,
    checkLimits,
    
    // ✅ ADDED: New helper methods
    logAvailablePlans,
    findPlanByType,
  };
};

export default useSubscriptionHook;