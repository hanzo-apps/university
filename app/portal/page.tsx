'use client'

import React, { useEffect, useState } from 'react'
import { Box, Text, YStack } from '@hanzo/ui'
import { UNIVERSITY_COURSES } from '../courses-data'

const WORKSPACE_BASE = 'https://hanzo.app/learn'

export default function PortalRedirectPage() {
  const [target, setTarget] = useState(WORKSPACE_BASE)

  useEffect(() => {
    const params = new URLSearchParams(window.location.search)
    const slug = (params.get('course') || params.get('enrolled') || '').trim()
    const validSlug = UNIVERSITY_COURSES.some((c) => c.slug === slug) ? slug : ''
    const nextUrl = validSlug ? `${WORKSPACE_BASE}/${validSlug}` : WORKSPACE_BASE
    setTarget(nextUrl)
    window.location.replace(nextUrl)
  }, [])

  return (
    <Box minH="70vh" bg="var(--pure-black)" display="flex" items="center" justify="center" px={20}>
      <YStack items="center" gap={16} maxW={480} $platform-web={{ textAlign: 'center' }}>
        <Text fontFamily="$mono" fontSize={12} color="var(--emerald-400)" fontWeight="700">
          HANZO LEARNING WORKSPACE
        </Text>
        <Text fontSize={24} fontWeight="700" color="var(--white)">
          Redirecting to hanzo.app/learn…
        </Text>
        <Text fontSize={14} color="var(--muted-foreground)" lineHeight={21}>
          The interactive student workspace, live labs, and AI Faculty mentors live on hanzo.app/learn.
        </Text>
        <a
          href={target}
          style={{
            padding: '10px 20px',
            borderRadius: '999px',
            background: '#ffffff',
            color: '#000000',
            fontSize: '13px',
            fontWeight: 700,
            textDecoration: 'none',
          }}
        >
          Open Learning Workspace →
        </a>
        <noscript>
          <meta httpEquiv="refresh" content={`0;url=${WORKSPACE_BASE}`} />
        </noscript>
      </YStack>
    </Box>
  )
}
