import React from 'react';
import { 
  CreditCard, 
  BarChart3, 
  FileText,
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Zap
} from 'lucide-react';
import { useSubscription } from '@/hooks/use-subscription';
import { useAuth } from '@/hooks/use-auth';

const DetailedSubscriptionInfo: React.FC = () => {
  const { subscription, fetching, usageData, cancelSubscription, cancelLoading, cancelError } = useSubscription();
  const { user } = useAuth();

  if (fetching) {
    return (
      <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-white/20 rounded mb-4"></div>
          <div className="space-y-3">
            <div className="h-4 bg-white/20 rounded"></div>
            <div className="h-4 bg-white/20 rounded"></div>
            <div className="h-4 bg-white/20 rounded"></div>
          </div>
          <div className="h-20 bg-white/20 rounded"></div>
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
          Subscription Details
        </h2>
        <p className="text-white/70 text-center">No subscription data available</p>
      </div>
    );
  }

  const { plan, status, current_period_end, cancel_at_period_end, days_until_renewal } = subscription;
  const isFreePlan = plan.plan_type === 'free';

  // Get usage data from context
  const currentUsage = usageData?.current_usage;
  const planLimits = usageData?.plan_limits;

  // Format date helper
  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  // Get usage data based on plan type
  const getUsageData = () => {
    if (!currentUsage || !planLimits) {
      return null;
    }

    if (isFreePlan) {
      const totalRequests = planLimits.max_daily_usage;
      const completedRequests = currentUsage.daily_usage;
      const charactersPerRequest = planLimits.max_code_input_chars;
      const charactersUsed = currentUsage.daily_characters;
      const totalCharacters = totalRequests && charactersPerRequest ? totalRequests * charactersPerRequest : null;
      
      return {
        completed: completedRequests,
        total: totalRequests,
        remaining: totalRequests ? Math.max(0, totalRequests - completedRequests) : null,
        charactersUsed,
        charactersTotal: totalCharacters,
        charactersRemaining: totalCharacters ? Math.max(0, totalCharacters - charactersUsed) : null,
        charactersPerRequest
      };
    } else {
      const totalRequests = planLimits.max_monthly_usage;
      const completedRequests = currentUsage.monthly_usage;
      const charactersPerRequest = planLimits.max_code_input_chars;
      const charactersUsed = currentUsage.monthly_characters;
      const totalCharacters = totalRequests && charactersPerRequest ? totalRequests * charactersPerRequest : null;
      
      return {
        completed: completedRequests,
        total: totalRequests,
        remaining: totalRequests ? Math.max(0, totalRequests - completedRequests) : null,
        charactersUsed,
        charactersTotal: totalCharacters,
        charactersRemaining: totalCharacters ? Math.max(0, totalCharacters - charactersUsed) : null,
        charactersPerRequest
      };
    }
  };

  const usageInfo = getUsageData();
  const percentage = usageInfo && usageInfo.total ? (usageInfo.completed / usageInfo.total) * 100 : 0;
  const characterPercentage = usageInfo && usageInfo.charactersTotal ? (usageInfo.charactersUsed / usageInfo.charactersTotal) * 100 : 0;

  // Determine renewal status
  const getRenewalStatus = () => {
    if (isFreePlan) {
      return {
        status: 'free',
        message: 'Free plan - no renewal required',
        icon: <CheckCircle className="w-4 h-4 text-green-400" />
      };
    }

    if (cancel_at_period_end) {
      return {
        status: 'cancelled',
        message: `Plan will not renew. Access until ${formatDate(current_period_end)}`,
        icon: <XCircle className="w-4 h-4 text-red-400" />
      };
    }

    if (days_until_renewal !== null) {
      return {
        status: 'active',
        message: `Next renewal in ${days_until_renewal} days (${formatDate(current_period_end)})`,
        icon: <Clock className="w-4 h-4 text-blue-400" />
      };
    }

    return {
      status: 'unknown',
      message: 'Renewal information not available',
      icon: <AlertTriangle className="w-4 h-4 text-yellow-400" />
    };
  };

  const renewalStatus = getRenewalStatus();

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
                  : status === 'cancelled'
                  ? 'bg-red-500/20 text-red-400 border border-red-500/30'
                  : 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
              }`}>
                {status}
              </span>
            </div>
            <p className="text-white/60 text-xs mt-1">{plan.description}</p>
          </div>
        </div>

        
        {/* Character Limits */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <FileText className="w-4 h-4 text-white" />
            <p className="text-white/70 text-sm font-medium">Character Usage</p>
          </div>

          {usageInfo && usageInfo.charactersTotal ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-white/70 text-xs">
                  {isFreePlan ? 'Daily Characters Used' : 'Monthly Characters Used'}
                </p>
                <p className="text-white text-xs">
                  {usageInfo.charactersUsed.toLocaleString()} / {usageInfo.charactersTotal.toLocaleString()}
                </p>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    characterPercentage > 80 
                      ? 'bg-gradient-to-r from-red-400 to-red-600' 
                      : characterPercentage > 60
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                      : 'bg-gradient-to-r from-green-400 to-green-600'
                  }`}
                  style={{ width: `${Math.min(characterPercentage, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-green-400">
                  Used: {usageInfo.charactersUsed.toLocaleString()}
                </span>
                <span className="text-white/60">
                  Remaining: {usageInfo.charactersRemaining?.toLocaleString() || 'Unlimited'}
                </span>
              </div>
              <div className="text-center pt-2 border-t border-white/10">
                <p className="text-white/50 text-xs">
                  {usageInfo.charactersPerRequest?.toLocaleString()} chars per request × {usageInfo.total || 'Unlimited'} requests
                </p>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-white/50 text-sm">Character limit information not available</p>
            </div>
          )}
        </div>

        {/* Usage Statistics */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-4 h-4 text-white" />
            <p className="text-white/70 text-sm font-medium">Request Usage</p>
          </div>

          {usageInfo ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-white/70 text-xs">
                  {isFreePlan ? 'Daily Requests' : 'Monthly Requests'}
                </p>
                <p className="text-white text-xs">
                  {usageInfo.completed} / {usageInfo.total || 'Unlimited'}
                </p>
              </div>
              <div className="w-full bg-white/10 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    percentage > 80 
                      ? 'bg-gradient-to-r from-red-400 to-red-600' 
                      : percentage > 60
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                      : 'bg-gradient-to-r from-blue-400 to-blue-600'
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-blue-400">
                  Completed: {usageInfo.completed}
                </span>
                <span className="text-white/60">
                  Remaining: {usageInfo.remaining || 'Unlimited'}
                </span>
              </div>
              {usageInfo.charactersPerRequest && (
                <div className="text-center pt-2 border-t border-white/10">
                  <p className="text-white/50 text-xs">
                    Each request can process up to {usageInfo.charactersPerRequest.toLocaleString()} characters
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-white/50 text-sm">Usage data not available</p>
            </div>
          )}
        </div>

        {/* Plan Features */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Zap className="w-4 h-4 text-white" />
            <p className="text-white/70 text-sm font-medium">Plan Features</p>
          </div>
          
          <div className="grid grid-cols-1 gap-2 text-xs">
            <div className="flex justify-between items-center p-2 bg-white/5 rounded">
              <span className="text-white/70">Max Code Input Per Request</span>
              <span className="text-white font-medium">
                {usageInfo?.charactersPerRequest ? `${usageInfo.charactersPerRequest.toLocaleString()} chars` : 'Unlimited'}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white/5 rounded">
              <span className="text-white/70">Total Character Limit</span>
              <span className="text-white font-medium">
                {usageInfo?.charactersTotal ? `${usageInfo.charactersTotal.toLocaleString()} chars` : 'Unlimited'}
              </span>
            </div>
            <div className="flex justify-between items-center p-2 bg-white/5 rounded">
              <span className="text-white/70">Price</span>
              <span className="text-white font-medium">
                {isFreePlan ? 'Free' : `${plan.currency.toUpperCase()} ${plan.price}/month`}
              </span>
            </div>
          </div>
        </div>

        {/* Renewal Information */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2 p-3 bg-white/5 rounded-lg border border-white/10">
            {renewalStatus.icon}
            <p className="text-white text-sm">{renewalStatus.message}</p>
          </div>
          
          {/* Cancel Subscription Button - only show for active paid subscriptions */}
          {subscription && !isFreePlan && status === 'active' && !cancel_at_period_end && (
            <div className="p-3 bg-red-500/10 rounded-lg border border-red-500/20 flex flex-row items-center justify-between min-h-[88px]">
              <div className="flex flex-col justify-center">
                <div className="flex items-center space-x-2 mb-1">
                  <XCircle className="w-4 h-4 text-red-400" />
                  <span className="text-white/70 text-sm font-semibold">Cancel Subscription</span>
                </div>
                <p className="text-white/60 text-xs">
                  Your subscription will remain active until the end of the current billing period.
                </p>
              </div>
              <div className="flex flex-col items-end h-full">
                <button
                  onClick={() => cancelSubscription(false)}
                  disabled={cancelLoading}
                  className={`px-4 py-2 rounded-md font-medium transition mb-1 ${
                    cancelLoading
                      ? 'bg-red-300 text-white cursor-not-allowed opacity-60'
                      : 'bg-red-600 text-white hover:bg-red-700'
                  }`}
                >
                  {cancelLoading ? 'Cancelling…' : 'Cancel Subscription'}
                </button>
                {cancelError && (
                  <p className="text-sm text-red-600 mt-1">
                    {cancelError.response?.data.message || cancelError.message}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};

export default DetailedSubscriptionInfo; 