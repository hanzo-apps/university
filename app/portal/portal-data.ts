import type { UniversityCourse } from '../courses-data'

export interface CourseWorkspaceData {
  terminalPrompt: string
  initialHistory: string[]
  quickCommands: string[]
  commandOutputs: Record<string, string[]>
  graderTitle: string
  graderTasks: { task: string; cost: string; time: string; status: 'PASS' | 'RUNNING' | 'QUEUED' }[]
  codeInspectorTitle: string
  codeInspectorSubtitle: string
  codeInspectorDiff: { type: 'del' | 'add' | 'context'; text: string }[]
  codeInspectorValidation: string
  resourceBreakdown: { item: string; metric: string }[]
}

export const COURSE_PORTAL_DATA: Record<string, CourseWorkspaceData> = {
  'continuous-improvement': {
    terminalPrompt: 'student@hanzo-sandbox:~/auto-101$',
    initialHistory: [
      'student@hanzo-sandbox:~/auto-101$ hanzo experiment status',
      '[OK] Free AUTO 101 Sandbox Workspace active (hanzo.app/learn/continuous-improvement)',
      '[OK] Autopilot experiment harness connected with guardrail monitors',
      'student@hanzo-sandbox:~/auto-101$ python eval_bandit.py --arms 4 --guardrails strict',
      '============================= Experiment Run =============================',
      '[CAUSAL CHECK] Randomization balance verified (p=0.74, zero SRM detected)',
      '[BANDIT] Thompson Sampling allocation converged across 4 variants',
      '[GOODHART GUARD] Zero proxy-metric divergence detected on holdout retention',
      '[PROMOTION GATE] Canary passed all qualification criteria (exit code 0)',
      'student@hanzo-sandbox:~/auto-101$ _',
    ],
    quickCommands: [
      'python eval_bandit.py --arms 4 --guardrails strict',
      'hanzo experiment check-goodhart',
      'hanzo deploy canary --dry-run',
    ],
    commandOutputs: {
      'python eval_bandit.py --arms 4 --guardrails strict': [
        '[CAUSAL CHECK] Randomization balance verified (zero sample ratio mismatch).',
        '[BANDIT] Cumulative regret bounded; arm-3 selected at 95% credible interval.',
        '[PASS] Guardrail and statistical power checks passed (exit code 0).',
      ],
      'hanzo experiment check-goodhart': [
        '[GOODHART AUDIT] Comparing proxy reward against true downstream objective...',
        '  - Proxy correlation: 0.94 | Reward-hacking probe: 0 violations',
        '[PASS] Objective alignment verified.',
      ],
      'hanzo deploy canary --dry-run': [
        '[CANARY] Shadow traffic mirror: 0 schema errors, P99 within SLA budget.',
        '[GATE] Ready for automated promotion with instant rollback trigger armed.',
      ],
    },
    graderTitle: 'AUTO 101 Autopilot & Causal Guardrail Harness',
    graderTasks: [
      { task: 'experiment/randomization-srm-check', cost: 'Scoped Lab', time: '0.4s', status: 'PASS' },
      { task: 'causal/cuped-variance-reduction', cost: 'Scoped Lab', time: '0.6s', status: 'PASS' },
      { task: 'bandit/thompson-sampling-regret', cost: 'Scoped Lab', time: '0.9s', status: 'PASS' },
      { task: 'safety/goodhart-divergence-detector', cost: 'Scoped Lab', time: '0.5s', status: 'PASS' },
      { task: 'deploy/canary-qualification-gate', cost: 'Scoped Lab', time: '0.8s', status: 'PASS' },
    ],
    codeInspectorTitle: 'Goodhart Guardrail & Canary Promotion Gate',
    codeInspectorSubtitle: 'Preventing reward hacking by coupling proxy optimization to holdout causal guardrails',
    codeInspectorDiff: [
      { type: 'del', text: '- def should_promote(proxy_lift: float) -> bool:' },
      { type: 'del', text: '-     return proxy_lift > 0.02' },
      { type: 'add', text: '+ def should_promote(exp: ExperimentReport) -> bool:' },
      { type: 'add', text: '+     assert exp.srm_p_value > 0.01, "Sample ratio mismatch"' },
      { type: 'add', text: '+     assert exp.guardrail_delta >= 0.0, "Blocked: Goodhart regression"' },
      { type: 'add', text: '+     return exp.primary_ci_low > 0.0 and exp.canary_error_rate == 0.0' },
    ],
    codeInspectorValidation: 'Experiment invariants verified: zero SRM · zero guardrail regressions · exit code 0',
    resourceBreakdown: [
      { item: 'AUTO 101 Sandbox Workspace', metric: 'Included (Free)' },
      { item: 'Causal & Bandit Simulation Compute', metric: 'Scoped Starter Quota' },
      { item: 'AI Faculty Mentors (@Edu, @Sci, @Data)', metric: 'Included' },
    ],
  },

  'kai-training-decision-models': {
    terminalPrompt: 'student@hanzo-sandbox:~/kai-301$',
    initialHistory: [
      'student@hanzo-sandbox:~/kai-301$ hanzo capability status refund-eligibility',
      '[OK] Lab 01: Teach Kai your business — workspace initialized',
      '[OK] Temporal split ready: 70% train / 15% calibration / 15% holdout',
      'student@hanzo-sandbox:~/kai-301$ curl -s -X POST https://api.hanzo.ai/v1/capabilities/refund-eligibility/train',
      '[JOB] cap_train_01J9K: calibrated_ce objective queued -> RUNNING -> COMPLETED',
      '[CALIBRATION] Post-temperature ECE: 0.014 (target <= 0.020) | P99: 19ms',
      '[SHADOW] 100% schema valid | Abstention band: [0.42, 0.58] routed to human review',
      'student@hanzo-sandbox:~/kai-301$ _',
    ],
    quickCommands: [
      'hanzo eval run refund-eligibility --split test',
      'hanzo eval calibrate refund-eligibility --target-ece 0.02',
      'hanzo deploy promote refund-eligibility --gate ece<=0.02',
    ],
    commandOutputs: {
      'hanzo eval run refund-eligibility --split test': [
        '[KAI EVAL] Holdout macro-F1: 0.946 (+14.2 pts vs zero-shot baseline)',
        '[LATENCY] P50: 8.4ms | P99: 18.7ms | Output tokens generated: 0',
        '[PASS] All slice regressions clear.',
      ],
      'hanzo eval calibrate refund-eligibility --target-ece 0.02': [
        '[CALIBRATION] Fitted temperature T=1.18 on calibration split.',
        '[METRIC] Pre-cal ECE: 0.061 -> Post-cal ECE: 0.014 (PASS <= 0.020).',
      ],
      'hanzo deploy promote refund-eligibility --gate ece<=0.02': [
        '[GATE] ECE=0.014 <= 0.020 ✓ | P99=18.7ms <= 35ms ✓ | Schema errors=0 ✓',
        '[PROMOTED] Capability refund-eligibility v2 active on /v1/decisions.',
      ],
    },
    graderTitle: 'KAI 301 Lab 01 Verification Harness (/v1/capabilities/{name}/train)',
    graderTasks: [
      { task: 'lab01/schema-and-temporal-split', cost: 'Scoped Lab', time: '0.5s', status: 'PASS' },
      { task: 'lab01/post-v1-capabilities-train-job', cost: 'Scoped Lab', time: '2.1s', status: 'PASS' },
      { task: 'lab01/hard-negative-slice-audit', cost: 'Scoped Lab', time: '0.9s', status: 'PASS' },
      { task: 'lab01/temperature-calibration-ece', cost: 'Scoped Lab', time: '0.6s', status: 'PASS' },
      { task: 'lab01/shadow-deploy-and-promote', cost: 'Scoped Lab', time: '1.1s', status: 'PASS' },
    ],
    codeInspectorTitle: 'Capability Training Manifest & Calibration Gate',
    codeInspectorSubtitle: 'Training a calibrated business decision model on POST /v1/capabilities/{name}/train',
    codeInspectorDiff: [
      { type: 'del', text: '- response = llm.complete(f"Should we refund? {ticket}")' },
      { type: 'add', text: '+ job = hanzo.post("/v1/capabilities/refund-eligibility/train", {' },
      { type: 'add', text: '+     "dataset": "refund-eligibility:train", "objective": "calibrated_ce"' },
      { type: 'add', text: '+ })' },
      { type: 'add', text: '+ decision = hanzo.post("/v1/decisions", {"capability": "refund-eligibility", "input": ticket})' },
    ],
    codeInspectorValidation: 'Calibration ECE 0.014 <= 0.020 · Zero output tokens · Strict schema verified',
    resourceBreakdown: [
      { item: 'Capability Training Jobs (/v1/capabilities/{name}/train)', metric: 'Scoped Lab Allocation' },
      { item: 'Calibration & Shadow Eval Runs', metric: 'Included in Lab' },
      { item: 'AI Faculty Mentors (@Edu, @Dev, @Data, @QA)', metric: 'Included' },
    ],
  },

  'agentic-coding': {
    terminalPrompt: 'student@hanzo-sandbox:~/eng-100$',
    initialHistory: [
      'student@hanzo-sandbox:~/eng-100$ hanzo dev status',
      '[OK] Hanzo Visor microVM sandbox lease active',
      '[OK] Zen coding model connected via ZAP RPC',
      'student@hanzo-sandbox:~/eng-100$ pytest -v tests/test_agent.py',
      'tests/test_agent.py::test_ast_symbol_resolution PASSED                   [ 25%]',
      'tests/test_agent.py::test_zap_zerocopy_serialization PASSED             [ 50%]',
      'tests/test_agent.py::test_visor_sandboxed_reproduction PASSED            [ 75%]',
      'tests/test_agent.py::test_kai_zerotoken_decision_checkpoint PASSED       [100%]',
      '============================== 4 passed in 0.42s ===============================',
      'student@hanzo-sandbox:~/eng-100$ _',
    ],
    quickCommands: [
      'pytest -v tests/test_agent.py',
      'hanzo eval --benchmark code-repair',
      'hanzo dev diff',
    ],
    commandOutputs: {
      'pytest -v tests/test_agent.py': [
        'tests/test_agent.py::test_ast_symbol_resolution PASSED                   [ 25%]',
        'tests/test_agent.py::test_zap_zerocopy_serialization PASSED             [ 50%]',
        'tests/test_agent.py::test_visor_sandboxed_reproduction PASSED            [ 75%]',
        'tests/test_agent.py::test_kai_zerotoken_decision_checkpoint PASSED       [100%]',
        '[PASS] All laboratory unit tests verified in sandbox.',
      ],
      'hanzo eval --benchmark code-repair': [
        '[EVAL] Running sandboxed code-repair harness...',
        '  [1/3] ast-symbol-scout: Defect isolated -> PASS',
        '  [2/3] reproduction-test-gen: Minimal failing test synthesized -> PASS',
        '  [3/3] patch-verification: Zero syntax regressions, exit code 0 -> PASS',
        '[STATUS] Benchmark suite passed within micro-USD budget ceiling.',
      ],
      'hanzo dev diff': [
        '--- a/src/agent/synthesizer.py',
        '+++ b/src/agent/synthesizer.py',
        '-    def repair_ast(self, tree: ast.AST) -> str:',
        '+    def repair_ast(self, tree: ast.AST, budget_usd: float = 0.05) -> ast.AST:',
        '+        kai_check = self.evaluator.verify_state(tree, ceiling=budget_usd)',
        '+        assert kai_check.safe_to_execute, "Refusing execution: budget violation"',
        '[DIFF VERIFIED] 0 syntax regressions, AST parse tree valid.',
      ],
    },
    graderTitle: 'Sandboxed Code-Repair Automated Evaluation Harness',
    graderTasks: [
      { task: 'sandbox/visor-isolation-check', cost: 'Scoped Lab', time: '0.8s', status: 'PASS' },
      { task: 'ast/tree-sitter-symbol-scout', cost: 'Scoped Lab', time: '1.1s', status: 'PASS' },
      { task: 'repair/minimal-repro-synthesis', cost: 'Scoped Lab', time: '1.4s', status: 'PASS' },
      { task: 'kai/budget-ceiling-enforcement', cost: 'Scoped Lab', time: '0.5s', status: 'PASS' },
      { task: 'swarm/coordinator-worker-merge', cost: 'Scoped Lab', time: '1.8s', status: 'PASS' },
    ],
    codeInspectorTitle: 'AST Diff Inspector: Verified Zero Syntax Regressions',
    codeInspectorSubtitle: 'Tree-sitter syntax validation and micro-USD economic guardrails',
    codeInspectorDiff: [
      { type: 'del', text: '- def repair_ast(self, tree: ast.AST) -> str:' },
      { type: 'add', text: '+ def repair_ast(self, tree: ast.AST, budget_usd: float = 0.05) -> ast.AST:' },
      { type: 'context', text: '      """Generates syntax-safe diff with zero syntax regressions."""' },
      { type: 'add', text: '+     kai_check = self.evaluator.verify_state(tree, ceiling=budget_usd)' },
      { type: 'add', text: '+     assert kai_check.safe_to_execute, "Refusing execution: budget violation"' },
    ],
    codeInspectorValidation: 'Tree-sitter AST validation: 0 errors · 0 regressions · Exit Code 0',
    resourceBreakdown: [
      { item: 'Hanzo Visor Sandbox Pods', metric: 'Scoped Lab Allocation' },
      { item: 'Zen Coding Inference Quota', metric: 'Scoped Lab Allocation' },
      { item: 'AI Faculty Mentors (@Dev, @QA, @Doc)', metric: 'Included' },
    ],
  },

  'build-your-ai-company': {
    terminalPrompt: 'student@hanzo-sandbox:~/ent-401$',
    initialHistory: [
      'student@hanzo-sandbox:~/ent-401$ hanzo company doctor',
      '[OK] White-label IAM domain & tenant isolation verified',
      '[OK] Custom Kai capability + Zen endpoint deployed behind /v1/ gateway',
      '[OK] Metered billing checkout & entitlement webhooks passing integration tests',
      'student@hanzo-sandbox:~/ent-401$ _',
    ],
    quickCommands: [
      'hanzo company doctor',
      'hanzo billing simulate-usage --tenants 25',
      'hanzo eval --benchmark founder-launch',
    ],
    commandOutputs: {
      'hanzo company doctor': [
        '[OK] Custom domain TLS + IAM OIDC callback verified.',
        '[OK] Multi-tenant Base isolation tested across 2 orgs (0 cross-tenant leaks).',
        '[OK] Gross margin simulator: 78.4% at projected token volume.',
      ],
      'hanzo billing simulate-usage --tenants 25': [
        '[BILLING] Simulated 25 active tenants across Free, Pro, and Usage-Metered plans.',
        '[CIRCUIT BREAKER] Overage guard enforced cleanly on test limit breach.',
        '[PASS] Metering reconciliation matches ledger 100%.',
      ],
      'hanzo eval --benchmark founder-launch': [
        '[LAUNCH AUDIT] Auth ✓ | Custom Capability API ✓ | Billing Checkout ✓ | Docs & Funnel ✓',
        '[PASS] Ready for ENT 401 Live Product Capstone Review.',
      ],
    },
    graderTitle: 'ENT 401 Live AI Company Launch Readiness Harness',
    graderTasks: [
      { task: 'white-label/iam-tenant-isolation', cost: 'Scoped Lab', time: '0.7s', status: 'PASS' },
      { task: 'model/vertical-capability-sla', cost: 'Scoped Lab', time: '1.0s', status: 'PASS' },
      { task: 'api/metered-v1-gateway-keys', cost: 'Scoped Lab', time: '0.6s', status: 'PASS' },
      { task: 'billing/checkout-entitlement-sync', cost: 'Scoped Lab', time: '0.9s', status: 'PASS' },
      { task: 'gtm/funnel-telemetry-guardrails', cost: 'Scoped Lab', time: '0.5s', status: 'PASS' },
    ],
    codeInspectorTitle: 'Multi-Tenant Entitlement & Metered API Middleware',
    codeInspectorSubtitle: 'Enforcing tenant isolation, plan entitlements, and real-time usage metering',
    codeInspectorDiff: [
      { type: 'del', text: '- async function handleRequest(req) { return callModel(req.body) }' },
      { type: 'add', text: '+ async function handleRequest(req) {' },
      { type: 'add', text: '+   const tenant = await iam.verifyTenantToken(req.headers.authorization)' },
      { type: 'add', text: '+   await billing.assertQuota(tenant.id, estimatedMicroUsd)' },
      { type: 'add', text: '+   return meteredGateway.invoke(tenant.id, req.body)' },
      { type: 'add', text: '+ }' },
    ],
    codeInspectorValidation: 'Zero cross-tenant data leaks · Metered billing reconciled · Launch checklist green',
    resourceBreakdown: [
      { item: 'Founder Launch Sandbox Environment', metric: 'Scoped Lab Allocation' },
      { item: 'Billing, IAM & API Test Harness', metric: 'Included in Lab' },
      { item: 'AI Faculty Mentors (@Edu, @Dev, @Lang, @Cyber)', metric: 'Included' },
    ],
  },
}

