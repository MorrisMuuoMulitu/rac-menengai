import { describe, expect, it } from "vitest";
import { publicCourse } from "../../shared/rotaract-academy/assessment";
import { createCourse } from "../../shared/rotaract-academy/course";
import { FLASHCARDS } from "../../shared/rotaract-academy/flashcards";
import { MENENGAI_LEARNING_PROFILE } from "../club-learning-profile";
import { searchAcademySections, searchGlossary } from "./course-search";

const course = publicCourse(createCourse(MENENGAI_LEARNING_PROFILE));
const chapterNames = new Map(
  course.chapters.map((chapter) => [chapter.id, chapter.title]),
);

describe("academy search", () => {
  it("finds a section and links to that exact reading position", () => {
    const results = searchAcademySections(course, "quorum");
    expect(results.length).toBeGreaterThan(0);
    expect(results[0].href).toMatch(
      /^\/membership\/academy\/[a-z-]+\?section=\d+$/,
    );
    expect(results[0].snippet.toLowerCase()).toContain("quorum");
  });

  it("requires every word in a multi-word search", () => {
    const broad = searchAcademySections(course, "Rotary");
    const precise = searchAcademySections(course, "Rotary Foundation");
    expect(broad.length).toBeGreaterThan(precise.length);
    expect(
      precise.every((result) =>
        `${result.lessonTitle} ${result.sectionTitle} ${result.snippet}`
          .toLowerCase()
          .includes("foundation"),
      ),
    ).toBe(true);
  });

  it("searches the reviewed glossary definitions", () => {
    const matches = searchGlossary(FLASHCARDS, chapterNames, "Four-Way Test");
    expect(matches[0].term).toBe("The Four-Way Test");
    expect(matches[0].chapterTitle).toBe("Inside your club");
  });
});
