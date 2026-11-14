/**
 * RAC Menengai — single source of truth for ALL site content.
 *
 * Every value here was carried over from the previously verified build (club
 * social pages, LinkedIn posts, Nakuru County coverage). Items still needing a
 * club officer's confirmation are listed in `docs/CONTENT_AUDIT.md` — no
 * phone, email, address, figure, partner or award was invented.
 *
 * Image paths resolve through Vite (`new URL(..., import.meta.url)`) so builds
 * are hashed and cache-busted.
 */

/* ============================= Types ============================= */

export interface ClubMeta {
  name: string;
  shortName: string;
  city: string;
  country: string;
  district: string;
  sponsor: string;
  establishedLabel: string; // year-safe label pending exact charter year
  motto: string;
  audience: string;
  meeting: {
    dayLabel: "Thursday";
    timeLabel: "5:00–7:00 PM";
    timeZoneNote: string;
    /** Set false when the club pauses its weekly schedule (graceful countdown fallback). */
    active: boolean;
  };
}

export interface Socials {
  facebook: string;
  instagram: string;
  x: string;
  linkedin: string;
  threads: string;
}

export interface Stat {
  value: number;
  suffix: string;
  label: string;
  context: string; // what the number measures
  year?: string;
}

export interface ServiceArea {
  id: string;
  icon: IconKey;
  title: string;
  oneLiner: string;
}

export interface Project {
  slug: string;
  title: string;
  tag: "Health" | "Education" | "Environment" | "Community" | "Service";
  year: string;
  image: string;
  summary: string;
  /** Verified narrative paragraph(s). */
  detail: string;
  location: string;
  /** Only where the repo's own copy supports them. */
  challenge?: string;
  /** People / communities reached — only where the copy supports it. */
  reached?: string[];
  /** Outputs delivered and measured outcomes — never implies unmeasured outcomes. */
  results?: string[];
  partners?: string[];
  /** Meaningful caption under the project photo. */
  caption?: string;
  /**
   * Rotary areas of focus this project sits in (ids from ROTARY.focuses).
   * Editorial alignment made by the club — Rotary does not certify it. See
   * docs/CONTENT_AUDIT.md.
   */
  areasOfFocus?: string[];
  featured?: boolean;
}

export interface Award {
  title: string;
  tag: string;
  year: string;
  image: string;
  gold?: boolean;
}

export interface Leader {
  name: string;
  /** Board portfolio, e.g. "Community Service". */
  portfolio: string;
  /** Leadership standing when it is a role rather than a portfolio. */
  standing?: string;
  term?: string;
  bio: string;
  /** Anchor id and photo stem, e.g. "issa-telot". */
  slug: string;
  initials: string;
  /**
   * Officer portrait stem. Images live at `/images/leadership/<stem>-320.webp`
   * and `-640.webp`, cropped from the leadership cards the club supplied on
   * 12 October 2026 (see docs/BRANDING_VERIFICATION.md).
   */
  photo?: string;
  group?: "executive" | "officers" | "service";
  kind: "board" | "past";
  confirm?: boolean; // awaiting officer confirmation (see CONTENT_AUDIT.md)
}

export interface NewsItem {
  title: string;
  category: string;
  date: string;
  image: string;
  excerpt: string;
}

export interface Partner {
  name: string;
  /**
   * Partner-supplied logo, white margins trimmed and normalised to WebP under
   * `/images/partners/`. Logos without a supplied file remain text-only.
   */
  logo?: string;
}

export interface Faq {
  q: string;
  a: string;
}

export interface JoinStep {
  title: string;
  text: string;
}

export interface AudiencePath {
  id: string;
  title: string;
  text: string;
  cta: string;
  href: string;
}

export interface PageIntro {
  eyebrow: string;
  title: string;
  lead?: string;
  /** Unique meta description for the route (SEO). */
  description: string;
}

/* ============================= Icons ============================= */
export type IconKey =
  | "leaf"
  | "heart"
  | "book"
  | "users"
  | "star"
  | "droplets"
  | "heartPulse"
  | "graduation"
  | "sparkles"
  | "trending"
  | "shield"
  | "handshake"
  | "calendar"
  | "mapPin"
  | "award"
  | "flag"
  | "building"
  | "wallet"
  | "messageCircle";

/* ============================= Assets ============================= */
const img = (file: string) => {
  const name = file.replace(/\.(jpg|png)$/, "");
  if (name === "logo-transparent") return "";
  return `/images/${["banner", "welcome"].includes(name) ? "gallery" : "projects"}/${name}.webp`;
};

export const HERO_IMAGES = {
  background: "", // old archive frame removed — recent photographs live under /images/events
  logo: img("logo-transparent.png"),
};

export const ABOUT_IMAGES = {
  // recent club photographs only; the older derivatives were posters or archive
  // frames that could not be captioned honestly (see docs/CONTENT_AUDIT.md)
  tall: "/images/events/mother-pack-bondeni-2026/bondeni-2026-group-outside.webp",
  wide: "/images/events/mazingira-day-pangani-2026/mazingira-2026-group-photo.webp",
};

export const SIGNATURE_IMAGE = ""; // old archive frame removed

/* ============================= Identity ============================= */
export const CLUB: ClubMeta = {
  name: "Rotaract Club of Menengai",
  shortName: "RAC Menengai",
  city: "Nakuru, Kenya",
  country: "Kenya",
  district: "Rotary District 9215",
  sponsor: "Rotary Club of Nakuru",
  establishedLabel: "Nakuru, Kenya", // CONFIRM exact charter year (2015 vs 2016)
  motto: "Service Above Self",
  audience: "Young professionals and students, aged 18 and over",
  meeting: {
    dayLabel: "Thursday",
    timeLabel: "5:00–7:00 PM",
    timeZoneNote: "East Africa Time",
    active: true, // CONFIRM if the club ever pauses its weekly schedule
  },
};

export const SOCIALS: Socials = {
  facebook: "https://www.facebook.com/RCmenengai/",
  instagram: "https://www.instagram.com/racmenengai/",
  x: "https://x.com/RcMenengai",
  linkedin: "https://www.linkedin.com/in/rac-menengai-91b5591b3",
  threads: "https://www.threads.com/@racmenengai",
};

export const NAV_LINKS = [
  { href: "/about", label: "About" },
  { href: "/projects", label: "Projects" },
  { href: "/events", label: "Events" },
  { href: "/leadership", label: "Leadership" },
  { href: "/membership", label: "Membership" },
  { href: "/contact", label: "Contact" },
] as const;

