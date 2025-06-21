// File: src/context/AppProvider.tsx
import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthProvider, useIsAuthenticated, useAuthLoading } from './AuthContext';
import { SubscriptionProvider } from './SubscriptionContext';

// Define which routes are public (don't need auth)
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/auth/success',
  '/admin/login',
  '/admin/dashboard',
  '/subscription/success',
  '/subscription/cancel'
];

// Define which routes are protected (need auth)
const PROTECTED_ROUTE_PATTERNS = [
  '/results/',
  '/subscription'
];

// Helper function to check if current route needs authentication
const isProtectedRoute = (pathname: string): boolean => {
  // Check if it's explicitly a public route
  if (PUBLIC_ROUTES.includes(pathname)) {
    return false;
  }
  
  // Check if it matches any protected route pattern
  return PROTECTED_ROUTE_PATTERNS.some(pattern => 
    pathname.startsWith(pattern)
  );
};

// Smart wrapper component that only applies auth logic when needed
const SmartAuthWrapper: React.FC<{ children: ReactNode }> = ({ children }) => {
  const location = useLocation();
  const isAuthenticated = useIsAuthenticated(); // Only subscribe to auth status
  const loading = useAuthLoading(); // Only subscribe to loading state
  
  // If current route doesn't need authentication, render directly
  if (!isProtectedRoute(location.pathname)) {
    console.log(`🌐 Public route detected: ${location.pathname} - rendering directly`);
    return <>{children}</>;
  }
  
  console.log(`🔒 Protected route detected: ${location.pathname} - checking auth`);
  
  // For protected routes, show loading if auth is still initializing
  if (loading) {
    console.log('⏳ Auth loading - showing spinner');
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white/70 text-sm">Checking authentication...</p>
        </div>
      </div>
    );
  }
  
  // For protected routes, if not authenticated, let PrivateRoute handle redirect
  // Don't block here - this prevents conflicts with PrivateRoute navigation logic
  if (!isAuthenticated) {
    console.log('❌ Not authenticated for protected route - letting PrivateRoute handle redirect');
  } else {
    console.log('✅ Authenticated for protected route - rendering with subscription context');
  }
  
  // Always render children - let PrivateRoute components handle the actual redirect logic
  // This prevents double-auth-check conflicts and maintains clean separation of concerns
  return <>{children}</>;
};

// Main AppProvider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  console.log('🚀 AppProvider initializing...');
  
  return (
    <AuthProvider>
      <SmartAuthWrapper>
        <SubscriptionProvider>
          {children}
        </SubscriptionProvider>
      </SmartAuthWrapper>
    </AuthProvider>
  );
};