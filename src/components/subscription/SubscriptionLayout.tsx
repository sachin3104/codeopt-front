import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, CreditCard } from 'lucide-react';
// import DetailedSubscriptionInfo from './DetailedSubscriptionInfo';
import NormalPlans from './NormalPlans';
import PremiumPlans from './PremiumPlans';

const SubscriptionLayout: React.FC = () => {
  const navigate = useNavigate();

  const handleGoHome = () => {
    navigate('/', { replace: true });
  };

  return (
    <div className="space-y-4 sm:space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-0">
        <div className="flex items-center space-x-3">
          <CreditCard className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
          <h2 className="text-lg sm:text-xl font-semibold text-white">Subscription Management</h2>
        </div>
        <button 
          onClick={handleGoHome}
          className="flex items-center justify-center gap-2 px-3 sm:px-4 py-2 rounded-lg text-white backdrop-blur-md transition-all duration-300 bg-gradient-to-br from-black/40 via-black/30 to-black/20 hover:from-black/50 hover:via-black/40 hover:to-black/30 border border-white/20 hover:border-white/30 text-sm sm:text-base"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Back to Home</span>
          <span className="sm:hidden">Back</span>
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 flex flex-col lg:flex-row gap-4 sm:gap-6 lg:gap-8">
        {/* <DetailedSubscriptionInfo /> */}
        <div className="w-full lg:w-3/5">
          <NormalPlans />
        </div>
        <div className="w-full lg:w-2/5">
          <PremiumPlans />
        </div>
      </div>
    </div>
  );
};

export default SubscriptionLayout; 