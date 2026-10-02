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
    dayLabel: 'Thursday';
    timeLabel: '5:30–6:30 PM';
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
  tag: 'Health' | 'Education' | 'Environment' | 'Community' | 'Service';
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
  role: string;
  term?: string;
  bio: string;
  initials: string;
  kind: 'board' | 'past';
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
  | 'leaf' | 'heart' | 'book' | 'users' | 'star' | 'droplets'
  | 'heartPulse' | 'graduation' | 'sparkles' | 'trending' | 'shield' | 'handshake'
  | 'calendar' | 'mapPin' | 'award' | 'flag' | 'building' | 'wallet' | 'messageCircle';

/* ============================= Assets ============================= */
const img = (file: string) => new URL(`../assets/images/menengai/${file}`, import.meta.url).href;

export const HERO_IMAGES = {
  background: img('banner.jpg'),
  logo: img('logo-transparent.png'),
};

export const ABOUT_IMAGES = {
  tall: img('adopt-river.jpg'),
  wide: img('cleanup-campaign.jpg'),
};

export const SIGNATURE_IMAGE = img('river-cleanup.jpg');

/* ============================= Identity ============================= */
export const CLUB: ClubMeta = {
  name: 'Rotaract Club of Menengai',
  shortName: 'RAC Menengai',
  city: 'Nakuru, Kenya',
  country: 'Kenya',
  district: 'Rotary District 9215',
  sponsor: 'Rotary Club of Nakuru',
  establishedLabel: 'Est. 2016', // CONFIRM exact charter year (2015 vs 2016)
  motto: 'Service Above Self',
  audience: 'Young professionals and students, roughly 18–30',
  meeting: {
    dayLabel: 'Thursday',
    timeLabel: '5:30–6:30 PM',
    timeZoneNote: 'East Africa Time',
    active: true, // CONFIRM if the club ever pauses its weekly schedule
  },
};

export const SOCIALS: Socials = {
  facebook: 'https://www.facebook.com/RCmenengai/',
  instagram: 'https://www.instagram.com/racmenengai/',
  x: 'https://x.com/RcMenengai',
  linkedin: 'https://www.linkedin.com/in/rac-menengai-91b5591b3',
  threads: 'https://www.threads.com/@racmenengai',
};

export const NAV_LINKS = [
  { href: '/about', label: 'About' },
  { href: '/projects', label: 'Projects' },
  { href: '/awards', label: 'Awards' },
  { href: '/leadership', label: 'Leadership' },
  { href: '/news', label: 'News' },
  { href: '/membership', label: 'Membership' },
] as const;

/* ============================= Home copy ============================= */
export const HERO = {
  eyebrow: `${CLUB.district} · ${CLUB.city}`,
  title: 'A Decade of Service Above Self',
  titleAccent: 'Service Above Self',
  lead:
    'Rotaract Club of Menengai — young professionals and students in Nakuru, Kenya, turning service into community impact. We meet every Thursday from 5:30–6:30 PM in Nakuru for fellowship.',
  primaryCta: 'Attend a fellowship',
  secondaryCta: 'Explore our projects',
};

