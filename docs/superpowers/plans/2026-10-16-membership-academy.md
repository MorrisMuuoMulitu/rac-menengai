# Membership academy implementation plan

**Goal:** Upgrade the membership experience into a reusable, video-supported course and a genuine joining workflow; use Sanity Free for public content editing.

**Approved scope:** The user's 16 October request approves the preceding proposal, with Sanity restricted to its Free plan. Preserve the club branding, supplied photography, current routes and historical content. No paid upgrades or fabricated member information.

**Architecture:** Keep React/Vite and prerendering. Extract a club-neutral curriculum from the existing fourteen-lesson course, group it into six chapters and inject a separate club profile. Sanity holds public editorial content; private account/progress/assessment/application data uses a managed identity and database backend. Completion unlocks the joining checklist; only an officer confirms induction. Preserve the existing passcode course until the account flow has been verified.

## Tasks

- [ ] Provision Sanity Free and free-tier identity/database resources through the linked Vercel project. Do not duplicate resources or accept paid plans. Record account/terms handoffs precisely if required.
- [ ] Curriculum: create `shared/rotaract-academy/` with club-neutral lessons, six chapters, references and reviewed video metadata; create a Menengai club profile. Tests must cover chapter membership, no embedded club identity in core lessons, assessment consistency and no private answers in public outputs.
- [ ] Membership page: replace repeated sections with a photographic introduction, clear start/resume actions, concise requirements and dues, six-chapter syllabus, guest visit details and a visible joining journey. Preserve real enquiry fallback while delivery is unavailable.
- [ ] Learning player: short lesson flow, video controls with reading/transcript alternatives and explicit load consent for external media, scenario checks and a practical proposal. Retain keyboard focus, reduced motion, full image frames and low-data access.
- [ ] Persistent learning: verify managed identities on the server; scope all records by learner and club; store curriculum version, progress, graded attempts and application status. Never trust client scores or expose the answer key. Test cross-user access, duplicate submissions, version mismatch and network failures.
- [ ] Officer workflow: authenticated review, recorded decisions, no automatic induction, and a first-month member checklist. Bootstrap officer permissions only to a confirmed account; no public role controls.
- [ ] Sanity schemas/import: approved events, galleries, club information, leadership profiles, projects and public course/video metadata. Keep learner records and assessment keys out of public datasets. Make the existing content the migration input, with stable slugs and preview/build publication checks.
- [ ] Galleries: add an accessible full-frame lightbox with previous/next, Escape, focus restoration and mobile controls. Do not replace supplied portraits with invented images.
- [ ] Verify: meaningful unit/integration checks, production build, mobile/desktop browser flows, content and privacy checks, external video playback where available, and a fresh review. Document real-device and external-service limits honestly. Publish only a verified working build.

## Execution decisions

- Work on `codex/membership-academy` in the existing checkout, preserving the user's untracked audit folders. The user has already requested implementation; no additional design approval round is needed.
- Baseline: 74 tests pass across 11 files.
- Sanity Free has Administrator/Viewer roles only. Do not promise Free-plan editorial role separation. Membership officers' application access is separate from CMS administration.
- Shared curriculum is reusable source, not another club's live deployment. Naivasha branding and learner records remain separate.
- External videos must have a stable verified source and a reading alternative; do not invent transcripts or publish a broken player.

## Review focus

1. Learner A must never read learner B's records; officers must be authorised server-side.
2. Browser-edited completion/score must not unlock verified application or induction.
3. Losing network/storage must preserve readable course access without falsely claiming saved progress.
4. Sanity draft content and assessment answers must not leak into public prerendered output.
5. Old progress must not silently certify a different curriculum version.

## Progress ledger

- Plan created after source and rendered membership review. Real integrations are being provisioned before provider code is written.
