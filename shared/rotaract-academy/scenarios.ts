/**
 * Scenario checks — one per chapter.
 *
 * Each check is a short, realistic situation with three plausible moves. The
 * learner picks the one they would actually make; only the defensible choice
 * completes the chapter. The feedback explains the reasoning rather than
 * awarding a mark, so a wrong answer still teaches something.
 */

export interface ScenarioOption {
  id: string;
  text: string;
}

export interface ScenarioCheck {
  id: string;
  chapterId: string;
  /** What is happening, in the learner's own frame of reference. */
  situation: string;
  prompt: string;
  options: ScenarioOption[];
  bestOptionId: string;
  /** Why the best option holds up. */
  feedback: string;
}

export const SCENARIO_CHECKS: ScenarioCheck[] = [
  {
    id: "discover-what-rotaract-is",
    chapterId: "discover",
    situation:
      "A friend asks whether Rotaract is a waiting room for Rotary, and whether there is an age at which you have to move on.",
    prompt: "What do you tell them?",
    options: [
      {
        id: "ladder",
        text: "It is a training stage — you are expected to become a Rotarian by 30.",
      },
      {
        id: "own-type",
        text: "Rotaract is its own membership type in Rotary. There is no upper age limit and no requirement to become a Rotarian.",
      },
      {
        id: "sponsor",
        text: "You can only join if a Rotary club sponsors your club.",
      },
    ],
    bestOptionId: "own-type",
    feedback:
      "Rotary removed Rotaract’s upper age limit and the mandatory sponsor requirement from 1 July 2020, and recognised Rotaract clubs as a membership type of Rotary International in 2019. A sponsor still helps where one exists, but it is not a precondition for every club. The floor remains 18.",
  },
  {
    id: "club-guest-and-dues",
    chapterId: "club",
    situation:
      "You have been to two fellowships as a guest. You want to bring a friend next week, and you have not paid any dues.",
    prompt: "What is the accurate position?",
    options: [
      {
        id: "pay-now",
        text: "Dues start from your first visit, so settle them before you bring anyone.",
      },
      {
        id: "three-visits",
        text: "Guests may attend up to three fellowships before deciding, and dues apply once you join.",
      },
      {
        id: "proposed",
        text: "You must be proposed and seconded before you can attend at all.",
      },
    ],
    bestOptionId: "three-visits",
    feedback:
      "The three-visit window is there so you can decide with real information instead of a sales pitch. Dues cover Rotary International and club running costs, and they begin with membership. Projects are funded separately by fundraising, not billed to members.",
  },
  {
    id: "integrity-partner-credit",
    chapterId: "integrity",
    situation:
      "A supplier offers goods for a club project on the condition that they are named the sole sponsor in all publicity — including an announcement that would drop a partner who has already contributed.",
    prompt: "How do you handle it?",
    options: [
      {
        id: "accept",
        text: "Accept, then quietly leave the other partner off the poster.",
      },
      {
        id: "honest",
        text: "Thank them, explain that partners are credited accurately, and ask what recognition the club can fairly offer.",
      },
      {
        id: "later",
        text: "Publish their claim now and correct it later if anyone objects.",
      },
    ],
    bestOptionId: "honest",
    feedback:
      "The Four-Way Test starts with truth. Credit that misleads donors and partners damages the club’s word, and word is most of what a service club has. Say what you can genuinely offer, and let the person decide with the real position in front of them.",
  },
  {
    id: "protocols-policy-or-custom",
    chapterId: "protocols",
    situation:
      "You are helping write a welcome pack for new members. Someone suggests a line that reads: “Members must attend wearing a jacket, stand for the club song, and pay a fine for arriving late.”",
    prompt: "What do you do with that line?",
    options: [
      {
        id: "publish",
        text: "Publish it — it is the club’s own pack, so anything the club does is worth writing down as a rule.",
      },
      {
        id: "label",
        text: "Check each item with the officers, then write it as club custom with a note that practices differ between clubs and no one is required to take part in a prayer or a toast.",
      },
      {
        id: "drop",
        text: "Drop the whole line — none of it is a Rotary requirement, so new members do not need to know about it.",
      },
    ],
    bestOptionId: "label",
    feedback:
      "Dress, songs and fines are club customs, not Rotary rules, and they differ between clubs — so publishing them as requirements is wrong. Dropping them is also wrong: a new member still needs to know what usually happens so they are not caught out. Describe what the club does, say plainly that it is custom rather than a rule, and make clear that nobody is obliged to join a prayer, a toast or a song.",
  },
  {
    id: "service-before-announcing",
    chapterId: "service",
    situation:
      "A donor has given 120 school kits for a school visit next month. Nothing has been confirmed with the school yet.",
    prompt: "What do you do first?",
    options: [
      {
        id: "announce",
        text: "Post the donation on social media, then confirm the school can host.",
      },
      {
        id: "confirm",
        text: "Confirm the school and the class list, agree who does what on the day and where leftover kits are stored — then publish.",
      },
      {
        id: "informal",
        text: "Ask each member to hand kits out informally and keep their own tally.",
      },
    ],
    bestOptionId: "confirm",
    feedback:
      "Announcing first turns a gift into a promise you cannot control. Confirm the host, the numbers, the roles and the storage, agree how you will know it worked, and only then publish. A tally kept by five different people is not a record.",
  },
  {
    id: "lead-tree-day",
    chapterId: "lead",
    situation:
      "You are leading a tree-planting day. Two volunteers disagree about where to dig, and the rest of the group has stopped working to watch.",
    prompt: "What is the most useful move?",
    options: [
      {
        id: "ignore",
        text: "Let them settle it themselves and carry on with your own planting.",
      },
      {
        id: "restate",
        text: "Pause, restate the goal and the agreed spacing, give one person the marking, and restart the group.",
      },
      {
        id: "take-over",
        text: "Take over all the digging yourself so nobody has to argue.",
      },
    ],
    bestOptionId: "restate",
    feedback:
      "A stalled group is usually missing a decision, not effort. Naming the goal, fixing the one disputed detail and giving someone clear ownership restarts the work. Taking the work back yourself solves today and teaches the group nothing.",
  },
  {
    id: "begin-first-proposal",
    chapterId: "begin",
    situation:
      "You have finished the course and want to bring a first project idea to a club meeting.",
    prompt: "What do you bring?",
    options: [
      {
        id: "commit-early",
        text: "A confirmed budget and date, agreed before speaking to anyone.",
      },
      {
        id: "one-page",
        text: "One page covering the need, the objective, the host, roles, resources, risks, how you will follow up — and the questions still open.",
      },
      {
        id: "fundraise",
        text: "A request for members to donate, with the project to be decided afterwards.",
      },
    ],
    bestOptionId: "one-page",
    feedback:
      "A one-page proposal a member can read in two minutes is the fastest way to a real decision. Naming the open questions is a strength: it shows the club where it still has to choose, and it stops a discussion turning into a guess about what was intended.",
  },
];

export function scenarioForChapter(
  chapterId: string,
): ScenarioCheck | undefined {
  return SCENARIO_CHECKS.find((check) => check.chapterId === chapterId);
}