/* The club's sponsor, supplied by the club on 12 October 2026. */
export const MOTHER_CLUB = {
  name: "The Rotary Club of Nakuru",
  chartered: "1952",
  meetingDay: "Every Tuesday",
  meetingTime: "12:45–2:00 PM",
  venue: "Rift Valley Sports Club, Nakuru",
  president: "Col. (Rtd.) Raymond Cheruiyot",
  presidentNote: "installed July 2026",
  summary:
    "The Rotary Club of Nakuru is a community service organisation chartered in 1952 and part of Rotary International. It is our mother club.",
} as const;

/* ============================= Home copy ============================= */
export const HERO = {
  eyebrow: `${CLUB.district} · ${CLUB.city}`,
  title: "A Decade of Service Above Self",
  titleAccent: "Service Above Self",
  lead: "Rotaract Club of Menengai — young professionals and students in Nakuru, Kenya, turning service into community impact. We meet every Thursday from 5:00–7:00 PM at Nakuru Athletic Club for fellowship.",
  primaryCta: "Attend a fellowship",
  secondaryCta: "Explore our projects",
};

export const ANNOUNCEMENT = {
  text: "Next fellowship: Thursday, 5:00–7:00 PM · Nakuru Athletic Club",
  action: "Plan your visit",
};

/* ============================= Rotary District 9215 =============================
 * Paraphrased from the district’s own website (rotary9215.org) — district-run
 * pages and dates change, so the district site remains the authority. Items
 * still to confirm are listed in docs/CONTENT_AUDIT.md. No district photos or
 * logos are bundled here: those belong to the district.
 * ============================================================================ */
export interface DistrictFocusArea {
  id: string;
  icon: IconKey;
  title: string;
  text: string;
}

export interface DistrictEvent {
  id: string;
  title: string;
  when: string;
  where?: string;
  text: string;
  href?: string;
}

export interface DistrictLink {
  label: string;
  href: string;
}

export const DISTRICT = {
  name: CLUB.district,
  number: "9215",
  inauguralYear: "2026/27",
  predecessor: "Rotary District 9212",
  /** Shown to visitors so the page never pretends to be live district data. */
  asOf: "Paraphrased from rotary9215.org, the district’s own site — check there for the latest details.",
  intro:
    "Rotary District 9215 is one of East Africa’s newest and most active service networks: clubs, members and changemakers across West of Nairobi, Western Kenya and South Sudan, turning ideas into action.",
  coverage: ["West of Nairobi", "Western Kenya", "South Sudan"],
  stats: [
    { value: "100+", label: "Rotary clubs", note: "across the district" },
    {
      value: "3,000+",
      label: "Rotarians",
      note: "leaders, professionals and volunteers",
    },
    {
      value: "2026/27",
      label: "Inaugural year",
      note: "a newly established district",
    },
    {
      value: "1.2M",
      label: "Rotary members",
      note: "worldwide, in 200+ countries",
    },
  ],
  story: [
    "District 9215 was established for the 2026/27 Rotary year. The district describes itself as a fresh chapter built on the legacy of District 9212 — new boundaries, new leadership, and the same commitment to service.",
    "Our club, the Rotaract Club of Menengai, sits inside that district: a Rotaract club in Nakuru serving alongside Rotarians from western Nairobi, Western Kenya and South Sudan.",
  ],
  dg: {
    name: "Saad Rahman",
    role: "Pioneer District Governor · 2026/27",
    initials: "SR",
    bio: [
      "Inducted into Rotary in November 2015 with the Rotary Club of Bahari in Dar es Salaam, Tanzania — then part of District 9211.",
      "Moved to Kenya in 2019 and continued serving with the Rotary Club of Lang’ata.",
      "Charter President of the Rotary Club of Nairobi Upper Hill, leading the club until it was chartered in May 2021.",
      "A member of The Rotary Foundation’s Cadre of Technical Advisors, supporting the sustainability of major Rotary grants.",
    ],
  },
  ri: {
    president: "Olayinka Hakeem Babalola",
    theme: "Create Lasting Impact",
    text: "Rotary’s theme for the year, Create Lasting Impact, is the district’s operating brief: community ownership, sustainability beyond the grant, and measurable change — not quick fixes.",
  },
  focuses: [
    {
      id: "wash",
      icon: "droplets",
      title: "Water, sanitation & hygiene",
      text: "Moving beyond boreholes to community water committees and hygiene education in South Sudan and Western Kenya, so clean water lasts and children stay in school.",
    },
    {
      id: "education",
      icon: "graduation",
      title: "Basic education & literacy",
      text: "Digital-literacy labs, solar power and teacher training that keep schools thriving long after the project ends.",
    },
    {
      id: "peace",
      icon: "handshake",
      title: "Peace & conflict prevention",
      text: "Training young leaders in conflict management in regions navigating transition or post-conflict recovery.",
    },
    {
      id: "economy",
      icon: "trending",
      title: "Economic & community development",
      text: "Micro-financing and vocational skills for women’s cooperatives and young entrepreneurs.",
    },
    {
      id: "youth",
      icon: "users",
      title: "Youth leadership: Rotaract & Interact",
      text: "Rotaractors are brought into joint project leadership and district roles, keeping the leadership pipeline dynamic.",
    },
    {
      id: "inclusion",
      icon: "sparkles",
      title: "Diversity, equity & inclusion",
      text: "Welcoming diverse professions, perspectives and backgrounds — which is how complex community problems get solved.",
    },
    {
      id: "engagement",
      icon: "star",
      title: "Member engagement & learning",
      text: "Vibrant club cultures plus leadership seminars, PELS and District Learning events that keep members informed and involved.",
    },
  ] as DistrictFocusArea[],
  events: [
    {
      id: "trf-dinner-2026",
      title: "District 9215 Annual Foundation Dinner 2026",
      when: "Saturday 21 November 2026",
      where: "Trademark Hotel, Nairobi",
      text: "Themed “The Heart of Rotary”, the district’s foundation dinner raises funds for The Rotary Foundation — water, maternal health, education and economic empowerment across Kenya and South Sudan.",
      href: "https://rotary9215.org/page/trf-dinner-2026",
    },
    {
      id: "dca-2027",
      title: "District Conference Assembly 2027",
      when: "2027",
      text: "The district’s next conference is being organised together with District 9216; the DCA site carries the programme and registration.",
      href: "https://rotary9216.org/page/dca-2027-welcome/",
    },
  ] as DistrictEvent[],
  engagement: [
    "Rotaractors can take project leadership and district roles, not just club ones.",
    "The Four-Way Test still guides partnerships: is it the truth, is it fair to all concerned, will it build goodwill and better friendships, will it be beneficial to all concerned?",
    "District learning: PELS, District Learning events and Membership Month keep members sharp and connected.",
    "The Rotary Foundation: the district runs a pledge portal and an annual dinner to fund grants.",
  ],
  links: [
    { label: "District 9215 website", href: "https://rotary9215.org/" },
    {
      label: "Club directory — find a Rotary club",
      href: "https://portal.clubrunner.ca/50421/clubdirectory",
    },
    { label: "Clubs map", href: "https://portal.clubrunner.ca/50421/clubsmap" },
    {
      label: "District events calendar",
      href: "https://rotary9215.org/events/calendar",
    },
    { label: "TRF pledge portal", href: "https://trfpledge.rotary9215.org/" },
    {
      label:
        "Unicaf scholarship partnership announcement (Districts 9215 & 9216)",
      href: "https://www.unicaf.org/news-and-events/press-release/unicaf-and-rotary-districts-9215-9216-sign-landmark-partnership/",
    },
  ] as DistrictLink[],
  ourPlace: {
    text: "District priorities are not abstract for us — our four service areas map onto them, and our members can take club projects to district level.",
    mapping: [
      {
        club: "Environment & water",
        district: "WASH: clean water, clean rivers, hygiene education",
      },
      {
        club: "Maternal & child health",
        district: "Maternal health programmes",
      },
      {
        club: "Education & girls’ empowerment",
        district: "Basic education & literacy",
      },
      {
        club: "Community & peacebuilding",
        district: "Peacebuilding and economic empowerment",
      },
    ],
  },
  disclaimer:
    "District pages, dates and figures change — rotary9215.org is the authority. The district’s photos and logo belong to the district; ask before reusing them.",
};

