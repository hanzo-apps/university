'use client'

import React, { useState } from 'react'
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
    hanzo: '25% usage credit rebate deposited on day one ($25–$125)',
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
  const [activeTrack, setActiveTrack] = useState<string>('all')

  const filteredCourses =
    activeTrack === 'all'
      ? UNIVERSITY_COURSES
      : UNIVERSITY_COURSES.filter((c) => c.track === activeTrack)

  return (
    <Box minH="100vh" bg="$background" $platform-web={{ color: 'var(--foreground)' }}>
      {/* ── Hero ── */}
      <Hero
        badge="hanzo.university · Open Enrollment · 25% Usage Credit Rebate"
        title="Stop prompting. Start engineering."
        lede={
          <>
            Toy AI tutorials won&rsquo;t survive production. Hanzo University trains software
            engineers to architect, evaluate, and budget autonomous multi-agent systems with
            zero-copy protocols, gVisor sandboxing, and reinforcement learning. Every course
            includes 25% compute credits ($25–$125) deposited into your account on day one.
          </>
        }
      >
        <Action href="#curriculum" fill>
          Explore Courses & Enroll
        </Action>
        <Action href="/portal">
          Preview Enrolled Student Portal →
        </Action>
        <Action href="/agentic-coding">
          ENG 100 Syllabus →
        </Action>
      </Hero>

      {/* ── Architecture Terminal Card (Replaces Photo Hero) ── */}
      <Band pad={40} measure={1152} rule={false}>
        <Box
          rounded="var(--radius-2xl)"
          borderWidth={1}
          borderColor="var(--neutral-800)"
          bg="var(--pure-black)"
          overflow="hidden"
        >
          {/* Workstation Header Bar */}
          <XStack
            items="center"
            justify="space-between"
            px="$4"
            py="$3"
            borderBottomWidth={1}
            borderColor="var(--neutral-850)"
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
            px="$4"
            py="$3"
            borderTopWidth={1}
            borderColor="var(--neutral-850)"
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

      {/* ── The 25% Compute Rebate Value Proposition ── */}
      <Band pad={40} measure={1080}>
        <Card
          p={24}
          borderColor="var(--white-20)"
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
            directly into your Hanzo Cloud account. Use your credits across Zen 6, Enso reasoning models,
            Kai finite-state decision loops, and gVisor sandbox container leases.
          </Text>

          {/* Rebate Tiers */}
          <Grid columns={{ min: 180, max: 5 }} gap={12}>
            {[
              { price: '$99', credit: '+$25', name: 'PRA 104' },
              { price: '$149', credit: '+$38', name: 'SYS 103 / MKT 102' },
              { price: '$199', credit: '+$50', name: 'ENG 100 Coding' },
              { price: '$249', credit: '+$63', name: 'RL 101 Gym RL' },
              { price: '$499', credit: '+$125', name: 'ARC 105 Architect' },
            ].map((tier, idx) => (
              <Box
                key={idx}
                p="$3"
                rounded="var(--radius-lg)"
                borderWidth={1}
                borderColor="var(--neutral-800)"
                bg="var(--pure-black)"
                $platform-web={{ textAlign: 'center' }}
              >
                <Text fontFamily="$mono" fontSize="$1" color="var(--muted-foreground)">
                  {tier.name}
                </Text>
                <Text fontSize="$3" fontWeight="700" color="var(--white)" my="$1">
                  {tier.price} Tuition
                </Text>
                <Text fontFamily="$mono" fontSize="$1" color="var(--white)" fontWeight="600">
                  {tier.credit} USD Credits
                </Text>
              </Box>
            ))}
          </Grid>
        </Card>
      </Band>

      {/* ── THE COMPARISON CHART: How This Certification Helps You ── */}
      <Band id="comparison" pad={48} measure={1200} ground="var(--pure-black)">
        <Head
          eyebrow="Market Comparison & Career Value"
          title="How Hanzo certification separates you from the market"
          lede="Most AI certificates test superficial prompt recall. Hanzo certifications prove you can architect, evaluate, and budget production-grade multi-agent software."
        />

        {/* Detailed Comparison Table */}
        <Box
          rounded="var(--radius-2xl)"
          borderWidth={1}
          borderColor="var(--neutral-800)"
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
                  borderColor="var(--neutral-800)"
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
                    Hanzo Certified Systems Engineer (HACE / HARLE)
                  </Text>
                </Text>
              </View>
              <View render="tbody">
                {COMPARISON_ROWS.map((row, idx) => (
                  <Text
                    key={idx}
                    render="tr"
                    borderBottomWidth={idx === COMPARISON_ROWS.length - 1 ? 0 : 1}
                    borderColor="var(--neutral-850)"
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

      {/* ── Six Pillars of Production Rigor ── */}
      <Band pad={44} measure={1200}>
        <Head
          eyebrow="Pedagogical Architecture"
          title="Engineered for software engineers. Not prompt hobbyists."
          lede="Every concept is grounded in systems engineering: zero-copy RPC, bounded memory state machines, reinforcement learning environments, and cryptographic credentials."
        />

        <Grid columns={{ min: 320, max: 3 }} gap={20}>
          <Card p={24}>
            <YStack gap="$2">
              <Scale size={22} color="var(--white)" />
              <Text fontSize="$3" fontWeight="700" color="var(--white)" mt="$2">
                Automated CI Grading
              </Text>
              <Text fontSize="$1" color="var(--muted-foreground)" lineHeight="$2">
                Zero human subjectivity. Submissions are graded by isolated CI runners that clone your repository, inject breaking changes, and evaluate repair velocity and test pass rates.
              </Text>
            </YStack>
          </Card>

          <Card p={24}>
            <YStack gap="$2">
              <Coins size={22} color="var(--white)" />
              <Text fontSize="$3" fontWeight="700" color="var(--white)" mt="$2">
                Integer Micro-USD Ceilings
              </Text>
              <Text fontSize="$1" color="var(--muted-foreground)" lineHeight="$2">
                Prevent runaway cloud bills. Learn to configure pre-call price quoting, in-band budget refusals, and sub-cent financial caps directly in your agent loop.
              </Text>
            </YStack>
          </Card>

          <Card p={24}>
            <YStack gap="$2">
              <Cpu size={22} color="var(--white)" />
              <Text fontSize="$3" fontWeight="700" color="var(--white)" mt="$2">
                Zero-Token Decision Loops
              </Text>
              <Text fontSize="$1" color="var(--muted-foreground)" lineHeight="$2">
                Generate text only when generation is strictly required. Master finite-state control with Kai, evaluating tool calls and routing without paying for generation tokens.
              </Text>
            </YStack>
          </Card>

          <Card p={24}>
            <YStack gap="$2">
              <Zap size={22} color="var(--white)" />
              <Text fontSize="$3" fontWeight="700" color="var(--white)" mt="$2">
                Zero-Copy ZAP Protocols
              </Text>
              <Text fontSize="$1" color="var(--muted-foreground)" lineHeight="$2">
                Replace 200ms JSON-RPC hops with Cap&rsquo;n Proto zero-copy serialization. Connect multi-agent swarms with microsecond inter-process latency and post-quantum encryption.
              </Text>
            </YStack>
          </Card>

          <Card p={24}>
            <YStack gap="$2">
              <Boxes size={22} color="var(--white)" />
              <Text fontSize="$3" fontWeight="700" color="var(--white)" mt="$2">
                Native Gymnasium Environments
              </Text>
              <Text fontSize="$1" color="var(--muted-foreground)" lineHeight="$2">
                Model agent interactions as formal Markov Decision Processes (MDP). Train custom policy routers, write multi-objective reward functions, and run Zoo Gym fine-tuning.
              </Text>
            </YStack>
          </Card>

          <Card p={24}>
            <YStack gap="$2">
              <ShieldCheck size={22} color="var(--white)" />
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

      {/* ── Courses & Certifications Catalog ── */}
      <Band id="curriculum" pad={48} measure={1280} ground="var(--pure-black)">
        <Head
          eyebrow="Curriculum Catalog"
          title="Courses & Professional Certifications"
          lede="Select an engineering track to inspect syllabi, lab architectures, and enrollment packages."
        />

        {/* Track Filter Tabs */}
        <XStack justify="center" gap="$2" mb="$8" flexWrap="wrap">
          {[
            { id: 'all', label: 'All 6 Courses' },
            { id: 'coding', label: 'Agentic Coding' },
            { id: 'rl', label: 'Reinforcement Learning' },
            { id: 'marketing', label: 'Agentic Marketing' },
            { id: 'systems', label: 'Systems Foundation' },
            { id: 'architect', label: 'Enterprise Architect' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTrack(tab.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '9999px',
                border: `1px solid ${activeTrack === tab.id ? 'var(--white)' : 'var(--neutral-800)'}`,
                background: activeTrack === tab.id ? 'var(--white-10)' : 'transparent',
                color: activeTrack === tab.id ? 'var(--white)' : 'var(--muted-foreground)',
                cursor: 'pointer',
                fontFamily: 'monospace',
                fontSize: '0.8125rem',
                fontWeight: activeTrack === tab.id ? 700 : 400,
                outline: 'none',
              }}
            >
              {tab.label}
            </button>
          ))}
        </XStack>

        <Grid columns={{ min: 360, max: 3 }} gap={24}>
          {filteredCourses.map((course) => (
            <Card
              key={course.code}
              p={24}
              display="flex"
              flexDirection="column"
              justify="space-between"
              borderColor={course.featured ? 'var(--white-35)' : 'var(--neutral-800)'}
              bg="$panel"
              position="relative"
            >
              <YStack gap="$4">
                {/* Code & Acronym Header */}
                <XStack items="center" justify="space-between">
                  <Text fontFamily="$mono" fontSize="$1" color="var(--muted-foreground)">
                    {course.code} · {course.level}
                  </Text>
                  <Chip px={10} py={3} fontSize="$1" fontFamily="$mono" fontWeight="700">
                    {course.credential}
                  </Chip>
                </XStack>

                {/* Title & Description */}
                <YStack gap="$2">
                  <Text fontSize="$4" fontWeight="700" color="var(--white)" lineHeight="$4">
                    {course.title}
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
                  borderColor="var(--neutral-850)"
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
                    Syllabus & Coupon →
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
          ))}
        </Grid>
      </Band>

      {/* ── EXPANDED FREQUENTLY ASKED QUESTIONS (FAQS) ── */}
      <Band pad={48} measure={1080}>
        <Head
          eyebrow="Frequently Asked Questions"
          title="Everything you need to know about Hanzo University"
          lede="Clear answers regarding our 25% compute rebate, automated cleanroom grading, hardware specifications, and credential verification."
        />

        <Grid columns={{ min: 380, max: 2 }} gap={20}>
          <Card p={24} bg="$panel">
            <YStack gap="$2">
              <Text fontSize="$2" fontWeight="700" color="var(--white)">
                How does the 25% usage credit rebate work?
              </Text>
              <Text fontSize="$1" color="var(--muted-foreground)" lineHeight="$2">
                When you enroll in any course (e.g. $199 for ENG 100), exactly 25% of your payment rounded up to the nearest dollar ($50 USD) is deposited immediately into your Hanzo Cloud compute account. These credits never expire and can be used across Zen 6, Enso, Kai decision models, and gVisor sandbox container leases.
              </Text>
            </YStack>
          </Card>

          <Card p={24} bg="$panel">
            <YStack gap="$2">
              <Text fontSize="$2" fontWeight="700" color="var(--white)">
                How are capstone projects graded and evaluated?
              </Text>
              <Text fontSize="$1" color="var(--muted-foreground)" lineHeight="$2">
                Grading is 100% objective and automated. An isolated Hanzo grader pod clones your repository in an ephemeral cleanroom, injects synthetic faults and breaking changes into test suites, and evaluates whether your agent can reproduce defects, synthesize syntax-safe AST diffs, and achieve test exit code 0 within budget.
              </Text>
            </YStack>
          </Card>

          <Card p={24} bg="$panel">
            <YStack gap="$2">
              <Text fontSize="$2" fontWeight="700" color="var(--white)">
                Why do hiring managers value Hanzo credentials over AWS/Azure/Coursera?
              </Text>
              <Text fontSize="$1" color="var(--muted-foreground)" lineHeight="$2">
                Standard certifications test multiple-choice memorization about proprietary cloud consoles. Hanzo credentials prove hands-on software construction under real-world engineering constraints: multi-agent IPC latency, sandbox process isolation, SWE-bench problem resolution, and strict micro-USD financial ceilings.
              </Text>
            </YStack>
          </Card>

          <Card p={24} bg="$panel">
            <YStack gap="$2">
              <Text fontSize="$2" fontWeight="700" color="var(--white)">
                What format are credentials issued in?
              </Text>
              <Text fontSize="$1" color="var(--muted-foreground)" lineHeight="$2">
                Graduates receive W3C Verifiable Credentials signed cryptographically by the Hanzo Trust Root (`did:hanzo:trust`) with immutable on-chain commitments. You also receive a dynamic SVG badge for your GitHub profile and resume that links directly to your verified passing CI telemetry.
              </Text>
            </YStack>
          </Card>

          <Card p={24} bg="$panel">
            <YStack gap="$2">
              <Text fontSize="$2" fontWeight="700" color="var(--white)">
                Can I expense this course through my employer?
              </Text>
              <Text fontSize="$1" color="var(--muted-foreground)" lineHeight="$2">
                Yes. Upon enrollment, you receive an itemized VAT/tax receipt suitable for corporate continuing education and Learning &amp; Development (L&amp;D) reimbursement programs. For teams of 5 or more engineers, we provide pooled credit management and consolidated corporate invoicing.
              </Text>
            </YStack>
          </Card>

          <Card p={24} bg="$panel">
            <YStack gap="$2">
              <Text fontSize="$2" fontWeight="700" color="var(--white)">
                Do I need a high-end local GPU?
              </Text>
              <Text fontSize="$1" color="var(--muted-foreground)" lineHeight="$2">
                No. You can run all coursework either locally on your laptop CPU/Metal using quantized Zen builds (`zen6-flash`), or execute in Hanzo Cloud using your included 25% usage credits with zero local setup or hardware requirements.
              </Text>
            </YStack>
          </Card>

          <Card p={24} bg="$panel">
            <YStack gap="$2">
              <Text fontSize="$2" fontWeight="700" color="var(--white)">
                Are courses self-paced, and what happens if my agent fails a test?
              </Text>
              <Text fontSize="$1" color="var(--muted-foreground)" lineHeight="$2">
                All 6 courses are completely self-paced with continuous automated grading. You have unlimited attempts to submit your repository to the grader pods with zero penalty. You iterate on your agent architecture until it achieves 100% test pass rates and satisfies the evaluation rubric.
              </Text>
            </YStack>
          </Card>

          <Card p={24} bg="$panel">
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

      {/* ── Final Call to Action ── */}
      <Band pad={48} measure={800} ground="var(--pure-black)">
        <YStack items="center" $platform-web={{ textAlign: 'center' }} gap="$4">
          <Eyebrow>Open Enrollment</Eyebrow>
          <Title quiet={false}>
            Ready to build systems that scale?
          </Title>
          <Lede>
            Enroll today to claim your 25% usage credit rebate and gain instant access to browser-based Hanzo Dev sandboxes.
          </Lede>
          <XStack justify="center" gap="$3" mt="$3" flexWrap="wrap">
            <Action href="#curriculum" fill>
              Enroll in a Course
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
