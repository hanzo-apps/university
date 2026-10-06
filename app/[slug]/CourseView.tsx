'use client'

import React from 'react'
import Link from 'next/link'
import { Hero, Band, Card, Head } from '@/components/band'
import { Box, Text, XStack, YStack } from '@/components/ui'
import { Action, Title, Lede, Eyebrow, Chip } from '@hanzo/ui/marketing'
import { Grid } from '@hanzo/ui/grid'
import {
  CheckCircle2,
  GraduationCap,
  Coins,
  BookOpen,
  Check,
  Code2,
} from 'lucide-react'
import { UNIVERSITY_COURSES, type UniversityCourse } from '../courses-data'
import { courseCheckoutUrl } from '@/lib/pay'

export function CourseView({ course }: { course: UniversityCourse }) {
  const defaultEnrollUrl = courseCheckoutUrl(course.slug)


  return (
    <Box minH="100vh" bg="$background" $platform-web={{ color: 'var(--foreground)' }}>
      {/* ── Breadcrumb & Hero ── */}
      <Hero
        crumb={`${course.code}: ${course.title}`}
        badge={`Course ${course.code} · Units: ${course.units}.0 · Credential: ${course.credential}`}
        title={`${course.title}`}
        lede={<>{course.summary}</>}
      >
        <Action href={defaultEnrollUrl} fill>
          Enroll in {course.code} — ${course.price} USD (+${course.rebateCredits} Credit Rebate)
        </Action>
        <Action href="/portal">
          Preview Enrolled Student Portal →
        </Action>
      </Hero>

      {/* ── Course Specification Matrix & Tuition Card ── */}
      <Band pad={40} measure={1152}>
        <Grid columns={{ min: 340, max: 2 }} gap={24}>
          {/* Academic Specifications Card */}
          <Card p={24} display="flex" flexDirection="column" justify="space-between" borderWidth={1} borderColor="var(--border)">
            <YStack gap="$5">
              <XStack items="center" justify="space-between">
                <Text fontSize="$1" fontFamily="$mono" color="var(--white-70)" letterSpacing={1}>
                  ACADEMIC SPECIFICATIONS
                </Text>
                <Chip px={10} py={2} fontSize="$1" fontFamily="$mono">
                  {course.code} · {course.units}.0 UNITS
                </Chip>
              </XStack>

              <Grid columns={{ min: 140, max: 2 }} gap={16}>
                <YStack
                  gap="$1"
                  p="$3"
                  rounded="var(--radius-lg)"
                  bg="var(--pure-black)"
                  borderWidth={1}
                  borderColor="var(--border)"
                >
                  <Text fontFamily="$mono" fontSize="$1" color="var(--muted-foreground)">
                    DURATION
                  </Text>
                  <Text fontSize="$2" fontWeight="700" color="var(--white)">
                    {course.duration}
                  </Text>
                </YStack>

                <YStack
                  gap="$1"
                  p="$3"
                  rounded="var(--radius-lg)"
                  bg="var(--pure-black)"
                  borderWidth={1}
                  borderColor="var(--border)"
                >
                  <Text fontFamily="$mono" fontSize="$1" color="var(--muted-foreground)">
                    LEVEL
                  </Text>
                  <Text fontSize="$2" fontWeight="700" color="var(--white)">
                    {course.level}
                  </Text>
                </YStack>

                <YStack
                  gap="$1"
                  p="$3"
                  rounded="var(--radius-lg)"
                  bg="var(--pure-black)"
                  borderWidth={1}
                  borderColor="var(--border)"
                >
                  <Text fontFamily="$mono" fontSize="$1" color="var(--muted-foreground)">
                    CREDENTIAL
                  </Text>
                  <Text fontSize="$2" fontWeight="700" color="var(--white)">
                    {course.credential}
                  </Text>
                </YStack>

                <YStack
                  gap="$1"
                  p="$3"
                  rounded="var(--radius-lg)"
                  bg="var(--pure-black)"
                  borderWidth={1}
                  borderColor="var(--border)"
                >
                  <Text fontFamily="$mono" fontSize="$1" color="var(--muted-foreground)">
                    ACCREDITATION
                  </Text>
                  <Text fontSize="$2" fontWeight="700" color="var(--white)">
                    W3C Verifiable Credential
                  </Text>
                </YStack>
              </Grid>

              <YStack gap="$2" pt="$2">
                <Text fontSize="$1" fontWeight="700" color="var(--white)">
                  Lead Faculty & Academic Direction
                </Text>
                <XStack items="center" gap="$3">
                  <Box
                    width={36}
                    height={36}
                    rounded={9999}
                    bg="var(--neutral-800)"
                    items="center"
                    justify="center"
                  >
                    <GraduationCap size={18} color="var(--white)" />
                  </Box>
                  <YStack>
                    <Text fontSize="$1" fontWeight="600" color="var(--white)">
                      {course.instructor.name}
                    </Text>
                    <Text fontSize="$1" color="var(--muted-foreground)">
                      {course.instructor.role}
                    </Text>
                  </YStack>
                </XStack>
              </YStack>

              <YStack gap="$2">
                <Text fontSize="$1" fontWeight="700" color="var(--white)">
                  Prerequisites
                </Text>
                <Text fontSize="$1" color="var(--muted-foreground)">
                  {course.prerequisites}
                </Text>
              </YStack>
            </YStack>
          </Card>

          {/* Tuition & Enrollment Card */}
          <Card p={24} display="flex" flexDirection="column" justify="space-between" borderWidth={1} borderColor="var(--border)">
            <YStack gap="$4">
              <XStack items="center" justify="space-between">
                <Text fontSize="$1" fontFamily="$mono" color="var(--white-70)" letterSpacing={1}>
                  TUITION & COMPUTE REBATE
                </Text>
                <Chip px={8} py={2} fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">
                  OPEN ENROLLMENT
                </Chip>
              </XStack>

              {/* Tuition Price and Rebate Breakdown */}
              <YStack
                gap="$3"
                p={20}
                bg="var(--pure-black)"
                rounded="var(--radius-lg)"
                borderWidth={1}
                borderColor="var(--border)"
              >
                <XStack items="baseline" justify="space-between">
                  <YStack>
                    <Text fontSize="$1" fontFamily="$mono" color="var(--muted-foreground)">
                      TOTAL TUITION
                    </Text>
                    <XStack items="baseline" gap="$1">
                      <Text fontSize="$6" fontWeight="700" color="var(--white)">
                        ${course.price}
                      </Text>
                      <Text fontSize="$1" color="var(--muted-foreground)">
                        USD
                      </Text>
                    </XStack>
                  </YStack>
                  <Chip px={10} py={4} fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">
                    +${course.rebateCredits} CREDITS (25% REBATE)
                  </Chip>
                </XStack>
                <Text fontSize="$1" color="var(--muted-foreground)" lineHeight="$1">
                  Guaranteed compute allocation deposited immediately on enrollment. Subsidizes Zen 6 inference and gVisor sandbox runtimes.
                </Text>
              </YStack>

              {/* Primary Enrollment CTA Button */}
              <YStack gap="$2">
                <Action
                  href={defaultEnrollUrl}
                  fill
                  $platform-web={{
                    textAlign: 'center',
                    padding: '16px 24px',
                    fontWeight: 700,
                    fontSize: '15px',
                  }}
                >
                  Enroll in {course.code} — ${course.price} USD →
                </Action>
                <Text
                  fontSize="$1"
                  color="var(--muted-foreground)"
                  $platform-web={{ textAlign: 'center' }}
                >
                  Have a coupon code or fellowship grant? Enter it during checkout.
                </Text>
              </YStack>

              {/* Rebate Explanation Card */}
              <Card p={16} bg="$panel" borderWidth={1} borderColor="var(--border)">
                <XStack items="center" gap="$2" mb="$1">
                  <Coins size={16} color="var(--emerald-400)" />
                  <Text fontSize="$1" fontWeight="700" color="var(--white)">
                    Automatic 25% Compute Credit Rebate
                  </Text>
                </XStack>
                <Text fontSize="$1" color="var(--muted-foreground)" lineHeight="$2">
                  25% of tuition (rounded up) is immediately deposited into your Hanzo Cloud compute
                  balance on day one. Fully subsidizes your gVisor sandbox container leases and model
                  inference throughout the course.
                </Text>
              </Card>

              {/* Direct Portal Preview Link */}
              <XStack items="center" justify="center" gap="$2" pt="$1">
                <Text fontSize="$1" color="var(--muted-foreground)">
                  Already purchased?
                </Text>
                <Link
                  href="/portal"
                  style={{
                    color: 'var(--white)',
                    fontSize: '13px',
                    fontWeight: 600,
                    textDecoration: 'underline',
                  }}
                >
                  Enter Enrolled Student Portal →
                </Link>
              </XStack>
            </YStack>
          </Card>
        </Grid>
      </Band>

      {/* ── Core Competencies Band ── */}
      <Band pad={40} measure={1152} ground="var(--pure-black)">
        <Head
          eyebrow="Competency Framework"
          title={`What you master in ${course.code}`}
          lede="Engineered for software practitioners building resilient autonomous production systems."
        />

        <Grid columns={{ min: 260, max: 4 }} gap={16}>
          {course.competencies.map((comp, idx) => (
            <Card key={idx} p={20} borderWidth={1} borderColor="var(--border)">
              <XStack items="flex-start" gap="$3">
                <Box
                  p="$2"
                  rounded="var(--radius-md)"
                  bg="$panel"
                  $platform-web={{ backgroundColor: 'color-mix(in srgb, var(--emerald-500) 15%, transparent)' }}
                >
                  <CheckCircle2 size={16} color="var(--emerald-400)" />
                </Box>
                <Text fontSize="$2" fontWeight="600" color="var(--white)" lineHeight="$2">
                  {comp}
                </Text>
              </XStack>
            </Card>
          ))}
        </Grid>
      </Band>

      {/* ── Complete Week-by-Week Syllabus ── */}
      <Band pad={48} measure={1152}>
        <Head
          eyebrow="Comprehensive Syllabus"
          title="Curriculum & Laboratory Breakdown"
          lede="Every module combines systems architecture lectures with hands-on containerized lab defense."
        />

        <YStack gap="$6">
          {course.syllabus.map((week) => (
            <Card key={week.week} p={24} borderWidth={1} borderColor="var(--border)">
              <YStack gap="$4">
                <XStack items="center" justify="space-between" flexWrap="wrap" gap="$2">
                  <XStack items="center" gap="$3">
                    <Chip px={10} py={3} fontSize="$1" fontFamily="$mono">
                      {week.code}
                    </Chip>
                    <Text fontSize="$4" fontWeight="700" color="var(--white)">
                      {week.title}
                    </Text>
                  </XStack>
                  <Text fontSize="$1" fontFamily="$mono" color="var(--muted-foreground)">
                    {week.week}
                  </Text>
                </XStack>

                <Text fontSize="$2" color="var(--white-80)" lineHeight="$2">
                  {week.summary}
                </Text>

                <Grid columns={{ min: 320, max: 2 }} gap={16} pt="$2">
                  <YStack gap="$2" p="$4" rounded="var(--radius-md)" bg="$panel" borderWidth={1} borderColor="var(--border)">
                    <Text fontSize="$1" fontWeight="700" color="var(--white)">
                      Key Topics & Lectures:
                    </Text>
                    {week.lectures.map((lec, lIdx) => (
                      <XStack key={lIdx} items="flex-start" gap="$2">
                        <Box mt={4}>
                          <Check size={12} color="var(--emerald-400)" />
                        </Box>
                        <Text fontSize="$1" color="var(--muted-foreground)">
                          {lec}
                        </Text>
                      </XStack>
                    ))}
                  </YStack>

                  <YStack gap="$2" p="$4" rounded="var(--radius-md)" bg="$panel" borderWidth={1} borderColor="var(--border)">
                    <Text fontSize="$1" fontWeight="700" color="var(--white)">
                      Assigned Readings:
                    </Text>
                    {week.readings.map((reading, rIdx) => (
                      <XStack key={rIdx} items="flex-start" gap="$2">
                        <Box mt={4}>
                          <BookOpen size={12} color="var(--white-60)" />
                        </Box>
                        <Text fontSize="$1" color="var(--muted-foreground)">
                          {reading}
                        </Text>
                      </XStack>
                    ))}
                  </YStack>
                </Grid>

                <Box
                  p="$3"
                  px="$4"
                  rounded="var(--radius-md)"
                  bg="var(--pure-black)"
                  borderWidth={1}
                  borderColor="var(--border)"
                >
                  <XStack items="center" gap="$2">
                    <Code2 size={16} color="var(--emerald-400)" />
                    <Text fontSize="$1" fontWeight="600" color="var(--white)">
                      {week.lab}
                    </Text>
                  </XStack>
                </Box>
              </YStack>
            </Card>
          ))}
        </YStack>
      </Band>

      {/* ── Capstone Project Defense Card ── */}
      <Band pad={40} measure={1080} ground="var(--pure-black)">
        <Card p={32} bg="$panel" borderColor="var(--border)" borderWidth={1}>
          <XStack items="center" justify="space-between" flexWrap="wrap" gap="$4">
            <YStack gap="$2" flex={1} minW={280}>
              <Eyebrow>Final Examination</Eyebrow>
              <Title quiet={false}>Capstone Defense & Credential Issuance</Title>
              <Lede maxW={640}>
                {course.capstone} Upon automated grading verification, your {course.credential} W3C Verifiable Credential is cryptographically signed and issued to your Hanzo DID.
              </Lede>
            </YStack>

            <YStack gap="$2">
              <Action href={defaultEnrollUrl} fill>
                Enroll in {course.code} — ${course.price}
              </Action>
              <Action href="/portal">
                Preview Student Portal
              </Action>
            </YStack>
          </XStack>
        </Card>
      </Band>

      {/* ── Switcher to All 6 Courses ── */}
      <Band pad={40} measure={1152}>
        <Head
          eyebrow="Hanzo University Tracks"
          title="Explore the Complete Curriculum"
          lede="Six specialized engineering credentials designed for the frontier of autonomous intelligence."
        />

        <Grid columns={{ min: 320, max: 3 }} gap={16}>
          {UNIVERSITY_COURSES.map((c) => (
            <Card
              key={c.slug}
              p={20}
              bg={c.slug === course.slug ? 'var(--pure-black)' : '$panel'}
              borderWidth={1}
              borderColor={c.slug === course.slug ? 'var(--white)' : 'var(--border)'}
            >
              <YStack gap="$3" justify="space-between" height="100%">
                <YStack gap="$2">
                  <XStack items="center" justify="space-between">
                    <Text fontSize="$1" fontFamily="$mono" color="var(--muted-foreground)">
                      {c.code}
                    </Text>
                    <Chip px={8} py={2} fontSize="$1" fontFamily="$mono">
                      {c.credential}
                    </Chip>
                  </XStack>
                  <Text fontSize="$3" fontWeight="700" color="var(--white)">
                    {c.title}
                  </Text>
                  <Text fontSize="$1" color="var(--muted-foreground)" numberOfLines={2}>
                    {c.summary}
                  </Text>
                </YStack>

                <XStack items="center" justify="space-between" pt="$3" borderTopWidth={1} borderColor="var(--border)">
                  <Text fontSize="$2" fontWeight="700" color="var(--white)">
                    ${c.price} USD
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
      </Band>
    </Box>
  )
}