/* ============================= Rotary International =============================
 * Global facts about Rotary, paraphrased from Rotary’s own published material and
 * its polio partners (rotary.org, polioeradication.org). Rotary’s copy, images and
 * logo files are NOT reproduced here — see ROTARY.brandNote. Figures that move
 * (polio case counts) carry their as-of date.
 * ============================================================================ */
export interface RotaryFocus {
  id: string;
  icon: IconKey;
  title: string;
  global: string;
  local?: string;
  projectSlug?: string;
}

export interface RotaryProgram {
  id: string;
  name: string;
  ages?: string;
  text: string;
  ours?: boolean;
}

export const ROTARY = {
  asOf: "Facts paraphrased from Rotary International and Global Polio Eradication Initiative material; polio figures are as of 30 September 2026.",
  intro:
    "We are a Rotaract club inside Rotary — a network of 1.2 million members in more than 200 countries and geographical areas, working across seven areas of focus. This page is the wider picture our projects sit inside.",
  stats: [
    { value: "1905", label: "Founded", note: "Chicago, United States" },
    { value: "1.2M", label: "Members", note: "Rotarians and Rotaractors" },
    {
      value: "200+",
      label: "Countries & areas",
      note: "a genuinely global network",
    },
    {
      value: "7",
      label: "Areas of focus",
      note: "where Rotary concentrates its work",
    },
  ],
  what: [
    "Rotary began in Chicago in 1905 with Paul Harris and three friends, and grew into the world’s first service club. Today it is a global network of 1.2 million members in more than 200 countries and geographical areas.",
    "Every Rotary and Rotaract club is rooted locally — ours in Nakuru — and connected globally through districts, The Rotary Foundation, and a shared set of causes. That combination is the point: local knowledge, global backing.",
  ],
  values: [
    {
      title: "Service",
      text: "Service Above Self — the motto, and the test of everything we do.",
    },
    {
      title: "Fellowship",
      text: "The reason we meet every Thursday, and the reason members stay for decades.",
    },
    {
      title: "Integrity",
      text: "The Four-Way Test: truth, fairness, goodwill and benefit to all concerned.",
    },
    {
      title: "Diversity",
      text: "Every profession, campus and background — that is how complex problems get solved.",
    },
    {
      title: "Leadership",
      text: "Members lead. Clubs are run by their members, not by staff.",
    },
  ],
  focuses: [
    {
      id: "peace",
      icon: "handshake",
      title: "Peacebuilding and conflict prevention",
      global:
        "Rotary works for peace at every level — peace fellowships, community-led reconciliation, and the Positive Peace framework with the Institute for Economics and Peace.",
      local:
        "Our programmes connect local service with Rotary's worldwide work for peace.",
    },
    {
      id: "disease",
      icon: "shield",
      title: "Disease prevention and treatment",
      global:
        "Vaccination campaigns, training health workers and building clinics — most visibly through the polio eradication effort.",
      local:
        "Our health outreach starts closest to home: mothers and newborns at Bondeni Maternity.",
    },
    {
      id: "wash",
      icon: "droplets",
      title: "Water, sanitation and hygiene",
      global:
        "Wells, water purification, sanitation infrastructure and hygiene education in the places where access is most limited.",
      local:
        "Water and hygiene needs run through our service: supplies for schools, mother packs for new mothers, and conservation work with learners at Pangani Special School.",
    },
    {
      id: "maternal",
      icon: "heartPulse",
      title: "Maternal and child health",
      global:
        "Prenatal care, midwife training, immunisation and nutrition programmes that reduce under-five mortality.",
      local:
        "Mother packs reach new mothers at Bondeni Maternity — practical support for a new family.",
      projectSlug: "mother-packs",
    },
    {
      id: "education",
      icon: "graduation",
      title: "Basic education and literacy",
      global:
        "Schools, teacher training, adult literacy and scholarships — including for women and girls denied access elsewhere.",
      local:
        "Students at Limuko High & Primary School received sanitary towels and mentorship so no girl misses class.",
      projectSlug: "limuko-girls",
    },
    {
      id: "economy",
      icon: "trending",
      title: "Community economic development",
      global:
        "Vocational training, microfinance, women-led enterprise and partnerships with social entrepreneurs.",
      local:
        "Our financial-literacy drives and book club build professional skills among members and the people we serve.",
    },
    {
      id: "environment",
      icon: "leaf",
      title: "Environment",
      global:
        "The newest area of focus, added in 2021: reforestation, freshwater and ocean protection, sustainable agriculture and climate resilience.",
      local:
        "Planting and conservation with learners at Pangani Special School on Mazingira Day.",
      projectSlug: "pangani-special-school",
    },
  ] as RotaryFocus[],
  polio: {
    title: "Polio eradication: the biggest thing Rotary does",
    launch:
      "Rotary launched PolioPlus in 1985 and helped found the Global Polio Eradication Initiative in 1988, alongside the World Health Organization, UNICEF and the US CDC.",
    partners: [
      "World Health Organization",
      "UNICEF",
      "US CDC",
      "Gates Foundation",
      "Gavi",
      "Rotary",
    ],
    progress:
      "Wild poliovirus cases have fallen by more than 99% since 1988 — closer to eradication than any disease in history.",
    status:
      "Polio eradication is ongoing. For current case counts and outbreak information, consult the Global Polio Eradication Initiative’s dated reports.",
    why: "That is why Rotary clubs — including ours — keep fundraising, keep raising awareness, and keep the promise to finish the job.",
    href: "https://polioeradication.org/about-polio/polio-this-week/",
  },
  foundation: {
    title: "The Rotary Foundation",
    text: "Founded in 1917, The Rotary Foundation is Rotary’s own charity. It turns donations into District Grants for local work and Global Grants for larger projects — always aligned to one of the seven areas of focus.",
    local:
      "Our district runs a pledge portal and an annual Foundation Dinner, and our club can apply for Foundation funding for its projects.",
    href: "https://trfpledge.rotary9215.org/",
    hrefLabel: "District 9215 TRF pledge portal",
  },
  fourWayTest: {
    title: "The Four-Way Test",
    intro:
      "Written in 1932 by Chicago Rotarian Herbert J. Taylor and adopted by Rotary International in 1943, the Four-Way Test is Rotary’s ethical guide for business and life. Of the things we think, say or do:",
    questions: [
      "Is it the TRUTH?",
      "Is it FAIR to all concerned?",
      "Will it build GOODWILL and BETTER FRIENDSHIPS?",
      "Will it be BENEFICIAL to all concerned?",
    ],
  },
  programs: [
    {
      id: "rotaract",
      name: "Rotaract",
      ages: "18 and over",
      text: "Service clubs for young leaders — this is where our club sits, and how most members meet Rotary.",
      ours: true,
    },
    {
      id: "interact",
      name: "Interact",
      ages: "12–18",
      text: "School-based service clubs that get young people serving early, often mentored by a local Rotary club.",
    },
    {
      id: "ryla",
      name: "RYLA",
      text: "Rotary Youth Leadership Awards — intensive leadership training for young people.",
    },
    {
      id: "youth-exchange",
      name: "Rotary Youth Exchange",
      text: "Long and short exchanges that build international understanding between families and countries.",
    },
    {
      id: "peace-fellowships",
      name: "Rotary Peace Fellowships",
      text: "Master’s degrees and professional certificates in peace and conflict resolution at Rotary Peace Centers.",
    },
    {
      id: "rcc",
      name: "Rotary Community Corps",
      text: "Community-led groups that partner with a club to serve where they live.",
    },
  ] as RotaryProgram[],
  avenues: [
    {
      title: "Club service",
      text: "Running a healthy, welcoming club — the weekly work of fellowship and organisation.",
    },
    {
      title: "Vocational service",
      text: "Using your profession to serve: skills, mentoring and ethics in the workplace.",
    },
    {
      title: "Community service",
      text: "Projects where we live — mother packs, tree planting and school visits.",
    },
    {
      title: "International service",
      text: "Work that crosses borders, from district partnerships to global grants.",
    },
    {
      title: "Youth service",
      text: "Backing Rotaract, Interact and youth programmes so leadership keeps renewing.",
    },
  ],
  sources: [
    {
      label: "Rotary International — official site",
      href: "https://www.rotary.org/en",
    },
    {
      label: "Rotary International — our causes",
      href: "https://www.rotary.org/en/our-causes",
    },
    {
      label: "Global Polio Eradication Initiative",
      href: "https://polioeradication.org/",
    },
    {
      label: "Polio this week (GPEI figures)",
      href: "https://polioeradication.org/about-polio/polio-this-week/",
    },
    {
      label: "Rotary District 9215 — our district",
      href: "https://rotary9215.org/",
    },
  ] as DistrictLink[],
  brandNote:
    "The Rotary and Rotaract names and marks belong to Rotary International. Our club uses them as a chartered club under Rotary’s brand guidelines, and official artwork comes from Rotary’s Brand Center — this page paraphrases published facts and links to the sources rather than reproducing Rotary’s copy or images.",
};

