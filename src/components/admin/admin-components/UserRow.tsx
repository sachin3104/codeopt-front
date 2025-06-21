// src/components/admin/UserRow.tsx
import React, { useState, useCallback } from 'react';
import { 
  Eye, 
  CheckCircle, 
  XCircle, 
  UserPlus, 
  UserMinus, 
  Loader2,
  Globe,
  Shield,
  AtSign,
  MoreVertical,
  Calendar,
  Mail,
  User
} from 'lucide-react';
import { 
  getUserDisplayName,
  formatUserStatus,
  formatAuthProvider,
  formatDate
} from '@/api/admin';
import { 
  RegularUser, 
  UserActionType 
} from '@/types/admin';

interface UserRowProps {
  user: RegularUser;
  isSelected: boolean;
  isLoading: boolean;
  onSelect: (userId: string, selected: boolean) => void;
  onUserAction: (userId: string, action: UserActionType) => void;
  showCheckbox?: boolean;
  compact?: boolean;
}

export default function UserRow({ 
  user, 
  isSelected, 
  isLoading, 
  onSelect, 
  onUserAction,
  showCheckbox = true,
  compact = false
}: UserRowProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Handle checkbox change
  const handleCheckboxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSelect(user.id, e.target.checked);
  }, [user.id, onSelect]);

  // Handle action click
  const handleActionClick = useCallback((action: UserActionType) => {
    onUserAction(user.id, action);
    setShowDropdown(false);
  }, [user.id, onUserAction]);

  // Get status badge component
  const getStatusBadge = () => {
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

  // Get auth provider icon and badge
  const getAuthProviderBadge = () => {
    const provider = user.auth_provider.toLowerCase();
    let icon;
    let colorClass;

    switch (provider) {
      case 'google':
        icon = <Globe size={14} />;
        colorClass = 'text-blue-400 bg-blue-500/20 border-blue-500/30';
        break;
      case 'linkedin':
        icon = <Shield size={14} />;
        colorClass = 'text-blue-500 bg-blue-500/20 border-blue-500/30';
        break;
      case 'local':
        icon = <AtSign size={14} />;
        colorClass = 'text-gray-400 bg-gray-500/20 border-gray-500/30';
        break;
      default:
        icon = <AtSign size={14} />;
        colorClass = 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }

    return (
      <div className={`flex items-center gap-1 px-2 py-1 rounded-full border text-xs font-medium ${colorClass}`}>
        {icon}
        <span>{formatAuthProvider(user.auth_provider)}</span>
      </div>
    );
  };

  // Get user avatar
  const getUserAvatar = () => {
    const displayName = getUserDisplayName(user);
    const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    
    if (user.profile_picture) {
      return (
        <img
          src={user.profile_picture}
          alt={displayName}
          className="w-10 h-10 rounded-full object-cover border-2 border-white/20"
        />
      );
    }

    return (
      <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center border-2 border-white/20">
        <span className="text-white text-sm font-semibold">
          {initials}
        </span>
      </div>
    );
  };

  // Render compact version
  if (compact) {
    return (
      <div 
        className={`
          flex items-center justify-between p-4 rounded-lg border transition-all duration-200
          ${isHovered ? 'bg-white/5 border-white/20' : 'bg-white/[0.02] border-white/10'}
          ${isSelected ? 'ring-2 ring-blue-500/50 bg-blue-500/10' : ''}
        `}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <div className="flex items-center gap-3">
          {showCheckbox && (
            <input
              type="checkbox"
              checked={isSelected}
              onChange={handleCheckboxChange}
              disabled={isLoading}
              className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500/50 disabled:opacity-50"
            />
          )}
          
          {getUserAvatar()}
          
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-white font-medium text-sm">
                {getUserDisplayName(user)}
              </span>
              {getStatusBadge()}
            </div>
            <span className="text-white/60 text-xs">{user.email}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {isLoading ? (
            <div className="w-8 h-8 flex items-center justify-center">
              <Loader2 size={16} className="animate-spin text-white/50" />
            </div>
          ) : (
            <button
              onClick={() => handleActionClick(UserActionType.VIEW_DETAILS)}
              className="w-8 h-8 flex items-center justify-center text-white/60 hover:text-white/80 hover:bg-white/10 rounded-lg transition-all duration-200"
              title="View Details"
            >
              <Eye size={16} />
            </button>
          )}
        </div>
      </div>
    );
  }

  // Render full table row version
  return (
    <div 
      className={`
        px-6 py-4 transition-all duration-200 border-l-4
        ${isHovered ? 'bg-white/5' : 'bg-transparent'}
        ${isSelected ? 'border-l-blue-500 bg-blue-500/5' : 'border-l-transparent'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-4">
        {showCheckbox && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleCheckboxChange}
            disabled={isLoading}
            className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500/50 disabled:opacity-50"
          />
        )}
        
        <div className="grid grid-cols-12 gap-4 flex-1 items-center">
          {/* User Info - Col 1-4 */}
          <div className="col-span-4">
            <div className="flex items-center gap-3">
              {getUserAvatar()}
              <div className="flex flex-col min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-white font-medium text-sm truncate">
                    {getUserDisplayName(user)}
                  </span>
                  {user.username && (
                    <span className="text-white/50 text-xs">@{user.username}</span>
                  )}
                </div>
                <div className="flex items-center gap-1 text-white/60 text-xs">
                  <Mail size={12} />
                  <span className="truncate">{user.email}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Status - Col 5-6 */}
          <div className="col-span-2">
            <div className="flex flex-col gap-1">
              {getStatusBadge()}
              <span className="text-white/50 text-xs">
                {user.is_active ? 'Active' : 'Inactive'}
              </span>
            </div>
          </div>

          {/* Auth Provider - Col 7-8 */}
          <div className="col-span-2">
            {getAuthProviderBadge()}
          </div>

          {/* Created Date - Col 9-10 */}
          <div className="col-span-2">
            <div className="flex flex-col text-white/70 text-xs">
              <div className="flex items-center gap-1">
                <Calendar size={12} />
                <span>Created</span>
              </div>
              <span className="font-mono">
                {formatDate(user.created_at)}
              </span>
            </div>
          </div>

          {/* Actions - Col 11-12 */}
          <div className="col-span-2">
            <div className="flex items-center justify-end gap-1">
              {isLoading ? (
                <div className="flex items-center justify-center w-8 h-8">
                  <Loader2 size={16} className="animate-spin text-white/50" />
                </div>
              ) : (
                <>
                  {/* Quick Actions */}
                  <div className="hidden group-hover:flex items-center gap-1">
                    <button
                      onClick={() => handleActionClick(UserActionType.VIEW_DETAILS)}
                      className="p-1.5 text-white/60 hover:text-white/80 hover:bg-white/10 rounded-lg transition-all duration-200"
                      title="View Details"
                    >
                      <Eye size={14} />
                    </button>
                    
                    {!user.is_approved && (
                      <button
                        onClick={() => handleActionClick(UserActionType.APPROVE)}
                        className="p-1.5 text-green-400 hover:text-green-300 hover:bg-green-500/20 rounded-lg transition-all duration-200"
                        title="Approve User"
                      >
                        <CheckCircle size={14} />
                      </button>
                    )}
                    
                    {user.is_approved && (
                      <button
                        onClick={() => handleActionClick(UserActionType.REJECT)}
                        className="p-1.5 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200"
                        title="Reject User"
                      >
                        <XCircle size={14} />
                      </button>
                    )}
                    
                    <button
                      onClick={() => handleActionClick(UserActionType.TOGGLE_ACTIVE)}
                      className="p-1.5 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-all duration-200"
                      title={user.is_active ? 'Deactivate' : 'Activate'}
                    >
                      {user.is_active ? <UserMinus size={14} /> : <UserPlus size={14} />}
                    </button>
                  </div>

                  {/* Dropdown Menu */}
                  <div className="relative">
                    <button
                      onClick={() => setShowDropdown(!showDropdown)}
                      className="p-1.5 text-white/60 hover:text-white/80 hover:bg-white/10 rounded-lg transition-all duration-200"
                      title="More Actions"
                    >
                      <MoreVertical size={16} />
                    </button>

                    {showDropdown && (
                      <>
                        {/* Backdrop */}
                        <div 
                          className="fixed inset-0 z-10"
                          onClick={() => setShowDropdown(false)}
                        />
                        
                        {/* Dropdown Menu */}
                        <div className="absolute right-0 mt-2 w-48 backdrop-blur-md bg-black/80 border border-white/20 rounded-lg shadow-xl z-20">
                          <div className="py-2">
                            <button
                              onClick={() => handleActionClick(UserActionType.VIEW_DETAILS)}
                              className="w-full px-4 py-2 text-left text-white/80 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-2"
                            >
                              <Eye size={14} />
                              View Details
                            </button>
                            
                            <div className="border-t border-white/10 my-1"></div>
                            
                            {!user.is_approved ? (
                              <button
                                onClick={() => handleActionClick(UserActionType.APPROVE)}
                                className="w-full px-4 py-2 text-left text-green-400 hover:text-green-300 hover:bg-green-500/20 transition-colors flex items-center gap-2"
                              >
                                <CheckCircle size={14} />
                                Approve User
                              </button>
                            ) : (
                              <button
                                onClick={() => handleActionClick(UserActionType.REJECT)}
                                className="w-full px-4 py-2 text-left text-red-400 hover:text-red-300 hover:bg-red-500/20 transition-colors flex items-center gap-2"
                              >
                                <XCircle size={14} />
                                Reject User
                              </button>
                            )}
                            
                            <button
                              onClick={() => handleActionClick(UserActionType.TOGGLE_ACTIVE)}
                              className="w-full px-4 py-2 text-left text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 transition-colors flex items-center gap-2"
                            >
                              {user.is_active ? (
                                <>
                                  <UserMinus size={14} />
                                  Deactivate User
                                </>
                              ) : (
                                <>
                                  <UserPlus size={14} />
                                  Activate User
                                </>
                              )}
                            </button>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Additional Info Row (Mobile) */}
      <div className="md:hidden mt-3 pt-3 border-t border-white/10">
        <div className="flex items-center justify-between text-xs">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 text-white/60">
              <Calendar size={12} />
              <span>{formatDate(user.created_at)}</span>
            </div>
            {user.last_login && (
              <div className="flex items-center gap-1 text-white/60">
                <User size={12} />
                <span>Last: {formatDate(user.last_login)}</span>
              </div>
            )}
          </div>
          {getAuthProviderBadge()}
        </div>
      </div>
    </div>
  );
}

// Additional utility component for user status indicator
export function UserStatusIndicator({ user }: { user: RegularUser }) {
  const status = formatUserStatus(user);
  
  return (
    <div className="flex items-center gap-2">
      <div className={`w-2 h-2 rounded-full ${
        status.color === 'green' ? 'bg-green-400' :
        status.color === 'yellow' ? 'bg-yellow-400' :
        'bg-red-400'
      }`} />
      <span className="text-white/70 text-sm">{status.description}</span>
    </div>
  );
}

// Component for user quick actions toolbar
export function UserQuickActions({ 
  user, 
  isLoading, 
  onAction 
}: { 
  user: RegularUser; 
  isLoading: boolean; 
  onAction: (action: UserActionType) => void;
}) {
  if (isLoading) {
    return (
      <div className="flex items-center justify-center">
        <Loader2 size={16} className="animate-spin text-white/50" />
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1">
      <button
        onClick={() => onAction(UserActionType.VIEW_DETAILS)}
        className="p-2 text-white/60 hover:text-white/80 hover:bg-white/10 rounded-lg transition-all duration-200"
        title="View Details"
      >
        <Eye size={16} />
      </button>
      
      {!user.is_approved && (
        <button
          onClick={() => onAction(UserActionType.APPROVE)}
          className="p-2 text-green-400 hover:text-green-300 hover:bg-green-500/20 rounded-lg transition-all duration-200"
          title="Approve User"
        >
          <CheckCircle size={16} />
        </button>
      )}
      
      {user.is_approved && (
        <button
          onClick={() => onAction(UserActionType.REJECT)}
          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-500/20 rounded-lg transition-all duration-200"
          title="Reject User"
        >
          <XCircle size={16} />
        </button>
      )}
      
      <button
        onClick={() => onAction(UserActionType.TOGGLE_ACTIVE)}
        className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-500/20 rounded-lg transition-all duration-200"
        title={user.is_active ? 'Deactivate' : 'Activate'}
      >
        {user.is_active ? <UserMinus size={16} /> : <UserPlus size={16} />}
      </button>
    </div>
  );
}