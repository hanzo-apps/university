'use client'

import React, { Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Box, Text, XStack, YStack } from '@/components/ui'
import { Action, Chip, Lede, Title } from '@hanzo/ui/marketing'
import { PRO_CHECKOUT, checkoutUrl } from '@/lib/pay'
import { validateCoupon, type CheckoutItem } from '../../courses-data'

function CheckoutContent({ item }: { item: CheckoutItem }) {
  const searchParams = useSearchParams()
  const couponParam = (searchParams.get('coupon') || '').trim().toUpperCase()
  const couponRes = couponParam ? validateCoupon(couponParam, item.price) : null
  const finalPrice = couponRes?.valid ? couponRes.finalPrice : item.price

  if (item.isFree) {
    return (
      <YStack minH="70vh" items="center" justify="center" gap={20} px={16} py={64} maxW={600} mx="auto" $platform-web={{ textAlign: 'center' }}>
        <Chip px={10} py={3} fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">
          {item.code} · FREE OPEN ACCESS
        </Chip>
        <Title>{item.title}</Title>
        <Lede>
          This course is free — no payment or card is required. Launch the interactive workspace on hanzo.app/learn or open the Student Portal directly.
        </Lede>
        <XStack gap={12} flexWrap="wrap" justify="center">
          <Action href={item.learnWorkspaceUrl} fill>
            Start Learning Free on hanzo.app/learn ↗
          </Action>
          <Action href={`/portal?course=${item.slug}`}>
            Open Student Portal →
          </Action>
        </XStack>
      </YStack>
    )
  }

  const targetHref =
    item.kind === 'membership'
      ? PRO_CHECKOUT
      : checkoutUrl(
          item.planId,
          `https://hanzo.university/portal?course=${item.courseSlugs?.[0] || item.slug}&welcome=1`,
          couponRes?.valid ? couponRes.code : undefined
        )

  return (
    <YStack minH="70vh" items="center" justify="center" gap={20} px={16} py={64} maxW={600} mx="auto">
      <Box
        width="100%"
        p={28}
        rounded="var(--radius-xl)"
        bg="rgba(255, 255, 255, 0.03)"
        borderWidth={1}
        borderColor="rgba(255, 255, 255, 0.1)"
      >
        <YStack gap={18}>
          <XStack items="center" justify="space-between" flexWrap="wrap" gap={8}>
            <Chip px={10} py={3} fontSize="$1" fontFamily="$mono">
              {item.code} · {item.kind === 'track' ? 'CERTIFICATION TRACK' : item.kind === 'membership' ? 'UNIVERSITY PRO' : 'COURSE'}
            </Chip>
            <Text fontFamily="$mono" fontSize={12} color="var(--muted-foreground)">
              {item.duration}
            </Text>
          </XStack>

          <Title quiet={false}>{item.title}</Title>
          <Lede>{item.summary}</Lede>

          <Box p={16} rounded="var(--radius-lg)" bg="var(--pure-black)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
            <XStack items="baseline" justify="space-between" flexWrap="wrap" gap={8}>
              <Text fontFamily="$mono" fontSize={12} color="var(--muted-foreground)">
                {item.kind === 'membership' ? 'SELF-SERVE MEMBERSHIP' : 'TOTAL DUE ON HANZO CHECKOUT'}
              </Text>
              <XStack items="baseline" gap={8}>
                {couponRes?.valid && (
                  <Text fontSize={16} color="var(--muted-foreground)" $platform-web={{ textDecoration: 'line-through' }}>
                    ${item.price}
                  </Text>
                )}
                <Text fontSize={26} fontWeight="800" color="var(--white)" fontFamily="$mono">
                  {item.kind === 'membership' ? 'Bundled with Hanzo Pro' : `$${finalPrice} USD`}
                </Text>
              </XStack>
            </XStack>
            {couponRes?.valid && (
              <Text fontSize={12} color="var(--emerald-400)" mt={6} fontFamily="$mono">
                ✓ {couponRes.message} ({couponRes.code})
              </Text>
            )}
          </Box>

          <Text fontSize={13} color="var(--muted-foreground)" lineHeight={20}>
            Self-service enrollment is handled through Hanzo&rsquo;s secure checkout at hanzo.ai/pay. Sign in with Hanzo IAM to activate your course access, sandboxed labs on hanzo.app/learn, and Student Portal workstation.
          </Text>

          <YStack gap={10}>
            <Action href={targetHref} fill>
              Continue to Hanzo Checkout →
            </Action>
            <XStack items="center" justify="space-between" flexWrap="wrap" gap={8} pt={4}>
              <Link
                href={item.kind === 'course' ? `/${item.slug}` : '/#certifications'}
                style={{ color: 'var(--muted-foreground)', fontSize: '13px', textDecoration: 'none' }}
              >
                ← Back to syllabus
              </Link>
              <a
                href={item.learnWorkspaceUrl}
                target="_blank"
                rel="noreferrer"
                style={{ color: 'var(--white)', fontSize: '13px', fontWeight: 500, textDecoration: 'none' }}
              >
                Preview Learning Workspace ↗
              </a>
            </XStack>
          </YStack>
        </YStack>
      </Box>
    </YStack>
  )
}

export function Moved({ item }: { item: CheckoutItem }) {
  return (
    <Suspense
      fallback={
        <YStack minH="60vh" items="center" justify="center" p={32}>
          <Text color="var(--white)">Loading checkout...</Text>
        </YStack>
      }
    >
      <CheckoutContent item={item} />
    </Suspense>
  )
}
