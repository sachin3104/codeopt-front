import React, { useEffect, useState } from 'react';
import { PlanType,subscriptionService } from '@/api/subscription';
import type { Plan } from '@/types/subscription';
import { useSubscription } from '@/hooks/use-subscription';
import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@/types/subscription';
import { Check, MoveRight } from 'lucide-react';

const NormalPlans: React.FC = () => {
  const {
    subscription,
    createSubscription,
    createLoading,
    createError,
    startCheckout,
    checkoutLoading,
    checkoutError,
  } = useSubscription();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AxiosError<ApiErrorResponse> | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    subscriptionService.getPlans()
      .then((allPlans) => {
        // Filter only plans with 'subscribe' action type
        const normalPlans = allPlans.filter(plan => plan.action_type === 'subscribe');
        // Available plans loaded
        setPlans(normalPlans);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = async (plan: Plan) => {
    setSelectedPlan(plan.plan_type);
    
    try {
      // Map the API plan types to the expected enum values
      let enumPlanType: PlanType;
      switch (plan.plan_type) {
        case 'optqo_free':
          enumPlanType = PlanType.FREE;
          break;
        case 'optqo_pro':
          enumPlanType = PlanType.DEVELOPER;
          break;
        case 'optqo_ultimate':
          enumPlanType = PlanType.PROFESSIONAL;
          break;
        default:
          throw new Error(`Unknown plan type: ${plan.plan_type}`);
      }
  
      if (plan.plan_type === 'optqo_free') {
        // Always use createSubscription for free plan
        await createSubscription(enumPlanType);
      } else {
        // Use checkout for all paid plans
        await startCheckout(enumPlanType);
      }
    } catch (error) {
      // Error is handled by the context
    } finally {
      setSelectedPlan(null);
    }
  };
  
  // Helper function to get plan hierarchy level based on actual plan types
  const getPlanLevel = (planType: string): number => {
    switch (planType) {
      case 'optqo_free':
        return 0;
      case 'optqo_pro':
        return 1;
      case 'optqo_ultimate':
        return 2;
      default:
        return -1;
    }
  };



  // Helper function to determine if a plan should be disabled
  const isPlanDisabled = (plan: Plan) => {
    // If subscription exists, use its plan type
    const currentPlanType = subscription?.plan.plan_type;
    const targetPlanType = plan.plan_type;
    
    // If no subscription, only disable if currently processing
    if (!currentPlanType) {
      return selectedPlan === targetPlanType && (createLoading || checkoutLoading);
    }
    
    // If it's the current plan, always disabled
    if (currentPlanType === targetPlanType) return true;
    
    // Get plan levels for comparison
    const currentLevel = getPlanLevel(currentPlanType);
    const targetLevel = getPlanLevel(targetPlanType);
    
    // Disable if target plan is lower than current plan (only when levels are valid)
    if (currentLevel >= 0 && targetLevel >= 0 && currentLevel > targetLevel) {
      return true;
    }
    
    // If the plan is currently being processed
    if (selectedPlan === targetPlanType && (createLoading || checkoutLoading)) return true;
    
    return false;
  };

  // Helper function to get button text
  const getButtonText = (plan: Plan) => {
    const currentPlanType = subscription?.plan.plan_type;
    const isCurrent = currentPlanType === plan.plan_type;
    const isLoading = selectedPlan === plan.plan_type && (createLoading || checkoutLoading);
    
    if (isCurrent) return 'Current Plan';
    if (isLoading) return 'Processing…';
    
    // Get plan levels for comparison
    const currentLevel = currentPlanType ? getPlanLevel(currentPlanType) : -1;
    const targetLevel = getPlanLevel(plan.plan_type);
    
    // Custom messages for downgrade scenarios
    if (currentLevel >= 0 && targetLevel >= 0 && currentLevel > targetLevel) {
      return 'Not Available';
    }
    
    if (plan.plan_type === 'optqo_free') return 'Get Started';
    return 'Subscribe Now';
  };

  if (loading) {
    return <div className="text-center py-8 text-lg text-gray-500">Loading plans…</div>;
  }
  if (error) {
    return <div className="text-center py-8 text-red-600">{error.response?.data.message || error.message}</div>;
  }

  // Plans and subscription data loaded
  
  return (
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
        {plans.map((plan) => {
          const isCurrent = subscription?.plan.plan_type === plan.plan_type;
          const isDisabled = isPlanDisabled(plan);
          const planError =
            selectedPlan === plan.plan_type ? createError || checkoutError : null;

          // Create features array for the plan
          const features = [
            `Max code input: ${plan.max_code_input_chars ? plan.max_code_input_chars.toLocaleString() : 'Unlimited'}`,
            `Daily requests: ${plan.max_daily_usage != null ? plan.max_daily_usage : 'Unlimited'}`
          ];

          return (
            <div
              key={plan.plan_type}
              className={`backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl p-3 sm:p-4 flex flex-col h-auto min-h-[280px] sm:min-h-[320px] md:min-h-[360px] lg:h-[500px] w-full ${
                isCurrent ? 'ring-2 ring-blue-400' : ''
              }`}
            >
              {/* Plan Name and Description */}
              <div className="min-h-[50px] sm:min-h-[60px] md:min-h-[70px] lg:min-h-[100px]">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2 md:mb-3 leading-tight flex items-center gap-2">
                  {plan.name}
                  {isCurrent && (
                    <span className="px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">Current</span>
                  )}
                </h3>
                <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                  {plan.description}
                </p>
              </div>

              {/* Pricing */}
              <div className="flex flex-col items-start mb-2 sm:mb-2 md:mb-3 lg:mb-6">
                <div className="flex items-baseline">
                  <span className="text-lg sm:text-xl font-bold text-white">
                    {plan.price === 0 ? 'Free' : `$${plan.price}`}
                  </span>
                  <span className="text-xs sm:text-sm text-white/60 ml-1">
                    {plan.price === 0 ? '/forever' : '/per month'}
                  </span>
                </div>
              </div>

              {/* Features List */}
              <div className="flex-1 space-y-1 sm:space-y-1 md:space-y-2 lg:space-y-4 mb-2 sm:mb-2 md:mb-3 lg:mb-6">
                <div className="space-y-1 sm:space-y-1 md:space-y-2 lg:space-y-3">
                  {features.map((feature, idx) => (
                    <div key={idx} className="flex items-start gap-2 sm:gap-3">
                      <Check className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                      <span className="text-xs sm:text-sm text-white/80 leading-relaxed">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handleSelect(plan)}
                disabled={isDisabled}
                className={`w-full backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 hover:bg-white/20 transition-all duration-300 rounded-xl text-white px-3 py-2 sm:py-3 lg:py-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base lg:text-sm ${
                  isDisabled 
                    ? 'bg-white/20 text-white/60 cursor-default' 
                    : ''
                }`}
              >
                {getButtonText(plan)} <MoveRight className="w-3 h-3 sm:w-4 sm:h-4" />
              </button>
              
              {planError && (
                <p className="mt-2 text-xs sm:text-sm text-red-400">
                  {planError.response?.data.message || planError.message}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NormalPlans;