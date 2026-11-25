# hanzo.university — system & repo reference

**Repository:** `hanzo-apps/university`  
**Site:** `https://hanzo.university`  
**Deployment:** Hanzo Forge Sites (`site.slug: university`, `out/` via `hanzo.yml`) & GitHub Pages (`CNAME: hanzo.university`)

## Key Routes
- `/`: School of Intelligence Engineering home — hero, 4 interconnected layers banner, interactive "Choose Your Adventure / Which intelligence should you use?" selector, free `AUTO 101` spotlight, 25-course catalog across 4 schools + free foundation, 6 flagship certification tracks, transparent self-serve pricing, AI Faculty bots (`@Edu`, `@Sci`, `@Dev`, `@Cyber`, `@Data`, `@Doc`, `@QA`, `@Lang`), and honest W3C practical credential overview.
- `/[slug]`: Dedicated static syllabus & enrollment pages for all 25 courses (including `KAI 301` 9-step Lab 01 on `POST /v1/capabilities/{name}/train`) with `CouponInput`, AI Faculty bots, canonical `docs.hanzo.ai` links, and `https://hanzo.app/learn/<slug>` workspace launch buttons.
- `/checkout/[slug]`: Static checkout handoff pages to `hanzo.ai/pay` for all 25 courses, 6 certification tracks, and `membership` (University Pro bundled with Hanzo Pro).
- `/portal`: Student Learning Workstation with Hanzo IAM session resolution, 25-course selector, sandbox shell, verification logs, and W3C credential export.
- `/verify`: Public W3C Verifiable Credential inspection & JSON-LD/SVG export (cryptographic proof of completed practical capstones & live artifacts; non-accredited professional certifications).

## Design & UI Tokens
- Substrate: `@hanzo/ui` on `@hanzo/gui` primitives.
- Dark theme palette matching Hanzo ecosystem (`var(--pure-black)`, `var(--card)`, `var(--border)`, `var(--white)`).
- Fonts: `@hanzo/font` (Zen variable typeface family).

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
