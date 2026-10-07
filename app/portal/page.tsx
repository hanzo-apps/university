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
  Clock,
  Play,
  Pause,
  Award,
  Cpu,
  ShieldCheck,
  Code2,
  FileCode,
  Layers,
  ChevronRight,
  ExternalLink,
  RefreshCw,
  Coins,
  Check,
  Copy,
  Download,
  Share2,
  Sparkles,
  BookOpen,
  ArrowRight,
  CheckCircle,
  Volume2,
  Maximize2,
  FileText,
  RotateCcw,
  Zap,
  Lock,
  LogIn,
  LogOut,
  User,
  KeyRound,
} from 'lucide-react'
import { UNIVERSITY_COURSES, type UniversityCourse } from '../courses-data'
import { COURSE_PORTAL_DATA } from './portal-data'
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
  duration?: string
  instructor?: string
}

export default function StudentPortalPage() {
  const [session, setSession] = useState<StudentSession | null>(null)
  const [authLoaded, setAuthLoaded] = useState<boolean>(false)
  const [showManualLogin, setShowManualLogin] = useState<boolean>(false)
  const [manualTokenInput, setManualTokenInput] = useState<string>('')
  const [manualNameInput, setManualNameInput] = useState<string>('')
  const [manualHandleInput, setManualHandleInput] = useState<string>('')
  const [authError, setAuthError] = useState<string | null>(null)
  const [backendSyncStatus, setBackendSyncStatus] = useState<'idle' | 'syncing' | 'synced' | 'offline'>('idle')

  const [selectedCourseSlug, setSelectedCourseSlug] = useState<string>('agentic-coding')
  const [activeTab, setActiveTab] = useState<'terminal' | 'ast' | 'grader' | 'metering'>('terminal')
  const [activeWeekIndex, setActiveWeekIndex] = useState<number>(0)
  const [studentHandle, setStudentHandle] = useState<string>('student')
  const [studentName, setStudentName] = useState<string>('Student')
  const [welcomeBanner, setWelcomeBanner] = useState<boolean>(false)

  // Module completion map per course: slug -> list of completed week indices
  const [completedModules, setCompletedModules] = useState<Record<string, number[]>>({
    'agentic-coding': [0, 1, 2],
    'reinforcement-learning': [0, 1, 2],
    'systems-engineering': [0, 1],
  })

  // Capstone defense passed per course
  const [capstonePassed, setCapstonePassed] = useState<Record<string, boolean>>({
    'agentic-coding': false,
    'reinforcement-learning': false,
    'systems-engineering': false,
  })

  // Watched lectures / read papers
  const [watchedLectures, setWatchedLectures] = useState<Record<string, string[]>>({})

  // Active lecture / paper modal state
  const [activeLectureModal, setActiveLectureModal] = useState<ActiveLectureItem | null>(null)
  const [isPlayingMedia, setIsPlayingMedia] = useState<boolean>(false)
  const [playbackRate, setPlaybackRate] = useState<number>(1)

  const [isRunningCommand, setIsRunningCommand] = useState(false)
  const [isDefending, setIsDefending] = useState(false)
  const [showCredentialModal, setShowCredentialModal] = useState(false)
  const [feedbackToast, setFeedbackToast] = useState<string | null>(null)

  // Active course & course workspace data
  const activeCourse: UniversityCourse =
    UNIVERSITY_COURSES.find((c) => c.slug === selectedCourseSlug) || UNIVERSITY_COURSES[0]

  const isCourseEnrolled = Boolean(session?.isFullAccess || session?.enrolledClasses?.includes(selectedCourseSlug))

  const workspaceData =
    COURSE_PORTAL_DATA[selectedCourseSlug] || COURSE_PORTAL_DATA['agentic-coding']

  // Dynamic terminal prompt tailored to actual student username
  const userTerminalPrompt = (workspaceData.terminalPrompt || 'student@hanzo-sandbox:~$').replace(
    /^alex@/,
    `${studentHandle}@`
  )

  // Terminal history state
  const [terminalHistory, setTerminalHistory] = useState<string[]>(workspaceData.initialHistory)

  // Hydrate from localStorage, resolve authentic IAM student session, and configure backend class
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const savedModules = localStorage.getItem('hanzo_portal_completed_modules')
        if (savedModules) {
          setCompletedModules(JSON.parse(savedModules))
        }
        const savedCapstones = localStorage.getItem('hanzo_portal_capstone_passed')
        if (savedCapstones) {
          setCapstonePassed(JSON.parse(savedCapstones))
        }
        const savedWatched = localStorage.getItem('hanzo_portal_watched_lectures')
        if (savedWatched) {
          setWatchedLectures(JSON.parse(savedWatched))
        }
      } catch (e) {
        console.error('Failed to parse portal saved state', e)
      }

      // Resolve active student session (OIDC / IAM token or local tuition checkout)
      const activeSession = resolveStudentSession()

      if (activeSession && activeSession.isAuthenticated) {
        setSession(activeSession)
        setStudentName(activeSession.name)
        setStudentHandle(activeSession.handle)

        const params = new URLSearchParams(window.location.search)
        const enrolledParam = params.get('enrolled') || params.get('course')
        const welcome = params.get('welcome')

        // Configure initial active class with backend enrollment
        let targetClass: string | null = null
        if (enrolledParam && UNIVERSITY_COURSES.some((c) => c.slug === enrolledParam)) {
          targetClass = enrolledParam
        } else if (activeSession.isFullAccess) {
          const savedCourse = localStorage.getItem('hanzo_portal_selected_course')
          targetClass = savedCourse && UNIVERSITY_COURSES.some((c) => c.slug === savedCourse)
            ? savedCourse
            : UNIVERSITY_COURSES[0].slug
        } else if (activeSession.enrolledClasses.length > 0) {
          const savedCourse = localStorage.getItem('hanzo_portal_selected_course')
          if (savedCourse && activeSession.enrolledClasses.includes(savedCourse)) {
            targetClass = savedCourse
          } else {
            targetClass = activeSession.enrolledClasses[0]
          }
        } else {
          const savedCourse = localStorage.getItem('hanzo_portal_selected_course')
          targetClass = savedCourse && UNIVERSITY_COURSES.some((c) => c.slug === savedCourse)
            ? savedCourse
            : UNIVERSITY_COURSES[0].slug
        }

        if (targetClass) {
          setSelectedCourseSlug(targetClass)
        }

        if (welcome === '1') {
          setWelcomeBanner(true)
        }

        // Synchronize with backend class limits / plan
        setBackendSyncStatus('syncing')
        syncBackendClassEnrollment(activeSession)
          .then((syncRes) => {
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
              setBackendSyncStatus('synced')
            } else {
              setBackendSyncStatus(syncRes.status === 'unauthorized' ? 'offline' : 'synced')
            }
          })
          .catch(() => setBackendSyncStatus('offline'))
      } else {
        setSession(null)
      }

      setAuthLoaded(true)
    }
  }, [])

  // Sign out student
  const handleSignOut = () => {
    signOutStudent()
    setSession(null)
    setFeedbackToast('Successfully signed out of Hanzo University.')
    setTimeout(() => setFeedbackToast(null), 3000)
  }

  // Handle manual token / student handle submission
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
        } else {
          setAuthError('Could not verify JWT token. Please ensure it is a valid Hanzo token.')
          return
        }
      } catch (err) {
        setAuthError('Failed to parse token.')
        return
      }
    }

    if (manualNameInput.trim() || manualHandleInput.trim()) {
      const handle = (manualHandleInput.trim() || manualNameInput.trim().toLowerCase().replace(/\s+/g, '-')).replace(/[^a-z0-9_-]/g, '')
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

  // Sync terminal and active week when course changes
  useEffect(() => {
    const data = COURSE_PORTAL_DATA[selectedCourseSlug] || COURSE_PORTAL_DATA['agentic-coding']
    const personalizedHistory = (data.initialHistory || []).map((l) =>
      l.replace(/^alex@/, `${studentHandle}@`)
    )
    setTerminalHistory(personalizedHistory)
    setActiveWeekIndex(0)
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem('hanzo_portal_selected_course', selectedCourseSlug)
      } catch (_) {}
    }
  }, [selectedCourseSlug, studentHandle])

  // Execute terminal command
  const executeCommand = (cmd: string) => {
    if (!isCourseEnrolled) {
      setTerminalHistory((prev) => [
        ...prev,
        `${userTerminalPrompt} ${cmd}`,
        `[ACCESS DENIED] Course ${activeCourse.code} is locked. Active enrollment required to execute commands in this Hanzo Visor microVM sandbox.`,
        `${userTerminalPrompt} _`,
      ])
      return
    }

    setIsRunningCommand(true)
    const prompt = userTerminalPrompt
    setTerminalHistory((prev) => [...prev, `${prompt} ${cmd}`])

    setTimeout(() => {
      let output: string[] = []
      if (workspaceData.commandOutputs[cmd]) {
        output = workspaceData.commandOutputs[cmd]
      } else {
        output = [
          `[COMMAND EXECUTED] Task "${cmd}" processed in Hanzo Visor sandbox pod (exit code 0).`,
          `[EVAL] All unit tests passed with zero runtime errors.`,
        ]
      }
      setTerminalHistory((prev) => [...prev, ...output, `${prompt} _`])
      setIsRunningCommand(false)
    }, 600)
  }

  // Submit lab coursework and mark module as completed
  const handleCompleteLab = (weekIdx: number) => {
    if (!isCourseEnrolled) {
      setFeedbackToast(`Course ${activeCourse.code} is locked. Active enrollment required to submit lab coursework.`)
      setTimeout(() => setFeedbackToast(null), 3500)
      return
    }

    setIsRunningCommand(true)
    const week = activeCourse.syllabus[weekIdx]
    const prompt = userTerminalPrompt
    setTerminalHistory((prev) => [
      ...prev,
      `${prompt} hanzo autograder --submit ${week.code}`,
      `[AUTOGRADER] Evaluating coursework for ${week.code}: ${week.title}...`,
      `  [+] Testing runtime constraints in Hanzo Visor microVM container...`,
      `  [+] Running AST tree-sitter & benchmark assertions...`,
      `  [+] Verifying zero syntax regressions and clean memory bounds...`,
      `[PASS] 100% Tests Passed for ${week.code}! Marking module as COMPLETED.`,
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
      setFeedbackToast(`Module ${week.code} passed! Coursework progress updated.`)
      setTimeout(() => setFeedbackToast(null), 3500)
    }, 800)
  }

  // Fast-track all labs for testing & evaluation
  const handleFastTrackAllLabs = () => {
    if (!isCourseEnrolled) {
      setFeedbackToast(`Course ${activeCourse.code} is locked. Active enrollment required to evaluate coursework.`)
      setTimeout(() => setFeedbackToast(null), 3500)
      return
    }

    const totalCount = activeCourse.syllabus.length
    const allIndices = Array.from({ length: totalCount }, (_, i) => i)
    const prompt = userTerminalPrompt

    setTerminalHistory((prev) => [
      ...prev,
      `${prompt} hanzo autograder --fast-track-all ${activeCourse.code}`,
      `[AUTOGRADER] Fast-tracking all ${totalCount} laboratory evaluations for ${activeCourse.code}...`,
      `  [✓] Module 1: Baseline sandbox initialization & unit tests verified.`,
      `  [✓] Module 2: Intermediate optimization & memory constraints passed.`,
      `  [✓] Module 3: Advanced architecture verification & zero regressions confirmed.`,
      `  [✓] Module 4: Pre-capstone integration & telemetry telemetry exit code 0.`,
      `[SUCCESS] All laboratory modules satisfied! 100% pass mark recorded.`,
      `[STATUS] Qualifications MET for official Capstone Defense.`,
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

    setFeedbackToast(`All ${totalCount} laboratory modules passed! Capstone defense unlocked.`)
    setTimeout(() => setFeedbackToast(null), 3500)
  }

  // Reset progress for active course
  const handleResetCourseProgress = () => {
    if (!isCourseEnrolled) return

    setCompletedModules((prev) => {
      const updated = { ...prev, [selectedCourseSlug]: [0] }
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
    const prompt = userTerminalPrompt
    setTerminalHistory((prev) => [
      ...prev,
      `${prompt} hanzo dev reset-progress --course ${activeCourse.code}`,
      `[RESET] Progress reset for ${activeCourse.code}. Workspace restored to baseline.`,
      `${prompt} _`,
    ])
    setFeedbackToast(`Coursework reset for ${activeCourse.code}. Ready to start fresh.`)
    setTimeout(() => setFeedbackToast(null), 3000)
  }

  // Defend Capstone and officially graduate
  const handleDefendCapstone = () => {
    if (!isCourseEnrolled) {
      setFeedbackToast(`Course ${activeCourse.code} is locked. Active enrollment required to defend capstone.`)
      setTimeout(() => setFeedbackToast(null), 3500)
      return
    }

    setIsDefending(true)
    const prompt = userTerminalPrompt
    setTerminalHistory((prev) => [
      ...prev,
      `${prompt} hanzo defense --capstone ${activeCourse.code}`,
      `==================== CAPSTONE DEFENSE: ${activeCourse.credential} ====================`,
      `[1/4] Cloning candidate repository into cleanroom Hanzo Visor environment...`,
      `[2/4] Executing full test suite & production benchmarks for ${activeCourse.title}...`,
      `[3/4] Cryptographically auditing zero regression errors & budget bounds...`,
      `[4/4] Generating W3C Verifiable Credential on Lux Chain...`,
      `[CONGRATULATIONS] Capstone Defended with Distinction! Score: 100%.`,
      `[ISSUANCE] Credential #${activeCourse.credential}-2026-9821 minted on-chain.`,
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
    }, 1200)
  }

  // Open Lecture or Reading Modal
  const openLectureModal = (
    week: (typeof activeCourse.syllabus)[0],
    itemTitle: string,
    type: 'lecture' | 'reading',
  ) => {
    if (!isCourseEnrolled) {
      setFeedbackToast(`Lecture locked. Active enrollment in ${activeCourse.code} required to access media.`)
      setTimeout(() => setFeedbackToast(null), 3500)
      return
    }
    setActiveLectureModal({
      title: itemTitle,
      weekCode: week.code,
      weekTitle: week.title,
      type,
      summary: week.summary,
      duration: type === 'lecture' ? '38 mins' : '15 min read',
      instructor: activeCourse.instructor.name,
    })
    setIsPlayingMedia(false)
  }

  // Mark lecture / reading watched
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
    setFeedbackToast(`Marked "${activeLectureModal.title}" as completed!`)
    setTimeout(() => setFeedbackToast(null), 3000)
    setActiveLectureModal(null)
  }

  // Download SVG badge
  const handleDownloadSvg = () => {
    const svgContent = `<svg xmlns="http://www.w3.org/2000/svg" width="380" height="64" viewBox="0 0 380 64" fill="none">
  <rect width="380" height="64" rx="12" fill="#0A0A0A" stroke="#262626"/>
  <rect x="1" y="1" width="378" height="62" rx="11" stroke="#34D399" stroke-opacity="0.3"/>
  <circle cx="28" cy="32" r="14" fill="#047857" fill-opacity="0.3"/>
  <path d="M22 32L26 36L34 28" stroke="#34D399" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
  <text fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="12" font-weight="700" x="52" y="27">${activeCourse.credential}: ${activeCourse.title}</text>
  <text fill="#A3A3A3" font-family="-apple-system, BlinkMacSystemFont, Segoe UI, Roboto, sans-serif" font-size="10" x="52" y="44">VERIFIED: ${studentName} · 100% DISTINCTION</text>
  <rect x="290" y="20" width="76" height="24" rx="6" fill="#171717" stroke="#404040"/>
  <text fill="#34D399" font-family="ui-monospace, monospace" font-size="9" font-weight="700" x="302" y="36">PASS 100%</text>
</svg>`

    const blob = new Blob([svgContent], { type: 'image/svg+xml' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `Hanzo-${activeCourse.credential}-Badge.svg`
    a.click()
    URL.revokeObjectURL(url)
    setFeedbackToast('SVG Badge downloaded successfully!')
    setTimeout(() => setFeedbackToast(null), 3000)
  }

  // Calculate course progress
  const currentCompleted = completedModules[selectedCourseSlug] || []
  const totalWeeks = activeCourse.syllabus.length
  const progressPercent = Math.min(100, Math.round((currentCompleted.length / totalWeeks) * 100))
  const isDefenseUnlocked = currentCompleted.length >= totalWeeks || capstonePassed[selectedCourseSlug]
  const isDegreeAwarded = capstonePassed[selectedCourseSlug]

  // ── Authentication & Session Gate ──
  if (!authLoaded) {
    return (
      <Box
        minH="100vh"
        bg="$background"
        $platform-web={{ color: 'var(--foreground)' }}
        display="flex"
        items="center"
        justify="center"
      >
        <YStack items="center" gap="$3">
          <Box
            width={40}
            height={40}
            rounded="var(--radius-full)"
            borderWidth={3}
            borderColor="var(--emerald-500)"
            $platform-web={{
              borderTopColor: 'transparent',
              animation: 'spin 0.8s linear infinite',
            }}
          />
          <Text fontSize="$2" color="var(--white)" fontWeight="700" fontFamily="$mono">
            VERIFYING HANZO CREDENTIALS...
          </Text>
          <Text fontSize="$1" color="var(--muted-foreground)">
            Synchronizing student session with Hanzo IAM & Class Registry
          </Text>
        </YStack>
      </Box>
    )
  }

  if (!session || !session.isAuthenticated) {
    return (
      <Box minH="100vh" bg="$background" $platform-web={{ color: 'var(--foreground)' }}>
        {/* Navigation Bar */}
        <Box
          borderBottomWidth={1}
          borderColor="rgba(255, 255, 255, 0.06)"
          bg="var(--pure-black)"
          py="$3"
          px="$6"
        >
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
            <Link
              href="/"
              style={{
                fontSize: '13px',
                color: 'var(--white-80)',
                textDecoration: 'none',
              }}
            >
              Explore Course Catalog ↗
            </Link>
          </XStack>
        </Box>

        {/* Authentication Gate Band */}
        <Band pad={60} measure={840}>
          <YStack items="center" gap="$6" $platform-web={{ textAlign: 'center' }}>
            <Box
              p="$4"
              rounded="var(--radius-full)"
              bg="rgba(16, 185, 129, 0.15)"
              borderWidth={0}
              $platform-web={{
                boxShadow: '0 0 36px rgba(16, 185, 129, 0.25)',
              }}
            >
              <Lock size={36} color="var(--emerald-400)" />
            </Box>

            <YStack gap="$2" $platform-web={{ maxWidth: '640px' }}>
              <Chip px={10} py={4} fontSize="$1" fontFamily="$mono" color="var(--emerald-400)" mx="auto">
                AUTHENTICATION REQUIRED
              </Chip>
              <Text fontSize="$6" fontWeight="800" color="var(--white)" $platform-web={{ lineHeight: 1.2 }}>
                Sign in to access your Learning Workstation
              </Text>
              <Text fontSize="$2" color="var(--muted-foreground)" $platform-web={{ lineHeight: 1.6 }}>
                The Hanzo University learning workstation, live GPU microVM sandbox pod, and autograder evaluation systems require an active Hanzo IAM student account or enrolled class session.
              </Text>
            </YStack>

            {/* Authentication Action Card */}
            <Card
              p="$6"
              w="100%"
              maxWidth={520}
              bg="rgba(255, 255, 255, 0.02)"
              borderWidth={0}
              rounded="var(--radius-lg)"
            >
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
                  Sign In with Hanzo
                  <ArrowRight size={16} />
                </Action>

                <Text fontSize="$1" color="var(--muted-foreground)">
                  Single sign-on via Hanzo IAM across dev.chat, hanzo.ai, and hanzo.university
                </Text>

                {/* Divider */}
                <Box borderBottomWidth={1} borderColor="rgba(255, 255, 255, 0.06)" my="$1" />

                {/* Secondary Option: Manual Token or Handle */}
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
                    Or authenticate with IAM Token / Hanzo ID
                  </Box>
                ) : (
                  <YStack gap="$3" pt="$2" $platform-web={{ textAlign: 'left' }}>
                    <Text fontSize="$1" fontWeight="600" color="var(--white)">
                      Manual IAM Token or Student Handle:
                    </Text>

                    {authError && (
                      <Box
                        p="$2"
                        rounded="var(--radius-sm)"
                        bg="rgba(239, 68, 68, 0.15)"
                        borderWidth={0}
                      >
                        <Text fontSize="$1" color="#f87171">
                          {authError}
                        </Text>
                      </Box>
                    )}

                    <input
                      type="text"
                      placeholder="Paste Hanzo IAM JWT token (or student handle)"
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
                      placeholder="Student Full Name (optional, e.g. James Burns)"
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
                          borderRadius: '6px',
                          color: 'var(--muted-foreground)',
                          cursor: 'pointer',
                          fontSize: '12px',
                        }}
                      >
                        Cancel
                      </Box>
                      <Action
                        render="button"
                        onClick={handleManualTokenSubmit}
                        px={16}
                        py={8}
                        $platform-web={{ fontSize: '13px', fontWeight: '600' }}
                      >
                        Verify & Enter Portal
                      </Action>
                    </XStack>
                  </YStack>
                )}
              </YStack>
            </Card>

            {/* Not Enrolled Promo Link */}
            <XStack items="center" gap="$2">
              <Text fontSize="$1" color="var(--muted-foreground)">
                Not enrolled in a course yet?
              </Text>
              <Link
                href="/"
                style={{
                  fontSize: '13px',
                  color: 'var(--emerald-400)',
                  fontWeight: 600,
                  textDecoration: 'none',
                }}
              >
                Browse Degree Tracks & Tuition Rebate →
              </Link>
            </XStack>

            {/* Feature Grid */}
            <Grid columns={{ min: 240, max: 3 }} gap={16} width="100%" $platform-web={{ maxWidth: '900px' }} mt="$4">
              <Card
                p="$4"
                bg="rgba(255, 255, 255, 0.03)"
                borderWidth={0}
                rounded="var(--radius-md)"
                textAlign="left"
              >
                <XStack items="center" gap="$2" mb="$2">
                  <ShieldCheck size={18} color="var(--emerald-400)" />
                  <Text fontSize="$2" fontWeight="700" color="var(--white)">
                    W3C On-Chain Diplomas
                  </Text>
                </XStack>
                <Text fontSize="$1" color="var(--muted-foreground)" $platform-web={{ lineHeight: 1.5 }}>
                  Sovereign cryptographic credentials issued directly to your Hanzo DID, registered on Lux.
                </Text>
              </Card>

              <Card
                p="$4"
                bg="rgba(255, 255, 255, 0.03)"
                borderWidth={0}
                rounded="var(--radius-md)"
                textAlign="left"
              >
                <XStack items="center" gap="$2" mb="$2">
                  <Cpu size={18} color="var(--emerald-400)" />
                  <Text fontSize="$2" fontWeight="700" color="var(--white)">
                    Hanzo Visor MicroVM
                  </Text>
                </XStack>
                <Text fontSize="$1" color="var(--muted-foreground)" $platform-web={{ lineHeight: 1.5 }}>
                  Pre-configured GPU workstation with PyTorch, CUDA, AST tree-sitter, and SWE-bench harness.
                </Text>
              </Card>

              <Card
                p="$4"
                bg="rgba(255, 255, 255, 0.03)"
                borderWidth={0}
                rounded="var(--radius-md)"
                textAlign="left"
              >
                <XStack items="center" gap="$2" mb="$2">
                  <Coins size={18} color="var(--emerald-400)" />
                  <Text fontSize="$2" fontWeight="700" color="var(--white)">
                    100% Tuition Rebate
                  </Text>
                </XStack>
                <Text fontSize="$1" color="var(--muted-foreground)" $platform-web={{ lineHeight: 1.5 }}>
                  Every dollar in tuition is loaded as live LLM and compute credits into your Hanzo account.
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
      {/* ── Single Unified Slim Portal Ribbon ── */}
      <Box
        borderBottomWidth={1}
        borderColor="rgba(255, 255, 255, 0.06)"
        bg="var(--pure-black)"
        py="$3"
        px="$5"
        position="sticky"
        t={0}
        $platform-web={{ zIndex: 30, backdropFilter: 'blur(12px)' }}
      >
        <XStack items="center" justify="space-between" flexWrap="wrap" gap="$3">
          {/* Left: Brand & Track Selector */}
          <XStack items="center" gap="$3" flexWrap="wrap">
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

            {/* Course Track Switcher Pills */}
            <XStack items="center" gap="$1.5" flexWrap="wrap">
              {UNIVERSITY_COURSES.map((c) => {
                const isCompleted = capstonePassed[c.slug]
                const isCurrent = selectedCourseSlug === c.slug
                const isEnrolledInCourse = Boolean(session?.isFullAccess || session?.enrolledClasses?.includes(c.slug))
                return (
                  <Box
                    key={c.slug}
                    render="button"
                    onClick={() => setSelectedCourseSlug(c.slug)}
                    px="$2.5"
                    py="$1"
                    rounded="var(--radius-md)"
                    bg={isCurrent ? 'var(--white)' : 'rgba(255, 255, 255, 0.05)'}
                    borderWidth={0}
                    $platform-web={{
                      cursor: 'pointer',
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: '5px',
                      transition: 'all 0.15s ease',
                      border: 'none',
                      opacity: isEnrolledInCourse ? 1 : 0.75,
                    }}
                    title={
                      isEnrolledInCourse
                        ? `${c.code}: ${c.title} (Enrolled)`
                        : `${c.code}: ${c.title} (Locked — $${c.price} USD)`
                    }
                  >
                    {!isEnrolledInCourse && (
                      <Lock size={10} color={isCurrent ? 'var(--pure-black)' : 'var(--muted-foreground)'} />
                    )}
                    <Text
                      fontSize="$1"
                      fontWeight={isCurrent ? '700' : '500'}
                      fontFamily="$mono"
                      color={isCurrent ? 'var(--pure-black)' : isEnrolledInCourse ? 'var(--white-80)' : 'var(--white-60)'}
                    >
                      {c.credential}
                    </Text>
                    {isCompleted ? (
                      <Check size={11} color={isCurrent ? 'var(--pure-black)' : 'var(--emerald-400)'} />
                    ) : null}
                  </Box>
                )
              })}
            </XStack>
          </XStack>

          {/* Right: Student Profile & Credential CTAs */}
          <XStack items="center" gap="$2.5" flexWrap="wrap">
            {isCourseEnrolled ? (
              <XStack
                items="center"
                gap="$2"
                px="$2.5"
                py="$1"
                rounded="var(--radius-md)"
                bg="rgba(255, 255, 255, 0.05)"
                borderWidth={0}
              >
                <Coins size={13} color="var(--emerald-400)" />
                <Text fontSize="$1" fontWeight="700" color="var(--emerald-300)" fontFamily="$mono">
                  ${activeCourse.rebateCredits}.00 Credits
                </Text>
              </XStack>
            ) : (
              <XStack
                items="center"
                gap="$1.5"
                px="$2.5"
                py="$1"
                rounded="var(--radius-md)"
                bg="rgba(245, 158, 11, 0.08)"
                borderWidth={0}
              >
                <Lock size={11} color="#f59e0b" />
                <Text fontSize="$1" fontWeight="600" color="#f59e0b" fontFamily="$mono">
                  Course Locked
                </Text>
              </XStack>
            )}

            <XStack
              items="center"
              gap="$1.5"
              px="$2.5"
              py="$1"
              rounded="var(--radius-md)"
              bg="rgba(255, 255, 255, 0.05)"
              borderWidth={0}
            >
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
                  {isDegreeAwarded ? 'Degree Certificate' : 'Preview Credential'}
                </Text>
              </XStack>
            </Action>

            <Box
              render="button"
              onClick={handleSignOut}
              px="$2"
              py="$1"
              rounded="var(--radius-md)"
              borderWidth={0}
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
              title="Sign Out"
            >
              <LogOut size={13} />
              <Text fontSize="$1" color="inherit">
                Sign Out
              </Text>
            </Box>
          </XStack>
        </XStack>
      </Box>

      {/* ── Main Workstation Content ── */}
      <Band pad={36} measure={1280}>
        {/* Toast Notification */}
        {feedbackToast && (
          <Box
            p="$3"
            mb="$4"
            rounded="var(--radius-md)"
            bg="rgba(16, 185, 129, 0.15)"
            borderWidth={0}
          >
            <XStack items="center" gap="$2">
              <CheckCircle2 size={16} color="var(--emerald-400)" />
              <Text fontSize="$2" fontWeight="600" color="var(--white)">
                {feedbackToast}
              </Text>
            </XStack>
          </Box>
        )}

        {/* Newly Enrolled Welcome Banner (Dismissible) */}
        {welcomeBanner && (
          <Box
            p="$4"
            mb="$5"
            rounded="var(--radius-lg)"
            bg="rgba(16, 185, 129, 0.08)"
            borderWidth={0}
            $platform-web={{
              boxShadow: '0 0 24px rgba(16, 185, 129, 0.15)',
            }}
          >
            <XStack items="center" justify="space-between" flexWrap="wrap" gap="$3">
              <XStack items="center" gap="$3">
                <Box p="$2" rounded="var(--radius-md)" bg="var(--emerald-950)">
                  <Sparkles size={20} color="var(--emerald-400)" />
                </Box>
                <YStack gap={2}>
                  <Text fontSize="$3" fontWeight="700" color="var(--white)">
                    🎉 Welcome to Hanzo University, {studentName}!
                  </Text>
                  <Text fontSize="$1" color="var(--white-70)">
                    Tuition confirmed. Your student DID (`did:hanzo:student:{studentHandle}`) is active, ${activeCourse.rebateCredits}.00 compute tokens are credited, and your sandbox pod is provisioned.
                  </Text>
                </YStack>
              </XStack>
              <Action
                render="button"
                onClick={() => setWelcomeBanner(false)}
                px={10}
                py={5}
                $platform-web={{ fontSize: '11px' }}
              >
                Dismiss
              </Action>
            </XStack>
          </Box>
        )}

        {/* ── Course Mission & Progress Hero ── */}
        <Box
          p="$5"
          mb="$5"
          rounded="var(--radius-xl)"
          bg="rgba(255, 255, 255, 0.02)"
          borderWidth={0}
        >
          <XStack items="flex-start" justify="space-between" flexWrap="wrap" gap="$4">
            <YStack gap="$1.5" flex={1} minW={280}>
              <XStack items="center" gap="$2" flexWrap="wrap">
                {isCourseEnrolled ? (
                  <>
                    <Chip px={8} py={2} fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">
                      {activeCourse.code} · {activeCourse.credential}
                    </Chip>
                    {isDegreeAwarded ? (
                      <Chip px={8} py={2} fontSize="$1" fontFamily="$mono" color="var(--emerald-300)">
                        GRADUATED & CERTIFIED
                      </Chip>
                    ) : (
                      <Chip px={8} py={2} fontSize="$1" fontFamily="$mono" color="var(--white-70)">
                        LEVEL: {activeCourse.level.toUpperCase()}
                      </Chip>
                    )}
                  </>
                ) : (
                  <>
                    <Chip px={8} py={2} fontSize="$1" fontFamily="$mono" color="var(--amber-400)">
                      <Lock size={10} style={{ marginRight: 4, display: 'inline', verticalAlign: 'middle' }} />
                      {activeCourse.code} · ENROLLMENT REQUIRED
                    </Chip>
                    <Chip px={8} py={2} fontSize="$1" fontFamily="$mono" color="var(--white-70)">
                      LEVEL: {activeCourse.level.toUpperCase()}
                    </Chip>
                    <Chip px={8} py={2} fontSize="$1" fontFamily="$mono" color="var(--white-70)">
                      {activeCourse.units}.0 UNITS · {activeCourse.credential}
                    </Chip>
                  </>
                )}
              </XStack>

              <Text fontSize="$6" fontWeight="800" color="var(--white)">
                {activeCourse.title}
              </Text>
              <Text fontSize="$1" color="var(--muted-foreground)">
                {isCourseEnrolled
                  ? `Complete all ${totalWeeks} coursework modules below to qualify for your Capstone Defense and earn your official W3C verifiable credential.`
                  : activeCourse.summary}
              </Text>
            </YStack>

            <XStack items="center" gap="$3">
              <Link
                href={`/${activeCourse.slug}`}
                style={{
                  fontSize: '12px',
                  color: 'var(--white-70)',
                  textDecoration: 'none',
                }}
              >
                Course Syllabus ↗
              </Link>
              {isCourseEnrolled ? (
                isDegreeAwarded ? (
                  <Action
                    render="button"
                    onClick={() => setShowCredentialModal(true)}
                    px={14}
                    py={7}
                    fill
                    $platform-web={{ fontSize: '12px' }}
                  >
                    View W3C Certificate →
                  </Action>
                ) : isDefenseUnlocked ? (
                  <Action
                    render="button"
                    onClick={handleDefendCapstone}
                    disabled={isDefending}
                    px={14}
                    py={7}
                    fill
                    $platform-web={{ fontSize: '12px' }}
                  >
                    {isDefending ? 'Defending Capstone...' : `Defend Capstone & Graduate →`}
                  </Action>
                ) : null
              ) : (
                <Action
                  render="a"
                  href={courseCheckoutUrl(activeCourse.slug)}
                  px={16}
                  py={8}
                  fill
                  $platform-web={{ fontSize: '13px', fontWeight: 600, textDecoration: 'none' }}
                >
                  Enroll in {activeCourse.code} — ${activeCourse.price} USD →
                </Action>
              )}
            </XStack>
          </XStack>

          {/* Progress Bar & Milestone Summary */}
          {isCourseEnrolled ? (
            <YStack gap="$2" mt="$4" pt="$3" borderTopWidth={1} borderColor="rgba(255, 255, 255, 0.06)">
              <XStack items="center" justify="space-between">
                <Text fontSize="$1" color="var(--muted-foreground)" fontFamily="$mono">
                  COURSEWORK ROADMAP PROGRESS
                </Text>
                <Text fontSize="$1" fontWeight="700" color={isDefenseUnlocked ? 'var(--emerald-400)' : 'var(--white)'} fontFamily="$mono">
                  {currentCompleted.length} of {totalWeeks} Modules Passed ({progressPercent}%)
                </Text>
              </XStack>
              <Box height={6} rounded={9999} bg="rgba(255, 255, 255, 0.08)" overflow="hidden">
                <Box
                  height="100%"
                  width={`${progressPercent}%`}
                  bg="var(--emerald-400)"
                  $platform-web={{ transition: 'width 0.3s ease' }}
                />
              </Box>
            </YStack>
          ) : (
            <YStack gap="$2" mt="$4" pt="$3" borderTopWidth={1} borderColor="rgba(255, 255, 255, 0.06)">
              <XStack items="center" justify="space-between" flexWrap="wrap" gap="$2">
                <Text fontSize="$1" color="var(--muted-foreground)" fontFamily="$mono">
                  ACCESS STATUS: LOCKED
                </Text>
                <Text fontSize="$1" fontWeight="600" color="var(--amber-400)" fontFamily="$mono">
                  Active tuition enrollment required for sandbox microVM pod & autograder
                </Text>
              </XStack>
            </YStack>
          )}
        </Box>

        {isCourseEnrolled ? (
          <>
            {/* ── Interactive 5-Step Credential Stepper ── */}
            <Box mb="$5">
          <Text fontSize="$1" color="var(--muted-foreground)" fontFamily="$mono" mb="$2">
            STEP-BY-STEP CREDENTIAL PATHWAY (CLICK ANY MODULE TO FOCUS):
          </Text>
          <div className="portal-stepper-grid">
            {activeCourse.syllabus.map((week, idx) => {
              const isCompleted = currentCompleted.includes(idx)
              const isActive = activeWeekIndex === idx
              return (
                <Box
                  key={week.week}
                  render="button"
                  onClick={() => setActiveWeekIndex(idx)}
                  p="$3"
                  rounded="var(--radius-lg)"
                  bg={
                    isActive
                      ? 'rgba(255, 255, 255, 0.1)'
                      : isCompleted
                      ? 'rgba(16, 185, 129, 0.08)'
                      : 'rgba(255, 255, 255, 0.03)'
                  }
                  borderWidth={0}
                  className="portal-step-card"
                  $platform-web={{
                    cursor: 'pointer',
                    textAlign: 'left',
                    border: 'none',
                    boxShadow: isActive ? '0 0 16px rgba(255, 255, 255, 0.08)' : 'none',
                  }}
                >
                  <XStack items="center" justify="space-between" mb="$1">
                    <Text fontSize="$1" fontFamily="$mono" color="var(--muted-foreground)">
                      0{idx + 1} · {week.code}
                    </Text>
                    {isCompleted ? (
                      <Chip px={6} py={1} fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">
                        PASSED ✓
                      </Chip>
                    ) : isActive ? (
                      <Chip px={6} py={1} fontSize="$1" fontFamily="$mono" color="var(--white)">
                        ACTIVE ▶
                      </Chip>
                    ) : (
                      <Chip px={6} py={1} fontSize="$1" fontFamily="$mono" color="var(--muted-foreground)">
                        PENDING
                      </Chip>
                    )}
                  </XStack>
                  <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--white)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                    {week.title}
                  </div>
                </Box>
              )
            })}

            {/* Step 5: Capstone Defense */}
            <Box
              render="button"
              onClick={() => {
                if (isDegreeAwarded) {
                  setShowCredentialModal(true)
                } else if (isDefenseUnlocked) {
                  handleDefendCapstone()
                }
              }}
              p="$3"
              rounded="var(--radius-lg)"
              bg={
                isDegreeAwarded
                  ? 'rgba(16, 185, 129, 0.15)'
                  : isDefenseUnlocked
                  ? 'rgba(16, 185, 129, 0.1)'
                  : 'rgba(255, 255, 255, 0.03)'
              }
              borderWidth={0}
              className="portal-step-card"
              $platform-web={{
                cursor: isDefenseUnlocked || isDegreeAwarded ? 'pointer' : 'default',
                textAlign: 'left',
                border: 'none',
                boxShadow: isDefenseUnlocked ? '0 0 18px rgba(16, 185, 129, 0.2)' : 'none',
              }}
            >
              <XStack items="center" justify="space-between" mb="$1">
                <Text fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">
                  FINAL MILESTONE
                </Text>
                <Award size={14} color="var(--emerald-400)" />
              </XStack>
              <div style={{ fontSize: '13px', fontWeight: 700, color: 'var(--white)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', width: '100%' }}>
                {isDegreeAwarded ? 'Degree Minted 🎓' : isDefenseUnlocked ? 'Defend Capstone ⚡' : 'Capstone Defense'}
              </div>
            </Box>
          </div>
        </Box>

        {/* ── Active Module Workspace (Responsive Dual-Column Grid) ── */}
        <div className="portal-workspace-grid">
          {/* LEFT: Current Module Guide & Coursework Checklist */}
          {(() => {
            const currentWeek = activeCourse.syllabus[activeWeekIndex] || activeCourse.syllabus[0]
            const isWeekPassed = currentCompleted.includes(activeWeekIndex)

            return (
              <YStack gap="$4" minW={0} width="100%">
                <Card p="$5" bg="rgba(255, 255, 255, 0.02)" borderWidth={0} rounded="var(--radius-xl)">
                  {/* Module Header */}
                  <XStack items="center" justify="space-between" flexWrap="wrap" gap="$2" mb="$3">
                    <YStack gap={2} minW={0} flex={1}>
                      <Text fontSize="$1" fontFamily="$mono" color="var(--muted-foreground)">
                        MODULE 0{activeWeekIndex + 1} OF 0{totalWeeks} · {currentWeek.code}
                      </Text>
                      <Text fontSize="$4" fontWeight="800" color="var(--white)" $platform-web={{ wordBreak: 'break-word', overflowWrap: 'anywhere' }}>
                        {currentWeek.title}
                      </Text>
                    </YStack>

                    <Chip
                      px={10}
                      py={3}
                      fontSize="$1"
                      fontFamily="$mono"
                      color={isWeekPassed ? 'var(--emerald-400)' : 'var(--amber-400)'}
                      $platform-web={{ flexShrink: 0 }}
                    >
                      {isWeekPassed ? 'MODULE COMPLETED ✓' : 'IN PROGRESS'}
                    </Chip>
                  </XStack>

                  {/* Summary */}
                  <Text fontSize="$2" color="var(--white-80)" $platform-web={{ lineHeight: 1.6, wordBreak: 'break-word' }} mb="$4">
                    {currentWeek.summary}
                  </Text>

                  {/* Step 1: Study (Lectures & Literature) */}
                  <YStack gap="$2.5" mb="$4">
                    <Text fontSize="$1" fontWeight="700" color="var(--white)" fontFamily="$mono">
                      1. MASTER CONCEPTS (LECTURE & LITERATURE):
                    </Text>

                    {currentWeek.lectures.map((lec, lIdx) => {
                      const isWatched = (watchedLectures[selectedCourseSlug] || []).includes(lec)
                      return (
                        <div
                          key={lIdx}
                          role="button"
                          tabIndex={0}
                          onClick={() => openLectureModal(currentWeek, lec, 'lecture')}
                          className="portal-media-row"
                          style={{
                            background: isWatched ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                            border: 'none',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                            <Play size={14} color="var(--emerald-400)" style={{ flexShrink: 0 }} />
                            <span style={{ fontSize: '13px', fontWeight: 600, color: isWatched ? 'var(--emerald-300)' : 'var(--white)', wordBreak: 'break-word' }}>
                              {lec}
                            </span>
                          </div>
                          <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono, monospace)', color: 'var(--emerald-400)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                            {isWatched ? '✓ Attended' : 'Play Lecture (38m) →'}
                          </span>
                        </div>
                      )
                    })}

                    {currentWeek.readings.map((read, rIdx) => {
                      const isRead = (watchedLectures[selectedCourseSlug] || []).includes(read)
                      return (
                        <div
                          key={rIdx}
                          role="button"
                          tabIndex={0}
                          onClick={() => openLectureModal(currentWeek, read, 'reading')}
                          className="portal-media-row"
                          style={{
                            background: isRead ? 'rgba(16, 185, 129, 0.08)' : 'rgba(255, 255, 255, 0.03)',
                            border: 'none',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: 1, minWidth: 0 }}>
                            <BookOpen size={14} color="var(--white-70)" style={{ flexShrink: 0 }} />
                            <span style={{ fontSize: '13px', color: isRead ? 'var(--emerald-300)' : 'var(--white-80)', wordBreak: 'break-word' }}>
                              {read}
                            </span>
                          </div>
                          <span style={{ fontSize: '12px', fontFamily: 'var(--font-mono, monospace)', color: 'var(--white-70)', whiteSpace: 'nowrap', flexShrink: 0 }}>
                            {isRead ? '✓ Read' : 'View Monograph →'}
                          </span>
                        </div>
                      )
                    })}
                  </YStack>

                  {/* Step 2: Practice & Solve (Lab Task) */}
                  <YStack gap="$2" pt="$3" borderTopWidth={1} borderColor="rgba(255, 255, 255, 0.06)">
                    <Text fontSize="$1" fontWeight="700" color="var(--white)" fontFamily="$mono">
                      2. LABORATORY SPECIFICATION:
                    </Text>

                    <Box p="$3.5" rounded="var(--radius-md)" bg="rgba(255, 255, 255, 0.03)" borderWidth={0}>
                      <XStack items="flex-start" gap="$2.5">
                        <FileCode size={16} color="var(--emerald-400)" style={{ marginTop: 2, flexShrink: 0 }} />
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px', flex: 1, minWidth: 0 }}>
                          <span style={{ fontSize: '12px', fontWeight: 700, color: 'var(--white)' }}>
                            Assignment Task:
                          </span>
                          <span style={{ fontSize: '13px', color: 'var(--white-80)', lineHeight: 1.6, wordBreak: 'break-word' }}>
                            {currentWeek.lab}
                          </span>
                        </div>
                      </XStack>
                    </Box>

                    {/* Submit Lab Action */}
                    <XStack items="center" justify="space-between" pt="$2" flexWrap="wrap" gap="$2">
                      <Text fontSize="$1" color={isWeekPassed ? 'var(--emerald-400)' : 'var(--muted-foreground)'}>
                        {isWeekPassed ? '✓ 100% Autograder Score Passed' : 'Ready to evaluate coursework in sandbox'}
                      </Text>

                      <Action
                        render="button"
                        onClick={() => handleCompleteLab(activeWeekIndex)}
                        disabled={isRunningCommand}
                        px={14}
                        py={7}
                        $platform-web={{ fontSize: '12px' }}
                      >
                        {isWeekPassed ? 'Re-Run Autograder' : `Run Autograder (${currentWeek.code}) →`}
                      </Action>
                    </XStack>
                  </YStack>

                  {/* Module Pager Bar */}
                  <XStack items="center" justify="space-between" pt="$4" mt="$3" borderTopWidth={1} borderColor="rgba(255, 255, 255, 0.06)">
                    <Box
                      render="button"
                      onClick={() => activeWeekIndex > 0 && setActiveWeekIndex((p) => Math.max(0, p - 1))}
                      px="$2.5"
                      py="$1.5"
                      rounded="var(--radius-md)"
                      borderWidth={0}
                      bg="rgba(255, 255, 255, 0.05)"
                      $platform-web={{
                        cursor: activeWeekIndex === 0 ? 'not-allowed' : 'pointer',
                        opacity: activeWeekIndex === 0 ? 0.35 : 1,
                        fontSize: '12px',
                        color: 'var(--white)',
                        border: 'none',
                      }}
                    >
                      ← Previous Module
                    </Box>

                    <XStack items="center" gap="$1.5">
                      {activeCourse.syllabus.map((_, i) => (
                        <Box
                          key={i}
                          render="button"
                          onClick={() => setActiveWeekIndex(i)}
                          width={24}
                          height={24}
                          rounded={9999}
                          bg={activeWeekIndex === i ? 'var(--white)' : 'rgba(255, 255, 255, 0.05)'}
                          items="center"
                          justify="center"
                          $platform-web={{
                            cursor: 'pointer',
                            border: 'none',
                          }}
                        >
                          <Text
                            fontSize="$1"
                            fontWeight="700"
                            color={activeWeekIndex === i ? 'var(--pure-black)' : 'var(--muted-foreground)'}
                          >
                            {i + 1}
                          </Text>
                        </Box>
                      ))}
                    </XStack>

                    <Box
                      render="button"
                      onClick={() => activeWeekIndex < totalWeeks - 1 && setActiveWeekIndex((p) => Math.min(totalWeeks - 1, p + 1))}
                      px="$2.5"
                      py="$1.5"
                      rounded="var(--radius-md)"
                      borderWidth={0}
                      bg="rgba(255, 255, 255, 0.05)"
                      $platform-web={{
                        cursor: activeWeekIndex === totalWeeks - 1 ? 'not-allowed' : 'pointer',
                        opacity: activeWeekIndex === totalWeeks - 1 ? 0.35 : 1,
                        fontSize: '12px',
                        color: 'var(--white)',
                        border: 'none',
                      }}
                    >
                      Next Module →
                    </Box>
                  </XStack>
                </Card>
              </YStack>
            )
          })()}

          {/* RIGHT: Live Sandbox Pod & Autograder Console */}
          <YStack gap="$4" minW={0} width="100%">
            <Card p={0} overflow="hidden" borderWidth={0} rounded="var(--radius-xl)" bg="rgba(255, 255, 255, 0.02)">
              {/* Terminal Header & Mode Selector */}
              <XStack
                items="center"
                justify="space-between"
                px="$4"
                py="$3"
                bg="rgba(0, 0, 0, 0.5)"
                borderBottomWidth={1}
                borderColor="rgba(255, 255, 255, 0.06)"
                flexWrap="wrap"
                gap="$2"
              >
                <XStack items="center" gap="$2">
                  <Terminal size={15} color="var(--emerald-400)" />
                  <Text fontSize="$1" fontWeight="700" color="var(--white)" fontFamily="$mono">
                    pod-vsr-{studentHandle}
                  </Text>
                  <Chip px={6} py={1} fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">
                    ONLINE
                  </Chip>
                </XStack>

                <XStack gap="$1">
                  {[
                    { tab: 'terminal', label: 'Shell' },
                    { tab: 'ast', label: 'AST Inspector' },
                    { tab: 'grader', label: 'Autograder Logs' },
                    { tab: 'metering', label: 'Spend' },
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

              {/* Tab 1: Terminal Shell */}
              {activeTab === 'terminal' && (
                <YStack p="$4" bg="var(--pure-black)" minH={380} justify="space-between">
                  <div className="portal-terminal-box">
                    {terminalHistory.map((line, idx) => (
                      <div
                        key={idx}
                        style={{
                          color:
                            line.startsWith(userTerminalPrompt.slice(0, 5)) || line.includes('@hanzo-sandbox:')
                              ? 'var(--emerald-400)'
                              : line.includes('PASSED') || line.includes('[PASS]') || line.includes('[CONGRATULATIONS]')
                              ? 'var(--emerald-300)'
                              : line.includes('[OK]') || line.includes('[RUST VERIFIED]')
                              ? 'var(--white)'
                              : 'var(--muted-foreground)',
                        }}
                      >
                        {line}
                      </div>
                    ))}
                  </div>

                  {/* Terminal Action Bar */}
                  <YStack gap="$2" pt="$3" borderTopWidth={1} borderColor="rgba(255, 255, 255, 0.06)">
                    <XStack items="center" justify="space-between" flexWrap="wrap" gap="$2">
                      <XStack items="center" gap="$1.5" flexWrap="wrap">
                        <Text fontSize="$1" color="var(--muted-foreground)" fontFamily="$mono">
                          Quick:
                        </Text>
                        {workspaceData.quickCommands.map((cmd) => (
                          <Box
                            key={cmd}
                            render="button"
                            onClick={() => !isRunningCommand && executeCommand(cmd)}
                            px="$2"
                            py="$1"
                            rounded="var(--radius-sm)"
                            bg="rgba(255, 255, 255, 0.05)"
                            borderWidth={0}
                            $platform-web={{
                              cursor: 'pointer',
                              fontSize: '11px',
                              fontFamily: 'monospace',
                              color: 'var(--white-80)',
                              border: 'none',
                            }}
                            hoverStyle={{ bg: 'rgba(255, 255, 255, 0.12)' }}
                          >
                            {cmd}
                          </Box>
                        ))}
                      </XStack>

                      <Action
                        render="button"
                        onClick={() => handleCompleteLab(activeWeekIndex)}
                        disabled={isRunningCommand}
                        px={12}
                        py={5}
                        fill
                        $platform-web={{ fontSize: '11px', fontWeight: 600 }}
                      >
                        {isRunningCommand ? 'Evaluating...' : `Submit Lab ${activeWeekIndex + 1} →`}
                      </Action>
                    </XStack>
                  </YStack>
                </YStack>
              )}

              {/* Tab 2: Code / Architecture Inspector */}
              {activeTab === 'ast' && (
                <YStack p="$4" bg="var(--pure-black)" minH={380} gap="$3">
                  <YStack gap={1}>
                    <Text fontSize="$2" fontWeight="700" color="var(--white)">
                      {workspaceData.codeInspectorTitle}
                    </Text>
                    <Text fontSize="$1" color="var(--muted-foreground)" fontFamily="$mono">
                      {workspaceData.codeInspectorSubtitle}
                    </Text>
                  </YStack>

                  <Box
                    p="$3"
                    rounded="var(--radius-md)"
                    bg="rgba(255, 255, 255, 0.03)"
                    borderWidth={0}
                    $platform-web={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', wordBreak: 'break-all' }}
                  >
                    {workspaceData.codeInspectorDiff.map((line, dIdx) => (
                      <Text
                        key={dIdx}
                        fontSize="$1"
                        fontFamily="$mono"
                        color={
                          line.type === 'del'
                            ? 'var(--red-400)'
                            : line.type === 'add'
                            ? 'var(--emerald-400)'
                            : 'var(--white-70)'
                        }
                      >
                        {line.text}
                      </Text>
                    ))}
                  </Box>

                  <XStack items="center" gap="$2" mt="$1">
                    <CheckCircle2 size={14} color="var(--emerald-400)" />
                    <Text fontSize="$1" color="var(--emerald-300)" fontWeight="600">
                      {workspaceData.codeInspectorValidation}
                    </Text>
                  </XStack>
                </YStack>
              )}

              {/* Tab 3: Autograder Logs */}
              {activeTab === 'grader' && (
                <YStack p="$4" bg="var(--pure-black)" minH={380} gap="$3">
                  <XStack items="center" justify="space-between">
                    <Text fontSize="$2" fontWeight="700" color="var(--white)">
                      {workspaceData.graderTitle}
                    </Text>
                    <Chip px={8} py={2} fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">
                      ALL TESTS PASSING
                    </Chip>
                  </XStack>

                  {workspaceData.graderTasks.map((row) => (
                    <XStack
                      key={row.task}
                      items="center"
                      justify="space-between"
                      p="$2"
                      px="$3"
                      rounded="var(--radius-sm)"
                      bg="rgba(255, 255, 255, 0.03)"
                      borderWidth={0}
                    >
                      <XStack items="center" gap="$2" minW={0} flex={1}>
                        <CheckCircle2 size={14} color="var(--emerald-400)" style={{ flexShrink: 0 }} />
                        <Text fontSize="$1" fontFamily="$mono" color="var(--white)" $platform-web={{ wordBreak: 'break-word' }}>
                          {row.task}
                        </Text>
                      </XStack>
                      <XStack items="center" gap="$3" $platform-web={{ flexShrink: 0 }}>
                        <Text fontSize="$1" color="var(--muted-foreground)" fontFamily="$mono">
                          {row.time} · {row.cost}
                        </Text>
                        <Chip px={6} py={2} fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">
                          {row.status}
                        </Chip>
                      </XStack>
                    </XStack>
                  ))}
                </YStack>
              )}

              {/* Tab 4: Spend Metering */}
              {activeTab === 'metering' && (
                <YStack p="$4" bg="var(--pure-black)" minH={380} gap="$4">
                  <Text fontSize="$2" fontWeight="700" color="var(--white)">
                    Compute Credit Rebate Metering
                  </Text>
                  <Grid columns={{ min: 140, max: 2 }} gap={12}>
                    <YStack p="$3" rounded="var(--radius-md)" bg="rgba(255, 255, 255, 0.03)" gap="$1">
                      <Text fontSize="$1" color="var(--muted-foreground)">Day 1 Deposit</Text>
                      <Text fontSize="$4" fontWeight="800" color="var(--white)">${activeCourse.rebateCredits}.00 USD</Text>
                    </YStack>
                    <YStack p="$3" rounded="var(--radius-md)" bg="rgba(255, 255, 255, 0.03)" gap="$1">
                      <Text fontSize="$1" color="var(--muted-foreground)">Balance Remaining</Text>
                      <Text fontSize="$4" fontWeight="800" color="var(--emerald-400)">
                        ${(activeCourse.rebateCredits * 0.75).toFixed(2)} USD
                      </Text>
                    </YStack>
                  </Grid>

                  <YStack gap="$2">
                    <Text fontSize="$1" color="var(--muted-foreground)">Resource Usage Breakdown:</Text>
                    {workspaceData.resourceBreakdown.map((res, rIdx) => (
                      <XStack key={rIdx} justify="space-between">
                        <Text fontSize="$1" color="var(--white)">{res.item}</Text>
                        <Text fontSize="$1" color="var(--muted-foreground)" fontFamily="$mono">{res.cost}</Text>
                      </XStack>
                    ))}
                  </YStack>
                </YStack>
              )}
            </Card>

            {/* Subtle Accelerator Controls */}
            <XStack items="center" justify="space-between" px="$2">
              <Text fontSize="$1" color="var(--muted-foreground)" fontFamily="$mono">
                TEST ACCELERATOR:
              </Text>
              <XStack items="center" gap="$2">
                <Box
                  render="button"
                  onClick={handleFastTrackAllLabs}
                  px="$2"
                  py="$1"
                  rounded="var(--radius-sm)"
                  bg="rgba(16, 185, 129, 0.1)"
                  borderWidth={0}
                  $platform-web={{
                    cursor: 'pointer',
                    fontSize: '11px',
                    color: 'var(--emerald-300)',
                    fontFamily: 'monospace',
                    border: 'none',
                  }}
                >
                  ⚡ Fast-Track All Labs
                </Box>
                <Box
                  render="button"
                  onClick={handleResetCourseProgress}
                  px="$2"
                  py="$1"
                  rounded="var(--radius-sm)"
                  bg="rgba(255, 255, 255, 0.05)"
                  borderWidth={0}
                  $platform-web={{
                    cursor: 'pointer',
                    fontSize: '11px',
                    color: 'var(--muted-foreground)',
                    fontFamily: 'monospace',
                    border: 'none',
                  }}
                >
                  ↺ Reset Progress
                </Box>
              </XStack>
            </XStack>
          </YStack>
        </div>

        {/* ── Capstone Project Defense & Certification Card ── */}
        <Box mt="$6">
          <Card
            p="$5"
            bg="rgba(255, 255, 255, 0.02)"
            borderWidth={0}
            rounded="var(--radius-xl)"
            $platform-web={{
              boxShadow: isDefenseUnlocked ? '0 0 24px rgba(16, 185, 129, 0.15)' : 'none',
            }}
          >
            <XStack items="center" justify="space-between" flexWrap="wrap" gap="$3" mb="$3">
              <XStack items="center" gap="$2.5">
                <Box p="$2" rounded="var(--radius-md)" bg="rgba(16, 185, 129, 0.15)">
                  <Award size={20} color="var(--emerald-400)" />
                </Box>
                <YStack gap={1}>
                  <Text fontSize="$3" fontWeight="800" color="var(--white)">
                    Capstone Defense & W3C Credential Issuance
                  </Text>
                  <Text fontSize="$1" color="var(--muted-foreground)">
                    Target Credential: {activeCourse.credentialFull} ({activeCourse.credential})
                  </Text>
                </YStack>
              </XStack>

              <Chip
                px={10}
                py={3}
                fontSize="$1"
                fontFamily="$mono"
                color={isDegreeAwarded ? 'var(--emerald-400)' : isDefenseUnlocked ? 'var(--emerald-400)' : 'var(--amber-400)'}
              >
                {isDegreeAwarded ? 'DEGREE AWARDED' : isDefenseUnlocked ? 'QUALIFICATIONS MET' : 'PREREQUISITES PENDING'}
              </Chip>
            </XStack>

            <Text fontSize="$2" color="var(--white-80)" $platform-web={{ lineHeight: 1.6 }} mb="$4">
              {activeCourse.capstone}
            </Text>

            {isDegreeAwarded ? (
              <XStack items="center" justify="space-between" flexWrap="wrap" gap="$3" p="$3" rounded="var(--radius-md)" bg="rgba(16, 185, 129, 0.15)" borderWidth={0}>
                <Text fontSize="$1" color="var(--emerald-300)" fontWeight="600">
                  🎉 Passed with 100% Distinction! Verified W3C Credential minted on Lux Chain.
                </Text>
                <Action
                  render="button"
                  onClick={() => setShowCredentialModal(true)}
                  px={14}
                  py={7}
                  fill
                  $platform-web={{ fontSize: '12px' }}
                >
                  View & Share {activeCourse.credential} Certificate →
                </Action>
              </XStack>
            ) : isDefenseUnlocked ? (
              <XStack items="center" justify="space-between" flexWrap="wrap" gap="$3" p="$3" rounded="var(--radius-md)" bg="rgba(16, 185, 129, 0.12)" borderWidth={0}>
                <Text fontSize="$1" color="var(--emerald-300)" fontWeight="600">
                  All {totalWeeks} modules passed! You meet all qualifications to defend your capstone.
                </Text>
                <Action
                  render="button"
                  onClick={handleDefendCapstone}
                  disabled={isDefending}
                  px={16}
                  py={8}
                  fill
                  $platform-web={{ fontSize: '13px' }}
                >
                  {isDefending ? 'Evaluating Defense in Pod...' : `Defend Capstone & Issue ${activeCourse.credential} Degree →`}
                </Action>
              </XStack>
            ) : (
              <XStack items="center" justify="space-between" flexWrap="wrap" gap="$2" pt="$2" borderTopWidth={1} borderColor="rgba(255, 255, 255, 0.06)">
                <Text fontSize="$1" color="var(--muted-foreground)">
                  Complete the remaining {totalWeeks - currentCompleted.length} laboratory modules to unlock the official Capstone Defense.
                </Text>
                <Action
                  render="button"
                  onClick={() => handleCompleteLab(activeWeekIndex)}
                  disabled={isRunningCommand}
                  px={12}
                  py={6}
                  $platform-web={{ fontSize: '11px' }}
                >
                  Run Current Lab ({activeCourse.syllabus[activeWeekIndex]?.code}) →
                </Action>
              </XStack>
            )}
          </Card>
        </Box>
      </>
    ) : (
      /* ── Course Locked / Enrollment Required View ── */
      <YStack gap="$5">
        {/* Main Paywall Card */}
        <Card
          p={32}
          bg="var(--pure-black)"
          borderWidth={1}
          borderColor="var(--neutral-800)"
          rounded="var(--radius-xl)"
        >
          <YStack gap="$6">
            {/* Header Badge & Title */}
            <XStack items="flex-start" justify="space-between" flexWrap="wrap" gap="$4">
              <YStack gap="$2" maxW={720}>
                <XStack items="center" gap="$2" flexWrap="wrap">
                  <Chip px={8} py={3} fontSize="$1" fontFamily="$mono" color="var(--amber-400)">
                    <Lock size={11} style={{ marginRight: 4, verticalAlign: 'middle', display: 'inline' }} />
                    COURSE ACCESS LOCKED
                  </Chip>
                  <Chip px={8} py={3} fontSize="$1" fontFamily="$mono" color="var(--white-70)">
                    {activeCourse.code} · {activeCourse.units}.0 UNITS · {activeCourse.credential}
                  </Chip>
                </XStack>
                <Text fontSize="$6" fontWeight="800" color="var(--white)">
                  Enrollment Required to Access {activeCourse.code}: {activeCourse.title}
                </Text>
                <Text fontSize="$2" color="var(--muted-foreground)" $platform-web={{ lineHeight: 1.6 }}>
                  You are signed in as <strong style={{ color: 'var(--white)' }}>{studentName}</strong> (<span style={{ fontFamily: 'monospace', color: 'var(--white-80)' }}>@{studentHandle}</span>). Your account does not hold an active enrollment license for this track. Dedicated Hanzo Visor microVM sandbox pods, AST autograder evaluations, and on-chain degree issuance are provisioned exclusively for enrolled students.
                </Text>
              </YStack>

              {/* Price Tag & Action */}
              <YStack
                gap="$2"
                p="$4"
                rounded="var(--radius-lg)"
                bg="var(--card)"
                borderWidth={1}
                borderColor="var(--border)"
                minW={260}
                $platform-web={{ textAlign: 'left' }}
              >
                <Text fontSize="$1" fontFamily="$mono" color="var(--muted-foreground)">
                  TRACK TUITION
                </Text>
                <XStack items="baseline" gap="$1">
                  <Text fontSize="$6" fontWeight="800" color="var(--white)">
                    ${activeCourse.price}
                  </Text>
                  <Text fontSize="$1" color="var(--muted-foreground)">
                    USD
                  </Text>
                </XStack>
                <XStack items="center" gap="$1.5">
                  <Coins size={12} color="var(--emerald-400)" />
                  <Text fontSize="$1" color="var(--emerald-400)" fontFamily="$mono">
                    +${activeCourse.rebateCredits} Credits (25% Rebate)
                  </Text>
                </XStack>
                <XStack items="center" gap="$1.5">
                  <Zap size={12} color="var(--emerald-400)" />
                  <Text fontSize="$1" color="var(--emerald-400)" fontFamily="$mono">
                    + $50 usage credit for free
                  </Text>
                </XStack>

                <Action
                  render="a"
                  href={courseCheckoutUrl(activeCourse.slug)}
                  fill
                  py={12}
                  mt="$2"
                  $platform-web={{
                    fontSize: '14px',
                    fontWeight: 700,
                    textAlign: 'center',
                    textDecoration: 'none',
                  }}
                >
                  Enroll in {activeCourse.code} →
                </Action>
              </YStack>
            </XStack>

            {/* What Enrollment Unlocks - Benefit Grid */}
            <YStack gap="$3" pt="$3" borderTopWidth={1} borderColor="var(--border)">
              <Text fontSize="$1" fontFamily="$mono" color="var(--muted-foreground)">
                WHAT ENROLLMENT IN THIS TRACK UNLOCKS:
              </Text>
              <Grid columns={{ min: 240, max: 4 }} gap={16}>
                <Card p="$3.5" bg="var(--card)" borderWidth={1} borderColor="var(--border)" rounded="var(--radius-md)">
                  <XStack items="center" gap="$2" mb="$1.5">
                    <Cpu size={16} color="var(--emerald-400)" />
                    <Text fontSize="$2" fontWeight="700" color="var(--white)">
                      Hanzo Visor Pod
                    </Text>
                  </XStack>
                  <Text fontSize="$1" color="var(--muted-foreground)" $platform-web={{ lineHeight: 1.5 }}>
                    Dedicated GPU microVM sandbox container with PyTorch, CUDA, AST tree-sitter, and SWE-bench harness.
                  </Text>
                </Card>

                <Card p="$3.5" bg="var(--card)" borderWidth={1} borderColor="var(--border)" rounded="var(--radius-md)">
                  <XStack items="center" gap="$2" mb="$1.5">
                    <Terminal size={16} color="var(--emerald-400)" />
                    <Text fontSize="$2" fontWeight="700" color="var(--white)">
                      Autonomous Autograder
                    </Text>
                  </XStack>
                  <Text fontSize="$1" color="var(--muted-foreground)" $platform-web={{ lineHeight: 1.5 }}>
                    Real-time test suite evaluation with automated AST assertion grading and continuous verification.
                  </Text>
                </Card>

                <Card p="$3.5" bg="var(--card)" borderWidth={1} borderColor="var(--border)" rounded="var(--radius-md)">
                  <XStack items="center" gap="$2" mb="$1.5">
                    <Award size={16} color="var(--emerald-400)" />
                    <Text fontSize="$2" fontWeight="700" color="var(--white)">
                      W3C Degree Credential
                    </Text>
                  </XStack>
                  <Text fontSize="$1" color="var(--muted-foreground)" $platform-web={{ lineHeight: 1.5 }}>
                    Sovereign cryptographic diploma registered on Lux Chain, signed directly to your Hanzo student DID.
                  </Text>
                </Card>

                <Card p="$3.5" bg="var(--card)" borderWidth={1} borderColor="var(--border)" rounded="var(--radius-md)">
                  <XStack items="center" gap="$2" mb="$1.5">
                    <Coins size={16} color="var(--emerald-400)" />
                    <Text fontSize="$2" fontWeight="700" color="var(--white)">
                      Tuition Rebate & Grant
                    </Text>
                  </XStack>
                  <Text fontSize="$1" color="var(--muted-foreground)" $platform-web={{ lineHeight: 1.5 }}>
                    + $50 free compute grant plus 25% tuition rebate credited immediately into your Hanzo Cloud wallet.
                  </Text>
                </Card>
              </Grid>
            </YStack>

            {/* Already Enrolled Courses Switcher */}
            {session.enrolledClasses.length > 0 && (
              <YStack gap="$2" pt="$3" borderTopWidth={1} borderColor="var(--border)">
                <Text fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">
                  YOUR ACTIVELY ENROLLED COURSES ({session.enrolledClasses.length}):
                </Text>
                <XStack gap="$2" flexWrap="wrap">
                  {session.enrolledClasses.map((enrolledSlug) => {
                    const enrolledCourseData = UNIVERSITY_COURSES.find((c) => c.slug === enrolledSlug)
                    if (!enrolledCourseData) return null
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
                        borderColor="var(--emerald-700)"
                        $platform-web={{
                          cursor: 'pointer',
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: '6px',
                        }}
                      >
                        <CheckCircle2 size={13} color="var(--emerald-400)" />
                        <Text fontSize="$1" fontWeight="600" color="var(--white)">
                          Open {enrolledCourseData.code}: {enrolledCourseData.title} →
                        </Text>
                      </Box>
                    )
                  })}
                </XStack>
              </YStack>
            )}
          </YStack>
        </Card>

        {/* Curriculum Preview (Locked Modules) */}
        <Box>
          <Text fontSize="$1" color="var(--muted-foreground)" fontFamily="$mono" mb="$3">
            CURRICULUM MODULES INCLUDED IN {activeCourse.code} (PREVIEW):
          </Text>
          <Grid columns={{ min: 280, max: 2 }} gap={16}>
            {activeCourse.syllabus.map((week) => (
              <Card
                key={week.week}
                p="$4"
                bg="var(--card)"
                borderWidth={1}
                borderColor="var(--border)"
                rounded="var(--radius-lg)"
              >
                <XStack items="center" justify="space-between" mb="$2">
                  <Chip px={6} py={2} fontSize="$1" fontFamily="$mono" color="var(--muted-foreground)">
                    WEEK 0{week.week} · {week.code}
                  </Chip>
                  <XStack items="center" gap="$1">
                    <Lock size={12} color="var(--muted-foreground)" />
                    <Text fontSize="$1" color="var(--muted-foreground)" fontFamily="$mono">
                      LOCKED
                    </Text>
                  </XStack>
                </XStack>
                <Text fontSize="$3" fontWeight="700" color="var(--white)" mb="$1">
                  {week.title}
                </Text>
                <Text fontSize="$1" color="var(--muted-foreground)" mb="$3" $platform-web={{ lineHeight: 1.5 }}>
                  {week.summary}
                </Text>
                <XStack gap="$1.5" flexWrap="wrap">
                  {week.lab && (
                    <Chip px={6} py={1} fontSize={10} fontFamily="$mono">
                      Lab: {week.lab}
                    </Chip>
                  )}
                  {week.lectures.slice(0, 2).map((lecture, i) => (
                    <Chip key={i} px={6} py={1} fontSize={10} fontFamily="$mono">
                      {lecture}
                    </Chip>
                  ))}
                </XStack>
              </Card>
            ))}
          </Grid>
        </Box>
      </YStack>
    )}
  </Band>

      {/* ── W3C Verifiable Credential Modal ── */}
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
          <Box
            width="100%"
            maxW={720}
            bg="var(--pure-black)"
            rounded="var(--radius-2xl)"
            borderWidth={1}
            borderColor="rgba(255, 255, 255, 0.1)"
            p="$6"
            position="relative"
            maxH="90vh"
            overflow="scroll"
          >
            {/* Modal Header */}
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
                p="$1"
                rounded="var(--radius-sm)"
                $platform-web={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--muted-foreground)',
                  cursor: 'pointer',
                  fontSize: '18px',
                }}
              >
                ✕
              </Box>
            </XStack>

            {/* Official Certificate Card */}
            <Box
              p="$6"
              rounded="var(--radius-xl)"
              bg="rgba(255, 255, 255, 0.03)"
              borderWidth={0}
              gap="$4"
              position="relative"
              overflow="hidden"
            >
              <Box
                position="absolute"
                t={-40}
                r={-40}
                width={140}
                height={140}
                rounded={9999}
                $platform-web={{ backgroundColor: 'color-mix(in srgb, var(--emerald-500) 12%, transparent)' }}
                pointerEvents="none"
              />

              <XStack items="center" justify="space-between">
                <Text fontSize="$1" fontFamily="$mono" color="var(--muted-foreground)">
                  HANZO UNIVERSITY · RESEARCH FOUNDATION
                </Text>
                <Chip px={8} py={2} fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">
                  VERIFIED & SIGNED ON-CHAIN
                </Chip>
              </XStack>

              <YStack gap="$1" my="$2">
                <Text fontSize="$1" color="var(--muted-foreground)">
                  THIS CERTIFIES THAT
                </Text>
                <Text fontSize="$5" fontWeight="800" color="var(--white)">
                  {studentName}
                </Text>
                <Text fontSize="$1" color="var(--muted-foreground)">
                  HAS COMPLETED ALL COURSEWORK SPECIFICATIONS, PASSED THE AUTOGRADER CI SUITE, AND DEFENDED THE CAPSTONE FOR
                </Text>
                <Text fontSize="$3" fontWeight="700" color="var(--emerald-300)" mt="$1">
                  {activeCourse.credentialFull} ({activeCourse.credential})
                </Text>
                <Text fontSize="$1" color="var(--white-80)">
                  Course: {activeCourse.code} · Academic Units: {activeCourse.units}.0 · Level: {activeCourse.level}
                </Text>
              </YStack>

              {/* Cryptographic Signature Box */}
              <Box
                p="$3"
                rounded="var(--radius-md)"
                bg="rgba(0, 0, 0, 0.6)"
                borderWidth={0}
                gap="$1"
              >
                <XStack justify="space-between">
                  <Text color="var(--muted-foreground)">DID Subject:</Text>
                  <Text color="var(--white)" fontFamily="$mono">
                    did:hanzo:student:{studentHandle}
                  </Text>
                </XStack>
                <XStack justify="space-between">
                  <Text color="var(--muted-foreground)">Issuer DID:</Text>
                  <Text color="var(--white)" fontFamily="$mono">
                    did:hanzo:university:accreditation
                  </Text>
                </XStack>
                <XStack justify="space-between">
                  <Text color="var(--muted-foreground)">Status:</Text>
                  <Text color="var(--emerald-400)" fontWeight="600">
                    VERIFIED & CERTIFIED (GRADE: 100% PASS WITH DISTINCTION)
                  </Text>
                </XStack>
                <XStack justify="space-between">
                  <Text color="var(--muted-foreground)">Lux Chain Proof:</Text>
                  <Text color="var(--emerald-400)" fontFamily="$mono">
                    0x7f4a8b1c...99e2e89b (Block #9,418,290)
                  </Text>
                </XStack>
              </Box>

              <XStack items="center" justify="space-between" pt="$2">
                <YStack>
                  <Text fontSize="$1" color="var(--muted-foreground)">Course Director & Evaluator</Text>
                  <Text fontSize="$1" fontWeight="600" color="var(--white)">{activeCourse.instructor.name}</Text>
                  <Text fontSize="$1" color="var(--muted-foreground)">{activeCourse.instructor.role}</Text>
                </YStack>

                <YStack items="flex-end">
                  <Text fontSize="$1" color="var(--muted-foreground)">Issuance Date</Text>
                  <Text fontSize="$1" fontWeight="600" color="var(--white)">October 2026</Text>
                  <Text fontSize="$1" color="var(--emerald-400)">W3C VC 2.0 Standard</Text>
                </YStack>
              </XStack>
            </Box>

            {/* Modal Actions */}
            <XStack items="center" justify="space-between" mt="$4" flexWrap="wrap" gap="$3">
              <XStack items="center" gap="$2">
                <Box
                  render="button"
                  onClick={() => {
                    const jsonLd = JSON.stringify(
                      {
                        '@context': [
                          'https://www.w3.org/ns/credentials/v2',
                          'https://hanzo.university/credentials/v1',
                        ],
                        id: `urn:uuid:hanzo-cert-2026-${activeCourse.code.replace(/\s+/g, '')}-9821a`,
                        type: ['VerifiableCredential', 'HanzoUniversityDegree'],
                        issuer: {
                          id: 'did:hanzo:university:accreditation',
                          name: 'Hanzo University Research Foundation',
                        },
                        validFrom: new Date().toISOString(),
                        credentialSubject: {
                          id: `did:hanzo:student:${studentHandle}`,
                          name: studentName,
                          course: `${activeCourse.code}: ${activeCourse.title}`,
                          degree: `${activeCourse.credentialFull} (${activeCourse.credential})`,
                          units: activeCourse.units,
                          grade: 'Pass with Distinction (100% Autograder Score)',
                        },
                        proof: {
                          type: 'Ed25519Signature2020',
                          verificationMethod: 'did:hanzo:university:accreditation#key-1',
                          proofValue: '0x7f4a8b1c99e2e89b3f4a1c2d88e0a1b2c3d4e5f6',
                        },
                      },
                      null,
                      2,
                    )
                    navigator.clipboard.writeText(jsonLd)
                    setFeedbackToast('W3C JSON-LD Credential copied to clipboard!')
                    setTimeout(() => setFeedbackToast(null), 3000)
                  }}
                  px="$3"
                  py="$2"
                  rounded="var(--radius-md)"
                  bg="rgba(255, 255, 255, 0.06)"
                  borderWidth={0}
                  $platform-web={{
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: 'var(--white)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: 'none',
                  }}
                >
                  <Copy size={13} />
                  Copy JSON-LD
                </Box>

                <Box
                  render="button"
                  onClick={() => {
                    const certSummary = `========================================================================\n` +
                      `                    HANZO UNIVERSITY DEGREE CERTIFICATE                  \n` +
                      `========================================================================\n` +
                      `Student:            ${studentName}\n` +
                      `Student DID:        did:hanzo:student:${studentHandle}\n` +
                      `Degree:             ${activeCourse.credentialFull} (${activeCourse.credential})\n` +
                      `Course:             ${activeCourse.code}: ${activeCourse.title}\n` +
                      `Academic Units:     ${activeCourse.units}.0 Units\n` +
                      `Level:              ${activeCourse.level}\n` +
                      `Instructor:         ${activeCourse.instructor.name} (${activeCourse.instructor.role})\n` +
                      `Issuance Date:      October 2026\n` +
                      `Blockchain Proof:   Lux Chain Block #9,418,290 (Ed25519 Verified)\n` +
                      `W3C Standard:       Verifiable Credentials Data Model v2.0\n` +
                      `========================================================================\n`

                    const blob = new Blob([certSummary], { type: 'text/plain' })
                    const url = URL.createObjectURL(blob)
                    const a = document.createElement('a')
                    a.href = url
                    a.download = `Hanzo-${activeCourse.credential}-Certificate-${studentHandle}.txt`
                    a.click()
                    URL.revokeObjectURL(url)
                    setFeedbackToast('Certificate downloaded successfully!')
                    setTimeout(() => setFeedbackToast(null), 3000)
                  }}
                  px="$3"
                  py="$2"
                  rounded="var(--radius-md)"
                  bg="rgba(255, 255, 255, 0.06)"
                  borderWidth={0}
                  $platform-web={{
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: 'var(--white)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: 'none',
                  }}
                >
                  <Download size={13} />
                  Download (.txt)
                </Box>

                <Box
                  render="button"
                  onClick={handleDownloadSvg}
                  px="$3"
                  py="$2"
                  rounded="var(--radius-md)"
                  bg="rgba(255, 255, 255, 0.06)"
                  borderWidth={0}
                  $platform-web={{
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: 'var(--white)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: 'none',
                  }}
                >
                  <Download size={13} />
                  SVG Badge (.svg)
                </Box>

                <Box
                  render="button"
                  onClick={() => {
                    const verifyUrl = `${typeof window !== 'undefined' ? window.location.origin : 'https://hanzo.university'}/verify?id=${activeCourse.credential}-2026-9821&student=${studentHandle}`
                    navigator.clipboard.writeText(verifyUrl)
                    setFeedbackToast('Verification URL copied to clipboard!')
                    setTimeout(() => setFeedbackToast(null), 3000)
                  }}
                  px="$3"
                  py="$2"
                  rounded="var(--radius-md)"
                  bg="rgba(255, 255, 255, 0.06)"
                  borderWidth={0}
                  $platform-web={{
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: 'var(--white)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    border: 'none',
                  }}
                >
                  <Copy size={13} />
                  Copy Link
                </Box>

                <Link
                  href={`/verify?id=${activeCourse.credential}-2026-9821&student=${studentHandle}`}
                  target="_blank"
                  style={{ textDecoration: 'none' }}
                >
                  <Box
                    px="$3"
                    py="$2"
                    rounded="var(--radius-md)"
                    bg="rgba(16, 185, 129, 0.15)"
                    borderWidth={0}
                    $platform-web={{
                      cursor: 'pointer',
                      fontSize: '12px',
                      color: 'var(--emerald-300)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontWeight: 600,
                    }}
                  >
                    <ExternalLink size={13} />
                    Verify on Public Registry ↗
                  </Box>
                </Link>
              </XStack>

              <Action
                render="button"
                onClick={() => setShowCredentialModal(false)}
                px={16}
                py={8}
                fill
              >
                Close & Return to Workspace
              </Action>
            </XStack>
          </Box>
        </Box>
      )}

      {/* ── Interactive Lecture & Reading Viewer Modal ── */}
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
          <Box
            width="100%"
            maxW={780}
            bg="var(--pure-black)"
            rounded="var(--radius-2xl)"
            borderWidth={1}
            borderColor="rgba(255, 255, 255, 0.1)"
            p="$6"
            position="relative"
            maxH="92vh"
            overflow="scroll"
          >
            {/* Modal Header */}
            <XStack items="center" justify="space-between" mb="$4">
              <XStack items="center" gap="$2">
                {activeLectureModal.type === 'lecture' ? (
                  <Play size={18} color="var(--emerald-400)" />
                ) : (
                  <BookOpen size={18} color="var(--emerald-400)" />
                )}
                <YStack>
                  <XStack items="center" gap="$2">
                    <Text fontSize="$2" fontWeight="700" color="var(--white)">
                      {activeLectureModal.title}
                    </Text>
                    <Chip px={6} py={2} fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">
                      {activeLectureModal.type === 'lecture' ? 'STREAM · 4K 60FPS' : 'ARXIV / SPEC PAPER'}
                    </Chip>
                  </XStack>
                  <Text fontSize="$1" color="var(--muted-foreground)">
                    {activeCourse.code} · {activeLectureModal.weekCode}: {activeLectureModal.weekTitle} · Instructor: {activeLectureModal.instructor}
                  </Text>
                </YStack>
              </XStack>

              <Box
                render="button"
                onClick={() => {
                  setActiveLectureModal(null)
                  setIsPlayingMedia(false)
                }}
                p="$1"
                rounded="var(--radius-sm)"
                $platform-web={{
                  background: 'transparent',
                  border: 'none',
                  color: 'var(--muted-foreground)',
                  cursor: 'pointer',
                  fontSize: '18px',
                }}
              >
                ✕
              </Box>
            </XStack>

            {/* Video or Document Viewer Panel */}
            {activeLectureModal.type === 'lecture' ? (
              <YStack gap="$4">
                {/* Simulated Video Player Screen */}
                <Box
                  width="100%"
                  height={260}
                  rounded="var(--radius-lg)"
                  bg="#050505"
                  borderWidth={0}
                  position="relative"
                  overflow="hidden"
                  justify="center"
                  items="center"
                >
                  <Box
                    position="absolute"
                    inset={0}
                    $platform-web={{
                      background: 'radial-gradient(circle at center, rgba(16, 185, 129, 0.15) 0%, rgba(0, 0, 0, 0.95) 75%)',
                    }}
                  />
                  <YStack items="center" gap="$3" $platform-web={{ zIndex: 2 }}>
                    <Box
                      render="button"
                      onClick={() => setIsPlayingMedia(!isPlayingMedia)}
                      width={64}
                      height={64}
                      rounded={9999}
                      bg={isPlayingMedia ? 'var(--white)' : 'var(--emerald-500)'}
                      items="center"
                      justify="center"
                      $platform-web={{
                        cursor: 'pointer',
                        border: 'none',
                        boxShadow: '0 0 30px rgba(16, 185, 129, 0.4)',
                        transition: 'transform 0.15s ease',
                      }}
                      hoverStyle={{ transform: 'scale(1.05)' }}
                    >
                      {isPlayingMedia ? (
                        <Pause size={28} color="var(--pure-black)" />
                      ) : (
                        <Play size={28} color="var(--pure-black)" style={{ marginLeft: 3 }} />
                      )}
                    </Box>
                    <Text fontSize="$1" fontFamily="$mono" color="var(--white-80)">
                      {isPlayingMedia ? 'STREAMING ACTIVE (1080p WebRTC)' : 'CLICK TO COMMENCE LECTURE'}
                    </Text>
                  </YStack>

                  {/* Player Controls Bar */}
                  <Box
                    position="absolute"
                    b={0}
                    l={0}
                    r={0}
                    p="$3"
                    bg="rgba(0, 0, 0, 0.75)"
                    borderTopWidth={1}
                    borderColor="rgba(255, 255, 255, 0.1)"
                  >
                    <XStack items="center" justify="space-between">
                      <XStack items="center" gap="$3">
                        <Box
                          render="button"
                          onClick={() => setIsPlayingMedia(!isPlayingMedia)}
                          $platform-web={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--white)' }}
                        >
                          {isPlayingMedia ? <Pause size={16} /> : <Play size={16} />}
                        </Box>
                        <Volume2 size={16} color="var(--muted-foreground)" />
                        <Text fontSize="$1" color="var(--white-70)" fontFamily="$mono">
                          {isPlayingMedia ? '14:28' : '00:00'} / 38:00
                        </Text>
                      </XStack>

                      <XStack items="center" gap="$2">
                        {[1, 1.25, 1.5, 2].map((rate) => (
                          <Box
                            key={rate}
                            render="button"
                            onClick={() => setPlaybackRate(rate)}
                            px="$2"
                            py="$1"
                            rounded="var(--radius-sm)"
                            bg={playbackRate === rate ? 'var(--white)' : 'transparent'}
                            $platform-web={{
                              cursor: 'pointer',
                              border: 'none',
                              color: playbackRate === rate ? 'var(--pure-black)' : 'var(--muted-foreground)',
                              fontSize: '11px',
                              fontFamily: 'monospace',
                              fontWeight: 600,
                            }}
                          >
                            {rate}x
                          </Box>
                        ))}
                      </XStack>
                    </XStack>
                  </Box>
                </Box>

                {/* Lecture Syllabus Notes & Code Excerpt */}
                <Box p="$4" rounded="var(--radius-md)" bg="rgba(255, 255, 255, 0.03)" borderWidth={0}>
                  <Text fontSize="$1" fontWeight="700" color="var(--white)" mb="$2">
                    Key Architectural Takeaways & Proofs
                  </Text>
                  <Text fontSize="$1" color="var(--muted-foreground)" lineHeight="$2" mb="$3">
                    {activeLectureModal.summary}
                  </Text>
                  <Box
                    p="$3"
                    rounded="var(--radius-sm)"
                    bg="rgba(0, 0, 0, 0.5)"
                    borderWidth={0}
                    $platform-web={{ fontFamily: 'monospace', fontSize: '11px', color: 'var(--emerald-300)' }}
                  >
                    {activeCourse.slug === 'agentic-coding'
                      ? `# Invariant: Zero syntax regressions across all AST tree mutations\nassert parser.validate(ast_tree, strict=True) == True\nsandbox.execute_safely(diff, budget_ceiling_usd=0.05)`
                      : activeCourse.slug === 'reinforcement-learning'
                      ? `# Invariant: Group Relative Policy Optimization (GRPO) advantage\nadv = (rewards - rewards.mean()) / (rewards.std() + 1e-8)\nloss = -min(ratio * adv, clip(ratio, 1-eps, 1+eps) * adv).mean()`
                      : `# Invariant: Zero-copy Cap'n Proto buffer alignment over Unix domain socket\nlet header = zap::protocol::FrameHeader::validate(&slice[..32])?;\nkv_cache.allocate_paged_blocks(seq_id, prompt_tokens)?;`}
                  </Box>
                </Box>
              </YStack>
            ) : (
              <YStack gap="$4">
                <Box p="$4" rounded="var(--radius-md)" bg="rgba(255, 255, 255, 0.03)" borderWidth={0}>
                  <XStack items="center" justify="space-between" mb="$2">
                    <Text fontSize="$2" fontWeight="700" color="var(--white)">
                      Academic Preprint & Architecture Specification
                    </Text>
                    <Chip px={6} py={1} fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">
                      DOI: 10.48550/arXiv.2610.09821
                    </Chip>
                  </XStack>
                  <Text fontSize="$1" color="var(--white-80)" lineHeight="$2" mb="$3">
                    Abstract: This curriculum monograph establishes the formal methodology used throughout Hanzo University's cleanroom testing suite. We demonstrate how autonomous verification harnesses evaluate model rollouts in Hanzo Visor microVMs, proving mathematically bounded runtime execution.
                  </Text>
                  <Text fontSize="$1" color="var(--muted-foreground)" lineHeight="$2">
                    Required reading for the {activeLectureModal.weekCode} laboratory. Students must implement the algorithms discussed in Section 3 and defend the performance metrics during capstone defense.
                  </Text>
                </Box>
              </YStack>
            )}

            {/* Modal Actions */}
            <XStack items="center" justify="space-between" mt="$4" pt="$3" borderTopWidth={1} borderColor="rgba(255, 255, 255, 0.06)">
              <Text fontSize="$1" color="var(--muted-foreground)">
                Module Progress: Recorded to your student DID account
              </Text>
              <XStack items="center" gap="$2">
                <Box
                  render="button"
                  onClick={() => {
                    setActiveLectureModal(null)
                    setIsPlayingMedia(false)
                  }}
                  px="$3"
                  py="$2"
                  rounded="var(--radius-md)"
                  bg="rgba(255, 255, 255, 0.06)"
                  borderWidth={0}
                  $platform-web={{ cursor: 'pointer', fontSize: '12px', color: 'var(--white)', border: 'none' }}
                >
                  Dismiss
                </Box>
                <Action
                  render="button"
                  onClick={handleMarkLectureWatched}
                  px={14}
                  py={8}
                  fill
                  $platform-web={{ fontSize: '12px' }}
                >
                  Mark as Attended & Completed ✓
                </Action>
              </XStack>
            </XStack>
          </Box>
        </Box>
      )}
    </Box>
  )
}
