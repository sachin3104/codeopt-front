import { useCallback } from 'react';
import { useSubscription } from '@/context/SubscriptionContext';
import type { Plan } from '@/types/subscription';

export const useSubscriptionHook = () => {
  const {
    subscription,
    plans,
    usage,
    isLoading,
    error,
    stripe,
    isStripeReady,
    stripeConfig,
    planLimits,
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

  return {
    // State
    subscription,
    plans,
    usage,
    isLoading,
    error,
    stripe,
    isStripeReady,
    stripeConfig,
    planLimits,

    // Current plan info
    currentPlan: getCurrentPlan(),
    isFreePlan: isFreePlan(),
    isDeveloperPlan: isDeveloperPlan(),
    isProfessionalPlan: isProfessionalPlan(),
    isActive: isSubscriptionActive(),
    isCancelled: isSubscriptionCancelled(),
    daysUntilRenewal: getDaysUntilRenewal(),
    currentPeriod: getCurrentPeriod(),
    usageStats: getUsageStats(),

    // Methods
    refreshSubscription,
    getPlans,
    createCheckoutSession,
    openBillingPortal,
    cancelSubscription,
    reactivateSubscription,
    getUsageHistory,
    canAccessFeature,
    getRecommendedPlan,
    checkLimits,
  };
};

export default useSubscriptionHook; 