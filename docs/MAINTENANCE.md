# Maintenance and deployment

Use Node 24+ and `npm ci`. Run `npm run dev`, `npm run verify`, and `npm run serve` to inspect the production build. Vite development is an SPA; production prerendering runs only during build. Source maps are not publicly generated.

## Content administration

Edit `content/stories/index.json` and `content/events/index.json`. New research starts as `draft` with null approval. Have a club officer check facts, contribution, dates and media rights, then set status to published and record who approved it and when. Every story needs a source URL and a real publication date. Unknown event times stay null; do not invent an end time to enable calendar export. Completed events are sorted into the archive by their date. Weekly fellowship has Nairobi-aware calendar export and a venue confirmation notice.

`prepare-content.mjs` creates an ignored public-only JSON input under `src/.generated/`; do not edit that generated file. Re-run the preparation command/restart dev after changing content. No login-based CMS was added because this site has no existing identity/backend service; Git review is the editorial approval boundary. The build and publication tests check draft exclusion.

Project narratives remain in `src/data.ts`; verification metadata is in `content/projects.json`. Keep slugs stable. Changing routes or approving a new event/story requires updating the explicit route list in `vercel.json`; the prerender script generates HTML and sitemap entries from approved records. Run `scripts/verify-build.mjs` before deploy. No arbitrary lastmod timestamps are emitted; introduce them only with a real per-record modification history.

## Enquiry delivery

The public contact form stores enquiries in Neon and makes them available only
to verified club officers at `/membership/enquiries`. A database-backed rate
limit allows five submissions per IP hash per hour. Officers can remove
enquiries after handling them.

To add email forwarding, configure the server-only `RESEND_API_KEY`,
`CONTACT_FROM`, and `CONTACT_TO` values. `CONTACT_TO` defaults to
`menengairc@gmail.com` in the deployment environment. The enquiry is still
stored when email forwarding fails, and the visitor can open an email draft as
a fallback. Never put secrets in a `VITE_` variable.

The endpoint accepts JSON POST requests only, checks origin, validates bounded
fields, rejects honeypot submissions, and supplies a provider idempotency key.
It does not log message bodies. Automated tests cover storage, validation,
rate-limit rejection, email-provider success and reviewer access. Tested
production submissions should be removed after verification.

## Deploy and search

Deploy previews to the existing `rac-menengai` project. Validate route HTML, HTTP 404, headers, images and core interactions before any production promotion. The task does not authorise changing account protection, billing or credentials. Keep preview indexing and production canonicals separate; production canonicals are fixed in source.

Use Vercel’s existing project settings, avoid forcing a framework migration, and keep secrets in its environment configuration. Search Console submission requires authorised property access; no indexing claim is made by generating a sitemap. Run Lighthouse on representative deployed pages and measure field Web Vitals after launch. Check source links and leadership every Rotary year; check the meeting venue and event announcements before each update.
