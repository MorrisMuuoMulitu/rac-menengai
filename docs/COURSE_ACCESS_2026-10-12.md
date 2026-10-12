# Full Rotaract course and temporary access lock

## Git checkpoint

The pre-course website was committed and pushed to `origin/main` as `17545fc` before these changes. Subsequent local work by the user, including the photo-story update, was preserved. This course update remains uncommitted and has not been pushed or deployed.

## What changed

Membership contains a public 14-lesson syllabus and an unlock link. `/membership/orientation` shows a passcode gate. The full course covers history, the Rotary family, governance, Menengai membership, ethics, fellowship, service frameworks, project planning, safeguarding, finance, leadership, public image, district collaboration and a practical service proposal.

There are 14 reflection activities and 28 assessment questions, with a pass mark of 23. The 85-minute estimate includes reading and reflection. Learners mark every lesson complete before opening the assessment. Navigation resumes the first unfinished lesson; completion records remain personal learning records, not club induction or Rotary certification.

A new storage version separates the full course from the former nine-question course. The old progress record is retained in the browser but is not treated as completion of the new curriculum. Test progress for the new course was reset after browser verification.

On mobile and tablets, the contents panel collapses so lesson links do not delay reading. On desktop, the contents panel can scroll within the viewport.

## Local access

The generated local passcode and independent signing secret are in `.env.local`:

- `ORIENTATION_PASSCODE`
- `ORIENTATION_SESSION_SECRET`

The file is ignored by Git and has mode 0600. Credentials were not printed in logs or included in public code. Open it locally to retrieve the temporary passcode. Changing either setting invalidates existing sessions; restart the dev server after editing this environment file.

`npm run dev` includes a local adapter for the same course endpoint used by Vercel. Local development accepts localhost and 127.0.0.1 origins, and denies HTTP requests for files under `server/`.

## Before a future production release

Configure the server-only values in the linked Vercel project, with a passcode of at least 12 characters and an independent random session secret of at least 32 characters. Do not prefix either with `VITE_`. Set `SITE_ORIGIN` to the actual production origin. Local `.env.local` is not a production configuration.

Without these settings, access fails closed with a configuration message. No Vercel secrets were changed during this task.

## Access boundary

- Lessons, activities and assessment data live in `server/course.ts`; the public bundle imports only syllabus metadata and course types.
- `/api/orientation`: GET checks a session; POST verifies a passcode; DELETE clears the session.
- Session cookies are HMAC signed, HttpOnly and SameSite=Strict, with Secure on HTTPS origins and a four-hour lifetime. Passcode rotation changes the signing key. The UI removes the course when its session expires.
- Responses use private/no-store caching. State-changing requests require the configured origin. Malformed inputs and unsupported methods are rejected.
- A bounded per-IP in-memory attempt counter throttles repeated unlock attempts. It is local to a server process and is not a distributed Vercel-wide rate limiter; stronger cross-instance limits would need shared storage or platform rules.
- Learning progress is local browser data, not a verified assessment service. Authenticated learners can see delivered lessons and assessment data; the passcode gate controls access rather than preventing copying.

## Verification

- `npm run verify`: 72 tests across 10 files pass; TypeScript and client/SSR builds pass; 26 public routes prerendered; 1,167 internal links and 158 image references verified.
- Build checks assert private course prose and assessment text are absent from public HTML and JavaScript.
- Access tests cover anonymous readers, wrong codes, forged cookies, valid signed sessions, expiry, passcode rotation, missing configuration, cross-origin requests, locking and attempt throttling.
- Course integrity tests check syllabus consistency, unique questions, answer ranges, lesson exercises, reading-time totals and the actual 23/28 pass boundary.
- Resume tests cover incomplete lessons, retired IDs, assessment access and completed records.
- Browser verified wrong-code rejection, successful unlock, reload persistence, first-unfinished-lesson resume, all 14 lessons, all 28 answers, feedback, completion record, progress reset, mobile contents navigation, and locking after reload.
- 18 responsive checks cover public syllabus, fully loaded unlocked course and locked gate at 320, 390, 430, 768, 1024 and 1440 pixels, with no overflow or missing H1. Reports and screenshots are under `docs/audit/course/`.

## Content basis

Global history, eligibility and programmes were checked against Rotary International’s history, Rotaract policy, youth-programme and grants pages. Governance guidance references Rotary’s district-hosted Rotaract Handbook. Local arrangements use the club’s existing approved data and event records. The practical exercises and operational planning prompts are original course material. The authenticated course provides the source links for further reading; policies and programme eligibility should be checked with the relevant club, district or organiser before acting.
