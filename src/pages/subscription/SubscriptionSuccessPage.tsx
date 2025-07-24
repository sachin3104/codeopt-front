// src/pages/subscription/SubscriptionSuccessPage.tsx
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useSubscription } from '@/hooks/use-subscription'
import { CheckCircle, AlertCircle, ArrowLeft, Loader2, Calendar, CreditCard, Zap } from 'lucide-react'
import { Background } from '@/components/common/background'

const SubscriptionSuccessPage: React.FC = () => {
  const { subscription, refresh } = useSubscription()
  const location = useLocation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [subscriptionDetails, setSubscriptionDetails] = useState<any>(null)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const sessionId = params.get('session_id')

    if (!sessionId) {
      setError('Missing session_id in URL.')
      setLoading(false)
      return
    }

    ;(async () => {
      try {
        await refresh()
        toast.success("🎉 Your subscription is now active!")
        
        // Show success message for a few seconds before redirecting
        setTimeout(() => {
          navigate('/', { replace: true })
        }, 5000)
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Failed to update subscription.')
      } finally {
        setLoading(false)
      }
    })()
  }, [location.search, refresh, navigate])

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'N/A'
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const getPlanDisplayName = (planType: string) => {
    switch (planType) {
      case 'PRO':
        return 'OPTQO Pro'
      case 'ULTIMATE':
        return 'OPTQO Ultimate'
      case 'ENTERPRISE':
        return 'OPTQO Enterprise'
      case 'CALL_WITH_EXPERT':
        return 'OPTQO Expert'
      default:
        return planType
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Background />
      <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl p-8 max-w-md w-full">
        {loading && (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-white">Activating Your Subscription</h2>
              <p className="text-white/70 text-sm">Please wait while we activate your new plan...</p>
            </div>
          </div>
        )}
        
        {!loading && !error && (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-16 h-16 rounded-full bg-green-500/20 flex items-center justify-center border border-green-500/30">
                <CheckCircle className="w-8 h-8 text-green-400" />
              </div>
            </div>
            <div className="space-y-4">
              <h2 className="text-2xl font-semibold text-white">Subscription Activated Successfully!</h2>
              <p className="text-white/70 text-sm">
                Your subscription has been activated and payment processed. You now have access to all premium features.
              </p>
              
              {/* Subscription Summary */}
              {subscription && (
                <div className="bg-blue-500/10 p-4 rounded-lg border border-blue-500/20 space-y-3">
                  <h3 className="text-blue-400 font-medium text-sm">Subscription Details</h3>
                  <div className="space-y-2 text-left">
                    <div className="flex items-center space-x-2 text-white/80 text-sm">
                      <Zap className="w-4 h-4 text-blue-400" />
                      <span>Plan: {getPlanDisplayName(subscription.plan.plan_type)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-white/80 text-sm">
                      <Calendar className="w-4 h-4 text-blue-400" />
                      <span>Next Billing: {formatDate(subscription.current_period_end)}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-white/80 text-sm">
                      <CreditCard className="w-4 h-4 text-blue-400" />
                      <span>Status: {subscription.status.charAt(0).toUpperCase() + subscription.status.slice(1)}</span>
                    </div>
                  </div>
                </div>
              )}
              
              <p className="text-white/60 text-xs">
                Redirecting to dashboard in 5 seconds...
              </p>
            </div>
            
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all duration-200 border border-blue-500/30 hover:border-blue-500/50 backdrop-blur-md"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Go to Dashboard</span>
            </button>
          </div>
        )}
        
        {error && (
          <div className="text-center space-y-6">
            <div className="flex justify-center">
              <div className="w-12 h-12 rounded-full bg-red-500/20 flex items-center justify-center border border-red-500/30">
                <AlertCircle className="w-6 h-6 text-red-400" />
              </div>
            </div>
            <div className="space-y-3">
              <h2 className="text-xl font-semibold text-white">Subscription Activation Failed</h2>
              <p className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                {error}
              </p>
              <p className="text-white/70 text-sm">
                Don't worry! If your payment was successful, your subscription is likely still active. 
                Check your dashboard or contact support for assistance.
              </p>
            </div>
            <div className="space-y-3">
              <button
                onClick={() => navigate('/subscription')}
                className="flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 border border-white/20 hover:border-white/30 w-full justify-center backdrop-blur-md"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>Back to Plans</span>
              </button>
              <button
                onClick={() => navigate('/')}
                className="flex items-center space-x-2 px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all duration-200 border border-blue-500/30 hover:border-blue-500/50 w-full justify-center backdrop-blur-md"
              >
                <CreditCard className="w-4 h-4" />
                <span>Check My Subscription</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default SubscriptionSuccessPage
