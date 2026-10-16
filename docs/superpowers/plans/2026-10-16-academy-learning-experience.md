# Academy learning experience implementation plan

**Goal:** Make the approved Academy easier to navigate, study and practise without changing saved completions or the 20-question assessment.

**Architecture:** Keep the existing React routes and server grading. Add a focused Academy shell and a reusable section reader. Keep lesson IDs and course version unchanged; isolate browser drafts using account and question identity.

**Constraints:** Existing progress stays intact. No test submissions to real learner records. Mobile and keyboard controls remain usable. Club customs must be labelled; no invented grace or mandatory global ceremony.

**Design direction (authored under the user's creative delegation):** A quiet study workspace with Menengai magenta, dark ink and warm paper. Journey: orient, read one idea, practise, receive feedback, continue. The memorable interaction is working through a lesson in short sections with a visible route back to the complete reading. Motion serves section changes and respects reduced motion.

## Tasks
- [x] Repair assessment feedback and draft isolation; cover identity and chapter-resume bugs with tests.
- [x] Add dedicated learning navigation, section-based reading, accessible recap cards and clearer previous/next controls.
- [x] Check available official sources, remove stale schedule wording, distinguish local customs and source limitations.
- [ ] Run the complete suite/build; inspect desktop/mobile and real practice interactions; review changes and publish the verified result.

## Review focus
Account switching must not restore another person's draft. Changed question ordering must not reuse index-based answers. Passing must show results before continuing. Completed steps must stay accessible. Guests must be able to read material without pretending to have saved progress.

## Verification record
Independent review found that a single storage key still let another learner overwrite a draft. Fixed with scoped storage keys; the A → B → A regression test failed before the fix and passes afterward. No learner record, test attempt or membership application was submitted during browser testing.

Checked section navigation, role matching (4/4 feedback), mobile lesson selection and flashcard reveal. Inspected 390, 768 and 1280 pixel viewports; no horizontal overflow at phone/tablet sizes. Reduced-motion emulation reports a 0s flashcard transition. Evidence lives under `docs/audit/academy-experience/` (local audit files).

Source review: Rotary's current Rotaract overview, historical policy-update page, causes page and official Four-Way Test article were accessible. Exact Object wording and Brand Center review remain pending; the register explicitly records these limitations. Suggested club review owners are not claimed as actual reviewers. Menengai's approved grace, standing agenda and formal local procedures still require club confirmation.

Ruling: keep the existing course version and lesson IDs because this release changes presentation and clarifies wording, not completion requirements. Do not invalidate existing completions. Keep historical assessment passes and label scores from earlier longer assessments without showing an impossible score out of 20.