export const STATS: Stat[] = [
  {
    value: 10,
    suffix: "+",
    label: "Years of service",
    context: "chartered with the Rotary Club of Nakuru",
    year: "2016",
  },
  {
    value: 405,
    suffix: "+",
    label: "Girls empowered",
    context: "sanitary-towel donations across Limuko schools",
    year: "2026",
  },
  {
    value: 150,
    suffix: "+",
    label: "Mother packs",
    context: "delivered at Bondeni Maternity",
    year: "2026",
  },
];

export const SERVICES: ServiceArea[] = [
  {
    id: "environment",
    icon: "leaf",
    title: "Environment & water",
    oneLiner:
      "Planting, conservation and environmental awareness with learners at Pangani Special School.",
  },
  {
    id: "health",
    icon: "heartPulse",
    title: "Maternal & child health",
    oneLiner:
      "Mother packs and essentials for new families at Bondeni Maternity and beyond.",
  },
  {
    id: "education",
    icon: "graduation",
    title: "Education & girls’ empowerment",
    oneLiner:
      "Sanitary-towel donations and mentorship so no girl misses class for lack of supplies.",
  },
  {
    id: "community",
    icon: "handshake",
    title: "Community & peacebuilding",
    oneLiner:
      "Environmental and community work that builds common ground in Nakuru.",
  },
];

export const FINAL_CTA = {
  headline: "Come as you are. Leave as a leader.",
  lead: "Three fellowships, one project, and you’ve found your people. Guests are always welcome.",
};

