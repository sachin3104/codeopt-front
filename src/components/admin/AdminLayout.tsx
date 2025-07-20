// src/components/admin/AdminLayout.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import { 
  approveUser, 
  rejectUser, 
  toggleUserActiveStatus, 
  bulkApproveUsers,
  fetchCurrentAdmin,
  exportUsers
} from '@/api/admin';
import type { AdminUser, RegularUser } from '@/types/admin';
import { UserActionType, BulkActionData } from '@/types/admin';
import { UserX } from 'lucide-react';
import { toast } from 'sonner';
import {
  UserStatistics,
  AdminInfo,
  UserManagement,
  UserDetailsModal,
  ConfirmationModal,
  UserFilterBar,
  UserPagination
} from './admin-components';
import { useAdminUsers } from '@/hooks/useAdminUsers';

export default function AdminLayout() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // User management state
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [actionLoadingUsers, setActionLoadingUsers] = useState<Set<string>>(new Set());
  const [actionError, setActionError] = useState<string | null>(null);
  const [isExporting, setIsExporting] = useState(false);

  // Use the new admin users hook
  const {
    users, stats, plans,
    filters,
    isLoadingUsers, isLoadingStats, isLoadingPlans,
    error: usersError,
    onSearchChange,
    onSortChange,
    onPageChange,
    onPerPageChange,
    onProviderChange,
    onReset,
    refetch,
    loadPlans,
    upgradeSubscription,
  } = useAdminUsers();

  // Modal states
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<RegularUser | null>(null);
  const [pendingAction, setPendingAction] = useState<BulkActionData | null>(null);
  const [isPerformingAction, setIsPerformingAction] = useState(false);

  // Component mounted

  // Initialize dashboard data once on mount
  useEffect(() => {
    const initializeDashboard = async () => {
      setIsLoading(true);
      setError(null);

      try {
        // 1) Who am I?
        const { data: me } = await fetchCurrentAdmin();
        if (me.status !== 'success' || !me.admin) {
          // not authenticated, kick back to login
          navigate('/admin/login', { replace: true });
          return;
        }
        setAdmin(me.admin);
      } catch (err: any) {
        // If 401, redirect to login
        if (err.response?.status === 401) {
          navigate('/admin/login', { replace: true });
          return;
        }
        // Otherwise show error
        const msg = err.response?.data?.message || err.message || 'Failed to load dashboard';
        setError(msg);
      } finally {
        setIsLoading(false);
      }
    };

    initializeDashboard();
  }, []); // ← run only once on mount

  // Handle logout
  const handleLogout = () => {
    setAdmin(null);
    navigate('/admin/login', { replace: true });
  };

  // Handle user selection
  const handleUserSelect = useCallback((userId: string, selected: boolean) => {
    setSelectedUsers(prev => {
      const newSet = new Set(prev);
      if (selected) {
        newSet.add(userId);
      } else {
        newSet.delete(userId);
      }
      return newSet;
    });
  }, []);

  // Handle select all users
  const handleSelectAll = useCallback((selected: boolean) => {
    if (selected) {
      setSelectedUsers(new Set(users.map(user => user.id)));
    } else {
      setSelectedUsers(new Set());
    }
  }, [users]);

  // Handle user action
  const handleUserAction = useCallback(async (userId: string, action: UserActionType) => {
    const user = users.find(u => u.id === userId);
    if (!user) return;

    try {
      setActionLoadingUsers(prev => new Set(prev).add(userId));
      setActionError(null);

      let response;
      switch (action) {
        case UserActionType.APPROVE:
          response = await approveUser(userId);
          break;
        case UserActionType.REJECT:
          response = await rejectUser(userId);
          break;
        case UserActionType.TOGGLE_ACTIVE:
          response = await toggleUserActiveStatus(userId);
          break;
        case UserActionType.VIEW_DETAILS:
          setSelectedUser(user);
          setShowUserDetailsModal(true);
          return;

        default:
          return;
      }

      if (response?.data.status === 'success') {
        // Refetch users and stats after successful action
        refetch();
      }
    } catch (err: any) {
      setActionError(err.response?.data?.message || `Failed to ${action} user`);
    } finally {
      setActionLoadingUsers(prev => {
        const newSet = new Set(prev);
        newSet.delete(userId);
        return newSet;
      });
    }
  }, [users]);

  // Handle bulk actions
  const handleBulkAction = useCallback(async (action: UserActionType) => {
    if (selectedUsers.size === 0) return;

    const actionData: BulkActionData = {
      type: action,
      userIds: Array.from(selectedUsers),
      count: selectedUsers.size
    };

    setPendingAction(actionData);
    setShowConfirmationModal(true);
  }, [selectedUsers]);

  // Confirm bulk action
  const confirmBulkAction = useCallback(async () => {
    if (!pendingAction) return;

    try {
      setIsPerformingAction(true);
      setActionError(null);

      let response;
      switch (pendingAction.type) {
        case UserActionType.BULK_APPROVE:
          response = await bulkApproveUsers(pendingAction.userIds);
          break;
        default:
          throw new Error('Unsupported bulk action');
      }

      if (response?.data.status === 'success') {
        // Refetch users and stats after successful action
        refetch();
        setSelectedUsers(new Set());
      }
    } catch (err: any) {
      setActionError(err.response?.data?.message || 'Bulk action failed');
    } finally {
      setIsPerformingAction(false);
      setShowConfirmationModal(false);
      setPendingAction(null);
    }
  }, [pendingAction]);

  // Handle export users - downloads user data as CSV/Excel file
  // Uses current filters (search, auth provider, sort) to export filtered data
  const handleExportUsers = useCallback(async () => {
    try {
      setIsExporting(true);
      setActionError(null);

      const response = await exportUsers(filters);
      
      // Create a blob from the response data
      const blob = new Blob([response.data], { 
        type: response.headers['content-type'] || 'application/octet-stream' 
      });
      
      // Create download link
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      
      // Set filename from response headers or use default
      const contentDisposition = response.headers['content-disposition'];
      let filename = 'users-export.csv';
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1].replace(/['"]/g, '');
        }
      }
      
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('User data exported successfully!');
      
    } catch (err: any) {
      const errorMessage = err.response?.data?.message || 'Failed to export users';
      setActionError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsExporting(false);
    }
  }, [filters]);

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      
      {/* Admin Header */}
      <AdminHeader admin={admin} onLogout={handleLogout} />
      
      {/* Main Content Area */}
      <main className="flex-1 min-h-[calc(100vh-200px)]">
          <div className="w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 sm:p-8 space-y-8">
              
              {/* User Statistics */}
              <UserStatistics stats={stats} />

              {/* Admin Information */}
              <AdminInfo admin={admin} />

              {/* User Management Section */}
              <div>
                {/* Filter Bar */}
                <UserFilterBar
                  filters={filters}
                  onSearchChange={onSearchChange}
                  onSortChange={onSortChange}
                  onProviderChange={onProviderChange}
                  onReset={onReset}
                  onExport={handleExportUsers}
                  isExporting={isExporting}
                />

                {/* User Table */}
                <UserManagement
                  users={users}
                  selectedUsers={selectedUsers}
                  isLoadingUsers={isLoadingUsers}
                  actionLoadingUsers={actionLoadingUsers}
                  error={usersError}
                  actionError={actionError}
                  onUserSelect={handleUserSelect}
                  onSelectAll={handleSelectAll}
                  onUserAction={handleUserAction}
                  onPlanChange={async (userId, planType) => {
                    await upgradeSubscription(userId, planType as 'pro' | 'ultimate', 30);
                  }}
                  onBulkAction={handleBulkAction}
                  onClearError={() => {}} // Handled by hook
                  onClearActionError={() => setActionError(null)}
                  onClearSelection={() => setSelectedUsers(new Set())}
                />

                {/* Pagination - Positioned at bottom */}
                <div className="mt-8">
                  <UserPagination
                    currentPage={filters.page || 1}
                    totalPages={Math.max(1, Math.ceil((stats?.total_users || 0) / 50))}
                    onPageChange={onPageChange}
                    isLoading={isLoadingUsers}
                  />
                </div>
              </div>

            </div>
          </div>
        </div>
      </main>

      {/* User Details Modal */}
      <UserDetailsModal
        user={selectedUser}
        isOpen={showUserDetailsModal}
        onClose={() => setShowUserDetailsModal(false)}
        onUserAction={handleUserAction}
      />

      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={showConfirmationModal}
        pendingAction={pendingAction}
        isPerformingAction={isPerformingAction}
        onConfirm={confirmBulkAction}
        onCancel={() => setShowConfirmationModal(false)}
      />


      
    </div>
  );
}