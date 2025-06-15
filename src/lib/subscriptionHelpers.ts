import { Plan, Subscription, UsageData } from '@/types/subscription';

// Business Logic Functions

/**
 * Calculate usage percentages for daily and monthly quotas
 */
export const calculateUsagePercentages = (
  usage: UsageData,
  plan: Plan
): { daily: number; monthly: number } => {
  const dailyPercentage = plan.max_daily_usage
    ? (usage.daily.usage_count / plan.max_daily_usage) * 100
    : 0;
  const monthlyPercentage = plan.max_monthly_usage
    ? (usage.monthly.usage_count / plan.max_monthly_usage) * 100
    : 0;

  return {
    daily: Math.min(dailyPercentage, 100),
    monthly: Math.min(monthlyPercentage, 100),
  };
};

/**
 * Calculate remaining quotas for daily and monthly usage
 */
export const calculateRemainingQuotas = (
  usage: UsageData,
  plan: Plan
): { daily: number; monthly: number } => {
  return {
    daily: plan.max_daily_usage
      ? Math.max(0, plan.max_daily_usage - usage.daily.usage_count)
      : Infinity,
    monthly: plan.max_monthly_usage
      ? Math.max(0, plan.max_monthly_usage - usage.monthly.usage_count)
      : Infinity,
  };
};

/**
 * Determine upgrade recommendations based on usage patterns
 */
export const getUpgradeRecommendation = (
  usage: UsageData,
  currentPlan: Plan,
  availablePlans: Plan[]
): Plan | null => {
  const percentages = calculateUsagePercentages(usage, currentPlan);
  const remainingQuotas = calculateRemainingQuotas(usage, currentPlan);

  // If usage is consistently high (over 80%), recommend upgrade
  if (percentages.daily > 80 || percentages.monthly > 80) {
    const higherPlans = availablePlans.filter(
      (plan) => plan.max_daily_usage > currentPlan.max_daily_usage
    );
    return higherPlans[0] || null;
  }

  // If remaining quotas are low, recommend upgrade
  if (
    remainingQuotas.daily < 10 ||
    remainingQuotas.monthly < 50
  ) {
    const higherPlans = availablePlans.filter(
      (plan) => plan.max_daily_usage > currentPlan.max_daily_usage
    );
    return higherPlans[0] || null;
  }

  return null;
};

/**
 * Format subscription dates and billing cycles
 */
export const formatSubscriptionDates = (
  subscription: Subscription
): {
  startDate: string;
  endDate: string;
  nextBillingDate: string;
  billingCycle: string;
} => {
  const formatDate = (date: string | null) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return {
    startDate: formatDate(subscription.current_period_start),
    endDate: formatDate(subscription.current_period_end),
    nextBillingDate: formatDate(subscription.current_period_end), // Using period end as next billing
    billingCycle: subscription.days_until_renewal ? 'monthly' : 'N/A',
  };
};

/**
 * Validate plan eligibility and transitions
 */
export const validatePlanTransition = (
  currentPlan: Plan,
  targetPlan: Plan
): { isValid: boolean; reason?: string } => {
  // Check if it's the same plan
  if (currentPlan.id === targetPlan.id) {
    return {
      isValid: false,
      reason: 'Cannot switch to the same plan',
    };
  }

  // Check if it's a downgrade
  if (targetPlan.max_daily_usage < currentPlan.max_daily_usage) {
    return {
      isValid: false,
      reason: 'Downgrading plans is not allowed',
    };
  }

  return { isValid: true };
};

// Display Functions

/**
 * Format prices for different currencies and regions
 */
export const formatPrice = (
  price: number,
  currency: string = 'USD',
  locale: string = 'en-US'
): string => {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(price);
};

/**
 * Convert usage data to user-friendly formats
 */
export const formatUsageData = (
  usage: UsageData,
  plan: Plan
): {
  daily: string;
  monthly: string;
  remaining: {
    daily: string;
    monthly: string;
  };
} => {
  const formatCount = (count: number) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    }
    if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count.toString();
  };

  const remaining = calculateRemainingQuotas(usage, plan);

  return {
    daily: `${formatCount(usage.daily.usage_count)} / ${formatCount(
      plan.max_daily_usage || Infinity
    )}`,
    monthly: `${formatCount(usage.monthly.usage_count)} / ${formatCount(
      plan.max_monthly_usage || Infinity
    )}`,
    remaining: {
      daily: remaining.daily === Infinity ? '∞' : formatCount(remaining.daily),
      monthly: remaining.monthly === Infinity ? '∞' : formatCount(remaining.monthly),
    },
  };
};

