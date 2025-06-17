import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  useSubscriptionData, 
  useSubscriptionLoading,
  useSubscriptionError,
  useSubscription // Only for refreshSubscription method
} from '@/context/SubscriptionContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Background } from '@/components/common/background';
import {
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  CreditCard,
  Zap,
  Users,
  Settings,
  ExternalLink,
} from 'lucide-react';
import { formatPrice, formatSubscriptionDates } from '@/lib/subscriptionHelpers';

type PaymentStatus = 'processing' | 'success' | 'error';
type PaymentType = 'upgrade' | 'renewal' | 'new';

interface PaymentSuccessProps {
  sessionId?: string;
  paymentType?: PaymentType;
  redirectUrl?: string;
}

const PaymentSuccess: React.FC<PaymentSuccessProps> = ({
  sessionId,
  paymentType = 'upgrade',
  redirectUrl = '/',
}) => {
  const navigate = useNavigate();
  
  // ✅ FIXED: Use selective hooks instead of full useSubscription
  const subscription = useSubscriptionData();
  const isLoading = useSubscriptionLoading();
  const error = useSubscriptionError();
  const { refreshSubscription } = useSubscription(); // Only get the method we need

  const [status, setStatus] = useState<PaymentStatus>('processing');
  const [pollingAttempts, setPollingAttempts] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [trackingEvent, setTrackingEvent] = useState(false);

  // ✅ FIXED: Use refs to prevent multiple polling loops and store cleanup functions
  const pollingRef = useRef<boolean>(false); // Prevent multiple polling loops
  const timeoutRef = useRef<NodeJS.Timeout | null>(null); // Store timeout for cleanup
  const mountedRef = useRef<boolean>(true); // Track if component is mounted

  // ✅ FIXED: Stable callback that doesn't change on every render
  const pollSubscription = useCallback(async () => {
    // Prevent multiple polling loops
    if (pollingRef.current || !mountedRef.current) {
      return;
    }

    const maxAttempts = 12; // 1 minute total (5s * 12)
    const pollInterval = 5000; // 5 seconds

    // Check if we've exceeded max attempts
    if (pollingAttempts >= maxAttempts) {
      setStatus('error');
      setErrorMessage('Payment processing is taking longer than expected. Please check your subscription status.');
      pollingRef.current = false;
      return;
    }

    pollingRef.current = true;

    try {
      await refreshSubscription();
      
      // Only continue if component is still mounted
      if (!mountedRef.current) {
        pollingRef.current = false;
        return;
      }
      
      // Check if subscription is active and matches the expected state
      if (subscription?.status === 'active') {
        setStatus('success');
        trackConversion();
        pollingRef.current = false;
        return;
      }
      
      // Schedule next poll if we haven't reached max attempts
      const nextAttempt = pollingAttempts + 1;
      setPollingAttempts(nextAttempt);
      
      if (nextAttempt < maxAttempts && mountedRef.current) {
        timeoutRef.current = setTimeout(() => {
          pollingRef.current = false;
          pollSubscription();
        }, pollInterval);
      } else {
        pollingRef.current = false;
      }
      
    } catch (err) {
      console.error('Error polling subscription:', err);
      
      if (!mountedRef.current) {
        pollingRef.current = false;
        return;
      }
      
      // Schedule retry on error if we haven't reached max attempts
      const nextAttempt = pollingAttempts + 1;
      setPollingAttempts(nextAttempt);
      
      if (nextAttempt < maxAttempts && mountedRef.current) {
        timeoutRef.current = setTimeout(() => {
          pollingRef.current = false;
          pollSubscription();
        }, pollInterval);
      } else {
        pollingRef.current = false;
      }
    }
  }, [pollingAttempts, subscription?.status, refreshSubscription]);

  // ✅ FIXED: Clean useEffect with proper dependencies and cleanup
  useEffect(() => {
    // Only start polling if status is processing and not already polling
    if (status === 'processing' && !pollingRef.current) {
      pollSubscription();
    }

    // ✅ FIXED: Proper cleanup function
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      pollingRef.current = false;
    };
  }, [status]); // ✅ FIXED: Only depend on status, not functions

  // ✅ FIXED: Cleanup on unmount
  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      pollingRef.current = false;
    };
  }, []);

  // Track successful conversion
  const trackConversion = async () => {
    if (trackingEvent) return;

    try {
      // Track conversion event
      await fetch('/api/analytics/track', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          event: 'subscription_activated',
          type: paymentType,
          plan: subscription?.plan.plan_type,
          sessionId,
        }),
      });

      setTrackingEvent(true);
    } catch (err) {
      console.error('Error tracking conversion:', err);
    }
  };

  // Handle navigation
  const handleContinue = () => {
    navigate(redirectUrl);
  };

  // Get success message based on payment type
  const getSuccessMessage = () => {
    switch (paymentType) {
      case 'upgrade':
        return 'Your plan has been successfully upgraded!';
      case 'renewal':
        return 'Your subscription has been renewed successfully!';
      case 'new':
        return 'Welcome! Your subscription is now active.';
      default:
        return 'Payment processed successfully!';
    }
  };

  // Get next steps based on payment type
  const getNextSteps = () => {
    const steps = [
      {
        icon: <Zap className="w-5 h-5 text-blue-400" />,
        title: 'Start Using Premium Features',
        description: 'Access all the features included in your new plan.',
      },
    ];

    if (subscription?.plan.plan_type === 'professional') {
      steps.push({
        icon: <Users className="w-5 h-5 text-blue-400" />,
        title: 'Invite Team Members',
        description: 'Share your subscription with your team.',
      });
    }

    steps.push({
      icon: <Settings className="w-5 h-5 text-blue-400" />,
      title: 'Configure Your Settings',
      description: 'Customize your preferences and usage limits.',
    });

    return steps;
  };

  if (isLoading || status === 'processing') {
    return (
      <>
        <Background />
        <div className="min-h-screen bg-transparent flex items-center justify-center p-6 relative z-10">
          <div className="text-center">
            <LoadingSpinner size="lg" state="processing" text="Processing your payment..." />
            <p className="mt-4 text-gray-400">This may take a few moments...</p>
          </div>
        </div>
      </>
    );
  }

  if (status === 'error') {
    return (
      <>
        <Background />
        <div className="min-h-screen bg-transparent flex items-center justify-center p-6 relative z-10">
          <div className="max-w-md w-full text-center">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <AlertCircle className="w-8 h-8 text-red-500" />
            </div>
            <h1 className="text-2xl font-bold text-white mb-2">Payment Processing Error</h1>
            <p className="text-gray-400 mb-6">{errorMessage || 'There was an error processing your payment.'}</p>
            <div className="space-y-3">
              <button
                onClick={() => {
                  // Reset state and retry
                  setStatus('processing');
                  setPollingAttempts(0);
                  setErrorMessage(null);
                  pollingRef.current = false;
                }}
                className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
              >
                Check Status Again
              </button>
              <button
                onClick={() => navigate('/subscription')}
                className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
              >
                Return to Subscription
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  const dates = subscription ? formatSubscriptionDates(subscription) : null;

  return (
    <>
      <Background />
      <div className="min-h-screen bg-transparent p-6 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Success Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle2 className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
            <p className="text-gray-400">{getSuccessMessage()}</p>
          </div>

          {/* Subscription Details */}
          {subscription && (
            <div className="backdrop-blur-xl bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl p-6 mb-8">
              <h2 className="text-xl font-semibold mb-4">Subscription Details</h2>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Plan</span>
                  <span className="font-medium">{subscription.plan.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-400">Price</span>
                  <span className="font-medium">
                    {formatPrice(subscription.plan.price, subscription.plan.currency)}/month
                  </span>
                </div>
                {dates && (
                  <>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Start Date</span>
                      <span className="font-medium">{dates.startDate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-gray-400">Next Billing</span>
                      <span className="font-medium">{dates.nextBillingDate}</span>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {/* Next Steps */}
          <div className="backdrop-blur-xl bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Next Steps</h2>
            <div className="space-y-4">
              {getNextSteps().map((step, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0">
                    {step.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{step.title}</h3>
                    <p className="text-sm text-gray-400">{step.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleContinue}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
            >
              <span>Continue to Home</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <button
              onClick={() => navigate('/subscription')}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <CreditCard className="w-5 h-5" />
              <span>Manage Subscription</span>
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PaymentSuccess;