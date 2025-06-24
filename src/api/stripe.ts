/**
 * Redirects the user to Stripe Checkout using a session URL returned from the backend.
 * Simply navigates to Stripe's hosted checkout page.
 * @param sessionUrl The full checkout session URL returned by your backend
 */
export async function redirectToStripeCheckout(sessionUrl: string): Promise<void> {
  // Simply navigate to Stripe's hosted checkout page:
  window.location.href = sessionUrl
}
