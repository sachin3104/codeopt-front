import React, { useState, FormEvent, useEffect } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Background } from '@/components/common/background'
import { Shield, ArrowLeft, AlertCircle, CheckCircle, RefreshCw } from 'lucide-react'
import { toast } from 'sonner'
import { getOtpErrorMessage } from '@/utils/errorHandlers'

export const OTPVerificationPage: React.FC = () => {
  const { verifySignupOtp, resendOtp } = useAuth()
  const { state } = useLocation() as { state: { purpose: 'registration' } }
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [resendCooldown, setResendCooldown] = useState(0)
  const navigate = useNavigate()

  // Check if user has pending OTP data, if not redirect to signup
  useEffect(() => {
    // If no state or purpose is not registration, redirect to signup
    if (!state || state.purpose !== 'registration') {
      toast.error('Please complete the signup process first.')
      navigate('/signup', { replace: true })
      return
    }
  }, [state, navigate])

  // Handle countdown timer for resend cooldown
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (resendCooldown > 0) {
      interval = setInterval(() => {
        setResendCooldown(prev => {
          if (prev <= 1) {
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => {
      if (interval) clearInterval(interval)
    }
  }, [resendCooldown])

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault()
    if (code.length < 6) return

    setIsVerifying(true)
    setError(null)
    
    try {
      await verifySignupOtp(code)
      toast.success('Email verified successfully! Welcome to CodeOpt!')
      navigate('/') // success - redirect to home
    } catch (err: unknown) {
      const userFriendlyError = getOtpErrorMessage(err)
      setError(userFriendlyError)
      toast.error(userFriendlyError)
    } finally {
      setIsVerifying(false)
    }
  }

  const handleResendOtp = async () => {
    setIsResending(true)
    try {
      await resendOtp()
      toast.success('New OTP sent to your email!')
      setResendCooldown(30) // Start 30-second cooldown
    } catch (err: unknown) {
      const userFriendlyError = getOtpErrorMessage(err)
      toast.error(userFriendlyError)
    } finally {
      setIsResending(false)
    }
  }

  const handleCodeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 6)
    setCode(value)
  }

  return (
    <div className="relative min-h-screen">
      {/* Background component */}
      <Background />
      
      {/* Content container */}
      <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          <Link 
            to="/signup"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-4 sm:mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm sm:text-base">Back to Sign Up</span>
          </Link>

          <div className="backdrop-blur-md bg-gradient-to-br from-black/60 via-black/50 to-black/40 border border-white/20 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-2xl">
            <div className="text-center mb-4 sm:mb-6">
              <div className="mx-auto w-12 h-12 sm:w-16 sm:h-16 bg-white/10 rounded-full flex items-center justify-center mb-3 sm:mb-4">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl font-bold text-white mb-1.5 sm:mb-2">Verify Your Email</h2>
              <p className="text-white/60 text-xs sm:text-sm">
                We've sent a 6-digit code to your email address. Please enter it below to complete your registration.
              </p>
            </div>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 flex items-center gap-2 text-red-400">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm">{error}</span>
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-4 sm:space-y-6">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-white/80 mb-2 sm:mb-3 text-center">
                  Enter 6-digit code
                </label>
                <div className="flex justify-center">
                  <input
                    type="text"
                    maxLength={6}
                    value={code}
                    onChange={handleCodeChange}
                    className="w-40 sm:w-48 text-center text-xl sm:text-2xl font-mono bg-white/5 border border-white/10 rounded-lg py-3 sm:py-4 px-4 sm:px-6 text-white placeholder-white/40 focus:outline-none focus:border-white/20 transition-colors tracking-widest"
                    placeholder="000000"
                    required
                    autoFocus
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={code.length < 6 || isVerifying}
                className="w-full bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:cursor-not-allowed border border-white/20 rounded-lg p-2.5 sm:p-3 flex items-center justify-center gap-2 text-white transition-all duration-300 text-sm sm:text-base"
              >
                {isVerifying ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-b-2 border-white"></div>
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                    <span>Verify & Complete Sign Up</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-white/60">
              <p>Didn't receive the code?</p>
              <button 
                type="button"
                disabled={resendCooldown > 0 || isResending}
                className={`text-white hover:text-white/80 transition-colors underline disabled:text-white/40 disabled:cursor-not-allowed flex items-center justify-center gap-1 mx-auto mt-1`}
                onClick={handleResendOtp}
              >
                {isResending ? (
                  <>
                    <RefreshCw className="h-3 w-3 animate-spin" />
                    <span>Resending...</span>
                  </>
                ) : resendCooldown > 0 ? (
                  <span>Resend code in {resendCooldown}s</span>
                ) : (
                  <span>Resend code</span>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OTPVerificationPage 