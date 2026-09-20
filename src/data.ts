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
  district: 'Rotary District 9212',
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

export const TRUST_BAR = [
  { label: 'Est. 2016', note: 'Sponsored by ' + CLUB.sponsor },
  { label: CLUB.district, note: 'Nakuru · Kenya' },
] as const;

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
  { name: 'Rotary District 9212' },
  { name: 'Nakuru County Government' },
  { name: 'Kenya Wildlife Service' },
  { name: 'NEMA Kenya' },
  { name: 'Kenya Red Cross' },
  { name: 'Bondeni Maternity' },
  { name: 'Limuko Schools' },
];

/* ============================= Membership ============================= */
export const JOIN_STEPS: JoinStep[] = [
  { title: 'Come to fellowship', text: 'Attend three Thursday fellowships, 5:30–6:30 PM. Come as you are — guests are family.' },
  { title: 'Serve on a project', text: 'Join one hands-on project — a cleanup, a donation drive, a school visit. Feel the work.' },
  { title: 'Get inducted', text: 'Take the oath, get your pin, and start leading. Mentorship from day one.' },
];

export const MEMBERSHIP = {
  whoCanJoin: 'Young professionals and students, roughly 18–30, in and around Nakuru. We are deliberately diverse and inclusive: all professions, campuses and backgrounds welcome.',
  whatHappens:
    'Fellowship is a relaxed hour: a short look at the week’s service, a project update, and time to get to know each other. Through the year we also run our book club and professional-development sessions.',
  feesNote: 'A modest annual subscription set by the club covers Rotary International dues and running costs — ask us for the current year’s figure. Service projects are funded separately by fundraising.', // CONFIRM fee figure
  guestNote: 'Guests may attend three fellowships before deciding — no pressure, no cost.',
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
    a: 'Fellowship every Thursday, 5:30–6:30 PM in Nakuru, Kenya (Rotary District 9212). Guests are welcome — come to three meetings to get a feel for the family before joining.',
  },
  {
    q: 'Who can join Rotaract?',
    a: 'Young professionals and students, roughly 18–30. We are deliberately diverse and inclusive: all professions, campuses and backgrounds are welcome.',
  },
  {
    q: 'How do I become a member?',
    a: 'Three steps: (1) attend three Thursday fellowships, (2) take part in one service project, (3) get inducted. Message us on Facebook or Instagram and we will plug you into the next fellowship.',
  },
  {
    q: 'What does the club actually do?',
    a: 'Six to eight hands-on service projects a year across health, education, environment and peacebuilding — plus weekly fellowship, a book club and professional-development sessions.',
  },
  {
    q: 'Is there a membership fee?',
    a: 'Yes — a modest annual subscription set by the club covers Rotary International dues and running costs. Ask us on socials for the current year’s figure; service projects are funded separately by fundraising.',
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
    description: 'Who we are: a Rotaract club of young professionals and students in Nakuru, Kenya, chartered by the Rotary Club of Nakuru and part of Rotary District 9212.',
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
    lead: 'Awards and recognition from Rotary District 9212, Nakuru County and our partners.',
    description: 'Recognition earned by the Rotaract Club of Menengai, including the DEI Champion Legacy Award 2026 from Rotary District 9212.',
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