// src/api/auth.ts
import api from './client';

// Shape of the user object returned by /api/auth/user
export interface User {
  id: string; // public_id from backend
  username: string;
  email: string;
  auth_provider: string;
  first_name?: string;
  last_name?: string;
  profile_picture?: string;
  created_at?: string;
  last_login?: string;
}

/**
 * Register a new user with local authentication.
 * @param username
 * @param email
 * @param password
 */
export const signup = (
  username: string,
  email: string,
  password: string
) =>
  api.post<{ 
    status: string;
    message: string;
    user: User;
  }>('/api/auth/signup', {
    username,
    email,
    password,
  });

/**
 * Log in with username and password (local authentication).
 * Sets HttpOnly cookie on success.
 * @param username
 * @param password
 */
export const login = (username: string, password: string) =>
  api.post<{ 
    status: string;
    message: string;
    user: User;
  }>('/api/auth/login', { 
    username, 
    password 
  });

/**
 * Fetch the currently logged-in user (if any).
 * Relies on the HttpOnly cookie that was set by login() or OAuth.
 */
export const fetchCurrentUser = () => {
  return api.get<{
    status: string;
    user: User;
  }>('/api/auth/user');
};

/**
 * Log out (clears HttpOnly cookie on the server).
 */
export const logout = () => {
  return api.post<{ 
    status: string;
    message: string;
  }>('/api/auth/logout');
};

/**
 * Initiate Google OAuth authentication.
 * This will redirect the user to the backend Google OAuth endpoint,
 * which will then redirect to Google's authorization server.
 */
export const initiateGoogleAuth = () => {
  window.location.href = `${import.meta.env.VITE_API_URL}/api/auth/google`;
};

/**
 * Check if the current session is authenticated.
 * Useful for checking auth status without fetching full user data.
 */
export const checkAuthStatus = () => {
  return api.get<{
    status: string;
    authenticated: boolean;
  }>('/api/auth/check');
};