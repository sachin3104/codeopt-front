// src/api/subscription.ts
// Subscription API client with all subscription endpoints
import api from './client';
import type {
  Plan,
  Subscription,
  UsageData,
  SubscriptionStatusResponse,
  PlansResponse,
  CheckoutResponse,
  BillingPortalResponse,
  UsageRecord,
  UsageHistoryResponse,
  SubscriptionActionResponse,
  ApiErrorResponse,
} from '../types/subscription';

/**
 * Subscription Data Endpoints
 */

/**
 * Get all available subscription plans
 */
export const getPlans = () =>
  api.get<PlansResponse>('/api/subscription/plans');

/**
 * Get current user's subscription status and usage
 */
export const getSubscriptionStatus = () =>
  api.get<SubscriptionStatusResponse>('/api/subscription/status');

/**
 * Get detailed usage history for the user
 * @param days - Number of days to look back (default: 30)
 * @param page - Page number for pagination (default: 1)
 * @param perPage - Items per page (default: 50, max: 100)
 */
export const getUsageHistory = (
  days: number = 30,
  page: number = 1,
  perPage: number = 50
) => {
  const params = new URLSearchParams({
    days: days.toString(),
    page: page.toString(),
    per_page: perPage.toString(),
  });
  
  return api.get<UsageHistoryResponse>(`/api/subscription/usage?${params}`);
};

/**
 * Payment & Checkout Endpoints
 */

/**
 * Create Stripe checkout session for subscription
 * @param planType - The plan type to subscribe to ('developer' | 'professional')
 */
export const createCheckoutSession = (planType: 'developer' | 'professional') =>
  api.post<CheckoutResponse>('/api/subscription/create-checkout', {
    plan_type: planType,
  });

/**
 * Create subscription directly (alternative to checkout)
 * @param planType - The plan type ('free' | 'developer' | 'professional')
 * @param paymentMethodId - Stripe payment method ID (required for paid plans)
 */
export const createSubscription = (
  planType: 'free' | 'developer' | 'professional',
  paymentMethodId?: string
) =>
  api.post<SubscriptionActionResponse>('/api/subscription/create', {
    plan_type: planType,
    payment_method_id: paymentMethodId,
  });

/**
 * Subscription Management Endpoints
 */

/**
 * Update user's subscription plan
 * @param planType - The new plan type
 */
export const updateSubscription = (planType: 'free' | 'developer' | 'professional') =>
  api.post<SubscriptionActionResponse>('/api/subscription/update', {
    plan_type: planType,
  });

/**
 * Cancel user's subscription
 * @param immediate - Cancel immediately or at period end (default: false)
 */
export const cancelSubscription = (immediate: boolean = false) =>
  api.post<SubscriptionActionResponse>('/api/subscription/cancel', {
    immediate,
  });

/**
 * Reactivate a cancelled subscription
 */
export const reactivateSubscription = () =>
  api.post<SubscriptionActionResponse>('/api/subscription/reactivate');

/**
 * Create Stripe billing portal session
 */
export const createBillingPortalSession = () =>
  api.post<BillingPortalResponse>('/api/subscription/billing-portal');

/**
 * Sync subscription data from Stripe (for troubleshooting)
 */
export const syncSubscriptionFromStripe = () =>
  api.post<SubscriptionActionResponse>('/api/subscription/sync-stripe');

/**
 * Clean up duplicate subscriptions and ensure correct active subscription
 */
export const cleanupSubscriptions = () =>
  api.post<{
    status: string;
    message: string;
    cleanup_results: {
      total_subscriptions: number;
      cancelled_subscriptions: number;
      active_subscription: Subscription | null;
    };
  }>('/api/subscription/cleanup');

/**
 * Utility Functions
 */

/**
 * Check if user has access to a specific feature based on plan
 * @param subscription - Current subscription
 * @param feature - Feature to check ('convert' | 'document' | 'advanced-analysis')
 */
export const hasFeatureAccess = (
  subscription: Subscription | null,
  feature: string
): boolean => {
  if (!subscription || !subscription.is_active) {
    return feature === 'basic'; // Only basic features for inactive/no subscription
  }

  const planType = subscription.plan.plan_type;

  switch (feature) {
    case 'convert':
    case 'document':
      return planType === 'developer' || planType === 'professional';
    case 'advanced-analysis':
      return planType === 'professional';
    case 'optimize':
    case 'analyze':
      return true; // Available for all plans
    default:
      return false;
  }
};