export const ANNOUNCEMENT = {
  text: 'Next fellowship: Thursday, 5:30–6:30 PM · Nakuru',
  action: 'Plan your visit',
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
  number: '9215',
  inauguralYear: '2026/27',
  predecessor: 'Rotary District 9212',
  /** Shown to visitors so the page never pretends to be live district data. */
  asOf: 'Paraphrased from rotary9215.org, the district’s own site — check there for the latest details.',
  intro:
    'Rotary District 9215 is one of East Africa’s newest and most active service networks: clubs, members and changemakers across West of Nairobi, Western Kenya and South Sudan, turning ideas into action.',
  coverage: ['West of Nairobi', 'Western Kenya', 'South Sudan'],
  stats: [
    { value: '100+', label: 'Rotary clubs', note: 'across the district' },
    { value: '3,000+', label: 'Rotarians', note: 'leaders, professionals and volunteers' },
    { value: '2026/27', label: 'Inaugural year', note: 'a newly established district' },
    { value: '1.2M', label: 'Rotary members', note: 'worldwide, in 200+ countries' },
  ],
  story: [
    'District 9215 was established for the 2026/27 Rotary year. The district describes itself as a fresh chapter built on the legacy of District 9212 — new boundaries, new leadership, and the same commitment to service.',
    'Our club, the Rotaract Club of Menengai, sits inside that district: a Rotaract club in Nakuru serving alongside Rotarians from western Nairobi, Western Kenya and South Sudan.',
  ],
  dg: {
    name: 'Saad Rahman',
    role: 'Pioneer District Governor · 2026/27',
    initials: 'SR',
    bio: [
      'Inducted into Rotary in November 2015 with the Rotary Club of Bahari in Dar es Salaam, Tanzania — then part of District 9211.',
      'Moved to Kenya in 2019 and continued serving with the Rotary Club of Lang’ata.',
      'Charter President of the Rotary Club of Nairobi Upper Hill, leading the club until it was chartered in May 2021.',
      'A member of The Rotary Foundation’s Cadre of Technical Advisors, supporting the sustainability of major Rotary grants.',
    ],
  },
  ri: {
    president: 'Olayinka Hakeem Babalola',
    theme: 'Create Lasting Impact',
    text: 'Rotary’s theme for the year, Create Lasting Impact, is the district’s operating brief: community ownership, sustainability beyond the grant, and measurable change — not quick fixes.',
  },
  focuses: [
    {
      id: 'wash',
      icon: 'droplets',
      title: 'Water, sanitation & hygiene',
      text: 'Moving beyond boreholes to community water committees and hygiene education in South Sudan and Western Kenya, so clean water lasts and children stay in school.',
    },
    {
      id: 'education',
      icon: 'graduation',
      title: 'Basic education & literacy',
      text: 'Digital-literacy labs, solar power and teacher training that keep schools thriving long after the project ends.',
    },
    {
      id: 'peace',
      icon: 'handshake',
      title: 'Peace & conflict prevention',
      text: 'Training young leaders in conflict management in regions navigating transition or post-conflict recovery.',
    },
    {
      id: 'economy',
      icon: 'trending',
      title: 'Economic & community development',
      text: 'Micro-financing and vocational skills for women’s cooperatives and young entrepreneurs.',
    },
    {
      id: 'youth',
      icon: 'users',
      title: 'Youth leadership: Rotaract & Interact',
      text: 'Rotaractors are brought into joint project leadership and district roles, keeping the leadership pipeline dynamic.',
    },
    {
      id: 'inclusion',
      icon: 'sparkles',
      title: 'Diversity, equity & inclusion',
      text: 'Welcoming diverse professions, perspectives and backgrounds — which is how complex community problems get solved.',
    },
    {
      id: 'engagement',
      icon: 'star',
      title: 'Member engagement & learning',
      text: 'Vibrant club cultures plus leadership seminars, PELS and District Learning events that keep members informed and involved.',
    },
  ] as DistrictFocusArea[],
  events: [
    {
      id: 'trf-dinner-2026',
      title: 'District 9215 Annual Foundation Dinner 2026',
      when: 'Saturday 21 November 2026',
      where: 'Trademark Hotel, Nairobi',
      text: 'Themed “The Heart of Rotary”, the district’s foundation dinner raises funds for The Rotary Foundation — water, maternal health, education and economic empowerment across Kenya and South Sudan.',
      href: 'https://rotary9215.org/page/trf-dinner-2026',
    },
    {
      id: 'dca-2027',
      title: 'District Conference Assembly 2027',
      when: '2027',
      text: 'The district’s next conference is being organised together with District 9216; the DCA site carries the programme and registration.',
      href: 'https://rotary9216.org/page/dca-2027-welcome/',
    },
  ] as DistrictEvent[],
  engagement: [
    'Rotaractors can take project leadership and district roles, not just club ones.',
    'The Four-Way Test still guides partnerships: is it the truth, is it fair to all concerned, will it build goodwill and better friendships, will it be beneficial to all concerned?',
    'District learning: PELS, District Learning events and Membership Month keep members sharp and connected.',
    'The Rotary Foundation: the district runs a pledge portal and an annual dinner to fund grants.',
  ],
  links: [
    { label: 'District 9215 website', href: 'https://rotary9215.org/' },
    { label: 'Club directory — find a Rotary club', href: 'https://portal.clubrunner.ca/50421/clubdirectory' },
    { label: 'Clubs map', href: 'https://portal.clubrunner.ca/50421/clubsmap' },
    { label: 'District events calendar', href: 'https://rotary9215.org/events/calendar' },
    { label: 'TRF pledge portal', href: 'https://trfpledge.rotary9215.org/' },
    { label: 'Unicaf scholarship partnership announcement (Districts 9215 & 9216)', href: 'https://www.unicaf.org/news-and-events/press-release/unicaf-and-rotary-districts-9215-9216-sign-landmark-partnership/' },
  ] as DistrictLink[],
  ourPlace: {
    text: 'District priorities are not abstract for us — our four service areas map onto them, and our members can take club projects to district level.',
    mapping: [
      { club: 'Environment & water', district: 'WASH: clean water, clean rivers, hygiene education' },
      { club: 'Maternal & child health', district: 'Maternal health programmes' },
      { club: 'Education & girls’ empowerment', district: 'Basic education & literacy' },
      { club: 'Community & peacebuilding', district: 'Peacebuilding and economic empowerment' },
    ],
  },
  disclaimer:
    'District pages, dates and figures change — rotary9215.org is the authority. The district’s photos and logo belong to the district; ask before reusing them.',
};

