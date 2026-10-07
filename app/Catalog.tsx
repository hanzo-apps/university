'use client'

import React, { useState } from 'react'
import Link from 'next/link'
import { Box, Text, XStack, YStack, View } from '@/components/ui'
import { Band, Card, Head } from '@/components/band'
import { Action, Title, Lede, Eyebrow, Chip } from '@hanzo/ui/marketing'
import { Grid } from '@hanzo/ui/grid'
import {
  ShieldCheck,
  BookOpen,
  Zap,
  Check,
  CheckCircle2,
  Coins,
  Scale,
  Cpu,
  Boxes,
  TrendingUp,
  Briefcase,
  XCircle,
  Sparkles,
  ArrowRight,
  ChevronRight,
  Clock,
  Calendar,
  Users,
  Award,
  GraduationCap,
  Star,
  Play,
  Radio,
  FileCode,
  Terminal,
} from 'lucide-react'
import { ALL_COURSES, type UniversityCourse } from './courses-data'
import { courseCheckoutUrl } from '@/lib/pay'
import { SIGN_IN } from './funnel'
import type { StudentSession } from '@/lib/auth'

export interface CompetitorProfile {
  id: string
  name: string
  provider: string
  flagshipCourse: string
  tuition: string
  format: string
  verdict: string
  flaws: string[]
  hanzoAdvantages: string[]
  metrics: {
    label: string
    legacyVal: string
    hanzoVal: string
  }[]
}

const TOP_5_COMPETITORS: CompetitorProfile[] = [
  {
    id: 'deeplearning',
    name: 'DeepLearning.AI',
    provider: 'Coursera / Andrew Ng',
    flagshipCourse: 'AI Engineer & Deep Learning Specialization',
    tuition: '$49/mo ($294–$588/yr) + external API fees',
    format: 'Pre-recorded lectures + Colab notebooks + Multiple-choice quizzes',
    verdict: 'Ideal for theoretical intuitions, but fails to teach systems engineering, process sandboxing, binary IPC, or the strict financial ceilings required for enterprise production agents.',
    flaws: [
      'Multiple-choice quizzes test syntax memorization instead of real software construction.',
      'Fragile prompt-engineering chains (LangChain / ReAct) that hallucinate and burn infinite tokens on errors.',
      'High-overhead HTTP JSON REST roundtrips (180ms+) with zero binary IPC or memory controls.',
      'Unconstrained token consumption: students enter personal credit cards with zero budget ceilings, frequently risking runaway API bills.',
      'Centralized, forgeable Coursera PDF certificate with no verifiable cryptographic proof or code telemetry.',
    ],
    hanzoAdvantages: [
      '100% automated cleanroom CI grading inside ephemeral Hanzo Visor sandboxes; agents must repair bugs and pass tests with exit code 0.',
      'Finite-state Kai decision models with 0 generation tokens, eliminating branching hallucinations.',
      'Sub-2ms zero-copy ZAP binary protocols via Cap’n Proto, 90x lower latency than HTTP JSON.',
      'Integer micro-USD budget ceilings ($0.000001 precision) with hardware in-band refusals.',
      '25% tuition compute rebate deposited into your Hanzo Cloud account on day one.',
    ],
    metrics: [
      { label: 'Evaluation Rigor', legacyVal: 'Multiple-choice quizzes + Colab asserts', hanzoVal: 'Automated cleanroom SWE-bench test exit code 0' },
      { label: 'Agent IPC Latency', legacyVal: '180ms+ HTTP JSON-RPC calls', hanzoVal: '< 2ms Cap’n Proto zero-copy ZAP' },
      { label: 'Economic Controls', legacyVal: 'None (Students pay unmetered API bills)', hanzoVal: 'Micro-USD hardware integer ceilings' },
      { label: 'Credential Standard', legacyVal: 'Centralized Coursera PDF URL', hanzoVal: 'W3C Verifiable Credential on Lux Chain' },
      { label: 'Compute Subsidy', legacyVal: '0% compute rebate ($0)', hanzoVal: '+25% tuition rebate ($38–$63)' },
    ],
  },
  {
    id: 'stanford',
    name: 'Stanford Online',
    provider: 'Stanford School of Engineering',
    flagshipCourse: 'Artificial Intelligence Graduate Certificate (CS229 / CS224N)',
    tuition: '$12,000 – $20,000 USD (3–4 courses @ $4,000–$5,000 each)',
    format: 'Academic lecture broadcasts + Pencil-and-paper math problem sets',
    verdict: 'World-class academic mathematical foundation, but at $15,000+ tuition with 3-week TA grading delays, it provides zero hands-on multi-agent systems deployment or runtime sandboxing.',
    flaws: [
      'Exorbitant $15,000+ academic tuition makes it inaccessible for working engineers and independent founders.',
      'Manual homework grading by teaching assistants with a 2-to-3 week feedback latency.',
      'Curriculum emphasizes blackboard mathematical proofs (convex optimization, VC dimension) over production systems.',
      'Zero curriculum on autonomous agent orchestration, sandboxed tool-calling, or multi-agent IPC protocols.',
      'Standard Credly digital badge or PDF diploma without live execution telemetry or code proofs.',
    ],
    hanzoAdvantages: [
      '98% lower tuition ($149–$249 one-time) with lifetime curriculum access and continuous updates.',
      'Instant sub-second cleanroom CI execution with automated defect injection and real-time pass/fail telemetry.',
      'Production systems engineering: AST tree-sitter diffing, Hanzo Visor process isolation, and asynchronous IPC.',
      'Permanent cryptographic W3C credential commitment on Lux Chain.',
      '+25% tuition compute rebate to run Zen 6 models immediately in Hanzo Cloud.',
    ],
    metrics: [
      { label: 'Tuition Cost', legacyVal: '$12,000 – $20,000 USD', hanzoVal: '$149 – $249 USD (One-time)' },
      { label: 'Grading Turnaround', legacyVal: '2 to 3 weeks (Manual TA review)', hanzoVal: '< 5 seconds (Automated cleanroom CI)' },
      { label: 'Systems Tooling', legacyVal: 'Theoretical math proofs & static PyTorch', hanzoVal: 'Tree-sitter AST, Hanzo Visor, ZAP RPC' },
      { label: 'Decentralized Proof', legacyVal: 'Static PDF diploma / Credly badge', hanzoVal: 'W3C cryptographic proof + Live GitHub SVG' },
      { label: 'Compute Subsidy', legacyVal: '0% (Students pay separate cloud lab fees)', hanzoVal: '+25% tuition rebate ($38–$63)' },
    ],
  },
  {
    id: 'mit',
    name: 'MIT Professional Education',
    provider: 'MIT xPRO / Emeritus',
    flagshipCourse: 'Applied AI & Machine Learning: Designing Intelligent Systems',
    tuition: '$2,800 – $3,500 USD (12-week certificate)',
    format: 'Cohort video lectures + Executive case studies + Peer discussion boards',
    verdict: 'Designed for non-technical corporate executives and management consultants. Teaches zero code compilers, zero container runtimes, zero systems programming, and relies on peer grading.',
    flaws: [
      'Aimed at executive business management; lacks hardcore software systems engineering.',
      'Zero compiler interactions, zero container runtimes, zero systems programming, and no autonomous agent workflows.',
      'Graded primarily through peer-reviewed forum posts and subjective slide deck presentations.',
      'High price tag ($3,000+) for high-level business frameworks that software engineering hiring managers discount.',
      'Static certificate issued by marketing partner Emeritus without code verification.',
    ],
    hanzoAdvantages: [
      'Hardcore low-level software engineering: Cap’n Proto binary serialization, AST parsing, and sandboxed runtimes.',
      'Automated objective cleanroom autograders that verify zero test regressions and zero AST syntax defects.',
      'Builds production-grade multi-agent swarms capable of autonomously resolving real GitHub defects.',
      'Verifiable W3C credentials respected by engineering leaders over executive business certificates.',
      'Hands-on agentic coding in browser-based Dev sandboxes with pre-configured toolchains.',
    ],
    metrics: [
      { label: 'Target Audience', legacyVal: 'Non-technical business executives & managers', hanzoVal: 'Production software engineers & systems architects' },
      { label: 'Grading Objectivity', legacyVal: 'Peer forum review & subjective rubrics', hanzoVal: '100% Automated cleanroom CI exit code 0' },
      { label: 'Engineering Depth', legacyVal: 'Slide decks & qualitative enterprise memos', hanzoVal: 'Cap’n Proto binary RPC, Hanzo Visor sandboxes, AST' },
      { label: 'Tuition Cost', legacyVal: '$2,800 – $3,500 USD', hanzoVal: '$149 – $249 USD' },
      { label: 'Compute Subsidy', legacyVal: '$0 compute credits included', hanzoVal: '+25% tuition rebate ($38–$63)' },
    ],
  },
  {
    id: 'harvard',
    name: 'Harvard / edX CS50 AI',
    provider: 'Harvard Division of Continuing Education',
    flagshipCourse: 'CS50’s Introduction to Artificial Intelligence with Python',
    tuition: '$299 USD (Verified Certificate Track)',
    format: 'Lecture broadcasts + Command-line Python assignments',
    verdict: 'Solid introduction to 1990s classical AI search algorithms, but completely omits modern foundation models, agentic tool harnesses, neural function calling, and swarm topologies.',
    flaws: [
      'Stuck in 1990s classical AI: Minimax search, propositional logic, and A* pathfinding.',
      'Completely omits modern LLM orchestration, agentic tool harnesses, neural function calling, and swarms.',
      'Toy command-line puzzles (Tic-tac-toe, Nim, crossword generators) with no relationship to enterprise software.',
      'Zero cloud deployment, zero sandboxing, zero memory safety, and zero micro-economic cost boundaries.',
      'Generic edX PDF certificate that carries little weight for senior AI systems engineering roles.',
    ],
    hanzoAdvantages: [
      'Modern agentic engineering: Autonomous code repair, SWE-bench test resolution, and tool execution.',
      'Ephemeral Hanzo Visor user-space kernel containers providing hermetic unprivileged execution.',
      'Micro-USD token budgeting and zero-token Kai decision engines.',
      'Cryptographic W3C on-chain credentials demonstrating cutting-edge production agent architecture.',
      'Reinforcement learning via native Gymnasium MDP environments and Zoo Gym fine-tuning.',
    ],
    metrics: [
      { label: 'Curriculum Focus', legacyVal: '1990s Classical AI (Minimax, A*, Nim, Logic)', hanzoVal: 'Modern Agentic Swarms, RL, SWE-bench, Tool Use' },
      { label: 'Execution Environment', legacyVal: 'Local terminal python script output', hanzoVal: 'Ephemeral Hanzo Visor micro-kernel sandboxes' },
      { label: 'Cost Architecture', legacyVal: 'None (Local CPU execution only)', hanzoVal: 'Hardware integer micro-USD ceilings ($0.000001)' },
      { label: 'Decision Control', legacyVal: 'Static decision trees & game boards', hanzoVal: 'Finite-state Kai decision models (0 output tokens)' },
      { label: 'Compute Subsidy', legacyVal: '$0 compute subsidy', hanzoVal: '+25% tuition rebate ($38–$63)' },
    ],
  },
  {
    id: 'fastai',
    name: 'Fast.ai',
    provider: 'Answer.AI / USF',
    flagshipCourse: 'Practical Deep Learning for Coders',
    tuition: '$0 Free content ($150–$400 student out-of-pocket GPU cloud rental)',
    format: 'Video lectures + Kaggle/Colab Jupyter notebooks',
    verdict: 'Helpful for training basic image and text classifiers, but offers zero curriculum on agentic software construction, multi-agent IPC, autonomous coding, or verified professional credentials.',
    flaws: [
      'Strictly limited to training computer vision and NLP classifiers using the opinionated fastai library.',
      'Zero curriculum on agentic software construction, multi-agent IPC, autonomous coding, or compiler toolchains.',
      'No automated validation gate or CI grading; self-study with zero credential to demonstrate skill to recruiters.',
      'No architectural cost controls; students frequently leave cloud GPU instances running accidentally.',
      'Zero formal credential or certificate of completion issued.',
    ],
    hanzoAdvantages: [
      'End-to-end agentic systems: Tree-sitter AST validation, bug injection testbeds, and multi-agent coordination.',
      'Automated cleanroom CI grading that validates code construction with exit code 0.',
      'W3C Cryptographic Verifiable Credentials with on-chain trust commitment and live GitHub SVG telemetry badge.',
      '25% tuition compute rebate to subsidize Hanzo Cloud and Zen models.',
      'Zero-copy binary protocols and microsecond inter-process latency.',
    ],
    metrics: [
      { label: 'Pedagogical Focus', legacyVal: 'PyTorch model fine-tuning (CV & NLP)', hanzoVal: 'Agentic coding systems, multi-agent IPC, autograders' },
      { label: 'Verification & Gate', legacyVal: 'Self-guided (No automated tests or gate)', hanzoVal: 'Automated cleanroom SWE-bench test exit code 0' },
      { label: 'Credential Issued', legacyVal: 'None (Self-study only, no credential)', hanzoVal: 'W3C Cryptographic Credential + Live GitHub SVG' },
      { label: 'Compute Subsidy', legacyVal: '$0 (Student pays GPU host hourly fees)', hanzoVal: '+25% tuition rebate ($38–$63)' },
      { label: 'Production Runtime', legacyVal: 'Jupyter notebook cells', hanzoVal: 'Hanzo Visor sandbox + Cap’n Proto ZAP RPC' },
    ],
  },
]

