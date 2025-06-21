// src/components/admin/AdminLayout.tsx
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import AdminHeader from './AdminHeader';
import { 
  getUsers, 
  approveUser, 
  rejectUser, 
  toggleUserActiveStatus, 
  bulkApproveUsers,
  fetchCurrentAdmin, 
  getUserStats
} from '@/api/admin';
import type { AdminUser, UserStats, RegularUser } from '@/types/admin';
import { UserActionType, BulkActionData } from '@/types/admin';
import { UserX } from 'lucide-react';
import {
  WelcomeMessage,
  UserStatistics,
  AdminInfo,
  UserManagement,
  UserDetailsModal,
  ConfirmationModal
} from './admin-components';

export default function AdminLayout() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState<AdminUser | null>(null);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // User management state
  const [users, setUsers] = useState<RegularUser[]>([]);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [isLoadingUsers, setIsLoadingUsers] = useState(true);
  const [actionLoadingUsers, setActionLoadingUsers] = useState<Set<string>>(new Set());
  const [actionError, setActionError] = useState<string | null>(null);

  // Modal states
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<RegularUser | null>(null);
  const [pendingAction, setPendingAction] = useState<BulkActionData | null>(null);
  const [isPerformingAction, setIsPerformingAction] = useState(false);

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
          }

          // Fetch users
          try {
            const usersResponse = await getUsers();
            if (usersResponse.data.status === 'success') {
              setUsers(usersResponse.data.users);
            }
          } catch (usersError) {
            console.warn('Failed to fetch users:', usersError);
          }
        } else {
          navigate('/admin/login', { replace: true });
          return;
        }
      } catch (err: any) {
        console.error('Dashboard initialization failed:', err);
        
        if (err.response?.status === 401) {
          navigate('/admin/login', { replace: true });
          return;
        }
        
        const errorMessage = err.response?.data?.message || err.message || 'Failed to load dashboard';
        setError(errorMessage);
      } finally {
        setIsLoading(false);
        setIsLoadingUsers(false);
      }
    };

    initializeDashboard();
  }, [navigate]);

  // Handle logout
  const handleLogout = () => {
    setAdmin(null);
    setStats(null);
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
        // Update user in local state
        setUsers(prev => prev.map(u => 
          u.id === userId ? response.data.user : u
        ));
        // Reload stats
        try {
          const statsResponse = await getUserStats();
          if (statsResponse.data.status === 'success') {
            setStats(statsResponse.data.stats);
          }
        } catch (statsError) {
          console.warn('Failed to reload stats:', statsError);
        }
      }
    } catch (err: any) {
      console.error(`Failed to ${action} user:`, err);
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
        // Reload users and stats
        try {
          const [usersResponse, statsResponse] = await Promise.all([
            getUsers(),
            getUserStats()
          ]);
          
          if (usersResponse.data.status === 'success') {
            setUsers(usersResponse.data.users);
          }
          
          if (statsResponse.data.status === 'success') {
            setStats(statsResponse.data.stats);
          }
        } catch (error) {
          console.warn('Failed to reload data:', error);
        }
        
        setSelectedUsers(new Set());
      }
    } catch (err: any) {
      console.error('Bulk action failed:', err);
      setActionError(err.response?.data?.message || 'Bulk action failed');
    } finally {
      setIsPerformingAction(false);
      setShowConfirmationModal(false);
      setPendingAction(null);
    }
  }, [pendingAction]);

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
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl shadow-2xl overflow-hidden">
            <div className="p-6 sm:p-8 space-y-8">
              
              {/* Welcome Message */}
              <WelcomeMessage admin={admin} />

              {/* User Statistics */}
              <UserStatistics stats={stats} />

              {/* Admin Information */}
              <AdminInfo admin={admin} />

              {/* User Management */}
              <UserManagement
                users={users}
                selectedUsers={selectedUsers}
                isLoadingUsers={isLoadingUsers}
                actionLoadingUsers={actionLoadingUsers}
                error={error}
                actionError={actionError}
                onUserSelect={handleUserSelect}
                onSelectAll={handleSelectAll}
                onUserAction={handleUserAction}
                onBulkAction={handleBulkAction}
                onClearError={() => setError(null)}
                onClearActionError={() => setActionError(null)}
                onClearSelection={() => setSelectedUsers(new Set())}
              />

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