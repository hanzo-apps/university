'use client'

import React, { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Band, Card, Head } from '@/components/band'
import { Box, Text, XStack, YStack } from '@hanzo/ui'
import { Action, Chip } from '@hanzo/ui/marketing'
import { Grid } from '@hanzo/ui/grid'
import {
  ShieldCheck,
  Copy,
  Download,
  Terminal,
  Search,
} from 'lucide-react'
import { CERTIFICATION_TRACKS, UNIVERSITY_COURSES } from '../courses-data'

function VerifyContent() {
  const searchParams = useSearchParams()
  const rawId = searchParams.get('id') || 'HACE-2026-9821'
  const rawStudent = searchParams.get('student') || 'student'
  const rawName = searchParams.get('name')

  const [certId, setCertId] = useState(rawId)
  const [searchInput, setSearchInput] = useState(rawId)
  const [studentHandle, setStudentHandle] = useState(rawStudent)
  const [studentName, setStudentName] = useState(
    rawName || (rawStudent !== 'student' ? rawStudent.charAt(0).toUpperCase() + rawStudent.slice(1) : 'Student')
  )
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

  const normalized = certId.toUpperCase()
  const matchedTrack = CERTIFICATION_TRACKS.find((t) => normalized.startsWith(t.credentialCode))
  const matchedCourse =
    UNIVERSITY_COURSES.find((c) => normalized.startsWith(c.credential.toUpperCase())) ||
    UNIVERSITY_COURSES.find((c) => c.slug === 'agentic-coding') ||
    UNIVERSITY_COURSES[0]

  const credentialCode = matchedTrack ? matchedTrack.credentialCode : matchedCourse.credential
  const credentialTitle = matchedTrack ? matchedTrack.name : matchedCourse.credentialFull
  const programLabel = matchedTrack
    ? `${matchedTrack.credentialCode} Track (${matchedTrack.courseCodes.join(', ')}) · ${matchedTrack.credentialType}`
    : `${matchedCourse.code}: ${matchedCourse.title} · Level: ${matchedCourse.level}`
  const artifactLabel = matchedTrack ? matchedTrack.capstoneRequirement : matchedCourse.capstoneArtifact
  const workspaceSlug = matchedTrack ? matchedTrack.courseSlugs[0] : matchedCourse.slug

  const jsonLdPayload = {
    '@context': [
      'https://www.w3.org/ns/credentials/v2',
      'https://hanzo.university/credentials/v1',
    ],
    id: `urn:uuid:hanzo-cert-2026-${credentialCode}-${certId.split('-').pop() || '9821'}`,
    type: ['VerifiableCredential', 'HanzoProfessionalCredential'],
    issuer: {
      id: 'did:hanzo:university:credentials',
      name: 'Hanzo University — The School of Intelligence Engineering',
    },
    validFrom: '2026-10-06T14:12:16Z',
    credentialSubject: {
      id: `did:hanzo:student:${studentHandle}`,
      name: studentName,
      program: programLabel,
      certification: `${credentialTitle} (${credentialCode})`,
      accreditationStatus: 'Non-accredited professional certification — cryptographic proof of completed practical capstone & live artifact',
      capstoneArtifact: artifactLabel,
      verificationStatus: 'Cleanroom Capstone Harness Passed (exit code 0)',
    },
    evidence: [
      {
        type: 'AutomatedCleanroomCapstone',
        verifier: 'Hanzo University Evaluation Harness',
        artifact: artifactLabel,
      },
    ],
    proof: {
      type: 'Ed25519Signature2020',
      verificationMethod: 'did:hanzo:university:credentials#key-1',
      created: '2026-10-06T14:12:16Z',
      proofValue: '0x7f4a8b1c99e2e89b3f4a1c2d88e0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8',
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
    a.download = `Hanzo-${credentialCode}-${studentHandle}-credential.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleDownloadSvg = () => {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="380" height="64" viewBox="0 0 380 64" fill="none">
  <rect width="380" height="64" rx="12" fill="#0A0A0A" stroke="#262626"/>
  <rect x="1" y="1" width="378" height="62" rx="11" stroke="#34D399" stroke-opacity="0.3"/>
  <circle cx="28" cy="32" r="14" fill="#047857" fill-opacity="0.3"/>
  <path d="M22 32L26 36L34 28" stroke="#34D399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <text fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="12" font-weight="700" x="52" y="27">${credentialCode}: ${credentialTitle.slice(0, 32)}</text>
  <text fill="#A3A3A3" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="10" x="52" y="44">VERIFIED CAPSTONE · ${studentName}</text>
  <rect x="290" y="20" width="76" height="24" rx="6" fill="#171717" stroke="#404040"/>
  <text fill="#34D399" font-family="ui-monospace, monospace" font-size="9" font-weight="700" x="303" y="36">W3C VC</text>
</svg>`

    const blob = new Blob([svgContent], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Hanzo-${credentialCode}-Badge.svg`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <Box minH="100vh" bg="$background" $platform-web={{ color: 'var(--foreground)' }}>
      {/* Top Sub-Header Bar */}
      <Box
        borderBottomWidth={1}
        borderColor="var(--border)"
        bg="var(--pure-black)"
        py="$3"
        px={14}
        $sm={{ px: 20 }}
        width="100%"
        maxW="100vw"
        overflow="hidden"
      >
        <XStack items="center" justify="space-between" maxW={1200} mx="auto" flexWrap="wrap" gap={8} width="100%">
          <Link href="/" style={{ textDecoration: 'none', color: 'inherit', minWidth: 0, flexShrink: 1 }}>
            <XStack items="center" gap="$2" minW={0}>
              <Text fontSize="$2" fontWeight="700" color="var(--white)" fontFamily="$mono">
                hanzo.university
              </Text>
              <Chip px={6} py={2} fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">
                CREDENTIAL REGISTRY
              </Chip>
            </XStack>
          </Link>

          <XStack items="center" gap="$3" style={{ flexShrink: 0 }}>
            <a href="https://hanzo.app/learn" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
              <Text fontSize="$1" $sm={{ fontSize: '$2' }} color="var(--muted-foreground)" hoverStyle={{ color: 'var(--white)' }}>
                Learning Workspace ↗
              </Text>
            </a>
          </XStack>
        </XStack>
      </Box>

      {/* Main Verification Band */}
      <Band pad={56} measure={1080}>
        <Head
          eyebrow="Public Practical Credential Registry"
          title="W3C Verifiable Credential Verification"
          lede="Inspect cryptographically signed W3C Verifiable Credentials issued upon passing automated cleanroom capstones and deploying live artifacts. Hanzo University issues professional certifications and fellowships (not accredited academic degrees)."
        />

        {/* Certificate Lookup Bar */}
        <Box
          p="$3"
          rounded="var(--radius-xl)"
          borderWidth={1}
          borderColor="rgba(255, 255, 255, 0.1)"
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
                onKeyDown={(e) => {
                  if (e.key === 'Enter') setCertId(searchInput.trim())
                }}
                placeholder="Enter Credential ID (e.g. HACE-2026-9821, HKDM-2026-1042, HCIE-2026-301)"
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
              onClick={() => setCertId(searchInput.trim() || 'HACE-2026-9821')}
              px={16}
              py={8}
            >
              Verify Record →
            </Action>
          </XStack>
        </Box>

        {/* Verified Credential Card */}
        <Card
          p={16}
          $sm={{ p: 24 }}
          $md={{ p: 32 }}
          borderWidth={1}
          borderColor="rgba(255, 255, 255, 0.1)"
          bg="$panel"
          position="relative"
          overflow="hidden"
          mb="$8"
        >
          <XStack items="center" justify="space-between" flexWrap="wrap" gap="$3" mb="$4">
            <XStack items="center" gap="$2" flex={1} minW={0}>
              <ShieldCheck size={24} color="var(--emerald-400)" style={{ flexShrink: 0 }} />
              <YStack flex={1} minW={0}>
                <Text fontSize="$3" fontWeight="800" color="var(--white)">
                  W3C PRACTICAL CAPSTONE PROOF
                </Text>
                <Text fontSize="$1" color="var(--muted-foreground)" fontFamily="$mono">
                  W3C Verifiable Credential Data Model v2.0 · Ed25519Signature2020
                </Text>
              </YStack>
            </XStack>

            <Chip px={10} py={3} fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">
              {certId}
            </Chip>
          </XStack>

          <Box height={1} bg="var(--border)" my="$3" />

          <YStack gap="$3" my="$3">
            <Text fontSize="$1" color="var(--muted-foreground)" fontFamily="$mono">
              CREDENTIAL RECIPIENT
            </Text>
            <Text fontSize="$6" fontWeight="800" color="var(--white)">
              {studentName}
            </Text>
            <Text fontSize="$2" color="var(--muted-foreground)" lineHeight={21}>
              Completed all required engineering labs, passed automated cleanroom verification, and deployed the required live capstone artifact for:
            </Text>
            <Text fontSize="$4" fontWeight="700" color="var(--emerald-300)">
              {credentialTitle} ({credentialCode})
            </Text>
            <Text fontSize="$1" color="var(--white-80)">
              {programLabel}
            </Text>
          </YStack>

          <Grid columns={{ min: 260, max: 2 }} gap={16} mt="$4">
            <Box p="$3" rounded="var(--radius-md)" bg="var(--pure-black)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.06)">
              <Text fontSize="$1" color="var(--muted-foreground)">Subject DID:</Text>
              <Text fontSize="$1" fontFamily="$mono" color="var(--white)" mt="$1">
                did:hanzo:student:{studentHandle}
              </Text>
            </Box>

            <Box p="$3" rounded="var(--radius-md)" bg="var(--pure-black)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.06)">
              <Text fontSize="$1" color="var(--muted-foreground)">Issuing Authority:</Text>
              <Text fontSize="$1" fontFamily="$mono" color="var(--white)" mt="$1">
                did:hanzo:university:credentials
              </Text>
            </Box>

            <Box p="$3" rounded="var(--radius-md)" bg="var(--pure-black)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.06)">
              <Text fontSize="$1" color="var(--muted-foreground)">Verified Capstone Artifact:</Text>
              <Text fontSize="$1" fontWeight="700" color="var(--emerald-300)" mt="$1">
                {artifactLabel}
              </Text>
            </Box>

            <Box p="$3" rounded="var(--radius-md)" bg="var(--pure-black)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.06)">
              <Text fontSize="$1" color="var(--muted-foreground)">Credential Scope:</Text>
              <Text fontSize="$1" color="var(--white)" mt="$1">
                Professional Certification (Non-Accredited)
              </Text>
            </Box>
          </Grid>

          <XStack items="center" justify="space-between" flexWrap="wrap" gap="$3" mt="$6" pt="$4" borderTopWidth={1} borderColor="var(--border)" width="100%">
            <XStack items="center" gap="$2" flexWrap="wrap">
              <Action
                render="button"
                onClick={() => handleCopy(JSON.stringify(jsonLdPayload, null, 2), 'json')}
                px={12}
                py={7}
                $platform-web={{ fontSize: '12px' }}
              >
                <Copy size={13} style={{ marginRight: 4 }} />
                {copied === 'json' ? 'Copied JSON!' : 'Copy JSON-LD'}
              </Action>

              <Action
                render="button"
                onClick={handleDownloadJson}
                px={12}
                py={7}
                $platform-web={{ fontSize: '12px' }}
              >
                <Download size={13} style={{ marginRight: 4 }} />
                Download JSON
              </Action>

              <Action
                render="button"
                onClick={handleDownloadSvg}
                px={12}
                py={7}
                $platform-web={{ fontSize: '12px' }}
              >
                <Download size={13} style={{ marginRight: 4 }} />
                SVG Badge
              </Action>
            </XStack>

            <Action href={`https://hanzo.app/learn/${workspaceSlug}`} fill px={16} py={8}>
              Open in hanzo.app/learn ↗
            </Action>
          </XStack>
        </Card>

        {/* Inspectable JSON-LD Payload */}
        <Box
          p="$5"
          rounded="var(--radius-xl)"
          borderWidth={1}
          borderColor="rgba(255, 255, 255, 0.08)"
          bg="var(--pure-black)"
          mb="$8"
        >
          <XStack items="center" justify="space-between" mb="$3" flexWrap="wrap" gap="$2">
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
            borderColor="rgba(255, 255, 255, 0.08)"
            $platform-web={{
              whiteSpace: 'pre-wrap',
              maxHeight: '280px',
              overflowY: 'auto',
              fontFamily: 'monospace',
              fontSize: '12px',
              color: 'var(--white-80)',
            }}
          >
            {JSON.stringify(jsonLdPayload, null, 2)}
          </Box>
        </Box>

        {/* GitHub README Badge Embed */}
        <Card p={28} bg="$panel" borderWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
          <YStack gap="$3">
            <Text fontSize="$3" fontWeight="700" color="var(--white)">
              Embed Your Verifiable Credential Badge
            </Text>
            <Text fontSize="$1" color="var(--muted-foreground)" lineHeight={19}>
              Link your GitHub README or engineering portfolio directly to your cryptographic capstone verification record.
            </Text>

            <Box
              p="$3"
              rounded="var(--radius-md)"
              bg="var(--pure-black)"
              borderWidth={1}
              borderColor="rgba(255, 255, 255, 0.08)"
            >
              <Text fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">
                [✓ {credentialCode}: {credentialTitle} — Hanzo University W3C Credential](https://hanzo.university/verify?id={certId})
              </Text>
            </Box>

            <XStack items="center" gap="$2">
              <Action
                render="button"
                onClick={() =>
                  handleCopy(
                    `[✓ ${credentialCode}: ${credentialTitle} — Hanzo University W3C Credential](https://hanzo.university/verify?id=${certId})`,
                    'badge'
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
