# Release and newcomer additions — 12 October 2026

## Production release

The existing UI polish was deployed before beginning the learning additions.

- Production: https://rac-menengai.vercel.app
- Deployment: https://rac-menengai-r7ndwpgn0-morrismulitu-gmailcoms-projects.vercel.app
- Vercel deployment ID: dpl_uG9k8js9uvwFKgAByzKkw3MVD3Z6
- Vercel status: READY
- Release verification: 57 tests passed; 25 prerendered routes; browser confirmed the home photo gallery.
- Screenshot: `audit/learning/production-release.png`.

No GitHub push was performed. The additions below have not been deployed.

## Local additions

- `/learn`: 23 searchable glossary terms with topic filters, result count and empty-state reset; a sourced history; five project stages; activities versus outcomes; three existing Menengai photo stories; five avenues versus seven focus areas.
- `/membership#first-visit`: first-visit guidance and existing club hours, venue and free guest policy. Unconfirmed clothing, access and weekly schedule details are referred to an officer rather than presented as policy.
- Membership FAQ now covers coming alone, non-students, time, clothing and deciding after visiting.
- Existing orientation now explains sponsorship accurately, adds practical service examples and links to the learning material. It no longer contradicts `requiredBeforeInduction: false`; officers confirm induction. The final quiz question checks that completing an online course does not confer membership. Nine questions and pass mark eight remain unchanged, preserving the saved-score format.
- Learning links added to membership, Rotary, mobile navigation and footer. Home and mobile first-visit links lead to the guide.
- `/learn` participates in SSR, sitemap, metadata and Vercel routing.
- Existing photos and sourced records reused. No dependencies, copied reference-site prose or fabricated results added.

## Sources

- https://www.rotary.org/en/get-involved/our-clubs/rotaract-clubs
- https://my-cms.rotary.org/en/recent-rotaract-policy-updates?embed=true
- https://www.rotary.org/articles/2019/07/1968-expanding-our-reach-with-rotaract
- https://www.rotary.org/en/our-causes
- https://rotary9215.org/
- Existing Menengai club data and approved event records.

The unofficial reference inspired the glossary, visitor questions and educational structure. Global facts were checked against Rotary sources; its incorrect district geography and mandatory sponsorship claims were excluded.

## Verification

- Search suite initially failed because the new module did not exist; implementation then passed abbreviation, whitespace, cross-field query, punctuation, combined-category and empty-result checks.
- `npm run verify`: 61 tests passed, TypeScript and client/SSR build passed, 26 public pages prerendered. Verified 1,166 internal links and 158 initial image references, JSON-LD and draft exclusion.
- `audit/learning/responsive.json`: 36 browser checks, six pages at 320, 390, 430, 768, 1024 and 1440 pixels. No page overflow, unclipped element overflow, missing H1 or broken loaded images. Intentional home-photo clipping and horizontally scrollable camera rail are excluded from element-overflow failures.
- Browser exercised DRR search, a conflicting topic filter, empty-result reset, newcomer FAQ expansion and mobile-menu navigation to Learn. Confirmed the first-visit anchor remains below the header after scrolling settles.
- All four learning photographs loaded; browser error/warning scan was empty.
- Keyboard-compatible native inputs/buttons, labelled search, pressed topic states and polite result count; motion preferences respected. Temporary viewport override reset.
