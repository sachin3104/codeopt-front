// src/types/admin.ts
// Admin-specific TypeScript interfaces for the admin frontend

// Admin user object returned by admin API endpoints
export interface AdminUser {
  id: string; // public_id from backend
  username: string;
  email: string;
  role: 'admin' | 'super_admin';
  first_name?: string;
  last_name?: string;
  is_active: boolean;
  created_at?: string;
  last_login?: string;
}

// Response from admin login endpoint
export interface AdminLoginResponse {
  status: string;
  message: string;
  admin: AdminUser;
}

// Response from admin profile/me endpoint
export interface AdminUserResponse {
  status: string;
  admin: AdminUser;
}

// Response from admin auth check endpoint
export interface AdminAuthResponse {
  status: string;
  authenticated: boolean;
  admin?: AdminUser;
  message?: string;
}

// Response from admin logout endpoint
export interface AdminLogoutResponse {
  status: string;
  message: string;
}

// User statistics for admin dashboard
export interface UserStats {
  total_users: number;
  approved_users: number;
  pending_users: number;
  active_users: number;
  inactive_users: number;
  recent_users: number;
  auth_providers: {
    local: number;
    google: number;
    linkedin: number;
  };
}

// Response from user stats endpoint
export interface UserStatsResponse {
  status: string;
  stats: UserStats;
}

// Regular user object for admin user management
export interface RegularUser {
  id: string; // public_id from backend
  email: string;
  first_name?: string;
  last_name?: string;
  username?: string;
  is_approved: boolean;
  is_active: boolean;
  auth_provider: string;
  created_at?: string;
  last_login?: string;
  profile_picture?: string;
}

// Response from get users endpoint
export interface UsersResponse {
  status: string;
  users: RegularUser[];
  total: number;
  pagination?: PaginationInfo;
}

// Response from user details endpoint
export interface UserDetailsResponse {
  status: string;
  user: RegularUser;
}

// Response from user approval/rejection/toggle endpoints
export interface UserActionResponse {
  status: string;
  message: string;
  user: RegularUser;
}

// Response from bulk approve endpoint
export interface BulkApproveResponse {
  status: string;
  message: string;
  updated_count: number;
}

// Generic API error response
export interface AdminApiError {
  status: string;
  message: string;
  error?: string;
}

// Admin form data types
export interface AdminLoginFormData {
  username: string;
  password: string;
}

// Loading states for admin operations
export interface AdminLoadingStates {
  login: boolean;
  logout: boolean;
  fetchingProfile: boolean;
  fetchingStats: boolean;
}

// Admin dashboard data structure
export interface AdminDashboardData {
  admin: AdminUser | null;
  stats: UserStats | null;
  isLoading: boolean;
  error: string | null;
}

// ============================================
// NEW USER MANAGEMENT TYPES
// ============================================

// User filters for the user management page
export interface UserFilters {
  search: string;
  status: 'all' | 'approved' | 'pending' | 'active' | 'inactive';
  auth_provider: 'all' | 'local' | 'google' | 'linkedin';
  sort_by: 'created_at' | 'username' | 'email' | 'last_login';
  sort_order: 'asc' | 'desc';
}

// Pagination information
export interface PaginationInfo {
  page: number;
  per_page: number;
  total: number;
  pages: number;
  has_next: boolean;
  has_prev: boolean;
}

// User table state management
export interface UserTableState {
  users: RegularUser[];
  selectedUsers: Set<string>;
  filters: UserFilters;
  pagination: PaginationInfo;
  isLoading: boolean;
  error: string | null;
}

// User action types enum
export enum UserActionType {
  APPROVE = 'approve',
  REJECT = 'reject',
  TOGGLE_ACTIVE = 'toggle-active',
  VIEW_DETAILS = 'view-details',
  BULK_APPROVE = 'bulk-approve',
  BULK_REJECT = 'bulk-reject',
  BULK_ACTIVATE = 'bulk-activate',
  BULK_DEACTIVATE = 'bulk-deactivate'
}

// Bulk action data
export interface BulkActionData {
  type: UserActionType;
  userIds: string[];
  count: number;
}

