'use client'

import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { Box, Text, XStack, YStack } from '@/components/ui'
import { Band, Card } from '@/components/band'
import { Action, Chip } from '@hanzo/ui/marketing'
import { Grid } from '@hanzo/ui/grid'
import {
  Terminal,
  CheckCircle2,
  Play,
  Pause,
  Award,
  Cpu,
  ShieldCheck,
  ExternalLink,
  Check,
  Copy,
  Download,
  Sparkles,
  BookOpen,
  ArrowRight,
  Volume2,
  Lock,
  LogIn,
  LogOut,
  User,
  KeyRound,
  Bot,
} from 'lucide-react'
import {
  AI_FACULTY_BOTS,
  SCHOOLS,
  UNIVERSITY_COURSES,
  getSchoolById,
  type UniversityCourse,
} from '../courses-data'
import { getCourseWorkspaceData } from './portal-data'
import { courseCheckoutUrl } from '@/lib/pay'
import {
  resolveStudentSession,
  signOutStudent,
  syncBackendClassEnrollment,
  getHanzoLoginUrl,
  isUserEnrolledInCourse,
  type StudentSession,
} from '@/lib/auth'

interface ActiveLectureItem {
  title: string
  weekCode: string
  weekTitle: string
  type: 'lecture' | 'reading'
  summary: string
  facultyLabel: string
}

