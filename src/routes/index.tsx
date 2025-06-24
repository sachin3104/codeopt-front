// File: src/routes/index.tsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import PrivateRoute from '@/components/auth/PrivateRoute';

// Authentication pages
import LoginPage from '@/pages/auth/LoginPage';
import SignupPage from '@/pages/auth/SignupPage';
import AuthSuccessPage from '@/pages/auth/AuthSuccessPage';

// Main pages
import NotFound from '@/pages/NotFound';

// Result pages
import AnalyseResult from '@/pages/results/AnalyseResult';
import OptimiseResult from '@/pages/results/OptimiseResult';
import ConvertResult from '@/pages/results/ConvertResult';
import DocumentResult from '@/pages/results/DocumentResult';

// Admin pages
import AdminLogin from '@/pages/admin/AdminLogin';
import AdminDashboard from '@/pages/admin/AdminDashboard';

// Marketing/Footer pages
import FooterPricingPage from '@/pages/footer/PricingPage';
import ContactPage from '@/pages/footer/ContactPage';
import PrivacyPolicyPage from '@/pages/footer/PrivacyPolicyPage';
import TermsOfServicePage from '@/pages/footer/TermsOfServicePage';
import CookiePolicyPage from '@/pages/footer/CookiePolicyPage';

// Subscription & Dashboard pages
import PricingPage from '@/pages/subscription/PricingPage';                // subscription purchase UI
import SubscriptionSuccessPage from '@/pages/subscription/SubscriptionSuccessPage';
import Dashboard from '@/pages/subscription/Dashboard';

// OPTIMIZED: Import the optimized ConditionalHomeRoute component
import ConditionalHomeRoute from '@/routes/ConditionalHomeRoute';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      {/* Public authentication routes */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      
      {/* OAuth callback route - public but handles authentication */}
      <Route path="/auth/success" element={<AuthSuccessPage />} />
      
      {/* Public footer/marketing pages */}
      <Route path="/pricing" element={<FooterPricingPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/privacy" element={<PrivacyPolicyPage />} />
      <Route path="/terms" element={<TermsOfServicePage />} />
      <Route path="/cookies" element={<CookiePolicyPage />} />

      {/* Subscription purchase (must be logged in) */}
      <Route
        path="/subscription"
        element={
          <PrivateRoute>
            <PricingPage />
          </PrivateRoute>
        }
      />

      {/* Stripe checkout success callback */}
      <Route
        path="/subscription/success"
        element={
          <PrivateRoute>
            <SubscriptionSuccessPage />
          </PrivateRoute>
        }
      />

      {/* User dashboard for subscription details, cancel & billing portal */}
      <Route
        path="/dashboard"
        element={
          <PrivateRoute>
            <Dashboard />
          </PrivateRoute>
        }
      />

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
      
      {/* OPTIMIZED: Conditional home route using external component */}
      <Route path="/" element={<ConditionalHomeRoute />} />
      
      {/* Catch-all fallback */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;