// User management comprehensive state
export interface UserManagementState {
  // User data
  users: RegularUser[];
  stats: UserStats | null;
  
  // UI state
  selectedUsers: Set<string>;
  filters: UserFilters;
  pagination: PaginationInfo;
  
  // Loading states
  isLoading: boolean;
  isLoadingStats: boolean;
  isPerformingAction: boolean;
  actionLoadingUsers: Set<string>; // Track which users have actions in progress
  
  // Error states
  error: string | null;
  actionError: string | null;
  
  // Modal states
  showUserDetailsModal: boolean;
  showConfirmationModal: boolean;
  selectedUser: RegularUser | null;
  pendingAction: BulkActionData | null;
}

// User details modal props
export interface UserDetailsModalProps {
  user: RegularUser | null;
  isOpen: boolean;
  onClose: () => void;
  onUserAction?: (userId: string, action: UserActionType) => void;
}

// Confirmation modal props
export interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

// User row props
export interface UserRowProps {
  user: RegularUser;
  isSelected: boolean;
  isLoading: boolean;
  onSelect: (userId: string, selected: boolean) => void;
  onUserAction: (userId: string, action: UserActionType) => void;
}

// User stats card props
export interface UserStatsCardProps {
  title: string;
  value: number;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  color: string;
  trend?: {
    value: number;
    isPositive: boolean;
  };
}

// User management API parameters
export interface GetUsersParams {
  page?: number;
  per_page?: number;
  search?: string;
  status?: string;
  auth_provider?: string;
  sort_by?: string;
  sort_order?: string;
}

// User action request data
export interface UserActionRequest {
  action: UserActionType;
  userId?: string;
  userIds?: string[];
  additionalData?: Record<string, any>;
}

// User management hooks return types
export interface UseUserManagementReturn {
  state: UserManagementState;
  actions: {
    loadUsers: (params?: GetUsersParams) => Promise<void>;
    loadStats: () => Promise<void>;
    performUserAction: (request: UserActionRequest) => Promise<void>;
    updateFilters: (filters: Partial<UserFilters>) => void;
    updatePagination: (pagination: Partial<PaginationInfo>) => void;
    selectUser: (userId: string, selected: boolean) => void;
    selectAllUsers: (selected: boolean) => void;
    clearSelection: () => void;
    showUserDetails: (user: RegularUser) => void;
    hideUserDetails: () => void;
    showConfirmation: (action: BulkActionData) => void;
    hideConfirmation: () => void;
    clearErrors: () => void;
  };
}

// Status badge props
export interface StatusBadgeProps {
  status: 'approved' | 'pending' | 'active' | 'inactive';
  size?: 'sm' | 'md' | 'lg';
}

// Auth provider badge props
export interface AuthProviderBadgeProps {
  provider: 'local' | 'google' | 'linkedin';
  size?: 'sm' | 'md' | 'lg';
}

// Default filter values
export const DEFAULT_USER_FILTERS: UserFilters = {
  search: '',
  status: 'all',
  auth_provider: 'all',
  sort_by: 'created_at',
  sort_order: 'desc'
};

// Default pagination values
export const DEFAULT_PAGINATION: PaginationInfo = {
  page: 1,
  per_page: 20,
  total: 0,
  pages: 0,
  has_next: false,
  has_prev: false
};

// User status options for filters
export const USER_STATUS_OPTIONS = [
  { value: 'all', label: 'All Users' },
  { value: 'approved', label: 'Approved' },
  { value: 'pending', label: 'Pending' },
  { value: 'active', label: 'Active' },
  { value: 'inactive', label: 'Inactive' }
] as const;

// Auth provider options for filters
export const AUTH_PROVIDER_OPTIONS = [
  { value: 'all', label: 'All Providers' },
  { value: 'local', label: 'Local' },
  { value: 'google', label: 'Google' },
  { value: 'linkedin', label: 'LinkedIn' }
] as const;

// Sort options for user table
export const USER_SORT_OPTIONS = [
  { value: 'created_at', label: 'Date Created' },
  { value: 'username', label: 'Username' },
  { value: 'email', label: 'Email' },
  { value: 'last_login', label: 'Last Login' }
] as const;