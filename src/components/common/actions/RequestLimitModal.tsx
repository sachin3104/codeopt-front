import React from 'react'
import { AlertTriangle, Zap, Crown, Star, Mail, Calendar, RefreshCw } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useRemainingRequests } from '@/hooks/use-remaining-requests'
import { useSubscription } from '@/hooks/use-subscription'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'

// Define PlanType enum locally since it's only used for fallback
enum PlanType {
  FREE = 'optqo_free',
  DEVELOPER = 'optqo_pro',
  PROFESSIONAL = 'optqo_ultimate',
}

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

  const getPlanIcon = (plan: PlanType) => {
    switch (plan) {
      case PlanType.FREE:
        return <Star className="w-4 h-4" />
      case PlanType.DEVELOPER:
        return <Zap className="w-4 h-4" />
      case PlanType.PROFESSIONAL:
        return <Crown className="w-4 h-4" />
      default:
        return <Star className="w-4 h-4" />
    }
  }

  const getPlanColor = (plan: PlanType) => {
    switch (plan) {
      case PlanType.FREE:
        return 'text-gray-400'
      case PlanType.DEVELOPER:
        return 'text-blue-400'
      case PlanType.PROFESSIONAL:
        return 'text-purple-400'
      default:
        return 'text-gray-400'
    }
  }

  const getActionTypeInfo = () => {
    if (!subscription?.plan) return null;
    
    switch (subscription.plan.action_type) {
      case 'subscribe':
        return {
          label: 'Subscription Plan',
          icon: subscription.plan.plan_type === 'optqo_free' ? <Star className="w-4 h-4" /> : <Crown className="w-4 h-4" />,
          color: subscription.plan.plan_type === 'optqo_free' ? 'text-gray-400' : 'text-yellow-400'
        };
      case 'email_contact':
        return {
          label: 'Contact Required',
          icon: <Mail className="w-4 h-4" />,
          color: 'text-blue-400'
        };
      case 'book_consultation':
        return {
          label: 'Consultation Required',
          icon: <Calendar className="w-4 h-4" />,
          color: 'text-purple-400'
        };
      default:
        return {
          label: 'Plan',
          icon: <Star className="w-4 h-4" />,
          color: 'text-gray-400'
        };
    }
  };

  const actionTypeInfo = getActionTypeInfo();
  const periodText = periodType === 'daily' ? 'today' : 'this month';
  const resetText = periodType === 'daily' ? 'tomorrow' : 'next month';

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md bg-gradient-to-br from-black/90 via-black/80 to-black/90 border border-white/20 backdrop-blur-xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-white">
            <AlertTriangle className="w-5 h-5 text-red-400" />
            Request Limit Reached
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Current Plan Message */}
          <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20">
            <div className="flex items-center gap-2 mb-3">
              {actionTypeInfo ? (
                <>
                  <span className={actionTypeInfo.color}>
                    {actionTypeInfo.icon}
                  </span>
                  <span className="text-sm font-medium text-white capitalize">
                    {subscription?.plan?.name} Plan
                  </span>
                  <span className="text-xs text-white/60">({actionTypeInfo.label})</span>
                </>
              ) : (
                <>
                  <span className={getPlanColor(PlanType.FREE)}>
                    {getPlanIcon(PlanType.FREE)}
                  </span>
                  <span className="text-sm font-medium text-white capitalize">
                    Free Plan
                  </span>
                </>
              )}
            </div>
            
            {subscription?.plan ? (
              <>
                <p className="text-sm text-white/90 mb-2">
                  You have used all <span className="font-semibold text-blue-400">{totalRequests}</span> {periodType} requests 
                  allowed on your <span className="font-semibold">{subscription.plan.name}</span> plan.
                </p>
                <p className="text-sm text-red-300">
                  Your requests will reset <span className="font-semibold">{resetText}</span>.
                </p>
                
                {/* Show plan description if available */}
                {subscription.plan.description && (
                  <p className="text-xs text-white/70 mt-2">
                    {subscription.plan.description}
                  </p>
                )}
              </>
            ) : (
              <>
                <p className="text-sm text-white/90 mb-2">
                  You have used all <span className="font-semibold text-blue-400">{totalRequests}</span> {periodType} requests 
                  allowed on your current plan.
                </p>
                <p className="text-sm text-red-300">
                  Your requests will reset <span className="font-semibold">{resetText}</span>.
                </p>
              </>
            )}
          </div>

          {/* Usage Summary */}
          <div className="p-3 rounded-lg bg-white/5 border border-white/10">
            <h4 className="text-sm font-medium text-white mb-2">Current Usage:</h4>
            <div className="space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-white/70">Used {periodText}:</span>
                <span className="text-white">
                  {usedRequests} / {totalRequests || 'Unlimited'}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Remaining:</span>
                <span className="text-red-400 font-medium">
                  {remainingRequests || 0}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/70">Reset:</span>
                <span className="text-white">
                  {resetText}
                </span>
              </div>
            </div>
          </div>

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
              <Crown className="w-5 h-5" />
              <span>Upgrade Plan</span>
            </button>
          </div>

          {/* Reset Info */}
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 text-xs text-white/60">
              <RefreshCw className="w-3 h-3" />
              <span>Requests reset {resetText}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 