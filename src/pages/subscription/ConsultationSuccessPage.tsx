import React, { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { useSubscription } from '@/hooks/use-subscription'
import { CheckCircle, AlertCircle, ArrowLeft, Loader2, Calendar, Clock, User } from 'lucide-react'
import { Background } from '@/components/common/background'

const ConsultationSuccessPage: React.FC = () => {
  const { fetchConsultationBookings } = useSubscription()
  const location = useLocation()
  const navigate = useNavigate()
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [bookingDetails, setBookingDetails] = useState<any>(null)

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
        // Fetch the latest consultation bookings to get the updated status
        await fetchConsultationBookings(1, 5)
        toast.success("🎉 Your consultation has been booked successfully!")
        
        // Show success message for a few seconds before redirecting
        setTimeout(() => {
          navigate('/', { replace: true })
        }, 5000)
      } catch (err: any) {
        setError(err.response?.data?.message || err.message || 'Failed to verify consultation booking.')
      } finally {
        setLoading(false)
      }
    })()
  }, [location.search, fetchConsultationBookings, navigate])

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const formatDuration = (duration: string) => {
    switch (duration) {
      case 'half_hour':
        return '30 Minutes'
      case 'one_hour':
        return '60 Minutes'
      default:
        return 'Unknown Duration'
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Background />
      <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl p-8 max-w-md w-full">
        {loading && (
          <div className="text-center space-y-4">
            <div className="flex justify-center">
              <Loader2 className="w-12 h-12 text-purple-400 animate-spin" />
            </div>
            <div className="space-y-2">
              <h2 className="text-xl font-semibold text-white">Confirming Your Consultation</h2>
              <p className="text-white/70 text-sm">Please wait while we verify your booking...</p>
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
              <h2 className="text-2xl font-semibold text-white">Consultation Booked Successfully!</h2>
              <p className="text-white/70 text-sm">
                Your consultation has been confirmed and payment processed. We'll send you a confirmation email with meeting details.
              </p>
              
              {/* Booking Summary */}
              <div className="bg-purple-500/10 p-4 rounded-lg border border-purple-500/20 space-y-3">
                <h3 className="text-purple-400 font-medium text-sm">Booking Summary</h3>
                <div className="space-y-2 text-left">
                  <div className="flex items-center space-x-2 text-white/80 text-sm">
                    <Clock className="w-4 h-4 text-purple-400" />
                    <span>Duration: {formatDuration('half_hour')}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-white/80 text-sm">
                    <Calendar className="w-4 h-4 text-purple-400" />
                    <span>Date: To be confirmed</span>
                  </div>
                  <div className="flex items-center space-x-2 text-white/80 text-sm">
                    <User className="w-4 h-4 text-purple-400" />
                    <span>Expert consultation session</span>
                  </div>
                </div>
              </div>
              
              <p className="text-white/60 text-xs">
                Redirecting to dashboard in 5 seconds...
              </p>
            </div>
            
            <button
              onClick={() => navigate('/')}
              className="flex items-center space-x-2 px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-all duration-200 border border-purple-500/30 hover:border-purple-500/50 backdrop-blur-md"
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
              <h2 className="text-xl font-semibold text-white">Booking Verification Failed</h2>
              <p className="text-red-400 text-sm bg-red-500/10 p-3 rounded-lg border border-red-500/20">
                {error}
              </p>
              <p className="text-white/70 text-sm">
                Don't worry! If your payment was successful, your consultation is likely still booked. 
                Check your email for confirmation or contact support.
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
                className="flex items-center space-x-2 px-6 py-3 bg-purple-500/20 hover:bg-purple-500/30 text-purple-400 rounded-lg transition-all duration-200 border border-purple-500/30 hover:border-purple-500/50 w-full justify-center backdrop-blur-md"
              >
                <User className="w-4 h-4" />
                <span>Check My Bookings</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ConsultationSuccessPage 