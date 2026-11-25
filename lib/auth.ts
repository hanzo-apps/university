/**
 * Hanzo University Student Authentication & Backend Class Resolution
 *
 * Manages authentic OIDC / IAM user sessions, JWT extraction of student display names
 * and handles, token verification, and backend course enrollment mapping across all 25 courses.
 */

import { CERTIFICATION_TRACKS, UNIVERSITY_COURSES } from '../app/courses-data'

export interface StudentSession {
  isAuthenticated: boolean
  token?: string
  sub?: string
  name: string
  handle: string
  email: string
  did: string
  enrolledClasses: string[]
  backendPlan?: string
  isFullAccess?: boolean
  source: 'iam_token' | 'checkout' | 'manual'
}

/** Mapping of Hanzo billing plan IDs to University course slugs (or arrays of slugs for tracks) */
export const PLAN_TO_COURSE_SLUGS: Record<string, string[]> = {
  // Free foundation
  'course-auto-101': ['continuous-improvement'],
  // Intelligence Engineering
  'course-kai-201': ['kai-decision-intelligence'],
  'course-kai-301': ['kai-training-decision-models'],
  'course-ens-201': ['enso-adaptive-intelligence'],
  'course-ens-301': ['enso-training-orchestrators'],
  'course-zen-201': ['zen-model-engineering'],
  'course-zen-301': ['zen-native-training'],
  'course-ml-401': ['ml-systems'],
  'course-eng-100': ['agentic-coding'],
  'course-ag-101': ['agentic-coding'],
  'course-rl-101': ['reinforcement-learning'],
  'course-rl-102': ['reinforcement-learning'],
  'course-sys-103': ['systems-engineering'],
  // Autonomous Science
  'course-sci-101': ['science-discovery'],
  'course-sci-201': ['autonomous-research'],
  'course-sci-301': ['research-autopilot'],
  'course-sci-401': ['recursive-improvement'],
  // Cybersecurity
  'course-cyb-101': ['ai-security-fundamentals'],
  'course-cyb-201': ['agentic-cybersecurity'],
  'course-cyb-301': ['autonomous-secops'],
  'course-cyb-401': ['sovereign-zero-trust-ai'],
  // Business & Entrepreneurship
  'course-auto-201': ['business-autopilot'],
  'course-auto-301': ['autonomous-organizations'],
  'course-ent-401': ['build-your-ai-company'],
  'course-mkt-102': ['agentic-marketing'],
  'course-mkt-104': ['agentic-marketing'],
  'course-pra-104': ['ai-practitioner'],
  'course-arc-105': ['ai-architect'],
  // Direct slugs
  ...Object.fromEntries(UNIVERSITY_COURSES.map((c) => [c.slug, [c.slug]])),
  // Certification Tracks
  ...Object.fromEntries(CERTIFICATION_TRACKS.map((t) => [t.planId, t.courseSlugs])),
  ...Object.fromEntries(CERTIFICATION_TRACKS.map((t) => [t.slug, t.courseSlugs])),
}

/** Legacy single-slug map preserved for backward compatibility */
export const PLAN_TO_COURSE_SLUG: Record<string, string> = Object.fromEntries(
  Object.entries(PLAN_TO_COURSE_SLUGS).map(([k, v]) => [k, v[0]])
)

/** Parse and validate JWT token claims without external dependencies */
export function parseJwt(token: string): Record<string, any> | null {
  try {
    const parts = token.trim().split('.')
    if (parts.length < 2) return null
    const base64Url = parts[1]
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    )
    return JSON.parse(jsonPayload)
  } catch {
    return null
  }
}

/** Format raw name or email username into human-readable Display Name */
export function formatHumanName(raw: string): string {
  if (!raw) return 'Student'
  const clean = raw.includes('@') ? raw.split('@')[0] : raw
  const spaced = clean.replace(/[._-]+/g, ' ').trim()
  if (!spaced) return 'Student'
  return spaced
    .split(' ')
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
}

/**
 * Retrieve the list of courses explicitly enrolled / paid for by the student.
 * Stored in localStorage under `hanzo_portal_enrolled_courses`.
 */
export function getStoredEnrolledCourses(): string[] {
  if (typeof window === 'undefined') return []
  try {
    const raw = localStorage.getItem('hanzo_portal_enrolled_courses')
    if (raw) {
      const parsed = JSON.parse(raw)
      if (Array.isArray(parsed)) {
        return parsed.filter(
          (slug): slug is string =>
            typeof slug === 'string' &&
            (slug === 'membership' || slug === 'pro' || UNIVERSITY_COURSES.some((c) => c.slug === slug))
        )
      }
    }
    const handle = localStorage.getItem('hanzo_portal_student_handle')
    const legacy = localStorage.getItem('hanzo_portal_selected_course')
    if (handle && legacy && UNIVERSITY_COURSES.some((c) => c.slug === legacy)) {
      return [legacy]
    }
  } catch (_) {}
  return []
}