export const STATS: Stat[] = [
  { value: 10, suffix: '+', label: 'Years of service', context: 'chartered with the Rotary Club of Nakuru', year: '2016' },
  { value: 405, suffix: '+', label: 'Girls empowered', context: 'sanitary-towel donations across Limuko schools', year: '2026' },
  { value: 2, suffix: '', label: 'Rivers adopted', context: 'River Njoro & River Ndarugu cleanups', year: '2022' },
  { value: 150, suffix: '+', label: 'Mother packs', context: 'delivered at Bondeni Maternity', year: '2026' },
];

export const SERVICES: ServiceArea[] = [
  { id: 'environment', icon: 'leaf', title: 'Environment & water', oneLiner: 'River cleanups, water filters and waste infrastructure — starting with our Adopt-a-River flagship.' },
  { id: 'health', icon: 'heartPulse', title: 'Maternal & child health', oneLiner: 'Mother packs and essentials for new families at Bondeni Maternity and beyond.' },
  { id: 'education', icon: 'graduation', title: 'Education & girls’ empowerment', oneLiner: 'Sanitary-towel donations and mentorship so no girl misses class for lack of supplies.' },
  { id: 'community', icon: 'handshake', title: 'Community & peacebuilding', oneLiner: 'Outreach for street-connected families, plus art and dialogue through Peace in Colour Fest.' },
];

export const FINAL_CTA = {
  headline: 'Come as you are. Leave as a leader.',
  lead: 'Three fellowships, one project, and you’ve found your people. Guests are always welcome.',
};

/* ============================= Projects ============================= */
export const PROJECTS: Project[] = [
  {
    slug: 'adopt-a-river',
    title: 'Adopt-a-River',
    tag: 'Environment',
    year: '2022',
    image: img('adopt-river.jpg'),
    summary: 'Our flagship environmental project: water filtration, mobilisation and cleanups on River Njoro and River Ndarugu.',
    detail:
      'Adopt-a-River is our flagship environmental project, tackling pollution at the source. On River Njoro, members installed a water filtration set for Barut residents, went door-to-door mobilising against single-use plastic, and ran a full cleanup at Mwariki Bridge. Waste-disposal containers now give the community a lasting place to keep the river clean. On River Ndarugu, volunteers and partners cleared solid waste and ran sensitisation on dumping, drainage and safe water handling.',
    location: 'Mwariki Bridge, Barut — River Njoro & River Ndarugu',
    featured: true,
    challenge: 'Rivers in Nakuru carry untreated waste, plastic and runoff — affecting the communities that live and draw water along them.',
    reached: ['Residents of Barut and riverside communities along River Njoro and River Ndarugu'],
    caption: 'Club members and partners during the Adopt-a-River cleanups on River Njoro.',
    results: [
      'Water filtration system installed for residents of Barut',
      'Cleanups on River Njoro & River Ndarugu with 20+ youth volunteers (2022)',
      'Community sensitisation on single-use plastic',
      'Waste-disposal containers for lasting cleanliness',
    ],
    partners: ['Nakuru County Government', 'Kenya Wildlife Service', 'NEMA Kenya'],
  },
  {
    slug: 'mother-packs',
    title: 'Mother Packs at Bondeni Maternity',
    tag: 'Health',
    year: '2026',
    image: img('welcome.jpg'),
    summary: 'Mother packs for new mothers and their babies at Bondeni Maternity, launching our Rotary year in service.',
    detail:
      'To open the 2026 Rotary year, members assembled and distributed mother packs — diapers, wraps, soap and essentials — to new mothers at Bondeni Maternity in Nakuru. Each pack carries a simple message: no mother welcomes new life alone.',
    location: 'Bondeni Maternity, Nakuru',
    reached: ['New mothers and their babies at Bondeni Maternity'],
    caption: 'Mother packs assembled and distributed at Bondeni Maternity.',
    results: ['150+ mother packs distributed', 'New-year service launch at Bondeni Maternity'],
    partners: ['Bondeni Maternity'],
  },
  {
    slug: 'limuko-girls',
    title: '405 Girls at Limuko Schools',
    tag: 'Education',
    year: '2026',
    image: img('cleanup-campaign.jpg'),
    summary: 'Three months of sanitary towels per girl for 405+ students at Limuko High & Primary School.',
    detail:
      'Working with school leadership, the club delivered sanitary-towel donations worth roughly three months per girl to more than 405 students — paired with mentorship conversations so no girl misses class for lack of supplies.',
    location: 'Limuko High & Primary School',
    reached: ['405+ students at Limuko High & Primary School'],
    caption: 'Sanitary-towel donations prepared for Limuko schools.',
    results: ['405+ students reached with ~3 months of sanitary towels each', 'Mentorship conversations with students'],
    partners: ['Limuko Schools'],
  },
  {
    slug: 'ndarugu-cleanup',
    title: 'River Ndarugu Cleanup',
    tag: 'Environment',
    year: '2022',
    image: img('river-cleanup.jpg'),
    summary: 'Cleanup and community sensitisation along River Ndarugu with partners and stakeholders.',
    detail:
      'Second river adoption: volunteers, partners and riverside residents cleared solid waste along River Ndarugu and ran sensitisation on dumping, drainage and safe water handling.',
    location: 'River Ndarugu',
    reached: ['Riverside residents and volunteers along River Ndarugu'],
    caption: 'Community cleanup along River Ndarugu.',
    results: ['Solid waste cleared with volunteers and partners', 'Sensitisation on dumping, drainage and safe water'],
  },
  {
    slug: 'peace-fest',
    title: 'Peace in Colour Fest',
    tag: 'Community',
    year: '2025',
    image: img('banner.jpg'),
    summary: 'Art, mental wellness and peacebuilding for young people in Nakuru.',
    detail:
      'A festival-format fellowship: live art, music, mental-wellness circles and peacebuilding dialogues for young people across Nakuru — moderated by our own past president.',
    location: 'Nakuru',
    reached: ['Young people across Nakuru'],
    caption: 'Art and fellowship at Peace in Colour Fest in Nakuru.',
  },
  {
    slug: 'street-families',
    title: 'Street Families Outreach',
    tag: 'Service',
    year: '2021',
    image: img('welcome.jpg'),
    summary: 'Clothes, diapers and amenities for families on the streets of Nakuru.',
    detail:
      'Members pooled clothes, diapers, foodstuffs and hygiene amenities for street-connected families — delivered directly, with dignity, and followed up through partner homes.',
    location: 'Nakuru CBD',
    reached: ['Street-connected families in Nakuru CBD'],
    caption: 'Clothing and amenities gathered for the street-families outreach.',
  },
];

