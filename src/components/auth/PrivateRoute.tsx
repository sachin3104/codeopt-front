// src/components/auth/PrivateRoute.tsx

import React, { memo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/hooks/use-auth';
import { LogOut } from 'lucide-react';

interface PrivateRouteProps {
  children: JSX.Element;
}

// Memoized loading component
const PrivateRouteLoader = memo(() => (
  <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
      <div className="space-y-2">
        <p className="text-white text-lg font-medium">Verifying Access...</p>
        <p className="text-white/60 text-sm">Please wait while we check your permissions</p>
      </div>
    </div>
  </div>
));
PrivateRouteLoader.displayName = 'PrivateRouteLoader';

// OPTIMIZED: PrivateRoute with auth + approval gating
const PrivateRoute: React.FC<PrivateRouteProps> = memo(({ children }) => {
  const { loading, isAuthenticated, user, logout } = useAuth();
  const location = useLocation();

  // 1. Loading user/session
  if (loading) {
    return <PrivateRouteLoader />;
  }

  // 2. Not authenticated → redirect to login
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Authenticated but pending approval → overlay
  if (!user?.is_approved) {
    return (
      <>
        {children}
        <div className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center z-50">
          <div className="backdrop-blur-xl bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl p-6 shadow-lg text-center max-w-sm mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-white">Account Pending Approval</h2>
            <p className="mb-6 text-white/80">Your account is awaiting admin approval.</p>
            <div className="flex flex-col gap-3">
              <button
                onClick={() => window.location.reload()}
                className="px-4 py-2 backdrop-blur-sm bg-white/10 hover:bg-white/20 text-white rounded-lg focus:outline-none transition-all duration-200 border border-white/20 hover:border-white/30"
              >
                Refresh Status
              </button>
              <button
                onClick={logout}
                className="px-4 py-2 backdrop-blur-sm bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg focus:outline-none transition-all duration-200 border border-red-500/30 hover:border-red-500/40 flex items-center justify-center gap-2"
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          </div>
        </div>
      </>
    );
  }

  // 4. Approved → render protected component
  return children;
});

PrivateRoute.displayName = 'PrivateRoute';

export default PrivateRoute;
