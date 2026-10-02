# Rotaract Club of Menengai — Website

Multi-page React + Vite + TypeScript site for the Rotaract Club of Menengai
(Nakuru, Kenya · Rotary District 9212). Calm, editorial design system: navy
`#090E18` + warm paper `#F5F4F1` + pink `#C21F5D` (contrast-checked), Fraunces
display type, Inter body, JetBrains Mono for metadata.

## Run it

```bash
npm install        # first time only (Node 18+)
npm run dev        # dev server → http://127.0.0.1:5173
npm run build      # typecheck + production build → dist/
npm run serve      # preview the production build (SPA fallback works)
```

Deployed on Vercel (`vercel.json` rewrites SPA routes to `index.html`).

## Architecture

```
index.html            # SEO/OG/JSON-LD shell (NGO + weekly EventSeries)
vercel.json           # SPA rewrites
public/               # stable URLs for favicon + OG image (copied into dist)
src/
  main.tsx            # BrowserRouter entry
  App.tsx             # layout + route table
  data.ts             # ALL content, typed, single source of truth
  lib/format.ts       # next-meeting date math (Nairobi tz, edge cases, real dates)
  hooks.tsx           # Reveal, useCountUp, scroll-lock, active-section, scrolled
  components/
    ui.tsx            # SectionHeading, PageHero, ButtonLink, StatBar, PageMeta, PlaceholderImage
    layout.tsx        # AnnouncementBar, Header (+accessible mobile menu), Footer, ScrollToTop
    cards.tsx         # ServiceAreaCard, ProjectCard, ProjectFilter, LeaderCard,
                      # StoryCard, OpportunityCard (live date), FaqAccordion, AudiencePaths
    forms.tsx         # first-party contact/join form (validation, errors, success fallback)
    home.tsx          # Hero, TrustBar, Services, FeaturedImpact, OpportunitySection,
                      # LeadershipPreview, StoriesPreview, FinalCta, PartnersStrip
  pages/              # Home, About, Projects, ProjectDetail, Awards, Leadership,
                      # News, Membership, Orientation (new member course),
                      # Contact, NotFound
  lib/                # fellowship.ts (event logic) + orientation.ts (course logic)
docs/                 # IMPLEMENTATION_PLAN.md + CONTENT_AUDIT.md (confirmations)
assets/images/menengai/  # club photography (bundled + hashed by Vite)
```

## Conventions

- **Content lives in `src/data.ts`.** Components render; they never hard-code copy.
- **No invented facts.** Every number, name and date traces to club materials;
  anything pending officer confirmation is flagged in `docs/CONTENT_AUDIT.md`.
- **One primary CTA label** everywhere: “Attend a fellowship”.
- **Accessibility is a requirement** — one `h1` per page, landmarks, keyboard
  accordion/filter/menu/form, visible focus rings in light and dark, meaningful
  alt text, and full `prefers-reduced-motion` support.
- **Images resolve through Vite** (`new URL(..., import.meta.url)`); never copy
  files into `dist/`.
- **Icons are `lucide-react` only** — no emoji in UI, no icon fonts.
- **TypeScript strict** (`tsc --noEmit` runs on every build). Keep it green.

## Content note

The club has not yet supplied an official email/phone, so the contact form
validates locally and its success state explains how to reach the club
(Facebook/Instagram) until a real endpoint exists — see the audit.