const MASTER_COMPARISON_MATRIX = [
  {
    dimension: 'Evaluation Standard',
    hanzo: '100% Automated CI Cleanroom (SWE-bench pod exit code 0)',
    deeplearning: 'Multiple-choice quizzes & Colab asserts',
    stanford: 'Manual TA review (2–3 week delay)',
    mit: 'Peer review & discussion boards',
    harvard: 'CLI autograder on static scripts',
    fastai: 'Self-graded unverified notebooks',
  },
  {
    dimension: 'Execution Runtime',
    hanzo: 'Ephemeral Hanzo Visor user-space kernel pods',
    deeplearning: 'Standard web notebooks (Colab/Jupyter)',
    stanford: 'Shared university cluster / Colab',
    mit: 'None (slide decks & case studies)',
    harvard: 'Local terminal Python interpreter',
    fastai: 'Unbudgeted cloud GPU (Paperspace/AWS)',
  },
  {
    dimension: 'Economic Cost Controls',
    hanzo: 'Integer micro-USD budget ceilings ($0.000001) with refusals',
    deeplearning: 'Uncapped token billing (student pays API)',
    stanford: 'None (cloud billed separately)',
    mit: 'None (purely conceptual ROI)',
    harvard: 'None (local CPU only)',
    fastai: 'None (unbudgeted cloud GPU rental)',
  },
  {
    dimension: 'Inter-Process Latency',
    hanzo: 'Zero-copy ZAP RPC over Cap’n Proto (< 2ms microsecond IPC)',
    deeplearning: 'High-overhead JSON-RPC (180ms+ per turn)',
    stanford: 'Single-node Python execution',
    mit: 'None (no IPC taught)',
    harvard: 'Single-thread CLI scripts',
    fastai: 'Single-process PyTorch loops',
  },
  {
    dimension: 'Decision Architecture',
    hanzo: 'Finite-state Kai decision scoring with 0 output tokens',
    deeplearning: 'Fragile prompt chains (LangChain / ReAct)',
    stanford: 'Mathematical Bellman equations on paper',
    mit: 'High-level workflow diagrams',
    harvard: 'Classical search trees (Minimax/BFS)',
    fastai: 'Feed-forward neural classification',
  },
  {
    dimension: 'Reinforcement Learning',
    hanzo: 'Native Gymnasium MDP environments & Zoo Gym fine-tuning',
    deeplearning: 'Abstract RLHF theory slides',
    stanford: 'Theoretical Markov Decision Processes',
    mit: 'Executive summaries of RL',
    harvard: 'Basic Q-learning in discrete gridworlds',
    fastai: 'Not covered (supervised DL only)',
  },
  {
    dimension: 'Credential Authenticity',
    hanzo: 'W3C Cryptographic Verifiable Credential + Live GitHub SVG',
    deeplearning: 'Centralized Coursera PDF URL certificate',
    stanford: 'Standard PDF diploma / Credly badge',
    mit: 'Static Emeritus PDF certificate',
    harvard: 'edX PDF certificate of achievement',
    fastai: 'None (no credential issued)',
  },
  {
    dimension: 'Tuition & Economics',
    hanzo: '$149–$249 one-time (+25% compute rebate returned)',
    deeplearning: '$49/mo recurring (0% compute rebate)',
    stanford: '$12,000–$20,000 (0% compute rebate)',
    mit: '$2,800–$3,500 (0% compute rebate)',
    harvard: '$299 verified track (0% compute rebate)',
    fastai: '$0 content (0% compute rebate, student pays GPU)',
  },
  {
    dimension: 'Real-World Deliverable',
    hanzo: 'Production multi-agent swarms merging GitHub PRs with clean AST',
    deeplearning: 'Colab toy classification demos',
    stanford: 'Academic research writeups & math proofs',
    mit: 'Executive strategy memos & slide decks',
    harvard: 'Tic-tac-toe & crossword solvers',
    fastai: 'Kaggle-style image/text classifiers',
  },
]

