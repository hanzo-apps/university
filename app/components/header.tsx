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
  ExternalLink,
  ShieldCheck,
  ArrowRight,
  Home,
  Compass,
  Award,
  Terminal,
  Sparkles,
} from 'lucide-react'
import { SCHOOLS, UNIVERSITY_COURSES } from '../courses-data'

export function HanzoStackLogo({
  size = 24,
  color = 'currentColor',
  strokeWidth = 1.9,
}: {
  size?: number
  color?: string
  strokeWidth?: number
}) {
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

export function GitHubIcon({ size = 18, color = 'currentColor' }: { size?: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{ flexShrink: 0 }}>
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  )
}

const FEATURED_DROPDOWN_SLUGS = [
  'continuous-improvement',
  'kai-decision-intelligence',
  'kai-training-decision-models',
  'enso-adaptive-intelligence',
  'zen-model-engineering',
  'science-discovery',
  'agentic-cybersecurity',
  'build-your-ai-company',
]

export function Header() {
  const [grounded, setGrounded] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [programsOpen, setProgramsOpen] = useState(false)
  const pathname = usePathname()
  const dropdownRef = useRef<HTMLDivElement>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isPinnedRef = useRef(false)

  const closeMenu = () => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
    setProgramsOpen(false)
    isPinnedRef.current = false
  }

  useEffect(() => {
    closeMenu()
  }, [pathname])

  useEffect(() => {
    const handleScroll = () => setGrounded(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        closeMenu()
      }
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        closeMenu()
        setMobileOpen(false)
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
    if (!programsOpen) setProgramsOpen(true)
  }

  const handleMouseLeave = () => {
    if (isPinnedRef.current) return
    if (closeTimerRef.current) clearTimeout(closeTimerRef.current)
    closeTimerRef.current = setTimeout(() => {
      setProgramsOpen(false)
      isPinnedRef.current = false
    }, 350)
  }

  const handleToggleClick = (e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }

    if (!programsOpen) {
      setProgramsOpen(true)
      isPinnedRef.current = true
    } else if (!isPinnedRef.current) {
      isPinnedRef.current = true
    } else {
      closeMenu()
    }
  }

  const featuredCourses = FEATURED_DROPDOWN_SLUGS.map((s) => UNIVERSITY_COURSES.find((c) => c.slug === s)).filter(
    (c): c is NonNullable<typeof c> => Boolean(c)
  )

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
        px={14}
        $sm={{ px: 20 }}
        $md={{ px: 24 }}
        bg={grounded ? 'rgba(10, 10, 10, 0.94)' : 'rgba(10, 10, 10, 0.85)'}
        backdropFilter="blur(20px)"
        borderBottomWidth={1}
        borderColor="var(--border)"
        transition="quickest"
      >
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit', flexShrink: 1, minWidth: 0, overflow: 'hidden' }}>
          <XStack items="center" gap={8} minW={0}>
            <HanzoWordmark label="Hanzo University" size={20} />
          </XStack>
        </Link>

        {/* Desktop Nav Links */}
        <XStack items="center" gap={16} $lg={{ gap: 22 }} display="none" $md={{ display: 'flex' }}>
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
              <XStack items="center" gap={4} py={12} $platform-web={{ cursor: 'pointer' }}>
                <Text
                  fontSize="$2"
                  color={programsOpen ? 'var(--white)' : 'var(--muted-foreground)'}
                  fontWeight={programsOpen ? '600' : '400'}
                  hoverStyle={{ color: 'var(--white)' }}
                >
                  Schools &amp; Courses
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

            {programsOpen && (
              <div
                className="programs-dropdown-menu"
                style={{
                  position: 'absolute',
                  top: 'calc(100% - 2px)',
                  left: -180,
                  paddingTop: 8,
                  zIndex: 1001,
                }}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={handleMouseLeave}
              >
                <YStack
                  width={680}
                  p={18}
                  rounded="var(--radius-xl)"
                  bg="rgba(10, 10, 10, 0.98)"
                  backdropFilter="blur(24px)"
                  borderWidth={1}
                  borderColor="rgba(255, 255, 255, 0.1)"
                  gap={14}
                  $platform-web={{
                    boxShadow: '0 24px 48px rgba(0, 0, 0, 0.9), 0 0 1px rgba(255, 255, 255, 0.15)',
                  }}
                >
                  <XStack items="center" justify="space-between" px={6} pb={8} borderBottomWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
                    <Text fontSize="$1" fontWeight="700" color="rgba(255, 255, 255, 0.6)" fontFamily="$mono">
                      4 SCHOOLS · 25 COURSES · FREE FOUNDATION
                    </Text>
                    <Link
                      href="/#schools"
                      onClick={() => setTimeout(closeMenu, 60)}
                      style={{ textDecoration: 'none', color: 'var(--white)', fontSize: '12px', fontFamily: 'monospace' }}
                    >
                      View all 25 →
                    </Link>
                  </XStack>

                  {/* 4 Schools Quick Row */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
                    {SCHOOLS.filter((s) => s.id !== 'foundation').map((school) => {
                      const count = UNIVERSITY_COURSES.filter((c) => c.school === school.id).length
                      return (
                        <Link
                          key={school.id}
                          href={`/#schools`}
                          onClick={() => setTimeout(closeMenu, 60)}
                          style={{ textDecoration: 'none', color: 'inherit' }}
                        >
                          <YStack
                            p={10}
                            rounded="var(--radius-md)"
                            bg="rgba(255, 255, 255, 0.03)"
                            borderWidth={1}
                            borderColor="rgba(255, 255, 255, 0.07)"
                            hoverStyle={{ background: 'rgba(255, 255, 255, 0.07)' }}
                            gap={2}
                          >
                            <XStack items="center" justify="space-between">
                              <Text fontSize={12} fontWeight="700" color="var(--white)">
                                {school.name}
                              </Text>
                              <Text fontSize={11} fontFamily="$mono" color="rgba(255, 255, 255, 0.55)">
                                {count} courses
                              </Text>
                            </XStack>
                            <Text fontSize={11} color="var(--muted-foreground)" numberOfLines={1}>
                              {school.discipline}
                            </Text>
                          </YStack>
                        </Link>
                      )
                    })}
                  </div>

                  {/* Highlighted Entry Courses */}
                  <YStack gap={4}>
                    <Text fontSize={11} fontFamily="$mono" color="rgba(255, 255, 255, 0.5)" px={6}>
                      POPULAR STARTING COURSES
                    </Text>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px' }}>
                      {featuredCourses.map((c) => (
                        <Link
                          key={c.slug}
                          href={`/${c.slug}`}
                          onClick={() => setTimeout(closeMenu, 60)}
                          style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}
                        >
                          <XStack
                            items="center"
                            justify="space-between"
                            p={8}
                            rounded="var(--radius-md)"
                            hoverStyle={{ background: 'rgba(255, 255, 255, 0.06)' }}
                            gap={8}
                          >
                            <XStack items="center" gap={8} minW={0} flex={1}>
                              <View
                                px={6}
                                py={2}
                                rounded="var(--radius-sm)"
                                bg="var(--pure-black)"
                                borderWidth={1}
                                borderColor="rgba(255, 255, 255, 0.14)"
                              >
                                <Text fontSize={10} fontWeight="700" fontFamily="$mono" color="var(--white)">
                                  {c.code}
                                </Text>
                              </View>
                              <Text fontSize={12} fontWeight="600" color="var(--white)" numberOfLines={1}>
                                {c.title}
                              </Text>
                            </XStack>
                            <Text
                              fontSize={11}
                              fontFamily="$mono"
                              color={c.isFree ? 'var(--emerald-400)' : 'rgba(255, 255, 255, 0.6)'}
                            >
                              {c.isFree ? 'FREE' : `$${c.price}`}
                            </Text>
                          </XStack>
                        </Link>
                      ))}
                    </div>
                  </YStack>

                  <XStack
                    items="center"
                    justify="space-between"
                    pt={10}
                    px={6}
                    borderTopWidth={1}
                    borderColor="rgba(255, 255, 255, 0.08)"
                    flexWrap="wrap"
                    gap={10}
                  >
                    <Link href="/portal" onClick={() => setTimeout(closeMenu, 60)} style={{ textDecoration: 'none' }}>
                      <Text fontSize="$1" color="var(--white)" fontWeight="600">
                        Student Portal →
                      </Text>
                    </Link>
                    <a
                      href="https://hanzo.app/learn"
                      target="_blank"
                      rel="noreferrer"
                      onClick={() => setTimeout(closeMenu, 60)}
                      style={{ textDecoration: 'none' }}
                    >
                      <Text fontSize="$1" color="var(--emerald-400)" fontWeight="600">
                        Open Learning Workspace ↗
                      </Text>
                    </a>
                    <Link href="/verify" onClick={() => setTimeout(closeMenu, 60)} style={{ textDecoration: 'none' }}>
                      <Text fontSize="$1" color="var(--muted-foreground)" hoverStyle={{ color: 'var(--white)' }}>
                        Verify Credentials
                      </Text>
                    </Link>
                  </XStack>
                </YStack>
              </div>
            )}
          </div>

          <Link href="/#adventure" style={{ textDecoration: 'none' }}>
            <Text fontSize="$2" color="var(--muted-foreground)" hoverStyle={{ color: 'var(--white)' }}>
              Choose Your Path
            </Text>
          </Link>

          <Link href="/#certifications" style={{ textDecoration: 'none' }}>
            <Text fontSize="$2" color="var(--muted-foreground)" hoverStyle={{ color: 'var(--white)' }}>
              Certifications
            </Text>
          </Link>

          <Link href="/portal" style={{ textDecoration: 'none' }}>
            <Text fontSize="$2" color="var(--muted-foreground)" hoverStyle={{ color: 'var(--white)' }}>
              Student Portal
            </Text>
          </Link>

          <a
            href="https://docs.hanzo.ai/docs/guides"
            target="_blank"
            rel="noreferrer"
            className="hide-on-tablet"
            style={{ textDecoration: 'none' }}
          >
            <Text fontSize="$2" color="var(--muted-foreground)" hoverStyle={{ color: 'var(--white)' }}>
              Docs &amp; Guides ↗
            </Text>
          </a>

          <a
            href="https://hanzo.app/learn"
            target="_blank"
            rel="noreferrer"
            className="hide-on-tablet"
            style={{ textDecoration: 'none' }}
          >
            <Text fontSize="$2" color="var(--muted-foreground)" hoverStyle={{ color: 'var(--white)' }}>
              Workspace ↗
            </Text>
          </a>
        </XStack>

        {/* Action Buttons */}
        <XStack items="center" gap={8} $sm={{ gap: 12 }} style={{ flexShrink: 0 }}>
          <Link
            href="/portal"
            className="hide-on-mobile"
            style={{
              padding: '7px 12px',
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--white-70)',
              textDecoration: 'none',
            }}
          >
            Sign In
          </Link>
          <Link
            href="/continuous-improvement"
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
            Start Free →
          </Link>

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

      {/* Mobile Navigation Drawer */}
      {mobileOpen && (
        <YStack
          position="fixed"
          t={0}
          l={0}
          r={0}
          b={0}
          z={100}
          $platform-web={{ zIndex: 1100 }}
          bg="rgba(5, 7, 10, 0.98)"
          backdropFilter="blur(24px)"
          p={20}
          gap={16}
          overflowY="auto"
          className="drawer-enter"
          $md={{ display: 'none' }}
        >
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

          <YStack gap={6}>
            {[
              { href: '/', label: 'Home', icon: Home },
              { href: '/continuous-improvement', label: 'Start Free — AUTO 101', icon: Sparkles },
              { href: '/#adventure', label: 'Choose Your Path', icon: Compass },
              { href: '/#schools', label: 'All 25 Courses (4 Schools)', icon: BookOpen },
              { href: '/#certifications', label: '6 Certification Tracks', icon: Award },
              { href: '/portal', label: 'Student Portal', icon: Terminal },
              { href: '/verify', label: 'Verify Credentials', icon: ShieldCheck },
            ].map((item) => {
              const IconComp = item.icon
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  style={{
                    textDecoration: 'none',
                    width: '100%',
                    background: item.href === '/continuous-improvement' ? 'rgba(255, 255, 255, 0.09)' : 'transparent',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: '12px',
                    padding: '12px 14px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    color: 'var(--white)',
                    fontSize: '14px',
                    fontWeight: 500,
                    boxSizing: 'border-box',
                  }}
                >
                  <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <IconComp size={17} color="var(--white)" />
                    <span>{item.label}</span>
                  </span>
                  <ArrowRight size={14} color="rgba(255, 255, 255, 0.45)" />
                </Link>
              )
            })}
          </YStack>

          <YStack gap={8} pt={8} borderTopWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
            <a
              href="https://hanzo.app/learn"
              target="_blank"
              rel="noreferrer"
              onClick={() => setMobileOpen(false)}
              style={{
                textDecoration: 'none',
                width: '100%',
                background: 'var(--white)',
                color: 'var(--pure-black)',
                borderRadius: '999px',
                padding: '12px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '14px',
                fontWeight: 700,
                boxSizing: 'border-box',
              }}
            >
              <span>Open Learning Workspace</span>
              <ExternalLink size={15} />
            </a>
            <a
              href="https://docs.hanzo.ai/docs/guides"
              target="_blank"
              rel="noreferrer"
              onClick={() => setMobileOpen(false)}
              style={{
                textDecoration: 'none',
                width: '100%',
                background: 'rgba(255, 255, 255, 0.06)',
                color: 'var(--white)',
                borderRadius: '999px',
                padding: '11px 16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                fontSize: '13px',
                fontWeight: 500,
                boxSizing: 'border-box',
              }}
            >
              <span>Docs &amp; Guides (docs.hanzo.ai)</span>
              <ExternalLink size={14} />
            </a>
          </YStack>
        </YStack>
      )}
    </>
  )
}
