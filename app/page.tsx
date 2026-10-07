'use client'

import React, { useEffect, useState } from 'react'
import { Box, Text, XStack, YStack } from '@/components/ui'
import { Band, Card } from '@/components/band'
import { Action, Title, Lede, Eyebrow } from '@hanzo/ui/marketing'
import { Grid } from '@hanzo/ui/grid'
import { resolveStudentSession, syncBackendClassEnrollment, type StudentSession } from '@/lib/auth'
import Catalog from './Catalog'
import StudentHome from './StudentHome'
import { SIGN_IN } from './funnel'

const STEPS = [
  { n: '1', title: 'Choose a class', body: 'Six tracks from agentic coding to systems engineering. Every syllabus is public.' },
  { n: '2', title: 'Enroll', body: 'Pay once. 25% of tuition lands in your Hanzo Cloud account as usage credit.' },
  { n: '3', title: 'Build and certify', body: 'Work in a Hanzo Visor sandbox. Pass the autograder and receive a verifiable credential.' },
]

/** Checkout records the course it settled; a handle and name alone are an account, not a purchase. */
const settled = (): boolean => {
  try {
    return Boolean(localStorage.getItem('hanzo_portal_selected_course') || localStorage.getItem('hanzo_portal_enrolled_courses'))
  } catch {
    return false
  }
}

/** A student has paid when a class is enrolled: by plan, by token claim, or by a settled checkout. */
const paid = (s: StudentSession): boolean =>
  Boolean(s.isAuthenticated && (s.isFullAccess || (s.enrolledClasses.length > 0 && (s.source !== 'checkout' || settled()))))

export default function UniversityHomePage() {
  const [session, setSession] = useState<StudentSession | null>(null)

  useEffect(() => {
    const local = resolveStudentSession()
    setSession(local)
    if (!local?.token) return
    let live = true
    void syncBackendClassEnrollment(local).then((r) => {
      if (live && r.status !== 'unauthorized') setSession({ ...local, enrolledClasses: r.enrolledSlugs })
    })
    return () => {
      live = false
    }
  }, [])

  if (session && paid(session)) return <StudentHome name={session.name} handle={session.handle} />

  const signedIn = Boolean(session?.isAuthenticated)

  return (
    <Box minH="100vh" bg="var(--pure-black)" $platform-web={{ color: 'var(--foreground)' }}>
      <Band pad={96} measure={960} rule={false}>
        <YStack items="center" gap={20} $platform-web={{ textAlign: 'center' }}>
          <Eyebrow>Hanzo University</Eyebrow>
          <Title quiet={false}>Frontier AI engineering, taught on real systems.</Title>
          <Lede>
            Hands-on classes in agentic coding, reinforcement learning and systems engineering. Build in a
            sandbox, pass the autograder, and earn a credential anyone can verify.
          </Lede>
          <XStack justify="center" gap={12} mt={12} flexWrap="wrap">
            <Action href="#curriculum" fill>
              Choose a class
            </Action>
            {signedIn ? null : <Action href={SIGN_IN}>Sign in</Action>}
          </XStack>
          {signedIn ? (
            <Text fontSize={14} color="rgba(255, 255, 255, 0.6)">
              Signed in as {session?.name}. Pick a class to start.
            </Text>
          ) : (
            <Text fontSize={14} color="rgba(255, 255, 255, 0.6)">
              Already enrolled? Sign in to open your classes.
            </Text>
          )}
        </YStack>
      </Band>

      <Band pad={48} measure={1100} rule={true}>
        <Grid columns={{ min: 240, max: 3 }} gap={16}>
          {STEPS.map((s) => (
            <Card key={s.n} p={24}>
              <YStack gap={8}>
                <Text fontSize={12} fontWeight="700" color="rgba(255, 255, 255, 0.5)">
                  {s.n}
                </Text>
                <Text fontSize={18} fontWeight="700" color="var(--white)">
                  {s.title}
                </Text>
                <Text fontSize={14} color="rgba(255, 255, 255, 0.65)" lineHeight={22}>
                  {s.body}
                </Text>
              </YStack>
            </Card>
          ))}
        </Grid>
      </Band>

      <Catalog />
    </Box>
  )
}
