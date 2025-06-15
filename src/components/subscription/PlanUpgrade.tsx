import React, { useState, useEffect, useCallback } from 'react';
import { X, AlertCircle, Loader2, ArrowLeft, CreditCard } from 'lucide-react';
import { useSubscriptionHook } from '@/hooks/use-subscription';
import { cn } from '@/lib/utils';
import type { Plan } from '@/types/subscription';
import PlanSelector from './PlanSelector';
import FeatureComparison from './FeatureComparison';

interface PlanUpgradeProps {
  isOpen: boolean;
  onClose: () => void;
  className?: string;
}

type UpgradeStep = 'select' | 'compare' | 'payment' | 'processing' | 'error';

interface UpgradeError {
  code: string;
  message: string;
  retryable: boolean;
}

const PlanUpgrade: React.FC<PlanUpgradeProps> = ({
  isOpen,
  onClose,
  className,
}) => {
  const {
    currentPlan,
    createCheckoutSession,
    refreshSubscription,
    getRecommendedPlan,
  } = useSubscriptionHook();

  const [step, setStep] = useState<UpgradeStep>('select');
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [error, setError] = useState<UpgradeError | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [pollingInterval, setPollingInterval] = useState<NodeJS.Timeout | null>(null);

  const { recommended, suggestedPlan } = getRecommendedPlan();

  // Handle escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onClose]);

  // Handle click outside
  const handleBackdropClick = useCallback(
    (e: React.MouseEvent) => {
      if (e.target === e.currentTarget) {
        onClose();
      }
    },
    [onClose]
  );

  // Reset state when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStep('select');
      setSelectedPlan(null);
      setError(null);
      setIsLoading(false);
      if (pollingInterval) {
        clearInterval(pollingInterval);
        setPollingInterval(null);
      }
    }
  }, [isOpen, pollingInterval]);

  // Handle plan selection
  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    setStep('compare');
  };

  // Handle payment initiation
  const handlePayment = async () => {
    if (!selectedPlan) return;

    setIsLoading(true);
    setError(null);

    try {
      // Create checkout session
      await createCheckoutSession(
        selectedPlan.plan_type as 'developer' | 'professional'
      );

      // Start polling for subscription updates
      const interval = setInterval(async () => {
        try {
          await refreshSubscription();
          // Check if the subscription has been updated to the selected plan
          if (currentPlan?.id === selectedPlan.id) {
            clearInterval(interval);
            onClose();
          }
        } catch (error) {
          console.error('Error polling subscription:', error);
        }
      }, 5000);

      setPollingInterval(interval);
    } catch (err: any) {
      setError({
        code: err.code || 'PAYMENT_ERROR',
        message: err.message || 'Failed to initiate payment',
        retryable: true,
      });
      setStep('error');
    } finally {
      setIsLoading(false);
    }
  };

  // Handle retry
  const handleRetry = () => {
    setError(null);
    setStep('select');
  };

  // Get modal content based on step
  const getModalContent = () => {
    switch (step) {
      case 'select':
        return (
          <div className="space-y-6">
            <h2 className="text-2xl font-semibold text-white">Choose Your Plan</h2>
            <PlanSelector onPlanSelect={handlePlanSelect} />
          </div>
        );

      case 'compare':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <button
                onClick={() => setStep('select')}
                className="flex items-center space-x-2 text-sm text-white/60 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Plans</span>
              </button>
              <h2 className="text-2xl font-semibold text-white">Compare Features</h2>
            </div>
            <FeatureComparison showTooltips={true} />
            <div className="flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handlePayment}
                disabled={isLoading}
                className={cn(
                  'flex items-center space-x-2 px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors',
                  {
                    'bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30':
                      !isLoading,
                    'bg-white/5 cursor-not-allowed': isLoading,
                  }
                )}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    <span>Processing...</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="w-4 h-4" />
                    <span>Proceed to Payment</span>
                  </>
                )}
              </button>
            </div>
          </div>
        );

      case 'error':
        return (
          <div className="space-y-6">
            <div className="flex items-center space-x-3 text-red-400">
              <AlertCircle className="w-6 h-6" />
              <h2 className="text-2xl font-semibold">Payment Error</h2>
            </div>
            <div className="p-4 bg-red-500/10 border border-red-500/20 rounded-lg">
              <p className="text-sm text-white/80">{error?.message}</p>
            </div>
            <div className="flex justify-end space-x-4">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-white/60 hover:text-white transition-colors"
              >
                Close
              </button>
              {error?.retryable && (
                <button
                  onClick={handleRetry}
                  className="px-4 py-2 text-sm font-medium text-white bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-lg transition-colors"
                >
                  Try Again
                </button>
              )}
            </div>
          </div>
        );

      default:
        return null;
    }
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
          className="absolute top-4 right-4 p-2 text-white/60 hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="space-y-6">{getModalContent()}</div>
      </div>
    </div>
  );
};

export default PlanUpgrade; 