/**
 * Generate user-facing messages and notifications
 */
export const generateUsageMessages = (
  usage: UsageData,
  plan: Plan
): {
  warning: string | null;
  notification: string | null;
} => {
  const percentages = calculateUsagePercentages(usage, plan);
  const remaining = calculateRemainingQuotas(usage, plan);

  let warning: string | null = null;
  let notification: string | null = null;

  // Warning messages
  if (percentages.daily > 90) {
    warning = `You've used ${Math.round(percentages.daily)}% of your daily quota`;
  } else if (percentages.monthly > 90) {
    warning = `You've used ${Math.round(percentages.monthly)}% of your monthly quota`;
  }

  // Notification messages
  if (remaining.daily < 10) {
    notification = `Only ${remaining.daily} daily uses remaining`;
  } else if (remaining.monthly < 50) {
    notification = `Only ${remaining.monthly} monthly uses remaining`;
  }

  return { warning, notification };
};

// Validation Functions

/**
 * Check feature access permissions
 */
export const checkFeatureAccess = (
  feature: string,
  plan: Plan
): boolean => {
  const featureConfigs: Record<string, { minPlan: string }> = {
    'code_analysis': { minPlan: 'free' },
    'advanced_analysis': { minPlan: 'premium' },
    'team_collaboration': { minPlan: 'premium' },
    'priority_support': { minPlan: 'professional' },
    'custom_integrations': { minPlan: 'professional' },
  };

  const config = featureConfigs[feature];
  if (!config) return false;

  const planHierarchy = ['free', 'premium', 'professional'];
  const userPlanIndex = planHierarchy.indexOf(plan.plan_type);
  const requiredPlanIndex = planHierarchy.indexOf(config.minPlan);

  return userPlanIndex >= requiredPlanIndex;
};

/**
 * Validate usage limits and thresholds
 */
export const validateUsageLimits = (
  usage: UsageData,
  plan: Plan
): { isValid: boolean; reason?: string } => {
  const percentages = calculateUsagePercentages(usage, plan);

  if (percentages.daily >= 100) {
    return {
      isValid: false,
      reason: 'Daily usage limit exceeded',
    };
  }

  if (percentages.monthly >= 100) {
    return {
      isValid: false,
      reason: 'Monthly usage limit exceeded',
    };
  }

  return { isValid: true };
};

/**
 * Verify plan change eligibility
 */
export const verifyPlanChangeEligibility = (
  currentPlan: Plan,
  targetPlan: Plan,
  subscription: Subscription
): { isEligible: boolean; reason?: string } => {
  // Check if subscription is active
  if (subscription.status !== 'active') {
    return {
      isEligible: false,
      reason: 'Subscription must be active to change plans',
    };
  }

  // Check if it's a valid transition
  const transitionCheck = validatePlanTransition(currentPlan, targetPlan);
  if (!transitionCheck.isValid) {
    return {
      isEligible: false,
      reason: transitionCheck.reason,
    };
  }

  return { isEligible: true };
};

/**
 * Handle edge cases in subscription logic
 */
export const handleSubscriptionEdgeCases = (
  subscription: Subscription,
  plan: Plan,
  usage: UsageData
): {
  shouldShowWarning: boolean;
  shouldBlockAccess: boolean;
  message?: string;
} => {
  // Check for trial expiration
  if (subscription.status === 'trialing' && subscription.current_period_end && new Date(subscription.current_period_end) < new Date()) {
    return {
      shouldShowWarning: true,
      shouldBlockAccess: true,
      message: 'Your trial period has expired',
    };
  }

  // Check for payment issues
  if (subscription.status === 'past_due') {
    return {
      shouldShowWarning: true,
      shouldBlockAccess: false,
      message: 'Your subscription payment is past due',
    };
  }

  // Check for usage limits
  const usageCheck = validateUsageLimits(usage, plan);
  if (!usageCheck.isValid) {
    return {
      shouldShowWarning: true,
      shouldBlockAccess: true,
      message: usageCheck.reason,
    };
  }

  return {
    shouldShowWarning: false,
    shouldBlockAccess: false,
  };
}; 