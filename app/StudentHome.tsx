'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Box, Text, XStack, YStack, View } from '@/components/ui'
import { Band, Card, Head } from '@/components/band'
import { Action, Title, Lede, Eyebrow, Chip } from '@hanzo/ui/marketing'
import { Grid } from '@hanzo/ui/grid'
import {
  Home,
  FileText,
  ShieldCheck,
  BookOpen,
  Headphones,
  Search,
  Award,
  Layers,
  ChevronRight,
  ArrowRight,
  Download,
  Link2,
  Zap,
  Check,
  CheckCircle2,
  User,
  Landmark,
  GraduationCap,
  Coins,
  Scale,
  Cpu,
  Boxes,
  TrendingUp,
  Briefcase,
  XCircle,
  X,
  Sparkles,
  ExternalLink,
  Clock,
  Flame,
  Terminal,
  Server,
  Menu as MenuIcon,
} from 'lucide-react'
import { UNIVERSITY_COURSES } from './courses-data'
import { courseCheckoutUrl } from '@/lib/pay'
import { HanzoStackLogo, GitHubIcon } from './components/header'
import Catalog from './Catalog'

function GlassShieldArtwork({ size = 88 }: { size?: number }) {
  const scale = size / 96
  return (
    <div
      style={{
        width: `${size}px`,
        height: `${size * 0.9}px`,
        position: 'relative',
        display: 'block',
        flexShrink: 0,
      }}
    >
      {/* Back Layered Shield Card */}
      <div
        style={{
          position: 'absolute',
          top: 0,
          right: `${4 * scale}px`,
          width: `${64 * scale}px`,
          height: `${64 * scale}px`,
          borderRadius: `${18 * scale}px`,
          border: '1px solid rgba(255, 255, 255, 0.08)',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.06) 0%, rgba(0, 0, 0, 0.85) 100%)',
          transform: 'rotate(10deg)',
          opacity: 0.5,
          pointerEvents: 'none',
        }}
      />
      {/* Middle Subtle Radial Glow */}
      <div
        style={{
          position: 'absolute',
          top: `${10 * scale}px`,
          right: `${10 * scale}px`,
          width: `${40 * scale}px`,
          height: `${40 * scale}px`,
          borderRadius: '999px',
          background: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%)',
          filter: 'blur(8px)',
          pointerEvents: 'none',
        }}
      />
      {/* Front Glass Shield Card */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: `${4 * scale}px`,
          width: `${66 * scale}px`,
          height: `${66 * scale}px`,
          borderRadius: `${18 * scale}px`,
          border: '1px solid rgba(255, 255, 255, 0.18)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.1) 0%, rgba(12, 16, 24, 0.92) 100%)',
          backdropFilter: 'blur(12px)',
          WebkitBackdropFilter: 'blur(12px)',
          boxShadow: '0 12px 32px rgba(0, 0, 0, 0.7), inset 0 1px 1px rgba(255, 255, 255, 0.15)',
          transform: 'rotate(-4deg)',
          pointerEvents: 'none',
        }}
      >
        <ShieldCheck size={28 * scale} color="rgba(255, 255, 255, 0.75)" />
      </div>
    </div>
  )
}

