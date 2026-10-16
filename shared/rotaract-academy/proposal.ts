/**
 * The capstone proposal: its shape, its field list and its validation.
 *
 * Kept apart from `progress.ts` on purpose. `progress.ts` has to know which
 * scenario answers are right, so importing it into the browser would ship the
 * answer key. This module knows nothing about scenarios and is safe anywhere.
 */

export interface PracticalProposal {
  need: string;
  objective: string;
  host: string;
  roles: string;
  resources: string;
  risks: string;
  followUp: string;
  openQuestions: string;
}

export const PROPOSAL_FIELDS: {
  key: keyof PracticalProposal;
  label: string;
  hint: string;
}[] = [
  {
    key: "need",
    label: "The need",
    hint: "What did you see or hear, and who told you? A person’s exact words beat your summary of them.",
  },
  {
    key: "objective",
    label: "What changes",
    hint: "One sentence. If it cannot be observed or asked about afterwards, it is not an objective yet.",
  },
  {
    key: "host",
    label: "Who hosts and who benefits",
    hint: "Name the school, centre or community group and the person who agreed to work with the club.",
  },
  {
    key: "roles",
    label: "Who does what",
    hint: "A lead, the people on the day, and who has authority to change the plan.",
  },
  {
    key: "resources",
    label: "What it needs",
    hint: "Quantities, transport, and what is donated versus what has to be paid for.",
  },
  {
    key: "risks",
    label: "What could go wrong",
    hint: "Weather, transport, supplies, safeguarding, consent for photographs.",
  },
  {
    key: "followUp",
    label: "How you will follow up",
    hint: "What you will check afterwards, when, and who will write it down.",
  },
  {
    key: "openQuestions",
    label: "What is still undecided",
    hint: "List it plainly. Naming an open question is stronger than guessing at an answer.",
  },
];

export const PROPOSAL_MIN_LENGTH = 40;
export const PROPOSAL_MAX_LENGTH = 2000;

/** Proposal as submitted, with each field trimmed, or null if unusable. */
export function normaliseProposal(input: unknown): PracticalProposal | null {
  if (!input || typeof input !== "object") return null;
  const source = input as Record<string, unknown>;
  const proposal = {} as PracticalProposal;
  for (const { key } of PROPOSAL_FIELDS) {
    const value = source[key];
    if (typeof value !== "string") return null;
    const trimmed = value.trim();
    if (
      trimmed.length < PROPOSAL_MIN_LENGTH ||
      trimmed.length > PROPOSAL_MAX_LENGTH
    )
      return null;
    proposal[key] = trimmed;
  }
  return proposal;
}
