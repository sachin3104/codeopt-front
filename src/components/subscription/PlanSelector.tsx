import React, { useState } from 'react';
import { Check, AlertCircle, Star, ArrowRight, ChevronDown, ChevronUp } from 'lucide-react';
import { useSubscriptionHook } from '@/hooks/use-subscription';
import { cn } from '@/lib/utils';
import type { Plan } from '@/types/subscription';

interface PlanSelectorProps {
  className?: string;
  onPlanSelect?: (plan: Plan) => void;
}

const PlanSelector: React.FC<PlanSelectorProps> = ({ className, onPlanSelect }) => {
  const {
    plans,
    currentPlan,
    isActive,
    createCheckoutSession,
    getRecommendedPlan,
    canAccessFeature,
  } = useSubscriptionHook();

  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [showComparison, setShowComparison] = useState(false);
  const [expandedPlan, setExpandedPlan] = useState<number | null>(null);

  const { recommended, suggestedPlan } = getRecommendedPlan();

  // Handle plan selection
  const handlePlanSelect = async (plan: Plan) => {
    // Don't allow selection if already on this plan
    if (plan.id === currentPlan?.id) return;

    // If downgrading, show confirmation
    if (currentPlan && plan.price < currentPlan.price) {
      // TODO: Show confirmation modal
      return;
    }

    setSelectedPlan(plan);
    if (onPlanSelect) {
      onPlanSelect(plan);
    }

    // Create checkout session
    await createCheckoutSession(plan.plan_type as 'developer' | 'professional');
  };

  // Get plan features
  const getPlanFeatures = (plan: Plan) => {
    const features = [
      {
        name: 'Daily Usage',
        value: plan.max_daily_usage,
        unit: 'queries',
      },
      {
        name: 'Monthly Usage',
        value: plan.max_monthly_usage,
        unit: 'queries',
      },
      {
        name: 'Character Limit',
        value: plan.max_code_input_chars,
        unit: 'characters',
      },
      {
        name: 'Advanced Analysis',
        value: plan.plan_type !== 'free',
        type: 'boolean',
      },
      {
        name: 'Document Processing',
        value: plan.plan_type !== 'free',
        type: 'boolean',
      },
      {
        name: 'Priority Support',
        value: plan.plan_type === 'professional',
        type: 'boolean',
      },
    ];

    return features;
  };

  // Format price
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Get plan card class
  const getPlanCardClass = (plan: Plan) => {
    return cn(
      'relative backdrop-blur-xl bg-gradient-to-br from-black/40 via-black/30 to-black/20 border rounded-xl p-6 transition-all duration-300',
      {
        'border-blue-500/50 shadow-lg shadow-blue-500/20': plan.id === currentPlan?.id,
        'border-white/20 hover:border-white/40': plan.id !== currentPlan?.id,
        'cursor-pointer': plan.id !== currentPlan?.id,
        'opacity-75': plan.id === currentPlan?.id,
      }
    );
  };

  return (
    <div className={cn('space-y-6', className)}>
      {/* Plan Comparison Toggle */}
      <div className="flex justify-end">
        <button
          onClick={() => setShowComparison(!showComparison)}
          className="flex items-center space-x-2 text-sm text-white/60 hover:text-white transition-colors"
        >
          <span>{showComparison ? 'Hide Comparison' : 'Show Comparison'}</span>
          {showComparison ? (
            <ChevronUp className="w-4 h-4" />
          ) : (
            <ChevronDown className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Plan Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans?.map((plan) => (
          <div key={plan.id} className={getPlanCardClass(plan)}>
            {/* Popular Badge */}
            {plan.plan_type === 'professional' && (
              <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                <div className="flex items-center space-x-1 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
                  <Star className="w-3 h-3 text-blue-400" />
                  <span className="text-xs font-medium text-blue-400">Most Popular</span>
                </div>
              </div>
            )}

            {/* Plan Header */}
            <div className="mb-6">
              <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
              <div className="flex items-baseline space-x-1">
                <span className="text-3xl font-bold text-white">{formatPrice(plan.price)}</span>
                <span className="text-sm text-white/60">/month</span>
              </div>
              {plan.description && (
                <p className="mt-2 text-sm text-white/60">{plan.description}</p>
              )}
            </div>

            {/* Plan Features */}
            <div className="space-y-4">
              {getPlanFeatures(plan).map((feature, index) => (
                <div key={index} className="flex items-center justify-between">
                  <span className="text-sm text-white/80">{feature.name}</span>
                  {feature.type === 'boolean' ? (
                    feature.value ? (
                      <Check className="w-4 h-4 text-green-400" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-white/40" />
                    )
                  ) : (
                    <span className="text-sm font-medium text-white">
                      {feature.value === null ? '∞' : feature.value}
                      {feature.unit && (
                        <span className="text-white/60 ml-1">{feature.unit}</span>
                      )}
                    </span>
                  )}
                </div>
              ))}
            </div>

            {/* Action Button */}
            <div className="mt-6">
              {plan.id === currentPlan?.id ? (
                <button
                  disabled
                  className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-white/40 bg-white/5 rounded-lg cursor-not-allowed"
                >
                  <Check className="w-4 h-4" />
                  <span>Current Plan</span>
                </button>
              ) : (
                <button
                  onClick={() => handlePlanSelect(plan)}
                  className={cn(
                    'w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors',
                    {
                      'bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30':
                        recommended && plan.plan_type === suggestedPlan,
                      'bg-white/5 hover:bg-white/10': !recommended || plan.plan_type !== suggestedPlan,
                    }
                  )}
                >
                  <span>
                    {recommended && plan.plan_type === suggestedPlan
                      ? 'Upgrade Now'
                      : 'Select Plan'}
                  </span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Expandable Comparison */}
            {showComparison && (
              <div className="mt-6 pt-6 border-t border-white/10">
                <button
                  onClick={() =>
                    setExpandedPlan(expandedPlan === plan.id ? null : plan.id)
                  }
                  className="w-full flex items-center justify-between text-sm text-white/60 hover:text-white transition-colors"
                >
                  <span>Compare with other plans</span>
                  {expandedPlan === plan.id ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {expandedPlan === plan.id && (
                  <div className="mt-4 space-y-3">
                    {plans
                      ?.filter((p) => p.id !== plan.id)
                      .map((otherPlan) => (
                        <div
                          key={otherPlan.id}
                          className="p-3 bg-white/5 rounded-lg"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-white">
                              {otherPlan.name}
                            </span>
                            <span className="text-sm text-white/60">
                              {formatPrice(otherPlan.price)}/mo
                            </span>
                          </div>
                          <div className="text-xs text-white/60">
                            {otherPlan.description}
                          </div>
                        </div>
                      ))}
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Mobile Comparison View */}
      {!showComparison && (
        <div className="lg:hidden mt-6">
          <button
            onClick={() => setShowComparison(true)}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium text-white/80 bg-white/5 hover:bg-white/10 rounded-lg transition-colors"
          >
            <span>Compare Plans</span>
            <ChevronDown className="w-4 h-4" />
          </button>
        </div>
      )}
    </div>
  );
};

export default PlanSelector; 