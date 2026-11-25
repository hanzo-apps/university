export const BILLING_URL = 'https://hanzo.ai/pay'

/** Hanzo Pro on hanzo.ai's checkout: sign in via Hanzo IAM, select plan, complete payment. */
export const PRO_CHECKOUT = `https://hanzo.ai/login?next=${encodeURIComponent(
  `/onboarding?next=${encodeURIComponent(`/pay/confirm/card?plan=dev&returnUrl=${encodeURIComponent('https://hanzo.app/learn')}`)}`,
)}`

/** Dedicated University course or certification track checkout URL. */
export function courseCheckoutUrl(slug: string, coupon?: string): string {
  const q = new URLSearchParams()
  if (coupon) q.set('coupon', coupon)
  const qs = q.toString()
  return `/checkout/${slug}${qs ? `?${qs}` : ''}`
}

/** Direct billing cart URL on hanzo.ai/pay with optional plan, coupon, and return URL. */
export function checkoutUrl(id: string, back?: string, coupon?: string): string {
  const q = new URLSearchParams()
  if (id) q.set('plan', id)
  if (coupon) q.set('coupon', coupon)
  if (back) q.set('returnUrl', back)
  const qs = q.toString()
  return `${BILLING_URL}/cart${qs ? `?${qs}` : ''}`
}
