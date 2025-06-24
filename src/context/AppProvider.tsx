// File: src/context/AppProvider.tsx
import React, { ReactNode } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { useAuth } from '../hooks/use-auth';
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
  const { isAuthenticated, loading } = useAuth(); // Use the hook to get auth state
  
  // If current route doesn't need authentication, render directly
  if (!isProtectedRoute(location.pathname)) {
    return <>{children}</>;
  }
  
  // For protected routes, show loading if auth is still initializing
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-900 to-gray-800">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p className="text-white/70 text-sm">Checking authentication...</p>
        </div>
      </div>
    );
  }
  
  // Always render children - let PrivateRoute components handle the actual redirect logic
  // This prevents double-auth-check conflicts and maintains clean separation of concerns
  return <>{children}</>;
};

// Main AppProvider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
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