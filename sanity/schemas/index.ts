/**
 * Sanity document types for the club's public content.
 *
 * Written as plain schema objects so they can be dropped into a Studio without
 * this repository having to install the Studio runtime. What belongs here is
 * anything a club volunteer should be able to edit: projects, event records,
 * leadership, club details, and the public shape of the course.
 *
 * What must never appear in this dataset: learner records, assessment answer
 * keys, scenario answers, applications, or anything identifying a member. Those
 * live in the club's own database behind a signed-in session.
 */

const imageWithAlt = {
  name: "image",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    {
      name: "alt",
      title: "Describe the photograph",
      type: "string",
      description:
        "One sentence a screen reader can read out. Say who and what, not “image of”.",
      validation: (rule: { required: () => unknown }) => rule.required(),
    },
    {
      name: "credit",
      title: "Credit",
      type: "string",
      description: "Who took it, if the club knows.",
    },
    {
      name: "consent",
      title: "Consent confirmed for public use",
      type: "boolean",
      initialValue: false,
      description:
        "Only tick this when the people in the photograph have agreed to it being published.",
    },
  ],
};

export const clubInfo = {
  name: "clubInfo",
  title: "Club information",
  type: "document",
  fields: [
    { name: "name", title: "Club name", type: "string" },
    { name: "tagline", title: "Tagline", type: "string" },
    { name: "founded", title: "Year founded", type: "number" },
    { name: "district", title: "Rotary district", type: "string" },
    { name: "sponsor", title: "Sponsoring Rotary club", type: "string" },
    {
      name: "meetingDay",
      title: "Meeting day",
      type: "string",
      validation: (rule: { required: () => unknown }) => rule.required(),
    },
    { name: "meetingTime", title: "Meeting time", type: "string" },
    { name: "meetingVenue", title: "Meeting venue", type: "string" },
    {
      name: "meetingVenueUrl",
      title: "Map link",
      type: "url",
    },
    {
      name: "fees",
      title: "Published costs",
      type: "object",
      fields: [
        { name: "subscription", title: "Annual subscription", type: "number" },
        { name: "pin", title: "Rotaract pin", type: "number" },
        {
          name: "currency",
          title: "Currency",
          type: "string",
          initialValue: "KES",
        },
        {
          name: "note",
          title: "What the money covers",
          type: "text",
          rows: 3,
        },
      ],
    },
    {
      name: "contactEmail",
      title: "Contact email",
      type: "string",
    },
  ],
  preview: { select: { title: "name", subtitle: "meetingDay" } },
};

export const project = {
  name: "project",
  title: "Project",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule: { required: () => unknown }) => rule.required(),
    },
    {
      name: "slug",
      title: "Web address",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule: { required: () => unknown }) => rule.required(),
    },
    { name: "summary", title: "One-paragraph summary", type: "text", rows: 3 },
    {
      name: "cause",
      title: "Rotary area of focus",
      type: "string",
      options: {
        list: [
          "Peacebuilding and conflict prevention",
          "Disease prevention and treatment",
          "Water, sanitation and hygiene",
          "Maternal and child health",
          "Basic education and literacy",
          "Community economic development",
          "Environment",
        ],
      },
    },
    { name: "location", title: "Where", type: "string" },
    {
      name: "partners",
      title: "Partner organisations",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "followUp",
      title: "What was checked afterwards",
      type: "text",
      rows: 3,
      description:
        "Only write what was actually measured or seen. Leave blank rather than estimate.",
    },
    {
      name: "gallery",
      title: "Photographs",
      type: "array",
      of: [imageWithAlt],
    },
  ],
  preview: { select: { title: "title", subtitle: "cause" } },
};

export const eventRecord = {
  name: "eventRecord",
  title: "Event record",
  type: "document",
  fields: [
    {
      name: "title",
      title: "Title",
      type: "string",
      validation: (rule: { required: () => unknown }) => rule.required(),
    },
    {
      name: "slug",
      title: "Web address",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: (rule: { required: () => unknown }) => rule.required(),
    },
    { name: "date", title: "Date", type: "date" },
    { name: "location", title: "Where", type: "string" },
    { name: "summary", title: "What happened", type: "text", rows: 4 },
    { name: "organiser", title: "Organised by", type: "string" },
    {
      name: "partners",
      title: "Partner organisations",
      type: "array",
      of: [{ type: "string" }],
    },
    {
      name: "projectSlug",
      title: "Related project web address",
      type: "string",
    },
    {
      name: "gallery",
      title: "Photographs",
      type: "array",
      of: [imageWithAlt],
    },
    {
      name: "source",
      title: "Where this account came from",
      type: "text",
      rows: 2,
      description:
        "The club post, report or person this record was written from. Keep it so the club can check it later.",
    },
  ],
  preview: { select: { title: "title", subtitle: "date" } },
};

