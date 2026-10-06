export const BILLING_URL = 'https://hanzo.ai/pay'

/**
 * Generates the Hanzo checkout URL for a course plan.
 * Returns to returnUrl upon completion so the student seamlessly lands in the portal.
 */
export function checkoutUrl(id: string, back?: string): string {
  const q = new URLSearchParams()
  if (id) q.set('plan', id)
  if (back) q.set('returnUrl', back)
  const qs = q.toString()
  return `${BILLING_URL}/cart${qs ? `?${qs}` : ''}`
}

export const dollars = (n: number) => `$${n.toFixed(2)}`
export const money = (n: number) => (Number.isInteger(n) ? `$${n.toLocaleString('en-US')}` : dollars(n))
