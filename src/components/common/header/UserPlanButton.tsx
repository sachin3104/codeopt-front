import React, { useState, useRef, useEffect } from 'react';
import { User, LogOut, UserCircle, ChevronDown } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';
import { useSubscription } from '@/hooks/use-subscription';
import { useNavigate } from 'react-router-dom';
import LogoutModal from './LogoutModal';
import { GlassmorphicAvatar } from '@/components/ui/avatar';

const UserPlanButton: React.FC = () => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
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
    setIsLogoutModalOpen(true);
  };

  const handleLogoutConfirm = async () => {
    try {
      await logout();
      setIsLogoutModalOpen(false);
      navigate('/');
    } catch (error) {
      console.error('Logout failed:', error);
    }
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

  const { plan } = subscription;
  const isFreePlan = plan.plan_type === 'optqo_free';
  
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

  const remainingRequests = getRemainingRequests();
  const totalRequests = getTotalRequests();

  return (
    <>
      <div className="relative" ref={dropdownRef}>
      <GlassmorphicAvatar
          onClick={toggleDropdown}
          icon={<User className="w-5 h-5" />}
          planLabel={planDisplayName}
          planVariant={getPlanVariant()}
          size="md"
        />

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-2 w-64 rounded-xl bg-black/95 border border-white/20 shadow-lg">
            <div className="p-4">
              {/* Plan Info Section */}
              <div className="mb-4">
                <div className="flex items-center justify-between mb-3">
                  <span className="text-white font-semibold capitalize">
                    {planDisplayName} Plan
                  </span>
                  
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
                    <span className="text-gray-400">Used {isFreePlan ? 'today' : 'this month'}:</span>
                    <span className="text-white">
                      {usageData 
                        ? (isFreePlan 
                            ? usageData.current_usage.daily_usage 
                            : usageData.current_usage.monthly_usage)
                        : '0'
                      }
                    </span>
                  </div>

                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Limit ({isFreePlan ? 'per day' : 'per month'}):</span>
                    <span className="text-white">
                      {usageData 
                        ? (isFreePlan 
                            ? usageData.plan_limits.max_daily_usage || 'Unlimited'
                            : usageData.plan_limits.max_monthly_usage || 'Unlimited')
                        : 'Unlimited'
                      }
                    </span>
                  </div>
                </div>
              </div>

              {/* Divider */}
              <div className="border-t border-white/20 my-3"></div>

              {/* Profile and Logout Section */}
              <div className="space-y-1">
                <button
                  onClick={handleUserProfileClick}
                  className="w-full flex items-center px-3 py-2 text-sm text-white hover:bg-white/10 transition-colors rounded-lg"
                >
                  <UserCircle className="w-4 h-4 mr-2" />
                  Profile
                </button>
                <button
                  onClick={handleLogoutClick}
                  className="w-full flex items-center px-3 py-2 text-sm text-red-400 hover:bg-white/10 transition-colors rounded-lg"
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Logout Confirmation Modal */}
      <LogoutModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogoutConfirm}
      />
    </>
  );
};

export default UserPlanButton; 