const WEEKLY_FEED = [
  {
    day: 'MON',
    type: 'LIVE LAB',
    title: 'Autonomous SWE-bench Code Repair with Zen 6 & Hanzo Visor',
    desc: 'Watch live as an agent reproduces GitHub defects, injects minimal pytest suites, and achieves exit code 0.',
    link: '/agentic-coding',
    cta: 'Watch replay →',
  },
  {
    day: 'TUE',
    type: 'SYSTEM GUIDE',
    title: 'Tree-sitter AST Context Distillation across 100k-line Repositories',
    desc: 'How to compress 50-file call chains into a 4k-token scratchpad without losing critical type signatures.',
    link: '/agentic-coding',
    cta: 'Read guide →',
  },
  {
    day: 'WED',
    type: 'FACULTY SEMINAR',
    title: 'Zero-Copy ZAP RPC over Cap’n Proto: Sub-2ms Multi-Agent IPC',
    desc: 'Benchmarking binary IPC serialization vs HTTP JSON-RPC in distributed coordinator-worker topologies.',
    link: '/systems-engineering',
    cta: 'View notes →',
  },
  {
    day: 'THU',
    type: 'LIVE SESSION',
    title: 'Enforcing Integer Micro-USD Budget Ceilings in Production Agent Loops',
    desc: 'Pre-call quoting, hardware budget refusals, and sub-cent financial caps to prevent runaway API bills.',
    link: '/systems-engineering',
    cta: 'Register →',
  },
  {
    day: 'FRI',
    type: 'RESEARCH',
    title: 'Native Gymnasium MDP Environments & Zoo Gym Post-Training',
    desc: 'Formulate tool calling as formal Markov Decision Processes and train learned LinUCB model routers.',
    link: '/reinforcement-learning',
    cta: 'Inspect spec →',
  },
  {
    day: 'SAT',
    type: 'CAPSTONE LAB',
    title: 'Automated Cleanroom CI Graders & Ephemeral Sandbox Leases',
    desc: 'How Hanzo autograders clone student repositories in unprivileged microVMs to verify code construction.',
    link: '/agentic-coding',
    cta: 'Launch lab →',
  },
  {
    day: 'SUN',
    type: 'SECURITY BRIEF',
    title: 'Post-Quantum ML-KEM Cryptography & Byzantine Fault Tolerance',
    desc: 'NIST FIPS 203 quantum-resistant tunneling and hanzod consensus for multi-tenant agent meshes.',
    link: '/ai-architect',
    cta: 'Read briefing →',
  },
]

const SPECIALIZATIONS = [
  {
    id: 'coding',
    code: 'ENG 100',
    title: 'Autonomous Coding & Swarms',
    duration: '4 Weeks',
    icon: Terminal,
    desc: 'AST diffing, self-healing test execution loops, and ephemeral Hanzo Visor execution pods.',
    link: '/agentic-coding',
  },
  {
    id: 'rl',
    code: 'RL 101',
    title: 'Native Reinforcement Learning',
    duration: '5 Weeks',
    icon: Boxes,
    desc: 'Gymnasium MDP environments, PPO/GRPO reward modeling, and LinUCB model router dispatch.',
    link: '/reinforcement-learning',
  },
  {
    id: 'systems',
    code: 'SYS 103',
    title: 'AI Systems Engineering',
    duration: '3 Weeks',
    icon: Cpu,
    desc: '4-surface parity, zero-token Kai decision loops, and integer micro-USD budget governance.',
    link: '/systems-engineering',
  },
  {
    id: 'marketing',
    code: 'MKT 102',
    title: 'Programmatic Growth & Media',
    duration: '3 Weeks',
    icon: TrendingUp,
    desc: 'Autonomous marketing machines, programmatic studio media pipelines, and closed-loop CRO bandits.',
    link: '/agentic-marketing',
  },
  {
    id: 'practitioner',
    code: 'PRA 104',
    title: 'AI Practitioner & MCP Suite',
    duration: '2 Weeks',
    icon: BookOpen,
    desc: '13 unified MCP tools, Cursor integration, model selection, and token usage governance.',
    link: '/ai-practitioner',
  },
  {
    id: 'architect',
    code: 'ARC 105',
    title: 'Production AI Architecture',
    duration: '6 Weeks',
    icon: ShieldCheck,
    desc: 'Zero-trust clusters, post-quantum ML-KEM tunnels, and BFT consensus agent meshes.',
    link: '/ai-architect',
  },
]

interface CatalogProps {
  session?: StudentSession | null
  showHero?: boolean
}

