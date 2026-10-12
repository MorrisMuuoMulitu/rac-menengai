# Scroll and contrast verification

`npm run verify:scroll` walks every scroll position of a page in headless Chrome and checks the
things design-token maths cannot see. It is modelled on the verification harness that ships with
[scroll-craft](https://github.com/nateherkai/scroll-craft): dead scroll, contrast measured on the
composited page, and a reduced-motion pass.

## Running it

```bash
# 1. a Chrome with a debugging port (any page)
google-chrome --headless=new --remote-debugging-port=9222 --no-sandbox about:blank

# 2. the checks (dev server or a built preview)
npm run verify:scroll
# or with explicit targets:
node scripts/verify-scroll.mjs --base http://127.0.0.1:5173 \
  --routes /,/membership --widths 1440,390
node scripts/verify-scroll.py --dir docs/audit/scroll-check
```

Output lands in `docs/audit/scroll-check/`: `steps.json` (raw DOM samples per scroll step),
`scroll-verification.json` (the findings) and one screenshot per step.

## What each check means here

| Check | Reading |
|---|---|
| **Dead scroll** | Consecutive steps whose composited pixels change by less than 1/255. Stillness is *correct* on a reading site, so this is reported as a number of viewports, not as a failure. It matters only if a long stretch changes nothing **and** introduces nothing new. |
| **Composited contrast** | For each visible text sample, the backdrop is resolved from the DOM (nearest opaque ancestor fill) or, over photography, sampled from the screenshot outside the glyph box. Ratio is then measured against that, so text over photos is judged as the reader sees it. |
| **Reduced motion** | The page is reloaded with `prefers-reduced-motion: reduce` and every text-bearing element is checked for `opacity < 0.9` — i.e. content that a scroll entrance would leave invisible. |

## Measurement caveats (learned the hard way)

Three false-positive sources are handled explicitly, and any future change must keep them:

1. **Screen-reader-only text** has a real box; elements under 8px, `clip-path`-hidden or legacy
   `clip: rect(0px…)` are skipped.
2. **Controls with their own fill** (the "Join us" button) must be measured against the button's
   fill, not the page behind it.
3. **Underlines** contaminate any sample taken inside the glyph box, so image backdrops are
   sampled *outside* the box.

## The homepage hero (the one engineered peak)

The homepage hero is the site's single scroll-driven moment, built from independent depth planes
rather than effects sprinkled through the page:

| Plane | Motion | Driven by |
|---|---|---|
| Photograph | `scale(1 -> 1.08)` plus a small downward drift, so it lingers and deepens | `scroll(root block)` 0-100vh |
| Cranberry field | stays still while the copy panel lifts out of it | static, painted by `.menengai-hero::before` |
| Copy panel | lifts to -6rem, fading only after 92% (once it has left the viewport) | `scroll(root block)` 0-100vh |
| Headline | a further -1.75rem, so type and body separate slightly | same timeline, different keyframes |
| Cranberry wash | sweeps to 0.55 at the midpoint, settles at 0.22 | same timeline |
| Both planes | drift a few pixels against each other with the pointer | `--px` / `--py` from `useHeroPointer` |

Rules that keep it safe:

- **Additive by design.** All animation lives in `@supports (animation-timeline: scroll())`. Without
  support (or without JavaScript) the opening state renders in full — nothing is hidden.
- **The copy never fades while it is legible.** It translates out first; the fade begins at 92% of
  the timeline, when the panel is already above the fold. A mid-scroll translucent panel would put
  white text over the paper background and fail contrast — the harness would catch it.
- **Reduced motion removes the whole effect**, including the pointer drift and the wash.
- **The field behind the copy** exists because translating the panel exposed a pale gap where it
  had been; the field is painted statically so the exit reads as text leaving a fixed ground.

The headline is the club mantra, so it also assembles: each line rises out of its own mask in
sequence (880ms, second line +130ms), the ellipsis ticks in over three beats (`steps(3)`), then
breathes on a 3.6s loop. The mask carries extra bottom padding so the descender of "g" is not
clipped, which is the usual failure of masked type reveals. Accessible text stays
"Thee Magicals…" and reduced motion renders it settled.

Tuning lives in four places: the keyframe distances, `animation-range`, the `scale()` in
`hero-photo-deepen`, and the pointer multipliers in `.hero-copy-inner` / `.hero-photo` (plus the
mantra timings in `hero-line-rise`, `hero-dots-tick` and `hero-dots-breathe`).

## Last run

Two routes (`/`, `/membership`) at 1440, 390 and 320px — 60 scroll steps over the animated hero:
**0 dead-scroll regions, 0 contrast failures, 0 elements invisible under reduced motion.**
