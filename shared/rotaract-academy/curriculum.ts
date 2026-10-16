/**
 * The course as a learner meets it: six chapters, each holding its lessons,
 * its scenario check and the videos chosen for it.
 */

import { CHAPTERS, COURSE_INFO } from "./syllabus.js";
import { SCENARIO_CHECKS, type ScenarioCheck } from "./scenarios.js";
import { COURSE_VIDEOS, type CourseVideo } from "./videos.js";

export interface CurriculumLesson {
  id: string;
  title: string;
  summary: string;
  minutes: number;
}

export interface CurriculumChapter {
  id: string;
  title: string;
  description: string;
  lessons: CurriculumLesson[];
  scenario: ScenarioCheck | null;
  videos: CourseVideo[];
  minutes: number;
}

const LESSON_INDEX = new Map(
  COURSE_INFO.lessons.map((lesson) => [lesson.id, lesson]),
);

export const CURRICULUM: CurriculumChapter[] = CHAPTERS.map((chapter) => {
  const lessons = chapter.lessons
    .map((id) => LESSON_INDEX.get(id))
    .filter((lesson): lesson is (typeof COURSE_INFO.lessons)[number] =>
      Boolean(lesson),
    )
    .map((lesson) => ({ ...lesson }));
  return {
    id: chapter.id,
    title: chapter.title,
    description: chapter.description,
    lessons,
    scenario:
      SCENARIO_CHECKS.find((check) => check.chapterId === chapter.id) ?? null,
    videos: COURSE_VIDEOS.filter((video) => video.chapterId === chapter.id),
    minutes: lessons.reduce((total, lesson) => total + lesson.minutes, 0),
  };
});

export function chapterById(id: string): CurriculumChapter | undefined {
  return CURRICULUM.find((chapter) => chapter.id === id);
}

export function chapterForLesson(lessonId: string): CurriculumChapter | undefined {
  return CURRICULUM.find((chapter) =>
    chapter.lessons.some((lesson) => lesson.id === lessonId),
  );
}

export function lessonPosition(lessonId: string): {
  chapterIndex: number;
  lessonIndex: number;
  lessonNumber: number;
} {
  let lessonNumber = 0;
  for (let chapterIndex = 0; chapterIndex < CURRICULUM.length; chapterIndex++) {
    const chapter = CURRICULUM[chapterIndex];
    for (let lessonIndex = 0; lessonIndex < chapter.lessons.length; lessonIndex++) {
      lessonNumber += 1;
      if (chapter.lessons[lessonIndex].id === lessonId)
        return { chapterIndex, lessonIndex, lessonNumber };
    }
  }
  return { chapterIndex: 0, lessonIndex: 0, lessonNumber: 1 };
}

export const CURRICULUM_MINUTES = COURSE_INFO.minutes;
export const CURRICULUM_LESSON_COUNT = COURSE_INFO.lessons.length;
