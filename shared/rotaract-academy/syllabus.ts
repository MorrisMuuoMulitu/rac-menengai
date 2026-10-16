export const COURSE_INFO = {
  title: "Rotaract, from the ground up",
  lead: "Understand the movement. Find your place in your club. Learn to plan, lead and follow through on service.",
  version: "2026.academy.v2",
  minutes: 85,
  questionCount: 28,
  passMark: 23,
  lessons: [
    {
      id: "roots",
      title: "The story of Rotary and Rotaract",
      summary: "From the first clubs to Rotaract’s place in Rotary today.",
      minutes: 5,
    },
    {
      id: "family",
      title: "The Rotary family",
      summary: "Rotary, Rotaract, Interact, RYLA and other ways to serve.",
      minutes: 5,
    },
    {
      id: "structure",
      title: "How the club is run",
      summary: "Officers, committees, districts and member responsibilities.",
      minutes: 6,
    },
    {
      id: "membership",
      title: "Membership in your club",
      summary: "Eligibility, visits, dues, orientation and induction.",
      minutes: 5,
    },
    {
      id: "ethics",
      title: "Service, ethics and belonging",
      summary: "The Four-Way Test, inclusion and everyday judgement.",
      minutes: 6,
    },
    {
      id: "fellowship",
      title: "Fellowship and meeting practice",
      summary: "Arriving, contributing, recording decisions and following up.",
      minutes: 5,
    },
    {
      id: "frameworks",
      title: "Five avenues, seven causes",
      summary: "How we serve and what a project addresses.",
      minutes: 6,
    },
    {
      id: "planning",
      title: "Listen, assess and plan",
      summary: "Community needs, objectives, budgets and useful measures.",
      minutes: 7,
    },
    {
      id: "delivery",
      title: "Deliver service with care",
      summary: "Roles, risk, safeguarding and a responsible project day.",
      minutes: 7,
    },
    {
      id: "finance",
      title: "Money and accountability",
      summary: "Fundraising, records, partners and Rotary Foundation grants.",
      minutes: 7,
    },
    {
      id: "leadership",
      title: "Lead a team and grow your skills",
      summary: "Delegation, mentoring, conflict and professional development.",
      minutes: 6,
    },
    {
      id: "public-image",
      title: "Tell the story responsibly",
      summary: "Branding, consent, evidence and respectful communication.",
      minutes: 6,
    },
    {
      id: "district",
      title: "Beyond your own club",
      summary: "Your district, collaborations and international understanding.",
      minutes: 6,
    },
    {
      id: "next-steps",
      title: "Your first service plan",
      summary: "Bring the lessons together and prepare a practical next step.",
      minutes: 8,
    },
  ],
} as const;

export const CHAPTERS = [
  {
    id: "discover",
    title: "Discover Rotaract",
    description: "A global movement with room for your ideas.",
    lessons: ["roots", "family"],
  },
  {
    id: "club",
    title: "Inside your club",
    description: "People, meetings and what membership asks of you.",
    lessons: ["structure", "membership", "fellowship"],
  },
  {
    id: "integrity",
    title: "Serve with integrity",
    description: "Make good decisions and help people feel they belong.",
    lessons: ["ethics"],
  },
  {
    id: "service",
    title: "Make service happen",
    description: "Listen first. Plan carefully. Follow through.",
    lessons: ["frameworks", "planning", "delivery", "finance"],
  },
  {
    id: "lead",
    title: "Grow as a leader",
    description: "Work with people and tell the story responsibly.",
    lessons: ["leadership", "public-image", "district"],
  },
  {
    id: "begin",
    title: "Your first contribution",
    description: "Turn what you have learned into a practical proposal.",
    lessons: ["next-steps"],
  },
] as const;
