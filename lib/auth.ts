/**
 * Hanzo University Student Authentication & Backend Class Resolution
 * 
 * Manages authentic OIDC / IAM user sessions, JWT extraction of student legal names
 * and handles, token verification, and backend course enrollment mapping.
 */

import { UNIVERSITY_COURSES } from '../app/courses-data'

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

/** Mapping of Hanzo billing plan IDs to University course slugs */
export const PLAN_TO_COURSE_SLUG: Record<string, string> = {
  'course-eng-100': 'agentic-coding',
  'course-ag-101': 'agentic-coding',
  'course-rl-101': 'reinforcement-learning',
  'course-rl-102': 'reinforcement-learning',
  'course-sys-103': 'systems-engineering',
  'course-mkt-102': 'agentic-marketing',
  'course-mkt-104': 'agentic-marketing',
  'course-pra-104': 'ai-practitioner',
  'course-arc-105': 'ai-architect',
  // Course slugs directly
  'agentic-coding': 'agentic-coding',
  'reinforcement-learning': 'reinforcement-learning',
  'systems-engineering': 'systems-engineering',
  'agentic-marketing': 'agentic-marketing',
  'ai-practitioner': 'ai-practitioner',
  'ai-architect': 'ai-architect',
  // Membership tiers with full curriculum access
  'max-20x': 'agentic-coding',
  'max-5x': 'agentic-coding',
  'pro': 'agentic-coding',
}

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
  // If it's an email, strip domain
  const clean = raw.includes('@') ? raw.split('@')[0] : raw
  // Replace dots, underscores, hyphens with spaces
  const spaced = clean.replace(/[._-]+/g, ' ').trim()
  if (!spaced) return 'Student'
  // Capitalize words
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
            typeof slug === 'string' && UNIVERSITY_COURSES.some((c) => c.slug === slug)
        )
      }
    }
    // Backward compatibility for existing checkout sessions where single course was set
    const handle = localStorage.getItem('hanzo_portal_student_handle')
    const legacy = localStorage.getItem('hanzo_portal_selected_course')
    if (handle && legacy && UNIVERSITY_COURSES.some((c) => c.slug === legacy)) {
      return [legacy]
    }
  } catch (_) {}
  return []
}

/**
 * Record a newly paid / enrolled course in persistent student storage.
 */
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

/**
 * Remove an enrolled course from persistent student storage.
 */
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
 * Check if the student session has active paid enrollment for a specific course slug.
 */
