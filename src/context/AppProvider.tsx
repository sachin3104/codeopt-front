// File: src/context/AppProvider.tsx
import React, { ReactNode, createContext, useContext, useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { AuthProvider } from './AuthContext';
import { useAuth } from '../hooks/use-auth';
import { SubscriptionProvider } from './SubscriptionContext';
import { detectLanguage, DetectLanguageResponse } from '@/api/service';

// Define which routes are public (don't need auth)
const PUBLIC_ROUTES = [
  '/',
  '/login',
  '/signup',
  '/auth/success',
  '/admin/login',
  '/subscription/success',
  '/subscription/cancel'
];

// Define which routes are admin routes (use admin auth, not regular user auth)
const ADMIN_ROUTES = [
  '/admin/login',
  '/admin/dashboard'
];

// Define which routes are protected (need auth)
const PROTECTED_ROUTE_PATTERNS = [
  '/results/',
  '/subscription'
];

// Helper function to check if current route is an admin route
const isAdminRoute = (pathname: string): boolean => {
  return ADMIN_ROUTES.includes(pathname) || pathname.startsWith('/admin/');
};

// Helper function to check if current route needs authentication
const isProtectedRoute = (pathname: string): boolean => {
  // Admin routes are handled separately
  if (isAdminRoute(pathname)) {
    return false;
  }
  
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

// Global cache for language detection
const globalLanguageCache = new Map<string, string>();

interface LanguageDetectionContextType {
  language: string;
  loading: boolean;
  error: string | null;
  detectLanguage: (code: string) => void;
  clearCache: () => void;
}

const LanguageDetectionContext = createContext<LanguageDetectionContextType | null>(null);

export const useLanguageDetection = () => {
  const context = useContext(LanguageDetectionContext);
  if (!context) {
    throw new Error('useLanguageDetection must be used within LanguageDetectionProvider');
  }
  return context;
};

interface LanguageDetectionProviderProps {
  children: React.ReactNode;
}

const LanguageDetectionProvider: React.FC<LanguageDetectionProviderProps> = ({ children }) => {
  const [language, setLanguage] = useState<string>('');
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [currentCode, setCurrentCode] = useState<string>('');
  const lastProcessedCode = useRef<string>('');
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const detectLanguageForCode = (code: string) => {
    // Reset immediately on empty
    if (!code) {
      setLanguage('');
      setError(null);
      setCurrentCode('');
      lastProcessedCode.current = '';
      return;
    }

    // Check if we've already processed this exact code
    if (lastProcessedCode.current === code) {
      return;
    }

    setCurrentCode(code);

    // Check cache first - if we have a cached result, use it immediately
    const cachedLanguage = globalLanguageCache.get(code);
    if (cachedLanguage !== undefined) {
      setLanguage(cachedLanguage);
      setError(null);
      setLoading(false);
      lastProcessedCode.current = code;
      return;
    }

    // Clear any existing timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Start loading state
    setLoading(true);
    setError(null);

    // Schedule the API call after 500ms of inactivity
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const res: DetectLanguageResponse = await detectLanguage(code);
        // Cache the result for future use
        globalLanguageCache.set(code, res.language);
        setLanguage(res.language);
        setError(null);
        lastProcessedCode.current = code;
      } catch (err: any) {
        setError(err.message ?? 'Failed to detect language');
        setLanguage('');
        lastProcessedCode.current = code;
      } finally {
        setLoading(false);
      }
    }, 500);
  };

  const clearCache = () => {
    globalLanguageCache.clear();
    lastProcessedCode.current = '';
  };

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  const value: LanguageDetectionContextType = {
    language,
    loading,
    error,
    detectLanguage: detectLanguageForCode,
    clearCache
  };

  return (
    <LanguageDetectionContext.Provider value={value}>
      {children}
    </LanguageDetectionContext.Provider>
  );
};

// Main AppProvider component
export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  return (
    <AuthProvider>
      <SmartAuthWrapper>
        <SubscriptionProvider>
          <LanguageDetectionProvider>
            {children}
          </LanguageDetectionProvider>
        </SubscriptionProvider>
      </SmartAuthWrapper>
    </AuthProvider>
  );
};