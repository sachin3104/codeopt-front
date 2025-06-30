import React, { useEffect, useState } from 'react';
import { PlanType, subscriptionService } from '@/api/subscription';
import type { Plan } from '@/types/subscription';
import { useSubscription } from '@/hooks/use-subscription';
import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@/types/subscription';
import ExpertConsultationModal from './ExpertConsultationModal';

const PremiumPlans: React.FC = () => {
  const {
    consultationPlans,
    fetchingConsultationPlans,
    consultationPlansError,
    fetchConsultationPlans,
  } = useSubscription();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AxiosError<ApiErrorResponse> | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  
  // Consultation booking states
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [selectedConsultationPlan, setSelectedConsultationPlan] = useState<Plan | null>(null);

  useEffect(() => {
    setLoading(true);
    subscriptionService.getPlans()
      .then((allPlans) => {
        // Filter only plans with 'email_contact' or 'book_consultation' action type
        const premiumPlans = allPlans.filter(plan => 
          plan.action_type === 'email_contact' || plan.action_type === 'book_consultation'
        );
        setPlans(premiumPlans);
      })
      .catch(setError)
      .finally(() => setLoading(false));
  }, []);

  // Load consultation plans when component mounts
  useEffect(() => {
    fetchConsultationPlans();
  }, [fetchConsultationPlans]);

  const handleSelect = async (plan: Plan) => {
    setSelectedPlan(plan.plan_type as PlanType);
    
    try {
      // Handle different action types
      switch (plan.action_type) {
        case 'email_contact':
          // Handle email contact action
          window.location.href = `mailto:contact@codeopt.com?subject=Inquiry about ${plan.name} plan`;
          break;
          
        case 'book_consultation':
          // Open consultation booking modal
          if (plan.consultation_options && plan.consultation_options.length > 0) {
            setSelectedConsultationPlan(plan);
            setShowConsultationModal(true);
          } else {
            alert('No consultation options available for this plan.');
          }
          break;
          
        default:
          console.warn('Unknown action type:', plan.action_type);
      }
    } catch (error) {
      // Error is handled by the context
      console.error('Plan selection error:', error);
    } finally {
      setSelectedPlan(null);
    }
  };

  const handleCloseConsultationModal = () => {
    setShowConsultationModal(false);
    setSelectedConsultationPlan(null);
  };

  if (loading) {
    return <div className="text-center py-8 text-lg text-gray-500">Loading premium plans…</div>;
  }
  if (error) {
    return <div className="text-center py-8 text-red-600">{error.response?.data.message || error.message}</div>;
  }
  if (fetchingConsultationPlans) {
    return <div className="text-center py-8 text-lg text-gray-500">Loading consultation options…</div>;
  }

  return (
    <div className="mt-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {plans.map((plan) => {
          const isLoading = selectedPlan === plan.plan_type;
          
          // Determine button text based on action type
          const getButtonText = () => {
            if (isLoading) return 'Processing…';
            
            switch (plan.action_type) {
              case 'email_contact':
                return 'Contact Us';
              case 'book_consultation':
                return 'Book Consultation';
              default:
                return 'Select Plan';
            }
          };

          // Get button styling based on action type
          const getButtonStyle = () => {
            if (isLoading) return 'bg-white/10 text-white/50 cursor-not-allowed';
            
            switch (plan.action_type) {
              case 'email_contact':
                return 'bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 border border-blue-500/30';
              case 'book_consultation':
                return 'bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30';
              default:
                return 'bg-white/10 hover:bg-white/20 text-white';
            }
          };

          return (
            <div
              key={plan.plan_type}
              className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl p-6 flex flex-col justify-between min-h-[340px] transition-all duration-200"
            >
              <div>
                <h3 className="text-2xl font-semibold text-white flex items-center gap-2">
                  {plan.name}
                </h3>
                <p className="mt-2 text-white/70">{plan.description}</p>
                <div className="mt-4 text-3xl font-bold text-white">
                  {plan.price === 0 ? 'Contact for Pricing' : `$${plan.price}/mo`}
                </div>
                
                {/* Plan Features */}
                <ul className="mt-4 space-y-1 text-white/80 text-sm">
                  <li>Max code input: {plan.max_code_input_chars ? plan.max_code_input_chars.toLocaleString() : 'Unlimited'}</li>
                  <li>
                    Daily requests: {plan.max_daily_usage != null ? plan.max_daily_usage : 'Unlimited'}
                  </li>
                  <li>
                    Monthly requests: {plan.max_monthly_usage != null ? plan.max_monthly_usage : 'Unlimited'}
                  </li>
                </ul>

                {/* Consultation Options */}
                {plan.consultation_options && plan.consultation_options.length > 0 && (
                  <div className="mt-4 p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <p className="text-purple-400 text-sm font-medium mb-2">Consultation Options:</p>
                    <div className="space-y-1">
                      {plan.consultation_options.map((option, index) => (
                        <div key={index} className="text-white/70 text-xs">
                          {option.duration_label}: ${option.price} - {option.description}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6">
                <button
                  onClick={() => handleSelect(plan)}
                  disabled={isLoading}
                  className={`w-full py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed ${getButtonStyle()}`}
                >
                  {getButtonText()}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Expert Consultation Modal */}
      <ExpertConsultationModal
        isOpen={showConsultationModal}
        onClose={handleCloseConsultationModal}
        selectedPlan={selectedConsultationPlan}
      />
    </div>
  );
};

export default PremiumPlans; 