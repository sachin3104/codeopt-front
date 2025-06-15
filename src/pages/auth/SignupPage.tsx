// File: src/pages/SignupPage.tsx
// Updated with glassmorphic UI design

import React, { useState, FormEvent } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { UserPlus, User, Lock, Mail, AlertCircle, ArrowLeft } from 'lucide-react';
import { IconBrandGoogle } from '@tabler/icons-react';
import { Background } from '@/components/background/background';

const SignupPage: React.FC = () => {
  const { signup, loginWithGoogle } = useAuth();
  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await signup(username, email, password);
      navigate('/'); // protected home
    } catch (err: any) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background component */}
      <Background />
      
      {/* Content container */}
      <div className="relative min-h-screen flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <Link 
            to="/"
            className="inline-flex items-center gap-2 text-white/60 hover:text-white mb-6 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            <span>Back to Home</span>
          </Link>

          <div className="backdrop-blur-md bg-gradient-to-br from-black/60 via-black/50 to-black/40 border border-white/20 rounded-2xl p-8 shadow-2xl">
            <h2 className="text-2xl font-bold text-white mb-6 flex items-center justify-center gap-2">
              <UserPlus className="h-6 w-6" />
              <span>Sign Up</span>
            </h2>
            
            {error && (
              <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-4 mb-6 flex items-center gap-2 text-red-400">
                <AlertCircle className="h-5 w-5" />
                <span>{error}</span>
              </div>
            )}

            <button 
              type="button" 
              className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg p-3 mb-6 flex items-center justify-center gap-2 text-white transition-all duration-300"
              onClick={loginWithGoogle}
            >
              <IconBrandGoogle className="h-5 w-5" />
              <span>Continue with Google</span>
            </button>

            <div className="relative flex items-center justify-center mb-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-white/10"></div>
              </div>
              <div className="relative px-4 text-sm text-white/50">or continue with email</div>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Username</label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                  <input
                    type="text"
                    value={username}
                    onChange={e => setUsername(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-white/20 transition-colors"
                    placeholder="Choose a username"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                  <input
                    type="email"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-white/20 transition-colors"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-white/80 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-white/50" />
                  <input
                    type="password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-lg py-3 pl-10 pr-4 text-white placeholder-white/40 focus:outline-none focus:border-white/20 transition-colors"
                    placeholder="Create a password"
                    required
                  />
                </div>
              </div>
              
              <button 
                type="submit" 
                className="w-full bg-white/10 hover:bg-white/20 border border-white/20 rounded-lg p-3 flex items-center justify-center gap-2 text-white transition-all duration-300"
              >
                <UserPlus className="h-5 w-5" />
                <span>Sign Up</span>
              </button>
            </form>

            <div className="mt-6 text-center text-sm text-white/60">
              Already have an account?{' '}
              <Link to="/login" className="text-white hover:text-white/80 transition-colors">
                Log in
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;