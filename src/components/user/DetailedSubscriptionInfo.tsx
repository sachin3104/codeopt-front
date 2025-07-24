import React from 'react';
import { 
  CreditCard, 
  BarChart3, 
  CheckCircle,
  XCircle,
  Clock,
  AlertTriangle,
  Zap,
  Mail,
  Calendar,
  ExternalLink
} from 'lucide-react';
import { useSubscription } from '@/hooks/use-subscription';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate } from 'react-router-dom';

const DetailedSubscriptionInfo: React.FC = () => {
  const { subscription, fetching, usageData, cancelSubscription, cancelLoading, cancelError } = useSubscription();
  const { user } = useAuth();
  const navigate = useNavigate();

  if (fetching) {
    return (
      <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-lg sm:rounded-xl p-4 sm:p-6">
        <div className="animate-pulse space-y-3 sm:space-y-4">
          <div className="h-5 sm:h-6 bg-white/20 rounded mb-3 sm:mb-4"></div>
          <div className="space-y-2 sm:space-y-3">
            <div className="h-3 sm:h-4 bg-white/20 rounded"></div>
            <div className="h-3 sm:h-4 bg-white/20 rounded"></div>
            <div className="h-3 sm:h-4 bg-white/20 rounded"></div>
          </div>
          <div className="h-16 sm:h-20 bg-white/20 rounded"></div>
          <div className="h-16 sm:h-20 bg-white/20 rounded"></div>
        </div>
      </div>
    );
  }

  if (!subscription) {
    return (
      <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-lg sm:rounded-xl p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center">
          <CreditCard className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
          Subscription Details
        </h2>
        <p className="text-white/70 text-center text-sm sm:text-base">No subscription data available</p>
      </div>
    );
  }

  const { plan, status, current_period_end, cancel_at_period_end, days_until_renewal } = subscription;
  const isFreePlan = plan.plan_type === 'FREE';

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
    if (!currentUsage || !plan) {
      return null;
    }

    // Use plan object directly for limits
    const totalRequests = plan.max_monthly_usage ?? plan.max_daily_usage;
    const isMonthly = plan.max_monthly_usage != null;
    const completedRequests = isMonthly ? currentUsage.monthly_usage : currentUsage.daily_usage;
    const charactersPerRequest = plan.max_code_input_chars;
    const charactersUsed = isMonthly ? currentUsage.monthly_characters : currentUsage.daily_characters;
    const totalCharacters = totalRequests && charactersPerRequest ? totalRequests * charactersPerRequest : null;

    return {
      completed: completedRequests,
      total: totalRequests,
      remaining: totalRequests ? Math.max(0, totalRequests - completedRequests) : null,
      charactersUsed,
      charactersTotal: totalCharacters,
      charactersRemaining: totalCharacters ? Math.max(0, totalCharacters - charactersUsed) : null,
      charactersPerRequest,
      isMonthly,
    };
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
        icon: <CheckCircle className="w-3 sm:w-4 h-3 sm:h-4 text-green-400" />
      };
    }

    if (cancel_at_period_end) {
      return {
        status: 'cancelled',
        message: `Plan will not renew. Access until ${formatDate(current_period_end)}`,
        icon: <XCircle className="w-3 sm:w-4 h-3 sm:h-4 text-red-400" />
      };
    }

    if (days_until_renewal !== null) {
      return {
        status: 'active',
        message: `Next renewal in ${days_until_renewal} days (${formatDate(current_period_end)})`,
        icon: <Clock className="w-3 sm:w-4 h-3 sm:h-4 text-blue-400" />
      };
    }

    return {
      status: 'unknown',
      message: 'Renewal information not available',
      icon: <AlertTriangle className="w-3 sm:w-4 h-3 sm:h-4 text-yellow-400" />
    };
  };

  const renewalStatus = getRenewalStatus();

  // Get action type display info
  const getActionTypeInfo = () => {
    switch (plan.action_type) {
      case 'subscribe':
        return {
          label: 'Subscription Plan',
          icon: <CreditCard className="w-3 sm:w-4 h-3 sm:h-4 text-green-400" />,
          description: 'Standard subscription with recurring billing'
        };
      case 'email_contact':
        return {
          label: 'Contact Required',
          icon: <Mail className="w-3 sm:w-4 h-3 sm:h-4 text-blue-400" />,
          description: 'Contact us for custom pricing and setup'
        };
      case 'book_consultation':
        return {
          label: 'Consultation Required',
          icon: <Calendar className="w-3 sm:w-4 h-3 sm:h-4 text-purple-400" />,
          description: 'Book a consultation to get started'
        };
      default:
        return {
          label: 'Plan',
          icon: <CreditCard className="w-3 sm:w-4 h-3 sm:h-4 text-white" />,
          description: 'Standard plan'
        };
    }
  };

  const actionTypeInfo = getActionTypeInfo();

  return (
    <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-lg sm:rounded-xl p-4 sm:p-6">
      
      <div className="space-y-4 sm:space-y-6">
        {/* Current Plan */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-white/10 flex items-center justify-center">
            {actionTypeInfo.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <div>
                <p className="text-white font-medium text-sm sm:text-base">{plan.name}</p>
                <p className="text-gray-400 text-xs sm:text-sm">{actionTypeInfo.label}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Consultation Options */}
        {plan.consultation_options && plan.consultation_options.length > 0 && (
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center space-x-2">
              <Calendar className="w-3 sm:w-4 h-3 sm:h-4 text-purple-400" />
              <p className="text-purple-400 text-xs sm:text-sm font-medium">Available Consultations</p>
            </div>
            <div className="space-y-2">
              {plan.consultation_options.map((option, index) => (
                <div key={index} className="p-2 sm:p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2 sm:gap-0">
                    <div>
                      <p className="text-purple-400 font-medium text-xs sm:text-sm">{option.duration_label}</p>
                      <p className="text-white/70 text-xs">{option.description}</p>
                    </div>
                    <div className="text-left sm:text-right">
                      <p className="text-purple-400 font-semibold text-sm sm:text-base">${option.price}</p>
                      <p className="text-white/60 text-xs">{option.duration}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Request Usage */}
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center space-x-2">
            <BarChart3 className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
            <p className="text-white/70 text-xs sm:text-sm font-medium">Request Usage</p>
          </div>

          {usageInfo ? (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <p className="text-white/70 text-xs">
                  {usageInfo.isMonthly
                    ? usageInfo.total == null
                      ? 'Monthly Requests (Unlimited)'
                      : 'Monthly Requests'
                    : usageInfo.total == null
                      ? 'Daily Requests (Unlimited)'
                      : 'Daily Requests'}
                </p>
                <p className="text-white text-xs">
                  {usageInfo.completed} / {usageInfo.total == null ? 'Unlimited' : usageInfo.total}
                </p>
              </div>
              <div className="w-full bg-white/10 rounded-full h-1.5 sm:h-2">
                <div 
                  className={`h-1.5 sm:h-2 rounded-full transition-all duration-300 ${
                    percentage > 80 
                      ? 'bg-gradient-to-r from-red-400 to-red-600' 
                      : percentage > 60
                      ? 'bg-gradient-to-r from-yellow-400 to-yellow-600'
                      : 'bg-gradient-to-r from-green-400 to-green-600'
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs">
                <span className="text-green-400">
                  Completed: {usageInfo.completed}
                </span>
                <span className="text-white/60">
                  Remaining: {usageInfo.remaining == null ? 'Unlimited' : usageInfo.remaining}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-3 sm:py-4">
              <p className="text-white/50 text-xs sm:text-sm">Usage data not available</p>
            </div>
          )}
        </div>

        {/* Renewal Status */}
        <div className="space-y-2 sm:space-y-3">
          <div className="flex items-center space-x-2">
            <Clock className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
            <p className="text-white/70 text-xs sm:text-sm font-medium">Renewal Status</p>
          </div>
          <div className="flex items-center space-x-2 p-2 sm:p-3 bg-white/5 rounded-lg">
            {renewalStatus.icon}
            <p className="text-white text-xs sm:text-sm">{renewalStatus.message}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-3 sm:pt-4 border-t border-white/20 space-y-2 sm:space-y-3">
          {/* View Plans Button */}
          <button
            onClick={() => navigate('/subscription')}
            className="w-full py-2 px-3 sm:px-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-md text-blue-400 font-medium transition-colors flex items-center justify-center space-x-2 text-sm sm:text-base"
          >
            <ExternalLink className="w-3 sm:w-4 h-3 sm:h-4" />
            <span>View Plans</span>
          </button>

          {/* Cancel Subscription Button */}
          {!isFreePlan && status === 'active' && !cancel_at_period_end && (
            <button
              onClick={() => cancelSubscription(false)}
              disabled={cancelLoading}
              className="w-full py-2 px-3 sm:px-4 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-md text-red-400 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base"
            >
              {cancelLoading ? 'Cancelling...' : 'Cancel Subscription'}
            </button>
          )}
          
          {cancelError && (
            <p className="text-xs sm:text-sm text-red-400">
              {cancelError.response?.data.message || cancelError.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailedSubscriptionInfo; 