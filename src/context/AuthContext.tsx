// File: src/context/AuthContext.tsx
// OPTIMIZED VERSION - Prevents request loops and provides selective subscriptions

import React, { createContext, useState, useEffect, ReactNode, useContext, useRef, useCallback } from 'react';
import {
  User,
  fetchCurrentUser,
  login as loginApi,
  signup as signupApi,
  logout as logoutApi,
  initiateGoogleAuth,
  checkAuthStatus
} from '../api/auth';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  signup: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  loginWithGoogle: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  const isAuthenticated = user !== null;

  // Request management refs
  const refreshUserRequestRef = useRef<Promise<void> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastRefreshTimeRef = useRef<number>(0);
  const focusTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);
  const consecutiveFailuresRef = useRef(0);

  // OPTIMIZED: Conservative refreshUser function with better error handling
  const refreshUser = useCallback(async (force = false): Promise<void> => {
    // CRITICAL: Don't make requests if we're already logged out
    if (isLoggedOut && !force) {
      return Promise.resolve();
    }

    // Prevent rapid successive calls (increased debounce to 3 seconds)
    const now = Date.now();
    if (!force && now - lastRefreshTimeRef.current < 3000) {
      return refreshUserRequestRef.current || Promise.resolve();
    }

    // Implement exponential backoff for failures
    if (consecutiveFailuresRef.current > 0 && !force) {
      const backoffTime = Math.min(2000 * Math.pow(2, consecutiveFailuresRef.current), 60000); // Max 1 minute
      if (now - lastRefreshTimeRef.current < backoffTime) {
        return Promise.resolve();
      }
    }

    // If there's already a request in progress, return that promise
    if (refreshUserRequestRef.current && !force) {
      return refreshUserRequestRef.current;
    }

    // Cancel any existing request
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    // Create new abort controller
    abortControllerRef.current = new AbortController();
    lastRefreshTimeRef.current = now;

    const requestPromise = (async () => {
      try {
        console.log('🔍 Making auth check request...'); // DEBUG
        const response = await fetchCurrentUser();
        
        // Check if request was aborted
        if (abortControllerRef.current?.signal.aborted) {
          return;
        }

        if (response.data.status === 'success') {
          setUser(response.data.user);
          setIsLoggedOut(false);
          consecutiveFailuresRef.current = 0; // Reset failure count
          console.log('✅ Auth check successful');
        } else {
          console.warn('⚠️ Auth check failed:', response.data.status);
          handleAuthFailure(response.status);
        }
      } catch (error: any) {
        // Don't log errors for aborted requests
        if (error.name !== 'AbortError' && !abortControllerRef.current?.signal.aborted) {
          console.error('❌ Failed to refresh user:', error);
          handleAuthFailure(error.response?.status);
        }
      } finally {
        refreshUserRequestRef.current = null;
        if (abortControllerRef.current) {
          abortControllerRef.current = null;
        }
      }
    })();

    refreshUserRequestRef.current = requestPromise;
    return requestPromise;
  }, [isLoggedOut]);

  // Centralized auth failure handling
  const handleAuthFailure = (status?: number) => {
    if (status === 401) {
      // Only log out on 401 (authentication failure)
      setUser(null);
      setIsLoggedOut(true);
      consecutiveFailuresRef.current = 0; // Reset on logout
      console.log('🚪 User logged out due to 401');
    } else {
      // For other errors, increment failure count but don't log out
      consecutiveFailuresRef.current++;
      console.warn(`⚠️ Auth check failed (attempt ${consecutiveFailuresRef.current}):`, status);
    }
  };

  // Login method
  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      setIsLoggedOut(false); // Reset logout state
      consecutiveFailuresRef.current = 0; // Reset failure count
      
      const response = await loginApi(username, password);
      
      if (response.data.status === 'success') {
        setUser(response.data.user);
        console.log('🎉 Login successful');
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('❌ Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Signup method
  const signup = async (username: string, email: string, password: string) => {
    try {
      setLoading(true);
      setIsLoggedOut(false); // Reset logout state
      consecutiveFailuresRef.current = 0; // Reset failure count
      
      const response = await signupApi(username, email, password);
      
      if (response.data.status === 'success') {
        setUser(response.data.user);
        console.log('🎉 Signup successful');
      } else {
        throw new Error(response.data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('❌ Signup failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth login method
  const loginWithGoogle = () => {
    setIsLoggedOut(false); // Reset logout state
    initiateGoogleAuth();
  };

  // Logout method
  const logout = async () => {
    try {
      setLoading(true);
      
      // Cancel any ongoing refresh requests
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      
      await logoutApi();
      setUser(null);
      setIsLoggedOut(true); // Mark as logged out
      consecutiveFailuresRef.current = 0; // Reset failure count
      console.log('👋 Logout successful');
    } catch (error) {
      console.error('❌ Logout failed:', error);
      // Even if the API call fails, clear local user state
      setUser(null);
      setIsLoggedOut(true);
    } finally {
      setLoading(false);
    }
  };

  // OPTIMIZED: Initial auth check - only once
  useEffect(() => {
    const initializeAuth = async () => {
      if (isInitializedRef.current) return;
      
      try {
        setLoading(true);
        isInitializedRef.current = true;
        console.log('🚀 Initializing auth...');
        await refreshUser(true); // Force initial refresh
      } catch (error) {
        console.error('❌ Failed to initialize auth:', error);
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []); // Empty dependency array - runs only once

  // OPTIMIZED: Focus handler - much more conservative
  useEffect(() => {
    const handleFocus = () => {
      // Only refresh if ALL conditions are met:
      // 1. Not currently loading
      // 2. User is authenticated
      // 3. Component is initialized
      // 4. Not logged out
      // 5. No recent failures
      if (!loading && user && isInitializedRef.current && !isLoggedOut && consecutiveFailuresRef.current < 2) {
        // Clear any existing timeout
        if (focusTimeoutRef.current) {
          clearTimeout(focusTimeoutRef.current);
        }
        
        // Set a longer timeout to avoid rapid refreshes
        focusTimeoutRef.current = setTimeout(() => {
          console.log('👁️ Focus refresh triggered');
          refreshUser().catch(() => {
            console.warn('⚠️ Focus refresh failed - ignoring');
          });
        }, 10000); // Increased to 10 seconds
      }
    };

    const handleBlur = () => {
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
        focusTimeoutRef.current = null;
      }
    };

    // Only add listeners if user is authenticated and not logged out
    if (user && !isLoggedOut) {
      window.addEventListener('focus', handleFocus);
      window.addEventListener('blur', handleBlur);
    }
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
      }
    };
  }, [loading, user, isLoggedOut, refreshUser]);

  // OPTIMIZED: Periodic auth check - much longer interval
  useEffect(() => {
    // Only set up periodic check if user is authenticated and not logged out
    if (!user || !isInitializedRef.current || isLoggedOut || consecutiveFailuresRef.current >= 2) {
      return;
    }

    console.log('⏰ Setting up periodic auth check');
    const interval = setInterval(() => {
      console.log('🔄 Periodic auth check triggered');
      refreshUser().catch(() => {
        console.warn('⚠️ Periodic auth check failed - ignoring');
      });
    }, 2 * 60 * 60 * 1000); // Increased to 2 hours

    return () => {
      console.log('🛑 Clearing periodic auth check');
      clearInterval(interval);
    };
  }, [user, isLoggedOut, refreshUser]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
      }
    };
  }, []);

  const contextValue: AuthContextType = {
    user,
    loading,
    login,
    signup,
    logout,
    refreshUser,
    loginWithGoogle,
    isAuthenticated
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

// OPTIMIZED: Selective hooks to prevent unnecessary re-renders

// Main hook - use sparingly, only when you need multiple auth properties
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// OPTIMIZED: Hook that only re-renders when authentication status changes
export const useIsAuthenticated = (): boolean => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useIsAuthenticated must be used within an AuthProvider');
  }
  
  // Only subscribe to isAuthenticated, not the full context
  return context.isAuthenticated;
};

// OPTIMIZED: Hook that only re-renders when user data changes
export const useUser = (): User | null => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useUser must be used within an AuthProvider');
  }
  
  // Only subscribe to user, not the full context
  return context.user;
};

// OPTIMIZED: Hook that only re-renders when loading state changes
export const useAuthLoading = (): boolean => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuthLoading must be used within an AuthProvider');
  }
  
  // Only subscribe to loading, not the full context
  return context.loading;
};