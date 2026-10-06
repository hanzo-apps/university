'use client'

import React, { useState } from 'react'
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
} from 'lucide-react'
import { UNIVERSITY_COURSES, type UniversityCourse } from '../courses-data'

export default function StudentPortalPage() {
  const [selectedCourseSlug, setSelectedCourseSlug] = useState<string>('agentic-coding')
  const [activeTab, setActiveTab] = useState<'terminal' | 'ast' | 'grader' | 'metering'>('terminal')
  const [activeWeekIndex, setActiveWeekIndex] = useState<number>(2) // Week 3 in progress
  const [terminalHistory, setTerminalHistory] = useState<string[]>([
    'alex@hanzo-sandbox:~/swe-bench-agent$ hanzo dev status',
    '[OK] gVisor runsc sandbox lease active (id: pod-gvs-uswest2-01)',
    '[OK] Zen 6 (27.3B) inference endpoint connected via ZAP RPC (latency: 1.4ms)',
    '[OK] Compute credit balance: $37.55 USD remaining of $50.00 deposit',
    'alex@hanzo-sandbox:~/swe-bench-agent$ pytest -v tests/test_agent.py',
    '============================= test session starts =============================',
    'platform linux -- Python 3.12.3, pytest-8.1.1, pluggy-1.4.0',
    'tests/test_agent.py::test_ast_symbol_resolution PASSED                   [ 25%]',
    'tests/test_agent.py::test_zap_zerocopy_serialization PASSED             [ 50%]',
    'tests/test_agent.py::test_gvisor_sandboxed_reproduction PASSED           [ 75%]',
    'tests/test_agent.py::test_kai_zerotoken_decision_checkpoint PASSED       [100%]',
    '============================== 4 passed in 0.42s ===============================',
    'alex@hanzo-sandbox:~/swe-bench-agent$ _',
  ])
  const [isRunningCommand, setIsRunningCommand] = useState(false)
  const [showCredentialModal, setShowCredentialModal] = useState(false)

  const activeCourse: UniversityCourse =
    UNIVERSITY_COURSES.find((c) => c.slug === selectedCourseSlug) || UNIVERSITY_COURSES[0]

  const executeCommand = (cmd: string) => {
    setIsRunningCommand(true)
    setTerminalHistory((prev) => [...prev, `alex@hanzo-sandbox:~/swe-bench-agent$ ${cmd}`])

    setTimeout(() => {
      let output: string[] = []
      if (cmd === 'zen eval --benchmark swe-bench') {
        output = [
          '[HANZO EVAL] Running SWE-bench Lite benchmark evaluation harness...',
          '  [1/5] django/django-14999: AST diff generated (cost: $0.038) -> TEST PASSED [100%]',
          '  [2/5] sympy/sympy-18057: Symbol extraction verified (cost: $0.041) -> TEST PASSED [100%]',
          '  [3/5] scikit-learn/scikit-learn-14092: Reproducing bug in gVisor -> TEST PASSED [100%]',
          '  [4/5] pytest-dev/pytest-7432: Zero syntax regressions -> TEST PASSED [100%]',
          '  [5/5] astropy/astropy-12907: Synthesizing patch -> TEST PASSED [100%]',
          '--------------------------------------------------------------------------------',
          '[SUMMARY] 5 of 5 SWE-bench benchmark issues resolved autonomously.',
          '[ECONOMICS] Average compute cost per patch: $0.042 USD (Budget cap: $0.50).',
          '[STATUS] 100% Test Pass Rate. Verification verified by Kai Decision Model.',
        ]
      } else if (cmd === 'hanzo dev diff') {
        output = [
          '--- a/src/agent/synthesizer.py',
          '+++ b/src/agent/synthesizer.py',
          '@@ -42,7 +42,7 @@ class CodePatchSynthesizer:',
          '-    def repair_ast(self, tree: ast.AST) -> str:',
          '+    def repair_ast(self, tree: ast.AST, budget_usd: float = 0.05) -> ast.AST:',
          '         """Generates syntax-safe diff with zero syntax regressions."""',
          '+        kai_check = self.evaluator.verify_state(tree, ceiling=budget_usd)',
          '+        assert kai_check.safe_to_execute, "Refusing execution: budget violation"',
        ]
      } else {
        output = [
          '[COMMAND EXECUTED] Task processed in ephemeral gVisor container (exit code 0).',
        ]
      }
      setTerminalHistory((prev) => [...prev, ...output, 'alex@hanzo-sandbox:~/swe-bench-agent$ _'])
      setIsRunningCommand(false)
    }, 600)
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
        $platform-web={{ zIndex: 50 }}
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
              <ShieldCheck size={14} color="var(--white)" />
              <Text fontSize="$1" color="var(--muted-foreground)">
                Student ID:
              </Text>
              <Text fontSize="$1" fontWeight="600" color="var(--white)" fontFamily="$mono">
                hz-stu-9821a
              </Text>
            </XStack>

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
                  View Credential
                </Text>
              </XStack>
            </Action>
          </XStack>
        </XStack>
      </Box>

      {/* ── Active Course Selector Strip ── */}
      <Box borderBottomWidth={1} borderColor="var(--border)" bg="var(--card)" px="$6" py="$2">
        <XStack items="center" gap="$2" overflow="scroll" flexWrap="nowrap">
          <Text fontSize="$1" color="var(--muted-foreground)" pr="$2" fontFamily="$mono">
            COURSES:
          </Text>
          {UNIVERSITY_COURSES.map((c) => (
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
            </Box>
          ))}
        </XStack>
      </Box>

      {/* ── Main Workspace Dashboard ── */}
      <Band pad={40} measure={1280}>
        {/* Welcome Notification Banner */}
        <Box
          p="$4"
          mb="$6"
          rounded="var(--radius-lg)"
          bg="var(--pure-black)"
          borderWidth={1}
          borderColor="var(--emerald-850)"
        >
          <XStack items="center" justify="space-between" flexWrap="wrap" gap="$4">
            <XStack items="center" gap="$3">
              <Box
                p="$2"
                rounded="var(--radius-md)"
                bg="$panel"
                $platform-web={{ backgroundColor: 'color-mix(in srgb, var(--emerald-500) 20%, transparent)' }}
              >
                <CheckCircle2 size={20} color="var(--emerald-400)" />
              </Box>
              <YStack gap="$1">
                <XStack items="center" gap="$2">
                  <Text fontSize="$2" fontWeight="700" color="var(--white)">
                    Enrolled & Active: {activeCourse.code} — {activeCourse.title}
                  </Text>
                  <Chip px={8} py={2} fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">
                    DAY 1 DEPOSIT ACTIVE
                  </Chip>
                </XStack>
                <Text fontSize="$1" color="var(--muted-foreground)">
                  Your 25% compute credit rebate (${activeCourse.rebateCredits}.00 USD) was deposited into your Hanzo Cloud account. All laboratory sandboxes are provisioned and accessible below.
                </Text>
              </YStack>
            </XStack>

            <XStack items="center" gap="$2">
              <Link
                href={`/${activeCourse.slug}`}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid var(--border)',
                  color: 'var(--white)',
                  fontSize: '12px',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                <BookOpen size={13} />
                Course Syllabus
              </Link>
              <Action
                render="button"
                onClick={() => executeCommand('zen eval --benchmark swe-bench')}
                disabled={isRunningCommand}
                px={12}
                py={6}
                $platform-web={{ fontSize: '12px' }}
              >
                Run Autograder →
              </Action>
            </XStack>
          </XStack>
        </Box>

        {/* ── Two-Column Layout: Left (Live Workspace / Terminal), Right (Curriculum & Tasks) ── */}
        <Grid columns={{ min: 420, max: 2 }} gap={24}>
          {/* LEFT: Live Laboratory Pod & Workstation */}
          <YStack gap="$4">
            <Card p={0} overflow="hidden" bg="var(--pure-black)" borderColor="var(--border)">
              {/* Terminal Header */}
              <XStack
                items="center"
                justify="space-between"
                p="$3"
                px="$4"
                borderBottomWidth={1}
                borderColor="var(--border)"
                bg="var(--card)"
              >
                <XStack items="center" gap="$3">
                  <XStack gap="$1">
                    <Box width={10} height={10} rounded={9999} bg="var(--red-500)" />
                    <Box width={10} height={10} rounded={9999} bg="var(--amber-500)" />
                    <Box width={10} height={10} rounded={9999} bg="var(--emerald-500)" />
                  </XStack>
                  <Text fontSize="$1" fontFamily="$mono" color="var(--white)" fontWeight="600">
                    gVisor Sandbox: pod-gvs-uswest2-01
                  </Text>
                  <Chip px={6} py={2} fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">
                    ONLINE
                  </Chip>
                </XStack>

                {/* Workspace Tabs */}
                <XStack items="center" gap="$1">
                  {(
                    [
                      ['terminal', 'Shell'],
                      ['ast', 'AST Diff'],
                      ['grader', 'Autograder'],
                      ['metering', 'Spend'],
                    ] as const
                  ).map(([tab, label]) => (
                    <Box
                      key={tab}
                      render="button"
                      onClick={() => setActiveTab(tab)}
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
                          line.startsWith('alex@')
                            ? 'var(--emerald-400)'
                            : line.includes('PASSED')
                            ? 'var(--emerald-300)'
                            : line.includes('[OK]')
                            ? 'var(--white)'
                            : 'var(--muted-foreground)'
                        }
                      >
                        {line}
                      </Text>
                    ))}
                  </Box>

                  {/* Quick Command Action Toolbar */}
                  <XStack
                    items="center"
                    gap="$2"
                    pt="$3"
                    borderTopWidth={1}
                    borderColor="var(--border)"
                    flexWrap="wrap"
                  >
                    <Text fontSize="$1" color="var(--muted-foreground)" fontFamily="$mono">
                      Quick Run:
                    </Text>
                    {[
                      'pytest -v tests/test_agent.py',
                      'zen eval --benchmark swe-bench',
                      'hanzo dev diff',
                    ].map((cmd) => (
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
                </YStack>
              )}

              {/* Tab Content 2: AST Diff Inspector */}
              {activeTab === 'ast' && (
                <YStack p="$4" bg="var(--pure-black)" minH={380}>
                  <Text fontSize="$1" color="var(--muted-foreground)" mb="$2" fontFamily="$mono">
                    AST Diff Inspector: Verified zero syntax regressions & budget bounds
                  </Text>
                  <Box
                    p="$3"
                    rounded="var(--radius-md)"
                    bg="var(--card)"
                    borderWidth={1}
                    borderColor="var(--border)"
                    $platform-web={{ whiteSpace: 'pre-wrap' }}
                  >
                    <Text color="var(--red-400)">- def repair_ast(self, tree: ast.AST) -&gt; str:</Text>
                    <Text color="var(--emerald-400)">+ def repair_ast(self, tree: ast.AST, budget_usd: float = 0.05) -&gt; ast.AST:</Text>
                    <Text color="var(--white-70)">      &quot;&quot;&quot;Generates syntax-safe diff with zero syntax regressions.&quot;&quot;&quot;</Text>
                    <Text color="var(--emerald-400)">+     kai_check = self.evaluator.verify_state(tree, ceiling=budget_usd)</Text>
                    <Text color="var(--emerald-400)">+     assert kai_check.safe_to_execute, &quot;Refusing execution: budget violation&quot;</Text>
                  </Box>
                  <XStack items="center" gap="$2" mt="$3">
                    <CheckCircle2 size={14} color="var(--emerald-400)" />
                    <Text fontSize="$1" color="var(--emerald-300)" fontWeight="600">
                      AST Tree-Sitter validation: 0 errors · 0 unused symbols · Exit Code 0
                    </Text>
                  </XStack>
                </YStack>
              )}

              {/* Tab Content 3: Autograder Logs */}
              {activeTab === 'grader' && (
                <YStack p="$4" bg="var(--pure-black)" minH={380} gap="$3">
                  <Text fontSize="$2" fontWeight="700" color="var(--white)">
                    SWE-bench Automated Evaluation Harness
                  </Text>
                  {[
                    { task: 'django/django-14999', cost: '$0.038', time: '1.2s', status: 'PASS' },
                    { task: 'sympy/sympy-18057', cost: '$0.041', time: '1.4s', status: 'PASS' },
                    { task: 'scikit-learn/scikit-learn-14092', cost: '$0.044', time: '1.8s', status: 'PASS' },
                    { task: 'pytest-dev/pytest-7432', cost: '$0.029', time: '0.9s', status: 'PASS' },
                    { task: 'astropy/astropy-12907', cost: '$0.052', time: '2.1s', status: 'PASS' },
                  ].map((row) => (
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
                      <Text fontSize="$4" fontWeight="800" color="var(--emerald-400)">$37.55 USD</Text>
                    </YStack>
                  </Grid>

                  <YStack gap="$2">
                    <Text fontSize="$1" color="var(--muted-foreground)">Resource Usage Breakdown:</Text>
                    <XStack justify="space-between">
                      <Text fontSize="$1" color="var(--white)">Zen 6 (27.3B) Inference (142k tokens)</Text>
                      <Text fontSize="$1" color="var(--muted-foreground)" fontFamily="$mono">$7.10</Text>
                    </XStack>
                    <XStack justify="space-between">
                      <Text fontSize="$1" color="var(--white)">gVisor Pod Execution (18.4 runtime hrs)</Text>
                      <Text fontSize="$1" color="var(--muted-foreground)" fontFamily="$mono">$4.60</Text>
                    </XStack>
                    <XStack justify="space-between">
                      <Text fontSize="$1" color="var(--white)">ZAP Zero-Copy RPC Channels</Text>
                      <Text fontSize="$1" color="var(--muted-foreground)" fontFamily="$mono">$0.75</Text>
                    </XStack>
                  </YStack>
                </YStack>
              )}
            </Card>

            {/* Sandbox Container Specifications */}
            <Card p={16} bg="$panel">
              <XStack items="center" justify="space-between" flexWrap="wrap" gap="$3">
                <XStack items="center" gap="$3">
                  <Cpu size={16} color="var(--white)" />
                  <YStack>
                    <Text fontSize="$1" fontWeight="600" color="var(--white)">
                      Hardware Leases: 4 vCPU · 16 GB RAM · Apple Silicon Metal / CUDA L4
                    </Text>
                    <Text fontSize="$1" color="var(--muted-foreground)">
                      Sandboxed under Google gVisor runsc kernel virtualization in region us-west-2
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
            <Card p={20} bg="$panel">
              <XStack items="center" justify="space-between" mb="$4">
                <YStack gap="$1">
                  <Text fontSize="$3" fontWeight="700" color="var(--white)">
                    Course Modules & Progress
                  </Text>
                  <Text fontSize="$1" color="var(--muted-foreground)">
                    Complete all 4 laboratory modules to qualify for HACE Credential Defense
                  </Text>
                </YStack>
                <Chip px={10} py={3} fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">
                  75% COMPLETED
                </Chip>
              </XStack>

              {/* Progress Bar */}
              <Box height={6} rounded={9999} bg="var(--neutral-800)" overflow="hidden" mb="$4">
                <Box height="100%" width="75%" bg="var(--emerald-400)" />
              </Box>

              {/* Week Modules List */}
              <YStack gap="$3">
                {activeCourse.syllabus.map((week, idx) => {
                  const isCompleted = idx < 2
                  const isActive = idx === 2
                  const isLocked = idx > 2

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
                          {isCompleted ? 'COMPLETED' : isActive ? 'IN PROGRESS' : 'UP NEXT'}
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

                          <YStack gap="$1">
                            <Text fontSize="$1" fontWeight="600" color="var(--white)">
                              Lectures & Topics:
                            </Text>
                            {week.lectures.map((lec, lIdx) => (
                              <XStack key={lIdx} items="center" gap="$2">
                                <Play size={10} color="var(--emerald-400)" />
                                <Text fontSize="$1" color="var(--muted-foreground)">
                                  {lec}
                                </Text>
                              </XStack>
                            ))}
                          </YStack>

                          <XStack items="center" justify="space-between" pt="$2">
                            <Text fontSize="$1" color="var(--emerald-400)" fontWeight="600">
                              Lab Assignment: Active in terminal above
                            </Text>
                            <Action
                              render="button"
                              onClick={() => executeCommand('pytest -v tests/test_agent.py')}
                              px={10}
                              py={5}
                              $platform-web={{ fontSize: '11px' }}
                            >
                              Submit Lab →
                            </Action>
                          </XStack>
                        </YStack>
                      )}
                    </Box>
                  )
                })}
              </YStack>
            </Card>

            {/* Capstone Project Defense Card */}
            <Card
              p={20}
              bg="var(--pure-black)"
              borderColor="var(--emerald-850)"
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
                  <Chip px={8} py={2} fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">
                    READY FOR DEFENSE
                  </Chip>
                </XStack>
                <Text fontSize="$1" color="var(--muted-foreground)" lineHeight="$2">
                  {activeCourse.capstone} Submit your repository for automated gVisor autograder verification.
                </Text>
                <XStack items="center" gap="$3" pt="$1">
                  <Action
                    render="button"
                    onClick={() => setShowCredentialModal(true)}
                    fill
                  >
                    Claim & Preview {activeCourse.credential} Credential →
                  </Action>
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
          $platform-web={{ backdropFilter: 'blur(8px)', zIndex: 100 }}
        >
          <Box
            width="100%"
            maxW={680}
            bg="var(--pure-black)"
            rounded="var(--radius-2xl)"
            borderWidth={1}
            borderColor="var(--neutral-700)"
            p="$6"
            position="relative"
          >
            {/* Modal Header */}
            <XStack items="center" justify="space-between" mb="$4">
              <XStack items="center" gap="$2">
                <Award size={20} color="var(--emerald-400)" />
                <Text fontSize="$3" fontWeight="700" color="var(--white)">
                  W3C Verifiable Credential Issued
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
                width={120}
                height={120}
                rounded={9999}
                $platform-web={{ backgroundColor: 'color-mix(in srgb, var(--emerald-500) 10%, transparent)' }}
                pointerEvents="none"
              />

              <XStack items="center" justify="space-between">
                <Text fontSize="$1" fontFamily="$mono" color="var(--muted-foreground)">
                  HANZO UNIVERSITY · RESEARCH FOUNDATION
                </Text>
                <Chip px={8} py={2} fontSize="$1" fontFamily="$mono" color="var(--emerald-400)">
                  VERIFIED ON-CHAIN
                </Chip>
              </XStack>

              <YStack gap="$1" my="$2">
                <Text fontSize="$1" color="var(--muted-foreground)">
                  THIS CERTIFIES THAT
                </Text>
                <Text fontSize="$5" fontWeight="800" color="var(--white)">
                  Alex Chen
                </Text>
                <Text fontSize="$1" color="var(--muted-foreground)">
                  HAS SUCCESSFULLY MASTERED ALL ACADEMIC SPECIFICATIONS & DEFENDED THE CAPSTONE FOR
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
                  <Text color="var(--white)">did:hanzo:user:hz-stu-9821a</Text>
                </XStack>
                <XStack justify="space-between">
                  <Text color="var(--muted-foreground)">Issuer DID:</Text>
                  <Text color="var(--white)">did:hanzo:university:accreditation</Text>
                </XStack>
                <XStack justify="space-between">
                  <Text color="var(--muted-foreground)">Ed25519 Proof:</Text>
                  <Text color="var(--emerald-400)">0x7f4a8b1c...99e2e89b (VERIFIED)</Text>
                </XStack>
              </Box>

              <XStack items="center" justify="space-between" pt="$2">
                <YStack>
                  <Text fontSize="$1" color="var(--muted-foreground)">Accreditation Officer</Text>
                  <Text fontSize="$1" fontWeight="600" color="var(--white)">{activeCourse.instructor.name}</Text>
                  <Text fontSize="$1" color="var(--muted-foreground)">{activeCourse.instructor.role}</Text>
                </YStack>

                <YStack items="flex-end">
                  <Text fontSize="$1" color="var(--muted-foreground)">Issue Date</Text>
                  <Text fontSize="$1" fontWeight="600" color="var(--white)">October 2026</Text>
                  <Text fontSize="$1" color="var(--emerald-400)">Tamper-Proof Proof v2.0</Text>
                </YStack>
              </XStack>
            </Box>

            {/* Modal Actions */}
            <XStack items="center" justify="space-between" mt="$4" flexWrap="wrap" gap="$3">
              <XStack items="center" gap="$2">
                <Box
                  render="button"
                  onClick={() => alert('W3C JSON-LD Credential copied to clipboard!')}
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
                  onClick={() => alert('PDF Certificate downloaded.')}
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
                  Download PDF
                </Box>
              </XStack>

              <Action
                render="button"
                onClick={() => setShowCredentialModal(false)}
                px={16}
                py={8}
                fill
              >
                Close & Return to Lab
              </Action>
            </XStack>
          </Box>
        </Box>
      )}
    </Box>
  )
}
