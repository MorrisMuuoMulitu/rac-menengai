> Historical audit from the earlier build. See WEBSITE_AUDIT.md and CONTENT_SOURCES.md for current verification and publication decisions; earlier [V] labels are not new verification.

# Content Audit — RAC Menengai Website

Every value below is either **Verified** (traced to club materials already in this repo:
club social pages, LinkedIn posts, Nakuru County coverage, or NOTES.md) or **CONFIRM**
(needs a club officer to confirm before public use). Nothing was invented.

Legend — `[V]` verified · `[C]` confirm · `[MISSING]` no source available.

> **Club-provided update (supersedes earlier scraped values):**
> - **Rotary District is 9215** (the site previously said 9212, taken from the club’s
>   social pages before the change). All present-tense district references, SEO
>   meta and `parentOrganization` structured data now read **9215**.
> - **Membership fees: KES 3,000 per year + KES 500 Rotaract pin**, supplied by the
>   club and now shown on the membership page, the FAQ and the orientation course.
> - The **2026 DEI Champion award card still reads “Rotary District 9212”** — kept
>   because it was awarded in the 2025/26 year, before the district change. Confirm
>   whether the certificate should now read 9215.
>
> Historical reference files (`legacy.html`, `NOTES.md`) were deliberately left
> untouched — they are archives of the previous build, not part of the live site.

## Identity
| Field | Value | Status |
|---|---|---|
| Club name | Rotaract Club of Menengai (RAC Menengai) | [V] |
| City / region | Nakuru, Kenya · Rotary District 9215 | [V] — club-provided; supersedes District 9212 from the social pages |
| Sponsor mother club | Rotary Club of Nakuru | [V] |
| Charter / founding | ~2015/16; 10th anniversary celebrated 2025 | [C] — exact charter year (2015 vs 2016) for “Est.” and JSON-LD |
| Meeting | Every Thursday, 5:30–6:30 PM, Nakuru | [V] |
| Members | Young professionals + students, ~18–30 | [V] |
| Motto | Service Above Self | [V] |

## Contact
| Field | Value | Status |
|---|---|---|
| Email | `contactConfig.email` = `CONFIRM_OFFICIAL_EMAIL` — placeholder, hidden from visitors | [MISSING] — provide the real address to `src/data.ts` and it appears site-wide |
| Phone | `contactConfig.phone` = `CONFIRM_OFFICIAL_PHONE` — placeholder, hidden | [MISSING] |
| WhatsApp | `contactConfig.whatsapp` = `CONFIRM_OFFICIAL_WHATSAPP` — placeholder, hidden | [MISSING] |
| Socials | Facebook @RCmenengai · Instagram @racmenengai · X @RcMenengai · LinkedIn RAC Menengai · Threads @racmenengai | [V] |
| Contact form | Client-side only (no backend endpoint exists). Validates name / email-or-phone / interest / message / consent; pending + double-submit guard + failure state; after "success" the panel states plainly that NOTHING was sent by the form and points to Facebook/Instagram. Wire a real endpoint (Formspree/Web3Forms/club email) in `ContactForm.onSubmit` when available | [MISSING] backend |

## Fellowship schedule (operational)
| Field | Value | Status |
|---|---|---|
| Weekday / time | Every Thursday 17:30–18:30 East Africa Time | [V] |
| Timezone | `Africa/Nairobi` — all UI and JSON-LD use it explicitly | [V] |
| Override | `FELLOWSHIP_OVERRIDE` in `src/data.ts` (null = weekly schedule) | [C] — set when the club pauses a week |
| Venue | **Nakuru Athletic Club, Nakuru** | [V] — club-confirmed in the Q1 2026–2027 activities bulletin (12 October 2026). Published across the site, the calendar export and page metadata. |
| Book Club Review | Every second Sunday of the month | [V] — same bulletin; shown on `/events` beside the weekly fellowship |

## Q1 2026–2027 activities (club bulletin, 12 October 2026)
Recorded as published event records with the bulletin as their approval source (no external URLs
exist for them, so the event detail page shows the provenance line instead of a report link).

