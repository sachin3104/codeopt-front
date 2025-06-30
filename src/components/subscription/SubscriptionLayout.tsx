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
    <div className="space-y-6 h-full flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <CreditCard className="w-6 h-6 text-white" />
          <h2 className="text-xl font-semibold text-white">Subscription Management</h2>
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
      <div className="flex-1 space-y-8">
        {/* <DetailedSubscriptionInfo /> */}
        <NormalPlans />
        <PremiumPlans />
      </div>
    </div>
  );
};

export default SubscriptionLayout; 