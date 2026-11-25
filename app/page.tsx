'use client'

import React, { useEffect, useState } from 'react'
import { Box } from '@hanzo/ui'
import {
  resolveStudentSession,
  signOutStudent,
  syncBackendClassEnrollment,
  type StudentSession,
} from '@/lib/auth'
import Catalog from './Catalog'

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

  const handleSignOut = () => {
    signOutStudent()
    setSession(null)
  }

  return (
    <Box minH="100vh" bg="var(--pure-black)" $platform-web={{ color: 'var(--foreground)' }}>
      <Catalog session={session} onSignOut={handleSignOut} />
    </Box>
  )
}