| Date | Activity | Venue |
|---|---|---|
| 6–7 June 2026 | Presidential Installation — transition to the 2026/27 leadership | Nakuru |
| 16 July 2026 | Mother Pack Project | Bondeni Maternity Hospital |
| 22 August 2026 | Mother Pack Project, with the Rotaract Club of Bahati | Nakuru |
| 5 September 2026 | Art Day | Pangani Special School |
| 15 September 2026 | Induction of New Members | Nakuru |
| 10 October 2026 | Mazingira Day | Pangani Special School |
| 10 October 2026 | Book Club anniversary — Camping Affair | Nakuru |
| 18 November 2026 | **Medical Camp (upcoming)** | Nakuru — venue to be announced |

The bulletin also confirms the weekly Thursday fellowship venue and the Book Club Review rhythm.

**Mother pack photographs** are published on `/events/mother-pack-bondeni-july-2026` (twelve
photographs, 16 July 2026) and `/events/mother-pack-kabatini-august-2026` (thirteen photographs,
22 August 2026 at Kabatini Maternity, with the Rotaract Club of Bahati — the venue the club's
bulletin described only as "Nakuru"). These images show identifiable patients; the club supplied
them and holds the consent question.

The second event was renamed on the club's wording: **Mother Pack Project at Kabatini Maternity**
(slug `mother-pack-kabatini-august-2026`, replacing the placeholder `mother-pack-bahati-august-2026`).

The **Rotaract Club of Bahati** partnership is carried in a dedicated `partners` field rather than
buried in the organiser text, so the record shows `Organiser: Rotaract Club of Menengai` and
`With: Rotaract Club of Bahati`, and the events list reads "Kabatini Maternity, Nakuru · with the
Rotaract Club of Bahati". One of the published photographs shows both clubs' banners, which is what
substantiates the joint attribution.

**Photo attributions were verified against the images themselves**, not just the folders: the
installation batch is the June ceremony (balloons, badge pinning), the Bondeni batch carries
16 July capture dates and Bondeni signage, and the Kabatini batch carries 21–22 August dates and
includes both clubs' banners.

**Art day photographs (11 of 13 images)** are published on `/events/art-day-pangani-2026`,
   including the learners' artwork and the session in the school hall. Two near-duplicate wide
   frames were dropped. These show identifiable learners at a special school: the club supplied
   them and **guardian consent is the club's to confirm** (see media-attributions).

**Installation photographs (12 images)** were supplied by the club and are published on
`/events/presidential-installation-june-2026` — one hero photograph plus a twelve-image gallery,
each thumbnail linking to the full 1280px file. Alt text describes each scene only; no individual
is named in a caption. The event records for the other Q1 activities carry no photographs yet, and
the Medical Camp (18 November 2026) has no confirmed venue — neither gap is filled by inference.

## Landing page, About and the projects/events split (12 October 2026)

- **The landing page now leads with current activity.** The old "From the archive" block, which
  surfaced only 2024/2025 stories, is replaced by *"Latest from the club / Just back from the
  field"* — the three most recent events **that have photographs**, newest first, each linking to
  its record. Written stories remain on `/news`, linked from the same section.
- **About no longer carries an event.** The 2024 city clean-up milestone was removed from the club
  timeline; About now holds club-level history only (2019 presidency, 2022 Adopt-a-River launch,
  2025 ten years of service). Dated activities belong on `/events`.
- **Projects and events are complementary, not duplicates.** A *project* is an ongoing programme
  (what the club runs, with its challenge, funding and reach); an *event* is one dated occasion
  (when, where, photographs). They are now linked rather than repeated: events carry a
  `projectSlug` where one applies — Peace in Colour Fest, both mother pack distributions and
  Mazingira Day — the event page states "Part of the <programme> programme", and each programme
  page lists its **Recent activity** with links and thumbnails. The two pages answer different
  questions: `/projects` answers "what do you do?", `/events` answers "what happened, and when?".


