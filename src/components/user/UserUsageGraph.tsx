import React from 'react';
import { BarChart3, Calendar, Activity } from 'lucide-react';
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
        </div>
      </div>
    );
  }

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
            <p className="text-white/60 text-xs">requests</p>
          </div>
          <div className="text-center p-3 bg-white/5 rounded-lg">
            <div className="flex items-center justify-center mb-2">
              <Activity className="w-4 h-4 text-purple-400 mr-1" />
              <span className="text-white/70 text-xs">Monthly</span>
            </div>
            <p className="text-white font-semibold">{currentUsage.monthly_usage}</p>
            <p className="text-white/60 text-xs">requests</p>
          </div>
        </div>

        {/* Characters Processed */}
        <div className="pt-4 border-t border-white/20">
          <div className="grid grid-cols-2 gap-4">
            <div className="text-center">
              <p className="text-white/70 text-xs">Characters Today</p>
              <p className="text-white font-medium">
                {currentUsage.daily_characters.toLocaleString()}
              </p>
            </div>
            <div className="text-center">
              <p className="text-white/70 text-xs">Characters This Month</p>
              <p className="text-white font-medium">
                {currentUsage.monthly_characters.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserUsageGraph; 