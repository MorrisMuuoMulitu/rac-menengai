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
}
export interface OrientationBlock {
  kind: "p" | "list" | "note";
  text?: string;
  items?: string[];
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
