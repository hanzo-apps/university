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
  track: 'coding' | 'marketing' | 'rl' | 'systems' | 'architect'
  units: number
  price: number
  rebateCredits: number
  duration: string
  level: string
  prerequisites: string
  summary: string
  capstone: string
  competencies: string[]
  planId: string
  featured?: boolean
  instructor: {
    name: string
    role: string
    avatar?: string
  }
  syllabus: CourseWeek[]
}

export interface CouponResult {
  valid: boolean
  code: string
  discountPercent?: number
  discountAmount: number
  originalPrice: number
  finalPrice: number
  rebateCredits: number
  message: string
}

export const KNOWN_COUPONS: Record<string, { percent?: number; amount?: number; label: string }> = {
  HANZO20: { percent: 20, label: '20% Off Hanzo University' },
  STUDENT50: { percent: 50, label: '50% Off Academic / Student Grant' },
  EARLYBIRD: { amount: 50, label: '$50 Off Early Enrollment' },
  LAUNCH25: { percent: 25, label: '25% Off Launch Promotion' },
  DEVCOMMUNITY: { percent: 30, label: '30% Off Developer Community' },
  VIP100: { amount: 100, label: '$100 Off Principal Fellowship' },
  KAI: { percent: 35, label: '35% Off Decision Engineering' },
}

