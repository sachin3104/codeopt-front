import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, UserCircle, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useSubscription } from '@/hooks/use-subscription';
import { useNavigate } from 'react-router-dom';
import { GlassmorphicAvatar } from '@/components/ui/avatar';

interface UserPlanButtonProps {
  onLogoutClick: () => void;
}

const UserPlanButton: React.FC<UserPlanButtonProps> = ({ onLogoutClick }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { subscription, usageData, fetching, fetchingUsage } = useSubscription();

  

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  const handleLogoutClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDropdownOpen(false);
    onLogoutClick();
  };

  const handleUserProfileClick = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDropdownOpen(false);
    navigate('/profile');
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

  // Extract plan information from the subscription response
  const plan = subscription.plan;
  const isFreePlan = plan.plan_type === 'FREE';
  
  // Get plan display name
  const getPlanDisplayName = () => {
    if (plan.name.toLowerCase().includes('free')) return 'free';
    if (plan.name.toLowerCase().includes('pro')) return 'pro';
    if (plan.name.toLowerCase().includes('ultimate')) return 'ultimate';
    return 'free'; // fallback
  };

  // Get plan variant for avatar styling
  const getPlanVariant = () => {
    if (planDisplayName === 'free') return 'default';
    if (planDisplayName === 'pro') return 'pro';
    if (planDisplayName === 'ultimate') return 'premium';
    return 'default';
  };

  const planDisplayName = getPlanDisplayName();

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

  const getTotalRequests = () => {
    if (!usageData) return null;
    
    if (isFreePlan) {
      return usageData.plan_limits.max_daily_usage;
    } else {
      return usageData.plan_limits.max_monthly_usage;
    }
  };


  return (
    <div className="relative" ref={dropdownRef}>
      <GlassmorphicAvatar
        onClick={toggleDropdown}
        icon={<User className="w-4 h-4 xs:w-4.5 xs:h-4.5 sm:w-5 sm:h-5 md:w-5.5 md:h-5.5 lg:w-6 lg:h-6" />}
        planLabel={planDisplayName}
        planVariant={getPlanVariant()}
        size="md"
      />

      {/* Dropdown Menu */}
      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-56 xs:w-60 sm:w-64 md:w-64 lg:w-80 rounded-lg xs:rounded-xl sm:rounded-xl md:rounded-2xl bg-black/95 border border-white/20 shadow-lg backdrop-blur-md">
          <div className="p-3 xs:p-4 sm:p-4 md:p-4 lg:p-6">
            {/* Plan Info Section */}
            <div className="mb-3 xs:mb-4 sm:mb-4 md:mb-4 lg:mb-5">
              <div className="mb-2 xs:mb-3 sm:mb-3 md:mb-3 lg:mb-4">
                <span className="text-white font-semibold capitalize text-sm xs:text-sm sm:text-base md:text-base lg:text-lg">
                  {planDisplayName} Plan
                </span>
              </div>

              {/* Plan Limits */}
              <div className="space-y-1.5 xs:space-y-2 sm:space-y-2 md:space-y-2 lg:space-y-2.5 mb-3 xs:mb-4 sm:mb-4 md:mb-4 lg:mb-5">
                <div className="flex justify-between text-xs xs:text-sm sm:text-sm md:text-sm lg:text-base">
                  <span className="text-gray-400">Max Input:</span>
                  <span className="text-white">
                    {usageData?.plan_limits.max_code_input_chars 
                      ? `${usageData.plan_limits.max_code_input_chars.toLocaleString()} chars` 
                      : 'Unlimited'}
                  </span>
                </div>
                
                <div className="flex justify-between text-xs xs:text-sm sm:text-sm md:text-sm lg:text-base">
                  <span className="text-gray-400">Used today:</span>
                  <span className="text-white">
                    {usageData ? usageData.current_usage.daily_usage : '0'}
                  </span>
                </div>

                <div className="flex justify-between text-xs xs:text-sm sm:text-sm md:text-sm lg:text-base">
                  <span className="text-gray-400">Limit per day:</span>
                  <span className="text-white">
                    {usageData?.plan_limits.max_daily_usage || 'Unlimited'}
                  </span>
                </div>
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-white/20 my-2 xs:my-3 sm:my-3 md:my-3 lg:my-4"></div>

            {/* Profile and Logout Section */}
            <div className="space-y-1 xs:space-y-1.5 sm:space-y-1.5 md:space-y-1.5 lg:space-y-2">
              <button
                onClick={handleUserProfileClick}
                className="w-full flex items-center px-2 xs:px-3 sm:px-3 md:px-3 lg:px-4 py-1.5 xs:py-2 sm:py-2 md:py-2 lg:py-2.5 text-xs xs:text-sm sm:text-sm md:text-sm lg:text-base text-white hover:bg-white/10 transition-colors rounded-md xs:rounded-lg sm:rounded-lg md:rounded-lg lg:rounded-xl"
              >
                <UserCircle className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4.5 lg:h-4.5 mr-2 xs:mr-2.5 sm:mr-2.5 md:mr-2.5 lg:mr-3" />
                Profile
              </button>
              <button
                onClick={handleLogoutClick}
                className="w-full flex items-center px-2 xs:px-3 sm:px-3 md:px-3 lg:px-4 py-1.5 xs:py-2 sm:py-2 md:py-2 lg:py-2.5 text-xs xs:text-sm sm:text-sm md:text-sm lg:text-base text-red-400 hover:bg-white/10 transition-colors rounded-md xs:rounded-lg sm:rounded-lg md:rounded-lg lg:rounded-xl"
              >
                <LogOut className="w-3 h-3 xs:w-3.5 xs:h-3.5 sm:w-4 sm:h-4 md:w-4 md:h-4 lg:w-4.5 lg:h-4.5 mr-2 xs:mr-2.5 sm:mr-2.5 md:mr-2.5 lg:mr-3" />
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserPlanButton; 