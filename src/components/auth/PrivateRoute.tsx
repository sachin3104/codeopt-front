// File: src/components/auth/PrivateRoute.tsx
// OPTIMIZED: Adds approval gating with overlay, prevents unnecessary re-renders

import React, { memo } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import {
  useIsAuthenticated,
  useAuthLoading,
  useApprovalState,
  useAuth
} from '@/context/AuthContext';

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
  const isAuthenticated = useIsAuthenticated();      // only re-renders on auth change
  const loading = useAuthLoading();                 // only re-renders on loading change
  const approval = useApprovalState();              // only re-renders on approval change
  const { refreshApproval } = useAuth();            // method to re-check approval
  const location = useLocation();

  console.log(`🔒 PrivateRoute check - Path: ${location.pathname}, Auth: ${isAuthenticated}, Loading: ${loading}, Approval: ${approval}`);

  // 1. Loading user/session
  if (loading) {
    return <PrivateRouteLoader />;
  }

  // 2. Not authenticated → redirect to login
  if (!isAuthenticated) {
    console.log(`🚫 PrivateRoute: Redirecting to login from ${location.pathname}`);
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 3. Authenticated but pending approval → overlay
  if (approval === 'pending') {
    console.log(`⏳ PrivateRoute: Pending approval for ${location.pathname}`);
    return (
      <>
        {children}
        <div className="fixed inset-0 backdrop-blur-md bg-black/30 flex items-center justify-center z-50">
          <div className="backdrop-blur-xl bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-xl p-6 shadow-lg text-center max-w-sm mx-auto">
            <h2 className="text-xl font-semibold mb-4 text-white">Account Pending Approval</h2>
            <p className="mb-6 text-white/80">Your account is awaiting admin approval.</p>
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

  // 4. Approved → render protected component
  console.log(`✅ PrivateRoute: Access granted for ${location.pathname}`);
  return children;
});

PrivateRoute.displayName = 'PrivateRoute';

export default PrivateRoute;