export default function StudentHome({ name = 'Student', handle = 'student' }: { name?: string; handle?: string }) {
  const [activeNav, setActiveNav] = useState<'home' | 'records' | 'verify' | 'resources' | 'support'>('home')
  const [searchId, setSearchId] = useState<string>('')
  const [isVerifying, setIsVerifying] = useState<boolean>(false)
  const [verificationResult, setVerificationResult] = useState<{
    id: string
    recipient: string
    program: string
    grade: string
    leaderBlock: string
    status: 'verified' | 'not_found'
  } | null>(null)
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false)

  const searchInputRef = useRef<HTMLInputElement>(null)

  const defaultRecord = {
    id: 'HACE-2026-9821',
    standard: 'W3C Verifiable Credential Data Model v2.0',
    leaderBlock: '#9,418,290',
    recipient: name,
    issuingAuthority: 'Hanzo: trust:accreditation',
    program: 'ENG 100 – Academic Units: 4.0 – Level: Advanced',
    grade: '100% Pass with Distinction',
    issuerDid: 'did:hanzo:trust:accreditation',
    subjectDid: `did:hanzo:student:${handle}`,
    evidence: 'Cleanroom SWE-bench test exit code 0 · 0 syntax regressions · Hanzo Visor pod-8921b',
    proofMethod: 'did:hanzo:trust:accreditation#key-1 (Ed25519Signature2020)',
    signature: '0x7f4a8b1c99e2e89b3f4a1c2d88e0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8',
    blockchainCommitment: 'Lux Chain Block #9,418,290',
  }

  const handleVerify = (customId?: string) => {
    const idToVerify = (customId || searchId || defaultRecord.id).trim().toUpperCase()
    setIsVerifying(true)
    setTimeout(() => {
      setIsVerifying(false)
      if (idToVerify.includes('HACE') || idToVerify.includes('9821') || idToVerify === defaultRecord.id) {
        setVerificationResult({
          id: defaultRecord.id,
          recipient: defaultRecord.recipient,
          program: defaultRecord.program,
          grade: defaultRecord.grade,
          leaderBlock: defaultRecord.leaderBlock,
          status: 'verified',
        })
      } else if (idToVerify.includes('HARLE')) {
        setVerificationResult({
          id: 'HARLE-2026-8921',
          recipient: 'Sarah Chen',
          program: 'RL 101 – Academic Units: 5.0 – Level: Expert',
          grade: '100% Pass with Distinction',
          leaderBlock: '#9,418,284',
          status: 'verified',
        })
      } else if (idToVerify.includes('HCAISE')) {
        setVerificationResult({
          id: 'HCAISE-2026-4412',
          recipient: 'Marcus Vance',
          program: 'SYS 103 – Academic Units: 3.0 – Level: Intermediate',
          grade: '100% Pass with Distinction',
          leaderBlock: '#9,417,991',
          status: 'verified',
        })
      } else {
        setVerificationResult({
          id: idToVerify,
          recipient: defaultRecord.recipient,
          program: defaultRecord.program,
          grade: defaultRecord.grade,
          leaderBlock: defaultRecord.leaderBlock,
          status: 'verified',
        })
      }
      setShowDetailModal(true)
    }, 400)
  }

  const handleDownloadJson = () => {
    const payload = {
      '@context': [
        'https://www.w3.org/ns/credentials/v2',
        'https://hanzo.university/credentials/v1',
      ],
      id: `urn:uuid:hanzo-cert-2026-${defaultRecord.id}`,
      type: ['VerifiableCredential', 'HanzoUniversityDegree'],
      issuer: {
        id: defaultRecord.issuerDid,
        name: 'Hanzo University Research Foundation',
      },
      validFrom: '2026-10-06T14:12:16Z',
      credentialSubject: {
        id: defaultRecord.subjectDid,
        name: defaultRecord.recipient,
        course: defaultRecord.program,
        degree: 'Hanzo Certified Agentic Coding Engineer (HACE)',
        units: 4.0,
        grade: defaultRecord.grade,
        telemetryProof: defaultRecord.evidence,
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
        verificationMethod: defaultRecord.proofMethod,
        created: '2026-10-06T14:12:16Z',
        proofValue: defaultRecord.signature,
        blockchainCommitment: defaultRecord.blockchainCommitment,
      },
    }

    const blob = new Blob([JSON.stringify(payload, null, 2)], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `${defaultRecord.id}.json`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const handleDownloadBadge = () => {
    const a = document.createElement('a')
    a.href = '/badges/HACE.svg'
    a.download = 'HACE-verified-credential.svg'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }

  useEffect(() => {
    const handleOpenRecords = () => setShowDetailModal(true)
    const handleOpenVerify = () => {
      searchInputRef.current?.focus()
      handleVerify(defaultRecord.id)
    }
    const handleDownloadJsonEvent = () => handleDownloadJson()
    const handleDownloadBadgeEvent = () => handleDownloadBadge()

    window.addEventListener('open-records-modal', handleOpenRecords)
    window.addEventListener('open-verify-modal', handleOpenVerify)
    window.addEventListener('download-credential-json', handleDownloadJsonEvent)
    window.addEventListener('download-credential-badge', handleDownloadBadgeEvent)

    return () => {
      window.removeEventListener('open-records-modal', handleOpenRecords)
      window.removeEventListener('open-verify-modal', handleOpenVerify)
      window.removeEventListener('download-credential-json', handleDownloadJsonEvent)
      window.removeEventListener('download-credential-badge', handleDownloadBadgeEvent)
    }
  }, [])

  return (
    <Box minH="100vh" bg="var(--pure-black)" className="mobile-bottom-pad" $platform-web={{ color: 'var(--foreground)' }}>
      {/* ── TOP HERO DASHBOARD CONTAINER (Matching UI mock in university.png) ── */}
      <Box
        width="100%"
        maxW={1440}
        mx="auto"
        px={20}
        py={24}
      >
        <Box
          className="desktop-dashboard-view"
          style={{
            display: 'flex',
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: '20px',
            alignItems: 'stretch',
          }}
        >
          {/* ──── 1. LEFT SIDEBAR NAVIGATION ──── */}
          <Box
            className="dashboard-sidebar"
            borderWidth={1}
            borderColor="rgba(255, 255, 255, 0.08)"
            bg="#080808"
            p={18}
            style={{
              flexShrink: 0,
              width: '220px',
              minWidth: '220px',
              borderRadius: '24px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between',
              alignSelf: 'stretch',
            }}
          >
            {/* Top Navigation Items */}
            <YStack gap={6}>
              {/* Home (Active Pill) */}
              <Box
                render="button"
                onClick={() => setActiveNav('home')}
                style={{
                  width: '100%',
                  background: activeNav === 'home' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  border: `1px solid ${activeNav === 'home' ? 'rgba(255, 255, 255, 0.12)' : 'transparent'}`,
                  borderRadius: '14px',
                  padding: '11px 14px',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '12px',
                  color: activeNav === 'home' ? 'var(--white)' : 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: activeNav === 'home' ? 600 : 500,
                  outline: 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <Home size={18} color={activeNav === 'home' ? 'var(--white)' : 'rgba(255, 255, 255, 0.6)'} />
                <span>Home</span>
              </Box>

              {/* My Records */}
              <Box
                render="button"
                onClick={() => {
                  setActiveNav('records')
                  setShowDetailModal(true)
                }}
                style={{
                  width: '100%',
                  background: activeNav === 'records' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  border: `1px solid ${activeNav === 'records' ? 'rgba(255, 255, 255, 0.12)' : 'transparent'}`,
                  borderRadius: '14px',
                  padding: '11px 14px',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '12px',
                  color: activeNav === 'records' ? 'var(--white)' : 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: activeNav === 'records' ? 600 : 500,
                  outline: 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <FileText size={18} color={activeNav === 'records' ? 'var(--white)' : 'rgba(255, 255, 255, 0.6)'} />
                <span>My Records</span>
              </Box>

              {/* Verify Credentials */}
              <Box
                render="button"
                onClick={() => {
                  setActiveNav('verify')
                  searchInputRef.current?.focus()
                  handleVerify(defaultRecord.id)
                }}
                style={{
                  width: '100%',
                  background: activeNav === 'verify' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  border: `1px solid ${activeNav === 'verify' ? 'rgba(255, 255, 255, 0.12)' : 'transparent'}`,
                  borderRadius: '14px',
                  padding: '11px 14px',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: '12px',
                  color: activeNav === 'verify' ? 'var(--white)' : 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  textAlign: 'left',
                  fontSize: '14px',
                  fontWeight: activeNav === 'verify' ? 600 : 500,
                  outline: 'none',
                  transition: 'all 0.15s ease',
                }}
              >
                <ShieldCheck size={18} color={activeNav === 'verify' ? 'var(--white)' : 'rgba(255, 255, 255, 0.6)'} />
                <span>Verify Credentials</span>
              </Box>

              {/* Resources */}
              <a
                href="#curriculum"
                onClick={() => setActiveNav('resources')}
                style={{
                  textDecoration: 'none',
                  width: '100%',
                  background: activeNav === 'resources' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  border: `1px solid ${activeNav === 'resources' ? 'rgba(255, 255, 255, 0.12)' : 'transparent'}`,
                  borderRadius: '14px',
                  padding: '11px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: activeNav === 'resources' ? 'var(--white)' : 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: activeNav === 'resources' ? 600 : 500,
                  transition: 'all 0.15s ease',
                }}
              >
                <BookOpen size={18} color={activeNav === 'resources' ? 'var(--white)' : 'rgba(255, 255, 255, 0.6)'} />
                <span>Resources</span>
              </a>

              {/* Support */}
              <a
                href="#faqs"
                onClick={() => setActiveNav('support')}
                style={{
                  textDecoration: 'none',
                  width: '100%',
                  background: activeNav === 'support' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  border: `1px solid ${activeNav === 'support' ? 'rgba(255, 255, 255, 0.12)' : 'transparent'}`,
                  borderRadius: '14px',
                  padding: '11px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: activeNav === 'support' ? 'var(--white)' : 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: activeNav === 'support' ? 600 : 500,
                  transition: 'all 0.15s ease',
                }}
              >
                <Headphones size={18} color={activeNav === 'support' ? 'var(--white)' : 'rgba(255, 255, 255, 0.6)'} />
                <span>Support</span>
              </a>
            </YStack>

            {/* Bottom Brand Stamp */}
            <XStack items="center" gap={10} pt={20} borderTopWidth={1} borderColor="rgba(255, 255, 255, 0.06)">
              <View
                width={30}
                height={30}
                rounded="var(--radius-sm)"
                bg="rgba(255, 255, 255, 0.05)"
                borderWidth={1}
                borderColor="rgba(255, 255, 255, 0.1)"
                items="center"
                justify="center"
              >
                <Layers size={16} color="var(--white)" />
              </View>
              <YStack gap={1}>
                <Text fontSize={13} fontWeight="600" color="var(--white)">
                  Hanzo University
                </Text>
                <Text fontSize={11} color="rgba(255, 255, 255, 0.45)">
                  Build what&rsquo;s next.
                </Text>
              </YStack>
            </XStack>
          </Box>

          {/* ──── 2. CENTER DASHBOARD CONTENT ──── */}
          <Box
            style={{
              flex: '1 1 500px',
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
            {/* Top Greeting Header & Student Status Badge */}
            <Box
              style={{
                display: 'flex',
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '16px',
              }}
            >
              <YStack gap={6}>
                <Text
                  fontFamily="$mono"
                  fontSize={11}
                  color="rgba(255, 255, 255, 0.5)"
                  textTransform="uppercase"
                  letterSpacing={1.2}
                  fontWeight="600"
                >
                  STUDENT PORTAL
                </Text>
                <Text fontSize={32} fontWeight="700" color="var(--white)" lineHeight={38} style={{ letterSpacing: '-0.02em' }}>
                  Welcome back, {name}
                </Text>
                <Text fontSize={14} color="rgba(255, 255, 255, 0.6)" maxW={540} lineHeight={20}>
                  Access your academic records, verify your credentials, and take the next step in your journey at Hanzo University.
                </Text>
              </YStack>

              {/* Active Student Status Card */}
              <Box
                borderWidth={1}
                borderColor="rgba(255, 255, 255, 0.08)"
                bg="#0a0a0a"
                p={16}
                style={{
                  borderRadius: '16px',
                  minWidth: '200px',
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '6px',
                }}
              >
                <XStack items="center" gap={8}>
                  <View
                    width={7}
                    height={7}
                    rounded={999}
                    bg="#10b981"
                    style={{
                      boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)',
                    }}
                  />
                  <Text fontFamily="$mono" fontSize={11} color="rgba(255, 255, 255, 0.7)" fontWeight="500">
                    Active Student
                  </Text>
                </XStack>
                <Text fontFamily="$mono" fontSize={14} fontWeight="700" color="var(--white)" letterSpacing={0.5}>
                  {defaultRecord.id}
                </Text>
                <button
                  type="button"
                  onClick={() => setShowDetailModal(true)}
                  style={{
                    background: 'transparent',
                    border: 'none',
                    padding: 0,
                    marginTop: '6px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: '4px',
                    color: 'rgba(255, 255, 255, 0.75)',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    textAlign: 'left',
                    whiteSpace: 'nowrap',
                  }}
                >
                  <span>View Details</span>
                  <span style={{ fontSize: '13px', lineHeight: 1 }}>→</span>
                </button>
              </Box>
            </Box>

            {/* Cryptographic Credential Verification Card */}
            <Box
              borderWidth={1}
              borderColor="rgba(255, 255, 255, 0.08)"
              bg="#080808"
              p={24}
              position="relative"
              overflow="hidden"
              style={{
                borderRadius: '20px',
              }}
            >
              <Box
                className="hero-verify-row"
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  flexWrap: 'nowrap',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: '24px',
                }}
              >
                <YStack gap={8} style={{ flex: 1, minWidth: 0 }}>
                  <XStack items="center" gap={8}>
                    <ShieldCheck size={16} color="var(--white)" />
                    <Text
                      fontFamily="$mono"
                      fontSize={11}
                      color="rgba(255, 255, 255, 0.5)"
                      textTransform="uppercase"
                      letterSpacing={1.2}
                      fontWeight="600"
                    >
                      CREDENTIAL VERIFICATION
                    </Text>
                  </XStack>
                  <Text fontSize={20} fontWeight="700" color="var(--white)" style={{ letterSpacing: '-0.01em' }}>
                    Cryptographic Credential Verification
                  </Text>
                  <Text fontSize={13} color="rgba(255, 255, 255, 0.6)" lineHeight={19}>
                    Verify immutable academic degrees and professional certifications issued by the Hanzo University Research Foundation on the Lux Ledger.
                  </Text>
                </YStack>

                {/* Right Column: Button & Sleek Layered Glass Shield Artwork */}
                <XStack items="center" gap={20} style={{ flexShrink: 0 }}>
                  <button
                    type="button"
                    onClick={() => handleVerify(searchId || defaultRecord.id)}
                    style={{
                      background: 'var(--white)',
                      color: 'var(--pure-black)',
                      borderRadius: '999px',
                      padding: '9px 18px',
                      fontWeight: 600,
                      fontSize: '13px',
                      border: 'none',
                      cursor: 'pointer',
                      display: 'flex',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                      whiteSpace: 'nowrap',
                      boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
                    }}
                  >
                    <span>Verify Record</span>
                    <span style={{ fontSize: '13px' }}>→</span>
                  </button>

                  {/* 3D Dark Layered Squircle Shield Graphic */}
                  <div
                    style={{
                      width: '96px',
                      height: '84px',
                      position: 'relative',
                      display: 'block',
                      flexShrink: 0,
                    }}
                  >
                    {/* Back Card */}
                    <div
                      style={{
                        position: 'absolute',
                        top: 0,
                        right: 0,
                        width: '64px',
                        height: '64px',
                        borderRadius: '18px',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(0, 0, 0, 0.8) 100%)',
                        transform: 'rotate(8deg)',
                        opacity: 0.5,
                      }}
                    />
                    {/* Front Glass Card */}
                    <div
                      style={{
                        position: 'absolute',
                        bottom: 0,
                        left: '6px',
                        width: '66px',
                        height: '66px',
                        borderRadius: '18px',
                        border: '1px solid rgba(255, 255, 255, 0.16)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.08) 0%, rgba(10, 10, 10, 0.95) 100%)',
                        backdropFilter: 'blur(10px)',
                        boxShadow: '0 8px 24px rgba(0, 0, 0, 0.6)',
                        transform: 'rotate(-4deg)',
                      }}
                    >
                      <ShieldCheck size={28} color="rgba(255, 255, 255, 0.85)" />
                    </div>
                  </div>
                </XStack>
              </Box>

              {/* Bottom Inset Search Input Bar */}
              <div
                style={{
                  marginTop: '24px',
                  borderRadius: '999px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(0, 0, 0, 0.7)',
                  padding: '6px 6px 6px 18px',
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  height: '48px',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, height: '100%' }}>
                  <Search size={16} color="rgba(255, 255, 255, 0.4)" style={{ flexShrink: 0 }} />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleVerify()
                    }}
                    placeholder="Search or enter record ID"
                    style={{
                      background: 'transparent',
                      border: 'none',
                      outline: 'none',
                      color: 'var(--white)',
                      fontSize: '13px',
                      fontFamily: 'var(--font-mono)',
                      width: '100%',
                    }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => handleVerify()}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(255, 255, 255, 0.12)',
                    borderRadius: '999px',
                    padding: '8px 18px',
                    color: 'var(--white)',
                    fontSize: '13px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 6,
                    whiteSpace: 'nowrap',
                    flexShrink: 0,
                    transition: 'background 0.15s ease',
                  }}
                >
                  <span>{isVerifying ? 'Verifying...' : 'Verify Record'}</span>
                  <span style={{ fontSize: '13px' }}>→</span>
                </button>
              </div>
            </Box>

            {/* Your Academic Credentials Card */}
            <Box
              borderWidth={1}
              borderColor="rgba(255, 255, 255, 0.08)"
              bg="#080808"
              p={24}
              style={{
                borderRadius: '20px',
              }}
            >
              {/* Card Header Row */}
              <XStack items="center" justify="space-between" pb={16}>
                <XStack items="center" gap={10}>
                  <Award size={20} color="var(--white)" />
                  <Text fontSize={18} fontWeight="700" color="var(--white)">
                    Your Academic Credentials
                  </Text>
                </XStack>

                <button
                  type="button"
                  onClick={() => setShowDetailModal(true)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(255, 255, 255, 0.1)',
                    borderRadius: '999px',
                    padding: '4px 12px',
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    cursor: 'pointer',
                    display: 'inline-flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <span>1 Record</span>
                  <ChevronRight size={13} color="rgba(255, 255, 255, 0.6)" />
                </button>
              </XStack>

              {/* Inner Credential Record Box */}
              <Box
                borderWidth={1}
                borderColor="rgba(255, 255, 255, 0.08)"
                bg="rgba(0, 0, 0, 0.5)"
                p={20}
                style={{
                  borderRadius: '16px',
                }}
              >
                {/* Top Row: Logo, Title & Verified Badge, Leader Block */}
                <Box
                  style={{
                    display: 'flex',
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    gap: '16px',
                  }}
                >
                  <XStack items="center" gap={16}>
                    {/* Squircle Stack Icon */}
                    <View
                      width={48}
                      height={48}
                      bg="rgba(255, 255, 255, 0.04)"
                      borderWidth={1}
                      borderColor="rgba(255, 255, 255, 0.1)"
                      items="center"
                      justify="center"
                      style={{
                        borderRadius: '14px',
                        flexShrink: 0,
                      }}
                    >
                      <Layers size={22} color="var(--white)" />
                    </View>

                    <YStack gap={4}>
                      {/* Verified Badge */}
                      <XStack items="center" gap={6}>
                        <Box
                          style={{
                            background: 'rgba(16, 185, 129, 0.12)',
                            border: '1px solid rgba(16, 185, 129, 0.35)',
                            borderRadius: '999px',
                            padding: '2px 8px',
                            display: 'inline-flex',
                            flexDirection: 'row',
                            alignItems: 'center',
                            gap: '6px',
                          }}
                        >
                          <View width={6} height={6} rounded={999} bg="#10b981" />
                          <Text fontFamily="$mono" fontSize={11} color="#34d399" fontWeight="600">
                            Verified
                          </Text>
                        </Box>
                      </XStack>

                      <Text fontFamily="$mono" fontSize={18} fontWeight="700" color="var(--white)" letterSpacing={0.5}>
                        {defaultRecord.id}
                      </Text>
                      <Text fontFamily="$mono" fontSize={12} color="rgba(255, 255, 255, 0.5)">
                        {defaultRecord.standard}
                      </Text>
                    </YStack>
                  </XStack>

                  {/* Right: Leader Block Commitment */}
                  <YStack items="flex-end" gap={2}>
                    <XStack items="center" gap={5}>
                      <Boxes size={13} color="rgba(255, 255, 255, 0.5)" />
                      <Text fontFamily="$mono" fontSize={11} color="rgba(255, 255, 255, 0.5)" letterSpacing={0.5}>
                        LEADER BLOCK
                      </Text>
                    </XStack>
                    <Text fontFamily="$mono" fontSize={14} fontWeight="700" color="var(--white)">
                      {defaultRecord.leaderBlock}
                    </Text>
                  </YStack>
                </Box>

                {/* Divider Line */}
                <View height={1} bg="rgba(255, 255, 255, 0.08)" my={18} />

                {/* 2x2 Metadata Grid */}
                <div
                  className="credential-grid"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '20px 32px',
                  }}
                >
                  {/* Recipient */}
                  <YStack gap={4}>
                    <XStack items="center" gap={6}>
                      <User size={14} color="rgba(255, 255, 255, 0.5)" />
                      <Text fontSize={12} color="rgba(255, 255, 255, 0.5)">
                        Degree Recipient
                      </Text>
                    </XStack>
                    <Text fontSize={14} fontWeight="700" color="var(--white)">
                      {defaultRecord.recipient}
                    </Text>
                  </YStack>

                  {/* Issuing Authority */}
                  <YStack gap={4}>
                    <XStack items="center" gap={6}>
                      <Landmark size={14} color="rgba(255, 255, 255, 0.5)" />
                      <Text fontSize={12} color="rgba(255, 255, 255, 0.5)">
                        Issuing Authority
                      </Text>
                    </XStack>
                    <Text fontFamily="$mono" fontSize={13} fontWeight="600" color="var(--white)">
                      {defaultRecord.issuingAuthority}
                    </Text>
                  </YStack>

                  {/* Program */}
                  <YStack gap={4}>
                    <XStack items="center" gap={6}>
                      <GraduationCap size={14} color="rgba(255, 255, 255, 0.5)" />
                      <Text fontSize={12} color="rgba(255, 255, 255, 0.5)">
                        Program
                      </Text>
                    </XStack>
                    <Text fontSize={13} fontWeight="600" color="var(--white)" lineHeight={18}>
                      {defaultRecord.program}
                    </Text>
                  </YStack>

                  {/* Evaluation Grade */}
                  <YStack gap={4}>
                    <XStack items="center" gap={6}>
                      <Award size={14} color="rgba(255, 255, 255, 0.5)" />
                      <Text fontSize={12} color="rgba(255, 255, 255, 0.5)">
                        Evaluation Grade
                      </Text>
                    </XStack>
                    <Text fontSize={14} fontWeight="700" color="var(--white)">
                      {defaultRecord.grade}
                    </Text>
                  </YStack>
                </div>
              </Box>
            </Box>
          </Box>

          {/* ──── 3. RIGHT SIDEBAR ──── */}
          <Box
            className="dashboard-right-sidebar"
            style={{
              flexShrink: 0,
              width: '280px',
              minWidth: '280px',
              display: 'flex',
              flexDirection: 'column',
              gap: '16px',
            }}
          >
            {/* Quick Actions Card */}
            <Box
              borderWidth={1}
              borderColor="rgba(255, 255, 255, 0.08)"
              bg="#080808"
              p={20}
              style={{
                borderRadius: '20px',
              }}
            >
              <XStack items="center" gap={8} pb={12}>
                <Zap size={18} color="var(--white)" />
                <Text fontSize={15} fontWeight="700" color="var(--white)">
                  Quick Actions
                </Text>
              </XStack>

              <YStack gap={10} mt={4}>
                {/* 1. Verify a Record (Prominent Highlighted Light Button) */}
                <button
                  type="button"
                  onClick={() => handleVerify()}
                  style={{
                    width: '100%',
                    background: '#f2f2f2',
                    color: 'var(--pure-black)',
                    borderRadius: '14px',
                    padding: '13px 16px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    border: 'none',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.4)',
                    transition: 'background 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ShieldCheck size={18} color="var(--pure-black)" />
                    <span style={{ fontWeight: 600, fontSize: '13px' }}>Verify a Record</span>
                  </div>
                  <ChevronRight size={16} color="var(--pure-black)" />
                </button>

                {/* 2. Access Student Portal */}
                <Link
                  href="/portal"
                  style={{
                    textDecoration: 'none',
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    color: 'var(--white)',
                    borderRadius: '14px',
                    padding: '13px 16px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxSizing: 'border-box',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ArrowRight size={18} color="var(--white)" />
                    <span style={{ fontWeight: 500, fontSize: '13px' }}>Access Student Portal</span>
                  </div>
                  <ChevronRight size={16} color="rgba(255, 255, 255, 0.5)" />
                </Link>

                {/* 3. Download JSON */}
                <button
                  type="button"
                  onClick={handleDownloadJson}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    color: 'var(--white)',
                    borderRadius: '14px',
                    padding: '13px 16px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Download size={18} color="var(--white)" />
                    <span style={{ fontWeight: 500, fontSize: '13px' }}>Download JSON</span>
                  </div>
                  <ChevronRight size={16} color="rgba(255, 255, 255, 0.5)" />
                </button>

                {/* 4. Download GitHub Badge */}
                <button
                  type="button"
                  onClick={handleDownloadBadge}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: '1px solid rgba(255, 255, 255, 0.06)',
                    color: 'var(--white)',
                    borderRadius: '14px',
                    padding: '13px 16px',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    transition: 'all 0.15s ease',
                  }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0024 12c0-6.63-5.37-12-12-12z" />
                    </svg>
                    <span style={{ fontWeight: 500, fontSize: '13px' }}>Download GitHub Badge</span>
                  </div>
                  <ChevronRight size={16} color="rgba(255, 255, 255, 0.5)" />
                </button>
              </YStack>
            </Box>

            {/* Helpful Links Card */}
            <Box
              borderWidth={1}
              borderColor="rgba(255, 255, 255, 0.08)"
              bg="#080808"
              p={20}
              style={{
                borderRadius: '20px',
              }}
            >
              <XStack items="center" gap={8} pb={12}>
                <Link2 size={18} color="var(--white)" />
                <Text fontSize={15} fontWeight="700" color="var(--white)">
                  Helpful Links
                </Text>
              </XStack>

              <YStack gap={4} mt={4}>
                <a
                  href="#curriculum"
                  style={{
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 4px',
                    color: 'rgba(255, 255, 255, 0.75)',
                    fontSize: '13px',
                    fontWeight: 500,
                    transition: 'color 0.15s ease',
                  }}
                >
                  <span>Programs & Degrees</span>
                  <ChevronRight size={14} color="rgba(255, 255, 255, 0.5)" />
                </a>

                <a
                  href="https://hanzo.ai/blog/kai-decision-models"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 4px',
                    color: 'rgba(255, 255, 255, 0.75)',
                    fontSize: '13px',
                    fontWeight: 500,
                    transition: 'color 0.15s ease',
                  }}
                >
                  <span>Research & Blog</span>
                  <ChevronRight size={14} color="rgba(255, 255, 255, 0.5)" />
                </a>

                <a
                  href="https://hanzo.ai"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 4px',
                    color: 'rgba(255, 255, 255, 0.75)',
                    fontSize: '13px',
                    fontWeight: 500,
                    transition: 'color 0.15s ease',
                  }}
                >
                  <span>Hanzo Cloud</span>
                  <ChevronRight size={14} color="rgba(255, 255, 255, 0.5)" />
                </a>

                <a
                  href="#faqs"
                  style={{
                    textDecoration: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '10px 4px',
                    color: 'rgba(255, 255, 255, 0.75)',
                    fontSize: '13px',
                    fontWeight: 500,
                    transition: 'color 0.15s ease',
                  }}
                >
                  <span>Support</span>
                  <ChevronRight size={14} color="rgba(255, 255, 255, 0.5)" />
                </a>
              </YStack>
            </Box>
          </Box>
        </Box>

        {/* ──── 4. MOBILE DASHBOARD LAYOUT (Screens <= 900px, Faithful to mobile.png) ──── */}
        <Box
          className="mobile-dashboard-view"
          style={{
            display: 'none',
            flexDirection: 'column',
            gap: '20px',
            width: '100%',
            maxWidth: '560px',
            margin: '0 auto',
          }}
        >
          {/* 1. Hero Card: STUDENT PORTAL / Welcome back, {name} */}
          <Box
            style={{
              borderRadius: '24px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              background: '#090c12',
              padding: '22px 20px',
              position: 'relative',
              overflow: 'hidden',
            }}
          >
            {/* Top Row: Welcome Info on Left, 3D Glass Shield on Right */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                gap: '14px',
              }}
            >
              <div style={{ flex: 1, minWidth: 0 }}>
                <Text
                  fontFamily="$mono"
                  fontSize={11}
                  color="rgba(255, 255, 255, 0.5)"
                  textTransform="uppercase"
                  letterSpacing={1.2}
                  fontWeight="600"
                >
                  STUDENT PORTAL
                </Text>
                <Text
                  fontSize={26}
                  fontWeight="700"
                  color="var(--white)"
                  lineHeight={32}
                  style={{ letterSpacing: '-0.02em', margin: '6px 0 8px 0' }}
                >
                  Welcome back, {name}
                </Text>
                <Text fontSize={13} color="rgba(255, 255, 255, 0.65)" lineHeight={19}>
                  Access your academic records, verify your credentials, and take the next step in your journey at Hanzo University.
                </Text>
              </div>

              {/* 3D Glass Shield Artwork situated in top right */}
              <GlassShieldArtwork size={76} />
            </div>

            {/* Inset Active Student Card */}
            <Box
              style={{
                marginTop: '18px',
                borderRadius: '16px',
                border: '1px solid rgba(255, 255, 255, 0.06)',
                background: '#06080d',
                padding: '14px 16px',
                display: 'flex',
                flexDirection: 'column',
                gap: '6px',
              }}
            >
              <XStack items="center" justify="space-between">
                <XStack items="center" gap={8}>
                  <View
                    width={7}
                    height={7}
                    rounded={999}
                    bg="#10b981"
                    style={{
                      boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)',
                    }}
                  />
                  <Text fontFamily="$mono" fontSize={11} color="rgba(255, 255, 255, 0.75)" fontWeight="500">
                    Active Student
                  </Text>
                </XStack>
                <ChevronRight size={14} color="rgba(255, 255, 255, 0.45)" />
              </XStack>
              <Text fontFamily="$mono" fontSize={14} fontWeight="700" color="var(--white)" letterSpacing={0.5}>
                {defaultRecord.id}
              </Text>
              <button
                type="button"
                onClick={() => setShowDetailModal(true)}
                style={{
                  background: 'transparent',
                  border: 'none',
                  padding: 0,
                  marginTop: '4px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '4px',
                  color: 'rgba(255, 255, 255, 0.75)',
                  fontSize: '12px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <span>View Details</span>
                <span>→</span>
              </button>
            </Box>
          </Box>

          {/* 2. Quick Actions Section */}
          <YStack gap={10}>
            <XStack items="center" gap={8} px={4}>
              <Zap size={17} color="var(--white)" />
              <Text fontSize={16} fontWeight="700" color="var(--white)">
                Quick Actions
              </Text>
            </XStack>

            {/* Verify a Record */}
            <button
              type="button"
              onClick={() => {
                searchInputRef.current?.focus()
                handleVerify()
              }}
              className="hanzo-mobile-card"
              style={{
                width: '100%',
                background: '#090c12',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '15px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: 'var(--white)',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <ShieldCheck size={18} color="var(--white)" />
                <span style={{ fontWeight: 500, fontSize: '13px' }}>Verify a Record</span>
              </div>
              <ChevronRight size={16} color="rgba(255, 255, 255, 0.45)" />
            </button>

            {/* Access Student Portal */}
            <Link
              href="/portal"
              className="hanzo-mobile-card"
              style={{
                textDecoration: 'none',
                width: '100%',
                background: '#090c12',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '15px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: 'var(--white)',
                boxSizing: 'border-box',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <ArrowRight size={18} color="var(--white)" />
                <span style={{ fontWeight: 500, fontSize: '13px' }}>Access Student Portal</span>
              </div>
              <ChevronRight size={16} color="rgba(255, 255, 255, 0.45)" />
            </Link>

            {/* Download JSON */}
            <button
              type="button"
              onClick={handleDownloadJson}
              className="hanzo-mobile-card"
              style={{
                width: '100%',
                background: '#090c12',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '15px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: 'var(--white)',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <Download size={18} color="var(--white)" />
                <span style={{ fontWeight: 500, fontSize: '13px' }}>Download JSON</span>
              </div>
              <ChevronRight size={16} color="rgba(255, 255, 255, 0.45)" />
            </button>

            {/* Download GitHub Badge */}
            <button
              type="button"
              onClick={handleDownloadBadge}
              className="hanzo-mobile-card"
              style={{
                width: '100%',
                background: '#090c12',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '15px 18px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                color: 'var(--white)',
                cursor: 'pointer',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <GitHubIcon size={18} color="var(--white)" />
                <span style={{ fontWeight: 500, fontSize: '13px' }}>Download GitHub Badge</span>
              </div>
              <ChevronRight size={16} color="rgba(255, 255, 255, 0.45)" />
            </button>
          </YStack>

          {/* 3. Your Credentials Section */}
          <YStack gap={10}>
            {/* Header Row: Bookmark Icon + Your Credentials + 1 Record > Badge */}
            <XStack items="center" justify="space-between" px={4}>
              <XStack items="center" gap={8}>
                <Award size={18} color="var(--white)" />
                <Text fontSize={16} fontWeight="700" color="var(--white)">
                  Your Credentials
                </Text>
              </XStack>

              <button
                type="button"
                onClick={() => setShowDetailModal(true)}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '999px',
                  padding: '4px 10px',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  color: 'rgba(255, 255, 255, 0.8)',
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <span>1 Record</span>
                <ChevronRight size={13} color="rgba(255, 255, 255, 0.6)" />
              </button>
            </XStack>

            {/* Credential Card */}
            <Box
              style={{
                borderRadius: '20px',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                background: '#090c12',
                padding: '20px',
              }}
            >
              {/* Top Row: Squircle Logo + Verified Badge on Left, Leader Block on Right */}
              <div
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'flex-start',
                  gap: '12px',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <div
                    style={{
                      width: '44px',
                      height: '44px',
                      borderRadius: '14px',
                      background: 'rgba(255, 255, 255, 0.04)',
                      border: '1px solid rgba(255, 255, 255, 0.1)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <HanzoStackLogo size={22} color="#ffffff" strokeWidth={2} />
                  </div>

                  <div
                    style={{
                      background: 'rgba(16, 185, 129, 0.12)',
                      border: '1px solid rgba(16, 185, 129, 0.35)',
                      borderRadius: '999px',
                      padding: '2px 8px',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                    }}
                  >
                    <div style={{ width: 6, height: 6, borderRadius: 999, background: '#10b981' }} />
                    <span style={{ fontFamily: 'monospace', fontSize: '11px', color: '#34d399', fontWeight: 600 }}>
                      Verified
                    </span>
                  </div>
                </div>

                {/* Right: Leader Block */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '2px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
                    <Boxes size={12} color="rgba(255, 255, 255, 0.5)" />
                    <span style={{ fontFamily: 'monospace', fontSize: '10px', color: 'rgba(255, 255, 255, 0.5)', letterSpacing: '0.5px' }}>
                      LEADER BLOCK
                    </span>
                  </div>
                  <span style={{ fontFamily: 'monospace', fontSize: '13px', fontWeight: 700, color: 'var(--white)' }}>
                    {defaultRecord.leaderBlock}
                  </span>
                </div>
              </div>

              {/* Title & Standard Subtitle */}
              <Text
                fontFamily="$mono"
                fontSize={20}
                fontWeight="700"
                color="var(--white)"
                letterSpacing={0.5}
                style={{ marginTop: '14px' }}
              >
                {defaultRecord.id}
              </Text>
              <Text fontFamily="$mono" fontSize={11} color="rgba(255, 255, 255, 0.5)">
                {defaultRecord.standard}
              </Text>

              {/* Divider */}
              <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.06)', margin: '16px 0' }} />

              {/* 2x2 Metadata Grid */}
              <div className="mobile-cred-grid">
                {/* 1. Degree Recipient */}
                <YStack gap={3}>
                  <XStack items="center" gap={5}>
                    <User size={13} color="rgba(255, 255, 255, 0.5)" />
                    <Text fontSize={11} color="rgba(255, 255, 255, 0.5)">
                      Degree Recipient
                    </Text>
                  </XStack>
                  <Text fontSize={14} fontWeight="700" color="var(--white)">
                    {defaultRecord.recipient}
                  </Text>
                </YStack>

                {/* 2. Issuing Authority */}
                <YStack gap={3}>
                  <XStack items="center" gap={5}>
                    <Landmark size={13} color="rgba(255, 255, 255, 0.5)" />
                    <Text fontSize={11} color="rgba(255, 255, 255, 0.5)">
                      Issuing Authority
                    </Text>
                  </XStack>
                  <Text fontFamily="$mono" fontSize={12} fontWeight="600" color="var(--white)">
                    {defaultRecord.issuingAuthority}
                  </Text>
                </YStack>

                {/* 3. Program */}
                <YStack gap={3}>
                  <XStack items="center" gap={5}>
                    <GraduationCap size={13} color="rgba(255, 255, 255, 0.5)" />
                    <Text fontSize={11} color="rgba(255, 255, 255, 0.5)">
                      Program
                    </Text>
                  </XStack>
                  <Text fontSize={12} fontWeight="600" color="var(--white)" lineHeight={17}>
                    {defaultRecord.program}
                  </Text>
                </YStack>

                {/* 4. Evaluation Grade */}
                <YStack gap={3}>
                  <XStack items="center" gap={5}>
                    <Award size={13} color="rgba(255, 255, 255, 0.5)" />
                    <Text fontSize={11} color="rgba(255, 255, 255, 0.5)">
                      Evaluation Grade
                    </Text>
                  </XStack>
                  <Text fontSize={13} fontWeight="700" color="var(--white)">
                    {defaultRecord.grade}
                  </Text>
                </YStack>
              </div>

              {/* Full-Width White Pill Button */}
              <Link
                href="/portal"
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '6px',
                  background: 'var(--white)',
                  color: 'var(--pure-black)',
                  padding: '13px 20px',
                  borderRadius: '999px',
                  fontWeight: 600,
                  fontSize: '14px',
                  marginTop: '20px',
                  width: '100%',
                  boxSizing: 'border-box',
                }}
              >
                <span>Access Student Portal</span>
                <span style={{ fontSize: '14px' }}>→</span>
              </Link>
            </Box>
          </YStack>
        </Box>
      </Box>

      {/* ── VERIFIABLE CREDENTIAL MODAL / DETAILS DRAWER ── */}
      {showDetailModal && (
        <Box
          position="fixed"
          t={0}
          l={0}
          width="100vw"
          height="100vh"
          bg="rgba(0, 0, 0, 0.85)"
          backdropFilter="blur(20px)"
          items="center"
          justify="center"
          p={20}
          z={100}
        >
          <Box
            width="100%"
            maxW={680}
            maxH="90vh"
            overflowY="auto"
            borderWidth={1}
            borderColor="rgba(255, 255, 255, 0.15)"
            bg="#0A0A0A"
            p={28}
            style={{
              borderRadius: '24px',
              boxShadow: '0 24px 60px rgba(0, 0, 0, 0.9), 0 0 1px rgba(255, 255, 255, 0.3)',
            }}
          >
            {/* Modal Header */}
            <XStack items="center" justify="space-between" pb={20} borderBottomWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
              <XStack items="center" gap={12}>
                <View
                  width={38}
                  height={38}
                  bg="rgba(255, 255, 255, 0.06)"
                  borderWidth={1}
                  borderColor="rgba(255, 255, 255, 0.12)"
                  items="center"
                  justify="center"
                  style={{
                    borderRadius: '12px',
                  }}
                >
                  <ShieldCheck size={20} color="var(--white)" />
                </View>
                <YStack gap={2}>
                  <Text fontSize={16} fontWeight="700" color="var(--white)">
                    W3C Verifiable Credential Record
                  </Text>
                  <Text fontFamily="$mono" fontSize={12} color="rgba(255, 255, 255, 0.5)">
                    {verificationResult?.id || defaultRecord.id} · Signed on Lux Ledger
                  </Text>
                </YStack>
              </XStack>

              <Box
                render="button"
                onClick={() => setShowDetailModal(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.06)',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  borderRadius: '999px',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--white)',
                }}
              >
                <X size={16} />
              </Box>
            </XStack>

            {/* Modal Body */}
            <YStack gap={20} pt={20}>
              {/* Status Ribbon */}
              <Box
                bg="rgba(16, 185, 129, 0.08)"
                borderWidth={1}
                borderColor="rgba(16, 185, 129, 0.25)"
                p={14}
                style={{
                  borderRadius: '14px',
                }}
              >
                <XStack items="center" justify="space-between">
                  <XStack items="center" gap={10}>
                    <CheckCircle2 size={18} color="#34d399" />
                    <Text fontSize={13} fontWeight="600" color="#34d399">
                      Cryptographically Valid & Immutable Commitment
                    </Text>
                  </XStack>
                  <Text fontFamily="$mono" fontSize={11} color="rgba(255, 255, 255, 0.6)">
                    Block {defaultRecord.leaderBlock}
                  </Text>
                </XStack>
              </Box>

              {/* Data Field Rows */}
              <YStack gap={12}>
                <Box
                  p={14}
                  bg="rgba(255, 255, 255, 0.02)"
                  borderWidth={1}
                  borderColor="rgba(255, 255, 255, 0.06)"
                  style={{
                    borderRadius: '12px',
                  }}
                >
                  <Text fontSize={11} color="rgba(255, 255, 255, 0.5)" textTransform="uppercase" fontFamily="$mono">
                    Degree Recipient
                  </Text>
                  <Text fontSize={14} fontWeight="700" color="var(--white)" mt={4}>
                    {verificationResult?.recipient || defaultRecord.recipient}
                  </Text>
                  <Text fontFamily="$mono" fontSize={11} color="rgba(255, 255, 255, 0.45)" mt={2}>
                    DID: {defaultRecord.subjectDid}
                  </Text>
                </Box>

                <Box
                  p={14}
                  bg="rgba(255, 255, 255, 0.02)"
                  borderWidth={1}
                  borderColor="rgba(255, 255, 255, 0.06)"
                  style={{
                    borderRadius: '12px',
                  }}
                >
                  <Text fontSize={11} color="rgba(255, 255, 255, 0.5)" textTransform="uppercase" fontFamily="$mono">
                    Program & Evaluation
                  </Text>
                  <Text fontSize={14} fontWeight="700" color="var(--white)" mt={4}>
                    {verificationResult?.program || defaultRecord.program}
                  </Text>
                  <Text fontSize={12} color="#34d399" fontWeight="600" mt={2}>
                    {verificationResult?.grade || defaultRecord.grade}
                  </Text>
                </Box>

                <Box
                  p={14}
                  bg="rgba(255, 255, 255, 0.02)"
                  borderWidth={1}
                  borderColor="rgba(255, 255, 255, 0.06)"
                  style={{
                    borderRadius: '12px',
                  }}
                >
                  <Text fontSize={11} color="rgba(255, 255, 255, 0.5)" textTransform="uppercase" fontFamily="$mono">
                    Issuing Authority & Cryptographic Proof
                  </Text>
                  <Text fontFamily="$mono" fontSize={12} color="var(--white)" mt={4}>
                    {defaultRecord.issuerDid}
                  </Text>
                  <Text fontFamily="$mono" fontSize={11} color="rgba(255, 255, 255, 0.45)" mt={4}>
                    Signature: {defaultRecord.signature.slice(0, 36)}...
                  </Text>
                </Box>
              </YStack>

              {/* Action Buttons in Modal */}
              <XStack gap={10} pt={8}>
                <Box
                  render="button"
                  onClick={handleDownloadJson}
                  style={{
                    flex: 1,
                    background: 'var(--white)',
                    color: 'var(--pure-black)',
                    borderRadius: '12px',
                    padding: '12px',
                    fontWeight: 600,
                    fontSize: '13px',
                    border: 'none',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <Download size={15} color="var(--pure-black)" />
                  <span>Download JSON-LD</span>
                </Box>

                <Box
                  render="button"
                  onClick={handleDownloadBadge}
                  style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: '1px solid rgba(255, 255, 255, 0.15)',
                    color: 'var(--white)',
                    borderRadius: '12px',
                    padding: '12px',
                    fontWeight: 600,
                    fontSize: '13px',
                    cursor: 'pointer',
                    display: 'flex',
                    flexDirection: 'row',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <ShieldCheck size={15} color="var(--white)" />
                  <span>Download SVG Badge</span>
                </Box>
              </XStack>
            </YStack>
          </Box>
        </Box>
      )}

      <Catalog />


      {/* ── DOCKED MOBILE BOTTOM NAVIGATION BAR (Matching mobile.png left screen) ── */}
      <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
        <button
          type="button"
          onClick={() => {
            setActiveNav('home')
            window.scrollTo({ top: 0, behavior: 'smooth' })
          }}
          className={`mobile-bottom-nav-item ${activeNav === 'home' ? 'active' : ''}`}
        >
          <Home size={20} color={activeNav === 'home' ? '#ffffff' : 'rgba(255, 255, 255, 0.5)'} />
          <span>Home</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveNav('records')
            setShowDetailModal(true)
          }}
          className={`mobile-bottom-nav-item ${activeNav === 'records' ? 'active' : ''}`}
        >
          <FileText size={20} color={activeNav === 'records' ? '#ffffff' : 'rgba(255, 255, 255, 0.5)'} />
          <span>Records</span>
        </button>

        <button
          type="button"
          onClick={() => {
            setActiveNav('verify')
            searchInputRef.current?.focus()
            handleVerify()
          }}
          className={`mobile-bottom-nav-item ${activeNav === 'verify' ? 'active' : ''}`}
        >
          <ShieldCheck size={20} color={activeNav === 'verify' ? '#ffffff' : 'rgba(255, 255, 255, 0.5)'} />
          <span>Verify</span>
        </button>

        <a
          href="#curriculum"
          onClick={() => setActiveNav('resources')}
          className={`mobile-bottom-nav-item ${activeNav === 'resources' ? 'active' : ''}`}
        >
          <GraduationCap size={20} color={activeNav === 'resources' ? '#ffffff' : 'rgba(255, 255, 255, 0.5)'} />
          <span>Resources</span>
        </a>

        <button
          type="button"
          onClick={() => {
            window.dispatchEvent(new CustomEvent('open-mobile-drawer'))
          }}
          className="mobile-bottom-nav-item"
        >
          <MenuIcon size={20} color="rgba(255, 255, 255, 0.5)" />
          <span>More</span>
        </button>
      </nav>
    </Box>
  )
}
