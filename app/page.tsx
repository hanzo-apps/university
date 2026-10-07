'use client'

import React, { useEffect, useState } from 'react'
import { Box } from '@/components/ui'
import { resolveStudentSession, syncBackendClassEnrollment, type StudentSession } from '@/lib/auth'
import Catalog from './Catalog'
import StudentHome from './StudentHome'

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

  return (
    <Box minH="100vh" bg="var(--pure-black)" $platform-web={{ color: 'var(--foreground)' }}>
      <Catalog session={session} />
    </Box>
  )
}
