'use client'

import React, { type ReactNode } from 'react'
import { Box, View, XStack, YStack, Text } from '@/components/ui'
import { Eyebrow, Title, Lede, Chip } from '@hanzo/ui/marketing'
import { Grid } from '@hanzo/ui/grid'
import Link from 'next/link'

export const INK = 'var(--pure-black)'
export const FADE = 'linear-gradient(to bottom, var(--background), color-mix(in oklab, var(--neutral-900) 20%, transparent))'
export const FADE_UP = 'linear-gradient(to top, var(--background), color-mix(in oklab, var(--neutral-900) 20%, transparent))'

export function Band({
  id,
  rule = true,
  measure = 1280,
  pad = 48,
  ground,
  children,
  ...props
}: {
  id?: string
  rule?: boolean
  measure?: number
  pad?: number | string
  ground?: string
  children: ReactNode
  [key: string]: any
}) {
  return (
    <Box
      id={id}
      position="relative"
      overflow="hidden"
      width="100%"
      py={pad as any}
      px={20}
      borderTopWidth={rule ? 1 : 0}
      borderColor="var(--border)"
      background={ground}
      {...props}
    >
      <Box width="100%" maxW={measure} mx="auto">
        {children}
      </Box>
    </Box>
  )
}

export function Card({
  p = 24,
  children,
  ...props
}: {
  p?: number | string
  children: ReactNode
  [key: string]: any
}) {
  return (
    <Box
      rounded="var(--radius-xl)"
      borderWidth={1}
      borderColor="var(--border)"
      bg="var(--card)"
      p={p as any}
      {...props}
    >
      {children}
    </Box>
  )
}

export function Head({
  eyebrow,
  title,
  lede,
  loud,
  measure = 760,
  children,
}: {
  eyebrow?: string
  title?: ReactNode
  lede?: ReactNode
  loud?: boolean
  measure?: number
  children?: ReactNode
}) {
  if (!eyebrow && !title && !lede && !children) return null
  return (
    <Grid columns={1} gap={16} width="100%" maxW={measure} mx="auto" mb={48} $platform-web={{ textAlign: 'center' }}>
      {eyebrow ? <Eyebrow>{eyebrow}</Eyebrow> : null}
      {title ? (
        <Title quiet={!loud}>
          {title}
        </Title>
      ) : null}
      {lede ? <Lede>{lede}</Lede> : null}
      {children}
    </Grid>
  )
}

export function Hero({
  crumb,
  badge,
  title,
  lede,
  children,
}: {
  crumb?: string
  badge?: string
  title: string
  lede: ReactNode
  children: ReactNode
}) {
  return (
    <Box
      position="relative"
      overflow="hidden"
      pt={100}
      pb={48}
      px={20}
      $platform-web={{ textAlign: 'center' }}
    >
      <View
        aria-hidden
        position="absolute"
        t={0}
        l="50%"
        x="-50%"
        width={720}
        height={420}
        pointerEvents="none"
        backgroundImage="radial-gradient(circle, var(--white-10) 0%, transparent 68%)"
        filter="blur(100px)"
      />
      <Box position="relative" z={10} width="100%" maxW={768} mx="auto">
        {crumb ? (
          <XStack justify="center" items="center" gap={8} mb={16}>
            <Link href="/" style={{ color: 'var(--muted-foreground)', fontSize: 13, textDecoration: 'none' }}>
              University
            </Link>
            <Text color="var(--muted-foreground)" fontSize={13}>/</Text>
            <Text color="var(--foreground)" fontSize={13} fontWeight="500">
              {crumb}
            </Text>
          </XStack>
        ) : null}

        {badge ? (
          <Box display="inline-flex" mb={20}>
            <Chip px={16} py={8} fontSize="$1">
              <View render="span" width={6} height={6} rounded={9999} bg="var(--pure-white)" mr={8} />
              {badge}
            </Chip>
          </Box>
        ) : null}

        <Title mb={20} quiet={false}>
          {title}
        </Title>

        <Lede mb={32} width="100%" maxW={672} mx="auto">
          {lede}
        </Lede>

        <XStack flexWrap="wrap" justify="center" gap="$3">
          {children}
        </XStack>
      </Box>
    </Box>
  )
}
