import React from 'react'
import { AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useRemainingRequests } from '@/hooks/use-remaining-requests'
import { useSubscription } from '@/hooks/use-subscription'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface RequestLimitModalProps {
  isOpen: boolean
  onClose: () => void
}

export const RequestLimitModal: React.FC<RequestLimitModalProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate()
  const { subscription } = useSubscription()
  const { 
    remainingRequests, 
    totalRequests, 
    usedRequests, 
    periodType, 
    isOverLimit 
  } = useRemainingRequests()

  const handleUpgrade = () => {
    onClose()
    navigate('/subscription')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gradient-to-br from-black/90 via-black/80 to-black/90 border border-white/20 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Request Limit Exceeded
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Plan Limits Summary */}
          {subscription?.plan && (
            <div className="p-3 rounded-lg bg-white/5 border border-white/10">
              <h4 className="text-sm font-medium text-white mb-2">Current Plan Limits:</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-white/70">Max Input:</span>
                  <span className="text-white">
                    {subscription.plan.max_code_input_chars ? `${subscription.plan.max_code_input_chars.toLocaleString()} chars` : 'Unlimited'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Daily Requests:</span>
                  <span className="text-white">
                    {subscription.plan.max_daily_usage ? subscription.plan.max_daily_usage : 'Unlimited'}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white/70">Monthly Requests:</span>
                  <span className="text-white">
                    {subscription.plan.max_monthly_usage ? subscription.plan.max_monthly_usage : 'Unlimited'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={handleUpgrade}
              className="flex-1 flex items-center justify-center gap-2 px-6 py-4 rounded-xl text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-colors"
            >
              <span>View Plans</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 