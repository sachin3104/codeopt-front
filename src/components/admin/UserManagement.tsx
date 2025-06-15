// src/components/admin/UserManagement.tsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { 
  Users, 
  UserCheck, 
  UserX, 
  Clock, 
  TrendingUp, 
  Search, 
  Filter, 
  CheckCircle, 
  XCircle, 
  MoreVertical, 
  Eye, 
  UserPlus, 
  UserMinus,
  ChevronLeft,
  ChevronRight,
  AlertCircle,
  Loader2,
  Shield,
  Globe,
  AtSign
} from 'lucide-react';
import { 
  getUsers, 
  getUserStats, 
  approveUser, 
  rejectUser, 
  toggleUserActiveStatus, 
  bulkApproveUsers,
  getUserDisplayName,
  formatUserStatus,
  formatAuthProvider,
  formatDate
} from '@/api/admin';
import { 
  RegularUser, 
  UserStats, 
  UserFilters, 
  PaginationInfo, 
  UserActionType,
  BulkActionData,
  GetUsersParams,
  DEFAULT_USER_FILTERS,
  DEFAULT_PAGINATION,
  USER_STATUS_OPTIONS,
  AUTH_PROVIDER_OPTIONS,
  USER_SORT_OPTIONS
} from '@/types/admin';

interface UserManagementProps {
  className?: string;
}