export const PROJECT_TAGS = ['All', ...Array.from(new Set(PROJECTS.map((p) => p.tag)))] as string[];

export const FEATURED_PROJECT_SLUG = 'adopt-a-river';

/* ============================= Awards ============================= */
export const AWARDS: Award[] = [
  // Awarded in the 2025/26 Rotary year, before the district change — CONFIRM (docs/CONTENT_AUDIT.md)
  { title: 'DEI Champion — Legacy Award 2026', tag: 'Rotary District 9212', year: '2026', image: img('welcome.jpg'), gold: true },
  { title: 'Ten Years of Service', tag: 'Milestone', year: '2025', image: img('banner.jpg') },
  { title: 'City Clean-up Campaign · Nakuru County', tag: 'Recognition', year: '2024', image: img('cleanup-campaign.jpg') },
  { title: 'DRR Meet & Greet, Hyrax Hill', tag: 'Fellowship', year: '2023', image: img('river-cleanup.jpg') },
  { title: 'Adopt-a-River Launch', tag: 'Flagship', year: '2022', image: img('adopt-river.jpg') },
];

/* ============================= Leadership ============================= */
export const LEADERS: Leader[] = [
  {
    name: 'Joyce Wanjiku Nguru',
    role: 'President',
    term: '2026/27',
    bio: 'Environmental champion leading a year of mother packs, girls’ education and fellowship.',
    initials: 'JW',
    kind: 'board',
  },
  {
    name: 'Phylis Kanja',
    role: 'DEI Director',
    term: '2025/26',
    bio: 'Champion of diversity, equity and inclusion across the club’s work.',
    initials: 'PK',
    kind: 'board',
    confirm: true,
  },
  {
    name: 'John Brodrick',
    role: 'Charter President',
    bio: 'Founder president who guided the club’s charter under the Rotary Club of Nakuru.',
    initials: 'JB',
    kind: 'past',
  },
  {
    name: 'Janet Nkirote',
    role: 'President',
    term: '2025/26',
    bio: 'Hosted Peace in Colour Fest — art, wellness and dialogue for young Nakuru.',
    initials: 'JN',
    kind: 'past',
  },
  {
    name: 'Terry Muigai',
    role: 'President',
    term: '2019',
    bio: 'Led the club through a key year of growth and service.',
    initials: 'TM',
    kind: 'past',
  },
];

/* ============================= News ============================= */
export const NEWS: NewsItem[] = [
  {
    title: 'President’s first month — mother packs & 405 girls reached',
    category: 'President',
    date: '2026',
    image: img('welcome.jpg'),
    excerpt: 'A first month of service at Bondeni Maternity, Limuko schools and unforgettable Thursday fellowships.',
  },
  {
    title: 'Deputy Governor launches city clean-up',
    category: 'Community',
    date: '2024',
    image: img('cleanup-campaign.jpg'),
    excerpt: 'With KWS, NEMA and Red Cross for Nakuru’s inaugural city clean-up campaign.',
  },
  {
    title: 'Rotary Nakuru & RAC Menengai partnership visit',
    category: 'Partnership',
    date: '2025',
    image: img('banner.jpg'),
    excerpt: 'A joint visit between Rotary Nakuru, RAC Menengai and RAC Bahati.',
  },
  {
    title: 'Peace in Colour Fest, Nakuru',
    category: 'Community',
    date: '2025',
    image: img('river-cleanup.jpg'),
    excerpt: 'Art, health, mental wellness and reconciliation for young people across Nakuru.',
  },
  {
    title: 'Book club turns one',
    category: 'Fellowship',
    date: '2026',
    image: img('adopt-river.jpg'),
    excerpt: 'A year of meaningful conversations and fresh perspectives in our book club.',
  },
];

