'use client'

import React from 'react'
import Link from 'next/link'
import { Text, XStack, YStack } from '@hanzo/ui'
import { HanzoWordmark } from '@hanzogui/shell'
import { ShieldCheck } from 'lucide-react'
import { CERTIFICATION_TRACKS } from '../courses-data'

export function Footer() {
  return (
    <YStack
      render="footer"
      borderTopWidth={1}
      borderColor="var(--border)"
      bg="var(--pure-black)"
      py={64}
      px={16}
      $md={{ px: 24 }}
      gap={48}
      width="100%"
      maxW="100vw"
      overflow="hidden"
    >
      <XStack maxW={1280} mx="auto" width="100%" justify="space-between" flexWrap="wrap" gap={40}>
        {/* Brand Column */}
        <YStack gap={14} maxW="100%" minW={0} width={330}>
          <HanzoWordmark label="Hanzo University" size={24} />
          <Text fontSize="$2" color="var(--muted-foreground)" lineHeight={22}>
            The School of Intelligence Engineering. Real models. Real compute. Real experiments. Real skills—across Intelligence Engineering, Autonomous Science, Cybersecurity, and AI Entrepreneurship.
          </Text>
          <XStack items="flex-start" gap={8} pt={6}>
            <ShieldCheck size={16} color="var(--white-70)" style={{ flexShrink: 0, marginTop: 2 }} />
            <Text fontSize="$1" color="var(--muted-foreground)" lineHeight={18}>
              W3C Verifiable Credentials provide cryptographic proof of completed practical capstones &amp; live artifacts. Hanzo University issues professional certifications and fellowships, not accredited academic degrees.
            </Text>
          </XStack>
        </YStack>

        {/* Schools & Entry Courses */}
        <YStack gap={10} minW={0} maxW="100%">
          <Text fontSize="$1" fontWeight="700" color="var(--white)" fontFamily="$mono" letterSpacing={0.6}>
            SCHOOLS &amp; FOUNDATION
          </Text>
          <Link href="/continuous-improvement" style={{ textDecoration: 'none' }}>
            <Text fontSize="$2" color="var(--emerald-400)" hoverStyle={{ color: 'var(--white)' }}>
              AUTO 101 · Continuous Improvement (Free)
            </Text>
          </Link>
          <Link href="/kai-decision-intelligence" style={{ textDecoration: 'none' }}>
            <Text fontSize="$2" color="var(--muted-foreground)" hoverStyle={{ color: 'var(--white)' }}>
              School of Intelligence Engineering
            </Text>
          </Link>
          <Link href="/science-discovery" style={{ textDecoration: 'none' }}>
            <Text fontSize="$2" color="var(--muted-foreground)" hoverStyle={{ color: 'var(--white)' }}>
              School of Autonomous Science
            </Text>
          </Link>
          <Link href="/ai-security-fundamentals" style={{ textDecoration: 'none' }}>
            <Text fontSize="$2" color="var(--muted-foreground)" hoverStyle={{ color: 'var(--white)' }}>
              School of Cybersecurity
            </Text>
          </Link>
          <Link href="/build-your-ai-company" style={{ textDecoration: 'none' }}>
            <Text fontSize="$2" color="var(--muted-foreground)" hoverStyle={{ color: 'var(--white)' }}>
              School of Autonomous Business &amp; Entrepreneurship
            </Text>
          </Link>
        </YStack>

        {/* Flagship Certifications */}
        <YStack gap={10} minW={0} maxW="100%">
          <Text fontSize="$1" fontWeight="700" color="var(--white)" fontFamily="$mono" letterSpacing={0.6}>
            CERTIFICATION TRACKS
          </Text>
          {CERTIFICATION_TRACKS.map((track) => (
            <Link key={track.slug} href={`/checkout/${track.slug}`} style={{ textDecoration: 'none' }}>
              <Text fontSize="$2" color="var(--muted-foreground)" hoverStyle={{ color: 'var(--white)' }}>
                {track.name}
              </Text>
            </Link>
          ))}
        </YStack>

        {/* 4 Interconnected Layers & Services */}
        <YStack gap={10} minW={0} maxW="100%">
          <Text fontSize="$1" fontWeight="700" color="var(--white)" fontFamily="$mono" letterSpacing={0.6}>
            ECOSYSTEM LAYERS
          </Text>
          <a href="https://hanzo.ai" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
            <Text fontSize="$2" color="var(--muted-foreground)" hoverStyle={{ color: 'var(--white)' }}>
              Discover · hanzo.ai ↗
            </Text>
          </a>
          <a href="https://docs.hanzo.ai" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
            <Text fontSize="$2" color="var(--muted-foreground)" hoverStyle={{ color: 'var(--white)' }}>
              Understand · docs.hanzo.ai ↗
            </Text>
          </a>
          <a href="https://docs.hanzo.ai/docs/guides" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
            <Text fontSize="$2" color="var(--muted-foreground)" hoverStyle={{ color: 'var(--white)' }}>
              Build · Practical Guides ↗
            </Text>
          </a>
          <a href="https://hanzo.app/learn" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
            <Text fontSize="$2" color="var(--white)" hoverStyle={{ color: 'var(--white-70)' }}>
              Master &amp; Ship · hanzo.app/learn ↗
            </Text>
          </a>
          <Link href="/verify" style={{ textDecoration: 'none' }}>
            <Text fontSize="$2" color="var(--muted-foreground)" hoverStyle={{ color: 'var(--white)' }}>
              Verify W3C Credentials
            </Text>
          </Link>
        </YStack>
      </XStack>

      <XStack
        maxW={1280}
        mx="auto"
        width="100%"
        justify="space-between"
        items="center"
        borderTopWidth={1}
        borderColor="var(--border)"
        pt={24}
        flexWrap="wrap"
        gap={16}
      >
        <Text fontSize="$1" color="var(--muted-foreground)">
          © {new Date().getFullYear()} Hanzo AI Inc. Hanzo University — The School of Intelligence Engineering.
        </Text>
        <XStack items="center" gap={16}>
          <a href="https://hanzo.ai/legal/terms" style={{ color: 'var(--muted-foreground)', fontSize: '12px', textDecoration: 'none' }}>
            Terms
          </a>
          <a href="https://hanzo.ai/legal/privacy" style={{ color: 'var(--muted-foreground)', fontSize: '12px', textDecoration: 'none' }}>
            Privacy
          </a>
          <a href="https://hanzo.ai/security" style={{ color: 'var(--muted-foreground)', fontSize: '12px', textDecoration: 'none' }}>
            Security
          </a>
        </XStack>
      </XStack>
    </YStack>
  )
}