/* ============================= Projects ============================= */
export const PROJECTS: Project[] = [
  {
    slug: "sports-legacy", title: "Sports Legacy", tag: "Community", year: "2025",
    image: "/images/events/sports-legacy-district-grant-2025/sports-legacy-27.webp",
    summary: "Youth engagement, teamwork and talent development through sport.",
    detail: "On 31 May 2025, the Sports Legacy Project brought young people together through sports, promoting teamwork, discipline, leadership and healthy living. District Grant DG2677765 supported opportunities for youth engagement, talent development and positive community interaction. The initiative strengthened relationships through shared sporting activities.",
    location: "Venue not supplied", areasOfFocus: ["community"], reached: ["Young participants"],
    results: ["District Grant Project DG2677765", "Youth sports activities held on 31 May 2025"],
  },
  {
    slug: "pangani-special-school",
    title: "Pangani Special School",
    tag: "Education",
    year: "2026",
    image:
      "/images/events/pangani-art-day-2026/pangani-art-day-2026-drawings-held-up.webp",
    summary:
      "Art days and environmental work with learners at Pangani Special School in Nakuru.",
    detail:
      "The club's ongoing relationship with Pangani Special School: the Empowering Minds art day in September 2026, with creativity sessions, writing clinics, reading and storytelling, essential supplies and sanitary-product donations through the Girls’ Support Drive, joined by DRR Brian Magana, and Mazingira Day in October 2026 when members and learners planted seedlings and talked about conservation. Both visits put the learners at the centre — making, planting and presenting their own work.",
    location: "Pangani Special School, Nakuru",
    areasOfFocus: ["education", "environment"],
    reached: ["Learners at Pangani Special School"],
    caption: undefined,
  },
  {
    slug: "book-club",
    title: "Book Club Review",
    tag: "Community",
    year: "2026",
    image: "",
    summary:
      "Reading, learning and fellowship — every second Sunday of the month.",
    detail:
      "The club's Book Club meets for a review every second Sunday of the month, and marked its anniversary in October 2026 with a camping affair for members.",
    location: "Nakuru",
    areasOfFocus: ["education"],
    reached: ["Members and guests"],
    caption: undefined,
  },
  {
    slug: "mother-packs",
    title: "Mother Packs",
    tag: "Health",
    year: "2026",
    image:
      "/images/events/mother-pack-kabatini-2026/kabatini-2026-group-with-packs.webp",
    summary:
      "Mother packs of essentials for new mothers and their babies, delivered at Bondeni and Kabatini Maternity.",
    detail:
      "To open the Rotary year, Menengai donated 48 Mother Packs at Bondeni Maternity, with 22 new mothers receiving packs during the visit. Rotary Club of Davis supported the initiative with Rotary Club of Nakuru. At Kabatini Health Center, Menengai and Rotaract Club of Bahati served alongside partner clubs. Packs included basins, uji flour, soap, tissue, face towels, heavy-flow pads, diapers, cooking oil and other essentials.",
    location: "Bondeni and Kabatini Maternity, Nakuru",
    areasOfFocus: ["maternal"],
    reached: ["New mothers and their babies at Bondeni Maternity"],
    caption: undefined,
    results: [
      "48 Mother Packs donated at Bondeni; 22 new mothers received packs on the day",
      "New-year service launch at Bondeni Maternity",
    ],
    partners: ["Bondeni Maternity", "Rotary Club of Davis", "Rotary Club of Nakuru", "Rotaract Club of Bahati", "Rotaract Club of Naivasha", "Rotaract Club of Thika TTI", "Rotaract Club of University of Embu", "Rotary Club of Kisumu Winam"],
  },
  {
    slug: "limuko-girls",
    title: "Menstrual health at Limuko Schools",
    tag: "Education",
    year: "2026",
    image: "",
    summary:
      "Sanitary supplies and mentorship for students at Limuko High & Primary School.",
    detail:
      "Working with school leadership, the club delivered sanitary-towel donations worth roughly three months per girl to students — paired with mentorship conversations so no girl misses class for lack of supplies.",
    location: "Limuko High & Primary School",
    areasOfFocus: ["education"],
    reached: ["Students at Limuko High & Primary School"],
    caption: undefined,
    results: [
      "Sanitary supplies distributed to students; count awaiting confirmation",
      "Mentorship conversations with students",
    ],
    partners: ["Limuko Schools"],
  },
];

export const PROJECT_TAGS = [
  "All",
  ...Array.from(new Set(PROJECTS.map((p) => p.tag))),
] as string[];

/**
 * How club projects are paid for. The fundraising line is already published on
 * the membership page; the grant sentence reflects Rotary's published funding
 * model (District Grants for local work, Global Grants for larger projects).
 */
export const PROJECT_FUNDING = {
  note: "Club projects are funded by fundraising, and projects aligned to a Rotary area of focus can also be supported through The Rotary Foundation’s District and Global Grants.",
  rotaryHref: "/rotary",
  districtHref: "/about/district-9215",
};

/* ============================= Awards ============================= */
export const AWARDS: Award[] = [
  // Awarded in the 2025/26 Rotary year, before the district change — CONFIRM (docs/CONTENT_AUDIT.md)
  {
    title: "DEI Champion — Legacy Award 2026",
    tag: "Rotary District 9212",
    year: "2026",
    image: "", // old archive photograph — no recent equivalent (see CONTENT_AUDIT.md)
    gold: true,
  },
  {
    title: "Ten Years of Service",
    tag: "Milestone",
    year: "2025",
    image: "", // old archive photograph — no recent equivalent (see CONTENT_AUDIT.md)
  },
];

