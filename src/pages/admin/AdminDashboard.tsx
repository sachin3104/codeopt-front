// src/pages/admin/AdminDashboard.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { fetchCurrentAdmin, getUserStats, getAdminDisplayName, formatAdminRole } from '@/api/admin';
import type { AdminUser, UserStats } from '@/types/admin';
import { 
  CheckCircle, 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  TrendingUp, 
  Shield, 
  Crown,
  Settings,
  BarChart3,
  FileText,
  ArrowRight,
  Activity,
  Globe,
  AtSign
} from 'lucide-react';

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize dashboard data
  useEffect(() => {
    const initializeDashboard = async () => {
      try {
        setIsLoading(true);
        setError(null);

        // Fetch current admin profile
        const adminResponse = await fetchCurrentAdmin();
        
        if (adminResponse.data.status === 'success' && adminResponse.data.admin) {
          setAdmin(adminResponse.data.admin);
          
          // Fetch user statistics
          try {
            const statsResponse = await getUserStats();
            if (statsResponse.data.status === 'success') {
              setStats(statsResponse.data.stats);
            }
          } catch (statsError) {
            console.warn('Failed to fetch user stats:', statsError);
            // Don't fail the whole dashboard if stats fail
          }
        } else {
          // Invalid response, redirect to login
          navigate('/admin/login', { replace: true });
          return;
        }
      } catch (err: any) {
        console.error('Dashboard initialization failed:', err);
        
        if (err.response?.status === 401) {
          // Unauthorized, redirect to login
          navigate('/admin/login', { replace: true });
          return;
        }
        
        // Other errors
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load dashboard';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
      }
    };

    initializeDashboard();
  }, [navigate]);

  // Handle logout
  const handleLogout = () => {
    // Clear local state
    setAdmin(null);
    setStats(null);
    // Redirect to login
    navigate('/admin/login', { replace: true });
  };

  // Navigate to user management
  const handleNavigateToUsers = () => {
    navigate('/admin/users');
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl p-8 shadow-2xl">
          <div className="flex items-center justify-center gap-3">
            <div className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            <span className="text-white/80 text-lg">Loading dashboard...</span>
          </div>
        </div>
      </div>
    );
  }

  // Show error state
  if (error || !admin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900 flex items-center justify-center">
        <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-red-500/20 rounded-2xl p-8 shadow-2xl max-w-md mx-auto">
          <div className="text-center">
            <div className="w-12 h-12 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <UserX size={24} className="text-red-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">Dashboard Error</h2>
            <p className="text-white/70 mb-6">{error || 'Failed to load admin dashboard'}</p>
            <button
              onClick={() => navigate('/admin/login', { replace: true })}
              className="px-4 py-2 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white rounded-lg transition-all duration-300"
            >
              Return to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Get role icon
  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'super_admin':
        return <Crown size={20} className="text-yellow-400" />;
      case 'admin':
        return <Shield size={20} className="text-blue-400" />;
      default:
        return <Shield size={20} className="text-gray-400" />;
    }
  };

  return (
    <AdminLayout
      admin={admin}
      onLogout={handleLogout}
      title="Admin Dashboard"
      subtitle="Welcome to the administration panel"
    >
      {/* Success Message Section */}
      <div className="mb-8">
        <div className="backdrop-blur-sm bg-gradient-to-r from-green-500/20 via-green-500/10 to-green-500/20 border border-green-500/30 rounded-xl p-6">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-green-500/30 rounded-full flex items-center justify-center flex-shrink-0">
              <CheckCircle size={24} className="text-green-400" />
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-semibold text-white mb-1">
                Welcome back, {getAdminDisplayName(admin)}!
              </h2>
              <p className="text-green-200">
                You have successfully logged into the admin panel.
              </p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-white/10 rounded-lg">
              {getRoleIcon(admin.role)}
              <span className="text-white text-sm font-medium">
                {formatAdminRole(admin.role)}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          
          {/* User Management Card */}
          <button
            onClick={handleNavigateToUsers}
            className="backdrop-blur-sm bg-white/5 border border-white/10 hover:border-white/20 rounded-xl p-6 text-left transition-all duration-300 hover:bg-white/10 group"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-blue-500/20 rounded-full flex items-center justify-center group-hover:bg-blue-500/30 transition-colors">
                <Users size={24} className="text-blue-400" />
              </div>
              <ArrowRight size={20} className="text-white/50 group-hover:text-white/80 transition-colors" />
            </div>
            <h4 className="text-white font-semibold mb-2">User Management</h4>
            <p className="text-white/70 text-sm mb-3">
              Manage user accounts, approvals, and permissions
            </p>
            {stats && (
              <div className="flex items-center gap-4 text-xs">
                <span className="text-blue-400">{stats.total_users} Total</span>
                <span className="text-yellow-400">{stats.pending_users} Pending</span>
              </div>
            )}
          </button>

          {/* Analytics Card (Coming Soon) */}
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6 opacity-60">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-purple-500/20 rounded-full flex items-center justify-center">
                <BarChart3 size={24} className="text-purple-400" />
              </div>
              <span className="text-xs text-white/50 bg-white/10 px-2 py-1 rounded-full">Coming Soon</span>
            </div>
            <h4 className="text-white font-semibold mb-2">Analytics</h4>
            <p className="text-white/70 text-sm">
              View detailed analytics and reports
            </p>
          </div>

          {/* System Settings Card (Coming Soon) */}
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6 opacity-60">
            <div className="flex items-center justify-between mb-4">
              <div className="w-12 h-12 bg-gray-500/20 rounded-full flex items-center justify-center">
                <Settings size={24} className="text-gray-400" />
              </div>
              <span className="text-xs text-white/50 bg-white/10 px-2 py-1 rounded-full">Coming Soon</span>
            </div>
            <h4 className="text-white font-semibold mb-2">System Settings</h4>
            <p className="text-white/70 text-sm">
              Configure application settings
            </p>
          </div>
        </div>
      </div>

      {/* System Overview Section */}
      {stats && (
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-white">System Overview</h3>
            <button
              onClick={handleNavigateToUsers}
              className="text-blue-400 hover:text-blue-300 text-sm font-medium flex items-center gap-1 transition-colors"
            >
              View All Users
              <ArrowRight size={14} />
            </button>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Total Users */}
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Users size={20} className="text-blue-400" />
                <span className="text-white/70 text-sm font-medium">Total Users</span>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stats.total_users.toLocaleString()}</p>
              <div className="flex items-center gap-2 text-xs">
                <Activity size={12} className="text-green-400" />
                <span className="text-green-400">{stats.active_users} active</span>
              </div>
            </div>

            {/* Approved Users */}
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <UserCheck size={20} className="text-green-400" />
                <span className="text-white/70 text-sm font-medium">Approved</span>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stats.approved_users.toLocaleString()}</p>
              <div className="text-xs text-white/60">
                {((stats.approved_users / stats.total_users) * 100).toFixed(1)}% of total
              </div>
            </div>

            {/* Pending Users */}
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Clock size={20} className="text-yellow-400" />
                <span className="text-white/70 text-sm font-medium">Pending</span>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stats.pending_users.toLocaleString()}</p>
              {stats.pending_users > 0 && (
                <button
                  onClick={handleNavigateToUsers}
                  className="text-xs text-yellow-400 hover:text-yellow-300 transition-colors"
                >
                  Review pending →
                </button>
              )}
            </div>

            {/* Recent Users */}
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp size={20} className="text-purple-400" />
                <span className="text-white/70 text-sm font-medium">Recent (7d)</span>
              </div>
              <p className="text-2xl font-bold text-white mb-1">{stats.recent_users.toLocaleString()}</p>
              <div className="text-xs text-white/60">
                New registrations
              </div>
            </div>
          </div>

          {/* Auth Providers Breakdown */}
          <div className="mt-6 backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6">
            <h4 className="text-white font-medium mb-4">Authentication Providers</h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              
              {/* Local Auth */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gray-500/20 rounded-full flex items-center justify-center">
                  <AtSign size={16} className="text-gray-400" />
                </div>
                <div>
                  <p className="text-white font-medium">{stats.auth_providers.local.toLocaleString()}</p>
                  <p className="text-white/60 text-sm">Local Accounts</p>
                </div>
              </div>

              {/* Google Auth */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-500/20 rounded-full flex items-center justify-center">
                  <Globe size={16} className="text-blue-400" />
                </div>
                <div>
                  <p className="text-white font-medium">{stats.auth_providers.google.toLocaleString()}</p>
                  <p className="text-white/60 text-sm">Google</p>
                </div>
              </div>

              {/* LinkedIn Auth */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-600/20 rounded-full flex items-center justify-center">
                  <Shield size={16} className="text-blue-500" />
                </div>
                <div>
                  <p className="text-white font-medium">{stats.auth_providers.linkedin.toLocaleString()}</p>
                  <p className="text-white/60 text-sm">LinkedIn</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Admin Information Section */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Admin Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* Admin Details Card */}
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6">
            <h4 className="text-white font-medium mb-4">Account Details</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Username:</span>
                <span className="text-white font-medium">{admin.username}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Email:</span>
                <span className="text-white font-medium">{admin.email}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Role:</span>
                <div className="flex items-center gap-2">
                  {getRoleIcon(admin.role)}
                  <span className="text-white font-medium">{formatAdminRole(admin.role)}</span>
                </div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Account Status:</span>
                <span className="text-green-400 font-medium">Active</span>
              </div>
            </div>
          </div>

          {/* Session Info Card */}
          <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6">
            <h4 className="text-white font-medium mb-4">Session Information</h4>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-white/70">Last Login:</span>
                <span className="text-white font-medium">
                  {admin.last_login 
                    ? new Date(admin.last_login).toLocaleString()
                    : 'First login'
                  }
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Account Created:</span>
                <span className="text-white font-medium">
                  {admin.created_at 
                    ? new Date(admin.created_at).toLocaleDateString()
                    : 'Unknown'
                  }
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-white/70">Session Status:</span>
                <div className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                  <span className="text-green-400 font-medium">Active</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity Section (Placeholder) */}
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
        <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6">
          <div className="text-center py-8">
            <FileText size={48} className="text-white/30 mx-auto mb-4" />
            <h4 className="text-white font-medium mb-2">Activity Log Coming Soon</h4>
            <p className="text-white/60">
              Track admin actions, user registrations, and system events
            </p>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}