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
  User,
  Copy,
  Check,
  Crown,
  Zap
} from 'lucide-react';
import { toast } from 'sonner';
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
  onPlanChange?: (userId: string, planType: string) => Promise<void>;
  showCheckbox?: boolean;
  compact?: boolean;
  serialNumber?: number;
}

export default function UserRow({ 
  user, 
  isSelected, 
  isLoading, 
  onSelect, 
  onUserAction,
  onPlanChange,
  showCheckbox = true,
  compact = false,
  serialNumber
}: UserRowProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [isUpgradingPlan, setIsUpgradingPlan] = useState(false);

  // Handle checkbox change
  const handleCheckboxChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    onSelect(user.id, e.target.checked);
  }, [user.id, onSelect]);

  // Handle action click
  const handleActionClick = useCallback((action: UserActionType) => {
    onUserAction(user.id, action);
    setShowDropdown(false);
  }, [user.id, onUserAction]);

  // Handle plan change
  const handlePlanChange = useCallback(async (planType: string) => {
    if (!onPlanChange || isUpgradingPlan) return;
    
    try {
      setIsUpgradingPlan(true);
      await onPlanChange(user.id, planType);
      toast.success(`Successfully upgraded ${getUserDisplayName(user)} to ${planType} plan`);
    } catch (error: any) {
      toast.error(error.message || `Failed to upgrade ${getUserDisplayName(user)} to ${planType} plan`);
    } finally {
      setIsUpgradingPlan(false);
    }
  }, [user.id, onPlanChange, isUpgradingPlan, user]);

  // Get available plans based on current plan
  const getAvailablePlans = useCallback(() => {
    const currentPlan = (user.active_plan_type || 'FREE').toUpperCase();
    
    if (currentPlan === 'PRO') {
      return [{ type: 'ULTIMATE', label: 'Ultimate', icon: <Crown size={12} /> }];
    } else if (currentPlan === 'ULTIMATE') {
      return [{ type: 'PRO', label: 'Pro', icon: <Zap size={12} /> }];
    } else {
      // FREE plan
      return [
        { type: 'PRO', label: 'Pro', icon: <Zap size={12} /> },
        { type: 'ULTIMATE', label: 'Ultimate', icon: <Crown size={12} /> }
      ];
    }
  }, [user.active_plan_type]);

  // Handle copy to clipboard
  const handleCopyToClipboard = useCallback(async (text: string, fieldName: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldName);
      setTimeout(() => setCopiedField(null), 2000); // Reset after 2 seconds
    } catch (err) {
      console.error('Failed to copy to clipboard:', err);
    }
  }, []);

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
        icon = <Globe size={10} />;
        colorClass = 'text-blue-400 bg-blue-500/20 border-blue-500/30';
        break;
      case 'local':
        icon = <AtSign size={10} />;
        colorClass = 'text-gray-400 bg-gray-500/20 border-gray-500/30';
        break;
      default:
        icon = <AtSign size={10} />;
        colorClass = 'text-gray-400 bg-gray-500/20 border-gray-500/30';
    }

    return (
      <div className={`flex items-center gap-1 px-1.5 py-0.5 rounded-full border text-xs font-medium ${colorClass}`}>
        {icon}
        <span className="text-xs">{formatAuthProvider(user.auth_provider)}</span>
      </div>
    );
  };

  // Get user avatar
  const getUserAvatar = () => {
    const displayName = getUserDisplayName(user);
    const initials = displayName.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
    // Always show fallback avatar, never load user.profile_picture
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
            <div className="flex items-center gap-2">
              <span className="text-white/60 text-xs">{user.email}</span>
              {getAuthProviderBadge()}
              {user.active_plan_type && (
                <span className={`px-2 py-1 text-xs rounded-full ${
                  user.active_plan_type === 'FREE' ? 'bg-green-500/20 text-green-400 border border-green-500/30' :
                  user.active_plan_type === 'PRO' ? 'bg-blue-500/20 text-blue-400 border border-blue-500/30' :
                  'bg-purple-500/20 text-purple-400 border border-purple-500/30'
                }`}>
                  {user.active_plan_type}
                </span>
              )}
            </div>
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
        px-6 py-4 transition-all duration-200 border-l-4 border-b border-white/10 whitespace-nowrap
        ${isHovered ? 'bg-white/5' : 'bg-transparent'}
        ${isSelected ? 'border-l-blue-500 bg-blue-500/5' : 'border-l-transparent'}
      `}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="flex items-center gap-4 min-w-0">
        {showCheckbox && (
          <input
            type="checkbox"
            checked={isSelected}
            onChange={handleCheckboxChange}
            disabled={isLoading}
            className="rounded border-white/20 bg-white/10 text-blue-500 focus:ring-blue-500/50 disabled:opacity-50 flex-shrink-0"
          />
        )}
        
        <div className="flex items-center gap-4 flex-1 min-w-0">
          {/* Serial Number */}
          <div className="w-16 flex-shrink-0">
            <div 
              className="relative group cursor-pointer"
              onClick={() => handleCopyToClipboard(serialNumber?.toString() || user.id.slice(-4), 'serial')}
              title={`Click to copy: ${serialNumber || user.id.slice(-4)}`}
            >
              <span className="text-white/60 text-xs font-mono truncate block group-hover:text-blue-300 transition-colors">
                {serialNumber || user.id.slice(-4)}
              </span>
              {copiedField === 'serial' && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500/90 text-white text-xs px-2 py-1 rounded flex items-center gap-1 z-10">
                  <Check size={10} />
                  Copied!
                </div>
              )}
            </div>
          </div>

          {/* Username */}
          <div className="w-20 flex-shrink-0">
            <div 
              className="relative group cursor-pointer"
              onClick={() => handleCopyToClipboard(user.username || 'N/A', 'username')}
              title={`Click to copy: ${user.username || 'N/A'}`}
            >
              <span className="text-white font-medium text-xs truncate block group-hover:text-blue-300 transition-colors">
                {user.username || 'N/A'}
              </span>
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                {user.username || 'N/A'}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black/90"></div>
              </div>
              {copiedField === 'username' && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500/90 text-white text-xs px-2 py-1 rounded flex items-center gap-1 z-10">
                  <Check size={10} />
                  Copied!
                </div>
              )}
            </div>
          </div>

          {/* Email ID */}
          <div className="w-48 flex-shrink-0">
            <div 
              className="relative group cursor-pointer"
              onClick={() => handleCopyToClipboard(user.email, 'email')}
              title={`Click to copy: ${user.email}`}
            >
              <div className="text-white/70 text-xs min-w-0">
                <span className="truncate group-hover:text-blue-300 transition-colors">{user.email}</span>
              </div>
              <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-black/90 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                {user.email}
                <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-black/90"></div>
              </div>
              {copiedField === 'email' && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500/90 text-white text-xs px-2 py-1 rounded flex items-center gap-1 z-10">
                  <Check size={10} />
                  Copied!
                </div>
              )}
            </div>
          </div>

          {/* Auth Provider */}
          <div className="w-20 flex-shrink-0">
            <div className="flex justify-center">
              {getAuthProviderBadge()}
            </div>
          </div>

          {/* Free Plan */}
          <div className="w-16 flex-shrink-0">
            <div className="flex justify-center">
              <label className={`inline-flex items-center ${(user.active_plan_type === 'PRO' || user.active_plan_type === 'ULTIMATE') ? 'cursor-not-allowed' : 'cursor-pointer'}`}>
                <input
                  type="checkbox"
                  checked={user.active_plan_type === 'FREE'}
                  disabled={user.active_plan_type === 'FREE' || isUpgradingPlan || user.active_plan_type === 'PRO' || user.active_plan_type === 'ULTIMATE'}
                  onChange={() => handlePlanChange('FREE')}
                  className={`checkbox-green disabled:opacity-50 focus:ring-green-500 focus:ring-2`}
                />
                {isUpgradingPlan && user.active_plan_type !== 'FREE' ? (
                  <Loader2 size={14} className="ml-1 animate-spin text-green-400" />
                ) : null}
              </label>
            </div>
          </div>

          {/* Pro Plan */}
          <div className="w-16 flex-shrink-0">
            <div className="flex justify-center">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={user.active_plan_type === 'PRO'}
                  disabled={user.active_plan_type === 'PRO' || isUpgradingPlan}
                  onChange={() => handlePlanChange('PRO')}
                  className={`checkbox-blue disabled:opacity-50 focus:ring-blue-500 focus:ring-2`}
                />
                {isUpgradingPlan && user.active_plan_type !== 'PRO' ? (
                  <Loader2 size={14} className="ml-1 animate-spin text-blue-400" />
                ) : null}
              </label>
            </div>
          </div>

          {/* Ultimate Plan */}
          <div className="w-20 flex-shrink-0">
            <div className="flex justify-center">
              <label className="inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={user.active_plan_type === 'ULTIMATE'}
                  disabled={user.active_plan_type === 'ULTIMATE' || isUpgradingPlan}
                  onChange={() => handlePlanChange('ULTIMATE')}
                  className={`checkbox-purple disabled:opacity-50 focus:ring-purple-500 focus:ring-2`}
                />
                {isUpgradingPlan && user.active_plan_type !== 'ULTIMATE' ? (
                  <Loader2 size={14} className="ml-1 animate-spin text-purple-400" />
                ) : null}
              </label>
            </div>
          </div>

          {/* Account Created Date */}
          <div className="w-32 flex-shrink-0">
            <div 
              className="relative group cursor-pointer"
              onClick={() => handleCopyToClipboard(formatDate(user.created_at), 'created')}
              title={`Click to copy: ${formatDate(user.created_at)}`}
            >
              <div className="text-white/70 text-xs min-w-0">
                <div className="font-mono text-xs">
                  {formatDate(user.created_at).split(', ').map((part, index) => (
                    <div key={index} className="truncate group-hover:text-blue-300 transition-colors">
                      {part}
                    </div>
                  ))}
                </div>
              </div>
              {copiedField === 'created' && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500/90 text-white text-xs px-2 py-1 rounded flex items-center gap-1 z-10">
                  <Check size={10} />
                  Copied!
                </div>
              )}
            </div>
          </div>

          {/* Time Last Login */}
          <div className="w-28 flex-shrink-0">
            <div 
              className="relative group cursor-pointer"
              onClick={() => handleCopyToClipboard(user.last_login ? formatDate(user.last_login) : 'Never', 'lastLogin')}
              title={`Click to copy: ${user.last_login ? formatDate(user.last_login) : 'Never'}`}
            >
              <div className="text-white/70 text-xs min-w-0">
                <div className="font-mono text-xs">
                  {user.last_login ? 
                    formatDate(user.last_login).split(', ').map((part, index) => (
                      <div key={index} className="truncate group-hover:text-blue-300 transition-colors">
                        {part}
                      </div>
                    ))
                    : 
                    <div className="truncate group-hover:text-blue-300 transition-colors">Never</div>
                  }
                </div>
              </div>
              {copiedField === 'lastLogin' && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500/90 text-white text-xs px-2 py-1 rounded flex items-center gap-1 z-10">
                  <Check size={10} />
                  Copied!
                </div>
              )}
            </div>
          </div>

          {/* Plan Renewal Date */}
          <div className="w-28 flex-shrink-0">
            <div 
              className="relative group cursor-pointer"
              onClick={() => handleCopyToClipboard(user.current_period_end ? formatDate(user.current_period_end) : 'N/A', 'renewal')}
              title={`Click to copy: ${user.current_period_end ? formatDate(user.current_period_end) : 'N/A'}`}
            >
              <div className="text-white/70 text-xs min-w-0">
                <div className="font-mono text-xs">
                  {user.current_period_end ? 
                    formatDate(user.current_period_end).split(', ').map((part, index) => (
                      <div key={index} className="truncate group-hover:text-blue-300 transition-colors">
                        {part}
                      </div>
                    ))
                    : 
                    <div className="truncate group-hover:text-blue-300 transition-colors">N/A</div>
                  }
                </div>
              </div>
              {copiedField === 'renewal' && (
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-green-500/90 text-white text-xs px-2 py-1 rounded flex items-center gap-1 z-10">
                  <Check size={10} />
                  Copied!
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="w-20 flex-shrink-0">
            <div className="flex items-center justify-center gap-1">
              {isLoading ? (
                <div className="flex items-center justify-center w-6 h-6">
                  <Loader2 size={14} className="animate-spin text-white/50" />
                </div>
              ) : (
                <>
                  {!user.is_approved ? (
                    <button
                      onClick={() => handleActionClick(UserActionType.APPROVE)}
                      className="px-2 py-1 bg-green-500/20 text-green-400 border border-green-500/30 rounded hover:bg-green-500/30 transition-colors text-xs font-medium whitespace-nowrap"
                      title="Approve User"
                    >
                      Approve
                    </button>
                  ) : (
                    <button
                      onClick={() => handleActionClick(UserActionType.REJECT)}
                      className="px-2 py-1 bg-red-500/20 text-red-400 border border-red-500/30 rounded hover:bg-red-500/30 transition-colors text-xs font-medium whitespace-nowrap"
                      title="Reject User"
                    >
                      Reject
                    </button>
                  )}
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