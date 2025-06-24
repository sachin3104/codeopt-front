// File: src/components/subscription/SubscriptionDetails.tsx
import React from 'react'
import { useSubscription } from '@/hooks/use-subscription'
import { formatDistanceToNowStrict, parseISO } from 'date-fns'

const SubscriptionDetails: React.FC = () => {
  const {
    subscription,
    fetching,
    fetchError,
  } = useSubscription()

  if (fetching) {
    return (
      <div className="flex items-center">
        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-500 mr-2" />
        <span>Loading subscription…</span>
      </div>
    )
  }

  if (fetchError) {
    return (
      <div className="text-red-600">
        <p>Unable to load subscription details.</p>
      </div>
    )
  }

  if (!subscription) {
    return (
      <div className="text-gray-700">
        <p>No active subscription.</p>
      </div>
    )
  }

  const { plan, status, current_period_end, days_until_renewal, cancel_at_period_end } = subscription

  // Compute a human-friendly renewal string
  let renewalText = 'N/A'
  if (current_period_end) {
    const dt = parseISO(current_period_end)
    renewalText = formatDistanceToNowStrict(dt, { addSuffix: true })
  }

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <h2 className="text-xl font-semibold mb-2">Your Subscription</h2>
      <div className="space-y-1 text-gray-800">
        <p>
          <span className="font-medium">Plan:</span> {plan.name}
        </p>
        <p>
          <span className="font-medium">Status:</span> {status}{' '}
          {cancel_at_period_end && status === 'active' && (
            <span className="text-sm text-yellow-600">(Cancels at period end)</span>
          )}
        </p>
        <p>
          <span className="font-medium">Renewal:</span> {renewalText}
        </p>
        {days_until_renewal != null && (
          <p>
            <span className="font-medium">Days until renewal:</span> {days_until_renewal}
          </p>
        )}
      </div>
    </div>
  )
}

export default SubscriptionDetails
