import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, ChevronDown, Zap } from 'lucide-react';
import { useSubscription } from '@/hooks/use-subscription';

const PlanDetails: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const { subscription, usageData } = useSubscription();

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

  // Don't render if no subscription data
  if (!subscription || !usageData) {
    return null;
  }

  const { plan } = subscription;
  const isFreePlan = plan.plan_type === 'free';
  
  // Get remaining requests based on plan type
  const getRemainingRequests = () => {
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
          {plan.plan_type === 'free' ? (
            <Zap className="w-4 h-4 text-blue-300" />
          ) : (
            <Crown className="w-4 h-4 text-yellow-400" />
          )}
        </div>

        {/* Plan Name */}
        <span className="text-sm font-medium text-white capitalize">
          {plan.plan_type}
        </span>

        {/* Remaining Requests */}
        {remainingRequests !== null && (
          <div className="flex items-center space-x-1">
            <span className="text-xs text-gray-300">
              {remainingRequests}
            </span>
            <span className="text-xs text-gray-400">
              left {periodText}
            </span>
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
                {plan.plan_type === 'free' ? (
                  <Zap className="w-5 h-5 text-blue-300" />
                ) : (
                  <Crown className="w-5 h-5 text-yellow-400" />
                )}
                <span className="text-white font-semibold capitalize">
                  {plan.plan_type} Plan
                </span>
              </div>
              {plan.plan_type !== 'free' && (
                <span className="text-sm text-green-400 font-medium">
                  ${plan.price}/{plan.currency === 'usd' ? 'mo' : plan.currency}
                </span>
              )}
            </div>

            

            {/* Usage Details */}
            <div className="space-y-2 mb-4">
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