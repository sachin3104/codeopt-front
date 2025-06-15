// src/routes/index.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import PrivateRoute from '@/components/auth/PrivateRoute';

// Authentication
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import AuthSuccessPage from '@/pages/auth/AuthSuccessPage';

// Main pages
import HomePage from '@/pages/HomePage';
import LandingPage from '@/pages/LandingPage';
import NotFound from '@/pages/NotFound';

// Result pages
import AnalyseResult from '@/pages/results/AnalyseResult';
import OptimiseResult from '@/pages/results/OptimiseResult';
import ConvertResult from '@/pages/results/ConvertResult';
import DocumentResult from '@/pages/results/DocumentResult';

// Admin pages
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminDashboard from '@/pages/admin/AdminDashboard';
import UserManagement from '@/pages/admin/UserManagement';

// Payment Routes
import PaymentSuccess from '@/pages/subscription/PaymentSuccess';
import PaymentCancel from '@/pages/subscription/PaymentCancel';
import SubscriptionPage from '@/pages/subscription/SubscriptionPage';

// Component to handle conditional home route
const ConditionalHomeRoute: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
      </div>
    );
  }

  return user ? <HomePage /> : <LandingPage />;
};

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public authentication routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      {/* OAuth callback route - public but handles authentication */}
      <Route path="/auth/success" element={<AuthSuccessPage />} />
      
      {/* Protected result routes */}
      <Route
        path="/results/analyze"
        element={
          <PrivateRoute>
            <AnalyseResult />
          </PrivateRoute>
        }
      />
      <Route
        path="/results/optimize"
        element={
          <PrivateRoute>
            <OptimiseResult />
          </PrivateRoute>
        }
      />
      <Route
        path="/results/convert"
        element={
          <PrivateRoute>
            <ConvertResult />
          </PrivateRoute>
        }
      />
      <Route
        path="/results/document"
        element={
          <PrivateRoute>
            <DocumentResult />
          </PrivateRoute>
        }
      />
      
      {/* Admin routes */}
      <Route path="/admin/login" element={<AdminLogin />} />
      <Route path="/admin/dashboard" element={<AdminDashboard />} />
      <Route path="/admin/users" element={<UserManagement />} />
      
      {/* Conditional home route - Landing page or HomePage based on auth */}
      <Route path="/" element={<ConditionalHomeRoute />} />
      
      {/* Payment routes */}
      <Route path="/subscription" element={<SubscriptionPage />} />
      <Route path="/subscription/success" element={<PaymentSuccess />} />
      <Route path="/subscription/cancel" element={<PaymentCancel />} />
      
      {/* Catch-all fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes; 