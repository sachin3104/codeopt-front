import React from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';
import type { BulkActionData } from '@/types/admin';

interface ConfirmationModalProps {
  isOpen: boolean;
  pendingAction: BulkActionData | null;
  isPerformingAction: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function ConfirmationModal({
  isOpen,
  pendingAction,
  isPerformingAction,
  onConfirm,
  onCancel
}: ConfirmationModalProps) {
  if (!isOpen || !pendingAction) return null;

  return (
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
              onClick={onCancel}
              disabled={isPerformingAction}
              className="flex-1 px-4 py-2 bg-white/10 text-white/80 border border-white/20 rounded-lg hover:bg-white/20 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={onConfirm}
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
  );
} 