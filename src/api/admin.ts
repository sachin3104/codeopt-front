// src/api/admin.ts
// Admin API client with all admin endpoints
import api from './client';
import type {
  AdminUser,
  AdminLoginResponse,
  AdminUserResponse,
  AdminAuthResponse,
  AdminLogoutResponse,
  UserStatsResponse,
  UsersResponse,
  UserDetailsResponse,
  UserActionResponse,
  BulkApproveResponse,
} from '@/types/admin';

// Re-export types for convenience
export type {
  AdminUser,
  AdminLoginResponse,
  AdminUserResponse,
  AdminAuthResponse,
  AdminLogoutResponse,
  UserStatsResponse,
  UsersResponse,
  UserDetailsResponse,
  UserActionResponse,
  BulkApproveResponse,
};

/**
 * Admin Authentication Endpoints
 */

/**
 * Log in admin with username and password
 * Sets HttpOnly cookie on success
 * @param username - Admin username or email
 * @param password - Admin password
 */
export const adminLogin = (username: string, password: string) =>
  api.post<AdminLoginResponse>('/api/admin/auth/login', {
    username,
    password,
  });

/**
 * Log out admin (clears HttpOnly cookie on the server)
 */
export const adminLogout = () =>
  api.post<AdminLogoutResponse>('/api/admin/auth/logout');

/**
 * Fetch the currently logged-in admin (if any)
 * Relies on the HttpOnly cookie that was set by adminLogin()
 */
export const fetchCurrentAdmin = () =>
  api.get<AdminUserResponse>('/api/admin/auth/me');

/**
 * Check if the current admin session is authenticated
 * Useful for checking auth status without fetching full admin data
 */
export const checkAdminAuth = () =>
  api.get<AdminAuthResponse>('/api/admin/auth/check');

/**
 * User Management Endpoints
 */

/**
 * Get list of all users in the system
 */
export const getUsers = () =>
  api.get<UsersResponse>('/api/admin/users');

/**
 * Get detailed information about a specific user
 * @param userId - User's public ID (UUID)
 */
export const getUserDetails = (userId: string) =>
  api.get<UserDetailsResponse>(`/api/admin/users/${userId}`);

/**
 * Approve a user for access to the application
 * @param userId - User's public ID (UUID)
 */
export const approveUser = (userId: string) =>
  api.post<UserActionResponse>(`/api/admin/users/${userId}/approve`);

/**
 * Reject/unapprove a user
 * @param userId - User's public ID (UUID)
 */
export const rejectUser = (userId: string) =>
  api.post<UserActionResponse>(`/api/admin/users/${userId}/reject`);

/**
 * Toggle user active/inactive status
 * @param userId - User's public ID (UUID)
 */
export const toggleUserActiveStatus = (userId: string) =>
  api.post<UserActionResponse>(`/api/admin/users/${userId}/toggle-active`);

/**
 * Bulk approve multiple users
 * @param userIds - Array of user UUIDs to approve
 */
export const bulkApproveUsers = (userIds: string[]) =>
  api.post<BulkApproveResponse>('/api/admin/users/bulk-approve', {
    user_ids: userIds,
  });

/**
 * Get comprehensive user statistics for admin dashboard
 */
export const getUserStats = () =>
  api.get<UserStatsResponse>('/api/admin/users/stats');

/**
 * Admin Management Endpoints (Super Admin Only)
 */

/**
 * Get list of all admins (with pagination)
 * @param page - Page number (default: 1)
 * @param perPage - Items per page (default: 20, max: 100)
 */
export const getAdmins = (page: number = 1, perPage: number = 20) =>
  api.get<{
    status: string;
    admins: AdminUser[];
    pagination: {
      page: number;
      per_page: number;
      total: number;
      pages: number;
      has_next: boolean;
      has_prev: boolean;
    };
  }>(`/api/admin/admins?page=${page}&per_page=${perPage}`);

/**
 * Create a new admin account (Super Admin only)
 * @param adminData - New admin data
 */
export const createAdmin = (adminData: {
  username: string;
  email: string;
  password: string;
  role?: 'admin' | 'super_admin';
  first_name?: string;
  last_name?: string;
}) =>
  api.post<{
    status: string;
    message: string;
    admin: AdminUser;
  }>('/api/admin/admins', {
    username: adminData.username,
    email: adminData.email,
    password: adminData.password,
    role: adminData.role || 'admin',
    first_name: adminData.first_name,
    last_name: adminData.last_name,
  });

/**
 * Utility Functions
 */

/**
 * Check if current admin has super admin privileges
 * @param admin - Current admin user object
 */
export const isSuperAdmin = (admin: AdminUser | null): boolean => {
  return admin?.role === 'super_admin';
};

/**
 * Get admin display name
 * @param admin - Admin user object
 */
export const getAdminDisplayName = (admin: AdminUser): string => {
  if (admin.first_name && admin.last_name) {
    return `${admin.first_name} ${admin.last_name}`;
  }
  if (admin.first_name) {
    return admin.first_name;
  }
  return admin.username;
};

/**
 * Format admin role for display
 * @param role - Admin role
 */
export const formatAdminRole = (role: string): string => {
  switch (role) {
    case 'super_admin':
      return 'Super Admin';
    case 'admin':
      return 'Admin';
    default:
      return role;
  }
};