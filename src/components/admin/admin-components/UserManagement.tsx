import React from 'react';
import { AlertCircle, XCircle, CheckCircle, UserPlus, Loader2, Users } from 'lucide-react';
import UserRow from './UserRow';
import type { RegularUser } from '@/types/admin';
import { UserActionType } from '@/types/admin';

interface UserManagementProps {
  users: RegularUser[];
  selectedUsers: Set<string>;
  isLoadingUsers: boolean;
  actionLoadingUsers: Set<string>;
  error: string | null;
  actionError: string | null;
  onUserSelect: (userId: string, selected: boolean) => void;
  onSelectAll: (selected: boolean) => void;
  onUserAction: (userId: string, action: UserActionType) => void;
  onBulkAction: (action: UserActionType) => void;
  onClearError: () => void;
  onClearActionError: () => void;
  onClearSelection: () => void;
}

export default function UserManagement({
  users,
  selectedUsers,
  isLoadingUsers,
  actionLoadingUsers,
  error,
  actionError,
  onUserSelect,
  onSelectAll,
  onUserAction,
  onBulkAction,
  onClearError,
  onClearActionError,
  onClearSelection
}: UserManagementProps) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-white mb-4">User Management</h3>
      
      {/* Error Display */}
      {(error || actionError) && (
        <div className="backdrop-blur-sm bg-red-500/20 border border-red-500/30 rounded-xl p-4 mb-4">
          <div className="flex items-center gap-2">
            <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
            <p className="text-red-200 text-sm">{error || actionError}</p>
            <button
              onClick={() => {
                onClearError();
                onClearActionError();
              }}
              className="ml-auto text-red-400 hover:text-red-300"
            >
              <XCircle size={16} />
            </button>
          </div>
        </div>
      )}

      {/* Bulk Actions */}
      {selectedUsers.size > 0 && (
        <div className="backdrop-blur-sm bg-blue-500/20 border border-blue-500/30 rounded-xl p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <CheckCircle size={20} className="text-blue-400" />
              <span className="text-blue-200 font-medium">
                {selectedUsers.size} user{selectedUsers.size !== 1 ? 's' : ''} selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => onBulkAction(UserActionType.BULK_APPROVE)}
                className="px-3 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded-lg hover:bg-green-500/30 transition-colors text-sm font-medium"
              >
                <UserPlus size={14} className="inline mr-1" />
                Approve All
              </button>
              <button
                onClick={onClearSelection}
                className="px-3 py-1 bg-white/10 text-white/70 border border-white/20 rounded-lg hover:bg-white/20 transition-colors text-sm font-medium"
              >
                Clear Selection
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Users List */}
      {isLoadingUsers ? (
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
          <p className="text-white/60">No users are currently registered</p>
        </div>
      ) : (
        <div className="space-y-2">
          {/* Select All Checkbox */}
          <div className="flex items-center gap-3 p-4 bg-white/5 rounded-lg border border-white/10">
            <input
              type="checkbox"
              checked={selectedUsers.size === users.length && users.length > 0}
              onChange={(e) => onSelectAll(e.target.checked)}
              className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500/50"
            />
            <span className="text-white/70 text-sm">Select All Users</span>
          </div>
          
          {users.map((user) => (
            <UserRow
              key={user.id}
              user={user}
              isSelected={selectedUsers.has(user.id)}
              isLoading={actionLoadingUsers.has(user.id)}
              onSelect={onUserSelect}
              onUserAction={onUserAction}
              showCheckbox={true}
              compact={true}
            />
          ))}
        </div>
      )}
    </div>
  );
} 