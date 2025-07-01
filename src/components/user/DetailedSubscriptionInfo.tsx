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
  const isFreePlan = plan.plan_type === 'optqo_free';

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

  // Get action type display info
  const getActionTypeInfo = () => {
    switch (plan.action_type) {
      case 'subscribe':
        return {
          label: 'Subscription Plan',
          icon: <CreditCard className="w-4 h-4 text-green-400" />,
          description: 'Standard subscription with recurring billing'
        };
      case 'email_contact':
        return {
          label: 'Contact Required',
          icon: <Mail className="w-4 h-4 text-blue-400" />,
          description: 'Contact us for custom pricing and setup'
        };
      case 'book_consultation':
        return {
          label: 'Consultation Required',
          icon: <Calendar className="w-4 h-4 text-purple-400" />,
          description: 'Book a consultation to get started'
        };
      default:
        return {
          label: 'Plan',
          icon: <CreditCard className="w-4 h-4 text-white" />,
          description: 'Standard plan'
        };
    }
  };

  const actionTypeInfo = getActionTypeInfo();

  return (
    <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl p-6">
      
      <div className="space-y-6">
        {/* Current Plan */}
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-full bg-white/10 flex items-center justify-center">
            {actionTypeInfo.icon}
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <div>
                <p className="text-white font-medium">{plan.name}</p>
                <p className="text-gray-400 text-sm">{actionTypeInfo.label}</p>
              </div>

            </div>
          </div>
        </div>


        {/* Consultation Options */}
        {plan.consultation_options && plan.consultation_options.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-purple-400" />
              <p className="text-purple-400 text-sm font-medium">Available Consultations</p>
            </div>
            <div className="space-y-2">
              {plan.consultation_options.map((option, index) => (
                <div key={index} className="p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                  <div className="flex justify-between items-start">
                    <div>
                      <p className="text-purple-400 font-medium text-sm">{option.duration_label}</p>
                      <p className="text-white/70 text-xs">{option.description}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-purple-400 font-semibold">${option.price}</p>
                      <p className="text-white/60 text-xs">{option.duration}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}


        {/* Request Usage */}
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
                  Remaining: {usageInfo.remaining || 'Unlimited'}
                </span>
              </div>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-white/50 text-sm">Usage data not available</p>
            </div>
          )}
        </div>

        {/* Renewal Status */}
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <Clock className="w-4 h-4 text-white" />
            <p className="text-white/70 text-sm font-medium">Renewal Status</p>
          </div>
          <div className="flex items-center space-x-2 p-3 bg-white/5 rounded-lg">
            {renewalStatus.icon}
            <p className="text-white text-sm">{renewalStatus.message}</p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-4 border-t border-white/20 space-y-3">
          {/* View Plans Button */}
          <button
            onClick={() => navigate('/subscription')}
            className="w-full py-2 px-4 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 rounded-md text-blue-400 font-medium transition-colors flex items-center justify-center space-x-2"
          >
            <ExternalLink className="w-4 h-4" />
            <span>View Plans</span>
          </button>

          {/* Cancel Subscription Button */}
          {!isFreePlan && status === 'active' && !cancel_at_period_end && (
            <button
              onClick={() => cancelSubscription(false)}
              disabled={cancelLoading}
              className="w-full py-2 px-4 bg-red-500/20 hover:bg-red-500/30 border border-red-500/30 rounded-md text-red-400 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {cancelLoading ? 'Cancelling...' : 'Cancel Subscription'}
            </button>
          )}
          
          {cancelError && (
            <p className="text-sm text-red-400">
              {cancelError.response?.data.message || cancelError.message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default DetailedSubscriptionInfo; 