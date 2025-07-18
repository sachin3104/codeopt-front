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
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h2 className="text-xl font-semibold text-white">Profile</h2>
        </div>
        <button 
          onClick={handleGoHome}
          className="flex items-center gap-2 px-4 py-2 rounded-lg text-white backdrop-blur-md transition-all duration-300 bg-gradient-to-br from-black/40 via-black/30 to-black/20 hover:from-black/50 hover:via-black/40 hover:to-black/30 border border-white/20 hover:border-white/30"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Home</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 space-y-6">

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