import React, { useState, useEffect } from 'react';
import { useSubscription } from '@/context/SubscriptionContext';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import PlanSelector from '@/components/subscription/PlanSelector';
import FeatureComparison from '@/components/subscription/FeatureComparison';
import PlanUpgrade from '@/components/subscription/PlanUpgrade';
import FeatureGate from '@/components/subscription/FeatureGate';
import Header from '@/components/common/header/Header';
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
} from 'lucide-react';

const SubscriptionPage: React.FC = () => {
  const {
    subscription,
    plans,
    usage,
    isLoading,
    error,
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

  // Load usage history
  useEffect(() => {
    const loadUsageHistory = async () => {
      try {
        const response = await getUsageHistory(
          selectedTimeframe === '7d' ? 7 : selectedTimeframe === '30d' ? 30 : 90
        );
        setUsageHistory(response);
      } catch (err) {
        console.error('Failed to load usage history:', err);
      }
    };

    loadUsageHistory();
  }, [selectedTimeframe, getUsageHistory]);

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

  const currentPlan = subscription.plan;
  const dates = formatSubscriptionDates(subscription);
  const usageData = formatUsageData(usage, currentPlan);
  const messages = generateUsageMessages(usage, currentPlan);
  const upgradeRecommendation = getUpgradeRecommendation(usage, currentPlan, plans);

  return (
    <>
      <Header />
      <div className="min-h-screen bg-gray-900 text-white p-6 pt-24">
        {/* Header Section */}
        <div className="max-w-7xl mx-auto mb-8">
          <h1 className="text-3xl font-bold mb-2">Subscription Management</h1>
          <p className="text-gray-400">Manage your subscription, view usage, and access billing information</p>
        </div>

        <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Current Plan & Usage */}
          <div className="lg:col-span-2 space-y-6">
            {/* Current Plan Card */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex justify-between items-start mb-6">
                <div>
                  <h2 className="text-xl font-semibold mb-2">Current Plan</h2>
                  <p className="text-gray-400">{currentPlan.name}</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold">
                    {formatPrice(currentPlan.price, currentPlan.currency)}
                    <span className="text-sm text-gray-400">/month</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    Next billing: {dates.nextBillingDate}
                  </div>
                </div>
              </div>

              {/* Usage Progress Bars */}
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

              {messages.warning && (
                <div className="mt-4 p-3 bg-yellow-500/20 border border-yellow-500/50 rounded-lg text-yellow-200">
                  <AlertCircle className="w-5 h-5 inline-block mr-2" />
                  {messages.warning}
                </div>
              )}
            </div>

            {/* Usage Analytics */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold">Usage Analytics</h2>
                <div className="flex space-x-2">
                  {(['7d', '30d', '90d'] as const).map((timeframe) => (
                    <button
                      key={timeframe}
                      onClick={() => setSelectedTimeframe(timeframe)}
                      className={`px-3 py-1 rounded-lg text-sm ${
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

            {/* Feature Utilization */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-6">Feature Utilization</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Zap className="w-5 h-5 text-blue-400 mr-2" />
                    <span className="font-medium">Code Analysis</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    {usage.daily.usage_count} uses today
                  </div>
                </div>
                <div className="p-4 bg-gray-700/50 rounded-lg">
                  <div className="flex items-center mb-2">
                    <Users className="w-5 h-5 text-blue-400 mr-2" />
                    <span className="font-medium">Team Collaboration</span>
                  </div>
                  <div className="text-sm text-gray-400">
                    {currentPlan.plan_type === 'professional' ? 'Active' : 'Upgrade required'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Actions & Info */}
          <div className="space-y-6">
            {/* Quick Actions */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
              <div className="space-y-3">
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="w-full flex items-center justify-between p-3 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                >
                  <span>Upgrade Plan</span>
                  <ChevronRight className="w-5 h-5" />
                </button>
                <button
                  onClick={() => openBillingPortal()}
                  className="w-full flex items-center justify-between p-3 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  <span>Manage Billing</span>
                  <CreditCard className="w-5 h-5" />
                </button>
                <button
                  onClick={() => setShowCancelModal(true)}
                  className="w-full flex items-center justify-between p-3 bg-red-600/20 hover:bg-red-600/30 text-red-400 rounded-lg transition-colors"
                >
                  <span>Cancel Subscription</span>
                  <AlertCircle className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Subscription Timeline */}
            <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
              <h2 className="text-xl font-semibold mb-4">Subscription Timeline</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                    <Calendar className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium">Started</div>
                    <div className="text-sm text-gray-400">{dates.startDate}</div>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center mr-3">
                    <Clock className="w-4 h-4" />
                  </div>
                  <div>
                    <div className="font-medium">Next Billing</div>
                    <div className="text-sm text-gray-400">{dates.nextBillingDate}</div>
                  </div>
                </div>
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

            {/* Upgrade Recommendation */}
            {upgradeRecommendation && (
              <div className="bg-gray-800 rounded-xl p-6 border border-gray-700">
                <h2 className="text-xl font-semibold mb-4">Recommended Upgrade</h2>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{upgradeRecommendation.name}</div>
                      <div className="text-sm text-gray-400">
                        {upgradeRecommendation.description}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold">
                        {formatPrice(upgradeRecommendation.price, upgradeRecommendation.currency)}
                        <span className="text-sm text-gray-400">/month</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="w-full py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors"
                  >
                    Upgrade Now
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Modals */}
        {showUpgradeModal && (
          <PlanUpgrade
            isOpen={showUpgradeModal}
            onClose={() => setShowUpgradeModal(false)}
          />
        )}

        {showCancelModal && (
          <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4">
              <h2 className="text-xl font-semibold mb-4">Cancel Subscription</h2>
              <p className="text-gray-400 mb-6">
                Are you sure you want to cancel your subscription? You'll lose access to premium features at the end of your billing period.
              </p>
              <div className="flex space-x-4">
                <button
                  onClick={() => setShowCancelModal(false)}
                  className="flex-1 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors"
                >
                  Keep Subscription
                </button>
                <button
                  onClick={async () => {
                    await cancelSubscription();
                    setShowCancelModal(false);
                    refreshSubscription();
                  }}
                  className="flex-1 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
                >
                  Cancel Subscription
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