import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, User } from 'lucide-react';
import DetailedSubscriptionInfo from './DetailedSubscriptionInfo';
import UserDetails from './UserDetails';

const UserLayout: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="space-y-4 sm:space-y-6 md:space-y-8 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
        <div className="flex items-center space-x-2 sm:space-x-3">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold text-white">Profile</h2>
        </div>
        <button 
          onClick={handleGoHome}
          className="flex items-center justify-center sm:justify-start gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-lg text-white backdrop-blur-md transition-all duration-300 bg-gradient-to-br from-black/40 via-black/30 to-black/20 hover:from-black/50 hover:via-black/40 hover:to-black/30 border border-white/20 hover:border-white/30 text-sm sm:text-base"
        >
          <ArrowLeft className="w-3 sm:w-4 h-3 sm:h-4" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-4 sm:space-y-6 md:space-y-8">
        <div className="w-full">
          <UserDetails />
        </div>

        {/* User Subscription Card */}
        <div className="w-full">
          <DetailedSubscriptionInfo />
        </div>
      </div>
    </div>
  );
};

export default UserLayout; 