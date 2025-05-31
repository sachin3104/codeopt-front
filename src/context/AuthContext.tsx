// File: src/context/AuthContext.tsx
// FINAL OPTIMIZED VERSION - Fixes excessive API requests + automatic logout

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

// Define the shape of the context
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

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  // Computed property for authentication status
  const isAuthenticated = user !== null;

  // Refs for request management
  const refreshUserRequestRef = useRef<Promise<void> | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);
  const lastRefreshTimeRef = useRef<number>(0);
  const focusTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isInitializedRef = useRef(false);

  // OPTIMIZED: Stable refreshUser function with better deduplication and logout prevention
  const refreshUser = useCallback(async (force = false): Promise<void> => {
    // Prevent rapid successive calls (debounce for 500ms)
    const now = Date.now();
    if (!force && now - lastRefreshTimeRef.current < 500) {
      return refreshUserRequestRef.current || Promise.resolve();
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
        const response = await fetchCurrentUser();
        
        // Check if request was aborted
        if (abortControllerRef.current?.signal.aborted) {
          return;
        }

        if (response.data.status === 'success') {
          setUser(response.data.user);
        } else {
          // FIXED: Only log out if it's a 401 (authentication failure)
          if (response.status === 401) {
            setUser(null);
          }
          // For other response errors, keep user logged in
        }
      } catch (error: any) {
        // Don't log errors for aborted requests
        if (error.name !== 'AbortError' && !abortControllerRef.current?.signal.aborted) {
          console.error('Failed to refresh user:', error);
          
          // FIXED: Only log out on 401 (authentication failure)
          // Keep user logged in for network errors, 500s, timeouts, etc.
          if (error.response?.status === 401) {
            setUser(null);
          }
          // For network errors, server errors, etc. - don't log out
          // This prevents automatic logout on temporary issues
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
  }, []);

  // Login method for local authentication
  const login = async (username: string, password: string) => {
    try {
      setLoading(true);
      const response = await loginApi(username, password);
      
      if (response.data.status === 'success') {
        setUser(response.data.user);
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Signup method for local authentication
  const signup = async (username: string, email: string, password: string) => {
    try {
      setLoading(true);
      const response = await signupApi(username, email, password);
      
      if (response.data.status === 'success') {
        setUser(response.data.user);
      } else {
        throw new Error(response.data.message || 'Signup failed');
      }
    } catch (error) {
      console.error('Signup failed:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  // Google OAuth login method
  const loginWithGoogle = () => {
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
    } catch (error) {
      console.error('Logout failed:', error);
      // Even if the API call fails, clear local user state
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // OPTIMIZED: Initial auth check on mount
  useEffect(() => {
    const initializeAuth = async () => {
      if (isInitializedRef.current) return;
      
      try {
        setLoading(true);
        isInitializedRef.current = true;
        await refreshUser(true); // Force initial refresh
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        // FIXED: Don't automatically log out on initialization errors
        // Only log out if it's a 401 error (handled inside refreshUser)
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, []); // Remove refreshUser from dependencies

  // OPTIMIZED: Focus handler with better debouncing and error handling
  useEffect(() => {
    const handleFocus = () => {
      // Only refresh if:
      // 1. Not currently loading
      // 2. User is authenticated
      // 3. Component is initialized
      if (!loading && user && isInitializedRef.current) {
        // Clear any existing timeout
        if (focusTimeoutRef.current) {
          clearTimeout(focusTimeoutRef.current);
        }
        
        // Set a longer timeout to avoid rapid refreshes
        focusTimeoutRef.current = setTimeout(() => {
          // FIXED: Silently refresh - don't log out on errors
          refreshUser().catch(() => {
            // Ignore errors from focus refresh
            // User stays logged in even if refresh fails
          });
        }, 2000); // Increased from 1 second to 2 seconds
      }
    };

    const handleBlur = () => {
      // Clear timeout when window loses focus
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
        focusTimeoutRef.current = null;
      }
    };

    window.addEventListener('focus', handleFocus);
    window.addEventListener('blur', handleBlur);
    
    return () => {
      window.removeEventListener('focus', handleFocus);
      window.removeEventListener('blur', handleBlur);
      if (focusTimeoutRef.current) {
        clearTimeout(focusTimeoutRef.current);
      }
    };
  }, [loading, user, refreshUser]);

  // OPTIMIZED: Periodic auth check with longer interval and error handling
  useEffect(() => {
    if (!user || !isInitializedRef.current) return;

    const interval = setInterval(() => {
      // FIXED: Silently refresh - don't log out on errors
      refreshUser().catch(() => {
        // Ignore errors from periodic check
        // User stays logged in even if refresh fails
      });
    }, 30 * 60 * 1000); // Increased from 20 to 30 minutes

    return () => clearInterval(interval);
  }, [user, refreshUser]);

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

// Hook for easy access
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Additional hook for checking authentication status
export const useIsAuthenticated = (): boolean => {
  const { isAuthenticated } = useAuth();
  return isAuthenticated;
};

// Hook for getting user data
export const useUser = (): User | null => {
  const { user } = useAuth();
  return user;
};