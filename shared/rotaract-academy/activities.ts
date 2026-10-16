/**
 * Ordering activities.
 *
 * Drag-and-drop is unusable on a phone and awkward with a keyboard, so these
 * are built with move-up and move-down buttons instead: a learner on a train
 * with one thumb, or with a screen reader, gets the same activity as anyone
 * else. Each one is checked against the order the lesson itself teaches.
 */

export interface OrderingActivity {
  /** The lesson this belongs to. */
  lessonId: string;
  prompt: string;
  /** Shown after a correct answer. */
  feedback: string;
  /** In the correct order. Shuffled for display at runtime. */
  items: string[];
}

export const ORDERING_ACTIVITIES: OrderingActivity[] = [
  {
    lessonId: "protocol-meeting",
    prompt: "Put the parts of a club meeting back in order.",
    feedback:
      "The reports sit before the programme, and the meeting closes the way it opened — with the Four-Way Test. Getting the shape right is what gets a room of volunteers through its business in an hour.",
    items: [
      "Call to order",
      "Welcome and apologies",
      "The Four-Way Test",
      "Reports: secretary, treasurer, project leads",
      "Programme or Rotary moment",
      "Announcements and next steps",
      "Close",
    ],
  },
  {
    lessonId: "planning",
    prompt: "Put a project plan in the order you would actually work through it.",
    feedback:
      "Listening comes before deciding, and the follow-up is agreed on the day the plan is written — not bolted on afterwards, when nobody is left to check.",
    items: [
      "Ask the people affected what they need",
      "Agree the objective with the host",
      "Write the plan: roles, resources, risks",
      "Get the approvals the club requires",
      "Run the project day",
      "Check what changed, and write it down",
    ],
  },
  {
    lessonId: "delivery",
    prompt: "Put the volunteer briefing in order.",
    feedback:
      "Everyone should know the task, the boundaries and who to raise a concern with before the work starts, not once something has already gone wrong.",
    items: [
      "Confirm the host has given permission",
      "Name the person leading on the day",
      "Explain each volunteer’s task",
      "Set the boundaries: safeguarding, photographs, equipment",
      "Say who to contact if something goes wrong",
    ],
  },
];

export function orderingForLesson(
  lessonId: string,
): OrderingActivity | undefined {
  return ORDERING_ACTIVITIES.find((item) => item.lessonId === lessonId);
}

/**
 * A stable shuffle, so the activity does not rearrange itself between renders
 * or between two people comparing answers.
 */
export function shuffled<T>(items: readonly T[], seed: string): T[] {
  let state = 0;
  for (let index = 0; index < seed.length; index++)
    state = (state * 31 + seed.charCodeAt(index)) % 2147483647;
  const out = [...items];
  for (let index = out.length - 1; index > 0; index--) {
    state = (state * 1103515245 + 12345) % 2147483648;
    const swap = Math.abs(state) % (index + 1);
    [out[index], out[swap]] = [out[swap], out[index]];
  }
  /* Never hand back the answer. */
  if (out.every((item, index) => item === items[index]) && out.length > 1)
    [out[0], out[1]] = [out[1], out[0]];
  return out;
}
