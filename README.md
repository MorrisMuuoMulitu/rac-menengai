# Rotaract Club of Menengai — Website

React + Vite + TypeScript single-page site for the Rotaract Club of Menengai
(Nakuru, Kenya · Rotary District 9212). Brand tokens (pink `#C21F5D` + ink navy
`#1C2734`) are inherited from the previous static build; everything else was
rebuilt: Fraunces + Inter + JetBrains Mono typography, a token-driven design
system v3 (cursor-follow spotlight cards, film-grain textures, glass header,
rotating hero ring, marquee partners, outlined footer wordmark), filterable
projects with detail modals, an FAQ accordion, scroll-spy navigation and full
mobile support.

## Run it

```bash
npm install        # first time only (Node 18+)
npm run dev        # dev server → http://127.0.0.1:5173
npm run build      # typecheck + production build → dist/
npm run serve      # preview the production build on :8080
```

`dist/` is portable static hosting: relative asset base (`'./'`), hashed
filenames, ~1.2 MB total including all photography.

## Project structure

```
index.html              # SEO / OG / JSON-LD shell, font loading
vite.config.ts          # base './', dist output
src/
  main.tsx              # React entry, stylesheet import
  App.tsx               # section order = narrative arc
  styles.css            # entire design system (tokens → components → responsive)
  data.ts               # ALL content: copy, figures, links, FAQs (edit here, not in components)
  hooks.tsx             # Reveal-on-scroll, count-up, scroll progress, section spy, body lock
  components/
    chrome.tsx          # SectionHead, Navbar, Ticker, Footer, BackToTop
    sections.tsx        # Hero, Stats, About, Pillars, FocusAreas
    work.tsx            # Projects (+ modal), Signature, Awards, Leadership
    closing.tsx         # Join, News, Partners, Faq
assets/images/menengai/ # club photography (bundled + hashed by Vite, never hand-copied)
legacy.html             # previous static build, kept for reference only
```

## Conventions

- **Content lives in `src/data.ts`.** Components render; they never hard-code
  copy. To add a project, award or news item, append one object.
- **Images resolve through Vite** (`new URL(..., import.meta.url)` in
  `data.ts`), so builds are hashed and cache-busted. Never reference
  `/assets/...` by hand and never copy files into `dist/`.
- **One stylesheet.** All styling is in `src/styles.css`, organised
  tokens → primitives → sections → responsive → reduced-motion. No CSS
  frameworks, no CSS-in-JS.
- **Icons are `lucide-react` only.** No emoji in UI, no icon fonts.
- **Accessibility is a requirement**, not polish: skip link, focus-visible
  rings, `aria-expanded`/`aria-modal`/`aria-pressed` on interactive widgets,
  `prefers-reduced-motion` disables all animation.
- **TypeScript strict** (`tsc --noEmit` runs on every build). Keep it green.

## Verification

Automated browser checks (Playwright + Chrome, script kept outside the
project at `/tmp/rac-verify/`) cover: zero console errors, zero failed/blocked
requests, project filtering (6 → 2 on “Environment”), modal open/Escape-close,
FAQ accordion behaviour, mobile drawer, and no horizontal overflow at 390 px —
plus desktop/mobile screenshots for visual review. Re-run against any change
with `npm run build && npm run serve` first.