export const leader = {
  name: "leader",
  title: "Club officer",
  type: "document",
  fields: [
    { name: "name", title: "Name", type: "string" },
    { name: "standing", title: "Role", type: "string" },
    { name: "term", title: "Rotary year", type: "string" },
    {
      name: "slug",
      title: "Web address",
      type: "slug",
      options: { source: "name" },
    },
    { name: "portfolio", title: "Portfolio", type: "string" },
    { name: "bio", title: "Short biography", type: "text", rows: 5 },
    {
      name: "photo",
      title: "Portrait",
      type: "image",
      options: { hotspot: true },
    },
    {
      name: "consent",
      title: "This person agreed to appear publicly",
      type: "boolean",
      initialValue: false,
    },
  ],
  preview: { select: { title: "name", subtitle: "standing" } },
};

export const courseModule = {
  name: "courseModule",
  title: "Course chapter",
  type: "document",
  fields: [
    { name: "title", title: "Chapter title", type: "string" },
    { name: "order", title: "Position in the course", type: "number" },
    {
      name: "description",
      title: "One line on what it covers",
      type: "text",
      rows: 2,
    },
    {
      name: "lessons",
      title: "Lessons",
      type: "array",
      of: [{ type: "string" }],
      description: "Lesson ids, matching the club-neutral curriculum.",
    },
    {
      name: "videos",
      title: "Videos shown in this chapter",
      type: "array",
      of: [{ type: "reference", to: [{ type: "courseVideo" }] }],
    },
  ],
  orderings: [
    {
      title: "Course order",
      name: "order",
      by: [{ field: "order", direction: "asc" }],
    },
  ],
  preview: { select: { title: "title", subtitle: "description" } },
};

export const courseVideo = {
  name: "courseVideo",
  title: "Course video",
  type: "document",
  fields: [
    { name: "title", title: "Video title", type: "string" },
    {
      name: "youtubeId",
      title: "YouTube video id",
      type: "string",
      description: "The eleven characters after watch?v=",
      validation: (rule: {
        required: () => unknown;
        regex: (pattern: RegExp, options: { name: string }) => unknown;
      }) =>
        rule.required().regex(/^[A-Za-z0-9_-]{11}$/, { name: "a YouTube id" }),
    },
    {
      name: "source",
      title: "Channel",
      type: "string",
      description:
        "Who published it. Only official Rotary or Rotaract material.",
    },
    {
      name: "why",
      title: "Why this video is here",
      type: "text",
      rows: 2,
    },
    {
      name: "reading",
      title: "Reading alternative",
      type: "object",
      description:
        "Someone who cannot use video must still be able to learn this.",
      fields: [
        { name: "label", title: "Link text", type: "string" },
        { name: "href", title: "Address", type: "url" },
      ],
    },
    {
      name: "reviewed",
      title: "Checked and still available",
      type: "date",
    },
  ],
  preview: { select: { title: "title", subtitle: "source" } },
};

export const societyAccount = {
  name: "societyAccount",
  title: "Social account",
  type: "document",
  fields: [
    { name: "platform", title: "Platform", type: "string" },
    { name: "handle", title: "Handle", type: "string" },
    { name: "url", title: "Address", type: "url" },
    {
      name: "public",
      title: "Show on the website",
      type: "boolean",
      initialValue: false,
    },
    { name: "verified", title: "Last checked", type: "date" },
  ],
  preview: { select: { title: "handle", subtitle: "platform" } },
};

/**
 * Deliberately absent, and worth stating once: no `learner`, `application`,
 * `attempt` or `answerKey` type exists. Adding one would put a member's
 * learning record or the assessment key in a dataset that is readable by
 * anyone with the project id.
 */
export const schemaTypes = [
  clubInfo,
  project,
  eventRecord,
  leader,
  courseModule,
  courseVideo,
  societyAccount,
];