/* ============================= Partners ============================= */
export const PARTNERS: Partner[] = [
  { name: 'Rotary Club of Nakuru' },
  { name: 'Rotary District 9215' },
  { name: 'Nakuru County Government' },
  { name: 'Kenya Wildlife Service' },
  { name: 'NEMA Kenya' },
  { name: 'Kenya Red Cross' },
  { name: 'Bondeni Maternity' },
  { name: 'Limuko Schools' },
];

/** Format a Kenyan shilling amount, e.g. 3000 → "KES 3,000". */
export const formatKes = (amount: number): string => `KES ${amount.toLocaleString('en-KE')}`;

/* ============================= Membership ============================= */
export const JOIN_STEPS: JoinStep[] = [
  { title: 'Come to fellowship', text: 'Attend three Thursday fellowships, 5:30–6:30 PM. Come as you are — guests are family.' },
  { title: 'Serve on a project', text: 'Join one hands-on project — a cleanup, a donation drive, a school visit. Feel the work.' },
  { title: 'Complete new member orientation', text: 'Work through our short course about Rotaract and RAC Menengai — about 20 minutes, at your own pace.' },
  { title: 'Get inducted', text: 'Take the oath, get your pin, and start with a mentor. Mentorship from day one.' },
];

export const MEMBERSHIP = {
  whoCanJoin: 'Young professionals and students, roughly 18–30, in and around Nakuru. We are deliberately diverse and inclusive: all professions, campuses and backgrounds welcome.',
  whatHappens:
    'Fellowship is a relaxed hour: a short look at the week’s service, a project update, and time to get to know each other. Through the year we also run our book club and professional-development sessions.',
  /** Club-provided figures (see docs/CONTENT_AUDIT.md) — payment timing still to confirm. */
  fees: {
    subscription: 3000,
    subscriptionPeriod: 'per year',
    pin: 500,
    note: 'The annual subscription covers Rotary International dues and club running costs. Service projects are funded separately by fundraising.',
  },
  feesNote: `Membership is ${formatKes(3000)} a year, and there is a ${formatKes(500)} Rotaract pin. Ask an officer about how and when to pay. Service projects are funded separately by fundraising.`,
  guestNote: 'Guests may attend three fellowships before deciding — no pressure, no cost.',
};

/* ============================= New member orientation =============================
 * A short club-owned course completed before induction. Every statement here is
 * drawn from facts already verified elsewhere in this file; anything the club
 * still needs to decide is marked CONFIRM and listed in docs/CONTENT_AUDIT.md.
 * ============================================================================ */
