'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Box, Text, XStack, YStack, View } from '@/components/ui'
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
  CheckCircle2,
  User,
  Landmark,
  GraduationCap,
  X,
  Sparkles,
  ExternalLink,
  Menu as MenuIcon,
} from 'lucide-react'
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
    statusText: string
    status: 'verified'
  } | null>(null)
  const [showDetailModal, setShowDetailModal] = useState<boolean>(false)

  const searchInputRef = useRef<HTMLInputElement>(null)

  const defaultRecord = {
    id: 'HACE-2026-9821',
    standard: 'W3C Verifiable Credential Data Model v2.0',
    recipient: name,
    issuingAuthority: 'did:hanzo:university:credentials',
    program: 'ENG 100 · Agentic Coding Systems · Professional Certification',
    statusText: 'Capstone Cleanroom Harness Verified (Exit Code 0)',
    issuerDid: 'did:hanzo:university:credentials',
    subjectDid: `did:hanzo:student:${handle}`,
    evidence: 'Deployed capstone artifact verified in isolated sandbox harness',
    proofMethod: 'did:hanzo:university:credentials#key-1 (Ed25519Signature2020)',
    signature: '0x7f4a8b1c99e2e89b3f4a1c2d88e0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8',
  }

  const handleVerify = (customId?: string) => {
    const idToVerify = (customId || searchId || defaultRecord.id).trim().toUpperCase()
    setIsVerifying(true)
    setTimeout(() => {
      setIsVerifying(false)
      setVerificationResult({
        id: idToVerify,
        recipient: defaultRecord.recipient,
        program: defaultRecord.program,
        statusText: defaultRecord.statusText,
        status: 'verified',
      })
      setShowDetailModal(true)
    }, 300)
  }

  const handleDownloadJson = () => {
    const payload = {
      '@context': ['https://www.w3.org/ns/credentials/v2', 'https://hanzo.university/credentials/v1'],
      id: `urn:uuid:hanzo-cert-2026-${defaultRecord.id}`,
      type: ['VerifiableCredential', 'HanzoProfessionalCredential'],
      issuer: {
        id: defaultRecord.issuerDid,
        name: 'Hanzo University — The School of Intelligence Engineering',
      },
      validFrom: '2026-10-06T14:12:16Z',
      credentialSubject: {
        id: defaultRecord.subjectDid,
        name: defaultRecord.recipient,
        program: defaultRecord.program,
        certification: 'Hanzo Certified Agentic Coding Engineer (HACE)',
        accreditationStatus: 'Non-accredited professional certification proving completed practical capstone & live artifact',
        telemetryProof: defaultRecord.evidence,
      },
      proof: {
        type: 'Ed25519Signature2020',
        verificationMethod: defaultRecord.proofMethod,
        created: '2026-10-06T14:12:16Z',
        proofValue: defaultRecord.signature,
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
      <Box width="100%" maxW={1440} mx="auto" px={20} py={24}>
        {/* DESKTOP DASHBOARD */}
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
          {/* Left Sidebar */}
          <Box
            className="dashboard-sidebar"
            borderWidth={0}
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
            <YStack gap={6}>
              <Box
                render="button"
                onClick={() => setActiveNav('home')}
                style={{
                  width: '100%',
                  background: activeNav === 'home' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '11px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: activeNav === 'home' ? 'var(--white)' : 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: activeNav === 'home' ? 600 : 500,
                }}
              >
                <Home size={18} color={activeNav === 'home' ? 'var(--white)' : 'rgba(255, 255, 255, 0.6)'} />
                <span>Home</span>
              </Box>

              <Box
                render="button"
                onClick={() => {
                  setActiveNav('records')
                  setShowDetailModal(true)
                }}
                style={{
                  width: '100%',
                  background: activeNav === 'records' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  border: 'none',
                  borderRadius: '14px',
                  padding: '11px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: activeNav === 'records' ? 'var(--white)' : 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: activeNav === 'records' ? 600 : 500,
                }}
              >
                <FileText size={18} color={activeNav === 'records' ? 'var(--white)' : 'rgba(255, 255, 255, 0.6)'} />
                <span>My Credentials</span>
              </Box>

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
                  border: 'none',
                  borderRadius: '14px',
                  padding: '11px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: activeNav === 'verify' ? 'var(--white)' : 'rgba(255, 255, 255, 0.6)',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: activeNav === 'verify' ? 600 : 500,
                }}
              >
                <ShieldCheck size={18} color={activeNav === 'verify' ? 'var(--white)' : 'rgba(255, 255, 255, 0.6)'} />
                <span>Verify Proof</span>
              </Box>

              <a
                href="#schools"
                onClick={() => setActiveNav('resources')}
                style={{
                  textDecoration: 'none',
                  width: '100%',
                  background: activeNav === 'resources' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  borderRadius: '14px',
                  padding: '11px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: activeNav === 'resources' ? 'var(--white)' : 'rgba(255, 255, 255, 0.6)',
                  fontSize: '14px',
                  fontWeight: activeNav === 'resources' ? 600 : 500,
                }}
              >
                <BookOpen size={18} color={activeNav === 'resources' ? 'var(--white)' : 'rgba(255, 255, 255, 0.6)'} />
                <span>25 Courses</span>
              </a>

              <a
                href="#faqs"
                onClick={() => setActiveNav('support')}
                style={{
                  textDecoration: 'none',
                  width: '100%',
                  background: activeNav === 'support' ? 'rgba(255, 255, 255, 0.08)' : 'transparent',
                  borderRadius: '14px',
                  padding: '11px 14px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  color: activeNav === 'support' ? 'var(--white)' : 'rgba(255, 255, 255, 0.6)',
                  fontSize: '14px',
                  fontWeight: activeNav === 'support' ? 600 : 500,
                }}
              >
                <Headphones size={18} color={activeNav === 'support' ? 'var(--white)' : 'rgba(255, 255, 255, 0.6)'} />
                <span>Support</span>
              </a>
            </YStack>

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
                  Intelligence Engineering
                </Text>
              </YStack>
            </XStack>
          </Box>

          {/* Center Dashboard */}
          <Box
            style={{
              flex: '1 1 500px',
              minWidth: 0,
              display: 'flex',
              flexDirection: 'column',
              gap: '20px',
            }}
          >
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
                <Text fontFamily="$mono" fontSize={11} color="rgba(255, 255, 255, 0.5)" textTransform="uppercase" letterSpacing={1.2} fontWeight="600">
                  STUDENT PORTAL · THE SCHOOL OF INTELLIGENCE ENGINEERING
                </Text>
                <Text fontSize={32} fontWeight="700" color="var(--white)" lineHeight={38} style={{ letterSpacing: '-0.02em' }}>
                  Welcome back, {name}
                </Text>
                <Text fontSize={14} color="rgba(255, 255, 255, 0.65)" maxW={560} lineHeight={20}>
                  Launch your interactive labs on hanzo.app/learn, track capstone verification, and manage your W3C practical credentials.
                </Text>
              </YStack>

              <Box
                borderWidth={0}
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
                  <View width={7} height={7} rounded={999} bg="#10b981" style={{ boxShadow: '0 0 8px rgba(16, 185, 129, 0.6)' }} />
                  <Text fontFamily="$mono" fontSize={11} color="rgba(255, 255, 255, 0.7)" fontWeight="500">
                    Active Learner
                  </Text>
                </XStack>
                <Text fontFamily="$mono" fontSize={14} fontWeight="700" color="var(--white)" letterSpacing={0.5}>
                  @{handle}
                </Text>
                <Link
                  href="/portal"
                  style={{
                    marginTop: '4px',
                    color: 'rgba(255, 255, 255, 0.85)',
                    fontSize: '12px',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  Open Workstation →
                </Link>
              </Box>
            </Box>

            {/* Verification Card */}
            <Box borderWidth={0} bg="#080808" p={24} position="relative" overflow="hidden" style={{ borderRadius: '20px' }}>
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
                    <Text fontFamily="$mono" fontSize={11} color="rgba(255, 255, 255, 0.5)" textTransform="uppercase" letterSpacing={1.2} fontWeight="600">
                      W3C PRACTICAL CREDENTIAL VERIFICATION
                    </Text>
                  </XStack>
                  <Text fontSize={20} fontWeight="700" color="var(--white)">
                    Cryptographic Proof of Completed Capstones
                  </Text>
                  <Text fontSize={13} color="rgba(255, 255, 255, 0.6)" lineHeight={19}>
                    Verify signed W3C credentials proving completed practical capstones and live artifacts (non-accredited professional certifications).
                  </Text>
                </YStack>

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
                      whiteSpace: 'nowrap',
                    }}
                  >
                    Verify Record →
                  </button>
                  <GlassShieldArtwork size={84} />
                </XStack>
              </Box>

              <div
                style={{
                  marginTop: '20px',
                  borderRadius: '999px',
                  border: '1px solid rgba(255, 255, 255, 0.1)',
                  background: 'rgba(0, 0, 0, 0.7)',
                  padding: '6px 6px 6px 18px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '12px',
                  height: '46px',
                  boxSizing: 'border-box',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1 }}>
                  <Search size={16} color="rgba(255, 255, 255, 0.4)" />
                  <input
                    ref={searchInputRef}
                    type="text"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') handleVerify()
                    }}
                    placeholder="Enter credential ID (e.g. HACE-2026-9821)"
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
                    padding: '7px 16px',
                    color: 'var(--white)',
                    fontSize: '12px',
                    fontWeight: 500,
                    cursor: 'pointer',
                    whiteSpace: 'nowrap',
                  }}
                >
                  {isVerifying ? 'Verifying...' : 'Verify →'}
                </button>
              </div>
            </Box>

            {/* Your Practical Credentials Card */}
            <Box borderWidth={0} bg="#080808" p={24} style={{ borderRadius: '20px' }}>
              <XStack items="center" justify="space-between" pb={16}>
                <XStack items="center" gap={10}>
                  <Award size={20} color="var(--white)" />
                  <Text fontSize={18} fontWeight="700" color="var(--white)">
                    Your Professional Credentials
                  </Text>
                </XStack>
                <button
                  type="button"
                  onClick={() => setShowDetailModal(true)}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: 'none',
                    borderRadius: '999px',
                    padding: '4px 12px',
                    fontSize: '12px',
                    fontFamily: 'var(--font-mono)',
                    color: 'rgba(255, 255, 255, 0.8)',
                    cursor: 'pointer',
                  }}
                >
                  Inspect Proof →
                </button>
              </XStack>

              <Box bg="rgba(0, 0, 0, 0.5)" p={20} style={{ borderRadius: '16px' }}>
                <div className="credential-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '18px 28px' }}>
                  <YStack gap={4}>
                    <XStack items="center" gap={6}>
                      <User size={14} color="rgba(255, 255, 255, 0.5)" />
                      <Text fontSize={12} color="rgba(255, 255, 255, 0.5)">Credential Recipient</Text>
                    </XStack>
                    <Text fontSize={14} fontWeight="700" color="var(--white)">{defaultRecord.recipient}</Text>
                  </YStack>

                  <YStack gap={4}>
                    <XStack items="center" gap={6}>
                      <Landmark size={14} color="rgba(255, 255, 255, 0.5)" />
                      <Text fontSize={12} color="rgba(255, 255, 255, 0.5)">Issuer DID</Text>
                    </XStack>
                    <Text fontFamily="$mono" fontSize={12} fontWeight="600" color="var(--white)">{defaultRecord.issuingAuthority}</Text>
                  </YStack>

                  <YStack gap={4}>
                    <XStack items="center" gap={6}>
                      <GraduationCap size={14} color="rgba(255, 255, 255, 0.5)" />
                      <Text fontSize={12} color="rgba(255, 255, 255, 0.5)">Certification Track</Text>
                    </XStack>
                    <Text fontSize={13} fontWeight="600" color="var(--white)">{defaultRecord.program}</Text>
                  </YStack>

                  <YStack gap={4}>
                    <XStack items="center" gap={6}>
                      <Award size={14} color="rgba(255, 255, 255, 0.5)" />
                      <Text fontSize={12} color="rgba(255, 255, 255, 0.5)">Verification Status</Text>
                    </XStack>
                    <Text fontSize={13} fontWeight="700" color="var(--emerald-400)">{defaultRecord.statusText}</Text>
                  </YStack>
                </div>
              </Box>
            </Box>
          </Box>

          {/* Right Sidebar */}
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
            <Box bg="#080808" p={20} style={{ borderRadius: '20px' }}>
              <XStack items="center" gap={8} pb={12}>
                <Zap size={18} color="var(--white)" />
                <Text fontSize={15} fontWeight="700" color="var(--white)">Quick Actions</Text>
              </XStack>

              <YStack gap={10} mt={4}>
                <a
                  href="https://hanzo.app/learn"
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    textDecoration: 'none',
                    width: '100%',
                    background: '#f2f2f2',
                    color: 'var(--pure-black)',
                    borderRadius: '14px',
                    padding: '13px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxSizing: 'border-box',
                    fontWeight: 600,
                    fontSize: '13px',
                  }}
                >
                  <span>Open hanzo.app/learn</span>
                  <ExternalLink size={15} />
                </a>

                <Link
                  href="/portal"
                  style={{
                    textDecoration: 'none',
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.04)',
                    color: 'var(--white)',
                    borderRadius: '14px',
                    padding: '13px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    boxSizing: 'border-box',
                    fontWeight: 500,
                    fontSize: '13px',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <ArrowRight size={16} />
                    <span>Student Portal</span>
                  </span>
                  <ChevronRight size={15} color="rgba(255, 255, 255, 0.5)" />
                </Link>

                <button
                  type="button"
                  onClick={handleDownloadJson}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: 'none',
                    color: 'var(--white)',
                    borderRadius: '14px',
                    padding: '13px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <Download size={16} />
                    <span>Download W3C JSON</span>
                  </span>
                  <ChevronRight size={15} color="rgba(255, 255, 255, 0.5)" />
                </button>

                <button
                  type="button"
                  onClick={handleDownloadBadge}
                  style={{
                    width: '100%',
                    background: 'rgba(255, 255, 255, 0.04)',
                    border: 'none',
                    color: 'var(--white)',
                    borderRadius: '14px',
                    padding: '13px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    cursor: 'pointer',
                    fontSize: '13px',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <GitHubIcon size={16} color="var(--white)" />
                    <span>Download SVG Badge</span>
                  </span>
                  <ChevronRight size={15} color="rgba(255, 255, 255, 0.5)" />
                </button>
              </YStack>
            </Box>

            <Box bg="#080808" p={20} style={{ borderRadius: '20px' }}>
              <XStack items="center" gap={8} pb={12}>
                <Link2 size={18} color="var(--white)" />
                <Text fontSize={15} fontWeight="700" color="var(--white)">Ecosystem Links</Text>
              </XStack>
              <YStack gap={4}>
                <a href="#schools" style={{ textDecoration: 'none', padding: '8px 4px', color: 'rgba(255, 255, 255, 0.78)', fontSize: '13px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>All 25 Courses</span><ChevronRight size={14} />
                </a>
                <a href="https://docs.hanzo.ai/docs/guides" target="_blank" rel="noreferrer" style={{ textDecoration: 'none', padding: '8px 4px', color: 'rgba(255, 255, 255, 0.78)', fontSize: '13px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Practical Guides (Docs)</span><ChevronRight size={14} />
                </a>
                <Link href="/verify" style={{ textDecoration: 'none', padding: '8px 4px', color: 'rgba(255, 255, 255, 0.78)', fontSize: '13px', display: 'flex', justifyContent: 'space-between' }}>
                  <span>Public Verification Registry</span><ChevronRight size={14} />
                </Link>
              </YStack>
            </Box>
          </Box>
        </Box>

        {/* MOBILE DASHBOARD */}
        <Box
          className="mobile-dashboard-view"
          style={{
            display: 'none',
            flexDirection: 'column',
            gap: '16px',
            width: '100%',
            maxWidth: '560px',
            margin: '0 auto',
          }}
        >
          <Box style={{ borderRadius: '20px', background: '#090c12', padding: '20px' }}>
            <XStack justify="space-between" items="flex-start" gap={12}>
              <YStack flex={1} minW={0} gap={6}>
                <Text fontFamily="$mono" fontSize={11} color="rgba(255, 255, 255, 0.5)" fontWeight="600">
                  STUDENT PORTAL
                </Text>
                <Text fontSize={24} fontWeight="700" color="var(--white)">
                  Welcome back, {name}
                </Text>
                <Text fontSize={13} color="rgba(255, 255, 255, 0.65)" lineHeight={19}>
                  Continue your labs in hanzo.app/learn or verify your practical capstone credentials.
                </Text>
              </YStack>
              <GlassShieldArtwork size={64} />
            </XStack>

            <YStack gap={10} mt={16}>
              <a
                href="https://hanzo.app/learn"
                target="_blank"
                rel="noreferrer"
                style={{
                  textDecoration: 'none',
                  background: 'var(--white)',
                  color: 'var(--pure-black)',
                  padding: '12px 16px',
                  borderRadius: '999px',
                  fontWeight: 700,
                  fontSize: '13px',
                  textAlign: 'center',
                }}
              >
                Open Learning Workspace ↗
              </a>
              <Link
                href="/portal"
                style={{
                  textDecoration: 'none',
                  background: 'rgba(255, 255, 255, 0.08)',
                  color: 'var(--white)',
                  padding: '12px 16px',
                  borderRadius: '999px',
                  fontWeight: 600,
                  fontSize: '13px',
                  textAlign: 'center',
                }}
              >
                Access Student Portal →
              </Link>
            </YStack>
          </Box>
        </Box>
      </Box>

      {/* CREDENTIAL MODAL */}
      {showDetailModal && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.88)',
            backdropFilter: 'blur(20px)',
            zIndex: 99999,
            overflowY: 'auto',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '16px',
          }}
          onClick={(e) => {
            if (e.target === e.currentTarget) setShowDetailModal(false)
          }}
        >
          <div
            style={{
              width: '100%',
              maxWidth: '560px',
              backgroundColor: '#0c1017',
              borderRadius: '24px',
              padding: '22px',
              boxSizing: 'border-box',
            }}
          >
            <XStack items="center" justify="space-between" pb={14} borderBottomWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
              <XStack items="center" gap={10}>
                <ShieldCheck size={20} color="#34d399" />
                <YStack>
                  <Text fontSize={16} fontWeight="700" color="var(--white)">
                    W3C Verifiable Credential
                  </Text>
                  <Text fontFamily="$mono" fontSize={11} color="rgba(255, 255, 255, 0.55)">
                    {verificationResult?.id || defaultRecord.id}
                  </Text>
                </YStack>
              </XStack>
              <button
                type="button"
                onClick={() => setShowDetailModal(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.08)',
                  border: 'none',
                  borderRadius: '999px',
                  width: 32,
                  height: 32,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'var(--white)',
                }}
              >
                <X size={16} />
              </button>
            </XStack>

            <YStack gap={12} pt={14}>
              <XStack items="center" gap={8} p={10} rounded="var(--radius-md)" bg="rgba(16, 185, 129, 0.1)">
                <CheckCircle2 size={15} color="#34d399" />
                <Text fontSize={12} fontWeight="600" color="#34d399">
                  Cryptographic Proof of Completed Practical Capstone
                </Text>
              </XStack>

              <YStack gap={4} p={14} bg="rgba(255, 255, 255, 0.03)" style={{ borderRadius: '12px' }}>
                <Text fontFamily="$mono" fontSize={10} color="rgba(255, 255, 255, 0.5)">RECIPIENT</Text>
                <Text fontSize={15} fontWeight="700" color="var(--white)">{verificationResult?.recipient || defaultRecord.recipient}</Text>
                <Text fontFamily="$mono" fontSize={11} color="rgba(255, 255, 255, 0.5)">{defaultRecord.subjectDid}</Text>
              </YStack>

              <YStack gap={4} p={14} bg="rgba(255, 255, 255, 0.03)" style={{ borderRadius: '12px' }}>
                <Text fontFamily="$mono" fontSize={10} color="rgba(255, 255, 255, 0.5)">CERTIFICATION &amp; ARTIFACT PROOF</Text>
                <Text fontSize={14} fontWeight="700" color="var(--white)">{verificationResult?.program || defaultRecord.program}</Text>
                <Text fontSize={12} color="#34d399">{verificationResult?.statusText || defaultRecord.statusText}</Text>
              </YStack>

              <YStack gap={4} p={14} bg="rgba(59, 130, 246, 0.08)" style={{ borderRadius: '12px' }}>
                <XStack items="center" gap={6}>
                  <Sparkles size={13} color="#60a5fa" />
                  <Text fontFamily="$mono" fontSize={10} fontWeight="700" color="#93c5fd">CREDENTIAL SCOPE</Text>
                </XStack>
                <Text fontSize={12} color="rgba(255, 255, 255, 0.78)" lineHeight={18}>
                  W3C Verifiable Credentials provide cryptographic proof of completed practical capstones &amp; live deployed artifacts. They are professional certifications, not accredited academic degrees.
                </Text>
              </YStack>

              <XStack gap={8} pt={4}>
                <button
                  type="button"
                  onClick={handleDownloadJson}
                  style={{
                    flex: 1,
                    background: 'rgba(255, 255, 255, 0.08)',
                    border: 'none',
                    color: 'var(--white)',
                    borderRadius: '10px',
                    padding: '10px',
                    fontSize: '12px',
                    fontWeight: 600,
                    cursor: 'pointer',
                  }}
                >
                  Download JSON-LD
                </button>
                <Link
                  href={`/verify?id=${defaultRecord.id}&student=${handle}`}
                  style={{
                    flex: 1,
                    background: 'var(--white)',
                    color: 'var(--pure-black)',
                    borderRadius: '10px',
                    padding: '10px',
                    fontSize: '12px',
                    fontWeight: 700,
                    textAlign: 'center',
                    textDecoration: 'none',
                  }}
                >
                  Public Registry →
                </Link>
              </XStack>
            </YStack>
          </div>
        </div>
      )}

      <Catalog showHero={false} />

      <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
        <button type="button" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="mobile-bottom-nav-item active">
          <Home size={20} />
          <span>Home</span>
        </button>
        <button type="button" onClick={() => setShowDetailModal(true)} className="mobile-bottom-nav-item">
          <FileText size={20} />
          <span>Records</span>
        </button>
        <Link href="/verify" className="mobile-bottom-nav-item">
          <ShieldCheck size={20} />
          <span>Verify</span>
        </Link>
        <a href="#schools" className="mobile-bottom-nav-item">
          <GraduationCap size={20} />
          <span>Courses</span>
        </a>
        <button type="button" onClick={() => window.dispatchEvent(new CustomEvent('open-mobile-drawer'))} className="mobile-bottom-nav-item">
          <MenuIcon size={20} />
          <span>More</span>
        </button>
      </nav>
    </Box>
  )
}