/**
 * Check if user has exceeded usage limits
 * @param usage - Current usage data
 * @param subscription - Current subscription
 */
export const hasExceededLimits = (
  usage: UsageData | null,
  subscription: Subscription | null
): {
  daily: boolean;
  monthly: boolean;
  anyLimit: boolean;
} => {
  if (!usage || !subscription) {
    return { daily: true, monthly: true, anyLimit: true };
  }

  const dailyExceeded = usage.daily.limit !== null && 
    usage.daily.usage_count >= usage.daily.limit;
  
  const monthlyExceeded = usage.monthly.limit !== null && 
    usage.monthly.usage_count >= usage.monthly.limit;

  return {
    daily: dailyExceeded,
    monthly: monthlyExceeded,
    anyLimit: dailyExceeded || monthlyExceeded,
  };
};

/**
 * Get plan display information
 * @param plan - Plan object
 */
export const getPlanDisplayInfo = (plan: Plan) => ({
  name: plan.name,
  price: plan.price === 0 ? 'Free' : `$${plan.price}/month`,
  features: getPlanFeatures(plan.plan_type),
  limits: {
    codeInput: `${plan.max_code_input_chars.toLocaleString()} characters`,
    dailyUsage: plan.max_daily_usage ? `${plan.max_daily_usage} requests/day` : 'Unlimited',
    monthlyUsage: plan.max_monthly_usage ? `${plan.max_monthly_usage} requests/month` : 'Unlimited',
  },
});

/**
 * Get features available for each plan type
 * @param planType - Plan type
 */
export const getPlanFeatures = (planType: string): string[] => {
  const baseFeatures = ['Code optimization', 'Code analysis'];
  
  switch (planType) {
    case 'free':
      return [...baseFeatures, 'Basic usage limits'];
    case 'developer':
      return [...baseFeatures, 'Code conversion', 'Documentation generation', 'Higher limits'];
    case 'professional':
      return [
        ...baseFeatures,
        'Code conversion',
        'Documentation generation',
        'Advanced security analysis',
        'Unlimited usage',
        'Priority support',
      ];
    default:
      return baseFeatures;
  }
};

/**
 * Format usage percentage for display
 * @param used - Used amount
 * @param limit - Limit amount (null for unlimited)
 */
export const formatUsagePercentage = (used: number, limit: number | null): {
  percentage: number;
  display: string;
  color: string;
} => {
  if (limit === null) {
    return {
      percentage: 0,
      display: `${used.toLocaleString()} used`,
      color: 'green',
    };
  }

  const percentage = Math.min((used / limit) * 100, 100);
  const color = percentage >= 90 ? 'red' : percentage >= 70 ? 'yellow' : 'green';

  return {
    percentage,
    display: `${used.toLocaleString()} / ${limit.toLocaleString()}`,
    color,
  };
};

/**
 * Check if upgrade is recommended based on usage
 * @param usage - Current usage data
 * @param subscription - Current subscription
 */
export const shouldRecommendUpgrade = (
  usage: UsageData | null,
  subscription: Subscription | null
): {
  recommended: boolean;
  reason: string;
  suggestedPlan: string;
} => {
  if (!usage || !subscription) {
    return { recommended: false, reason: '', suggestedPlan: '' };
  }

  const planType = subscription.plan.plan_type;

  // Check if frequently hitting limits
  const dailyUsageHigh = usage.daily.limit && 
    (usage.daily.usage_count / usage.daily.limit) > 0.8;
  
  const monthlyUsageHigh = usage.monthly.limit && 
    (usage.monthly.usage_count / usage.monthly.limit) > 0.8;

  if (planType === 'free' && (dailyUsageHigh || monthlyUsageHigh)) {
    return {
      recommended: true,
      reason: 'You\'re using most of your free tier limits',
      suggestedPlan: 'developer',
    };
  }

  if (planType === 'developer' && monthlyUsageHigh) {
    return {
      recommended: true,
      reason: 'Consider unlimited usage with Professional plan',
      suggestedPlan: 'professional',
    };
  }

  return { recommended: false, reason: '', suggestedPlan: '' };
};