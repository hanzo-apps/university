'use client'

import { YStack } from '@/components/ui'
import { Action, Lede, Title } from '@hanzo/ui/marketing'
import { PRO_CHECKOUT } from '@/lib/pay'

/** Enrollment is bought on Hanzo's own checkout: Hanzo sign-in, then the card on Square. */
export function Moved() {
  return (
    <YStack minH="70vh" items="center" justify="center" gap={20} px={16} py={64} maxW={560} mx="auto">
      <Title>Enroll through Hanzo</Title>
      <Lede>
        University membership is bought on Hanzo’s secure checkout. You sign in with your Hanzo account, and your card is
        handled by Square. Hanzo Pro gives you the full developer platform the courses run on.
      </Lede>
      <Action href={PRO_CHECKOUT} fill>
        Continue to Hanzo checkout
      </Action>
    </YStack>
  )
}
