# Rotaract Club of Menengai

React, Vite and TypeScript website for community service and fellowship in Nakuru. The October 2026 redesign uses locally hosted Manrope and Barlow Condensed, a large cranberry Menengai masthead, a photographic contact sheet, a forest-green membership invitation and an interactive project chooser. Public routes are prerendered during build; project and orientation URLs are preserved.

```bash
npm ci
npm run dev
npm run verify
npm run serve
```

Node 24+ recommended. `npm run verify` runs the tests, strict type checking, client/SSR builds, static generation and output checks. `dist/` contains 23 public page documents and the 404 document. `vercel.json` maps known routes and returns HTTP 404 for unknown paths.

Content: `src/data.ts`, `content/stories/index.json`, `content/events/index.json` and `content/projects.json`. Research/social evidence: `content/social/`. Drafts are excluded from client imports by `scripts/prepare-content.mjs`.

Enquiries default to an explicit email draft. Direct delivery requires configured server credentials and a real delivery test; see `.env.example` and docs/MAINTENANCE.md. The orientation course retains local progress and quiz functionality.

Documentation: WEBSITE_AUDIT.md, DESIGN_SYSTEM.md, SOCIAL_ACCOUNT_VERIFICATION.md, BRANDING_VERIFICATION.md, CONTENT_SOURCES.md, QA_REPORT.md and MAINTENANCE.md in `docs/`. The original audit and legacy files are historical records.

Browser QA for the redesign: build and run the preview, then run `node scripts/verify-redesign.mjs` with `BASE_URL` set to that preview URL. It needs `playwright-core` and Chrome; `PLAYWRIGHT_MODULE` and `CHROME_PATH` can point to existing installations. The browser check does not submit contact forms. Current evidence lives in `docs/audit/redesign-v2/`; the rejected first pass remains in `docs/audit/redesign/`. Use `OUTPUT_DIR` to save a separate verification run.
