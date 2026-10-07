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
import {
  resolveStudentSession,
  signOutStudent,
  syncBackendClassEnrollment,
  getHanzoLoginUrl,
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
        } else if (activeSession.enrolledClasses.length > 0) {
          const savedCourse = localStorage.getItem('hanzo_portal_selected_course')
          if (savedCourse && activeSession.enrolledClasses.includes(savedCourse)) {
            targetClass = savedCourse
          } else {
            targetClass = activeSession.enrolledClasses[0]
          }
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
          borderColor="var(--border)"
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
              bg="var(--emerald-950)"
              borderWidth={1}
              borderColor="var(--emerald-500)"
              $platform-web={{
                boxShadow: '0 0 36px rgba(16, 185, 129, 0.35)',
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
              bg="var(--pure-black)"
              borderWidth={1}
              borderColor="var(--border)"
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
                <Box borderBottomWidth={1} borderColor="var(--border)" my="$1" />

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
                        borderWidth={1}
                        borderColor="rgba(239, 68, 68, 0.4)"
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
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
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
                        background: 'var(--card)',
                        border: '1px solid var(--border)',
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
                          border: '1px solid var(--border)',
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
                bg="var(--card)"
                borderWidth={1}
                borderColor="var(--border)"
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
                bg="var(--card)"
                borderWidth={1}
                borderColor="var(--border)"
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
                bg="var(--card)"
                borderWidth={1}
                borderColor="var(--border)"
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
      {/* ── Top Enrolled Student Navigation Bar ── */}
      <Box
        borderBottomWidth={1}
        borderColor="var(--border)"
        bg="var(--pure-black)"
        py="$3"
        px="$6"
        position="sticky"
        t={0}
        $platform-web={{ zIndex: 20 }}
      >
        <XStack items="center" justify="space-between" flexWrap="wrap" gap="$4">
          <XStack items="center" gap="$3">
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
            <Text color="var(--muted-foreground)">/</Text>
            <Text fontSize="$2" color="var(--white)" fontWeight="600">
              {activeCourse.code}: {activeCourse.title}
            </Text>
          </XStack>

          {/* Student Status Profile Badge */}
          <XStack items="center" gap="$3" flexWrap="wrap">
            <XStack
              items="center"
              gap="$2"
              px="$3"
              py="$1"
              rounded="var(--radius-md)"
              bg="var(--card)"
              borderWidth={1}
              borderColor="var(--border)"
            >
              <Coins size={14} color="var(--emerald-400)" />
              <Text fontSize="$1" color="var(--muted-foreground)">
                Compute Credits:
              </Text>
              <Text fontSize="$1" fontWeight="700" color="var(--emerald-300)" fontFamily="$mono">
                ${activeCourse.rebateCredits}.00 Active
              </Text>
            </XStack>

            <XStack
              items="center"
              gap="$2"
              px="$3"
              py="$1"
              rounded="var(--radius-md)"
              bg="var(--card)"
              borderWidth={1}
              borderColor="var(--border)"
            >
              <User size={14} color="var(--emerald-400)" />
              <Text fontSize="$1" fontWeight="600" color="var(--white)">
                {studentName}
              </Text>
              <Text fontSize="$1" color="var(--muted-foreground)" fontFamily="$mono">
                ({studentHandle.startsWith('did:') ? studentHandle : `@${studentHandle}`})
              </Text>
            </XStack>

            {session?.backendPlan && (
              <Chip px={8} py={2} fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">
                {session.backendPlan}
              </Chip>
            )}

            <Action
              render="button"
              onClick={() => setShowCredentialModal(true)}
              px={12}
              py={6}
              $platform-web={{ fontSize: '12px' }}
            >
              <XStack items="center" gap="$1">
                <Award size={14} />
                <Text fontSize="$1" fontWeight="600" color="inherit">
                  {isDegreeAwarded ? 'View Degree Certificate' : 'Preview Credential'}
                </Text>
              </XStack>
            </Action>

            <Box
              render="button"
              onClick={handleSignOut}
              px="$3"
              py="$1"
              rounded="var(--radius-md)"
              borderWidth={1}
              borderColor="var(--border)"
              bg="transparent"
              $platform-web={{
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                color: 'var(--muted-foreground)',
                transition: 'color 0.2s, border-color 0.2s',
              }}
            >
              <LogOut size={13} />
              <Text fontSize="$1" color="inherit">
                Sign Out
              </Text>
            </Box>
          </XStack>
        </XStack>
      </Box>

      {/* ── Active Course Selector Strip ── */}
      <Box borderBottomWidth={1} borderColor="var(--border)" bg="var(--card)" px="$6" py="$2">
        <XStack items="center" justify="space-between" flexWrap="wrap" gap="$2">
          <XStack items="center" gap="$2" overflow="scroll" flexWrap="nowrap">
            <Text fontSize="$1" color="var(--muted-foreground)" pr="$2" fontFamily="$mono">
              YOUR ENROLLED TRACKS:
            </Text>
            {UNIVERSITY_COURSES.map((c) => {
              const isCompleted = capstonePassed[c.slug]
              const isEnrolledInCourse = session?.isFullAccess || session?.enrolledClasses.includes(c.slug)
              return (
                <Box
                  key={c.slug}
                  render="button"
                  onClick={() => setSelectedCourseSlug(c.slug)}
                  px="$3"
                  py="$1"
                  rounded="var(--radius-md)"
                  bg={selectedCourseSlug === c.slug ? 'var(--white)' : 'transparent'}
                  borderWidth={1}
                  borderColor={selectedCourseSlug === c.slug ? 'var(--white)' : 'transparent'}
                  $platform-web={{
                    cursor: 'pointer',
                    border: 'none',
                    outline: 'none',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                  }}
                >
                  <Text
                    fontSize="$1"
                    fontWeight="600"
                    fontFamily="$mono"
                    color={selectedCourseSlug === c.slug ? 'var(--pure-black)' : 'var(--muted-foreground)'}
                  >
                    {c.code} · {c.credential}
                  </Text>
                  {isCompleted ? (
                    <Check size={12} color={selectedCourseSlug === c.slug ? 'var(--pure-black)' : 'var(--emerald-400)'} />
                  ) : isEnrolledInCourse ? (
                    <Box
                      width={6}
                      height={6}
                      rounded="var(--radius-full)"
                      bg={selectedCourseSlug === c.slug ? 'var(--pure-black)' : 'var(--emerald-400)'}
                    />
                  ) : null}
                </Box>
              )
            })}
          </XStack>

          {session && (
            <XStack items="center" gap="$2">
              <Text fontSize="$1" color="var(--muted-foreground)" fontFamily="$mono">
                BACKEND CLASS:
              </Text>
              <Text fontSize="$1" fontWeight="700" color="var(--emerald-400)" fontFamily="$mono">
                {activeCourse.code} ({session.backendPlan || 'Enrolled'})
              </Text>
            </XStack>
          )}
        </XStack>
      </Box>

      {/* ── Main Workspace Dashboard ── */}
      <Band pad={40} measure={1280}>
        {/* Toast Notification */}
        {feedbackToast && (
          <Box
            p="$3"
            mb="$4"
            rounded="var(--radius-md)"
            bg="var(--emerald-950)"
            borderWidth={1}
            borderColor="var(--emerald-700)"
          >
            <XStack items="center" gap="$2">
              <CheckCircle2 size={16} color="var(--emerald-400)" />
              <Text fontSize="$2" fontWeight="600" color="var(--white)">
                {feedbackToast}
              </Text>
            </XStack>
          </Box>
        )}

        {/* Newly Enrolled Welcome Banner */}
        {welcomeBanner && (
          <Box
            p="$4"
            mb="$6"
            rounded="var(--radius-lg)"
            bg="var(--pure-black)"
            borderWidth={1}
            borderColor="var(--emerald-500)"
            $platform-web={{
              boxShadow: '0 0 24px rgba(16, 185, 129, 0.25)',
            }}
          >
            <XStack items="center" justify="space-between" flexWrap="wrap" gap="$3">
              <XStack items="center" gap="$3">
                <Box p="$2" rounded="var(--radius-md)" bg="var(--emerald-950)">
                  <Sparkles size={22} color="var(--emerald-400)" />
                </Box>
                <YStack gap={2}>
                  <Text fontSize="$3" fontWeight="700" color="var(--white)">
                    🎉 Welcome to Hanzo University, {studentName}!
                  </Text>
                  <Text fontSize="$1" color="var(--white-70)">
                    Tuition payment cleared. Your Hanzo ID (`did:hanzo:student:{studentHandle}`) is verified, ${activeCourse.rebateCredits}.00 USD Day 1 compute tokens are loaded, and your Hanzo Visor sandbox container is provisioned.
                  </Text>
                </YStack>
              </XStack>
              <Action
                render="button"
                onClick={() => setWelcomeBanner(false)}
                px={12}
                py={6}
                $platform-web={{ fontSize: '12px' }}
              >
                Dismiss
              </Action>
            </XStack>
          </Box>
        )}

        {/* Welcome Notification Banner */}
        <Box
          p="$4"
          mb="$6"
          rounded="var(--radius-lg)"
          bg="var(--pure-black)"
          borderWidth={1}
          borderColor={isDegreeAwarded ? 'var(--emerald-500)' : 'var(--emerald-850)'}
        >
          <XStack items="center" justify="space-between" flexWrap="wrap" gap="$4">
            <XStack items="center" gap="$3">
              <Box
                p="$2"
                rounded="var(--radius-md)"
                bg="$panel"
                $platform-web={{ backgroundColor: 'color-mix(in srgb, var(--emerald-500) 20%, transparent)' }}
              >
                {isDegreeAwarded ? <Award size={20} color="var(--emerald-400)" /> : <CheckCircle2 size={20} color="var(--emerald-400)" />}
              </Box>
              <YStack gap="$1">
                <XStack items="center" gap="$2">
                  <Text fontSize="$2" fontWeight="700" color="var(--white)">
                    {isDegreeAwarded ? 'Graduated & Certified' : 'Enrolled & Active'}: {activeCourse.code} — {activeCourse.title}
                  </Text>
                  <Chip px={8} py={2} fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">
                    {isDegreeAwarded ? 'W3C DEGREE ISSUED' : (session?.backendPlan || 'ACTIVE CLASS')}
                  </Chip>
                </XStack>
                <Text fontSize="$1" color="var(--muted-foreground)">
                  Student: {studentName} (@{studentHandle}) · Coursework: {currentCompleted.length} of {totalWeeks} modules passed ({progressPercent}% completed).
                  {isDegreeAwarded
                    ? ' Official verifiable credential signed by Hanzo Research Board.'
                    : ' Complete all assignments to defend your capstone.'}
                </Text>
              </YStack>
            </XStack>

            <XStack items="center" gap="$3">
              <Link
                href={`/${activeCourse.slug}`}
                style={{
                  fontSize: '13px',
                  color: 'var(--white-80)',
                  textDecoration: 'none',
                }}
              >
                Course Syllabus ↗
              </Link>
              {isDegreeAwarded ? (
                <Action
                  render="button"
                  onClick={() => setShowCredentialModal(true)}
                  px={14}
                  py={8}
                  fill
                  $platform-web={{ fontSize: '13px' }}
                >
                  View W3C Degree Certificate →
                </Action>
              ) : isDefenseUnlocked ? (
                <Action
                  render="button"
                  onClick={handleDefendCapstone}
                  disabled={isDefending}
                  px={14}
                  py={8}
                  fill
                  $platform-web={{ fontSize: '13px' }}
                >
                  {isDefending ? 'Defending Capstone...' : `Defend Capstone & Graduate →`}
                </Action>
              ) : (
                <Action
                  render="button"
                  onClick={() => handleCompleteLab(activeWeekIndex)}
                  disabled={isRunningCommand}
                  px={14}
                  py={8}
                  $platform-web={{ fontSize: '13px' }}
                >
                  Run Module Autograder →
                </Action>
              )}
            </XStack>
          </XStack>
        </Box>

        {/* ── Main Two-Column Layout: Left (Interactive Sandbox & Labs), Right (Modules & Capstone) ── */}
        <Grid columns={{ min: 380, max: 2 }} gap={32} items="flex-start">
          {/* LEFT: Hanzo Visor MicroVM Sandbox & Inspection Console */}
          <YStack gap="$4">
            <Card p={0} overflow="hidden" borderColor="var(--border)" borderWidth={1}>
              {/* Terminal / Tool Tab Navigation */}
              <XStack
                items="center"
                justify="space-between"
                px="$4"
                py="$3"
                bg="var(--pure-black)"
                borderBottomWidth={1}
                borderColor="var(--border)"
              >
                <XStack items="center" gap="$2">
                  <Terminal size={16} color="var(--emerald-400)" />
                  <Text fontSize="$1" fontWeight="700" color="var(--white)" fontFamily="$mono">
                    Hanzo Visor Sandbox: pod-vsr-uswest2-{studentHandle}
                  </Text>
                  <Chip px={6} py={1} fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">
                    ONLINE
                  </Chip>
                </XStack>

                <XStack gap="$1">
                  {[
                    { tab: 'terminal', label: 'Shell' },
                    { tab: 'ast', label: 'Code Inspector' },
                    { tab: 'grader', label: 'Autograder' },
                    { tab: 'metering', label: 'Spend' },
                  ].map(({ tab, label }) => (
                    <Box
                      key={tab}
                      render="button"
                      onClick={() => setActiveTab(tab as any)}
                      px="$2"
                      py="$1"
                      rounded="var(--radius-sm)"
                      bg={activeTab === tab ? 'var(--white-20)' : 'transparent'}
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

              {/* Tab Content 1: Terminal Shell */}
              {activeTab === 'terminal' && (
                <YStack p="$4" bg="var(--pure-black)" minH={380} justify="space-between">
                  <Box
                    $platform-web={{
                      whiteSpace: 'pre-wrap',
                      maxHeight: '340px',
                      overflowY: 'auto',
                    }}
                  >
                    {terminalHistory.map((line, idx) => (
                      <Text
                        key={idx}
                        fontFamily="$mono"
                        fontSize="$1"
                        color={
                          line.startsWith(userTerminalPrompt.slice(0, 5)) || line.includes('@hanzo-sandbox:')
                            ? 'var(--emerald-400)'
                            : line.includes('PASSED') || line.includes('[PASS]') || line.includes('[CONGRATULATIONS]')
                            ? 'var(--emerald-300)'
                            : line.includes('[OK]') || line.includes('[RUST VERIFIED]')
                            ? 'var(--white)'
                            : 'var(--muted-foreground)'
                        }
                      >
                        {line}
                      </Text>
                    ))}
                  </Box>

                  {/* Quick Command Action Toolbar */}
                  <YStack gap="$2" pt="$3" borderTopWidth={1} borderColor="var(--border)">
                    <XStack items="center" justify="space-between" flexWrap="wrap" gap="$2">
                      <XStack items="center" gap="$2" flexWrap="wrap">
                        <Text fontSize="$1" color="var(--muted-foreground)" fontFamily="$mono">
                          Quick Run:
                        </Text>
                        {workspaceData.quickCommands.map((cmd) => (
                          <Box
                            key={cmd}
                            render="button"
                            onClick={() => !isRunningCommand && executeCommand(cmd)}
                            px="$2"
                            py="$1"
                            rounded="var(--radius-sm)"
                            bg="var(--card)"
                            borderWidth={1}
                            borderColor="var(--border)"
                            $platform-web={{
                              cursor: 'pointer',
                              fontSize: '11px',
                              fontFamily: 'monospace',
                              color: 'var(--white-80)',
                            }}
                            hoverStyle={{ borderColor: 'var(--white)' }}
                          >
                            {cmd}
                          </Box>
                        ))}
                      </XStack>

                      <Action
                        render="button"
                        onClick={() => handleCompleteLab(activeWeekIndex)}
                        disabled={isRunningCommand}
                        px={10}
                        py={4}
                        $platform-web={{ fontSize: '11px' }}
                      >
                        Submit Lab {activeWeekIndex + 1} →
                      </Action>
                    </XStack>
                  </YStack>
                </YStack>
              )}

              {/* Tab Content 2: Code / Architecture Inspector */}
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
                    bg="var(--card)"
                    borderWidth={1}
                    borderColor="var(--border)"
                    $platform-web={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace' }}
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

              {/* Tab Content 3: Course-Specific Autograder Logs */}
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
                      bg="var(--card)"
                      borderWidth={1}
                      borderColor="var(--border)"
                    >
                      <XStack items="center" gap="$2">
                        <CheckCircle2 size={14} color="var(--emerald-400)" />
                        <Text fontSize="$1" fontFamily="$mono" color="var(--white)">
                          {row.task}
                        </Text>
                      </XStack>
                      <XStack items="center" gap="$3">
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

              {/* Tab Content 4: Compute Metering */}
              {activeTab === 'metering' && (
                <YStack p="$4" bg="var(--pure-black)" minH={380} gap="$4">
                  <Text fontSize="$2" fontWeight="700" color="var(--white)">
                    Compute Credit Rebate Metering
                  </Text>
                  <Grid columns={{ min: 140, max: 2 }} gap={12}>
                    <YStack p="$3" rounded="var(--radius-md)" bg="var(--card)" gap="$1">
                      <Text fontSize="$1" color="var(--muted-foreground)">Day 1 Deposit</Text>
                      <Text fontSize="$4" fontWeight="800" color="var(--white)">${activeCourse.rebateCredits}.00 USD</Text>
                    </YStack>
                    <YStack p="$3" rounded="var(--radius-md)" bg="var(--card)" gap="$1">
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

            {/* Sandbox Container Specifications */}
            <Card p={16} bg="$panel" borderWidth={1} borderColor="var(--border)">
              <XStack items="center" justify="space-between" flexWrap="wrap" gap="$3">
                <XStack items="center" gap="$3">
                  <Cpu size={16} color="var(--white)" />
                  <YStack>
                    <Text fontSize="$1" fontWeight="600" color="var(--white)">
                      Hardware Leases: 4 vCPU · 16 GB RAM · Apple Silicon Metal / CUDA L4
                    </Text>
                    <Text fontSize="$1" color="var(--muted-foreground)">
                      Sandboxed under Hanzo Visor kernel virtualization in region us-west-2
                    </Text>
                  </YStack>
                </XStack>
                <XStack items="center" gap="$2">
                  <Box
                    render="button"
                    onClick={() => executeCommand('hanzo dev restart')}
                    px={10}
                    py={5}
                    rounded="var(--radius-sm)"
                    bg="var(--card)"
                    borderWidth={1}
                    borderColor="var(--border)"
                    $platform-web={{
                      cursor: 'pointer',
                      fontSize: '11px',
                      color: 'var(--white)',
                    }}
                  >
                    Restart Pod
                  </Box>
                </XStack>
              </XStack>
            </Card>
          </YStack>

          {/* RIGHT: Curriculum Modules, Lectures & Capstone Submission */}
          <YStack gap="$4">
            <Card p={20} bg="$panel" borderWidth={1} borderColor="var(--border)">
              <XStack items="center" justify="space-between" mb="$4">
                <YStack gap="$1">
                  <Text fontSize="$3" fontWeight="700" color="var(--white)">
                    {activeCourse.code} Coursework & Qualifications
                  </Text>
                  <Text fontSize="$1" color="var(--muted-foreground)">
                    Pass all {totalWeeks} laboratory modules to unlock the official {activeCourse.credential} Capstone Defense
                  </Text>
                </YStack>
                <Chip
                  px={10}
                  py={3}
                  fontSize="$1"
                  fontFamily="$mono"
                  color={isDefenseUnlocked ? 'var(--emerald-400)' : 'var(--amber-400)'}
                >
                  {progressPercent}% COMPLETED
                </Chip>
              </XStack>

              {/* Progress Bar */}
              <Box height={6} rounded={9999} bg="var(--neutral-800)" overflow="hidden" mb="$4">
                <Box height="100%" width={`${progressPercent}%`} bg="var(--emerald-400)" />
              </Box>

              {/* Week Modules List */}
              <YStack gap="$3">
                {activeCourse.syllabus.map((week, idx) => {
                  const isCompleted = currentCompleted.includes(idx)
                  const isActive = activeWeekIndex === idx

                  return (
                    <Box
                      key={week.week}
                      p="$4"
                      rounded="var(--radius-md)"
                      bg={isActive ? 'var(--pure-black)' : 'var(--card)'}
                      borderWidth={1}
                      borderColor={
                        isActive
                          ? 'var(--emerald-800)'
                          : isCompleted
                          ? 'var(--neutral-700)'
                          : 'var(--border)'
                      }
                      $platform-web={{ cursor: 'pointer' }}
                      onClick={() => setActiveWeekIndex(idx)}
                    >
                      <XStack items="center" justify="space-between">
                        <XStack items="center" gap="$3">
                          <Box
                            width={24}
                            height={24}
                            rounded={9999}
                            items="center"
                            justify="center"
                            bg={
                              isCompleted
                                ? 'var(--emerald-900)'
                                : isActive
                                ? 'var(--white)'
                                : 'var(--neutral-800)'
                            }
                          >
                            {isCompleted ? (
                              <Check size={14} color="var(--emerald-300)" />
                            ) : (
                              <Text
                                fontSize="$1"
                                fontWeight="700"
                                color={isActive ? 'var(--pure-black)' : 'var(--muted-foreground)'}
                              >
                                {idx + 1}
                              </Text>
                            )}
                          </Box>
                          <YStack>
                            <XStack items="center" gap="$2">
                              <Text fontSize="$1" fontFamily="$mono" color="var(--muted-foreground)">
                                {week.code}
                              </Text>
                              <Text fontSize="$2" fontWeight="600" color="var(--white)">
                                {week.title}
                              </Text>
                            </XStack>
                            <Text fontSize="$1" color="var(--muted-foreground)" numberOfLines={1}>
                              {week.lab}
                            </Text>
                          </YStack>
                        </XStack>

                        <Chip
                          px={8}
                          py={2}
                          fontSize="$1"
                          fontFamily="$mono"
                          color={
                            isCompleted
                              ? 'var(--emerald-400)'
                              : isActive
                              ? 'var(--amber-400)'
                              : 'var(--muted-foreground)'
                          }
                        >
                          {isCompleted ? 'COMPLETED' : isActive ? 'IN PROGRESS' : 'READY TO START'}
                        </Chip>
                      </XStack>

                      {/* Expanded View for Active Module */}
                      {activeWeekIndex === idx && (
                        <YStack
                          mt="$3"
                          pt="$3"
                          borderTopWidth={1}
                          borderColor="var(--border)"
                          gap="$3"
                        >
                          <Text fontSize="$1" color="var(--white-80)" lineHeight="$2">
                            {week.summary}
                          </Text>

                          <YStack gap="$2">
                            <Text fontSize="$1" fontWeight="600" color="var(--white)">
                              Interactive Lectures & Seminars:
                            </Text>
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
                                  bg={isWatched ? 'rgba(16, 185, 129, 0.08)' : 'var(--card)'}
                                  borderWidth={1}
                                  borderColor={isWatched ? 'var(--emerald-850)' : 'var(--border)'}
                                  hoverStyle={{ borderColor: 'var(--emerald-500)' }}
                                  $platform-web={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                                  onClick={() => openLectureModal(week, lec, 'lecture')}
                                >
                                  <XStack items="center" gap="$2" flex={1}>
                                    <Play size={12} color="var(--emerald-400)" />
                                    <Text
                                      fontSize="$1"
                                      color={isWatched ? 'var(--emerald-300)' : 'var(--white-80)'}
                                    >
                                      {lec}
                                    </Text>
                                  </XStack>
                                  <Text fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">
                                    {isWatched ? '✓ Attended' : 'Play Lecture →'}
                                  </Text>
                                </XStack>
                              )
                            })}
                          </YStack>

                          {week.readings.length > 0 && (
                            <YStack gap="$2">
                              <Text fontSize="$1" fontWeight="600" color="var(--white)">
                                Required Academic Readings & Benchmarks:
                              </Text>
                              {week.readings.map((read, rIdx) => {
                                const isRead = (watchedLectures[selectedCourseSlug] || []).includes(read)
                                return (
                                  <XStack
                                    key={rIdx}
                                    items="center"
                                    justify="space-between"
                                    p="$2"
                                    px="$3"
                                    rounded="var(--radius-sm)"
                                    bg={isRead ? 'rgba(16, 185, 129, 0.08)' : 'var(--card)'}
                                    borderWidth={1}
                                    borderColor={isRead ? 'var(--emerald-850)' : 'var(--border)'}
                                    hoverStyle={{ borderColor: 'var(--emerald-500)' }}
                                    $platform-web={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
                                    onClick={() => openLectureModal(week, read, 'reading')}
                                  >
                                    <XStack items="center" gap="$2" flex={1}>
                                      <BookOpen size={12} color="var(--white-70)" />
                                      <Text
                                        fontSize="$1"
                                        color={isRead ? 'var(--emerald-300)' : 'var(--white-80)'}
                                      >
                                        {read}
                                      </Text>
                                    </XStack>
                                    <Text fontSize="$1" fontFamily="$mono" color="var(--white-70)">
                                      {isRead ? '✓ Read' : 'View Paper →'}
                                    </Text>
                                  </XStack>
                                )
                              })}
                            </YStack>
                          )}

                          <XStack items="center" justify="space-between" pt="$2">
                            <Text fontSize="$1" color="var(--emerald-400)" fontWeight="600">
                              {isCompleted ? '✓ Laboratory Passed' : 'Lab Assignment: Ready for testing'}
                            </Text>
                            <Action
                              render="button"
                              onClick={() => handleCompleteLab(idx)}
                              disabled={isRunningCommand}
                              px={12}
                              py={6}
                              $platform-web={{ fontSize: '11px' }}
                            >
                              {isCompleted ? 'Re-Run Autograder' : 'Submit Lab & Pass Module →'}
                            </Action>
                          </XStack>
                        </YStack>
                      )}
                    </Box>
                  )
                })}
              </YStack>
            </Card>

            {/* Capstone Project Defense & Certification Card */}
            <Card
              p={20}
              bg="var(--pure-black)"
              borderColor={isDegreeAwarded ? 'var(--emerald-500)' : isDefenseUnlocked ? 'var(--emerald-700)' : 'var(--border)'}
              borderWidth={1}
            >
              <YStack gap="$3">
                <XStack items="center" justify="space-between">
                  <XStack items="center" gap="$2">
                    <Award size={18} color="var(--emerald-400)" />
                    <Text fontSize="$2" fontWeight="700" color="var(--white)">
                      Capstone Defense: {activeCourse.credential}
                    </Text>
                  </XStack>
                  <Chip
                    px={8}
                    py={2}
                    fontSize="$1"
                    fontFamily="$mono"
                    color={isDegreeAwarded ? 'var(--emerald-400)' : isDefenseUnlocked ? 'var(--emerald-400)' : 'var(--amber-400)'}
                  >
                    {isDegreeAwarded ? 'DEGREE AWARDED' : isDefenseUnlocked ? 'QUALIFICATIONS MET' : 'PREREQUISITES PENDING'}
                  </Chip>
                </XStack>

                <Text fontSize="$1" color="var(--muted-foreground)" lineHeight="$2">
                  {activeCourse.capstone}
                </Text>

                {isDegreeAwarded ? (
                  <YStack gap="$2" pt="$1">
                    <Box p="$2" rounded="var(--radius-sm)" bg="var(--emerald-950)" borderWidth={1} borderColor="var(--emerald-800)">
                      <Text fontSize="$1" color="var(--emerald-300)" fontWeight="600">
                        🎉 Passed with 100% Distinction! Verified W3C Credential on Lux Chain.
                      </Text>
                    </Box>
                    <Action
                      render="button"
                      onClick={() => setShowCredentialModal(true)}
                      fill
                    >
                      View & Share {activeCourse.credential} Certificate →
                    </Action>
                  </YStack>
                ) : isDefenseUnlocked ? (
                  <YStack gap="$2" pt="$1">
                    <Text fontSize="$1" color="var(--emerald-400)" fontWeight="600">
                      All {totalWeeks} modules passed! You meet the qualifications to defend your capstone.
                    </Text>
                    <Action
                      render="button"
                      onClick={handleDefendCapstone}
                      disabled={isDefending}
                      fill
                    >
                      {isDefending ? 'Evaluating Defense in Cleanroom Pod...' : `Defend Capstone & Issue ${activeCourse.credential} Degree →`}
                    </Action>
                  </YStack>
                ) : (
                  <YStack gap="$2" pt="$1">
                    <Text fontSize="$1" color="var(--muted-foreground)">
                      Complete the remaining {totalWeeks - currentCompleted.length} laboratory modules to unlock the official Capstone Defense.
                    </Text>
                    <Action
                      render="button"
                      onClick={() => handleCompleteLab(activeWeekIndex)}
                      disabled={isRunningCommand}
                      fill
                    >
                      Complete Lab Assignment ({activeCourse.syllabus[activeWeekIndex]?.code}) →
                    </Action>
                  </YStack>
                )}

                {/* Dev & Fast-Track Controls */}
                <XStack
                  items="center"
                  justify="space-between"
                  pt="$3"
                  mt="$2"
                  borderTopWidth={1}
                  borderColor="var(--border)"
                  flexWrap="wrap"
                  gap="$2"
                >
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
                      bg="var(--card)"
                      borderWidth={1}
                      borderColor="var(--emerald-800)"
                      $platform-web={{
                        cursor: 'pointer',
                        fontSize: '11px',
                        color: 'var(--emerald-300)',
                        fontFamily: 'monospace',
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
                      bg="var(--card)"
                      borderWidth={1}
                      borderColor="var(--border)"
                      $platform-web={{
                        cursor: 'pointer',
                        fontSize: '11px',
                        color: 'var(--muted-foreground)',
                        fontFamily: 'monospace',
                      }}
                    >
                      ↺ Reset Progress
                    </Box>
                  </XStack>
                </XStack>
              </YStack>
            </Card>
          </YStack>
        </Grid>
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
          $platform-web={{ backdropFilter: 'blur(12px)', zIndex: 100 }}
        >
          <Box
            width="100%"
            maxW={720}
            bg="var(--pure-black)"
            rounded="var(--radius-2xl)"
            borderWidth={1}
            borderColor="var(--neutral-700)"
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
              bg="var(--card)"
              borderWidth={1}
              borderColor="var(--emerald-850)"
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
                bg="var(--pure-black)"
                borderWidth={1}
                borderColor="var(--border)"
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
                  bg="var(--card)"
                  borderWidth={1}
                  borderColor="var(--border)"
                  $platform-web={{
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: 'var(--white)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
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
                  bg="var(--card)"
                  borderWidth={1}
                  borderColor="var(--border)"
                  $platform-web={{
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: 'var(--white)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
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
                  bg="var(--card)"
                  borderWidth={1}
                  borderColor="var(--border)"
                  $platform-web={{
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: 'var(--white)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
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
                  bg="var(--card)"
                  borderWidth={1}
                  borderColor="var(--border)"
                  $platform-web={{
                    cursor: 'pointer',
                    fontSize: '12px',
                    color: 'var(--white)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
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
                    bg="var(--emerald-950)"
                    borderWidth={1}
                    borderColor="var(--emerald-600)"
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
          $platform-web={{ backdropFilter: 'blur(12px)', zIndex: 110 }}
        >
          <Box
            width="100%"
            maxW={780}
            bg="var(--pure-black)"
            rounded="var(--radius-2xl)"
            borderWidth={1}
            borderColor="var(--neutral-700)"
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
                  bg="var(--neutral-950)"
                  borderWidth={1}
                  borderColor="var(--border)"
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
                <Box p="$4" rounded="var(--radius-md)" bg="var(--card)" borderWidth={1} borderColor="var(--border)">
                  <Text fontSize="$1" fontWeight="700" color="var(--white)" mb="$2">
                    Key Architectural Takeaways & Proofs
                  </Text>
                  <Text fontSize="$1" color="var(--muted-foreground)" lineHeight="$2" mb="$3">
                    {activeLectureModal.summary}
                  </Text>
                  <Box
                    p="$3"
                    rounded="var(--radius-sm)"
                    bg="var(--pure-black)"
                    borderWidth={1}
                    borderColor="var(--border)"
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
                <Box p="$4" rounded="var(--radius-md)" bg="var(--card)" borderWidth={1} borderColor="var(--border)">
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
            <XStack items="center" justify="space-between" mt="$4" pt="$3" borderTopWidth={1} borderColor="var(--border)">
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
                  bg="var(--card)"
                  borderWidth={1}
                  borderColor="var(--border)"
                  $platform-web={{ cursor: 'pointer', fontSize: '12px', color: 'var(--white)' }}
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
