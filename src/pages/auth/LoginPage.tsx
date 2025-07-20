import React, { useState, FormEvent } from 'react';
import { useAuth } from '@/hooks/use-auth';
import { useNavigate, Link } from 'react-router-dom';
import { LogIn, User, Lock, AlertCircle, ArrowLeft, Loader2 } from 'lucide-react';
import {IconBrandGoogle} from '@tabler/icons-react';
import { Background } from '@/components/common/background';
import { useValidation } from '@/hooks/useValidation';
import { getLoginErrorMessage } from '@/utils/errorHandlers';

const LoginPage: React.FC = () => {
  const { login, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const { errors, validatePassword } = useValidation();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    
    // Validate password before submission
    const passwordError = validatePassword(password);
    if (passwordError) {
      return; // Don't submit if there is a password error
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      await login({ username, password });
      navigate('/'); // protected home
    } catch (err: unknown) {
      const userFriendlyError = getLoginErrorMessage(err);
      setError(userFriendlyError);
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsGoogleLoading(true);
    setError(null);
    
    try {
      await loginWithGoogle();
    } catch (err: unknown) {
      const userFriendlyError = getLoginErrorMessage(err);
      setError(userFriendlyError);
    } finally {
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background component */}
      <Background />
      
      {/* Content container */}
      <div className="relative min-h-screen flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-4 sm:mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span className="text-sm sm:text-base">Back to Home</span>
          </Link>

          <div className="backdrop-blur-md bg-gradient-to-br from-black/60 via-black/50 to-black/40 border border-white/20 rounded-xl sm:rounded-2xl p-6 sm:p-8 shadow-2xl">
            <h2 className="text-xl sm:text-2xl font-bold text-white mb-4 sm:mb-6 flex items-center justify-center gap-2">
              <LogIn className="h-5 w-5 sm:h-6 sm:w-6" />
              <span>Log In</span>
            </h2>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 sm:p-4 mb-4 sm:mb-6 flex items-center gap-2 text-red-400">
                <AlertCircle className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="text-xs sm:text-sm">{error}</span>
              </div>
            )}

            <button 
              type="button" 
              className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg p-2.5 sm:p-3 mb-2 flex items-center justify-center gap-2 text-white transition-all duration-300 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleGoogleLogin}
              disabled={isGoogleLoading || isLoading}
            >
              {isGoogleLoading ? (
                <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
              ) : (
                <IconBrandGoogle className="h-4 w-4 sm:h-5 sm:w-5" />
              )}
              <span>{isGoogleLoading ? 'Connecting...' : 'Continue with Google'}</span>
            </button>
            
            <div className="text-xs text-white/60 text-center mb-4 sm:mb-6">
              By continuing with Google, you accept our{' '}
              <Link to="/terms" className="text-white hover:text-white/80 transition-colors underline">
                Terms of Service
              </Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-white hover:text-white/80 transition-colors underline">
                Privacy Policy
              </Link>
            </div>

            <div className="relative flex items-center justify-center mb-4 sm:mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative px-3 sm:px-4 text-xs sm:text-sm text-white/50">or continue with email</div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-white/80 mb-1.5 sm:mb-2">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-white/50" />
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 sm:py-3 pl-9 sm:pl-10 pr-3 sm:pr-4 text-white placeholder-white/40 focus:outline-none focus:border-white/20 transition-colors text-sm sm:text-base"
                    placeholder="Enter your username"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-xs sm:text-sm font-medium text-white/80 mb-1.5 sm:mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 sm:h-5 sm:w-5 text-white/50" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => {
                      setPassword(e.target.value);
                    }}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-2.5 sm:py-3 pl-9 sm:pl-10 pr-3 sm:pr-4 text-white placeholder-white/40 focus:outline-none focus:border-white/20 transition-colors text-sm sm:text-base"
                    placeholder="Enter your password"
                    required
                  />
                </div>
                {errors.password && (
                  <p className="text-red-400 text-xs sm:text-sm mt-1 flex items-center gap-1">
                    <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                    {errors.password}
                  </p>
                )}
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg p-2.5 sm:p-3 flex items-center justify-center gap-2 text-white transition-all duration-300 text-sm sm:text-base disabled:opacity-50 disabled:cursor-not-allowed"
                disabled={isLoading || isGoogleLoading}
              >
                {isLoading ? (
                  <Loader2 className="h-4 w-4 sm:h-5 sm:w-5 animate-spin" />
                ) : (
                  <LogIn className="h-4 w-4 sm:h-5 sm:w-5" />
                )}
                <span>{isLoading ? 'Logging In...' : 'Log In'}</span>
              </button>
            </form>

            <div className="mt-4 sm:mt-6 text-center text-xs sm:text-sm text-white/60">
              Don't have an account?{' '}
              <Link to="/signup" className="text-white hover:text-white/80 transition-colors">
                Sign up
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;