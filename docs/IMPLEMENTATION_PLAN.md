# Implementation Plan — RAC Menengai (rac-menengai.vercel.app)

**Project**: Rotaract Club of Menengai website redesign · Nakuru, Kenya · Rotary District 9212
**Stack (unchanged, no rewrites without reason)**: React 18 + Vite 6 + TypeScript (strict) + lucide-react.
**Added**: `react-router-dom` v7 (multi-page IA is a real routing problem) + `vercel.json` (SPA rewrites).

## Architecture

```
src/
  main.tsx               BrowserRouter + <Routes>
  App.tsx                Layout (AnnouncementBar, Header, Footer) + route table
  data.ts                ALL content, typed, single source of truth (CMS-ready)
  lib/format.ts          next-meeting date logic + countdown (real dates, edge cases)
  hooks.tsx              Reveal, useCountUp, useLockBody, useActiveSection, useScrollPosition
  components/
    ui.tsx               Button/Link, SectionHeading, PageHero, StatBar, PlaceholderImage
    layout.tsx           AnnouncementBar, Header, MobileNav, Footer, ScrollToTop, SkipLink
    cards.tsx            ServiceAreaCard, ProjectCard, ProjectFilter, LeaderCard,
                         StoryCard, OpportunityCard, FaqAccordion, AudiencePaths
    forms.tsx            ContactForm (join/partner/support/contact interest; no backend fallback)
    home.tsx             Hero, TrustBar, Services, FeaturedImpact, OpportunitySection,
                         LeadershipPreview, StoriesPreview, FinalCta
  pages/                 Home, About, Projects, ProjectDetail, Awards, Leadership,
                         News, Membership, Contact, NotFound
```

## Information architecture (per brief)

- `/` — announcement bar, hero ("A Decade of Service Above Self"), trust bar, what we do,
  featured impact (Adopt-a-River), current opportunity (next fellowship, real date),
  leadership preview, stories (≤3), FAQ, audience paths, final CTA.
- `/about` — identity, charter history, values, Rotary connection, timeline.
- `/projects` — touch-friendly filter + grid. `/projects/:slug` — story detail (challenge/action/location/partners/results where verified).
- `/awards` — verified recognition archive. `/leadership` — current board + past presidents.
- `/news` — stories archive. `/membership` — who can join, steps, faq, join form.
- `/contact` — partner/support paths, all contact fallbacks, form.

## Conversion

- One primary CTA label: **“Attend a fellowship”** (header, hero, opportunity, membership, final CTA).
- Announcement bar exposes next fellowship + date + micro-action.
- ContactForm: name, email, interest, message, consent; inline validation + success fallback
  (no backend exists — success panel points to Facebook/Instagram; flagged for a real endpoint).

## Design direction

- Calm editorial: navy `#090E18` hero/footer, warm paper `#F5F4F1` reading surfaces,
  pink `#C21F5D` accent (contrast-checked: 5.2:1 on paper, 5.7:1 for white on it),
  blush supporting surfaces, gold `#D9A441` only for awards, Fraunces headlines,
  Inter body/UI, JetBrains Mono metadata only.
- Decorative noise removed vs the current build: no cursor glow, no watermark numbers,
  no 3D tilt, no preloader, no section rail, no film grain, no marquee animation.
- Max content width 1200px; consistent 4/8/16/24/32/48/64/96 spacing scale; short transitions;
  `prefers-reduced-motion` fully respected.

## Verification

Typecheck + production build, then headless-Chrome/CDP checks: console errors, failed
requests, horizontal overflow at 320/375/768/1024/1440, all link destinations, mobile menu,
project filter, FAQ accordion, form validation + success, countdown date logic (incl. edge
cases), focus/keyboard, alt text + heading order, contrast spot-checks, hero + OG metadata.

## Confirmations

Every content value flagged for club confirmation lives in `docs/CONTENT_AUDIT.md`.