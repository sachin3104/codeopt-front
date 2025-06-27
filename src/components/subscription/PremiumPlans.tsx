import React, { useEffect, useState } from 'react';
import { PlanType, subscriptionService } from '@/api/subscription';
import type { Plan } from '@/types/subscription';
import { useSubscription } from '@/hooks/use-subscription';
import type { AxiosError } from 'axios';
import type { ApiErrorResponse } from '@/types/subscription';

const PremiumPlans: React.FC = () => {
  const {
    consultationPlans,
    fetchingConsultationPlans,
    consultationPlansError,
    fetchConsultationPlans,
    consultationCheckoutLoading,
    consultationCheckoutError,
    startConsultationCheckout,
  } = useSubscription();

  const [plans, setPlans] = useState<Plan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<AxiosError<ApiErrorResponse> | null>(null);
  const [selectedPlan, setSelectedPlan] = useState<PlanType | null>(null);
  
  // Consultation booking states
  const [showConsultationModal, setShowConsultationModal] = useState(false);
  const [selectedConsultationPlan, setSelectedConsultationPlan] = useState<Plan | null>(null);
  const [consultationForm, setConsultationForm] = useState({
    consultationType: 'half_hour',
    selectedDate: '',
    description: ''
  });

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
            // Initialize form with first available consultation option
            setConsultationForm({
              consultationType: plan.consultation_options[0].duration,
              selectedDate: '',
              description: ''
            });
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

  const handleConsultationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedConsultationPlan) return;

    try {
      await startConsultationCheckout(
        consultationForm.consultationType,
        consultationForm.selectedDate,
        consultationForm.description
      );
      // User will be redirected to Stripe checkout
      setShowConsultationModal(false);
      setConsultationForm({
        consultationType: 'half_hour',
        selectedDate: '',
        description: ''
      });
    } catch (error) {
      console.error('Consultation booking error:', error);
    }
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getConsultationOptions = (plan: Plan) => {
    if (!plan.consultation_options || plan.consultation_options.length === 0) {
      return [];
    }
    return plan.consultation_options;
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

      {/* Consultation Booking Modal */}
      {showConsultationModal && selectedConsultationPlan && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-gray-900/95 border border-white/20 rounded-xl p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-xl font-semibold text-white">
                Book {selectedConsultationPlan.name} Consultation
              </h3>
              <button
                onClick={() => setShowConsultationModal(false)}
                className="text-white/70 hover:text-white"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleConsultationSubmit} className="space-y-4">
              {/* Consultation Type Selection */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Consultation Duration:
                </label>
                <select
                  value={consultationForm.consultationType}
                  onChange={(e) => setConsultationForm({
                    ...consultationForm,
                    consultationType: e.target.value
                  })}
                  className="w-full bg-gray-800/50 border border-white/20 rounded-md px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  required
                >
                  {getConsultationOptions(selectedConsultationPlan).map((option, index) => (
                    <option key={index} value={option.duration}>
                      {option.duration_label}: ${option.price} - {option.description}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date Selection */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Preferred Date:
                </label>
                <input
                  type="date"
                  value={consultationForm.selectedDate}
                  onChange={(e) => setConsultationForm({
                    ...consultationForm,
                    selectedDate: e.target.value
                  })}
                  min={getMinDate()}
                  className="w-full bg-gray-800/50 border border-white/20 rounded-md px-3 py-2 text-white focus:outline-none focus:border-purple-500"
                  required
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-white/80 text-sm font-medium mb-2">
                  Description (Optional):
                </label>
                <textarea
                  value={consultationForm.description}
                  onChange={(e) => setConsultationForm({
                    ...consultationForm,
                    description: e.target.value
                  })}
                  placeholder="Describe what you need help with..."
                  rows={4}
                  className="w-full bg-gray-800/50 border border-white/20 rounded-md px-3 py-2 text-white focus:outline-none focus:border-purple-500 resize-none"
                />
              </div>

              {/* Error Display */}
              {consultationCheckoutError && (
                <div className="text-red-400 text-sm">
                  {consultationCheckoutError.response?.data.message || consultationCheckoutError.message}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={consultationCheckoutLoading}
                className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30 py-2 rounded-md font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {consultationCheckoutLoading ? 'Creating Booking...' : 'Book Consultation'}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PremiumPlans; 