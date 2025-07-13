import React from 'react'
import { AlertTriangle } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCharacterLimit } from '@/hooks/use-character-limit'
import { useSubscription } from '@/hooks/use-subscription'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

interface CharacterLimitModalProps {
  isOpen: boolean
  onClose: () => void
  currentCode: string
}

export const CharacterLimitModal: React.FC<CharacterLimitModalProps> = ({
  isOpen,
  onClose,
  currentCode,
}) => {
  const navigate = useNavigate()
  const { currentCount, limit, planType } = useCharacterLimit(currentCode)
  const { subscription } = useSubscription()

  const handleUpgrade = () => {
    onClose()
    navigate('/subscription')
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-xs xs:max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl bg-gradient-to-br from-black/90 via-black/80 to-black/90 border border-white/20 backdrop-blur-xl p-3 xs:p-4 sm:p-5 md:p-6 lg:p-8 rounded-lg xs:rounded-xl sm:rounded-xl md:rounded-2xl lg:rounded-3xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white text-sm xs:text-base sm:text-lg md:text-xl lg:text-2xl">
            <AlertTriangle className="w-3 h-3 xs:w-4 xs:h-4 sm:w-4 sm:h-4 md:w-5 md:h-5 lg:w-6 lg:h-6 text-red-400" />
            Character Limit Exceeded
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-2 xs:space-y-3 sm:space-y-4 md:space-y-5 lg:space-y-6">
          {/* Plan Limits Summary */}
          {subscription?.plan && (
            <div className="p-2 xs:p-3 sm:p-4 md:p-5 lg:p-6 rounded-lg xs:rounded-xl sm:rounded-xl md:rounded-2xl bg-white/5 border border-white/10">
              <h4 className="text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg font-medium text-white mb-1 xs:mb-2 sm:mb-2 md:mb-3">Current Plan Limits:</h4>
              <div className="space-y-1 xs:space-y-1.5 sm:space-y-1.5 md:space-y-2 text-xs xs:text-xs sm:text-sm md:text-sm lg:text-base">
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
          <div className="flex gap-2 xs:gap-3 sm:gap-3 md:gap-4 lg:gap-5 pt-2 xs:pt-3 sm:pt-4 md:pt-5 lg:pt-6">
            <button
              onClick={handleUpgrade}
              className="flex-1 flex items-center justify-center gap-1 xs:gap-2 sm:gap-2 md:gap-3 px-2 xs:px-3 sm:px-4 md:px-5 lg:px-6 py-1.5 xs:py-2 sm:py-2.5 md:py-3 lg:py-4 rounded-md xs:rounded-lg sm:rounded-lg md:rounded-xl lg:rounded-2xl text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-colors text-xs xs:text-sm sm:text-sm md:text-base lg:text-lg"
            >
              <span>View Plans</span>
            </button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 