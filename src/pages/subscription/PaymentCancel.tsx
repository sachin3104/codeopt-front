import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSubscription } from '@/context/SubscriptionContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { Background } from '@/components/common/background';
import {
  AlertCircle,
  ArrowLeft,
  CreditCard,
  HelpCircle,
  RefreshCw,
  Shield,
  XCircle,
} from 'lucide-react';

interface PaymentCancelProps {
  sessionId?: string;
  returnUrl?: string;
  selectedPlan?: string;
}

const PaymentCancel: React.FC<PaymentCancelProps> = ({
  sessionId,
  returnUrl = '/subscription',
  selectedPlan,
}) => {
  const navigate = useNavigate();
  const { subscription, refreshSubscription, isLoading } = useSubscription();

  const [isTracking, setIsTracking] = useState(false);
  const [showSupportModal, setShowSupportModal] = useState(false);
  const [cancellationReason, setCancellationReason] = useState<string>('');

  // Track cancellation event
  useEffect(() => {
    const trackCancellation = async () => {
      if (isTracking) return;

      try {
        await fetch('/api/analytics/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            event: 'payment_cancelled',
            sessionId,
            selectedPlan,
            reason: cancellationReason || 'user_cancelled',
          }),
        });

        setIsTracking(true);
      } catch (err) {
        console.error('Error tracking cancellation:', err);
      }
    };

    trackCancellation();
  }, [sessionId, selectedPlan, cancellationReason, isTracking]);

  // Handle navigation
  const handleReturn = () => {
    navigate(returnUrl);
  };

  const handleRetry = () => {
    navigate(`/subscription/checkout?plan=${selectedPlan}`);
  };

  // Get cancellation message based on context
  const getCancellationMessage = () => {
    if (selectedPlan) {
      return `Your attempt to subscribe to the ${selectedPlan} plan was cancelled.`;
    }
    return 'Your payment process was cancelled.';
  };

  // Get recovery options based on context
  const getRecoveryOptions = () => {
    const options = [
      {
        icon: <RefreshCw className="w-5 h-5 text-blue-400" />,
        title: 'Try Again',
        description: 'Restart the payment process with your current selection.',
        action: handleRetry,
      },
      {
        icon: <CreditCard className="w-5 h-5 text-blue-400" />,
        title: 'Choose Different Plan',
        description: 'Explore other subscription options that might better suit your needs.',
        action: () => navigate('/subscription'),
      },
    ];

    if (subscription?.status === 'active') {
      options.push({
        icon: <Shield className="w-5 h-5 text-blue-400" />,
        title: 'Keep Current Plan',
        description: 'Continue with your existing subscription.',
        action: () => navigate('/dashboard'),
      });
    }

    return options;
  };

  if (isLoading) {
    return (
      <>
        <Background />
        <div className="min-h-screen bg-transparent flex items-center justify-center p-6 relative z-10">
          <LoadingSpinner size="lg" state="loading" text="Loading..." />
        </div>
      </>
    );
  }

  return (
    <>
      <Background />
      <div className="min-h-screen bg-transparent p-6 relative z-10">
        <div className="max-w-2xl mx-auto">
          {/* Cancellation Header */}
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <XCircle className="w-10 h-10 text-red-500" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Payment Cancelled</h1>
            <p className="text-gray-400">{getCancellationMessage()}</p>
          </div>

          {/* Recovery Options */}
          <div className="backdrop-blur-xl bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">What would you like to do?</h2>
            <div className="space-y-4">
              {getRecoveryOptions().map((option, index) => (
                <button
                  key={index}
                  onClick={option.action}
                  className="w-full flex items-start space-x-4 p-4 bg-gray-700/50 hover:bg-gray-700 rounded-lg transition-colors text-left"
                >
                  <div className="w-8 h-8 rounded-lg bg-gray-600 flex items-center justify-center flex-shrink-0">
                    {option.icon}
                  </div>
                  <div>
                    <h3 className="font-medium text-white">{option.title}</h3>
                    <p className="text-sm text-gray-400">{option.description}</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Support Section */}
          <div className="backdrop-blur-xl bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl p-6 mb-8">
            <h2 className="text-xl font-semibold mb-4">Need Help?</h2>
            <div className="space-y-4">
              <div className="flex items-start space-x-4">
                <div className="w-8 h-8 rounded-lg bg-gray-700 flex items-center justify-center flex-shrink-0">
                  <HelpCircle className="w-5 h-5 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-medium text-white">Contact Support</h3>
                  <p className="text-sm text-gray-400 mb-2">
                    Our team is here to help you with any questions or issues.
                  </p>
                  <button
                    onClick={() => setShowSupportModal(true)}
                    className="text-blue-400 hover:text-blue-300 text-sm"
                  >
                    Get in touch with support
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <button
              onClick={handleReturn}
              className="w-full flex items-center justify-center space-x-2 py-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Return to Subscription</span>
            </button>
          </div>
        </div>

        {/* Support Modal */}
        {showSupportModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-semibold mb-4">Contact Support</h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    What was the reason for cancellation?
                  </label>
                  <select
                    value={cancellationReason}
                    onChange={(e) => setCancellationReason(e.target.value)}
                    className="w-full bg-gray-700 border border-gray-600 rounded-lg px-4 py-2 text-white"
                  >
                    <option value="">Select a reason</option>
                    <option value="price_too_high">Price was too high</option>
                    <option value="payment_issues">Payment issues</option>
                    <option value="wrong_plan">Wrong plan selected</option>
                    <option value="technical_issues">Technical issues</option>
                    <option value="other">Other reason</option>
                  </select>
                </div>
                <div className="flex space-x-4">
                  <button
                    onClick={() => setShowSupportModal(false)}
                    className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      // Handle support request
                      window.location.href = 'mailto:support@codeopt.com';
                      setShowSupportModal(false);
                    }}
                    className="flex-1 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    Contact Support
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default PaymentCancel; 