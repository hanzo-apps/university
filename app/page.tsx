'use client'

import React from 'react'
import Link from 'next/link'
import { Hero, Band, Card, Head } from '@/components/band'
import { Box, Text, XStack, YStack, View } from '@/components/ui'
import { Action, Title, Lede, Eyebrow, Chip } from '@hanzo/ui/marketing'
import { Grid } from '@hanzo/ui/grid'
import {
  Coins,
  Scale,
  Zap,
  Award,
  Terminal,
  Check,
  ArrowRight,
  ShieldCheck,
  Cpu,
  Layers,
  Sparkles,
  BookOpen,
  Code2,
  CheckCircle2,
  Lock,
  Boxes,
  TrendingUp,
  Briefcase,
  GitBranch,
  Binary,
  XCircle,
} from 'lucide-react'
import { UNIVERSITY_COURSES, type UniversityCourse } from './courses-data'
import { courseCheckoutUrl } from '@/lib/pay'

const COMPARISON_ROWS = [
  {
    dimension: 'Evaluation Standard',
    legacy: 'Multiple-choice memory quizzes & copy-paste tutorials',
    hanzo: 'Automated SWE-bench cleanroom CI grading & PR generation',
    advantage: 'Validates actual software construction',
  },
  {
    dimension: 'Execution Runtime',
    legacy: 'None or static cloud web consoles without isolation',
    hanzo: 'Ephemeral Google gVisor (runsc) user-space kernel sandboxes',
    advantage: 'Secure unprivileged execution boundary',
  },
  {
    dimension: 'Economic Controls',
    legacy: 'Unconstrained API token burning with runaway bills',
    hanzo: 'Integer micro-USD budget ceilings with in-band refusals',
    advantage: 'Guarantees bounded inferencing costs',
  },
  {
    dimension: 'Inter-Process Latency',
    legacy: 'High-overhead JSON-RPC (180ms+ per agent turn)',
    hanzo: 'Zero-copy ZAP RPC over Cap’n Proto (< 2ms microsecond IPC)',
    advantage: '10–100x lower inter-agent latency',
  },
  {
    dimension: 'Decision Architecture',
    legacy: 'Fragile natural language prompting & retry loops',
    hanzo: 'Finite-state Kai decision scoring with 0 output tokens',
    advantage: 'Zero hallucinations on control branches',
  },
  {
    dimension: 'Reinforcement Learning',
    legacy: 'Abstract RLHF theory slides without implementation',
    hanzo: 'Native Gymnasium MDP environments & Zoo Gym fine-tuning',
    advantage: 'Build production learned routing policies',
  },
  {
    dimension: 'Credential Proof',
    legacy: 'Static PDF or JPEG image hosted on vendor database',
    hanzo: 'W3C Cryptographic Verifiable Credential + live GitHub SVG',
    advantage: 'Permanent, tamper-proof on-chain verification',
  },
  {
    dimension: 'Tuition Economics',
    legacy: '100% sunk cost; students pay extra for cloud labs',
    hanzo: '25% usage credit rebate deposited on day one ($38–$63)',
    advantage: 'Tuition directly subsidizes your cloud compute',
  },
  {
    dimension: 'Recruiter & Hiring Signal',
    legacy: 'Dismissed by engineering leaders as surface-level',
    hanzo: 'Respected proof of production systems engineering',
    advantage: 'Fast-tracks to Staff / Systems Engineer roles',
  },
]

