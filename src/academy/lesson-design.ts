/** Practice answers are intentionally public. They never count toward assessment results. */
interface LessonDesign {
  sections: string[];
  check: {
    question: string;
    options: string[];
    correct: number;
    explanation: string;
  };
}
const lesson = (
  sections: string[],
  question: string,
  options: string[],
  correct: number,
  explanation: string,
): LessonDesign => ({
  sections,
  check: { question, options, correct, explanation },
});

export const LESSON_DESIGN: Record<string, LessonDesign> = {
  roots: lesson(
    ["Origins", "Rotaract’s place", "Membership today", "What members do"],
    "A friend calls Rotaract a waiting list for Rotary. What would you say?",
    [
      "Everyone must leave Rotaract to join Rotary",
      "Rotaract clubs belong to Rotary International and run their own leadership and service",
      "Rotaract is only for university students",
    ],
    1,
    "Rotaract is a membership type of Rotary International. Members lead their own clubs and projects; it is not a compulsory waiting stage.",
  ),
  family: lesson(
    [
      "Clubs and partnerships",
      "Interact and RYLA",
      "Exchange opportunities",
      "The Foundation",
      "Find your starting point",
    ],
    "A 15-year-old asks where to explore service. What is a suitable first enquiry?",
    [
      "An Interact club",
      "Automatic membership in any Rotaract club",
      "A Rotary Foundation grant application",
    ],
    0,
    "Interact serves young people aged 12–18. Help them enquire through the relevant club or school; an enquiry does not promise admission.",
  ),
  structure: lesson(
    ["Officers and committees", "Who decides", "District support"],
    "Who should help you locate the club’s meeting minutes?",
    ["A visiting speaker", "The photographer", "The secretary"],
    2,
    "The secretary supports records and meeting administration. Ask them for the relevant minutes rather than relying on someone's memory.",
  ),
  membership: lesson(
    [
      "Meet Menengai",
      "Your first visit",
      "Joining steps",
      "Published costs",
      "Participation",
    ],
    "What does finishing this course mean?",
    [
      "You are automatically a club member",
      "You have completed learning; the club still confirms membership",
      "You can approve club spending",
    ],
    1,
    "The course supports orientation. Membership includes the club’s joining process and an officer’s confirmation; learning completion does not confer an office or spending authority.",
  ),
  fellowship: lesson(
    [
      "People and fellowship",
      "A useful agenda",
      "Give a useful update",
      "Decisions and follow-up",
    ],
    "Which project update helps the club act?",
    [
      "Everything is fine",
      "We will sort it out later",
      "The supplies are ready; transport is pending; we need a driver by Thursday",
    ],
    2,
    "A useful update distinguishes ready work from pending work and gives a specific request and deadline.",
  ),
  "club-leadership": lesson(
    [
      "Members lead",
      "The board’s work",
      "Build experience",
      "Take your first role",
    ],
    "You want to help lead. What is a useful first step?",
    [
      "Ask for a defined task and discuss support with the relevant lead",
      "Commit the club to a partner before speaking to anyone",
      "Wait until you know everything",
    ],
    0,
    "Leadership grows through dependable contributions, feedback and agreed responsibility. Discuss a manageable task and its boundaries with the team.",
  ),
  "protocol-ethics": lesson(
    ["The decision", "Four questions", "The Object of Rotary"],
    "A donor wants an exaggerated success claim. Which response fits the Four-Way Test?",
    [
      "Publish it because they paid",
      "Thank them, explain what the evidence supports and propose accurate wording",
      "Hide the project report",
    ],
    1,
    "Truth and fairness require accurate reporting. Protect the relationship with a respectful explanation, while declining misleading conditions if necessary.",
  ),
  "protocol-meeting": lesson(
    [
      "A question at fellowship",
      "Read the agenda",
      "Why structure helps",
      "Raise your point",
    ],
    "You need a budget question discussed. What should you do?",
    [
      "Interrupt the speaker until someone answers",
      "Treat a casual conversation as a binding vote",
      "Ask the chair for an appropriate agenda slot and state the question clearly",
    ],
    2,
    "Use the agenda and chair to give your question a fair hearing. Ask the treasurer for the figures and the secretary about the applicable decision process.",
  ),
  "protocol-introductions": lesson(
    ["Welcome a visitor", "Check names and titles", "Understand precedence"],
    "You are unsure of a visitor’s title. What is the best preparation?",
    [
      "Ask the visitor or organiser how they should be introduced",
      "Copy the title from an old poster",
      "Choose the most senior-sounding title",
    ],
    0,
    "Confirm the current name, title and preferred introduction. An old event programme may be inaccurate and does not establish the current protocol.",
  ),
  "protocol-business": lesson(
    [
      "Discussion or decision?",
      "Make agreement clear",
      "Useful minutes",
      "Conflicts of interest",
    ],
    "Which minute is useful after a meeting?",
    [
      "We talked about a tank",
      "Agreed: Amina obtains quotes by Friday; no purchase approved yet",
      "Everyone seemed happy",
    ],
    1,
    "Useful minutes capture the decision, owner, deadline and spending authority. They distinguish an agreed next step from permission to buy.",
  ),
  "protocol-ceremonies": lesson(
    ["Induction night", "Customs and ceremonies", "Grace and inclusion"],
    "You are asked for Menengai’s exact grace wording, but have not confirmed it. What should you do?",
    [
      "Present any online prayer as the compulsory wording",
      "Say that every Rotary club uses identical ceremonies",
      "Ask the club’s officers for the approved words and practice",
    ],
    2,
    "The club must confirm its own invocation and ceremony arrangements. This course does not turn an unverified local custom into a universal Rotary requirement.",
  ),
  ethics: lesson(
    [
      "Service and boundaries",
      "Use the Four-Way Test",
      "Make honest claims",
      "Plan for inclusion",
      "Handle concerns",
    ],
    "Your project venue has steps that prevent a volunteer entering. What should the team do?",
    [
      "Ask what access is needed and agree a workable arrangement",
      "Assume the volunteer cannot contribute",
      "Leave access until the morning of the event",
    ],
    0,
    "Plan inclusion with the people affected. Ask what works, agree suitable access or an alternative, and communicate the arrangement before the activity.",
  ),
  frameworks: lesson(
    ["Avenues and causes", "Menengai examples", "Explain the need"],
    "What is the difference between an avenue of service and an area of focus?",
    [
      "They are identical labels",
      "Avenues describe how we contribute; areas of focus describe causes",
      "An area-of-focus label proves a project succeeded",
    ],
    1,
    "The two frameworks help explain a contribution and its purpose. Neither classification substitutes for evidence of results.",
  ),
  planning: lesson(
    [
      "Listen first",
      "Agree an objective",
      "Plan the work",
      "Outputs and outcomes",
    ],
    "Which is an outcome rather than an output?",
    [
      "Number of volunteers attending",
      "Number of seedlings planted",
      "A later check showing that the planted trees survived",
    ],
    2,
    "Planting and attendance describe delivery. A follow-up survival check gives evidence of the change that remained after the activity.",
  ),
  delivery: lesson(
    [
      "Prepare the day",
      "Review risks",
      "Safeguarding",
      "Professional boundaries",
      "Dignity and consent",
    ],
    "At a health outreach, who should provide clinical advice?",
    [
      "Appropriately qualified professionals working within the agreed arrangements",
      "Any volunteer wearing a club shirt",
      "Whoever has the largest social-media following",
    ],
    0,
    "Volunteers can help with agreed non-clinical tasks. Clinical advice and treatment belong to appropriately qualified professionals and the authorised host arrangements.",
  ),
  finance: lesson(
    [
      "Build a real budget",
      "Receipts and approvals",
      "Account to donors",
      "Foundation grants",
    ],
    "A project needs an unplanned purchase. What should you do first?",
    [
      "Pay and promise reimbursement without asking",
      "Confirm the approval and recording process with the treasurer and project lead",
      "Hide the cost under another budget line",
    ],
    1,
    "Check who may approve the expense, how it will be funded and what evidence is needed. Keep an accurate receipt and record.",
  ),
  leadership: lesson(
    [
      "Make work clear",
      "Delegate outcomes",
      "Find a mentor",
      "Work through conflict",
      "Review and learn",
    ],
    "Which instruction gives a teammate useful responsibility?",
    [
      "Help with everything",
      "Do whatever seems right with the club’s budget",
      "Confirm transport by Friday within the approved budget, and flag any shortfall",
    ],
    2,
    "Good delegation includes an outcome, deadline, boundaries and a way to raise problems. It gives responsibility without hiding the need for support.",
  ),
  "public-image": lesson(
    [
      "Trust and public image",
      "Use approved branding",
      "Photo permissions",
      "Show the evidence",
      "Credit and corrections",
    ],
    "You want to publish a close-up of a child at a project. What comes first?",
    [
      "Follow safeguarding and consent arrangements with the host and authorised guardian",
      "Publish because the project was public",
      "Add a dramatic caption before checking permission",
    ],
    0,
    "Follow the agreed safeguarding and consent process. A useful publicity opportunity does not remove a person's right to dignity and privacy.",
  ),
  district: lesson(
    [
      "Our district",
      "The Rotary year",
      "Training and events",
      "Build partnerships",
      "International fellowship",
    ],
    "What should clubs agree before a joint project?",
    [
      "Only the group-photo location",
      "Purpose, roles, approvals, resources and follow-up",
      "That one club controls all decisions without discussion",
    ],
    1,
    "Clear shared responsibilities help partnerships work. Agree the purpose, decision process, resources, reporting and follow-up with everyone involved.",
  ),
  "next-steps": lesson(
    [
      "Choose a contribution",
      "Review your plan",
      "Start with a useful task",
      "From learning to joining",
    ],
    "Which is a useful first service plan?",
    [
      "A large promise without a host or budget",
      "A social post announcing an unapproved event",
      "An agreed need, host, objective, roles, resources, risks and follow-up",
    ],
    2,
    "A practical proposal connects a real need to agreed work, responsibilities and follow-up. Record open questions instead of inventing certainty.",
  ),
};
