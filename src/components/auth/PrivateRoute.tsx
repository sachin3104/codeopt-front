// File: src/components/auth/PrivateRoute.tsx
// OPTIMIZED VERSION - Prevents request multiplication and unnecessary re-renders

import React, { memo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useIsAuthenticated, useAuthLoading } from '@/context/AuthContext';

interface PrivateRouteProps {
  children: JSX.Element;
}

// Memoized loading component to prevent unnecessary re-renders
const PrivateRouteLoader = memo(() => {
  console.log('🔒 PrivateRoute: Rendering auth loading state');
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
        <div className="space-y-2">
          <p className="text-white text-lg font-medium">Verifying Access...</p>
          <p className="text-white/60 text-sm">Please wait while we check your permissions</p>
        </div>
      </div>
    </div>
  );
});

PrivateRouteLoader.displayName = 'PrivateRouteLoader';

// OPTIMIZED: Memoized PrivateRoute component with selective subscriptions
const PrivateRoute: React.FC<PrivateRouteProps> = memo(({ children }) => {
  // OPTIMIZED: Use selective hooks to minimize re-renders
  const isAuthenticated = useIsAuthenticated(); // Only re-renders when auth status changes
  const loading = useAuthLoading(); // Only re-renders when loading state changes
  const location = useLocation();
  
  console.log(`🔒 PrivateRoute check - Path: ${location.pathname}, Auth: ${isAuthenticated}, Loading: ${loading}`);
  
  // Show loading state while checking authentication
  if (loading) {
    return <PrivateRouteLoader />;
  }
  
  // If not authenticated, redirect to login with attempted path preserved
  if (!isAuthenticated) {
    console.log(`🚫 PrivateRoute: Redirecting to login from ${location.pathname}`);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  
  // If authenticated, render the protected component
  console.log(`✅ PrivateRoute: Access granted for ${location.pathname}`);
  return children;
});

PrivateRoute.displayName = 'PrivateRoute';

export default PrivateRoute;