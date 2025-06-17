import React, { useMemo } from 'react';
import { CreditCard, ArrowUpRight, AlertCircle, CheckCircle2 } from 'lucide-react';
import { 
  useSubscriptionData,
  useSubscriptionPlans,
  useUsageData,
  useSubscription // Only for methods
} from '@/context/SubscriptionContext';
import { cn } from '@/lib/utils';

interface SubscriptionWidgetProps {
  className?: string;
  variant?: 'compact' | 'detailed';
}

const SubscriptionWidget: React.FC<SubscriptionWidgetProps> = ({
  className,
  variant = 'compact',
}) => {
  // ✅ FIXED: Use selective hooks instead of full useSubscriptionHook
  const subscription = useSubscriptionData();
  const plans = useSubscriptionPlans();
  const usage = useUsageData();

  // ✅ FIXED: Only get methods from full context (these don't cause re-renders)
  const {
    hasFeatureAccess,
    createCheckoutSession,
    openBillingPortal,
    shouldRecommendUpgrade,
  } = useSubscription();

  // ✅ FIXED: Memoize derived values to prevent unnecessary recalculations
  const currentPlan = useMemo(() => subscription?.plan, [subscription?.plan]);
  
  const isActive = useMemo(() => subscription?.is_active || false, [subscription?.is_active]);
  
  const isCancelled = useMemo(() => subscription?.status === 'cancelled', [subscription?.status]);

  const usageStats = useMemo(() => {
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

  const recommendation = useMemo(() => {
    const { recommended, reason, suggestedPlan } = shouldRecommendUpgrade();
    return { recommended, reason, suggestedPlan };
  }, [shouldRecommendUpgrade]);

  const findPlanByType = useMemo(() => {
    return (planType: string) => {
      return plans?.find(plan => plan.plan_type === planType) || null;
    };
  }, [plans]);

  // ✅ FIXED: Memoize percentage calculations
  const dailyPercentage = useMemo(() => 
    usageStats?.daily.limit 
      ? (usageStats.daily.used / usageStats.daily.limit) * 100 
      : 0,
    [usageStats?.daily.used, usageStats?.daily.limit]
  );

  const monthlyPercentage = useMemo(() => 
    usageStats?.monthly.limit 
      ? (usageStats.monthly.used / usageStats.monthly.limit) * 100 
      : 0,
    [usageStats?.monthly.used, usageStats?.monthly.limit]
  );

  // Get status color
  const getStatusColor = () => {
    if (isCancelled) return 'text-red-400';
    if (!isActive) return 'text-yellow-400';
    return 'text-green-400';
  };

  // Get usage bar color
  const getUsageBarColor = (percentage: number) => {
    if (percentage >= 90) return 'bg-red-500';
    if (percentage >= 70) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <div
      className={cn(
        'backdrop-blur-xl bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl p-4',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <CreditCard className="w-5 h-5 text-white/80" />
          <h3 className="text-sm font-medium text-white">Subscription</h3>
        </div>
        <div className={cn('flex items-center space-x-1 text-xs', getStatusColor())}>
          {isCancelled ? (
            <AlertCircle className="w-4 h-4" />
          ) : (
            <CheckCircle2 className="w-4 h-4" />
          )}
          <span>{isCancelled ? 'Cancelled' : isActive ? 'Active' : 'Inactive'}</span>
        </div>
      </div>

      {/* Plan Info */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-white/60">Current Plan</span>
          <span className="text-sm font-medium text-white">{currentPlan?.name || 'Free'}</span>
        </div>
        {variant === 'detailed' && (
          <p className="text-xs text-white/60">{currentPlan?.description}</p>
        )}
      </div>

      {/* Usage Meters */}
      <div className="space-y-3 mb-4">
        {/* Daily Usage */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-white/60">Daily Usage</span>
            <span className="text-xs text-white">
              {usageStats?.daily.used || 0}/{usageStats?.daily.limit || '∞'}
            </span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className={cn('h-full transition-all duration-300', getUsageBarColor(dailyPercentage))}
              style={{ width: `${Math.min(dailyPercentage, 100)}%` }}
            />
          </div>
        </div>

        {/* Monthly Usage */}
        <div>
          <div className="flex items-center justify-between mb-1">
            <span className="text-xs text-white/60">Monthly Usage</span>
            <span className="text-xs text-white">
              {usageStats?.monthly.used || 0}/{usageStats?.monthly.limit || '∞'}
            </span>
          </div>
          <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden">
            <div
              className={cn('h-full transition-all duration-300', getUsageBarColor(monthlyPercentage))}
              style={{ width: `${Math.min(monthlyPercentage, 100)}%` }}
            />
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex flex-col space-y-2">
        {recommendation.recommended && (
          <button
            onClick={() => {
              const plan = findPlanByType(recommendation.suggestedPlan);
              if (plan) {
                createCheckoutSession(plan);
              }
            }}
            className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium text-white bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg transition-colors"
          >
            <ArrowUpRight className="w-4 h-4" />
            <span>Upgrade Plan</span>
          </button>
        )}
        <button
          onClick={openBillingPortal}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-sm font-medium text-white/80 hover:text-white bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
        >
          <CreditCard className="w-4 h-4" />
          <span>Manage Subscription</span>
        </button>
      </div>

      {/* Feature Access Indicators */}
      {variant === 'detailed' && (
        <div className="mt-4 pt-4 border-t border-white/10">
          <h4 className="text-xs font-medium text-white/60 mb-2">Available Features</h4>
          <div className="grid grid-cols-2 gap-2">
            {['convert', 'document', 'advanced-analysis'].map((feature) => (
              <div
                key={feature}
                className={cn(
                  'flex items-center space-x-1 text-xs',
                  hasFeatureAccess(feature) ? 'text-green-400' : 'text-white/40'
                )}
              >
                {hasFeatureAccess(feature) ? (
                  <CheckCircle2 className="w-3 h-3" />
                ) : (
                  <AlertCircle className="w-3 h-3" />
                )}
                <span className="capitalize">{feature.replace('-', ' ')}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default SubscriptionWidget;