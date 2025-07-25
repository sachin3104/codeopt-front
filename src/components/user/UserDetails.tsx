import React from 'react';
import { User, Mail, Shield, CheckCircle,Clock } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

const UserDetails: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
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

  if (!user) {
    return (
      <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-lg sm:rounded-xl p-4 sm:p-6">
        <h2 className="text-lg sm:text-xl font-semibold text-white mb-4 sm:mb-6 flex items-center">
          <User className="w-4 sm:w-5 h-4 sm:h-5 mr-2" />
          User Details
        </h2>
        <p className="text-white/70 text-center text-sm sm:text-base">No user data available</p>
      </div>
    );
  }


  // Get approval status info
  const getApprovalStatus = () => {
    if (user.is_approved) {
      return {
        status: 'approved',
        message: 'Account is fully verified and active',
        icon: <CheckCircle className="w-3 sm:w-4 h-3 sm:h-4 text-green-400" />,
        color: 'text-green-400',
        bgColor: 'bg-green-500/20',
        borderColor: 'border-green-500/30'
      };
    } else {
      return {
        status: 'pending',
        message: 'Account is pending approval from administrators',
        icon: <Clock className="w-3 sm:w-4 h-3 sm:h-4 text-yellow-400" />,
        color: 'text-yellow-400',
        bgColor: 'bg-yellow-500/20',
        borderColor: 'border-yellow-500/30'
      };
    }
  };

  const approvalStatus = getApprovalStatus();

  return (
    <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-lg sm:rounded-xl p-4 sm:p-6">
      
      <div className="space-y-4 sm:space-y-6">
        {/* User Profile */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <div className="w-6 sm:w-8 h-6 sm:h-8 rounded-full bg-white/10 flex items-center justify-center">
            <User className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
          </div>
          <div className="flex-1">
            <div className="flex items-center space-x-2">
              <div>
                <p className="text-white font-medium text-sm sm:text-base">{user.username}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information and Account Status - Side by Side */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
          {/* Contact Information */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center space-x-2">
              <Mail className="w-3 sm:w-4 h-3 sm:h-4 text-white" />
              <p className="text-white/70 text-xs sm:text-sm font-medium">Contact Information</p>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:gap-4">
              <div className="text-center p-2 sm:p-3 bg-white/5 rounded-lg">
                <p className="text-white/70 text-xs">Email Address</p>
                <p className="text-white font-medium text-xs sm:text-sm break-all">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Account Status */}
          <div className="space-y-2 sm:space-y-3">
            <div className="flex items-center space-x-2">
              <Shield className="w-3 sm:w-4 h-3 sm:h-4 text-blue-400" />
              <p className="text-blue-400 text-xs sm:text-sm font-medium">Account Status</p>
            </div>
            <div className="p-2 sm:p-3 bg-blue-500/10 rounded-lg border border-blue-500/20">
              <div className="flex justify-between items-start">
                <div>
                  <p className="text-blue-400 font-medium text-xs sm:text-sm">Approval Status</p>
                  <p className="text-white/70 text-xs">{approvalStatus.message}</p>
                </div>
                <div className="text-right">
                  {approvalStatus.icon}
                  <p className="text-white/60 text-xs mt-1 capitalize">{approvalStatus.status}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserDetails; 