## Photographs: recent only (12 October 2026)

Every photograph on the site now comes from the club's 2026 activity batches (installation, Bondeni,
Kabatini, art day, Mazingira Day — 59 photographs). The older derivatives under
`public/images/projects/` and `public/images/gallery/` were deleted; the originals remain in
`assets/images/menengai/` as repository history.

Replaced or removed:

| Where | Was | Now |
|---|---|---|
| Home hero | archive banner frame | Mazingira Day group photograph |
| Home "In the community" feature | River Ndarugu (old river frame) | Mother Packs, with the Kabatini photograph; Ndarugu moved to the text list |
| About visual | a project poster captioned as members at a launch | a recent Bondeni photograph, captioned honestly |
| Awards archive | five old certificate images | text-only archive |
| Stories | old county and festival images | text-only (they retain their sources and dates) |
| Project programmes | adopt-a-river and ndarugu frames | no image — no recent equivalent exists, so none is shown rather than reusing an old one |

Only the mother-packs programme keeps a photograph, because only that programme has recent
photographs that genuinely depict it.

## Old records: what was kept and why

The club asked whether old events with no updated information should be removed. They were **not**
deleted, for these reasons:

- **Peace in Colour Fest (27 Sep 2025)** is the only pre-2026 event. It is substantiated by an
  external organiser's report, and the peace-fest programme page links to that report; deleting the
  event would orphan the citation. It now carries no photograph.
- **The two published stories** (peace in colour, city clean-up) carry real publication dates and
  primary sources. They are text-only, and they are the only content on `/news`.
- Old award entries are archive records, which is what an archive page is for.

If the club prefers a current-Rotary-year-only site, the removal is: the 2025 event record, the two
2024/2025 stories, and the pre-2026 award entries. Each is a one-line change; say the word.

Still open from the bulletin: the draft story "Joint medical camp at Kabati" may relate to the
Medical Camp on 18 November 2026 — publish, correct or drop it.

## Mother club (12 October 2026)

The club supplied its sponsor's details, now published on `/about`: **The Rotary Club of Nakuru**,
chartered **1952**, part of Rotary International, meeting **every Tuesday 12:45–2:00 PM at the Rift
Valley Sports Club, Nakuru**, with **Col. (Rtd.) Raymond Cheruiyot** as President (installed July
2026). Held in `MOTHER_CLUB` in `src/data.ts` so an officer can update it in one place.


## News removed; pre-2026 activity purged (12 October 2026)

At the club's instruction the site now carries no pre-2026 activity and no News section.

- **News removed entirely**: `/news` and `/news/:slug` routes, the News and story-detail pages, the
  nav and footer links, the story pipeline (`content/stories/`), the `Story` type, story routes in
  the prerenderer, the Article schema, the story tests and the `storySlug` field on events. Every
  home-page and awards-page link that pointed at News now points at Events.
- **Pre-2026 events gone**: the Peace in Colour Fest event (27 Sep 2025), its project page, and the
  two pre-2026 stories. Events now run June–November 2026 only.
- **Awards**: the three entries that recorded pre-2026 *events* were removed (City Clean-up 2024,
  DRR Meet & Greet 2023, Adopt-a-River Launch 2022). The two that are recognitions rather than
  events were kept — Ten Years of Service (2025) and DEI Champion (2026).
- **About** keeps its club-history milestones (2019, 2022, 2025); they are history, not activity.
- **Types**: `Story`/`PublicEvent`/`PublicAccount` are now declared explicitly in `src/content.ts`.
  Inferring them from the generated JSON collapsed to `never` once a collection emptied, which
  broke 50+ type references — that fragility is gone.


## Become a Member page (12 October 2026)

The club asked for a membership page. A block of text from **another Rotary club** was supplied as
inspiration, and it was deliberately **not** reused: it describes a different club in a different
city. Specifically, none of the following was imported, because none of it is true of RAC Menengai:

