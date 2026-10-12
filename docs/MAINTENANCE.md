# Maintenance and deployment

Use Node 24+ and `npm ci`. Run `npm run dev`, `npm run verify`, and `npm run serve` to inspect the production build. Vite development is an SPA; production prerendering runs only during build. Source maps are not publicly generated.

## Content administration

Edit `content/stories/index.json` and `content/events/index.json`. New research starts as `draft` with null approval. Have a club officer check facts, contribution, dates and media rights, then set status to published and record who approved it and when. Every story needs a source URL and a real publication date. Unknown event times stay null; do not invent an end time to enable calendar export. Completed events are sorted into the archive by their date. Weekly fellowship has Nairobi-aware calendar export and a venue confirmation notice.

`prepare-content.mjs` creates an ignored public-only JSON input under `src/.generated/`; do not edit that generated file. Re-run the preparation command/restart dev after changing content. No login-based CMS was added because this site has no existing identity/backend service; Git review is the editorial approval boundary. The build and publication tests check draft exclusion.

Project narratives remain in `src/data.ts`; verification metadata is in `content/projects.json`. Keep slugs stable. Changing routes or approving a new event/story requires updating the explicit route list in `vercel.json`; the prerender script generates HTML and sitemap entries from approved records. Run `scripts/verify-build.mjs` before deploy. No arbitrary lastmod timestamps are emitted; introduce them only with a real per-record modification history.

## Enquiry delivery

Default is email-draft mode: visitors prepare a message and send it themselves to menengairc@gmail.com. It never claims delivery. The server endpoint exists but fails closed without complete configuration.

To enable direct delivery, configure server-only RESEND_API_KEY, CONTACT_FROM (verified sender), CONTACT_TO, UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN. Set SITE_ORIGIN to the exact permitted site origin. Never put secrets in a VITE_ variable. First agree the inbox retention policy, update privacy copy, run a real authorised delivery test, then set VITE_CONTACT_DELIVERY=true and rebuild.

The handler accepts JSON POST only, checks origin, validates bounded fields on the server, rejects honeypot submissions, limits an IP hash to five requests per hour using Redis, and supplies a provider idempotency key. Redis failure blocks sending. Email bodies are not logged or saved to an application database. Provider errors return a generic failure; client input remains editable. Provider acceptance is not proof that a human read the message.

Local Vite does not execute Vercel API functions. Unit tests inject provider/Redis responses. Test deployed delivery only with explicit authorisation to send a test enquiry.

## Deploy and search

Deploy previews to the existing `rac-menengai` project. Validate route HTML, HTTP 404, headers, images and core interactions before any production promotion. The task does not authorise changing account protection, billing or credentials. Keep preview indexing and production canonicals separate; production canonicals are fixed in source.

Use Vercel’s existing project settings, avoid forcing a framework migration, and keep secrets in its environment configuration. Search Console submission requires authorised property access; no indexing claim is made by generating a sitemap. Run Lighthouse on representative deployed pages and measure field Web Vitals after launch. Check source links and leadership every Rotary year; check the meeting venue and event announcements before each update.
