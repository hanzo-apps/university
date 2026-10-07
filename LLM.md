# hanzo.university — system & repo reference

**Repository:** `hanzo-apps/university`  
**Site:** `https://hanzo.university`  
**Deployment:** Hanzo Forge Sites (`site.slug: university`, `out/`) & GitHub Pages with `CNAME: hanzo.university`

## Key Routes
- `/`: University home catalog, comparison matrix, 6 pillars of production rigor, FAQs, and enrollment actions.
- `/[slug]`: Dedicated course syllabus pages (`/agentic-coding`, `/reinforcement-learning`, `/agentic-marketing`, `/systems-engineering`, `/ai-practitioner`, `/ai-architect`) with real-time `CouponInput`.
- `/portal`: Enrolled Student Learning Workstation with gVisor sandbox shell simulator, AST diff inspector, autograder logs, spend metering, and W3C credential modal.

## Design & UI Tokens
- Substrate: `@hanzo/ui` on `@hanzo/gui` primitives.
- Dark theme palette matching Hanzo ecosystem (`var(--pure-black)`, `var(--card)`, `var(--border)`, `var(--white)`).
- Fonts: `@hanzo/font` (Zen variable typeface family).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
