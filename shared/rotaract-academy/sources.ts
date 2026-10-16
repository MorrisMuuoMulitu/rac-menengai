/**
 * Source register for policy-sensitive course content.
 *
 * Every statement in the protocols chapter that reads like a rule has to say
 * where it came from and when it was last looked at. This is the register the
 * brief asks for, in the code rather than in a separate file nobody opens.
 *
 * Two rules held throughout:
 *   1. Rotary-club rules are not applied to Rotaract clubs by default.
 *   2. A local practice is never published as a global requirement. Where the
 *      club's own detail is missing, the item stays unpublished and appears in
 *      `CLUB_CONFIRMATIONS` instead.
 */

export interface SourceRecord {
  id: string;
  title: string;
  url: string;
  /** Version or date as published, where the source states one. */
  version: string;
  /** The part relied on. */
  section: string;
  /** ISO date this was last checked. */
  reviewed: string;
  /** What it can speak to. */
  scope: string;
  /** Who is accountable for keeping it current. */
  reviewer: string;
}

export const SOURCES: SourceRecord[] = [
  {
    id: "rotary-4way",
    title: "The Four-Way Test",
    url: "https://www.rotary.org/en/about-rotary/four-way-test",
    version: "Page consulted 16 October 2026",
    section: "The test itself, its wording and its attribution to Herbert J. Taylor, 1932",
    reviewed: "2026-10-16",
    scope: "Rotary International — applies to every Rotary and Rotaract club",
    reviewer: "Club secretary",
  },
  {
    id: "rotary-object",
    title: "The Object of Rotary",
    url: "https://www.rotary.org/en/about-rotary",
    version: "Page consulted 16 October 2026",
    section: "The object statement, quoted verbatim and explained separately",
    reviewed: "2026-10-16",
    scope: "Rotary International — applies to every Rotary and Rotaract club",
    reviewer: "Club secretary",
  },
  {
    id: "rotaract-clubs",
    title: "Rotaract clubs",
    url: "https://www.rotary.org/en/get-involved/our-clubs/rotaract-clubs",
    version: "Page consulted 16 October 2026",
    section: "What Rotaract is, who may join, and its relationship to Rotary",
    reviewed: "2026-10-16",
    scope: "Rotary International — global membership guidance",
    reviewer: "Membership director",
  },
  {
    id: "rotaract-policy",
    title: "Recent Rotaract policy updates",
    url: "https://my-cms.rotary.org/en/recent-rotaract-policy-updates",
    version: "Page consulted 16 October 2026",
    section:
      "Removal of the upper age limit and the mandatory sponsor requirement from 1 July 2020; Rotaract recognised as a membership type of Rotary International",
    reviewed: "2026-10-16",
    scope: "Rotary International — global policy",
    reviewer: "Club secretary",
  },
  {
    id: "brand-center",
    title: "Rotary Brand Center",
    url: "https://brandcenter.rotary.org/",
    version: "Accessed 16 October 2026",
    section: "Logo use, club naming, and the people-of-action voice",
    reviewed: "2026-10-16",
    scope: "Rotary International — brand and trademark use",
    reviewer: "Public image director",
  },
  {
    id: "areas-of-focus",
    title: "Our causes",
    url: "https://www.rotary.org/en/our-causes",
    version: "Page consulted 16 October 2026",
    section: "The seven areas of focus",
    reviewed: "2026-10-16",
    scope: "Rotary International — programme guidance",
    reviewer: "Service projects director",
  },
];

export interface ClubConfirmation {
  id: string;
  question: string;
  /** Why it cannot be answered from an official source. */
  why: string;
  /** Who in the club can settle it. */
  owner: string;
  /** Where the answer will be published once confirmed. */
  landsIn: string;
}

/**
 * Deliberately unpublished until the club answers.
 *
 * The brief is explicit: complete the reusable interface and the general
 * content, and leave anything only the club can confirm out of the published
 * course. This list is that boundary, and it is surfaced on the officers'
 * review page so it does not quietly go stale.
 */
export const CLUB_CONFIRMATIONS: ClubConfirmation[] = [
  {
    id: "object-verbatim",
    question:
      "Confirm the current verbatim text of the Object of Rotary before we quote it.",
    why: "rotary.org was rate-limiting during this build, so the official wording could not be checked against the source. The lesson describes it in plain language instead. Quoting a remembered version would be worse than not quoting it.",
    owner: "Club secretary, against my.rotary.org",
    landsIn: "Protocols chapter, ethical foundations lesson",
  },
  {
    id: "agenda",
    question: "What is Menengai’s standing meeting agenda, in order?",
    why: "An agenda is a club decision. The lesson teaches the common shape and labels it as an example, not as ours.",
    owner: "Club secretary",
    landsIn: "Protocols chapter, meeting participation lesson",
  },
  {
    id: "grace",
    question:
      "Does Menengai open or close with a grace or invocation, and what are the words?",
    why: "It is a prayer and the wording varies by club and faith. Publishing a version would be inventing authority.",
    owner: "President",
    landsIn: "Protocols chapter, ceremonies lesson",
  },
  {
    id: "precedence",
    question:
      "Which current district guidance on precedence and introduction order should we publish?",
    why: "No current official Rotaract precedence table could be verified. Copying a district handout risks stating an old rule as a global one.",
    owner: "President with district",
    landsIn: "Protocols chapter, introductions lesson — unpublished draft",
  },
  {
    id: "customs",
    question:
      "Which of fines, toasts, songs, dress conventions and handover rituals are current Menengai practice?",
    why: "These are local customs. Listing them as requirements would be wrong, and leaving them blank tells a new member nothing.",
    owner: "Sergeant-at-arms",
    landsIn: "Protocols chapter, ceremonies lesson",
  },
  {
    id: "quorum",
    question:
      "What do Menengai’s adopted bylaws say about quorum, voting and amendments?",
    why: "Quorum and voting thresholds come from the club’s own governing documents, not from Rotary International.",
    owner: "Club secretary with treasurer",
    landsIn: "Protocols chapter, formal business lesson",
  },
  {
    id: "officers",
    question:
      "Which committee or officer should a member approach for each common need?",
    why: "Menengai’s own allocation of responsibilities, not a global rule.",
    owner: "Membership director",
    landsIn: "Find your place chapter",
  },
];
