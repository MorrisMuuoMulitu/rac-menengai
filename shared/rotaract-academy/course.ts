import type {
  ClubLearningProfile,
  FullCourse,
  OrientationBlock,
} from "./types.js";
import { COURSE_INFO } from "./syllabus.js";
import { CURRICULUM } from "./curriculum.js";
import { SCENARIO_CHECKS } from "./scenarios.js";
import { COURSE_VIDEOS } from "./videos.js";
export function createCourse(profile: ClubLearningProfile): FullCourse {
  const p = (text: string): OrientationBlock => ({ kind: "p", text });
  const list = (...items: string[]): OrientationBlock => ({
    kind: "list",
    items,
  });
  const note = (text: string): OrientationBlock => ({ kind: "note", text });
  const lessons: {
    objectives: string[];
    blocks: OrientationBlock[];
    activity: string;
  }[] = [
    {
      objectives: [
        "Explain the origins of Rotary and Rotaract.",
        "Distinguish global policy from a club’s own practice.",
      ],
      blocks: [
        p(
          "Rotary began in Chicago on 23 February 1905, when Paul Harris brought together professionals from different backgrounds. Friendship and an exchange of ideas grew into organised service. Rotaract’s first club was certified on 13 March 1968 at the University of North Carolina at Charlotte.",
        ),
        p(
          "In 2019, Rotary recognised Rotaract clubs as a membership type of Rotary International. Rotaract is therefore part of Rotary’s membership, with its own club culture and leadership. It is more than a temporary stage before someone becomes a Rotarian.",
        ),
        p(
          `From 1 July 2020, Rotary removed Rotaract’s upper age limit and mandatory sponsor requirement. The minimum age remains 18; individual clubs may set an upper limit in their bylaws. A sponsor can be a Rotary or Rotaract club. ${profile.shortName}’s sponsor is the ${profile.sponsor}.`,
        ),
        p(
          "Membership involves practical service, professional development and fellowship. Those elements reinforce one another: a member can learn a skill while organising a school visit and build friendships while working on it. There is no promise of employment, financial support or instant leadership status.",
        ),
        note(
          `Use Rotary’s current policies for global requirements and ask a ${profile.shortName} officer about local procedures. Old material may still describe an age cap of 30 or universal sponsorship; those statements need updating.`,
        ),
      ],
      activity: `Explain Rotaract to a friend in three sentences: who can take part, who leads the club, and what members do. Separate the global rules from ${profile.shortName}’s own arrangements.`,
    },
    {
      objectives: [
        "Recognise the main parts of the Rotary family.",
        "Choose a suitable programme without treating it as a compulsory ladder.",
      ],
      blocks: [
        p(
          "Rotary clubs and Rotaract clubs both belong to Rotary International. Rotaract members organise their own clubs and projects. Relationships with other clubs are partnerships: mentorship and shared experience help, while members retain responsibility for their own work.",
        ),
        p(
          "Interact brings together young people aged 12–18 through service and leadership. RYLA, Rotary Youth Leadership Awards, provides leadership learning through locally organised programmes. They are different opportunities, not requirements someone must complete before joining Rotaract.",
        ),
        p(
          "Rotary Youth Exchange develops understanding across cultures. Rotary Community Corps are groups of non-Rotary members who work with clubs on local service. Peace Fellowships support advanced study and professional development in peacebuilding. Availability and selection depend on each programme’s current requirements.",
        ),
        p(
          "The Rotary Foundation supports Rotary’s charitable work, including grants and programmes. It is distinct from Rotary International’s club association role. A club’s own subscription, project fundraising and contributions to the Foundation are different financial streams.",
        ),
        p(
          "You can start by attending a club without having participated in any other Rotary programme. When an opportunity interests you, confirm who organises it, the dates, costs, eligibility and safeguarding arrangements. Do not treat a social-media invitation as an automatic acceptance.",
        ),
      ],
      activity:
        "Match three people to suitable first enquiries: a 15-year-old interested in service, a new adult member wanting leadership training, and a community group wanting to work with a club. Explain why the enquiry is a fit without promising admission.",
    },
    {
      objectives: [
        "Understand what officers and committees do.",
        "Recognise where decisions and accountability belong.",
      ],
      blocks: [
        p(
          "Members give a club its direction. Officers and committees organise its work, keep decisions moving and report back. A good structure makes responsibility visible; it should not make ordinary members feel unable to ask questions.",
        ),
        list(
          "President: guides the club’s work and chairs meetings.",
          "Secretary: supports records, correspondence and meeting administration.",
          "Treasurer: maintains financial records and reports on money received and spent.",
          "Service and committee leads: organise agreed work and keep the club informed.",
          "Membership and public-image teams: welcome people and communicate the club’s work.",
        ),
        p(
          `The board reviews plans, finances and responsibilities. Exact titles and decision procedures depend on the club’s constitution, bylaws and current team. ${profile.shortName}’s Leadership page identifies its officers; a title on an old poster is not proof that someone currently holds that role.`,
        ),
        p(
          "Districts connect clubs through support, training and joint work. A District Governor serves the Rotary district; a District Rotaract Representative helps coordinate Rotaract clubs. Rotary International provides the wider association and policies. These are different responsibilities, not interchangeable titles.",
        ),
        note(
          "Before spending, booking a venue, committing the club to a partner or publishing an official announcement, ask who has authority to approve it. Record decisions and tell affected teammates what was agreed.",
        ),
      ],
      activity:
        "Map a proposed school visit: who develops the plan, who approves spending, who keeps records, who briefs volunteers and who reports back? Use roles until an officer confirms the actual people.",
    },
    {
      objectives: [
        `Describe ${profile.shortName}’s published membership arrangements.`,
        "Distinguish visiting, learning and induction.",
      ],
      blocks: [
        p(
          `${profile.name} is based in ${profile.city}, part of ${profile.district} and sponsored by ${profile.sponsor}. Adults aged 18 and over from different professions, campuses and backgrounds are welcome. Being a student or having a particular qualification is not a condition for a first visit.`,
        ),
        p(
          `${profile.meeting}. Confirm the week’s arrangements before travelling. ${profile.guestPolicy} Introduce yourself as a guest and ask an officer about anything unclear.`,
        ),
        p(
          `${profile.joining} Orientation introduces how the club works. Officers confirm induction; passing a course does not itself make someone a member.`,
        ),
        p(
          `${profile.fees} Ask the treasurer about payment timing, receipts and any questions before paying.`,
        ),
        p(
          "Membership asks for time, reliable communication and participation. Project days have their own schedules and roles. If a work, campus, financial or access constraint affects you, discuss it with the membership team rather than assuming the club expects something it has not stated.",
        ),
        note(
          "The passcode gives access to learning material. Passing this assessment produces a personal learning record; it does not grant club membership or a Rotary qualification.",
        ),
      ],
      activity:
        "Prepare three questions for the membership team: one about participation, one about payment arrangements and one about induction. Add a realistic weekly time commitment of your own.",
    },
    {
      objectives: [
        "Contribute effectively to fellowship.",
        "Understand meeting decisions and follow-through.",
      ],
      blocks: [
        p(
          `Fellowship makes room for people as well as plans. ${profile.shortName} describes a relaxed weekly hour with service updates and time to get to know each other. A guest can listen, introduce themselves and ask questions without already knowing Rotary terminology.`,
        ),
        p(
          "A useful meeting has a purpose and an agenda: welcome people, review outstanding actions, hear reports, discuss decisions and confirm next steps. Speakers, learning or social time may be included. This is a practical model, not a claim that every club follows the same order.",
        ),
        p(
          "When contributing, state the issue, the decision needed and any relevant facts. A project update should distinguish completed work from pending work. Instead of saying ‘everything is fine’, say what is ready, what remains and where help is needed.",
        ),
        p(
          "A decision needs an owner and a deadline. Notes should capture what was agreed, responsibility and any approved cost. Formal motions, voting, elections and quorum depend on the club’s governing documents. Ask the secretary for the applicable process before treating a show of hands as a binding decision.",
        ),
        note(
          `Prayer, songs, dress, fines and closing traditions vary between clubs. This course does not declare them universal Rotary requirements. Ask about ${profile.shortName}’s current practice and raise any concern respectfully.`,
        ),
      ],
      activity:
        "Turn ‘We should do a school visit soon’ into a useful action note: the next step, responsible role, due date and decision that still needs approval.",
    },
    {
      objectives: [
        "Describe the parts of a club meeting and why each one exists.",
        "Recite the Four-Way Test and say where it fits in the order.",
        "Tell your club’s customs apart from Rotary’s own.",
      ],
      blocks: [
        p(
          "Every club runs its meeting a little differently, but the shape is broadly the same, and the shape is the point: it gets a room of volunteers through its business in about an hour and sends everyone home knowing what happens next.",
        ),
        list(
          "Call to order — the president opens the meeting and confirms it can proceed.",
          "Welcome and apologies — who is present, who sent apologies, and any guests.",
          "The Four-Way Test — often recited together, at the opening or the close.",
          "Invocation or grace — a short reflection. The words vary by club and by faith.",
          "Reports — the secretary, the treasurer, and any project lead with something to report.",
          "Programme or Rotary moment — a speaker, a learning slot, or a project update.",
          "Announcements and next steps — what happens between now and the next meeting.",
          "Close — the president closes, and the Four-Way Test is frequently said again.",
        ),
        p(
          "The Four-Way Test is Rotary’s own ethical guide. Herbert J. Taylor wrote it in 1932 and Rotary International adopted it in 1943. Many clubs recite it aloud. Of the things we think, say or do:",
        ),
        list(
          "Is it the TRUTH?",
          "Is it FAIR to all concerned?",
          "Will it build GOODWILL and BETTER FRIENDSHIPS?",
          "Will it be BENEFICIAL to all concerned?",
        ),
        p(
          "Its companion is the Object of Rotary: to encourage and foster the ideal of service as a basis of worthy enterprise, through fellowship, and through service in business and the community and across borders.",
        ),
        note(
          "The grace or invocation is a prayer, and clubs use different words — some use none. This course does not print a version and call it the Rotary one. Ask your club which words it uses, and whether they open the meeting or close it.",
        ),
        p(
          "Not every custom travels. Prayer, songs, fines, dress and the closing ritual differ from club to club and country to country. Treat those as your club’s practice rather than a Rotary requirement, and ask before assuming.",
        ),
        p(
          "Two things do travel. The Four-Way Test belongs to Rotary everywhere, and so does the reason for the order: a meeting with a shape gets its business done and leaves people wanting to return.",
        ),
        note(
          "Minutes are the record of what was decided, not a transcript. A decision needs an owner and a deadline, and the secretary writes both down.",
        ),
      ],
      activity:
        "At your next meeting, follow the order above and note where your club diverges — then ask the president or secretary why. Afterwards, write the four questions of the Four-Way Test from memory and check yourself against the list.",
    },
    {
      objectives: [
        "Use the Four-Way Test in a real decision.",
        "Make inclusion and respectful conduct practical.",
      ],
      blocks: [
        p(
          "Service Above Self is a commitment to consider other people, not a request to ignore your own safety or boundaries. Integrity, fellowship, diversity, leadership and service should be visible in the way people are treated and decisions are made.",
        ),
        p(
          "The Four-Way Test asks us to consider truth, fairness, goodwill and benefit to everyone concerned. Use it as a decision aid: is a claim supported, does a decision disadvantage someone without good reason, and does the approach build trust? It does not replace the law, safeguarding procedures or professional standards.",
        ),
        p(
          "Suppose a project announcement promises that every seedling will survive, but no follow-up has happened. Truth requires a narrower claim: describe planting, then plan a survival check. Fairness means the host and volunteers understand responsibilities. Goodwill means acknowledging their work; benefit means asking whether the activity meets the community’s need.",
        ),
        p(
          "Inclusion involves concrete choices: an accessible venue, understandable language, a chance to speak without being interrupted, and tasks suitable for different abilities. Ask what people need instead of guessing. Do not use a person’s disability, financial situation or background as material for jokes or publicity.",
        ),
        p(
          "Handle disagreements with respectful questions and specific examples. Address harmful conduct through the designated club or district process rather than a public pile-on. A person raising a concern should not have to sacrifice privacy to be heard.",
        ),
      ],
      activity:
        "A sponsor offers supplies but wants an exaggerated success claim in return. Write a response that thanks them, corrects the claim and protects the club’s integrity. Apply each part of the Four-Way Test.",
    },
    {
      objectives: [
        "Name the five avenues and seven areas of focus.",
        `Apply both frameworks to a ${profile.shortName} example.`,
      ],
      blocks: [
        p(
          "The five avenues of service describe how people contribute. The seven areas of focus describe the causes Rotary addresses. A project can fit more than one cause; the classification helps explain its purpose, but it is not evidence of its impact.",
        ),
        list(
          "Club service: a welcoming, effective club.",
          "Vocational service: skills and professional integrity used for others.",
          "Community service: meeting needs where people live.",
          "International service: service and understanding across borders.",
          "Youth service: opportunities for young people to learn, lead and serve.",
        ),
        list(
          "Peacebuilding and conflict prevention.",
          "Disease prevention and treatment.",
          "Water, sanitation and hygiene.",
          "Maternal and child health.",
          "Basic education and literacy.",
          "Community economic development.",
          "Environment.",
        ),
        p(
          `${profile.examples} Local volunteer work is community service; using a professional skill may also be vocational service.`,
        ),
        p(
          "Choose the cause based on the need and the work, rather than adding every focus-area badge to an announcement. A school location alone does not make every activity an education project; explain the connection and what participants actually do.",
        ),
      ],
      activity: `Choose a recorded ${profile.shortName} event. Describe its avenue, its main cause and one outcome you would need follow-up evidence to claim.`,
    },
    {
      objectives: [
        "Translate a community need into a workable plan.",
        "Distinguish activities, outputs and outcomes.",
      ],
      blocks: [
        p(
          "Start with the people affected. Ask what is needed, what they already do, what has been tried and what support would be useful. A host organisation’s priorities may differ from a visiting club’s favourite project. Listening avoids spending time and money on something nobody can use.",
        ),
        p(
          "State the need and agree on a specific objective. For a planting activity, clarify suitable plants, the site, permission and who will care for them afterward. For a supplies distribution, confirm useful items and how the host will coordinate it. Do not assume the same package or approach works everywhere.",
        ),
        p(
          "A short plan should identify the host, date, responsible lead, tasks, budget, resources, access arrangements and risks. Include the approvals needed and a fallback if weather, transport or supplies change. Partners should know what they are being asked to do before their names appear publicly.",
        ),
        p(
          "An activity is what you do. An output is an immediate count, such as packs delivered. An outcome is a change, such as whether the intended need was met. Choose a useful measure, when it will be checked and who will check it. Never invent a baseline or a count simply to make a report look complete.",
        ),
        note(
          "Write the follow-up into the first plan. Community ownership and a realistic maintenance arrangement matter more than a dramatic launch photograph.",
        ),
      ],
      activity:
        "Draft a one-page plan with seven fields: need, objective, host, roles, resources, risk and follow-up measure. Leave unknown details as questions for discussion, not assumptions.",
    },
    {
      objectives: [
        "Prepare a clear volunteer briefing.",
        "Protect participants’ safety, dignity and privacy.",
      ],
      blocks: [
        p(
          "Before delivery, confirm the host’s permission, who is leading, the timetable and the task each volunteer understands. Agree on transport, access, equipment and how to raise a concern. Someone should know where volunteers are expected and how changes will be communicated.",
        ),
        p(
          "Review likely risks and the controls agreed with the host. Examples include weather, lifting, tools, vehicle movements, inaccessible areas and exposure to unfamiliar environments. Stop and ask when a task falls outside your training or the plan. Enthusiasm is not a substitute for competence.",
        ),
        p(
          "When working with children or people needing additional support, follow the host’s and Rotary’s applicable safeguarding arrangements. Respect supervision and contact boundaries. Report concerns promptly through the designated safeguarding or leadership channel; do not promise secrecy or investigate an allegation yourself.",
        ),
        p(
          "At a health activity, qualified professionals must lead clinical work. General volunteers can assist only within the roles agreed by those professionals and the host. Do not diagnose, prescribe, disclose patient details or publish identifiable images of people receiving care without appropriate permission.",
        ),
        p(
          "People receiving supplies are participants, not props. Protect choice and dignity, avoid humiliating queues or staged gratitude, and respect anyone who declines a photograph. Record only the information needed for the activity and agreed reporting.",
        ),
        note(
          "This lesson provides planning prompts. It does not replace host briefings, professional training, risk assessment or the applicable safeguarding policy.",
        ),
      ],
      activity:
        "Prepare a five-point briefing for a school activity: task, supervision, safe boundaries, photo arrangements and the person to contact if something goes wrong.",
    },
    {
      objectives: [
        "Keep project money traceable.",
        "Understand grants without promising eligibility or approval.",
      ],
      blocks: [
        p(
          "A budget connects the plan to real resources. List quantities, estimated unit costs, transport and any other agreed expense. Record donated goods separately from cash. Identify what is confirmed, what is pledged and what remains unfunded; a pledge is not money already available to spend.",
        ),
        p(
          "Ask the treasurer and project lead how funds must be collected, authorised, paid and recorded. Keep receipts and transaction references, compare actual spending with the approved budget and explain differences. Avoid mixing personal money and club money without an agreed, documented process.",
        ),
        p(
          "State what a fundraiser supports and report how proceeds were used. Discuss any donor restrictions before accepting support. A supplier, donor or partner connected to a member can create a conflict of interest: disclose the relationship and let the proper decision-makers handle approval.",
        ),
        p(
          "The Rotary Foundation offers district and global grants. Rotary describes district grants as supporting smaller, shorter-term work and global grants as supporting sustainable international activities with measurable outcomes in its areas of focus. Rotaract members can participate, but applications and sponsorship have qualification requirements.",
        ),
        note(
          `Before developing a grant application, ask the district Foundation team about current qualification, prior experience, partners, reporting and eligibility. This course does not say ${profile.shortName} is already qualified or that a proposed project will receive a grant.`,
        ),
      ],
      activity:
        "A fundraiser collects KES 10,000 but a sponsor has only pledged another KES 5,000. Explain what is available now. List the documents needed before making and reporting a purchase.",
    },
    {
      objectives: [
        "Delegate clearly and support teammates.",
        "Turn volunteering into deliberate learning.",
      ],
      blocks: [
        p(
          "Leading is making the work understandable and helping people carry it out. Set a shared goal, define the task and explain what success looks like. A volunteer should know their deadline, resources, authority and where to ask for help.",
        ),
        p(
          "Delegate outcomes with clear boundaries rather than sending vague instructions. ‘Confirm the host’s available dates and report back by Tuesday; do not book anything yet’ is easier to act on than ‘handle the visit’. Match tasks to availability and skills, and check in without hovering.",
        ),
        p(
          "Mentorship is a conversation, not a guarantee of a job or a promotion. Ask an experienced member to explain a task, observe you trying it and give feedback. You can practise chairing, budgeting, planning, public speaking or respectful problem-solving through club work.",
        ),
        p(
          "When conflict arises, describe the issue and its effect, listen to the other person and agree on a practical next step. Distinguish a missed deadline from misconduct. Escalate safety, harassment or financial concerns through the appropriate channel rather than treating every issue as a team misunderstanding.",
        ),
        p(
          "After a project, review what worked, what changed and what you would do differently. Give credit to the team and host. Keep useful notes for the next lead so learning does not disappear when officers change.",
        ),
      ],
      activity:
        "Write a delegation message with a task, deadline, decision boundary and check-in. Then identify one skill you want feedback on during your first project.",
    },
    {
      objectives: [
        "Communicate accurately and respectfully.",
        "Use photographs and club identity responsibly.",
      ],
      blocks: [
        p(
          "Public image is built through reliable conduct as much as photographs. A useful story answers what happened, when, where, who took part and what can be supported by the record. A reader should be able to distinguish a planned event from one already held.",
        ),
        p(
          "Get approval from the person responsible for club communications before speaking for the club. Use current, approved branding and accurately identify collaborating organisations. Do not imply that Rotary, a school, a government agency or a donor endorses something it has not agreed to.",
        ),
        p(
          "Agree on photo permissions with the host and participants, especially where children or health settings are involved. Ask before publishing names, close-up photographs, private contact details or personal stories. Declining a photo should not affect someone’s access to an activity.",
        ),
        p(
          `${profile.evidence} If a figure is uncertain, verify it or omit it.`,
        ),
        p(
          "Credit partners and photographers where appropriate, use understandable captions and describe important images for people using screen readers. Correct errors promptly. Store records where authorised officers can find them, with access appropriate to their sensitivity.",
        ),
      ],
      activity:
        "Write a 60-word event caption containing a date, action, place and partner. Remove any claim of a long-term outcome that the event record cannot prove.",
    },
    {
      objectives: [
        `Locate ${profile.shortName} in its district and Rotary year.`,
        "Build a useful collaboration beyond your club.",
      ],
      blocks: [
        p(
          `${profile.shortName} belongs to ${profile.district}. ${profile.districtDescription} Use the district’s official site for current leadership, opportunities and announcements.`,
        ),
        p(
          "The Rotary year runs from 1 July to 30 June. Club and district leadership, plans and handovers follow that cycle. Always include the year when identifying an officer: someone who led in a previous year may still be a valued member but no longer holds that office.",
        ),
        p(
          "District training and events help members learn and meet other clubs. A District Rotaract Representative can help connect people, but participation still involves the organiser’s dates, fees, requirements and available places. Verify these details before making travel plans.",
        ),
        p(
          `A partnership needs shared purpose and clear roles. ${profile.partnership} Ask what each club contributes, who works with the host, how costs are handled and who follows up.`,
        ),
        p(
          "International service starts with understanding and respectful exchange, not simply adding an overseas club’s logo. Listen to local knowledge, recognise language and cultural differences, and agree on realistic responsibilities. A relationship can begin with learning together before a joint project.",
        ),
      ],
      activity:
        "Draft an enquiry to another club about a possible joint project. Include the purpose and questions about roles, budget and follow-up; avoid making commitments before approval.",
    },
    {
      objectives: [
        "Combine the lessons into a practical proposal.",
        "Choose a realistic first contribution and next conversation.",
      ],
      blocks: [
        p(
          `Choose an existing ${profile.shortName} programme or a need to discuss with the club. Your proposal should be small enough to understand and honest about what is unknown. Start from a conversation with the host rather than a polished poster.`,
        ),
        list(
          "Explain the need and who helped identify it.",
          "State the intended activity, cause and useful result to check.",
          "Identify the lead, host, partners and approvals.",
          "Estimate resources and costs without treating pledges as cash.",
          "Include access, safeguarding, consent and delivery arrangements.",
          "Name a follow-up owner and date.",
          "Explain how results will be recorded and shared.",
        ),
        p(
          "Use the Four-Way Test to review the plan. Check that claims are accurate, roles are fair and the approach respects participants. Then ask whether the work can continue after the event and whether the host agrees with the follow-up.",
        ),
        p(
          "Your first contribution might be a practical task, a professional skill or reliable help with records. Agree on a role you can actually fulfil. Ask for feedback afterward, and record what you learned alongside what the project delivered.",
        ),
        p(
          "The final assessment checks your understanding across these lessons. You can retake it and use the feedback to revisit a topic. Keep your learning record if useful, then discuss your proposal and membership steps with an officer. The website cannot confirm induction.",
        ),
        note(
          "The course is club learning material, not an official Rotary International certification. Project approval and membership decisions remain with the responsible club officers.",
        ),
      ],
      activity:
        "Bring a one-page service proposal and one personal learning goal to an officer. Mark unknowns as questions, and identify the smallest responsible next action.",
    },
  ];
  const q = (
    id: string,
    question: string,
    options: string[],
    correctIndex: number,
    explanation: string,
  ) => ({ id, question, options, correctIndex, explanation });
  return {
    title: COURSE_INFO.title,
    lead: COURSE_INFO.lead,
    version: COURSE_INFO.version,
    requiredBeforeInduction: false,
    passMark: COURSE_INFO.passMark,
    modules: COURSE_INFO.lessons.map((lesson, index) => ({
      ...lesson,
      ...lessons[index],
    })),
    sources: [
      {
        label: "Rotary — our history",
        href: "https://www.rotary.org/en/who-we-are/our-history",
      },
      {
        label: "Rotary — the first Rotaract club",
        href: "https://www.rotary.org/articles/2019/07/1968-expanding-our-reach-with-rotaract",
      },
      {
        label: "Rotary — Rotaract clubs",
        href: "https://www.rotary.org/en/get-involved/our-clubs/rotaract-clubs",
      },
      {
        label: "Rotary — Rotaract policy updates",
        href: "https://my-cms.rotary.org/en/recent-rotaract-policy-updates?embed=true",
      },
      {
        label: "Rotary — youth programmes",
        href: "https://www.rotary.org/en/get-involved/youth-programs",
      },
      {
        label: "Rotary — areas of focus",
        href: "https://www.rotary.org/en/our-causes",
      },
      {
        label: "Rotary — grants",
        href: "https://www.rotary.org/get-involved/our-programs/grants",
      },
      {
        label: "Rotaract Handbook — district-hosted Rotary publication",
        href: "https://www.rotaryd5500.org/wp-content/uploads/2024/07/562_rotaract_handbook_en.pdf",
      },
      {
        label: `${profile.district} — official site`,
        href: profile.districtUrl,
      },
      {
        label: "Rotary Learning Center — further training",
        href: "https://learn.rotary.org",
      },
    ],
    questions: [
      q(
        "roots-first",
        "When was the first Rotaract club certified?",
        ["23 February 1905", "13 March 1968", "1 July 2020", "1 July 2026"],
        1,
        "The first Rotaract club was certified at UNC Charlotte on 13 March 1968.",
      ),
      q(
        "roots-policy",
        "Which sponsorship statement is accurate?",
        [
          "Every club must have a Rotary sponsor",
          "Clubs cannot have sponsors",
          `Sponsorship is optional globally; ${profile.shortName} works with ${profile.sponsor}`,
          "Rotary International sponsors every individual member",
        ],
        2,
        `The mandatory sponsorship requirement ended in July 2020; ${profile.shortName} retains its sponsor relationship.`,
      ),
      q(
        "family-interact",
        "Which programme is for young people aged 12–18?",
        [
          "Interact",
          "Rotaract",
          "Rotary Peace Fellowships",
          "The Rotary Foundation",
        ],
        0,
        "Interact is Rotary’s service and leadership programme for this age group.",
      ),
      q(
        "family-ryla",
        "What does RYLA primarily provide?",
        [
          "Automatic club membership",
          "Guaranteed employment",
          "Permission to spend club funds",
          "Leadership development",
        ],
        3,
        "RYLA provides leadership learning; participation and selection are organised locally.",
      ),
      q(
        "structure-records",
        "Who normally supports club records and meeting administration?",
        ["Every guest", "The secretary", "The venue manager", "A donor"],
        1,
        "The secretary supports records and correspondence; actual arrangements should be confirmed locally.",
      ),
      q(
        "structure-approval",
        "Before committing the club to a purchase, what should you do?",
        [
          "Pay first and ask later",
          "Use the club name without checking",
          "Confirm the authorised approval and recording process",
          "Ask a guest to approve it",
        ],
        2,
        "Spending and commitments belong within the club’s approved decision process.",
      ),
      q(
        "membership-time",
        `When and where is ${profile.shortName}’s published fellowship?`,
        [
          profile.meeting,
          "Sunday morning at a school",
          "Every weekday without a scheduled venue",
          "Friday in Nairobi",
        ],
        0,
        `The published schedule is ${profile.meeting}; confirm weekly arrangements before travelling.`,
      ),
      q(
        "membership-record",
        "What does passing this course establish?",
        [
          "Automatic induction",
          "Official Rotary certification",
          "A paid subscription",
          "A personal learning record",
        ],
        3,
        "An officer confirms membership and induction; the course is club learning material.",
      ),
      q(
        "ethics-claim",
        "You have photos of seedlings being planted, but no follow-up. What can you report?",
        [
          "All trees survived",
          "The planting activity recorded",
          "A proven climate impact",
          "A guaranteed long-term outcome",
        ],
        1,
        "Describe the activity; tree survival needs a later check.",
      ),
      q(
        "ethics-inclusion",
        "Which action makes inclusion practical?",
        [
          "Assume everyone has the same needs",
          "Choose tasks without asking",
          "Ask about access and participation needs",
          "Only invite people you already know",
        ],
        2,
        "Ask and adapt rather than guessing what people need.",
      ),
      q(
        "meeting-actions",
        "Which action note is most useful?",
        [
          "A task, responsible person, deadline and approval needed",
          "We will sort it out",
          "Everyone should do everything",
          "It sounded like a good idea",
        ],
        0,
        "Clear action notes support accountability and follow-through.",
      ),
      q(
        "meeting-customs",
        "Are prayer, songs and meeting traditions universal requirements?",
        [
          "Always",
          "Only guests must do them",
          "They replace the club’s bylaws",
          "Practices vary; confirm with the club",
        ],
        3,
        "Local traditions should not be presented as universal requirements.",
      ),
      q(
        "frameworks-how",
        "What do the avenues of service describe?",
        [
          "Membership fees",
          "How people serve",
          "The district’s geography",
          "Only grant categories",
        ],
        1,
        "Avenues describe the way people contribute; areas of focus describe causes.",
      ),
      q(
        "frameworks-packs",
        "Which cause best fits mother packs for mothers and newborns?",
        [
          "International travel",
          "Club elections",
          "Maternal and child health",
          "Venue management",
        ],
        2,
        "The activity directly relates to maternal and child health.",
      ),
      q(
        "planning-first",
        "What should come before choosing a project activity?",
        [
          "Listening to the people affected and agreeing on the need",
          "Designing a poster",
          "Ordering supplies without consulting the host",
          "Promising a success figure",
        ],
        0,
        "A community-led understanding of the need comes first.",
      ),
      q(
        "planning-outcomes",
        "Which measure needs follow-up rather than just an event-day count?",
        [
          "Packs handed over",
          "Volunteers present",
          "Seedlings planted",
          "Seedlings still alive later",
        ],
        3,
        "Survival over time is different from the immediate planting output.",
      ),
      q(
        "delivery-concern",
        "A safeguarding concern arises during a visit. What is the responsible response?",
        [
          "Promise to keep it secret",
          "Report promptly through the designated safeguarding channel",
          "Post allegations online",
          "Investigate alone",
        ],
        1,
        "Use the designated reporting process; do not promise secrecy or investigate alone.",
      ),
      q(
        "delivery-health",
        "Who should lead clinical work at a health activity?",
        [
          "Whoever is most enthusiastic",
          "Any volunteer with a camera",
          "Qualified professionals with the host’s agreed arrangements",
          "The newest member",
        ],
        2,
        "Volunteers must stay within the roles and competence agreed with professionals and the host.",
      ),
      q(
        "finance-pledge",
        "A fundraiser has collected KES 10,000 and a donor has pledged KES 5,000. How much cash is collected?",
        ["KES 10,000", "KES 15,000", "KES 5,000", "No record is needed"],
        0,
        "A pledge is not yet cash received; record it separately.",
      ),
      q(
        "finance-grants",
        "What should happen before promising a Rotary Foundation grant?",
        [
          "Assume membership guarantees it",
          "Ask a donor to announce approval",
          "Spend the proposed grant immediately",
          "Confirm current qualification and application requirements with the district team",
        ],
        3,
        "Grant participation has requirements; the course does not establish eligibility or approval.",
      ),
      q(
        "leadership-delegate",
        "What makes a delegated task clear?",
        [
          "A vague instruction",
          "An outcome, deadline, resources and decision boundary",
          "No check-in",
          "A title without a task",
        ],
        1,
        "People need to know what to deliver and what authority they have.",
      ),
      q(
        "leadership-learning",
        "Which approach makes service a learning opportunity?",
        [
          "Expect a job offer",
          "Avoid feedback",
          "Choose a skill, practise it and ask for feedback",
          "Only collect photographs",
        ],
        2,
        "Deliberate practice and feedback support professional development.",
      ),
      q(
        "image-consent",
        "A participant declines a photograph. What should you do?",
        [
          "Respect the decision without affecting participation",
          "Insist because the club needs publicity",
          "Hide the photograph from them",
          "Publish their details instead",
        ],
        0,
        "Consent and dignity matter more than a publicity opportunity.",
      ),
      q(
        "image-evidence",
        "What belongs in a responsible project story?",
        [
          "Invented attendance totals",
          "Only impressive claims",
          "Partners who were not involved",
          "A verified date, action, place and credited participants",
        ],
        3,
        "Communicate what the record supports and correct errors.",
      ),
      q(
        "district-coverage",
        `Which region does ${profile.district} cover?`,
        [
          "Uganda and Rwanda",
          profile.districtDescription,
          "Coastal Kenya and Somalia",
          "Central Kenya and Tanzania",
        ],
        1,
        "Use the current district’s official geographic description.",
      ),
      q(
        "district-year",
        "When does the Rotary year run?",
        [
          "January to December",
          "March to February",
          "1 July to 30 June",
          "September to August",
        ],
        2,
        "Club and district annual leadership and plans follow the July–June cycle.",
      ),
      q(
        "capstone-plan",
        "Which proposal is ready for a useful first discussion?",
        [
          "A need, objective, roles, budget questions, care arrangements and follow-up",
          "A poster alone",
          "A success claim without evidence",
          "A purchase already made without approval",
        ],
        0,
        "A practical proposal makes responsibilities and unknowns visible.",
      ),
      q(
        "capstone-next",
        "What is the next step after this course?",
        [
          "Claim induction online",
          "Book an unapproved project",
          "Call the record a Rotary qualification",
          "Discuss your learning and membership steps with an officer",
        ],
        3,
        "The club confirms induction; the course supports that conversation.",
      ),
    ],
    chapters: CURRICULUM.map((chapter) => ({
      ...chapter,
      lessons: chapter.lessons.map((lesson) => ({ ...lesson })),
    })),
    scenarios: SCENARIO_CHECKS.map((check) => ({
      ...check,
      options: check.options.map((option) => ({ ...option })),
    })),
    videos: COURSE_VIDEOS.map((video) => ({ ...video })),
  };
}
