'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
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
} from 'lucide-react'
import { UNIVERSITY_COURSES } from '../courses-data'

export function Header() {
  const [grounded, setGrounded] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)
  const [programsOpen, setProgramsOpen] = useState(false)

  useEffect(() => {
    const handleScroll = () => setGrounded(window.scrollY > 10)
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return (
    <>
      <XStack
        render="header"
        position="sticky"
        t={0}
        z={50}
        items="center"
        justify="space-between"
        height={64}
        px={24}
        bg={grounded ? 'rgba(10, 10, 10, 0.92)' : 'rgba(10, 10, 10, 0.75)'}
        backdropFilter="blur(20px)"
        borderBottomWidth={1}
        borderColor="var(--border)"
        transition="quickest"
      >
        {/* Brand Link */}
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <XStack items="center" gap={10}>
            <HanzoWordmark label="Hanzo University" size={22} />
          </XStack>
        </Link>

        {/* Desktop Nav Links */}
        <XStack items="center" gap={24} display="none" $md={{ display: 'flex' }}>
          {/* Programs Dropdown Trigger */}
          <View
            position="relative"
            onPointerEnter={() => setProgramsOpen(true)}
            onPointerLeave={() => setProgramsOpen(false)}
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
                  transition: 'transform 0.15s ease',
                }}
              />
            </XStack>

            {/* Programs Floating Dropdown Menu */}
            {programsOpen && (
              <YStack
                position="absolute"
                t="100%"
                l={-140}
                width={560}
                p={16}
                rounded="var(--radius-xl)"
                bg="rgba(14, 14, 14, 0.98)"
                backdropFilter="blur(24px)"
                borderWidth={1}
                borderColor="var(--border)"
                gap={12}
                $platform-web={{
                  boxShadow: '0 20px 48px rgba(0, 0, 0, 0.8), 0 0 1px rgba(255, 255, 255, 0.2)',
                  zIndex: 100,
                }}
              >
                <XStack items="center" justify="space-between" px={8} pb={6} borderBottomWidth={1} borderColor="var(--border)">
                  <Text fontSize="$1" fontWeight="700" color="var(--white-70)" fontFamily="$mono">
                    6 CERTIFICATION TRACKS
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
                      onClick={() => setProgramsOpen(false)}
                      style={{ textDecoration: 'none', color: 'inherit' }}
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
                            borderColor="var(--border)"
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
                          <Text fontSize="$1" color="var(--white-70)" fontFamily="$mono">
                            ${c.price}
                          </Text>
                          <ArrowRight size={13} color="var(--muted-foreground)" />
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
                  borderColor="var(--border)"
                >
                  <Link
                    href="/portal"
                    onClick={() => setProgramsOpen(false)}
                    style={{ textDecoration: 'none' }}
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
                    style={{ textDecoration: 'none' }}
                  >
                    <XStack items="center" gap={4}>
                      <Text fontSize="$1" color="var(--muted-foreground)" hoverStyle={{ color: 'var(--white)' }}>
                        Kai Decision Models ↗
                      </Text>
                    </XStack>
                  </a>

                  <Link
                    href="/#credentials"
                    onClick={() => setProgramsOpen(false)}
                    style={{ textDecoration: 'none' }}
                  >
                    <Text fontSize="$1" color="var(--muted-foreground)" hoverStyle={{ color: 'var(--white)' }}>
                      W3C Standards
                    </Text>
                  </Link>
                </XStack>
              </YStack>
            )}
          </View>

          <Link href="/#comparison" style={{ textDecoration: 'none' }}>
            <Text fontSize="$2" color="var(--muted-foreground)" hoverStyle={{ color: 'var(--white)' }}>
              Comparison
            </Text>
          </Link>

          <Link href="/portal" style={{ textDecoration: 'none' }}>
            <XStack items="center" gap={6}>
              <Text fontSize="$2" color="var(--white)" fontWeight="500">
                Student Portal
              </Text>
              <View width={6} height={6} rounded={999} bg="var(--emerald-400)" />
            </XStack>
          </Link>

          <a
            href="https://hanzo.ai/blog/kai-decision-models"
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <Text fontSize="$2" color="var(--muted-foreground)" hoverStyle={{ color: 'var(--white)' }}>
              Research & Blog ↗
            </Text>
          </a>

          <a href="https://hanzo.ai" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
            <Text fontSize="$2" color="var(--muted-foreground)" hoverStyle={{ color: 'var(--white)' }}>
              Hanzo Cloud ↗
            </Text>
          </a>
        </XStack>

        {/* Action Buttons */}
        <XStack items="center" gap={12}>
          <Link
            href="/portal"
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

          {/* Mobile Toggle */}
          <View
            render="button"
            display="flex"
            $md={{ display: 'none' }}
            onClick={() => setMobileOpen(!mobileOpen)}
            p={6}
            bg="transparent"
            borderWidth={0}
            $platform-web={{ cursor: 'pointer' }}
          >
            {mobileOpen ? <X size={20} color="var(--white)" /> : <MenuIcon size={20} color="var(--white)" />}
          </View>
        </XStack>
      </XStack>

      {/* Mobile Menu Sheet */}
      {mobileOpen && (
        <YStack
          position="fixed"
          t={64}
          l={0}
          r={0}
          b={0}
          z={49}
          bg="rgba(10, 10, 10, 0.98)"
          p={24}
          gap={18}
          overflow="scroll"
          $md={{ display: 'none' }}
        >
          <Link href="/portal" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none' }}>
            <XStack items="center" justify="space-between" p={12} rounded="var(--radius-lg)" bg="var(--pure-black)" borderWidth={1} borderColor="var(--emerald-850)">
              <YStack gap={2}>
                <Text fontSize="$3" color="var(--emerald-400)" fontWeight="700">
                  Student Learning Portal →
                </Text>
                <Text fontSize="$1" color="var(--muted-foreground)">
                  gVisor sandboxes, SWE-bench autograder, AST diff
                </Text>
              </YStack>
            </XStack>
          </Link>

          <Text fontSize="$1" fontWeight="700" color="var(--muted-foreground)" fontFamily="$mono" pt={6}>
            COURSES & CREDENTIALS
          </Text>

          {UNIVERSITY_COURSES.map((c) => (
            <Link
              key={c.slug}
              href={`/${c.slug}`}
              onClick={() => setMobileOpen(false)}
              style={{ textDecoration: 'none' }}
            >
              <XStack items="center" justify="space-between" py={6}>
                <YStack gap={2}>
                  <Text fontSize="$3" color="var(--white)" fontWeight="600">
                    {c.code} · {c.title}
                  </Text>
                  <Text fontSize="$1" color="var(--muted-foreground)">
                    {c.credential} · ${c.price} (+${c.rebateCredits} compute rebate)
                  </Text>
                </YStack>
                <ChevronDown size={14} color="var(--muted-foreground)" style={{ transform: 'rotate(-90deg)' }} />
              </XStack>
            </Link>
          ))}

          <Box height={1} bg="var(--border)" my={6} />

          <Link href="/#comparison" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none' }}>
            <Text fontSize="$3" color="var(--white)">
              Market Comparison
            </Text>
          </Link>
          <a
            href="https://hanzo.ai/blog/kai-decision-models"
            target="_blank"
            rel="noreferrer"
            style={{ textDecoration: 'none' }}
          >
            <Text fontSize="$3" color="var(--white)">
              Kai & Decision Models Research ↗
            </Text>
          </a>
          <Link href="/#fellowships" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none' }}>
            <Text fontSize="$3" color="var(--white)">
              Compute Rebate Fellowships
            </Text>
          </Link>
          <Link href="/#credentials" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none' }}>
            <Text fontSize="$3" color="var(--white)">
              W3C Credentials & Standards
            </Text>
          </Link>
        </YStack>
      )}
    </>
  )
}
