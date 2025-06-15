// src/components/admin/ConfirmationModal.tsx
import React, { useEffect, useCallback } from 'react';
import { 
  AlertTriangle, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Trash2,
  UserCheck,
  UserX,
  UserPlus,
  UserMinus,
  Shield,
  Info,
  Loader2,
  X
} from 'lucide-react';
import type { 
  RegularUser,
  UserActionType,
  BulkActionData
} from '@/types/admin';

interface ConfirmationModalProps {
  isOpen: boolean;
  title?: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  isDestructive?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
  
  // Enhanced props for user management
  actionType?: UserActionType;
  user?: RegularUser;
  bulkAction?: BulkActionData;
  showUserDetails?: boolean;
  customIcon?: React.ReactNode;
  variant?: 'default' | 'destructive' | 'warning' | 'success' | 'info';
}

export default function ConfirmationModal({
  isOpen,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  isDestructive = false,
  isLoading = false,
  onConfirm,
  onCancel,
  
  // Enhanced props
  actionType,
  user,
  bulkAction,
  showUserDetails = false,
  customIcon,
  variant = 'default'
}: ConfirmationModalProps) {
  
  // Handle escape key
  const handleEscapeKey = useCallback((event: KeyboardEvent) => {
    if (event.key === 'Escape' && !isLoading) {
      onCancel();
    }
  }, [isLoading, onCancel]);

  // Add/remove escape key listener
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'hidden'; // Prevent background scrolling
    } else {
      document.body.style.overflow = 'unset';
    }

    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen, handleEscapeKey]);

  // Handle backdrop click
  const handleBackdropClick = useCallback((e: React.MouseEvent) => {
    if (e.target === e.currentTarget && !isLoading) {
      onCancel();
    }
  }, [isLoading, onCancel]);

  // Get modal configuration based on action type or variant
  const getModalConfig = () => {
    // If bulk action is provided, use bulk action configuration
    if (bulkAction) {
      return getBulkActionConfig(bulkAction);
    }
    
    // If single user action is provided, use single action configuration
    if (actionType && user) {
      return getSingleActionConfig(actionType, user);
    }
    
    // Use variant-based configuration
    return getVariantConfig(variant);
  };

  // Configuration for bulk actions
  const getBulkActionConfig = (bulk: BulkActionData) => {
    const count = bulk.count;
    const plural = count !== 1 ? 's' : '';
    
    switch (bulk.type) {
      case 'bulk-approve':
        return {
          icon: <UserCheck size={24} className="text-green-400" />,
          iconBg: 'bg-green-500/20',
          title: 'Approve Users',
          message: `Are you sure you want to approve ${count} user${plural}? This will grant them access to the application.`,
          confirmText: `Approve ${count} User${plural}`,
          confirmClass: 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30',
          variant: 'success' as const
        };
      
      case 'bulk-reject':
        return {
          icon: <UserX size={24} className="text-red-400" />,
          iconBg: 'bg-red-500/20',
          title: 'Reject Users',
          message: `Are you sure you want to reject ${count} user${plural}? This will revoke their access to the application.`,
          confirmText: `Reject ${count} User${plural}`,
          confirmClass: 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30',
          variant: 'destructive' as const
        };
      
      case 'bulk-activate':
        return {
          icon: <UserPlus size={24} className="text-blue-400" />,
          iconBg: 'bg-blue-500/20',
          title: 'Activate Users',
          message: `Are you sure you want to activate ${count} user${plural}? This will enable their accounts.`,
          confirmText: `Activate ${count} User${plural}`,
          confirmClass: 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30',
          variant: 'info' as const
        };
      
      case 'bulk-deactivate':
        return {
          icon: <UserMinus size={24} className="text-yellow-400" />,
          iconBg: 'bg-yellow-500/20',
          title: 'Deactivate Users',
          message: `Are you sure you want to deactivate ${count} user${plural}? This will disable their accounts.`,
          confirmText: `Deactivate ${count} User${plural}`,
          confirmClass: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30',
          variant: 'warning' as const
        };
      
      default:
        return {
          icon: <AlertCircle size={24} className="text-blue-400" />,
          iconBg: 'bg-blue-500/20',
          title: 'Confirm Bulk Action',
          message: `Are you sure you want to perform this action on ${count} user${plural}?`,
          confirmText: `Confirm Action`,
          confirmClass: 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30',
          variant: 'default' as const
        };
    }
  };

  // Configuration for single user actions
  const getSingleActionConfig = (action: UserActionType, userData: RegularUser) => {
    const userName = userData.first_name || userData.username || userData.email;
    
    switch (action) {
      case 'approve':
        return {
          icon: <CheckCircle size={24} className="text-green-400" />,
          iconBg: 'bg-green-500/20',
          title: 'Approve User',
          message: `Are you sure you want to approve ${userName}? This will grant them access to the application.`,
          confirmText: 'Approve User',
          confirmClass: 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30',
          variant: 'success' as const
        };
      
      case 'reject':
        return {
          icon: <XCircle size={24} className="text-red-400" />,
          iconBg: 'bg-red-500/20',
          title: 'Reject User',
          message: `Are you sure you want to reject ${userName}? This will revoke their access to the application.`,
          confirmText: 'Reject User',
          confirmClass: 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30',
          variant: 'destructive' as const
        };
      
      case 'toggle-active':
        const isActive = userData.is_active;
        return {
          icon: isActive ? <UserMinus size={24} className="text-yellow-400" /> : <UserPlus size={24} className="text-green-400" />,
          iconBg: isActive ? 'bg-yellow-500/20' : 'bg-green-500/20',
          title: isActive ? 'Deactivate User' : 'Activate User',
          message: `Are you sure you want to ${isActive ? 'deactivate' : 'activate'} ${userName}? This will ${isActive ? 'disable' : 'enable'} their account.`,
          confirmText: isActive ? 'Deactivate User' : 'Activate User',
          confirmClass: isActive 
            ? 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30'
            : 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30',
          variant: isActive ? 'warning' as const : 'success' as const
        };
      
      default:
        return {
          icon: <AlertCircle size={24} className="text-blue-400" />,
          iconBg: 'bg-blue-500/20',
          title: 'Confirm Action',
          message: `Are you sure you want to perform this action on ${userName}?`,
          confirmText: 'Confirm',
          confirmClass: 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30',
          variant: 'default' as const
        };
    }
  };

  // Configuration for generic variants
  const getVariantConfig = (variantType: string) => {
    switch (variantType) {
      case 'destructive':
        return {
          icon: <AlertTriangle size={24} className="text-red-400" />,
          iconBg: 'bg-red-500/20',
          title: title || 'Confirm Deletion',
          message: message || 'This action cannot be undone.',
          confirmText: confirmText || 'Delete',
          confirmClass: 'bg-red-500/20 text-red-400 border-red-500/30 hover:bg-red-500/30',
          variant: 'destructive' as const
        };
      
      case 'warning':
        return {
          icon: <AlertTriangle size={24} className="text-yellow-400" />,
          iconBg: 'bg-yellow-500/20',
          title: title || 'Warning',
          message: message || 'Please confirm this action.',
          confirmText: confirmText || 'Continue',
          confirmClass: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30 hover:bg-yellow-500/30',
          variant: 'warning' as const
        };
      
      case 'success':
        return {
          icon: <CheckCircle size={24} className="text-green-400" />,
          iconBg: 'bg-green-500/20',
          title: title || 'Confirm Action',
          message: message || 'Are you sure you want to proceed?',
          confirmText: confirmText || 'Confirm',
          confirmClass: 'bg-green-500/20 text-green-400 border-green-500/30 hover:bg-green-500/30',
          variant: 'success' as const
        };
      
      case 'info':
        return {
          icon: <Info size={24} className="text-blue-400" />,
          iconBg: 'bg-blue-500/20',
          title: title || 'Information',
          message: message || 'Please review the information below.',
          confirmText: confirmText || 'Continue',
          confirmClass: 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30',
          variant: 'info' as const
        };
      
      default:
        return {
          icon: <AlertCircle size={24} className="text-blue-400" />,
          iconBg: 'bg-blue-500/20',
          title: title || 'Confirm Action',
          message: message || 'Are you sure you want to proceed?',
          confirmText: confirmText || 'Confirm',
          confirmClass: 'bg-blue-500/20 text-blue-400 border-blue-500/30 hover:bg-blue-500/30',
          variant: 'default' as const
        };
    }
  };

  if (!isOpen) {
    return null;
  }

  const config = getModalConfig();

  return (
    <div 
      className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      onClick={handleBackdropClick}
    >
      <div 
        className="backdrop-blur-md bg-gradient-to-br from-black/40 via-black/30 to-black/20 border border-white/20 rounded-2xl p-6 max-w-md w-full shadow-2xl transform transition-all duration-300 scale-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 ${config.iconBg} rounded-full flex items-center justify-center`}>
              {customIcon || config.icon}
            </div>
            <h3 className="text-xl font-semibold text-white">
              {config.title}
            </h3>
          </div>
          
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="text-white/60 hover:text-white/80 transition-colors disabled:opacity-50 p-1"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="mb-6">
          <p className="text-white/80 leading-relaxed">
            {config.message}
          </p>
          
          {/* User Details Section */}
          {showUserDetails && user && (
            <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-center gap-3 mb-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">
                    {(user.first_name || user.username || user.email).charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-white font-medium">
                    {user.first_name || user.username || 'User'}
                  </p>
                  <p className="text-white/60 text-sm">{user.email}</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div>
                  <span className="text-white/60">Status:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    user.is_approved 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-yellow-500/20 text-yellow-400'
                  }`}>
                    {user.is_approved ? 'Approved' : 'Pending'}
                  </span>
                </div>
                <div>
                  <span className="text-white/60">Active:</span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs ${
                    user.is_active 
                      ? 'bg-green-500/20 text-green-400' 
                      : 'bg-red-500/20 text-red-400'
                  }`}>
                    {user.is_active ? 'Yes' : 'No'}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Bulk Action Details */}
          {bulkAction && (
            <div className="mt-4 p-4 bg-white/5 border border-white/10 rounded-lg">
              <div className="flex items-center justify-between mb-2">
                <span className="text-white/80 font-medium">Selected Users:</span>
                <span className="text-white font-semibold">{bulkAction.count}</span>
              </div>
              <p className="text-white/60 text-sm">
                This action will be applied to all selected users and cannot be undone.
              </p>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-3">
          <button
            onClick={onCancel}
            disabled={isLoading}
            className="flex-1 px-4 py-3 bg-white/10 text-white/80 border border-white/20 rounded-lg hover:bg-white/20 transition-all duration-200 font-medium disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {cancelText}
          </button>
          
          <button
            onClick={onConfirm}
            disabled={isLoading}
            className={`flex-1 px-4 py-3 border rounded-lg font-medium transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 ${config.confirmClass}`}
          >
            {isLoading ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                <span>Processing...</span>
              </>
            ) : (
              config.confirmText
            )}
          </button>
        </div>

        {/* Footer Warning for Destructive Actions */}
        {(config.variant === 'destructive' || isDestructive) && (
          <div className="mt-4 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-red-400 flex-shrink-0" />
              <p className="text-red-200 text-sm">
                <strong>Warning:</strong> This action cannot be undone.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Specialized confirmation modals for common use cases

export function DeleteConfirmationModal({
  isOpen,
  itemName,
  itemType = 'item',
  isLoading = false,
  onConfirm,
  onCancel
}: {
  isOpen: boolean;
  itemName: string;
  itemType?: string;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  return (
    <ConfirmationModal
      isOpen={isOpen}
      variant="destructive"
      title={`Delete ${itemType}`}
      message={`Are you sure you want to delete "${itemName}"? This action cannot be undone.`}
      confirmText={`Delete ${itemType}`}
      cancelText="Cancel"
      isLoading={isLoading}
      onConfirm={onConfirm}
      onCancel={onCancel}
      customIcon={<Trash2 size={24} className="text-red-400" />}
    />
  );
}

export function UserActionConfirmationModal({
  isOpen,
  user,
  actionType,
  isLoading = false,
  onConfirm,
  onCancel
}: {
  isOpen: boolean;
  user: RegularUser | null;
  actionType: UserActionType;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!user) return null;

  return (
    <ConfirmationModal
      isOpen={isOpen}
      user={user}
      actionType={actionType}
      showUserDetails={true}
      isLoading={isLoading}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}

export function BulkActionConfirmationModal({
  isOpen,
  bulkAction,
  isLoading = false,
  onConfirm,
  onCancel
}: {
  isOpen: boolean;
  bulkAction: BulkActionData | null;
  isLoading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  if (!bulkAction) return null;

  return (
    <ConfirmationModal
      isOpen={isOpen}
      bulkAction={bulkAction}
      isLoading={isLoading}
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
}