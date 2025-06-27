import React, { useEffect, useState } from 'react';
import { PlanType, subscriptionService } from '@/api/subscription';
import type { Plan } from '@/types/subscription';
import { useSubscription } from '@/hooks/use-subscription';
import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@/types/subscription';

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
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);

  useEffect(() => {
    setLoading(true);
    subscriptionService.getPlans()
      .then((allPlans) => {
        // Filter only plans with 'subscribe' action type
        const normalPlans = allPlans.filter(plan => plan.action_type === 'subscribe');
        setPlans(normalPlans);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  const handleSelect = async (plan: Plan) => {
    setSelectedPlan(plan.plan_type as PlanType);
    
    try {
      if (plan.plan_type === PlanType.FREE) {
        // Always use createSubscription for free plan
        await createSubscription(plan.plan_type as PlanType);
      } else {
        // Use checkout for all paid plans (no update subscription)
        await startCheckout(plan.plan_type as PlanType);
      }
    } catch (error) {
      // Error is handled by the context
      console.error('Plan selection error:', error);
    } finally {
      setSelectedPlan(null);
    }
  };

  // Helper function to determine if user has a paid subscription
  const hasPaidSubscription = subscription && subscription.plan.plan_type !== PlanType.FREE;

  if (loading) {
    return <div className="text-center py-8 text-lg text-gray-500">Loading plans…</div>;
  }
  if (error) {
    return <div className="text-center py-8 text-red-600">{error.response?.data.message || error.message}</div>;
  }

  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map((plan) => {
          const isCurrent = subscription?.plan.plan_type === plan.plan_type;
          const isLoading =
            (selectedPlan === plan.plan_type && (createLoading || checkoutLoading));
          const planError =
            selectedPlan === plan.plan_type ? createError || checkoutError : null;
          
          // Determine button text based on current state
          const getButtonText = () => {
            if (isCurrent) return 'Current Plan';
            if (isLoading) return 'Processing…';
            
            if (plan.plan_type === PlanType.FREE) return 'Select Free';
            return 'Upgrade';
          };

          return (
            <div
              key={plan.plan_type}
              className={`backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl p-6 flex flex-col justify-between min-h-[340px] transition-all duration-200 ${
                isCurrent ? 'ring-2 ring-blue-400' : ''
              }`}
            >
              <div>
                <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
                  {plan.name}
                  {isCurrent && (
                    <span className="ml-2 px-2 py-1 text-xs rounded-full bg-blue-500/20 text-blue-400 border border-blue-500/30">Current</span>
                  )}
                </h3>
                <p className="mt-2 text-white/70">{plan.description}</p>
                <div className="mt-4 text-3xl font-bold text-white">
                  {plan.price === 0 ? 'Free' : `$${plan.price}/mo`}
                </div>
                
                {/* Plan Features */}
                <ul className="mt-4 space-y-1 text-white/80 text-sm">
                  <li>Max code input: {plan.max_code_input_chars ? plan.max_code_input_chars.toLocaleString() : 'Unlimited'}</li>
                  <li>
                    Daily requests: {plan.max_daily_usage != null ? plan.max_daily_usage : 'Unlimited'}
                  </li>
                  <li>
                    Monthly requests: {plan.max_monthly_usage != null ? plan.max_monthly_usage : 'Unlimited'}
                  </li>
                </ul>
              </div>
              
              <div className="mt-6">
                <button
                  onClick={() => handleSelect(plan)}
                  disabled={isCurrent || isLoading}
                  className={`w-full py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${
                    isCurrent 
                      ? 'bg-white/20 text-white/60 cursor-default' 
                      : isLoading 
                        ? 'bg-white/10 text-white/50 cursor-not-allowed'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                  }`}
                >
                  {getButtonText()}
                </button>
                {planError && (
                  <p className="mt-2 text-sm text-red-400">
                    {planError.response?.data.message || planError.message}
                  </p>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default NormalPlans; 