# Content sources and publication decisions

`content/social/sources.json` records exact source URLs, publication/event dates, confidence and caveats. `content/projects.json` records provenance for the six preserved project routes. `src/data.ts` retains club identity, local membership fees and orientation content. The old CONTENT_AUDIT.md is a historical snapshot whose “verified” labels are not sufficient evidence for new publication.

## Research leads

| Lead | Evidence | Decision |
|---|---|---|
| Presidential installation, 6–7 June 2026 | Joyce Wanjiku Nguru’s public LinkedIn profile reports 2026–2027 presidency. | Presidency page says publicly reported; authoritative board roster still pending. New installation story remains draft. |
| Nexora BloomX, 2 July 2026 | ZeroPlastic organiser report published 7 August 2026 names Menengai’s Development Director, without individual name. | Curated story/event drafts. Representative and exact role need club confirmation. |
| Peace in Colour, 27 September 2025 | A4C report published 30 September names Menengai as contributor and Janet Nkirote as panel moderator. | Existing public activity corrected, sourced and given a story/event detail page. Joint contribution is explicit. |
| Kabati medical camp, 8 March 2025 | Rotaract Kenya post names Naivasha as organiser and Menengai among partners. | Draft. Reported 541 residents belongs to the partnership; publication timestamp unavailable. |
| Nakuru city clean-up | County report published 9 February 2024 names Menengai among participants. | Existing story corrected and sourced. Brief’s proposed 10 February event date is not used; source does not independently establish it. |

No latest-five-posts claim is made. The 11 discovered social records are drafts because their captions/timestamps are incomplete. No third-party article or photo was copied wholesale. New externally researched stories are not visible or bundled into the public client until approved. `scripts/prepare-content.mjs` generates a public-only input; build verification excludes drafts from routes and output.

## Club-supplied content (October 2026)

| Supplied | Content | Status |
|---|---|---|
| 12 October 2026, WhatsApp | Twelve 2026/27 leadership cards — names, portfolios, biographies, portraits | Published on `/leadership`; portraits cropped to `public/images/leadership/` |
| 12 October 2026, club bulletin | Q1 2026–2027 activities: installation, two mother pack projects, art day, induction, Mazingira Day, Book Club anniversary, weekly venue, Book Club Review rhythm, upcoming Medical Camp | Published as event records; each detail page cites the bulletin as its approval source |
| 14 November 2026, WhatsApp (`Medical-Camp.jpeg`) | Medical Camp poster: Nakuru Free Medical Outreach, Wednesday 18 November 2026, 8:00 AM–5:00 PM, Railways (Patel Brotherhood Grounds); services, partners and contact numbers | Published on `/events/medical-camp-2026`; poster stored as the event image. Date, venue, times, services, partners and phone numbers are transcribed from the artwork |
| 14 November 2026, WhatsApp/PDF | Twelve partner logos (eight images, four PDFs: AITS, Lions SightFirst, The Nakuru Specialist Hospital, Madini) | Published on `/partnerships#partners`; PDFs rasterised at 300 dpi, white margins trimmed, normalised to WebP in `public/images/partners/` |
| Earlier | Club logo lockup, "Thee Magicals" mantra artwork, membership fees (KES 3,000 + 500 pin), District 9215 | Published; see BRANDING_VERIFICATION.md |

Nothing supplied so far has been altered beyond cropping, resizing and light copy-trimming. The
Medical Camp venue is now supplied; attendance figures, photographer credit and partner-specific
service credits remain unstated.

The partner folder in Downloads also contained a ZIP with low-resolution Ministry of Health,
Nakuru County, Kenya Red Cross, Kenya Blood Transfusion and Transplant Service and DamuKE marks.
It was excluded on instruction. Those organisations are still named in the Medical Outreach
partner list where the poster names them; no logo file was published for them.

## Outstanding club confirmations

- Full 2026–2027 board, approved officer biographies and portraits.
- Official club logo and photo permissions/credits.
- Charter date: old records conflict between 2015 and 2016; foundingDate and homepage decade counter removed.
- Project dates/counts, especially Limuko and Bondeni; adoption poster appears to show 2023 while archive year is 2022.
- Existing award certificates and exact labels/years. Award archive remains labelled as an archive requiring confirmation.
- Confirm local membership process and whether orientation is required. The existing course is preserved as learning material; it is not presented as a Rotary-wide requirement.
- Meeting venue, cancellations and phone/WhatsApp number. No location pin or invented contact number is displayed.
- Email-delivery service, sender-domain approval and inbox-retention policy. Email address is from the public Facebook intro; deliverability has not been tested by sending a message.

The membership amounts (KES 3,000 yearly and KES 500 pin) were explicitly club-provided in the pre-existing audit and remain informational. No payment destination or donation channel is introduced.