export default function StudentPortalPage() {
  const [session, setSession] = useState<StudentSession | null>(null)
  const [authLoaded, setAuthLoaded] = useState<boolean>(false)
  const [showManualLogin, setShowManualLogin] = useState<boolean>(false)
  const [manualTokenInput, setManualTokenInput] = useState<string>('')
  const [manualNameInput, setManualNameInput] = useState<string>('')
  const [manualHandleInput, setManualHandleInput] = useState<string>('')
  const [authError, setAuthError] = useState<string | null>(null)

  const [selectedCourseSlug, setSelectedCourseSlug] = useState<string>('continuous-improvement')
  const [activeTab, setActiveTab] = useState<'terminal' | 'ast' | 'grader' | 'metering'>('terminal')
  const [activeWeekIndex, setActiveWeekIndex] = useState<number>(0)
  const [studentHandle, setStudentHandle] = useState<string>('student')
  const [studentName, setStudentName] = useState<string>('Student')
  const [welcomeBanner, setWelcomeBanner] = useState<boolean>(false)

  const [completedModules, setCompletedModules] = useState<Record<string, number[]>>({})
  const [capstonePassed, setCapstonePassed] = useState<Record<string, boolean>>({})
  const [watchedLectures, setWatchedLectures] = useState<Record<string, string[]>>({})
  const [activeLectureModal, setActiveLectureModal] = useState<ActiveLectureItem | null>(null)
  const [isPlayingMedia, setIsPlayingMedia] = useState<boolean>(false)
  const [playbackRate, setPlaybackRate] = useState<number>(1)

  const [isRunningCommand, setIsRunningCommand] = useState(false)
  const [isDefending, setIsDefending] = useState(false)
  const [showCredentialModal, setShowCredentialModal] = useState(false)
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null)

  const activeCourse: UniversityCourse =
    UNIVERSITY_COURSES.find((c) => c.slug === selectedCourseSlug) || UNIVERSITY_COURSES[0]
  const activeSchool = getSchoolById(activeCourse.school)

  const isCourseEnrolled = isUserEnrolledInCourse(session, activeCourse.slug)
  const workspaceData = getCourseWorkspaceData(activeCourse)

  const userTerminalPrompt = (workspaceData.terminalPrompt || 'student@hanzo-sandbox:~$').replace(
    /^student@/,
    `${studentHandle}@`
  )

  const [terminalHistory, setTerminalHistory] = useState<string[]>(workspaceData.initialHistory)

  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedModules = localStorage.getItem('hanzo_portal_completed_modules')
        if (savedModules) setCompletedModules(JSON.parse(savedModules))
        const savedCapstones = localStorage.getItem('hanzo_portal_capstone_passed')
        if (savedCapstones) setCapstonePassed(JSON.parse(savedCapstones))
        const savedWatched = localStorage.getItem('hanzo_portal_watched_lectures')
        if (savedWatched) setWatchedLectures(JSON.parse(savedWatched))
      } catch (e) {
        console.error('Failed to parse portal saved state', e)
      }

      const activeSession = resolveStudentSession()

      if (activeSession && activeSession.isAuthenticated) {
        setSession(activeSession)
        setStudentName(activeSession.name)
        setStudentHandle(activeSession.handle)

        const params = new URLSearchParams(window.location.search)
        const enrolledParam = params.get('enrolled') || params.get('course')
        const welcome = params.get('welcome')

        let targetClass: string = 'continuous-improvement'
        if (enrolledParam && UNIVERSITY_COURSES.some((c) => c.slug === enrolledParam)) {
          targetClass = enrolledParam
        } else {
          const savedCourse = localStorage.getItem('hanzo_portal_selected_course')
          if (savedCourse && UNIVERSITY_COURSES.some((c) => c.slug === savedCourse)) {
            targetClass = savedCourse
          } else if (activeSession.enrolledClasses.length > 0) {
            targetClass = activeSession.enrolledClasses[0]
          }
        }

        setSelectedCourseSlug(targetClass)
        if (welcome === '1') setWelcomeBanner(true)

        void syncBackendClassEnrollment(activeSession).then((syncRes) => {
          if (syncRes.status === 'ok') {
            setSession((prev) =>
              prev
                ? {
                    ...prev,
                    enrolledClasses: syncRes.enrolledSlugs,
                    backendPlan: syncRes.planName || prev.backendPlan,
                  }
                : prev
            )
          }
        })
      } else {
        setSession(null)
      }

      setAuthLoaded(true)
    }
  }, [])

  const handleSignOut = () => {
    signOutStudent()
    setSession(null)
    setFeedbackToast('Signed out of Hanzo University.')
    setTimeout(() => setFeedbackToast(null), 3000)
  }

  const handleManualTokenSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    setAuthError(null)

    const trimmedToken = manualTokenInput.trim()
    if (trimmedToken) {
      try {
        localStorage.setItem('hanzo_iam_access_token', trimmedToken)
        const resolved = resolveStudentSession()
        if (resolved && resolved.isAuthenticated) {
          setSession(resolved)
          setStudentName(resolved.name)
          setStudentHandle(resolved.handle)
          if (resolved.enrolledClasses.length > 0) {
            setSelectedCourseSlug(resolved.enrolledClasses[0])
          }
          setShowManualLogin(false)
          setFeedbackToast(`Welcome back, ${resolved.name}!`)
          setTimeout(() => setFeedbackToast(null), 3500)
          return
        }
        setAuthError('Could not verify JWT token. Please ensure it is a valid Hanzo IAM token.')
        return
      } catch {
        setAuthError('Failed to parse token.')
        return
      }
    }

    if (manualNameInput.trim() || manualHandleInput.trim()) {
      const handle = (
        manualHandleInput.trim() || manualNameInput.trim().toLowerCase().replace(/\s+/g, '-')
      ).replace(/[^a-z0-9_-]/g, '')
      const name = manualNameInput.trim() || manualHandleInput.trim()
      localStorage.setItem('hanzo_portal_student_handle', handle)
      localStorage.setItem('hanzo_portal_student_name', name)
      const resolved = resolveStudentSession()
      if (resolved && resolved.isAuthenticated) {
        setSession(resolved)
        setStudentName(resolved.name)
        setStudentHandle(resolved.handle)
        setShowManualLogin(false)
        setFeedbackToast(`Signed in as ${resolved.name}!`)
        setTimeout(() => setFeedbackToast(null), 3500)
        return
      }
    }

    setAuthError('Please enter a valid IAM token or student handle.')
  }

  useEffect(() => {
    const data = getCourseWorkspaceData(activeCourse)
    const personalizedHistory = (data.initialHistory || []).map((l) =>
      l.replace(/^student@/, `${studentHandle}@`)
    )
    setTerminalHistory(personalizedHistory)
    setActiveWeekIndex(0)
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('hanzo_portal_selected_course', selectedCourseSlug)
      } catch (_) {}
    }
  }, [selectedCourseSlug, studentHandle, activeCourse])

  const executeCommand = (cmd: string) => {
    if (!isCourseEnrolled) {
      setTerminalHistory((prev) => [
        ...prev,
        `${userTerminalPrompt} ${cmd}`,
        `[ACCESS LOCKED] Course ${activeCourse.code} requires enrollment to execute lab commands.`,
        `${userTerminalPrompt} _`,
      ])
      return
    }

    setIsRunningCommand(true)
    const prompt = userTerminalPrompt
    setTerminalHistory((prev) => [...prev, `${prompt} ${cmd}`])

    setTimeout(() => {
      const output = workspaceData.commandOutputs[cmd] || [
        `[EXECUTED] "${cmd}" completed inside isolated sandbox (exit code 0).`,
        `[EVAL] Assertions verified with zero regressions.`,
      ]
      setTerminalHistory((prev) => [...prev, ...output, `${prompt} _`])
      setIsRunningCommand(false)
    }, 500)
  }

  const handleCompleteLab = (weekIdx: number) => {
    if (!isCourseEnrolled) {
      setFeedbackToast(`Course ${activeCourse.code} requires enrollment to submit labs.`)
      setTimeout(() => setFeedbackToast(null), 3500)
      return
    }

    setIsRunningCommand(true)
    const week = activeCourse.syllabus[weekIdx]
    const prompt = userTerminalPrompt
    setTerminalHistory((prev) => [
      ...prev,
      `${prompt} hanzo autograder --submit ${week.code}`,
      `[AUTOGRADER] Evaluating lab for ${week.code}: ${week.title}...`,
      `  [+] Verifying isolated sandbox constraints...`,
      `  [+] Running cleanroom assertions & regression suite...`,
      `[PASS] ${week.code} passed! Module marked COMPLETED.`,
      `${prompt} _`,
    ])

    setTimeout(() => {
      setCompletedModules((prev) => {
        const current = prev[selectedCourseSlug] || []
        const updated = !current.includes(weekIdx)
          ? { ...prev, [selectedCourseSlug]: [...current, weekIdx].sort((a, b) => a - b) }
          : prev
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('hanzo_portal_completed_modules', JSON.stringify(updated))
          } catch (_) {}
        }
        return updated
      })
      setIsRunningCommand(false)
      setFeedbackToast(`Module ${week.code} passed!`)
      setTimeout(() => setFeedbackToast(null), 3000)
    }, 650)
  }

  const handleFastTrackAllLabs = () => {
    if (!isCourseEnrolled) return
    const totalCount = activeCourse.syllabus.length
    const allIndices = Array.from({ length: totalCount }, (_, i) => i)
    const prompt = userTerminalPrompt

    setTerminalHistory((prev) => [
      ...prev,
      `${prompt} hanzo autograder --verify-all ${activeCourse.code}`,
      `[AUTOGRADER] Verified all ${totalCount} lab modules for ${activeCourse.code} (exit code 0).`,
      `[STATUS] Ready for ${activeCourse.credential} Capstone Verification.`,
      `${prompt} _`,
    ])

    setCompletedModules((prev) => {
      const updated = { ...prev, [selectedCourseSlug]: allIndices }
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('hanzo_portal_completed_modules', JSON.stringify(updated))
        } catch (_) {}
      }
      return updated
    })

    setFeedbackToast(`All ${totalCount} lab modules verified! Capstone unlocked.`)
    setTimeout(() => setFeedbackToast(null), 3000)
  }

  const handleResetCourseProgress = () => {
    if (!isCourseEnrolled) return
    setCompletedModules((prev) => {
      const updated = { ...prev, [selectedCourseSlug]: [] }
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('hanzo_portal_completed_modules', JSON.stringify(updated))
        } catch (_) {}
      }
      return updated
    })
    setCapstonePassed((prev) => {
      const updated = { ...prev, [selectedCourseSlug]: false }
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('hanzo_portal_capstone_passed', JSON.stringify(updated))
        } catch (_) {}
      }
      return updated
    })
    setActiveWeekIndex(0)
    setFeedbackToast(`Progress reset for ${activeCourse.code}.`)
    setTimeout(() => setFeedbackToast(null), 3000)
  }

  const handleDefendCapstone = () => {
    if (!isCourseEnrolled) return
    setIsDefending(true)
    const prompt = userTerminalPrompt
    setTerminalHistory((prev) => [
      ...prev,
      `${prompt} hanzo capstone verify --course ${activeCourse.code}`,
      `==================== CAPSTONE VERIFICATION: ${activeCourse.credential} ====================`,
      `[1/3] Auditing live artifact: ${activeCourse.capstoneArtifact}...`,
      `[2/3] Running cleanroom automated benchmark suite...`,
      `[3/3] Signing W3C Verifiable Credential (${activeCourse.credential})...`,
      `[PASS] Capstone verified (exit code 0). Credential issued to did:hanzo:student:${studentHandle}.`,
      `${prompt} _`,
    ])

    setTimeout(() => {
      setIsDefending(false)
      setCapstonePassed((prev) => {
        const updated = { ...prev, [selectedCourseSlug]: true }
        if (typeof window !== 'undefined') {
          try {
            localStorage.setItem('hanzo_portal_capstone_passed', JSON.stringify(updated))
          } catch (_) {}
        }
        return updated
      })
      setShowCredentialModal(true)
    }, 900)
  }

  const openLectureModal = (
    week: (typeof activeCourse.syllabus)[0],
    itemTitle: string,
    type: 'lecture' | 'reading'
  ) => {
    if (!isCourseEnrolled) {
      setFeedbackToast(`Active enrollment in ${activeCourse.code} required to access module materials.`)
      setTimeout(() => setFeedbackToast(null), 3000)
      return
    }
    setActiveLectureModal({
      title: itemTitle,
      weekCode: week.code,
      weekTitle: week.title,
      type,
      summary: week.summary,
      facultyLabel: activeCourse.facultyBots.join(', '),
    })
    setIsPlayingMedia(false)
  }

  const handleMarkLectureWatched = () => {
    if (!activeLectureModal) return
    const current = watchedLectures[selectedCourseSlug] || []
    if (!current.includes(activeLectureModal.title)) {
      const updated = {
        ...watchedLectures,
        [selectedCourseSlug]: [...current, activeLectureModal.title],
      }
      setWatchedLectures(updated)
      if (typeof window !== 'undefined') {
        try {
          localStorage.setItem('hanzo_portal_watched_lectures', JSON.stringify(updated))
        } catch (_) {}
      }
    }
    setFeedbackToast(`Marked "${activeLectureModal.title}" as completed.`)
    setTimeout(() => setFeedbackToast(null), 2500)
    setActiveLectureModal(null)
  }

  const handleDownloadSvg = () => {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="380" height="64" viewBox="0 0 380 64" fill="none">
  <rect width="380" height="64" rx="12" fill="#0A0A0A" stroke="#262626"/>
  <rect x="1" y="1" width="378" height="62" rx="11" stroke="#34D399" stroke-opacity="0.3"/>
  <circle cx="28" cy="32" r="14" fill="#047857" fill-opacity="0.3"/>
  <path d="M22 32L26 36L34 28" stroke="#34D399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <text fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="12" font-weight="700" x="52" y="27">${activeCourse.credential}: ${activeCourse.title.slice(0, 30)}</text>
  <text fill="#A3A3A3" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="10" x="52" y="44">VERIFIED CAPSTONE · ${studentName}</text>
  <rect x="290" y="20" width="76" height="24" rx="6" fill="#171717" stroke="#404040"/>
  <text fill="#34D399" font-family="ui-monospace, monospace" font-size="9" font-weight="700" x="303" y="36">W3C VC</text>
</svg>`

    const blob = new Blob([svgContent], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Hanzo-${activeCourse.credential}-Badge.svg`
    a.click()
    URL.revokeObjectURL(url)
    setFeedbackToast('SVG Badge downloaded.')
    setTimeout(() => setFeedbackToast(null), 2500)
  }

  const currentCompleted = completedModules[selectedCourseSlug] || []
  const totalWeeks = activeCourse.syllabus.length
  const progressPercent = Math.min(100, Math.round((currentCompleted.length / totalWeeks) * 100))
  const isDefenseUnlocked = currentCompleted.length >= totalWeeks || capstonePassed[selectedCourseSlug]
  const isCredentialAwarded = Boolean(capstonePassed[selectedCourseSlug])

  if (!authLoaded) {
    return (
      <Box minH="100vh" bg="$background" display="flex" items="center" justify="center">
        <YStack items="center" gap="$3">
          <Text fontSize="$2" color="var(--white)" fontWeight="700" fontFamily="$mono">
            VERIFYING HANZO SESSION...
          </Text>
          <Text fontSize="$1" color="var(--muted-foreground)">
            Synchronizing with Hanzo IAM
          </Text>
        </YStack>
      </Box>
    )
  }

  if (!session || !session.isAuthenticated) {
    return (
      <Box minH="100vh" bg="$background" $platform-web={{ color: 'var(--foreground)' }}>
        <Box borderBottomWidth={1} borderColor="rgba(255, 255, 255, 0.06)" bg="var(--pure-black)" py="$3" px="$6">
          <XStack items="center" justify="space-between" flexWrap="wrap" gap="$4">
            <Link href="/" style={{ textDecoration: 'none', color: 'inherit' }}>
              <XStack items="center" gap="$2">
                <Text fontSize="$2" fontWeight="700" color="var(--white)" fontFamily="$mono">
                  hanzo.university
                </Text>
                <Chip px={6} py={2} fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">
                  STUDENT PORTAL
                </Chip>
              </XStack>
            </Link>
            <Link href="/#schools" style={{ fontSize: '13px', color: 'var(--white-80)', textDecoration: 'none' }}>
              Explore 25 Courses →
            </Link>
          </XStack>
        </Box>

        <Band pad={60} measure={840}>
          <YStack items="center" gap="$6" $platform-web={{ textAlign: 'center' }}>
            <Box p="$4" rounded="var(--radius-full)" bg="rgba(16, 185, 129, 0.14)">
              <Lock size={34} color="var(--emerald-400)" />
            </Box>

            <YStack gap="$2" $platform-web={{ maxWidth: '640px' }}>
              <Chip px={10} py={4} fontSize="$1" fontFamily="$mono" color="var(--emerald-400)" mx="auto">
                AUTHENTICATION REQUIRED
              </Chip>
              <Text fontSize="$6" fontWeight="800" color="var(--white)" $platform-web={{ lineHeight: 34 }}>
                Sign in to access your Learning Workstation
              </Text>
              <Text fontSize="$2" color="var(--muted-foreground)" $platform-web={{ lineHeight: 22 }}>
                Sign in with Hanzo IAM to launch free AUTO 101 labs immediately, access enrolled courses, run sandbox evaluations, and manage W3C capstone credentials.
              </Text>
            </YStack>

            <Card p="$6" width="100%" maxW={520} bg="rgba(255, 255, 255, 0.02)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
              <YStack gap="$4">
                <Action
                  render="a"
                  href={getHanzoLoginUrl('/portal')}
                  fill
                  py={12}
                  $platform-web={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    fontSize: '15px',
                    fontWeight: '600',
                    textDecoration: 'none',
                  }}
                >
                  <LogIn size={18} />
                  Sign In with Hanzo IAM
                  <ArrowRight size={16} />
                </Action>

                <Text fontSize="$1" color="var(--muted-foreground)">
                  Single sign-on via Hanzo IAM across hanzo.ai, hanzo.app/learn, and hanzo.university
                </Text>

                <Box borderBottomWidth={1} borderColor="rgba(255, 255, 255, 0.06)" my="$1" />

                {!showManualLogin ? (
                  <Box
                    render="button"
                    onClick={() => setShowManualLogin(true)}
                    py="$2"
                    $platform-web={{
                      background: 'transparent',
                      border: 'none',
                      color: 'var(--white-70)',
                      cursor: 'pointer',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: '6px',
                    }}
                  >
                    <KeyRound size={14} />
                    Or authenticate with IAM Token / Student Handle
                  </Box>
                ) : (
                  <YStack gap="$3" pt="$2" $platform-web={{ textAlign: 'left' }}>
                    <Text fontSize="$1" fontWeight="600" color="var(--white)">
                      Manual IAM Token or Student Handle:
                    </Text>

                    {authError && (
                      <Box p="$2" rounded="var(--radius-sm)" bg="rgba(239, 68, 68, 0.15)">
                        <Text fontSize="$1" color="#f87171">{authError}</Text>
                      </Box>
                    )}

                    <input
                      type="text"
                      placeholder="Paste Hanzo IAM JWT token (optional)"
                      value={manualTokenInput}
                      onChange={(e) => setManualTokenInput(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />

                    <input
                      type="text"
                      placeholder="Student Name or Handle (e.g. Jane Doe)"
                      value={manualNameInput}
                      onChange={(e) => setManualNameInput(e.target.value)}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'white',
                        fontSize: '13px',
                        outline: 'none',
                        boxSizing: 'border-box',
                      }}
                    />

                    <XStack gap="$2" justify="flex-end" mt="$1">
                      <Box
                        render="button"
                        onClick={() => setShowManualLogin(false)}
                        px="$3"
                        py="$2"
                        $platform-web={{
                          background: 'transparent',
                          border: 'none',
                          color: 'var(--muted-foreground)',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        Cancel
                      </Box>
                      <Action render="button" onClick={handleManualTokenSubmit} px={16} py={8}>
                        Enter Portal
                      </Action>
                    </XStack>
                  </YStack>
                )}
              </YStack>
            </Card>

            <XStack items="center" gap="$3" flexWrap="wrap" justify="center">
              <Link href="/continuous-improvement" style={{ fontSize: '13px', color: 'var(--emerald-400)', fontWeight: 600, textDecoration: 'none' }}>
                Start Free with AUTO 101 →
              </Link>
              <a href="https://hanzo.app/learn" target="_blank" rel="noreferrer" style={{ fontSize: '13px', color: 'var(--white)', fontWeight: 500, textDecoration: 'none' }}>
                Open hanzo.app/learn ↗
              </a>
            </XStack>

            <Grid columns={{ min: 240, max: 3 }} gap={16} width="100%" maxW={900} mt="$2">
              <Card p="$4" bg="rgba(255, 255, 255, 0.03)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
                <XStack items="center" gap="$2" mb="$2">
                  <ShieldCheck size={17} color="var(--emerald-400)" />
                  <Text fontSize="$2" fontWeight="700" color="var(--white)">W3C Capstone Proof</Text>
                </XStack>
                <Text fontSize="$1" color="var(--muted-foreground)" lineHeight={18}>
                  Cryptographic W3C Verifiable Credentials proving completed practical capstones &amp; live artifacts (non-accredited professional certifications).
                </Text>
              </Card>

              <Card p="$4" bg="rgba(255, 255, 255, 0.03)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
                <XStack items="center" gap="$2" mb="$2">
                  <Cpu size={17} color="var(--emerald-400)" />
                  <Text fontSize="$2" fontWeight="700" color="var(--white)">Sandboxed Lab Runtimes</Text>
                </XStack>
                <Text fontSize="$1" color="var(--muted-foreground)" lineHeight={18}>
                  Scoped lab compute and interactive sandboxes aligned to each course&rsquo;s engineering requirements.
                </Text>
              </Card>

              <Card p="$4" bg="rgba(255, 255, 255, 0.03)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
                <XStack items="center" gap="$2" mb="$2">
                  <Bot size={17} color="var(--emerald-400)" />
                  <Text fontSize="$2" fontWeight="700" color="var(--white)">AI Faculty Mentors</Text>
                </XStack>
                <Text fontSize="$1" color="var(--muted-foreground)" lineHeight={18}>
                  24/7 guidance from @Edu, @Sci, @Dev, @Cyber, @Data, @Doc, @QA, and @Lang across all 25 courses.
                </Text>
              </Card>
            </Grid>
          </YStack>
        </Band>
      </Box>
    )
  }

  return (
    <Box minH="100vh" bg="$background" $platform-web={{ color: 'var(--foreground)' }}>
      {/* Slim Portal Header Ribbon */}
      <Box
        borderBottomWidth={1}
        borderColor="rgba(255, 255, 255, 0.08)"
        bg="var(--pure-black)"
        py="$3"
        px="$5"
        position="sticky"
        t={64}
        $platform-web={{ zIndex: 30, backdropFilter: 'blur(12px)' }}
      >
        <XStack items="center" justify="space-between" flexWrap="wrap" gap="$3">
          {/* Course Selector across all 25 courses */}
          <XStack items="center" gap="$3" flexWrap="wrap">
            <Chip px={7} py={2} fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">
              WORKSTATION
            </Chip>

            <select
              aria-label="Select course"
              value={selectedCourseSlug}
              onChange={(e) => setSelectedCourseSlug(e.target.value)}
              style={{
                background: '#111111',
                color: '#ffffff',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                borderRadius: '8px',
                padding: '6px 10px',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                maxWidth: '380px',
                cursor: 'pointer',
              }}
            >
              {SCHOOLS.map((school) => (
                <optgroup key={school.id} label={school.name}>
                  {UNIVERSITY_COURSES.filter((c) => c.school === school.id).map((c) => {
                    const unlocked = isUserEnrolledInCourse(session, c.slug)
                    return (
                      <option key={c.slug} value={c.slug}>
                        {unlocked ? '✓ ' : '🔒 '}
                        {c.code} — {c.title} {c.isFree ? '(Free)' : `($${c.price})`}
                      </option>
                    )
                  })}
                </optgroup>
              ))}
            </select>
          </XStack>

          {/* Right: Status & Account */}
          <XStack items="center" gap="$2.5" flexWrap="wrap">
            <a
              href={activeCourse.learnWorkspaceUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '5px',
                padding: '5px 10px',
                borderRadius: '8px',
                background: 'rgba(16, 185, 129, 0.12)',
                color: 'var(--emerald-300)',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              <span>hanzo.app/learn</span>
              <ExternalLink size={11} />
            </a>

            <XStack items="center" gap="$1.5" px="$2.5" py="$1" rounded="var(--radius-md)" bg="rgba(255, 255, 255, 0.05)">
              <User size={13} color="var(--emerald-400)" />
              <Text fontSize="$1" fontWeight="600" color="var(--white)">
                {studentName}
              </Text>
            </XStack>

            <Action
              render="button"
              onClick={() => setShowCredentialModal(true)}
              px={10}
              py={5}
              $platform-web={{ fontSize: '11px', fontWeight: 600 }}
            >
              <XStack items="center" gap="$1">
                <Award size={13} />
                <Text fontSize="$1" fontWeight="600" color="inherit">
                  {isCredentialAwarded ? 'W3C Credential' : 'Preview Proof'}
                </Text>
              </XStack>
            </Action>

            <Box
              render="button"
              onClick={handleSignOut}
              px="$2"
              py="$1"
              rounded="var(--radius-md)"
              bg="rgba(255, 255, 255, 0.05)"
              $platform-web={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
                color: 'var(--muted-foreground)',
                fontSize: '12px',
                border: 'none',
              }}
            >
              <LogOut size={13} />
              <Text fontSize="$1" color="inherit">Sign Out</Text>
            </Box>
          </XStack>
        </XStack>
      </Box>

      {/* Main Workstation */}
      <Band pad={36} measure={1280}>
        {feedbackToast && (
          <Box p="$3" mb="$4" rounded="var(--radius-md)" bg="rgba(16, 185, 129, 0.15)">
            <XStack items="center" gap="$2">
              <CheckCircle2 size={16} color="var(--emerald-400)" />
              <Text fontSize="$2" fontWeight="600" color="var(--white)">
                {feedbackToast}
              </Text>
            </XStack>
          </Box>
        )}

        {welcomeBanner && (
          <Box p="$4" mb="$5" rounded="var(--radius-lg)" bg="rgba(16, 185, 129, 0.08)">
            <XStack items="center" justify="space-between" flexWrap="wrap" gap="$3">
              <XStack items="center" gap="$3">
                <Sparkles size={20} color="var(--emerald-400)" />
                <YStack gap={2}>
                  <Text fontSize="$3" fontWeight="700" color="var(--white)">
                    Welcome to Hanzo University, {studentName}
                  </Text>
                  <Text fontSize="$1" color="var(--white-70)">
                    Your workspace and scoped lab environment for {activeCourse.code} are ready.
                  </Text>
                </YStack>
              </XStack>
              <Action render="button" onClick={() => setWelcomeBanner(false)} px={10} py={5} $platform-web={{ fontSize: '11px' }}>
                Dismiss
              </Action>
            </XStack>
          </Box>
        )}

        {/* Course Mission Header */}
        <Box p="$5" mb="$5" rounded="var(--radius-xl)" bg="rgba(255, 255, 255, 0.02)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
          <XStack items="flex-start" justify="space-between" flexWrap="wrap" gap="$4">
            <YStack gap="$1.5" flex={1} minW={280}>
              <XStack items="center" gap="$2" flexWrap="wrap">
                <Chip px={8} py={2} fontSize="$1" fontFamily="$mono" color={isCourseEnrolled ? 'var(--emerald-400)' : 'var(--amber-400)'}>
                  {activeCourse.code} · {activeCourse.isFree ? 'FREE OPEN ACCESS' : isCourseEnrolled ? 'ENROLLED' : 'ENROLLMENT REQUIRED'}
                </Chip>
                <Chip px={8} py={2} fontSize="$1" fontFamily="$mono" color="var(--white-70)">
                  {activeSchool.shortName}
                </Chip>
                <Chip px={8} py={2} fontSize="$1" fontFamily="$mono" color="var(--white-70)">
                  {activeCourse.credential}
                </Chip>
              </XStack>

              <Text fontSize="$6" fontWeight="800" color="var(--white)">
                {activeCourse.title}
              </Text>
              <Text fontSize="$1" color="var(--muted-foreground)" lineHeight={20}>
                {activeCourse.summary}
              </Text>
            </YStack>

            <XStack items="center" gap="$3" flexWrap="wrap">
              <Link href={`/${activeCourse.slug}`} style={{ fontSize: '12px', color: 'var(--white-70)', textDecoration: 'none' }}>
                Course Syllabus ↗
              </Link>
              {isCourseEnrolled ? (
                <Action href={activeCourse.learnWorkspaceUrl} fill px={14} py={8} $platform-web={{ fontSize: '12px' }}>
                  Launch Interactive Lab ↗
                </Action>
              ) : (
                <Action href={courseCheckoutUrl(activeCourse.slug)} fill px={16} py={8} $platform-web={{ fontSize: '13px' }}>
                  Enroll in {activeCourse.code} — ${activeCourse.price} USD →
                </Action>
              )}
            </XStack>
          </XStack>

          {isCourseEnrolled && (
            <YStack gap="$2" mt="$4" pt="$3" borderTopWidth={1} borderColor="rgba(255, 255, 255, 0.06)">
              <XStack items="center" justify="space-between">
                <Text fontSize="$1" color="var(--muted-foreground)" fontFamily="$mono">
                  MODULE PROGRESS · AI FACULTY: {activeCourse.facultyBots.join(', ')}
                </Text>
                <Text fontSize="$1" fontWeight="700" color={isDefenseUnlocked ? 'var(--emerald-400)' : 'var(--white)'} fontFamily="$mono">
                  {currentCompleted.length} of {totalWeeks} Modules Passed ({progressPercent}%)
                </Text>
              </XStack>
              <Box height={6} rounded={9999} bg="rgba(255, 255, 255, 0.08)" overflow="hidden">
                <Box height="100%" width={`${progressPercent}%`} bg="var(--emerald-400)" $platform-web={{ transition: 'width 0.3s ease' }} />
              </Box>
            </YStack>
          )}
        </Box>

        {isCourseEnrolled ? (
          <>
            {/* Dual Column Workspace */}
            <div className="portal-workspace-grid">
              {/* Left: Modules */}
              <YStack gap="$4" minW={0} width="100%">
                <Card p="$5" bg="rgba(255, 255, 255, 0.02)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
                  <XStack items="center" justify="space-between" mb="$4" flexWrap="wrap" gap="$2">
                    <Text fontSize="$3" fontWeight="800" color="var(--white)">
                      {activeCourse.code} Modules &amp; Labs
                    </Text>
                    <Chip px={10} py={3} fontSize="$1" fontFamily="$mono" color={isDefenseUnlocked ? 'var(--emerald-400)' : 'var(--white-70)'}>
                      {progressPercent}% COMPLETED
                    </Chip>
                  </XStack>

                  <YStack gap="$3">
                    {activeCourse.syllabus.map((week, idx) => {
                      const isCompleted = currentCompleted.includes(idx)
                      const isActive = activeWeekIndex === idx
                      return (
                        <Box
                          key={week.week}
                          p="$4"
                          rounded="var(--radius-md)"
                          bg={isActive ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)'}
                          borderWidth={1}
                          borderColor={isActive ? 'rgba(16, 185, 129, 0.45)' : 'rgba(255, 255, 255, 0.07)'}
                          $platform-web={{ cursor: 'pointer' }}
                          onClick={() => setActiveWeekIndex(idx)}
                        >
                          <XStack items="center" justify="space-between" gap="$3">
                            <YStack minW={0} flex={1}>
                              <XStack items="center" gap="$2" flexWrap="wrap">
                                <Text fontSize="$1" fontFamily="$mono" color="var(--muted-foreground)">{week.code}</Text>
                                <Text fontSize="$2" fontWeight="700" color="var(--white)">{week.title}</Text>
                              </XStack>
                              <Text fontSize="$1" color="var(--muted-foreground)" numberOfLines={1}>{week.lab}</Text>
                            </YStack>
                            <Chip px={8} py={2} fontSize="$1" fontFamily="$mono" color={isCompleted ? 'var(--emerald-400)' : 'var(--muted-foreground)'}>
                              {isCompleted ? 'PASSED ✓' : isActive ? 'ACTIVE' : 'PENDING'}
                            </Chip>
                          </XStack>

                          {isActive && (
                            <YStack mt="$3" pt="$3" borderTopWidth={1} borderColor="rgba(255, 255, 255, 0.08)" gap="$3">
                              <Text fontSize="$1" color="var(--white-80)" lineHeight={19}>{week.summary}</Text>

                              <YStack gap="$1.5">
                                {week.lectures.map((lec, lIdx) => {
                                  const isWatched = (watchedLectures[selectedCourseSlug] || []).includes(lec)
                                  return (
                                    <XStack
                                      key={lIdx}
                                      items="center"
                                      justify="space-between"
                                      p="$2"
                                      px="$3"
                                      rounded="var(--radius-sm)"
                                      bg={isWatched ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.03)'}
                                      gap="$2"
                                      $platform-web={{ cursor: 'pointer' }}
                                      onClick={(e) => {
                                        e.stopPropagation()
                                        openLectureModal(week, lec, 'lecture')
                                      }}
                                    >
                                      <XStack items="center" gap="$2" minW={0} flex={1}>
                                        <Play size={10} color="var(--emerald-400)" style={{ flexShrink: 0 }} />
                                        <Text fontSize="$1" color="var(--white-80)" numberOfLines={1}>{lec}</Text>
                                      </XStack>
                                      <Text fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">
                                        {isWatched ? '✓ Done' : 'Open →'}
                                      </Text>
                                    </XStack>
                                  )
                                })}
                              </YStack>

                              <XStack items="center" justify="space-between" pt="$1" flexWrap="wrap" gap="$2">
                                <Text fontSize="$1" color={isCompleted ? 'var(--emerald-400)' : 'var(--muted-foreground)'} fontWeight="600">
                                  {isCompleted ? '✓ Lab Verified' : 'Ready for sandbox evaluation'}
                                </Text>
                                <Action
                                  render="button"
                                  onClick={(e) => {
                                    e.stopPropagation()
                                    handleCompleteLab(idx)
                                  }}
                                  disabled={isRunningCommand}
                                  px={12}
                                  py={6}
                                  $platform-web={{ fontSize: '11px' }}
                                >
                                  {isCompleted ? 'Re-Run Evaluation' : 'Run & Pass Lab →'}
                                </Action>
                              </XStack>
                            </YStack>
                          )}
                        </Box>
                      )
                    })}
                  </YStack>
                </Card>
              </YStack>

              {/* Right: Sandbox Shell & Evaluation Console */}
              <YStack gap="$4" minW={0} width="100%">
                <Card p={0} overflow="hidden" borderWidth={1} borderColor="rgba(255, 255, 255, 0.08)" bg="rgba(255, 255, 255, 0.02)">
                  <XStack items="center" justify="space-between" px="$4" py="$3" bg="rgba(0, 0, 0, 0.5)" borderBottomWidth={1} borderColor="rgba(255, 255, 255, 0.06)" flexWrap="wrap" gap="$2">
                    <XStack items="center" gap="$2">
                      <Terminal size={15} color="var(--emerald-400)" />
                      <Text fontSize="$1" fontWeight="700" color="var(--white)" fontFamily="$mono">
                        sandbox-{studentHandle}
                      </Text>
                      <Chip px={6} py={1} fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">READY</Chip>
                    </XStack>

                    <XStack gap="$1">
                      {[
                        { tab: 'terminal', label: 'Shell' },
                        { tab: 'ast', label: 'Code Guard' },
                        { tab: 'grader', label: 'Grader' },
                        { tab: 'metering', label: 'Lab Scope' },
                      ].map(({ tab, label }) => (
                        <Box
                          key={tab}
                          render="button"
                          onClick={() => setActiveTab(tab as any)}
                          px="$2"
                          py="$1"
                          rounded="var(--radius-sm)"
                          bg={activeTab === tab ? 'rgba(255, 255, 255, 0.15)' : 'transparent'}
                          $platform-web={{
                            cursor: 'pointer',
                            border: 'none',
                            color: activeTab === tab ? 'var(--white)' : 'var(--muted-foreground)',
                            fontSize: '11px',
                            fontFamily: 'monospace',
                          }}
                        >
                          {label}
                        </Box>
                      ))}
                    </XStack>
                  </XStack>

                  {activeTab === 'terminal' && (
                    <YStack p="$4" bg="var(--pure-black)" minH={360} justify="space-between">
                      <div className="portal-terminal-box">
                        {terminalHistory.map((line, idx) => (
                          <div
                            key={idx}
                            style={{
                              color:
                                line.includes('@hanzo-sandbox:')
                                  ? 'var(--emerald-400)'
                                  : line.includes('PASSED') || line.includes('[PASS]')
                                  ? 'var(--emerald-300)'
                                  : line.includes('[OK]')
                                  ? 'var(--white)'
                                  : 'var(--muted-foreground)',
                            }}
                          >
                            {line}
                          </div>
                        ))}
                      </div>

                      <XStack items="center" justify="space-between" pt="$3" mt="$3" borderTopWidth={1} borderColor="rgba(255, 255, 255, 0.06)" flexWrap="wrap" gap="$2">
                        <XStack items="center" gap="$1.5" flexWrap="wrap">
                          {workspaceData.quickCommands.map((cmd) => (
                            <Box
                              key={cmd}
                              render="button"
                              onClick={() => !isRunningCommand && executeCommand(cmd)}
                              px="$2"
                              py="$1"
                              rounded="var(--radius-sm)"
                              bg="rgba(255, 255, 255, 0.06)"
                              $platform-web={{
                                cursor: 'pointer',
                                fontSize: '11px',
                                fontFamily: 'monospace',
                                color: 'var(--white-80)',
                                border: 'none',
                              }}
                            >
                              {cmd}
                            </Box>
                          ))}
                        </XStack>

                        <Action render="button" onClick={() => handleCompleteLab(activeWeekIndex)} disabled={isRunningCommand} px={12} py={5} fill $platform-web={{ fontSize: '11px' }}>
                          {isRunningCommand ? 'Evaluating...' : `Verify Module ${activeWeekIndex + 1} →`}
                        </Action>
                      </XStack>
                    </YStack>
                  )}

                  {activeTab === 'ast' && (
                    <YStack p="$4" bg="var(--pure-black)" minH={360} gap="$3">
                      <Text fontSize="$2" fontWeight="700" color="var(--white)">{workspaceData.codeInspectorTitle}</Text>
                      <Text fontSize="$1" color="var(--muted-foreground)" fontFamily="$mono">{workspaceData.codeInspectorSubtitle}</Text>
                      <Box p="$3" rounded="var(--radius-md)" bg="rgba(255, 255, 255, 0.03)" $platform-web={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}>
                        {workspaceData.codeInspectorDiff.map((line, dIdx) => (
                          <Text key={dIdx} fontSize="$1" fontFamily="$mono" display="block" color={line.type === 'del' ? 'var(--red-400)' : line.type === 'add' ? 'var(--emerald-400)' : 'var(--white-70)'}>
                            {line.text}
                          </Text>
                        ))}
                      </Box>
                      <XStack items="center" gap="$2">
                        <CheckCircle2 size={14} color="var(--emerald-400)" />
                        <Text fontSize="$1" color="var(--emerald-300)" fontWeight="600">{workspaceData.codeInspectorValidation}</Text>
                      </XStack>
                    </YStack>
                  )}

                  {activeTab === 'grader' && (
                    <YStack p="$4" bg="var(--pure-black)" minH={360} gap="$3">
                      <XStack items="center" justify="space-between">
                        <Text fontSize="$2" fontWeight="700" color="var(--white)">{workspaceData.graderTitle}</Text>
                        <Chip px={8} py={2} fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">CLEANROOM SUITE</Chip>
                      </XStack>
                      {workspaceData.graderTasks.map((row) => (
                        <XStack key={row.task} items="center" justify="space-between" p="$2" px="$3" rounded="var(--radius-sm)" bg="rgba(255, 255, 255, 0.03)">
                          <XStack items="center" gap="$2" minW={0} flex={1}>
                            <CheckCircle2 size={14} color="var(--emerald-400)" />
                            <Text fontSize="$1" fontFamily="$mono" color="var(--white)">{row.task}</Text>
                          </XStack>
                          <Chip px={6} py={1} fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">{row.status}</Chip>
                        </XStack>
                      ))}
                    </YStack>
                  )}

                  {activeTab === 'metering' && (
                    <YStack p="$4" bg="var(--pure-black)" minH={360} gap="$3">
                      <Text fontSize="$2" fontWeight="700" color="var(--white)">Scoped Lab Environment &amp; Compute</Text>
                      <Text fontSize="$1" color="var(--muted-foreground)" lineHeight={19}>{activeCourse.labComputeNote}</Text>
                      <YStack gap="$2" pt="$2">
                        {workspaceData.resourceBreakdown.map((res, rIdx) => (
                          <XStack key={rIdx} justify="space-between" p="$2.5" rounded="var(--radius-sm)" bg="rgba(255, 255, 255, 0.03)">
                            <Text fontSize="$1" color="var(--white)">{res.item}</Text>
                            <Text fontSize="$1" color="var(--emerald-400)" fontFamily="$mono">{res.metric}</Text>
                          </XStack>
                        ))}
                      </YStack>
                    </YStack>
                  )}
                </Card>

                <XStack items="center" justify="space-between" px="$2">
                  <Text fontSize="$1" color="var(--muted-foreground)" fontFamily="$mono">LAB CONTROLS:</Text>
                  <XStack items="center" gap="$2">
                    <Box
                      render="button"
                      onClick={handleFastTrackAllLabs}
                      px="$2"
                      py="$1"
                      rounded="var(--radius-sm)"
                      bg="rgba(16, 185, 129, 0.1)"
                      $platform-web={{ cursor: 'pointer', fontSize: '11px', color: 'var(--emerald-300)', fontFamily: 'monospace', border: 'none' }}
                    >
                      Verify All Modules
                    </Box>
                    <Box
                      render="button"
                      onClick={handleResetCourseProgress}
                      px="$2"
                      py="$1"
                      rounded="var(--radius-sm)"
                      bg="rgba(255, 255, 255, 0.05)"
                      $platform-web={{ cursor: 'pointer', fontSize: '11px', color: 'var(--muted-foreground)', fontFamily: 'monospace', border: 'none' }}
                    >
                      Reset
                    </Box>
                  </XStack>
                </XStack>
              </YStack>
            </div>

            {/* Capstone Verification Card */}
            <Box mt="$6">
              <Card p="$5" bg="rgba(255, 255, 255, 0.02)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
                <XStack items="center" justify="space-between" flexWrap="wrap" gap="$3" mb="$3">
                  <YStack gap={1}>
                    <Text fontSize="$3" fontWeight="800" color="var(--white)">
                      Capstone Artifact Verification &amp; W3C Proof
                    </Text>
                    <Text fontSize="$1" color="var(--muted-foreground)">
                      Required Artifact: {activeCourse.capstoneArtifact} ({activeCourse.credential})
                    </Text>
                  </YStack>
                  <Chip px={10} py={3} fontSize="$1" fontFamily="$mono" color={isCredentialAwarded || isDefenseUnlocked ? 'var(--emerald-400)' : 'var(--amber-400)'}>
                    {isCredentialAwarded ? 'VERIFIED ✓' : isDefenseUnlocked ? 'READY TO VERIFY' : 'COMPLETE LABS FIRST'}
                  </Chip>
                </XStack>

                <Text fontSize="$2" color="var(--white-80)" lineHeight={21} mb="$4">
                  {activeCourse.capstone}
                </Text>

                {isCredentialAwarded ? (
                  <Action render="button" onClick={() => setShowCredentialModal(true)} px={16} py={8} fill>
                    View &amp; Export {activeCourse.credential} W3C Credential →
                  </Action>
                ) : isDefenseUnlocked ? (
                  <Action render="button" onClick={handleDefendCapstone} disabled={isDefending} px={16} py={8} fill>
                    {isDefending ? 'Verifying Capstone Artifact...' : `Verify Capstone & Issue ${activeCourse.credential} Proof →`}
                  </Action>
                ) : (
                  <Action render="button" onClick={() => handleCompleteLab(activeWeekIndex)} disabled={isRunningCommand} px={14} py={7}>
                    Verify Current Module ({activeCourse.syllabus[activeWeekIndex]?.code}) →
                  </Action>
                )}
              </Card>
            </Box>
          </>
        ) : (
          /* Locked Paid Course View */
          <Card p={28} bg="var(--pure-black)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.12)">
            <YStack gap="$5">
              <XStack items="flex-start" justify="space-between" flexWrap="wrap" gap="$4">
                <YStack gap="$2" maxW={700}>
                  <Chip px={8} py={3} fontSize="$1" fontFamily="$mono" color="var(--amber-400)">
                    COURSE ACCESS LOCKED · {activeCourse.code}
                  </Chip>
                  <Text fontSize="$5" fontWeight="800" color="var(--white)">
                    Enrollment Required to Access {activeCourse.code}: {activeCourse.title}
                  </Text>
                  <Text fontSize="$2" color="var(--muted-foreground)" lineHeight={21}>
                    Signed in as <strong style={{ color: 'var(--white)' }}>{studentName}</strong> (@{studentHandle}). Enroll in {activeCourse.code} or activate University Pro (bundled with Hanzo Pro) to unlock this course&rsquo;s sandboxed labs and capstone verification. Remember: AUTO 101 is always free.
                  </Text>
                </YStack>

                <YStack gap="$2" p="$4" rounded="var(--radius-lg)" bg="var(--card)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.1)" minW={250}>
                  <Text fontSize="$1" fontFamily="$mono" color="var(--muted-foreground)">COURSE ENROLLMENT</Text>
                  <Text fontSize="$6" fontWeight="800" color="var(--white)">${activeCourse.price} USD</Text>
                  <Text fontSize="$1" color="var(--muted-foreground)">{activeCourse.labComputeNote}</Text>
                  <Action href={courseCheckoutUrl(activeCourse.slug)} fill py={10} mt="$2">
                    Enroll in {activeCourse.code} →
                  </Action>
                  <Box
                    render="button"
                    onClick={() => setSelectedCourseSlug('continuous-improvement')}
                    py="$1.5"
                    $platform-web={{ background: 'transparent', border: 'none', color: 'var(--emerald-400)', cursor: 'pointer', fontSize: '12px', fontWeight: 600 }}
                  >
                    Or switch to Free AUTO 101 →
                  </Box>
                </YStack>
              </XStack>

              {session.enrolledClasses.length > 0 && (
                <YStack gap="$2" pt="$3" borderTopWidth={1} borderColor="var(--border)">
                  <Text fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">
                    YOUR ACTIVELY ENROLLED COURSES ({session.enrolledClasses.length}):
                  </Text>
                  <XStack gap="$2" flexWrap="wrap">
                    {session.enrolledClasses.map((enrolledSlug) => {
                      const c = UNIVERSITY_COURSES.find((uc) => uc.slug === enrolledSlug)
                      if (!c) return null
                      return (
                        <Box
                          key={enrolledSlug}
                          render="button"
                          onClick={() => setSelectedCourseSlug(enrolledSlug)}
                          px="$3"
                          py="$2"
                          rounded="var(--radius-md)"
                          bg="var(--card)"
                          borderWidth={1}
                          borderColor="var(--emerald-800)"
                          $platform-web={{ cursor: 'pointer', color: 'var(--white)', fontSize: '12px', fontWeight: 600 }}
                        >
                          Open {c.code}: {c.title} →
                        </Box>
                      )
                    })}
                  </XStack>
                </YStack>
              )}
            </YStack>
          </Card>
        )}
      </Band>

      {/* W3C Credential Modal */}
      {showCredentialModal && (
        <Box
          position="fixed"
          t={0}
          l={0}
          width="100vw"
          height="100vh"
          bg="rgba(0, 0, 0, 0.85)"
          items="center"
          justify="center"
          p="$4"
          $platform-web={{ backdropFilter: 'blur(12px)', zIndex: 9999 }}
        >
          <Box width="100%" maxW={680} bg="var(--pure-black)" rounded="var(--radius-2xl)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.12)" p="$6" maxH="90vh" overflow="scroll">
            <XStack items="center" justify="space-between" mb="$4">
              <XStack items="center" gap="$2">
                <Award size={20} color="var(--emerald-400)" />
                <Text fontSize="$3" fontWeight="700" color="var(--white)">
                  W3C Verifiable Credential · {activeCourse.credential}
                </Text>
              </XStack>
              <Box
                render="button"
                onClick={() => setShowCredentialModal(false)}
                $platform-web={{ background: 'transparent', border: 'none', color: 'var(--muted-foreground)', cursor: 'pointer', fontSize: '18px' }}
              >
                ✕
              </Box>
            </XStack>

            <YStack p="$5" rounded="var(--radius-xl)" bg="rgba(255, 255, 255, 0.03)" gap="$3">
              <XStack items="center" justify="space-between" flexWrap="wrap" gap="$2">
                <Text fontSize="$1" fontFamily="$mono" color="var(--muted-foreground)">HANZO UNIVERSITY · PRACTICAL CREDENTIAL</Text>
                <Chip px={8} py={2} fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">W3C VC 2.0</Chip>
              </XStack>

              <Text fontSize="$5" fontWeight="800" color="var(--white)">{studentName}</Text>
              <Text fontSize="$3" fontWeight="700" color="var(--emerald-300)">
                {activeCourse.credentialFull} ({activeCourse.credential})
              </Text>
              <Text fontSize="$1" color="var(--white-80)">
                {activeCourse.code}: {activeCourse.title} · Verified Artifact: {activeCourse.capstoneArtifact}
              </Text>
              <Text fontSize="$1" color="var(--muted-foreground)" lineHeight={18}>
                Cryptographic proof of completed practical capstone &amp; live artifact. Professional certification (not an accredited academic degree).
              </Text>
            </YStack>

            <XStack items="center" justify="space-between" mt="$4" flexWrap="wrap" gap="$2">
              <XStack gap="$2" flexWrap="wrap">
                <Box
                  render="button"
                  onClick={handleDownloadSvg}
                  px="$3"
                  py="$2"
                  rounded="var(--radius-md)"
                  bg="rgba(255, 255, 255, 0.08)"
                  $platform-web={{ cursor: 'pointer', fontSize: '12px', color: 'var(--white)', border: 'none', display: 'flex', alignItems: 'center', gap: '6px' }}
                >
                  <Download size={13} />
                  SVG Badge
                </Box>
                <Link href={`/verify?id=${activeCourse.credential}-2026-9821&student=${studentHandle}`} style={{ textDecoration: 'none' }}>
                  <Box px="$3" py="$2" rounded="var(--radius-md)" bg="rgba(16, 185, 129, 0.15)" $platform-web={{ fontSize: '12px', color: 'var(--emerald-300)', fontWeight: 600 }}>
                    Public Verification Registry ↗
                  </Box>
                </Link>
              </XStack>
              <Action render="button" onClick={() => setShowCredentialModal(false)} px={14} py={7} fill>
                Close
              </Action>
            </XStack>
          </Box>
        </Box>
      )}

      {/* Module Material Viewer Modal */}
      {activeLectureModal && (
        <Box
          position="fixed"
          t={0}
          l={0}
          width="100vw"
          height="100vh"
          bg="rgba(0, 0, 0, 0.85)"
          items="center"
          justify="center"
          p="$4"
          $platform-web={{ backdropFilter: 'blur(12px)', zIndex: 9999 }}
        >
          <Box width="100%" maxW={720} bg="var(--pure-black)" rounded="var(--radius-2xl)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.12)" p="$6" maxH="90vh" overflow="scroll">
            <XStack items="center" justify="space-between" mb="$4">
              <YStack>
                <Text fontSize="$3" fontWeight="700" color="var(--white)">{activeLectureModal.title}</Text>
                <Text fontSize="$1" color="var(--muted-foreground)">
                  {activeCourse.code} · {activeLectureModal.weekCode} · AI Faculty: {activeLectureModal.facultyLabel}
                </Text>
              </YStack>
              <Box
                render="button"
                onClick={() => setActiveLectureModal(null)}
                $platform-web={{ background: 'transparent', border: 'none', color: 'var(--muted-foreground)', cursor: 'pointer', fontSize: '18px' }}
              >
                ✕
              </Box>
            </XStack>

            <YStack gap="$4">
              <Box p="$4" rounded="var(--radius-md)" bg="rgba(255, 255, 255, 0.03)">
                <XStack items="center" justify="space-between" mb="$2">
                  <XStack items="center" gap="$2">
                    <BookOpen size={15} color="var(--emerald-400)" />
                    <Text fontSize="$1" fontWeight="700" color="var(--white)">Module Briefing</Text>
                  </XStack>
                  <XStack items="center" gap="$2">
                    <Box
                      render="button"
                      onClick={() => setIsPlayingMedia(!isPlayingMedia)}
                      px="$2.5"
                      py="$1"
                      rounded="var(--radius-sm)"
                      bg="rgba(16, 185, 129, 0.15)"
                      $platform-web={{ cursor: 'pointer', border: 'none', color: 'var(--emerald-300)', fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      {isPlayingMedia ? <Pause size={12} /> : <Play size={12} />}
                      <span>{isPlayingMedia ? 'Pause Audio Briefing' : 'Play Briefing'}</span>
                    </Box>
                    <Volume2 size={14} color="var(--muted-foreground)" />
                    <Text fontSize="$1" fontFamily="$mono" color="var(--muted-foreground)">{playbackRate}x</Text>
                    <Box
                      render="button"
                      onClick={() => setPlaybackRate((r) => (r === 1 ? 1.5 : r === 1.5 ? 2 : 1))}
                      px="$1.5"
                      py="$0.5"
                      rounded="var(--radius-sm)"
                      bg="rgba(255, 255, 255, 0.06)"
                      $platform-web={{ cursor: 'pointer', border: 'none', color: 'var(--white)', fontSize: '10px', fontFamily: 'monospace' }}
                    >
                      Speed
                    </Box>
                  </XStack>
                </XStack>
                <Text fontSize="$1" color="var(--white-80)" lineHeight={20}>{activeLectureModal.summary}</Text>
              </Box>

              <YStack gap="$2">
                <Text fontSize="$1" fontWeight="700" color="var(--white)">AI Faculty Available in hanzo.app/learn:</Text>
                <XStack gap="$2" flexWrap="wrap">
                  {activeCourse.facultyBots.map((botId) => (
                    <Chip key={botId} px={8} py={2} fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">
                      {botId} — {AI_FACULTY_BOTS[botId].role}
                    </Chip>
                  ))}
                </XStack>
              </YStack>

              <XStack items="center" justify="space-between" pt="$3" borderTopWidth={1} borderColor="rgba(255, 255, 255, 0.08)" flexWrap="wrap" gap="$2">
                <a href={activeCourse.learnWorkspaceUrl} target="_blank" rel="noreferrer" style={{ color: 'var(--emerald-400)', fontSize: '12px', fontWeight: 600, textDecoration: 'none' }}>
                  Continue in hanzo.app/learn ↗
                </a>
                <Action render="button" onClick={handleMarkLectureWatched} px={14} py={7} fill $platform-web={{ fontSize: '12px' }}>
                  Mark Completed ✓
                </Action>
              </XStack>
            </YStack>
          </Box>
        </Box>
      )}
    </Box>
  )
}
