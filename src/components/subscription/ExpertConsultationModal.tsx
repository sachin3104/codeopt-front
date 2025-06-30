import React, { useState } from 'react';
import type { Plan } from '@/types/subscription';
import { useSubscription } from '@/hooks/use-subscription';
import { Calendar, Clock, MessageSquare, X } from 'lucide-react';

interface ExpertConsultationModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedPlan: Plan | null;
}

const ExpertConsultationModal: React.FC<ExpertConsultationModalProps> = ({
  isOpen,
  onClose,
  selectedPlan
}) => {
  const {
    consultationCheckoutLoading,
    consultationCheckoutError,
    startConsultationCheckout,
  } = useSubscription();

  const [consultationForm, setConsultationForm] = useState({
    consultationType: 'half_hour',
    selectedDate: '',
    description: ''
  });

  const [dateError, setDateError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedPlan) return;

    // Validate date
    if (consultationForm.selectedDate) {
      const selectedDate = new Date(consultationForm.selectedDate);
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      
      if (selectedDate < today) {
        setDateError('Please select a future date');
        return;
      }
    }

    setDateError('');

    try {
      await startConsultationCheckout(
        consultationForm.consultationType,
        consultationForm.selectedDate,
        consultationForm.description
      );
      // User will be redirected to Stripe checkout
      onClose();
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

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedDate = e.target.value;
    setConsultationForm({
      ...consultationForm,
      selectedDate
    });
    
    // Clear error when user selects a valid date
    if (dateError) {
      setDateError('');
    }
  };

  if (!isOpen || !selectedPlan) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative z-50 w-full max-w-md p-6 mx-4 rounded-2xl bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 shadow-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>

        {/* Form Content */}
        <div className="mt-2">
          <form onSubmit={handleSubmit} className="space-y-4">
            
            {/* Consultation Type Selection */}
            <div>
              <label className="flex items-center gap-2 text-white/90 text-sm font-medium mb-2">
                <Clock size={16} className="text-blue-400" />
                Consultation Duration
              </label>
              <select
                value={consultationForm.consultationType}
                onChange={(e) => setConsultationForm({
                  ...consultationForm,
                  consultationType: e.target.value
                })}
                className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white 
                           focus:outline-none focus:border-white/50 transition-colors"
                required
              >
                <option value="half_hour" className="bg-gray-800 text-white">
                  30 minutes ($150)
                </option>
                <option value="full_hour" className="bg-gray-800 text-white">
                  60 minutes ($300)
                </option>
              </select>
            </div>

            {/* Date Selection */}
            <div>
              <label className="flex items-center gap-2 text-white/90 text-sm font-medium mb-2">
                <Calendar size={16} className="text-white" />
                Preferred Date
              </label>
              <input
                type="date"
                value={consultationForm.selectedDate}
                onChange={handleDateChange}
                min={getMinDate()}
                className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white 
                           focus:outline-none focus:border-white/50 transition-colors"
                required
              />
              {dateError && (
                <div className="text-red-400 text-sm mt-1">
                  {dateError}
                </div>
              )}
            </div>

            {/* Description */}
            <div>
              <label className="flex items-center gap-2 text-white/90 text-sm font-medium mb-2">
                <MessageSquare size={16} className="text-cyan-400" />
                Description (Optional)
              </label>
              <textarea
                value={consultationForm.description}
                onChange={(e) => setConsultationForm({
                  ...consultationForm,
                  description: e.target.value
                })}
                placeholder="Describe what you need help with..."
                rows={4}
                className="w-full bg-black/40 border border-white/20 rounded-lg px-3 py-2 text-white 
                           focus:outline-none focus:border-white/50 transition-colors resize-none
                           placeholder-white/40"
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
              className="w-full bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 border border-purple-500/30 
                         py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {consultationCheckoutLoading ? 'Creating Booking...' : 'Book Consultation'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ExpertConsultationModal; 