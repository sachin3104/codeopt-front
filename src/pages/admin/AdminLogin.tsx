// src/pages/admin/AdminLogin.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLoginForm from '@/components/admin/AdminLoginForm';
import { checkAdminAuth } from '@/api/admin';
import type { AdminUser } from '@/types/admin';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  // DEBUG: Log component mount
  useEffect(() => {
    console.log('🔍 AdminLogin: Component mounted')
  }, [])

  // Check if admin is already logged in
  useEffect(() => {
    const checkExistingAuth = async () => {
      console.log('🔍 AdminLogin: Checking existing admin auth...')
      try {
        const response = await checkAdminAuth();
        console.log('🔍 AdminLogin: Admin auth check response:', response.data)
        
        if (response.data.authenticated && response.data.admin) {
          // Already logged in, redirect to dashboard
          console.log('✅ AdminLogin: Admin already authenticated, redirecting to dashboard')
          navigate('/admin/dashboard', { replace: true });
          return;
        } else {
          console.log('🔍 AdminLogin: Admin not authenticated, showing login form')
        }
      } catch (error) {
        // Not authenticated, stay on login page
        console.log('🔍 AdminLogin: Admin auth check failed (expected when not logged in):', error)
      } finally {
        setIsCheckingAuth(false);
      }
    };

    checkExistingAuth();
  }, [navigate]);

  // Handle successful login
  const handleLoginSuccess = (admin: AdminUser) => {
    console.log('✅ AdminLogin: Login successful:', admin);
    // Redirect to admin dashboard
    navigate('/admin/dashboard', { replace: true });
  };

  // Handle login error
  const handleLoginError = (error: string) => {
    console.error('❌ AdminLogin: Login error:', error);
    // Error is already handled in the form component
  };

  // Show loading while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span className="text-white/80 text-lg">Checking authentication...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,white_1px,transparent_0)] bg-[length:24px_24px]"></div>
      </div>
      
      {/* Main Content */}
      <div className="relative min-h-screen flex flex-col items-center justify-center p-4">
        
        {/* Header Section */}
        <div className="text-center mb-8">
          <h1 className="text-5xl sm:text-6xl font-bold bg-gradient-to-r from-white via-blue-100 to-blue-200 bg-clip-text text-transparent mb-4">
            optqo
          </h1>
          <p className="text-white/60 text-lg sm:text-xl">
            Administration Panel
          </p>
        </div>

        {/* Login Form */}
        <div className="w-full max-w-md">
          <AdminLoginForm
            onLoginSuccess={handleLoginSuccess}
            onLoginError={handleLoginError}
          />
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-white/40 text-sm">
            Secure admin access • Contact support if you need assistance
          </p>
          <p className="text-white/30 text-xs mt-2">
            &copy; {new Date().getFullYear()} optqo. All rights reserved.
          </p>
        </div>
      </div>

      {/* Decorative Elements */}
      <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl"></div>
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl"></div>
      <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/5 rounded-full blur-3xl"></div>
    </div>
  );
}