import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  useSubscriptionData,
  useSubscriptionPlans,
  useUsageData,
  useSubscriptionLoading,
  useSubscriptionError,
  useSubscription // Only for methods
} from '@/context/SubscriptionContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import UpgradeModal from '@/components/subscription/UpgradeModal';
import FeatureGate from '@/components/subscription/FeatureGate';
import Header from '@/components/common/header/Header';
import { Background } from '@/components/common/background';
import {
  formatPrice,
  formatUsageData,
  generateUsageMessages,
  getUpgradeRecommendation,
  formatSubscriptionDates,
} from '@/lib/subscriptionHelpers';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
} from 'recharts';
import {
  CreditCard,
  Calendar,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  Clock,
  Zap,
  Users,
  Settings,
  ArrowUpRight,
} from 'lucide-react';

const SubscriptionPage: React.FC = () => {
  // ✅ FIXED: Use selective hooks instead of full useSubscription
  const subscription = useSubscriptionData();
  const plans = useSubscriptionPlans();
  const usage = useUsageData();
  const isLoading = useSubscriptionLoading();
  const error = useSubscriptionError();

  // ✅ FIXED: Only get methods from full context (these don't cause re-renders)
  const {
    stripe,
    isStripeReady,
    refreshSubscription,
    openBillingPortal,
    cancelSubscription,
    reactivateSubscription,
    getUsageHistory,
  } = useSubscription();

  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [usageHistory, setUsageHistory] = useState<any>(null);
  const [selectedTimeframe, setSelectedTimeframe] = useState<'7d' | '30d' | '90d'>('30d');
  const [isCancelling, setIsCancelling] = useState(false);

  // ✅ FIXED: Stable callback that doesn't change on every render
  const loadUsageHistory = useCallback(async (timeframe: '7d' | '30d' | '90d') => {
    try {
      const days = timeframe === '7d' ? 7 : timeframe === '30d' ? 30 : 90;
      const response = await getUsageHistory(days);
      setUsageHistory(response);
    } catch (err) {
      console.error('Failed to load usage history:', err);
    }
  }, [getUsageHistory]);

  // ✅ FIXED: Clean useEffect with stable dependencies
  useEffect(() => {
    loadUsageHistory(selectedTimeframe);
  }, [selectedTimeframe, loadUsageHistory]);

  // ✅ FIXED: Memoize derived values to prevent unnecessary recalculations
  const currentPlan = useMemo(() => subscription?.plan, [subscription?.plan]);
  const dates = useMemo(() => 
    subscription ? formatSubscriptionDates(subscription) : null, 
    [subscription]
  );
  const usageData = useMemo(() => 
    usage && currentPlan ? formatUsageData(usage, currentPlan) : null, 
    [usage, currentPlan]
  );
  const messages = useMemo(() => 
    usage && currentPlan ? generateUsageMessages(usage, currentPlan) : null, 
    [usage, currentPlan]
  );
  const upgradeRecommendation = useMemo(() => 
    usage && currentPlan && plans ? getUpgradeRecommendation(usage, currentPlan, plans) : null, 
    [usage, currentPlan, plans]
  );

  // Handle subscription cancellation
  const handleCancelSubscription = async () => {
    setIsCancelling(true);
    try {
      await cancelSubscription();
      setShowCancelModal(false);
      await refreshSubscription();
    } catch (err) {
      console.error('Failed to cancel subscription:', err);
    } finally {
      setIsCancelling(false);
    }
  };

  // Handle billing portal
  const handleOpenBillingPortal = async () => {
    try {
      await openBillingPortal();
    } catch (err) {
      console.error('Failed to open billing portal:', err);
    }
  };

  // Handle subscription reactivation
  const handleReactivateSubscription = async () => {
    try {
      await reactivateSubscription();
      await refreshSubscription();
    } catch (err) {
      console.error('Failed to reactivate subscription:', err);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen state="loading" text="Loading subscription details..." />;
  }

  if (error || !subscription || !usage) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-900">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">Error Loading Subscription</h2>
          <p className="text-gray-400 mb-4">{error || 'Failed to load subscription details'}</p>
          <button
            onClick={() => refreshSubscription()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <Header />
      <Background />
      <div className="min-h-screen bg-transparent text-white p-6 pt-24 relative z-10">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto mb-8">
          <h1 className="text-3xl font-bold mb-2">Subscription Management</h1>
          <p className="text-gray-400">Manage your subscription, view usage, and access billing information</p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Current Plan & Usage */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Plan Card */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl p-6">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Current Plan</h2>
                  <p className="text-gray-400">{currentPlan?.name}</p>
                  {subscription.status !== 'active' && (
                    <div className="mt-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400">
                        {subscription.status}
                      </span>
                    </div>
                  )}
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {currentPlan && formatPrice(currentPlan.price, currentPlan.currency)}
                    <span className="text-sm text-gray-400">/month</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    {subscription.status === 'active' ? (
                      <>Next billing: {dates?.nextBillingDate}</>
                    ) : subscription.cancelled_at ? (
                      <>Cancelled on: {new Date(subscription.cancelled_at).toLocaleDateString()}</>
                    ) : (
                      <>Status: {subscription.status}</>
                    )}
                  </div>
                </div>
              </div>

              {/* Usage Progress Bars */}
              {usageData && currentPlan && (
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Daily Usage</span>
                      <span>{usageData.daily}</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            (usage.daily.usage_count / (currentPlan.max_daily_usage || 1)) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>

                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span>Monthly Usage</span>
                      <span>{usageData.monthly}</span>
                    </div>
                    <div className="h-2 bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-blue-500 transition-all duration-300"
                        style={{
                          width: `${Math.min(
                            (usage.monthly.usage_count / (currentPlan.max_monthly_usage || 1)) * 100,
                            100
                          )}%`,
                        }}
                      />
                    </div>
                  </div>
                </div>
              )}

              {messages?.warning && (
                <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-200">
                  <AlertCircle className="w-5 h-5 inline-block mr-2" />
                  {messages.warning}
                </div>
              )}
            </div>

            {/* Usage Analytics */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Usage Analytics</h2>
                <div className="flex space-x-2">
                  {(['7d', '30d', '90d'] as const).map((timeframe) => (
                    <button
                      key={timeframe}
                      onClick={() => setSelectedTimeframe(timeframe)}
                      className={`px-3 py-1 rounded-lg text-sm transition-colors ${
                        selectedTimeframe === timeframe
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                      }`}
                    >
                      {timeframe}
                    </button>
                  ))}
                </div>
              </div>

              {usageHistory && (
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={usageHistory.usage_history.records}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                      <XAxis
                        dataKey="usage_date"
                        stroke="#9CA3AF"
                        tickFormatter={(date) => new Date(date).toLocaleDateString()}
                      />
                      <YAxis stroke="#9CA3AF" />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#1F2937',
                          border: '1px solid #374151',
                          borderRadius: '0.5rem',
                        }}
                      />
                      <Line
                        type="monotone"
                        dataKey="usage_count"
                        stroke="#3B82F6"
                        strokeWidth={2}
                        dot={false}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Actions & Info */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                {/* Upgrade Button */}
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  disabled={currentPlan?.plan_type === 'professional'}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    currentPlan?.plan_type === 'professional'
                      ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white'
                  }`}
                >
                  <span>
                    {currentPlan?.plan_type === 'professional' ? 'Highest Plan' : 'Upgrade Plan'}
                  </span>
                  {currentPlan?.plan_type !== 'professional' && (
                    <ArrowUpRight className="w-5 h-5" />
                  )}
                </button>

                {/* Billing Portal Button */}
                <button
                  onClick={handleOpenBillingPortal}
                  disabled={currentPlan?.plan_type === 'free'}
                  className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                    currentPlan?.plan_type === 'free'
                      ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
                      : 'bg-gray-700 hover:bg-gray-600 text-white'
                  }`}
                >
                  <span>Manage Billing</span>
                  <CreditCard className="w-5 h-5" />
                </button>

                {/* Cancel/Reactivate Button */}
                {subscription.status === 'active' ? (
                  <button
                    onClick={() => setShowCancelModal(true)}
                    disabled={currentPlan?.plan_type === 'free'}
                    className={`w-full flex items-center justify-between p-3 rounded-lg transition-colors ${
                      currentPlan?.plan_type === 'free'
                        ? 'bg-gray-700/50 text-gray-400 cursor-not-allowed'
                        : 'bg-red-600/20 hover:bg-red-600/30 text-red-400'
                    }`}
                  >
                    <span>Cancel Subscription</span>
                    <AlertCircle className="w-5 h-5" />
                  </button>
                ) : subscription.status === 'cancelled' ? (
                  <button
                    onClick={handleReactivateSubscription}
                    className="w-full flex items-center justify-between p-3 bg-green-600/20 hover:bg-green-600/30 text-green-400 rounded-lg transition-colors"
                  >
                    <span>Reactivate Subscription</span>
                    <ChevronRight className="w-5 h-5" />
                  </button>
                ) : null}
              </div>
            </div>

            {/* Subscription Timeline */}
            <div className="backdrop-blur-xl bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl p-6">
              <h2 className="text-xl font-semibold mb-4">Subscription Timeline</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium">Started</div>
                    <div className="text-sm text-gray-400">{dates?.startDate}</div>
                  </div>
                </div>
                {subscription.status === 'active' && (
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                      <Clock className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium">Next Billing</div>
                      <div className="text-sm text-gray-400">{dates?.nextBillingDate}</div>
                    </div>
                  </div>
                )}
                {subscription.cancelled_at && (
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-red-600 flex items-center justify-center mr-3">
                      <AlertCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="font-medium">Cancelled</div>
                      <div className="text-sm text-gray-400">
                        {new Date(subscription.cancelled_at).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Upgrade Modal */}
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
        />

        {/* Cancel Confirmation Modal */}
        {showCancelModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="backdrop-blur-xl bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-semibold mb-4">Cancel Subscription</h2>
              <p className="text-gray-400 mb-6">
                Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your billing period.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowCancelModal(false)}
                  disabled={isCancelling}
                  className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors disabled:opacity-50"
                >
                  Keep Subscription
                </button>
                <button
                  onClick={handleCancelSubscription}
                  disabled={isCancelling}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors disabled:opacity-50 flex items-center justify-center"
                >
                  {isCancelling ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin mr-2" />
                      Cancelling...
                    </>
                  ) : (
                    'Cancel Subscription'
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default SubscriptionPage;