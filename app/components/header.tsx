'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Text, View, XStack, YStack } from '@hanzo/ui'
import { HanzoWordmark, MARKS } from '@hanzogui/shell'
import { Award, GraduationCap, ChevronRight, Menu as MenuIcon, X } from 'lucide-react'

export function Header() {
  const [grounded, setGrounded] = useState(false)
  const [mobileOpen, setMobileOpen] = useState(false)

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
        bg={grounded ? 'rgba(10, 10, 10, 0.85)' : 'transparent'}
        backdropFilter={grounded ? 'blur(16px)' : 'none'}
        borderBottomWidth={grounded ? 1 : 0}
        borderColor="var(--border)"
        transition="quickest"
      >
        {/* Brand Link */}
        <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
          <XStack items="center" gap={10}>
            <HanzoWordmark label="Hanzo University" size={22} />
            <XStack
              items="center"
              gap={4}
              px={8}
              py={2}
              rounded={999}
              bg="var(--pure-black)"
              borderWidth={1}
              borderColor="var(--border)"
            >
              <GraduationCap size={13} color="var(--emerald-400)" />
              <Text fontSize="$1" fontWeight="600" color="var(--emerald-400)" fontFamily="$mono">
                ACCREDITED
              </Text>
            </XStack>
          </XStack>
        </Link>

        {/* Desktop Nav Links */}
        <XStack items="center" gap={20} display="none" $md={{ display: 'flex' }}>
          <Link href="/#curriculum" style={{ textDecoration: 'none' }}>
            <Text fontSize="$2" color="var(--muted-foreground)" hoverStyle={{ color: 'var(--white)' }}>
              Programs & Degrees
            </Text>
          </Link>
          <Link href="/#comparison" style={{ textDecoration: 'none' }}>
            <Text fontSize="$2" color="var(--muted-foreground)" hoverStyle={{ color: 'var(--white)' }}>
              Comparison
            </Text>
          </Link>
          <Link href="/portal" style={{ textDecoration: 'none' }}>
            <XStack items="center" gap={4}>
              <Text fontSize="$2" color="var(--white)" fontWeight="500">
                Student Portal
              </Text>
              <View width={6} height={6} rounded={999} bg="var(--emerald-400)" />
            </XStack>
          </Link>
          <a href="https://hanzo.ai" target="_blank" rel="noreferrer" style={{ textDecoration: 'none' }}>
            <Text fontSize="$2" color="var(--muted-foreground)" hoverStyle={{ color: 'var(--white)' }}>
              Hanzo Cloud ↗
            </Text>
          </a>
        </XStack>

        {/* Action Buttons */}
        <XStack items="center" gap={12}>
          <a
            href="https://hanzo.ai/login?next=https%3A%2F%2Fhanzo.university%2Fportal"
            style={{
              display: 'none',
              padding: '7px 14px',
              fontSize: '13px',
              fontWeight: 500,
              color: 'var(--white)',
              textDecoration: 'none',
            }}
            className="desktop-login"
          >
            Log in
          </a>
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
          gap={20}
          $md={{ display: 'none' }}
        >
          <Link href="/#curriculum" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none' }}>
            <Text fontSize="$4" color="var(--white)">
              Programs & Degrees
            </Text>
          </Link>
          <Link href="/#comparison" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none' }}>
            <Text fontSize="$4" color="var(--white)">
              Market Comparison
            </Text>
          </Link>
          <Link href="/portal" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none' }}>
            <Text fontSize="$4" color="var(--emerald-400)" fontWeight="600">
              Student Learning Portal →
            </Text>
          </Link>
          <Link href="/#fellowships" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none' }}>
            <Text fontSize="$4" color="var(--white)">
              Compute Rebate Fellowships
            </Text>
          </Link>
          <Link href="/#accreditation" onClick={() => setMobileOpen(false)} style={{ textDecoration: 'none' }}>
            <Text fontSize="$4" color="var(--white)">
              W3C Credentials & Accreditation
            </Text>
          </Link>
          <a
            href="https://hanzo.ai/login?next=https%3A%2F%2Fhanzo.university%2Fportal"
            style={{ textDecoration: 'none', color: 'var(--white)', fontSize: '16px' }}
          >
            Student Log In
          </a>
        </YStack>
      )}
    </>
  )
}