export interface OrientationBlock {
  kind: 'p' | 'list' | 'note';
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

export const ORIENTATION = {
  title: 'New member orientation',
  lead: 'A short course about Rotaract and the Rotaract Club of Menengai. Complete it before your induction — about 20 minutes, and you can pause and come back at any time.',
  /** Club rule (CONFIRM wording with your officers) — enforced at induction, not by Rotary. */
  requiredBeforeInduction: true,
  /** Correct answers needed to pass — CONFIRM with your membership team. */
  passMark: 8,
  sources: [
    { label: 'Rotary Learning Center — official courses', href: 'https://learn.rotary.org' },
    { label: 'Rotary International — Rotaract clubs', href: 'https://www.rotary.org/en/get-involved/rotaract-clubs' },
  ],
  modules: [
    {
      id: 'welcome',
      title: 'Welcome to RAC Menengai',
      summary: 'Who we are, where we are, and who we are for.',
      minutes: 3,
      blocks: [
        {
          kind: 'p',
          text: `The Rotaract Club of Menengai (RAC Menengai) is a service club of young professionals and students in Nakuru, Kenya. We are chartered by the Rotary Club of Nakuru and part of ${CLUB.district}.`,
        },
        {
          kind: 'list',
          items: [
            'Where we are: Nakuru, Kenya',
            'Sponsored by: the Rotary Club of Nakuru',
            `District: ${CLUB.district}`,
            'Who joins: young professionals and students, roughly 18–30',
            'Motto: Service Above Self',
          ],
        },
        {
          kind: 'note',
          text: 'Fellowship and projects happen in and around Nakuru — you do not need to be a student or a professional to start; curiosity is enough.',
        },
      ],
    },
    {
      id: 'rotaract-and-rotary',
      title: 'Rotaract and Rotary',
      summary: 'How our club relates to Rotary International.',
      minutes: 3,
      blocks: [
        {
          kind: 'p',
          text: 'Rotaract is Rotary’s service programme for young leaders. Rotaract clubs are sponsored by a Rotary club, run their own leadership, and share Rotary’s motto and spirit of service.',
        },
        {
          kind: 'p',
          text: 'Our sponsor is the Rotary Club of Nakuru. That relationship brings mentorship, a link into Rotary’s wider network, and support for our projects — while our members plan and lead the work themselves.',
        },
        {
          kind: 'p',
          text: `We belong to ${CLUB.district} — a district established for the 2026/27 Rotary year across West of Nairobi, Western Kenya and South Sudan, with more than 100 clubs and 3,000+ Rotarians. Its first District Governor is Saad Rahman (2026/27).`,
        },
        {
          kind: 'list',
          items: [
            `Shared with Rotary: the motto Service Above Self, a commitment to service, and membership of ${CLUB.district}`,
            'District priorities we serve: water and sanitation, basic education, peacebuilding and economic empowerment',
            'Ours to run: projects, fellowship, club leadership and our own membership process',
            'Worth reading: Rotary publishes the Rotaract Handbook and its own official courses — see the links at the end of this course',
          ],
        },
      ],
    },
    {
      id: 'how-we-serve',
      title: 'How we serve',
      summary: 'The four areas our service falls into, with real examples.',
      minutes: 4,
      blocks: [
        {
          kind: 'p',
          text: 'We run six to eight hands-on service projects a year, alongside weekly fellowship, a book club and professional-development sessions.',
        },
        {
          kind: 'list',
          items: [
            'Environment & water — Adopt-a-River cleanups on River Njoro and River Ndarugu, water filtration for Barut residents, and waste-disposal containers.',
            'Maternal & child health — mother packs for new mothers at Bondeni Maternity.',
            'Education & girls’ empowerment — sanitary-towel donations and mentorship for 405+ students at Limuko High & Primary School.',
            'Community & peacebuilding — Peace in Colour Fest, and outreach for street-connected families in Nakuru.',
          ],
        },
        {
          kind: 'p',
          text: 'Projects are member-led: members propose, plan and run them, with officers and our sponsor club supporting along the way.',
        },
      ],
    },
    {
      id: 'fellowship',
      title: 'Fellowship: what to expect',
      summary: 'When we meet, what happens, and how guests are treated.',
      minutes: 3,
      blocks: [
        { kind: 'p', text: 'We meet every Thursday, 5:30–6:30 PM East Africa Time, in Nakuru.' },
        {
          kind: 'p',
          text: 'Fellowship is a relaxed hour: a short look at the week’s service, a project update, and time to get to know each other. Come as you are — guests are family.',
        },
        { kind: 'note', text: 'Guests may attend three fellowships before deciding whether to join — no pressure, no cost.' },
      ],
    },
    {
      id: 'your-path',
      title: 'Your path to membership',
      summary: 'The four steps, and what the course you are taking is for.',
      minutes: 4,
      blocks: [
        {
          kind: 'list',
          items: [
            'Attend three fellowships (Thursdays, 5:30–6:30 PM).',
            'Serve on one project — a cleanup, a donation drive, a school visit.',
            'Complete this orientation course.',
            'Get inducted: take the oath, receive your pin, and start with a mentor.',
          ],
        },
        {
          kind: 'p',
          text: `About fees: membership is ${formatKes(MEMBERSHIP.fees.subscription)} ${MEMBERSHIP.fees.subscriptionPeriod}, and there is a ${formatKes(MEMBERSHIP.fees.pin)} Rotaract pin. ${MEMBERSHIP.fees.note}`, // CONFIRM payment timing
        },
        {
          kind: 'note',
          text: 'Our club requires this course before induction. Completion is confirmed by an officer — keep the record you receive at the end of the course.',
        },
      ],
    },
    {
      id: 'being-a-member',
      title: 'Being a member',
      summary: 'What we ask of you, and what you get back.',
      minutes: 3,
      blocks: [
        {
          kind: 'p',
          text: `Being a member means showing up: for fellowship, for projects, and for each other. In return you get mentorship, leadership experience, and a network across ${CLUB.district} and Rotary.`,
        },
        {
          kind: 'list',
          items: [
            'Community — we show up for the people around us, from new mothers at Bondeni to families on the streets of Nakuru.',
            'Leadership — mentorship, our book club and professional-development sessions grow professionals and citizens of impact.',
            'Service — Service Above Self, whether adopting a river, planting trees or championing diversity, equity and inclusion.',
          ],
        },
        {
          kind: 'p',
          text: 'There are roles to grow into — club leadership, project leads and committee work — and our diversity, equity and inclusion work keeps the club open to everyone.',
        },
        { kind: 'note', text: 'Questions are always welcome: message the club on Facebook or Instagram, or ask any officer at fellowship.' },
      ],
    },
  ] as OrientationModule[],
  questions: [
    {
      id: 'q-location',
      question: 'Where is the Rotaract Club of Menengai based?',
      options: ['Nairobi, Kenya', 'Nakuru, Kenya', 'Kisumu, Kenya', 'Mombasa, Kenya'],
      correctIndex: 1,
      explanation: `The club serves Nakuru, Kenya, and is part of ${CLUB.district}.`,
    },
    {
      id: 'q-sponsor',
      question: 'Which club sponsors RAC Menengai?',
      options: ['Rotary Club of Nairobi', 'Rotary International', 'Rotary Club of Nakuru', 'Rotaract Club of Bahati'],
      correctIndex: 2,
      explanation: 'The Rotary Club of Nakuru is our sponsor mother club.',
    },
    {
      id: 'q-district',
      question: 'Which Rotary district is the club part of?',
      options: ['9211', '9212', '9215', '9400'],
      correctIndex: 2,
      explanation: `RAC Menengai is part of ${CLUB.district}.`,
    },
    {
      id: 'q-motto',
      question: 'What is the club’s motto?',
      options: ['Service Above Self', 'Service Above All', 'Fellowship First', 'Leaders Through Service'],
      correctIndex: 0,
      explanation: 'We share Rotary’s motto: Service Above Self.',
    },
    {
      id: 'q-meeting',
      question: 'When does the club meet?',
      options: ['Thursdays, 5:30–6:30 PM East Africa Time', 'Wednesdays, 6:00–7:00 PM', 'Fridays, 5:30–6:30 PM', 'Saturdays, 10:00–11:00 AM'],
      correctIndex: 0,
      explanation: 'Fellowship is every Thursday, 5:30–6:30 PM East Africa Time, in Nakuru.',
    },
    {
      id: 'q-guests',
      question: 'How many fellowships may a guest attend before deciding to join?',
      options: ['One', 'Two', 'Three', 'Five'],
      correctIndex: 2,
      explanation: 'Guests may attend three fellowships before deciding — no pressure, no cost.',
    },
    {
      id: 'q-flagship',
      question: 'Which of these is the club’s flagship environmental project?',
      options: ['Mother Packs', 'Adopt-a-River', 'Peace in Colour Fest', 'Street Families Outreach'],
      correctIndex: 1,
      explanation: 'Adopt-a-River covers River Njoro and River Ndarugu cleanups, water filtration and waste containers.',
    },
    {
      id: 'q-district-coverage',
      question: 'Which region does Rotary District 9215 cover?',
      options: ['Central Kenya and Tanzania', 'Uganda and Rwanda', 'West of Nairobi, Western Kenya and South Sudan', 'Coastal Kenya and Somalia'],
      correctIndex: 2,
      explanation: 'District 9215 covers West of Nairobi, Western Kenya and South Sudan.',
    },
    {
      id: 'q-path',
      question: 'What are the steps to membership at RAC Menengai?',
      options: [
        'Pay a fee and sign up online',
        'Be invited by an existing member',
        'Attend a single meeting',
        'Three fellowships, one project, this orientation course, then induction',
      ],
      correctIndex: 3,
      explanation: 'Three fellowships, one project, the orientation course, then induction.',
    },
  ] as OrientationQuestion[],
};

/* ============================= Values ============================= */
export interface Value {
  icon: IconKey;
  title: string;
  text: string;
}

export const VALUES: Value[] = [
  {
    icon: 'users',
    title: 'Community',
    text: 'We show up for the people around us — from new mothers at Bondeni to families on the streets of Nakuru.',
  },
  {
    icon: 'star',
    title: 'Leadership',
    text: 'Through mentorship, a book club and financial-literacy drives, we grow professionals and citizens of impact.',
  },
  {
    icon: 'heart',
    title: 'Service',
    text: 'Service Above Self — whether adopting a river, planting trees or championing diversity, equity and inclusion.',
  },
];

/* ============================= FAQ ============================= */
export const FAQS: Faq[] = [
  {
    q: 'When and where do you meet?',
    a: `Fellowship every Thursday, 5:30–6:30 PM in Nakuru, Kenya (${CLUB.district}). Guests are welcome — come to three meetings to get a feel for the family before joining.`,
  },
  {
    q: 'Who can join Rotaract?',
    a: 'Young professionals and students, roughly 18–30. We are deliberately diverse and inclusive: all professions, campuses and backgrounds are welcome.',
  },
  {
    q: 'How do I become a member?',
    a: 'Four steps: (1) attend three Thursday fellowships, (2) take part in one service project, (3) complete our short new member orientation course, (4) get inducted. Message us on Facebook or Instagram and we will plug you into the next fellowship.',
  },
  {
    q: 'What does the club actually do?',
    a: 'Six to eight hands-on service projects a year across health, education, environment and peacebuilding — plus weekly fellowship, a book club and professional-development sessions.',
  },
  {
    q: 'Is there a membership fee?',
    a: `Yes — ${formatKes(MEMBERSHIP.fees.subscription)} ${MEMBERSHIP.fees.subscriptionPeriod}, plus a ${formatKes(MEMBERSHIP.fees.pin)} Rotaract pin. The subscription covers Rotary International dues and running costs; service projects are funded separately by fundraising.`,
  },
  {
    q: 'How is Rotaract different from Rotary?',
    a: 'Rotaract is Rotary’s young-leaders arm for 18–30s, with its own club leadership, sponsored by a Rotary club — ours is the Rotary Club of Nakuru. Same motto, same areas of focus: Service Above Self.',
  },
];

/* ============================= Audience paths ============================= */
export const AUDIENCES: AudiencePath[] = [
  { id: 'join', title: 'I want to join', text: 'Three fellowships, one project, and you’re in. Guests are always welcome.', cta: 'Become a member', href: '/membership' },
  { id: 'partner', title: 'I want to partner', text: 'Sponsor or co-deliver a service project with an active, verified local club.', cta: 'Talk to us', href: '/contact?interest=partner-project' },
  { id: 'support', title: 'I want to support a project', text: 'Fund or donate to Adopt-a-River, mother packs, girls’ education and more.', cta: 'Support a project', href: '/contact?interest=support-project' },
];

/* ============================= Page intros ============================= */
export const PAGE_INTROS: Record<string, PageIntro> = {
  about: {
    eyebrow: 'About us',
    title: 'Young leaders, rooted in Nakuru',
    lead: 'Chartered by the Rotary Club of Nakuru and part of Rotary International’s global Rotaract family, we have spent a decade turning energy into impact.',
    description: `Who we are: a Rotaract club of young professionals and students in Nakuru, Kenya, chartered by the Rotary Club of Nakuru and part of ${CLUB.district}.`,
  },
  projects: {
    eyebrow: 'Impact in action',
    title: 'Projects that change lives',
    lead: 'Six to eight hands-on projects a year across health, education, environment and peacebuilding.',
    description: 'Verified service projects by the Rotaract Club of Menengai: Adopt-a-River, mother packs at Bondeni Maternity, girls’ education at Limuko schools and more.',
  },
  awards: {
    eyebrow: 'Recognition',
    title: 'Celebrating excellence',
    lead: 'Awards and recognition from Rotary, Nakuru County and our partners.',
    description: 'Recognition earned by the Rotaract Club of Menengai, including the DEI Champion Legacy Award 2026.',
  },
  leadership: {
    eyebrow: 'The people',
    title: 'Leadership that leads with heart',
    lead: 'Current leadership and the presidents who built the club.',
    description: 'Meet the Rotaract Club of Menengai leadership — current officers and the past presidents who built the club in Nakuru, Kenya.',
  },
  news: {
    eyebrow: 'Stay connected',
    title: 'Club updates & stories',
    lead: 'Recent service, fellowships and partnerships — told straight from the club.',
    description: 'Recent Rotaract Club of Menengai stories: service projects, fellowships and partnerships in Nakuru, Kenya.',
  },
  membership: {
    eyebrow: 'Membership',
    title: 'Join the Rotaract Club of Menengai',
    lead: 'Come as you are. Leave as a leader. Three fellowships, one project, and you’ve found your people.',
    description: 'How to join the Rotaract Club of Menengai: attend three Thursday fellowships in Nakuru, serve on a project, and get inducted. Ages 18–30 welcome.',
  },
  contact: {
    eyebrow: 'Contact & partnerships',
    title: 'Let’s talk about service',
    lead: 'Joining, partnering or supporting a project — we’d love to hear from you.',
    description: 'Contact the Rotaract Club of Menengai about membership, partnerships or supporting a project in Nakuru, Kenya.',
  },
};

/* ============================= Contact ============================= */
export const CONTACT = {
  formNote: 'We are a volunteer-run club. Fill this in and one of our officers will reach out — or message us on Facebook or Instagram for the fastest reply.',
  interests: ['Join the club', 'Partner on a project', 'Support a project', 'General question'] as const,
};

/**
 * Official contact details (docs/CONTENT_AUDIT.md). Nothing here was invented:
 * values still marked `CONFIRM_*` are placeholders that are NEVER shown to
 * visitors — the UI only reveals a channel once it holds a real value.
 */
export const contactConfig = {
  email: 'CONFIRM_OFFICIAL_EMAIL',
  phone: 'CONFIRM_OFFICIAL_PHONE',
  whatsapp: 'CONFIRM_OFFICIAL_WHATSAPP',
} as const;

/** True once a contact channel has been confirmed by the club. */
export const isContactConfirmed = (value: string): boolean => !value.startsWith('CONFIRM_');

/**
 * Holiday / special-event override. To pause the weekly schedule and show a
 * custom message everywhere, set `{ message: 'No fellowship this week — see
 * you next Thursday!' }` (leave `null` for the normal Thursday schedule).
 */
export const FELLOWSHIP_OVERRIDE: { message: string } | null = null;