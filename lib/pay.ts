export const BILLING_URL = 'https://hanzo.ai/pay'

/** Hanzo Pro on hanzo.ai's checkout, reached the way its pricing page reaches it: sign in, the plan picker, then the card. */
export const PRO_CHECKOUT = `https://hanzo.ai/login?next=${encodeURIComponent(
  `/onboarding?next=${encodeURIComponent(`/pay/confirm/card?plan=dev&returnUrl=${encodeURIComponent('https://hanzo.ai/')}`)}`,
)}`

/**
 * Returns dedicated University course tuition checkout URL.
 */
export function courseCheckoutUrl(slug: string, coupon?: string): string {
  const q = new URLSearchParams()
  if (coupon) q.set('coupon', coupon)
  const qs = q.toString()
  return `/checkout/${slug}${qs ? `?${qs}` : ''}`
}

export function checkoutUrl(id: string, back?: string): string {
  const q = new URLSearchParams()
  if (id) q.set('plan', id)
  if (back) q.set('returnUrl', back)
  const qs = q.toString()
  return `${BILLING_URL}/cart${qs ? `?${qs}` : ''}`
}


export const dollars = (n: number) => `$${n.toFixed(2)}`
export const money = (n: number) => (Number.isInteger(n) ? `$${n.toLocaleString('en-US')}` : dollars(n))
