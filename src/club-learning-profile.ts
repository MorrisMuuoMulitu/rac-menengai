/*
 * Extensions are written out because this module is also pulled into the
 * serverless functions, where Node resolves ESM strictly and `./data` does not
 * find `data.ts`.
 */
import type { ClubLearningProfile } from "../shared/rotaract-academy/types.js";
import { CLUB, LEADERS, MEMBERSHIP, formatKes } from "./data.js";

/**
 * The current executive, named from the club's own Leadership data.
 *
 * Deliberately one sentence rather than a table: a course that reproduces a
 * full board list goes out of date every July and nobody notices. The
 * Leadership page is the source of truth; this points at it.
 */
function leadershipLine(): string {
  const board = LEADERS.filter((leader) => leader.kind === "board");
  const executive = board.filter((leader) => leader.group === "executive");
  const president = executive.find(
    (leader) => (leader.standing ?? leader.portfolio) === "President",
  );
  const term = president?.term ?? "the current Rotary year";
  if (!president)
    return `The club’s current board and ministries are listed on the Leadership page, with the Rotary year they serve.`;
  return `For ${term} that is ${president.name}, and the rest of the board is on the Leadership page.`;
}

export const MENENGAI_LEARNING_PROFILE: ClubLearningProfile = {
  id: "menengai",
  name: CLUB.name,
  shortName: "Menengai",
  city: CLUB.city,
  district: CLUB.district,
  districtDescription: "West of Nairobi, western Kenya and South Sudan",
  districtUrl: "https://rotary9215.org/",
  sponsor: CLUB.sponsor,
  meeting: "Thursday, 5:30–6:30 PM, Nakuru Athletic Club",
  venue: "Nakuru Athletic Club",
  guestPolicy:
    "Guests may attend three fellowships before deciding, without paying membership dues.",
  joining:
    "Attend three fellowships and participate in one service project. Complete orientation, then meet the membership team for the next steps.",
  fees: `Published membership costs are ${formatKes(MEMBERSHIP.fees.subscription)} annually and ${formatKes(MEMBERSHIP.fees.pin)} for a Rotaract pin. Service projects are funded separately by fundraising.`,
  examples:
    "Mother packs at Bondeni and Kabatini relate to maternal and child health. Art at Pangani Special School relates to education. Mazingira Day planting relates to the environment.",
  evidence:
    "Menengai’s dated records show activities at Bondeni, Kabatini and Pangani. They do not establish health improvements, educational progress or tree survival without follow-up.",
  partnership:
    "Menengai’s Kabatini mother-pack activity was recorded with the Rotaract Club of Bahati.",
  leadershipLine: leadershipLine(),
};
