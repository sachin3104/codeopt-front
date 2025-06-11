// src/pages/admin/AdminDashboard.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '@/components/admin/AdminLayout';
import { fetchCurrentAdmin, getUserStats, getAdminDisplayName, formatAdminRole } from '@/api/admin';
import type { AdminUser, UserStats } from '@/types/admin';
import { CheckCircle, Users, UserCheck, UserX, Clock, TrendingUp, Shield, Crown } from 'lucide-react';

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

      {/* Admin Info Section */}
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

          {/* Login Info Card */}
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

      {/* User Statistics Section */}
      {stats && (
        <div className="mb-8">
          <h3 className="text-lg font-semibold text-white mb-4">System Overview</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            
            {/* Total Users */}
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Users size={20} className="text-blue-400" />
                <span className="text-white/70 text-sm font-medium">Total Users</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats.total_users.toLocaleString()}</p>
            </div>

            {/* Approved Users */}
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <UserCheck size={20} className="text-green-400" />
                <span className="text-white/70 text-sm font-medium">Approved</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats.approved_users.toLocaleString()}</p>
            </div>

            {/* Pending Users */}
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <Clock size={20} className="text-yellow-400" />
                <span className="text-white/70 text-sm font-medium">Pending</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats.pending_users.toLocaleString()}</p>
            </div>

            {/* Recent Users */}
            <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <TrendingUp size={20} className="text-purple-400" />
                <span className="text-white/70 text-sm font-medium">Recent (7d)</span>
              </div>
              <p className="text-2xl font-bold text-white">{stats.recent_users.toLocaleString()}</p>
            </div>
          </div>
        </div>
      )}

      {/* Coming Soon Section */}
      <div className="mb-8">
        <div className="backdrop-blur-sm bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 border border-white/10 rounded-xl p-6 text-center">
          <h3 className="text-xl font-semibold text-white mb-2">More Features Coming Soon</h3>
          <p className="text-white/70">
            User management, analytics, system settings, and more administrative features will be added here.
          </p>
        </div>
      </div>
    </AdminLayout>
  );
}