export function validateCoupon(rawCode: string, originalPrice: number): CouponResult {
  const code = (rawCode || '').trim().toUpperCase()
  if (!code) {
    return {
      valid: false,
      code: '',
      discountAmount: 0,
      originalPrice,
      finalPrice: originalPrice,
      rebateCredits: Math.ceil(originalPrice * 0.25),
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
      rebateCredits: Math.ceil(originalPrice * 0.25),
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
  const rebateCredits = Math.ceil(finalPrice * 0.25)

  return {
    valid: true,
    code,
    discountPercent,
    discountAmount,
    originalPrice,
    finalPrice,
    rebateCredits,
    message: `✓ Applied: ${promo.label} (-$${discountAmount})`,
  }
}

export const UNIVERSITY_COURSES: UniversityCourse[] = [
  {
    slug: 'agentic-coding',
    code: 'ENG 100',
    title: 'Agentic Coding Systems with Hanzo Dev & Zen 6',
    credential: 'HACE',
    credentialFull: 'Hanzo Certified Agentic Coding Engineer',
    track: 'coding',
    units: 4.0,
    price: 199,
    rebateCredits: 50,
    duration: '4 Weeks · Self-Paced',
    level: 'Advanced',
    prerequisites: 'Proficiency in Python/Rust/Go/TS + standard Git workflows',
    summary:
      'Architect autonomous coding agents capable of multi-file refactoring, test-driven debugging, and opening verified pull requests using Zen 6, ZAP RPC, and isolated Hanzo Visor sandboxes.',
    capstone: 'Build an autonomous SWE-bench repair bot that resolves real GitHub issues within strict budget caps.',
    competencies: [
      'Zen 6 (27.3B) & Zen 6 Flash local serving',
      'SWE-bench self-healing test execution loops',
      'ZAP Zero-Copy Cap’n Proto multi-agent swarms',
      'Physical sandbox pod leasing & Hanzo Visor isolation',
    ],
    planId: 'course-eng-100',
    featured: true,
    instructor: {
      name: 'Dr. Ethan Vance',
      role: 'Principal Systems Architect, Hanzo Autonomous Infrastructure',
    },
    syllabus: [
      {
        week: 'Week 1',
        code: 'ENG 100.1',
        title: 'Runtime Virtualization, Ephemeral Sandboxes & Zero-Copy ZAP RPC',
        summary:
          'Analyze the systems boundary of autonomous code execution. Configure local high-throughput quantized serving for Zen 6 (27.3B) and Zen 6 Flash. Engineer Hanzo Visor user-space kernel virtualization with ephemeral lease lifecycles and zero-copy Cap’n Proto RPC channels.',
        lectures: [
          'Zen 6 architecture: quantized GGUF/AWQ local inference on Apple Silicon (Metal) and Linux (CUDA)',
          'The 4-surface boundary contract: unified ergonomics across CLI, SDKs, HTTP REST, and MCP sockets',
          'ZAP Zero-Copy RPC over Cap’n Proto: replacing high-overhead JSON serialization with microsecond IPC',
          'User-space container virtualization: Hanzo Visor process boundaries and ephemeral rootfs mounts',
        ],
        readings: [
          'Hanzo Systems: Container Isolation through User-Space Kernel Virtualization (Hanzo Visor Architecture)',
          'Kent: Cap’n Proto Serialization and RPC Protocol Specification',
        ],
        lab: 'Lab 1: Provision an isolated multi-process execution jail with ZAP IPC socket bridge and evaluate inter-process latency.',
      },
      {
        week: 'Week 2',
        code: 'ENG 100.2',
        title: 'Abstract Syntax Trees, Context Distillation & Dual-Index Retrieval',
        summary:
          'Train agents to navigate 100,000+ line repositories without exceeding token context boundaries. Extract AST symbol graphs using tree-sitter grammars and synthesize dual-index retrieval combining BM25 keyword matching with dense vector embeddings.',
        lectures: [
          'AST-based symbol extraction using tree-sitter across Python, TypeScript, Go, and Rust codebases',
          'Dual-index code retrieval: combining BM25 exact keyword inverted indexes with dense vector embeddings',
          'Context compression algorithms: distilling 50-file call chains into a 4k-token working memory scratchpad',
          'Three-tier memory hierarchy: immediate scratchpad, thread history log, and long-term vector stores',
        ],
        readings: [
          'Bruns et al.: Tree-sitter: An Incremental Parsing System for Programming Tools',
          'Robertson et al.: The Probabilistic Relevance Framework: BM25 and Beyond',
        ],
        lab: 'Lab 2: Implement an autonomous AST file scout that isolates defect locations across a 100k-line repo in < 3 tool hops.',
      },
      {
        week: 'Week 3',
        code: 'ENG 100.3',
        title: 'Test-Driven Self-Healing & Finite-State Kai Verification',
        summary:
          'Close the autonomous execution feedback loop. Engineer agents that parse natural-language issue tickets, synthesize minimal reproducible failing tests, generate syntax-safe AST patches, and verify state transitions with Kai zero-token heuristics.',
        lectures: [
          'Automated reproduction synthesis: generating failing pytest / cargo test cases directly from GitHub issues',
          'AST diff validation: guaranteeing generated patches introduce zero syntax regressions or unused symbols',
          'Kai finite-state decision checkpoints: zero-token verification scoring, completion heuristics, and state branching',
          'Micro-USD economic governance: enforcing hard pre-call cost ceilings and handling in-band budget refusals',
        ],
        readings: [
          'Hanzo Research: Finite-State Decision Models: Zero-Token Control in Autonomous Software Construction',
          'Monperrus: Automatic Software Repair: A Survey on Principles, Benchmarks, and Verification',
        ],
        lab: 'Lab 3: Build an autonomous test runner that iterates on AST patches in an isolated pod until test exit code 0.',
      },
      {
        week: 'Week 4',
        code: 'ENG 100.4',
        title: 'Coordinator-Worker Swarms & SWE-bench Capstone Defense',
        summary:
          'Deploy distributed multi-agent teams with specialized role partitioning. Build a coordinator-worker architecture where an Architect agent drafts repair strategies, a Coder synthesizes diffs, and a Critic reviews test executions against SWE-bench benchmarks.',
        lectures: [
          'Coordinator-Worker swarm topology: role delegation, bidirectional task leasing, and consensus protocols',
          'Conflict resolution in concurrent branch synthesis: optimistic locking and semantic three-way merge',
          'SWE-bench Lite and Verified harness: real-world benchmark harness automation and regression verification',
          'W3C Verifiable Credential generation: signing evaluation artifacts and issuing tamper-proof HACE certificates',
        ],
        readings: [
          'Jimenez et al. (Princeton NLP): SWE-bench: Can Language Models Resolve Real-World GitHub Issues?',
          'W3C Recommendation: Verifiable Credentials Data Model v2.0',
        ],
        lab: 'Capstone Project: Autonomously resolve 5 SWE-bench benchmark issues with 100% test pass rate and < $0.50 spend per issue.',
      },
    ],
  },
  {
    slug: 'reinforcement-learning',
    code: 'RL 101',
    title: 'Native Reinforcement Learning & Post-Training',
    credential: 'HARLE',
    credentialFull: 'Hanzo Certified Reinforcement Learning Engineer',
    track: 'rl',
    units: 5.0,
    price: 249,
    rebateCredits: 63,
    duration: '5 Weeks · Advanced Lab',
    level: 'Expert',
    prerequisites: 'Foundational linear algebra, Python ML libraries, and basic MDP comprehension',
    summary:
      'Implement native Gymnasium environments on the Hanzo Cloud Fabric. Fine-tune models with Zoo Gym, design multi-objective reward functions, and train learned routing policies.',
    capstone: 'Train a custom MDP reinforcement learning policy and deploy it as a production model router.',
    competencies: [
      'Gymnasium HanzoAgentEnv MDP implementation',
      'Post-training & fine-tuning with Zoo Gym',
      'Multi-objective reward modeling (PPO, GRPO, DPO)',
      'LinUCB router policy training via /v1/ai/feedback',
    ],
    planId: 'course-rl-101',
    featured: true,
    instructor: {
      name: 'Dr. Mira Thorne',
      role: 'Head of Alignment & RL Research, Hanzo Labs',
    },
    syllabus: [
      {
        week: 'Week 1',
        code: 'RL 101.1',
        title: 'Markov Decision Processes for Code & Tool Agents',
        summary: 'Formalize tool invocation and multi-step reasoning as discrete-action Markov Decision Processes.',
        lectures: [
          'MDP formulation: state spaces, action observation histories, and transition kernels',
          'Tool execution environments: defining episodic boundaries and termination predicates',
          'Discount factors, horizon truncation, and sparse vs dense reward landscapes',
        ],
        readings: ['Sutton & Barto: Reinforcement Learning: An Introduction (Chapters 3-4)'],
        lab: 'Lab 1: Wrap the Hanzo Tool API into a compliant Gymnasium environment with observation spaces.',
      },
      {
        week: 'Week 2',
        code: 'RL 101.2',
        title: 'Reward Engineering: Multi-Objective & Process Supervision',
        summary: 'Construct robust reward models that prevent reward hacking, verbosity bloat, and hallucinated proofs.',
        lectures: [
          'Outcome vs process supervision: step-level scoring versus terminal exit code reward',
          'Regularization penalties: token cost budgets, execution latency, and safety constraints',
          'Training preference models with Direct Preference Optimization (DPO) and KTO',
        ],
        readings: ['Rafailov et al.: Direct Preference Optimization: Your Language Model is Secretly a Reward Model'],
        lab: 'Lab 2: Implement a multi-objective reward function incorporating test exit code, latency, and cost.',
      },
      {
        week: 'Week 3',
        code: 'RL 101.3',
        title: 'Policy Gradient Optimization: PPO & GRPO at Scale',
        summary: 'Train open weights models using Proximal Policy Optimization and Group Relative Policy Optimization.',
        lectures: [
          'PPO actor-critic architectures and clipping dynamics',
          'GRPO: group relative advantages without dedicated critic networks',
          'Distributed rollout collection across vLLM and TensorRT-LLM nodes',
        ],
        readings: ['Schulman et al.: Proximal Policy Optimization Algorithms', 'DeepSeek-AI: DeepSeekMath & GRPO'],
        lab: 'Lab 3: Execute a 1,000-step GRPO fine-tuning loop on Zen 6 Flash for multi-hop tool routing.',
      },
      {
        week: 'Week 4',
        code: 'RL 101.4',
        title: 'Contextual Bandits & Learned Model Routers',
        summary: 'Deploy real-time contextual bandit policies (LinUCB, Thompson Sampling) for dynamic model tiering.',
        lectures: [
          'Exploration vs exploitation in production request dispatch',
          'Feature vectors: prompt complexity, token count, task classification, and latency requirements',
          'Streaming updates via POST /v1/ai/feedback and counterfactual regret minimization',
        ],
        readings: ['Li et al.: A Contextual-Bandit Approach to Personalized News Article Recommendation'],
        lab: 'Lab 4: Deploy a real-time LinUCB router dispatching requests between Zen 6 Flash and Zen 6 27B.',
      },
      {
        week: 'Week 5',
        code: 'RL 101.5',
        title: 'Production Evaluation, Safety & Capstone Defense',
        summary: 'Evaluate trained policies on unseen benchmark suites, verify safety bounds, and defend the capstone.',
        lectures: [
          'Out-of-distribution generalization testing and catastrophic forgetting mitigation',
          'Safety guardrail integration and automated adversarial red-teaming',
          'Issuance of HARLE W3C Verifiable Credentials',
        ],
        readings: ['Anthropic: Sleeper Agents & Out-of-Distribution Robustness'],
        lab: 'Capstone Defense: Train and deploy a custom MDP router achieving 92% benchmark accuracy at 40% lower cost.',
      },
    ],
  },
  {
    slug: 'systems-engineering',
    code: 'SYS 103',
    title: 'Hanzo AI Systems Engineering Foundation',
    credential: 'HCAISE',
    credentialFull: 'Hanzo Certified AI Systems Engineer',
    track: 'systems',
    units: 3.0,
    price: 149,
    rebateCredits: 38,
    duration: '3 Weeks · Comprehensive',
    level: 'Intermediate',
    prerequisites: 'Basic command line fluency and experience consuming REST APIs',
    summary:
      'The definitive engineering standard for production AI. Master the 4-surface parity, finite-state Kai decision loops, hybrid retrieval, and strict integer micro-USD budget governance.',
    capstone: 'Ship a high-concurrency 4-surface AI service with sub-50ms latency and strict budget ceilings.',
    competencies: [
      'Unified 4-surface API (CLI, SDKs, HTTP, MCP)',
      'Finite-state Kai decision loops with 0 output tokens',
      'Hybrid retrieval (knowledge, graph, search)',
      'Integer micro-USD nested budget governance',
    ],
    planId: 'course-sys-103',
    instructor: {
      name: 'Marcus Brody',
      role: 'Director of Developer Platform, Hanzo',
    },
    syllabus: [
      {
        week: 'Week 1',
        code: 'SYS 103.1',
        title: 'The 4-Surface Architecture & Zero-Copy Protocol',
        summary: 'Master the unified developer interface across CLI, SDKs, REST endpoints, and MCP protocols.',
        lectures: [
          'Architecting for 4-surface parity: CLI, Python/TS SDKs, REST HTTP, and Model Context Protocol',
          'Token streaming protocols: Server-Sent Events, WebSockets, and binary gRPC channels',
          'Connection pooling and resilient retry jitter strategies',
        ],
        readings: ['Hanzo Platform Architecture Whitepaper: The 4-Surface Contract'],
        lab: 'Lab 1: Build a tool that executes synchronously across CLI and MCP socket simultaneously.',
      },
      {
        week: 'Week 2',
        code: 'SYS 103.2',
        title: 'Kai Decision Heuristics & Zero-Token Logic',
        summary: 'Replace expensive generative model calls with fast logit-based decision checkpoints.',
        lectures: [
          'Why generative classification fails at scale: cost, latency, and indeterminacy',
          'Kai zero-token logit scoring across structured choice schemas',
          'Integrating Kai decision trees inside multi-tier agent pipelines',
        ],
        readings: ['Hanzo AI: Kai Technical Report — Deterministic State Transitions without Output Tokens'],
        lab: 'Lab 2: Replace 3 LLM classification steps with Kai checkpoints, reducing latency by 85%.',
      },
      {
        week: 'Week 3',
        code: 'SYS 103.3',
        title: 'Budget Envelopes, Circuit Breakers & Capstone Service',
        summary: 'Enforce micro-USD budget ceilings and deploy a resilient high-throughput production service.',
        lectures: [
          'Pre-invocation budget checks with micro-USD precision',
          'Circuit breakers and graceful service degradation under load',
          'Capstone presentation and HCAISE credential verification',
        ],
        readings: ['Google SRE: Site Reliability Engineering: Managing Cascading Failures'],
        lab: 'Capstone Project: Deliver a sub-50ms AI microservice that handles 500 RPS without budget overruns.',
      },
    ],
  },
]

export const ADDITIONAL_COURSES: UniversityCourse[] = [
  {
    slug: 'agentic-marketing',
    code: 'MKT 102',
    title: 'Agentic Marketing & Autonomous Campaigns',
    credential: 'HAME',
    credentialFull: 'Hanzo Certified Agentic Marketing Engineer',
    track: 'marketing',
    units: 3.0,
    price: 149,
    rebateCredits: 38,
    duration: '3 Weeks · Self-Paced',
    level: 'Intermediate',
    prerequisites: 'Familiarity with digital marketing concepts, APIs, and basic scripting',
    summary:
      'Engineer programmatic growth machines. Generate multi-channel copy, studio images, voiceovers, and videos with locked brand voice, direct CMS hooks, and closed-loop CRO reinforcement.',
    capstone: 'Deploy an automated multi-channel campaign engine with real-time conversion reinforcement.',
    competencies: [
      'POST /v1/content/generate CMS pipelines',
      'Multi-modal asset generation (Zen 3, Wan 2.2)',
      'Event-driven campaign automation with /v1/auto',
      'Closed-loop A/B testing & LinUCB CRO optimization',
    ],
    planId: 'course-mkt-102',
    instructor: {
      name: 'Elena Rostova',
      role: 'Growth Systems Lead, Hanzo Commercial Labs',
    },
    syllabus: [
      {
        week: 'Week 1',
        code: 'MKT 102.1',
        title: 'Brand Consistency & Deterministic Multimodal Pipelines',
        summary: 'Lock brand voice, tone guidelines, and visual assets into deterministic programmatic generation pipelines.',
        lectures: [
          'Brand voice vector embeddings and system prompt constraint engineering',
          'Image and visual asset generation with consistent seeds, palettes, and typography',
          'Voiceover synthesis and audio mastering via /v1/audio/speech',
        ],
        readings: ['Hanzo Documentation: Multimodal Content Synthesis and Brand Voice Guardrails'],
        lab: 'Lab 1: Generate 10 verified multi-channel marketing variants that pass automated brand voice checks.',
      },
      {
        week: 'Week 2',
        code: 'MKT 102.2',
        title: 'Event-Driven Workflow Orchestration with /v1/auto',
        summary: 'Connect customer behavior events, webhook triggers, and autonomous agent workers.',
        lectures: [
          'Webhook payload ingestion and schema mapping',
          'Stateful customer journey graphs with conditional branching',
          'Rate limiting, email deliverability, and compliance auditing',
        ],
        readings: ['Enterprise Automation: Event-Driven Lifecycle Messaging at Scale'],
        lab: 'Lab 2: Wire an event-driven automation flow that responds to user onboarding milestones.',
      },
      {
        week: 'Week 3',
        code: 'MKT 102.3',
        title: 'Closed-Loop Conversion Rate Optimization (CRO)',
        summary: 'Build bandit-driven landing page optimization loops that iterate copy and layouts dynamically.',
        lectures: [
          'Multi-armed bandit testing vs traditional static A/B tests',
          'Real-time conversion feedback ingestion via /v1/analytics',
          'Capstone evaluation and HAME certification issuance',
        ],
        readings: ['Scott: Multi-Armed Bandits for Digital Experimentation'],
        lab: 'Capstone Project: Deploy an autonomous landing page optimizer that increases conversion by > 15%.',
      },
    ],
  },
  {
    slug: 'ai-practitioner',
    code: 'PRA 104',
    title: 'AI Practitioner & Tool Integration',
    credential: 'HCAIP',
    credentialFull: 'Hanzo Certified AI Practitioner',
    track: 'systems',
    units: 2.0,
    price: 99,
    rebateCredits: 25,
    duration: '2 Weeks · Fast Track',
    level: 'Foundational',
    prerequisites: 'Basic programming literacy and familiarity with IDEs (Cursor/VSCode)',
    summary:
      'Master the fundamentals of the unified cloud. Understand model selection across Zen, Enso, and Kai, integrate the 13 unified MCP tools into your editor, and manage cloud spend.',
    capstone: 'Integrate the full Hanzo MCP suite into Cursor and automate development workflows.',
    competencies: [
      'Navigating api.hanzo.ai and credential management',
      'Model family taxonomy and pricing contracts',
      '13 unified MCP tools configuration in Cursor/Claude',
      'Usage metering and quota monitoring via CLI',
    ],
    planId: 'course-pra-104',
    instructor: {
      name: 'Aisha Al-Mansoor',
      role: 'Staff Solutions Engineer, Hanzo Developer Experience',
    },
    syllabus: [
      {
        week: 'Week 1',
        code: 'PRA 104.1',
        title: 'Cloud Foundations & Editor Integration',
        summary: 'Configure API keys, set up local CLI tooling, and wire Model Context Protocol servers into Cursor.',
        lectures: [
          'Account setup, organization scoping, and API key provisioning',
          'Installing and configuring hanzo CLI across macOS and Linux',
          'Connecting Cursor and Claude Desktop to Hanzo MCP tool endpoints',
        ],
        readings: ['Hanzo Developer Guide: Quickstart and Tool Integration'],
        lab: 'Lab 1: Configure Cursor with full access to Hanzo filesystem, search, and shell MCP tools.',
      },
      {
        week: 'Week 2',
        code: 'PRA 104.2',
        title: 'Model Selection & Workflow Automation',
        summary: 'Pick optimal models for code, chat, vision, and reasoning while keeping spend under control.',
        lectures: [
          'Choosing between Zen 6, Zen 6 Flash, Enso, and specialized models',
          'Understanding tokens, context windows, and caching mechanisms',
          'Building daily developer automation scripts with the CLI',
        ],
        readings: ['Hanzo Model Guide: Latency, Quality, and Economics Across the Zen Family'],
        lab: 'Capstone Project: Automate an end-to-end pull request review workflow using Hanzo MCP and CLI.',
      },
    ],
  },
  {
    slug: 'ai-architect',
    code: 'ARC 105',
    title: 'Production AI Architect Masterclass',
    credential: 'HCPAIA',
    credentialFull: 'Hanzo Certified Production AI Architect',
    track: 'architect',
    units: 6.0,
    price: 499,
    rebateCredits: 125,
    duration: '6 Weeks · Capstone Immersion',
    level: 'Staff / Principal',
    prerequisites: 'Senior/Staff software engineering experience, distributed systems, and Kubernetes',
    summary:
      'Enterprise AI architecture at scale. Build self-hosted zero-trust clusters, configure post-quantum RNS tunnels, deploy global BFT agent meshes, and govern enterprise billing.',
    capstone: 'Design and deploy a fault-tolerant multi-cluster autonomous agent mesh across three regions.',
    competencies: [
      'Zero-trust cluster provisioning with hanzo up',
      'Post-quantum cryptography (ML-KEM, ML-DSA)',
      'Global agent mesh & BFT consensus with hanzod',
      'Multi-tenant IAM, KMS, and enterprise compliance',
    ],
    planId: 'course-arc-105',
    instructor: {
      name: 'Vikram Sethi',
      role: 'VP of Infrastructure & Security Architecture, Hanzo',
    },
    syllabus: [
      {
        week: 'Week 1',
        code: 'ARC 105.1',
        title: 'Zero-Trust Cluster Provisioning & Hardware Topology',
        summary: 'Provision sovereign compute clusters using hanzo up with isolated control planes.',
        lectures: [
          'Bare-metal and cloud GPU cluster topology design (NVIDIA H100, L40S, Apple Silicon)',
          'Automated bootstrapping with hanzo up and immutable OS images',
          'Multi-tenant network isolation with Cilium and eBPF data planes',
        ],
        readings: ['Hanzo Infrastructure Engineering: Sovereign Cluster Architecture at Scale'],
        lab: 'Lab 1: Provision a 3-node Kubernetes cluster with eBPF network isolation and GPU scheduling.',
      },
      {
        week: 'Week 2',
        code: 'ARC 105.2',
        title: 'Post-Quantum Cryptography & RNS Network Tunnels',
        summary: 'Secure inter-agent communication against quantum threats using ML-KEM and ML-DSA standards.',
        lectures: [
          'NIST Post-Quantum Cryptographic Standards (FIPS 203 ML-KEM, FIPS 204 ML-DSA)',
          'RNS (Resilient Network Sockets): low-latency authenticated P2P tunneling',
          'Key rotation lifecycles and hardware security module (HSM) integration',
        ],
        readings: ['NIST Special Publication: Transitioning to Post-Quantum Cryptography'],
        lab: 'Lab 2: Establish an ML-KEM encrypted tunnel between two independent worker pods.',
      },
      {
        week: 'Week 3',
        code: 'ARC 105.3',
        title: 'Byzantine Fault Tolerant (BFT) Agent Consensus',
        summary: 'Coordinate autonomous agent decision-making across untrusted networks using hanzod consensus.',
        lectures: [
          'Byzantine agreement protocols in autonomous decision pipelines',
          'Deploying hanzod consensus nodes for state machine replication',
          'Slashing and penalty conditions for malicious or hallucinating nodes',
        ],
        readings: ['Castro & Liskov: Practical Byzantine Fault Tolerance'],
        lab: 'Lab 3: Deploy a 4-node hanzod validator cluster and simulate network partition recovery.',
      },
      {
        week: 'Week 4',
        code: 'ARC 105.4',
        title: 'Enterprise Multi-Tenant IAM, KMS & Sovereign Compliance',
        summary: 'Design enterprise-grade identity, key management, and data sovereignty boundaries.',
        lectures: [
          'Fine-grained attribute-based access control (ABAC) in multi-tenant environments',
          'Bring-Your-Own-Key (BYOK) envelope encryption with KMS',
          'Zero-trust security frameworks, cryptographic audit logs, and compliance enforcement',
        ],
        readings: ['Hanzo Enterprise Security Standard: Multi-Tenant Zero-Trust Model'],
        lab: 'Lab 4: Configure an organization hierarchy with isolated KMS keyrings and policy constraints.',
      },
      {
        week: 'Week 5',
        code: 'ARC 105.5',
        title: 'Global Observability, Distributed Tracing & Cost Auditing',
        summary: 'Instrument distributed agent meshes with OpenTelemetry, ClickHouse datastores, and Prometheus.',
        lectures: [
          'Distributed trace propagation across multi-agent RPC hops',
          'Datastore ClickHouse schema design for high-cardinality token billing metrics',
          'Real-time anomaly detection for token runaway and runaway loops',
        ],
        readings: ['OpenTelemetry Specification: Semantic Conventions for Generative AI Systems'],
        lab: 'Lab 5: Build a real-time observability dashboard tracking token usage across a 50-node agent swarm.',
      },
      {
        week: 'Week 6',
        code: 'ARC 105.6',
        title: 'Multi-Region Mesh Deployment & Capstone Defense',
        summary: 'Deploy, stress-test, and defend a multi-cluster autonomous agent mesh across three geographic regions.',
        lectures: [
          'Geo-distributed failover, latency routing, and data replication strategies',
          'Disaster recovery drills and chaotic fault injection',
          'Capstone oral defense and HCPAIA credential issuance',
        ],
        readings: ['Verma et al.: Large-Scale Cluster Management at Google with Borg'],
        lab: 'Capstone Project: Deploy and defend an active-active multi-region agent mesh maintaining 99.99% uptime under simulated regional blackouts.',
      },
    ],
  },
]

export const MEMBERSHIP_COURSE: UniversityCourse = {
  slug: 'membership',
  code: 'PRO',
  title: 'Hanzo University Pro Membership',
  credential: 'HCPA',
  credentialFull: 'Hanzo Certified Professional (All-Access)',
  track: 'systems',
  units: 12,
  price: 29,
  rebateCredits: 50,
  duration: 'Monthly All-Access Membership',
  level: 'All Levels',
  prerequisites: 'None',
  summary:
    'Full access to all 6 accredited degree tracks, weekly live faculty labs, 50+ engineering guides, Hanzo Visor GPU sandboxes, and $50/mo in free Hanzo Cloud compute credits.',
  capstone:
    'Complete any degree track capstone defense to receive your official W3C Verifiable Credential on Lux.',
  competencies: [
    'Unlimited access to all 6 degree tracks (ENG 100, RL 101, SYS 103, MKT 102, PRA 104, ARC 105)',
    'Dedicated Hanzo Visor GPU microVM sandbox leases',
    '+$50 monthly usage credits deposited into your Hanzo Cloud account',
    'Weekly live faculty research seminars & office hours',
  ],
  planId: 'pro',
  featured: true,
  instructor: {
    name: 'Hanzo Faculty & Systems Team',
    role: 'Frontier AI Engineering Institute',
  },
  syllabus: [
    {
      week: 'All-Access',
      code: 'PRO.1',
      title: 'Full Curriculum & Live Sandboxes',
      summary: 'Unlock all 6 degree tracks, live CI autograders, and dedicated GPU sandboxes.',
      lectures: [
        'Weekly live faculty engineering labs & office hours',
        'Direct access to 50+ production agent guides and templates',
        'Private Discord community with Hanzo core systems engineers',
      ],
      readings: ['Hanzo Systems Whitepaper & Enterprise Architecture Guide'],
      lab: 'All laboratory modules across ENG 100, RL 101, MKT 102, SYS 103, PRA 104, and ARC 105.',
    },
  ],
}

export const ALL_COURSES: UniversityCourse[] = [
  ...UNIVERSITY_COURSES,
  ...ADDITIONAL_COURSES,
  MEMBERSHIP_COURSE,
]

export function findCourse(slug: string): UniversityCourse | undefined {
  return ALL_COURSES.find((c) => c.slug === slug)
}