| In the supplied text | Why it is not on our site |
|---|---|
| Venues "Laico Regency" / "Golden Tulip Hotel, Muthithi Road" | Nairobi venues; our fellowship is at Nakuru Athletic Club |
| Thursday 12:30 PM | our fellowship is 5:30–6:30 PM |
| "at least 30 years old", Rotaract "18–30" | our published eligibility is 18 and over |
| "attend at least 50% of all weekly meetings per year" | a Rotary club rule; we publish no attendance quota |
| Joining fee and weekly lunch costs | no joining fee is confirmed for our club, and we have no lunch arrangements to describe |
| Membership by proposal, classification and vocation | we do not claim a proposal requirement; our published path is fellowship, a project, orientation, induction |

The page was written from facts already verified elsewhere in `src/data.ts`: 18+, three fellowships
as a guest at no cost, the four join steps, the orientation course, KES 3,000 annual subscription
and the KES 500 pin, with projects funded separately by fundraising. It adds **"What we ask of
you"** — time, service, dues, and what we expressly do not ask (no published joining fee, no minimum
donation) — which is the useful part of the supplied text without borrowing its specifics.

## Impact figures
| Figure | Context | Status |
|---|---|---|
| 10+ years of service | chartered ~2015/16 | [C] year |
| 405 girls | sanitary-towel donations (~3 months per girl) at Limuko High & Primary | [V] (club posts) — confirm count & year (2026) |
| 2 rivers | Adopt-a-River (River Njoro) + River Ndarugu cleanup | [V] |
| 150+ mother packs | Bondeni Maternity, opening the 2026 Rotary year | [V] (club posts) — confirm exact count |
| 20+ youth volunteers | Adopt-a-River cleanups | [C] — confirm number |

## Projects
| Project | Year | Status |
|---|---|---|
| Mother Packs at Bondeni Maternity | 2026 | [V] |
| 405 Girls at Limuko Schools | 2026 | [V] — confirm year |
| Adopt-a-River Launch (River Njoro, Mwariki Bridge, Barut) | 2022 | [V] |
| River Ndarugu Cleanup | 2022 | [V] |
| Peace in Colour Fest | 2025 | [V] |
| Street Families Outreach | 2021 | [V] |

