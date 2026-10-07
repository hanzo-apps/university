# Hanzo University (`hanzo.university`)

The open academic accreditation and systems engineering institute of the [Hanzo AI](https://hanzo.ai) ecosystem.

- **Production Domain**: `https://hanzo.university`
- **Source Repository**: `hanzo-apps/university`
- **Design System**: `@hanzo/ui` on `@hanzo/gui` primitives

## Curriculum & Tracks

| Code | Title | Credential | Tuition | Rebate |
| :--- | :--- | :--- | :--- | :--- |
| **ENG 100** | Agentic Coding Systems with Hanzo Dev & Zen 6 | **HACE** | $199 USD | +$50 Credits |
| **RL 101** | Native Reinforcement Learning & Post-Training | **HARLE** | $249 USD | +$63 Credits |
| **MKT 102** | Agentic Marketing & Autonomous Campaigns | **HAME** | $149 USD | +$38 Credits |
| **SYS 103** | Hanzo AI Systems Engineering Foundation | **HCAISE** | $149 USD | +$38 Credits |
| **PRA 104** | AI Practitioner & Tool Integration | **HCAIP** | $99 USD | +$25 Credits |
| **ARC 105** | Production AI Architect Masterclass | **HCPAIA** | $499 USD | +$125 Credits |

## Architecture & Features

- **Static Export**: 100% pre-rendered via Next.js (`output: "export"`) with zero runtime server pods.
- **W3C Verifiable Credentials**: Cryptographically signed proof issued on-chain to student DIDs (`did:hanzo:user:...`).
- **Student Learning Portal**: Interactive Hanzo Visor terminal simulation, AST diff inspection, automated grading telemetry, and compute metering.
- **Tuition Rebate Engine**: 25% of all tuition rounded up deposited immediately into Hanzo Cloud.
- **Interactive Coupon Engine**: Validates real-time promo codes (`STUDENT50`, `HANZO20`, `EARLYBIRD`, `LAUNCH25`, `DEVCOMMUNITY`, `VIP100`, `KAI`).

## Development

```bash
pnpm install
pnpm dev       # Local development server
pnpm typecheck # TypeScript validation
pnpm build     # Next.js static export into /out
```
