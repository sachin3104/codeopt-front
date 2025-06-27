import React from 'react';
import { BarChart3, Calendar, Activity, FileText, TrendingUp, CreditCard } from 'lucide-react';
import { useSubscription } from '@/hooks/use-subscription';

const UserUsageGraph: React.FC = () => {
  const { 
    subscription, 
    fetching, 
    usageData, 
    fetchingUsage, 
    usageError 
  } = useSubscription();

  if (fetching || fetchingUsage) {
    return (
      <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-white/20 rounded mb-4"></div>
          <div className="h-4 bg-white/20 rounded mb-4"></div>
          <div className="h-32 bg-white/20 rounded"></div>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          Usage Analytics
        </h2>
        <p className="text-white/70 text-center">No subscription data available</p>
      </div>
    );
  }

  // Get current usage data
  const currentUsage = usageData?.current_usage;
  const planLimits = usageData?.plan_limits;
  const isFreePlan = subscription.plan.plan_type === 'optqo_free';

  if (!usageData || !currentUsage) {
    return (
      <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl p-6">
        <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
          <BarChart3 className="w-5 h-5 mr-2" />
          Usage Analytics
        </h2>
        <div className="space-y-6">
          {/* Current Usage Summary */}
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Calendar className="w-4 h-4 text-blue-400 mr-1" />
                <span className="text-white/70 text-xs">Daily</span>
              </div>
              <p className="text-white font-semibold">-</p>
              <p className="text-white/60 text-xs">requests</p>
            </div>
            <div className="text-center p-3 bg-white/5 rounded-lg">
              <div className="flex items-center justify-center mb-2">
                <Activity className="w-4 h-4 text-purple-400 mr-1" />
                <span className="text-white/70 text-xs">Monthly</span>
              </div>
              <p className="text-white font-semibold">-</p>
              <p className="text-white/60 text-xs">requests</p>
            </div>
          </div>

          {/* Characters Processed */}
          <div className="pt-4 border-t border-white/20">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-white/70 text-xs">Characters Today</p>
                <p className="text-white font-medium">-</p>
              </div>
              <div className="text-center">
                <p className="text-white/70 text-xs">Characters This Month</p>
                <p className="text-white font-medium">-</p>
              </div>
            </div>
          </div>

          {/* Plan Limits */}
          <div className="pt-4 border-t border-white/20">
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center">
                <p className="text-white/70 text-xs">Max Input Per Request</p>
                <p className="text-white font-medium">-</p>
              </div>
              <div className="text-center">
                <div className="flex items-center space-x-2">
                  <CreditCard className="w-4 h-4 text-white" />
                  <p className="text-white font-medium">{subscription.plan.name}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Calculate usage percentages
  const dailyUsagePercentage = planLimits?.max_daily_usage 
    ? (currentUsage.daily_usage / planLimits.max_daily_usage) * 100 
    : 0;
  
  const monthlyUsagePercentage = planLimits?.max_monthly_usage 
    ? (currentUsage.monthly_usage / planLimits.max_monthly_usage) * 100 
    : 0;

  return (
    <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl p-6">
      <h2 className="text-xl font-semibold text-white mb-6 flex items-center">
        <BarChart3 className="w-5 h-5 mr-2" />
        Usage Analytics
      </h2>
      
      <div className="space-y-6">
        {/* Current Usage Summary */}
        <div className="grid grid-cols-2 gap-4">
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Calendar className="w-4 h-4 text-blue-400 mr-1" />
              <span className="text-white/70 text-xs">Daily</span>
            </div>
            <p className="text-white font-semibold">{currentUsage.daily_usage}</p>
            <p className="text-white/60 text-xs">
              {planLimits?.max_daily_usage ? `of ${planLimits.max_daily_usage}` : 'requests'}
            </p>
            {planLimits?.max_daily_usage && (
              <div className="w-full bg-white/10 rounded-full h-1 mt-2">
                <div 
                  className={`h-1 rounded-full transition-all duration-300 ${
                    dailyUsagePercentage > 80 
                      ? 'bg-red-400' 
                      : dailyUsagePercentage > 60
                      ? 'bg-yellow-400'
                      : 'bg-blue-400'
                  }`}
                  style={{ width: `${Math.min(dailyUsagePercentage, 100)}%` }}
                ></div>
              </div>
            )}
          </div>
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Activity className="w-4 h-4 text-purple-400 mr-1" />
              <span className="text-white/70 text-xs">Monthly</span>
            </div>
            <p className="text-white font-semibold">{currentUsage.monthly_usage}</p>
            <p className="text-white/60 text-xs">
              {planLimits?.max_monthly_usage ? `of ${planLimits.max_monthly_usage}` : 'requests'}
            </p>
            {planLimits?.max_monthly_usage && (
              <div className="w-full bg-white/10 rounded-full h-1 mt-2">
                <div 
                  className={`h-1 rounded-full transition-all duration-300 ${
                    monthlyUsagePercentage > 80 
                      ? 'bg-red-400' 
                      : monthlyUsagePercentage > 60
                      ? 'bg-yellow-400'
                      : 'bg-purple-400'
                  }`}
                  style={{ width: `${Math.min(monthlyUsagePercentage, 100)}%` }}
                ></div>
              </div>
            )}
          </div>
        </div>

        {/* Characters Processed */}
        <div className="pt-4 border-t border-white/20">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <FileText className="w-4 h-4 text-green-400 mr-1" />
                <p className="text-white/70 text-xs">Characters Today</p>
              </div>
              <p className="text-white font-medium">
                {currentUsage.daily_characters.toLocaleString()}
              </p>
              {planLimits?.max_code_input_chars && (
                <p className="text-white/60 text-xs">
                  Max: {planLimits.max_code_input_chars.toLocaleString()}
                </p>
              )}
            </div>
            <div className="text-center">
              <div className="flex items-center justify-center mb-2">
                <TrendingUp className="w-4 h-4 text-orange-400 mr-1" />
                <p className="text-white/70 text-xs">Characters This Month</p>
              </div>
              <p className="text-white font-medium">
                {currentUsage.monthly_characters.toLocaleString()}
              </p>
              {planLimits?.max_code_input_chars && planLimits?.max_monthly_usage && (
                <p className="text-white/60 text-xs">
                  Max: {(planLimits.max_code_input_chars * planLimits.max_monthly_usage).toLocaleString()}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Plan Limits Summary */}
        <div className="pt-4 border-t border-white/20">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-white/70 text-xs">Max Input Per Request</p>
              <p className="text-white font-medium">
                {planLimits?.max_code_input_chars 
                  ? `${planLimits.max_code_input_chars.toLocaleString()} chars`
                  : 'Unlimited'
                }
              </p>
            </div>
            <div className="text-center">
              <div className="flex items-center space-x-2">
                <CreditCard className="w-4 h-4 text-white" />
                <p className="text-white font-medium">{subscription.plan.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Usage Status */}
        <div className="pt-4 border-t border-white/20">
          <div className="text-center">
            <p className="text-white/70 text-xs mb-2">Usage Status</p>
            <div className="flex items-center justify-center space-x-2">
              {isFreePlan ? (
                <>
                  <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                  <p className="text-white text-sm">Daily limits apply</p>
                </>
              ) : (
                <>
                  <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                  <p className="text-white text-sm">Monthly limits apply</p>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserUsageGraph; 