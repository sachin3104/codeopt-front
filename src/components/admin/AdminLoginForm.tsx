// src/components/admin/AdminLoginForm.tsx
import React, { useState, useCallback } from 'react';
import { Eye, EyeOff, Lock, User, AlertCircle } from 'lucide-react';
import { adminLogin } from '@/api/admin';
import type { AdminLoginFormData } from '@/types/admin';

interface AdminLoginFormProps {
  onLoginSuccess: (admin: any) => void;
  onLoginError?: (error: string) => void;
}

export default function AdminLoginForm({ onLoginSuccess, onLoginError }: AdminLoginFormProps) {
  const [formData, setFormData] = useState<AdminLoginFormData>({
    username: '',
    password: '',
  });
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string;
    password?: string;
  }>({});

  // Handle input changes with useCallback to prevent unnecessary re-renders
  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    // Ensure we're working with the correct field names
    if (name !== 'username' && name !== 'password') {
      // Unexpected field name
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name as keyof typeof fieldErrors]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: undefined,
      }));
    }
    
    // Clear general error when user starts typing
    if (error) {
      setError(null);
    }
  }, [fieldErrors, error]);

  // Toggle password visibility
  const togglePasswordVisibility = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  // Validate form fields
  const validateForm = useCallback((): boolean => {
    const errors: typeof fieldErrors = {};
    
    if (!formData.username.trim()) {
      errors.username = 'Username is required';
    }
    
    if (!formData.password.trim()) {
      errors.password = 'Password is required';
    }
    
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }, [formData.username, formData.password]);

  // Handle form submission
  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await adminLogin(formData.username, formData.password);
      
      if (response.data.status === 'success') {
        onLoginSuccess(response.data.admin);
      } else {
        const errorMessage = response.data.message || 'Login failed';
        setError(errorMessage);
        onLoginError?.(errorMessage);
      }
    } catch (err: any) {
      let errorMessage = 'An unexpected error occurred';
      
      if (err.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err.message) {
        errorMessage = err.message;
      }
      
      setError(errorMessage);
      onLoginError?.(errorMessage);
    } finally {
      setIsLoading(false);
    }
  }, [formData.username, formData.password, validateForm, onLoginSuccess, onLoginError]);

  return (
    <div className="w-full max-w-md mx-auto">
      {/* Form Container with Glassmorphism */}
      <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl p-8 shadow-2xl relative z-10">
        
        {/* Header */}
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent mb-2">
            Admin Login
          </h2>
          <p className="text-white/70 text-sm">
            Access the administration panel
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 rounded-lg bg-red-500/20 border border-red-500/30 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
              <p className="text-red-200 text-sm">{error}</p>
            </div>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-6" autoComplete="on" noValidate>
          
          {/* Username Field */}
          <div className="relative">
            <label htmlFor="admin-username" className="block text-white/80 text-sm font-medium mb-2">
              Username
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <User size={18} className="text-white/50" />
              </div>
              <input
                type="text"
                id="admin-username"
                name="username"
                value={formData.username}
                onChange={handleInputChange}
                autoComplete="username"
                tabIndex={1}
                className={`
                  w-full pl-10 pr-4 py-3 
                  bg-white/10 backdrop-blur-sm
                  border-2 ${fieldErrors.username ? 'border-red-500/50' : 'border-white/20'} 
                  rounded-lg 
                  text-white placeholder:text-white/50 
                  focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                  hover:border-white/30
                  transition-all duration-200
                  relative z-20
                  ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-text'}
                `}
                placeholder="Enter your username"
                disabled={isLoading}
                spellCheck={false}
                autoCapitalize="none"
                autoCorrect="off"
              />
            </div>
            {fieldErrors.username && (
              <p className="mt-1 text-red-400 text-xs" role="alert">{fieldErrors.username}</p>
            )}
          </div>

          {/* Password Field */}
          <div className="relative">
            <label htmlFor="admin-password" className="block text-white/80 text-sm font-medium mb-2">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none z-10">
                <Lock size={18} className="text-white/50" />
              </div>
              <input
                type={showPassword ? 'text' : 'password'}
                id="admin-password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                autoComplete="current-password"
                tabIndex={2}
                className={`
                  w-full pl-10 pr-12 py-3 
                  bg-white/10 backdrop-blur-sm
                  border-2 ${fieldErrors.password ? 'border-red-500/50' : 'border-white/20'} 
                  rounded-lg 
                  text-white placeholder:text-white/50 
                  focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50
                  hover:border-white/30
                  transition-all duration-200
                  relative z-20
                  ${isLoading ? 'cursor-not-allowed opacity-50' : 'cursor-text'}
                `}
                placeholder="Enter your password"
                disabled={isLoading}
                spellCheck={false}
                autoCapitalize="none"
                autoCorrect="off"
              />
              <button
                type="button"
                onClick={togglePasswordVisibility}
                tabIndex={3}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-white/50 hover:text-white/80 transition-colors z-30 focus:outline-none focus:text-white/80"
                disabled={isLoading}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {fieldErrors.password && (
              <p className="mt-1 text-red-400 text-xs" role="alert">{fieldErrors.password}</p>
            )}
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading || !formData.username.trim() || !formData.password.trim()}
            tabIndex={4}
            className={`
              w-full py-3 px-4 
              bg-gradient-to-r from-blue-600 to-blue-700 
              hover:from-blue-500 hover:to-blue-600 
              disabled:from-gray-600 disabled:to-gray-700 
              disabled:opacity-50
              text-white font-medium 
              rounded-lg 
              transition-all duration-300 
              transform hover:scale-[1.02] disabled:scale-100
              focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:ring-offset-2 focus:ring-offset-transparent
              shadow-lg hover:shadow-xl
              ${isLoading ? 'cursor-not-allowed' : 'cursor-pointer'}
              relative z-20
            `}
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                <span>Signing in...</span>
              </div>
            ) : (
              'Sign In'
            )}
          </button>
        </form>

        {/* Test Credentials Info */}
        <div className="mt-6 p-4 rounded-lg bg-blue-500/10 border border-blue-500/20">
          <p className="text-blue-200 text-xs text-center">
            <strong>Test:</strong> Use the credentials you created with the super admin script
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 pt-6 border-t border-white/20">
          <p className="text-center text-white/60 text-xs">
            Secure admin access • Contact support if you need assistance
          </p>
        </div>
      </div>
    </div>
  );
}