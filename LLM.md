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
