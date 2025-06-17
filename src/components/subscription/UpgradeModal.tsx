import React, { useState, useEffect, useCallback } from 'react';
import { X, Check, Star, Loader2, AlertCircle } from 'lucide-react';
import { useSubscriptionHook } from '@/hooks/use-subscription';
import { cn } from '@/lib/utils';
import type { Plan } from '@/types/subscription';

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

const UpgradeModal: React.FC<UpgradeModalProps> = ({
  isOpen,
  onClose,
  className,
}) => {
  const {
    plans,
    currentPlan,
    isLoading,
    createCheckoutSession,
    getRecommendedPlan,
  } = useSubscriptionHook();

  const [processingPlan, setProcessingPlan] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { recommended, suggestedPlan } = getRecommendedPlan();

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !processingPlan) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose, processingPlan]);

  // Handle click outside
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget && !processingPlan) {
        onClose();
      }
    },
    [onClose, processingPlan]
  );

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setProcessingPlan(null);
      setError(null);
    }
  }, [isOpen]);

  // Handle plan selection and immediate checkout
  const handlePlanSelect = async (plan: Plan) => {
    // Don't allow selection if already processing or on current plan
    if (processingPlan || plan.id === currentPlan?.id) return;

    // Can't create checkout for free plan
    if (plan.plan_type === 'free') {
      setError('Free plan cannot be purchased. Contact support to downgrade.');
      return;
    }

    console.log('=== Creating Checkout for Plan ===');
    console.log('Plan:', plan.name);
    console.log('Type:', plan.plan_type);
    console.log('Price:', plan.price);
    console.log('================================');

    setProcessingPlan(plan.id);
    setError(null);

    try {
      // Create checkout session and redirect to Stripe
      await createCheckoutSession(plan);
      // If we reach here, checkout creation failed (should redirect)
      throw new Error('Checkout session created but no redirect occurred');
    } catch (err: any) {
      console.error('Checkout creation failed:', err);
      setError(err.message || 'Failed to create checkout session');
      setProcessingPlan(null);
    }
  };

  // Get plan features for display
  const getPlanFeatures = (plan: Plan) => {
    const features = [];

    // Usage limits
    if (plan.max_daily_usage) {
      features.push(`${plan.max_daily_usage} daily queries`);
    } else {
      features.push('Unlimited daily queries');
    }

    if (plan.max_monthly_usage) {
      features.push(`${plan.max_monthly_usage} monthly queries`);
    } else {
      features.push('Unlimited monthly queries');
    }

    // Character limit
    features.push(`${plan.max_code_input_chars.toLocaleString()} character limit`);

    // Plan-specific features
    switch (plan.plan_type) {
      case 'free':
        features.push('Basic analysis');
        features.push('Community support');
        break;
      case 'developer':
        features.push('Advanced analysis');
        features.push('Document processing');
        features.push('Email support');
        break;
      case 'professional':
        features.push('Advanced analysis');
        features.push('Document processing');
        features.push('Custom rules');
        features.push('API access');
        features.push('Priority support');
        break;
    }

    return features.slice(0, 5); // Show max 5 features
  };

  // Format price
  const formatPrice = (price: number, currency: string = 'USD') => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
      minimumFractionDigits: 0,
    }).format(price);
  };

  // Get plan card styling
  const getPlanCardClass = (plan: Plan) => {
    const isCurrentPlan = plan.id === currentPlan?.id;
    const isRecommended = recommended && plan.plan_type === suggestedPlan;
    const isProcessing = processingPlan === plan.id;

    return cn(
      'relative backdrop-blur-xl bg-gradient-to-br border rounded-xl p-6 transition-all duration-300',
      {
        'from-green-500/10 via-green-500/5 to-transparent border-green-500/30': isCurrentPlan,
        'from-blue-500/10 via-blue-500/5 to-transparent border-blue-500/30': isRecommended && !isCurrentPlan,
        'from-black/40 via-black/30 to-black/20 border-white/20 hover:border-white/40 cursor-pointer': !isCurrentPlan && !isRecommended,
        'cursor-not-allowed opacity-50': isCurrentPlan,
        'cursor-wait opacity-75': isProcessing,
      }
    );
  };

  // Get button styling and text
  const getButtonProps = (plan: Plan) => {
    const isCurrentPlan = plan.id === currentPlan?.id;
    const isProcessing = processingPlan === plan.id;
    const isRecommended = recommended && plan.plan_type === suggestedPlan;

    if (isCurrentPlan) {
      return {
        disabled: true,
        className: 'w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium text-white/40 bg-white/5 rounded-lg cursor-not-allowed',
        children: (
          <>
            <Check className="w-4 h-4" />
            <span>Current Plan</span>
          </>
        ),
      };
    }

    if (isProcessing) {
      return {
        disabled: true,
        className: 'w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium text-white bg-blue-500/50 rounded-lg cursor-wait',
        children: (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Processing...</span>
          </>
        ),
      };
    }

    return {
      disabled: false,
      className: cn(
        'w-full flex items-center justify-center space-x-2 px-4 py-3 text-sm font-medium text-white rounded-lg transition-colors',
        {
          'bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30': isRecommended,
          'bg-white/10 hover:bg-white/20': !isRecommended,
        }
      ),
      children: (
        <span>{isRecommended ? 'Select Recommended' : 'Select Plan'}</span>
      ),
    };
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={handleBackdropClick}
    >
      <div
        className={cn(
          'relative w-full max-w-4xl max-h-[90vh] overflow-y-auto backdrop-blur-xl bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl p-6',
          className
        )}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          disabled={!!processingPlan}
          className="absolute top-4 right-4 p-2 text-white/60 hover:text-white transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-2">Choose Your Plan</h2>
          <p className="text-white/60">
            Select a plan and you'll be redirected to secure checkout
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
            <div>
              <p className="text-red-400 font-medium">Payment Error</p>
              <p className="text-red-300/80 text-sm mt-1">{error}</p>
            </div>
          </div>
        )}

        {/* Plans Grid */}
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="w-8 h-8 animate-spin text-white/60" />
            <span className="ml-3 text-white/60">Loading plans...</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {plans?.map((plan) => (
              <div key={plan.id} className={getPlanCardClass(plan)}>
                {/* Popular Badge */}
                {recommended && plan.plan_type === suggestedPlan && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="flex items-center space-x-1 px-3 py-1 bg-blue-500/20 border border-blue-500/30 rounded-full">
                      <Star className="w-3 h-3 text-blue-400" />
                      <span className="text-xs font-medium text-blue-400">Recommended</span>
                    </div>
                  </div>
                )}

                {/* Current Plan Badge */}
                {plan.id === currentPlan?.id && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                    <div className="flex items-center space-x-1 px-3 py-1 bg-green-500/20 border border-green-500/30 rounded-full">
                      <Check className="w-3 h-3 text-green-400" />
                      <span className="text-xs font-medium text-green-400">Current Plan</span>
                    </div>
                  </div>
                )}

                {/* Plan Header */}
                <div className="mb-6 text-center">
                  <h3 className="text-xl font-semibold text-white mb-2">{plan.name}</h3>
                  <div className="mb-3">
                    <span className="text-3xl font-bold text-white">
                      {formatPrice(plan.price, plan.currency)}
                    </span>
                    <span className="text-white/60 text-sm">/month</span>
                  </div>
                  {plan.description && (
                    <p className="text-sm text-white/60">{plan.description}</p>
                  )}
                </div>

                {/* Plan Features */}
                <div className="mb-6 space-y-3">
                  {getPlanFeatures(plan).map((feature, index) => (
                    <div key={index} className="flex items-center space-x-3">
                      <Check className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-sm text-white/80">{feature}</span>
                    </div>
                  ))}
                </div>

                {/* Action Button */}
                <button
                  onClick={() => handlePlanSelect(plan)}
                  {...getButtonProps(plan)}
                />
              </div>
            ))}
          </div>
        )}

        {/* Footer */}
        <div className="mt-8 pt-6 border-t border-white/10 text-center">
          <p className="text-sm text-white/60">
            Secure checkout powered by Stripe • Cancel anytime
          </p>
        </div>
      </div>
    </div>
  );
};

export default UpgradeModal;