/* ============================= Leadership ============================= */
export const LEADERS: Leader[] = [
  {
    name: "Wanjiku Nguru",
    standing: "President",
    portfolio: "Executive",
    term: "2026/27",
    slug: "wanjiku-nguru",
    initials: "WN",
    photo: "/images/leadership/wanjiku-nguru",
    group: "executive",
    kind: "board",
    bio: "A youth leader, environmental advocate and strategic thinker, Wanjiku holds a Bachelor of Commerce in Information Systems from the University of Nairobi and works as a Relationship Officer at ACK Imani Talent Sacco, driving member engagement and financial inclusion. She joined Rotaract in 2023 and has held progressive roles including GRC Chair and Rotaract East Africa Impact Country Director for Kenya, and now leads the club as President. A daily farmer and travel enthusiast, she is guided by faith and purpose — championing environmental sustainability, youth empowerment and collective action for lasting community impact.",
  },
  {
    name: "Racheal Kyalo",
    standing: "President Elect",
    portfolio: "Executive",
    slug: "racheal-kyalo",
    initials: "RK",
    photo: "/images/leadership/racheal-kyalo",
    group: "executive",
    kind: "board",
    bio: "A Rotaractor, sales and marketing professional and dedicated leader committed to personal growth, service and youth empowerment. Racheal served as Professional and Leadership Development Director for two consecutive Rotary years, was Merchandise Lead for RYLA Kenya in 2025, and held the role of President Nominee for the 2025–2026 Rotary year. She is passionate about sales, marketing and building meaningful connections, and loves travelling, exploring new experiences and networking with people from diverse backgrounds.",
  },
  {
    name: "Janet Nkirote",
    standing: "Immediate Past President & Club Advisor",
    portfolio: "Executive",
    slug: "janet-nkirote",
    initials: "JN",
    photo: "/images/leadership/janet-nkirote",
    group: "executive",
    kind: "board",
    bio: "An educator and servant leader with a degree from Machakos University specialising in Special Needs Education, Biology and Agriculture. Janet’s Rotaract journey began at RAC Machakos University, and she joined RAC Menengai in 2022, going on to serve as Club Secretary and as Club President for 2025/26. A Polio Plus Fellow and aspiring Paul Harris Fellow, she is committed to mentorship, youth empowerment and inclusive education, and works at Mirema School as a Class Manager and Autism Pioneer.",
  },
  {
    name: "Sally Kimani",
    portfolio: "Secretary & Membership",
    slug: "sally-kimani",
    initials: "SK",
    photo: "/images/leadership/sally-kimani",
    group: "officers",
    kind: "board",
    bio: "Sally’s classification is hair and beauty, and she is known across the club for her love of laughter and her bright smile. Within Rotaract she has served as both Secretary and Club Service Director in different years, bringing energy, creativity and dedication to every role — and a calming sense of humour to the room.",
  },
  {
    name: "Justin Mwaura",
    portfolio: "Finance",
    slug: "justin-mwaura",
    initials: "JM",
    photo: "/images/leadership/justin-mwaura",
    group: "officers",
    kind: "board",
    bio: "Justin enjoys digging into numbers and drawing insight from statistics and economics, and he works best in a data-driven decision-making environment. An Arsenal supporter through the tough and fruitful times, he also enjoys looking at football from a statistical point of view. Outside work and his hobbies he is a firm believer in community outreach and self-improvement.",
  },
  {
    name: "Felix Bett",
    portfolio: "Public Relations",
    slug: "felix-bett",
    initials: "FB",
    photo: "/images/leadership/felix-bett",
    group: "officers",
    kind: "board",
    bio: "A media professional, videographer and photographer based in Nakuru, currently studying Communication and Media at Egerton University. Through his work with Tami Series and Tash Photography Kenya he specialises in cinematic videography, photography and digital storytelling, with a focus on youth empowerment, environmental awareness and community impact. Felix served as Centennial Champion for the Rotaract Club of Menengai during the 2024/2025 service year, and is steadily growing as a content creator and YouTuber.",
  },
  {
    name: "Jacob Endurance",
    portfolio: "Sergeant-at-Arms",
    slug: "jacob-endurance",
    initials: "JE",
    photo: "/images/leadership/jacob-endurance",
    group: "officers",
    kind: "board",
    bio: "Founder and Executive Director of MACTEDENT Enterprise, a social enterprise championing youth empowerment through theatre, film, creative arts and community engagement. A skilled electrician, actor, scriptwriter, director and certified GCED trainer, Jacob previously served as TRF/Fundraising Director and Foundation Chair at the Rotaract Club of Menengai, and played a key role in the formation of the Rotary Creative Community in District 9212. He is also Programmes Director at CESRA.",
  },
  {
    name: "Allan Leyian",
    portfolio: "International Service & Professional Leadership Development",
    slug: "allan-leyian",
    initials: "AL",
    photo: "/images/leadership/allan-leyian",
    group: "service",
    kind: "board",
    bio: "Sena Allan Leyian is a music enthusiast and creative professional holding a Bachelor’s degree in Music Technology from Kenyatta University. With a background across various music institutions he has built expertise in sound, music production and creative development within the industry. Beyond music he is a committed animal rights advocate, collaborating with the Kenya Society for the Protection and Care of Animals (KSPCA), and his deep curiosity for science and innovation shows in a personal interest in quantum physics.",
  },
  {
    name: "Issa Telot",
    portfolio: "Community Service",
    slug: "issa-telot",
    initials: "IT",
    photo: "/images/leadership/issa-telot",
    group: "service",
    kind: "board",
    bio: "Emmanuel Issa Telot is a dedicated leader, public servant and community advocate based in Nakuru, holding a Bachelor’s degree in Criminology with IT. He serves in Administration and Records Management at the National Police Service Commission, while also leading the MLIFE Foundation Executive Board, Kenya Chapter, championing youth empowerment, minority rights and inclusivity. A VirtueLead Fellow at the Emerging Leaders Foundation, he is passionate about anime, football and community service.",
  },
  {
    name: "Sophia Muthoni",
    portfolio: "The Rotary Foundation, Fundraising & Grants",
    slug: "sophia-muthoni",
    initials: "SM",
    photo: "/images/leadership/sophia-muthoni",
    group: "service",
    kind: "board",
    bio: "A proud mother, devoted wife and adventurous soul who believes life is best lived through purpose, passion and meaningful human connection. Sophia is deeply committed to fluorosis awareness, safe water access and sustainable health solutions that uplift and transform communities, and she holds firm to the belief that every act of kindness creates a lasting ripple of hope.",
  },
  {
    name: "Jessica Njeri",
    portfolio: "New Generation",
    slug: "jessica-njeri",
    initials: "JN",
    photo: "/images/leadership/jessica-njeri",
    group: "service",
    kind: "board",
    bio: "A young leader, creative strategist and community advocate, Jessica steps into the role of New Generation Director. With a strong background in stakeholder engagement, event coordination, branding and youth empowerment, she is driven by creating opportunities that inspire growth and positive community impact. Outside her professional pursuits she is an avid reader, adventure enthusiast and lover of food, music, hiking and biking.",
  },
  {
    name: "John Ngugi",
    portfolio: "Government & Ethics",
    slug: "john-ngugi",
    initials: "JN",
    photo: "/images/leadership/john-ngugi",
    group: "service",
    kind: "board",
    bio: "A dedicated Rotaract leader currently serving as Assistant District Rotaract Representative for the Nakuru Region. John first joined the Rotaract Club of Menengai, where he served as both President and Service Project Director and elevated the club’s public profile through impactful projects, member engagement and visibility in the community. He is passionate about bridging generations, fostering youth leadership, and making sure every member feels empowered to serve and make a difference.",
  },

  /* Past presidents — archive */
  {
    name: "John Brodrick",
    portfolio: "Charter President",
    slug: "john-brodrick",
    initials: "JB",
    kind: "past",
    bio: "Founder president who guided the club’s charter under the Rotary Club of Nakuru.",
  },
  {
    name: "Terry Muigai",
    portfolio: "President",
    term: "2019",
    slug: "terry-muigai",
    initials: "TM",
    kind: "past",
    bio: "Led the club through a key year of growth and service.",
  },
  {
    // Retained as a record only: the 2025/26 DEI role is unconfirmed, so it is
    // filtered out of the public page (see docs/CONTENT_AUDIT.md).
    name: "Phylis Kanja",
    portfolio: "DEI Director",
    term: "2025/26",
    slug: "phylis-kanja",
    initials: "PK",
    kind: "past",
    confirm: true,
    bio: "Champion of diversity, equity and inclusion across the club’s work.",
  },
];

