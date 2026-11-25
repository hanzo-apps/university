export type SchoolId =
  | 'foundation'
  | 'intelligence'
  | 'science'
  | 'cybersecurity'
  | 'business'

export type AIFacultyBotId =
  | '@Edu'
  | '@Sci'
  | '@Dev'
  | '@Cyber'
  | '@Data'
  | '@Doc'
  | '@QA'
  | '@Lang'

export interface AIFacultyBot {
  id: AIFacultyBotId
  name: string
  role: string
  specialty: string
}

export interface SchoolDefinition {
  id: SchoolId
  name: string
  shortName: string
  eyebrow: string
  discipline: string
  description: string
}

export interface DocLink {
  label: string
  href: string
  kind: 'quickstart' | 'guide' | 'reference'
}

export interface DetailedLabStep {
  step: number
  title: string
  endpoint?: string
  command?: string
  summary: string
}

export interface DetailedLab {
  code: string
  title: string
  subtitle: string
  endpoint?: string
  steps: DetailedLabStep[]
}

export interface CourseWeek {
  week: string
  code: string
  title: string
  summary: string
  lectures: string[]
  readings: string[]
  lab: string
}

export interface UniversityCourse {
  slug: string
  code: string
  title: string
  credential: string
  credentialFull: string
  school: SchoolId
  isFree?: boolean
  price: number
  duration: string
  level: string
  prerequisites: string
  summary: string
  capstone: string
  capstoneArtifact: string
  labComputeNote: string
  competencies: string[]
  planId: string
  featured?: boolean
  facultyBots: AIFacultyBotId[]
  docsLinks: DocLink[]
  learnWorkspaceUrl: string
  detailedLab?: DetailedLab
  syllabus: CourseWeek[]
}

export interface CertificationTrack {
  slug: string
  name: string
  credentialCode: string
  duration: string
  price: number
  courseCodes: string[]
  courseSlugs: string[]
  summary: string
  capstoneRequirement: string
  credentialType: 'Professional Certification' | 'Professional Fellowship (Non-Accredited)'
  planId: string
}

export interface AdventurePath {
  id: string
  goal: string
  architecture: string
  tagline: string
  summary: string
  csPrinciples: string[]
  freeCourseSlug: string
  primaryCourseSlug: string
  secondaryCourseSlug?: string
  guideLabel: string
  guideUrl: string
  trackSlug: string
  trackName: string
}

export interface PricingTier {
  id: string
  name: string
  price: string
  cadence: string
  highlight?: boolean
  description: string
  includes: string[]
  ctaLabel: string
  ctaHref: string
  external?: boolean
}

export interface CouponResult {
  valid: boolean
  code: string
  discountPercent?: number
  discountAmount: number
  originalPrice: number
  finalPrice: number
  message: string
}

export const DISCIPLINE_CHIPS = [
  'Intelligence Engineering',
  'Autonomous Science',
  'Cybersecurity',
  'Agentic Development',
  'Sovereign Infrastructure',
  'AI Entrepreneurship',
] as const

export const AI_FACULTY_BOTS: Record<AIFacultyBotId, AIFacultyBot> = {
  '@Edu': {
    id: '@Edu',
    name: 'Curriculum & Socratic Tutor',
    role: 'Learning Coach',
    specialty: 'Adaptive explanations, concept checks, and personalized study paths across all 25 courses.',
  },
  '@Sci': {
    id: '@Sci',
    name: 'Research & Experiment Advisor',
    role: 'Autonomous Science Faculty',
    specialty: 'Experimental design, hypothesis formulation, statistical rigor, and ablation planning.',
  },
  '@Dev': {
    id: '@Dev',
    name: 'Systems & Code Mentor',
    role: 'Engineering Faculty',
    specialty: 'Architecture reviews, AST debugging, ZAP RPC, training loops, and deployment pipelines.',
  },
  '@Cyber': {
    id: '@Cyber',
    name: 'Security & Red-Team Mentor',
    role: 'Cybersecurity Faculty',
    specialty: 'Threat modeling, prompt/tool injection defense, zero-trust isolation, and SecOps automation.',
  },
  '@Data': {
    id: '@Data',
    name: 'Data & Evaluation Specialist',
    role: 'Metrics & Causal Faculty',
    specialty: 'Dataset curation, causal inference, bandit evaluation, calibration, and reward diagnostics.',
  },
  '@Doc': {
    id: '@Doc',
    name: 'Specification & Architecture Librarian',
    role: 'Documentation Guide',
    specialty: 'Maps coursework directly to canonical docs.hanzo.ai APIs, OpenAPI specs, and reference guides.',
  },
  '@QA': {
    id: '@QA',
    name: 'Verification & Capstone Reviewer',
    role: 'Autograder Companion',
    specialty: 'Test harness verification, regression checks, latency/cost bounds, and capstone readiness.',
  },
  '@Lang': {
    id: '@Lang',
    name: 'Technical Writing & Launch Coach',
    role: 'Communications & GTM Faculty',
    specialty: 'Paper writeups, technical positioning, customer documentation, and AI product launches.',
  },
}

export const SCHOOLS: SchoolDefinition[] = [
  {
    id: 'foundation',
    name: 'Free Foundational Course',
    shortName: 'Free Foundation',
    eyebrow: 'START HERE · OPEN ACCESS',
    discipline: 'Continuous Improvement',
    description:
      'Every Hanzo University track builds on empirical experimentation. Start free with AUTO 101 to master closed-loop optimization, causal inference, bandits, and safe deployment qualification.',
  },
  {
    id: 'intelligence',
    name: 'School of Intelligence Engineering',
    shortName: 'Intelligence Engineering',
    eyebrow: 'SCHOOL 01 · KAI · ENSO · ZEN · SYSTEMS',
    discipline: 'Intelligence Engineering',
    description:
      'Master the full intelligence stack: zero-token Kai decision models, adaptive Enso orchestrators, open-weight Zen model engineering, native RL post-training, agentic coding, and production ML systems.',
  },
  {
    id: 'science',
    name: 'School of Autonomous Science',
    shortName: 'Autonomous Science',
    eyebrow: 'SCHOOL 02 · DISCOVERY · AUTOPILOT · RECURSIVE ML',
    discipline: 'Autonomous Science',
    description:
      'Build AI systems that formulate hypotheses, run controlled experiments, analyze results, and safely automate research loops from scientific discovery to recursive model improvement.',
  },
  {
    id: 'cybersecurity',
    name: 'School of Cybersecurity',
    shortName: 'Cybersecurity',
    eyebrow: 'SCHOOL 03 · AI SECURITY · OPENCYBER · ZERO-TRUST',
    discipline: 'Cybersecurity',
    description:
      'Defend models, agents, and infrastructure. Engineer red-team harnesses, agentic SecOps pipelines with Hanzo Cyber and OpenCyber, microVM isolation, IAM, RNS, ZAP, and offline sovereign execution.',
  },
  {
    id: 'business',
    name: 'School of Autonomous Business & Entrepreneurship',
    shortName: 'Business & Entrepreneurship',
    eyebrow: 'SCHOOL 04 · AUTOPILOT · ORGANIZATIONS · FOUNDERS',
    discipline: 'AI Entrepreneurship',
    description:
      'Turn intelligence engineering into durable organizations and products. Run business autopilot loops, coordinate autonomous operations, and launch your own AI company end to end.',
  },
]

export const KNOWN_COUPONS: Record<string, { percent?: number; amount?: number; label: string }> = {
  HANZO20: { percent: 20, label: '20% Off Hanzo University' },
  STUDENT50: { percent: 50, label: '50% Off Academic / Student Grant' },
  STUDENTS50: { percent: 50, label: '50% Off Academic / Student Grant' },
  STUDENT: { percent: 50, label: '50% Off Academic / Student Grant' },
  STUDENTS: { percent: 50, label: '50% Off Academic / Student Grant' },
  '50OFF': { percent: 50, label: '50% Off Promotion' },
  EARLYBIRD: { amount: 50, label: '$50 Off Early Enrollment' },
  LAUNCH25: { percent: 25, label: '25% Off Launch Promotion' },
  DEVCOMMUNITY: { percent: 30, label: '30% Off Developer Community' },
  VIP100: { amount: 100, label: '$100 Off Fellowship Grant' },
  KAI: { percent: 35, label: '35% Off Decision Engineering' },
}

export function validateCoupon(rawCode: string, originalPrice: number): CouponResult {
  const code = (rawCode || '').trim().toUpperCase()
  if (originalPrice <= 0) {
    return {
      valid: false,
      code,
      discountAmount: 0,
      originalPrice: 0,
      finalPrice: 0,
      message: 'This course is already free — no coupon required.',
    }
  }
  if (!code) {
    return {
      valid: false,
      code: '',
      discountAmount: 0,
      originalPrice,
      finalPrice: originalPrice,
      message: '',
    }
  }

  const promo = KNOWN_COUPONS[code]
  if (!promo) {
    return {
      valid: false,
      code,
      discountAmount: 0,
      originalPrice,
      finalPrice: originalPrice,
      message: `Coupon code "${code}" is invalid or expired.`,
    }
  }

  let discountAmount = 0
  let discountPercent = promo.percent
  if (promo.percent) {
    discountAmount = Math.round((originalPrice * promo.percent) / 100)
  } else if (promo.amount) {
    discountAmount = Math.min(originalPrice - 1, promo.amount)
    discountPercent = Math.round((discountAmount / originalPrice) * 100)
  }

  const finalPrice = Math.max(1, originalPrice - discountAmount)

  return {
    valid: true,
    code,
    discountPercent,
    discountAmount,
    originalPrice,
    finalPrice,
    message: `Applied: ${promo.label} (-$${discountAmount})`,
  }
}

const learnUrl = (slug: string) => `https://hanzo.app/learn/${slug}`

