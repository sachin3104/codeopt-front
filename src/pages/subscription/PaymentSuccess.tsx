import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/context/SubscriptionContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';
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
  const {
    subscription,
    refreshSubscription,
    isLoading,
    error,
  } = useSubscription();

  const [status, setStatus] = useState<PaymentStatus>('processing');
  const [pollingAttempts, setPollingAttempts] = useState(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [trackingEvent, setTrackingEvent] = useState(false);

  // Poll for subscription updates
  useEffect(() => {
    const maxAttempts = 12; // 1 minute total (5s * 12)
    const pollInterval = 5000; // 5 seconds

    const pollSubscription = async () => {
      if (pollingAttempts >= maxAttempts) {
        setStatus('error');
        setErrorMessage('Payment processing is taking longer than expected. Please check your subscription status.');
        return;
      }

      try {
        await refreshSubscription();
        
        // Check if subscription is active and matches the expected state
        if (subscription?.status === 'active') {
          setStatus('success');
          trackConversion();
        } else {
          setPollingAttempts(prev => prev + 1);
          setTimeout(pollSubscription, pollInterval);
        }
      } catch (err) {
        console.error('Error polling subscription:', err);
        setPollingAttempts(prev => prev + 1);
        setTimeout(pollSubscription, pollInterval);
      }
    };

    if (status === 'processing') {
      pollSubscription();
    }

    return () => {
      // Cleanup polling on unmount
      setPollingAttempts(0);
    };
  }, [subscription, status, pollingAttempts, refreshSubscription]);

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
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <div className="text-center">
          <LoadingSpinner size="lg" state="processing" text="Processing your payment..." />
          <p className="mt-4 text-gray-400">This may take a few moments...</p>
        </div>
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-6">
        <div className="max-w-md w-full text-center">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-8 h-8 text-red-500" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Payment Processing Error</h1>
          <p className="text-gray-400 mb-6">{errorMessage || 'There was an error processing your payment.'}</p>
          <div className="space-y-3">
            <button
              onClick={() => refreshSubscription()}
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
    );
  }

  const dates = subscription ? formatSubscriptionDates(subscription) : null;

  return (
    <div className="min-h-screen bg-gray-900 p-6">
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
          <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
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
        <div className="bg-gray-800 rounded-xl p-6 border border-gray-700 mb-8">
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
  );
};

export default PaymentSuccess; 