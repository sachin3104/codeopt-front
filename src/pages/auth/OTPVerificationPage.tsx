import React, { useState, FormEvent } from 'react'
import { useLocation, useNavigate, Link } from 'react-router-dom'
import { useAuth } from '@/hooks/use-auth'
import { Background } from '@/components/common/background'
import { Shield, ArrowLeft, AlertCircle, CheckCircle } from 'lucide-react'

export const OTPVerificationPage: React.FC = () => {
  const { verifySignupOtp } = useAuth()
  const { state } = useLocation() as { state: { purpose: 'registration' } }
  const [code, setCode] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [isVerifying, setIsVerifying] = useState(false)
  const navigate = useNavigate()

  const handleVerify = async (e: FormEvent) => {
    e.preventDefault()
    if (code.length < 6) return

    setIsVerifying(true)
    setError(null)
    
    try {
      await verifySignupOtp(code)
      navigate('/') // success - redirect to home
    } catch (err: any) {
      setError(err.message || 'OTP verification failed')
    } finally {
      setIsVerifying(false)
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
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Link 
            to="/signup"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Sign Up</span>
          </Link>

          <div className="backdrop-blur-md bg-gradient-to-br from-black/60 via-black/50 to-black/40 border border-white/20 rounded-2xl p-8 shadow-2xl">
            <div className="text-center mb-6">
              <div className="mx-auto w-16 h-16 bg-white/10 rounded-full flex items-center justify-center mb-4">
                <Shield className="h-8 w-8 text-white" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">Verify Your Email</h2>
              <p className="text-white/60 text-sm">
                We've sent a 6-digit code to your email address. Please enter it below to complete your registration.
              </p>
            </div>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 flex items-center gap-2 text-red-400">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}

            <form onSubmit={handleVerify} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-3 text-center">
                  Enter 6-digit code
                </label>
                <div className="flex justify-center">
                  <input
                    type="text"
                    maxLength={6}
                    value={code}
                    onChange={handleCodeChange}
                    className="w-48 text-center text-2xl font-mono bg-white/5 border border-white/10 rounded-lg py-4 px-6 text-white placeholder-white/40 focus:outline-none focus:border-white/20 transition-colors tracking-widest"
                    placeholder="000000"
                    required
                    autoFocus
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={code.length < 6 || isVerifying}
                className="w-full bg-white/10 hover:bg-white/20 disabled:bg-white/5 disabled:cursor-not-allowed border border-white/20 rounded-lg p-3 flex items-center justify-center gap-2 text-white transition-all duration-300"
              >
                {isVerifying ? (
                  <>
                    <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                    <span>Verifying...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5" />
                    <span>Verify & Complete Sign Up</span>
                  </>
                )}
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-white/60">
              <p>Didn't receive the code?</p>
              <button 
                type="button"
                className="text-white hover:text-white/80 transition-colors underline"
                onClick={() => {
                  // TODO: Implement resend OTP functionality
                  alert('Resend functionality will be implemented')
                }}
              >
                Resend code
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OTPVerificationPage 