export default function Catalog({ session, showHero = true }: CatalogProps) {
  const [activeTrack, setActiveTrack] = useState<string>('all')
  const [activeCompetitorTab, setActiveCompetitorTab] = useState<string>('all')

  const coreCourses = ALL_COURSES.filter((c) => c.slug !== 'membership')

  const filteredCourses =
    activeTrack === 'all'
      ? coreCourses
      : coreCourses.filter((c) => c.track === activeTrack)

  const signedIn = Boolean(session?.isAuthenticated)

  return (
    <>
      <style jsx global>{`
        @media (max-width: 1024px) {
          .university-main-grid {
            flex-direction: column !important;
          }
          .university-sidebar {
            width: 100% !important;
            position: static !important;
          }
        }
      `}</style>

      {/* ── 0. TOP ANNOUNCEMENT BAR (Clean Rundown AI Style) ── */}
      {showHero && (
        <Box
          py={12}
          px={16}
          bg="rgba(255, 255, 255, 0.03)"
          borderBottomWidth={1}
          borderColor="rgba(255, 255, 255, 0.08)"
          display="flex"
          justify="center"
          items="center"
        >
          <Link
            href="/agentic-coding"
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
                backgroundColor: '#ffffff',
                boxShadow: '0 0 8px rgba(255, 255, 255, 0.8)',
              }}
            />
            <Text fontFamily="$mono" fontSize={12} fontWeight="700" color="var(--white)">
              Interactive Degree Track:
            </Text>
            <Text fontSize={13} color="rgba(255, 255, 255, 0.9)">
              SYS 103 (AI Systems Engineering) in Hanzo Visor — Launch Free Sandbox
            </Text>
            <span style={{ color: 'var(--white)', fontSize: '13px' }}>→</span>
          </Link>
        </Box>
      )}

      {/* ── 1. HERO SECTION (High-Converting Rundown AI Format) ── */}
      {showHero && (
        <Band pad={72} measure={1040} rule={false}>
          <YStack items="center" gap={22} $platform-web={{ textAlign: 'center' }}>
            <Eyebrow>Hanzo University · Frontier AI Systems Engineering</Eyebrow>
            <Title quiet={false}>Go from AI-curious to AI builder.</Title>
            <Lede>
              Free live sessions and daily engineering guides from operators who build frontier AI every day.
              Go Pro to unlock every on-demand degree track, full Hanzo Pro developer platform access, W3C certifications, and monthly $50 compute perk drops.
            </Lede>

            {/* Primary CTAs */}
            <XStack justify="center" gap={14} mt={10} flexWrap="wrap">
              <Action href="/checkout/membership" fill>
                Start 7-Day Free Trial — $0 today →
              </Action>
              <Action href="#curriculum">
                Browse Degree Tracks
              </Action>
              {signedIn ? null : (
                <Action href={SIGN_IN}>
                  Sign in
                </Action>
              )}
            </XStack>

            {/* Social Proof Strip */}
            <XStack items="center" justify="center" gap={10} mt={12} flexWrap="wrap">
              <XStack gap={3}>
                {[1, 2, 3, 4, 5].map((i) => (
                  <Star key={i} size={15} fill="var(--white)" color="var(--white)" />
                ))}
              </XStack>
              <Text fontSize={14} color="rgba(255, 255, 255, 0.8)" fontWeight="500">
                Trusted by 32,000+ engineers from Stripe, OpenAI, DeepMind, &amp; Hanzo
              </Text>
            </XStack>
          </YStack>
        </Band>
      )}

      {/* ── 2. 4-STAT METRICS STRIP ── */}
      {showHero && (
        <Band pad={28} measure={1200} rule={true}>
          <Grid columns={{ min: 220, max: 4 }} gap={16}>
            {[
              { stat: '6', label: 'On-Demand Degree Tracks', sub: 'From agents to sovereign clusters' },
              { stat: '193+', label: 'Systems Architecture Guides', sub: 'Daily operator dispatches' },
              { stat: 'Weekly', label: 'Live Labs & Faculty Research', sub: 'Interactive code sessions' },
              { stat: '$50 / mo', label: 'In Member Compute Perks', sub: 'Zen 6 & Hanzo Visor credits' },
            ].map((item, idx) => (
              <Card key={idx} p={22} bg="rgba(255, 255, 255, 0.02)">
                <YStack gap={4}>
                  <Text fontSize={30} fontWeight="800" color="var(--white)" fontFamily="$mono">
                    {item.stat}
                  </Text>
                  <Text fontSize={14} fontWeight="700" color="var(--white)">
                    {item.label}
                  </Text>
                  <Text fontSize={12} color="rgba(255, 255, 255, 0.65)" lineHeight={18}>
                    {item.sub}
                  </Text>
                </YStack>
              </Card>
            ))}
          </Grid>
        </Band>
      )}

      {/* ── 3. SIGNATURE TWO-COLUMN INTERACTIVE LAYOUT (Feed + Sticky Pro Rail) ── */}
      <Band pad={56} measure={1280} rule={true}>
        <div className="university-main-grid" style={{ display: 'flex', gap: '32px', alignItems: 'flex-start' }}>
          {/* ── LEFT COLUMN (Interactive Feed) ── */}
          <div style={{ flex: '1 1 0%', minWidth: 0 }}>
            <YStack gap={36}>
              {/* 3A. NEXT LIVE SESSION MARQUEE BANNER */}
              <Card p={28} bg="rgba(255, 255, 255, 0.03)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.12)">
                <YStack gap={16}>
                  <XStack items="center" justify="space-between" flexWrap="wrap" gap={10}>
                    <span
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '8px',
                        padding: '4px 12px',
                        borderRadius: '9999px',
                        background: 'rgba(255, 255, 255, 0.08)',
                        border: '1px solid rgba(255, 255, 255, 0.16)',
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 700,
                        color: '#ffffff',
                      }}
                    >
                      <span
                        style={{
                          width: '6px',
                          height: '6px',
                          borderRadius: '50%',
                          backgroundColor: '#ffffff',
                          boxShadow: '0 0 6px #ffffff',
                        }}
                      />
                      NEXT LIVE SESSION · IN 3D 14H
                    </span>
                    <Text fontFamily="$mono" fontSize={11} color="rgba(255, 255, 255, 0.6)">
                      FREE FOR ALL STUDENTS
                    </Text>
                  </XStack>

                  <YStack gap={8}>
                    <Text fontSize={22} fontWeight="800" color="var(--white)" lineHeight={28}>
                      Getting Real Work Out of Autonomous Agents with Hanzo Visor &amp; Kai 1
                    </Text>
                    <Text fontSize={14} color="rgba(255, 255, 255, 0.85)" lineHeight={22}>
                      Watch live as we architect a multi-agent coordinator-executor swarm, run automated SWE-bench repairs in ephemeral user-space sandboxes, and enforce hardware budget caps.
                    </Text>
                  </YStack>

                  <XStack items="center" gap={18} flexWrap="wrap" pt={4}>
                    <XStack items="center" gap={6}>
                      <Calendar size={14} color="rgba(255, 255, 255, 0.7)" />
                      <Text fontSize={13} color="rgba(255, 255, 255, 0.8)">
                        Thursday, Oct 11 · 10:00 AM PT / 1:00 PM ET
                      </Text>
                    </XStack>
                    <XStack items="center" gap={6}>
                      <Users size={14} color="rgba(255, 255, 255, 0.7)" />
                      <Text fontSize={13} color="rgba(255, 255, 255, 0.8)">
                        Dr. Ethan Vance &amp; Hanzo Systems Team
                      </Text>
                    </XStack>
                  </XStack>

                  <XStack items="center" gap={12} pt={8} flexWrap="wrap">
                    <Action href="/agentic-coding" fill>
                      Save your spot →
                    </Action>
                    <Action href="/checkout/membership">
                      Unlock Full Degree Track
                    </Action>
                  </XStack>
                </YStack>
              </Card>

              {/* 3B. THIS WEEK AT HANZO UNIVERSITY (DIGEST FEED) */}
              <Card p={28} bg="rgba(255, 255, 255, 0.02)">
                <YStack gap={20}>
                  <XStack items="center" justify="space-between" flexWrap="wrap" gap={8}>
                    <YStack gap={4}>
                      <Eyebrow>WEEKLY SCHEDULE &amp; DISPATCHES</Eyebrow>
                      <Text fontSize={20} fontWeight="800" color="var(--white)">
                        This Week at Hanzo University
                      </Text>
                      <Text fontSize={14} color="rgba(255, 255, 255, 0.75)">
                        Fresh releases, live labs, and architectural dispatches updated daily.
                      </Text>
                    </YStack>
                  </XStack>

                  <YStack gap={10}>
                    {WEEKLY_FEED.map((item, idx) => (
                      <Link
                        key={idx}
                        href={item.link}
                        style={{
                          textDecoration: 'none',
                          display: 'block',
                        }}
                      >
                        <div
                          style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            gap: '16px',
                            padding: '14px 18px',
                            borderRadius: '12px',
                            backgroundColor: 'rgba(255, 255, 255, 0.02)',
                            border: '1px solid rgba(255, 255, 255, 0.07)',
                            transition: 'all 0.15s ease',
                          }}
                        >
                          <div style={{ display: 'flex', alignItems: 'center', gap: '14px', minWidth: 0, flex: 1 }}>
                            <span
                              style={{
                                padding: '4px 8px',
                                borderRadius: '6px',
                                backgroundColor: 'rgba(255, 255, 255, 0.08)',
                                border: '1px solid rgba(255, 255, 255, 0.14)',
                                fontFamily: 'var(--font-mono)',
                                fontSize: '11px',
                                fontWeight: 700,
                                color: '#ffffff',
                                flexShrink: 0,
                              }}
                            >
                              {item.day}
                            </span>
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '3px', minWidth: 0, flex: 1 }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span
                                  style={{
                                    fontFamily: 'var(--font-mono)',
                                    fontSize: '10px',
                                    color: 'rgba(255, 255, 255, 0.6)',
                                    letterSpacing: '0.5px',
                                  }}
                                >
                                  {item.type}
                                </span>
                              </div>
                              <div
                                style={{
                                  fontSize: '15px',
                                  fontWeight: 700,
                                  color: '#ffffff',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {item.title}
                              </div>
                              <div
                                style={{
                                  fontSize: '13px',
                                  color: 'rgba(255, 255, 255, 0.75)',
                                  lineHeight: '18px',
                                  whiteSpace: 'nowrap',
                                  overflow: 'hidden',
                                  textOverflow: 'ellipsis',
                                }}
                              >
                                {item.desc}
                              </div>
                            </div>
                          </div>
                          <div
                            style={{
                              flexShrink: 0,
                              fontSize: '13px',
                              fontWeight: 600,
                              color: '#ffffff',
                              display: 'inline-flex',
                              alignItems: 'center',
                              gap: '4px',
                            }}
                          >
                            {item.cta}
                          </div>
                        </div>
                      </Link>
                    ))}
                  </YStack>
                </YStack>
              </Card>

              {/* 3C. BROWSE BY ENGINEERING SPECIALIZATION */}
              <YStack gap={18}>
                <YStack gap={6}>
                  <Eyebrow>ENGINEERING WORKFLOWS</Eyebrow>
                  <Text fontSize={22} fontWeight="800" color="var(--white)">
                    Browse by Specialization
                  </Text>
                  <Text fontSize={14} color="rgba(255, 255, 255, 0.8)">
                    Choose your focus area to access tailored syllabi, sandboxes, and verification rubrics.
                  </Text>
                </YStack>

                <Grid columns={{ min: 260, max: 2 }} gap={16}>
                  {SPECIALIZATIONS.map((spec) => {
                    const IconComp = spec.icon
                    return (
                      <Link
                        key={spec.id}
                        href={spec.link}
                        style={{ textDecoration: 'none' }}
                      >
                        <Card
                          p={20}
                          bg="rgba(255, 255, 255, 0.02)"
                          borderWidth={1}
                          borderColor="rgba(255, 255, 255, 0.08)"
                          $platform-web={{
                            transition: 'all 0.15s ease',
                            cursor: 'pointer',
                          }}
                        >
                          <YStack gap={10}>
                            <XStack items="center" justify="space-between">
                              <Box
                                p={8}
                                rounded="var(--radius-md)"
                                bg="rgba(255, 255, 255, 0.06)"
                                borderWidth={1}
                                borderColor="rgba(255, 255, 255, 0.1)"
                              >
                                <IconComp size={18} color="var(--white)" />
                              </Box>
                              <Text fontFamily="$mono" fontSize={11} color="rgba(255, 255, 255, 0.6)">
                                {spec.code} · {spec.duration}
                              </Text>
                            </XStack>
                            <Text fontSize={16} fontWeight="700" color="var(--white)">
                              {spec.title}
                            </Text>
                            <Text fontSize={13} color="rgba(255, 255, 255, 0.75)" lineHeight={20}>
                              {spec.desc}
                            </Text>
                            <XStack items="center" gap={4} mt={4}>
                              <Text fontSize={12} fontWeight="600" color="var(--white)">
                                View track &amp; syllabus →
                              </Text>
                            </XStack>
                          </YStack>
                        </Card>
                      </Link>
                    )
                  })}
                </Grid>
              </YStack>

              {/* 3D. CURRICULUM CATALOG */}
              <YStack id="curriculum" gap={20}>
                <YStack gap={6}>
                  <Eyebrow>ACCREDITED PROGRAMS</Eyebrow>
                  <Text fontSize={22} fontWeight="800" color="var(--white)">
                    Degree Programs &amp; Professional Certifications
                  </Text>
                  <Text fontSize={14} color="rgba(255, 255, 255, 0.8)">
                    Enroll in individual degree courses or unlock all six with Hanzo University Pro.
                  </Text>
                </YStack>

                {/* Track Filter Tabs */}
                <XStack items="center" gap={8} flexWrap="wrap">
                  {[
                    { id: 'all', label: 'All 6 Programs' },
                    { id: 'coding', label: 'Agentic Coding (ENG 100)' },
                    { id: 'rl', label: 'Reinforcement Learning (RL 101)' },
                    { id: 'systems', label: 'Systems & Tools (SYS 103 / PRA 104)' },
                    { id: 'marketing', label: 'Programmatic Marketing (MKT 102)' },
                    { id: 'architect', label: 'Production Architect (ARC 105)' },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      type="button"
                      onClick={() => setActiveTrack(tab.id)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: '9999px',
                        border: `1px solid ${activeTrack === tab.id ? 'var(--white)' : 'rgba(255, 255, 255, 0.12)'}`,
                        background: activeTrack === tab.id ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                        color: activeTrack === tab.id ? 'var(--white)' : 'rgba(255, 255, 255, 0.65)',
                        cursor: 'pointer',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '0.8125rem',
                        fontWeight: activeTrack === tab.id ? 700 : 400,
                        outline: 'none',
                        transition: 'all 0.15s ease',
                      }}
                    >
                      {tab.label}
                    </button>
                  ))}
                </XStack>

                {/* Courses List */}
                <YStack gap={20}>
                  {filteredCourses.map((course) => (
                    <Card
                      key={course.code}
                      p={24}
                      bg="rgba(255, 255, 255, 0.02)"
                      borderWidth={1}
                      borderColor="rgba(255, 255, 255, 0.08)"
                    >
                      <YStack gap={16}>
                        {/* Header */}
                        <XStack items="center" justify="space-between" flexWrap="wrap" gap={8}>
                          <XStack items="center" gap={8}>
                            <Text fontFamily="$mono" fontSize={13} fontWeight="700" color="var(--white)">
                              {course.code} · {course.level}
                            </Text>
                            <Text fontFamily="$mono" fontSize={12} color="rgba(255, 255, 255, 0.5)">
                              · {course.duration}
                            </Text>
                          </XStack>
                          <Chip px={10} py={3} fontSize={12} fontFamily="$mono" fontWeight="700">
                            {course.credential} Credential
                          </Chip>
                        </XStack>

                        {/* Title & Summary */}
                        <YStack gap={6}>
                          <Text fontSize={20} fontWeight="700" color="var(--white)" lineHeight={26}>
                            {course.title}
                          </Text>
                          <Text fontSize={14} color="rgba(255, 255, 255, 0.85)" lineHeight={22}>
                            {course.summary}
                          </Text>
                        </YStack>

                        {/* Capstone Deliverable Callout */}
                        <Box
                          p={14}
                          rounded="var(--radius-md)"
                          bg="rgba(255, 255, 255, 0.03)"
                          borderWidth={1}
                          borderColor="rgba(255, 255, 255, 0.08)"
                        >
                          <Text fontFamily="$mono" fontSize={11} color="rgba(255, 255, 255, 0.75)" fontWeight="700" mb={4}>
                            VERIFIED CAPSTONE DEFENSE:
                          </Text>
                          <Text fontSize={13} color="rgba(255, 255, 255, 0.85)" lineHeight={20}>
                            {course.capstone}
                          </Text>
                        </Box>

                        {/* Technical Competencies */}
                        <YStack gap={8}>
                          <Text fontSize={12} fontFamily="$mono" color="rgba(255, 255, 255, 0.7)" fontWeight="600">
                            Core Competencies:
                          </Text>
                          <Grid columns={{ min: 240, max: 2 }} gap={8}>
                            {course.competencies.map((comp, i) => (
                              <XStack key={i} items="flex-start" gap={8}>
                                <Check size={14} color="var(--white)" style={{ marginTop: 3, flexShrink: 0 }} />
                                <Text fontSize={13} color="rgba(255, 255, 255, 0.8)" lineHeight={18}>
                                  {comp}
                                </Text>
                              </XStack>
                            ))}
                          </Grid>
                        </YStack>

                        {/* Pricing & Actions */}
                        <XStack
                          items="center"
                          justify="space-between"
                          flexWrap="wrap"
                          gap={14}
                          pt={16}
                          borderTopWidth={1}
                          borderColor="rgba(255, 255, 255, 0.08)"
                        >
                          <XStack items="baseline" gap={12} flexWrap="wrap">
                            <XStack items="baseline" gap={4}>
                              <Text fontSize={26} fontWeight="800" color="var(--white)" fontFamily="$mono">
                                ${course.price}
                              </Text>
                              <Text fontSize={12} color="rgba(255, 255, 255, 0.5)">
                                USD one-time
                              </Text>
                            </XStack>
                            <Box
                              px={8}
                              py={3}
                              rounded="var(--radius-sm)"
                              bg="rgba(255, 255, 255, 0.06)"
                              borderWidth={1}
                              borderColor="rgba(255, 255, 255, 0.12)"
                            >
                              <Text fontSize={12} fontFamily="$mono" color="var(--white)" fontWeight="600">
                                + ${course.rebateCredits} compute credit for free (25%)
                              </Text>
                            </Box>
                          </XStack>

                          <XStack gap={10} flexWrap="wrap">
                            <Action href={`/${course.slug}`}>
                              Syllabus →
                            </Action>
                            <Action href={courseCheckoutUrl(course.slug)} fill>
                              Enroll — ${course.price}
                            </Action>
                          </XStack>
                        </XStack>
                      </YStack>
                    </Card>
                  ))}
                </YStack>
              </YStack>
            </YStack>
          </div>

          {/* ── RIGHT COLUMN (Sticky Pro Sidebar Rail) ── */}
          <div
            className="university-sidebar"
            style={{
              width: '380px',
              flexShrink: 0,
              position: 'sticky',
              top: '80px',
              alignSelf: 'flex-start',
            }}
          >
            <YStack gap={20}>
              {/* PRO MEMBERSHIP CARD */}
              <Card
                p={28}
                bg="rgba(255, 255, 255, 0.04)"
                borderWidth={1}
                borderColor="rgba(255, 255, 255, 0.2)"
              >
                <YStack gap={20}>
                  <XStack items="center" justify="space-between">
                    <span
                      style={{
                        padding: '4px 10px',
                        borderRadius: '9999px',
                        background: '#ffffff',
                        color: '#000000',
                        fontSize: '11px',
                        fontFamily: 'var(--font-mono)',
                        fontWeight: 800,
                        letterSpacing: '0.5px',
                      }}
                    >
                      ★ 7-DAY FREE TRIAL · ALL-ACCESS
                    </span>
                    <Text fontFamily="$mono" fontSize={11} color="rgba(255, 255, 255, 0.6)">
                      CANCEL ANYTIME
                    </Text>
                  </XStack>

                  <YStack gap={6}>
                    <Text fontSize={22} fontWeight="800" color="var(--white)">
                      Hanzo University Pro
                    </Text>
                    <Text fontSize={13} color="rgba(255, 255, 255, 0.75)" lineHeight={20}>
                      All degree tracks and full Hanzo Pro developer platform access in a single membership. Card required upfront.
                    </Text>
                  </YStack>

                  {/* Price */}
                  <XStack items="baseline" gap={6}>
                    <Text fontSize={36} fontWeight="800" color="var(--white)" fontFamily="$mono">
                      $0
                    </Text>
                    <Text fontSize={14} color="rgba(255, 255, 255, 0.65)">
                      today · then $29 / month
                    </Text>
                  </XStack>

                  {/* Benefits Checklist */}
                  <YStack gap={10} pt={4} borderTopWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
                    {[
                      '7-day free trial with card required upfront',
                      'All 6 accredited degree tracks & syllabi',
                      'Full Hanzo Pro developer account included',
                      'Unlimited Zen 6 & premium model inference',
                      'Dedicated Hanzo Visor GPU sandboxes',
                      '+ $50 compute credit for free every month',
                      'Weekly live labs & private faculty office hours',
                      'W3C Verifiable Credentials on Lux Chain',
                      '24/7 private Discord community & alumni network',
                    ].map((benefit, i) => (
                      <XStack key={i} items="flex-start" gap={10}>
                        <Check size={15} color="var(--white)" style={{ marginTop: 2, flexShrink: 0 }} />
                        <Text fontSize={13} color="rgba(255, 255, 255, 0.9)" lineHeight={19}>
                          {benefit}
                        </Text>
                      </XStack>
                    ))}
                  </YStack>

                  {/* Primary CTA */}
                  <Action href="/checkout/membership" fill width="100%">
                    Start 7-Day Free Trial →
                  </Action>

                  <Text fontSize={12} color="rgba(255, 255, 255, 0.55)" style={{ textAlign: 'center' }} lineHeight={16}>
                    Card verified today ($0 charge). Renews at $29/mo on Day 8.
                  </Text>

                  {/* Student Quote */}
                  <Box
                    p={14}
                    rounded="var(--radius-md)"
                    bg="rgba(255, 255, 255, 0.03)"
                    borderWidth={1}
                    borderColor="rgba(255, 255, 255, 0.08)"
                  >
                    <Text fontSize={13} color="rgba(255, 255, 255, 0.85)" lineHeight={20} fontStyle="italic">
                      &ldquo;Hanzo University replaced our entire internal AI onboarding. The hands-on Hanzo Visor cleanroom grading is unmatched.&rdquo;
                    </Text>
                    <Text fontSize={11} fontFamily="$mono" color="rgba(255, 255, 255, 0.6)" mt={6}>
                      — Alex Chen, Staff Systems Engineer
                    </Text>
                  </Box>
                </YStack>
              </Card>

              {/* FREE ACCOUNT CARD */}
              <Card
                p={22}
                bg="rgba(255, 255, 255, 0.02)"
                borderWidth={1}
                borderColor="rgba(255, 255, 255, 0.08)"
              >
                <YStack gap={14}>
                  <XStack items="center" justify="space-between">
                    <Text fontSize={16} fontWeight="700" color="var(--white)">
                      Free Student Account
                    </Text>
                    <Text fontFamily="$mono" fontSize={16} fontWeight="700" color="var(--white)">
                      $0
                    </Text>
                  </XStack>
                  <Text fontSize={13} color="rgba(255, 255, 255, 0.7)" lineHeight={18}>
                    Access free weekly seminars and foundational architecture guides.
                  </Text>

                  <YStack gap={8}>
                    {[
                      'Free live sessions & recorded broadcasts',
                      '193+ public engineering guides & architectures',
                      'Community Discord access & syllabus reviews',
                    ].map((item, i) => (
                      <XStack key={i} items="flex-start" gap={8}>
                        <Check size={14} color="rgba(255, 255, 255, 0.6)" style={{ marginTop: 2, flexShrink: 0 }} />
                        <Text fontSize={12} color="rgba(255, 255, 255, 0.75)" lineHeight={17}>
                          {item}
                        </Text>
                      </XStack>
                    ))}
                  </YStack>

                  <Action href={SIGN_IN} width="100%">
                    Create free account →
                  </Action>
                </YStack>
              </Card>
            </YStack>
          </div>
        </div>
      </Band>

      {/* ── 4. ZERO LAB TAX: 25% COMPUTE REBATE VALUE PROPOSITION ── */}
      <Band pad={56} measure={1200} rule={true}>
        <Card
          p={32}
          borderWidth={1}
          borderColor="rgba(255, 255, 255, 0.08)"
          bg="rgba(255, 255, 255, 0.02)"
          display="flex"
          flexDirection="column"
          gap={24}
        >
          <XStack items="center" justify="space-between" flexWrap="wrap" gap={16}>
            <XStack items="center" gap={14} flex={1} minW={0}>
              <Coins size={32} color="var(--white)" style={{ flexShrink: 0 }} />
              <YStack gap={4} flex={1} minW={0}>
                <Text fontSize={22} fontWeight="800" color="var(--white)">
                  Zero Lab Tax: 25% Usage Credit Rebate (Rounded Up)
                </Text>
                <Text fontSize={14} color="rgba(255, 255, 255, 0.75)">
                  We don&rsquo;t just sell coursework—we subsidize the compute you need to build it.
                </Text>
              </YStack>
            </XStack>
            <Chip py={8} px={16} fontSize={12} fontWeight="700">
              100% Skin in the Game
            </Chip>
          </XStack>

          <Text fontSize={14} color="rgba(255, 255, 255, 0.85)" lineHeight={22}>
            Every enrollment immediately deposits 25% of tuition (rounded up to the nearest dollar)
            directly into your Hanzo Cloud account. Use your credits across Zen 6, Enso reasoning models,
            Kai finite-state decision loops, and Hanzo Visor sandbox container leases.
          </Text>

          {/* Rebate Tiers */}
          <Grid columns={{ min: 200, max: 3 }} gap={16}>
            {[
              { price: '$149', credit: '+$38', name: 'SYS 103 Systems Engineering' },
              { price: '$199', credit: '+$50', name: 'ENG 100 Agentic Coding' },
              { price: '$249', credit: '+$63', name: 'RL 101 Native Reinforcement Learning' },
            ].map((tier, idx) => (
              <Box
                key={idx}
                p={18}
                rounded="var(--radius-lg)"
                borderWidth={1}
                borderColor="rgba(255, 255, 255, 0.08)"
                bg="rgba(255, 255, 255, 0.03)"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  textAlign: 'center',
                }}
              >
                <Text fontFamily="$mono" fontSize={12} color="rgba(255, 255, 255, 0.7)">
                  {tier.name}
                </Text>
                <Text fontSize={20} fontWeight="800" color="var(--white)" my={4} fontFamily="$mono">
                  {tier.price} Tuition
                </Text>
                <Text fontFamily="$mono" fontSize={13} color="var(--white)" fontWeight="700">
                  {tier.credit} USD Credits Included
                </Text>
              </Box>
            ))}
          </Grid>
        </Card>
      </Band>

      {/* ── 5. THE COMPARISON BENCHMARK (Strictly Monochrome) ── */}
      <Band id="comparison" pad={64} measure={1280} rule={true}>
        <Head
          eyebrow="Market Benchmark · Top 5 AI Course Providers"
          title="How Hanzo Outperforms the Top 5 Global AI Programs"
          lede="We benchmarked Hanzo University head-to-head against the five highest-enrolled AI programs globally: DeepLearning.AI, Stanford Online, MIT Professional Education, Harvard CS50 AI, and Fast.ai. Explore the side-by-side technical benchmarks below."
        />

        {/* Competitor Filter Bar */}
        <XStack items="center" gap={8} mb={28} flexWrap="wrap" justify="center">
          <View
            render="button"
            px={16}
            py={8}
            rounded={999}
            bg={activeCompetitorTab === 'all' ? 'var(--white)' : 'rgba(255, 255, 255, 0.05)'}
            borderWidth={1}
            borderColor={activeCompetitorTab === 'all' ? 'var(--white)' : 'rgba(255, 255, 255, 0.12)'}
            onClick={() => setActiveCompetitorTab('all')}
            $platform-web={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
          >
            <Text
              fontSize={13}
              fontWeight={activeCompetitorTab === 'all' ? '700' : '500'}
              color={activeCompetitorTab === 'all' ? 'var(--pure-black)' : 'var(--white-70)'}
            >
              ★ Master Benchmark (All 5 Providers)
            </Text>
          </View>
          {TOP_5_COMPETITORS.map((c) => {
            const isSel = activeCompetitorTab === c.id
            return (
              <View
                key={c.id}
                render="button"
                px={14}
                py={8}
                rounded={999}
                bg={isSel ? 'var(--white)' : 'rgba(255, 255, 255, 0.05)'}
                borderWidth={1}
                borderColor={isSel ? 'var(--white)' : 'rgba(255, 255, 255, 0.12)'}
                onClick={() => setActiveCompetitorTab(c.id)}
                $platform-web={{ cursor: 'pointer', transition: 'all 0.15s ease' }}
              >
                <Text
                  fontSize={13}
                  fontWeight={isSel ? '700' : '500'}
                  color={isSel ? 'var(--pure-black)' : 'var(--white-70)'}
                >
                  vs. {c.name}
                </Text>
              </View>
            )
          })}
        </XStack>

        {/* Master Comparison Table View */}
        {activeCompetitorTab === 'all' ? (
          <Box
            borderWidth={1}
            borderColor="rgba(255, 255, 255, 0.08)"
            bg="rgba(255, 255, 255, 0.02)"
            overflow="hidden"
            mb={32}
            style={{ borderRadius: '20px' }}
          >
            <Box overflowX="auto">
              <View
                render="table"
                width="100%"
                $platform-web={{ borderCollapse: 'collapse', minWidth: 1080 }}
              >
                <View render="thead">
                  <Text
                    render="tr"
                    borderBottomWidth={1}
                    borderColor="rgba(255, 255, 255, 0.1)"
                    bg="rgba(255, 255, 255, 0.03)"
                    $platform-web={{ display: 'table-row' }}
                  >
                    <Text
                      render="th"
                      p={16}
                      fontSize={12}
                      fontFamily="$mono"
                      color="rgba(255, 255, 255, 0.6)"
                      textTransform="uppercase"
                      letterSpacing={0.5}
                      $platform-web={{ display: 'table-cell', textAlign: 'left', minWidth: 200 }}
                    >
                      Capability &amp; Dimension
                    </Text>

                    {/* Hanzo Highlighted Winner Column (Monochrome) */}
                    <Text
                      render="th"
                      p={16}
                      fontSize={12}
                      fontFamily="$mono"
                      color="var(--white)"
                      bg="rgba(255, 255, 255, 0.06)"
                      borderLeftWidth={1}
                      borderRightWidth={1}
                      borderColor="rgba(255, 255, 255, 0.2)"
                      textTransform="uppercase"
                      letterSpacing={0.5}
                      $platform-web={{ display: 'table-cell', textAlign: 'left', minWidth: 260 }}
                    >
                      <XStack items="center" gap={6}>
                        <Sparkles size={13} color="var(--white)" />
                        <Text fontSize={12} fontWeight="800" color="var(--white)">
                          Hanzo University (Leader)
                        </Text>
                      </XStack>
                    </Text>

                    {['DeepLearning.AI', 'Stanford Online', 'MIT Professional', 'Harvard CS50 AI', 'Fast.ai'].map((prov) => (
                      <Text
                        key={prov}
                        render="th"
                        p={16}
                        fontSize={12}
                        fontFamily="$mono"
                        color="rgba(255, 255, 255, 0.7)"
                        textTransform="uppercase"
                        letterSpacing={0.5}
                        $platform-web={{ display: 'table-cell', textAlign: 'left', minWidth: 170 }}
                      >
                        {prov}
                      </Text>
                    ))}
                  </Text>
                </View>

                <View render="tbody">
                  {MASTER_COMPARISON_MATRIX.map((row, idx) => (
                    <Text
                      key={idx}
                      render="tr"
                      borderBottomWidth={idx === MASTER_COMPARISON_MATRIX.length - 1 ? 0 : 1}
                      borderColor="rgba(255, 255, 255, 0.08)"
                      bg={idx % 2 === 0 ? 'transparent' : 'rgba(255, 255, 255, 0.015)'}
                      $platform-web={{ display: 'table-row' }}
                    >
                      <Text
                        render="td"
                        p={16}
                        fontSize={13}
                        fontWeight="700"
                        color="var(--white)"
                        $platform-web={{ display: 'table-cell', verticalAlign: 'top' }}
                      >
                        {row.dimension}
                      </Text>

                      {/* Hanzo Leader Cell */}
                      <Text
                        render="td"
                        p={16}
                        fontSize={13}
                        color="var(--white)"
                        bg="rgba(255, 255, 255, 0.05)"
                        borderLeftWidth={1}
                        borderRightWidth={1}
                        borderColor="rgba(255, 255, 255, 0.15)"
                        $platform-web={{ display: 'table-cell', verticalAlign: 'top' }}
                      >
                        <XStack items="flex-start" gap={8}>
                          <CheckCircle2 size={15} color="var(--white)" style={{ marginTop: 2, flexShrink: 0 }} />
                          <Text fontSize={13} color="var(--white)" fontWeight="600" lineHeight={19}>
                            {row.hanzo}
                          </Text>
                        </XStack>
                      </Text>

                      {[row.deeplearning, row.stanford, row.mit, row.harvard, row.fastai].map((val, cellIdx) => (
                        <Text
                          key={cellIdx}
                          render="td"
                          p={16}
                          fontSize={12}
                          color="rgba(255, 255, 255, 0.7)"
                          $platform-web={{ display: 'table-cell', verticalAlign: 'top' }}
                        >
                          <XStack items="flex-start" gap={6}>
                            <XCircle size={13} color="rgba(255, 255, 255, 0.4)" style={{ marginTop: 2, flexShrink: 0 }} />
                            <Text fontSize={12} color="rgba(255, 255, 255, 0.7)" lineHeight={18}>
                              {val}
                            </Text>
                          </XStack>
                        </Text>
                      ))}
                    </Text>
                  ))}
                </View>
              </View>
            </Box>
          </Box>
        ) : (
          /* Head-to-Head Provider Deep Dive View */
          (() => {
            const comp = TOP_5_COMPETITORS.find((c) => c.id === activeCompetitorTab) || TOP_5_COMPETITORS[0]
            return (
              <YStack gap={24} mb={32}>
                <Card p={28} bg="rgba(255, 255, 255, 0.02)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.1)">
                  <YStack gap={16}>
                    <XStack items="center" justify="space-between" flexWrap="wrap" gap={12}>
                      <YStack gap={4}>
                        <XStack items="center" gap={10}>
                          <Text fontSize={22} fontWeight="800" color="var(--white)">
                            Hanzo University vs. {comp.name}
                          </Text>
                          <View
                            px={8}
                            py={2}
                            rounded={999}
                            bg="rgba(255, 255, 255, 0.08)"
                            borderWidth={1}
                            borderColor="rgba(255, 255, 255, 0.15)"
                          >
                            <Text fontSize={11} fontFamily="$mono" color="rgba(255, 255, 255, 0.7)">
                              {comp.provider}
                            </Text>
                          </View>
                        </XStack>
                        <Text fontSize={13} color="rgba(255, 255, 255, 0.75)">
                          Flagship Program: <Text color="var(--white)" fontWeight="600">{comp.flagshipCourse}</Text>
                        </Text>
                      </YStack>

                      <View
                        render="button"
                        px={14}
                        py={6}
                        rounded={999}
                        bg="transparent"
                        borderWidth={1}
                        borderColor="rgba(255, 255, 255, 0.2)"
                        onClick={() => setActiveCompetitorTab('all')}
                        $platform-web={{ cursor: 'pointer' }}
                      >
                        <Text fontSize={12} color="var(--white-70)">
                          ← View Master Benchmark Matrix
                        </Text>
                      </View>
                    </XStack>

                    {/* Quick Comparison Bar */}
                    <Grid columns={{ min: 200, max: 4 }} gap={12}>
                      <View p={12} bg="rgba(255, 255, 255, 0.02)" rounded="var(--radius-md)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
                        <Text fontSize={11} fontFamily="$mono" color="rgba(255, 255, 255, 0.6)">
                          {comp.name.toUpperCase()} TUITION
                        </Text>
                        <Text fontSize={14} fontWeight="700" color="rgba(255, 255, 255, 0.9)" mt={4}>
                          {comp.tuition}
                        </Text>
                      </View>

                      <View p={12} bg="rgba(255, 255, 255, 0.05)" rounded="var(--radius-md)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.2)">
                        <Text fontSize={11} fontFamily="$mono" color="var(--white)" fontWeight="700">
                          HANZO TUITION &amp; REBATE
                        </Text>
                        <Text fontSize={14} fontWeight="800" color="var(--white)" mt={4}>
                          $149–$249 (+25% Rebate)
                        </Text>
                      </View>

                      <View p={12} bg="rgba(255, 255, 255, 0.02)" rounded="var(--radius-md)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
                        <Text fontSize={11} fontFamily="$mono" color="rgba(255, 255, 255, 0.6)">
                          {comp.name.toUpperCase()} FORMAT
                        </Text>
                        <Text fontSize={13} color="rgba(255, 255, 255, 0.85)" mt={4} numberOfLines={2}>
                          {comp.format}
                        </Text>
                      </View>

                      <View p={12} bg="rgba(255, 255, 255, 0.05)" rounded="var(--radius-md)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.2)">
                        <Text fontSize={11} fontFamily="$mono" color="var(--white)" fontWeight="700">
                          HANZO ENVIRONMENT
                        </Text>
                        <Text fontSize={13} color="var(--white)" fontWeight="600" mt={4}>
                          Hanzo Visor pods + Dev Sandboxes
                        </Text>
                      </View>
                    </Grid>

                    <Box
                      p={14}
                      rounded="var(--radius-md)"
                      bg="rgba(255, 255, 255, 0.02)"
                      borderLeftWidth={3}
                      borderColor="var(--white)"
                    >
                      <Text fontSize={13} color="rgba(255, 255, 255, 0.9)" lineHeight={20} fontStyle="italic">
                        &ldquo;{comp.verdict}&rdquo;
                      </Text>
                    </Box>
                  </YStack>
                </Card>

                {/* Head-to-Head Cards */}
                <Grid columns={{ min: 360, max: 2 }} gap={20}>
                  <Card p={24} bg="rgba(255, 255, 255, 0.02)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
                    <YStack gap={16}>
                      <XStack items="center" gap={8}>
                        <XCircle size={18} color="rgba(255, 255, 255, 0.6)" />
                        <Text fontSize={16} fontWeight="700" color="var(--white)">
                          Where {comp.name} Falls Short
                        </Text>
                      </XStack>
                      <Text fontSize={12} color="rgba(255, 255, 255, 0.6)">
                        Architectural limitations observed by production engineering leads:
                      </Text>
                      <YStack gap={12}>
                        {comp.flaws.map((flaw, idx) => (
                          <XStack key={idx} items="flex-start" gap={10}>
                            <XCircle size={14} color="rgba(255, 255, 255, 0.45)" style={{ marginTop: 3, flexShrink: 0 }} />
                            <Text fontSize={13} color="rgba(255, 255, 255, 0.8)" lineHeight={20}>
                              {flaw}
                            </Text>
                          </XStack>
                        ))}
                      </YStack>
                    </YStack>
                  </Card>

                  <Card p={24} bg="rgba(255, 255, 255, 0.04)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.15)">
                    <YStack gap={16}>
                      <XStack items="center" gap={8}>
                        <CheckCircle2 size={18} color="var(--white)" />
                        <Text fontSize={16} fontWeight="700" color="var(--white)">
                          How Hanzo Outperforms
                        </Text>
                      </XStack>
                      <Text fontSize={12} color="rgba(255, 255, 255, 0.6)">
                        Production-grade systems engineering capabilities built into the curriculum:
                      </Text>
                      <YStack gap={12}>
                        {comp.hanzoAdvantages.map((adv, idx) => (
                          <XStack key={idx} items="flex-start" gap={10}>
                            <CheckCircle2 size={14} color="var(--white)" style={{ marginTop: 3, flexShrink: 0 }} />
                            <Text fontSize={13} color="rgba(255, 255, 255, 0.95)" fontWeight="500" lineHeight={20}>
                              {adv}
                            </Text>
                          </XStack>
                        ))}
                      </YStack>
                    </YStack>
                  </Card>
                </Grid>

                {/* Direct Metric Specification Table */}
                <Box
                  borderWidth={1}
                  borderColor="rgba(255, 255, 255, 0.08)"
                  bg="rgba(255, 255, 255, 0.02)"
                  overflow="hidden"
                  style={{ borderRadius: '20px' }}
                >
                  <Box p={16} bg="rgba(255, 255, 255, 0.03)" borderBottomWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
                    <Text fontSize={13} fontWeight="700" color="var(--white)" fontFamily="$mono">
                      HEAD-TO-HEAD METRIC SPECIFICATION: HANZO VS. {comp.name.toUpperCase()}
                    </Text>
                  </Box>
                  <Box overflowX="auto">
                    <View render="table" width="100%" $platform-web={{ borderCollapse: 'collapse', minWidth: 640 }}>
                      <View render="tbody">
                        {comp.metrics.map((m, idx) => (
                          <Text
                            key={idx}
                            render="tr"
                            borderBottomWidth={idx === comp.metrics.length - 1 ? 0 : 1}
                            borderColor="rgba(255, 255, 255, 0.06)"
                            $platform-web={{ display: 'table-row' }}
                          >
                            <Text
                              render="td"
                              p={14}
                              fontSize={13}
                              fontWeight="600"
                              color="var(--white)"
                              width="25%"
                              $platform-web={{ display: 'table-cell' }}
                            >
                              {m.label}
                            </Text>
                            <Text
                              render="td"
                              p={14}
                              fontSize={13}
                              color="rgba(255, 255, 255, 0.7)"
                              width="37.5%"
                              $platform-web={{ display: 'table-cell' }}
                            >
                              <XStack items="center" gap={6}>
                                <XCircle size={13} color="rgba(255, 255, 255, 0.4)" style={{ flexShrink: 0 }} />
                                <Text fontSize={13} color="rgba(255, 255, 255, 0.7)">{m.legacyVal}</Text>
                              </XStack>
                            </Text>
                            <Text
                              render="td"
                              p={14}
                              fontSize={13}
                              color="var(--white)"
                              fontWeight="600"
                              width="37.5%"
                              bg="rgba(255, 255, 255, 0.04)"
                              $platform-web={{ display: 'table-cell' }}
                            >
                              <XStack items="center" gap={6}>
                                <CheckCircle2 size={14} color="var(--white)" style={{ flexShrink: 0 }} />
                                <Text fontSize={13} color="var(--white)" fontWeight="600">{m.hanzoVal}</Text>
                              </XStack>
                            </Text>
                          </Text>
                        ))}
                      </View>
                    </View>
                  </Box>
                </Box>
              </YStack>
            )
          })()
        )}

        {/* Career Trajectory Cards (High Contrast) */}
        <Grid columns={{ min: 320, max: 3 }} gap={20}>
          <Card p={24} bg="rgba(255, 255, 255, 0.02)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
            <YStack gap={12}>
              <Briefcase size={22} color="var(--white)" />
              <Text fontSize={16} fontWeight="700" color="var(--white)">
                Senior Software Engineer → AI Systems Engineer
              </Text>
              <Text fontSize={14} color="rgba(255, 255, 255, 0.85)" lineHeight={22}>
                Move past frontend wrappers into core systems engineering. Master tree-sitter AST parsing,
                zero-copy ZAP IPC, and isolated Hanzo Visor execution pods to command top-tier compensation ($180k–$240k).
              </Text>
            </YStack>
          </Card>

          <Card p={24} bg="rgba(255, 255, 255, 0.02)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
            <YStack gap={12}>
              <TrendingUp size={22} color="var(--white)" />
              <Text fontSize={16} fontWeight="700" color="var(--white)">
                Full-Stack Engineer → Autonomous Agent Architect
              </Text>
              <Text fontSize={14} color="rgba(255, 255, 255, 0.85)" lineHeight={22}>
                Lead enterprise agent initiatives. Learn to architect multi-agent coordinator-executor swarms
                that resolve complex GitHub defects within strict micro-USD financial ceilings ($220k–$310k).
              </Text>
            </YStack>
          </Card>

          <Card p={24} bg="rgba(255, 255, 255, 0.02)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
            <YStack gap={12}>
              <ShieldCheck size={22} color="var(--white)" />
              <Text fontSize={16} fontWeight="700" color="var(--white)">
                Engineering Founder → CTO of AI-Native Venture
              </Text>
              <Text fontSize={14} color="rgba(255, 255, 255, 0.85)" lineHeight={22}>
                Deploy production-grade agentic products with zero runaway inference bills. Use native Gymnasium
                reinforcement learning and finite-state Kai decision loops to eliminate hallucinations.
              </Text>
            </YStack>
          </Card>
        </Grid>
      </Band>

      {/* ── 6. SIX PILLARS OF PRODUCTION RIGOR ── */}
      <Band id="pillars" pad={64} measure={1200} rule={true}>
        <Head
          eyebrow="Pedagogical Architecture"
          title="Engineered for software engineers. Not prompt hobbyists."
          lede="Every concept is grounded in systems engineering: zero-copy RPC, bounded memory state machines, reinforcement learning environments, and cryptographic credentials."
        />

        <Grid columns={{ min: 320, max: 3 }} gap={20}>
          {[
            {
              icon: Scale,
              title: 'Automated CI Grading',
              body: 'Zero human subjectivity. Submissions are graded by isolated CI runners that clone your repository, inject breaking changes, and evaluate repair velocity and test pass rates.',
            },
            {
              icon: Coins,
              title: 'Integer Micro-USD Ceilings',
              body: 'Prevent runaway cloud bills. Learn to configure pre-call price quoting, in-band budget refusals, and sub-cent financial caps directly in your agent loop.',
            },
            {
              icon: Cpu,
              title: 'Zero-Token Decision Loops',
              body: 'Generate text only when generation is strictly required. Master finite-state control with Kai, evaluating tool calls and routing without paying for generation tokens.',
            },
            {
              icon: Zap,
              title: 'Zero-Copy ZAP Protocols',
              body: 'Replace 200ms JSON-RPC hops with Cap’n Proto zero-copy serialization. Connect multi-agent swarms with microsecond inter-process latency and post-quantum encryption.',
            },
            {
              icon: Boxes,
              title: 'Native Gymnasium Environments',
              body: 'Model agent interactions as formal Markov Decision Processes (MDP). Train custom policy routers, write multi-objective reward functions, and run Zoo Gym fine-tuning.',
            },
            {
              icon: ShieldCheck,
              title: 'W3C Cryptographic Proof',
              body: 'Earn verifiable credentials signed by Hanzo Trust with immutable on-chain records and real-time verifiable GitHub SVG badges linking directly to your passing benchmark run.',
            },
          ].map((pillar, idx) => {
            const IconC = pillar.icon
            return (
              <Card key={idx} p={24} bg="rgba(255, 255, 255, 0.02)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
                <YStack gap={10}>
                  <IconC size={22} color="var(--white)" />
                  <Text fontSize={17} fontWeight="700" color="var(--white)">
                    {pillar.title}
                  </Text>
                  <Text fontSize={14} color="rgba(255, 255, 255, 0.85)" lineHeight={22}>
                    {pillar.body}
                  </Text>
                </YStack>
              </Card>
            )
          })}
        </Grid>
      </Band>

      {/* ── 7. FREQUENTLY ASKED QUESTIONS (High Contrast & Clean Borders) ── */}
      <Band id="faqs" pad={64} measure={1080} rule={true}>
        <Head
          eyebrow="Frequently Asked Questions"
          title="Everything you need to know about Hanzo University"
          lede="Clear answers regarding our 25% compute rebate, automated cleanroom grading, hardware specifications, and credential verification."
        />

        <Grid columns={{ min: 280, max: 2 }} gap={20}>
          {[
            {
              q: 'How does the 25% usage credit rebate work?',
              a: 'When you enroll in any course (e.g. $199 for ENG 100), exactly 25% of your payment rounded up to the nearest dollar ($50 USD) is deposited immediately into your Hanzo Cloud compute account. These credits never expire and can be used across Zen 6, Enso, Kai decision models, and Hanzo Visor sandbox container leases.',
            },
            {
              q: 'How are capstone projects graded and evaluated?',
              a: 'Grading is 100% objective and automated. An isolated Hanzo grader pod clones your repository in an ephemeral cleanroom, injects synthetic faults and breaking changes into test suites, and evaluates whether your agent can reproduce defects, synthesize syntax-safe AST diffs, and achieve test exit code 0 within budget.',
            },
            {
              q: 'Why do hiring managers value Hanzo credentials over AWS/Azure/Coursera?',
              a: 'Standard certifications test multiple-choice memorization about proprietary cloud consoles. Hanzo credentials prove hands-on software construction under real-world engineering constraints: multi-agent IPC latency, sandbox process isolation, SWE-bench problem resolution, and strict micro-USD financial ceilings.',
            },
            {
              q: 'What format are credentials issued in?',
              a: 'Graduates receive W3C Verifiable Credentials signed cryptographically by the Hanzo Trust Root (did:hanzo:trust) with immutable on-chain commitments. You also receive a dynamic SVG badge for your GitHub profile and resume that links directly to your verified passing CI telemetry.',
            },
            {
              q: 'Can I expense this course through my employer?',
              a: 'Yes. Upon enrollment, you receive an itemized VAT/tax receipt suitable for corporate continuing education and Learning & Development (L&D) reimbursement programs. For teams of 5 or more engineers, we provide pooled credit management and consolidated corporate invoicing.',
            },
            {
              q: 'Do I need a high-end local GPU?',
              a: 'No. You can run all coursework either locally on your laptop CPU/Metal using quantized Zen builds (zen6-flash), or execute in Hanzo Cloud using your included 25% usage credits with zero local setup or hardware requirements.',
            },
          ].map((faq, idx) => (
            <Card key={idx} p={24} bg="rgba(255, 255, 255, 0.02)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
              <YStack gap={10}>
                <Text fontSize={17} fontWeight="700" color="var(--white)">
                  {faq.q}
                </Text>
                <Text fontSize={14} color="rgba(255, 255, 255, 0.85)" lineHeight={22}>
                  {faq.a}
                </Text>
              </YStack>
            </Card>
          ))}
        </Grid>
      </Band>

      {/* ── 8. FINAL CALL TO ACTION ── */}
      <Band pad={72} measure={840} rule={true}>
        <YStack items="center" $platform-web={{ textAlign: 'center' }} gap={18}>
          <Eyebrow>Open Enrollment</Eyebrow>
          <Title quiet={false}>
            Ready to build systems that scale?
          </Title>
          <Lede>
            Join Hanzo University Pro or enroll in a degree track today to claim your compute credits, unlock Hanzo Pro, and gain instant access to browser-based Hanzo Dev sandboxes.
          </Lede>
          <XStack justify="center" gap={14} mt={10} flexWrap="wrap">
            <Action href="/checkout/membership" fill>
              Start 7-Day Free Trial — $0 today →
            </Action>
            <Action href="#curriculum">
              Choose a Class
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
