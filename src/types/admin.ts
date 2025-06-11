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
  }
  
  // Response from get users endpoint
  export interface UsersResponse {
    status: string;
    users: RegularUser[];
    total: number;
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