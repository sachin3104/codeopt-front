import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, ChevronDown, Zap, Mail, Calendar } from 'lucide-react';
import { useSubscription } from '@/hooks/use-subscription';

const PlanDetails: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { subscription, usageData, fetching, fetchingUsage } = useSubscription();

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleSubscriptionClick = () => {
    setIsDropdownOpen(false);
    navigate('/subscription');
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    if (isDropdownOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isDropdownOpen]);

  // Don't render if no subscription data and still fetching
  if (!subscription && fetching) {
    return null;
  }

  // Don't render if no subscription data at all
  if (!subscription) {
    return null;
  }

  const { plan } = subscription;
  const isFreePlan = plan.plan_type === 'optqo_free';
  
  // Get action type display info based on backend data
  const getActionTypeInfo = () => {
    switch (plan.action_type) {
      case 'subscribe':
        return {
          label: 'Subscription',
          icon: isFreePlan ? <Zap className="w-4 h-4 text-blue-300" /> : <Crown className="w-4 h-4 text-yellow-400" />,
          color: isFreePlan ? 'text-blue-300' : 'text-yellow-400'
        };
      case 'email_contact':
        return {
          label: 'Contact',
          icon: <Mail className="w-4 h-4 text-blue-400" />,
          color: 'text-blue-400'
        };
      case 'book_consultation':
        return {
          label: 'Consultation',
          icon: <Calendar className="w-4 h-4 text-purple-400" />,
          color: 'text-purple-400'
        };
      default:
        return {
          label: 'Plan',
          icon: isFreePlan ? <Zap className="w-4 h-4 text-blue-300" /> : <Crown className="w-4 h-4 text-yellow-400" />,
          color: isFreePlan ? 'text-blue-300' : 'text-yellow-400'
        };
    }
  };

  const actionTypeInfo = getActionTypeInfo();
  
  // Get remaining requests based on plan type and usage data
  const getRemainingRequests = () => {
    if (!usageData) return null;
    
    if (isFreePlan) {
      return usageData.plan_limits.max_daily_usage 
        ? usageData.plan_limits.max_daily_usage - usageData.current_usage.daily_usage
        : null;
    } else {
      return usageData.plan_limits.max_monthly_usage 
        ? usageData.plan_limits.max_monthly_usage - usageData.current_usage.monthly_usage
        : null;
    }
  };

  const remainingRequests = getRemainingRequests();
  const periodText = isFreePlan ? 'today' : 'this month';

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={toggleDropdown}
        className="flex items-center space-x-2 px-3 py-2 rounded-lg text-white backdrop-blur-md transition-all duration-300 bg-gradient-to-br from-black/40 via-black/30 to-black/20 hover:from-black/50 hover:via-black/40 hover:to-black/30 border border-white/20 hover:border-white/30"
      >
        {/* Plan Icon */}
        <div className="flex items-center space-x-1">
          {actionTypeInfo.icon}
        </div>

        {/* Plan Name - use dynamic name from backend */}
        <span className="text-sm font-medium text-white">
          {plan.name}
        </span>

        {/* Remaining Requests - only show if usage data is available */}
        {usageData && remainingRequests !== null && (
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-300">
              {remainingRequests}
            </span>
            <span className="text-xs text-gray-400">
              left {periodText}
            </span>
          </div>
        )}

        {/* Loading indicator */}
        {fetchingUsage && (
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="text-xs text-gray-400">Loading...</span>
          </div>
        )}

        {/* Dropdown Arrow */}
        <ChevronDown className={`w-3 h-3 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
      </button>

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 rounded-xl bg-black/95 border border-white/20 shadow-lg">
          <div className="p-4">
            {/* Plan Header */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center space-x-2">
                {actionTypeInfo.icon}
                <span className="text-white font-semibold">
                  {plan.name}
                </span>
              </div>
              {plan.price > 0 && (
                <span className="text-sm text-green-400 font-medium">
                  ${plan.price}/{plan.currency === 'usd' ? 'mo' : plan.currency}
                </span>
              )}
            </div>

            {/* Plan Description */}
            <div className="mb-4">
              <p className="text-sm text-white/70 mb-2">{plan.description}</p>
              <p className="text-xs text-white/50">{actionTypeInfo.label} Plan</p>
            </div>

            {/* Plan Limits */}
            <div className="space-y-2 mb-4">
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Max Input:</span>
                <span className="text-white">
                  {plan.max_code_input_chars ? `${plan.max_code_input_chars.toLocaleString()} chars` : 'Unlimited'}
                </span>
              </div>
              
              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Daily Limit:</span>
                <span className="text-white">
                  {plan.max_daily_usage ? plan.max_daily_usage : 'Unlimited'}
                </span>
              </div>

              <div className="flex justify-between text-sm">
                <span className="text-gray-400">Monthly Limit:</span>
                <span className="text-white">
                  {plan.max_monthly_usage ? plan.max_monthly_usage : 'Unlimited'}
                </span>
              </div>
            </div>

            {/* Usage Details - only show if usage data is available */}
            {usageData && (
              <div className="space-y-2 mb-4 pt-4 border-t border-white/10">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Used {periodText}:</span>
                  <span className="text-white">
                    {isFreePlan 
                      ? usageData.current_usage.daily_usage 
                      : usageData.current_usage.monthly_usage
                    }
                  </span>
                </div>
                
                {remainingRequests !== null && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Remaining:</span>
                    <span className={`font-medium ${remainingRequests > 0 ? 'text-green-400' : 'text-red-400'}`}>
                      {remainingRequests}
                    </span>
                  </div>
                )}

                <div className="flex justify-between text-sm">
                  <span className="text-gray-400">Limit:</span>
                  <span className="text-white">
                    {isFreePlan 
                      ? usageData.plan_limits.max_daily_usage || 'Unlimited'
                      : usageData.plan_limits.max_monthly_usage || 'Unlimited'
                    }
                  </span>
                </div>
              </div>
            )}

            {/* Consultation Options */}
            {plan.consultation_options && plan.consultation_options.length > 0 && (
              <div className="mb-4 pt-4 border-t border-white/10">
                <div className="flex items-center space-x-2 mb-2">
                  <Calendar className="w-4 h-4 text-purple-400" />
                  <span className="text-purple-400 text-sm font-medium">Consultation Available</span>
                </div>
                <p className="text-white/70 text-xs">
                  {plan.consultation_options.length} consultation option{plan.consultation_options.length > 1 ? 's' : ''} available
                </p>
              </div>
            )}

            {/* Action Button */}
            <button
              onClick={handleSubscriptionClick}
              className="w-full flex items-center justify-center gap-2 px-4 py-2 rounded-lg text-white backdrop-blur-md transition-all duration-300 bg-gradient-to-br from-black/40 via-black/30 to-black/20 hover:from-black/50 hover:via-black/40 hover:to-black/30 text-sm font-medium"
            >
              <Crown className="w-4 h-4" />
              Manage Subscription
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlanDetails; 