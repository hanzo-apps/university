'use client'

import React, { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Box, Text, XStack, YStack, View } from '@/components/ui'
import { Band, Card, Head } from '@/components/band'
import { Action, Title, Lede, Eyebrow, Chip } from '@hanzo/ui/marketing'
import { Grid } from '@hanzo/ui/grid'
import {
  Home,
  FileText,
  ShieldCheck,
  BookOpen,
  Headphones,
  Search,
  Award,
  Layers,
  ChevronRight,
  ArrowRight,
  Download,
  Link2,
  Zap,
  Check,
  CheckCircle2,
  User,
  Landmark,
  GraduationCap,
  Coins,
  Scale,
  Cpu,
  Boxes,
  TrendingUp,
  Briefcase,
  XCircle,
  X,
  Sparkles,
  ExternalLink,
  Clock,
  Flame,
  Terminal,
  Server,
  Menu as MenuIcon,
} from 'lucide-react'
import { UNIVERSITY_COURSES } from './courses-data'
import { courseCheckoutUrl } from '@/lib/pay'
import { SIGN_IN } from './funnel'

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


export default function Catalog() {
  const [activeTrack, setActiveTrack] = useState<string>('all')
  const [activeCompetitorTab, setActiveCompetitorTab] = useState<string>('all')

  const filteredCourses =
    activeTrack === 'all'
      ? UNIVERSITY_COURSES
      : UNIVERSITY_COURSES.filter((c) => c.track === activeTrack)

  return (
    <>
      {/* ── 2. ZERO LAB TAX: 25% COMPUTE REBATE VALUE PROPOSITION ── */}
      <Band pad={56} measure={1200} rule={true}>
        <Card
          p={32}
          borderWidth={1}
          borderColor="rgba(255, 255, 255, 0.1)"
          bg="#080808"
          display="flex"
          flexDirection="column"
          gap={24}
        >
          <XStack items="center" justify="space-between" flexWrap="wrap" gap={16}>
            <XStack items="center" gap={14}>
              <Coins size={32} color="var(--white)" />
              <YStack gap={4}>
                <Text fontSize={22} fontWeight="700" color="var(--white)">
                  Zero Lab Tax: 25% Usage Credit Rebate (Rounded Up)
                </Text>
                <Text fontSize={14} color="rgba(255, 255, 255, 0.6)">
                  We don&rsquo;t just sell coursework—we subsidize the compute you need to build it.
                </Text>
              </YStack>
            </XStack>
            <Chip py={8} px={16} fontSize={12} fontWeight="700">
              100% Skin in the Game
            </Chip>
          </XStack>

          <Text fontSize={14} color="rgba(255, 255, 255, 0.75)" lineHeight={22}>
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
                borderColor="rgba(255, 255, 255, 0.1)"
                bg="var(--pure-black)"
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '6px',
                  textAlign: 'center',
                }}
              >
                <Text fontFamily="$mono" fontSize={12} color="rgba(255, 255, 255, 0.6)">
                  {tier.name}
                </Text>
                <Text fontSize={20} fontWeight="700" color="var(--white)" my={4}>
                  {tier.price} Tuition
                </Text>
                <Text fontFamily="$mono" fontSize={13} color="var(--white)" fontWeight="600">
                  {tier.credit} USD Credits
                </Text>
              </Box>
            ))}
          </Grid>
        </Card>
      </Band>

      {/* ── 3. COURSES & CERTIFICATIONS CATALOG ── */}
      <Band id="curriculum" pad={64} measure={1280} ground="var(--pure-black)" rule={true}>
        <Head
          eyebrow="Curriculum Catalog"
          title="Courses & Professional Certifications"
          lede="Select an engineering track to inspect syllabi, lab architectures, and enrollment packages."
        />

        {/* Track Filter Tabs */}
        <XStack justify="center" gap={8} mb={40} flexWrap="wrap">
          {[
            { id: 'all', label: 'All 3 Core Programs' },
            { id: 'coding', label: 'Agentic Coding (ENG 100)' },
            { id: 'rl', label: 'Reinforcement Learning (RL 101)' },
            { id: 'systems', label: 'Systems Engineering (SYS 103)' },
          ].map((tab) => (
            <button
              key={tab.id}
              type="button"
              onClick={() => setActiveTrack(tab.id)}
              style={{
                padding: '8px 18px',
                borderRadius: '9999px',
                border: `1px solid ${activeTrack === tab.id ? 'var(--white)' : 'rgba(255, 255, 255, 0.12)'}`,
                background: activeTrack === tab.id ? 'rgba(255, 255, 255, 0.1)' : 'transparent',
                color: activeTrack === tab.id ? 'var(--white)' : 'rgba(255, 255, 255, 0.6)',
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

        <Grid columns={{ min: 360, max: 3 }} gap={24}>
          {filteredCourses.map((course) => (
            <Card
              key={course.code}
              p={28}
              display="flex"
              flexDirection="column"
              justify="space-between"
              borderWidth={1}
              borderColor="rgba(255, 255, 255, 0.1)"
              bg="#080808"
              position="relative"
            >
              <YStack gap={16}>
                {/* Code & Acronym Header */}
                <XStack items="center" justify="space-between">
                  <Text fontFamily="$mono" fontSize={12} color="rgba(255, 255, 255, 0.6)">
                    {course.code} · {course.level}
                  </Text>
                  <Chip px={10} py={3} fontSize={12} fontFamily="$mono" fontWeight="700">
                    {course.credential}
                  </Chip>
                </XStack>

                {/* Title & Description */}
                <YStack gap={8}>
                  <Text fontSize={20} fontWeight="700" color="var(--white)" lineHeight={26}>
                    {course.title}
                  </Text>
                  <Text fontSize={13} color="rgba(255, 255, 255, 0.6)" lineHeight={20}>
                    {course.summary}
                  </Text>
                </YStack>

                {/* Capstone Deliverable Callout */}
                <Box
                  p={12}
                  rounded="var(--radius-md)"
                  bg="var(--pure-black)"
                  borderWidth={1}
                  borderColor="rgba(255, 255, 255, 0.08)"
                >
                  <Text fontFamily="$mono" fontSize={11} color="rgba(255, 255, 255, 0.75)" fontWeight="600" mb={4}>
                    Verified Capstone:
                  </Text>
                  <Text fontSize={12} color="rgba(255, 255, 255, 0.6)" lineHeight={18}>
                    {course.capstone}
                  </Text>
                </Box>

                {/* Core Competencies Checklist */}
                <YStack gap={8} my={4}>
                  <Text fontSize={12} fontFamily="$mono" color="rgba(255, 255, 255, 0.75)">
                    Technical Competencies:
                  </Text>
                  {course.competencies.map((comp, i) => (
                    <XStack key={i} items="flex-start" gap={8}>
                      <Check size={14} color="var(--white)" style={{ marginTop: 3, flexShrink: 0 }} />
                      <Text fontSize={12} color="rgba(255, 255, 255, 0.6)" lineHeight={18}>
                        {comp}
                      </Text>
                    </XStack>
                  ))}
                </YStack>
              </YStack>

              {/* Pricing & Enrollment Footer */}
              <YStack gap={14} mt={24} pt={18} borderTopWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
                <XStack items="baseline" justify="space-between">
                  <XStack items="baseline" gap={4}>
                    <Text fontSize={26} fontWeight="700" color="var(--white)">
                      ${course.price}
                    </Text>
                    <Text fontSize={12} color="rgba(255, 255, 255, 0.5)">
                      USD
                    </Text>
                  </XStack>
                  <Chip px={8} py={3} fontSize={11} fontFamily="$mono" color="var(--white)">
                    +${course.rebateCredits} Credits (25%)
                  </Chip>
                </XStack>

                <XStack gap={10} width="100%">
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
          ))}
        </Grid>
      </Band>

      {/* ── 4. THE COMPARISON BENCHMARK ── */}
      <Band id="comparison" pad={64} measure={1280} ground="var(--pure-black)" rule={true}>
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
            borderColor="rgba(255, 255, 255, 0.1)"
            bg="#080808"
            overflow="hidden"
            mb={32}
            style={{ borderRadius: '24px' }}
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
                    bg="var(--pure-black)"
                    $platform-web={{ display: 'table-row' }}
                  >
                    <Text
                      render="th"
                      p={16}
                      fontSize={12}
                      fontFamily="$mono"
                      color="rgba(255, 255, 255, 0.5)"
                      textTransform="uppercase"
                      letterSpacing={0.5}
                      $platform-web={{ display: 'table-cell', textAlign: 'left', minWidth: 200 }}
                    >
                      Capability & Dimension
                    </Text>

                    {/* Hanzo Highlighted Winner Column */}
                    <Text
                      render="th"
                      p={16}
                      fontSize={12}
                      fontFamily="$mono"
                      color="var(--emerald-400)"
                      bg="rgba(16, 185, 129, 0.08)"
                      borderLeftWidth={1}
                      borderRightWidth={1}
                      borderColor="rgba(16, 185, 129, 0.3)"
                      textTransform="uppercase"
                      letterSpacing={0.5}
                      $platform-web={{ display: 'table-cell', textAlign: 'left', minWidth: 260 }}
                    >
                      <XStack items="center" gap={6}>
                        <Sparkles size={13} color="var(--emerald-400)" />
                        <Text fontSize={12} fontWeight="700" color="var(--emerald-400)">
                          Hanzo University (Winner)
                        </Text>
                      </XStack>
                    </Text>

                    <Text
                      render="th"
                      p={16}
                      fontSize={12}
                      fontFamily="$mono"
                      color="rgba(255, 255, 255, 0.7)"
                      textTransform="uppercase"
                      letterSpacing={0.5}
                      $platform-web={{ display: 'table-cell', textAlign: 'left', minWidth: 170 }}
                    >
                      DeepLearning.AI
                    </Text>

                    <Text
                      render="th"
                      p={16}
                      fontSize={12}
                      fontFamily="$mono"
                      color="rgba(255, 255, 255, 0.7)"
                      textTransform="uppercase"
                      letterSpacing={0.5}
                      $platform-web={{ display: 'table-cell', textAlign: 'left', minWidth: 170 }}
                    >
                      Stanford Online
                    </Text>

                    <Text
                      render="th"
                      p={16}
                      fontSize={12}
                      fontFamily="$mono"
                      color="rgba(255, 255, 255, 0.7)"
                      textTransform="uppercase"
                      letterSpacing={0.5}
                      $platform-web={{ display: 'table-cell', textAlign: 'left', minWidth: 170 }}
                    >
                      MIT Professional
                    </Text>

                    <Text
                      render="th"
                      p={16}
                      fontSize={12}
                      fontFamily="$mono"
                      color="rgba(255, 255, 255, 0.7)"
                      textTransform="uppercase"
                      letterSpacing={0.5}
                      $platform-web={{ display: 'table-cell', textAlign: 'left', minWidth: 170 }}
                    >
                      Harvard CS50 AI
                    </Text>

                    <Text
                      render="th"
                      p={16}
                      fontSize={12}
                      fontFamily="$mono"
                      color="rgba(255, 255, 255, 0.7)"
                      textTransform="uppercase"
                      letterSpacing={0.5}
                      $platform-web={{ display: 'table-cell', textAlign: 'left', minWidth: 170 }}
                    >
                      Fast.ai
                    </Text>
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
                      {/* Dimension Name */}
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

                      {/* Hanzo (Winner) Cell */}
                      <Text
                        render="td"
                        p={16}
                        fontSize={13}
                        color="var(--white)"
                        bg="rgba(16, 185, 129, 0.04)"
                        borderLeftWidth={1}
                        borderRightWidth={1}
                        borderColor="rgba(16, 185, 129, 0.2)"
                        $platform-web={{ display: 'table-cell', verticalAlign: 'top' }}
                      >
                        <XStack items="flex-start" gap={8}>
                          <CheckCircle2 size={15} color="var(--emerald-400)" style={{ marginTop: 2, flexShrink: 0 }} />
                          <Text fontSize={13} color="var(--white)" fontWeight="600" lineHeight={18}>
                            {row.hanzo}
                          </Text>
                        </XStack>
                      </Text>

                      {/* DeepLearning.AI Cell */}
                      <Text
                        render="td"
                        p={16}
                        fontSize={12}
                        color="rgba(255, 255, 255, 0.6)"
                        $platform-web={{ display: 'table-cell', verticalAlign: 'top' }}
                      >
                        <XStack items="flex-start" gap={6}>
                          <XCircle size={13} color="var(--neutral-500)" style={{ marginTop: 2, flexShrink: 0 }} />
                          <Text fontSize={12} color="rgba(255, 255, 255, 0.6)" lineHeight={17}>
                            {row.deeplearning}
                          </Text>
                        </XStack>
                      </Text>

                      {/* Stanford Online Cell */}
                      <Text
                        render="td"
                        p={16}
                        fontSize={12}
                        color="rgba(255, 255, 255, 0.6)"
                        $platform-web={{ display: 'table-cell', verticalAlign: 'top' }}
                      >
                        <XStack items="flex-start" gap={6}>
                          <XCircle size={13} color="var(--neutral-500)" style={{ marginTop: 2, flexShrink: 0 }} />
                          <Text fontSize={12} color="rgba(255, 255, 255, 0.6)" lineHeight={17}>
                            {row.stanford}
                          </Text>
                        </XStack>
                      </Text>

                      {/* MIT Professional Cell */}
                      <Text
                        render="td"
                        p={16}
                        fontSize={12}
                        color="rgba(255, 255, 255, 0.6)"
                        $platform-web={{ display: 'table-cell', verticalAlign: 'top' }}
                      >
                        <XStack items="flex-start" gap={6}>
                          <XCircle size={13} color="var(--neutral-500)" style={{ marginTop: 2, flexShrink: 0 }} />
                          <Text fontSize={12} color="rgba(255, 255, 255, 0.6)" lineHeight={17}>
                            {row.mit}
                          </Text>
                        </XStack>
                      </Text>

                      {/* Harvard CS50 Cell */}
                      <Text
                        render="td"
                        p={16}
                        fontSize={12}
                        color="rgba(255, 255, 255, 0.6)"
                        $platform-web={{ display: 'table-cell', verticalAlign: 'top' }}
                      >
                        <XStack items="flex-start" gap={6}>
                          <XCircle size={13} color="var(--neutral-500)" style={{ marginTop: 2, flexShrink: 0 }} />
                          <Text fontSize={12} color="rgba(255, 255, 255, 0.6)" lineHeight={17}>
                            {row.harvard}
                          </Text>
                        </XStack>
                      </Text>

                      {/* Fast.ai Cell */}
                      <Text
                        render="td"
                        p={16}
                        fontSize={12}
                        color="rgba(255, 255, 255, 0.6)"
                        $platform-web={{ display: 'table-cell', verticalAlign: 'top' }}
                      >
                        <XStack items="flex-start" gap={6}>
                          <XCircle size={13} color="var(--neutral-500)" style={{ marginTop: 2, flexShrink: 0 }} />
                          <Text fontSize={12} color="rgba(255, 255, 255, 0.6)" lineHeight={17}>
                            {row.fastai}
                          </Text>
                        </XStack>
                      </Text>
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
                {/* Provider Header Showcase */}
                <Card
                  p={28}
                  bg="#080808"
                  borderWidth={1}
                  borderColor="rgba(255, 255, 255, 0.12)"
                >
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
                        <Text fontSize={13} color="rgba(255, 255, 255, 0.6)">
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
                      <View p={12} bg="rgba(255, 255, 255, 0.03)" rounded="var(--radius-md)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.06)">
                        <Text fontSize={11} fontFamily="$mono" color="rgba(255, 255, 255, 0.5)">
                          {comp.name} TUITION
                        </Text>
                        <Text fontSize={14} fontWeight="700" color="rgba(255, 255, 255, 0.8)" mt={4}>
                          {comp.tuition}
                        </Text>
                      </View>

                      <View p={12} bg="rgba(16, 185, 129, 0.06)" rounded="var(--radius-md)" borderWidth={1} borderColor="rgba(16, 185, 129, 0.2)">
                        <Text fontSize={11} fontFamily="$mono" color="var(--emerald-400)">
                          HANZO TUITION & REBATE
                        </Text>
                        <Text fontSize={14} fontWeight="700" color="var(--white)" mt={4}>
                          $149–$249 (+25% Rebate)
                        </Text>
                      </View>

                      <View p={12} bg="rgba(255, 255, 255, 0.03)" rounded="var(--radius-md)" borderWidth={1} borderColor="rgba(255, 255, 255, 0.06)">
                        <Text fontSize={11} fontFamily="$mono" color="rgba(255, 255, 255, 0.5)">
                          {comp.name} FORMAT
                        </Text>
                        <Text fontSize={13} color="rgba(255, 255, 255, 0.8)" mt={4} numberOfLines={2}>
                          {comp.format}
                        </Text>
                      </View>

                      <View p={12} bg="rgba(16, 185, 129, 0.06)" rounded="var(--radius-md)" borderWidth={1} borderColor="rgba(16, 185, 129, 0.2)">
                        <Text fontSize={11} fontFamily="$mono" color="var(--emerald-400)">
                          HANZO ENVIRONMENT
                        </Text>
                        <Text fontSize={13} color="var(--white)" fontWeight="600" mt={4}>
                          Hanzo Visor pods + Dev Sandboxes
                        </Text>
                      </View>
                    </Grid>

                    {/* Verdict */}
                    <Box
                      p={14}
                      rounded="var(--radius-md)"
                      bg="rgba(255, 255, 255, 0.02)"
                      borderLeftWidth={3}
                      borderColor="var(--emerald-400)"
                    >
                      <Text fontSize={13} color="rgba(255, 255, 255, 0.8)" lineHeight={20} fontStyle="italic">
                        &ldquo;{comp.verdict}&rdquo;
                      </Text>
                    </Box>
                  </YStack>
                </Card>

                {/* Two Column Head-to-Head Breakdown */}
                <Grid columns={{ min: 360, max: 2 }} gap={20}>
                  {/* Where Competitor Falls Short */}
                  <Card
                    p={24}
                    bg="#0c0707"
                    borderWidth={1}
                    borderColor="rgba(239, 68, 68, 0.25)"
                  >
                    <YStack gap={16}>
                      <XStack items="center" gap={8}>
                        <XCircle size={18} color="var(--red-400)" />
                        <Text fontSize={16} fontWeight="700" color="var(--white)">
                          Where {comp.name} Falls Short
                        </Text>
                      </XStack>
                      <Text fontSize={12} color="rgba(255, 255, 255, 0.5)">
                        Architectural limitations observed by production engineering leads:
                      </Text>
                      <YStack gap={12}>
                        {comp.flaws.map((flaw, idx) => (
                          <XStack key={idx} items="flex-start" gap={10}>
                            <XCircle size={14} color="var(--red-400)" style={{ marginTop: 3, flexShrink: 0 }} />
                            <Text fontSize={13} color="rgba(255, 255, 255, 0.75)" lineHeight={19}>
                              {flaw}
                            </Text>
                          </XStack>
                        ))}
                      </YStack>
                    </YStack>
                  </Card>

                  {/* How Hanzo Outperforms */}
                  <Card
                    p={24}
                    bg="#040c06"
                    borderWidth={1}
                    borderColor="rgba(16, 185, 129, 0.3)"
                  >
                    <YStack gap={16}>
                      <XStack items="center" gap={8}>
                        <CheckCircle2 size={18} color="var(--emerald-400)" />
                        <Text fontSize={16} fontWeight="700" color="var(--white)">
                          How Hanzo Outperforms
                        </Text>
                      </XStack>
                      <Text fontSize={12} color="rgba(255, 255, 255, 0.5)">
                        Production-grade systems engineering capabilities built into the curriculum:
                      </Text>
                      <YStack gap={12}>
                        {comp.hanzoAdvantages.map((adv, idx) => (
                          <XStack key={idx} items="flex-start" gap={10}>
                            <CheckCircle2 size={14} color="var(--emerald-400)" style={{ marginTop: 3, flexShrink: 0 }} />
                            <Text fontSize={13} color="var(--white)" fontWeight="500" lineHeight={19}>
                              {adv}
                            </Text>
                          </XStack>
                        ))}
                      </YStack>
                    </YStack>
                  </Card>
                </Grid>

                {/* Direct Head-to-Head Specification Table */}
                <Box
                  borderWidth={1}
                  borderColor="rgba(255, 255, 255, 0.1)"
                  bg="#080808"
                  overflow="hidden"
                  style={{ borderRadius: '20px' }}
                >
                  <Box p={16} bg="var(--pure-black)" borderBottomWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
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
                              color="rgba(255, 255, 255, 0.55)"
                              width="37.5%"
                              $platform-web={{ display: 'table-cell' }}
                            >
                              <XStack items="center" gap={6}>
                                <XCircle size={13} color="var(--neutral-500)" style={{ flexShrink: 0 }} />
                                <Text fontSize={13} color="rgba(255, 255, 255, 0.6)">{m.legacyVal}</Text>
                              </XStack>
                            </Text>
                            <Text
                              render="td"
                              p={14}
                              fontSize={13}
                              color="var(--white)"
                              fontWeight="600"
                              width="37.5%"
                              bg="rgba(16, 185, 129, 0.04)"
                              $platform-web={{ display: 'table-cell' }}
                            >
                              <XStack items="center" gap={6}>
                                <CheckCircle2 size={14} color="var(--emerald-400)" style={{ flexShrink: 0 }} />
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

        {/* Career Trajectory Cards */}
        <Grid columns={{ min: 320, max: 3 }} gap={20}>
          <Card p={24} bg="#080808">
            <YStack gap={12}>
              <Briefcase size={22} color="var(--white)" />
              <Text fontSize={16} fontWeight="700" color="var(--white)">
                Senior Software Engineer → AI Systems Engineer
              </Text>
              <Text fontSize={13} color="rgba(255, 255, 255, 0.6)" lineHeight={20}>
                Move past frontend wrappers into core systems engineering. Master tree-sitter AST parsing,
                zero-copy ZAP IPC, and isolated Hanzo Visor execution pods to command top-tier compensation ($180k–$240k).
              </Text>
            </YStack>
          </Card>

          <Card p={24} bg="#080808">
            <YStack gap={12}>
              <TrendingUp size={22} color="var(--white)" />
              <Text fontSize={16} fontWeight="700" color="var(--white)">
                Full-Stack Engineer → Autonomous Agent Architect
              </Text>
              <Text fontSize={13} color="rgba(255, 255, 255, 0.6)" lineHeight={20}>
                Lead enterprise agent initiatives. Learn to architect multi-agent coordinator-executor swarms
                that resolve complex GitHub defects within strict micro-USD financial ceilings ($220k–$310k).
              </Text>
            </YStack>
          </Card>

          <Card p={24} bg="#080808">
            <YStack gap={12}>
              <ShieldCheck size={22} color="var(--white)" />
              <Text fontSize={16} fontWeight="700" color="var(--white)">
                Engineering Founder → CTO of AI-Native Venture
              </Text>
              <Text fontSize={13} color="rgba(255, 255, 255, 0.6)" lineHeight={20}>
                Deploy production-grade agentic products with zero runaway inference bills. Use native Gymnasium
                reinforcement learning and finite-state Kai decision loops to eliminate hallucinations.
              </Text>
            </YStack>
          </Card>
        </Grid>
      </Band>

      {/* ── 5. SIX PILLARS OF PRODUCTION RIGOR ── */}
      <Band id="pillars" pad={64} measure={1200} rule={true}>
        <Head
          eyebrow="Pedagogical Architecture"
          title="Engineered for software engineers. Not prompt hobbyists."
          lede="Every concept is grounded in systems engineering: zero-copy RPC, bounded memory state machines, reinforcement learning environments, and cryptographic credentials."
        />

        <Grid columns={{ min: 320, max: 3 }} gap={20}>
          <Card p={24} bg="#080808">
            <YStack gap={10}>
              <Scale size={22} color="var(--white)" />
              <Text fontSize={17} fontWeight="700" color="var(--white)">
                Automated CI Grading
              </Text>
              <Text fontSize={13} color="rgba(255, 255, 255, 0.6)" lineHeight={20}>
                Zero human subjectivity. Submissions are graded by isolated CI runners that clone your repository, inject breaking changes, and evaluate repair velocity and test pass rates.
              </Text>
            </YStack>
          </Card>

          <Card p={24} bg="#080808">
            <YStack gap={10}>
              <Coins size={22} color="var(--white)" />
              <Text fontSize={17} fontWeight="700" color="var(--white)">
                Integer Micro-USD Ceilings
              </Text>
              <Text fontSize={13} color="rgba(255, 255, 255, 0.6)" lineHeight={20}>
                Prevent runaway cloud bills. Learn to configure pre-call price quoting, in-band budget refusals, and sub-cent financial caps directly in your agent loop.
              </Text>
            </YStack>
          </Card>

          <Card p={24} bg="#080808">
            <YStack gap={10}>
              <Cpu size={22} color="var(--white)" />
              <Text fontSize={17} fontWeight="700" color="var(--white)">
                Zero-Token Decision Loops
              </Text>
              <Text fontSize={13} color="rgba(255, 255, 255, 0.6)" lineHeight={20}>
                Generate text only when generation is strictly required. Master finite-state control with Kai, evaluating tool calls and routing without paying for generation tokens.
              </Text>
            </YStack>
          </Card>

          <Card p={24} bg="#080808">
            <YStack gap={10}>
              <Zap size={22} color="var(--white)" />
              <Text fontSize={17} fontWeight="700" color="var(--white)">
                Zero-Copy ZAP Protocols
              </Text>
              <Text fontSize={13} color="rgba(255, 255, 255, 0.6)" lineHeight={20}>
                Replace 200ms JSON-RPC hops with Cap&rsquo;n Proto zero-copy serialization. Connect multi-agent swarms with microsecond inter-process latency and post-quantum encryption.
              </Text>
            </YStack>
          </Card>

          <Card p={24} bg="#080808">
            <YStack gap={10}>
              <Boxes size={22} color="var(--white)" />
              <Text fontSize={17} fontWeight="700" color="var(--white)">
                Native Gymnasium Environments
              </Text>
              <Text fontSize={13} color="rgba(255, 255, 255, 0.6)" lineHeight={20}>
                Model agent interactions as formal Markov Decision Processes (MDP). Train custom policy routers, write multi-objective reward functions, and run Zoo Gym fine-tuning.
              </Text>
            </YStack>
          </Card>

          <Card p={24} bg="#080808">
            <YStack gap={10}>
              <ShieldCheck size={22} color="var(--white)" />
              <Text fontSize={17} fontWeight="700" color="var(--white)">
                W3C Cryptographic Proof
              </Text>
              <Text fontSize={13} color="rgba(255, 255, 255, 0.6)" lineHeight={20}>
                Earn verifiable credentials signed by Hanzo Trust with immutable on-chain records and real-time verifiable GitHub SVG badges linking directly to your passing benchmark run.
              </Text>
            </YStack>
          </Card>
        </Grid>
      </Band>

      {/* ── 6. FREQUENTLY ASKED QUESTIONS ── */}
      <Band id="faqs" pad={64} measure={1080} rule={true}>
        <Head
          eyebrow="Frequently Asked Questions"
          title="Everything you need to know about Hanzo University"
          lede="Clear answers regarding our 25% compute rebate, automated cleanroom grading, hardware specifications, and credential verification."
        />

        <Grid columns={{ min: 380, max: 2 }} gap={20}>
          <Card p={24} bg="#080808" borderWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
            <YStack gap={8}>
              <Text fontSize={16} fontWeight="700" color="var(--white)">
                How does the 25% usage credit rebate work?
              </Text>
              <Text fontSize={13} color="rgba(255, 255, 255, 0.6)" lineHeight={20}>
                When you enroll in any course (e.g. $199 for ENG 100), exactly 25% of your payment rounded up to the nearest dollar ($50 USD) is deposited immediately into your Hanzo Cloud compute account. These credits never expire and can be used across Zen 6, Enso, Kai decision models, and Hanzo Visor sandbox container leases.
              </Text>
            </YStack>
          </Card>

          <Card p={24} bg="#080808" borderWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
            <YStack gap={8}>
              <Text fontSize={16} fontWeight="700" color="var(--white)">
                How are capstone projects graded and evaluated?
              </Text>
              <Text fontSize={13} color="rgba(255, 255, 255, 0.6)" lineHeight={20}>
                Grading is 100% objective and automated. An isolated Hanzo grader pod clones your repository in an ephemeral cleanroom, injects synthetic faults and breaking changes into test suites, and evaluates whether your agent can reproduce defects, synthesize syntax-safe AST diffs, and achieve test exit code 0 within budget.
              </Text>
            </YStack>
          </Card>

          <Card p={24} bg="#080808" borderWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
            <YStack gap={8}>
              <Text fontSize={16} fontWeight="700" color="var(--white)">
                Why do hiring managers value Hanzo credentials over AWS/Azure/Coursera?
              </Text>
              <Text fontSize={13} color="rgba(255, 255, 255, 0.6)" lineHeight={20}>
                Standard certifications test multiple-choice memorization about proprietary cloud consoles. Hanzo credentials prove hands-on software construction under real-world engineering constraints: multi-agent IPC latency, sandbox process isolation, SWE-bench problem resolution, and strict micro-USD financial ceilings.
              </Text>
            </YStack>
          </Card>

          <Card p={24} bg="#080808" borderWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
            <YStack gap={8}>
              <Text fontSize={16} fontWeight="700" color="var(--white)">
                What format are credentials issued in?
              </Text>
              <Text fontSize={13} color="rgba(255, 255, 255, 0.6)" lineHeight={20}>
                Graduates receive W3C Verifiable Credentials signed cryptographically by the Hanzo Trust Root (`did:hanzo:trust`) with immutable on-chain commitments. You also receive a dynamic SVG badge for your GitHub profile and resume that links directly to your verified passing CI telemetry.
              </Text>
            </YStack>
          </Card>

          <Card p={24} bg="#080808" borderWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
            <YStack gap={8}>
              <Text fontSize={16} fontWeight="700" color="var(--white)">
                Can I expense this course through my employer?
              </Text>
              <Text fontSize={13} color="rgba(255, 255, 255, 0.6)" lineHeight={20}>
                Yes. Upon enrollment, you receive an itemized VAT/tax receipt suitable for corporate continuing education and Learning &amp; Development (L&amp;D) reimbursement programs. For teams of 5 or more engineers, we provide pooled credit management and consolidated corporate invoicing.
              </Text>
            </YStack>
          </Card>

          <Card p={24} bg="#080808" borderWidth={1} borderColor="rgba(255, 255, 255, 0.08)">
            <YStack gap={8}>
              <Text fontSize={16} fontWeight="700" color="var(--white)">
                Do I need a high-end local GPU?
              </Text>
              <Text fontSize={13} color="rgba(255, 255, 255, 0.6)" lineHeight={20}>
                No. You can run all coursework either locally on your laptop CPU/Metal using quantized Zen builds (`zen6-flash`), or execute in Hanzo Cloud using your included 25% usage credits with zero local setup or hardware requirements.
              </Text>
            </YStack>
          </Card>
        </Grid>
      </Band>

      {/* ── 7. FINAL CALL TO ACTION ── */}
      <Band pad={64} measure={800} ground="var(--pure-black)" rule={true}>
        <YStack items="center" $platform-web={{ textAlign: 'center' }} gap={16}>
          <Eyebrow>Open Enrollment</Eyebrow>
          <Title quiet={false}>
            Ready to build systems that scale?
          </Title>
          <Lede>
            Enroll today to claim your 25% usage credit rebate and gain instant access to browser-based Hanzo Dev sandboxes.
          </Lede>
          <XStack justify="center" gap={12} mt={12} flexWrap="wrap">
            <Action href="#curriculum" fill>
              Enroll in a Course
            </Action>
            <Action href={SIGN_IN}>
              Sign in
            </Action>
            <Action href="/agentic-coding">
              View ENG 100 Syllabus
            </Action>
          </XStack>
        </YStack>
      </Band>
    </>
  )
}
