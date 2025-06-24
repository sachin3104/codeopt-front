// src/pages/subscription/SubscriptionSuccessPage.tsx
import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useSubscription } from '@/hooks/use-subscription'
import { CheckCircle, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react'

const SubscriptionSuccessPage: React.FC = () => {
  const { refresh } = useSubscription()
  const location = useLocation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

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
        navigate('/subscription', { replace: true })
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Failed to update subscription.')
      } finally {
        setLoading(false)
      }
    })()
  }, [location.search, refresh, navigate])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl p-8 max-w-md w-full mx-4">
        {loading && (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Loader2 className="w-12 h-12 text-blue-400 animate-spin" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-white">Updating Your Subscription</h2>
              <p className="text-white/70 text-sm">Please wait while we activate your new plan...</p>
            </div>
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
              <h2 className="text-xl font-semibold text-white">Subscription Update Failed</h2>
              <p className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                {error}
              </p>
            </div>
            <button
              onClick={() => navigate('/subscription')}
              className="flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 border border-white/20 hover:border-white/30"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Plans</span>
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default SubscriptionSuccessPage
