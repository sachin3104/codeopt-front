// File: src/routes/ConditionalHomeRoute.tsx
import React, { memo, useMemo } from 'react';
import { useIsAuthenticated, useAuthLoading } from '@/context/AuthContext';
import HomePage from '@/pages/HomePage';
import LandingPage from '@/pages/LandingPage';

// Memoized loading component to prevent unnecessary re-renders
const LoadingSpinner = memo(() => {
  console.log('🔄 Rendering loading spinner for home route');
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      <div className="text-center">
        <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-6"></div>
        <div className="space-y-2">
          <p className="text-white text-lg font-medium">Loading...</p>
          <p className="text-white/60 text-sm">Checking your authentication status</p>
        </div>
      </div>
    </div>
  );
});

LoadingSpinner.displayName = 'LoadingSpinner';

// Memoized HomePage wrapper to prevent unnecessary re-renders
const MemoizedHomePage = memo(() => {
  console.log('🏠 Rendering authenticated HomePage');
  return <HomePage />;
});

MemoizedHomePage.displayName = 'MemoizedHomePage';

// Memoized LandingPage wrapper to prevent unnecessary re-renders
const MemoizedLandingPage = memo(() => {
  console.log('🌟 Rendering public LandingPage');
  return <LandingPage />;
});

MemoizedLandingPage.displayName = 'MemoizedLandingPage';

// Optimized conditional home route with selective subscriptions
const ConditionalHomeRoute: React.FC = memo(() => {
  // OPTIMIZED: Use selective hooks to minimize re-renders
  const isAuthenticated = useIsAuthenticated(); // Only re-renders when auth status changes
  const loading = useAuthLoading(); // Only re-renders when loading state changes
  
  // Memoize the route decision to prevent unnecessary recalculations
  const routeComponent = useMemo(() => {
    console.log(`🔍 ConditionalHomeRoute - Auth: ${isAuthenticated}, Loading: ${loading}`);
    
    if (loading) {
      return <LoadingSpinner />;
    }
    
    return isAuthenticated ? <MemoizedHomePage /> : <MemoizedLandingPage />;
  }, [isAuthenticated, loading]);
  
  return routeComponent;
});

ConditionalHomeRoute.displayName = 'ConditionalHomeRoute';

export default ConditionalHomeRoute;