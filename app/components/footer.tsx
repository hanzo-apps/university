'use client'

import React from 'react'
import Link from 'next/link'
import { Text, View, XStack, YStack } from '@hanzo/ui'
import { HanzoWordmark } from '@hanzogui/shell'
import { ShieldCheck, Award, GraduationCap } from 'lucide-react'

export function Footer() {
  return (
    <YStack
      render="footer"
      borderTopWidth={0}
      bg="var(--pure-black)"
      py={64}
      px={16}
      $md={{ px: 24 }}
      gap={48}
      width="100%"
      maxW="100vw"
      overflow="hidden"
    >
      <XStack
        maxW={1280}
        mx="auto"
        width="100%"
        justify="space-between"
        flexWrap="wrap"
        gap={40}
      >
        {/* Brand Column */}
        <YStack gap={16} maxW="100%" minW={0} width={340}>
          <HanzoWordmark label="Hanzo University" size={24} />
          <Text fontSize="$2" color="var(--muted-foreground)" lineHeight={22}>
            The systems engineering institute of the Hanzo AI ecosystem. Training engineers in frontier decision models, zero-regression AST code agents, and native reinforcement learning.
          </Text>
          <XStack items="center" gap={8} pt={8}>
            <Award size={16} color="var(--emerald-400)" />
            <Text fontSize="$1" color="var(--muted-foreground)" fontFamily="$mono">
              W3C Verifiable Credentials Standard
            </Text>
          </XStack>
        </YStack>

        {/* Degree Programs */}
        <YStack gap={12} minW={0} maxW="100%">
          <Text fontSize="$2" fontWeight="700" color="var(--white)" fontFamily="$mono">
            ACADEMIC PROGRAMS
          </Text>
          <Link href="/agentic-coding" style={{ textDecoration: 'none' }}>
            <Text fontSize="$2" color="var(--muted-foreground)" hoverStyle={{ color: 'var(--white)' }}>
              ENG 100 · Agentic Coding Systems (HACE)
            </Text>
          </Link>
          <Link href="/reinforcement-learning" style={{ textDecoration: 'none' }}>
            <Text fontSize="$2" color="var(--muted-foreground)" hoverStyle={{ color: 'var(--white)' }}>
              RL 101 · Native Reinforcement Learning (HARLE)
            </Text>
          </Link>
          <Link href="/agentic-marketing" style={{ textDecoration: 'none' }}>
            <Text fontSize="$2" color="var(--muted-foreground)" hoverStyle={{ color: 'var(--white)' }}>
              MKT 102 · Agentic Marketing & Autonomous Campaigns (HAME)
            </Text>
          </Link>
          <Link href="/systems-engineering" style={{ textDecoration: 'none' }}>
            <Text fontSize="$2" color="var(--muted-foreground)" hoverStyle={{ color: 'var(--white)' }}>
              SYS 103 · Systems Engineering Foundation (HCAISE)
            </Text>
          </Link>
          <Link href="/ai-practitioner" style={{ textDecoration: 'none' }}>
            <Text fontSize="$2" color="var(--muted-foreground)" hoverStyle={{ color: 'var(--white)' }}>
              PRA 104 · AI Practitioner & Tools (HCAIP)
            </Text>
          </Link>
          <Link href="/ai-architect" style={{ textDecoration: 'none' }}>
            <Text fontSize="$2" color="var(--muted-foreground)" hoverStyle={{ color: 'var(--white)' }}>
              ARC 105 · AI Architect Masterclass (HCPAIA)
            </Text>
          </Link>
        </YStack>

        {/* Student Resources */}
        <YStack gap={12} minW={0} maxW="100%">
          <Text fontSize="$2" fontWeight="700" color="var(--white)" fontFamily="$mono">
            STUDENT SERVICES
          </Text>
          <Link href="/portal" style={{ textDecoration: 'none' }}>
            <Text fontSize="$2" color="var(--white)" hoverStyle={{ color: 'var(--emerald-400)' }}>
              Student Learning Portal
            </Text>
          </Link>
          <a href="https://hanzo.ai/docs" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
            <Text fontSize="$2" color="var(--muted-foreground)" hoverStyle={{ color: 'var(--white)' }}>
              Hanzo Documentation ↗
            </Text>
          </a>
          <a href="https://hanzo.blog" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
            <Text fontSize="$2" color="var(--muted-foreground)" hoverStyle={{ color: 'var(--white)' }}>
              Research & Technical Blog ↗
            </Text>
          </a>
          <a href="https://hanzo.ai" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
            <Text fontSize="$2" color="var(--muted-foreground)" hoverStyle={{ color: 'var(--white)' }}>
              Hanzo Cloud Fabric ↗
            </Text>
          </a>
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
          © {new Date().getFullYear()} Hanzo Industries Inc. Hanzo University is an open engineering and research institution.
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
