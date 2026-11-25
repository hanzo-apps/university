'use client'

import React from 'react'
import Link from 'next/link'
import { Hero, Band, Card, Head } from '@/components/band'
import { Box, Text, XStack, YStack } from '@/components/ui'
import { Action, Title, Lede, Eyebrow, Chip } from '@hanzo/ui/marketing'
import { Grid } from '@hanzo/ui/grid'
import {
  CheckCircle2,
  BookOpen,
  Check,
  Code2,
  ExternalLink,
  Terminal,
  ShieldCheck,
  Cpu,
  Bot,
  FileText,
  Sparkles,
  Rocket,
} from 'lucide-react'
import {
  AI_FACULTY_BOTS,
  UNIVERSITY_COURSES,
  getSchoolById,
  type UniversityCourse,
} from '../courses-data'
import { CouponInput } from '../CouponInput'
import { resolveStudentSession } from '@/lib/auth'

export function CourseView({ course }: { course: UniversityCourse }) {
  const [isEnrolled, setIsEnrolled] = React.useState(Boolean(course.isFree))
  const school = getSchoolById(course.school)

  React.useEffect(() => {
    if (course.isFree) {
      setIsEnrolled(true)
      return
    }
    if (typeof window !== 'undefined') {
      const sess = resolveStudentSession()
      if (sess && (sess.isFullAccess || sess.enrolledClasses.includes(course.slug))) {
        setIsEnrolled(true)
      }
    }
  }, [course.slug, course.isFree])

  const portalCourseUrl = `/portal?course=${course.slug}`
  const schoolPeers = UNIVERSITY_COURSES.filter((c) => c.school === course.school && c.slug !== course.slug).slice(0, 6)
  const relatedCourses =
    schoolPeers.length > 0
      ? schoolPeers
      : UNIVERSITY_COURSES.filter((c) => c.slug !== course.slug && c.featured).slice(0, 6)

  return (
    <Box minH="100vh" bg="$background" $platform-web={{ color: 'var(--foreground)' }}>
      {/* ── Breadcrumb & Hero ── */}
      <Hero
        crumb={`${school.shortName} · ${course.code}`}
        badge={`${course.code} · ${school.name} · ${course.isFree ? 'FREE OPEN ACCESS' : `$${course.price} USD`}`}
        title={course.title}
        lede={<>{course.summary}</>}
      >
        <Action href={course.learnWorkspaceUrl} fill>
          Launch Interactive Lab Workspace ↗
        </Action>
        {course.isFree ? (
          <Action href={portalCourseUrl}>
            Open Free Course in Portal →
          </Action>
        ) : isEnrolled ? (
          <Action href={portalCourseUrl}>
            Already Enrolled · Open Student Portal →
          </Action>
        ) : (
          <Action href="#enroll">
            Enroll in {course.code} — ${course.price} USD →
          </Action>
        )}
      </Hero>

      {/* ── Course Specification Matrix & Self-Serve Enrollment ── */}
      <Band pad={40} measure={1180}>
        <Grid columns={{ min: 300, max: 2 }} gap={24}>
          {/* Left: Specifications, AI Faculty Bots, Canonical Docs */}
          <Card p={28} display="flex" flexDirection="column" justify="space-between" borderWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
            <YStack gap="$5">
              <XStack items="center" justify="space-between" flexWrap="wrap" gap="$2">
                <Text fontSize="$1" fontFamily="$mono" color="var(--white-70)" letterSpacing={1}>
                  COURSE SPECIFICATIONS
                </Text>
                <Chip px={10} py={2} fontSize="$1" fontFamily="$mono">
                  {course.code} · {course.credential}
                </Chip>
              </XStack>

              <Grid columns={{ min: 140, max: 2 }} gap={12}>
                <YStack gap="$1" p="$3" rounded="var(--radius-lg)" bg="var(--pure-black)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.06)">
                  <Text fontFamily="$mono" fontSize="$1" color="var(--muted-foreground)">
                    DURATION
                  </Text>
                  <Text fontSize="$2" fontWeight="700" color="var(--white)">
                    {course.duration}
                  </Text>
                </YStack>

                <YStack gap="$1" p="$3" rounded="var(--radius-lg)" bg="var(--pure-black)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.06)">
                  <Text fontFamily="$mono" fontSize="$1" color="var(--muted-foreground)">
                    LEVEL
                  </Text>
                  <Text fontSize="$2" fontWeight="700" color="var(--white)">
                    {course.level}
                  </Text>
                </YStack>

                <YStack gap="$1" p="$3" rounded="var(--radius-lg)" bg="var(--pure-black)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.06)">
                  <Text fontFamily="$mono" fontSize="$1" color="var(--muted-foreground)">
                    CREDENTIAL CODE
                  </Text>
                  <Text fontSize="$2" fontWeight="700" color="var(--white)">
                    {course.credential}
                  </Text>
                </YStack>

                <YStack gap="$1" p="$3" rounded="var(--radius-lg)" bg="var(--pure-black)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.06)">
                  <Text fontFamily="$mono" fontSize="$1" color="var(--muted-foreground)">
                    VERIFICATION
                  </Text>
                  <Text fontSize="$2" fontWeight="700" color="var(--white)">
                    W3C Capstone Proof
                  </Text>
                </YStack>
              </Grid>

              {/* Required Deployed Capstone Artifact */}
              <YStack gap="$1.5" p="$3.5" rounded="var(--radius-lg)" bg="rgba(255, 255, 255, 0.03)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
                <XStack items="center" gap="$2">
                  <Rocket size={14} color="var(--emerald-400)" />
                  <Text fontFamily="$mono" fontSize="$1" fontWeight="700" color="var(--emerald-400)">
                    REQUIRED DEPLOYED CAPSTONE ARTIFACT
                  </Text>
                </XStack>
                <Text fontSize="$2" fontWeight="700" color="var(--white)">
                  {course.capstoneArtifact}
                </Text>
                <Text fontSize="$1" color="var(--muted-foreground)" lineHeight={19}>
                  {course.capstone}
                </Text>
              </YStack>

              {/* AI Faculty Bots */}
              <YStack gap="$2.5">
                <XStack items="center" gap="$2">
                  <Bot size={15} color="var(--white)" />
                  <Text fontSize="$1" fontWeight="700" color="var(--white)" fontFamily="$mono">
                    AI FACULTY BOTS ASSIGNED TO {course.code}
                  </Text>
                </XStack>
                <Grid columns={{ min: 190, max: 2 }} gap={10}>
                  {course.facultyBots.map((botId) => {
                    const bot = AI_FACULTY_BOTS[botId]
                    return (
                      <YStack
                        key={botId}
                        p="$3"
                        rounded="var(--radius-md)"
                        bg="var(--pure-black)"
                        borderWidth={1}
                        borderColor="rgba(255, 255, 255, 0.07)"
                        gap={4}
                      >
                        <XStack items="center" justify="space-between" gap={6}>
                          <Text fontFamily="$mono" fontSize={12} fontWeight="700" color="var(--emerald-400)">
                            {bot.id}
                          </Text>
                          <Text fontSize={10} fontFamily="$mono" color="var(--muted-foreground)">
                            {bot.role}
                          </Text>
                        </XStack>
                        <Text fontSize={12} fontWeight="600" color="var(--white)">
                          {bot.name}
                        </Text>
                        <Text fontSize={11} color="var(--muted-foreground)" lineHeight={16}>
                          {bot.specialty}
                        </Text>
                      </YStack>
                    )
                  })}
                </Grid>
              </YStack>

              {/* Prerequisites */}
              <YStack gap="$1">
                <Text fontSize="$1" fontWeight="700" color="var(--white)">
                  Prerequisites
                </Text>
                <Text fontSize="$1" color="var(--muted-foreground)" lineHeight={19}>
                  {course.prerequisites}
                </Text>
              </YStack>

              {/* Canonical docs.hanzo.ai Links */}
              <YStack gap="$2" pt="$2" borderTopWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
                <XStack items="center" gap="$2">
                  <FileText size={14} color="var(--white-70)" />
                  <Text fontSize="$1" fontFamily="$mono" fontWeight="700" color="var(--white-70)">
                    CANONICAL DOCS.HANZO.AI QUICKSTARTS &amp; GUIDES
                  </Text>
                </XStack>
                <XStack gap={8} flexWrap="wrap">
                  {course.docsLinks.map((doc) => (
                    <a
                      key={doc.href}
                      href={doc.href}
                      target="_blank"
                      rel="noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '6px 11px',
                        borderRadius: '8px',
                        background: 'rgba(255, 255, 255, 0.04)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        color: 'var(--white)',
                        fontSize: '12px',
                        fontWeight: 500,
                        textDecoration: 'none',
                      }}
                    >
                      <span>{doc.label}</span>
                      <ExternalLink size={12} color="rgba(255, 255, 255, 0.6)" />
                    </a>
                  ))}
                </XStack>
              </YStack>
            </YStack>
          </Card>

          {/* Right: Self-Serve Enrollment / Free Access Card */}
          <Card id="enroll" p={28} display="flex" flexDirection="column" justify="space-between" borderWidth={1} borderColor="rgba(255, 255, 255, 0.12)">
            <YStack gap="$4">
              <XStack items="center" justify="space-between" flexWrap="wrap" gap="$2">
                <Text fontSize="$1" fontFamily="$mono" color="var(--white-70)" letterSpacing={1}>
                  {course.isFree ? 'FREE OPEN-ACCESS COURSE' : 'SELF-SERVICE ENROLLMENT'}
                </Text>
                <Chip px={8} py={2} fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">
                  {course.isFree ? 'FREE · $0' : isEnrolled ? 'ENROLLED ✓' : 'OPEN ENROLLMENT'}
                </Chip>
              </XStack>

              {course.isFree ? (
                <YStack gap="$4" p={20} bg="var(--pure-black)" rounded="var(--radius-lg)" borderWidth={1} borderColor="rgba(16, 185, 129, 0.25)">
                  <XStack items="baseline" justify="space-between">
                    <YStack>
                      <Text fontSize="$1" fontFamily="$mono" color="var(--muted-foreground)">
                        TUITION
                      </Text>
                      <XStack items="baseline" gap="$2">
                        <Text fontSize="$6" fontWeight="800" color="var(--white)">
                          $0
                        </Text>
                        <Text fontSize="$2" color="var(--emerald-400)" fontWeight="600">
                          Free Forever
                        </Text>
                      </XStack>
                    </YStack>
                    <Chip px={10} py={3} fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">
                      NO CARD REQUIRED
                    </Chip>
                  </XStack>

                  <Text fontSize="$1" color="var(--muted-foreground)" lineHeight={20}>
                    Start immediately in the interactive learning workspace on hanzo.app/learn or open the course inside the Student Portal.
                  </Text>

                  <YStack gap="$2">
                    <Action href={course.learnWorkspaceUrl} fill>
                      Start Learning Free on hanzo.app/learn ↗
                    </Action>
                    <Action href={portalCourseUrl}>
                      Open in Student Portal →
                    </Action>
                  </YStack>
                </YStack>
              ) : isEnrolled ? (
                <YStack gap="$4" p={20} bg="var(--pure-black)" rounded="var(--radius-lg)" borderWidth={1} borderColor="rgba(16, 185, 129, 0.3)">
                  <XStack items="center" gap="$2">
                    <CheckCircle2 size={18} color="var(--emerald-400)" />
                    <Text fontSize="$3" fontWeight="700" color="var(--white)">
                      Active Enrollment Confirmed
                    </Text>
                  </XStack>
                  <Text fontSize="$1" color="var(--muted-foreground)" lineHeight={20}>
                    Your Hanzo account has active access to {course.code}. Launch the interactive lab workspace or open your Student Portal workstation.
                  </Text>
                  <YStack gap="$2">
                    <Action href={course.learnWorkspaceUrl} fill>
                      Launch Interactive Lab Workspace ↗
                    </Action>
                    <Action href={portalCourseUrl}>
                      Open Student Portal →
                    </Action>
                  </YStack>
                </YStack>
              ) : (
                <CouponInput
                  originalPrice={course.price}
                  planId={course.planId}
                  courseSlug={course.slug}
                  courseCode={course.code}
                  credential={course.credential}
                  labComputeNote={course.labComputeNote}
                />
              )}

              {/* Honest Lab Compute & Workspace Terms */}
              <Card p={16} bg="rgba(255, 255, 255, 0.03)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
                <XStack items="center" gap="$2" mb="$1.5">
                  <Cpu size={16} color="var(--white)" />
                  <Text fontSize="$1" fontWeight="700" color="var(--white)">
                    Scoped Lab Compute &amp; Interactive Workspace
                  </Text>
                </XStack>
                <Text fontSize="$1" color="var(--muted-foreground)" lineHeight={19}>
                  {course.labComputeNote} Heavy production workloads beyond lab budgets run on your own Hanzo Cloud plan or local GPU/Apple Silicon hardware.
                </Text>
              </Card>

              {/* Launch Workspace & University Pro Option */}
              <YStack gap="$2" pt="$1">
                <a
                  href={course.learnWorkspaceUrl}
                  target="_blank"
                  rel="noreferrer"
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '8px',
                    padding: '12px 16px',
                    borderRadius: '10px',
                    background: 'rgba(255, 255, 255, 0.06)',
                    border: '1px solid rgba(255, 255, 255, 0.14)',
                    color: 'var(--white)',
                    fontSize: '13px',
                    fontWeight: 600,
                    textDecoration: 'none',
                  }}
                >
                  <Terminal size={15} />
                  <span>Open {course.code} in hanzo.app/learn</span>
                  <ExternalLink size={13} />
                </a>

                {!course.isFree && (
                  <XStack items="center" justify="center" gap="$2" pt="$1" flexWrap="wrap">
                    <Text fontSize="$1" color="var(--muted-foreground)">
                      Want all 25 courses?
                    </Text>
                    <Link
                      href="/checkout/membership"
                      style={{
                        color: 'var(--white)',
                        fontSize: '12px',
                        fontWeight: 600,
                        textDecoration: 'underline',
                      }}
                    >
                      University Pro (bundled with Hanzo Pro) →
                    </Link>
                  </XStack>
                )}
              </YStack>
            </YStack>
          </Card>
        </Grid>
      </Band>

      {/* ── Featured Detailed Lab (e.g. KAI 301 Lab 01: Teach Kai your business) ── */}
      {course.detailedLab && (
        <Band id="detailed-lab" pad={48} measure={1180} rule={true} ground="var(--pure-black)">
          <YStack gap="$6">
            <YStack gap="$2">
              <XStack items="center" gap="$2" flexWrap="wrap">
                <Chip px={10} py={3} fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">
                  {course.detailedLab.code} · HANDS-ON WALKTHROUGH
                </Chip>
                {course.detailedLab.endpoint && (
                  <Chip px={10} py={3} fontSize="$1" fontFamily="$mono" color="var(--white)">
                    {course.detailedLab.endpoint}
                  </Chip>
                )}
              </XStack>
              <Title quiet={false}>{course.detailedLab.title}</Title>
              <Lede maxW={820}>{course.detailedLab.subtitle}</Lede>
            </YStack>

            <Grid columns={{ min: 320, max: 3 }} gap={16}>
              {course.detailedLab.steps.map((s) => (
                <Card
                  key={s.step}
                  p={20}
                  bg="rgba(255, 255, 255, 0.02)"
                  borderWidth={1}
                  borderColor="rgba(255, 255, 255, 0.09)"
                >
                  <YStack gap="$2.5" height="100%" justify="space-between">
                    <YStack gap="$2">
                      <XStack items="center" justify="space-between" gap="$2">
                        <Text fontFamily="$mono" fontSize={11} fontWeight="700" color="var(--emerald-400)">
                          STEP 0{s.step}
                        </Text>
                        {s.endpoint && (
                          <Text fontFamily="$mono" fontSize={10} color="rgba(255, 255, 255, 0.65)">
                            {s.endpoint}
                          </Text>
                        )}
                      </XStack>
                      <Text fontSize={15} fontWeight="700" color="var(--white)" lineHeight={21}>
                        {s.title}
                      </Text>
                      <Text fontSize={13} color="var(--muted-foreground)" lineHeight={19}>
                        {s.summary}
                      </Text>
                    </YStack>

                    {s.command && (
                      <Box
                        p="$2.5"
                        rounded="var(--radius-md)"
                        bg="var(--pure-black)"
                        borderWidth={1}
                        borderColor="rgba(255, 255, 255, 0.08)"
                        $platform-web={{
                          fontFamily: 'monospace',
                          fontSize: '11px',
                          color: 'var(--emerald-300)',
                          wordBreak: 'break-all',
                          lineHeight: 1.5,
                        }}
                      >
                        $ {s.command}
                      </Box>
                    )}
                  </YStack>
                </Card>
              ))}
            </Grid>

            <XStack items="center" justify="center" gap="$3" flexWrap="wrap">
              <Action href={course.learnWorkspaceUrl} fill>
                Run {course.detailedLab.code} in Learning Workspace ↗
              </Action>
              <Action href={portalCourseUrl}>
                Preview in Student Portal →
              </Action>
            </XStack>
          </YStack>
        </Band>
      )}

      {/* ── Core Competencies Band ── */}
      <Band pad={40} measure={1180} rule={true} ground="var(--pure-black)">
        <Head
          eyebrow="Competency Framework"
          title={`What you build in ${course.code}`}
          lede="Grounded in real models, real compute, real experiments, and verifiable engineering outcomes."
        />

        <Grid columns={{ min: 260, max: 4 }} gap={16}>
          {course.competencies.map((comp, idx) => (
            <Card key={idx} p={20} borderWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
              <XStack items="flex-start" gap="$3">
                <Box
                  p="$2"
                  rounded="var(--radius-md)"
                  bg="$panel"
                  $platform-web={{ backgroundColor: 'color-mix(in srgb, var(--emerald-500) 15%, transparent)', flexShrink: 0 }}
                >
                  <CheckCircle2 size={16} color="var(--emerald-400)" />
                </Box>
                <Text fontSize="$2" fontWeight="600" color="var(--white)" lineHeight={21}>
                  {comp}
                </Text>
              </XStack>
            </Card>
          ))}
        </Grid>
      </Band>

      {/* ── Complete Module-by-Module Syllabus ── */}
      <Band pad={48} measure={1180} rule={true}>
        <Head
          eyebrow="Curriculum Modules"
          title="Syllabus & Hands-On Labs"
          lede="Every module pairs systems & theoretical lectures with verifiable sandboxed engineering labs."
        />

        <YStack gap="$5">
          {course.syllabus.map((week) => (
            <Card key={week.week} p={24} borderWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
              <YStack gap="$4">
                <XStack items="center" justify="space-between" flexWrap="wrap" gap="$2">
                  <XStack items="center" gap="$3" flex={1} minW={0} flexWrap="wrap">
                    <Chip px={10} py={3} fontSize="$1" fontFamily="$mono">
                      {week.code}
                    </Chip>
                    <Text fontSize="$4" fontWeight="700" color="var(--white)" flex={1} minW={0}>
                      {week.title}
                    </Text>
                  </XStack>
                  <Text fontSize="$1" fontFamily="$mono" color="var(--muted-foreground)">
                    {week.week}
                  </Text>
                </XStack>

                <Text fontSize="$2" color="var(--white-80)" lineHeight={22}>
                  {week.summary}
                </Text>

                <Grid columns={{ min: 260, max: 2 }} gap={16} pt="$1">
                  <YStack gap="$2" p="$4" rounded="var(--radius-md)" bg="rgba(255, 255, 255, 0.02)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.06)">
                    <Text fontSize="$1" fontWeight="700" color="var(--white)">
                      Key Topics &amp; Lectures
                    </Text>
                    {week.lectures.map((lec, lIdx) => (
                      <XStack key={lIdx} items="flex-start" gap="$2">
                        <Box mt={4} style={{ flexShrink: 0 }}>
                          <Check size={12} color="var(--emerald-400)" />
                        </Box>
                        <Text fontSize="$1" color="var(--muted-foreground)" lineHeight={19}>
                          {lec}
                        </Text>
                      </XStack>
                    ))}
                  </YStack>

                  <YStack gap="$2" p="$4" rounded="var(--radius-md)" bg="rgba(255, 255, 255, 0.02)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.06)">
                    <Text fontSize="$1" fontWeight="700" color="var(--white)">
                      Assigned Readings &amp; References
                    </Text>
                    {week.readings.map((reading, rIdx) => (
                      <XStack key={rIdx} items="flex-start" gap="$2">
                        <Box mt={4} style={{ flexShrink: 0 }}>
                          <BookOpen size={12} color="var(--white-60)" />
                        </Box>
                        <Text fontSize="$1" color="var(--muted-foreground)" lineHeight={19}>
                          {reading}
                        </Text>
                      </XStack>
                    ))}
                  </YStack>
                </Grid>

                <Box p="$3.5" px="$4" rounded="var(--radius-md)" bg="var(--pure-black)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
                  <XStack items="center" gap="$2">
                    <Code2 size={16} color="var(--emerald-400)" style={{ flexShrink: 0 }} />
                    <Text fontSize="$1" fontWeight="600" color="var(--white)" lineHeight={19}>
                      {week.lab}
                    </Text>
                  </XStack>
                </Box>
              </YStack>
            </Card>
          ))}
        </YStack>
      </Band>

      {/* ── Capstone & Honest W3C Verifiable Credential Band ── */}
      <Band pad={40} measure={1120} rule={true} ground="var(--pure-black)">
        <Card p={32} bg="rgba(255, 255, 255, 0.02)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.1)">
          <XStack items="center" justify="space-between" flexWrap="wrap" gap="$5">
            <YStack gap="$2.5" flex={1} minW={280}>
              <XStack items="center" gap="$2">
                <ShieldCheck size={16} color="var(--emerald-400)" />
                <Eyebrow>Capstone Verification &amp; W3C Credential</Eyebrow>
              </XStack>
              <Title quiet={false}>{course.capstoneArtifact}</Title>
              <Lede maxW={680}>
                {course.capstone} Upon passing automated cleanroom evaluation, you receive a W3C Verifiable Credential ({course.credential}) providing cryptographic proof of your completed practical capstone and live artifact.
              </Lede>
              <Text fontSize="$1" color="var(--muted-foreground)" lineHeight={19}>
                Note: Hanzo University credentials verify practical engineering mastery and deployed capstone artifacts; they are professional certifications, not accredited academic degrees.{' '}
                <Link href={`/verify?id=${course.credential}-2026-9821`} style={{ color: 'var(--white)', textDecoration: 'underline' }}>
                  Inspect verification format →
                </Link>
              </Text>
            </YStack>

            <YStack gap="$2.5" minW={220}>
              <Action href={course.learnWorkspaceUrl} fill>
                Launch Lab Workspace ↗
              </Action>
              {course.isFree ? (
                <Action href={portalCourseUrl}>
                  Open Free in Portal →
                </Action>
              ) : (
                <Action href="#enroll">
                  Enroll in {course.code} — ${course.price}
                </Action>
              )}
            </YStack>
          </XStack>
        </Card>
      </Band>

      {/* ── Related Courses in School ── */}
      <Band pad={48} measure={1180} rule={true}>
        <Head
          eyebrow={school.name}
          title="Continue Exploring the Curriculum"
          lede="Related courses in this school and flagship starting tracks across Hanzo University."
        />

        <Grid columns={{ min: 280, max: 3 }} gap={16}>
          {relatedCourses.map((c) => (
            <Card key={c.slug} p={20} bg="rgba(255, 255, 255, 0.02)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
              <YStack gap="$3" justify="space-between" height="100%">
                <YStack gap="$2">
                  <XStack items="center" justify="space-between">
                    <Text fontSize="$1" fontFamily="$mono" color="var(--muted-foreground)">
                      {c.code} · {c.level}
                    </Text>
                    <Chip px={8} py={2} fontSize="$1" fontFamily="$mono">
                      {c.credential}
                    </Chip>
                  </XStack>
                  <Text fontSize="$3" fontWeight="700" color="var(--white)">
                    {c.title}
                  </Text>
                  <Text fontSize="$1" color="var(--muted-foreground)" numberOfLines={2} lineHeight={19}>
                    {c.summary}
                  </Text>
                </YStack>

                <XStack items="center" justify="space-between" pt="$3" borderTopWidth={1} borderColor="var(--border)">
                  <Text fontSize="$2" fontWeight="700" color={c.isFree ? 'var(--emerald-400)' : 'var(--white)'} fontFamily="$mono">
                    {c.isFree ? 'Free' : `$${c.price} USD`}
                  </Text>
                  <Link
                    href={`/${c.slug}`}
                    style={{
                      color: 'var(--white)',
                      fontSize: '12px',
                      fontWeight: 600,
                      textDecoration: 'none',
                    }}
                  >
                    View Course →
                  </Link>
                </XStack>
              </YStack>
            </Card>
          ))}
        </Grid>

        <XStack justify="center" mt={28}>
          <Action href="/#schools">
            Browse All 25 Courses across 4 Schools →
          </Action>
        </XStack>
      </Band>
    </Box>
  )
}
