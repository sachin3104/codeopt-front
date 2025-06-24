import React from 'react';
import { CreditCard, BarChart3, TrendingUp, Settings } from 'lucide-react';
import { useSubscription } from '@/hooks/use-subscription';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';

const UserSubscription: React.FC = () => {
  const { subscription, fetching, usageData } = useSubscription();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (fetching) {
    return (
      <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-white/20 rounded mb-4"></div>
          <div className="h-4 bg-white/20 rounded mb-4"></div>
          <div className="h-4 bg-white/20 rounded mb-4"></div>
          <div className="h-20 bg-white/20 rounded"></div>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
          <CreditCard className="w-5 h-5 mr-2" />
          Subscription
        </h2>
        <p className="text-white/70 text-center">No subscription data available</p>
      </div>
    );
  }

  const { plan, status } = subscription;
  const isFreePlan = plan.plan_type === 'free';

  // Get usage data from context
  const currentUsage = usageData?.current_usage;
  const planLimits = usageData?.plan_limits;

  const handleManageSubscription = () => {
    navigate('/subscription');
  };

  // Get usage data based on plan type
  const getUsageData = () => {
    if (!currentUsage || !planLimits) {
      return null; // Return null instead of hardcoded values
    }

    if (isFreePlan) {
      const total = planLimits.max_daily_usage;
      const completed = currentUsage.daily_usage;
      return {
        completed,
        total,
        remaining: total ? Math.max(0, total - completed) : null
      };
    } else {
      const total = planLimits.max_monthly_usage;
      const completed = currentUsage.monthly_usage;
      return {
        completed,
        total,
        remaining: total ? Math.max(0, total - completed) : null
      };
    }
  };

  const usageInfo = getUsageData();
  const percentage = usageInfo && usageInfo.total ? (usageInfo.completed / usageInfo.total) * 100 : 0;

  return (
    <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl p-6">
      
      <div className="space-y-6">
        {/* Current Plan */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            <CreditCard className="w-4 h-4 text-white" />
          </div>
          <div className="flex-1">
            <p className="text-white/70 text-sm">Current Plan</p>
            <div className="flex items-center space-x-2">
              <p className="text-white font-medium">{plan.name}</p>
              <span className={`px-2 py-1 text-xs rounded-full ${
                status === 'active' 
                  ? 'bg-green-500/20 text-green-400 border border-green-500/30' 
                  : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
              }`}>
                {status}
              </span>
            </div>
          </div>
        </div>

        {/* Usage Statistics */}
        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-white" />
            <p className="text-white/70 text-sm font-medium">Usage Statistics</p>
          </div>

          {usageInfo ? (
            /* Usage Progress Bar */
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-white/70 text-xs">
                  {isFreePlan ? 'Daily Requests' : 'Monthly Requests'}
                </p>
                <p className="text-white text-xs">
                  {usageInfo.completed} / {usageInfo.total}
                </p>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    isFreePlan 
                      ? 'bg-gradient-to-r from-blue-400 to-blue-600' 
                      : 'bg-gradient-to-r from-purple-400 to-purple-600'
                  }`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs">
                <span className={isFreePlan ? 'text-blue-400' : 'text-purple-400'}>
                  Completed: {usageInfo.completed}
                </span>
                <span className="text-white/60">Remaining: {usageInfo.remaining}</span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-white/50 text-sm">Usage data not available</p>
            </div>
          )}
        </div>

        {/* Manage Subscription Button */}
        <div className="pt-4 border-t border-white/20">
          <button
            onClick={handleManageSubscription}
            className="w-full flex items-center justify-center space-x-2 px-4 py-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg text-white font-medium transition-colors"
          >
            <Settings className="w-4 h-4" />
            <span>Manage Subscription</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default UserSubscription; 