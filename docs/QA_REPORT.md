# QA report — 12 October 2026

The redesign is implemented and available as a protected Vercel preview. Production was not promoted. This report distinguishes completed checks from deployment prerequisites.

## Completed checks

- `npm run verify`: 55 passing tests in 6 files, TypeScript checking, client build, server render and static document verification.
- 23 prerendered public pages plus a 404 document. Initial HTML includes real content. 858 internal link references and 67 image references resolve; JSON-LD parses; canonical URLs and descriptions are present.
- Draft story slugs excluded from generated HTML and JavaScript bundles. Only approved content is imported by the browser application.
- Browser route checks at 320, 375, 390, 430, 768, 1024, 1280, 1440 and 1920 pixels. Raw measurements and screenshots are in `docs/audit/`. Every route has one H1 and no broken loaded images. A one-pixel home overflow at the smallest width prompted a smaller invitation heading; the final follow-up viewport override was not applied by the browser, so that exact measurement remains to be repeated.
- Homepage and news screenshots at all nine widths; full route screenshots at 320 and 1440. Screenshots were visually inspected for the main desktop/mobile layout. Final wide-screen heading spacing was corrected after a viewport screenshot revealed wrapping. Branding files added separately to the shared workspace are preserved and await provenance/approval verification.
- Mobile navigation: initial focus, Tab loop, Escape closure and focus restoration checked. Contact: validation, first-error focus, email draft recipient, copied preparation and preserved fields checked with synthetic visitor details. No message sent.
- Events archive selection visibly displays the completed Peace in Colour event. Calendar action displays its prepared-file message. Calendar encoding/date/folding are covered by tests; the browser download-event observer timed out, so an actual calendar-app import is not claimed.
- Orientation progression and stored completion rules covered by existing unit tests. A full manual quiz run in this session is not claimed.
- No browser warning/error entries observed during the final home/events check.
- `npm audit` after the dependency patch reported zero vulnerabilities.
- Deployed nested project: HTTP 200 with initial HTML. Unknown URL: HTTP 404 with helpful content. Security headers observed. Contact GET: HTTP 405 after fixing the server ESM import. Server validation, absent configuration and provider failures are covered by tests.

## Limits and release prerequisites

- No Lighthouse score or field Core Web Vitals measured. No Firefox, Safari, screen-reader session or real-device test performed. Browser measurements do not establish full WCAG conformance.
- No real email provider or rate-limit service is configured. The UI prepares a draft and does not claim delivery. Configure server variables, review privacy/retention and complete a real delivery test before enabling direct submission.
- Club approval still required for final wordmark, current officer roster, archived awards, image permissions and new researched stories. Unconfirmed research is retained privately as draft records.
- Fellowship venue must be confirmed with the club. No registration, payment, newsletter delivery, CMS or member authentication has been represented as operational.
- Vercel preview uses existing access protection. Production promotion remains pending review.
- Facebook caption expansion was blocked by automatic approval review after repeated rate-limit errors. The action did not execute; that record remains unverified. No confirmation is needed to review the implementation.

See `WEBSITE_AUDIT.md`, `CONTENT_SOURCES.md`, `BRANDING_VERIFICATION.md`, `SOCIAL_ACCOUNT_VERIFICATION.md`, `DESIGN_SYSTEM.md` and `MAINTENANCE.md` for evidence and maintenance instructions.
