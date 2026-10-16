/**
 * Flash cards, one deck per chapter.
 *
 * Every card is a term the lessons themselves use, defined the way the lessons
 * define it. Nothing new is introduced here: if a card cannot be learned from
 * the chapter it sits in, it does not belong in the deck.
 */

export interface Flashcard {
  chapterId: string;
  term: string;
  definition: string;
}

export const FLASHCARDS: Flashcard[] = [
  {
    chapterId: "discover",
    term: "Rotaract",
    definition:
      "A club for people aged 18 and over who run their own service projects, with their own leadership. It is a membership type of Rotary International, not a waiting room for a Rotary club.",
  },
  {
    chapterId: "discover",
    term: "Rotary International",
    definition:
      "The global association Rotaract clubs belong to. It sets shared policy and runs programmes such as The Rotary Foundation and Rotary Youth Exchange. It does not run your club’s week.",
  },
  {
    chapterId: "discover",
    term: "Sponsor club",
    definition:
      "A Rotary or Rotaract club that supports another club, usually with mentorship and experience. It has been optional since 1 July 2020, and it does not make decisions for the club it supports.",
  },
  {
    chapterId: "discover",
    term: "Rotary District 9215",
    definition:
      "The district this club belongs to: western Kenya and South Sudan, with its own District Governor and District Rotaract Representative.",
  },
  {
    chapterId: "club",
    term: "Fellowship",
    definition:
      "The weekly meeting. Short service update, project news and time to talk. It is where a club stays a group of people rather than a task list.",
  },
  {
    chapterId: "club",
    term: "The Four-Way Test",
    definition:
      "Rotary’s ethical guide, written in 1932 by Herbert J. Taylor. Of the things we think, say or do — is it the truth, is it fair to all concerned, will it build goodwill and better friendships, will it be beneficial to all concerned?",
  },
  {
    chapterId: "club",
    term: "The Object of Rotary",
    definition:
      "Rotary’s statement of purpose: to encourage and foster the ideal of service as a basis of worthy enterprise, through fellowship and service at work, in the community and internationally.",
  },
  {
    chapterId: "club",
    term: "Sergeant-at-Arms",
    definition:
      "The officer who keeps the meeting in order — timing, order of speaking, and the club’s own meeting customs.",
  },
  {
    chapterId: "club",
    term: "Rotary moment",
    definition:
      "A short slot in the meeting for learning about Rotary or the club. It varies between clubs; some use it for a speaker, others for a project update.",
  },
  {
    chapterId: "integrity",
    term: "Goodwill",
    definition:
      "The third question of the Four-Way Test. It asks whether a decision builds trust and relationships, not only whether it is legal or profitable.",
  },
  {
    chapterId: "integrity",
    term: "Conflict of interest",
    definition:
      "When someone’s personal interest could sway a club decision. The response is to say so out loud and let the proper decision-makers decide — not to quietly step back.",
  },
  {
    chapterId: "integrity",
    term: "Safeguarding",
    definition:
      "The host’s and Rotary’s rules for working safely with children and people needing support. Follow them, report concerns promptly, and never investigate an allegation yourself.",
  },
  {
    chapterId: "service",
    term: "Avenues of Service",
    definition:
      "Five ways members contribute: club, vocational, community, international and youth service. They describe how you serve.",
  },
  {
    chapterId: "service",
    term: "Areas of focus",
    definition:
      "Seven causes a project can address, such as education, maternal and child health, and the environment. They describe what a project is for.",
  },
  {
    chapterId: "service",
    term: "Output versus outcome",
    definition:
      "An output is what you did — 120 kits handed over. An outcome is what changed, and whether the need was met. Only the second one needs follow-up to claim.",
  },
  {
    chapterId: "service",
    term: "Budget versus cash",
    definition:
      "A budget is what you plan to spend. A pledge is money promised, not money you have. Record donated goods separately from cash, and never spend a pledge.",
  },
  {
    chapterId: "lead",
    term: "Delegation",
    definition:
      "Handing over a task with the outcome, the deadline, the resources and the limits of the decision. Without those four, it is just a request.",
  },
  {
    chapterId: "lead",
    term: "Consent",
    definition:
      "Agreement to appear in a photograph or story. A person can decline without losing their place in the activity, and the answer applies every time.",
  },
  {
    chapterId: "lead",
    term: "Public image",
    definition:
      "How the club is seen: naming partners accurately, claiming only what happened, crediting participants, and keeping the brand in its correct form.",
  },
  {
    chapterId: "begin",
    term: "Needs assessment",
    definition:
      "Asking the people affected what they need before choosing an activity — what is already tried, what support helps, and who owns the work afterwards.",
  },
  {
    chapterId: "begin",
    term: "Host organisation",
    definition:
      "The school, centre or community group the work happens with. Their priorities lead; the club supports. They need to agree before anything is published.",
  },
  {
    chapterId: "begin",
    term: "Follow-up measure",
    definition:
      "What you will check after the day, when you will check it, and who writes it down. Without it, a project has an activity but no result.",
  },
  {
    chapterId: "begin",
    term: "Open question",
    definition:
      "Something the plan has not decided yet, written down plainly. Naming it is stronger than guessing, and it is what makes a proposal useful at a meeting.",
  },
];

export function flashcardsForChapter(chapterId: string): Flashcard[] {
  return FLASHCARDS.filter((card) => card.chapterId === chapterId);
}
