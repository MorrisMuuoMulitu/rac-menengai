/**
 * Reviewed external video, mapped to the chapter it supports.
 *
 * Every entry was checked against Rotary International's official YouTube
 * channel before being listed. Nothing is embedded on load: the player waits
 * for the learner to ask for it, so no third-party request is made just
 * because someone opened a lesson. Each entry carries a reading alternative
 * on an official Rotary or Rotaract page for anyone who would rather read,
 * is on a slow connection, or cannot use video at all.
 */

export interface CourseVideo {
  id: string;
  chapterId: string;
  /** YouTube video id on the Rotary International channel. */
  youtubeId: string;
  title: string;
  /** One sentence on what this adds to the chapter. Written by us, not a quote. */
  why: string;
  /** Official page covering the same ground in text. */
  reading: { label: string; href: string };
}

export const COURSE_VIDEOS: CourseVideo[] = [
  {
    id: "what-is-rotary",
    chapterId: "discover",
    youtubeId: "PFryy_dY0tg",
    title: "What is Rotary?",
    why: "Rotary International’s own two-minute answer to the question you will be asked most often.",
    reading: {
      label: "Rotary — who we are",
      href: "https://www.rotary.org/en/about-rotary",
    },
  },
  {
    id: "join-rotaract",
    chapterId: "discover",
    youtubeId: "LuAOWnop8hI",
    title: "Join Rotaract!",
    why: "Rotaractors describing the movement in their own words, across several countries.",
    reading: {
      label: "Rotary — Rotaract clubs",
      href: "https://www.rotary.org/en/get-involved/our-clubs/rotaract-clubs",
    },
  },
  {
    id: "join-the-movement",
    chapterId: "club",
    youtubeId: "6DIR8fr9VJA",
    title: "Join the movement",
    why: "What a Rotaract club actually does week to week — meetings, projects and the people who run them.",
    reading: {
      label: "Rotary — start or join a Rotaract club",
      href: "https://www.rotary.org/en/get-involved/our-clubs/rotaract-clubs",
    },
  },
  {
    id: "champions-of-inclusion",
    chapterId: "integrity",
    youtubeId: "3-Ne27djE5w",
    title: "Champions of inclusion",
    why: "Rotarians working on access and belonging — useful when you are deciding who a project is really for.",
    reading: {
      label: "Rotary — diversity, equity and inclusion",
      href: "https://www.rotary.org/en/about-rotary/diversity-equity-inclusion",
    },
  },
  {
    id: "favourite-rotaract-project",
    chapterId: "service",
    youtubeId: "Efa8KYTYBC8",
    title: "What’s your favourite Rotaract project?",
    why: "Rotaractors name the projects they are proudest of, and why those projects worked.",
    reading: {
      label: "Rotary — areas of focus",
      href: "https://www.rotary.org/en/our-causes",
    },
  },
  {
    id: "care-for-our-planet",
    chapterId: "service",
    youtubeId: "-xFOlatw8aM",
    title: "Rotary members care for our planet",
    why: "Environmental work at club scale — planting, clean-ups and the care that has to follow the planting day.",
    reading: {
      label: "Rotary — supporting the environment",
      href: "https://www.rotary.org/en/our-causes/supporting-environment",
    },
  },
  {
    id: "clean-water",
    chapterId: "service",
    youtubeId: "EWKh1JMJoaA",
    title: "Creating access to clean water and sanitation",
    why: "How a club scopes a long-running project with partners and measures it.",
    reading: {
      label: "Rotary — water, sanitation and hygiene",
      href: "https://www.rotary.org/en/our-causes/providing-clean-water",
    },
  },
  {
    id: "champions-of-tomorrow",
    chapterId: "lead",
    youtubeId: "CYm7BV64jr4",
    title: "Champions of tomorrow",
    why: "Leadership development in practice, including how members grow into responsibility.",
    reading: {
      label: "Rotary — Rotary Youth Leadership Awards",
      href: "https://www.rotary.org/en/get-involved/youth-programs",
    },
  },
  {
    id: "no-limit",
    chapterId: "begin",
    youtubeId: "6rlo8DWZFrg",
    title: "There’s no limit to what we can do",
    why: "A closing look at what clubs achieve over years, not weeks — worth holding onto before you plan your first project.",
    reading: {
      label: "Rotary — our history",
      href: "https://www.rotary.org/en/who-we-are/our-history",
    },
  },
];

export function videosForChapter(chapterId: string): CourseVideo[] {
  return COURSE_VIDEOS.filter((video) => video.chapterId === chapterId);
}

/**
 * Watch URL with the privacy-enhanced host. Used for the click-to-load player
 * and for anyone who opens the video in a new tab.
 */
export function videoWatchUrl(
  video: Pick<CourseVideo, "youtubeId">,
  autoplay = false,
): string {
  const params = new URLSearchParams({
    rel: "0",
    modestbranding: "1",
    ...(autoplay ? { autoplay: "1" } : {}),
  });
  return `https://www.youtube-nocookie.com/embed/${video.youtubeId}?${params}`;
}

/** Direct link for opening on YouTube itself. */
export function videoExternalUrl(video: CourseVideo): string {
  return `https://www.youtube.com/watch?v=${video.youtubeId}`;
}
