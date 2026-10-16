import type { CurriculumChapter } from "./curriculum.js";
import type { ScenarioCheck } from "./scenarios.js";
import type { CourseVideo } from "./videos.js";

export interface ClubLearningProfile {
  id: string;
  name: string;
  shortName: string;
  city: string;
  district: string;
  districtDescription: string;
  districtUrl: string;
  sponsor: string;
  meeting: string;
  venue: string;
  guestPolicy: string;
  joining: string;
  fees: string;
  examples: string;
  evidence: string;
  partnership: string;
  /**
   * One sentence naming who currently leads the club. Kept as prose because
   * the club decides how it wants to be described, and a role list that goes
   * stale in a course is worse than a name the reader can check.
   */
  leadershipLine: string;
  /** Name of the current president, so a club question can ask for it. */
  president: string;
  /** What the published annual subscription and pin cost, as one line. */
  costLine: string;
  /**
   * One recorded piece of the club's work, with the area of focus it
   * addresses. Structured rather than prose, so a question built from it is
   * grammatical rather than a sentence spliced into a question.
   */
  exampleProject: { label: string; cause: string };
}
/**
 * How a protocol statement is grounded.
 *
 * Rotary material mixes global policy, district guidance and club custom.
 * Reading it as one thing is how a club custom ends up quoted as a rule, or a
 * recommendation treated as a requirement.
 */
export type ProtocolLevel =
  | "requirement"
  | "recommendation"
  | "district"
  | "custom"
  | "example";

export const PROTOCOL_LEVEL_LABEL: Record<ProtocolLevel, string> = {
  requirement: "Official requirement",
  recommendation: "Official recommendation",
  district: "District guidance",
  custom: "Club custom",
  example: "Illustrative example",
};

export interface OrientationBlock {
  kind: "p" | "list" | "note" | "tag";
  text?: string;
  items?: string[];
  /** Set on a `tag` block: what kind of statement this is. */
  level?: ProtocolLevel;
  /** Short source label, e.g. "Rotary Code of Policies". */
  source?: string;
}
export interface OrientationModule {
  id: string;
  title: string;
  summary: string;
  minutes: number;
  blocks: OrientationBlock[];
}
export interface OrientationQuestion {
  id: string;
  /** The lesson this question checks. Used to group the assessment. */
  lessonId: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}
export interface FullCourse {
  title: string;
  lead: string;
  version: string;
  requiredBeforeInduction: boolean;
  passMark: number;
  sources: { label: string; href: string }[];
  modules: (OrientationModule & { objectives: string[]; activity: string })[];
  questions: OrientationQuestion[];
  /** The same lessons arranged into six chapters, with their check and videos. */
  chapters: CurriculumChapter[];
  scenarios: ScenarioCheck[];
  videos: CourseVideo[];
}