export default function UserManagement({ className = '' }: UserManagementProps) {
  // State management
  const [users, setUsers] = useState<RegularUser[]>([]);
  const [stats, setStats] = useState<UserStats | null>(null);
  const [selectedUsers, setSelectedUsers] = useState<Set<string>>(new Set());
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    status: 'all',
    auth_provider: 'all',
    sort_by: 'created_at',
    sort_order: 'desc'
  });
  const [pagination, setPagination] = useState<PaginationInfo>({
    page: 1,
    per_page: 20,
    total: 0,
    pages: 0,
    has_next: false,
    has_prev: false
  });

  // Loading states
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isPerformingAction, setIsPerformingAction] = useState(false);
  const [actionLoadingUsers, setActionLoadingUsers] = useState<Set<string>>(new Set());

  // Error states
  const [error, setError] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  // Modal states
  const [showUserDetailsModal, setShowUserDetailsModal] = useState(false);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState<RegularUser | null>(null);
  const [pendingAction, setPendingAction] = useState<BulkActionData | null>(null);

  // Load users with current filters and pagination
  const loadUsers = useCallback(async (params?: GetUsersParams) => {
    try {
      setIsLoading(true);
      setError(null);

      const queryParams = params || {
        page: pagination.page,
        per_page: pagination.per_page,
        search: filters.search,
        status: filters.status,
        auth_provider: filters.auth_provider,
        sort_by: filters.sort_by,
        sort_order: filters.sort_order
      };

      const response = await getUsers(queryParams);
      
      if (response.data.status === 'success') {
        setUsers(response.data.users);
        if (response.data.pagination) {
          setPagination(response.data.pagination);
        } else {
          setPagination(prev => ({ ...prev, total: response.data.total }));
        }
      } else {
        setError('Failed to load users');
      }
    } catch (err: any) {
      console.error('Failed to load users:', err);
      setError(err.response?.data?.message || 'Failed to load users');
    } finally {
      setIsLoading(false);
    }
  }, [filters, pagination.page, pagination.per_page]);

  // Load user statistics
  const loadStats = useCallback(async () => {
    try {
      setIsLoadingStats(true);
      const response = await getUserStats();
      
      if (response.data.status === 'success') {
        setStats(response.data.stats);
      }
    } catch (err: any) {
      console.warn('Failed to load user stats:', err);
    } finally {
      setIsLoadingStats(false);
    }
  }, []);

  // Initial load
  useEffect(() => {
    loadUsers();
    loadStats();
  }, []);

  // Reload users when filters change
  useEffect(() => {
    if (pagination.page !== 1) {
      setPagination(prev => ({ ...prev, page: 1 }));
    } else {
      loadUsers();
    }
  }, [filters]);

  // Reload users when pagination changes
  useEffect(() => {
    loadUsers();
  }, [pagination.page, pagination.per_page]);

  // Handle filter changes
  const handleFilterChange = useCallback((key: keyof UserFilters, value: any) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  }, []);

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

  // Handle single user action
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
        loadStats();
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
  }, [users, loadStats]);

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
        // Add other bulk actions here when backend supports them
        default:
          throw new Error('Unsupported bulk action');
      }

      if (response?.data.status === 'success') {
        // Reload users and stats
        await Promise.all([loadUsers(), loadStats()]);
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
  }, [pendingAction, loadUsers, loadStats]);

  // Pagination helpers
  const handlePageChange = useCallback((newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  }, []);

  // Get status badge component
  const getStatusBadge = (user: RegularUser) => {
    const status = formatUserStatus(user);
    const colors = {
      green: 'bg-green-500/20 text-green-400 border-green-500/30',
      yellow: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
      red: 'bg-red-500/20 text-red-400 border-red-500/30'
    };

    return (
      <span className={`px-2 py-1 text-xs font-medium rounded-full border ${colors[status.color as keyof typeof colors]}`}>
        {status.status}
      </span>
    );
  };

  // Get auth provider icon
  const getAuthProviderIcon = (provider: string) => {
    switch (provider.toLowerCase()) {
      case 'google':
        return <Globe size={14} className="text-blue-400" />;
      case 'linkedin':
        return <Shield size={14} className="text-blue-500" />;
      case 'local':
        return <AtSign size={14} className="text-gray-400" />;
      default:
        return <AtSign size={14} className="text-gray-400" />;
    }
  };

  // Stats cards data
  const statsCards = useMemo(() => {
    if (!stats) return [];

    return [
      {
        title: 'Total Users',
        value: stats.total_users,
        icon: Users,
        color: 'text-blue-400'
      },
      {
        title: 'Approved',
        value: stats.approved_users,
        icon: UserCheck,
        color: 'text-green-400'
      },
      {
        title: 'Pending',
        value: stats.pending_users,
        icon: Clock,
        color: 'text-yellow-400'
      },
      {
        title: 'Recent (7d)',
        value: stats.recent_users,
        icon: TrendingUp,
        color: 'text-purple-400'
      }
    ];
  }, [stats]);

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">User Management</h1>
          <p className="text-white/70">Manage user accounts and permissions</p>
        </div>
      </div>

      {/* Error Display */}
      {(error || actionError) && (
        <div className="backdrop-blur-sm bg-red-500/20 border border-red-500/30 rounded-xl p-4">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
            <p className="text-red-200 text-sm">{error || actionError}</p>
            <button
              onClick={() => {
                setError(null);
                setActionError(null);
              }}
              className="ml-auto text-red-400 hover:text-red-300"
            >
              <XCircle size={16} />
            </button>
          </div>
        </div>
      )}

      {/* User Statistics */}
      {isLoadingStats ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="animate-pulse">
                <div className="h-4 bg-white/10 rounded mb-2"></div>
                <div className="h-8 bg-white/10 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statsCards.map((card) => (
            <div key={card.title} className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6">
              <div className="flex items-center gap-3 mb-2">
                <card.icon size={20} className={card.color} />
                <span className="text-white/70 text-sm font-medium">{card.title}</span>
              </div>
              <p className="text-2xl font-bold text-white">{card.value.toLocaleString()}</p>
            </div>
          ))}
        </div>
      )}

      {/* Filters and Search */}
      <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <div className="relative">
              <Search size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/50" />
              <input
                type="text"
                placeholder="Search users by name, email, or username..."
                value={filters.search}
                onChange={(e) => handleFilterChange('search', e.target.value)}
                className="w-full pl-10 pr-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder:text-white/50 focus:outline-none focus:ring-2 focus:ring-blue-500/50"
              />
            </div>
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-3">
            {/* Status Filter */}
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              {USER_STATUS_OPTIONS.map(option => (
                <option key={option.value} value={option.value} className="bg-gray-800">
                  {option.label}
                </option>
              ))}
            </select>

            {/* Auth Provider Filter */}
            <select
              value={filters.auth_provider}
              onChange={(e) => handleFilterChange('auth_provider', e.target.value)}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              {AUTH_PROVIDER_OPTIONS.map(option => (
                <option key={option.value} value={option.value} className="bg-gray-800">
                  {option.label}
                </option>
              ))}
            </select>

            {/* Sort Filter */}
            <select
              value={filters.sort_by}
              onChange={(e) => handleFilterChange('sort_by', e.target.value)}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              {USER_SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value} className="bg-gray-800">
                  {option.label}
                </option>
              ))}
            </select>

            {/* Sort Order */}
            <select
              value={filters.sort_order}
              onChange={(e) => handleFilterChange('sort_order', e.target.value)}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50"
            >
              <option value="desc" className="bg-gray-800">Newest First</option>
              <option value="asc" className="bg-gray-800">Oldest First</option>
            </select>
          </div>
        </div>
      </div>

      {/* Bulk Actions */}
      {selectedUsers.size > 0 && (
        <div className="backdrop-blur-sm bg-blue-500/20 border border-blue-500/30 rounded-xl p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-blue-400" />
              <span className="text-blue-200 font-medium">
                {selectedUsers.size} user{selectedUsers.size !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleBulkAction(UserActionType.BULK_APPROVE)}
                disabled={isPerformingAction}
                className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors text-sm font-medium disabled:opacity-50"
              >
                <UserPlus size={14} className="inline mr-1" />
                Approve All
              </button>
              <button
                onClick={() => setSelectedUsers(new Set())}
                className="px-3 py-1 bg-white/10 text-white/70 border border-white/20 rounded-lg hover:bg-white/20 transition-colors text-sm font-medium"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users Table */}
      <div className="backdrop-blur-sm bg-white/5 border border-white/10 rounded-xl overflow-hidden">
        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <div className="flex items-center gap-3">
              <Loader2 size={20} className="animate-spin text-white/50" />
              <span className="text-white/70">Loading users...</span>
            </div>
          </div>
        ) : users.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <Users size={48} className="text-white/30 mb-4" />
            <h3 className="text-lg font-medium text-white mb-2">No users found</h3>
            <p className="text-white/60">Try adjusting your search or filter criteria</p>
          </div>
        ) : (
          <>
            {/* Table Header */}
            <div className="bg-white/5 px-6 py-4 border-b border-white/10">
              <div className="flex items-center gap-4">
                <input
                  type="checkbox"
                  checked={selectedUsers.size === users.length && users.length > 0}
                  onChange={(e) => handleSelectAll(e.target.checked)}
                  className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500/50"
                />
                <div className="grid grid-cols-12 gap-4 flex-1">
                  <div className="col-span-3 text-white/80 font-medium text-sm">User</div>
                  <div className="col-span-2 text-white/80 font-medium text-sm">Status</div>
                  <div className="col-span-2 text-white/80 font-medium text-sm">Provider</div>
                  <div className="col-span-2 text-white/80 font-medium text-sm">Created</div>
                  <div className="col-span-2 text-white/80 font-medium text-sm">Last Login</div>
                  <div className="col-span-1 text-white/80 font-medium text-sm">Actions</div>
                </div>
              </div>
            </div>

            {/* Table Body */}
            <div className="divide-y divide-white/5">
              {users.map((user) => (
                <div key={user.id} className="px-6 py-4 hover:bg-white/5 transition-colors">
                  <div className="flex items-center gap-4">
                    <input
                      type="checkbox"
                      checked={selectedUsers.has(user.id)}
                      onChange={(e) => handleUserSelect(user.id, e.target.checked)}
                      className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500/50"
                    />
                    <div className="grid grid-cols-12 gap-4 flex-1">
                      {/* User Info */}
                      <div className="col-span-3">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                            <span className="text-white text-sm font-medium">
                              {getUserDisplayName(user).charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div>
                            <p className="text-white font-medium text-sm">
                              {getUserDisplayName(user)}
                            </p>
                            <p className="text-white/60 text-xs">{user.email}</p>
                          </div>
                        </div>
                      </div>

                      {/* Status */}
                      <div className="col-span-2 flex items-center">
                        {getStatusBadge(user)}
                      </div>

                      {/* Auth Provider */}
                      <div className="col-span-2 flex items-center gap-2">
                        {getAuthProviderIcon(user.auth_provider)}
                        <span className="text-white/70 text-sm">
                          {formatAuthProvider(user.auth_provider)}
                        </span>
                      </div>

                      {/* Created */}
                      <div className="col-span-2 flex items-center">
                        <span className="text-white/70 text-sm">
                          {formatDate(user.created_at)}
                        </span>
                      </div>

                      {/* Last Login */}
                      <div className="col-span-2 flex items-center">
                        <span className="text-white/70 text-sm">
                          {formatDate(user.last_login)}
                        </span>
                      </div>

                      {/* Actions */}
                      <div className="col-span-1 flex items-center gap-1">
                        {actionLoadingUsers.has(user.id) ? (
                          <Loader2 size={16} className="animate-spin text-white/50" />
                        ) : (
                          <>
                            <button
                              onClick={() => handleUserAction(user.id, UserActionType.VIEW_DETAILS)}
                              className="p-1 text-white/60 hover:text-white/80 transition-colors"
                              title="View Details"
                            >
                              <Eye size={16} />
                            </button>
                            
                            {!user.is_approved && (
                              <button
                                onClick={() => handleUserAction(user.id, UserActionType.APPROVE)}
                                className="p-1 text-green-400 hover:text-green-300 transition-colors"
                                title="Approve User"
                              >
                                <CheckCircle size={16} />
                              </button>
                            )}
                            
                            {user.is_approved && (
                              <button
                                onClick={() => handleUserAction(user.id, UserActionType.REJECT)}
                                className="p-1 text-red-400 hover:text-red-300 transition-colors"
                                title="Reject User"
                              >
                                <XCircle size={16} />
                              </button>
                            )}
                            
                            <button
                              onClick={() => handleUserAction(user.id, UserActionType.TOGGLE_ACTIVE)}
                              className="p-1 text-blue-400 hover:text-blue-300 transition-colors"
                              title={user.is_active ? 'Deactivate' : 'Activate'}
                            >
                              {user.is_active ? <UserMinus size={16} /> : <UserPlus size={16} />}
                            </button>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-between">
          <div className="text-white/70 text-sm">
            Showing {((pagination.page - 1) * pagination.per_page) + 1} to{' '}
            {Math.min(pagination.page * pagination.per_page, pagination.total)} of{' '}
            {pagination.total} users
          </div>
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => handlePageChange(pagination.page - 1)}
              disabled={!pagination.has_prev}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white/80 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronLeft size={16} />
            </button>
            
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, pagination.pages) }, (_, i) => {
                const pageNum = i + 1;
                const isActive = pageNum === pagination.page;
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                      isActive 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-white/10 text-white/80 hover:bg-white/20'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => handlePageChange(pagination.page + 1)}
              disabled={!pagination.has_next}
              className="px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white/80 hover:bg-white/20 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}

      {/* User Details Modal */}
      {showUserDetailsModal && selectedUser && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-white">User Details</h3>
              <button
                onClick={() => setShowUserDetailsModal(false)}
                className="text-white/60 hover:text-white/80 transition-colors"
              >
                <XCircle size={24} />
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-white/70 text-sm">Display Name</label>
                  <p className="text-white font-medium">{getUserDisplayName(selectedUser)}</p>
                </div>
                <div>
                  <label className="text-white/70 text-sm">Email</label>
                  <p className="text-white font-medium">{selectedUser.email}</p>
                </div>
                <div>
                  <label className="text-white/70 text-sm">Username</label>
                  <p className="text-white font-medium">{selectedUser.username || 'N/A'}</p>
                </div>
                <div>
                  <label className="text-white/70 text-sm">Status</label>
                  <div className="mt-1">{getStatusBadge(selectedUser)}</div>
                </div>
                <div>
                  <label className="text-white/70 text-sm">Auth Provider</label>
                  <div className="flex items-center gap-2 mt-1">
                    {getAuthProviderIcon(selectedUser.auth_provider)}
                    <span className="text-white">{formatAuthProvider(selectedUser.auth_provider)}</span>
                  </div>
                </div>
                <div>
                  <label className="text-white/70 text-sm">Account Created</label>
                  <p className="text-white font-medium">{formatDate(selectedUser.created_at)}</p>
                </div>
                <div>
                  <label className="text-white/70 text-sm">Last Login</label>
                  <p className="text-white font-medium">{formatDate(selectedUser.last_login)}</p>
                </div>
              </div>
              
              <div className="flex gap-3 pt-4 border-t border-white/20">
                {!selectedUser.is_approved && (
                  <button
                    onClick={() => {
                      handleUserAction(selectedUser.id, UserActionType.APPROVE);
                      setShowUserDetailsModal(false);
                    }}
                    className="px-4 py-2 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors"
                  >
                    Approve User
                  </button>
                )}
                
                {selectedUser.is_approved && (
                  <button
                    onClick={() => {
                      handleUserAction(selectedUser.id, UserActionType.REJECT);
                      setShowUserDetailsModal(false);
                    }}
                    className="px-4 py-2 bg-red-500/20 text-red-400 border border-red-500/30 rounded-lg hover:bg-red-500/30 transition-colors"
                  >
                    Reject User
                  </button>
                )}
                
                <button
                  onClick={() => {
                    handleUserAction(selectedUser.id, UserActionType.TOGGLE_ACTIVE);
                    setShowUserDetailsModal(false);
                  }}
                  className="px-4 py-2 bg-blue-500/20 text-blue-400 border border-blue-500/30 rounded-lg hover:bg-blue-500/30 transition-colors"
                >
                  {selectedUser.is_active ? 'Deactivate' : 'Activate'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation Modal */}
      {showConfirmationModal && pendingAction && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
          <div className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl p-6 max-w-md w-full">
            <div className="text-center">
              <div className="w-12 h-12 bg-yellow-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle size={24} className="text-yellow-400" />
              </div>
              
              <h3 className="text-lg font-semibold text-white mb-2">Confirm Bulk Action</h3>
              <p className="text-white/70 mb-6">
                Are you sure you want to {pendingAction.type.replace('bulk-', '')} {pendingAction.count} user{pendingAction.count !== 1 ? 's' : ''}?
                This action cannot be undone.
              </p>
              
              <div className="flex gap-3">
                <button
                  onClick={() => setShowConfirmationModal(false)}
                  disabled={isPerformingAction}
                  className="flex-1 px-4 py-2 bg-white/10 text-white/80 border border-white/20 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmBulkAction}
                  disabled={isPerformingAction}
                  className="flex-1 px-4 py-2 bg-yellow-500/20 text-yellow-400 border border-yellow-500/30 rounded-lg hover:bg-yellow-500/30 transition-colors disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {isPerformingAction ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      Processing...
                    </>
                  ) : (
                    'Confirm'
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}