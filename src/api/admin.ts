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
  GetUsersParams, // NEW IMPORT
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
  GetUsersParams, // NEW EXPORT
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
export const adminLogin = (username: string, password: string) => {
  return api.post<AdminLoginResponse>('/api/admin/auth/login', {
    username,
    password,
  });
};

/**
 * Log out admin (clears HttpOnly cookie on the server)
 */
export const adminLogout = () => {
  return api.post<AdminLogoutResponse>('/api/admin/auth/logout');
};

/**
 * Fetch the currently logged-in admin (if any)
 * Relies on the HttpOnly cookie that was set by adminLogin()
 */
export const fetchCurrentAdmin = () => {
  return api.get<AdminUserResponse>('/api/admin/auth/me');
};

/**
 * Check if the current admin session is authenticated
 * Useful for checking auth status without fetching full admin data
 */
export const checkAdminAuth = () => {
  return api.get<AdminAuthResponse>('/api/admin/auth/check');
};

/**
 * User Management Endpoints
 */

/**
 * Get list of all users in the system with optional filtering and pagination
 * MODIFIED: Added support for pagination, search, and filtering
 * @param params - Optional query parameters for filtering, pagination, and sorting
 */
export const getUsers = (params?: GetUsersParams) => {
  const qp = new URLSearchParams();

  if (params?.page)       qp.append('page',    params.page.toString());
  if (params?.per_page)   qp.append('per_page', params.per_page.toString());
  if (params?.search?.trim()) qp.append('search', params.search.trim());

  // only local or google
  if (params?.auth_provider && params.auth_provider !== 'all') {
    qp.append('auth_provider', params.auth_provider);
  }

  // only created_at or last_login
  if (params?.sort_by)    qp.append('sort_by',    params.sort_by);
  if (params?.sort_order) qp.append('sort_order', params.sort_order);

  const qs = qp.toString();
  return api.get<UsersResponse>(`/api/admin/users${qs ? `?${qs}` : ''}`);
};

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
 * Export user data as CSV/Excel
 * @param params - Optional query parameters for filtering (same as getUsers)
 */
export const exportUsers = (params?: GetUsersParams) => {
  const qp = new URLSearchParams();

  if (params?.search?.trim()) qp.append('search', params.search.trim());

  // only local or google
  if (params?.auth_provider && params.auth_provider !== 'all') {
    qp.append('auth_provider', params.auth_provider);
  }

  // only created_at or last_login
  if (params?.sort_by)    qp.append('sort_by',    params.sort_by);
  if (params?.sort_order) qp.append('sort_order', params.sort_order);

  const qs = qp.toString();
  return api.get(`/api/admin/users/export${qs ? `?${qs}` : ''}`, {
    responseType: 'blob'
  });
};

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
 * NEW: Additional User Management Functions
 */

/**
 * Bulk reject multiple users
 * @param userIds - Array of user UUIDs to reject
 */
export const bulkRejectUsers = (userIds: string[]) =>
  api.post<BulkApproveResponse>('/api/admin/users/bulk-reject', {
    user_ids: userIds,
  });

/**
 * Bulk activate multiple users
 * @param userIds - Array of user UUIDs to activate
 */
export const bulkActivateUsers = (userIds: string[]) =>
  api.post<BulkApproveResponse>('/api/admin/users/bulk-activate', {
    user_ids: userIds,
  });

/**
 * Bulk deactivate multiple users
 * @param userIds - Array of user UUIDs to deactivate
 */
export const bulkDeactivateUsers = (userIds: string[]) =>
  api.post<BulkApproveResponse>('/api/admin/users/bulk-deactivate', {
    user_ids: userIds,
  });

/**
 * Get users with advanced filtering (for search as you type)
 * @param searchTerm - Search term to filter users
 * @param limit - Maximum number of results (default: 10)
 */
export const searchUsers = (searchTerm: string, limit: number = 10) =>
  api.get<UsersResponse>(`/api/admin/users/search?q=${encodeURIComponent(searchTerm)}&limit=${limit}`);

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
 * Get user display name
 * @param user - Regular user object
 */
export const getUserDisplayName = (user: { 
  username?: string; 
  first_name?: string; 
  last_name?: string; 
  email: string; 
}): string => {
  if (user.first_name && user.last_name) {
    return `${user.first_name} ${user.last_name}`;
  }
  if (user.first_name) {
    return user.first_name;
  }
  if (user.username) {
    return user.username;
  }
  return user.email;
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

/**
 * Format user status for display
 * @param user - User object
 */
export const formatUserStatus = (user: {
  is_approved: boolean;
  is_active: boolean;
}): { status: string; color: string; description: string } => {
  if (!user.is_approved) {
    return {
      status: 'Pending',
      color: 'yellow',
      description: 'Waiting for admin approval'
    };
  }
  
  if (!user.is_active) {
    return {
      status: 'Inactive',
      color: 'red',
      description: 'Account deactivated'
    };
  }
  
  return {
    status: 'Active',
    color: 'green',
    description: 'Approved and active'
  };
};

/**
 * Format auth provider for display
 * @param provider - Auth provider string
 */
export const formatAuthProvider = (provider: string): string => {
  switch (provider.toLowerCase()) {
    case 'local':
      return 'Local';
    case 'google':
      return 'Google';
    default:
      return provider;
  }
};

/**
 * Format date for display
 * @param dateString - ISO date string
 */
export const formatDate = (dateString?: string): string => {
  if (!dateString) return 'Never';
  
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  } catch (error) {
    return 'Invalid date';
  }
};

/**
 * Build query parameters for API calls
 * @param params - Parameters object
 */
export const buildQueryParams = (params: Record<string, any>): string => {
  const queryParams = new URLSearchParams();
  
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '' && value !== 'all') {
      queryParams.append(key, value.toString());
    }
  });
  
  return queryParams.toString();
};

/**
 * Subscription Management Endpoints
 */

/**
 * Fetch all available subscription plans
 */
export const getSubscriptionPlans = () =>
  api.get<{ status: string; plans: { id: string; plan_type: string; name: string; description?: string }[] }>('/api/admin/subscription/plans');

/**
 * Upgrade a user's subscription
 * @param userId - UUID of the user
 * @param planType - e.g. 'pro' | 'ultimate' | 'free'
 * @param durationDays - length in days
 */
export const upgradeUserSubscription = (
  userId: string,
  planType: 'pro' | 'ultimate' | 'free',
  durationDays: number
) => api.post(`/api/admin/users/${userId}/upgrade-subscription`, {
  plan_type: planType,
  duration_days: durationDays,
});