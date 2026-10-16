/**
 * Membership application: the shape of it, what makes it valid, and which
 * state changes are legal.
 *
 * A learner cannot approve themselves. The only path into the club runs
 * through a signed-in officer, and every recorded decision keeps who made it
 * and when. The course is a requirement the club set; it is not a
 * qualification, and completing it does not make anyone a member.
 */

export type ApplicationStatus =
  | "draft"
  | "submitted"
  | "in_review"
  | "needs_more"
  | "approved"
  | "withdrawn";

export const APPLICATION_STATUS_LABEL: Record<ApplicationStatus, string> = {
  draft: "Saved, not sent",
  submitted: "Sent to the membership team",
  in_review: "With the membership team",
  needs_more: "The club needs something from you",
  approved: "Approved by the club",
  withdrawn: "Withdrawn",
};

export interface MembershipApplication {
  id: string;
  status: ApplicationStatus;
  fullName: string;
  email: string;
  phone: string;
  profession: string;
  location: string;
  motivation: string;
  availability: string;
  courseVersion: string;
  courseScore: number;
  submittedAt: string | null;
  decidedAt: string | null;
  decidedBy: string | null;
  decisionNote: string | null;
  updatedAt: string | null;
}

export interface ApplicationDraft {
  fullName: string;
  email: string;
  phone: string;
  profession: string;
  location: string;
  motivation: string;
  availability: string;
}

export const AVAILABILITY_OPTIONS = [
  "Weekday evenings",
  "Weekends",
  "Weekday daytime",
  "It varies — I can plan ahead",
] as const;

export const APPLICATION_LIMITS = {
  fullName: { min: 2, max: 120 },
  email: { min: 5, max: 200 },
  phone: { min: 7, max: 40 },
  profession: { min: 2, max: 120 },
  location: { min: 2, max: 120 },
  motivation: { min: 80, max: 2000 },
  availability: { min: 2, max: 60 },
} as const;

export const EMPTY_DRAFT: ApplicationDraft = {
  fullName: "",
  email: "",
  phone: "",
  profession: "",
  location: "",
  motivation: "",
  availability: "",
};

function lengthError(
  value: string,
  { min, max }: { min: number; max: number },
): string | null {
  if (value.trim().length === 0) return "This is required.";
  if (value.trim().length < min) return `Use at least ${min} characters.`;
  if (value.trim().length > max)
    return `Keep this under ${max} characters.`;
  return null;
}

const EMAIL = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

export function validateDraft(
  input: Partial<ApplicationDraft>,
): Partial<Record<keyof ApplicationDraft, string>> {
  const errors: Partial<Record<keyof ApplicationDraft, string>> = {};
  for (const key of Object.keys(APPLICATION_LIMITS) as (keyof ApplicationDraft)[]) {
    const value = typeof input[key] === "string" ? (input[key] as string) : "";
    const error = lengthError(value, APPLICATION_LIMITS[key]);
    if (error) errors[key] = error;
  }
  if (!errors.email && !EMAIL.test((input.email ?? "").trim()))
    errors.email = "Use an address like name@example.com.";
  return errors;
}

export function isDraftComplete(input: Partial<ApplicationDraft>): boolean {
  return Object.keys(validateDraft(input)).length === 0;
}

/** Which status changes an officer (or the applicant) may make. */
const TRANSITIONS: Record<ApplicationStatus, ApplicationStatus[]> = {
  draft: ["submitted", "withdrawn"],
  submitted: ["in_review", "withdrawn"],
  in_review: ["needs_more", "approved", "withdrawn"],
  needs_more: ["submitted", "withdrawn"],
  approved: [],
  withdrawn: ["submitted"],
};

export function allowedTransitions(
  status: ApplicationStatus,
): ApplicationStatus[] {
  return [...TRANSITIONS[status]];
}

export function canTransition(
  from: ApplicationStatus,
  to: ApplicationStatus,
): boolean {
  return TRANSITIONS[from]?.includes(to) ?? false;
}

export function isApplicationStatus(value: unknown): value is ApplicationStatus {
  return (
    typeof value === "string" &&
    Object.prototype.hasOwnProperty.call(TRANSITIONS, value)
  );
}

/**
 * The first month, as a checklist the member and their buddy both see. These
 * are club tasks, not course tasks — none of them are checked by software.
 */
export interface InductionTask {
  id: string;
  title: string;
  detail: string;
}

export const FIRST_MONTH_CHECKLIST: InductionTask[] = [
  {
    id: "meet-buddy",
    title: "Meet the member who will answer your questions",
    detail:
      "Ask the membership director who that is, and agree how you will reach each other.",
  },
  {
    id: "dues",
    title: "Agree dues and how you will pay them",
    detail:
      "The treasurer can confirm the amount for this Rotary year and when it falls due.",
  },
  {
    id: "rotary-id",
    title: "Get your Rotary profile set up",
    detail:
      "The club will confirm what it needs from you; you do not need to do this before your first meeting.",
  },
  {
    id: "committee",
    title: "Choose one committee",
    detail:
      "Pick the work you would actually turn up for. You can move later.",
  },
  {
    id: "first-project",
    title: "Take one task on a live project",
    detail:
      "Something with a date and a person you report to. Small is fine — finished is better.",
  },
  {
    id: "bring-someone",
    title: "Bring one person to a fellowship",
    detail:
      "The club grows through members, not campaigns. Invite someone who would enjoy it.",
  },
];
