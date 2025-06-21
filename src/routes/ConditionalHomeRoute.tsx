// File: src/routes/ConditionalHomeRoute.tsx
// OPTIMIZED: Adds approval gating with overlay to home route

import React, { memo } from 'react';
import { useIsAuthenticated, useAuthLoading, useApprovalState, useAuth } from '@/context/AuthContext';
import HomePage from '@/pages/HomePage';
import LandingPage from '@/pages/LandingPage';

// Memoized loading spinner
const LoadingSpinner = memo(() => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-500 mx-auto mb-6"></div>
      <div className="space-y-2">
        <p className="text-white text-lg font-medium">Loading...</p>
        <p className="text-white/60 text-sm">Checking your authentication status</p>
      </div>
    </div>
  </div>
));
LoadingSpinner.displayName = 'LoadingSpinner';

// Memoized pages
const MemoizedHomePage = memo(() => <HomePage />);
MemoizedHomePage.displayName = 'MemoizedHomePage';

const MemoizedLandingPage = memo(() => <LandingPage />);
MemoizedLandingPage.displayName = 'MemoizedLandingPage';

// Conditional home route with approval overlay
const ConditionalHomeRoute: React.FC = memo(() => {
  const isAuthenticated = useIsAuthenticated();
  const loading = useAuthLoading();
  const approval = useApprovalState();
  const { refreshApproval } = useAuth();

  console.log(`🏠 ConditionalHomeRoute - Auth: ${isAuthenticated}, Loading: ${loading}, Approval: ${approval}`);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <MemoizedLandingPage />;
  }

  // User is authenticated
  if (approval === 'pending') {
    return (
      <>
        <MemoizedHomePage />
        <div className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center z-50">
          <div className="backdrop-blur-xl bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl p-6 shadow-lg text-center max-w-sm mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-white">Account Pending Approval</h2>
            <p className="mb-6 text-white/80">Your account is still awaiting admin approval.</p>
            <button
              onClick={refreshApproval}
              className="px-4 py-2 backdrop-blur-sm bg-white/10 hover:bg-white/20 text-white rounded-lg focus:outline-none transition-all duration-200 border border-white/20 hover:border-white/30"
            >
              Refresh Status
            </button>
          </div>
        </div>
      </>
    );
  }

  // Approved
  return <MemoizedHomePage />;
});

ConditionalHomeRoute.displayName = 'ConditionalHomeRoute';

export default ConditionalHomeRoute;
