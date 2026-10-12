import type { OrientationModule, OrientationQuestion } from "./data";
export const COURSE_INFO = {
  title: "Rotaract, from the ground up",
  lead: "Understand the movement. Find your place in Menengai. Learn to plan, lead and follow through on service.",
  version: "2026.full.v1",
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
      title: "Membership at Menengai",
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
      summary: "District 9215, collaborations and international understanding.",
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
export interface FullCourse {
  title: string;
  lead: string;
  version: string;
  requiredBeforeInduction: boolean;
  passMark: number;
  sources: { label: string; href: string }[];
  modules: (OrientationModule & { objectives: string[]; activity: string })[];
  questions: OrientationQuestion[];
}