/* ============================= Partners ============================= */
/**
 * Partners are listed with their supplied logo where one exists. The twelve
 * logo files arrived from the club on 14 November 2026 alongside the Medical
 * Outreach poster; four of the source files were PDFs and were rasterised
 * before cropping. See docs/BRANDING_VERIFICATION.md.
 */
export const PARTNERS: Partner[] = [
  {
    name: "Rotary Club of Nakuru",
    logo: "/images/partners/rotary-club-of-nakuru.webp",
  },
  {
    name: "AAR Healthcare",
    logo: "/images/partners/aar-healthcare.webp",
  },
  {
    name: "ACK Imani Talent NWDT SACCO",
    logo: "/images/partners/aits-sacco.webp",
  },
  {
    name: "JALARAM St. Christopher Hospital",
    logo: "/images/partners/jalaram-st-christopher-hospital.webp",
  },
  {
    name: "King's Foundation",
    logo: "/images/partners/kings-foundation.webp",
  },
  {
    name: "Lions SightFirst Eye Hospital",
    logo: "/images/partners/lions-sightfirst-eye-hospital.webp",
  },
  {
    name: "Madini Purified Drinking Water",
    logo: "/images/partners/madini-purified-water.webp",
  },
  {
    name: "The Nakuru Specialist Hospital",
    logo: "/images/partners/nakuru-specialist-hospital.webp",
  },
  {
    name: "Optimum Current Health Care",
    logo: "/images/partners/optimum-healthcare.webp",
  },
  {
    name: "Rotaract Club of Sunrise-Kampala",
    logo: "/images/partners/rotaract-sunrise-kampala.webp",
  },
  {
    name: "SCANN",
    logo: "/images/partners/scann.webp",
  },
  {
    name: "Valley Hospital",
    logo: "/images/partners/valley-hospital.webp",
  },
  { name: "Rotary District 9215" },
  { name: "Nakuru County Government" },
  { name: "Kenya Wildlife Service" },
  { name: "NEMA Kenya" },
  { name: "Kenya Red Cross" },
  { name: "Bondeni Maternity" },
  { name: "Limuko Schools" },
];

/** Partners whose supplied artwork can be shown as a logo wall. */
export const LOGO_PARTNERS = PARTNERS.filter((partner) => partner.logo);

/** Format a Kenyan shilling amount, e.g. 3000 → "KES 3,000". */
export const formatKes = (amount: number): string =>
  `KES ${amount.toLocaleString("en-KE")}`;

/* ============================= Membership ============================= */
export const JOIN_STEPS: JoinStep[] = [
  {
    title: "Come to fellowship",
    text: "Attend three Thursday fellowships, 5:00–7:00 PM. Come as you are — guests are family.",
  },
  {
    title: "Serve on a project",
    text: "Join one hands-on project — a cleanup, a donation drive, a school visit. Feel the work.",
  },
  {
    title: "Get to know the club",
    text: "Explore our short orientation course at your own pace. Ask the membership team how they confirm orientation before induction.",
  },
  {
    title: "Get inducted",
    text: "Take the oath, get your pin, and start with a mentor. Mentorship from day one.",
  },
];

export const MEMBERSHIP = {
  whoCanJoin:
    "Young professionals and students, aged 18 and over, in and around Nakuru. We are deliberately diverse and inclusive: all professions, campuses and backgrounds welcome.",
  whatHappens:
    "Fellowship is a relaxed hour: a short look at the week’s service, a project update, and time to get to know each other. Through the year we also run our book club and professional-development sessions.",
  /** Club-provided figures (see docs/CONTENT_AUDIT.md) — payment timing still to confirm. */
  fees: {
    subscription: 3000,
    subscriptionPeriod: "per year",
    pin: 500,
    note: "The annual subscription covers Rotary International dues and club running costs. Service projects are funded separately by fundraising.",
  },
  feesNote: `Membership is ${formatKes(3000)} a year, and there is a ${formatKes(500)} Rotaract pin. Ask an officer about how and when to pay. Service projects are funded separately by fundraising.`,
  guestNote:
    "Guests may attend three fellowships before deciding — no pressure, no cost.",
};

/* ============================= New member orientation =============================
 * A short club-owned course; officers confirm induction requirements. Every statement here is
 * drawn from facts already verified elsewhere in this file; anything the club
 * still needs to decide is marked CONFIRM and listed in docs/CONTENT_AUDIT.md.
 * ============================================================================ */
export interface OrientationBlock {
  kind: "p" | "list" | "note";
  text?: string;
  items?: string[];
}

export interface OrientationModule {
  id: string;
  title: string;
  summary: string;
  minutes: number;
  blocks: OrientationBlock[];
}

export interface OrientationQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

/* ============================= Values ============================= */
export interface Value {
  icon: IconKey;
  title: string;
  text: string;
}

export const VALUES: Value[] = [
  {
    icon: "users",
    title: "Community",
    text: "We show up for the people around us — from new mothers at Bondeni to families on the streets of Nakuru.",
  },
  {
    icon: "star",
    title: "Leadership",
    text: "Through mentorship, a book club and financial-literacy drives, we grow professionals and citizens of impact.",
  },
  {
    icon: "heart",
    title: "Service",
    text: "Service Above Self — from mother pack distributions to planting with learners at Pangani Special School.",
  },
];