/** Build authentic workspace data for any of the 25 courses, using bespoke data when defined. */
export function getCourseWorkspaceData(course: UniversityCourse): CourseWorkspaceData {
  if (COURSE_PORTAL_DATA[course.slug]) {
    return COURSE_PORTAL_DATA[course.slug]
  }

  const slugDir = course.code.toLowerCase().replace(/\s+/g, '-')
  const prompt = `student@hanzo-sandbox:~/${slugDir}$`
  const cmd1 = `hanzo lab status --course ${course.slug}`
  const cmd2 = `hanzo eval --course ${course.slug} --verify`
  const cmd3 = `hanzo capstone check --artifact ${course.credential.toLowerCase()}`

  return {
    terminalPrompt: prompt,
    initialHistory: [
      `${prompt} ${cmd1}`,
      `[OK] Sandbox workspace ready for ${course.code}: ${course.title}`,
      `[OK] Interactive workspace URL: ${course.learnWorkspaceUrl}`,
      `[OK] AI Faculty Mentors online: ${course.facultyBots.join(', ')}`,
      `[OK] Scoped lab compute active (${course.isFree ? 'Free Starter Quota' : 'Aligned to Course Labs'})`,
      `${prompt} _`,
    ],
    quickCommands: [cmd1, cmd2, cmd3],
    commandOutputs: {
      [cmd1]: [
        `[STATUS] Course: ${course.code} (${course.credential}) · Level: ${course.level}`,
        `[MODULES] ${course.syllabus.length} structured modules loaded with automated verification suites.`,
        `[CAPSTONE] Target artifact: ${course.capstoneArtifact}`,
      ],
      [cmd2]: [
        `[EVAL] Running automated cleanroom checks for ${course.code}...`,
        ...course.syllabus.map((w, i) => `  [${i + 1}/${course.syllabus.length}] ${w.code}: ${w.title} -> PASS`),
        `[STATUS] All lab invariants verified (exit code 0).`,
      ],
      [cmd3]: [
        `[CAPSTONE] Auditing live artifact: ${course.capstoneArtifact}`,
        `[PROOF] Ready for W3C Verifiable Credential issuance (${course.credential}).`,
      ],
    },
    graderTitle: `${course.code} Cleanroom Evaluation Harness`,
    graderTasks: course.syllabus.map((w) => ({
      task: `${w.code.toLowerCase().replace(/\s+/g, '-')}/${w.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 34)}`,
      cost: 'Scoped Lab',
      time: '0.9s',
      status: 'PASS' as const,
    })),
    codeInspectorTitle: `${course.code} Architecture & Verification Guard`,
    codeInspectorSubtitle: course.capstoneArtifact,
    codeInspectorDiff: [
      { type: 'del', text: `- # Baseline unverified workflow for ${course.code}` },
      { type: 'add', text: `+ # Verified ${course.code} pipeline (${course.credential})` },
      { type: 'add', text: `+ result = workspace.run_verified("${course.slug}", guardrails="strict")` },
      { type: 'add', text: `+ assert result.exit_code == 0, "Verification harness failed"` },
    ],
    codeInspectorValidation: `${course.code} verification checks passing · Ready for capstone audit`,
    resourceBreakdown: [
      { item: `${course.code} Interactive Sandbox`, metric: 'hanzo.app/learn' },
      { item: 'Lab Compute Allocation', metric: course.isFree ? 'Free Starter Quota' : 'Scoped to Lab Requirements' },
      { item: `AI Faculty (${course.facultyBots.join(', ')})`, metric: 'Included' },
    ],
  }
}