export const UNIVERSITY_COURSES: UniversityCourse[] = [
  // ═══════════════════════════════════════════════════════════════════════
  // FREE FOUNDATIONAL COURSE (1)
  // ═══════════════════════════════════════════════════════════════════════
  {
    slug: 'continuous-improvement',
    code: 'AUTO 101',
    title: 'The Science of Continuous Improvement',
    credential: 'HCI-101',
    credentialFull: 'Hanzo Continuous Improvement Foundations',
    school: 'foundation',
    isFree: true,
    price: 0,
    duration: '2 Weeks · Free & Self-Paced',
    level: 'Foundational',
    prerequisites: 'None — open to engineers, scientists, security analysts, and founders',
    summary:
      'Master the universal feedback loop behind Autopilot across Marketing, Science, Training, Cybersecurity, and Infrastructure. Learn experimental design, statistics, causal inference, multi-armed bandits, Bayesian optimization, reinforcement learning, reward hacking defenses, Goodhart’s law, and safe deployment qualification.',
    capstone:
      'Design and ship a closed-loop Autopilot experiment harness with causal guardrail metrics, bandit allocation, reward-hacking checks, and automated canary qualification.',
    capstoneArtifact: 'Deployed Autopilot Experiment & Qualification Harness',
    labComputeNote: 'Free sandbox workspace on hanzo.app/learn with scoped starter compute for all AUTO 101 labs.',
    competencies: [
      'Autopilot loops across Marketing, Science, Training, Cyber, and Infrastructure',
      'Experimental design, hypothesis testing, power analysis, and causal inference',
      'Multi-armed bandits, Thompson sampling, and Bayesian hyperparameter optimization',
      'RL fundamentals, Goodhart’s law, reward hacking detection, and deployment gates',
    ],
    planId: 'course-auto-101',
    featured: true,
    facultyBots: ['@Edu', '@Sci', '@Data', '@QA'],
    docsLinks: [
      { label: 'Hanzo Quickstart', href: 'https://docs.hanzo.ai/docs/quickstart', kind: 'quickstart' },
      { label: 'Self-Improvement Architecture', href: 'https://docs.hanzo.ai/docs/self-improvement', kind: 'guide' },
      { label: 'Closed-Loop Cookbook', href: 'https://docs.hanzo.ai/docs/guides/cookbook/loop', kind: 'guide' },
      { label: 'Experiments CLI Reference', href: 'https://docs.hanzo.ai/docs/cli/experiment', kind: 'reference' },
    ],
    learnWorkspaceUrl: learnUrl('continuous-improvement'),
    syllabus: [
      {
        week: 'Week 1',
        code: 'AUTO 101.1',
        title: 'Experimental Design, Statistics & Causal Inference',
        summary:
          'Establish the mathematical discipline for measuring real improvement across Marketing, Science, Model Training, Cyber, and Infrastructure without falling for noise or confounding.',
        lectures: [
          'The universal Autopilot loop: Observe → Hypothesize → Experiment → Verify → Promote',
          'Experimental design: randomization, variance reduction (CUPED), sequential testing, and power analysis',
          'Causal inference beyond A/B tests: difference-in-differences, propensity weighting, and counterfactual evaluation',
          'Cross-domain metrics: translating business, scientific, security, and latency objectives into testable criteria',
        ],
        readings: [
          'Hanzo Architecture: Self-Improvement & Closed-Loop Verification',
          'Kohavi, Tang & Xu: Trustworthy Online Controlled Experiments',
        ],
        lab: 'Lab 1: Build an automated experiment evaluator that detects underpowered runs and confounded treatment assignments.',
      },
      {
        week: 'Week 2',
        code: 'AUTO 101.2',
        title: 'Bandits, Bayesian Optimization, RL & Deployment Qualification',
        summary:
          'Move from static experiments to adaptive optimization while defending against Goodhart’s law, metric gaming, and unsafe production rollouts.',
        lectures: [
          'Multi-armed & contextual bandits (UCB, Thompson Sampling, LinUCB) vs fixed-horizon tests',
          'Bayesian optimization for expensive evaluations across training runs and infrastructure tuning',
          'Reinforcement learning feedback loops: credit assignment, reward shaping, Goodhart’s law, and reward hacking',
          'Deployment qualification gates: shadow evaluation, canary rollouts, rollback triggers, and audit trails',
        ],
        readings: [
          'Amodei et al.: Concrete Problems in AI Safety (Reward Hacking & Safe Exploration)',
          'Hanzo Cookbook: Gated Promotion & Automated Rollback Loops',
        ],
        lab: 'Capstone Lab: Ship an Autopilot loop with multi-armed bandit routing, Goodhart guardrail alerts, and automated canary promotion.',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // SCHOOL 01: SCHOOL OF INTELLIGENCE ENGINEERING (10 courses)
  // ═══════════════════════════════════════════════════════════════════════
  {
    slug: 'kai-decision-intelligence',
    code: 'KAI 201',
    title: 'Decision Intelligence',
    credential: 'HKDI',
    credentialFull: 'Hanzo Kai Decision Intelligence Specialist',
    school: 'intelligence',
    price: 149,
    duration: '3 Weeks · Self-Paced',
    level: 'Intermediate',
    prerequisites: 'AUTO 101 (recommended) + REST API and Python/TypeScript proficiency',
    summary:
      'Stop using expensive generative LLMs for binary gates, triage, scoring, and routing. Master Kai finite-state decision models—calibrated probability outputs, structured schemas, zero-token control flow, and deterministic escalation.',
    capstone:
      'Build and deploy a multi-gate Kai decision pipeline that routes, scores, and verifies production workflows via /v1/decisions with calibrated confidence thresholds.',
    capstoneArtifact: 'Calibrated Kai Decision Pipeline on /v1/decisions',
    labComputeNote: 'Includes sandboxed lab environment and scoped Kai API compute aligned to KAI 201 lab requirements.',
    competencies: [
      'Structured decisions via /v1/decisions (decide, choice, score, rubric)',
      'Calibration curves, Brier scores, ECE, and threshold optimization',
      'Replacing fragile generative prompt-chains with deterministic Kai gates',
      'Human-in-the-loop abstention, audit logs, and micro-USD latency/cost budgets',
    ],
    planId: 'course-kai-201',
    featured: true,
    facultyBots: ['@Edu', '@Dev', '@Data', '@Doc'],
    docsLinks: [
      { label: 'Kai Models Overview', href: 'https://docs.hanzo.ai/docs/models/kai', kind: 'quickstart' },
      { label: 'Kai Implementation Guide', href: 'https://docs.hanzo.ai/docs/guides/kai', kind: 'guide' },
      { label: 'Decisions API Spec', href: 'https://docs.hanzo.ai/docs/decisions', kind: 'reference' },
      { label: 'Gating & Triage Recipes', href: 'https://docs.hanzo.ai/docs/guides/cookbook/gate', kind: 'guide' },
    ],
    learnWorkspaceUrl: learnUrl('kai-decision-intelligence'),
    syllabus: [
      {
        week: 'Week 1',
        code: 'KAI 201.1',
        title: 'Why Decision Models Beat Generative Prompting for Control Flow',
        summary:
          'Analyze latency, determinism, cost, and failure modes of prose-generating LLMs versus finite-state Kai decision capabilities.',
        lectures: [
          'Decision vs generation: separating control-plane judgment from content synthesis',
          'Kai primitives: binary decide, multi-class choice, calibrated score, and rubric evaluation',
          'Logit-space probability extraction and zero-output-token inference economics',
        ],
        readings: ['Hanzo Docs: Kai Decision Models Architecture', 'Hanzo Cookbook: Gate & Triage Patterns'],
        lab: 'Lab 1: Replace three unstructured LLM classifier prompts with typed /v1/decisions calls and benchmark latency & consistency.',
      },
      {
        week: 'Week 2',
        code: 'KAI 201.2',
        title: 'Calibration, Abstention & Threshold Engineering',
        summary:
          'Turn raw model confidences into trustworthy operational decisions with cost-sensitive thresholds and explicit uncertainty routing.',
        lectures: [
          'Reliability diagrams, Expected Calibration Error (ECE), and Brier score diagnostics',
          'Cost-sensitive decision theory: false-positive vs false-negative asymmetry',
          'Abstention bands and automatic escalation to Enso or human reviewers',
        ],
        readings: ['Guo et al.: On Calibration of Modern Neural Networks', 'Hanzo Docs: Decisions API Reference'],
        lab: 'Lab 2: Calibrate a support and fraud triage capability and enforce an explicit abstention band for low-confidence cases.',
      },
      {
        week: 'Week 3',
        code: 'KAI 201.3',
        title: 'Production Decision Meshes & Capstone Verification',
        summary:
          'Compose decision gates into auditable multi-stage workflows with command guards, prompt-injection screening, and telemetry.',
        lectures: [
          'Composable decision graphs: command_guard, injection_screen, tool_select, and log_triage',
          'Shadow evaluation and live drift monitoring for deployed decision capabilities',
          'Capstone architecture review and automated cleanroom verification',
        ],
        readings: ['Hanzo Cookbook: Production Blueprints for Decision Control'],
        lab: 'Capstone Project: Deploy a live multi-stage Kai decision service passing calibration, latency, and adversarial test suites.',
      },
    ],
  },
  {
    slug: 'kai-training-decision-models',
    code: 'KAI 301',
    title: 'Training Decision Models',
    credential: 'HKDM',
    credentialFull: 'Hanzo Certified Kai Decision Model Engineer',
    school: 'intelligence',
    price: 299,
    duration: '4 Weeks · Applied Training Lab',
    level: 'Advanced',
    prerequisites: 'KAI 201 or equivalent ML evaluation experience + Python proficiency',
    summary:
      'Train domain-specific Kai decision capabilities on your own operational data. Curate labeled decision datasets, run training jobs via POST /v1/capabilities/{name}/train, calibrate logits, evaluate slices, and promote capabilities safely to production.',
    capstone:
      'Train, calibrate, red-team, and promote a custom business decision capability via POST /v1/capabilities/{name}/train that outperforms a baseline frontier prompt at a fraction of latency and cost.',
    capstoneArtifact: 'Custom Trained Kai Capability via /v1/capabilities/{name}/train',
    labComputeNote: 'Includes sandboxed training workspace and scoped GPU/API compute aligned to KAI 301 lab jobs.',
    competencies: [
      'Capability schema & label taxonomy design for operational decisions',
      'End-to-end training via POST /v1/capabilities/{name}/train',
      'Hard-negative mining, preference pairs, and temperature/Platt calibration',
      'Shadow rollout, slice regression testing, and continuous retraining loops',
    ],
    planId: 'course-kai-301',
    featured: true,
    facultyBots: ['@Edu', '@Dev', '@Data', '@QA'],
    docsLinks: [
      { label: 'Kai Models & Capabilities', href: 'https://docs.hanzo.ai/docs/models/kai', kind: 'quickstart' },
      { label: 'Kai Training & Decision Guide', href: 'https://docs.hanzo.ai/docs/guides/kai', kind: 'guide' },
      { label: 'Train CLI Reference', href: 'https://docs.hanzo.ai/docs/cli/train', kind: 'reference' },
      { label: 'Eval & Benchmarks CLI', href: 'https://docs.hanzo.ai/docs/cli/eval', kind: 'reference' },
    ],
    learnWorkspaceUrl: learnUrl('kai-training-decision-models'),
    detailedLab: {
      code: 'LAB 01',
      title: 'Lab 01: Teach Kai your business',
      subtitle:
        'A 9-step hands-on training lab turning raw business tickets, transactions, or routing logs into a calibrated, production-ready Kai capability via POST /v1/capabilities/{name}/train.',
      endpoint: 'POST /v1/capabilities/{name}/train',
      steps: [
        {
          step: 1,
          title: 'Define the Decision Capability Schema',
          endpoint: 'POST /v1/capabilities',
          command: 'hanzo cli capability create refund-eligibility --schema schema.json',
          summary:
            'Specify strict input fields, discrete outcome labels (approve, escalate, deny), and business cost weights so every prediction is schema-bound.',
        },
        {
          step: 2,
          title: 'Export & Sanitize Historical Decisions',
          command: 'hanzo dataset import ./ops_decisions.jsonl --redact-pii --dedupe',
          summary:
            'Ingest historical ground-truth decisions from logs, strip PII, remove label leakage, and inspect class imbalance across business slices.',
        },
        {
          step: 3,
          title: 'Construct Stratified Train / Calibration / Holdout Splits',
          command: 'hanzo dataset split refund-eligibility --train 0.70 --cal 0.15 --test 0.15 --temporal',
          summary:
            'Use temporal stratification so future edge cases stay strictly isolated in holdout evaluation and never leak into training.',
        },
        {
          step: 4,
          title: 'Benchmark the Zero-Shot Baseline',
          endpoint: 'POST /v1/decisions',
          command: 'hanzo eval run refund-eligibility --baseline zero-shot --split test',
          summary:
            'Measure baseline accuracy, F1, ECE calibration error, P95 latency, and cost-per-1k decisions before running any parameter updates.',
        },
        {
          step: 5,
          title: 'Launch Capability Training Job',
          endpoint: 'POST /v1/capabilities/{name}/train',
          command:
            'curl -X POST https://api.hanzo.ai/v1/capabilities/refund-eligibility/train -H "Authorization: Bearer $HANZO_API_KEY" -d \'{"dataset":"refund-eligibility:train","base_model":"kai-base","objective":"calibrated_ce","epochs":3}\'',
          summary:
            'Submit your structured training manifest to POST /v1/capabilities/{name}/train with cost-weighted loss and deterministic seed tracking.',
        },
        {
          step: 6,
          title: 'Inspect Loss, Slice Metrics & Hard Negatives',
          endpoint: 'GET /v1/capabilities/{name}/train/{job_id}',
          command: 'hanzo eval slices refund-eligibility --job $JOB_ID --top-errors 25',
          summary:
            'Stream training metrics, identify systematic error clusters across customer segments, and harvest hard negatives for a targeted refinement pass.',
        },
        {
          step: 7,
          title: 'Run Post-Training Calibration & Threshold Sweep',
          endpoint: 'POST /v1/capabilities/{name}/calibrate',
          command: 'hanzo eval calibrate refund-eligibility --split cal --target-ece 0.02',
          summary:
            'Fit temperature scaling on the calibration split and compute optimal accept/abstain/reject thresholds minimizing expected dollar loss.',
        },
        {
          step: 8,
          title: 'Shadow Deploy Against Live Production Traffic',
          endpoint: 'POST /v1/capabilities/{name}/deploy',
          command: 'hanzo deploy capability refund-eligibility --mode shadow --sample 1.0',
          summary:
            'Mirror real traffic through your trained Kai capability in shadow mode to verify latency budgets, zero schema errors, and agreement rates.',
        },
        {
          step: 9,
          title: 'Qualify, Promote & Wire Continuous Feedback',
          endpoint: 'POST /v1/capabilities/{name}/promote',
          command: 'hanzo deploy promote refund-eligibility --gate ece<=0.02,p99<=35ms --feedback auto',
          summary:
            'Pass automated cleanroom qualification gates, promote the version to active serving, and log human overrides back into the next retraining cycle.',
        },
      ],
    },
    syllabus: [
      {
        week: 'Week 1',
        code: 'KAI 301.1',
        title: 'Decision Data Engineering & Capability Design (Lab 01 Foundations)',
        summary:
          'Turn messy business operations into clean, leakage-free decision datasets with clear label rubrics and inter-annotator agreement.',
        lectures: [
          'Structuring operational decision problems: binary gates, triage taxonomies, and rubric scores',
          'Avoiding temporal leakage, selection bias, and delayed-label corruption',
          'Walkthrough of Lab 01 Steps 1–4: schema creation, sanitization, splitting, and baseline eval',
        ],
        readings: ['Hanzo Docs: Kai Capability Specification', 'Hanzo CLI: Dataset & Evaluation Workflows'],
        lab: 'Lab 01 (Part A): Complete Steps 1–4 of "Teach Kai your business" and record your verified baseline scorecard.',
      },
      {
        week: 'Week 2',
        code: 'KAI 301.2',
        title: 'Training Objectives, LoRA Adaptation & POST /v1/capabilities/{name}/train',
        summary:
          'Train compact, specialized decision adapters using calibrated cross-entropy, focal loss, and margin-based preference objectives.',
        lectures: [
          'Training API deep dive: POST /v1/capabilities/{name}/train manifests, hyperparameters, and checkpoints',
          'Handling severe class imbalance with cost-weighted loss and hard-negative mining',
          'Distilling high-cost teacher rubrics into sub-20ms Kai decision adapters',
        ],
        readings: ['Hanzo Docs: Training Jobs & Capability Versioning', 'Lin et al.: Focal Loss for Dense Classification'],
        lab: 'Lab 01 (Part B): Execute Steps 5–6 on POST /v1/capabilities/{name}/train and run a hard-negative refinement pass.',
      },
      {
        week: 'Week 3',
        code: 'KAI 301.3',
        title: 'Calibration, Robustness & Adversarial Slice Testing',
        summary:
          'Ensure trained capabilities maintain calibrated probabilities under distribution shift and adversarial inputs.',
        lectures: [
          'Temperature scaling, isotonic calibration, and conformal prediction sets',
          'Slice-based regression testing and adversarial perturbation suites',
          'Out-of-distribution detection and safe fallback policies',
        ],
        readings: ['Angelopoulos & Bates: A Gentle Introduction to Conformal Prediction'],
        lab: 'Lab 01 (Part C): Complete Step 7 calibration sweep and pass an adversarial slice stress test.',
      },
      {
        week: 'Week 4',
        code: 'KAI 301.4',
        title: 'Shadow Deployment, Promotion Gates & Continuous Retraining',
        summary:
          'Operate trained Kai models in production with shadow evaluation, drift alerts, and automated retraining triggers.',
        lectures: [
          'Shadow evaluation and dual-write auditing in production services',
          'Automated qualification gates and safe rollback procedures',
          'Closing the loop: turning human overrides into versioned training deltas',
        ],
        readings: ['Hanzo Docs: Self-Improvement & Feedback Loops'],
        lab: 'Capstone Project (Lab 01 Steps 8–9): Shadow-deploy, qualify, and promote your trained Kai capability with live monitoring.',
      },
    ],
  },
  {
    slug: 'enso-adaptive-intelligence',
    code: 'ENS 201',
    title: 'Adaptive Intelligence',
    credential: 'HEAI',
    credentialFull: 'Hanzo Enso Adaptive Intelligence Specialist',
    school: 'intelligence',
    price: 149,
    duration: '3 Weeks · Self-Paced',
    level: 'Intermediate',
    prerequisites: 'API development experience in Python or TypeScript',
    summary:
      'Design multi-model systems that adapt dynamically to task complexity, latency targets, and budget ceilings. Master Enso routing, cascade verification, fallback policies, and quality-cost Pareto optimization.',
    capstone:
      'Ship an Enso multi-model routing gateway that dynamically dispatches tasks across Zen, Kai, and specialist models while meeting strict SLA and spend targets.',
    capstoneArtifact: 'Deployed Enso Adaptive Multi-Model Router',
    labComputeNote: 'Includes sandboxed workspace and scoped Enso routing compute aligned to ENS 201 labs.',
    competencies: [
      'Enso adaptive routing policies across fast, reasoning, and specialist models',
      'Speculative cascades, confidence-gated escalation, and latency budgets',
      'Quality-cost Pareto frontier measurement and automated A/B routing',
      'Resilient provider failover, caching, and SLA enforcement',
    ],
    planId: 'course-ens-201',
    featured: true,
    facultyBots: ['@Edu', '@Dev', '@Data', '@Doc'],
    docsLinks: [
      { label: 'Enso Adaptive Router Docs', href: 'https://docs.hanzo.ai/docs/models/enso', kind: 'quickstart' },
      { label: 'Routing Usage Guide', href: 'https://docs.hanzo.ai/docs/usage/routing', kind: 'guide' },
      { label: 'Routing Cookbook Recipe', href: 'https://docs.hanzo.ai/docs/guides/cookbook/route', kind: 'guide' },
      { label: 'Budget Controls Concept', href: 'https://docs.hanzo.ai/docs/concepts/budgets', kind: 'reference' },
    ],
    learnWorkspaceUrl: learnUrl('enso-adaptive-intelligence'),
    syllabus: [
      {
        week: 'Week 1',
        code: 'ENS 201.1',
        title: 'Multi-Model Architecture & Quality-Cost Pareto Frontiers',
        summary:
          'Understand why single-model stacks overpay on simple tasks and underperform on hard reasoning—and how Enso solves both.',
        lectures: [
          'Taxonomy of model tiers: decision models (Kai), fast open-weights (Zen Flash), and frontier reasoners',
          'Measuring task difficulty, latency SLOs, and quality-cost Pareto curves',
          'Configuring Enso routing endpoints and structured telemetry',
        ],
        readings: ['Hanzo Docs: Enso Model Routing Architecture', 'Chen et al.: FrugalGPT'],
        lab: 'Lab 1: Benchmark 500 mixed tasks across three model tiers and plot the quality-cost Pareto frontier.',
      },
      {
        week: 'Week 2',
        code: 'ENS 201.2',
        title: 'Confidence Cascades, Verification Gates & Fallbacks',
        summary:
          'Combine fast draft models with Kai verification gates to escalate only the small fraction of queries that need deeper compute.',
        lectures: [
          'Draft-and-verify cascades with Kai confidence scoring',
          'Circuit breakers, rate-limit failover, and semantic response caching',
          'Enforcing per-request and per-tenant budget ceilings',
        ],
        readings: ['Hanzo Cookbook: Routing & Budget Envelopes'],
        lab: 'Lab 2: Build a 2-stage Zen + Kai cascade that cuts token spend while preserving benchmark pass rate.',
      },
      {
        week: 'Week 3',
        code: 'ENS 201.3',
        title: 'Multi-Agent Task Decomposition & Capstone Router',
        summary:
          'Route sub-tasks in multi-step workflows to specialized models and verify end-to-end SLA compliance.',
        lectures: [
          'Decomposing complex workflows into specialized model hops (plan, code, verify, summarize)',
          'Live shadow routing and counterfactual spend attribution',
          'Capstone benchmark defense in cleanroom harness',
        ],
        readings: ['Hanzo Docs: Workflows & Multi-Model Orchestration'],
        lab: 'Capstone Project: Deploy an adaptive Enso gateway meeting latency, accuracy, and cost budgets under load.',
      },
    ],
  },
  {
    slug: 'enso-training-orchestrators',
    code: 'ENS 301',
    title: 'Training Intelligent Orchestrators',
    credential: 'HEIO',
    credentialFull: 'Hanzo Certified Enso Orchestrator Engineer',
    school: 'intelligence',
    price: 299,
    duration: '4 Weeks · Applied Systems Lab',
    level: 'Advanced',
    prerequisites: 'ENS 201 + familiarity with bandits, RL, or PyTorch training workflows',
    summary:
      'Go beyond static routing rules and train learned orchestrators. Build contextual-bandit and RL routers that optimize multi-step tool selection, model dispatch, verification depth, and compute allocation online.',
    capstone:
      'Train and deploy a learned Enso orchestrator using offline counterfactual logs and online contextual-bandit updates that beats static heuristics on unseen multi-model workloads.',
    capstoneArtifact: 'Trained Learned Enso Orchestrator Policy',
    labComputeNote: 'Includes sandboxed workspace and scoped training/evaluation compute aligned to ENS 301 labs.',
    competencies: [
      'Counterfactual logging and off-policy evaluation (IPS, Doubly Robust)',
      'Training neural contextual bandits and RL orchestrator policies',
      'Joint optimization of model choice, tool sequence, and test-time compute',
      'Safe online exploration, regret bounds, and multi-objective Pareto rewards',
    ],
    planId: 'course-ens-301',
    facultyBots: ['@Edu', '@Dev', '@Data', '@Sci'],
    docsLinks: [
      { label: 'Enso Architecture Docs', href: 'https://docs.hanzo.ai/docs/models/enso', kind: 'quickstart' },
      { label: 'Routing & Feedback APIs', href: 'https://docs.hanzo.ai/docs/usage/routing', kind: 'guide' },
      { label: 'Agent Mesh Architecture', href: 'https://docs.hanzo.ai/docs/dev/architecture/agent-mesh', kind: 'reference' },
    ],
    learnWorkspaceUrl: learnUrl('enso-training-orchestrators'),
    syllabus: [
      {
        week: 'Week 1',
        code: 'ENS 301.1',
        title: 'Orchestration as a Sequential Decision Problem',
        summary:
          'Formulate multi-model dispatch, tool selection, and test-time compute scaling as contextual bandits and MDPs.',
        lectures: [
          'State features for routing: embeddings, complexity predictors, budget remaining, and history',
          'Multi-objective reward design: balancing accuracy, latency, and micro-USD cost',
          'Instrumentation for counterfactual logging with propensity scores',
        ],
        readings: ['Dudik et al.: Doubly Robust Policy Evaluation and Learning'],
        lab: 'Lab 1: Instrument an Enso router to log propensities and compute offline Doubly Robust policy value estimates.',
      },
      {
        week: 'Week 2',
        code: 'ENS 301.2',
        title: 'Offline Policy Learning & Preference-Based Routers',
        summary:
          'Train router models from historical pairwise comparisons and quality/cost telemetry without risking live regressions.',
        lectures: [
          'Matrix factorization, bilinear routers, and small transformer routing encoders',
          'Training from human/verifier preference matrices across heterogeneous model pools',
          'Handling cold-start models when new open-weight checkpoints release',
        ],
        readings: ['Ong et al.: RouteLLM: Learning to Route LLMs with Preference Data'],
        lab: 'Lab 2: Train a preference-based router on multi-model eval logs and benchmark offline Pareto improvement.',
      },
      {
        week: 'Week 3',
        code: 'ENS 301.3',
        title: 'Online Bandits & Test-Time Compute Allocation',
        summary:
          'Adapt orchestration policies online as model pricing, latencies, and user workloads drift.',
        lectures: [
          'LinUCB, neural Thompson sampling, and safe exploration constraints',
          'Dynamic test-time compute: deciding when to sample-and-verify vs single-pass',
          'Detecting policy drift and preventing exploration from violating SLA caps',
        ],
        readings: ['Hanzo Docs: Self-Improvement & Adaptive Routing'],
        lab: 'Lab 3: Implement a safe online bandit updater with hard SLA/spend guardrails.',
      },
      {
        week: 'Week 4',
        code: 'ENS 301.4',
        title: 'Multi-Agent Swarm Orchestration & Capstone Defense',
        summary:
          'Coordinate specialist workers across parallel sub-tasks and defend your trained orchestrator on unseen workloads.',
        lectures: [
          'Learning task-decomposition graphs and dynamic worker allocation',
          'Evaluating generalization under model outages and budget shocks',
          'Capstone benchmark evaluation and credential verification',
        ],
        readings: ['Hanzo Docs: Agent Mesh & Workflows'],
        lab: 'Capstone Project: Deploy a trained Enso orchestrator outperforming static routing policies on holdout multi-model tasks.',
      },
    ],
  },
  {
    slug: 'zen-model-engineering',
    code: 'ZEN 201',
    title: 'Open-Weight Model Engineering',
    credential: 'HZME',
    credentialFull: 'Hanzo Certified Zen Model Engineer',
    school: 'intelligence',
    price: 199,
    duration: '4 Weeks · Self-Paced',
    level: 'Intermediate',
    prerequisites: 'Python proficiency + familiarity with PyTorch or transformer inference',
    summary:
      'Master open-weight Zen foundation models from weights to production serving. Learn MoE architectures, quantization (FP8, AWQ, GGUF), KV-cache memory math, vLLM/MLX serving, structured outputs, and systematic model evaluation.',
    capstone:
      'Quantize, evaluate, and serve an open-weight Zen model stack with constrained decoding, throughput benchmarks, and zero-regression eval scorecards.',
    capstoneArtifact: 'Production Quantized Zen Model Serving Stack',
    labComputeNote: 'Includes sandboxed workspace and scoped GPU inference compute aligned to ZEN 201 labs.',
    competencies: [
      'Open-weight Zen model family architecture (dense, MoE, vision, code)',
      'Quantization trade-offs: BF16, FP8, INT4/AWQ, and GGUF calibration',
      'High-throughput serving with continuous batching, PagedAttention, and Metal/CUDA',
      'Constrained JSON/grammar decoding and reproducible eval harnesses',
    ],
    planId: 'course-zen-201',
    featured: true,
    facultyBots: ['@Edu', '@Dev', '@Data', '@QA'],
    docsLinks: [
      { label: 'Zen Models Family', href: 'https://docs.hanzo.ai/docs/models/zen', kind: 'quickstart' },
      { label: 'Self-Hosting Models Guide', href: 'https://docs.hanzo.ai/docs/self-hosting', kind: 'guide' },
      { label: 'Eval & Benchmarks CLI', href: 'https://docs.hanzo.ai/docs/cli/benchmark', kind: 'reference' },
    ],
    learnWorkspaceUrl: learnUrl('zen-model-engineering'),
    syllabus: [
      {
        week: 'Week 1',
        code: 'ZEN 201.1',
        title: 'Modern Open-Weight & Zen Model Architectures',
        summary:
          'Dissect transformer internals: GQA, RoPE scaling, Mixture-of-Experts routing, multimodal encoders, and memory bandwidth bottlenecks.',
        lectures: [
          'The Zen open-weight lineage: dense vs MoE parameter efficiency',
          'Roofline analysis: compute-bound prefill vs memory-bandwidth-bound decode',
          'KV-cache sizing, context length scaling, and prefix caching',
        ],
        readings: ['Hanzo Docs: Zen Open-Weight Models', 'Dao et al.: FlashAttention-2'],
        lab: 'Lab 1: Profile prefill vs decode arithmetic intensity and KV-cache footprint on a Zen checkpoint.',
      },
      {
        week: 'Week 2',
        code: 'ZEN 201.2',
        title: 'Quantization, Compression & Quality Preservation',
        summary:
          'Compress weights and activations safely while measuring exact perplexity and downstream task degradation.',
        lectures: [
          'FP8, GPTQ, AWQ, and GGUF k-quants: calibration datasets and outlier channels',
          'KV-cache quantization and speculative decoding draft models',
          'Automated quantization regression testing on coding and reasoning suites',
        ],
        readings: ['Lin et al.: AWQ: Activation-aware Weight Quantization'],
        lab: 'Lab 2: Quantize a Zen model to FP8 and INT4, measuring throughput gains vs accuracy delta.',
      },
      {
        week: 'Week 3',
        code: 'ZEN 201.3',
        title: 'High-Throughput Serving & Constrained Decoding',
        summary:
          'Operate OpenAI-compatible serving engines with structured grammar enforcement and deterministic tool calling.',
        lectures: [
          'Continuous batching, chunked prefill, and tensor parallelism across GPUs',
          'Finite-state grammar-constrained decoding for 100% valid JSON and tool calls',
          'Local Apple Silicon (MLX/Metal) vs Linux CUDA serving parity',
        ],
        readings: ['Kwon et al.: Efficient Memory Management for LLM Serving with PagedAttention'],
        lab: 'Lab 3: Deploy a serving endpoint with grammar-constrained tool calling and benchmark P50/P99 TTFT and TPS.',
      },
      {
        week: 'Week 4',
        code: 'ZEN 201.4',
        title: 'Evaluation Harnesses & Production Readiness Capstone',
        summary:
          'Build reproducible benchmark pipelines and qualify your open-weight model deployment for production traffic.',
        lectures: [
          'Contamination checks, variance estimation, and domain-specific eval harnesses',
          'Observability: token throughput, queue depth, and OOM prevention',
          'Capstone benchmark defense',
        ],
        readings: ['Hanzo Docs: Benchmarking & Self-Hosting Production Models'],
        lab: 'Capstone Project: Deliver a quantized, benchmarked Zen serving deployment passing latency, schema, and accuracy gates.',
      },
    ],
  },
  {
    slug: 'zen-native-training',
    code: 'ZEN 301',
    title: 'Native Model Training',
    credential: 'HZNT',
    credentialFull: 'Hanzo Certified Native Model Training Engineer',
    school: 'intelligence',
    price: 349,
    duration: '5 Weeks · GPU Training Lab',
    level: 'Expert',
    prerequisites: 'ZEN 201 + solid PyTorch, linear algebra, and distributed compute fundamentals',
    summary:
      'Train and post-train open-weight Zen models natively. Build data mixtures, run distributed SFT, LoRA/DoRA, DPO, and verifiable-reward RL (GRPO), debug loss spikes, and release verified model checkpoints.',
    capstone:
      'Run a full post-training recipe (curated SFT + DPO/GRPO) on a Zen base model, verifying measurable benchmark gains without catastrophic forgetting.',
    capstoneArtifact: 'Verified Fine-Tuned Zen Checkpoint & Eval Report',
    labComputeNote: 'Includes sandboxed training workspace and scoped GPU compute credits aligned to ZEN 301 training labs.',
    competencies: [
      'Data curation, deduplication, synthetic data verification, and curriculum mixing',
      'Distributed training: FSDP2, DeepSpeed ZeRO, gradient checkpointing, and BF16/FP8',
      'Parameter-efficient (LoRA/QLoRA) vs full-parameter supervised fine-tuning',
      'Preference alignment (DPO/ORPO) and verifiable-reward RL post-training',
    ],
    planId: 'course-zen-301',
    facultyBots: ['@Edu', '@Dev', '@Sci', '@Data'],
    docsLinks: [
      { label: 'Zen Models Reference', href: 'https://docs.hanzo.ai/docs/models/zen', kind: 'quickstart' },
      { label: 'Training CLI Reference', href: 'https://docs.hanzo.ai/docs/cli/train', kind: 'reference' },
      { label: 'Dataset Management CLI', href: 'https://docs.hanzo.ai/docs/cli/dataset', kind: 'reference' },
    ],
    learnWorkspaceUrl: learnUrl('zen-native-training'),
    syllabus: [
      {
        week: 'Week 1',
        code: 'ZEN 301.1',
        title: 'Training Data Pipelines, Deduplication & Synthetic Verification',
        summary:
          'Quality data beats raw token volume. Build repeatable data curation pipelines with MinHash deduplication, decontamination, and automated filtering.',
        lectures: [
          'Pretraining vs mid-training vs post-training data mixtures',
          'Exact & fuzzy deduplication (MinHash LSH) and benchmark decontamination',
          'Rejection sampling and verifiable synthetic trace generation for code & math',
        ],
        readings: ['Penedo et al.: The FineWeb Datasets', 'Hanzo Docs: Dataset Pipelines'],
        lab: 'Lab 1: Curate, deduplicate, and decontaminate a domain SFT dataset with automated quality diagnostics.',
      },
      {
        week: 'Week 2',
        code: 'ZEN 301.2',
        title: 'Distributed Training Systems: FSDP, Parallelism & Stability',
        summary:
          'Configure multi-GPU training runs with high Model FLOPs Utilization (MFU) and clean numerical stability.',
        lectures: [
          'Data, tensor, pipeline, and context parallelism trade-offs',
          'Activation checkpointing, sequence packing, and FlashAttention kernels',
          'Diagnosing grad-norm spikes, NaN losses, and learning-rate schedule failures',
        ],
        readings: ['Shoeybi et al.: Megatron-LM', 'Zhao et al.: PyTorch FSDP'],
        lab: 'Lab 2: Launch a packed-sequence FSDP training job and optimize MFU and memory headroom.',
      },
      {
        week: 'Week 3',
        code: 'ZEN 301.3',
        title: 'Supervised Fine-Tuning, LoRA/DoRA & Tool-Use Conditioning',
        summary:
          'Specialize Zen checkpoints for structured tool calling, multi-turn coding, and domain reasoning.',
        lectures: [
          'Full fine-tuning vs LoRA/DoRA rank selection and target modules',
          'Loss masking on assistant/tool turns and chat-template invariants',
          'Preventing catastrophic forgetting with replay mixtures',
        ],
        readings: ['Hu et al.: LoRA: Low-Rank Adaptation of Large Language Models'],
        lab: 'Lab 3: Fine-tune a Zen checkpoint for multi-step tool calling and verify zero regression on general capabilities.',
      },
      {
        week: 'Week 4',
        code: 'ZEN 301.4',
        title: 'Alignment & Post-Training: DPO, KTO & Verifiable RL',
        summary:
          'Push capability beyond SFT imitation using preference pairs and executable test-verified rewards.',
        lectures: [
          'Direct Preference Optimization (DPO) and margin regularization',
          'Reinforcement Learning with Verifiable Rewards (RLVR / GRPO) for code & logic',
          'KL-divergence budgeting and reward-model over-optimization detection',
        ],
        readings: ['Rafailov et al.: Direct Preference Optimization', 'Shao et al.: DeepSeekMath & GRPO'],
        lab: 'Lab 4: Run a DPO + RLVR post-training stage and measure pass@1 gains on holdout tasks.',
      },
      {
        week: 'Week 5',
        code: 'ZEN 301.5',
        title: 'Model Merging, Release Packaging & Capstone Defense',
        summary:
          'Merge checkpoints, generate model cards, package quantized artifacts, and pass final evaluation.',
        lectures: [
          'Checkpoint soups, SLERP, and TIES/DARE merging strategies',
          'Reproducible eval cards, safety checks, and GGUF/FP8 export pipelines',
          'Capstone checkpoint defense',
        ],
        readings: ['Wortsman et al.: Model Soups'],
        lab: 'Capstone Project: Publish a reproducible fine-tuned Zen checkpoint demonstrating verified target gains and clean safety evals.',
      },
    ],
  },
  {
    slug: 'ml-systems',
    code: 'ML 401',
    title: 'Advanced Machine Learning Systems',
    credential: 'HMLS',
    credentialFull: 'Hanzo Certified ML Systems Engineer',
    school: 'intelligence',
    price: 449,
    duration: '6 Weeks · Systems Immersion',
    level: 'Staff / Principal',
    prerequisites: 'ZEN 201 or production systems programming in Rust/C++/Go/Python',
    summary:
      'Engineer frontier ML infrastructure from GPU kernels to multi-node scheduling. Master CUDA/Triton/Metal kernels, disaggregated prefill/decode serving, distributed storage, high-speed interconnects, and fault-tolerant fleet orchestration.',
    capstone:
      'Design, benchmark, and defend a fault-tolerant distributed inference and training cluster architecture with custom kernel profiling and SLA verification.',
    capstoneArtifact: 'Benchmarked Distributed ML Systems Stack',
    labComputeNote: 'Includes sandboxed systems workspace and scoped GPU profiling compute aligned to ML 401 labs.',
    competencies: [
      'GPU architecture, memory hierarchy, and Triton/CUDA/Metal kernel profiling',
      'Disaggregated prefill/decode serving and KV-cache routing',
      'Distributed checkpointing, data loading bottlenecks, and RDMA/NCCL tuning',
      'Fault-tolerant GPU scheduling, elastic restarts, and fleet observability',
    ],
    planId: 'course-ml-401',
    facultyBots: ['@Dev', '@QA', '@Doc', '@Sci'],
    docsLinks: [
      { label: 'Hanzo System Architecture', href: 'https://docs.hanzo.ai/docs/architecture', kind: 'quickstart' },
      { label: 'ZAP Zero-Copy Protocol', href: 'https://docs.hanzo.ai/docs/zap', kind: 'guide' },
      { label: 'Compute & Provisioning CLI', href: 'https://docs.hanzo.ai/docs/cli/compute', kind: 'reference' },
    ],
    learnWorkspaceUrl: learnUrl('ml-systems'),
    syllabus: [
      {
        week: 'Week 1',
        code: 'ML 401.1',
        title: 'Hardware Architecture, Memory Hierarchies & Profiling',
        summary: 'Analyze GPU SMs, tensor cores, HBM bandwidth, SRAM tiling, and Unified Memory architectures.',
        lectures: [
          'Roofline modeling across NVIDIA H100/B200, AMD MI300, and Apple Silicon',
          'Nsight/PyTorch profiler traces: finding host-launch overhead and memory stalls',
          'Operator fusion and FlashAttention SRAM tiling mechanics',
        ],
        readings: ['Williams et al.: Roofline: An Insightful Visual Performance Model'],
        lab: 'Lab 1: Profile an inference trace, eliminate CPU dispatch bottlenecks, and quantify HBM utilization.',
      },
      {
        week: 'Week 2',
        code: 'ML 401.2',
        title: 'Custom Kernels with Triton, CUDA & Metal',
        summary: 'Write fused attention, RMSNorm, and quantized GEMM kernels that outperform eager PyTorch.',
        lectures: [
          'Block-level programming in Triton: coalesced loads, shared memory, and autotuning',
          'Fused RMSNorm + RoPE + SwiGLU kernels and numerical verification',
          'Cross-backend portability across CUDA, ROCm, and Apple Metal',
        ],
        readings: ['Tillet et al.: Triton: An Intermediate Language and Compiler for Tiled Neural Network Computations'],
        lab: 'Lab 2: Implement and verify a fused Triton kernel matching FP32 reference accuracy with >2x speedup.',
      },
      {
        week: 'Week 3',
        code: 'ML 401.3',
        title: 'Disaggregated Serving & KV-Cache Infrastructure',
        summary: 'Decouple prefill and decode pools, route prefix caches, and eliminate head-of-line blocking.',
        lectures: [
          'Disaggregated prefill/decode topologies and KV-cache transfer protocols',
          'Radix-tree prefix caching and cache-aware load balancing',
          'Speculative decoding and multi-token prediction in production servers',
        ],
        readings: ['Zhong et al.: DistServe: Disaggregating Prefill and Decoding for Goodput-Optimized LLM Serving'],
        lab: 'Lab 3: Configure cache-aware routing and measure TTFT/TPOT improvements under bursty long-context traffic.',
      },
      {
        week: 'Week 4',
        code: 'ML 401.4',
        title: 'Collective Communications, Networking & Storage I/O',
        summary: 'Eliminate data-loader starvation and optimize all-reduce, all-gather, and async checkpoint writes.',
        lectures: [
          'NCCL/RCCL rings, trees, NVLink, RoCEv2, and ZAP binary transport',
          'Overlapping communication with compute in FSDP and MoE all-to-all dispatch',
          'Asynchronous distributed checkpointing to S3-compatible object storage',
        ],
        readings: ['Hanzo Docs: ZAP Protocol Overview & Architecture'],
        lab: 'Lab 4: Benchmark collective bandwidth and implement non-blocking async checkpointing.',
      },
      {
        week: 'Week 5',
        code: 'ML 401.5',
        title: 'Elastic Scheduling, Fault Recovery & Cluster Reliability',
        summary: 'Keep multi-node training and serving healthy across GPU XID errors, stragglers, and preemptions.',
        lectures: [
          'Automated health checks, straggler detection, and bad-node quarantine',
          'Elastic job restart from distributed checkpoints with zero lost progress',
          'GPU fractional sharing, autoscaling cold-start minimization, and cost telemetry',
        ],
        readings: ['Meta AI: The Llama 3 Herd of Models (Infrastructure Reliability Section)'],
        lab: 'Lab 5: Simulate node failure mid-job and verify automated quarantine and checkpoint recovery.',
      },
      {
        week: 'Week 6',
        code: 'ML 401.6',
        title: 'End-to-End ML Systems Capstone Defense',
        summary: 'Synthesize kernel optimization, serving topology, observability, and cost engineering into a production blueprint.',
        lectures: [
          'Capacity planning and SLA modeling for multi-tenant inference fleets',
          'Chaos testing and tail-latency root-cause analysis',
          'Capstone architecture defense and automated benchmark verification',
        ],
        readings: ['Hanzo Docs: Architecture & Self-Hosting Specifications'],
        lab: 'Capstone Project: Deliver a profiled, fault-tolerant ML serving & training system meeting throughput and tail-latency SLOs.',
      },
    ],
  },
  {
    slug: 'agentic-coding',
    code: 'ENG 100',
    title: 'Agentic Coding Systems',
    credential: 'HACE',
    credentialFull: 'Hanzo Certified Agentic Coding Engineer',
    school: 'intelligence',
    price: 199,
    duration: '4 Weeks · Self-Paced',
    level: 'Advanced',
    prerequisites: 'Proficiency in Python, TypeScript, Go, or Rust + standard Git workflows',
    summary:
      'Architect autonomous coding agents capable of multi-file refactoring, AST-verified editing, test-driven debugging, and opening verified pull requests using Zen models, ZAP RPC, and isolated Hanzo Visor sandboxes.',
    capstone:
      'Build and deploy an autonomous code-repair agent that reproduces real repository defects inside a sandbox, synthesizes clean AST patches, and passes cleanroom CI within strict budget caps.',
    capstoneArtifact: 'Autonomous Sandboxed Code-Repair Agent',
    labComputeNote: 'Includes sandboxed Hanzo Visor workspace and scoped inference compute aligned to ENG 100 labs.',
    competencies: [
      'Zen model serving and agentic coding harness design with Hanzo Dev',
      'Tree-sitter AST context distillation and hybrid BM25 + vector code search',
      'Self-healing test loops with Kai decision gates and budget ceilings',
      'Coordinator-worker multi-agent swarms over ZAP RPC and isolated sandboxes',
    ],
    planId: 'course-eng-100',
    featured: true,
    facultyBots: ['@Dev', '@QA', '@Doc', '@Edu'],
    docsLinks: [
      { label: 'Coding Agents Guide', href: 'https://docs.hanzo.ai/docs/guides/coding', kind: 'quickstart' },
      { label: 'Hanzo Dev Architecture', href: 'https://docs.hanzo.ai/docs/dev/architecture', kind: 'guide' },
      { label: 'Sandbox Configuration', href: 'https://docs.hanzo.ai/docs/dev/configuration/sandbox', kind: 'reference' },
    ],
    learnWorkspaceUrl: learnUrl('agentic-coding'),
    syllabus: [
      {
        week: 'Week 1',
        code: 'ENG 100.1',
        title: 'Sandboxed Execution, Hanzo Visor & Zero-Copy ZAP RPC',
        summary:
          'Establish safe execution boundaries for autonomous code agents with ephemeral microVM sandboxes and fast binary IPC.',
        lectures: [
          'The 4-surface contract: CLI, SDKs, HTTP REST, and MCP tools',
          'Hanzo Visor sandbox isolation, read/write mounts, and ephemeral lease lifecycles',
          'ZAP Cap’n Proto binary RPC for low-latency agent-to-tool communication',
        ],
        readings: ['Hanzo Docs: Platform Sandboxing', 'Hanzo Docs: ZAP Protocol'],
        lab: 'Lab 1: Provision an isolated coding sandbox and wire a multi-tool agent loop with strict filesystem boundaries.',
      },
      {
        week: 'Week 2',
        code: 'ENG 100.2',
        title: 'AST Symbol Graphs, Context Distillation & Code Search',
        summary:
          'Navigate large repositories accurately without blowing context windows using tree-sitter grammars and hybrid retrieval.',
        lectures: [
          'Incremental AST parsing and symbol-graph extraction with tree-sitter',
          'Hybrid code retrieval: trigram/BM25 exact search combined with semantic embeddings',
          'Working-memory distillation across multi-file call graphs',
        ],
        readings: ['Hanzo Docs: AST SDK & Code Intelligence'],
        lab: 'Lab 2: Build an AST file scout that locates defect symbols in large repositories within tight token budgets.',
      },
      {
        week: 'Week 3',
        code: 'ENG 100.3',
        title: 'Test-Driven Self-Healing & Kai Verification Gates',
        summary:
          'Close the repair loop: synthesize minimal failing tests, apply syntax-checked edits, and gate termination with Kai.',
        lectures: [
          'Automated reproduction test generation from issue descriptions',
          'AST diff validation to prevent syntax regressions and broken imports',
          'Kai verification checkpoints and hard micro-USD spend caps',
        ],
        readings: ['Hanzo Docs: Budgets & Execution Policies'],
        lab: 'Lab 3: Implement a self-healing test runner that iterates inside a sandbox until clean exit code 0.',
      },
      {
        week: 'Week 4',
        code: 'ENG 100.4',
        title: 'Multi-Agent Coordinator-Worker Swarms & Capstone Defense',
        summary:
          'Partition complex engineering work across specialized Architect, Coder, and Reviewer agents on isolated git worktrees.',
        lectures: [
          'Coordinator-worker delegation, git worktree isolation, and conflict resolution',
          'Automated benchmark harnesses and regression verification',
          'Capstone defense and W3C verifiable completion proof',
        ],
        readings: ['Jimenez et al.: SWE-bench', 'Hanzo Docs: Agent Mesh'],
        lab: 'Capstone Project: Resolve benchmark repository defects autonomously inside a sandboxed harness within budget limits.',
      },
    ],
  },
  {
    slug: 'reinforcement-learning',
    code: 'RL 101',
    title: 'Native Reinforcement Learning & Post-Training',
    credential: 'HARLE',
    credentialFull: 'Hanzo Certified Reinforcement Learning Engineer',
    school: 'intelligence',
    price: 249,
    duration: '5 Weeks · Applied RL Lab',
    level: 'Expert',
    prerequisites: 'AUTO 101 (recommended) + Python ML libraries and linear algebra',
    summary:
      'Formulate agentic tool use and reasoning as formal Markov Decision Processes. Build Gymnasium environments, engineer multi-objective verifiable rewards, run PPO/GRPO/DPO post-training, and evaluate out-of-distribution generalization.',
    capstone:
      'Build a custom Gymnasium agent environment, train a verifiable-reward policy via GRPO/PPO, and deploy a learned router or agent policy passing holdout evaluation.',
    capstoneArtifact: 'Trained RL Policy & Verifiable Reward Environment',
    labComputeNote: 'Includes sandboxed RL workspace and scoped GPU rollout compute aligned to RL 101 labs.',
    competencies: [
      'MDP formulation and Gymnasium environment engineering for tool-using agents',
      'Multi-objective and process-supervised reward modeling without reward hacking',
      'Policy gradient optimization: PPO, GRPO, and DPO post-training',
      'Contextual bandits (LinUCB, Thompson Sampling) and out-of-distribution robustness',
    ],
    planId: 'course-rl-101',
    facultyBots: ['@Sci', '@Dev', '@Data', '@QA'],
    docsLinks: [
      { label: 'Self-Improvement Architecture', href: 'https://docs.hanzo.ai/docs/self-improvement', kind: 'quickstart' },
      { label: 'Train & Reward CLI', href: 'https://docs.hanzo.ai/docs/cli/train', kind: 'reference' },
      { label: 'Rewards & Evals CLI', href: 'https://docs.hanzo.ai/docs/cli/reward', kind: 'reference' },
    ],
    learnWorkspaceUrl: learnUrl('reinforcement-learning'),
    syllabus: [
      {
        week: 'Week 1',
        code: 'RL 101.1',
        title: 'Markov Decision Processes for Tool & Code Agents',
        summary: 'Formalize multi-step agent interactions as discrete/hybrid MDPs with clean observation and action spaces.',
        lectures: [
          'State spaces, partial observability, episodic boundaries, and termination predicates',
          'Building reproducible Gymnasium environments wrapping sandboxed tools',
          'Sparse vs dense reward shaping and horizon truncation',
        ],
        readings: ['Sutton & Barto: Reinforcement Learning: An Introduction (Chapters 3–4)'],
        lab: 'Lab 1: Wrap a sandboxed tool harness into a Gymnasium environment with deterministic replay.',
      },
      {
        week: 'Week 2',
        code: 'RL 101.2',
        title: 'Reward Engineering & Process Supervision',
        summary: 'Design verifiable reward functions that resist Goodhart’s law, verbosity bloat, and shortcut exploitation.',
        lectures: [
          'Outcome verification vs step-level process reward models',
          'Regularizing for token cost, execution latency, and safety invariants',
          'Preference optimization with DPO and KTO',
        ],
        readings: ['Rafailov et al.: Direct Preference Optimization'],
        lab: 'Lab 2: Implement a multi-objective verifiable reward harness and audit it against reward-hacking probes.',
      },
      {
        week: 'Week 3',
        code: 'RL 101.3',
        title: 'Policy Gradient Optimization: PPO & GRPO',
        summary: 'Train open-weight policies with clipped policy gradients and critic-free group-relative advantages.',
        lectures: [
          'PPO actor-critic dynamics, GAE, and KL penalties',
          'GRPO: group-relative advantage estimation for verifiable reasoning and tool tasks',
          'Distributed rollout collection and advantage normalization',
        ],
        readings: ['Schulman et al.: Proximal Policy Optimization', 'Shao et al.: GRPO'],
        lab: 'Lab 3: Execute a GRPO fine-tuning loop on a Zen checkpoint and monitor KL drift and reward curves.',
      },
      {
        week: 'Week 4',
        code: 'RL 101.4',
        title: 'Contextual Bandits & Learned Routing Policies',
        summary: 'Deploy online contextual-bandit policies for adaptive model and tool selection.',
        lectures: [
          'Exploration vs exploitation in live request routing',
          'Feature representation, streaming feedback updates, and regret diagnostics',
          'Off-policy validation before online rollout',
        ],
        readings: ['Li et al.: Contextual-Bandit Approach to Personalized Recommendation'],
        lab: 'Lab 4: Train and validate a LinUCB router balancing quality and spend across Zen model tiers.',
      },
      {
        week: 'Week 5',
        code: 'RL 101.5',
        title: 'Out-of-Distribution Robustness & Capstone Defense',
        summary: 'Stress-test trained policies on unseen tasks, verify safety constraints, and defend your capstone.',
        lectures: [
          'Out-of-distribution generalization and catastrophic forgetting checks',
          'Adversarial red-teaming of trained policies',
          'Capstone benchmark evaluation',
        ],
        readings: ['Hanzo Docs: Benchmarks & Evaluation Standards'],
        lab: 'Capstone Project: Deliver a trained RL policy achieving verified benchmark gains under strict cost and safety bounds.',
      },
    ],
  },
  {
    slug: 'systems-engineering',
    code: 'SYS 103',
    title: 'AI Systems Engineering Foundation',
    credential: 'HCAISE',
    credentialFull: 'Hanzo Certified AI Systems Engineer',
    school: 'intelligence',
    price: 149,
    duration: '3 Weeks · Comprehensive',
    level: 'Intermediate',
    prerequisites: 'Command-line fluency and experience consuming HTTP/JSON APIs',
    summary:
      'Build resilient, production-grade AI services from first principles. Master 4-surface API parity (CLI, SDK, HTTP, MCP), deterministic Kai control gates, hybrid retrieval, streaming reliability, and micro-USD budget governance.',
    capstone:
      'Ship a high-concurrency AI service exposing CLI, SDK, HTTP, and MCP interfaces with Kai control gates, circuit breakers, and strict micro-USD spend caps.',
    capstoneArtifact: 'Production 4-Surface AI Service with Spend Controls',
    labComputeNote: 'Includes sandboxed workspace and scoped API compute aligned to SYS 103 labs.',
    competencies: [
      '4-surface architecture parity across CLI, SDKs, HTTP REST, and MCP',
      'Deterministic Kai decision checkpoints in service control planes',
      'Hybrid retrieval combining keyword, graph, and dense vector indexes',
      'Micro-USD nested budget envelopes, circuit breakers, and OpenTelemetry tracing',
    ],
    planId: 'course-sys-103',
    facultyBots: ['@Dev', '@Doc', '@QA', '@Edu'],
    docsLinks: [
      { label: 'Hanzo Quickstart', href: 'https://docs.hanzo.ai/docs/quickstart', kind: 'quickstart' },
      { label: 'Architecture Philosophy', href: 'https://docs.hanzo.ai/docs/architecture/philosophy', kind: 'guide' },
      { label: 'Budgets & Cost Controls', href: 'https://docs.hanzo.ai/docs/concepts/budgets', kind: 'reference' },
    ],
    learnWorkspaceUrl: learnUrl('systems-engineering'),
    syllabus: [
      {
        week: 'Week 1',
        code: 'SYS 103.1',
        title: 'The 4-Surface Contract & Streaming Transport',
        summary: 'Design clean, unified AI capabilities that work identically across CLI, SDKs, HTTP, and MCP.',
        lectures: [
          'Designing contract-first schemas across CLI, Python/TypeScript SDKs, REST, and MCP',
          'Streaming semantics: SSE, WebSockets, cancellation propagation, and backpressure',
          'Idempotency, connection pooling, and exponential backoff with jitter',
        ],
        readings: ['Hanzo Docs: Architecture & SDKs'],
        lab: 'Lab 1: Build a single typed service exposed cleanly over both HTTP REST and MCP stdio.',
      },
      {
        week: 'Week 2',
        code: 'SYS 103.2',
        title: 'Kai Control Gates & Hybrid Retrieval Pipelines',
        summary: 'Combine deterministic Kai decision gates with hybrid retrieval to eliminate latency waste and context noise.',
        lectures: [
          'Moving routing, safety screening, and schema guards into Kai decision calls',
          'Hybrid retrieval: BM25, dense embeddings, reranking, and citation grounding',
          'Observability with structured traces and latency histograms',
        ],
        readings: ['Hanzo Docs: Kai Guide & Memory Concepts'],
        lab: 'Lab 2: Wire a hybrid RAG + Kai gating pipeline and measure end-to-end latency and citation accuracy.',
      },
      {
        week: 'Week 3',
        code: 'SYS 103.3',
        title: 'Budget Envelopes, Circuit Breakers & Capstone Service',
        summary: 'Guarantee predictable economics and graceful degradation under real production load.',
        lectures: [
          'Pre-call quoting and integer micro-USD budget enforcement',
          'Circuit breakers, rate limits, and multi-provider fallback degradation',
          'Capstone load test and verification',
        ],
        readings: ['Hanzo Docs: Budgets & Production Resilience'],
        lab: 'Capstone Project: Ship a resilient 4-surface AI microservice passing concurrency, failover, and budget-cap tests.',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // SCHOOL 02: SCHOOL OF AUTONOMOUS SCIENCE (4 courses)
  // ═══════════════════════════════════════════════════════════════════════
  {
    slug: 'science-discovery',
    code: 'SCI 101',
    title: 'AI for Scientific Discovery',
    credential: 'HCSD',
    credentialFull: 'Hanzo Certified Scientific Discovery Specialist',
    school: 'science',
    price: 99,
    duration: '3 Weeks · Self-Paced',
    level: 'Foundational',
    prerequisites: 'AUTO 101 (recommended) + basic Python data analysis',
    summary:
      'Use AI systems as rigorous scientific collaborators. Master literature synthesis, hypothesis generation, executable simulation notebooks, verifiable math/code reasoning, and reproducible scientific workflows.',
    capstone:
      'Build a reproducible AI-assisted discovery pipeline that synthesizes prior literature, proposes testable hypotheses, runs computational simulations, and produces an audited research report.',
    capstoneArtifact: 'Reproducible Scientific Discovery & Simulation Pipeline',
    labComputeNote: 'Includes sandboxed scientific notebook workspace and scoped compute aligned to SCI 101 labs.',
    competencies: [
      'Citation-grounded literature synthesis and contradiction mapping',
      'Structured hypothesis generation with falsifiable predictions',
      'Executable scientific simulations in isolated Python sandboxes',
      'Reproducibility standards, statistical validity, and peer-audit checklists',
    ],
    planId: 'course-sci-101',
    featured: true,
    facultyBots: ['@Sci', '@Data', '@Edu', '@Lang'],
    docsLinks: [
      { label: 'Hanzo Quickstart', href: 'https://docs.hanzo.ai/docs/quickstart', kind: 'quickstart' },
      { label: 'Agents & Tools Guide', href: 'https://docs.hanzo.ai/docs/guides/agent', kind: 'guide' },
      { label: 'Sandboxes Concept', href: 'https://docs.hanzo.ai/docs/concepts/sandboxes', kind: 'reference' },
    ],
    learnWorkspaceUrl: learnUrl('science-discovery'),
    syllabus: [
      {
        week: 'Week 1',
        code: 'SCI 101.1',
        title: 'Grounded Literature Synthesis & Knowledge Graphs',
        summary: 'Extract structured claims, datasets, and conflicting findings from scientific corpora without citation hallucination.',
        lectures: [
          'Claim extraction, provenance tracking, and citation verification gates',
          'Building domain knowledge graphs across papers, equations, and benchmarks',
          'Identifying open gaps and under-explored parameter regimes',
        ],
        readings: ['Hanzo Docs: Knowledge & Memory Systems'],
        lab: 'Lab 1: Build a citation-verified literature analyzer that extracts comparable experimental tables from raw papers.',
      },
      {
        week: 'Week 2',
        code: 'SCI 101.2',
        title: 'Hypothesis Formulation & Computational Simulation',
        summary: 'Translate qualitative hypotheses into falsifiable quantitative predictions executed inside deterministic sandboxes.',
        lectures: [
          'Falsifiability, null hypotheses, and pre-registered evaluation criteria',
          'Using coding agents to synthesize and verify numerical simulations',
          'Sensitivity analysis and uncertainty quantification',
        ],
        readings: ['Popper: Conjectures and Refutations (Falsifiability in Computational Science)'],
        lab: 'Lab 2: Run an automated simulation sweep testing competing hypotheses with bootstrap confidence intervals.',
      },
      {
        week: 'Week 3',
        code: 'SCI 101.3',
        title: 'Reproducible Artifacts & Scientific Verification Capstone',
        summary: 'Package code, seeds, datasets, and statistical tests into an independently reproducible scientific artifact.',
        lectures: [
          'Deterministic containers, seed locking, and artifact provenance',
          'Automated reviewer checks for p-hacking and data leakage',
          'Capstone scientific discovery presentation',
        ],
        readings: ['National Academies: Reproducibility and Replicability in Science'],
        lab: 'Capstone Project: Publish a fully reproducible computational discovery notebook passing automated replication checks.',
      },
    ],
  },
  {
    slug: 'autonomous-research',
    code: 'SCI 201',
    title: 'Autonomous Research Engineering',
    credential: 'HARE',
    credentialFull: 'Hanzo Certified Autonomous Research Engineer',
    school: 'science',
    price: 199,
    duration: '4 Weeks · Applied Research Lab',
    level: 'Intermediate',
    prerequisites: 'SCI 101 or ML research experience + Python/PyTorch fluency',
    summary:
      'Engineer autonomous research agents that design experiments, write training or simulation code, run controlled ablations on real compute, parse telemetry, and iterate based on evidence.',
    capstone:
      'Build an autonomous ML research engineer agent that proposes architectural or hyperparameter hypotheses, executes controlled ablations in a sandbox, and achieves verified metric gains on a benchmark.',
    capstoneArtifact: 'Autonomous Experimentation & Ablation Agent',
    labComputeNote: 'Includes sandboxed research workspace and scoped experiment compute aligned to SCI 201 labs.',
    competencies: [
      'Autonomous experiment planning and controlled ablation design',
      'Sandboxed code synthesis, execution monitoring, and crash recovery',
      'Structured experiment tracking, statistical significance gates, and negative-result logging',
      'Multi-agent researcher + skeptic critic review loops',
    ],
    planId: 'course-sci-201',
    facultyBots: ['@Sci', '@Dev', '@Data', '@QA'],
    docsLinks: [
      { label: 'Self-Improvement Docs', href: 'https://docs.hanzo.ai/docs/self-improvement', kind: 'quickstart' },
      { label: 'Loop Cookbook', href: 'https://docs.hanzo.ai/docs/guides/cookbook/loop', kind: 'guide' },
      { label: 'Experiments & Eval CLI', href: 'https://docs.hanzo.ai/docs/cli/experiment', kind: 'reference' },
    ],
    learnWorkspaceUrl: learnUrl('autonomous-research'),
    syllabus: [
      {
        week: 'Week 1',
        code: 'SCI 201.1',
        title: 'Anatomy of an Autonomous Research Agent',
        summary: 'Architect the planner, coder, executor, and critic roles required to run valid multi-step experiments.',
        lectures: [
          'Separating hypothesis generation from implementation and evaluation',
          'Experiment manifests: isolating one variable per ablation run',
          'Structured lab-notebook memory for cumulative discoveries and dead ends',
        ],
        readings: ['Hanzo Docs: Agents & Workflows'],
        lab: 'Lab 1: Build an experiment runner that enforces single-variable ablation diffs and logs every run atomically.',
      },
      {
        week: 'Week 2',
        code: 'SCI 201.2',
        title: 'Sandboxed Execution, Crash Recovery & Compute Budgets',
        summary: 'Let research agents write and run real GPU/CPU code safely without OOM loops or budget overruns.',
        lectures: [
          'Automated traceback parsing, OOM batch-size adjustment, and NaN early stopping',
          'Time and micro-USD budget allocation per hypothesis branch',
          'Deterministic seeding and artifact caching across iterations',
        ],
        readings: ['Hanzo Docs: Sandboxes & Budgets'],
        lab: 'Lab 2: Add automated failure diagnosis and early-stopping guards to your research executor.',
      },
      {
        week: 'Week 3',
        code: 'SCI 201.3',
        title: 'Skeptic Critics, Statistical Gates & Anti-Leakage Audits',
        summary: 'Stop agents from overfitting test sets or hallucinating improvements by pairing them with adversarial verifier bots.',
        lectures: [
          'Building an adversarial Reviewer agent that audits diffs for test leakage',
          'Multi-seed verification and paired statistical significance testing',
          'Logging negative results to prevent redundant search cycles',
        ],
        readings: ['Hanzo Cookbook: Gated Verification Loops'],
        lab: 'Lab 3: Deploy a Critic gate that rejects leaked or noisy experiment gains automatically.',
      },
      {
        week: 'Week 4',
        code: 'SCI 201.4',
        title: 'End-to-End Autonomous Research Benchmark Capstone',
        summary: 'Run your research agent autonomously across a 20-experiment budget and defend the verified winner.',
        lectures: [
          'Search tree exploration (best-first, evolutionary, Bayesian) over research ideas',
          'Generating LaTeX/Markdown technical reports directly from verified logs',
          'Capstone evaluation',
        ],
        readings: ['Hanzo Docs: Benchmarking Standards'],
        lab: 'Capstone Project: Execute an autonomous 20-run ablation campaign achieving statistically verified benchmark improvement.',
      },
    ],
  },
  {
    slug: 'research-autopilot',
    code: 'SCI 301',
    title: 'Research Autopilot',
    credential: 'HRAP',
    credentialFull: 'Hanzo Certified Research Autopilot Architect',
    school: 'science',
    price: 299,
    duration: '4 Weeks · Systems Lab',
    level: 'Advanced',
    prerequisites: 'SCI 201 + distributed workflows or ML training pipelines',
    summary:
      'Scale single research agents into continuous, fleet-wide Research Autopilot systems. Orchestrate parallel hypothesis trees, Bayesian/evolutionary search, multi-fidelity evaluation, and automated discovery promotion across compute clusters.',
    capstone:
      'Deploy a continuous Research Autopilot orchestrator managing parallel experiment workers with multi-fidelity pruning, Pareto archive tracking, and automated report synthesis.',
    capstoneArtifact: 'Multi-Worker Research Autopilot Orchestrator',
    labComputeNote: 'Includes sandboxed multi-worker workspace and scoped cluster compute aligned to SCI 301 labs.',
    competencies: [
      'Parallel tree-search & evolutionary program synthesis (MAP-Elites, MCTS)',
      'Multi-fidelity evaluation (Hyperband/ASHA) to prune weak hypotheses early',
      'Compute-budget scheduling across heterogeneous CPU/GPU worker pools',
      'Automated benchmark leaderboards, provenance ledgers, and safety halts',
    ],
    planId: 'course-sci-301',
    facultyBots: ['@Sci', '@Dev', '@Data', '@QA'],
    docsLinks: [
      { label: 'Self-Improvement Architecture', href: 'https://docs.hanzo.ai/docs/self-improvement', kind: 'quickstart' },
      { label: 'Auto-Drive & Headless Agents', href: 'https://docs.hanzo.ai/docs/agents/headless', kind: 'guide' },
      { label: 'Leaderboard & Benchmark CLI', href: 'https://docs.hanzo.ai/docs/cli/leaderboard', kind: 'reference' },
    ],
    learnWorkspaceUrl: learnUrl('research-autopilot'),
    syllabus: [
      {
        week: 'Week 1',
        code: 'SCI 301.1',
        title: 'Evolutionary Search & Quality-Diversity Archives',
        summary: 'Maintain diverse, high-performing solution lineages instead of collapsing into local optima.',
        lectures: [
          'Quality-diversity algorithms (MAP-Elites) for code, prompts, and architectures',
          'Monte Carlo Tree Search over hypothesis graphs',
          'Archive indexing and cross-lineage mutation operators',
        ],
        readings: ['Mouret & Clune: Illuminating Search Spaces by Mapping Elites'],
        lab: 'Lab 1: Build a quality-diversity archive storing verified experiment candidates across accuracy/latency niches.',
      },
      {
        week: 'Week 2',
        code: 'SCI 301.2',
        title: 'Multi-Fidelity Pruning & Compute Scheduling',
        summary: 'Spend GPU hours only on promising hypotheses using staged proxies and successive halving.',
        lectures: [
          'Successive Halving (ASHA) and Hyperband for research campaigns',
          'Proxy-to-full-scale rank correlation diagnostics',
          'Queue scheduling across heterogeneous compute pools with spend caps',
        ],
        readings: ['Li et al.: System for Massively Parallel Hyperparameter Tuning (ASHA)'],
        lab: 'Lab 2: Implement a 3-stage multi-fidelity pruning pipeline cutting compute cost by >60% on a search benchmark.',
      },
      {
        week: 'Week 3',
        code: 'SCI 301.3',
        title: 'Continuous Leaderboards, Drift Detection & Safety Halts',
        summary: 'Prevent specification gaming across hundreds of automated research iterations.',
        lectures: [
          'Holdout rotation and blind evaluation sets to prevent meta-overfitting',
          'Automated anomaly detection and kill-switches for runaway resource usage',
          'Cryptographic provenance logging of datasets, diffs, and scores',
        ],
        readings: ['Hanzo Docs: Evaluation & Governance'],
        lab: 'Lab 3: Add blind-holdout verification and automated anomaly kill-switches to your autopilot loop.',
      },
      {
        week: 'Week 4',
        code: 'SCI 301.4',
        title: 'Fleet Research Autopilot Capstone Defense',
        summary: 'Run a full multi-worker Research Autopilot campaign and present audited Pareto breakthroughs.',
        lectures: [
          'Synthesizing executive & technical discovery digests from hundreds of runs',
          'Human-on-the-loop steering: injecting new priors mid-campaign',
          'Capstone defense',
        ],
        readings: ['Hanzo Docs: Workflows & Observability'],
        lab: 'Capstone Project: Operate a parallel Research Autopilot system discovering and verifying Pareto-optimal solutions.',
      },
    ],
  },
  {
    slug: 'recursive-improvement',
    code: 'SCI 401',
    title: 'Recursive Intelligence Improvement',
    credential: 'HRII',
    credentialFull: 'Hanzo Recursive Intelligence Improvement Fellow',
    school: 'science',
    price: 499,
    duration: '6 Weeks · Frontier Research',
    level: 'Staff / Research Fellow',
    prerequisites: 'SCI 301 + RL 101 or ZEN 301',
    summary:
      'Study and engineer bounded recursive self-improvement loops—where models generate verified training data, refine their own harnesses, optimize inference/training algorithms, and undergo strict formal verification before self-promotion.',
    capstone:
      'Design, execute, and formally audit a multi-generation bounded self-improvement loop (data → train → verify → promote) demonstrating measurable generational gains with zero safety-invariant regressions.',
    capstoneArtifact: 'Audited Multi-Generation Recursive Improvement Loop',
    labComputeNote: 'Includes isolated research cluster sandbox and scoped multi-generation training compute aligned to SCI 401 labs.',
    competencies: [
      'Self-play, synthetic verifier loops, and STaR / iterative RLVR architectures',
      'Model collapse prevention: entropy monitoring, real-data anchoring, and diversity checks',
      'Automated harness & algorithm self-modification inside air-gapped sandboxes',
      'Formal safety invariants, capability evaluations, and human-approved promotion gates',
    ],
    planId: 'course-sci-401',
    facultyBots: ['@Sci', '@Dev', '@Cyber', '@QA'],
    docsLinks: [
      { label: 'Self-Improvement Specification', href: 'https://docs.hanzo.ai/docs/self-improvement', kind: 'quickstart' },
      { label: 'Agent Consensus & Verification', href: 'https://docs.hanzo.ai/docs/zap/advanced/agent-consensus', kind: 'reference' },
      { label: 'Platform Sandboxing', href: 'https://docs.hanzo.ai/docs/dev/configuration/platform-sandboxing', kind: 'guide' },
    ],
    learnWorkspaceUrl: learnUrl('recursive-improvement'),
    syllabus: [
      {
        week: 'Week 1',
        code: 'SCI 401.1',
        title: 'Foundations & Limits of Recursive Self-Improvement',
        summary: 'Separate rigorous engineering from hype: analyze scaling limits, verifier bottlenecks, and bounded improvement loops.',
        lectures: [
          'The verifier asymmetry: why verification is cheaper than generation',
          'Taxonomies of recursion: data recursion, harness recursion, and algorithm recursion',
          'Entropy decay and model collapse in iterative synthetic training',
        ],
        readings: ['Shumailov et al.: AI Models Collapse When Trained on Recursively Generated Data'],
        lab: 'Lab 1: Reproduce synthetic collapse on a toy distribution and eliminate it with verifiable filtering + real anchoring.',
      },
      {
        week: 'Week 2',
        code: 'SCI 401.2',
        title: 'Iterative Self-Play & Verifiable Reasoning Loops',
        summary: 'Build multi-generation STaR and RLVR loops grounded in formal compilers, proof assistants, and unit tests.',
        lectures: [
          'Self-Taught Reasoner (STaR), ReST-EM, and iterative GRPO cycles',
          'Curriculum auto-generation: synthesizing progressively harder verified tasks',
          'Preventing solution memorization via procedural problem generators',
        ],
        readings: ['Zelikman et al.: STaR: Bootstrapping Reasoning With Reasoning'],
        lab: 'Lab 2: Run a 3-generation verifiable self-play loop and measure out-of-distribution transfer.',
      },
      {
        week: 'Week 3',
        code: 'SCI 401.3',
        title: 'Self-Improving Agent Harnesses & Toolchains',
        summary: 'Allow agents to inspect their own failure traces, patch prompts/tools/routers, and validate changes hermetically.',
        lectures: [
          'Failure-trace mining and automated harness patch proposals',
          'Hermetic sandbox testing of agent self-modifications',
          'Preventing meta-gaming of evaluation scripts via immutable verifier containers',
        ],
        readings: ['Hanzo Docs: Self-Improvement Architecture'],
        lab: 'Lab 3: Build a hermetic harness optimizer that improves coding-agent pass rate across 3 verified generations.',
      },
      {
        week: 'Week 4',
        code: 'SCI 401.4',
        title: 'Algorithmic Discovery & Automated Kernel/Loss Evolution',
        summary: 'Use evolutionary search and symbolic verification to discover improved optimizers, schedules, and kernels.',
        lectures: [
          'Program-space search for training objectives and scheduling heuristics',
          'Automated equivalence & stability checks before full-scale trials',
          'Accounting for compute overhead in net efficiency measurements',
        ],
        readings: ['Chen et al.: Symbolic Discovery of Optimization Algorithms (Lion)'],
        lab: 'Lab 4: Evolve and benchmark a custom learning-rate or routing heuristic under strict wall-clock budgets.',
      },
      {
        week: 'Week 5',
        code: 'SCI 401.5',
        title: 'Safety Invariants, Containment & Red-Team Gating',
        summary: 'Guarantee every generational promotion preserves security boundaries, calibration, and human oversight.',
        lectures: [
          'Immutable safety benchmarks and capability-threshold alerts',
          'Air-gapped evaluation sandboxes and signed promotion manifests',
          'Multi-party human sign-off for generational weight promotion',
        ],
        readings: ['Hanzo Docs: Security & Consensus Verification'],
        lab: 'Lab 5: Implement a signed promotion gate that blocks any candidate violating safety or calibration bounds.',
      },
      {
        week: 'Week 6',
        code: 'SCI 401.6',
        title: 'Multi-Generation Improvement Capstone Defense',
        summary: 'Execute and defend an audited multi-generation recursive improvement pipeline.',
        lectures: [
          'Longitudinal generational telemetry: gain curves, diversity metrics, and compute ROI',
          'Independent replication audit and peer defense',
          'Fellowship capstone verification',
        ],
        readings: ['Hanzo Research: Bounded Recursive Engineering Standards'],
        lab: 'Capstone Project: Deliver an audited 3-generation improvement loop with verified holdout gains and zero safety regressions.',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // SCHOOL 03: SCHOOL OF CYBERSECURITY (4 courses)
  // ═══════════════════════════════════════════════════════════════════════
  {
    slug: 'ai-security-fundamentals',
    code: 'CYB 101',
    title: 'AI Security Fundamentals',
    credential: 'HAISF',
    credentialFull: 'Hanzo Certified AI Security Fundamentals',
    school: 'cybersecurity',
    price: 99,
    duration: '3 Weeks · Self-Paced',
    level: 'Foundational',
    prerequisites: 'Basic software engineering or security operations familiarity',
    summary:
      'Understand and mitigate the full attack surface of modern AI systems. Master prompt injection, indirect tool hijacking, data poisoning, model extraction, PII leakage, OWASP LLM Top 10, and Kai-based defense-in-depth.',
    capstone:
      'Audit a vulnerable AI application, document exploit paths, and harden it with input/output guards, least-privilege tool scopes, and automated regression tests.',
    capstoneArtifact: 'Hardened AI App & Threat-Model Audit Suite',
    labComputeNote: 'Includes isolated security sandbox and scoped compute aligned to CYB 101 labs.',
    competencies: [
      'AI threat modeling across prompts, RAG pipelines, tools, and model weights',
      'Direct & indirect prompt injection, jailbreaks, and tool-parameter hijacking',
      'PII redaction, secrets protection, and Kai injection_screen / command_guard gates',
      'Automated security regression harnesses mapped to OWASP LLM & Agentic Top 10',
    ],
    planId: 'course-cyb-101',
    featured: true,
    facultyBots: ['@Cyber', '@Edu', '@QA', '@Doc'],
    docsLinks: [
      { label: 'Security CLI Reference', href: 'https://docs.hanzo.ai/docs/cli/security', kind: 'quickstart' },
      { label: 'Execution Policy & Guardrails', href: 'https://docs.hanzo.ai/docs/dev/usage/execpolicy', kind: 'guide' },
      { label: 'Kai Security Gates Guide', href: 'https://docs.hanzo.ai/docs/guides/kai', kind: 'guide' },
    ],
    learnWorkspaceUrl: learnUrl('ai-security-fundamentals'),
    syllabus: [
      {
        week: 'Week 1',
        code: 'CYB 101.1',
        title: 'AI Threat Modeling & The Prompt/RAG Attack Surface',
        summary: 'Map trust boundaries across user inputs, retrieved documents, system instructions, and downstream APIs.',
        lectures: [
          'Why LLMs conflate control plane and data plane',
          'Direct prompt injection, indirect RAG poisoning, and cross-tenant context leakage',
          'Mapping architectures against OWASP Top 10 for LLM & Agentic Applications',
        ],
        readings: ['OWASP Top 10 for Large Language Model Applications'],
        lab: 'Lab 1: Exploit and patch an indirect prompt-injection vulnerability inside a RAG support assistant.',
      },
      {
        week: 'Week 2',
        code: 'CYB 101.2',
        title: 'Tool Abuse, Secrets Protection & Kai Security Gates',
        summary: 'Enforce least-privilege capabilities, strict schema validation, and deterministic security screening.',
        lectures: [
          'Confused-deputy attacks in MCP and function-calling agents',
          'Secret scoping via KMS, output DLP redaction, and egress allowlists',
          'Deploying Kai injection_screen and command_guard gates before tool execution',
        ],
        readings: ['Hanzo Docs: Execution Policy & KMS'],
        lab: 'Lab 2: Harden a tool-calling agent with capability scopes, KMS secret isolation, and Kai command guards.',
      },
      {
        week: 'Week 3',
        code: 'CYB 101.3',
        title: 'Model Security, Supply Chain & Security Audit Capstone',
        summary: 'Secure weights, dependencies, and MCP servers with SBOMs and automated red-team CI suites.',
        lectures: [
          'Unsafe serialization (pickle) vs safetensors, weight checksums, and SBOM verification',
          'Automated adversarial test suites in CI/CD',
          'Capstone security remediation defense',
        ],
        readings: ['Hanzo Docs: SBOM & Security Auditing'],
        lab: 'Capstone Project: Perform a full exploit-and-remediation audit on a multi-tool AI app achieving 100% defense pass rate.',
      },
    ],
  },
  {
    slug: 'agentic-cybersecurity',
    code: 'CYB 201',
    title: 'Agentic Cybersecurity',
    credential: 'HACE-SEC',
    credentialFull: 'Hanzo Certified Agentic Cybersecurity Engineer',
    school: 'cybersecurity',
    price: 199,
    duration: '4 Weeks · Applied Cyber Lab',
    level: 'Intermediate',
    prerequisites: 'CYB 101 or security engineering experience + Linux/networking fluency',
    summary:
      'Build autonomous offensive-defense verification and continuous vulnerability discovery pipelines using Hanzo Cyber and OpenCyber. Engineer red-team agents, automated exploit validation in sandboxes, and patch-synthesis workflows.',
    capstone:
      'Deploy a Hanzo Cyber / OpenCyber agent workflow that discovers vulnerabilities in isolated target services, generates verified PoCs inside microVMs, and synthesizes passing security patches.',
    capstoneArtifact: 'Hanzo Cyber / OpenCyber Vulnerability & Patch Pipeline',
    labComputeNote: 'Includes isolated cyber-range microVM sandboxes and scoped compute aligned to CYB 201 labs.',
    competencies: [
      'Hanzo Cyber and OpenCyber autonomous security agent workflows',
      'AST-guided static analysis paired with dynamic sandbox exploit verification',
      'Automated red-teaming of web services, APIs, and AI agent deployments',
      'Verified security patch synthesis and zero-regression test validation',
    ],
    planId: 'course-cyb-201',
    featured: true,
    facultyBots: ['@Cyber', '@Dev', '@QA', '@Doc'],
    docsLinks: [
      { label: 'Security & Patrol CLI', href: 'https://docs.hanzo.ai/docs/cli/security', kind: 'quickstart' },
      { label: 'Platform Sandboxing', href: 'https://docs.hanzo.ai/docs/dev/configuration/platform-sandboxing', kind: 'guide' },
      { label: 'Agents Architecture', href: 'https://docs.hanzo.ai/docs/concepts/agents', kind: 'reference' },
    ],
    learnWorkspaceUrl: learnUrl('agentic-cybersecurity'),
    syllabus: [
      {
        week: 'Week 1',
        code: 'CYB 201.1',
        title: 'Hanzo Cyber & OpenCyber Architecture',
        summary: 'Configure authorized cyber-range sandboxes and wire OpenCyber scanning, triage, and verification agents.',
        lectures: [
          'Rules of engagement, scope locks, and deterministic sandboxed cyber ranges',
          'Hanzo Cyber & OpenCyber agent primitives: recon, static taint analysis, and PoC runners',
          'Eliminating false positives via executable proof-of-vulnerability harnesses',
        ],
        readings: ['Hanzo Docs: Security & Sandbox Isolation'],
        lab: 'Lab 1: Deploy an isolated cyber-range target and run an OpenCyber triage agent to separate true positives from scanner noise.',
      },
      {
        week: 'Week 2',
        code: 'CYB 201.2',
        title: 'Autonomous Vulnerability Discovery & PoC Verification',
        summary: 'Combine AST call-graph tracing with dynamic fuzzing to find real authorization, injection, and memory bugs.',
        lectures: [
          'Code-graph taint tracking across authentication and data boundaries',
          'Agent-driven API fuzzing and stateful session testing',
          'Reproducible PoC packaging with severity scoring (CVSS + exploitability)',
        ],
        readings: ['DARPA AIxCC Technical Overview: Autonomous Cyber Reasoning Systems'],
        lab: 'Lab 2: Build an agent that locates an auth-bypass defect and emits a deterministic failing security test.',
      },
      {
        week: 'Week 3',
        code: 'CYB 201.3',
        title: 'Automated Patch Synthesis & Regression Proof',
        summary: 'Close the discover-to-remediate loop so every confirmed vulnerability receives a tested, minimal fix PR.',
        lectures: [
          'Synthesizing least-invasive security patches without breaking functional suites',
          'Re-running exploit PoCs to confirm remediation and checking side-effect regressions',
          'AI red-teaming agents: probing LLM apps for prompt/tool hijacking',
        ],
        readings: ['Hanzo Docs: Coding Agents & CI Verification'],
        lab: 'Lab 3: Automate end-to-end PoC verification → patch generation → green security + unit CI.',
      },
      {
        week: 'Week 4',
        code: 'CYB 201.4',
        title: 'Continuous Purple-Team Capstone Defense',
        summary: 'Operate red and blue agents together in a controlled range and defend your remediation metrics.',
        lectures: [
          'Purple-team feedback loops: feeding verified exploits into detection rules',
          'Audit trails, disclosure reporting, and human approval workflows',
          'Capstone cyber-range defense',
        ],
        readings: ['Hanzo Docs: Audit & Compliance Tooling'],
        lab: 'Capstone Project: Deploy an OpenCyber discover-verify-patch pipeline resolving seeded multi-service vulnerabilities.',
      },
    ],
  },
  {
    slug: 'autonomous-secops',
    code: 'CYB 301',
    title: 'Autonomous Security Operations',
    credential: 'HASO',
    credentialFull: 'Hanzo Certified Autonomous SecOps Engineer',
    school: 'cybersecurity',
    price: 299,
    duration: '4 Weeks · Operations Lab',
    level: 'Advanced',
    prerequisites: 'CYB 201 or SOC/IR engineering experience',
    summary:
      'Build self-healing security operations powered by Kai triage gates, real-time telemetry ingestion, automated incident investigation, containment playbooks, and continuous detection engineering.',
    capstone:
      'Deploy an Autonomous SecOps pipeline that ingests live security telemetry, triages alerts with Kai, executes sandboxed containment playbooks, and generates audited post-incident reports.',
    capstoneArtifact: 'Autonomous SecOps Triage & Containment Engine',
    labComputeNote: 'Includes simulated SOC telemetry range and scoped compute aligned to CYB 301 labs.',
    competencies: [
      'High-volume alert triage and deduplication with zero-token Kai classifiers',
      'Autonomous incident investigation across logs, cloud IAM, and network flows',
      'Policy-bounded automated containment (token revocation, pod quarantine, WAF rules)',
      'Detection-as-code Autopilot loops and MTTD/MTTR optimization',
    ],
    planId: 'course-cyb-301',
    facultyBots: ['@Cyber', '@Dev', '@Data', '@QA'],
    docsLinks: [
      { label: 'Triage Cookbook', href: 'https://docs.hanzo.ai/docs/guides/cookbook/triage', kind: 'quickstart' },
      { label: 'Observability & Audit CLI', href: 'https://docs.hanzo.ai/docs/cli/audit', kind: 'reference' },
      { label: 'IAM & Policy Reference', href: 'https://docs.hanzo.ai/docs/cli/iam', kind: 'reference' },
    ],
    learnWorkspaceUrl: learnUrl('autonomous-secops'),
    syllabus: [
      {
        week: 'Week 1',
        code: 'CYB 301.1',
        title: 'Telemetry Ingestion & Kai Real-Time Alert Triage',
        summary: 'Eliminate SOC alert fatigue using structured schemas, correlation graphs, and calibrated Kai severity classifiers.',
        lectures: [
          'Normalizing cloud audit logs, eBPF runtime events, and AI gateway telemetry',
          'Sub-50ms Kai alert scoring and false-positive suppression with abstention',
          'Entity-relationship correlation across identities, tokens, and hosts',
        ],
        readings: ['Hanzo Cookbook: Triage Pipelines'],
        lab: 'Lab 1: Ingest simulated attack streams and cut false-positive alert escalations by >85% without missed true positives.',
      },
      {
        week: 'Week 2',
        code: 'CYB 301.2',
        title: 'Autonomous Investigation & Root-Cause Graph Assembly',
        summary: 'Equip SecOps agents with read-only forensic tools to reconstruct attack timelines automatically.',
        lectures: [
          'Safe read-only forensic tool suites (log query, IAM diff, process tree inspection)',
          'Evidence-backed timeline synthesis with strict citation to raw log IDs',
          'Handling adversarial log tampering and prompt injection inside attacker payloads',
        ],
        readings: ['Hanzo Docs: Audit & Observability'],
        lab: 'Lab 2: Build an investigation agent that reconstructs a multi-step credential compromise from raw logs.',
      },
      {
        week: 'Week 3',
        code: 'CYB 301.3',
        title: 'Policy-Bounded Containment & Self-Healing Playbooks',
        summary: 'Automate high-confidence containment actions while enforcing approval gates on destructive changes.',
        lectures: [
          'Blast-radius tiering: auto-revoke vs quarantine vs human-approval gates',
          'Reversible containment playbooks: session revocation, egress blocks, and pod isolation',
          'Dry-run simulation and rollback verification for automated responses',
        ],
        readings: ['Hanzo Docs: IAM & Execution Policies'],
        lab: 'Lab 3: Execute automated containment against simulated lateral movement with zero unintended service outage.',
      },
      {
        week: 'Week 4',
        code: 'CYB 301.4',
        title: 'Detection Autopilot & SecOps Capstone Defense',
        summary: 'Continuously improve detection rules from incident learnings and defend your SOC pipeline against live scenarios.',
        lectures: [
          'Translating verified incident traces into regression detection rules',
          'Measuring MTTD, MTTR, precision, and operator override rates',
          'Capstone live-fire incident simulation',
        ],
        readings: ['Hanzo Docs: Self-Improvement Loops'],
        lab: 'Capstone Project: Defend a simulated enterprise cluster across three staged attack campaigns with full audit trail.',
      },
    ],
  },
  {
    slug: 'sovereign-zero-trust-ai',
    code: 'CYB 401',
    title: 'Sovereign and Zero-Trust AI',
    credential: 'HSZT',
    credentialFull: 'Hanzo Certified Sovereign & Zero-Trust AI Architect',
    school: 'cybersecurity',
    price: 449,
    duration: '5 Weeks · Infrastructure Lab',
    level: 'Staff / Principal',
    prerequisites: 'CYB 201 or distributed systems & Kubernetes/Linux security experience',
    summary:
      'Architect sovereign, zero-trust, and offline-capable AI infrastructure. Master MicroVM isolation, Hanzo IAM & KMS envelope encryption, Reticulum Network Stack (RNS) mesh transport, post-quantum ZAP RPC, and air-gapped local model execution.',
    capstone:
      'Deploy a sovereign zero-trust AI runtime combining MicroVM sandboxing, scoped IAM/KMS secrets, post-quantum ZAP/RNS transport, and verified offline open-weight model execution.',
    capstoneArtifact: 'Sovereign Zero-Trust & Offline AI Runtime',
    labComputeNote: 'Includes isolated MicroVM infrastructure lab and scoped compute aligned to CYB 401 labs.',
    competencies: [
      'MicroVM kernel isolation (Hanzo Visor / Firecracker) for untrusted agent execution',
      'Zero-trust identity & secrets with Hanzo IAM, KMS BYOK, and least-privilege tokens',
      'Post-quantum ZAP RPC (ML-KEM / ML-DSA) and Reticulum Network Stack (RNS) transport',
      'Air-gapped & offline open-weight model serving with verifiable cryptographic audit logs',
    ],
    planId: 'course-cyb-401',
    facultyBots: ['@Cyber', '@Dev', '@Doc', '@QA'],
    docsLinks: [
      { label: 'Post-Quantum ZAP Docs', href: 'https://docs.hanzo.ai/docs/zap/advanced/post-quantum', kind: 'quickstart' },
      { label: 'Self-Hosting & Sovereignty', href: 'https://docs.hanzo.ai/docs/self-hosting', kind: 'guide' },
      { label: 'Multi-Tenancy & IAM Concepts', href: 'https://docs.hanzo.ai/docs/concepts/multitenancy', kind: 'reference' },
      { label: 'KMS & Secrets CLI', href: 'https://docs.hanzo.ai/docs/cli/kms', kind: 'reference' },
    ],
    learnWorkspaceUrl: learnUrl('sovereign-zero-trust-ai'),
    syllabus: [
      {
        week: 'Week 1',
        code: 'CYB 401.1',
        title: 'MicroVM Isolation & Untrusted Execution Boundaries',
        summary: 'Replace shared container assumptions with hardware-virtualized MicroVMs and strict seccomp/network jails.',
        lectures: [
          'Container escape vectors vs MicroVM hypervisor boundaries',
          'Ephemeral rootfs snapshots, egress filtering, and read-only policy mounts',
          'Attesting runtime integrity before releasing secrets to workloads',
        ],
        readings: ['Hanzo Docs: Platform Sandboxing'],
        lab: 'Lab 1: Provision hardened MicroVM agent workers with default-deny network egress and verified snapshot resets.',
      },
      {
        week: 'Week 2',
        code: 'CYB 401.2',
        title: 'Zero-Trust IAM, Short-Lived Credentials & KMS Envelope Encryption',
        summary: 'Eliminate static API keys and enforce per-tenant cryptographic isolation across inference and storage.',
        lectures: [
          'Hanzo IAM OIDC/RBAC/ABAC and scoped capability tokens for autonomous agents',
          'KMS envelope encryption, Bring-Your-Own-Key (BYOK), and zero-retention inference',
          'Cryptographic audit logs for regulated healthcare, finance, and defense workloads',
        ],
        readings: ['Hanzo Docs: Multi-Tenancy & KMS'],
        lab: 'Lab 2: Configure multi-tenant IAM + KMS envelope encryption ensuring zero cross-tenant key visibility.',
      },
      {
        week: 'Week 3',
        code: 'CYB 401.3',
        title: 'Post-Quantum ZAP RPC & Reticulum Network Stack (RNS)',
        summary: 'Secure agent-to-agent and edge-to-cluster links across hostile or degraded networks.',
        lectures: [
          'NIST FIPS 203 (ML-KEM) & FIPS 204 (ML-DSA) inside ZAP binary channels',
          'Reticulum Network Stack (RNS): cryptographic addressing and delay-tolerant mesh transport',
          'Mutual authentication without centralized certificate authorities',
        ],
        readings: ['Hanzo Docs: ZAP Post-Quantum & DID Specifications'],
        lab: 'Lab 3: Establish an authenticated post-quantum ZAP/RNS tunnel between isolated agent nodes.',
      },
      {
        week: 'Week 4',
        code: 'CYB 401.4',
        title: 'Air-Gapped & Offline Sovereign AI Execution',
        summary: 'Run open-weight Zen models, Kai gates, vector stores, and MCP tools completely offline with zero external calls.',
        lectures: [
          'Packaging signed model weights, container bundles, and local retrieval indexes',
          'Offline license & artifact verification without internet egress',
          'Hardware security keys and physical authorization workflows',
        ],
        readings: ['Hanzo Docs: Self-Hosting Offline Bundles'],
        lab: 'Lab 4: Boot and verify a complete air-gapped Zen + Kai + MCP stack with network egress severed.',
      },
      {
        week: 'Week 5',
        code: 'CYB 401.5',
        title: 'Sovereign Zero-Trust Capstone Defense',
        summary: 'Pass an adversarial penetration and offline-continuity audit of your sovereign AI architecture.',
        lectures: [
          'Red-teaming zero-trust boundaries: lateral movement, secret exfiltration, and covert channels',
          'Mapping technical security controls to external enterprise audit frameworks',
          'Capstone architecture defense',
        ],
        readings: ['NIST SP 800-207: Zero Trust Architecture'],
        lab: 'Capstone Project: Deliver a verified sovereign zero-trust AI deployment passing egress, IAM, PQC, and offline tests.',
      },
    ],
  },

  // ═══════════════════════════════════════════════════════════════════════
  // SCHOOL 04: SCHOOL OF AUTONOMOUS BUSINESS & ENTREPRENEURSHIP (6 courses)
  // ═══════════════════════════════════════════════════════════════════════
  {
    slug: 'business-autopilot',
    code: 'AUTO 201',
    title: 'Business Autopilot',
    credential: 'HBAP',
    credentialFull: 'Hanzo Certified Business Autopilot Operator',
    school: 'business',
    price: 199,
    duration: '3 Weeks · Applied Business Lab',
    level: 'Intermediate',
    prerequisites: 'AUTO 101 (recommended) + familiarity with SaaS metrics and APIs/webhooks',
    summary:
      'Turn revenue, support, pricing, and operations into continuous closed-loop improvement systems. Wire real business telemetry to Autopilot experiments, Kai decision gates, and guardrailed agent workflows.',
    capstone:
      'Build and launch a live Business Autopilot loop connecting CRM/billing/support events to automated experimentation, KPI guardrails, and daily operator briefings.',
    capstoneArtifact: 'Live Business Autopilot Telemetry & Optimization Engine',
    labComputeNote: 'Includes sandboxed business-simulation workspace and scoped compute aligned to AUTO 201 labs.',
    competencies: [
      'Instrumenting unit economics (CAC, LTV, retention, margin) for automated loops',
      'Autonomous support triage, onboarding flows, and churn-risk intervention',
      'Pricing, funnel, and offer experimentation with bandit allocation & margin floors',
      'Human-on-the-loop approval thresholds and financial circuit breakers',
    ],
    planId: 'course-auto-201',
    featured: true,
    facultyBots: ['@Edu', '@Data', '@Dev', '@Lang'],
    docsLinks: [
      { label: 'Run Your Org Guide', href: 'https://docs.hanzo.ai/docs/run-your-org', kind: 'quickstart' },
      { label: 'Business Apps & Automation', href: 'https://docs.hanzo.ai/docs/apps/business', kind: 'guide' },
      { label: 'Auto & Workflow CLI', href: 'https://docs.hanzo.ai/docs/cli/auto', kind: 'reference' },
    ],
    learnWorkspaceUrl: learnUrl('business-autopilot'),
    syllabus: [
      {
        week: 'Week 1',
        code: 'AUTO 201.1',
        title: 'Business Telemetry, North-Star Metrics & Guardrails',
        summary: 'Connect billing, CRM, product analytics, and support queues into a single causal metric layer.',
        lectures: [
          'Translating P&L objectives into measurable, non-gameable guardrail metrics',
          'Event-driven webhooks and unified customer state in Hanzo Base',
          'Setting hard financial, brand, and compliance boundaries before automating',
        ],
        readings: ['Hanzo Docs: Run Your Organization & Analytics'],
        lab: 'Lab 1: Wire simulated SaaS billing and product events into a real-time unit-economics dashboard with anomaly alerts.',
      },
      {
        week: 'Week 2',
        code: 'AUTO 201.2',
        title: 'Autonomous Revenue, Retention & Support Loops',
        summary: 'Deploy Kai-gated workflows that handle onboarding, ticket resolution, and churn recovery continuously.',
        lectures: [
          'Kai-gated customer support resolution vs escalation SLAs',
          'Lifecycle triggers: activation nudges, expansion signals, and renewal workflows',
          'Multi-armed bandit testing on onboarding and pricing pages',
        ],
        readings: ['Hanzo Docs: Guides for Store, Money & Automation'],
        lab: 'Lab 2: Build an automated churn-intervention and support-triage loop with strict escalation policies.',
      },
      {
        week: 'Week 3',
        code: 'AUTO 201.3',
        title: 'Operator Dashboards, Audits & Capstone Launch',
        summary: 'Give founders and operators full visibility and instant override control over automated business loops.',
        lectures: [
          'Automated daily operator digests: what changed, why, and verified dollar impact',
          'Approval queues for high-impact actions (refunds, pricing shifts, outbound sends)',
          'Capstone simulation verification',
        ],
        readings: ['Hanzo Docs: Governance & Billing Controls'],
        lab: 'Capstone Project: Operate a closed-loop Business Autopilot improving net retention within strict margin guardrails.',
      },
    ],
  },
  {
    slug: 'autonomous-organizations',
    code: 'AUTO 301',
    title: 'Autonomous Organizations',
    credential: 'HAOA',
    credentialFull: 'Hanzo Certified Autonomous Organization Architect',
    school: 'business',
    price: 299,
    duration: '4 Weeks · Systems & Org Lab',
    level: 'Advanced',
    prerequisites: 'AUTO 201 or engineering/operations leadership experience',
    summary:
      'Design AI-native organizations where specialized human teams and autonomous agent departments coordinate across engineering, product, growth, finance, legal, and compliance with explicit governance and accountability.',
    capstone:
      'Architect and simulate an end-to-end multi-department autonomous organization blueprint with IAM role boundaries, delegated spend budgets, audit trails, and escalation protocols.',
    capstoneArtifact: 'Multi-Department Autonomous Organization Blueprint & Runtime',
    labComputeNote: 'Includes sandboxed multi-agent org workspace and scoped compute aligned to AUTO 301 labs.',
    competencies: [
      'Org-level agent topology: engineering, growth, finance, support, and security departments',
      'Hierarchical IAM permissions, approval matrices, and delegated micro-USD budgets',
      'Shared institutional memory, decision ledgers, and cross-team handoff protocols',
      'Risk governance, auditability, and human executive control planes',
    ],
    planId: 'course-auto-301',
    facultyBots: ['@Edu', '@Dev', '@Cyber', '@Lang'],
    docsLinks: [
      { label: 'Run Your Org Architecture', href: 'https://docs.hanzo.ai/docs/run-your-org', kind: 'quickstart' },
      { label: 'Company & Teams CLI', href: 'https://docs.hanzo.ai/docs/cli/company', kind: 'reference' },
      { label: 'Teams Usage & Governance', href: 'https://docs.hanzo.ai/docs/usage/teams', kind: 'guide' },
    ],
    learnWorkspaceUrl: learnUrl('autonomous-organizations'),
    syllabus: [
      {
        week: 'Week 1',
        code: 'AUTO 301.1',
        title: 'Human-Agent Organizational Topology & Boundaries',
        summary: 'Define which decisions belong to humans, which belong to Kai gates, and how departments hand off work.',
        lectures: [
          'Designing lean AI-native teams: high-agency humans supervising specialist agent fleets',
          'Department contracts: Engineering, Growth, Finance, Support, and Legal interfaces',
          'Preventing coordination thrash with typed work-item schemas',
        ],
        readings: ['Hanzo Docs: Run Your Org'],
        lab: 'Lab 1: Model a 5-department autonomous org graph with typed handoff contracts and SLA monitors.',
      },
      {
        week: 'Week 2',
        code: 'AUTO 301.2',
        title: 'Delegated Budgets, IAM Permissions & Approval Chains',
        summary: 'Implement least-privilege organizational controls so agents can execute fast without unbounded liability.',
        lectures: [
          'Departmental budget envelopes and automated treasury controls',
          'Role-based IAM policies and multi-signature approvals for high-risk actions',
          'Separation of duties: builders vs verifiers vs approvers',
        ],
        readings: ['Hanzo Docs: Budgets & Multi-Tenancy'],
        lab: 'Lab 2: Implement tiered spending authorities and dual-control approval workflows in IAM.',
      },
      {
        week: 'Week 3',
        code: 'AUTO 301.3',
        title: 'Institutional Memory & Continuous Org Learning',
        summary: 'Keep every agent and human aligned on live strategy, customer truth, and post-mortem lessons.',
        lectures: [
          'Shared knowledge bases, decision records (ADRs), and conflict resolution',
          'Automated OKR tracking and bottleneck identification',
          'Data-room documentation, governance policies, and immutable decision audit trails',
        ],
        readings: ['Hanzo Docs: Memory & Dataroom CLI'],
        lab: 'Lab 3: Wire an institutional memory layer that updates department policies from verified incident retrospectives.',
      },
      {
        week: 'Week 4',
        code: 'AUTO 301.4',
        title: 'Autonomous Organization Simulation & Capstone Defense',
        summary: 'Stress-test your autonomous organization against market shifts, incidents, and audit requests.',
        lectures: [
          'Tabletop crisis simulations: outage + PR + billing spike simultaneously',
          'Executive control planes and real-time pause/override switches',
          'Capstone architecture defense',
        ],
        readings: ['Hanzo Docs: Governance Blueprints'],
        lab: 'Capstone Project: Run a multi-department org simulation passing governance, budget, and incident-response gates.',
      },
    ],
  },
  {
    slug: 'build-your-ai-company',
    code: 'ENT 401',
    title: 'Build Your Own AI Company',
    credential: 'HAIF',
    credentialFull: 'Hanzo Certified AI Founder & Company Builder',
    school: 'business',
    price: 399,
    duration: '6 Weeks · Founder Launch Studio',
    level: 'Founder / Advanced',
    prerequisites: 'Builder mindset + familiarity with web apps or APIs (AUTO 101 recommended)',
    summary:
      'Go from zero to a live, revenue-ready AI company on real infrastructure. Build white-label AI products, train custom vertical models, expose metered APIs, deploy sovereign hosting, wire billing and licensing, and ship scalable distribution.',
    capstone:
      'Launch a live, production AI product with custom domain, IAM authentication, custom model/capability endpoint, metered billing checkout, and an initial distribution funnel.',
    capstoneArtifact: 'Live Revenue-Ready AI Product with Billing, API & Distribution',
    labComputeNote: 'Includes founder launch workspace and scoped sandbox compute aligned to ENT 401 launch labs.',
    competencies: [
      'White-label AI product architecture on Hanzo Cloud, Base, and IAM',
      'Vertical differentiation with custom Kai decision models and fine-tuned Zen endpoints',
      'Metered APIs, usage-based billing, subscriptions, and commercial licensing',
      'Production hosting, multi-tenant isolation, and automated GTM distribution',
    ],
    planId: 'course-ent-401',
    featured: true,
    facultyBots: ['@Edu', '@Dev', '@Lang', '@Cyber'],
    docsLinks: [
      { label: 'Hanzo for Startups', href: 'https://docs.hanzo.ai/docs/startups', kind: 'quickstart' },
      { label: 'Monetization & Money Guide', href: 'https://docs.hanzo.ai/docs/guides/money', kind: 'guide' },
      { label: 'Store & Commerce Guide', href: 'https://docs.hanzo.ai/docs/guides/store', kind: 'guide' },
      { label: 'Billing & Licensing CLI', href: 'https://docs.hanzo.ai/docs/cli/billing', kind: 'reference' },
    ],
    learnWorkspaceUrl: learnUrl('build-your-ai-company'),
    syllabus: [
      {
        week: 'Week 1',
        code: 'ENT 401.1',
        title: 'Market Selection, Defensibility & White-Label Architecture',
        summary: 'Pick a high-urgency vertical problem and architect a defensible AI product instead of a thin prompt wrapper.',
        lectures: [
          'Where vertical AI companies win: proprietary workflows, data flywheels, and unit economics',
          'White-label AI foundations: custom branding, domains, IAM, and multi-tenant workspaces',
          'Pricing power: outcome-based, seat-based, and usage-metered models',
        ],
        readings: ['Hanzo Docs: Startups & Platform Templates'],
        lab: 'Lab 1: Define your vertical product spec, unit-economics model, and provision your white-label app skeleton.',
      },
      {
        week: 'Week 2',
        code: 'ENT 401.2',
        title: 'Custom Models, Data Flywheels & Differentiated Capabilities',
        summary: 'Build technical moat with vertical Kai decision models, domain retrieval, and fine-tuned Zen models.',
        lectures: [
          'Turning customer usage into opt-in evaluation & training flywheels',
          'Serving custom Kai capabilities and specialized Zen checkpoints behind your brand',
          'Latency, margin, and quality benchmarking against horizontal incumbents',
        ],
        readings: ['Hanzo Docs: Kai & Zen Model Guides'],
        lab: 'Lab 2: Ship your vertical AI capability endpoint with automated quality and margin benchmarks.',
      },
      {
        week: 'Week 3',
        code: 'ENT 401.3',
        title: 'APIs, Multi-Tenant Hosting & Production Reliability',
        summary: 'Expose clean developer APIs and web apps with isolated customer data, rate limits, and zero-downtime deploys.',
        lectures: [
          'Designing customer-facing `/v1/` APIs, API keys, webhooks, and SDK ergonomics',
          'Hosting architecture: static edge UIs + containerized APIs + Hanzo Base',
          'SLA monitoring, customer usage portals, and error budgets',
        ],
        readings: ['Hanzo Docs: Multi-Tenancy, API Keys & Self-Hosting'],
        lab: 'Lab 3: Deploy your multi-tenant API and web application with API-key issuance and live observability.',
      },
      {
        week: 'Week 4',
        code: 'ENT 401.4',
        title: 'Billing, Metering, Subscriptions & Licensing',
        summary: 'Turn usage into cash cleanly with Stripe/Square checkout, metered token billing, entitlements, and commercial licensing.',
        lectures: [
          'Implementing self-serve subscriptions, credit packs, and real-time usage metering',
          'Entitlements, plan upgrades/downgrades, and overage circuit breakers',
          'Commercial licensing, enterprise MSAs, SLAs, and data-processing agreements',
        ],
        readings: ['Hanzo Docs: Money, Store & Licensing CLI'],
        lab: 'Lab 4: Wire end-to-end self-serve checkout, entitlement enforcement, and real-time usage metering.',
      },
      {
        week: 'Week 5',
        code: 'ENT 401.5',
        title: 'Distribution, GTM Autopilot & Customer Onboarding',
        summary: 'Build repeatable acquisition channels: docs-led growth, templates, developer distribution, and closed-loop marketing.',
        lectures: [
          'Docs-first and product-led growth: interactive demos, templates, and referrals',
          'Setting up Autopilot acquisition and activation experiments',
          'Enterprise pilot architecture: security documentation, audit-log exports, and procurement',
        ],
        readings: ['Hanzo Docs: Templates, Referrals & Campaigns'],
        lab: 'Lab 5: Launch your public landing page, interactive demo, docs quickstart, and analytics funnel.',
      },
      {
        week: 'Week 6',
        code: 'ENT 401.6',
        title: 'Founder Launch Review & Live Product Capstone',
        summary: 'Demonstrate your live, end-to-end AI company—product, model, billing, security, and distribution—in final review.',
        lectures: [
          'Live architecture & margin stress-test: verifying gross margin >70% at scale',
          'Post-launch Autopilot playbook: weekly shipping cadence and customer feedback loops',
          'Capstone launch verification',
        ],
        readings: ['Hanzo Docs: Startup Launch Checklist'],
        lab: 'Capstone Project: Present a live, deployed AI product with working auth, custom capability API, checkout billing, and distribution funnel.',
      },
    ],
  },
  {
    slug: 'agentic-marketing',
    code: 'MKT 102',
    title: 'Agentic Marketing & Autonomous Campaigns',
    credential: 'HAME',
    credentialFull: 'Hanzo Certified Agentic Marketing Engineer',
    school: 'business',
    price: 149,
    duration: '3 Weeks · Self-Paced',
    level: 'Intermediate',
    prerequisites: 'Familiarity with digital marketing, APIs, and basic scripting',
    summary:
      'Engineer programmatic growth machines with brand consistency and empirical rigor. Generate multi-channel copy, visuals, and audio, wire event-driven campaign triggers, and optimize conversion with multi-armed bandits.',
    capstone:
      'Deploy an automated multi-channel campaign engine with locked brand guardrails, webhook triggers, and bandit-driven conversion optimization.',
    capstoneArtifact: 'Closed-Loop Multi-Channel Campaign Engine',
    labComputeNote: 'Includes sandboxed growth workspace and scoped multimodal compute aligned to MKT 102 labs.',
    competencies: [
      'Brand-locked programmatic copy and creative generation pipelines',
      'Multimodal asset production (text, image, audio, video) via Zen & Creative APIs',
      'Event-driven lifecycle campaign automation with webhooks and /v1/auto',
      'Closed-loop CRO experimentation with multi-armed bandits and attribution',
    ],
    planId: 'course-mkt-102',
    facultyBots: ['@Lang', '@Data', '@Dev', '@Edu'],
    docsLinks: [
      { label: 'Campaign Agents Guide', href: 'https://docs.hanzo.ai/docs/agents/campaign', kind: 'quickstart' },
      { label: 'Creative Models Reference', href: 'https://docs.hanzo.ai/docs/models/creative', kind: 'guide' },
      { label: 'Marketing & SEO CLI', href: 'https://docs.hanzo.ai/docs/cli/marketing', kind: 'reference' },
    ],
    learnWorkspaceUrl: learnUrl('agentic-marketing'),
    syllabus: [
      {
        week: 'Week 1',
        code: 'MKT 102.1',
        title: 'Brand Consistency & Deterministic Multimodal Pipelines',
        summary: 'Lock brand voice, style guides, and visual consistency into reproducible programmatic pipelines.',
        lectures: [
          'Brand voice constraints and automated Kai brand-compliance checks',
          'Structured visual and video asset generation with deterministic style tokens',
          'Audio & voiceover synthesis pipelines',
        ],
        readings: ['Hanzo Docs: Creative Models & Content Generation'],
        lab: 'Lab 1: Generate multi-channel campaign variants passing automated brand-voice and formatting checks.',
      },
      {
        week: 'Week 2',
        code: 'MKT 102.2',
        title: 'Event-Driven Lifecycle Orchestration',
        summary: 'Connect user activation milestones, webhooks, and targeted messaging workflows responsibly.',
        lectures: [
          'Webhook ingestion, segmentation, and stateful journey graphs',
          'Deliverability, rate limits, unsubscribe compliance, and anti-spam guardrails',
          'Attribution modeling beyond last-touch bias',
        ],
        readings: ['Hanzo Docs: Campaign Agents & Webhooks'],
        lab: 'Lab 2: Wire an event-driven onboarding campaign responding to live product activation events.',
      },
      {
        week: 'Week 3',
        code: 'MKT 102.3',
        title: 'Closed-Loop CRO Bandits & Capstone Campaign',
        summary: 'Optimize landing pages and creatives continuously using Thompson Sampling and causal lift tests.',
        lectures: [
          'Multi-armed bandits vs fixed A/B tests for creative exploration',
          'Guarding against clickbait via downstream activation and retention metrics',
          'Capstone evaluation',
        ],
        readings: ['Scott: Multi-Armed Bandits for Digital Experimentation'],
        lab: 'Capstone Project: Deploy a closed-loop campaign optimizer verified on simulated funnel conversion & retention.',
      },
    ],
  },
  {
    slug: 'ai-practitioner',
    code: 'PRA 104',
    title: 'AI Practitioner & Tool Integration',
    credential: 'HCAIP',
    credentialFull: 'Hanzo Certified AI Practitioner',
    school: 'business',
    price: 99,
    duration: '2 Weeks · Fast Track',
    level: 'Foundational',
    prerequisites: 'Basic computer literacy and familiarity with code editors or CLI workflows',
    summary:
      'Master the day-to-day Hanzo platform. Navigate api.hanzo.ai, select the right intelligence layer (Kai, Enso, Zen), connect the canonical Hanzo MCP toolset to your editor, and govern usage and costs cleanly.',
    capstone:
      'Configure the canonical Hanzo MCP server across your development environment and automate an end-to-end daily engineering or knowledge workflow.',
    capstoneArtifact: 'Configured Hanzo MCP Workspace & Automated Workflow',
    labComputeNote: 'Includes sandboxed workspace and starter API compute aligned to PRA 104 labs.',
    competencies: [
      'Account setup, IAM authentication, and scoped API key hygiene',
      'Choosing cleanly across Kai (decisions), Enso (routing), and Zen (generation)',
      'Connecting canonical Hanzo MCP tools to IDEs, desktop apps, and CLI agents',
      'Usage tracking, budget alerts, and workflow automation with hanzo CLI',
    ],
    planId: 'course-pra-104',
    facultyBots: ['@Edu', '@Doc', '@Dev'],
    docsLinks: [
      { label: 'Hanzo Quickstart', href: 'https://docs.hanzo.ai/docs/quickstart', kind: 'quickstart' },
      { label: 'MCP Tools Guide', href: 'https://docs.hanzo.ai/docs/mcp', kind: 'guide' },
      { label: 'CLI Overview', href: 'https://docs.hanzo.ai/docs/cli', kind: 'reference' },
    ],
    learnWorkspaceUrl: learnUrl('ai-practitioner'),
    syllabus: [
      {
        week: 'Week 1',
        code: 'PRA 104.1',
        title: 'Platform Foundations, CLI & Canonical MCP Setup',
        summary: 'Install the Hanzo CLI, authenticate via IAM, and wire canonical MCP tools into your editor.',
        lectures: [
          'Organizations, projects, API keys, and least-privilege scopes',
          'Installing hanzo CLI across macOS, Linux, and Windows',
          'Connecting `npx -y hanzo mcp` to VS Code, Cursor, and desktop clients',
        ],
        readings: ['Hanzo Docs: Quickstart & MCP Integration'],
        lab: 'Lab 1: Authenticate via Hanzo IAM and run real filesystem, code, and git MCP tool calls from your workspace.',
      },
      {
        week: 'Week 2',
        code: 'PRA 104.2',
        title: 'Intelligence Selection & Daily Workflow Automation',
        summary: 'Match models to tasks, control context budgets, and automate repeatable daily work.',
        lectures: [
          'When to use Kai vs Enso vs Zen models for speed, cost, and accuracy',
          'Context hygiene, structured outputs, and spend alerts',
          'Packaging repeatable team workflows as reusable skills',
        ],
        readings: ['Hanzo Docs: Models & Skills Guide'],
        lab: 'Capstone Project: Ship a repeatable MCP + CLI automation workflow with explicit spend limits and verification checks.',
      },
    ],
  },
  {
    slug: 'ai-architect',
    code: 'ARC 105',
    title: 'Production AI Architect Masterclass',
    credential: 'HCPAIA',
    credentialFull: 'Hanzo Certified Production AI Architect',
    school: 'business',
    price: 499,
    duration: '6 Weeks · Masterclass Immersion',
    level: 'Staff / Principal',
    prerequisites: 'Senior/Staff software engineering experience, distributed systems, and Kubernetes',
    summary:
      'Architect enterprise-scale AI infrastructure across cloud, on-prem, and multi-region fleets. Master Kubernetes-first provisioning, zero-trust IAM & KMS, post-quantum networking, BFT consensus meshes, global observability, and enterprise cost governance.',
    capstone:
      'Design, deploy, and stress-test a fault-tolerant multi-region AI infrastructure topology with IAM/KMS isolation, observability, and verified failover.',
    capstoneArtifact: 'Multi-Region Production AI Architecture Blueprint & Cluster',
    labComputeNote: 'Includes multi-node architecture sandbox and scoped cluster compute aligned to ARC 105 labs.',
    competencies: [
      'Kubernetes-first cluster provisioning and GPU topology design',
      'Multi-tenant IAM, BYOK KMS envelope encryption, and compliance controls',
      'Post-quantum ZAP channels and Byzantine fault-tolerant agent consensus',
      'Global OpenTelemetry tracing, ClickHouse cost analytics, and DR failover',
    ],
    planId: 'course-arc-105',
    facultyBots: ['@Dev', '@Cyber', '@Doc', '@QA'],
    docsLinks: [
      { label: 'System Architecture', href: 'https://docs.hanzo.ai/docs/architecture', kind: 'quickstart' },
      { label: 'Self-Hosting Guide', href: 'https://docs.hanzo.ai/docs/self-hosting', kind: 'guide' },
      { label: 'Agent Consensus & ZAP', href: 'https://docs.hanzo.ai/docs/zap/advanced/agent-consensus', kind: 'reference' },
    ],
    learnWorkspaceUrl: learnUrl('ai-architect'),
    syllabus: [
      {
        week: 'Week 1',
        code: 'ARC 105.1',
        title: 'Cluster Provisioning & Hardware Topology Design',
        summary: 'Design reproducible GPU and CPU compute pools with declarative Kubernetes infrastructure.',
        lectures: [
          'Bare-metal, cloud, and hybrid GPU topology planning',
          'Declarative GitOps reconciliation and immutable base images',
          'Network micro-segmentation with Cilium and eBPF policies',
        ],
        readings: ['Hanzo Docs: Self-Hosting & Architecture'],
        lab: 'Lab 1: Provision a declarative multi-node cluster manifest with eBPF network isolation and GPU scheduling.',
      },
      {
        week: 'Week 2',
        code: 'ARC 105.2',
        title: 'Post-Quantum Transport & Resilient Networking',
        summary: 'Protect inter-service and cross-region links using ML-KEM, ML-DSA, and resilient P2P transport.',
        lectures: [
          'NIST FIPS 203/204 post-quantum key exchange and signing in ZAP',
          'Resilient edge-to-cloud routing and zero-downtime key rotation',
          'Hardware security module (HSM) integration patterns',
        ],
        readings: ['Hanzo Docs: Post-Quantum ZAP'],
        lab: 'Lab 2: Deploy an authenticated post-quantum ZAP gateway linking worker clusters.',
      },
      {
        week: 'Week 3',
        code: 'ARC 105.3',
        title: 'Fault-Tolerant Coordination & Consensus Meshes',
        summary: 'Coordinate critical state transitions across distributed agent nodes without single points of failure.',
        lectures: [
          'Quorum protocols and Byzantine fault tolerance for high-stakes verification',
          'State-machine replication and partition recovery',
          'Detecting and isolating misbehaving or drifting worker nodes',
        ],
        readings: ['Castro & Liskov: Practical Byzantine Fault Tolerance'],
        lab: 'Lab 3: Run a multi-node consensus simulation and verify clean recovery across network partitions.',
      },
      {
        week: 'Week 4',
        code: 'ARC 105.4',
        title: 'Enterprise Multi-Tenant IAM, KMS & Compliance',
        summary: 'Design strict org isolation, BYOK encryption, and auditable governance boundaries.',
        lectures: [
          'Org/project hierarchy and ABAC authorization via Hanzo IAM',
          'Envelope encryption with tenant-owned KMS keys',
          'Immutable audit logging and verifiable control planes',
        ],
        readings: ['Hanzo Docs: Multi-Tenancy & IAM'],
        lab: 'Lab 4: Implement isolated multi-tenant IAM/KMS boundaries and verify zero cross-tenant access.',
      },
      {
        week: 'Week 5',
        code: 'ARC 105.5',
        title: 'Global Observability, Tracing & Spend Governance',
        summary: 'Instrument every inference, tool hop, and dollar spent across large fleets.',
        lectures: [
          'Distributed OpenTelemetry propagation across agent meshes',
          'High-cardinality token & latency analytics in ClickHouse',
          'Automated spend anomaly detection and emergency kill-switches',
        ],
        readings: ['OpenTelemetry GenAI Semantic Conventions'],
        lab: 'Lab 5: Build a fleet observability and spend-anomaly dashboard with automated circuit-breaker alerts.',
      },
      {
        week: 'Week 6',
        code: 'ARC 105.6',
        title: 'Multi-Region Failover & Masterclass Capstone Defense',
        summary: 'Stress-test your full production architecture under simulated regional outages.',
        lectures: [
          'Active-active geo-routing, state replication, and RTO/RPO budgeting',
          'Chaos fault injection and graceful degradation drills',
          'Capstone architecture defense',
        ],
        readings: ['Hanzo Docs: Production Operations Standards'],
        lab: 'Capstone Project: Defend a multi-region AI infrastructure architecture passing failover, security, and cost drills.',
      },
    ],
  },
]

export const CERTIFICATION_TRACKS: CertificationTrack[] = [
  {
    slug: 'certified-intelligence-engineer',
    name: 'Certified Intelligence Engineer',
    credentialCode: 'HCIE',
    duration: '12 Weeks',
    price: 599,
    courseCodes: ['KAI 201', 'ENS 201', 'ZEN 201', 'ZEN 301'],
    courseSlugs: [
      'kai-decision-intelligence',
      'enso-adaptive-intelligence',
      'zen-model-engineering',
      'zen-native-training',
    ],
    summary:
      'Master all three core intelligence layers: Kai decision models, Enso adaptive routing, open-weight Zen engineering, and native model post-training.',
    capstoneRequirement:
      'Deploy an integrated Kai + Enso + fine-tuned Zen stack verified against latency, calibration, and accuracy gates.',
    credentialType: 'Professional Certification',
    planId: 'track-intelligence-engineer',
  },
  {
    slug: 'certified-autonomous-research-engineer',
    name: 'Certified Autonomous Research Engineer',
    credentialCode: 'HCARE',
    duration: '12 Weeks',
    price: 499,
    courseCodes: ['SCI 101', 'SCI 201', 'SCI 301'],
    courseSlugs: ['science-discovery', 'autonomous-research', 'research-autopilot'],
    summary:
      'Go from reproducible scientific discovery to fleet-wide Research Autopilot orchestrators that generate hypotheses, run ablations, and verify breakthroughs.',
    capstoneRequirement:
      'Operate a multi-worker Research Autopilot campaign producing an independently replicated technical report.',
    credentialType: 'Professional Certification',
    planId: 'track-autonomous-research',
  },
  {
    slug: 'certified-agentic-security-engineer',
    name: 'Certified Agentic Security Engineer',
    credentialCode: 'HCASE',
    duration: '12 Weeks',
    price: 499,
    courseCodes: ['CYB 101', 'CYB 201', 'CYB 301'],
    courseSlugs: ['ai-security-fundamentals', 'agentic-cybersecurity', 'autonomous-secops'],
    summary:
      'Secure AI applications, run autonomous vulnerability discovery and patching with Hanzo Cyber / OpenCyber, and operate self-healing SecOps pipelines.',
    capstoneRequirement:
      'Defend a multi-service cyber range through automated discovery, verified patching, and policy-bounded incident containment.',
    credentialType: 'Professional Certification',
    planId: 'track-agentic-security',
  },
  {
    slug: 'certified-sovereign-ai-architect',
    name: 'Certified Sovereign AI Architect',
    credentialCode: 'HCSAA',
    duration: '16 Weeks',
    price: 899,
    courseCodes: ['ARC 105', 'ML 401', 'CYB 401'],
    courseSlugs: ['ai-architect', 'ml-systems', 'sovereign-zero-trust-ai'],
    summary:
      'Design and operate sovereign, high-throughput, zero-trust AI infrastructure from custom GPU kernels and disaggregated serving to MicroVMs, IAM/KMS, PQC ZAP, and air-gapped execution.',
    capstoneRequirement:
      'Deploy and defend a sovereign zero-trust multi-cluster architecture passing throughput, failover, and offline-continuity audits.',
    credentialType: 'Professional Certification',
    planId: 'track-sovereign-architect',
  },
  {
    slug: 'certified-ai-entrepreneur',
    name: 'Certified AI Entrepreneur',
    credentialCode: 'HCAIE',
    duration: '10 Weeks',
    price: 549,
    courseCodes: ['MKT 102', 'AUTO 201', 'ENT 401'],
    courseSlugs: ['agentic-marketing', 'business-autopilot', 'build-your-ai-company'],
    summary:
      'Build, monetize, and grow an AI-native company: closed-loop campaigns, business autopilot telemetry, white-label AI architecture, metered billing, and distribution.',
    capstoneRequirement:
      'Ship a live revenue-ready AI product with working auth, custom capability API, self-serve billing, and active Autopilot growth loops.',
    credentialType: 'Professional Certification',
    planId: 'track-ai-entrepreneur',
  },
  {
    slug: 'intelligence-engineering-fellowship',
    name: 'Intelligence Engineering Fellowship',
    credentialCode: 'HIEF',
    duration: '24–36 Weeks',
    price: 999,
    courseCodes: ['KAI 301', 'ENS 301', 'ZEN 301', 'SCI 401'],
    courseSlugs: [
      'kai-training-decision-models',
      'enso-training-orchestrators',
      'zen-native-training',
      'recursive-improvement',
    ],
    summary:
      'Our flagship applied research and systems fellowship combining trained Kai capabilities, learned Enso orchestrators, native Zen post-training, recursive improvement loops, and a defended original capstone.',
    capstoneRequirement:
      'Complete all four advanced courses plus an original, open-audited capstone system & technical paper. Professional fellowship credential (non-accredited).',
    credentialType: 'Professional Fellowship (Non-Accredited)',
    planId: 'track-ie-fellowship',
  },
]

export const ADVENTURE_PATHS: AdventurePath[] = [
  {
    id: 'kai',
    goal: 'Make a structured decision',
    architecture: 'Kai — Decision Intelligence',
    tagline: 'Zero-token calibrated gates, triage, scoring, and deterministic control.',
    summary:
      'Use Kai whenever your system needs a fast, calibrated yes/no, multi-class choice, risk score, or rubric evaluation—without paying generative token latency or risking prose hallucinations.',
    csPrinciples: [
      'Finite-state decision theory & calibrated probabilities (ECE, Brier scores)',
      'Cost-sensitive thresholds & explicit abstention/escalation bands',
      'Capability training on your operational data via POST /v1/capabilities/{name}/train',
    ],
    freeCourseSlug: 'continuous-improvement',
    primaryCourseSlug: 'kai-decision-intelligence',
    secondaryCourseSlug: 'kai-training-decision-models',
    guideLabel: 'Kai Decision Models Guide',
    guideUrl: 'https://docs.hanzo.ai/docs/guides/kai',
    trackSlug: 'certified-intelligence-engineer',
    trackName: 'Certified Intelligence Engineer',
  },
  {
    id: 'zen',
    goal: 'Generate text, code, or media',
    architecture: 'Zen — Open-Weight Foundation Models',
    tagline: 'Open-weight models you can inspect, quantize, fine-tune, and host anywhere.',
    summary:
      'Use the Zen family for code synthesis, reasoning, chat, and multimodal generation—running hosted via api.hanzo.ai or self-hosted on CUDA, ROCm, and Apple Silicon with full weight sovereignty.',
    csPrinciples: [
      'Dense & Mixture-of-Experts (MoE) transformer scaling & KV-cache memory math',
      'FP8/AWQ/GGUF quantization, grammar-constrained decoding & PagedAttention',
      'Native post-training with SFT, LoRA/DoRA, DPO, and verifiable-reward RL',
    ],
    freeCourseSlug: 'continuous-improvement',
    primaryCourseSlug: 'zen-model-engineering',
    secondaryCourseSlug: 'zen-native-training',
    guideLabel: 'Zen Open-Weight Models Docs',
    guideUrl: 'https://docs.hanzo.ai/docs/models/zen',
    trackSlug: 'certified-intelligence-engineer',
    trackName: 'Certified Intelligence Engineer',
  },
  {
    id: 'enso',
    goal: 'Solve complex multi-model tasks',
    architecture: 'Enso — Adaptive Intelligence & Orchestration',
    tagline: 'Route every sub-task to the optimal model tier on the quality-cost Pareto frontier.',
    summary:
      'Use Enso when workloads span trivial lookups to deep reasoning. Enso cascades fast drafts through Kai verification gates and learns optimal routing policies online via contextual bandits.',
    csPrinciples: [
      'Quality-cost Pareto optimization & confidence-gated model cascades',
      'Counterfactual logging & Doubly Robust off-policy evaluation',
      'Contextual bandits (LinUCB, Thompson Sampling) & multi-agent task decomposition',
    ],
    freeCourseSlug: 'continuous-improvement',
    primaryCourseSlug: 'enso-adaptive-intelligence',
    secondaryCourseSlug: 'enso-training-orchestrators',
    guideLabel: 'Enso Adaptive Routing Guide',
    guideUrl: 'https://docs.hanzo.ai/docs/models/enso',
    trackSlug: 'certified-intelligence-engineer',
    trackName: 'Certified Intelligence Engineer',
  },
  {
    id: 'science',
    goal: 'Discover better algorithms & models',
    architecture: 'Autonomous Science — Research Autopilot',
    tagline: 'Closed-loop hypothesis generation, sandboxed ablations, and bounded recursion.',
    summary:
      'Use Autonomous Science workflows to automate literature synthesis, run controlled multi-fidelity experiments, prune weak ideas early, and compound verified gains without test-set leakage.',
    csPrinciples: [
      'Experimental design, causal inference & anti-leakage verification critics',
      'Quality-diversity search (MAP-Elites) & multi-fidelity pruning (ASHA/Hyperband)',
      'Verifiable self-play & bounded recursive improvement with immutable safety gates',
    ],
    freeCourseSlug: 'continuous-improvement',
    primaryCourseSlug: 'science-discovery',
    secondaryCourseSlug: 'autonomous-research',
    guideLabel: 'Self-Improvement Architecture',
    guideUrl: 'https://docs.hanzo.ai/docs/self-improvement',
    trackSlug: 'certified-autonomous-research-engineer',
    trackName: 'Certified Autonomous Research Engineer',
  },
  {
    id: 'cyber',
    goal: 'Secure AI systems & infrastructure',
    architecture: 'Hanzo Cyber & Zero-Trust Sovereign AI',
    tagline: 'Defend prompts, tools, clusters, and supply chains—from red-teaming to air-gapped microVMs.',
    summary:
      'Use Hanzo Cyber, OpenCyber, Kai security gates, and Zero-Trust MicroVM runtimes to discover vulnerabilities, synthesize verified patches, automate SecOps containment, and enforce post-quantum isolation.',
    csPrinciples: [
      'Prompt/RAG injection defense, least-privilege capabilities & Kai command guards',
      'Autonomous PoC verification, patch synthesis & policy-bounded SecOps containment',
      'MicroVM kernel isolation, IAM/KMS envelope encryption, RNS & post-quantum ZAP',
    ],
    freeCourseSlug: 'continuous-improvement',
    primaryCourseSlug: 'ai-security-fundamentals',
    secondaryCourseSlug: 'agentic-cybersecurity',
    guideLabel: 'Security & Sandbox Guides',
    guideUrl: 'https://docs.hanzo.ai/docs/dev/configuration/platform-sandboxing',
    trackSlug: 'certified-agentic-security-engineer',
    trackName: 'Certified Agentic Security Engineer',
  },
  {
    id: 'autopilot',
    goal: 'Continuously optimize a business',
    architecture: 'Autopilot — Closed-Loop Operations',
    tagline: 'Connect product, growth, and revenue telemetry to guardrailed continuous improvement.',
    summary:
      'Use Autopilot to turn marketing, onboarding, support, and org workflows into measurable closed-loop systems—governed by causal metrics, margin floors, Goodhart guardrails, and human overrides.',
    csPrinciples: [
      'Randomized experiments, causal lift & multi-armed bandit traffic allocation',
      'Reward-hacking / Goodhart defenses & automated canary rollback gates',
      'Event-driven departmental workflows with delegated IAM & micro-USD budgets',
    ],
    freeCourseSlug: 'continuous-improvement',
    primaryCourseSlug: 'business-autopilot',
    secondaryCourseSlug: 'autonomous-organizations',
    guideLabel: 'Run Your Organization Guide',
    guideUrl: 'https://docs.hanzo.ai/docs/run-your-org',
    trackSlug: 'certified-ai-entrepreneur',
    trackName: 'Certified AI Entrepreneur',
  },
  {
    id: 'entrepreneurship',
    goal: 'Launch your own AI company',
    architecture: 'AI Entrepreneurship — Full-Stack Company Builder',
    tagline: 'White-label AI apps, custom models, metered APIs, hosting, billing, licensing & GTM.',
    summary:
      'Build an independent AI business on real infrastructure—combining vertical Kai/Zen capabilities, multi-tenant IAM/Base hosting, self-serve Square/Stripe billing, commercial licensing, and Autopilot growth.',
    csPrinciples: [
      'White-label multi-tenant SaaS architecture, API design & gross-margin engineering',
      'Data flywheels turning customer usage into vertical model differentiation',
      'Metered usage billing, entitlements, commercial licensing & docs-led distribution',
    ],
    freeCourseSlug: 'continuous-improvement',
    primaryCourseSlug: 'build-your-ai-company',
    secondaryCourseSlug: 'agentic-marketing',
    guideLabel: 'Hanzo for Startups Guide',
    guideUrl: 'https://docs.hanzo.ai/docs/startups',
    trackSlug: 'certified-ai-entrepreneur',
    trackName: 'Certified AI Entrepreneur',
  },
]

export const PRICING_TIERS: PricingTier[] = [
  {
    id: 'docs',
    name: 'Documentation & Guides',
    price: 'Free',
    cadence: 'Open access forever',
    description: 'Architecture specifications, API references, cookbooks, and self-hosting guides.',
    includes: [
      'Full docs.hanzo.ai library & OpenAPI specs',
      'Kai, Enso, Zen, MCP, and ZAP implementation guides',
      'Reference blueprints & copy-paste recipes',
    ],
    ctaLabel: 'Browse Docs ↗',
    ctaHref: 'https://docs.hanzo.ai/docs/guides',
    external: true,
  },
  {
    id: 'intro',
    name: 'Introductory Courses',
    price: 'Free',
    cadence: 'Self-paced · $0',
    description: 'Start with AUTO 101: The Science of Continuous Improvement—no card required.',
    includes: [
      'Complete AUTO 101 curriculum & interactive labs',
      'Starter workspace on hanzo.app/learn',
      'AI Faculty tutor guidance (@Edu, @Sci, @Data)',
    ],
    ctaLabel: 'Start AUTO 101 Free →',
    ctaHref: '/continuous-improvement',
  },
  {
    id: 'individual-pro',
    name: 'Individual Pro Courses',
    price: '$99 – $249',
    cadence: 'One-time per course',
    description: 'Foundational & intermediate applied engineering, science, security, and business courses.',
    includes: [
      'Scoped sandboxed lab environment & compute for coursework',
      'Automated capstone verification & AI Faculty bots',
      'W3C Verifiable Credential upon passing capstone',
    ],
    ctaLabel: 'Browse Courses ↓',
    ctaHref: '#schools',
  },
  {
    id: 'advanced',
    name: 'Advanced & Masterclasses',
    price: '$249 – $499',
    cadence: 'One-time per course',
    description: 'Deep training, recursive science, sovereign zero-trust, ML systems, and AI company building.',
    includes: [
      'Scoped GPU/training & microVM lab compute aligned to labs',
      'Detailed production labs (incl. KAI 301 9-step training lab)',
      'Capstone artifact audit & W3C cryptographic proof',
    ],
    ctaLabel: 'Explore Advanced ↓',
    ctaHref: '#schools',
  },
  {
    id: 'tracks',
    name: 'Complete Certification Tracks',
    price: '$499 – $999',
    cadence: 'Bundled multi-course track',
    highlight: true,
    description: 'Structured 10–36 week multi-course certification tracks and the Intelligence Engineering Fellowship.',
    includes: [
      'All courses in the track + integrated multi-system capstone',
      'Scoped lab compute across every required module',
      'Track-level W3C Verifiable Credential & public registry proof',
    ],
    ctaLabel: 'View 6 Tracks ↓',
    ctaHref: '#certifications',
  },
  {
    id: 'university-pro',
    name: 'University Pro',
    price: 'Bundled',
    cadence: 'With Hanzo Pro · Self-Serve',
    highlight: true,
    description: 'All-access curriculum paired with the Hanzo Pro developer platform and hanzo.app/learn workspace.',
    includes: [
      'Access to all 25 Hanzo University courses & labs',
      'Hanzo Pro developer workspace, models, and sandboxes',
      'Self-serve billing & management through hanzo.ai/pay',
    ],
    ctaLabel: 'Continue to Hanzo Pro →',
    ctaHref: '/checkout/membership',
  },
  {
    id: 'enterprise',
    name: 'Enterprise & Teams',
    price: 'Custom',
    cadence: 'Annual / Per-seat',
    description: 'Upskill engineering, security, and research organizations on private infrastructure.',
    includes: [
      'SSO/IAM seat provisioning & consolidated invoicing',
      'Private sandbox clusters & custom company capstones',
      'Dedicated onboarding for sovereign & regulated teams',
    ],
    ctaLabel: 'Contact Enterprise ↗',
    ctaHref: 'https://hanzo.ai/contact',
    external: true,
  },
  {
    id: 'fellowships',
    name: 'Research Fellowships',
    price: 'Sponsored',
    cadence: 'Application / Grant-backed',
    description: 'Applied cohort fellowships for open-weight training, autonomous science, and cybersecurity research.',
    includes: [
      'Sponsored lab compute for approved open research capstones',
      'Published open-source code, benchmarks, and technical reports',
      'Non-accredited applied research fellowship credential',
    ],
    ctaLabel: 'View Fellowship Track →',
    ctaHref: '/checkout/intelligence-engineering-fellowship',
  },
]

export const MEMBERSHIP_CHECKOUT_ITEM = {
  slug: 'membership',
  code: 'PRO',
  title: 'Hanzo University Pro (Bundled with Hanzo Pro)',
  credential: 'HU-PRO',
  credentialFull: 'Hanzo University Pro All-Access',
  price: 29,
  duration: 'Self-Serve · Bundled with Hanzo Pro',
  summary:
    'Self-serve access to all 25 Hanzo University courses, interactive labs on hanzo.app/learn, AI Faculty mentorship, and the Hanzo Pro developer platform through hanzo.ai/pay.',
  planId: 'pro',
}

export interface CheckoutItem {
  slug: string
  kind: 'course' | 'track' | 'membership'
  code: string
  title: string
  credential: string
  price: number
  isFree?: boolean
  duration: string
  summary: string
  planId: string
  learnWorkspaceUrl: string
  courseSlugs?: string[]
}

export function findCourse(slug: string): UniversityCourse | undefined {
  return UNIVERSITY_COURSES.find((c) => c.slug === slug)
}

export function getAllCheckoutItems(): CheckoutItem[] {
  const courseItems: CheckoutItem[] = UNIVERSITY_COURSES.map((c) => ({
    slug: c.slug,
    kind: 'course',
    code: c.code,
    title: c.title,
    credential: c.credential,
    price: c.price,
    isFree: c.isFree,
    duration: c.duration,
    summary: c.summary,
    planId: c.planId,
    learnWorkspaceUrl: c.learnWorkspaceUrl,
  }))

  const trackItems: CheckoutItem[] = CERTIFICATION_TRACKS.map((t) => ({
    slug: t.slug,
    kind: 'track',
    code: t.credentialCode,
    title: t.name,
    credential: t.credentialCode,
    price: t.price,
    duration: t.duration,
    summary: t.summary,
    planId: t.planId,
    learnWorkspaceUrl: learnUrl(t.courseSlugs[0]),
    courseSlugs: t.courseSlugs,
  }))

  const membershipItem: CheckoutItem = {
    slug: MEMBERSHIP_CHECKOUT_ITEM.slug,
    kind: 'membership',
    code: MEMBERSHIP_CHECKOUT_ITEM.code,
    title: MEMBERSHIP_CHECKOUT_ITEM.title,
    credential: MEMBERSHIP_CHECKOUT_ITEM.credential,
    price: MEMBERSHIP_CHECKOUT_ITEM.price,
    duration: MEMBERSHIP_CHECKOUT_ITEM.duration,
    summary: MEMBERSHIP_CHECKOUT_ITEM.summary,
    planId: MEMBERSHIP_CHECKOUT_ITEM.planId,
    learnWorkspaceUrl: 'https://hanzo.app/learn',
  }

  return [...courseItems, ...trackItems, membershipItem]
}

export function findCheckoutItem(slug: string): CheckoutItem | undefined {
  return getAllCheckoutItems().find((item) => item.slug === slug)
}

export function getSchoolById(id: SchoolId): SchoolDefinition {
  return SCHOOLS.find((s) => s.id === id) || SCHOOLS[0]
}
