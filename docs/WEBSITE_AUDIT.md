# Website audit — 12 October 2026

Scope: existing React 18 / React Router 7 / Vite 6 / TypeScript application and public production website. No framework migration. Existing project URLs, club-provided membership fees and browser-local orientation workflow are retained. There was no backend, authentication, CMS, analytics or newsletter integration in the original application.

## Confirmed findings

| Severity | Location | Evidence | Correction |
|---|---|---|---|
| High | `vite.config.ts`, production nested routes | Direct browser navigation to `/about/district-9215`, `/membership/orientation` and all six `/projects/:slug` routes produced no h1 or readable UI. Production HTML requested `./assets/...` relative to the nested path. | Root-relative assets and prerendered route documents. |
| High | `src/components/forms.tsx` | Original submit handler waited 650 ms and set a success state without a network request. Only after submission did it explain that nothing was sent. | Upfront email-draft mode to the public club inbox; configurable server delivery with validation and failure handling. |
| High | `src/data.ts`, membership/about pages, `index.html` | Membership and structured data said 18–30. Rotary’s current club page says 18 and older. | 18+ wording in public copy, orientation and schema. |
| High | Original homepage, `src/data.ts`, old content audit | The public counters included 405 girls, 150 packs and a founding year that the existing audit marked for confirmation. | Counters withheld; original records preserved. Numerical outputs removed from project display. |
| High | Image uses | `logo-transparent.png` is a hands-in image, not an approved club logo. `welcome.jpg` is a get-together poster; `adopt-river.jpg` is a poster. Several unrelated images were described as photographs of health, education and peace events. | Plain text identity; incorrect project images removed; poster/archival captions corrected. Originals retained. |
| High | `src/pages/Leadership.tsx` | 2025/26 DEI officer appeared in current board. Joyce’s role was presented as authoritative despite absence of approved club roster. | Unconfirmed former officer withheld; Joyce labelled as a publicly reported presidency with source and roster limitation. |
| Medium | News cards | Original story links all pointed to Instagram’s profile, not individual reports. Years were not publication dates. | Two existing stories now have internal detail pages, primary-source links and verified publication dates. |
| Medium | Initial HTML | Original `index.html` contained an empty root. External fetch tool could not read the live site, while the actual browser could render top-level pages. | Initial HTML now contains public content for 23 routes. This is not a claim about Google’s historical indexing. |
| Medium | `vercel.json` | Catch-all SPA rewrite would return the application document for unknown URLs. | Explicit public routes, filesystem handling and a 404 response fallback. |
| Medium | Public discoverability | No sitemap or robots file in the repository. Canonical metadata used the current hostname, including previews. | Generated sitemap, robots, production canonicals, per-route initial metadata, Article/Breadcrumb schema. |
| Medium | Social destinations | X and personal-path LinkedIn URLs lacked current ownership evidence. | Removed from public navigation; retained in verification registry. Facebook and Instagram verified at public-identity level. |
| Medium | Browser presentation | Broad italic serif hero, multiple repeated headings, effects on nearly every section, decorative gradients and inconsistent imagery. These are design observations, not functional failures. | New photographic composition, shared type/color system and visible content without scroll entrances. |
| Medium | Dependency lock | npm audit reported source-map-js <1.2.2 event-loop denial-of-service advisory GHSA-68fv-2mgg-jv7q. | Compatible patch applied; subsequent npm audit reported zero vulnerabilities. |

## Evidence and limits

Original homepage screenshots exist at all nine requested widths in `docs/audit/screenshots/original-home-*.jpg`. The saved original route matrix covers 17 routes at 320, 375 and 390 px. A wider baseline pass captured the remaining homepage sizes but timed out before its route result file was written; that partial pass is not counted as a completed matrix.

The redesigned application was checked across 23 routes and all nine widths. See QA_REPORT.md for actual results. Source investigation covered all source pages, styles, assets, build/deployment configuration and existing tests. Historical `legacy.html`, NOTES.md and the original content audit remain as records, not authoritative current content.

No production configuration or secrets were overwritten. Preview deployment status is recorded separately. Current leadership roster, approved logo/portraits, photo permissions, exact project dates and direct form delivery still need the evidence listed in CONTENT_SOURCES.md and MAINTENANCE.md.