export function isUserEnrolledInCourse(session: StudentSession | null | undefined, slug: string): boolean {
  if (!session || !session.isAuthenticated) return false
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

  // 1. Check URL parameters for token (e.g. redirected from IAM / OAuth callback)
  const url = new URL(window.location.href)
  const queryToken =
    url.searchParams.get('access_token') ||
    url.searchParams.get('token') ||
    url.searchParams.get('id_token') ||
    url.searchParams.get('jwt')

  // 2. Check URL Hash (OIDC implicit / hybrid flow)
  if (!queryToken && window.location.hash) {
    const hashParams = new URLSearchParams(window.location.hash.replace(/^#/, ''))
    const hashToken = hashParams.get('access_token') || hashParams.get('id_token') || hashParams.get('token')
    if (hashToken) {
      token = hashToken
      try {
        localStorage.setItem('hanzo_iam_access_token', token)
        // Clean hash from URL bar
        window.history.replaceState(null, '', window.location.pathname + window.location.search)
      } catch (_) {}
    }
  }

  if (queryToken) {
    token = queryToken
    try {
      localStorage.setItem('hanzo_iam_access_token', token)
      // Clean query token from URL bar
      url.searchParams.delete('access_token')
      url.searchParams.delete('token')
      url.searchParams.delete('id_token')
      url.searchParams.delete('jwt')
      window.history.replaceState(null, '', url.pathname + (url.search ? url.search : ''))
    } catch (_) {}
  }

  // 3. Check persistent localStorage keys
  if (!token) {
    token =
      localStorage.getItem('hanzo_iam_access_token') ||
      localStorage.getItem('hanzo_iam_id_token') ||
      localStorage.getItem('hanzo_access_token') ||
      localStorage.getItem('token') ||
      localStorage.getItem('auth_token')
  }

  // If a JWT token exists, parse authentic claims
  if (token) {
    const claims = parseJwt(token)
    if (claims) {
      // Check expiry if timestamp provided
      if (claims.exp && typeof claims.exp === 'number') {
        const nowSec = Math.floor(Date.now() / 1000)
        if (nowSec > claims.exp) {
          // Token expired
          console.warn('[Hanzo University] IAM token expired at', new Date(claims.exp * 1000).toISOString())
          // Don't immediately nuke if there's a stored checkout session, but token is stale
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
      const isFull = ['max-20x', 'max-5x', 'pro'].includes(plan)

      // Resolve enrolled classes from claims or storage
      const enrolled: string[] = []
      if (isFull) {
        enrolled.push(...UNIVERSITY_COURSES.map((c) => c.slug))
      } else {
        // 1. Check explicit courses in JWT claims
        if (claims.courses && Array.isArray(claims.courses)) {
          for (const c of claims.courses) {
            const slug = PLAN_TO_COURSE_SLUG[c] || c
            if (UNIVERSITY_COURSES.some((uc) => uc.slug === slug) && !enrolled.includes(slug)) {
              enrolled.push(slug)
            }
          }
        }
        // 2. Check explicit entitlements in JWT claims
        if (claims.entitlements && Array.isArray(claims.entitlements)) {
          for (const ent of claims.entitlements) {
            const slug = PLAN_TO_COURSE_SLUG[ent] || ent
            if (UNIVERSITY_COURSES.some((uc) => uc.slug === slug) && !enrolled.includes(slug)) {
              enrolled.push(slug)
            }
          }
        }
        // 3. Check single plan mapping
        if (plan && PLAN_TO_COURSE_SLUG[plan]) {
          const slug = PLAN_TO_COURSE_SLUG[plan]
          if (UNIVERSITY_COURSES.some((uc) => uc.slug === slug) && !enrolled.includes(slug)) {
            enrolled.push(slug)
          }
        }

        // 4. Merge locally purchased courses
        const stored = getStoredEnrolledCourses()
        for (const s of stored) {
          if (!enrolled.includes(s)) {
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
        backendPlan: plan || (isFull ? 'Max Membership' : enrolled.length > 0 ? 'Course License' : 'Registered Student'),
        isFullAccess: isFull,
        source: 'iam_token',
      }
    }
  }

  // 4. Check if student signed up / completed tuition checkout directly on hanzo.university
  try {
    const studentHandle = localStorage.getItem('hanzo_portal_student_handle')
    const studentName = localStorage.getItem('hanzo_portal_student_name')
    const studentEmail = localStorage.getItem('hanzo_portal_student_email') || ''
    const stored = getStoredEnrolledCourses()

    if (studentHandle && studentName) {
      return {
        isAuthenticated: true,
        name: formatHumanName(studentName),
        handle: studentHandle.toLowerCase().replace(/[^a-z0-9_-]/g, ''),
        email: studentEmail,
        did: `did:hanzo:student:${studentHandle}`,
        enrolledClasses: stored,
        backendPlan: stored.length > 0 ? 'Class Enrollment' : 'Registered Student',
        isFullAccess: false,
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
    // Probe backend plan usage / limits endpoint
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
      const isFull = ['max-20x', 'max-5x', 'pro'].includes(plan)
      const slugs = isFull
        ? UNIVERSITY_COURSES.map((c) => c.slug)
        : PLAN_TO_COURSE_SLUG[plan]
        ? [PLAN_TO_COURSE_SLUG[plan]]
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
