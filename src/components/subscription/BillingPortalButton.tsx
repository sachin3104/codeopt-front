// File: src/components/subscription/BillingPortalButton.tsx
import React from 'react'
import { useSubscription } from '@/hooks/use-subscription'

interface BillingPortalButtonProps {
  /** Optional override for the button label */
  label?: string
}

/**
 * Renders a button that sends the user to Stripe's hosted billing portal.
 */
const BillingPortalButton: React.FC<BillingPortalButtonProps> = ({
  label = 'Manage Billing & Payment Methods',
}) => {
  const {
    subscription,
    portalLoading,
    portalError,
    openBillingPortal,
  } = useSubscription()

  // Only show if the user has an active subscription
  if (!subscription?.is_active) {
    return null
  }

  const handleClick = () => {
    openBillingPortal()
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleClick}
        disabled={portalLoading}
        className={`px-4 py-2 rounded-md font-medium transition ${
          portalLoading
            ? 'bg-gray-400 text-white cursor-not-allowed opacity-60'
            : 'bg-indigo-600 text-white hover:bg-indigo-700'
        }`}
      >
        {portalLoading ? 'Opening…' : label}
      </button>

      {portalError && (
        <p className="text-sm text-red-600">
          {portalError.response?.data.message || portalError.message}
        </p>
      )}
    </div>
  )
}

export default BillingPortalButton
