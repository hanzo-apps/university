'use client'

import React, { useState, useEffect, useRef } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Box, Text, View, XStack, YStack } from '@hanzo/ui'
import { HanzoWordmark } from '@hanzogui/shell'

import {
  ChevronDown,
  Menu as MenuIcon,
  X,
  BookOpen,
  Sparkles,
  ExternalLink,
  ShieldCheck,
  Coins,
  ArrowRight,
  Home,
  FileText,
  Headphones,
  Zap,
  ChevronRight,
  Download,
} from 'lucide-react'
import { UNIVERSITY_COURSES } from '../courses-data'

export function HanzoStackLogo({ size = 24, color = "currentColor", strokeWidth = 1.9 }: { size?: number; color?: string; strokeWidth?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ flexShrink: 0 }}>
      <path
        d="M16 4.5L27 10.5L16 16.5L5 10.5L16 4.5Z"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="rgba(255, 255, 255, 0.08)"
      />
      <path
        d="M5 15.5L16 21.5L27 15.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <path
        d="M5 20.5L16 26.5L27 20.5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export function GitHubIcon({ size = 18, color = "currentColor" }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

export function Header() {
  const [grounded, setGrounded] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [programsOpen, setProgramsOpen] = useState(false)
  const pathname = usePathname()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isPinnedRef = useRef(false)
  const hoverOpenedAtRef = useRef<number>(0)

  // Automatically close dropdown on navigation
  useEffect(() => {
    closeMenu()
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => setGrounded(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const closeMenu = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    setProgramsOpen(false)
    isPinnedRef.current = false
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        closeMenu()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu()
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('keydown', handleKeyDown)

    const handleOpenDrawer = () => setMobileOpen(true)
    window.addEventListener('open-mobile-drawer', handleOpenDrawer)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('open-mobile-drawer', handleOpenDrawer)
      if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    }
  }, [])

  const handleMouseEnter = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    if (!programsOpen) {
      setProgramsOpen(true)
      hoverOpenedAtRef.current = Date.now()
    }
  }

  const handleMouseLeave = () => {
    if (isPinnedRef.current) return
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
    }
    closeTimerRef.current = setTimeout(() => {
      setProgramsOpen(false)
      isPinnedRef.current = false
    }, 400)
  }

  const handleToggleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }

    if (!programsOpen) {
      // Closed -> open and pin it
      setProgramsOpen(true)
      isPinnedRef.current = true
    } else if (!isPinnedRef.current) {
      // Open via hover -> pin it open so it stays open
      isPinnedRef.current = true
    } else {
      // Already pinned open by user click -> toggle it closed
      closeMenu()
    }
  }

  return (
    <>
      <XStack
        render="header"
        position="sticky"
        t={0}
        z={100}
        $platform-web={{ zIndex: 1000 }}
        items="center"
        justify="space-between"
        height={64}
        width="100%"
        maxW="100vw"
        overflow="hidden"
        px={14}
        $sm={{ px: 20 }}
        $md={{ px: 24 }}
        bg={grounded ? 'rgba(10, 10, 10, 0.94)' : 'rgba(10, 10, 10, 0.85)'}
        backdropFilter="blur(20px)"
        borderBottomWidth={1}
        borderColor="var(--border)"
        transition="quickest"
      >
        {/* Brand Link */}
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit', flexShrink: 1, minWidth: 0, overflow: 'hidden' }}>
          <XStack items="center" gap={8} minW={0}>
            <HanzoWordmark label="Hanzo University" size={20} />
          </XStack>
        </Link>

        {/* Desktop Nav Links */}
        <XStack items="center" gap={16} $lg={{ gap: 24 }} display="none" $md={{ display: 'flex' }}>
          {/* Programs Dropdown Trigger */}
          <div
            ref={dropdownRef}
            style={{ position: 'relative' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <button
              type="button"
              onClick={handleToggleClick}
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
              aria-expanded={programsOpen}
              aria-haspopup="true"
              className="programs-trigger-btn"
              style={{
                background: 'transparent',
                border: 'none',
                padding: 0,
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                color: 'inherit',
                font: 'inherit',
                outline: 'none',
              }}
            >
              <XStack
                items="center"
                gap={4}
                py={12}
                $platform-web={{ cursor: 'pointer' }}
              >
                <Text
                  fontSize="$2"
                  color={programsOpen ? 'var(--white)' : 'var(--muted-foreground)'}
                  fontWeight={programsOpen ? '600' : '400'}
                  hoverStyle={{ color: 'var(--white)' }}
                >
                  Programs & Degrees
                </Text>
                <ChevronDown
                  size={14}
                  color={programsOpen ? 'var(--white)' : 'var(--muted-foreground)'}
                  style={{
                    transform: programsOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                    transition: 'transform 0.15s ease, color 0.15s ease',
                  }}
                />
              </XStack>
            </button>

            {/* Programs Floating Dropdown Menu */}
            {programsOpen && (
              <div
                className="programs-dropdown-menu"
                style={{
                  position: 'absolute',
                  top: 'calc(100% - 2px)',
                  left: -140,
                  paddingTop: 8,
                  zIndex: 1001,
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <YStack
                  width={560}
                  p={16}
                  rounded="var(--radius-xl)"
                  bg="rgba(10, 10, 10, 0.98)"
                  backdropFilter="blur(24px)"
                  borderWidth={1}
                  borderColor="rgba(255, 255, 255, 0.08)"
                  gap={12}
                  $platform-web={{
                    boxShadow: '0 24px 48px rgba(0, 0, 0, 0.9), 0 0 1px rgba(255, 255, 255, 0.15)',
                  }}
                >
                  <XStack items="center" justify="space-between" px={8} pb={8} borderBottomWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
                    <Text fontSize="$1" fontWeight="700" color="rgba(255, 255, 255, 0.5)" fontFamily="$mono">
                      3 CERTIFICATION TRACKS
                    </Text>
                    <Text fontSize="$1" color="var(--emerald-400)" fontFamily="$mono">
                      +25% COMPUTE REBATE
                    </Text>
                  </XStack>

                  <YStack gap={6}>
                    {UNIVERSITY_COURSES.map((c) => (
                      <Link
                        key={c.slug}
                        href={`/${c.slug}`}
                        onClick={() => setTimeout(closeMenu, 80)}
                        style={{ textDecoration: 'none', color: 'inherit', display: 'block', cursor: 'pointer' }}
                      >
                        <XStack
                          items="center"
                          justify="space-between"
                          p={10}
                          rounded="var(--radius-md)"
                          bg="transparent"
                          hoverStyle={{
                            background: 'rgba(255, 255, 255, 0.05)',
                          }}
                        >
                          <XStack items="center" gap={10}>
                            <View
                              px={6}
                              py={2}
                              rounded="var(--radius-sm)"
                              bg="var(--pure-black)"
                              borderWidth={1}
                              borderColor="rgba(255, 255, 255, 0.12)"
                            >
                              <Text fontSize="$1" fontWeight="700" fontFamily="$mono" color="var(--white)">
                                {c.code}
                              </Text>
                            </View>
                            <YStack gap={2}>
                              <Text fontSize="$2" fontWeight="600" color="var(--white)">
                                {c.title}
                              </Text>
                              <Text fontSize="$1" color="var(--muted-foreground)">
                                {c.credential} · {c.duration} · {c.level}
                              </Text>
                            </YStack>
                          </XStack>

                          <XStack items="center" gap={6}>
                            <Text fontSize="$1" color="rgba(255, 255, 255, 0.6)" fontFamily="$mono">
                              ${c.price}
                            </Text>
                            <ArrowRight size={13} color="rgba(255, 255, 255, 0.4)" />
                          </XStack>
                        </XStack>
                      </Link>
                    ))}
                  </YStack>

                  <XStack
                    items="center"
                    justify="space-between"
                    pt={10}
                    px={8}
                    borderTopWidth={1}
                    borderColor="rgba(255, 255, 255, 0.08)"
                  >
                    <Link
                      href="/portal"
                      onClick={() => setTimeout(closeMenu, 80)}
                      style={{ textDecoration: 'none', cursor: 'pointer' }}
                    >
                      <XStack items="center" gap={4}>
                        <Text fontSize="$1" color="var(--emerald-400)" fontWeight="600">
                          Student Portal →
                        </Text>
                      </XStack>
                    </Link>

                    <a
                      href="https://hanzo.ai/blog/kai-decision-models"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setTimeout(closeMenu, 80)}
                      style={{ textDecoration: 'none', cursor: 'pointer' }}
                    >
                      <XStack items="center" gap={4}>
                        <Text fontSize="$1" color="var(--muted-foreground)" hoverStyle={{ color: 'var(--white)' }}>
                          Kai Decision Models ↗
                        </Text>
                      </XStack>
                    </a>

                    <Link
                      href="/#credentials"
                      onClick={() => setTimeout(closeMenu, 80)}
                      style={{ textDecoration: 'none', cursor: 'pointer' }}
                    >
                      <Text fontSize="$1" color="var(--muted-foreground)" hoverStyle={{ color: 'var(--white)' }}>
                        W3C Standards
                      </Text>
                    </Link>
                  </XStack>
                </YStack>
              </div>
            )}
          </div>

          <Link href="/#comparison" style={{ textDecoration: 'none' }}>
            <Text fontSize="$2" color="var(--muted-foreground)" hoverStyle={{ color: 'var(--white)' }}>
              Comparison
            </Text>
          </Link>

          <Link href="/portal" style={{ textDecoration: 'none' }}>
            <Text fontSize="$2" color="var(--muted-foreground)" hoverStyle={{ color: 'var(--white)' }}>
              Student Portal
            </Text>
          </Link>

          <a
            href="https://hanzo.ai/blog/kai-decision-models"
            target="_blank"
            rel="noreferrer"
            className="hide-on-tablet"
            style={{ textDecoration: 'none' }}
          >
            <Text fontSize="$2" color="var(--muted-foreground)" hoverStyle={{ color: 'var(--white)' }}>
              Research & Blog ↗
            </Text>
          </a>

          <a
            href="https://hanzo.ai"
            target="_blank"
            rel="noreferrer"
            className="hide-on-tablet"
            style={{ textDecoration: 'none' }}
          >
            <Text fontSize="$2" color="var(--muted-foreground)" hoverStyle={{ color: 'var(--white)' }}>
              Hanzo Cloud ↗
            </Text>
          </a>
        </XStack>

        {/* Action Buttons */}
        <XStack items="center" gap={8} $sm={{ gap: 12 }} style={{ flexShrink: 0 }}>
          {/* Desktop Only Buttons */}
          <Link
            href="/portal"
            className="hide-on-mobile"
            style={{
              padding: '7px 14px',
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--white-70)',
              textDecoration: 'none',
            }}
          >
            Student Log In
          </Link>
          <Link
            href="/#curriculum"
            className="hide-on-mobile"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              background: 'var(--white)',
              color: 'var(--pure-black)',
              padding: '8px 16px',
              borderRadius: '999px',
              fontWeight: 600,
              fontSize: '13px',
              textDecoration: 'none',
            }}
          >
            Enroll in Track →
          </Link>

          {/* Mobile Only: Student Portal Pill Button */}
          <Link
            href="/portal"
            className="show-on-mobile-only"
            style={{
              background: 'rgba(255, 255, 255, 0.08)',
              border: '1px solid rgba(255, 255, 255, 0.14)',
              borderRadius: '999px',
              padding: '5px 10px',
              color: 'var(--white)',
              fontSize: '11px',
              fontWeight: 500,
              textDecoration: 'none',
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              whiteSpace: 'nowrap',
            }}
          >
            <span>Portal</span>
            <span style={{ fontSize: '12px' }}>→</span>
          </Link>

          {/* Mobile Menu Toggle (Matching mobile.png left screen hamburger icon) */}
          <View
            render="button"
            display="flex"
            $md={{ display: 'none' }}
            onClick={() => setMobileOpen(!mobileOpen)}
            p={6}
            bg="transparent"
            borderWidth={0}
            $platform-web={{ cursor: 'pointer', outline: 'none' }}
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X size={20} color="var(--white)" /> : <MenuIcon size={20} color="var(--white)" />}
          </View>
        </XStack>
      </XStack>

      {/* ── Mobile Navigation Drawer (Faithfully matching mobile.png right screen) ── */}
      {mobileOpen && (
        <YStack
          position="fixed"
          t={0}
          l={0}
          r={0}
          b={0}
          z={100}
          bg="rgba(5, 7, 10, 0.98)"
          backdropFilter="blur(24px)"
          p={20}
          gap={18}
          overflowY="auto"
          className="drawer-enter"
          $md={{ display: 'none' }}
        >
          {/* 1. Header: Hanzo Isometric Stack Logo + Hanzo University + Close X */}
          <XStack items="center" justify="space-between" pb={12} pt={4} borderBottomWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
            <XStack items="center" gap={10}>
              <HanzoStackLogo size={24} color="#ffffff" strokeWidth={2} />
              <Text fontSize={17} fontWeight="700" color="var(--white)">
                Hanzo University
              </Text>
            </XStack>
            <View
              render="button"
              onClick={() => setMobileOpen(false)}
              p={6}
              bg="transparent"
              borderWidth={0}
              $platform-web={{ cursor: 'pointer', outline: 'none' }}
              aria-label="Close menu"
            >
              <X size={20} color="var(--white)" />
            </View>
          </XStack>

          {/* 2. Main Navigation Links */}
          <YStack gap={6}>
            {/* Home (Active Highlighted Pill) */}
            <Link
              href="/"
              onClick={() => setMobileOpen(false)}
              style={{
                textDecoration: 'none',
                width: '100%',
                background: 'rgba(255, 255, 255, 0.08)',
                border: '1px solid rgba(255, 255, 255, 0.12)',
                borderRadius: '14px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: 'var(--white)',
                fontSize: '14px',
                fontWeight: 600,
                boxSizing: 'border-box',
              }}
            >
              <Home size={18} color="var(--white)" />
              <span>Home</span>
            </Link>

            {/* My Records */}
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false)
                window.dispatchEvent(new CustomEvent('open-records-modal'))
              }}
              style={{
                width: '100%',
                background: 'transparent',
                border: '1px solid transparent',
                borderRadius: '14px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: 'rgba(255, 255, 255, 0.75)',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              <FileText size={18} color="rgba(255, 255, 255, 0.75)" />
              <span>My Records</span>
            </button>

            {/* Verify Credentials */}
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false)
                window.dispatchEvent(new CustomEvent('open-verify-modal'))
              }}
              style={{
                width: '100%',
                background: 'transparent',
                border: '1px solid transparent',
                borderRadius: '14px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: 'rgba(255, 255, 255, 0.75)',
                cursor: 'pointer',
                textAlign: 'left',
                fontSize: '14px',
                fontWeight: 500,
              }}
            >
              <ShieldCheck size={18} color="rgba(255, 255, 255, 0.75)" />
              <span>Verify Credentials</span>
            </button>

            {/* Resources */}
            <a
              href="/#curriculum"
              onClick={() => setMobileOpen(false)}
              style={{
                textDecoration: 'none',
                width: '100%',
                background: 'transparent',
                border: '1px solid transparent',
                borderRadius: '14px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: 'rgba(255, 255, 255, 0.75)',
                fontSize: '14px',
                fontWeight: 500,
                boxSizing: 'border-box',
              }}
            >
              <BookOpen size={18} color="rgba(255, 255, 255, 0.75)" />
              <span>Resources</span>
            </a>

            {/* Support */}
            <a
              href="/#faqs"
              onClick={() => setMobileOpen(false)}
              style={{
                textDecoration: 'none',
                width: '100%',
                background: 'transparent',
                border: '1px solid transparent',
                borderRadius: '14px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                gap: '12px',
                color: 'rgba(255, 255, 255, 0.75)',
                fontSize: '14px',
                fontWeight: 500,
                boxSizing: 'border-box',
              }}
            >
              <Headphones size={18} color="rgba(255, 255, 255, 0.75)" />
              <span>Support</span>
            </a>
          </YStack>

          {/* 3. Quick Actions Section */}
          <YStack gap={10} pt={4}>
            <XStack items="center" gap={8} pb={2}>
              <Zap size={16} color="var(--white)" />
              <Text fontSize={15} fontWeight="700" color="var(--white)">
                Quick Actions
              </Text>
            </XStack>

            {/* Verify a Record */}
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false)
                window.dispatchEvent(new CustomEvent('open-verify-modal'))
              }}
              className="hanzo-mobile-card"
              style={{
                width: '100%',
                background: '#090c12',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '14px 18px',
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
              onClick={() => setMobileOpen(false)}
              className="hanzo-mobile-card"
              style={{
                textDecoration: 'none',
                width: '100%',
                background: '#090c12',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '14px 18px',
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
              onClick={() => {
                window.dispatchEvent(new CustomEvent('download-credential-json'))
              }}
              className="hanzo-mobile-card"
              style={{
                width: '100%',
                background: '#090c12',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '14px 18px',
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
              onClick={() => {
                window.dispatchEvent(new CustomEvent('download-credential-badge'))
              }}
              className="hanzo-mobile-card"
              style={{
                width: '100%',
                background: '#090c12',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '16px',
                padding: '14px 18px',
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

          {/* 4. Active Student Subcard */}
          <Box
            className="hanzo-mobile-card"
            borderWidth={1}
            borderColor="rgba(255, 255, 255, 0.08)"
            bg="#07090e"
            p={16}
            style={{
              borderRadius: '16px',
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
              HACE-2026-9821
            </Text>
            <button
              type="button"
              onClick={() => {
                setMobileOpen(false)
                window.dispatchEvent(new CustomEvent('open-records-modal'))
              }}
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
              }}
            >
              <span>View Details</span>
              <span>→</span>
            </button>
          </Box>

          {/* 5. Brand Footer Card */}
          <Box
            borderWidth={1}
            borderColor="rgba(255, 255, 255, 0.08)"
            bg="#090c12"
            p={18}
            style={{
              borderRadius: '18px',
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              gap: '14px',
              marginTop: '4px',
            }}
          >
            <HanzoStackLogo size={28} color="#ffffff" strokeWidth={2} />
            <YStack gap={2}>
              <Text fontSize={14} fontWeight="700" color="var(--white)">
                Hanzo University
              </Text>
              <Text fontSize={12} color="rgba(255, 255, 255, 0.45)">
                Build what&rsquo;s next.
              </Text>
            </YStack>
          </Box>
        </YStack>
      )}
    </>
  )
}
