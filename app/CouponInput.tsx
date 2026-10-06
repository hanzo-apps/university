'use client'

import React, { useState } from 'react'
import { Box, Text, XStack, YStack } from '@/components/ui'
import { Action, Chip } from '@hanzo/ui/marketing'
import { Tag, Check, X, ArrowRight } from 'lucide-react'
import { courseCheckoutUrl } from '@/lib/pay'
import { validateCoupon, type CouponResult } from './courses-data'

interface CouponInputProps {
  originalPrice: number
  planId: string
  courseSlug: string
  courseCode: string
  rebateCredits: number
  onCouponChange?: (result: CouponResult) => void
  returnPath?: string
}

export function CouponInput({
  originalPrice,
  planId,
  courseSlug,
  courseCode,
  rebateCredits,
  onCouponChange,
  returnPath,
}: CouponInputProps) {
  const [code, setCode] = useState('')
  const [applied, setApplied] = useState<CouponResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const activePrice = applied?.valid ? applied.finalPrice : originalPrice
  const activeRebate = applied?.valid ? applied.rebateCredits : rebateCredits

  const checkoutHref = applied?.valid
    ? courseCheckoutUrl(courseSlug, applied.code)
    : courseCheckoutUrl(courseSlug)


  const handleApply = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    if (!code.trim()) {
      setError('Please enter a coupon code.')
      return
    }

    const res = validateCoupon(code, originalPrice)
    if (res.valid) {
      setApplied(res)
      setError(null)
      onCouponChange?.(res)
    } else {
      setError(res.message)
      setApplied(null)
    }
  }

  const handleRemove = () => {
    setCode('')
    setApplied(null)
    setError(null)
    onCouponChange?.({
      valid: false,
      code: '',
      discountAmount: 0,
      originalPrice,
      finalPrice: originalPrice,
      rebateCredits,
      message: '',
    })
  }

  return (
    <YStack gap="$3" width="100%">
      {/* Price Display with Strikethrough if discounted */}
      <YStack
        p="$4"
        rounded="var(--radius-lg)"
        bg="var(--pure-black)"
        borderWidth={1}
        borderColor={applied?.valid ? 'var(--emerald-800)' : 'var(--border)'}
        gap="$3"
      >
        <XStack items="baseline" justify="space-between" flexWrap="wrap" gap="$2">
          <YStack>
            <Text fontSize="$1" color="var(--muted-foreground)" fontFamily="$mono">
              TUITION DUE TODAY
            </Text>
            <XStack items="baseline" gap="$2" mt="$1">
              {applied?.valid && (
                <Text
                  fontSize="$4"
                  fontWeight="600"
                  color="var(--muted-foreground)"
                  $platform-web={{ textDecoration: 'line-through' }}
                >
                  ${originalPrice}
                </Text>
              )}
              <Text fontSize="$6" fontWeight="800" color="var(--white)">
                ${activePrice}
              </Text>
              <Text fontSize="$1" color="var(--muted-foreground)">
                USD
              </Text>
              {applied?.valid && applied.discountPercent && (
                <Chip px={8} py={2} fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">
                  {applied.discountPercent}% OFF
                </Chip>
              )}
            </XStack>
          </YStack>

          <YStack items="flex-end">
            <Text fontSize="$1" color="var(--muted-foreground)" fontFamily="$mono">
              COMPUTE REBATE (25%)
            </Text>
            <Chip px={10} py={3} fontSize="$1" fontFamily="$mono" color="var(--white)" mt="$1">
              +${activeRebate} Credits
            </Chip>
          </YStack>
        </XStack>

        {/* Applied Coupon Banner */}
        {applied?.valid && (
          <XStack
            items="center"
            justify="space-between"
            p="$2"
            px="$3"
            rounded="var(--radius-md)"
            bg="$panel"
            $platform-web={{ backgroundColor: 'color-mix(in srgb, var(--emerald-500) 12%, transparent)' }}
            borderWidth={1}
            borderColor="var(--emerald-800)"
          >
            <XStack items="center" gap="$2">
              <Check size={14} color="var(--emerald-400)" />
              <Text fontSize="$1" color="var(--emerald-300)" fontWeight="600">
                {applied.message}
              </Text>
            </XStack>
            <Box
              render="button"
              onClick={handleRemove}
              p="$1"
              rounded="var(--radius-sm)"
              $platform-web={{
                cursor: 'pointer',
                background: 'transparent',
                border: 'none',
                color: 'var(--muted-foreground)',
              }}
            >
              <X size={14} />
            </Box>
          </XStack>
        )}

        {/* Coupon Input Form */}
        {!applied?.valid ? (
          <XStack render={<form onSubmit={handleApply} />} gap="$2" width="100%" mt="$1">
            <Box flex={1} position="relative">
              <input
                type="text"
                placeholder="Coupon code (e.g. STUDENT50, HANZO20)"
                value={code}
                onChange={(e) => {
                  setCode(e.target.value.toUpperCase())
                  if (error) setError(null)
                }}
                style={{
                  width: '100%',
                  padding: '9px 12px 9px 34px',
                  borderRadius: 'var(--radius-md)',
                  background: 'var(--card)',
                  color: 'var(--white)',
                  border: error ? '1px solid var(--red-600)' : '1px solid var(--border)',
                  fontSize: '13px',
                  fontFamily: 'monospace',
                  outline: 'none',
                }}
              />
              <Box position="absolute" l={10} t={10} pointerEvents="none" opacity={0.6}>
                <Tag size={14} color="var(--white)" />
              </Box>
            </Box>
            <Action
              render="button"
              type="submit"
              px={14}
              py={8}
              $platform-web={{ fontSize: '13px' }}
            >
              Apply
            </Action>
          </XStack>
        ) : null}

        {error && (
          <Text fontSize="$1" color="var(--red-400)" mt={-4}>
            {error}
          </Text>
        )}

        {/* Suggested Quick Promos */}
        {!applied?.valid && (
          <XStack items="center" gap="$2" flexWrap="wrap" pt="$1">
            <Text fontSize="$1" color="var(--muted-foreground)">
              Suggested codes:
            </Text>
            {['STUDENT50', 'HANZO20', 'EARLYBIRD'].map((sample) => (
              <Box
                key={sample}
                render="button"
                onClick={() => {
                  setCode(sample)
                  const res = validateCoupon(sample, originalPrice)
                  if (res.valid) {
                    setApplied(res)
                    setError(null)
                    onCouponChange?.(res)
                  }
                }}
                px={8}
                py={2}
                rounded="var(--radius-sm)"
                bg="var(--card)"
                borderWidth={1}
                borderColor="var(--border)"
                $platform-web={{
                  cursor: 'pointer',
                  fontSize: '11px',
                  fontFamily: 'monospace',
                  color: 'var(--muted-foreground)',
                }}
                hoverStyle={{ borderColor: 'var(--white)' }}
              >
                {sample}
              </Box>
            ))}
          </XStack>
        )}

        {/* Primary Checkout Action Button */}
        <YStack gap="$2" mt="$2">
          <Action href={checkoutHref} fill>
            Enroll in {courseCode} — ${activePrice} USD →
          </Action>
          <Text
            fontSize="$1"
            color="var(--muted-foreground)"
            $platform-web={{ textAlign: 'center', display: 'block' }}
          >
            Includes {activeRebate} compute credit rebate, gVisor sandbox pod & HACE Credential
          </Text>
        </YStack>
      </YStack>
    </YStack>
  )
}
