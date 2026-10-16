# Academy redesign — audit and migration plan

Audit of `/membership/academy` and `/membership/orientation` against the
interactive learning brief. Written before the implementation, and kept as the
record of what was found.

## 1. What is actually there

| Concern | Today |
|---|---|
| Framework | React 18 + Vite 6, TypeScript, React Router 7. No Next.js. |
| Rendering | Prerendered to static HTML by `scripts/prerender.mjs`; the academy is a client-rendered island inside that shell. |
| Routing | `src/App.tsx`. Academy lives under a pathless `AcademyLayout` route. |
| Account | Clerk, loaded lazily in `src/academy/clerk.tsx`. Never on the marketing pages. |
| Records | Neon Postgres via `server/academy-db.ts`. One row per learner per club. |
| Authorisation | `server/academy-auth.ts`, verified email on the allowlist. Server-side only. |
| Assessment | `shared/rotaract-academy/assessment.ts`. Graded on the server; the key never ships. |
| Content | `shared/rotaract-academy/course.ts`, club-neutral, with a club profile injected. |
| Design system | `src/styles.css` tokens, plus `src/academy.css` for the academy. |

## 2. The two courses

- `/membership/orientation` — the passcode-gated course. Fourteen lessons,
  progress in `localStorage`, confirmed in person. Untouched by this work, and
  its access control must stay that way.
- `/membership/academy` — the account-based course. Six chapters, fifteen
  lessons, a situation per chapter, a 28-question assessment, a proposal, and
  the joining journey.

## 3. Problems found

1. **The first thing a learner meets is a wall of syllabus.** The page led with
   the full outline and a contents rail, not with "here is where you are and
   what to do next". A new learner had to read to find the start.
2. **No sense of place.** The rail showed states, but there was no overall
   picture: how much is left, what a chapter contains, how long it takes.
3. **Everything happened on one URL.** No lesson was linkable, so a learner
   could not be sent to "the meeting lesson" or return to it from a message.
4. **Long paragraphs.** Lesson copy ran three to six sentences per block.
   *Addressed:* split at sentence boundaries, shorter measure, terms of art
   marked once per lesson.
5. **Uniform typography.** No weight or colour hierarchy in the body.
   *Addressed:* lead paragraph, body softened, Rotary vocabulary emphasised.
6. **Thin interaction variety.** One situation per chapter and a flash-card
   deck. No ordering, matching, timeline or diagram activity.
7. **No achievement surface.** Completion existed as a number, not as a record
   of what someone had done.
8. **Officers could not see learner progress.** The queue showed submitted
   applications only.
9. **Accessibility gaps.** Heading focus was stolen on page load; the sign-in
   element rendered outside its provider and threw.

## 4. Migration approach

Incremental, with the existing URLs preserved and nothing removed:

1. `/membership/academy` becomes the **dashboard**: overall progress, resume,
   and six expandable chapter cards with per-lesson state, duration and
   objectives.
2. Each step becomes an addressable route under
   `/membership/academy/<step>`, so lessons are linkable and resumable.
3. The existing player moves behind those routes unchanged in behaviour.
4. New activity types are added as data-driven components, so content stays
   separate from presentation.
5. Achievements are derived from the record that already exists on the server,
   not stored again.

Deliberately **not** changed: the passcode course, the record schema, the
server-side answer key, the reviewer allowlist, and the club's branding.
