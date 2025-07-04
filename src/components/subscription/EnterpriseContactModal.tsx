import React, { useState } from 'react';
import { X } from 'lucide-react';
import { subscriptionService } from '@/api/subscription';

interface EnterpriseContactModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: any;
  onContactSent: () => void;
  contactSent: boolean;
}

const initialForm = {
  first_name: '',
  last_name: '',
  phone: '',
  subject: '',
  message: '',
};

const EnterpriseContactModal: React.FC<EnterpriseContactModalProps> = ({ isOpen, onClose, plan, onContactSent, contactSent }) => {
  const [form, setForm] = useState(initialForm);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    // Extra validation (in case browser required is bypassed)
    if (!form.first_name || !form.last_name || !form.phone || !form.subject || !form.message) {
      setError('Please fill in all fields.');
      setLoading(false);
      return;
    }
    try {
      await subscriptionService.sendEnterpriseContactRequest({ ...form });
      onContactSent();
      setForm(initialForm);
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to send request.');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !plan) return null;

  return (
    <div className="fixed inset-0 z-[9999]">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 backdrop-blur-sm"
        onClick={onClose}
      />
      {/* Modal */}
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-[10000] w-full max-w-md p-6 mx-4 rounded-2xl bg-gradient-to-br from-black/90 via-black/80 to-black/90 border border-white/20 shadow-xl backdrop-blur-xl">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full hover:bg-white/10 transition-colors"
        >
          <X className="w-5 h-5 text-white" />
        </button>
        {/* Form Content */}
        <div className="mt-2">
          {contactSent ? (
            <div className="text-center py-8">
              <h2 className="text-xl font-semibold mb-4 text-green-400">Thank you!</h2>
              <p className="text-white/80">We will reach out to you shortly.</p>
              <button className="mt-6 px-4 py-2 bg-blue-600 text-white rounded" onClick={onClose}>Close</button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h2 className="text-lg font-bold mb-2 text-white">Let’s Get Started</h2>
              <div className="flex flex-col sm:flex-row gap-2">
                <input
                  type="text"
                  name="first_name"
                  placeholder="First Name"
                  value={form.first_name}
                  onChange={handleChange}
                  required
                  className="w-full sm:w-1/2 bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/50 transition-colors text-base h-12"
                />
                <input
                  type="text"
                  name="last_name"
                  placeholder="Last Name"
                  value={form.last_name}
                  onChange={handleChange}
                  required
                  className="w-full sm:w-1/2 bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/50 transition-colors text-base h-12"
                />
              </div>
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                value={form.phone}
                onChange={handleChange}
                required
                className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/50 transition-colors text-base h-12"
              />
              <input
                type="text"
                name="subject"
                placeholder="Subject"
                value={form.subject}
                onChange={handleChange}
                required
                className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-white/50 transition-colors text-base h-12"
              />
              <textarea
                name="message"
                placeholder="Message"
                value={form.message}
                onChange={handleChange}
                required
                className="w-full bg-black/40 border border-white/20 rounded-xl px-4 py-3 min-h-[96px] text-white focus:outline-none focus:border-white/50 transition-colors resize-none placeholder-white/40 text-base"
              />
              {error && <div className="text-red-400 text-sm">{error}</div>}
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg py-2 font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Sending…' : 'Send Request'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};

export default EnterpriseContactModal; 