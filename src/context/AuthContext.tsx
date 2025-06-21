// File: src/context/AuthContext.tsx
// Updated to include approval gating and optimized request handling

import React, {
  createContext,
  useState,
  useEffect,
  useRef,
  useCallback,
  ReactNode,
  useContext
} from 'react';
import {
  User,
  fetchCurrentUser,
  login as loginApi,
  signup as signupApi,
  logout as logoutApi,
  initiateGoogleAuth
} from '../api/auth';

// Extend User to include approval flag (from backend)
declare module '../api/auth' {
  export interface User {
    is_approved: boolean;
  }
}

// Approval states
export type ApprovalState = 'loading' | 'pending' | 'approved';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  approval: ApprovalState;
  login(username: string, password: string): Promise<void>;
  signup(username: string, email: string, password: string): Promise<void>;
  logout(): Promise<void>;
  refreshUser(): Promise<void>;
  refreshApproval(): Promise<void>;
  loginWithGoogle(): void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [approval, setApproval] = useState<ApprovalState>('loading');
  const [isLoggedOut, setIsLoggedOut] = useState(false);

  // Refs for request control
  const refreshRef = useRef<Promise<void> | null>(null);
  const abortRef = useRef<AbortController | null>(null);
  const lastRefTime = useRef(0);
  const initRef = useRef(false);
  const failureCount = useRef(0);

  const isAuthenticated = !!user;

  // Derive approval from user on change
  useEffect(() => {
    if (user === null) {
      setApproval('loading');
    } else if (user.is_approved) {
      setApproval('approved');
    } else {
      setApproval('pending');
    }
  }, [user]);

  // Central refreshUser: fetch full user
  const refreshUser = useCallback(async (force = false) => {
    if (isLoggedOut && !force) return;
    const now = Date.now();
    if (!force && now - lastRefTime.current < 3000) {
      return refreshRef.current || Promise.resolve();
    }

    if (failureCount.current > 0 && !force) {
      const backoff = Math.min(2000 * 2 ** failureCount.current, 60000);
      if (now - lastRefTime.current < backoff) return;
    }
    if (refreshRef.current && !force) return refreshRef.current;

    // abort existing
    abortRef.current?.abort();
    abortRef.current = new AbortController();
    lastRefTime.current = now;

    const promise = (async () => {
      try {
        const res = await fetchCurrentUser();
        if (abortRef.current?.signal.aborted) return;
        if (res.data.status === 'success') {
          setUser(res.data.user);
          setIsLoggedOut(false);
          failureCount.current = 0;
        } else {
          handleAuthFailure(res.status);
        }
      } catch (err: any) {
        if (err.name !== 'AbortError') {
          handleAuthFailure(err.response?.status);
        }
      } finally {
        refreshRef.current = null;
        abortRef.current = null;
      }
    })();

    refreshRef.current = promise;
    return promise;
  }, [isLoggedOut]);

  // Only refresh approval flag
  const refreshApproval = useCallback(async () => {
    // reuse refreshUser but do not replace user
    await refreshUser();
    // approval is derived in effect
  }, [refreshUser]);

  // Handle auth failures
  const handleAuthFailure = (status?: number) => {
    if (status === 401) {
      setUser(null);
      setIsLoggedOut(true);
      failureCount.current = 0;
    } else {
      failureCount.current++;
    }
  };

  // Auth methods
  const login = useCallback(async (username: string, password: string) => {
    setLoading(true);
    setIsLoggedOut(false);
    failureCount.current = 0;
    try {
      const res = await loginApi(username, password);
      if (res.data.status === 'success') {
        setUser(res.data.user);
      } else {
        throw new Error(res.data.message || 'Login failed');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const signup = useCallback(async (username: string, email: string, password: string) => {
    setLoading(true);
    setIsLoggedOut(false);
    failureCount.current = 0;
    try {
      const res = await signupApi(username, email, password);
      if (res.data.status === 'success') {
        setUser(res.data.user);
      } else {
        throw new Error(res.data.message || 'Signup failed');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(() => {
    setIsLoggedOut(false);
    initiateGoogleAuth();
  }, []);

  const logout = useCallback(async () => {
    setLoading(true);
    abortRef.current?.abort();
    try {
      await logoutApi();
    } catch {}
    setUser(null);
    setIsLoggedOut(true);
    failureCount.current = 0;
    setLoading(false);
  }, []);

  // Initial load
  useEffect(() => {
    if (initRef.current) return;
    initRef.current = true;
    refreshUser(true).finally(() => setLoading(false));
  }, [refreshUser]);

  const contextValue: AuthContextType = {
    user,
    loading,
    isAuthenticated,
    approval,
    login,
    signup,
    logout,
    refreshUser,
    refreshApproval,
    loginWithGoogle
  };

  return <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>;
};

// Hooks
export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be inside AuthProvider');
  return ctx;
};

export const useUser = () => useAuth().user;
export const useAuthLoading = () => useAuth().loading;
export const useIsAuthenticated = () => useAuth().isAuthenticated;
export const useApprovalState = () => useAuth().approval;
