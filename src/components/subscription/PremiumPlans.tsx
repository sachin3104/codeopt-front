import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlanType, subscriptionService } from '@/api/subscription';
import type { Plan } from '@/types/subscription';
import { useSubscription } from '@/hooks/use-subscription';
import { useAuth } from '@/hooks/use-auth';
import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@/types/subscription';
import ExpertConsultationModal from './ExpertConsultationModal';
import EnterpriseContactModal from './EnterpriseContactModal';
import { Check, Mail, Calendar } from 'lucide-react';

const PremiumPlans: React.FC = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
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

  // Enterprise contact modal states
  const [showEnterpriseModal, setShowEnterpriseModal] = useState(false);
  const [enterprisePlan, setEnterprisePlan] = useState<Plan | null>(null);
  const [contactSent, setContactSent] = useState(false);

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
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    
    setSelectedPlan(plan.plan_type as PlanType);
    try {
      switch (plan.action_type) {
        case 'email_contact':
          setEnterprisePlan(plan);
          setShowEnterpriseModal(true);
          break;
        case 'book_consultation':
          if (plan.consultation_options && plan.consultation_options.length > 0) {
            setSelectedConsultationPlan(plan);
            setShowConsultationModal(true);
          } else {
            alert('No consultation options available for this plan.');
          }
          break;
        default:
      }
    } catch (error) {
      // Error is handled by the context
    } finally {
      setSelectedPlan(null);
    }
  };

  const handleCloseConsultationModal = () => {
    setShowConsultationModal(false);
    setSelectedConsultationPlan(null);
  };

  const handleCloseEnterpriseModal = () => {
    setShowEnterpriseModal(false);
    setEnterprisePlan(null);
    setContactSent(false);
  };

  const handleContactSent = () => {
    setContactSent(true);
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
    <div className="space-y-4 sm:space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 w-full">
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

          // Get button icon based on action type
          const getButtonIcon = () => {
            switch (plan.action_type) {
              case 'email_contact':
                return Mail;
              case 'book_consultation':
                return Calendar;
              default:
                return null;
            }
          };

          // Create features array for the plan
          const features = [
            `Max code input: ${plan.max_code_input_chars ? plan.max_code_input_chars.toLocaleString() : 'Custom'}`,
            `Daily requests: ${plan.max_daily_usage != null ? plan.max_daily_usage : 'Custom'}`
          ];

          const ButtonIcon = getButtonIcon();

          return (
            <div
              key={plan.plan_type}
              className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl p-3 sm:p-4 flex flex-col h-auto min-h-[280px] sm:min-h-[320px] md:min-h-[360px] lg:h-[500px] w-full"
            >
              {/* Plan Name and Description */}
              <div className="min-h-[50px] sm:min-h-[60px] md:min-h-[70px] lg:min-h-[100px]">
                <h3 className="text-lg sm:text-xl font-bold text-white mb-1 sm:mb-2 md:mb-3 leading-tight">
                  {plan.name}
                </h3>
                <p className="text-xs sm:text-sm text-white/60 leading-relaxed">
                  {plan.description}
                </p>
              </div>

              {/* Pricing */}
              <div className="flex flex-col items-start mb-2 sm:mb-2 md:mb-3 lg:mb-6">
                <div className="flex items-baseline">
                  <span className="text-lg sm:text-xl font-bold text-white">
                    {plan.price === 0 ? 'Custom' : `$${plan.price}`}
                  </span>
                  <span className="text-xs sm:text-sm text-white/60 ml-1">
                    {plan.price === 0 ? '/solution' : plan.action_type === 'book_consultation' ? '/30 min' : '/per month'}
                  </span>
                </div>
              </div>

              {/* Content area that flexes to push button to bottom */}
              <div className="flex-1 flex flex-col">
                {/* Features List - Only show for Enterprise plans */}
                {plan.action_type === 'email_contact' && (
                  <div className="space-y-1 sm:space-y-1 md:space-y-2 lg:space-y-4 mb-2 sm:mb-2 md:mb-3 lg:mb-6">
                    <div className="space-y-1 sm:space-y-1 md:space-y-2 lg:space-y-3">
                      {features.map((feature, idx) => (
                        <div key={idx} className="flex items-start gap-2 sm:gap-3">
                          <Check className="h-3 w-3 sm:h-4 sm:w-4 text-blue-400 flex-shrink-0 mt-0.5" />
                          <span className="text-xs sm:text-sm text-white/80 leading-relaxed">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Consultation Options */}
                {plan.consultation_options && plan.consultation_options.length > 0 && (
                  <div className="mb-2 sm:mb-2 md:mb-3 lg:mb-6 p-2 sm:p-3 bg-purple-500/10 rounded-lg border border-purple-500/20">
                    <p className="text-purple-400 text-xs sm:text-sm font-medium mb-1 sm:mb-2">Consultation Options:</p>
                    <div className="space-y-1">
                      {plan.consultation_options.map((option, index) => (
                        <div key={index} className="text-white/70 text-xs">
                          {option.duration_label}: ${option.price} - {option.description}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Spacer to push button to bottom */}
                <div className="flex-1"></div>
              </div>

              {/* CTA Button */}
              <button
                onClick={() => handleSelect(plan)}
                disabled={isLoading}
                className={`w-full backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 hover:bg-white/20 transition-all duration-300 rounded-xl text-white px-3 py-2 sm:py-3 lg:py-2 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed text-sm sm:text-base lg:text-sm ${
                  isLoading ? 'bg-white/10 text-white/50 cursor-not-allowed' : ''
                }`}
              >
                {getButtonText()} {ButtonIcon && <ButtonIcon className="w-3 h-3 sm:w-4 sm:h-4" />}
              </button>
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
      {/* Enterprise Contact Modal */}
      <EnterpriseContactModal
        isOpen={showEnterpriseModal}
        onClose={handleCloseEnterpriseModal}
        plan={enterprisePlan}
        onContactSent={handleContactSent}
        contactSent={contactSent}
      />
    </div>
  );
};

export default PremiumPlans; 