import type {
  ClubLearningProfile,
  FullCourse,
  OrientationBlock,
  ProtocolLevel,
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
  /**
   * A statement whose weight depends on where it comes from. Rotary material
   * mixes global policy, district guidance and club custom, and flattening
   * them is how a local habit gets quoted as a rule.
   */
  const tag = (
    level: ProtocolLevel,
    text: string,
    source?: string,
  ): OrientationBlock => ({ kind: "tag", level, text, source });
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
          `Fellowship makes room for people as well as plans. ${profile.meeting}. Expect service updates and time to get to know each other. A guest can listen, introduce themselves and ask questions without already knowing Rotary terminology.`,
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
        "Say what each club officer is accountable for.",
        "Explain how the Rotary year shapes who leads and when.",
        "Name the first step you would take to hold a role.",
      ],
      blocks: [
        p(
          "The club is run by members who put their hands up, not by a head office. A president serves for one Rotary year and hands over, and the rest of the board is made up of members with jobs, families and studies alongside this.",
        ),
        p(
          "The board is the group that decides. It sets the year’s plan, agrees spending, hears reports and carries responsibility when something goes wrong. Everything a board does is visible to members: minutes, the budget and the plan are the club’s, not the board’s.",
        ),
        list(
          `President — leads the club and its board, chairs the meetings and answers for the year. ${profile.leadershipLine}`,
          "President Elect — learns the job during the year before taking it, so handover is not a surprise.",
          "Immediate Past President — keeps the year’s memory and advises the incoming team.",
          "Secretary — keeps the records: minutes, correspondence, the membership list and the governing documents.",
          "Treasurer — holds the figures, keeps the accounts and reports on money in and money out.",
          "Directors — take one area each: service projects, membership, public image, fundraising, young generations.",
          "Sergeant-at-Arms — keeps order and timing at meetings, and often the club’s customs.",
        ),
        tag(
          "requirement",
          "Rotary’s year runs from 1 July to 30 June, and clubs hold their elections and handover inside that cycle. Election procedure itself comes from the club’s own constitution and bylaws.",
          "Rotary International — the Rotary year; club governing documents for elections",
        ),
        p(
          "Nobody arrives as president. Members start by taking one task on a project, then chairing a committee, then standing for a board role. That path matters more than ambition: the club has seen how you work before it hands you a budget.",
        ),
        p(
          "If you want a role, say so to the president or the membership director and ask what the year actually needs. Leadership here is not a promotion — it is agreeing to be answerable for a piece of the club’s work.",
        ),
        note(
          `${profile.shortName}’s current board, roles and term are on the Leadership page. Any role that is vacant or a portfolio we have not confirmed is not listed there — ask the secretary rather than assuming a title from an old poster.`,
        ),
      ],
      activity:
        "Look at the club’s Leadership page. Pick the one role whose work you would actually turn up for, write one sentence saying why, and message the president or membership director to ask what it involves this year.",
    },
    {
      objectives: [
        "Name the four questions of the Four-Way Test from memory.",
        "Say who wrote it and when Rotary adopted it.",
        "Explain what the Object of Rotary sets out, in your own words.",
      ],
      blocks: [
        p(
          "A supplier offers the club a discount on one condition: the announcement names them the club’s principal partner. That wording would drop a smaller donor who has already given.",
        ),
        p(
          "You have a decision in front of you, and Rotary has a way of testing decisions. The Four-Way Test was written in 1932 by Herbert J. Taylor, a Chicago Rotarian, and Rotary International adopted it in 1943. Of the things we think, say or do:",
        ),
        list(
          "Is it the TRUTH?",
          "Is it FAIR to all concerned?",
          "Will it build GOODWILL and BETTER FRIENDSHIPS?",
          "Will it be BENEFICIAL to all concerned?",
        ),
        tag(
          "recommendation",
          "Rotary publishes the Four-Way Test as its ethical guide. How a club uses it is not fixed — some recite it at the opening of every meeting, some at the close, some not at all.",
          "Rotary — the Four-Way Test",
        ),
        p(
          "The Object of Rotary is its companion. In plain language, it sets out that service is the basis of a worthwhile enterprise, and that this shows up four ways: friendship that becomes an opportunity to serve, high ethical standards in work and life, service applied in your own business and community, and understanding across borders.",
        ),
        note(
          "This is a plain-language overview of the Object of Rotary. Use Rotary’s official statement when reading it at a meeting.",
        ),
      ],
      activity:
        "Apply each question of the Four-Way Test to the supplier’s offer. Draft a truthful reply that recognises both partners. Be prepared to decline conditions that would mislead people.",
    },
    {
      objectives: [
        "Know what an agenda is for and how to add to one.",
        "Raise a question or a concern without derailing the room.",
        "Say which officer handles what.",
      ],
      blocks: [
        p(
          "It is your third meeting. Under any other business the chair asks whether anyone has something to raise. You have a question about how a project budget was spent.",
        ),
        p(
          "An agenda sets out the business, the available time and the decisions needed. Circulating it beforehand helps members prepare and gives the chair a clear running order.",
        ),
        list(
          "1. Call to order: the president opens the meeting and confirms it can proceed.",
          "2. The Four-Way Test: the club’s ethical check on the things we think, say and do.",
          "3. Invocation or grace: a short reflection. The wording varies by faith and by club.",
          "4. Welcome and apologies: who is present, who sent apologies, and which guests are attending.",
          "5. Introductions: welcome guests and members, and make the room easier to enter.",
          "6. Reports or announcements: secretary, treasurer, project leads and other updates.",
          "7. Rotary moments: a short learning slot, speaker or update about Rotary and its work.",
          "8. Sergeant-at-Arms (SAA): timekeeping, meeting order and practical closing notices.",
          "9. Close of meeting: confirm decisions and next steps, then close in the club’s agreed way.",
        ),
        tag(
          "custom",
          `This nine-part order is ${profile.shortName}’s confirmed meeting sequence. It is club practice, not a claim that every Rotary or Rotaract club follows the same agenda.`,
          `${profile.shortName} meeting sequence confirmed by the club, 27 November 2026`,
        ),
        p(
          "The reason for a standing order does travel: a meeting with a shape gets its business done and leaves people wanting to return. The exact sequence remains the club’s own decision.",
        ),
        p(
          "To raise something, ask for the item rather than the floor — “may I add something under any other business?” — then say what you want: a decision, information, or help. Three sentences is usually enough, and if it needs longer, ask to be put on the agenda for the next meeting.",
        ),
        list(
          "The chair runs the meeting and decides what is in order.",
          "The secretary keeps the records and knows the governing documents.",
          "The treasurer holds the figures and the payment records.",
          "The sergeant-at-arms keeps time and order, and often the club’s customs.",
        ),
        tag(
          "example",
          "Good meeting practice: listen without interrupting, address the issue respectfully and keep to the agreed time.",
          "Academy practical guidance",
        ),
      ],
      activity:
        "Write the three sentences you would actually say to raise your budget question, and name the officer you would follow up with afterwards.",
    },
    {
      objectives: [
        "Introduce a visiting officer accurately.",
        "Explain what formal precedence is for.",
        "Find the right form of address instead of guessing.",
      ],
      blocks: [
        p(
          "A District Rotaract Representative is coming to your fellowship. You are asked to welcome them from the front.",
        ),
        p(
          "Introductions go wrong in one way: someone guesses a title. The fix is dull and always works — ask the visitor or their club beforehand how they would like to be introduced, and write it down.",
        ),
        tag(
          "example",
          "Use a person’s current title and full name, and check the preferred form of address with the visitor or their club before a formal occasion.",
          "Academy practical guidance",
        ),
        p(
          "Precedence is the order in which people are recognised, seated or introduced. It exists so that a formal occasion does not become a negotiation about status, and it is a courtesy, not a ranking of worth.",
        ),
        tag(
          "example",
          "For a district occasion, ask the organisers which current protocol applies to introductions, speaking and seating. Do not assume an old event programme is the rule.",
          `${profile.district}: confirm with the organisers`,
        ),
        tag(
          "custom",
          `Whether ${profile.shortName} uses a formal order at its own fellowships is a club decision and has not been confirmed here.`,
        ),
        note(
          "No current official Rotaract precedence table could be verified for this course, so none is published. A district handout from an earlier year is not a standing rule. The president holds the draft until the district confirms the current position.",
        ),
      ],
      activity:
        "Write two sentences introducing a visiting officer whose title you have confirmed, and one sentence you would use if you had not been able to confirm it.",
    },
    {
      objectives: [
        "Tell a discussion apart from a decision.",
        "Record a decision so it can be acted on.",
        "Handle a conflict of interest out loud.",
      ],
      blocks: [
        p(
          "The club is talking about buying equipment. Half the room is for it, and it is not clear whether anything has actually been agreed.",
        ),
        p(
          "Fellowship discussion is how a club thinks. A decision is how it acts, and the two need separating, because people leave meetings believing different things were agreed.",
        ),
        tag(
          "example",
          "Before a formal vote, check the Standard Rotaract Club Constitution and the club’s adopted bylaws for authority, notice, eligibility and quorum. Ask the secretary which provisions apply; a show of hands alone does not establish that the process was valid.",
          "Rotary’s Rotaract policy updates; club bylaws to be confirmed",
        ),
        p(
          "A minute is not a transcript. It records the decision, who owns the next step, the deadline, and any approved cost — which is what lets someone who missed the meeting act on it.",
        ),
        p(
          "If a decision touches you personally — a supplier you are related to, a contract for your employer — say so before the discussion, take no part in the decision, and ask for it to be recorded. Declaring it is the whole point.",
        ),
        tag(
          "example",
          "A useful minute reads: “Agreed to obtain three quotes for the water tank by 30 November; Erick to circulate them; no spend approved above KES 40,000 without a further decision.” The figure is a sample, not the club’s budget.",
        ),
      ],
      activity:
        "Turn “we should get a water tank” into a minute with a decision, an owner and a deadline. Then write the sentence you would say to declare a conflict of interest.",
    },
    {
      objectives: [
        "Describe what happens at an induction without inventing rules.",
        "Tell a custom apart from a Rotary requirement.",
        "Raise a concern about a practice that excludes you.",
      ],
      blocks: [
        p(
          "It is induction night, and a new member asks you what is going to happen.",
        ),
        p(
          "Very little of what happens at a club’s ceremonies is Rotary-wide. Induction, handover between leadership years, songs, toasts, dress conventions and fines are club decisions, and most clubs do some of them and not others.",
        ),
        tag(
          "custom",
          `Induction and handover ceremonies, any wording used, and who leads them are set by each club. ${profile.shortName}’s current practice is on the confirmation list and is not stated here.`,
        ),
        tag(
          "example",
          "Songs, toasts, fines and dress conventions appear in many Rotary and Rotaract clubs. They are customs, not Rotary requirements, and plenty of clubs have none at all.",
        ),
        p(
          "A grace or invocation is a prayer. Some clubs open with one, some close with one, some use neither — and the words differ by club, language and faith. This course does not print a version and call it the Rotary one; ask your club which words it uses, if any.",
        ),
        note(
          "Rotaract is open to people of every faith and none. If a practice would exclude you or make you uncomfortable, you are entitled to say so to an officer, and the club should be able to tell you what it does and why.",
        ),
      ],
      activity:
        "List three practices you have seen or heard described. For each, write whether it is a Rotary requirement, district guidance, or your club’s custom — and who you would ask to check.",
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
        tag(
          "requirement",
          "The Rotary and Rotaract marks are trademarks. Their use is governed by Rotary’s brand guidance, and a club may not claim Rotary endorsement for a project Rotary has not endorsed.",
          "Rotary Brand Center",
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
    lessonId: string,
    id: string,
    question: string,
    options: string[],
    correctIndex: number,
    explanation: string,
  ) => ({ lessonId, id, question, options, correctIndex, explanation });
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
      /* One question per lesson, so nothing taught goes unassessed and no
         lesson is asked twice. The ones that name the club read from the
         course profile, so another club gets its own facts. */
      q(
        "roots",
        "roots-sponsor",
        `Which Rotary club sponsors ${profile.shortName}?`,
        [
          "Rotary International",
          profile.sponsor,
          "The Rotary Foundation",
          "No club sponsors us — Rotaract is independent",
        ],
        1,
        `${profile.shortName}’s sponsor is ${profile.sponsor}. A sponsor offers mentorship and experience; it does not run the club or make its decisions.`,
      ),
      q(
        "family",
        "family-ryla",
        "What does RYLA primarily provide?",
        [
          "A route to becoming a Rotarian",
          "Leadership learning through locally organised programmes",
          "Funding for club projects",
          "A school-based service programme for under-18s",
        ],
        1,
        "RYLA — Rotary Youth Leadership Awards — is leadership learning. It is an opportunity, not a rung on a ladder you must climb before joining Rotaract.",
      ),
      q(
        "structure",
        "structure-approval",
        "Before committing the club to a purchase or a partner, what should you do?",
        [
          "Tell the members afterwards so they know it happened",
          "Ask who has authority to approve it, and get that approval recorded",
          "Assume the president can decide anything alone",
          "Put it on social media so the club is committed",
        ],
        1,
        "Spending, venues, partners and public announcements all have an approval path. Find out who holds it and get the decision recorded, so nobody is committed by accident.",
      ),
      q(
        "membership",
        "membership-meeting",
        `When and where does ${profile.shortName} hold its fellowship?`,
        [
          "Fridays at 6:00 pm, online",
          profile.meeting,
          "Once a month, venue varies",
          "Sundays at 10:00 am at the district office",
        ],
        1,
        `${profile.shortName} publishes its fellowship as ${profile.meeting}. Confirm the week's arrangements before travelling, especially if you are a first-time guest.`,
      ),
      q(
        "fellowship",
        "fellowship-purpose",
        "What is fellowship for?",
        [
          "Filling the hour before the real business starts",
          "Keeping the club a group of people rather than a task list — service updates, project news and time to know each other",
          "Recording formal decisions",
          "Collecting fines and subscriptions",
        ],
        1,
        "Fellowship is the part that makes the rest possible. A guest can listen, introduce themselves and ask questions without already knowing Rotary terminology.",
      ),
      q(
        "club-leadership",
        "leadership-president",
        profile.president
          ? `Who is ${profile.shortName}’s President this Rotary year?`
          : "Who leads the club for the Rotary year?",
        profile.president
          ? [
              profile.president,
              "The district governor",
              "Whoever chairs the meeting that week",
              "The sponsor club’s president",
            ]
          : [
              "The district governor",
              "The president, elected by the members for the Rotary year",
              "Whoever chairs the meeting that week",
              "The sponsor club’s president",
            ],
        profile.president ? 0 : 1,
        `The president is elected by the club’s members and serves one Rotary year, from 1 July to 30 June. ${
          profile.president ? `${profile.president} holds the role now.` : ""
        } The district governor supports the district, not your club.`,
      ),
      q(
        "protocol-ethics",
        "protocol-ethics-author",
        "Who wrote the Four-Way Test, and when did Rotary adopt it?",
        [
          "Paul Harris, 1905; adopted in 1910",
          "Herbert J. Taylor, 1932; adopted in 1943",
          "The Rotary Foundation, 1968; adopted in 1970",
          "The Rotaract Advisory Committee, 2019",
        ],
        1,
        "Herbert J. Taylor, a Chicago Rotarian, wrote the test in 1932. Rotary International adopted it in 1943.",
      ),
      q(
        "protocol-meeting",
        "protocol-meeting-question",
        "You want to raise something about how a project budget was spent. What is the most useful move?",
        [
          "Say it during the treasurer’s report without being called",
          "Ask the chair to add it under any other business, then say whether you want a decision, information or help",
          "Send it to the whole membership on social media first",
          "Wait until the meeting closes and raise it with whoever is still there",
        ],
        1,
        "Ask for the item rather than the floor, then be clear what you are asking for. Three sentences is usually enough, and if it needs longer, ask to be on next meeting’s agenda.",
      ),
      q(
        "protocol-introductions",
        "protocol-introductions-check",
        "You are asked to introduce a visiting district officer. What do you do first?",
        [
          "Use the title you remember from last year",
          "Confirm their current title and preferred form of address with them or their club",
          "Introduce them without any title to avoid getting it wrong",
          "Copy the introduction from another club’s post",
        ],
        1,
        "Guessing a title is how introductions go wrong. Ask beforehand and write it down — a title from a previous Rotary year is out of date.",
      ),
      q(
        "protocol-business",
        "protocol-business-minute",
        "Which line belongs in a minute?",
        [
          "A summary of everything each member said",
          "Agreed to obtain three quotes by 30 November; Erick to circulate them; no spend above the approved figure without a further decision",
          "The club agreed it would be good to sort out the water tank soon",
          "Members felt positive about the discussion",
        ],
        1,
        "A minute records the decision, the owner, the deadline and any approved cost — enough that somebody who missed the meeting can act on it. It is not a transcript, and it is not a mood.",
      ),
      q(
        "protocol-ceremonies",
        "protocol-ceremonies-grace",
        "A new member asks you what the grace says.",
        [
          "Quote the version used across Rotary International",
          "Explain that the words vary by club and faith, that some clubs use none, and that the club can tell them what it does",
          "Say it is compulsory at every meeting",
          "Tell them it is in the club bylaws",
        ],
        1,
        "A grace or invocation is a prayer, and the wording differs by club, language and faith — some clubs use none at all. Rotaract is open to people of every faith and none, so nobody should be told a prayer is compulsory.",
      ),
      q(
        "ethics",
        "ethics-claim",
        "You have photographs of seedlings being planted, but nobody has been back to check. What can you honestly report?",
        [
          "That the club planted the trees and that survival has not been checked yet",
          "That the project was a success",
          "That every seedling is growing well",
          "That the community now has a forest",
        ],
        0,
        "Truth requires the narrower claim. Describe the planting, then plan a survival check — the Four-Way Test does not stop at the first question.",
      ),
      q(
        "frameworks",
        "frameworks-cause",
        `Which area of focus fits ${profile.exampleProject.label}?`,
        [
          "Peacebuilding and conflict prevention",
          "Water, sanitation and hygiene",
          profile.exampleProject.cause,
          "Community economic development",
        ],
        2,
        `Mother packs for mothers and newborns address maternal and child health. Match the cause to the need and the work, rather than adding every focus-area badge to an announcement.`,
      ),
      q(
        "planning",
        "planning-first",
        "What should come before choosing a project activity?",
        [
          "Listening to the people affected and agreeing on the need",
          "Designing a poster",
          "Ordering supplies without consulting the host",
          "Promising a success figure",
        ],
        0,
        "Start with the people affected: what they need, what has been tried, and what support would help. The activity comes after that, not before it.",
      ),
      q(
        "delivery",
        "delivery-concern",
        "A safeguarding concern arises during a visit. What is the responsible response?",
        [
          "Promise to keep it secret",
          "Report promptly through the designated safeguarding channel",
          "Post allegations online",
          "Investigate alone",
        ],
        1,
        "Report promptly through the designated safeguarding or leadership channel. Do not promise secrecy and do not investigate an allegation yourself.",
      ),
      q(
        "finance",
        "finance-pledge",
        "A fundraiser has collected KES 10,000 and a donor has pledged KES 5,000. How much cash is collected?",
        ["KES 10,000", "KES 15,000", "KES 5,000", "No record is needed"],
        0,
        "A pledge is money promised, not money you have. Record donated goods separately from cash and never spend a pledge.",
      ),
      q(
        "leadership",
        "leadership-delegate",
        "What makes a delegated task clear?",
        [
          "A vague instruction",
          "An outcome, deadline, resources and decision boundary",
          "No check-in",
          "A title without a task",
        ],
        1,
        "Without the outcome, the deadline, the resources and how far the person may decide, it is a request rather than a delegation.",
      ),
      q(
        "public-image",
        "image-consent",
        "A participant declines a photograph. What should you do?",
        [
          "Respect the decision without affecting participation",
          "Insist because the club needs publicity",
          "Hide the photograph from them",
          "Publish their details instead",
        ],
        0,
        "Consent is asked before publication and a refusal costs the person nothing. That applies to photographs, to stories, and to anyone who would rather not be named.",
      ),
      q(
        "district",
        "district-coverage",
        `Which region does ${profile.district} cover?`,
        [
          "Uganda and Rwanda",
          profile.districtDescription,
          "Coastal Kenya and Somalia",
          "Central Kenya and Tanzania",
        ],
        1,
        "Use the current district's official geographic description. The district connects clubs through support, training and joint work.",
      ),
      q(
        "next-steps",
        "capstone-next",
        "What is the next step after this course?",
        [
          "Claim induction online",
          "Book an unapproved project",
          "Call the record a Rotary qualification",
          "Discuss your learning and membership steps with an officer",
        ],
        3,
        "The club confirms induction; the course supports that conversation. Passing it does not make anyone a member and is not a Rotary qualification.",
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