/** Record a newly paid / enrolled course in persistent student storage. */
export function addEnrolledCourse(slug: string): string[] {
  if (typeof window === 'undefined') return [slug]
  try {
    const current = getStoredEnrolledCourses()
    if (UNIVERSITY_COURSES.some((c) => c.slug === slug)) {
      const updated = current.includes(slug) ? current : [...current, slug]
      localStorage.setItem('hanzo_portal_enrolled_courses', JSON.stringify(updated))
      localStorage.setItem('hanzo_portal_selected_course', slug)
      return updated
    }
    return current
  } catch (_) {
    return [slug]
  }
}

/** Remove an enrolled course from persistent student storage. */
export function removeEnrolledCourse(slug: string): string[] {
  if (typeof window === 'undefined') return []
  try {
    const current = getStoredEnrolledCourses()
    const updated = current.filter((s) => s !== slug)
    localStorage.setItem('hanzo_portal_enrolled_courses', JSON.stringify(updated))
    return updated
  } catch (_) {
    return []
  }
}

/**
 * Check if the student session has access to a specific course slug.
 * Free courses (e.g. AUTO 101 `continuous-improvement`) are unlocked for all authenticated students.
 */
export function isUserEnrolledInCourse(session: StudentSession | null | undefined, slug: string): boolean {
  const course = UNIVERSITY_COURSES.find((c) => c.slug === slug)
  if (!session || !session.isAuthenticated) return false
  if (course?.isFree) return true
  if (session.isFullAccess) return true
  return Array.isArray(session.enrolledClasses) && session.enrolledClasses.includes(slug)
}

/** Build the official Hanzo IAM login redirect URL */
export function getHanzoLoginUrl(returnPath: string = '/portal'): string {
  if (typeof window === 'undefined') {
    return `https://hanzo.ai/login?next=${encodeURIComponent('https://hanzo.university' + returnPath)}`
  }
  const currentUrl = new URL(returnPath, window.location.origin).toString()
  return `https://hanzo.ai/login?next=${encodeURIComponent(currentUrl)}`
}

/** Check and extract active student session from localStorage, URL params, or hash */
export function resolveStudentSession(): StudentSession | null {
  if (typeof window === 'undefined') return null

  let token: string | null = null

  const url = new URL(window.location.href)
  const queryToken =
    url.searchParams.get('access_token') ||
    url.searchParams.get('token') ||
    url.searchParams.get('id_token') ||
    url.searchParams.get('jwt')

  if (!queryToken && window.location.hash) {
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    const hashToken = hashParams.get('access_token') || hashParams.get('id_token') || hashParams.get('token')
    if (hashToken) {
      token = hashToken
      try {
        localStorage.setItem('hanzo_iam_access_token', token)
        window.history.replaceState(null, '', window.location.pathname + window.location.search)
      } catch (_) {}
    }
  }

  if (queryToken) {
    token = queryToken
    try {
      localStorage.setItem('hanzo_iam_access_token', token)
      url.searchParams.delete('access_token')
      url.searchParams.delete('token')
      url.searchParams.delete('id_token')
      url.searchParams.delete('jwt')
      window.history.replaceState(null, '', url.pathname + (url.search ? url.search : ''))
    } catch (_) {}
  }

  if (!token) {
    token =
      localStorage.getItem('hanzo_iam_access_token') ||
      localStorage.getItem('hanzo_iam_id_token') ||
      localStorage.getItem('hanzo_access_token') ||
      localStorage.getItem('token') ||
      localStorage.getItem('auth_token')
  }

  if (token) {
    const claims = parseJwt(token)
    if (claims) {
      if (claims.exp && typeof claims.exp === 'number') {
        const nowSec = Math.floor(Date.now() / 1000)
        if (nowSec > claims.exp) {
          console.warn('[Hanzo University] IAM token expired at', new Date(claims.exp * 1000).toISOString())
        }
      }

      const email = claims.email || ''
      const rawName = claims.displayName || claims.name || claims.preferred_username || (email ? email.split('@')[0] : '')
      const finalName = formatHumanName(rawName)
      const handle =
        (claims.preferred_username || claims.owner || claims.name || email.split('@')[0] || 'student')
          .toLowerCase()
          .replace(/[^a-z0-9_-]/g, '')
      const did = claims.did || (claims.sub ? `did:lux:${claims.sub}` : `did:hanzo:student:${handle}`)
      const plan = (claims.billing_plan || claims.plan || claims.tier || '').toLowerCase()
      const isFull = ['max-20x', 'max-5x', 'pro', 'membership', 'university-pro'].includes(plan)

      const enrolled: string[] = []
      const pushSlugs = (key: string) => {
        const mapped = PLAN_TO_COURSE_SLUGS[key] || [key]
        for (const slug of mapped) {
          if (UNIVERSITY_COURSES.some((uc) => uc.slug === slug) && !enrolled.includes(slug)) {
            enrolled.push(slug)
          }
        }
      }

      if (isFull) {
        enrolled.push(...UNIVERSITY_COURSES.map((c) => c.slug))
      } else {
        if (claims.courses && Array.isArray(claims.courses)) {
          for (const c of claims.courses) pushSlugs(String(c))
        }
        if (claims.entitlements && Array.isArray(claims.entitlements)) {
          for (const ent of claims.entitlements) pushSlugs(String(ent))
        }
        if (plan && PLAN_TO_COURSE_SLUGS[plan]) {
          pushSlugs(plan)
        }
        for (const s of getStoredEnrolledCourses()) {
          if (s !== 'membership' && s !== 'pro' && !enrolled.includes(s)) {
            enrolled.push(s)
          }
        }
      }

      return {
        isAuthenticated: true,
        token,
        sub: claims.sub,
        name: finalName,
        handle,
        email,
        did,
        enrolledClasses: enrolled,
        backendPlan: plan || (isFull ? 'University Pro' : enrolled.length > 0 ? 'Course License' : 'Free Student'),
        isFullAccess: isFull,
        source: 'iam_token',
      }
    }
  }

  try {
    const studentHandle = localStorage.getItem('hanzo_portal_student_handle')
    const studentName = localStorage.getItem('hanzo_portal_student_name')
    const studentEmail = localStorage.getItem('hanzo_portal_student_email') || ''
    const stored = getStoredEnrolledCourses()
    const isFull = stored.includes('membership') || stored.includes('pro')

    if (studentHandle && studentName) {
      return {
        isAuthenticated: true,
        name: formatHumanName(studentName),
        handle: studentHandle.toLowerCase().replace(/[^a-z0-9_-]/g, ''),
        email: studentEmail,
        did: `did:hanzo:student:${studentHandle}`,
        enrolledClasses: isFull
          ? UNIVERSITY_COURSES.map((c) => c.slug)
          : stored.filter((s) => s !== 'membership' && s !== 'pro'),
        backendPlan: isFull ? 'University Pro All-Access' : stored.length > 0 ? 'Course Enrollment' : 'Free Student',
        isFullAccess: isFull,
        source: 'checkout',
      }
    }
  } catch (_) {}

  return null
}

