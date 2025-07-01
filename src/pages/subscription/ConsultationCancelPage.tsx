import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { XCircle, ArrowLeft, RefreshCw, Calendar, Clock } from 'lucide-react'
import { Background } from '@/components/common/background'

const ConsultationCancelPage: React.FC = () => {
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
    <div className="min-h-screen flex items-center justify-center p-4">
      <Background />
      <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl p-8 max-w-md w-full">
        <div className="text-center space-y-6">
          <div className="flex justify-center">
            <div className="w-16 h-16 rounded-full bg-orange-500/20 flex items-center justify-center border border-orange-500/30">
              <XCircle className="w-8 h-8 text-orange-400" />
            </div>
          </div>
          
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold text-white">Payment Cancelled</h2>
            <p className="text-white/70 text-sm">
              You cancelled the consultation booking payment. No charges were made to your account.
            </p>
            
            {/* Session Info */}
            {sessionId && (
              <div className="bg-orange-500/10 p-4 rounded-lg border border-orange-500/20 space-y-3">
                <h3 className="text-orange-400 font-medium text-sm">Session Information</h3>
                <div className="space-y-2 text-left">
                  <div className="flex items-center space-x-2 text-white/80 text-sm">
                    <Clock className="w-4 h-4 text-orange-400" />
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
              You can book your consultation again anytime. Your expert consultation session is still available.
            </p>
          </div>
          
          <div className="space-y-3">
            <button
              onClick={handleTryAgain}
              className="flex items-center space-x-2 px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-all duration-200 border border-purple-500/30 hover:border-purple-500/50 w-full justify-center backdrop-blur-md"
            >
              <RefreshCw className="w-4 h-4" />
              <span>Try Again</span>
            </button>
            
            <button
              onClick={handleGoHome}
              className="flex items-center space-x-2 px-6 py-3 bg-white/10 hover:bg-white/20 text-white rounded-lg transition-all duration-200 border border-white/20 hover:border-white/30 w-full justify-center backdrop-blur-md"
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
                href="mailto:support@optqo.ai" 
                className="text-purple-400 hover:text-purple-300 underline"
              >
                support@optqo.ai
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}

export default ConsultationCancelPage 