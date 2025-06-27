import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { XCircle, ArrowLeft, RefreshCw, CreditCard, Calendar } from 'lucide-react'

const SubscriptionCancelPage: React.FC = () => {
  const location = useLocation()
  const navigate = useNavigate()
  const [sessionId, setSessionId] = useState<string | null>(null)

  useEffect(() => {
    const params = new URLSearchParams(location.search)
    const sid = params.get('session_id')
    setSessionId(sid)
    
    if (sid) {
      toast.info("Payment was cancelled. You can try again anytime.")
    }
  }, [location.search])

  const handleTryAgain = () => {
    navigate('/subscription', { replace: true })
  }

  const handleGoHome = () => {
    navigate('/', { replace: true })
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl p-8 max-w-md w-full mx-4">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
              <XCircle className="w-8 h-8 text-orange-400" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Payment Cancelled</h2>
            <p className="text-white/70 text-sm">
              You cancelled the subscription payment. No charges were made to your account.
            </p>
            
            {/* Session Info */}
            {sessionId && (
              <div className="bg-orange-500/10 p-4 rounded-lg border border-orange-500/20 space-y-3">
                <h3 className="text-orange-400 font-medium text-sm">Session Information</h3>
                <div className="space-y-2 text-left">
                  <div className="flex items-center space-x-2 text-white/80 text-sm">
                    <CreditCard className="w-4 h-4 text-orange-400" />
                    <span>Session ID: {sessionId.substring(0, 20)}...</span>
                  </div>
                  <div className="flex items-center space-x-2 text-white/80 text-sm">
                    <Calendar className="w-4 h-4 text-orange-400" />
                    <span>Status: Cancelled</span>
                  </div>
                </div>
              </div>
            )}
            
            <p className="text-white/60 text-sm">
              You can upgrade your subscription again anytime. All premium features are still available for upgrade.
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={handleTryAgain}
              className="flex items-center space-x-2 px-6 py-3 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-lg transition-all duration-200 border border-blue-500/30 hover:border-blue-500/50 w-full justify-center"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
            
            <button
              onClick={handleGoHome}
              className="flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 border border-white/20 hover:border-white/30 w-full justify-center"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back to Home</span>
            </button>
          </div>
          
          {/* Additional Help */}
          <div className="pt-4 border-t border-white/10">
            <p className="text-white/50 text-xs">
              Need help? Contact us at{' '}
              <a 
                href="mailto:contact@codeopt.com" 
                className="text-blue-400 hover:text-blue-300 underline"
              >
                contact@codeopt.com
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SubscriptionCancelPage 