'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Box, Text, XStack, YStack } from '@/components/ui'
import { Band, Card, Head } from '@/components/band'
import { Action, Title, Lede, Eyebrow, Chip } from '@hanzo/ui/marketing'
import { Grid } from '@hanzo/ui/grid'
import {
  ShieldCheck,
  BookOpen,
  Check,
  CheckCircle2,
  Cpu,
  ArrowRight,
  ExternalLink,
  Compass,
  Sparkles,
  Bot,
  Layers,
  Award,
  Terminal,
  Search,
  Rocket,
  FlaskConical,
  Briefcase,
  Lock,
} from 'lucide-react'
import {
  ADVENTURE_PATHS,
  AI_FACULTY_BOTS,
  CERTIFICATION_TRACKS,
  DISCIPLINE_CHIPS,
  PRICING_TIERS,
  SCHOOLS,
  UNIVERSITY_COURSES,
  findCourse,
  type SchoolId,
  type UniversityCourse,
} from './courses-data'
import { courseCheckoutUrl } from '@/lib/pay'
import { SIGN_IN } from './funnel'
import type { StudentSession } from '@/lib/auth'

const ECOSYSTEM_LAYERS = [
  {
    step: '01',
    verb: 'Discover',
    host: 'hanzo.ai',
    href: 'https://hanzo.ai',
    desc: 'Explore Kai, Enso, Zen models, cloud compute, and autonomous infrastructure.',
    external: true,
  },
  {
    step: '02',
    verb: 'Understand',
    host: 'docs.hanzo.ai',
    href: 'https://docs.hanzo.ai',
    desc: 'Read architecture specifications, OpenAPI contracts, MCP tools, and ZAP protocols.',
    external: true,
  },
  {
    step: '03',
    verb: 'Build',
    host: 'docs.hanzo.ai/docs/guides',
    href: 'https://docs.hanzo.ai/docs/guides',
    desc: 'Follow step-by-step engineering cookbooks, recipes, and reference integrations.',
    external: true,
  },
  {
    step: '04',
    verb: 'Master & Ship',
    host: 'hanzo.university + hanzo.app/learn',
    href: 'https://hanzo.app/learn',
    desc: 'Complete 25 courses, run real labs on real compute, and ship verified capstones.',
    external: true,
  },
]

const SCHOOL_ICONS: Record<SchoolId, React.ComponentType<{ size?: number; color?: string }>> = {
  foundation: Sparkles,
  intelligence: Cpu,
  science: FlaskConical,
  cybersecurity: Lock,
  business: Briefcase,
}

interface CatalogProps {
  session?: StudentSession | null
  showHero?: boolean
}

function CourseCard({ course }: { course: UniversityCourse }) {
  return (
    <Card
      p={22}
      bg="rgba(255, 255, 255, 0.02)"
      borderWidth={1}
      borderColor={course.isFree ? 'rgba(16, 185, 129, 0.3)' : 'rgba(255, 255, 255, 0.08)'}
    >
      <YStack gap={14} height="100%" justify="space-between">
        <YStack gap={10}>
          {/* Top Metadata Row */}
          <XStack items="center" justify="space-between" flexWrap="wrap" gap={8}>
            <XStack items="center" gap={8} flexWrap="wrap">
              <Box
                px={8}
                py={3}
                rounded="var(--radius-sm)"
                bg="rgba(255, 255, 255, 0.08)"
                borderWidth={1}
                borderColor="rgba(255, 255, 255, 0.14)"
              >
                <Text fontFamily="$mono" fontSize={11} fontWeight="700" color="var(--white)">
                  {course.code}
                </Text>
              </Box>
              <Text fontFamily="$mono" fontSize={11} color="rgba(255, 255, 255, 0.6)">
                {course.level} · {course.duration.split('·')[0].trim()}
              </Text>
            </XStack>

            <Chip
              px={8}
              py={2}
              fontSize={11}
              fontFamily="$mono"
              color={course.isFree ? 'var(--emerald-400)' : 'rgba(255, 255, 255, 0.8)'}
            >
              {course.isFree ? 'FREE' : course.credential}
            </Chip>
          </XStack>

          {/* Title & Summary */}
          <YStack gap={6}>
            <Link href={`/${course.slug}`} style={{ textDecoration: 'none' }}>
              <Text fontSize={18} fontWeight="700" color="var(--white)" lineHeight={24}>
                {course.title}
              </Text>
            </Link>
            <Text fontSize={13} color="rgba(255, 255, 255, 0.78)" lineHeight={20}>
              {course.summary}
            </Text>
          </YStack>

          {/* Deployed Capstone Artifact */}
          <Box
            p={10}
            rounded="var(--radius-md)"
            bg="rgba(255, 255, 255, 0.03)"
            borderWidth={1}
            borderColor="rgba(255, 255, 255, 0.06)"
          >
            <Text fontFamily="$mono" fontSize={10} color="rgba(255, 255, 255, 0.55)" fontWeight="700">
              DEPLOYED CAPSTONE ARTIFACT
            </Text>
            <Text fontSize={12} color="rgba(255, 255, 255, 0.9)" fontWeight="600" mt={2} lineHeight={17}>
              {course.capstoneArtifact}
            </Text>
          </Box>

          {/* AI Faculty Bots */}
          <XStack items="center" gap={6} flexWrap="wrap">
            <Bot size={12} color="rgba(255, 255, 255, 0.5)" />
            {course.facultyBots.map((bot) => (
              <Text
                key={bot}
                fontFamily="$mono"
                fontSize={11}
                color="var(--emerald-400)"
                px={6}
                py={1}
                rounded="var(--radius-sm)"
                bg="rgba(16, 185, 129, 0.08)"
              >
                {bot}
              </Text>
            ))}
          </XStack>
        </YStack>

        {/* Bottom Pricing & Self-Serve Actions */}
        <YStack gap={10} pt={14} borderTopWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
          <XStack items="center" justify="space-between" flexWrap="wrap" gap={8}>
            <XStack items="baseline" gap={4}>
              <Text
                fontSize={22}
                fontWeight="800"
                color={course.isFree ? 'var(--emerald-400)' : 'var(--white)'}
                fontFamily="$mono"
              >
                {course.isFree ? 'Free' : `$${course.price}`}
              </Text>
              {!course.isFree && (
                <Text fontSize={11} color="rgba(255, 255, 255, 0.5)">
                  USD
                </Text>
              )}
            </XStack>

            <a
              href={course.learnWorkspaceUrl}
              target="_blank"
              rel="noreferrer"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '4px',
                color: 'rgba(255, 255, 255, 0.78)',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                textDecoration: 'none',
              }}
            >
              <span>hanzo.app/learn</span>
              <ExternalLink size={11} />
            </a>
          </XStack>

          <XStack gap={8} flexWrap="wrap">
            <Link
              href={`/${course.slug}`}
              style={{
                flex: 1,
                minWidth: '100px',
                textAlign: 'center',
                padding: '9px 12px',
                borderRadius: '999px',
                border: '1px solid rgba(255, 255, 255, 0.16)',
                background: 'transparent',
                color: 'var(--white)',
                fontSize: '12px',
                fontWeight: 600,
                textDecoration: 'none',
              }}
            >
              Syllabus →
            </Link>
            {course.isFree ? (
              <Link
                href={`/${course.slug}`}
                style={{
                  flex: 1,
                  minWidth: '110px',
                  textAlign: 'center',
                  padding: '9px 12px',
                  borderRadius: '999px',
                  background: 'var(--white)',
                  color: 'var(--pure-black)',
                  fontSize: '12px',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Start Free →
              </Link>
            ) : (
              <Link
                href={courseCheckoutUrl(course.slug)}
                style={{
                  flex: 1,
                  minWidth: '110px',
                  textAlign: 'center',
                  padding: '9px 12px',
                  borderRadius: '999px',
                  background: 'var(--white)',
                  color: 'var(--pure-black)',
                  fontSize: '12px',
                  fontWeight: 700,
                  textDecoration: 'none',
                }}
              >
                Enroll — ${course.price}
              </Link>
            )}
          </XStack>
        </YStack>
      </YStack>
    </Card>
  )
}

