export async function redirectToStripeCheckout(sessionUrl: string): Promise<void> {
  // Simply navigate to Stripe's hosted checkout page:
  window.location.href = sessionUrl
}
