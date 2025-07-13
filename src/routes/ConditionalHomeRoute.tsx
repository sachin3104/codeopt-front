// src/routes/ConditionalHomeRoute.tsx


import React, { memo } from 'react';
import { useAuth } from '@/hooks/use-auth';
import HomePage from '@/pages/HomePage';
import LandingPage from '@/pages/LandingPage';
import { LogOut } from 'lucide-react';

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
  const { isAuthenticated, loading, user, logout } = useAuth();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (!isAuthenticated) {
    return <MemoizedLandingPage />;
  }

  // User is authenticated
  if (!user?.is_approved) {
    return (
      <>
        <MemoizedHomePage />
        <div className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center z-50 p-4 sm:p-6">
          <div className="backdrop-blur-xl bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-lg sm:rounded-xl p-4 sm:p-6 shadow-lg text-center w-full max-w-xs sm:max-w-sm mx-auto">
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4 text-white">Account Pending Approval</h2>
            <p className="mb-4 sm:mb-6 text-white/80 text-sm sm:text-base">Your account is still awaiting admin approval.</p>
            <div className="flex flex-col gap-2 sm:gap-3">
              <button
                onClick={() => window.location.reload()}
                className="px-3 sm:px-4 py-2 backdrop-blur-sm bg-white/10 hover:bg-white/20 text-white rounded-lg focus:outline-none transition-all duration-200 border border-white/20 hover:border-white/30 text-sm sm:text-base"
              >
                Refresh Status
              </button>
              <button
                onClick={logout}
                className="px-3 sm:px-4 py-2 backdrop-blur-sm bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg focus:outline-none transition-all duration-200 border border-red-500/30 hover:border-red-500/40 flex items-center justify-center gap-1.5 sm:gap-2 text-sm sm:text-base"
              >
                <LogOut size={14} className="sm:w-4 sm:h-4" />
                Logout
              </button>
            </div>
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
