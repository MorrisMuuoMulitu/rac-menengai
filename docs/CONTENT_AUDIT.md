# Content Audit — RAC Menengai Website

Every value below is either **Verified** (traced to club materials already in this repo:
club social pages, LinkedIn posts, Nakuru County coverage, or NOTES.md) or **CONFIRM**
(needs a club officer to confirm before public use). Nothing was invented.

Legend — `[V]` verified · `[C]` confirm · `[MISSING]` no source available.

## Identity
| Field | Value | Status |
|---|---|---|
| Club name | Rotaract Club of Menengai (RAC Menengai) | [V] |
| City / region | Nakuru, Kenya · Rotary District 9212 | [V] |
| Sponsor mother club | Rotary Club of Nakuru | [V] |
| Charter / founding | ~2015/16; 10th anniversary celebrated 2025 | [C] — exact charter year (2015 vs 2016) for “Est.” and JSON-LD |
| Meeting | Every Thursday, 5:30–6:30 PM, Nakuru | [V] |
| Members | Young professionals + students, ~18–30 | [V] |
| Motto | Service Above Self | [V] |

## Contact
| Field | Value | Status |
|---|---|---|
| Email | — | [MISSING] — no official email supplied; form cannot send without one |
| Phone | — | [MISSING] — no official phone supplied |
| Socials | Facebook @RCmenengai · Instagram @racmenengai · X @RcMenengai · LinkedIn RAC Menengai · Threads @racmenengai | [V] |
| Contact form | Client-side validation + success fallback → socials | [MISSING] — wire a real endpoint (Formspree/Web3Forms/club email) when available |

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
all other projects keep a single verified narrative paragraph.

## Awards
| Award | Year | Status |
|---|---|---|
| Legacy Award 2026 — DEI Champion (District 9212) | 2026 | [V] |
| Ten Years of Service | 2025 | [C] year |
| City Clean-up Campaign recognition (Nakuru County) | 2024 | [V] |
| DRR Meet & Greet, Hyrax Hill | 2023 | [V] |
| Adopt-a-River Launch | 2022 | [V] |

## Leadership
| Person | Role | Status |
|---|---|---|
| Joyce Wanjiku Nguru | President 2026/27 | [V] |
| John Brodrick | Charter President | [V] |
| Janet Nkirote | President 2025/26 (moderated Peace in Colour Fest) | [V] |
| Terry Muigai | President 2019 | [V] |
| Phylis Kanja | DEI Director 2025/26 · DEI Champion 2026 | [C] — role & term + whether title “DEI Champion 2026” is hers |

## Partners
Rotary Club of Nakuru · Rotary District 9212 · Nakuru County Government · Kenya Wildlife Service ·
NEMA Kenya · Kenya Red Cross · Bondeni Maternity · Limuko Schools — [V] (partner list carries no logos → text chips/links where safe).

## Membership
| Item | Status |
|---|---|
| Steps: 3 fellowships → 1 project → induction | [V] |
| Fees: “modest annual subscription … set by the club” | [C] — exact current figure |
| Age 18–30 | [V] |

## Structured data (JSON-LD)
| Field | Status |
|---|---|
| Organization (name, areaServed, parentOrganization District 9212, sameAs socials) | [V] |
| Event/Schedule: weekly fellowship Thu 17:30–18:30 (byDay schedule) | [V] — meeting pattern; venue is a club rotating venue, so `location` kept generic |

## Open items (action needed by club officer)
1. Official email + phone (enables a real form endpoint + contact block).
2. Exact charter year (2015 or 2016).
3. Leadership roster confirmation (Phylis Kanja title/term; fill out past-president list).
4. Confirm 405-girl and 150+ pack figures and years for public stats.
5. Current membership fee figure.
6. Optional: partner logos for a more visual partner strip.
7. Optional: photography of current officers (initials avatars used until then).