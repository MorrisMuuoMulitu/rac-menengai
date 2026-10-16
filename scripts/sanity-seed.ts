/**
 * Build the Sanity seed from the content the club has already approved.
 *
 * Nothing new is invented here. Each document is derived from
 * `content/events/index.json`, `content/projects.json`,
 * `content/social/accounts.json`, and the shared curriculum — so the first
 * import into Sanity is exactly what the live site already publishes.
 *
 * Run through Vite so the TypeScript in `shared/` and `src/` is available:
 *   npm run sanity:seed
 */

import { readFile } from "node:fs/promises";
import {
  CURRICULUM,
  CURRICULUM_MINUTES,
} from "../shared/rotaract-academy/curriculum.js";
import { COURSE_INFO } from "../shared/rotaract-academy/syllabus.js";
import { COURSE_VIDEOS } from "../shared/rotaract-academy/videos.js";

interface EventRecord {
  slug: string;
  title: string;
  date: string | null;
  location: string | null;
  description: string;
  organizer?: string | null;
  partners?: string[];
  projectSlug?: string | null;
  sourceUrl?: string | null;
  approval?: string | null;
  publicationStatus?: string;
}

interface ContentImage {
  src: string;
  thumb?: string;
  alt: string;
}

interface ContentEvent extends EventRecord {
  images?: ContentImage[];
}

interface ProjectRecord {
  slug: string;
  title?: string;
  summary?: string;
  status?: string;
  publicationStatus?: string;
  verification?: string;
}

interface SocialAccount {
  platform: string;
  handle: string;
  url: string;
  evidence?: string;
  lastVerified?: string;
  public: boolean;
}

const read = async <T>(path: string): Promise<T> =>
  JSON.parse(await readFile(path, "utf8")) as T;

const slug = (value: string) => ({ _type: "slug", current: value });
const key = (prefix: string, value: string) =>
  `${prefix}-${value.replace(/[^a-z0-9]+/gi, "-").slice(0, 40)}`;

export async function buildSeed() {
  const events = (
    await read<ContentEvent[]>("content/events/index.json")
  ).filter(
    (event) =>
      event.publicationStatus === "published" && Boolean(event.approval),
  );
  const projects = await read<ProjectRecord[]>("content/projects.json");
  const accounts = await read<SocialAccount[]>("content/social/accounts.json");

  const documents: Record<string, unknown>[] = [];

  documents.push({
    _id: "clubInfo",
    _type: "clubInfo",
    name: "Rotaract Club of Menengai",
    tagline: "Creating Lasting Impact",
    district: "Rotary District 9215",
    sponsor: "Rotary Club of Nakuru",
    meetingDay: "Thursday",
    meetingTime: "5:30–6:30 PM EAT",
    meetingVenue: "Nakuru Athletic Club",
    fees: {
      subscription: 3000,
      pin: 500,
      currency: "KES",
      note: "The annual subscription covers Rotary International dues and club running costs. Service projects are funded separately by fundraising.",
    },
  });

  for (const project of projects) {
    documents.push({
      _id: `project-${project.slug}`,
      _type: "project",
      title: project.title ?? project.slug,
      slug: slug(project.slug),
      summary: project.summary ?? "",
      followUp: project.verification ?? "",
    });
  }

  for (const event of events) {
    documents.push({
      _id: `event-${event.slug}`,
      _type: "eventRecord",
      title: event.title,
      slug: slug(event.slug),
      date: event.date ?? undefined,
      location: event.location ?? "",
      summary: event.description,
      organiser: event.organizer ?? "",
      partners: event.partners ?? [],
      projectSlug: event.projectSlug ?? "",
      source: event.approval ?? "",
    });
  }

  for (const video of COURSE_VIDEOS) {
    documents.push({
      _id: `video-${video.id}`,
      _type: "courseVideo",
      title: video.title,
      youtubeId: video.youtubeId,
      source: "Rotary International",
      why: video.why,
      reading: { _type: "reading", ...video.reading },
    });
  }

  CURRICULUM.forEach((chapter, index) => {
    documents.push({
      _id: `chapter-${chapter.id}`,
      _type: "courseModule",
      title: chapter.title,
      order: index + 1,
      description: chapter.description,
      lessons: chapter.lessons.map((lesson) => lesson.id),
      videos: chapter.videos.map((video) => ({
        _type: "reference",
        _ref: `video-${video.id}`,
        _key: key("video", video.id),
      })),
    });
  });

  for (const account of accounts.filter((entry) => entry.public && entry.url)) {
    documents.push({
      _id: `social-${account.platform.toLowerCase()}`,
      _type: "societyAccount",
      platform: account.platform,
      handle: account.handle,
      url: account.url,
      public: true,
      verified: account.lastVerified,
    });
  }

  return {
    course: {
      title: COURSE_INFO.title,
      lead: COURSE_INFO.lead,
      version: COURSE_INFO.version,
      minutes: CURRICULUM_MINUTES,
      questionCount: COURSE_INFO.questionCount,
      passMark: COURSE_INFO.passMark,
    },
    documents,
  };
}