/* ============================= FAQ ============================= */
export const FAQS: Faq[] = [
  {
    q: "When and where do you meet?",
    a: `Fellowship every Thursday, 5:00–7:00 PM at Nakuru Athletic Club (${CLUB.district}). Guests are welcome — come to three meetings to get a feel for the family before joining.`,
  },
  {
    q: "Who can join Rotaract?",
    a: "Young professionals and students, aged 18 and over. We are deliberately diverse and inclusive: all professions, campuses and backgrounds are welcome.",
  },
  {
    q: "How do I become a member?",
    a: "Start with three Thursday fellowships and one service project. Explore the orientation course, then ask the membership team to confirm the requirements and induction. Message us on Facebook or Instagram to arrange your first visit.",
  },
  {
    q: "What does the club actually do?",
    a: "Service projects across health, education, environment and peacebuilding — plus weekly fellowship, a book club and professional-development sessions.",
  },
  {
    q: "Is there a membership fee?",
    a: `Yes — ${formatKes(MEMBERSHIP.fees.subscription)} ${MEMBERSHIP.fees.subscriptionPeriod}, plus a ${formatKes(MEMBERSHIP.fees.pin)} Rotaract pin. The subscription covers Rotary International dues and running costs; service projects are funded separately by fundraising.`,
  },
  {
    q: "How is Rotaract different from Rotary?",
    a: "Rotaract and Rotary clubs are both part of Rotary International. Rotaract welcomes adults aged 18 and over, with members leading their own clubs and projects. Menengai’s sponsor is the Rotary Club of Nakuru, and we share Rotary’s motto: Service Above Self.",
  },
  {
    q: "Can I come on my own?",
    a: "Yes. You do not need to know a member before visiting. Introduce yourself as a first-time guest and ask an officer to help you get started.",
  },
  {
    q: "Do I have to be a student?",
    a: "No. Adults aged 18 and over from different campuses, professions and backgrounds are welcome. You do not need a particular qualification to visit.",
  },
  {
    q: "How much time should I plan for?",
    a: "Weekly fellowship runs two hours, 5:00–7:00 PM on Thursdays. Projects take additional time and vary by activity. Ask about dates and responsibilities before committing.",
  },
  {
    q: "What should I wear or bring?",
    a: "Check with an officer for any venue or event requirements. Project days may need specific clothing or equipment; ask before you travel.",
  },
  {
    q: "What if I am unsure about joining?",
    a: "Use the three free guest fellowships to get to know the club and ask questions. You can decide after visiting; attending as a guest does not automatically enrol you.",
  },
];

/* ============================= Audience paths ============================= */
export const AUDIENCES: AudiencePath[] = [
  {
    id: "join",
    title: "I want to join",
    text: "Three fellowships, one project, and you’re in. Guests are always welcome.",
    cta: "Become a member",
    href: "/membership",
  },
  {
    id: "partner",
    title: "I want to partner",
    text: "Sponsor or co-deliver a service project with an active, verified local club.",
    cta: "Talk to us",
    href: "/contact?interest=partner-project",
  },
  {
    id: "support",
    title: "I want to support a project",
    text: "Fund or donate to mother packs, girls’ education, and school art and environment work.",
    cta: "Support a project",
    href: "/contact?interest=support-project",
  },
];

/* ============================= Page intros ============================= */
export const PAGE_INTROS: Record<string, PageIntro> = {
  about: {
    eyebrow: "About us",
    title: "Young leaders, rooted in Nakuru",
    lead: "Sponsored by the Rotary Club of Nakuru and part of Rotary International’s global Rotaract family, we have spent a decade turning energy into impact.",
    description: `Who we are: a Rotaract club of young professionals and students in Nakuru, Kenya, sponsored by the Rotary Club of Nakuru and part of ${CLUB.district}.`,
  },
  projects: {
    eyebrow: "Our programmes",
    title: "What we run, year after year",
    lead: "The club's ongoing programmes — the work itself, in health, education, environment and peacebuilding. For the dated record of what actually happened, see Events.",
    description:
      "Verified service projects by the Rotaract Club of Menengai: mother packs at Bondeni and Kabatini, girls’ education at Limuko schools, art and environment work at Pangani Special School, and more.",
  },
  awards: {
    eyebrow: "Recognition",
    title: "Celebrating excellence",
    lead: "Awards and recognition from Rotary, Nakuru County and our partners.",
    description:
      "Recognition earned by the Rotaract Club of Menengai, including the DEI Champion Legacy Award 2026.",
  },
  leadership: {
    eyebrow: "The people",
    title: "Leadership that leads with heart",
    lead: "Current leadership and the presidents who built the club.",
    description:
      "Meet the Rotaract Club of Menengai leadership — current officers and the past presidents who built the club in Nakuru, Kenya.",
  },
  news: {
    eyebrow: "Stay connected",
    title: "Club updates & stories",
    lead: "Recent service, fellowships and partnerships — told straight from the club.",
    description:
      "Recent Rotaract Club of Menengai stories: service projects, fellowships and partnerships in Nakuru, Kenya.",
  },
  membership: {
    eyebrow: "Become a member",
    title: "Become a Member",
    lead: "Membership is a two-way thing: come to fellowship, serve on a project, and see whether the club fits. Here is exactly what joining asks of you — and what it costs.",
    description:
      "How to join the Rotaract Club of Menengai: attend three Thursday fellowships in Nakuru, serve on a project, and get inducted. Adults aged 18 and over are welcome.",
  },
  contact: {
    eyebrow: "Contact & partnerships",
    title: "Let’s talk about service",
    lead: "Joining, partnering or supporting a project — we’d love to hear from you.",
    description:
      "Contact the Rotaract Club of Menengai about membership, partnerships or supporting a project in Nakuru, Kenya.",
  },
};

/* ============================= Contact ============================= */
export const CONTACT = {
  formNote:
    "We are a volunteer-run club. Fill this in and one of our officers will reach out — or message us on Facebook or Instagram for the fastest reply.",
  interests: [
    "Join the club",
    "Partner on a project",
    "Support a project",
    "General question",
  ] as const,
};

/**
 * Official contact details (docs/CONTENT_AUDIT.md). Nothing here was invented:
 * values still marked `CONFIRM_*` are placeholders that are NEVER shown to
 * visitors — the UI only reveals a channel once it holds a real value.
 */
export const contactConfig = {
  email: "menengairc@gmail.com",
  phone: "CONFIRM_OFFICIAL_PHONE",
  whatsapp: "CONFIRM_OFFICIAL_WHATSAPP",
} as const;

/** True once a contact channel has been confirmed by the club. */
export const isContactConfirmed = (value: string): boolean =>
  !value.startsWith("CONFIRM_");

/**
 * Holiday / special-event override. To pause the weekly schedule and show a
 * custom message everywhere, set `{ message: 'No fellowship this week — see
 * you next Thursday!' }` (leave `null` for the normal Thursday schedule).
 */
export const FELLOWSHIP_OVERRIDE: { message: string } | null = null;