export default function Catalog({ session, showHero = true }: CatalogProps) {
  const [selectedAdventureId, setSelectedAdventureId] = useState<string>(ADVENTURE_PATHS[0].id)
  const [activeSchool, setActiveSchool] = useState<'all' | SchoolId>('all')
  const [searchQuery, setSearchQuery] = useState<string>('')

  const signedIn = Boolean(session?.isAuthenticated)
  const activeAdventure = ADVENTURE_PATHS.find((p) => p.id === selectedAdventureId) || ADVENTURE_PATHS[0]
  const adventurePrimary = findCourse(activeAdventure.primaryCourseSlug)
  const adventureSecondary = activeAdventure.secondaryCourseSlug ? findCourse(activeAdventure.secondaryCourseSlug) : undefined
  const freeCourse = findCourse('continuous-improvement')!

  const normalizedQuery = searchQuery.trim().toLowerCase()
  const filteredCourses = UNIVERSITY_COURSES.filter((course) => {
    const matchesSchool = activeSchool === 'all' || course.school === activeSchool
    if (!matchesSchool) return false
    if (!normalizedQuery) return true
    return (
      course.code.toLowerCase().includes(normalizedQuery) ||
      course.title.toLowerCase().includes(normalizedQuery) ||
      course.summary.toLowerCase().includes(normalizedQuery) ||
      course.slug.toLowerCase().includes(normalizedQuery) ||
      course.credential.toLowerCase().includes(normalizedQuery) ||
      course.competencies.some((c) => c.toLowerCase().includes(normalizedQuery))
    )
  })

  return (
    <>
      {/* ── 0. TOP ANNOUNCEMENT BAR ── */}
      {showHero && (
        <Box
          py={11}
          px={16}
          bg="rgba(255, 255, 255, 0.03)"
          borderBottomWidth={1}
          borderColor="rgba(255, 255, 255, 0.08)"
          display="flex"
          justify="center"
          items="center"
        >
          <Link
            href="/continuous-improvement"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '10px',
              color: 'var(--white)',
              fontSize: '13px',
              textDecoration: 'none',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            <span
              style={{
                display: 'inline-block',
                width: '7px',
                height: '7px',
                borderRadius: '50%',
                backgroundColor: '#34d399',
                boxShadow: '0 0 8px rgba(52, 211, 153, 0.8)',
              }}
            />
            <Text fontFamily="$mono" fontSize={12} fontWeight="700" color="var(--emerald-400)">
              FREE FOUNDATION · AUTO 101:
            </Text>
            <Text fontSize={13} color="rgba(255, 255, 255, 0.9)">
              The Science of Continuous Improvement — Start free in hanzo.app/learn
            </Text>
            <span style={{ color: 'var(--white)', fontSize: '13px' }}>→</span>
          </Link>
        </Box>
      )}

      {/* ── 1. HERO SECTION ── */}
      {showHero && (
        <Band pad={72} measure={1080} rule={false}>
          <YStack items="center" gap={22} $platform-web={{ textAlign: 'center' }}>
            <Eyebrow>HANZO UNIVERSITY — THE SCHOOL OF INTELLIGENCE ENGINEERING</Eyebrow>
            <Title quiet={false}>Don&rsquo;t just learn AI. Build intelligence.</Title>
            <Lede maxW={780}>
              Learn to train models, engineer autonomous agents, conduct scientific research, secure infrastructure and build your own AI company.
            </Lede>

            {/* Primary CTAs */}
            <XStack justify="center" gap={12} mt={8} flexWrap="wrap">
              <Action href="#schools" fill>
                Explore courses
              </Action>
              <Action href="/continuous-improvement">
                Start learning free →
              </Action>
              <Action href="https://hanzo.app/learn">
                Open Learning Workspace ↗
              </Action>
              {signedIn ? null : (
                <Action href={SIGN_IN}>
                  Sign in
                </Action>
              )}
            </XStack>

            {/* 6 Discipline Chips */}
            <XStack justify="center" gap={8} mt={12} flexWrap="wrap" maxW={900}>
              {DISCIPLINE_CHIPS.map((chip) => (
                <Chip key={chip} px={12} py={5} fontSize={12} fontFamily="$mono">
                  {chip}
                </Chip>
              ))}
            </XStack>

            {/* Tagline */}
            <Text
              fontFamily="$mono"
              fontSize={13}
              fontWeight="600"
              color="rgba(255, 255, 255, 0.72)"
              letterSpacing={0.4}
              mt={4}
            >
              Real models. Real compute. Real experiments. Real skills.
            </Text>
          </YStack>
        </Band>
      )}

      {/* ── 2. FOUR INTERCONNECTED LAYERS BANNER ── */}
      <Band pad={32} measure={1240} rule={true}>
        <YStack gap={16}>
          <XStack items="center" justify="space-between" flexWrap="wrap" gap={8}>
            <Text fontFamily="$mono" fontSize={11} fontWeight="700" color="rgba(255, 255, 255, 0.55)" letterSpacing={1}>
              FOUR INTERCONNECTED LAYERS OF THE HANZO LEARNING ECOSYSTEM
            </Text>
            <Text fontFamily="$mono" fontSize={11} color="rgba(255, 255, 255, 0.55)">
              Discover → Understand → Build → Master &amp; Ship
            </Text>
          </XStack>

          <Grid columns={{ min: 240, max: 4 }} gap={14}>
            {ECOSYSTEM_LAYERS.map((layer) => (
              <a
                key={layer.step}
                href={layer.href}
                target={layer.external ? '_blank' : undefined}
                rel={layer.external ? 'noreferrer' : undefined}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <Card
                  p={18}
                  bg={layer.step === '04' ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)'}
                  borderWidth={1}
                  borderColor={layer.step === '04' ? 'rgba(255, 255, 255, 0.2)' : 'rgba(255, 255, 255, 0.08)'}
                  height="100%"
                >
                  <YStack gap={6}>
                    <XStack items="center" justify="space-between">
                      <Text fontFamily="$mono" fontSize={11} fontWeight="700" color="var(--emerald-400)">
                        {layer.step} · {layer.verb.toUpperCase()}
                      </Text>
                      <ExternalLink size={12} color="rgba(255, 255, 255, 0.5)" />
                    </XStack>
                    <Text fontFamily="$mono" fontSize={13} fontWeight="700" color="var(--white)">
                      {layer.host}
                    </Text>
                    <Text fontSize={12} color="rgba(255, 255, 255, 0.72)" lineHeight={18}>
                      {layer.desc}
                    </Text>
                  </YStack>
                </Card>
              </a>
            ))}
          </Grid>
        </YStack>
      </Band>

      {/* ── 3. INTERACTIVE "CHOOSE YOUR ADVENTURE / WHICH INTELLIGENCE SHOULD YOU USE?" ── */}
      <Band id="adventure" pad={64} measure={1240} rule={true}>
        <Head
          eyebrow="Choose Your Adventure · Architecture Selector"
          title="Which intelligence should you use?"
          lede="Select what you want to build. We match your goal to the right architecture, underlying computer science principles, free starting course, canonical docs guide, and certification track."
        />

        {/* Goal Selector Buttons */}
        <XStack justify="center" gap={10} mb={28} flexWrap="wrap">
          {ADVENTURE_PATHS.map((path) => {
            const isSelected = path.id === activeAdventure.id
            return (
              <button
                key={path.id}
                type="button"
                onClick={() => setSelectedAdventureId(path.id)}
                style={{
                  padding: '10px 16px',
                  borderRadius: '999px',
                  border: `1px solid ${isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.14)'}`,
                  background: isSelected ? '#ffffff' : 'rgba(255, 255, 255, 0.03)',
                  color: isSelected ? '#000000' : 'rgba(255, 255, 255, 0.85)',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: isSelected ? 700 : 500,
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  transition: 'all 0.15s ease',
                }}
              >
                <Compass size={14} color={isSelected ? '#000000' : 'rgba(255, 255, 255, 0.6)'} />
                <span>{path.goal}</span>
              </button>
            )
          })}
        </XStack>

        {/* Dynamic Recommendation Panel */}
        <Card
          p={28}
          bg="rgba(255, 255, 255, 0.03)"
          borderWidth={1}
          borderColor="rgba(255, 255, 255, 0.16)"
        >
          <Grid columns={{ min: 300, max: 2 }} gap={28}>
            {/* Left: Architecture & CS Principles */}
            <YStack gap={16}>
              <XStack items="center" gap={8} flexWrap="wrap">
                <Chip px={10} py={3} fontSize={11} fontFamily="$mono" color="var(--emerald-400)">
                  RECOMMENDED ARCHITECTURE
                </Chip>
                <Text fontFamily="$mono" fontSize={11} color="rgba(255, 255, 255, 0.6)">
                  Goal: {activeAdventure.goal}
                </Text>
              </XStack>

              <YStack gap={6}>
                <Text fontSize={26} fontWeight="800" color="var(--white)" lineHeight={32}>
                  {activeAdventure.architecture}
                </Text>
                <Text fontSize={15} fontWeight="600" color="rgba(255, 255, 255, 0.9)" lineHeight={22}>
                  {activeAdventure.tagline}
                </Text>
                <Text fontSize={14} color="rgba(255, 255, 255, 0.76)" lineHeight={22}>
                  {activeAdventure.summary}
                </Text>
              </YStack>

              <YStack gap={8} pt={8} borderTopWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
                <Text fontFamily="$mono" fontSize={11} fontWeight="700" color="rgba(255, 255, 255, 0.6)">
                  UNDERLYING CS &amp; SYSTEMS PRINCIPLES
                </Text>
                {activeAdventure.csPrinciples.map((principle, idx) => (
                  <XStack key={idx} items="flex-start" gap={8}>
                    <CheckCircle2 size={15} color="var(--emerald-400)" style={{ marginTop: 2, flexShrink: 0 }} />
                    <Text fontSize={13} color="rgba(255, 255, 255, 0.88)" lineHeight={19}>
                      {principle}
                    </Text>
                  </XStack>
                ))}
              </YStack>
            </YStack>

            {/* Right: Recommended Learning Path & 1-Click Launch */}
            <YStack gap={14} justify="space-between">
              <YStack gap={10}>
                <Text fontFamily="$mono" fontSize={11} fontWeight="700" color="rgba(255, 255, 255, 0.6)">
                  YOUR SELF-SERVE PATHWAY
                </Text>

                {/* Step 1: Free Foundation */}
                <Link href={`/${freeCourse.slug}`} style={{ textDecoration: 'none' }}>
                  <Box p={12} rounded="var(--radius-md)" bg="var(--pure-black)" borderWidth={1} borderColor="rgba(16, 185, 129, 0.28)">
                    <XStack items="center" justify="space-between" gap={8}>
                      <YStack gap={2} flex={1} minW={0}>
                        <Text fontFamily="$mono" fontSize={10} color="var(--emerald-400)" fontWeight="700">
                          1. STARTING FREE COURSE · {freeCourse.code}
                        </Text>
                        <Text fontSize={14} fontWeight="700" color="var(--white)">
                          {freeCourse.title}
                        </Text>
                      </YStack>
                      <Text fontFamily="$mono" fontSize={12} color="var(--emerald-400)" fontWeight="700">
                        FREE →
                      </Text>
                    </XStack>
                  </Box>
                </Link>

                {/* Step 2: Primary & Secondary Course */}
                {adventurePrimary && (
                  <Link href={`/${adventurePrimary.slug}`} style={{ textDecoration: 'none' }}>
                    <Box p={12} rounded="var(--radius-md)" bg="var(--pure-black)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.14)">
                      <XStack items="center" justify="space-between" gap={8}>
                        <YStack gap={2} flex={1} minW={0}>
                          <Text fontFamily="$mono" fontSize={10} color="rgba(255, 255, 255, 0.6)" fontWeight="700">
                            2. CORE COURSE · {adventurePrimary.code}
                          </Text>
                          <Text fontSize={14} fontWeight="700" color="var(--white)">
                            {adventurePrimary.title}
                          </Text>
                          {adventureSecondary && (
                            <Text fontSize={11} color="rgba(255, 255, 255, 0.65)">
                              Followed by {adventureSecondary.code}: {adventureSecondary.title}
                            </Text>
                          )}
                        </YStack>
                        <Text fontFamily="$mono" fontSize={12} color="var(--white)" fontWeight="700">
                          ${adventurePrimary.price} →
                        </Text>
                      </XStack>
                    </Box>
                  </Link>
                )}

                {/* Step 3: Practical Guide + Certification Track */}
                <Grid columns={{ min: 190, max: 2 }} gap={10}>
                  <a
                    href={activeAdventure.guideUrl}
                    target="_blank"
                    rel="noreferrer"
                    style={{ textDecoration: 'none' }}
                  >
                    <Box p={12} rounded="var(--radius-md)" bg="rgba(255, 255, 255, 0.03)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.08)" height="100%">
                      <Text fontFamily="$mono" fontSize={10} color="rgba(255, 255, 255, 0.55)">
                        PRACTICAL GUIDE (DOCS)
                      </Text>
                      <XStack items="center" justify="space-between" gap={6} mt={4}>
                        <Text fontSize={12} fontWeight="600" color="var(--white)">
                          {activeAdventure.guideLabel}
                        </Text>
                        <ExternalLink size={12} color="var(--white)" style={{ flexShrink: 0 }} />
                      </XStack>
                    </Box>
                  </a>

                  <Link href={`/checkout/${activeAdventure.trackSlug}`} style={{ textDecoration: 'none' }}>
                    <Box p={12} rounded="var(--radius-md)" bg="rgba(255, 255, 255, 0.03)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.08)" height="100%">
                      <Text fontFamily="$mono" fontSize={10} color="rgba(255, 255, 255, 0.55)">
                        CERTIFICATION TRACK
                      </Text>
                      <XStack items="center" justify="space-between" gap={6} mt={4}>
                        <Text fontSize={12} fontWeight="600" color="var(--white)">
                          {activeAdventure.trackName}
                        </Text>
                        <ArrowRight size={12} color="var(--white)" style={{ flexShrink: 0 }} />
                      </XStack>
                    </Box>
                  </Link>
                </Grid>
              </YStack>

              {/* 1-Click Self-Serve Launch Buttons */}
              {adventurePrimary && (
                <XStack gap={10} flexWrap="wrap" pt={6}>
                  <Action href={adventurePrimary.learnWorkspaceUrl} fill>
                    Launch in hanzo.app/learn ↗
                  </Action>
                  <Action href={`/${adventurePrimary.slug}`}>
                    View Syllabus
                  </Action>
                  <Action href={courseCheckoutUrl(adventurePrimary.slug)}>
                    Enroll — ${adventurePrimary.price}
                  </Action>
                </XStack>
              )}
            </YStack>
          </Grid>
        </Card>
      </Band>

      {/* ── 4. FREE FOUNDATIONAL COURSE SPOTLIGHT (AUTO 101) ── */}
      <Band pad={48} measure={1240} rule={true}>
        <Card
          p={28}
          bg="rgba(16, 185, 129, 0.04)"
          borderWidth={1}
          borderColor="rgba(16, 185, 129, 0.26)"
        >
          <XStack items="center" justify="space-between" flexWrap="wrap" gap={24}>
            <YStack gap={12} flex={1} minW={280}>
              <XStack items="center" gap={8} flexWrap="wrap">
                <Chip px={10} py={3} fontSize={11} fontFamily="$mono" color="var(--emerald-400)">
                  FREE FOUNDATIONAL COURSE · AUTO 101 · 2 WEEKS
                </Chip>
                <Text fontFamily="$mono" fontSize={11} color="rgba(255, 255, 255, 0.65)">
                  NO CREDIT CARD REQUIRED
                </Text>
              </XStack>

              <Text fontSize={26} fontWeight="800" color="var(--white)" lineHeight={32}>
                {freeCourse.title}
              </Text>

              <Text fontSize={14} color="rgba(255, 255, 255, 0.84)" lineHeight={22} maxW={760}>
                {freeCourse.summary}
              </Text>

              <XStack gap={8} flexWrap="wrap" pt={2}>
                {[
                  'Marketing Autopilot',
                  'Autonomous Science',
                  'Model Training',
                  'Cybersecurity',
                  'Infrastructure',
                  'Causal Inference',
                  'Bandits & Bayesian Opt',
                  'Goodhart & Reward Hacking',
                ].map((topic) => (
                  <Chip key={topic} px={9} py={3} fontSize={11} fontFamily="$mono">
                    {topic}
                  </Chip>
                ))}
              </XStack>
            </YStack>

            <YStack gap={10} minW={240}>
              <Action href="/continuous-improvement" fill>
                Start AUTO 101 Free →
              </Action>
              <Action href={freeCourse.learnWorkspaceUrl}>
                Launch Lab on hanzo.app/learn ↗
              </Action>
            </YStack>
          </XStack>
        </Card>
      </Band>

      {/* ── 5. FULL 25-COURSE CATALOG ACROSS 4 SCHOOLS + FREE FOUNDATION ── */}
      <Band id="schools" pad={64} measure={1280} rule={true}>
        <div id="curriculum" />
        <Head
          eyebrow="4 Schools + Free Foundation · 25 Courses"
          title="The Complete Intelligence Engineering Catalog"
          lede="Every course includes interactive labs on hanzo.app/learn, AI Faculty mentorship, canonical docs.hanzo.ai references, and a required deployed capstone artifact."
        />

        {/* School Filter Tabs + Search Input */}
        <YStack gap={16} mb={32}>
          <XStack items="center" justify="space-between" flexWrap="wrap" gap={12}>
            <XStack items="center" gap={8} flexWrap="wrap">
              {[
                { id: 'all' as const, label: `All ${UNIVERSITY_COURSES.length} Courses` },
                ...SCHOOLS.map((s) => ({
                  id: s.id,
                  label: `${s.shortName} (${UNIVERSITY_COURSES.filter((c) => c.school === s.id).length})`,
                })),
              ].map((tab) => {
                const isActive = activeSchool === tab.id
                return (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveSchool(tab.id)}
                    style={{
                      padding: '7px 14px',
                      borderRadius: '9999px',
                      border: `1px solid ${isActive ? 'var(--white)' : 'rgba(255, 255, 255, 0.14)'}`,
                      background: isActive ? 'var(--white)' : 'rgba(255, 255, 255, 0.03)',
                      color: isActive ? 'var(--pure-black)' : 'rgba(255, 255, 255, 0.78)',
                      cursor: 'pointer',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '12px',
                      fontWeight: isActive ? 700 : 500,
                      transition: 'all 0.15s ease',
                    }}
                  >
                    {tab.label}
                  </button>
                )
              })}
            </XStack>

            {/* Quick Course Search */}
            <Box position="relative" minW={240} maxW={320} width="100%">
              <Search
                size={14}
                color="rgba(255, 255, 255, 0.45)"
                style={{ position: 'absolute', left: 12, top: 11, pointerEvents: 'none' }}
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by code, topic, or slug..."
                aria-label="Filter courses"
                style={{
                  width: '100%',
                  padding: '8px 12px 8px 34px',
                  borderRadius: '999px',
                  background: 'rgba(255, 255, 255, 0.04)',
                  border: '1px solid rgba(255, 255, 255, 0.12)',
                  color: '#ffffff',
                  fontSize: '13px',
                  outline: 'none',
                  boxSizing: 'border-box',
                }}
              />
            </Box>
          </XStack>
        </YStack>

        {/* Grouped by School (when browsing all without search) OR Filtered Grid */}
        {activeSchool === 'all' && !normalizedQuery ? (
          <YStack gap={48}>
            {SCHOOLS.map((school) => {
              const schoolCourses = UNIVERSITY_COURSES.filter((c) => c.school === school.id)
              const IconComp = SCHOOL_ICONS[school.id]
              return (
                <YStack key={school.id} id={`school-${school.id}`} gap={20}>
                  <XStack
                    items="flex-end"
                    justify="space-between"
                    flexWrap="wrap"
                    gap={12}
                    pb={14}
                    borderBottomWidth={1}
                    borderColor="rgba(255, 255, 255, 0.1)"
                  >
                    <YStack gap={6} maxW={780}>
                      <XStack items="center" gap={8}>
                        <IconComp size={15} color="var(--emerald-400)" />
                        <Text fontFamily="$mono" fontSize={11} fontWeight="700" color="var(--emerald-400)" letterSpacing={0.8}>
                          {school.eyebrow}
                        </Text>
                      </XStack>
                      <Text fontSize={24} fontWeight="800" color="var(--white)">
                        {school.name}
                      </Text>
                      <Text fontSize={14} color="rgba(255, 255, 255, 0.74)" lineHeight={21}>
                        {school.description}
                      </Text>
                    </YStack>

                    <Chip px={10} py={3} fontSize={11} fontFamily="$mono">
                      {schoolCourses.length} {schoolCourses.length === 1 ? 'COURSE' : 'COURSES'}
                    </Chip>
                  </XStack>

                  <Grid columns={{ min: 320, max: schoolCourses.length === 1 ? 1 : 3 }} gap={18}>
                    {schoolCourses.map((course) => (
                      <CourseCard key={course.slug} course={course} />
                    ))}
                  </Grid>
                </YStack>
              )
            })}
          </YStack>
        ) : (
          <YStack gap={16}>
            {filteredCourses.length === 0 ? (
              <Card p={32} bg="rgba(255, 255, 255, 0.02)">
                <YStack items="center" gap={10}>
                  <Text fontSize={16} fontWeight="700" color="var(--white)">
                    No courses match &ldquo;{searchQuery}&rdquo;
                  </Text>
                  <button
                    type="button"
                    onClick={() => {
                      setSearchQuery('')
                      setActiveSchool('all')
                    }}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '999px',
                      background: 'var(--white)',
                      color: 'var(--pure-black)',
                      border: 'none',
                      fontWeight: 600,
                      fontSize: '13px',
                      cursor: 'pointer',
                    }}
                  >
                    Reset filters
                  </button>
                </YStack>
              </Card>
            ) : (
              <Grid columns={{ min: 320, max: 3 }} gap={18}>
                {filteredCourses.map((course) => (
                  <CourseCard key={course.slug} course={course} />
                ))}
              </Grid>
            )}
          </YStack>
        )}
      </Band>

      {/* ── 6. SIX FLAGSHIP CERTIFICATION TRACKS ── */}
      <Band id="certifications" pad={64} measure={1280} rule={true}>
        <Head
          eyebrow="6 Flagship Certification Tracks"
          title="Structured Pathways to Applied Mastery"
          lede="Combine core courses into an end-to-end professional certification or applied fellowship verified through live capstone deployment."
        />

        <Grid columns={{ min: 340, max: 3 }} gap={20}>
          {CERTIFICATION_TRACKS.map((track) => (
            <Card
              key={track.slug}
              p={24}
              bg={track.slug === 'intelligence-engineering-fellowship' ? 'rgba(255, 255, 255, 0.04)' : 'rgba(255, 255, 255, 0.02)'}
              borderWidth={1}
              borderColor={
                track.slug === 'intelligence-engineering-fellowship'
                  ? 'rgba(255, 255, 255, 0.22)'
                  : 'rgba(255, 255, 255, 0.09)'
              }
            >
              <YStack gap={16} height="100%" justify="space-between">
                <YStack gap={12}>
                  <XStack items="center" justify="space-between" flexWrap="wrap" gap={6}>
                    <Chip px={8} py={2} fontSize={11} fontFamily="$mono" color="var(--emerald-400)">
                      {track.credentialCode} · {track.duration}
                    </Chip>
                    <Text fontFamily="$mono" fontSize={10} color="rgba(255, 255, 255, 0.6)">
                      {track.credentialType}
                    </Text>
                  </XStack>

                  <Text fontSize={20} fontWeight="800" color="var(--white)" lineHeight={26}>
                    {track.name}
                  </Text>

                  <Text fontSize={13} color="rgba(255, 255, 255, 0.78)" lineHeight={20}>
                    {track.summary}
                  </Text>

                  {/* Included Courses */}
                  <YStack gap={6}>
                    <Text fontFamily="$mono" fontSize={10} color="rgba(255, 255, 255, 0.55)" fontWeight="700">
                      INCLUDED COURSES
                    </Text>
                    <XStack gap={6} flexWrap="wrap">
                      {track.courseSlugs.map((slug, idx) => (
                        <Link
                          key={slug}
                          href={`/${slug}`}
                          style={{
                            padding: '4px 9px',
                            borderRadius: '6px',
                            background: 'var(--pure-black)',
                            border: '1px solid rgba(255, 255, 255, 0.14)',
                            color: 'var(--white)',
                            fontFamily: 'var(--font-mono)',
                            fontSize: '11px',
                            fontWeight: 600,
                            textDecoration: 'none',
                          }}
                        >
                          {track.courseCodes[idx]}
                        </Link>
                      ))}
                    </XStack>
                  </YStack>

                  {/* Capstone Requirement */}
                  <Box p={10} rounded="var(--radius-md)" bg="var(--pure-black)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.06)">
                    <Text fontFamily="$mono" fontSize={10} color="rgba(255, 255, 255, 0.55)" fontWeight="700">
                      CAPSTONE REQUIREMENT
                    </Text>
                    <Text fontSize={12} color="rgba(255, 255, 255, 0.85)" mt={3} lineHeight={17}>
                      {track.capstoneRequirement}
                    </Text>
                  </Box>
                </YStack>

                <XStack
                  items="center"
                  justify="space-between"
                  pt={14}
                  borderTopWidth={1}
                  borderColor="rgba(255, 255, 255, 0.08)"
                  gap={10}
                >
                  <XStack items="baseline" gap={4}>
                    <Text fontSize={24} fontWeight="800" color="var(--white)" fontFamily="$mono">
                      ${track.price}
                    </Text>
                    <Text fontSize={11} color="rgba(255, 255, 255, 0.55)">
                      USD
                    </Text>
                  </XStack>

                  <Action href={`/checkout/${track.slug}`} fill>
                    Enroll Track →
                  </Action>
                </XStack>
              </YStack>
            </Card>
          ))}
        </Grid>
      </Band>

      {/* ── 7. TRANSPARENT SELF-SERVICE COMMERCIAL MODEL & PRICING ── */}
      <Band id="pricing" pad={64} measure={1280} rule={true}>
        <Head
          eyebrow="Transparent Self-Service Pricing"
          title="Start Free. Scale as You Build."
          lede="Every paid course and track includes a sandboxed lab environment and scoped compute credits aligned directly to coursework requirements—with transparent one-time or self-serve pricing."
        />

        <Grid columns={{ min: 260, max: 4 }} gap={16}>
          {PRICING_TIERS.map((tier) => (
            <Card
              key={tier.id}
              p={22}
              bg={tier.highlight ? 'rgba(255, 255, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)'}
              borderWidth={1}
              borderColor={tier.highlight ? 'rgba(255, 255, 255, 0.24)' : 'rgba(255, 255, 255, 0.08)'}
            >
              <YStack gap={14} height="100%" justify="space-between">
                <YStack gap={10}>
                  <YStack gap={4}>
                    <Text fontSize={16} fontWeight="700" color="var(--white)">
                      {tier.name}
                    </Text>
                    <Text fontSize={24} fontWeight="800" color="var(--white)" fontFamily="$mono">
                      {tier.price}
                    </Text>
                    <Text fontFamily="$mono" fontSize={11} color="rgba(255, 255, 255, 0.55)">
                      {tier.cadence}
                    </Text>
                  </YStack>

                  <Text fontSize={13} color="rgba(255, 255, 255, 0.78)" lineHeight={19}>
                    {tier.description}
                  </Text>

                  <YStack gap={6} pt={6} borderTopWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
                    {tier.includes.map((inc, idx) => (
                      <XStack key={idx} items="flex-start" gap={7}>
                        <Check size={13} color="var(--emerald-400)" style={{ marginTop: 3, flexShrink: 0 }} />
                        <Text fontSize={12} color="rgba(255, 255, 255, 0.84)" lineHeight={17}>
                          {inc}
                        </Text>
                      </XStack>
                    ))}
                  </YStack>
                </YStack>

                <Action href={tier.ctaHref} fill={Boolean(tier.highlight)}>
                  {tier.ctaLabel}
                </Action>
              </YStack>
            </Card>
          ))}
        </Grid>
      </Band>

      {/* ── 8. AI FACULTY BOTS & HONEST W3C CREDENTIALS ── */}
      <Band id="credentials" pad={64} measure={1280} rule={true}>
        <Head
          eyebrow="AI Faculty Mentors & Practical Proof"
          title="Guided by Specialist AI Faculty. Verified by Running Code."
          lede="Every lab inside hanzo.app/learn pairs you with domain-specialist AI Faculty bots and automated cleanroom capstone grading."
        />

        {/* 8 AI Faculty Bots */}
        <Grid columns={{ min: 240, max: 4 }} gap={14} mb={28}>
          {Object.values(AI_FACULTY_BOTS).map((bot) => (
            <Card key={bot.id} p={18} bg="rgba(255, 255, 255, 0.02)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
              <YStack gap={6}>
                <XStack items="center" justify="space-between">
                  <Text fontFamily="$mono" fontSize={14} fontWeight="800" color="var(--emerald-400)">
                    {bot.id}
                  </Text>
                  <Text fontFamily="$mono" fontSize={10} color="rgba(255, 255, 255, 0.55)">
                    {bot.role}
                  </Text>
                </XStack>
                <Text fontSize={14} fontWeight="700" color="var(--white)">
                  {bot.name}
                </Text>
                <Text fontSize={12} color="rgba(255, 255, 255, 0.74)" lineHeight={18}>
                  {bot.specialty}
                </Text>
              </YStack>
            </Card>
          ))}
        </Grid>

        {/* Honest W3C Verifiable Credentials Callout */}
        <Card p={28} bg="rgba(255, 255, 255, 0.03)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.12)">
          <XStack items="center" justify="space-between" flexWrap="wrap" gap={20}>
            <YStack gap={10} flex={1} minW={280}>
              <XStack items="center" gap={8}>
                <ShieldCheck size={18} color="var(--emerald-400)" />
                <Text fontFamily="$mono" fontSize={12} fontWeight="700" color="var(--emerald-400)">
                  W3C VERIFIABLE CREDENTIALS · PRACTICAL PROOF OF WORK
                </Text>
              </XStack>
              <Text fontSize={20} fontWeight="800" color="var(--white)">
                Cryptographic Proof of Completed Practical Capstones &amp; Live Artifacts
              </Text>
              <Text fontSize={14} color="rgba(255, 255, 255, 0.8)" lineHeight={22} maxW={780}>
                Every passing capstone issues a W3C Verifiable Credential (JSON-LD + Ed25519 signature) linking directly to your automated cleanroom evaluation record and deployed artifact. Hanzo University issues professional certifications, masterclasses, and applied fellowships—not accredited academic degrees.
              </Text>
            </YStack>

            <YStack gap={10} minW={220}>
              <Action href="/verify" fill>
                Verify a Credential →
              </Action>
              <Action href="/portal">
                Open Student Portal
              </Action>
            </YStack>
          </XStack>
        </Card>
      </Band>

      {/* ── 9. FREQUENTLY ASKED QUESTIONS ── */}
      <Band id="faqs" pad={64} measure={1120} rule={true}>
        <Head
          eyebrow="Frequently Asked Questions"
          title="How Hanzo University Works"
          lede="Straight answers on free access, lab compute, W3C credentials, coupons, and self-service enrollment."
        />

        <Grid columns={{ min: 300, max: 2 }} gap={18}>
          {[
            {
              q: 'Where should I start if I am new to Hanzo?',
              a: 'Start free with AUTO 101: The Science of Continuous Improvement (no credit card required), or use the interactive "Which intelligence should you use?" selector above to jump directly to Kai, Zen, Enso, Science, Cyber, Autopilot, or Entrepreneurship.',
            },
            {
              q: 'How do lab compute credits and sandboxes work?',
              a: 'Every course includes a sandboxed lab environment on hanzo.app/learn and scoped compute credits sized to the actual labs and capstone requirements of that course. You can also run open-weight Zen models locally on Apple Silicon or Linux GPUs.',
            },
            {
              q: 'Are Hanzo University certifications accredited academic degrees?',
              a: 'No. Hanzo University awards professional certifications, masterclasses, and applied fellowships. Our W3C Verifiable Credentials provide cryptographic proof that you built, verified, and deployed real capstone artifacts against automated engineering harnesses.',
            },
            {
              q: 'How does University Pro relate to Hanzo Pro?',
              a: 'University Pro is bundled with Hanzo Pro as a single self-service membership managed through hanzo.ai/pay, giving you access to all 25 courses alongside the Hanzo Pro developer workspace, APIs, and sandboxes.',
            },
            {
              q: 'Do you offer student discounts or team licensing?',
              a: 'Yes. Students and community builders can apply verified promo codes (such as STUDENT50 or HANZO20) directly on any course page before checkout. Teams can provision seats with SSO/IAM and custom enterprise capstones.',
            },
            {
              q: 'Can I build and launch a real business during ENT 401?',
              a: 'Yes. ENT 401: Build Your Own AI Company walks you through shipping your own live white-label AI product—with IAM auth, custom Kai/Zen capabilities, metered APIs, self-serve billing, licensing, and Autopilot distribution.',
            },
          ].map((faq, idx) => (
            <Card key={idx} p={22} bg="rgba(255, 255, 255, 0.02)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
              <YStack gap={8}>
                <Text fontSize={16} fontWeight="700" color="var(--white)">
                  {faq.q}
                </Text>
                <Text fontSize={13} color="rgba(255, 255, 255, 0.8)" lineHeight={21}>
                  {faq.a}
                </Text>
              </YStack>
            </Card>
          ))}
        </Grid>
      </Band>

      {/* ── 10. FINAL CALL TO ACTION ── */}
      <Band pad={72} measure={860} rule={true}>
        <YStack items="center" $platform-web={{ textAlign: 'center' }} gap={18}>
          <Eyebrow>The School of Intelligence Engineering</Eyebrow>
          <Title quiet={false}>Build real intelligence.</Title>
          <Lede>
            Start free with AUTO 101, open the interactive learning workspace on hanzo.app/learn, or enroll in a flagship certification track today.
          </Lede>
          <XStack justify="center" gap={12} mt={8} flexWrap="wrap">
            <Action href="/continuous-improvement" fill>
              Start learning free →
            </Action>
            <Action href="https://hanzo.app/learn">
              Open Learning Workspace ↗
            </Action>
            <Action href="#schools">
              Explore all 25 courses
            </Action>
            {signedIn ? null : (
              <Action href={SIGN_IN}>
                Sign in
              </Action>
            )}
          </XStack>
        </YStack>
      </Band>
    </>
  )
}