Per-project partner/result lists were only added where the repo’s own copy supports them;
all other projects keep a single verified narrative paragraph. "People reached" lines on
detail pages re-word the same verified copy (e.g. "residents of Barut and riverside
communities") — they introduce no new figures.

## Awards
| Award | Year | Status |
|---|---|---|
| Legacy Award 2026 — DEI Champion (District 9212 at the time) | 2026 | [C] — awarded before the district change; confirm whether it should read 9215 |
| Ten Years of Service | 2025 | [C] year |
| City Clean-up Campaign recognition (Nakuru County) | 2024 | [V] |
| DRR Meet & Greet, Hyrax Hill | 2023 | [V] |
| Adopt-a-River Launch | 2022 | [V] |

## Leadership
Closed by the club's own leadership cards (WhatsApp, 12 October 2026): twelve officers with
portfolios, biographies and portraits, published on `/leadership`.

| Person | Role as published | Status |
|---|---|---|
| Wanjiku Nguru | President 2026/27 | [V] club card — card is titled “Incoming President”; confirm the public title |
| Racheal Kyalo | President Elect | [V] club card |
| Janet Nkirote | Immediate Past President & Club Advisor | [V] club card (President 2025/26) |
| Sally Kimani | Secretary & Membership | [V] club card |
| Justin Mwaura | Finance | [V] club card |
| Felix Bett | Public Relations | [V] club card |
| Jacob Endurance | Sergeant-at-Arms | [V] club card |
| Allan Leyian | International Service & Professional Leadership Development | [V] club card |
| Issa Telot | Community Service | [V] club card |
| Sophia Muthoni | The Rotary Foundation, Fundraising & Grants | [V] club card |
| Jessica Njeri | New Generation | [V] club card |
| John Ngugi | Government & Ethics (past President, ADRR Nakuru Region) | [V] club card |
| John Brodrick | Charter President | [V] archive |
| Terry Muigai | President 2019 | [V] archive |
| Phylis Kanja | DEI Director 2025/26 · DEI Champion 2026 | [C] unconfirmed — kept in data, withheld from the page |

Notes: the card for Wanjiku Nguru supersedes the earlier public-source entry for “Joyce Wanjiku
Nguru” (treated as the same person); Janet Nkirote is published once, on the board, with her
presidency in her biography; John Ngugi's past presidency is described in his biography rather
than as a second immediate-past title. Portraits are cropped from the same cards.

## Partners
Rotary Club of Nakuru · Rotary District 9215 · Nakuru County Government · Kenya Wildlife Service ·
NEMA Kenya · Kenya Red Cross · Bondeni Maternity · Limuko Schools — [V] (partner list carries no logos → text chips/links where safe).

## Membership
| Item | Status |
|---|---|
| Steps: 3 fellowships → 1 project → **new member orientation** → induction | [V] |
| Fees: **KES 3,000 per year** + **KES 500 Rotaract pin** | [V] club-provided · [C] payment timing and whether the pin is one-off |
| Age 18–30 | [V] |

## New member orientation (course at `/membership/orientation`)
| Item | Status |
|---|---|
| Course is required before induction | [C] — a **club rule, not a Rotary mandate**; officers to confirm, and align with any district-run Rotaract orientation instead of duplicating it |
| 6 modules of copy | [V] built only from facts verified elsewhere in `src/data.ts` — officers to review tone and emphasis |
| 8 quiz questions and answers | [V] every answer traces to a verified club fact — membership team to approve wording |
| Pass mark (currently 7 of 8 via `ORIENTATION.passMark`) | [C] — confirm with the membership team |
| Who confirms completion at induction | [C] — name an officer/process; the site cannot verify completion without a backend |
| Fees paragraph in module 5 | [V] uses the club-provided figures (KES 3,000/year + KES 500 pin) |
| External sources (`learn.rotary.org`, Rotary Rotaract page) | [V] links resolve; rotary.org rate-limits automated checks but that URL is already used site-wide |
| Progress storage | [V] browser `localStorage` only — no personal data leaves the device |

## Rotary District 9215 (external facts — page `/about/district-9215`)
All paraphrased from the district's own site, which stays the authority. District-run
dates and figures must be re-checked each Rotary year.

| Item | Status |
|---|---|
| District established for 2026/27; described as built on the legacy of District 9212 | [V] district site |
| Coverage: West of Nairobi, Western Kenya and South Sudan | [V] district site |
| 100+ Rotary clubs and 3,000+ Rotarians | [V] district site |
| Pioneer District Governor Saad Rahman (2026/27) and his Rotary history | [V] district site |
| Rotary theme “Create Lasting Impact”; RI President Olayinka Hakeem Babalola | [V] district site, corroborated by press coverage |
| 1.2 million Rotary members in 200+ countries | [V] district site footer |
| Focus areas (WASH, basic education, peace, economic development, youth, DEI, engagement) | [V] district site |
| Foundation Dinner: Saturday 21 November 2026, Trademark Hotel, Nairobi | [V] district site — **time-sensitive, update after the event** |
| District Conference Assembly 2027 run with District 9216 | [V] district site links |
| Unicaf scholarship partnership (Districts 9215 & 9216) | [C] — corroborated only by the announcement headline; confirm scope before promoting |
| “100+ clubs and over 3,000 members across four countries” | [C] — the same district page names only Kenya and South Sudan, so the page here lists the named coverage instead of a country count |
| Nakuru sits inside District 9215 | [V] club-provided · [C] the district's ClubRunner directory could not be read programmatically to double-check |
| District photos and logo | **not used** — district property; ask the district before reusing |

## Rotary International (global facts — page `/rotary`)
Facts are paraphrased from Rotary's published material and its polio partners, with
sources linked on the page. **Rotary's copy, photography, illustrations and logo files are
not reproduced** — Rotary marks belong to Rotary International and official artwork must
come from Rotary's Brand Center under Rotary's brand guidelines.

| Item | Status |
|---|---|
| Rotary founded 1905 in Chicago by Paul Harris; grew into the world's first service club | [V] widely published Rotary history |
| 1.2 million members in more than 200 countries and geographical areas | [V] Rotary/district published |
| Seven areas of focus (peacebuilding; disease prevention; water & sanitation; maternal & child health; basic education; community economic development; environment) | [V] Rotary published; environment added 2021 |
| The Rotary Foundation founded 1917; District and Global Grants aligned to the areas of focus | [V] Rotary published |
| Four-Way Test written 1932 by Herbert J. Taylor; adopted by RI in 1943 | [V] Rotary published |
| Programmes: Rotaract (18–30), Interact (12–18), RYLA, Youth Exchange, Peace Fellowships, Community Corps | [V] Rotary published |
| Five Avenues of Service (club, vocational, community, international, youth) | [V] Rotary published |
| Polio: PolioPlus launched 1985; GPEI founded 1988 with WHO, UNICEF and CDC | [V] Rotary/GPEI published |
| Polio case counts (Afghanistan 35 WPV1 cases in 2026 vs 21 in 2025; cVDPV2 in DR Congo 58, Nigeria 36, Chad 8, Somalia 6, CAR 5) | [V] GPEI "Polio this week", **as of 30 September 2026 — time-sensitive, refresh periodically** |
| "More than 99% decline since 1988" | [V] GPEI published |

## Project → Rotary area of focus mapping (in the UI)
| Project | Mapped to | Status |
|---|---|---|
| Adopt-a-River | Water, sanitation & hygiene · Environment | [C] editorial mapping |
| River Ndarugu Cleanup | Environment · Water, sanitation & hygiene | [C] editorial mapping |
| Mother Packs (Bondeni) | Maternal & child health | [C] editorial mapping |
| 405 Girls at Limuko | Basic education & literacy | [C] editorial mapping |
| Peace in Colour Fest | Peacebuilding & conflict prevention | [C] editorial mapping |
| Street Families Outreach | *left unmapped* | [C] — no honest fit among the seven; the UI hides the block |

The mapping is **our editorial alignment** so visitors can navigate between local work and
Rotary's framework. Rotary does not certify club project alignment, and it implies no grant
has been awarded. Funding wording stays general (club fundraising + the Foundation's
published District/Global Grant model), with no amounts or award claims.

## Structured data (JSON-LD)
| Field | Status |
|---|---|
| Organization (name, areaServed, parentOrganization District 9215, sameAs socials) | [V] |
| Event/Schedule: weekly fellowship Thu 17:30–18:30 (byDay schedule) | [V] — meeting pattern; venue is a club rotating venue, so `location` kept generic |

## Open items (action needed by club officer)
1. Official email + phone (enables a real form endpoint + contact block).
2. Exact charter year (2015 or 2016).
3. Leadership: the 2026/27 board is now club-supplied and published. Still open — confirm the
   President's public title (card reads "Incoming President"), and Phylis Kanja's 2025/26 DEI
   title/term if she is to be listed. The past-president archive remains thin (Brodrick, Muigai,
   Nkirote).
4. Confirm 405-girl and 150+ pack figures and years for public stats.
5. Confirm the DEI Champion 2026 award card district (currently 9212, as awarded at the time).
6. Confirm fee payment timing and whether the KES 500 pin is a one-off.
6. Optional: partner logos for a more visual partner strip.
7. Optional: photography of current officers (supplied October 2026 — portraits are now on the
   board page, so this item is closed).
8. Medical Camp (18 November 2026): venue and times, so the page can carry a calendar export, plus
   any report or photographs afterwards.
9. The draft story "Joint medical camp at Kabati" may relate to the Medical Camp above — confirm
   whether it should be published, corrected or dropped.