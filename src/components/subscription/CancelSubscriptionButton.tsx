// File: src/components/subscription/CancelSubscriptionButton.tsx
import React from 'react'
import { useSubscription } from '@/hooks/use-subscription'

interface CancelSubscriptionButtonProps {
  /** 
   * If true, cancel immediately; otherwise cancel at period end 
   */
  immediate?: boolean
  /**
   * Optional label override for the button 
   */
  label?: string
}

/**
 * Renders a “Cancel subscription” button with its own
 * loading spinner and inline error message.
 */
const CancelSubscriptionButton: React.FC<CancelSubscriptionButtonProps> = ({
  immediate = false,
  label = 'Cancel Subscription',
}) => {
  const {
    subscription,
    cancelSubscription,
    cancelLoading,
    cancelError,
  } = useSubscription()

  // Only show if the user has an active subscription
  if (!subscription?.is_active) {
    return null
  }

  const handleClick = () => {
    cancelSubscription(immediate)
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleClick}
        disabled={cancelLoading}
        className={`px-4 py-2 rounded-md font-medium transition ${
          cancelLoading
            ? 'bg-red-300 text-white cursor-not-allowed opacity-60'
            : 'bg-red-600 text-white hover:bg-red-700'
        }`}
      >
        {cancelLoading ? 'Cancelling…' : label}
      </button>

      {cancelError && (
        <p className="text-sm text-red-600">
          {cancelError.response?.data.message || cancelError.message}
        </p>
      )}
    </div>
  )
}

export default CancelSubscriptionButton
