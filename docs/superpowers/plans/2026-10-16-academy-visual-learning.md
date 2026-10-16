# Academy visual learning implementation plan

Approved scope: implement the six recommendations accepted by the user with “do it”.

Design: retain Menengai's colours and real team portraits. Bring the first teaching content above the fold. Use named reading sections, an interactive history timeline, a Rotary-family diagram and current board cards. Keep goals and optional video secondary. Each lesson gets an ungraded practice check with an explanation. Keep overall course progress separate from explored reading sections.

- [x] Add account-scoped private lesson notes using a separate table, without rewriting progress records. Explicit save, loading, unsaved, failure and retry states. Never expose notes in reviewer queues or public payloads.
- [x] Add twenty named section maps and practice checks. Cover every lesson and validate their choices/feedback.
- [x] Add visual teaching components using verified historical dates, existing club profile and leadership portraits.
- [x] Integrate compact lesson layout, collapsible contents, next-step names, accessible controls and mobile/reduced-motion styles.
- [ ] Run tests/build, visually inspect desktop/mobile, independently review, push and verify production without changing real learner progress or notes for testing.

Preserve course version, lesson IDs, existing completions and the 20-question final assessment. Notes are private learning aids, not membership submissions. Use existing free services only.

## Verification record

Tests: 188 passing across 26 files, including the new note API, note-draft race, lesson-design completeness, private-note component and assessment-feedback suites. Production build passes; 35 routes prerender; link, image and JSON-LD checks pass; private lessons and the assessment stay out of public HTML and JavaScript.

Database: the full schema block was executed against the real Neon database inside a transaction and rolled back. Confirmed the `academy_note` column set, the upsert on (user_id, club_id, lesson_id), and that the 2000-character check constraint rejects oversized text. No production rows were written.

Screen checks: lesson opening viewport at 1280px shows the first teaching content without scrolling; mobile at 390px shows no horizontal overflow; the contents toggle expands the course rail; the history milestone switches and reports its detail; a wrong practice answer shows the best answer plus explanation.

Ruling: the practice checks are ungraded and their answers ship in the client bundle. They are labelled "no marks" and never feed the graded assessment, whose key and explanations remain server-side. Keeping them public is what lets the check work without a session.

Ruling: lesson notes live in their own table rather than the learning record. A note write can therefore never overwrite completions, scores or proposals, and the reviewer queue still reads only applications.

Ruling: the reading section labels come from a client-side map keyed by lesson id, and a test asserts the label count matches the block-derived section count for every lesson. Adding a paragraph to a lesson fails that test until a label is added.
