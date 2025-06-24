// File: src/pages/subscription/Dashboard.tsx
import React from 'react'
import SubscriptionDetails from '@/components/subscription/SubscriptionDetails'
import CancelSubscriptionButton from '@/components/subscription/CancelSubscriptionButton'
import BillingPortalButton from '@/components/subscription/BillingPortalButton'

const Dashboard: React.FC = () => {
  return (
    <div className="p-6 space-y-8 max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold">Your Account</h1>

      {/* Subscription summary */}
      <SubscriptionDetails />

      {/* Actions */}
      <div className="flex flex-col sm:flex-row sm:space-x-4 space-y-4 sm:space-y-0 mt-4">
        <CancelSubscriptionButton />
        <BillingPortalButton />
      </div>

      {/* TODO: other dashboard widgets */}
    </div>
  )
}

export default Dashboard
