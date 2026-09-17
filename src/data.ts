/**
 * RAC Menengai — single source of truth for site content.
 *
 * All copy, figures and links live here so editors never touch components.
 * Image paths are relative to the Vite `base` ('./') and resolve from `public/`
 * in dev and from `dist/` after build.
 */

export interface Stat {
  value: number;
  suffix: string;
  label: string;
  note: string;
}

export interface Project {
  slug: string;
  title: string;
  tag: string;
  year: string;
  image: string;
  summary: string;
  detail: string;
  location: string;
}

export interface Award {
  title: string;
  tag: string;
  year: string;
  image: string;
}

export interface Leader {
  initials: string;
  name: string;
  role: string;
  bio: string;
  navy?: boolean;
}

export interface NewsItem {
  title: string;
  category: string;
  date: string;
  image: string;
  excerpt: string;
}

/**
 * Resolves a club photo through Vite's bundler (hashed, cache-busted,
 * honouring the configured `base`). Source files live in `/assets`.
 */
const img = (file: string) => new URL(`../assets/images/menengai/${file}`, import.meta.url).href;

export const NAV_LINKS = [
  { href: '#about', label: 'About' },
  { href: '#projects', label: 'Projects' },
  { href: '#awards', label: 'Awards' },
  { href: '#leadership', label: 'Leadership' },
  { href: '#news', label: 'News' },
  { href: '#faq', label: 'FAQ' },
] as const;

export const SOCIALS = {
  facebook: 'https://www.facebook.com/RCmenengai/',
  instagram: 'https://www.instagram.com/racmenengai/',
  x: 'https://x.com/RcMenengai',
  linkedin: 'https://www.linkedin.com/in/rac-menengai-91b5591b3',
  threads: 'https://www.threads.com/@racmenengai',
} as const;

export const HERO_IMAGES = {
  background: img('banner.jpg'),
  logo: img('logo-transparent.png'),
};

export const ABOUT_IMAGES = {
  tall: img('adopt-river.jpg'),
  wide: img('cleanup-campaign.jpg'),
};

export const SIGNATURE_IMAGE = img('river-cleanup.jpg');

export const STATS: Stat[] = [
  { value: 10, suffix: '+', label: 'Years of Service', note: 'Chartered by the Rotary Club of Nakuru' },
  { value: 405, suffix: '', label: 'Girls Empowered', note: 'Sanitary towels across Limuko schools' },
  { value: 2, suffix: '', label: 'Rivers Adopted', note: 'Njoro & Ndarugu cleanups' },
  { value: 150, suffix: '+', label: 'Mother Packs', note: 'For new mothers at Bondeni Maternity' },
];

export const PILLARS = [
  {
    icon: 'users',
    title: 'Community',
    text: 'We show up for the people around us — from new mothers at Bondeni to families on the streets of Nakuru.',
  },
  {
    icon: 'star',
    title: 'Leadership',
    text: 'Through mentorship, book clubs and financial-literacy drives, we grow professionals and citizens of impact.',
    navy: true,
  },
  {
    icon: 'heart',
    title: 'Service',
    text: 'Service Above Self — whether adopting a river, planting trees or championing diversity, equity and inclusion.',
  },
] as const;

export const FOCUS_AREAS = [
  { icon: 'leaf', label: 'Environment' },
  { icon: 'heartbeat', label: 'Maternal & Child Health' },
  { icon: 'book', label: 'Basic Education & Literacy' },
  { icon: 'female', label: "Girls' Education" },
  { icon: 'water', label: 'Water & Sanitation' },
  { icon: 'chart', label: 'Community Economic Development' },
  { icon: 'shield', label: 'Disease Prevention' },
  { icon: 'dove', label: 'Peacebuilding & Conflict Prevention' },
] as const;

export const PROJECTS: Project[] = [
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
  },
  {
    slug: 'adopt-a-river',
    title: 'Adopt-a-River Launch',
    tag: 'Environment',
    year: '2022',
    image: img('adopt-river.jpg'),
    summary: 'Water filter installation, mobilisation and a River Njoro cleanup at Mwariki Bridge, Barut.',
    detail:
      'Our flagship environmental project: a water filtration set for Barut residents, door-to-door mobilisation against single-use plastic, a full cleanup of River Njoro at Mwariki Bridge and permanent waste-disposal points to keep it clean.',
    location: 'Mwariki Bridge, Barut — River Njoro',
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
  },
];

export const PROJECT_TAGS = ['All', ...Array.from(new Set(PROJECTS.map((p) => p.tag)))] as string[];

export const SIGNATURE_STEPS = [
  'Water filtration system installed for residents of Barut',
  'River Njoro & Ndarugu cleanups with 20+ youth volunteers',
  'Community sensitisation on single-use plastic',
  'Waste-disposal containers for lasting cleanliness',
] as const;

export const AWARDS: Award[] = [
  { title: 'DEI Champion — Legacy Award 2026', tag: 'Award', year: '2026 · District 9212', image: img('welcome.jpg') },
  { title: 'Ten Years of Service', tag: 'Milestone', year: '2025', image: img('banner.jpg') },
  { title: 'City Clean-up Campaign', tag: 'Recognition', year: '2024 · Nakuru County', image: img('cleanup-campaign.jpg') },
  { title: 'Adopt-a-River Launch', tag: 'Flagship', year: '2022', image: img('adopt-river.jpg') },
  { title: 'DRR Meet & Greet, Hyrax Hill', tag: 'Fellowship', year: '2023', image: img('river-cleanup.jpg') },
];

export const LEADERS: Leader[] = [
  {
    initials: 'JW',
    name: 'Joyce Wanjiku Nguru',
    role: 'President · 2026/27',
    bio: 'Environmental champion leading a year of mother packs, girls’ education and fellowship.',
  },
  {
    initials: 'JB',
    name: 'John Brodrick',
    role: 'Charter President',
    bio: 'Founder president who guided the club’s charter under the Rotary Club of Nakuru.',
    navy: true,
  },
  {
    initials: 'PK',
    name: 'Phylis Kanja',
    role: 'DEI Director · 2025/26',
    bio: 'Champion of diversity, equity and inclusion — District 9212 DEI Champion 2026.',
  },
];

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

export const PARTNERS = [
  'Rotary Club of Nakuru',
  'Rotary District 9212',
  'Nakuru County Government',
  'Kenya Wildlife Service',
  'NEMA Kenya',
  'Kenya Red Cross',
  'Bondeni Maternity',
  'Limuko Schools',
] as const;

export const FAQS = [
  {
    q: 'When and where do you meet?',
    a: 'Fellowship every Thursday, 5:30–6:30 PM in Nakuru, Kenya (Rotary District 9212). Guests are welcome — come to three meetings to get a feel for the family before joining.',
  },
  {
    q: 'Who can join Rotaract?',
    a: 'Young professionals and students aged 18–30. We are deliberately diverse and inclusive: all professions, campuses and backgrounds are welcome.',
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
    a: 'Rotaract is Rotary’s young-leaders arm (18–30) with its own club leadership, sponsored by a Rotary club — ours is the Rotary Club of Nakuru. Same motto, same areas of focus: Service Above Self.',
  },
] as const;

export const TICKER_ITEMS = [
  'Adopt-a-River',
  'Mother Packs',
  "Girls' Education",
  'Tree Planting',
  'Peace in Colour Fest',
  'Legacy Award 2026',
  'Street Families',
] as const;