/** Clear all student authentication and enrollment state from browser */
export function signOutStudent(): void {
  if (typeof window === 'undefined') return
  try {
    localStorage.removeItem('hanzo_iam_access_token')
    localStorage.removeItem('hanzo_iam_id_token')
    localStorage.removeItem('hanzo_access_token')
    localStorage.removeItem('token')
    localStorage.removeItem('auth_token')
    localStorage.removeItem('hanzo_portal_student_handle')
    localStorage.removeItem('hanzo_portal_student_name')
    localStorage.removeItem('hanzo_portal_student_email')
    localStorage.removeItem('hanzo_portal_enrolled_courses')
    localStorage.removeItem('hanzo_portal_selected_course')
  } catch (_) {}
}

/** Asynchronously verify active plan and course subscription with the backend */
export async function syncBackendClassEnrollment(session: StudentSession): Promise<{
  enrolledSlugs: string[]
  planName?: string
  status: 'ok' | 'offline' | 'unauthorized'
}> {
  if (!session.token) {
    return {
      enrolledSlugs: session.enrolledClasses,
      planName: session.backendPlan,
      status: 'ok',
    }
  }

  try {
    const res = await fetch('https://api.hanzo.ai/v1/ai/limits', {
      headers: {
        Authorization: `Bearer ${session.token}`,
        Accept: 'application/json',
      },
    })

    if (res.status === 401) {
      return { enrolledSlugs: session.enrolledClasses, status: 'unauthorized' }
    }

    if (res.ok) {
      const data = await res.json()
      const plan = (data.plan || '').toLowerCase()
      const isFull = ['max-20x', 'max-5x', 'pro', 'university-pro'].includes(plan)
      const slugs = isFull
        ? UNIVERSITY_COURSES.map((c) => c.slug)
        : PLAN_TO_COURSE_SLUGS[plan]
        ? PLAN_TO_COURSE_SLUGS[plan]
        : session.enrolledClasses

      return {
        enrolledSlugs: slugs,
        planName: data.plan,
        status: 'ok',
      }
    }
  } catch (err) {
    console.warn('[Hanzo University] Backend plan sync fallback to local session:', err)
  }

  return {
    enrolledSlugs: session.enrolledClasses,
    planName: session.backendPlan,
    status: 'offline',
  }
}