export default function UniversityHomePage() {
  return (
    <Box minH="100vh" bg="$background" $platform-web={{ color: 'var(--foreground)' }}>
      {/* ── 1. Hero ── */}
      <Hero
        badge="hanzo.university · Open Enrollment · 25% Usage Credit Rebate"
        title="Stop prompting. Start engineering."
        lede={
          <>
            Toy AI tutorials won&rsquo;t survive production. Hanzo University trains software
            engineers to architect, evaluate, and budget autonomous multi-agent systems with
            zero-copy protocols, gVisor sandboxing, and native reinforcement learning. Every course
            includes 25% compute credits deposited into your account on day one.
          </>
        }
      >
        <Action href="#curriculum" fill>
          Explore 3 Core Tracks ↓
        </Action>
        <Action href="/portal">
          Preview Student Portal →
        </Action>
        <Action href="/agentic-coding">
          ENG 100 Syllabus →
        </Action>
      </Hero>

      {/* ── 2. Interactive Terminal Sandbox Workstation ── */}
      <Band pad={56} measure={1152} rule={false}>
        <Box
          rounded="var(--radius-2xl)"
          borderWidth={1}
          borderColor="var(--border)"
          bg="var(--pure-black)"
          overflow="hidden"
        >
          {/* Workstation Header Bar */}
          <XStack
            items="center"
            justify="space-between"
            px="$5"
            py="$3"
            borderBottomWidth={1}
            borderColor="var(--border)"
            bg="rgba(10, 10, 10, 0.95)"
          >
            <XStack items="center" gap="$2">
              <View width={8} height={8} rounded="var(--radius-full)" bg="var(--white)" />
              <Text fontFamily="$mono" fontSize="$1" color="var(--white)" fontWeight="600">
                HANZO-LAB-POD-8921B
              </Text>
              <Text fontFamily="$mono" fontSize="$1" color="var(--muted-foreground)">
                · gVisor Sandbox Runtime · Zen 6 Local Serving (27.3B)
              </Text>
            </XStack>
            <Chip px={10} py={2} fontSize="$1" fontFamily="$mono">
              SWE-BENCH GRADE: 100% · PASS
            </Chip>
          </XStack>

          {/* Interactive Terminal Execution Simulation */}
          <Box p="$5" bg="var(--pure-black)">
            <YStack gap="$2">
              <XStack items="center" gap="$2">
                <Text fontFamily="$mono" fontSize="$1" color="var(--muted-foreground)">[04:12:08]</Text>
                <Text fontFamily="$mono" fontSize="$1" color="var(--white-70)">INITIALIZING EPHEMERAL GRADER CONTAINER POD_8921B (runsc sandbox, seccomp=strict)</Text>
              </XStack>
              <XStack items="center" gap="$2">
                <Text fontFamily="$mono" fontSize="$1" color="var(--muted-foreground)">[04:12:09]</Text>
                <Text fontFamily="$mono" fontSize="$1" color="var(--muted-foreground)">Cloning candidate repo git@github.com:candidate/eng-100-capstone.git [ref: release/v1.4]</Text>
              </XStack>
              <XStack items="center" gap="$2">
                <Text fontFamily="$mono" fontSize="$1" color="var(--muted-foreground)">[04:12:10]</Text>
                <Text fontFamily="$mono" fontSize="$1" color="var(--muted-foreground)">Leased ZAP Zero-Copy Cap’n Proto socket at /tmp/hanzo-zap-8921b.sock (latency: 1.4ms)</Text>
              </XStack>
              <XStack items="center" gap="$2">
                <Text fontFamily="$mono" fontSize="$1" color="var(--muted-foreground)">[04:12:11]</Text>
                <Text fontFamily="$mono" fontSize="$1" color="var(--white)">$ hanzo evals run --suite swe-bench-lite --model zen6 --budget 500000</Text>
              </XStack>
              <XStack items="center" gap="$2">
                <Text fontFamily="$mono" fontSize="$1" color="var(--muted-foreground)">[04:12:12]</Text>
                <Text fontFamily="$mono" fontSize="$1" color="var(--white-70)">[+] Turn 1: AST parsed src/engine/core.rs via tree-sitter. Injected failing reproduction test.</Text>
              </XStack>
              <XStack items="center" gap="$2">
                <Text fontFamily="$mono" fontSize="$1" color="var(--muted-foreground)">[04:12:14]</Text>
                <Text fontFamily="$mono" fontSize="$1" color="var(--white-70)">[+] Turn 2: Synthesized AST diff. Kai verification heuristic: done=0.96, verified=0.98 → PASS</Text>
              </XStack>
              <XStack items="center" gap="$2">
                <Text fontFamily="$mono" fontSize="$1" color="var(--muted-foreground)">[04:12:15]</Text>
                <Text fontFamily="$mono" fontSize="$1" color="var(--white)" fontWeight="700">[✓] Cleanroom test suite passed exit code 0. Total execution spend: 184,200 micro-USD ($0.184)</Text>
              </XStack>
              <XStack items="center" gap="$2">
                <Text fontFamily="$mono" fontSize="$1" color="var(--muted-foreground)">[04:12:16]</Text>
                <Text fontFamily="$mono" fontSize="$1" color="var(--white)" fontWeight="700">[✓] W3C Verifiable Credential issued: did:hanzo:trust:cert_88194 (Signed on-chain)</Text>
              </XStack>
            </YStack>
          </Box>

          {/* Workstation Footer Telemetry */}
          <XStack
            items="center"
            justify="space-between"
            flexWrap="wrap"
            gap="$3"
            px="$5"
            py="$3"
            borderTopWidth={1}
            borderColor="var(--border)"
            bg="rgba(10, 10, 10, 0.95)"
          >
            <XStack items="center" gap="$3">
              <Terminal size={15} color="var(--white)" />
              <Text fontFamily="$mono" fontSize="$1" color="var(--white-70)">
                Capstone Verification: Multi-File AST Refactoring & Autonomous PR Generation
              </Text>
            </XStack>
            <XStack items="center" gap="$4">
              <Text fontFamily="$mono" fontSize="$1" color="var(--muted-foreground)">
                Latency: <Text render="span" color="var(--white)">1.4ms</Text>
              </Text>
              <Text fontFamily="$mono" fontSize="$1" color="var(--muted-foreground)">
                Budget Ceiling: <Text render="span" color="var(--white)">500k µUSD</Text>
              </Text>
              <Text fontFamily="$mono" fontSize="$1" color="var(--muted-foreground)">
                Telemetry: <Text render="span" color="var(--white)">VERIFIED</Text>
              </Text>
            </XStack>
          </XStack>
        </Box>
      </Band>

      {/* ── 3. The 3 Core Engineering Programs (Curriculum) ── */}
      <Band id="curriculum" pad={72} measure={1280} ground="var(--pure-black)">
        <Head
          eyebrow="Curriculum Catalog"
          title="3 Core Engineering Programs"
          lede="Focused, production-tested curricula in agentic software engineering, native reinforcement learning, and distributed AI systems. All courses include W3C credentials and 25% compute credit rebates."
        />

        {/* 3-Course Layout */}
        <Grid columns={{ min: 340, max: 3 }} gap={28} mt="$6">
          {UNIVERSITY_COURSES.map((course) => {
            return (
              <Card
                key={course.code}
                p={28}
                display="flex"
                flexDirection="column"
                justify="space-between"
                borderWidth={1}
                borderColor="var(--border)"
                bg="$panel"
                position="relative"
              >
                <YStack gap="$4">
                  {/* Code & Credential Header */}
                  <XStack items="center" justify="space-between">
                    <Text fontFamily="$mono" fontSize="$1" color="var(--muted-foreground)">
                      {course.code} · {course.level}
                    </Text>
                    <Chip px={10} py={3} fontSize="$1" fontFamily="$mono" fontWeight="700">
                      {course.credential}
                    </Chip>
                  </XStack>

                  {/* Title & Duration */}
                  <YStack gap="$2">
                    <Text fontSize="$4" fontWeight="700" color="var(--white)" lineHeight="$4">
                      {course.title}
                    </Text>
                    <Text fontFamily="$mono" fontSize="$1" color="var(--emerald-400)">
                      {course.duration} · {course.units}.0 Academic Units
                    </Text>
                    <Text fontSize="$1" color="var(--muted-foreground)" lineHeight="$2">
                      {course.summary}
                    </Text>
                  </YStack>

                  {/* Capstone Deliverable Callout */}
                  <Box
                    p="$3"
                    rounded="var(--radius-md)"
                    bg="var(--pure-black)"
                    borderWidth={1}
                    borderColor="var(--border)"
                  >
                    <Text fontFamily="$mono" fontSize="$1" color="var(--white-70)" fontWeight="600" mb="$1">
                      Verified Capstone:
                    </Text>
                    <Text fontSize="$1" color="var(--muted-foreground)" lineHeight="$1">
                      {course.capstone}
                    </Text>
                  </Box>

                  {/* Core Competencies Checklist */}
                  <YStack gap="$2" my="$1">
                    <Text fontSize="$1" fontFamily="$mono" color="var(--white-70)">
                      Technical Competencies:
                    </Text>
                    {course.competencies.map((comp, i) => (
                      <XStack key={i} items="flex-start" gap="$2">
                        <Check size={14} color="var(--white)" style={{ marginTop: 3, flexShrink: 0 }} />
                        <Text fontSize="$1" color="var(--muted-foreground)" lineHeight="$1">
                          {comp}
                        </Text>
                      </XStack>
                    ))}
                  </YStack>
                </YStack>

                {/* Pricing & Enrollment Footer */}
                <YStack gap="$3" mt="$6" pt="$4" borderTopWidth={1} borderColor="var(--border)">
                  <XStack items="baseline" justify="space-between">
                    <XStack items="baseline" gap="$1">
                      <Text fontSize="$5" fontWeight="700" color="var(--white)">
                        ${course.price}
                      </Text>
                      <Text fontSize="$1" color="var(--muted-foreground)">
                        USD
                      </Text>
                    </XStack>
                    <Chip px={8} py={3} fontSize="$1" fontFamily="$mono" color="var(--white)">
                      +${course.rebateCredits} Credits (25%)
                    </Chip>
                  </XStack>

                  <XStack gap="$2" width="100%">
                    <Action href={`/${course.slug}`} flex={1} $platform-web={{ textAlign: 'center' }}>
                      Syllabus →
                    </Action>
                    <Action
                      href={courseCheckoutUrl(course.slug)}
                      fill
                      flex={1}
                      $platform-web={{ textAlign: 'center' }}
                    >
                      Enroll — ${course.price}
                    </Action>
                  </XStack>
                </YStack>
              </Card>
            )
          })}
        </Grid>
      </Band>

      {/* ── 4. The 25% Compute Rebate Value Proposition ── */}
      <Band id="fellowships" pad={72} measure={1152}>
        <Card
          p={32}
          borderWidth={1}
          borderColor="var(--border)"
          bg="$panel"
          display="flex"
          flexDirection="column"
          gap="$5"
        >
          <XStack items="center" justify="space-between" flexWrap="wrap" gap="$4">
            <XStack items="center" gap="$3">
              <Coins size={28} color="var(--white)" />
              <YStack gap="$1">
                <Text fontSize="$4" fontWeight="700" color="var(--white)">
                  Zero Lab Tax: 25% Usage Credit Rebate (Rounded Up)
                </Text>
                <Text fontSize="$2" color="var(--muted-foreground)">
                  We don&rsquo;t just sell coursework—we subsidize the compute you need to build it.
                </Text>
              </YStack>
            </XStack>
            <Chip py={8} px={16} fontSize="$1" fontWeight="700">
              100% Skin in the Game
            </Chip>
          </XStack>

          <Text fontSize="$1" color="var(--white-80)" lineHeight="$2">
            Every enrollment immediately deposits 25% of tuition (rounded up to the nearest dollar)
            directly into your Hanzo Cloud account. Use your credits across Zen 6 local &amp; cloud inference,
            Enso reasoning models, Kai finite-state decision loops, and gVisor sandbox container leases.
          </Text>

          {/* Rebate Tiers for the 3 Programs */}
          <Grid columns={{ min: 260, max: 3 }} gap={16} mt="$2">
            {[
              {
                code: 'ENG 100',
                title: 'Agentic Coding Systems',
                tuition: '$199 USD',
                rebate: '+$50 USD',
                desc: 'gVisor Sandboxes & SWE-bench Evals',
              },
              {
                code: 'RL 101',
                title: 'Native Reinforcement Learning',
                tuition: '$249 USD',
                rebate: '+$63 USD',
                desc: 'Gymnasium & Zoo Gym GPU Clusters',
              },
              {
                code: 'SYS 103',
                title: 'Systems Engineering',
                tuition: '$149 USD',
                rebate: '+$38 USD',
                desc: 'Zen 6 Serving & 4-Surface APIs',
              },
            ].map((tier, idx) => (
              <YStack
                key={idx}
                gap="$2"
                items="center"
                p="$5"
                rounded="var(--radius-lg)"
                borderWidth={1}
                borderColor="var(--border)"
                bg="var(--pure-black)"
                $platform-web={{ textAlign: 'center' }}
              >
                <Text fontFamily="$mono" fontSize="$1" color="var(--muted-foreground)">
                  {tier.code} · {tier.title}
                </Text>
                <Text fontSize="$5" fontWeight="700" color="var(--white)" my="$1">
                  {tier.tuition}
                </Text>
                <Chip px={10} py={3} fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">
                  {tier.rebate} Rebate
                </Chip>
                <Text fontSize="$1" color="var(--muted-foreground)" mt="$1">
                  {tier.desc}
                </Text>
              </YStack>
            ))}
          </Grid>
        </Card>
      </Band>

      {/* ── 5. Market Comparison & Career Value ── */}
      <Band id="comparison" pad={72} measure={1200} ground="var(--pure-black)">
        <Head
          eyebrow="Market Comparison & Career Value"
          title="How Hanzo certification separates you from the market"
          lede="Most AI certificates test superficial prompt recall. Hanzo certifications prove you can architect, evaluate, and budget production-grade multi-agent software."
        />

        {/* Detailed Comparison Table */}
        <Box
          rounded="var(--radius-2xl)"
          borderWidth={1}
          borderColor="var(--border)"
          bg="$panel"
          overflow="hidden"
          mb="$8"
        >
          <Box overflowX="auto">
            <View
              render="table"
              width="100%"
              $platform-web={{ borderCollapse: 'collapse', minWidth: 720 }}
            >
              <View render="thead">
                <Text
                  render="tr"
                  borderBottomWidth={1}
                  borderColor="var(--border)"
                  bg="var(--pure-black)"
                  $platform-web={{ display: 'table-row' }}
                >
                  <Text
                    render="th"
                    p="$4"
                    fontSize="$1"
                    fontFamily="$mono"
                    color="var(--muted-foreground)"
                    textTransform="uppercase"
                    letterSpacing={0.5}
                    $platform-web={{ display: 'table-cell', textAlign: 'left' }}
                  >
                    Capability & Dimension
                  </Text>
                  <Text
                    render="th"
                    p="$4"
                    fontSize="$1"
                    fontFamily="$mono"
                    color="var(--muted-foreground)"
                    textTransform="uppercase"
                    letterSpacing={0.5}
                    $platform-web={{ display: 'table-cell', textAlign: 'left' }}
                  >
                    Legacy AI Certifications (Coursera / AWS / Azure)
                  </Text>
                  <Text
                    render="th"
                    p="$4"
                    fontSize="$1"
                    fontFamily="$mono"
                    color="var(--white)"
                    textTransform="uppercase"
                    letterSpacing={0.5}
                    $platform-web={{ display: 'table-cell', textAlign: 'left' }}
                  >
                    Hanzo Certified Systems Engineer (HACE / HARLE / HCAISE)
                  </Text>
                </Text>
              </View>
              <View render="tbody">
                {COMPARISON_ROWS.map((row, idx) => (
                  <Text
                    key={idx}
                    render="tr"
                    borderBottomWidth={idx === COMPARISON_ROWS.length - 1 ? 0 : 1}
                    borderColor="var(--border)"
                    bg={idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.015)'}
                    $platform-web={{ display: 'table-row' }}
                  >
                    <Text
                      render="td"
                      p="$4"
                      fontSize="$2"
                      fontWeight="700"
                      color="var(--white)"
                      $platform-web={{ display: 'table-cell', verticalAlign: 'top' }}
                    >
                      {row.dimension}
                      <Text
                        display="block"
                        fontSize="$1"
                        fontFamily="$mono"
                        color="var(--muted-foreground)"
                        fontWeight="400"
                        mt="$1"
                      >
                        {row.advantage}
                      </Text>
                    </Text>

                    <Text
                      render="td"
                      p="$4"
                      fontSize="$1"
                      color="var(--muted-foreground)"
                      $platform-web={{ display: 'table-cell', verticalAlign: 'top' }}
                    >
                      <XStack items="flex-start" gap="$2">
                        <XCircle size={14} color="var(--neutral-500)" style={{ marginTop: 2, flexShrink: 0 }} />
                        <Text fontSize="$1" color="var(--muted-foreground)" lineHeight="$1">
                          {row.legacy}
                        </Text>
                      </XStack>
                    </Text>

                    <Text
                      render="td"
                      p="$4"
                      fontSize="$1"
                      color="var(--white)"
                      $platform-web={{ display: 'table-cell', verticalAlign: 'top' }}
                    >
                      <XStack items="flex-start" gap="$2">
                        <CheckCircle2 size={14} color="var(--white)" style={{ marginTop: 2, flexShrink: 0 }} />
                        <Text fontSize="$1" color="var(--white)" fontWeight="600" lineHeight="$1">
                          {row.hanzo}
                        </Text>
                      </XStack>
                    </Text>
                  </Text>
                ))}
              </View>
            </View>
          </Box>
        </Box>

        {/* Career ROI & Industry Trajectory Matrix */}
        <Grid columns={{ min: 320, max: 3 }} gap={20}>
          <Card p={24} bg="$panel">
            <YStack gap="$3">
              <Briefcase size={22} color="var(--white)" />
              <Text fontSize="$3" fontWeight="700" color="var(--white)">
                Senior Software Engineer → AI Systems Engineer
              </Text>
              <Text fontSize="$1" color="var(--muted-foreground)" lineHeight="$2">
                Move past frontend wrappers into core systems engineering. Master tree-sitter AST parsing,
                zero-copy ZAP IPC, and isolated gVisor execution pods to command top-tier compensation ($180k–$240k).
              </Text>
            </YStack>
          </Card>

          <Card p={24} bg="$panel">
            <YStack gap="$3">
              <TrendingUp size={22} color="var(--white)" />
              <Text fontSize="$3" fontWeight="700" color="var(--white)">
                Full-Stack Engineer → Autonomous Agent Architect
              </Text>
              <Text fontSize="$1" color="var(--muted-foreground)" lineHeight="$2">
                Lead enterprise agent initiatives. Learn to architect multi-agent coordinator-executor swarms
                that resolve complex GitHub defects within strict micro-USD financial ceilings ($220k–$310k).
              </Text>
            </YStack>
          </Card>

          <Card p={24} bg="$panel">
            <YStack gap="$3">
              <ShieldCheck size={22} color="var(--white)" />
              <Text fontSize="$3" fontWeight="700" color="var(--white)">
                Engineering Founder → CTO of AI-Native Venture
              </Text>
              <Text fontSize="$1" color="var(--muted-foreground)" lineHeight="$2">
                Deploy production-grade agentic products with zero runaway inference bills. Use native Gymnasium
                reinforcement learning and finite-state Kai decision loops to eliminate hallucinations.
              </Text>
            </YStack>
          </Card>
        </Grid>
      </Band>

      {/* ── 6. Six Pillars of Production Rigor ── */}
      <Band id="credentials" pad={72} measure={1200}>
        <Head
          eyebrow="Pedagogical Architecture"
          title="Engineered for software engineers. Not prompt hobbyists."
          lede="Every concept is grounded in systems engineering: zero-copy RPC, bounded memory state machines, reinforcement learning environments, and cryptographic credentials."
        />

        <Grid columns={{ min: 320, max: 3 }} gap={24} mt="$4">
          <Card p={28}>
            <YStack gap="$2">
              <Scale size={22} color="var(--white)" />
              <Text fontSize="$3" fontWeight="700" color="var(--white)" mt="$2">
                Automated CI Grading
              </Text>
              <Text fontSize="$1" color="var(--muted-foreground)" lineHeight="$2">
                Every lab submits to isolated cleanroom containers running real-world SWE-bench issues. No multiple choice quizzes; your code either passes or fails.
              </Text>
            </YStack>
          </Card>

          <Card p={28}>
            <YStack gap="$2">
              <Terminal size={22} color="var(--white)" />
              <Text fontSize="$3" fontWeight="700" color="var(--white)" mt="$2">
                User-Space Sandboxes
              </Text>
              <Text fontSize="$1" color="var(--muted-foreground)" lineHeight="$2">
                Execute agent toolchains inside ephemeral Google gVisor user-space virtualization kernels with sub-millisecond setup and zero privileged access.
              </Text>
            </YStack>
          </Card>

          <Card p={28}>
            <YStack gap="$2">
              <Coins size={22} color="var(--white)" />
              <Text fontSize="$3" fontWeight="700" color="var(--white)" mt="$2">
                Strict Budget Controls
              </Text>
              <Text fontSize="$1" color="var(--muted-foreground)" lineHeight="$2">
                Govern token spend with micro-USD precision. Implement strict pre-call cost envelopes, in-band budget refusals, and hard stop triggers.
              </Text>
            </YStack>
          </Card>

          <Card p={28}>
            <YStack gap="$2">
              <Zap size={22} color="var(--white)" />
              <Text fontSize="$3" fontWeight="700" color="var(--white)" mt="$2">
                Zero-Copy ZAP RPC
              </Text>
              <Text fontSize="$1" color="var(--muted-foreground)" lineHeight="$2">
                Eliminate serialization bottlenecks. Multi-agent swarms communicate using binary Cap’n Proto protocols achieving sub-2ms inter-agent latency.
              </Text>
            </YStack>
          </Card>

          <Card p={28}>
            <YStack gap="$2">
              <Cpu size={22} color="var(--white)" />
              <Text fontSize="$3" fontWeight="700" color="var(--white)" mt="$2">
                Finite-State Decision Models
              </Text>
              <Text fontSize="$1" color="var(--muted-foreground)" lineHeight="$2">
                Replace hallucination-prone prompt retry loops with Kai finite-state decision checkpoints evaluated directly against logit probability distributions.
              </Text>
            </YStack>
          </Card>

          <Card p={28}>
            <YStack gap="$2">
              <Award size={22} color="var(--white)" />
              <Text fontSize="$3" fontWeight="700" color="var(--white)" mt="$2">
                W3C Cryptographic Proof
              </Text>
              <Text fontSize="$1" color="var(--muted-foreground)" lineHeight="$2">
                Earn verifiable credentials signed by Hanzo Trust with immutable on-chain records and real-time verifiable GitHub SVG badges linking directly to your passing benchmark run.
              </Text>
            </YStack>
          </Card>
        </Grid>
      </Band>

      {/* ── 7. Frequently Asked Questions (FAQ) ── */}
      <Band pad={72} measure={1080}>
        <Head
          eyebrow="Frequently Asked Questions"
          title="Everything you need to know about Hanzo University"
          lede="Clear answers regarding our 25% compute rebate, automated cleanroom grading, hardware specifications, and credential verification."
        />

        <Grid columns={{ min: 380, max: 2 }} gap={24} mt="$4">
          <Card p={28} bg="$panel" borderWidth={1} borderColor="var(--border)">
            <YStack gap="$2">
              <Text fontSize="$2" fontWeight="700" color="var(--white)">
                How does the 25% usage credit rebate work?
              </Text>
              <Text fontSize="$1" color="var(--muted-foreground)" lineHeight="$2">
                When you enroll in any course (e.g. $199 for ENG 100), exactly 25% of your payment rounded up to the nearest dollar ($50 USD) is deposited immediately into your Hanzo Cloud compute account. These credits never expire and can be used across Zen 6, Enso, Kai decision models, and gVisor sandbox container leases.
              </Text>
            </YStack>
          </Card>

          <Card p={28} bg="$panel" borderWidth={1} borderColor="var(--border)">
            <YStack gap="$2">
              <Text fontSize="$2" fontWeight="700" color="var(--white)">
                How are capstone projects graded and evaluated?
              </Text>
              <Text fontSize="$1" color="var(--muted-foreground)" lineHeight="$2">
                Grading is 100% objective and automated. An isolated Hanzo grader pod clones your repository in an ephemeral cleanroom, injects synthetic faults and breaking changes into test suites, and evaluates whether your agent can reproduce defects, synthesize syntax-safe AST diffs, and achieve test exit code 0 within budget.
              </Text>
            </YStack>
          </Card>

          <Card p={28} bg="$panel" borderWidth={1} borderColor="var(--border)">
            <YStack gap="$2">
              <Text fontSize="$2" fontWeight="700" color="var(--white)">
                Why do hiring managers value Hanzo credentials over AWS/Azure/Coursera?
              </Text>
              <Text fontSize="$1" color="var(--muted-foreground)" lineHeight="$2">
                Standard certifications test multiple-choice memorization about proprietary cloud consoles. Hanzo credentials prove hands-on software construction under real-world engineering constraints: multi-agent IPC latency, sandbox process isolation, SWE-bench problem resolution, and strict micro-USD financial ceilings.
              </Text>
            </YStack>
          </Card>

          <Card p={28} bg="$panel" borderWidth={1} borderColor="var(--border)">
            <YStack gap="$2">
              <Text fontSize="$2" fontWeight="700" color="var(--white)">
                What format are credentials issued in?
              </Text>
              <Text fontSize="$1" color="var(--muted-foreground)" lineHeight="$2">
                Graduates receive W3C Verifiable Credentials signed cryptographically by the Hanzo Trust Root (`did:hanzo:trust`) with immutable on-chain commitments. You also receive a dynamic SVG badge for your GitHub profile and resume that links directly to your verified passing CI telemetry.
              </Text>
            </YStack>
          </Card>

          <Card p={28} bg="$panel" borderWidth={1} borderColor="var(--border)">
            <YStack gap="$2">
              <Text fontSize="$2" fontWeight="700" color="var(--white)">
                Can I expense this course through my employer?
              </Text>
              <Text fontSize="$1" color="var(--muted-foreground)" lineHeight="$2">
                Yes. Upon enrollment, you receive an itemized VAT/tax receipt suitable for corporate continuing education and Learning &amp; Development (L&amp;D) reimbursement programs. For teams of 5 or more engineers, we provide pooled credit management and consolidated corporate invoicing.
              </Text>
            </YStack>
          </Card>

          <Card p={28} bg="$panel" borderWidth={1} borderColor="var(--border)">
            <YStack gap="$2">
              <Text fontSize="$2" fontWeight="700" color="var(--white)">
                Do I need a high-end local GPU?
              </Text>
              <Text fontSize="$1" color="var(--muted-foreground)" lineHeight="$2">
                No. You can run all coursework either locally on your laptop CPU/Metal using quantized Zen builds (`zen6-flash`), or execute in Hanzo Cloud using your included 25% usage credits with zero local setup or hardware requirements.
              </Text>
            </YStack>
          </Card>

          <Card p={28} bg="$panel" borderWidth={1} borderColor="var(--border)">
            <YStack gap="$2">
              <Text fontSize="$2" fontWeight="700" color="var(--white)">
                Are courses self-paced, and what happens if my agent fails a test?
              </Text>
              <Text fontSize="$1" color="var(--muted-foreground)" lineHeight="$2">
                All 3 courses are completely self-paced with continuous automated grading. You have unlimited attempts to submit your repository to the grader pods with zero penalty. You iterate on your agent architecture until it achieves 100% test pass rates and satisfies the evaluation rubric.
              </Text>
            </YStack>
          </Card>

          <Card p={28} bg="$panel" borderWidth={1} borderColor="var(--border)">
            <YStack gap="$2">
              <Text fontSize="$2" fontWeight="700" color="var(--white)">
                What are the technical prerequisites?
              </Text>
              <Text fontSize="$1" color="var(--muted-foreground)" lineHeight="$2">
                Foundational proficiency in Python, Rust, Go, or TypeScript, plus standard git workflow experience. No prior deep learning math or PyTorch experience is required for ENG 100 or SYS 103; the emphasis is on systems programming, RPC boundaries, and software architecture.
              </Text>
            </YStack>
          </Card>
        </Grid>
      </Band>

      {/* ── 8. Final Call to Action ── */}
      <Band pad={72} measure={800} ground="var(--pure-black)">
        <YStack items="center" $platform-web={{ textAlign: 'center' }} gap="$4">
          <Eyebrow>Open Enrollment</Eyebrow>
          <Title quiet={false}>
            Ready to build systems that scale?
          </Title>
          <Lede>
            Enroll today in one of our 3 core tracks to claim your 25% usage credit rebate and gain instant access to browser-based Hanzo Dev sandboxes.
          </Lede>
          <XStack justify="center" gap="$3" mt="$3" flexWrap="wrap">
            <Action href="#curriculum" fill>
              Enroll in a Track
            </Action>
            <Action href="/portal">
              Preview Student Portal →
            </Action>
            <Action href="/agentic-coding">
              View ENG 100 Syllabus
            </Action>
          </XStack>
        </YStack>
      </Band>
    </Box>
  )
}
