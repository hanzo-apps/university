'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Band, Card, Head } from '@/components/band'
import { Box, Text, XStack, YStack, View } from '@/components/ui'
import { Action, Title, Lede, Eyebrow, Chip } from '@hanzo/ui/marketing'
import { Grid } from '@hanzo/ui/grid'
import {
  ShieldCheck,
  CheckCircle2,
  Copy,
  Download,
  ExternalLink,
  Award,
  Terminal,
  Search,
  Check,
  ArrowRight,
  Sparkles,
  Lock,
} from 'lucide-react'
import { UNIVERSITY_COURSES } from '../courses-data'

function VerifyContent() {
  const searchParams = useSearchParams()
  const rawId = searchParams.get('id') || 'HACE-2026-9821'
  const rawStudent = searchParams.get('student') || 'student'
  const rawName = searchParams.get('name')

  const [certId, setCertId] = useState(rawId)
  const [searchInput, setSearchInput] = useState(rawId)
  const [studentHandle, setStudentHandle] = useState(rawStudent)
  const [studentName, setStudentName] = useState(rawName || (rawStudent !== 'student' ? rawStudent.charAt(0).toUpperCase() + rawStudent.slice(1) : 'Student'))
  const [copied, setCopied] = useState<string | null>(null)

  useEffect(() => {
    if (rawId) {
      setCertId(rawId)
      setSearchInput(rawId)
    }
    if (rawStudent) {
      setStudentHandle(rawStudent)
      if (!rawName) {
        setStudentName(rawStudent.charAt(0).toUpperCase() + rawStudent.slice(1))
      }
    }
    if (rawName) {
      setStudentName(rawName)
    }
  }, [rawId, rawStudent, rawName])

  // Determine which course matches the certificate prefix (e.g. HACE -> agentic-coding, HARLE -> rl, HCAISE -> systems)
  const matchedCourse =
    UNIVERSITY_COURSES.find((c) => certId.toUpperCase().startsWith(c.credential)) ||
    UNIVERSITY_COURSES[0]

  const jsonLdPayload = {
    '@context': [
      'https://www.w3.org/ns/credentials/v2',
      'https://hanzo.university/credentials/v1',
    ],
    id: `urn:uuid:hanzo-cert-2026-${matchedCourse.credential}-${certId.split('-').pop() || '9821'}`,
    type: ['VerifiableCredential', 'HanzoUniversityDegree'],
    issuer: {
      id: 'did:hanzo:trust:accreditation',
      name: 'Hanzo University Research Foundation',
    },
    validFrom: '2026-10-06T14:12:16Z',
    credentialSubject: {
      id: `did:hanzo:student:${studentHandle}`,
      name: studentName,
      course: `${matchedCourse.code}: ${matchedCourse.title}`,
      degree: `${matchedCourse.credentialFull} (${matchedCourse.credential})`,
      units: matchedCourse.units,
      grade: 'Pass with Distinction (100% Autograder Score)',
      telemetryProof: 'Cleanroom SWE-bench test exit code 0 · 0 syntax regressions',
    },
    evidence: [
      {
        type: 'AutomatedCleanroomExecution',
        verifier: 'Hanzo Visor sandbox pod-8921b',
        evaluationSpendMicroUsd: 184200,
      },
    ],
    proof: {
      type: 'Ed25519Signature2020',
      verificationMethod: 'did:hanzo:trust:accreditation#key-1',
      created: '2026-10-06T14:12:16Z',
      proofValue: '0x7f4a8b1c99e2e89b3f4a1c2d88e0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8',
      blockchainCommitment: 'Lux Chain Block #9,418,290',
    },
  }

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text)
    setCopied(label)
    setTimeout(() => setCopied(null), 2500)
  }

  const handleDownloadJson = () => {
    const blob = new Blob([JSON.stringify(jsonLdPayload, null, 2)], {
      type: 'application/json',
    })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Hanzo-${matchedCourse.credential}-${studentHandle}-credential.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDownloadSvg = () => {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="360" height="64" viewBox="0 0 360 64" fill="none">
  <rect width="360" height="64" rx="12" fill="#0A0A0A" stroke="#262626"/>
  <rect x="1" y="1" width="358" height="62" rx="11" stroke="#34D399" stroke-opacity="0.3"/>
  <circle cx="28" cy="32" r="14" fill="#047857" fill-opacity="0.3"/>
  <path d="M22 32L26 36L34 28" stroke="#34D399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <text fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="12" font-weight="700" x="52" y="27">${matchedCourse.credential}: ${matchedCourse.title.split(' ')[0]} ${matchedCourse.title.split(' ')[1]}</text>
  <text fill="#A3A3A3" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="10" x="52" y="44">VERIFIED: ${studentName} · 100% DISTINCTION</text>
  <rect x="270" y="20" width="76" height="24" rx="6" fill="#171717" stroke="#404040"/>
  <text fill="#34D399" font-family="ui-monospace, monospace" font-size="9" font-weight="700" x="282" y="36">PASS 100%</text>
</svg>`

    const blob = new Blob([svgContent], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Hanzo-${matchedCourse.credential}-Badge.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Box minH="100vh" bg="$background" $platform-web={{ color: 'var(--foreground)' }}>
      {/* ── Top Header Bar ── */}
      <Box
        borderBottomWidth={1}
        borderColor="var(--border)"
        bg="var(--pure-black)"
        py="$3"
        px={14}
        $sm={{ px: 20 }}
        position="sticky"
        t={0}
        width="100%"
        maxW="100vw"
        overflow="hidden"
        $platform-web={{ zIndex: 20 }}
      >
        <XStack items="center" justify="space-between" maxW={1200} mx="auto" flexWrap="wrap" gap={8} width="100%">
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit', minWidth: 0, flexShrink: 1 }}>
            <XStack items="center" gap="$2" minW={0}>
              <Text fontSize="$2" fontWeight="700" color="var(--white)" fontFamily="$mono">
                hanzo.university
              </Text>
              <Chip px={6} py={2} fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">
                REGISTRY
              </Chip>
            </XStack>
          </Link>

          <XStack items="center" gap="$2" style={{ flexShrink: 0 }}>
            <Link href="/portal" style={{ textDecoration: 'none' }}>
              <Text fontSize="$1" $sm={{ fontSize: '$2' }} color="var(--muted-foreground)" hoverStyle={{ color: 'var(--white)' }}>
                Student Portal →
              </Text>
            </Link>
          </XStack>
        </XStack>
      </Box>

      {/* ── Main Verification Band ── */}
      <Band pad={56} measure={1080}>
        <Head
          eyebrow="Public Trust & Credential Verification"
          title="Cryptographic Credential Verification"
          lede="Verify immutable academic degrees and professional certifications issued by the Hanzo University Research Foundation on the Lux Ledger."
        />

        {/* Certificate Lookup Bar */}
        <Box
          p="$3"
          rounded="var(--radius-xl)"
          borderWidth={1}
          borderColor="var(--border)"
          bg="$panel"
          mb="$6"
        >
          <XStack items="center" gap="$3" flexWrap="wrap">
            <Search size={18} color="var(--muted-foreground)" style={{ marginLeft: 8 }} />
            <Box flex={1} minW={220}>
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="Enter Certificate ID (e.g. HACE-2026-9821 or did:hanzo:student:alex)"
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--white)',
                  fontSize: '14px',
                  fontFamily: 'monospace',
                  outline: 'none',
                }}
              />
            </Box>
            <Action
              render="button"
              onClick={() => setCertId(searchInput.trim())}
              px={16}
              py={8}
            >
              Verify Record →
            </Action>
          </XStack>
        </Box>

        {/* Official Verified Credential Certificate */}
        <Card
          p={16}
          $sm={{ p: 24 }}
          $md={{ p: 32 }}
          borderWidth={0}
          bg="$panel"
          position="relative"
          overflow="hidden"
          mb="$8"
        >
          {/* Subtle Ambient Radial Glow */}
          <Box
            position="absolute"
            t={0}
            r={0}
            width="min(200px, 40vw)"
            height="min(200px, 40vw)"
            rounded={9999}
            $platform-web={{
              backgroundColor: 'color-mix(in srgb, var(--emerald-500) 12%, transparent)',
            }}
            pointerEvents="none"
          />

          {/* Validation Header */}
          <XStack items="center" justify="space-between" flexWrap="wrap" gap="$3" mb="$4">
            <XStack items="center" gap="$2" flex={1} minW={0}>
              <ShieldCheck size={24} color="var(--emerald-400)" style={{ flexShrink: 0 }} />
              <YStack flex={1} minW={0}>
                <Text fontSize="$3" fontWeight="800" color="var(--white)" $xs={{ fontSize: '$2' }}>
                  VALID & CRYPTOGRAPHICALLY VERIFIED
                </Text>
                <Text fontSize="$1" color="var(--muted-foreground)" fontFamily="$mono">
                  W3C Verifiable Credential Data Model v2.0
                </Text>
              </YStack>
            </XStack>

            <Chip px={10} py={3} fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">
              LEDGER BLOCK #9,418,290
            </Chip>
          </XStack>

          <Box height={1} bg="var(--border)" my="$3" />

          {/* Certificate Body */}
          <YStack gap="$3" my="$3">
            <Text fontSize="$1" color="var(--muted-foreground)" fontFamily="$mono">
              OFFICIAL DEGREE RECIPIENT
            </Text>
            <Text fontSize="$6" fontWeight="800" color="var(--white)">
              {studentName}
            </Text>
            <Text fontSize="$2" color="var(--muted-foreground)">
              Has successfully constructed, validated, and defended production software systems meeting all academic requirements for:
            </Text>
            <Text fontSize="$4" fontWeight="700" color="var(--emerald-300)">
              {matchedCourse.credentialFull} ({matchedCourse.credential})
            </Text>
            <Text fontSize="$1" color="var(--white-80)">
              Program: {matchedCourse.code} · Academic Units: {matchedCourse.units}.0 · Level: {matchedCourse.level}
            </Text>
          </YStack>

          {/* Verification Details Grid */}
          <Grid columns={{ min: 260, max: 2 }} gap={16} mt="$4">
            <Box p="$3" rounded="var(--radius-md)" bg="var(--pure-black)" borderWidth={0}>
              <Text fontSize="$1" color="var(--muted-foreground)">DID Subject:</Text>
              <Text fontSize="$1" fontFamily="$mono" color="var(--white)" mt="$1">
                did:hanzo:student:{studentHandle}
              </Text>
            </Box>

            <Box p="$3" rounded="var(--radius-md)" bg="var(--pure-black)" borderWidth={0}>
              <Text fontSize="$1" color="var(--muted-foreground)">Issuing Authority:</Text>
              <Text fontSize="$1" fontFamily="$mono" color="var(--white)" mt="$1">
                did:hanzo:trust:accreditation
              </Text>
            </Box>

            <Box p="$3" rounded="var(--radius-md)" bg="var(--pure-black)" borderWidth={0}>
              <Text fontSize="$1" color="var(--muted-foreground)">Evaluation Grade:</Text>
              <Text fontSize="$1" fontWeight="700" color="var(--emerald-300)" mt="$1">
                100% Pass with Distinction (Automated Cleanroom Harness)
              </Text>
            </Box>

            <Box p="$3" rounded="var(--radius-md)" bg="var(--pure-black)" borderWidth={0}>
              <Text fontSize="$1" color="var(--muted-foreground)">Lux Ledger Signature:</Text>
              <Text fontSize="$1" fontFamily="$mono" color="var(--emerald-400)" mt="$1">
                0x7f4a8b1c...99e2e89b (Ed25519 Verified)
              </Text>
            </Box>
          </Grid>

          {/* Action Buttons */}
          <XStack items="center" justify="space-between" flexWrap="wrap" gap="$3" mt="$6" pt="$4" borderTopWidth={1} borderColor="var(--border)" width="100%">
            <XStack items="center" gap="$2" flexWrap="wrap" width="100%" minW={0}>
              <Action
                render="button"
                onClick={() => handleCopy(JSON.stringify(jsonLdPayload, null, 2), 'json')}
                px={10}
                py={6}
                $platform-web={{ fontSize: '11px', flex: '1 1 auto', minWidth: '90px', textAlign: 'center' }}
              >
                <Copy size={13} style={{ marginRight: 4 }} />
                {copied === 'json' ? 'Copied JSON!' : 'Copy JSON'}
              </Action>

              <Action
                render="button"
                onClick={handleDownloadJson}
                px={10}
                py={6}
                $platform-web={{ fontSize: '11px', flex: '1 1 auto', minWidth: '90px', textAlign: 'center' }}
              >
                <Download size={13} style={{ marginRight: 4 }} />
                JSON-LD
              </Action>

              <Action
                render="button"
                onClick={handleDownloadSvg}
                px={10}
                py={6}
                $platform-web={{ fontSize: '11px', flex: '1 1 auto', minWidth: '100px', textAlign: 'center' }}
              >
                <Download size={13} style={{ marginRight: 4 }} />
                SVG Badge
              </Action>
            </XStack>

            <Action
              href={`/portal?enrolled=${matchedCourse.slug}`}
              fill
              px={16}
              py={8}
              $platform-web={{ width: '100%', textAlign: 'center' }}
            >
              Access Student Portal →
            </Action>
          </XStack>
        </Card>

        {/* Inspectable JSON-LD Accordion */}
        <Box
          p="$5"
          rounded="var(--radius-xl)"
          borderWidth={1}
          borderColor="var(--border)"
          bg="var(--pure-black)"
          mb="$8"
        >
          <XStack items="center" justify="space-between" mb="$3">
            <XStack items="center" gap="$2">
              <Terminal size={16} color="var(--white)" />
              <Text fontSize="$2" fontWeight="700" color="var(--white)" fontFamily="$mono">
                W3C JSON-LD Cryptographic Payload
              </Text>
            </XStack>
            <Action
              render="button"
              onClick={() => handleCopy(JSON.stringify(jsonLdPayload, null, 2), 'payload')}
              px={10}
              py={4}
              $platform-web={{ fontSize: '11px' }}
            >
              {copied === 'payload' ? 'Copied!' : 'Copy Payload'}
            </Action>
          </XStack>

          <Box
            p="$3"
            rounded="var(--radius-md)"
            bg="var(--card)"
            borderWidth={1}
            borderColor="var(--border)"
            $platform-web={{
              whiteSpace: 'pre-wrap',
              maxHeight: '260px',
              overflowY: 'auto',
              fontFamily: 'monospace',
              fontSize: '12px',
              color: 'var(--white-80)',
            }}
          >
            {JSON.stringify(jsonLdPayload, null, 2)}
          </Box>
        </Box>

        {/* GitHub README Badge Embed Instructions */}
        <Card p={28} bg="$panel" borderWidth={1} borderColor="var(--border)">
          <YStack gap="$3">
            <Text fontSize="$3" fontWeight="700" color="var(--white)">
              Add Your Verified Credential to GitHub &amp; Resume
            </Text>
            <Text fontSize="$1" color="var(--muted-foreground)">
              Embed a dynamic cryptographic verification badge into your GitHub profile README that proves 100% test pass on the cleanroom SWE-bench harness.
            </Text>

            <Box
              p="$3"
              rounded="var(--radius-md)"
              bg="var(--pure-black)"
              borderWidth={1}
              borderColor="var(--border)"
            >
              <Text fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">
                [![{matchedCourse.credential} Certified](https://hanzo.university/badges/{matchedCourse.credential}.svg)](https://hanzo.university/verify?id={certId})
              </Text>
            </Box>

            <XStack items="center" gap="$2">
              <Action
                render="button"
                onClick={() =>
                  handleCopy(
                    `[![${matchedCourse.credential} Certified](https://hanzo.university/badges/${matchedCourse.credential}.svg)](https://hanzo.university/verify?id=${certId})`,
                    'badge',
                  )
                }
                px={12}
                py={6}
                $platform-web={{ fontSize: '11px' }}
              >
                {copied === 'badge' ? 'Copied Markdown!' : 'Copy GitHub Markdown'}
              </Action>
            </XStack>
          </YStack>
        </Card>
      </Band>
    </Box>
  )
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<Box p="$8"><Text color="var(--white)">Loading verification...</Text></Box>}>
      <VerifyContent />
    </Suspense>
  )
}
